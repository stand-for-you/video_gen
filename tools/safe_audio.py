"""Final audio for the MP4: AAC 192k with a safety limiter so the encoded file never clips.
Why: AAC encoding can push a few sharp speech peaks ABOVE 0 dBFS even when final.wav is at -1.5 dBTP
(found in the Smile Dog QA: +2.4 / +3.5 dBFS). This step limits, re-measures and nudges the gain until
loudness is on target (long -16 LUFS, reel -14 LUFS, within 0.2 LU) and the decoded peak is at or below -1 dBFS.
Usage (work folder): python3 tools/safe_audio.py long|reel   ->  audio/<name>/final_safe.m4a"""
import sys, json, subprocess
import numpy as np
NAME = sys.argv[1]; TARGET = -16.0 if NAME == 'long' else -14.0
src, dst = f'audio/{NAME}/final.wav', f'audio/{NAME}/final_safe.m4a'
def run(a): return subprocess.run(a, capture_output=True, text=True)
def measure(path):
    r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
    lufs = float(r[r.rindex('I:') + 2:].split('LUFS')[0])
    return lufs
def peak_db(path):
    raw = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', '48000', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.float32); return 20 * np.log10(max(1e-9, float(np.abs(a).max())))
gain, limit_db = 0.0, -2.8
for it in range(8):
    lim = 10 ** (limit_db / 20)
    af = f'volume={gain:.2f}dB,lowpass=f=15500,alimiter=limit={lim:.3f}:attack=2:release=60:level=false'
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-af', af, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', dst])
    lufs, pk = measure(dst), peak_db(dst)
    print(f'try {it}: gain {gain:+.2f} dB, limit {limit_db:.1f} dB -> {lufs:.2f} LUFS, peak {pk:.2f} dBFS', flush=True)
    if pk > -1.0: limit_db -= 0.5; continue
    if abs(lufs - TARGET) <= 0.2: print('OK', dst); break
    gain += TARGET - lufs
else:
    sys.exit(f'safe_audio: could not reach {TARGET} LUFS with peak <= -1 dBFS; check the mix')
