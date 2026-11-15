import os
import json
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
import subprocess

reel_sentences = [
    {"en": "Every spring, I make my middle school history students record an interview with an older relative."},
    {"en": "I expected nothing different from Olivia, a quiet girl who sat in the back row."},
    {"en": "She handed me two unmarked discs."},
    {"en": "Late that night in my study, I put the first disc into the player."},
    {"en": "On screen, Olivia sat inside a cluttered living room across from her Great Uncle Stephen."},
    {"en": "The old veteran smoked in silence, clutching a stack of yellowed papers."},
    {"en": "When Olivia asked about his worst memory from the army, Stephen set his cigarette down."},
    {"en": "He had been deployed to the Balkans after a brutal conflict."},
    {"en": "His unit was sent to clear an old elementary school that had been obliterated years before."},
    {"en": "The roof had collapsed, rain poured through cracked concrete, and no child had stepped inside for seasons."},
    {"en": "In the flooded basement, Stephen discovered a handwritten letter left beside a heavy transistor radio."},
    {"en": "It was written by Stanislav, the school's former janitor."},
    {"en": "Stanislav wrote that after an illness took his wife and child, his radio was the only sound that kept him alive."},
    {"en": "Grief had shattered his mind."},
    {"en": "He returned to the destroyed schoolhouse every morning with his mop and broom."},
    {"en": "He wrote that the teachers smiled at him in the halls, and the children enjoyed the low music from his radio."},
    {"en": "He swept around broken desks, carefully polishing the rubble and moving aside whatever lay in the shadows."},
    {"en": "Until one morning, the radio went dead."},
    {"en": "Unable to bear the suffocating silence, Stanislav wedged a chair beneath the basement door and took his own life."},
    {"en": "His note had one dying plea: Please fix my radio."},
    {"en": "On the second disc, Olivia asked her uncle the question that still haunts me."},
    {"en": "How could the janitor die in an empty school destroyed years earlier?"},
    {"en": "Stephen answered with a trembling voice."},
    {"en": "The letter was dated only two weeks before their arrival."},
    {"en": "Stanislav had spent two years sweeping a tomb, smiling at figures frozen in the dark, thinking the silence was alive."},
    {"en": "And when Stephen finally forced the basement door open, the janitor was gone."},
    {"en": "Sitting in the pool of stagnant water was the radio."},
    {"en": "And in the dead silence, it was softly humming."}
]

print("Synthesizing tightened Reel narration...")
kokoro = Kokoro('models/kokoro-v1.0.onnx', 'models/voices-v1.0.bin')

sample_rate = 24000
gap_duration = 0.30
gap_samples = int(sample_rate * gap_duration)
silence_gap = np.zeros(gap_samples, dtype=np.float32)

all_audio = []
reel_cues = []
current_sample_idx = 0

for idx, s in enumerate(reel_sentences):
    text = s["en"]
    samples, sr = kokoro.create(text, voice='af_nicole', speed=1.1)
    samples = np.array(samples, dtype=np.float32)
    
    start_time = current_sample_idx / sample_rate
    end_time = (current_sample_idx + len(samples)) / sample_rate
    
    reel_cues.append({
        "index": idx + 1,
        "start_time": start_time,
        "end_time": end_time,
        "en": text
    })
    
    all_audio.append(samples)
    current_sample_idx += len(samples)
    if idx < len(reel_sentences) - 1:
        all_audio.append(silence_gap)
        current_sample_idx += gap_samples

full_audio = np.concatenate(all_audio)
total_dur = len(full_audio) / sample_rate
print(f"Reel audio total duration: {total_dur:.2f} seconds ({total_dur/60:.2f} minutes) - PERFECT for 2:40-2:55 target!")

sf.write('audio/reel_voice_raw.wav', full_audio, sample_rate)

with open('audio/reel_cues.json', 'w', encoding='utf-8') as f:
    json.dump({"total_duration": total_dur, "sample_rate": sample_rate, "cues": reel_cues}, f, indent=2)

# Generate ducked & normalized audio for Reel
from mix_audio import generate_dark_drone
music = generate_dark_drone(total_dur, sample_rate)
voice_rms = np.sqrt(np.mean(full_audio**2))
target_music_rms = voice_rms * (10 ** (-25 / 20))
music_rms = np.sqrt(np.mean(music**2))
if music_rms > 0:
    music = music * (target_music_rms / music_rms)

speech_mask = np.zeros(len(full_audio))
for c in reel_cues:
    s_idx = max(0, int(c["start_time"] * sample_rate) - int(0.05 * sample_rate))
    e_idx = min(len(full_audio), int(c["end_time"] * sample_rate) + int(0.05 * sample_rate))
    speech_mask[s_idx:e_idx] = 1.0

fade_len = int(0.1 * sample_rate)
fade = np.ones(fade_len) / fade_len
smoothed_mask = np.convolve(speech_mask, fade, mode='same')
smoothed_mask = np.clip(smoothed_mask, 0.0, 1.0)
gain = 1.0 - (0.60 * smoothed_mask)
ducked_music = music * gain

mixed = full_audio + ducked_music
max_val = np.max(np.abs(mixed))
if max_val > 0.95:
    mixed = mixed * (0.95 / max_val)

sf.write('audio/reel_temp_mixed.wav', mixed, sample_rate)

ffmpeg_bin = r"C:\Users\Faiz\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
cmd = [
    ffmpeg_bin, '-y', '-i', 'audio/reel_temp_mixed.wav',
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
    '-ar', '48000', 'audio/master_reel_14lufs.wav'
]
subprocess.run(cmd, check=True)
print("Mastered audio/master_reel_14lufs.wav successfully!")
