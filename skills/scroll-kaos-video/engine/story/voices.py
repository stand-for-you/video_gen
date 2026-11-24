# Character voices for the LONG video only (the Reel is always the narrator alone).
# Check the installed Kokoro voices first: python3 -c "from kokoro_onnx import Kokoro; print(Kokoro('models/kokoro-v1.0.onnx','models/voices-v1.0.bin').get_voices())"
VOICES = {'nar': ('af_nicole', 1.1), 'mary': ('af_sarah', 1.0), 'terence': ('am_fenrir', 0.95), 'dog': ('am_onyx', 0.92), 'zahir': ('am_puck', 1.0)}
PITCH = {'dog': 0.8}  # creature voice: pitched down (same length), still clear
SAY = [('smile.jpg', 'smile dot J P G'), ('elzahir82', 'el zahir eighty-two'), ('Creepypasta.com', 'Creepypasta dot com')]
