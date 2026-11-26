# I Know You're Awake - voices for the LONG video.
# The Reel is always ONE speaker: tools/tts.py forces every tag to 'nar'.
#
# Cast for this story:
#   nar  - the boy, telling it afterwards. Flat, tired, too calm for what he is describing.
#   you  - the same boy inside the scene (the two whispered lines at 5:30 a.m.).
#   family - the mother and the father, in the one bedtime beat before any of it happens.
#            They are the only character voices in the video, and they are heard ALIVE
#            before the camera ever sees them dead. That is the point of keeping them.
# The entity has NO voice anywhere: the story gives it no mouth, so it is breath, joints and
# weight on a floorboard in the sound mix only (story/sfx.json), never a line.
#
# List the voices installed on this machine before changing these:
#   python3 -c "from kokoro_onnx import Kokoro; \
#     print(Kokoro('models/kokoro-v1.0.onnx','models/voices-v1.0.bin').get_voices())"

VOICES = {
    # tag        kokoro voice   speed   who this is
    'nar':      ('am_michael',  1.04),  # the boy telling it - low, flat, worn out
    'you':      ('am_michael',  1.10),  # the same boy in the room, a touch faster
    'creature': ('am_onyx',     0.88),  # NOT USED in this story - kept so the cast is intact
    'ally':     ('am_adam',     1.12),  # unused
    'family':   ('af_heart',    1.02),  # the mother
    'child':    ('af_sky',      1.14),  # unused
    'stranger': ('bm_george',   0.98),  # the father (a lower, older male than the narrator)
}

# Pitch change WITHOUT changing the length.
PITCH = {
    'stranger': 0.94,   # drops the father under the narrator so the two men never blur
}

# How tricky words are spoken. The text ON SCREEN never changes.
SAY = [
    ('5:30', 'five thirty'),
    ('2:20', 'twenty past two'),
    ('2:40', 'twenty to three'),
    ('3:00', 'three'),
]

# Gaps in seconds. This story is a held breath: keep them tight.
GAP, BEAT_GAP, CHAP_GAP = 0.30, 0.45, 0.60

# Subtitle colour per tag. Must match SPEAKER in src/three/palette.ts.
ROLE = {
    'nar': 'you', 'you': 'you', 'creature': 'creature',
    'ally': 'ally', 'family': 'family', 'child': 'child', 'stranger': 'stranger',
}

# How a speaker is named on the subtitle badge, and the lowercase state in brackets after it.
# tools/cues.py reads these; src/ui/Subtitles.tsx draws them.
SPEAKER_NAMES = {
    'nar': 'THE BOY',
    'you': 'THE BOY',
    'family': 'MOTHER',
    'stranger': 'FATHER',
    'creature': 'THE THING',
    'ally': 'THE BOY',
    'child': 'THE BOY',
}
SPEAKER_STATES = {
    'you': '(not moving)',
    'family': '(at the door)',
    'stranger': '(down the hall)',
}
