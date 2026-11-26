# The voice cast

The user asked for "this character voice" - the voices in the reference video. They cannot be
copied (they are someone else's recordings, and copying a specific person's voice is not
something this engine does). What `story/voices.py` ships instead is a cast **matched to the
measurements** of the reference, so a new story sounds like it belongs to the same channel.

## What was measured

| Measure | Reference |
|---|---|
| pitch families | two clear bands: 85-130 Hz (adult/teen) and 240-290 Hz (child) |
| gap inside a beat | 0.30 s |
| gap between beats | 0.45 s |
| gap at a chapter | 0.60 s |
| integrated loudness | -16.5 LUFS |
| loudness range | 9.8 LU |

## The cast

| Tag | Voice | Speed | Pitch | Who |
|---|---|---|---|---|
| `nar` | `am_michael` | 1.06 | - | the protagonist telling it - low, flat, tired |
| `you` | `am_michael` | 1.10 | - | the same person in the scene, a touch faster |
| `creature` | `am_onyx` | 0.88 | 0.84 | slow, calm, never shouts |
| `ally` | `am_adam` | 1.12 | - | the friend - higher, rushed, panicked |
| `family` | `af_heart` | 1.06 | - | the parent / older sibling |
| `child` | `af_sky` | 1.14 | 1.06 | the young one - the 240-290 Hz band |
| `stranger` | `bm_george` | 1.02 | - | a neighbour, a voice through a door |

`PITCH` shifts the voice **without changing its length**. That is what gives the creature its
wrongness: a voice that is calm, and too low for the body it is coming out of.

The tags on the left are what the script and the **subtitle colours** key off, so keep them
and change only the voice names. `tools/selftest.py` checks that every tag in `voices.py` has
a colour in `palette.ts`.

Before editing, list what is actually installed:

```bash
python3 -c "from kokoro_onnx import Kokoro; \
  print(Kokoro('models/kokoro-v1.0.onnx','models/voices-v1.0.bin').get_voices())"
```

The Reel is always **one** speaker - `tts.py` forces every tag to the narrator. That is an
Instagram/Shorts rule, not a style choice.
