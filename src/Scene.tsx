import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { KITS } from './kits';
import { rigAt } from './three/rig';
import { setOutlineResolution } from './three/toon';
import { Post3D } from './three/Post3D';
import { buildCast } from './cast/Cast3D';
import { buildCreature } from './cast/Creature3D';
import { buildHands } from './cast/FPSHands';
import { SubtitleLayer, type Cue } from './ui/Subtitles';
import { ComicSFXLayer } from './ui/ComicSFX';
import type { Shot, ShotFile } from './Shot';

/**
 * Scroll Kaos v0.5 - one shot, drawn.
 *
 * Determinism: the whole scene graph is memoised on the shot id, and the camera is a pure
 * function of (frame - shot.s). Nothing reads a clock, nothing holds state between frames.
 * That is what lets ci/render_part.sh render frames 0-900 and 900-1800 in two processes and
 * get a seam-free video.
 */

const SceneBody: React.FC<{ sh: Shot; local: number; fps: number; W: number; H: number }> = ({ sh, local, fps, W, H }) => {
  const seed = useMemo(() => {
    let h = 0;
    for (let i = 0; i < sh.id.length; i++) h = (h * 31 + sh.id.charCodeAt(i)) >>> 0;
    return h % 9973;
  }, [sh.id]);

  const world = useMemo(() => {
    setOutlineResolution(H);
    const g = new THREE.Group();
    const build = KITS[sh.kit];
    g.add(build(sh.kitOpts as never));
    for (const a of sh.actors) {
      const node = a.kind === 'creature' ? buildCreature(a as never) : buildCast(a);
      g.add(node);
    }
    return g;
  }, [sh.id, H]);

  const handRig = useMemo(() => (sh.hands ? buildHands({ pose: sh.hands }) : null), [sh.id, sh.hands]);

  const t = local / fps;
  const dur = Math.max(1, sh.e - sh.s) / fps;
  const st = rigAt(sh.preset, t, dur, seed, sh.anchor);

  // The camera is a plain three object we own, not a declarative node: r3f's
  // <perspectiveCamera makeDefault> belongs to drei, and we want the transform written
  // straight from rigAt on every frame with no reconciler in between. The hand rig is
  // parented to it, which is what keeps the hands locked to the lens.
  const { set, size } = useThree();
  const cam = useMemo(() => {
    const c = new THREE.PerspectiveCamera(80, size.width / size.height, 0.05, 400);
    c.rotation.order = 'YXZ';
    return c;
  }, [size.width, size.height]);

  React.useLayoutEffect(() => { set({ camera: cam }); }, [cam, set]);
  React.useLayoutEffect(() => {
    if (!handRig) return;
    cam.add(handRig);
    return () => { cam.remove(handRig); };
  }, [cam, handRig]);

  cam.position.set(st.pos[0], st.pos[1], st.pos[2]);
  cam.rotation.set(st.rot[0], st.rot[1], st.rot[2]);
  cam.fov = st.fov;
  cam.aspect = size.width / size.height;
  cam.updateProjectionMatrix();

  return (
    <>
      <primitive object={world} />
      <primitive object={cam} />
    </>
  );
};

export const SceneShot: React.FC<{ sh: Shot; W: number; H: number; cues?: Cue[]; vertical?: boolean }> = ({ sh, W, H, cues, vertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - sh.s;
  return (
    <AbsoluteFill>
      <Post3D
        W={W}
        H={H}
        boil={sh.boil ?? 2.2}
        glitch={sh.glitch ?? 0}
        wash={sh.wash}
        washAmount={sh.washAmount ?? 0}
      >
        <ThreeCanvas width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
          <SceneBody sh={sh} local={local} fps={fps} W={W} H={H} />
        </ThreeCanvas>
      </Post3D>
      <ComicSFXLayer items={sh.sfx?.map((x) => ({ ...x, at: sh.s + x.at }))} W={W} H={H} />
      {cues && <SubtitleLayer cues={cues} W={W} H={H} vertical={vertical} />}
    </AbsoluteFill>
  );
};

/** binary search - a 10-minute video has hundreds of shots and this runs every frame */
export const findShot = (shots: Shot[], fr: number): Shot => {
  let lo = 0, hi = shots.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (shots[m].s <= fr) lo = m; else hi = m - 1; }
  return shots[lo];
};

/** The story body. UI cards are layered over it by Root.tsx, not mixed in here. */
export const makeStory = (data: ShotFile, cues: Cue[], vertical = false) => {
  const C: React.FC = () => {
    const frame = useCurrentFrame();
    const sh = findShot(data.shots, frame);
    return <SceneShot sh={sh} W={data.w} H={data.h} cues={cues} vertical={vertical} />;
  };
  return C;
};

/** One still per shot, taken at its midpoint - this is the contact sheet for stage 6. */
export const makeSheet = (data: ShotFile) => {
  const C: React.FC = () => {
    const i = useCurrentFrame();
    const sh = data.shots[Math.min(i, data.shots.length - 1)];
    const mid = Math.floor((sh.s + sh.e) / 2);
    return (
      <AbsoluteFill>
        <SceneShot sh={{ ...sh, s: mid - Math.floor((sh.e - sh.s) / 2) }} W={data.w} H={data.h} />
      </AbsoluteFill>
    );
  };
  return C;
};
