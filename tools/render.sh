#!/bin/bash
# Render + encode the finished videos (v0.5: native 60 fps 3D, full scale = crisp; no frame-rate upsampling, no upscaling).
# 3D needs WebGL in headless Chrome: --gl=swiftshader is already in the flags below. Never remove it.
# Run from the work folder AFTER: tts, build_shots, quality_gate shots, mix, loud, subs, QA contact sheets.
# Usage: bash tools/render.sh <File_Prefix> [all|long|reel]      e.g. bash tools/render.sh Smile_Dog all
# Subtitles are DRAWN INSIDE the video by Remotion (bold word-by-word, both videos), so nothing is burned in with ffmpeg here.
# Long: N resumable parts (engine.json "parts"; a finished part is never rendered again; delete renders/long_partN.mp4 to redo it);
#       the Reel renders in parts too (half as many). If the session stops a long job, just run the same command again.
#       concat, x264 CRF (quality-based, maxrate 8M), safe AAC audio. Reel: one render, burned-in ASS captions, safe AAC audio.
# Then run: python3 tools/quality_gate.py video final/<file>.mp4   (must PASS before sending).
set -e
cd "$(dirname "$0")/.."
T="${1:?give a file prefix, e.g. Smile_Dog}"; WHAT="${2:-all}"
mkdir -p renders final
BR=""; [ -f .browser ] && BR="--browser-executable=$(cat .browser)"
SCALE=$(python3 -c "import sys; sys.path.insert(0,'tools'); from cfg import SCALE; print(SCALE)")
PARTS=$(python3 -c "import sys; sys.path.insert(0,'tools'); from cfg import PARTS; print(PARTS)")
CRF=$(python3 -c "import sys; sys.path.insert(0,'tools'); from cfg import CRF; print(CRF)")
FPS=$(python3 -c "import sys; sys.path.insert(0,'tools'); from cfg import FPS; print(FPS)")
R="--scale=$SCALE --crf=14 --muted --concurrency=2 --gl=swiftshader --timeout=240000 --log=error $BR"
[ -d build ] && [ build -nt src/shots_long.json ] && [ build -nt src/SetsL.tsx ] && [ build -nt src/words_long.json ] || { rm -rf build && npx remotion bundle src/index.ts --out-dir build > renders/bundle.log 2>&1; }
if [ "$WHAT" = all ] || [ "$WHAT" = long ]; then
  N=$(python3 -c "import json;print(json.load(open('src/shots_long.json'))['frames'])")
  step=$(( (N + PARTS - 1) / PARTS )); : > renders/list.txt
  for i in $(seq 0 $((PARTS - 1))); do
    a=$(( i * step )); b=$(( (i + 1) * step - 1 )); [ $b -ge $N ] && b=$(( N - 1 )); [ $a -ge $N ] && continue
    if [ ! -f renders/long_part$i.mp4 ]; then
      echo "long part $i: frames $a-$b"
      npx remotion render build Long renders/tmp_part$i.mp4 --frames=$a-$b $R > renders/log_part$i.txt 2>&1
      mv renders/tmp_part$i.mp4 renders/long_part$i.mp4
    fi
    echo "file 'long_part$i.mp4'" >> renders/list.txt
  done
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i renders/list.txt -c copy renders/long_raw.mp4
  python3 tools/safe_audio.py long
  ffmpeg -hide_banner -loglevel error -y -i renders/long_raw.mp4 -i audio/long/final_safe.m4a -map 0:v -map 1:a -vf eq=gamma=1.22:contrast=1.04:saturation=1.04 -c:v libx264 -preset veryfast -crf $CRF -maxrate 8M -bufsize 16M -pix_fmt yuv420p -r $FPS -c:a copy -movflags +faststart -shortest "final/${T}_YouTube_1920x1080.mp4"
  cp out/en.srt "final/${T}_English.srt"; cp out/hi.srt "final/${T}_Hindi.srt"
  echo "LONG OK"
fi
if [ "$WHAT" = all ] || [ "$WHAT" = reel ]; then
  if [ ! -f renders/reel_raw.mp4 ]; then
    N=$(python3 -c "import json;print(json.load(open('src/shots_reel.json'))['frames'])"); RP=$(( (PARTS + 1) / 2 )); step=$(( (N + RP - 1) / RP )); : > renders/rlist.txt
    for i in $(seq 0 $((RP - 1))); do
      a=$(( i * step )); b=$(( (i + 1) * step - 1 )); [ $b -ge $N ] && b=$(( N - 1 )); [ $a -ge $N ] && continue
      if [ ! -f renders/reel_part$i.mp4 ]; then echo "reel part $i: frames $a-$b"; npx remotion render build Reel renders/tmp_rpart$i.mp4 --frames=$a-$b $R > renders/log_rpart$i.txt 2>&1; mv renders/tmp_rpart$i.mp4 renders/reel_part$i.mp4; fi
      echo "file 'reel_part$i.mp4'" >> renders/rlist.txt
    done
    ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i renders/rlist.txt -c copy renders/reel_raw.mp4
  fi
  python3 tools/safe_audio.py reel
  ffmpeg -hide_banner -loglevel error -y -i renders/reel_raw.mp4 -i audio/reel/final_safe.m4a -map 0:v -map 1:a -vf eq=gamma=1.22:contrast=1.04:saturation=1.04 -c:v libx264 -preset veryfast -crf $((CRF + 2)) -maxrate 6M -bufsize 12M -pix_fmt yuv420p -r $FPS -c:a copy -movflags +faststart -shortest "final/${T}_Reel_1080x1920.mp4"
  echo "REEL OK"
fi
