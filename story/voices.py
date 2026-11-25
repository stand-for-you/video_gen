# Long video: narrator (Ethan) plus two character voices for quoted lines, Jack and Elisa.
# The Reel is ALWAYS the narrator only (tts.py forces it). Voice names are checked against the
# installed Kokoro list at TTS time; if one is missing, tts.py asserts and we swap it.
VOICES = {
    'nar': ('am_michael', 1.06),   # Ethan, the narrator: clear, steady, not sing-song
    'jack': ('am_eric', 0.98),     # Jack: younger, lower, shaken
    'elisa': ('af_sarah', 0.98),   # Elisa: calm, cold, sweet
}
PITCH = {}
SAY = []
