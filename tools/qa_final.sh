#!/bin/bash
# Final numbers check of every deliverable in final/ (sizes, resolution, duration, loudness, peaks, thumbnails, .srt format).
cd "$(dirname "$0")/../final" || exit 1
for f in *.mp4; do
  echo "== $f  $(du -m "$f" | cut -f1) MiB (must be < 400)"
  ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate -show_entries format=duration -of compact "$f"
  ffmpeg -hide_banner -nostats -i "$f" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tr -s ' '
done
for f in *.jpg; do python3 -c "from PIL import Image; import os; im=Image.open('$f'); print('$f', im.size, os.path.getsize('$f')//1024, 'KB')"; done
for f in *.srt; do echo "$f: $(file -b "$f") | first bytes: $(head -c3 "$f" | od -An -tx1) (efbbbf = BOM, not allowed) | cues: $(grep -c -- '-->' "$f")"; done
ls -la
