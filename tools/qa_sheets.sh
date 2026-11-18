#!/bin/bash
# QA contact sheets BEFORE the full render: one mid-shot still per shot. Usage: bash tools/qa_sheets.sh long|reel|gal|galr
# long -> qa/qalS/s_*.jpg (6x6), reel -> qa/qarS/s_*.jpg (11x3), gal/galr -> one still per entry of src/gal.json (r* = reel sets).
# Each still is taken at 60% of its shot (pop-in tags have landed).
set -e
cd "$(dirname "$0")/.."
BR=""; [ -f .browser ] && BR="--browser-executable=$(cat .browser)"
case "$1" in
  long) C=QAL; D=qa/qal; S=qa/qalS; G="6 6"; K=shots_long ;;
  reel) C=QAR; D=qa/qar; S=qa/qarS; G="11 3"; K=shots_reel ;;
  gal)  C=Gal; D=qa/gal; S=qa/galS; G="4 4"; K= ;;
  galr) C=GalR; D=qa/galr; S=qa/galrS; G="7 2"; K= ;;
  *) echo "usage: qa_sheets.sh long|reel|gal|galr"; exit 1 ;;
esac
rm -rf "$D" "$S"
npx remotion render src/index.ts $C "$D" --sequence --image-format=jpeg --scale=0.3 --concurrency=2 --gl=swiftshader --timeout=240000 --log=error $BR > /dev/null
LAB=""
if [ -n "$K" ]; then LAB=$(python3 tools/_lab.py "$K"); fi
python3 tools/sheet_s.py "$D" "$S" $G 1.0 $LAB
ls "$S"
