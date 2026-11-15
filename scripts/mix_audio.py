import os
import json
import numpy as np
import soundfile as sf
import subprocess

def generate_dark_drone(duration_sec, sample_rate=24000):
    num_samples = int(duration_sec * sample_rate)
    t = np.linspace(0, duration_sec, num_samples, endpoint=False)
    
    # 65 Hz drone + 110 Hz overtone
    drone1 = np.sin(2 * np.pi * 65.4 * t)
    drone2 = 0.5 * np.sin(2 * np.pi * 110.0 * t)
    drone3 = 0.25 * np.sin(2 * np.pi * 55.0 * t)
    drone = drone1 + drone2 + drone3
    
    # Gentle modulation (slow pulse ~0.1 Hz)
    mod = 0.85 + 0.15 * np.sin(2 * np.pi * 0.08 * t)
    drone = drone * mod
    
    # Faint wind (filtered random noise)
    noise = np.random.normal(0, 1, num_samples)
    # Simple lowpass filter using exponential moving average
    alpha = 0.02
    wind = np.zeros(num_samples)
    for i in range(1, num_samples):
        wind[i] = alpha * noise[i] + (1 - alpha) * wind[i-1]
    
    # Wind oscillation
    wind_mod = 0.5 + 0.5 * np.sin(2 * np.pi * 0.12 * t)
    wind = wind * wind_mod * 0.4
    
    ambient = drone * 0.7 + wind * 0.3
    ambient = ambient / np.max(np.abs(ambient))
    return ambient

def mix_tracks(voice_path, out_yt_wav, out_reel_wav, cues_path):
    voice, sr = sf.read(voice_path)
    total_len = len(voice)
    total_dur = total_len / sr
    
    music = generate_dark_drone(total_dur, sr)
    
    # Music about 25 dB below voice
    # 25 dB below = 10^(-25/20) approx 0.056
    voice_rms = np.sqrt(np.mean(voice**2))
    target_music_rms = voice_rms * (10 ** (-25 / 20))
    music_rms = np.sqrt(np.mean(music**2))
    if music_rms > 0:
        music = music * (target_music_rms / music_rms)
        
    # Ducking 60% under speech (meaning music is reduced to 40% of its volume during speech)
    # Build speech activity envelope
    with open(cues_path, 'r', encoding='utf-8') as f:
        cues_data = json.load(f)["cues"]
        
    speech_mask = np.zeros(total_len)
    for c in cues_data:
        s_idx = max(0, int(c["start_time"] * sr) - int(0.05 * sr))
        e_idx = min(total_len, int(c["end_time"] * sr) + int(0.05 * sr))
        speech_mask[s_idx:e_idx] = 1.0
        
    # Smooth the mask for smooth ducking transition (100ms fade)
    fade_len = int(0.1 * sr)
    fade = np.ones(fade_len) / fade_len
    smoothed_mask = np.convolve(speech_mask, fade, mode='same')
    smoothed_mask = np.clip(smoothed_mask, 0.0, 1.0)
    
    # When smoothed_mask is 1, gain is 0.4 (ducked 60%). When 0, gain is 1.0.
    gain = 1.0 - (0.60 * smoothed_mask)
    ducked_music = music * gain
    
    mixed = voice + ducked_music
    # Prevent hard clipping before loudnorm
    max_val = np.max(np.abs(mixed))
    if max_val > 0.95:
        mixed = mixed * (0.95 / max_val)
        
    temp_mix_path = 'audio/temp_mixed.wav'
    sf.write(temp_mix_path, mixed, sr)
    
    # Now use ffmpeg loudnorm to master to -16 LUFS (YouTube) and -14 LUFS (Reel)
    ffmpeg_bin = r"C:\Users\Faiz\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
    
    # YouTube master: -16 LUFS
    cmd_yt = [
        ffmpeg_bin, '-y', '-i', temp_mix_path,
        '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
        '-ar', '48000', out_yt_wav
    ]
    subprocess.run(cmd_yt, check=True)
    
    # Reel master: -14 LUFS
    cmd_reel = [
        ffmpeg_bin, '-y', '-i', temp_mix_path,
        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
        '-ar', '48000', out_reel_wav
    ]
    subprocess.run(cmd_reel, check=True)
    
    print("Mixed and normalized audio successfully!")
    print(f"YouTube audio: {out_yt_wav}")
    print(f"Reel audio: {out_reel_wav}")

if __name__ == '__main__':
    mix_tracks('audio/voice_raw.wav', 'audio/master_youtube_16lufs.wav', 'audio/master_reel_14lufs.wav', 'audio/cues.json')
