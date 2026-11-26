"""NEW STORY - wipe the work folder's story slots and write clean templates.

WHY THIS EXISTS
The engine used to ship with a complete worked story (Smile Dog) sitting in the live
story/ and src/ slots. Starting a new video meant "replace those files", which is slow,
easy to half-finish, and leaks: a scene, a prop or a label from the previous story stays
behind and ends up on screen. That is exactly how a child in a yellow dress labelled
"WET FOOTPRINTS" turned up in a video about a sealed laboratory.

This makes a new story a CLEAN START, not a find-and-replace. The worked example still
exists, as a reference you read, at engine/examples/smile-dog/.

Usage (from the work folder):
    python3 tools/new_story.py "The Gateway of the Mind"
    python3 tools/new_story.py "The Gateway of the Mind" --force   # overwrite a story in progress

What it does:
  1. refuses to run if story/ already holds a real story, unless --force
  2. writes story/{script_long,script_reel,scenes_long,scenes_reel,voices}.py,
     story/sfx.json, story/upload.json, story/creature.json, story/hindi_long.txt
     as TEMPLATES with the slug filled in and every story line left blank
  3. writes empty src story slots: SetsL.tsx, SetsR.tsx, Card.tsx, camera.ts,
     ThumbsStory.tsx, gal.json, galr.json
  4. deletes stale build output: audio/, renders/, out/, qa/, src/shots_*.json
  5. prints the order of work

Shared kits (Kit, Body, Faces, Cast, CastGen, Room, Post, Player, Thumbs, Annot,
Anatomy, MonsterIntro) are NEVER touched: they belong to the engine, not the story.
"""
import sys, os, re, json, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

STORY_SLOTS = ['story/script_long.py', 'story/script_reel.py', 'story/scenes_long.py',
               'story/scenes_reel.py', 'story/voices.py', 'story/sfx.json',
               'story/upload.json', 'story/creature.json', 'story/hindi_long.txt']
SRC_SLOTS = ['src/SetsL.tsx', 'src/SetsR.tsx', 'src/Card.tsx', 'src/camera.ts',
             'src/ThumbsStory.tsx', 'src/gal.json', 'src/galr.json']
WIPE_DIRS = ['audio', 'renders', 'out', 'qa', 'final']
WIPE_FILES = ['src/shots_long.json', 'src/shots_reel.json']


def slugify(t):
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', t.lower())).strip('-') or 'untitled'


def has_real_story():
    """a story slot counts as 'real' if it has content beyond the template marker"""
    for p in STORY_SLOTS:
        if os.path.exists(p):
            txt = open(p, encoding='utf-8').read()
            if 'SCROLL KAOS TEMPLATE' not in txt and len(txt.strip()) > 400:
                return p
    return None


def T_script_long(title, slug):
    return f'''# {title} - Scroll Kaos own-words retelling. SCROLL KAOS TEMPLATE: fill BEATS, delete this line.
# First person or third, your choice. Text after a [tag] inside double quotes is a character voice
# (LONG VIDEO ONLY); every tag needs an entry in story/voices.py VOICES. Everything else = narrator.
#
# SHAPE (channel policy):
#   teaser  ~30 s, the first two sentences must create fear or a question
#   the cut line "Let us go back to the beginning." ends the teaser
#   the story in order, in your own words
#   ONE credit sentence after 0:45
#   the closing question as the very LAST line
BEATS = [
# ---- TEASER (about 30 s)
("Intro", ""),
(None, ""),
(None, "Let us go back to the beginning."),
# ---- 1
("", ""),
(None, ""),
# ---- CREDIT (after 0:45, exactly one sentence)
(None, "inspired by a story told online"),
# ---- CLOSING QUESTION (must be the last line, same words used in 4 places)
(None, ""),
]
TEASER_LAST_BEAT = 2
END_SCREEN_S = 20.0
'''


def T_script_reel(title, slug):
    return f'''# {title} - REEL retelling, 2:40-2:55, ONE speaker (the narrator). SCROLL KAOS TEMPLATE.
# No [tags] here: tts.py forces a single voice for the Reel.
# WORD_BEATS lists the beats that get one-word-at-a-time captions (the monster-introduction block).
BEATS = [
("Intro", ""),
(None, ""),
]
TEASER_LAST_BEAT = 0
WORD_BEATS = []
'''


def T_scenes(title, name):
    return f'''# Scene table for the {"LONG video (16:9)" if name == "long" else "REEL (9:16)"}: one list per beat,
# same order as script_{name}.BEATS. SCROLL KAOS TEMPLATE: fill SC, delete this line.
#
# THE ONE-USE LAW: every scene entry must be a DIFFERENT picture. A beat that will get 4 shots
# needs 4 entries. Never let the builder recycle one - it will stop with an error if you do.
# Keys: 'fr' framing (wide|waist|bust|close|detail), 'fc' close-up focus [x, y, zoom],
#       'last' always the final shot of its beat, 'an' annotation list (see references).
def S(st, **v): return (st, v)
SC = [
 # 0
 [],
]
'''


def T_voices(title):
    return f'''# Character voices for the LONG video only (the Reel is always the narrator alone).
# SCROLL KAOS TEMPLATE. List the installed voices first:
#   python3 -c "from kokoro_onnx import Kokoro; print(Kokoro('models/kokoro-v1.0.onnx','models/voices-v1.0.bin').get_voices())"
VOICES = {{'nar': ('af_nicole', 1.1)}}
PITCH = {{}}   # e.g. {{'creature': 0.8}} - pitched down, same length
SAY = []      # e.g. [('smile.jpg', 'smile dot J P G')] - how tricky words are spoken
'''


def T_creature(title, slug):
    return json.dumps({
        "_note": "SCROLL KAOS TEMPLATE. Delete this key once filled. If the story has NO monster "
                 "or antagonist, delete this whole file. ONE-CREATURE LAW: one story, one design, "
                 "every shot. 'variants' is only the same character in another STATE.",
        "id": "", "variants": [], "min_shots": 6, "angles": 2,
        "height_m": 0, "note": "height, eyes, limbs, skin, clothes, how it moves - from the story words only"
    }, indent=1)


def T_upload(title, slug):
    return json.dumps({
        "_note": "SCROLL KAOS TEMPLATE. Fill this, then run tools/make_upload_md.py <Prefix>. "
                 "Never write the .md by hand. See references/upload-md-guide.md.",
        "title": title, "slug": slug,
        "closing_question": "",
        "credit": {"title": "", "site": "", "verified": False},
        "flags": []
    }, indent=1)


TEMPLATES = {
    'story/script_long.py': T_script_long,
    'story/script_reel.py': T_script_reel,
    'story/voices.py': lambda t, s: T_voices(t),
    'story/creature.json': T_creature,
    'story/upload.json': T_upload,
}

_SETS_STUB = '''import React from 'react';
// SCROLL KAOS TEMPLATE - {which} sets ({w}x{h}). Replace every set with this story's own places.
// A set is React.FC<{{ f: number; v: any }}>: f = animation frame (already x3), v = the variant
// dict from the scene table. Draw past the edges (the camera zooms). End each set with a soft
// dark overlay. Read engine/examples/smile-dog/src/{which}.tsx for a full worked example.
//
// REQUIRED card sets: 'end' (long only), 'qcard' / 'rqcard' (the credit + closing question).
const R: React.FC<{{ c: string; op?: number }}> = ({{ c, op = 1 }}) => (
  <rect x={{-600}} y={{-600}} width={{{w} + 1200}} height={{{h} + 1200}} fill={{c}} opacity={{op}} />
);
const placeholder = (name: string): React.FC<{{ f: number; v: any }}> => ({{ f, v }}) => (
  <g>
    <R c="#12141c" />
    <text x={{{w} / 2}} y={{{h} / 2}} textAnchor="middle" fontFamily="Lora, Georgia, serif"
      fontSize={{{fs}}} fill="#6a6croak" opacity={{0.5}}>{{name}}</text>
    <R c="#05030a" op={{v?.dark ?? 0.2}} />
  </g>
);
export const SETS: Record<string, React.FC<{{ f: number; v: any }}>> = {{
  {cards}
}};
'''


def T_sets(which, w, h):
    cards = ("end: placeholder('end screen'),\n  qcard: placeholder('credit card'),"
             if which == 'SetsL' else "rqcard: placeholder('credit + question'),")
    # the literal is written with doubled braces for .format; fix the one colour typo safely
    return _SETS_STUB.format(which=which, w=w, h=h, fs=int(min(w, h) * 0.05), cards=cards).replace('#6a6croak', '#6a6c78')


_CARD_STUB = '''import React from 'react';
import { AbsoluteFill } from 'remotion';
// SCROLL KAOS TEMPLATE - the chapter title card. Give it an ornament of its own for this story
// (past kits used: a floppy disk, an LED clock, a clipboard, notebook paper, a lace scallop).
// Keep the Lora font. Show nothing when t < 0 or t > 30.
export const ChapterCard: React.FC<{ W: number; H: number; t: number; n: number; title: string; vertical?: boolean }> = ({ W, H, t, n, title }) => {
  if (t < 0 || t > 30) return null;
  const a = Math.max(0, Math.min(Math.min(1, t / 3), t > 26 ? (30 - t) / 4 : 1));
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * a})`, alignItems: 'center', justifyContent: 'center', opacity: a }}>
      <div style={{ fontFamily: 'Lora', fontWeight: 700, fontSize: H * 0.05, color: '#f6efe0', textAlign: 'center' }}>
        <div style={{ fontSize: H * 0.026, letterSpacing: H * 0.006, opacity: 0.8 }}>CHAPTER {n}</div>
        <div style={{ marginTop: H * 0.015 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
'''

_THUMBS_STUB = '''import React from 'react';
// SCROLL KAOS TEMPLATE - four thumbnails. A: main. B: close crop + 2-word title. C: the key
// object big and glowing. R: vertical. Use HorrorBack / Reach / Title from Thumbs.tsx and this
// story's own creature or ghost. Read examples/smile-dog/src/ThumbsStory.tsx.
const Plate: React.FC<{ W: number; H: number; t: string }> = ({ W, H, t }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    <rect x={0} y={0} width={W} height={H} fill="#12141c" />
    <text x={W / 2} y={H / 2} textAnchor="middle" fontFamily="Lora, Georgia, serif"
      fontSize={H * 0.08} fontWeight={700} fill="#6a6c78">{t}</text>
  </svg>
);
export const ThumbA: React.FC = () => <Plate W={1280} H={720} t="THUMB A" />;
export const ThumbB: React.FC = () => <Plate W={1280} H={720} t="THUMB B" />;
export const ThumbC: React.FC = () => <Plate W={1280} H={720} t="THUMB C" />;
export const ThumbR: React.FC = () => <Plate W={1080} H={1920} t="REEL THUMB" />;
'''

SRC_STUB = {
    # the type annotation matters: without it TS infers the literal 'push' and every other
    # comparison in Player.tsx becomes a "no overlap" error
    'src/camera.ts': "// SCROLL KAOS TEMPLATE: pick a camera habit different from the last 3 videos.\n"
                     "export type CameraMove = 'push' | 'pull' | 'truck' | 'rise' | 'still';\n"
                     "export const CAMERA: CameraMove = 'push';\n",
    'src/gal.json': '[]\n',
    'src/galr.json': '[]\n',
    'src/Card.tsx': _CARD_STUB,
    'src/ThumbsStory.tsx': _THUMBS_STUB,
}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    force = '--force' in sys.argv
    if not args:
        sys.exit('usage: python3 tools/new_story.py "The Story Title" [--force]')
    title = args[0].strip()
    slug = slugify(title)

    busy = has_real_story()
    if busy and not force:
        sys.exit(f'refusing to wipe: {busy} already holds a real story.\n'
                 f'  Finish or archive it first, or re-run with --force to start over.')

    os.makedirs('story', exist_ok=True)
    os.makedirs('src', exist_ok=True)
    wrote = []
    for path, fn in TEMPLATES.items():
        open(path, 'w', encoding='utf-8').write(fn(title, slug))
        wrote.append(path)
    for name in ('long', 'reel'):
        p = f'story/scenes_{name}.py'
        open(p, 'w', encoding='utf-8').write(T_scenes(title, name))
        wrote.append(p)
    open('story/sfx.json', 'w', encoding='utf-8').write('[]\n'); wrote.append('story/sfx.json')
    open('story/hindi_long.txt', 'w', encoding='utf-8').write(''); wrote.append('story/hindi_long.txt')
    # keep the previous story's sets to read (lint_story.py uses them to spot leaks), but
    # ALWAYS write a working stub in their place: a scaffold that leaves the project unable
    # to build is worse than none.
    for p in ('src/SetsL.tsx', 'src/SetsR.tsx'):
        if os.path.exists(p):
            os.replace(p, p + '.prev')
            wrote.append(p + '.prev (kept for the leak check)')
    open('src/SetsL.tsx', 'w', encoding='utf-8').write(T_sets('SetsL', 1920, 1080)); wrote.append('src/SetsL.tsx')
    open('src/SetsR.tsx', 'w', encoding='utf-8').write(T_sets('SetsR', 1080, 1920)); wrote.append('src/SetsR.tsx')
    for p, body in SRC_STUB.items():
        open(p, 'w', encoding='utf-8').write(body); wrote.append(p)

    removed = []
    for d in WIPE_DIRS:
        if os.path.isdir(d): shutil.rmtree(d); removed.append(d + '/')
    for f in WIPE_FILES:
        if os.path.exists(f): os.remove(f); removed.append(f)
    # Root.tsx imports these, so the project cannot compile without them. Write a one-shot
    # placeholder; tools/build_shots.py overwrites both once the narration exists.
    def _stub_shots(st, w, h):
        return json.dumps({"frames": 30, "end_s": None, "chapters": [], "chapter_times": [],
                           "shots": [{"b": 0, "s": 0, "e": 30, "set": st, "v": {}, "close": False,
                                      "z": 1.6, "fx": w / 2, "fy": h / 2, "dir": 1, "off": 0}]})
    open('src/shots_long.json', 'w', encoding='utf-8').write(_stub_shots('qcard', 1920, 1080))
    open('src/shots_reel.json', 'w', encoding='utf-8').write(_stub_shots('rqcard', 1080, 1920))
    wrote += ['src/shots_long.json (placeholder)', 'src/shots_reel.json (placeholder)']

    print(f'new story: "{title}"  (slug: {slug})')
    print('  wrote templates:'); [print('    ' + w) for w in wrote]
    if removed:
        print('  cleared stale build output:'); [print('    ' + r) for r in removed]
    print('''
  The shared kits were NOT touched - they belong to the engine, not the story.
  A worked example to read (never to copy wholesale): examples/smile-dog/

  Order of work:
    1. story/bible.md, story/creature.json, story/rooms.md
    2. story/script_long.py and script_reel.py   (then: python3 tools/tts.py long|reel)
    3. ENVIRONMENT FIRST: pick kits + options, then
       node tools/preview/shot_preview.mjs qa/env_shots.json qa/preview   - and LOOK
    4. THEN SCENES: story/scenes_long.py and scenes_reel.py with S() from scenes_dsl
       (then: python3 tools/build_shots.py long|reel  - non-zero on a repeat)
    5. THEN CHARACTERS: add actors to the scenes, preview again and LOOK
    6. src/story.json - every word that appears on a card
    7. python3 tools/selftest.py and tools/checkpoint.py - both must pass before any render''')
    v05_slots(title, slug)
    return 0


# --- v0.5 additions ---
# The v0.5 engine has slots v0.4 did not: src/story.json (every word that appears on a card),
# story/creature.json (the ONE antagonist spec), and scene tables written with the S() DSL.
# They are written here so a new story starts clean instead of inheriting the last one.
import json as _json
import os as _os
import shutil as _shutil


def v05_slots(title: str, slug: str) -> None:
    here = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))

    # 1. the card copy. Every string below appears ON SCREEN.
    words = title.strip().upper().split()
    accent = words[-1] if len(words) > 1 else title.strip().upper()
    head = " ".join(words[:-1]) if len(words) > 1 else ""
    story = {
        "title": head or accent, "accent": accent if head else "",
        "tagline": "Where are *YOU* going?",
        "stakes1": "NAME, AGE.", "stakes2": "what they did not do.",
        "closer": "nobody's dead tonight.",
        "cta": "Would YOU have done it? Comment what you'd do \U0001F447",
        "teaser": "a monster, a block, a choice you can't take back... tell us \U0001F447",
        "parts": [
            {"n": n, "aEmoji": "\U0001FA9F", "aText": "OPTION A", "aSub": "what it costs",
             "bEmoji": "\U0001F6AA", "bText": "OPTION B", "bSub": "what it costs",
             "chosen": "A", "nextLabel": ("PART 4 - FINALE" if n == 3 else "PART %d" % (n + 1))}
            for n in (1, 2, 3)
        ],
        "recap": [{"part": n, "emoji": "\U0001FA9F", "text": "OPTION A"} for n in (1, 2, 3)],
        "recapShot": [0, 0, 0],
        "epilogue": [
            {"name": "ANTAGONIST", "villain": True, "line": "three to six words."},
            {"name": "PROTAGONIST", "you": True, "line": "three to six words."},
        ],
        "epilogueShot": [0, 0], "brandShot": 0,
    }
    with open("src/story.json", "w", encoding="utf-8") as f:
        _json.dump(story, f, indent=2, ensure_ascii=False)

    # 2. the ONE antagonist spec. Fill it from the story's own words, then never re-type it.
    creature = {
        "_comment": "THE ONE-CREATURE LAW. Written once, passed to buildCreature(), never "
                    "re-typed inside a set. Only `state` may differ between shots.",
        "scale": 1.52, "armLong": 1.5,
        "mask": "#f2ece2", "cloth": "#413f4a", "clothDark": "#2b2932",
        "hands": "#efe2d1", "hair": "#4a3b30", "hairLen": 1.5,
        "grin": 0.85, "stitches": 7, "tears": True, "pendant": "#e8c25c",
    }
    with open("story/creature.json", "w", encoding="utf-8") as f:
        _json.dump(creature, f, indent=2)

    # 3. clean scene tables using the DSL, with a worked first shot to copy the shape from.
    tpl = (
        "from scenes_dsl import S\n"
        "# %s - scene table. ONE LINE PER PICTURE.\n"
        "# If a sentence needs four pictures, write four scenes. A gap filled by the tool is\n"
        "# a duplicate, and tools/build_shots.py will refuse the build.\n"
        "SCENES = [\n"
        "    S('p1_01', kit='ApartmentInterior', opts=dict(room='bedroom', lightOn=True),\n"
        "      anchor=dict(pos=[0.6, 1.55, 1.5], yaw=-10), preset='idle_breath',\n"
        "      framing='full', secs=2.4, hands='hold_phone'),\n"
        "]\n"
        "CHAPTERS = []\n"
        "PARTS = []\n"
    ) % title
    for name in ("scenes_long.py", "scenes_reel.py"):
        with open(_os.path.join("story", name), "w", encoding="utf-8") as f:
            f.write(tpl)

    # 4. empty caption files so a first render never crashes on a missing import
    for name in ("cues_long.json", "cues_reel.json"):
        with open(_os.path.join("src", name), "w", encoding="utf-8") as f:
            f.write("[]\n")

    # 5. the scene DSL must sit next to the scene tables so `import scenes_dsl` resolves
    _shutil.copy(_os.path.join(here, "tools", "scenes_dsl.py"), _os.path.join("story", "scenes_dsl.py"))
    print("v0.5 slots written: src/story.json, story/creature.json, story/scenes_*.py")


if __name__ == '__main__':
    sys.exit(main())
