# Voice map. IMPORTANT: `bash <engine>/setup.sh <work-folder>` prints the installed Kokoro
# voice list — verify every id below against that printed list before running tts.py, and
# swap any id that is not installed for the closest installed male voice.
VOICES = {
    'nar':    ('am_michael', 1.00),  # narrator (Mitch, telling his own story in third person style narration)
    'edwin':  ('am_eric',    0.96),  # Edwin, Mitch's brother
    'doctor': ('am_adam',    1.05),  # the hospital doctor
}
# Reel uses the narrator voice ONLY (channel rule) — tts.py enforces this; do not add tags
# to story/script_reel.py.
