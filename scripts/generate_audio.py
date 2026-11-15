import os
import json
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
import subprocess

os.makedirs('audio', exist_ok=True)
os.makedirs('subtitles', exist_ok=True)

# The narration sentences
sentences = [
    {
        "en": "Every spring, I make my middle school history students record an interview with an older relative.",
        "hi": "हर वसंत, मैं अपने मिडिल स्कूल के इतिहास के छात्रों से किसी बुजुर्ग रिश्तेदार का इंटरव्यू रिकॉर्ड करवाता हूँ।"
    },
    {
        "en": "It is usually dull work.",
        "hi": "यह काम आमतौर पर बेहद उबाऊ होता है।"
    },
    {
        "en": "I expected nothing different from Olivia, a quiet girl who sat in the back row.",
        "hi": "मुझे पिछली बेंच पर बैठने वाली शांत लड़की ओलिविया से भी किसी अलग चीज़ की उम्मीद नहीं थी।"
    },
    {
        "en": "She handed me two unmarked discs.",
        "hi": "उसने मुझे दो सादे डिस्क लाकर दिए।"
    },
    {
        "en": "Late that night, alone in my study, I put the first disc into the player.",
        "hi": "उस रात देर से, अपने स्टडी रूम में अकेले, मैंने पहला डिस्क प्लेयर में लगाया।"
    },
    {
        "en": "On screen, Olivia sat inside a cramped, cluttered living room across from her Great Uncle Stephen.",
        "hi": "स्क्रीन पर, ओलिविया एक तंग, बिखरे हुए कमरे में अपने अंकल स्टीफन के सामने बैठी थी।"
    },
    {
        "en": "The old veteran smoked in silence, clutching a stack of yellowed papers.",
        "hi": "वह बुजुर्ग फौजी चुपचाप सिगरेट पी रहा था और उसके हाथ में पीले पड़ चुके पुराने कागज़ थे।"
    },
    {
        "en": "When Olivia asked about his worst memory from the army, Stephen set his cigarette down.",
        "hi": "जब ओलिविया ने फौज की उसकी सबसे खौफनाक याद के बारे में पूछा, तो स्टीफन ने सिगरेट रख दी।"
    },
    {
        "en": "He had been deployed to the Balkans after a brutal conflict.",
        "hi": "एक भयानक जंग के बाद उसकी तैनाती बाल्कन इलाके में हुई थी।"
    },
    {
        "en": "His unit was sent to clear an old elementary school that had been obliterated years before.",
        "hi": "उसकी टुकड़ी को एक ऐसे पुराने प्राइमरी स्कूल को साफ करने भेजा गया, जो बरसों पहले तबाह हो चुका था।"
    },
    {
        "en": "The roof had collapsed.",
        "hi": "स्कूल की छत ढह चुकी थी।"
    },
    {
        "en": "Rain poured through cracked concrete, and no child had stepped inside for seasons.",
        "hi": "टूटे कंक्रीट से बारिश का पानी रिस रहा था, और सालों से किसी बच्चे ने वहाँ कदम नहीं रखा था।"
    },
    {
        "en": "In the flooded basement, Stephen discovered a handwritten letter left beside a heavy transistor radio.",
        "hi": "पानी से भरे बेसमेंट में, स्टीफन को एक भारी ट्रांजिस्टर रेडियो के पास हाथ से लिखा एक खत मिला।"
    },
    {
        "en": "It was written by Stanislav, the school's former janitor.",
        "hi": "यह खत स्टानिस्लाव ने लिखा था, जो उस स्कूल का पुराना चौकीदार था।"
    },
    {
        "en": "Stanislav wrote that after an illness took his wife and child, his radio was the only sound that kept him alive.",
        "hi": "स्टानिस्लाव ने लिखा कि बीमारी से पत्नी और बच्चे के गुज़रने के बाद, सिर्फ रेडियो की आवाज़ ने उसे ज़िंदा रखा था।"
    },
    {
        "en": "Grief had shattered his mind.",
        "hi": "गहरे सदमे ने उसकी दिमागी हालत बिगाड़ दी थी।"
    },
    {
        "en": "He returned to the empty, destroyed schoolhouse every morning with his mop and broom.",
        "hi": "वह हर सुबह झाड़ू और पोछा लेकर उस खंडहर बन चुके वीरान स्कूल में पहुँच जाता था।"
    },
    {
        "en": "He wrote that the teachers smiled at him in the halls, and the children enjoyed the low music from his radio.",
        "hi": "उसने लिखा कि गलियारों में शिक्षक उसे देखकर मुस्कुराते थे, और बच्चे उसके रेडियो का धीमा संगीत सुनते थे।"
    },
    {
        "en": "He swept around broken desks, carefully polishing the rubble and moving aside whatever lay in the shadows.",
        "hi": "वह टूटे हुए मेज़ों के बीच झाड़ू लगाता, मलबे को साफ करता और अंधेरे में पड़े सायों को एक तरफ हटाता रहता।"
    },
    {
        "en": "He believed the school was thriving.",
        "hi": "उसे पूरा यकीन था कि स्कूल पूरी तरह चल रहा है।"
    },
    {
        "en": "Until one morning, the radio went dead.",
        "hi": "जब तक कि एक सुबह, वह रेडियो अचानक बंद नहीं हो गया।"
    },
    {
        "en": "Unable to bear the suffocating silence, Stanislav wedged a chair beneath the basement door and took his own life.",
        "hi": "दमघोंटू सन्नाटे को बर्दाश्त न कर पाने पर, स्टानिस्लाव ने बेसमेंट के दरवाज़े पर कुर्सी अड़ाकर अपनी जान दे दी।"
    },
    {
        "en": "His note had one dying plea: Please fix my radio.",
        "hi": "उसके खत में बस एक आखिरी गुज़ारिश थी: कृपया मेरे रेडियो को ठीक कर दीजिए।"
    },
    {
        "en": "On the second disc, Olivia asked her uncle the question that still haunts me.",
        "hi": "दूसरे डिस्क पर, ओलिविया ने अपने अंकल से वह सवाल पूछा जो आज भी मेरी रूह कंपा देता है।"
    },
    {
        "en": "How could the janitor die in an empty school destroyed years earlier?",
        "hi": "बरसों पहले तबाह हो चुके एक खाली स्कूल में चौकीदार की मौत इतनी हालिया कैसे हो सकती थी?"
    },
    {
        "en": "Stephen answered with a trembling voice.",
        "hi": "स्टीफन ने कांपती आवाज़ में जवाब दिया।"
    },
    {
        "en": "The letter was dated only two weeks before their arrival.",
        "hi": "उस खत की तारीख उनकी फौजी टुकड़ी के पहुँचने से महज़ दो हफ्ते पहले की थी।"
    },
    {
        "en": "Stanislav had spent two years sweeping a tomb, smiling at figures frozen in the dark, thinking the silence was alive.",
        "hi": "स्टानिस्लाव ने दो साल एक कब्रगाह में झाड़ू लगाते, अंधेरे में जमे सायों को देखकर मुस्कुराते बिताए थे।"
    },
    {
        "en": "And when Stephen finally forced the basement door open, the janitor was gone.",
        "hi": "और जब स्टीफन ने आखिरकार बेसमेंट का दरवाज़ा तोड़ा, तो चौकीदार वहाँ नहीं था।"
    },
    {
        "en": "Sitting in the pool of stagnant water was the radio.",
        "hi": "सड़े हुए पानी के बीच केवल वह पुराना रेडियो रखा था।"
    },
    {
        "en": "And in the dead silence, it was softly humming.",
        "hi": "और उस खौफनाक सन्नाटे में, वह धीमे-धीमे गुनगुना रहा था।"
    }
]

print("Initializing Kokoro ONNX...")
kokoro = Kokoro('models/kokoro-v1.0.onnx', 'models/voices-v1.0.bin')

sample_rate = 24000
gap_duration = 0.32  # 0.32 seconds gap
gap_samples = int(sample_rate * gap_duration)
silence_gap = np.zeros(gap_samples, dtype=np.float32)

all_audio = []
timed_cues = []
current_sample_idx = 0

print(f"Generating audio for {len(sentences)} sentences...")
for idx, s in enumerate(sentences):
    text = s["en"]
    samples, sr = kokoro.create(text, voice='af_nicole', speed=1.1)
    # Ensure float32
    samples = np.array(samples, dtype=np.float32)
    
    start_time = current_sample_idx / sample_rate
    end_time = (current_sample_idx + len(samples)) / sample_rate
    
    timed_cues.append({
        "index": idx + 1,
        "start_time": start_time,
        "end_time": end_time,
        "en": text,
        "hi": s["hi"]
    })
    
    all_audio.append(samples)
    current_sample_idx += len(samples)
    
    # Add gap except after the very last sentence
    if idx < len(sentences) - 1:
        all_audio.append(silence_gap)
        current_sample_idx += gap_samples

full_audio = np.concatenate(all_audio)
total_duration = len(full_audio) / sample_rate
print(f"Total audio duration: {total_duration:.2f} seconds ({total_duration/60:.2f} minutes)")

sf.write('audio/voice_raw.wav', full_audio, sample_rate)

# Save cues to JSON
with open('audio/cues.json', 'w', encoding='utf-8') as f:
    json.dump({"total_duration": total_duration, "sample_rate": sample_rate, "cues": timed_cues}, f, indent=2, ensure_ascii=False)

def format_timestamp_srt(seconds):
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    if millis >= 1000:
        millis = 999
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

# Generate English SRT (CRLF, UTF-8, no BOM)
with open('subtitles_en.srt', 'wb') as f:
    lines = []
    for cue in timed_cues:
        s_time = format_timestamp_srt(cue["start_time"])
        e_time = format_timestamp_srt(cue["end_time"])
        lines.append(f"{cue['index']}\r\n{s_time} --> {e_time}\r\n{cue['en']}\r\n\r\n")
    f.write("".join(lines).encode('utf-8'))

# Generate Hindi SRT (CRLF, UTF-8, no BOM)
with open('subtitles_hi.srt', 'wb') as f:
    lines = []
    for cue in timed_cues:
        s_time = format_timestamp_srt(cue["start_time"])
        e_time = format_timestamp_srt(cue["end_time"])
        lines.append(f"{cue['index']}\r\n{s_time} --> {e_time}\r\n{cue['hi']}\r\n\r\n")
    f.write("".join(lines).encode('utf-8'))

print("Generated subtitles_en.srt and subtitles_hi.srt successfully!")
