# The plugin's character style — what it is, and what it is not

## The style the plugin uses

**Stylized toon 3D.** Real three.js geometry, flat 2–3 step toon shading, a pixel-constant
ink outline on every solid body, and a seeded frame-wide warp that makes that outline wobble
like a drawn line.

| Property | Value |
|---|---|
| geometry | real 3D primitives — capsules, boxes, spheres, cones |
| shading | `MeshToonMaterial`, 2–3 steps, no specular, no subsurface |
| outline | ink shell offset in view space by a fixed pixel width |
| line feel | whole-frame turbulence warp, stepped on twos (15 drawn frames/sec) |
| head : body | about **1 : 4.2** — deliberately large heads, as in the references |
| eyes | large black ovals with one white specular dot |
| faces | flat shapes sitting on the head, not modelled features |
| textures | none — flat colour only |
| light | 3-light night rig: cool ambient + warm key + cool rim, plus a hemisphere so nothing is unreadably black |

This style was chosen because it is the one that **ships a finished 8-minute video**. Every
frame is a pure function of `(frame, seed)`, so a render can be split into chunks across
machines and still match frame for frame; and a whole character is a few hundred triangles,
so a 15,000-frame render finishes.

## Where it differs from the reference images you sent

Your reference sheets are **AI-generated cinematic stills** — Pixar-grade rendering with
subsurface skin, strand-level hair, cloth simulation and volumetric fog. They are beautiful,
and they are **pictures**, not a pipeline. Nothing generates them frame-by-frame with a
consistent character across 15,000 frames, which is the actual job here.

| Your references have | This engine has | Could it be added? |
|---|---|---|
| subsurface-scattered skin | flat toon fill | No — not in a real-time toon renderer |
| strand hair and cloth sim | sculpted hair shapes, rigid garments | No |
| detailed skin / fabric texture | flat colour | **Partly** — texture maps are possible, at a render-time cost |
| volumetric fog, god rays | flat fog planes and glow cards | **Partly** — a cheap depth fog is realistic to add |
| photoreal eyes | stylised ovals with a specular dot | No, and it would break the style |

**What this engine does match from your brief, and already does:** the cast itself, the big-head
proportions, the large expressive eyes, the six expressions, the four-view turnarounds, the
dark blue night palette with warm practical light, and — most importantly — the locked,
reusable character database.

## Three honest options

1. **Keep the toon style.** It ships, it animates, it stays consistent, and it is already
   built and rendering. *My recommendation.*
2. **Raise fidelity inside the toon style.** Add texture maps, a soft depth fog, and a
   rim-light pass. Gets perhaps a third of the way to the references, costs render time,
   keeps every guarantee intact. A realistic next step if you want more polish.
3. **Change pipeline entirely** — Blender or Unreal with sculpted, textured, groomed
   characters. That reaches the reference look, and it is a different project: this plugin
   does not drive those tools, render times go from minutes to hours per shot, and the
   consistency guarantees would have to be rebuilt from scratch.

What is **not** an option is claiming option 1 looks like the references. It does not, and it
is better to say so than to ship a mismatch.

## The rule the references got exactly right

> *"Never redesign an established character when generating a new scene."*

That is now enforced, not requested. Every character lives once in `engine/story/cast.json`
with all ten required fields. A scene names a character by key and reads that entry; it never
re-types a look. Regenerate the sheets after any change with:

```bash
node tools/charsheet.mjs            # every character
node tools/charsheet.mjs boy entity # just these
```

Because the sheets are generated **from the same definitions the scenes read**, a sheet can
never drift from what actually renders — which is the failure mode a hand-made reference
sheet always eventually hits.
