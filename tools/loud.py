"""Two-pass EBU R128 loudness normalisation. Usage: python3 loud.py long|reel  (long -16 LUFS, reel -14 LUFS, true peak -1.5 dBTP)."""
import sys, json, subprocess
NAME = sys.argv[1]; I = -16 if NAME == 'long' else -14
src, dst = f'audio/{NAME}/mix.wav', f'audio/{NAME}/final.wav'
f1 = f'loudnorm=I={I}:TP=-1.5:LRA=11:print_format=json'
r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', src, '-af', f1, '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
f2 = (f"loudnorm=I={I}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json")
r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-y', '-i', src, '-af', f2, '-ar', '48000', '-c:a', 'pcm_s16le', dst], capture_output=True, text=True).stderr
o = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
print(NAME, 'in', m['input_i'], 'LUFS -> out', o['output_i'], 'LUFS, TP', o['output_tp'], o['normalization_type'])
