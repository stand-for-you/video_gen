#!/bin/bash
# Render + encode the finished videos. Run from the work folder AFTER: tts, build_shots, mix, loud, subs, QA contact sheets.
# Usage: bash tools/render.sh <File_Prefix> [all|long|reel]      e.g. bash tools/render.sh Smile_Dog all
# Long: 4 resumable parts (a finished part is never rendered again; delete renders/long_partN.mp4 to redo it),
#       concat, 2-pass x264 3000k (stays < 400 MiB for ~15 min), safe AAC audio.
# Reel: one render, burned-in ASS captions, CRF 25 maxrate 4M, safe AAC audio.
set -e
cd "$(dirname "$0")/.."
T="${1:?give a file prefix, e.g. Smile_Dog}"; WHAT="${2:-all}"
mkdir -p renders final
BR=""; [ -f .browser ] && BR="--browser-executable=$(cat .browser)"
FONTS=/usr/share/fonts/truetype/google-fonts; [ -d fonts ] && FONTS=fonts
R="--scale=0.6 --crf=22 --muted --concurrency=2 --gl=swiftshader --log=error $BR"
rm -rf build && npx remotion bundle src/index.ts --out-dir build 2>&1 | tee renders/bundle.log
if [ "$WHAT" = all ] || [ "$WHAT" = long ]; then
  N=$(python3 -c "import json; d=json.load(open('src/shots_long.json')); print(d.get('total_frames', d.get('frames')))")
  step=$(( (N + 3) / 4 ))
  for i in 0 1 2 3; do
    a=$(( i * step )); b=$(( (i + 1) * step - 1 )); [ $b -ge $N ] && b=$(( N - 1 ))
    if [ ! -f renders/long_part$i.mp4 ]; then
      echo "long part $i: frames $a-$b"
      npx remotion render build Long renders/tmp_part$i.mp4 --frames=$a-$b $R 2>&1 | tee renders/log_part$i.txt
      mv renders/tmp_part$i.mp4 renders/long_part$i.mp4
    fi
  done
  printf "file 'long_part0.mp4'\nfile 'long_part1.mp4'\nfile 'long_part2.mp4'\nfile 'long_part3.mp4'\n" > renders/list.txt
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i renders/list.txt -c copy renders/long_raw.mp4
  python3 tools/safe_audio.py long
  VF="fps=30,scale=1920:1080:flags=lanczos,unsharp=5:5:0.5:5:5:0.0"
  ( cd renders
    ffmpeg -hide_banner -loglevel error -y -i long_raw.mp4 -vf "$VF" -c:v libx264 -preset veryfast -b:v 3000k -maxrate 5M -bufsize 10M -pix_fmt yuv420p -pass 1 -passlogfile x264long -an -f mp4 /dev/null
    ffmpeg -hide_banner -loglevel error -y -i long_raw.mp4 -i ../audio/long/final_safe.m4a -map 0:v -map 1:a -vf "$VF" -c:v libx264 -preset veryfast -b:v 3000k -maxrate 5M -bufsize 10M -pix_fmt yuv420p -pass 2 -passlogfile x264long -c:a copy -movflags +faststart -shortest "../final/${T}_YouTube_1920x1080.mp4" )
  cp out/en.srt "final/${T}_English.srt"; cp out/hi.srt "final/${T}_Hindi.srt"
  echo "LONG OK"
fi
if [ "$WHAT" = all ] || [ "$WHAT" = reel ]; then
  [ -f renders/reel_raw.mp4 ] || { npx remotion render build Reel renders/tmp_reel.mp4 $R 2>&1 | tee renders/log_reel.txt; mv renders/tmp_reel.mp4 renders/reel_raw.mp4; }
  python3 tools/safe_audio.py reel
  ffmpeg -hide_banner -loglevel error -y -i renders/reel_raw.mp4 -i audio/reel/final_safe.m4a -map 0:v -map 1:a -vf "fps=30,scale=1080:1920:flags=lanczos,unsharp=5:5:0.5:5:5:0.0,ass=audio/reel/captions.ass:fontsdir=$FONTS" -c:v libx264 -preset veryfast -crf 25 -maxrate 4M -bufsize 8M -pix_fmt yuv420p -c:a copy -movflags +faststart -shortest "final/${T}_Reel_1080x1920.mp4"
  echo "REEL OK"
fi
