#!/bin/bash
# Join the rendered parts and make every deliverable with the work folder's OWN tools (same result as a local run):
# tools/render.sh (it finds all parts in renders/, so it only joins, adds the safe audio, encodes and burns Reel captions),
# then thumbnails, the upload .md, the quality gate (v0.4) and the numbers check. Usage: bash ci/assemble.sh <prefix> <all|long|reel|thumbs>
set -e
cd "$(dirname "$0")/.."
T="$1"; WHAT="${2:-all}"
mkdir -p final renders
STATUS=0
if [ "$WHAT" = all ] || [ "$WHAT" = long ]; then bash tools/render.sh "$T" long; fi
if [ "$WHAT" = all ] || [ "$WHAT" = reel ]; then bash tools/render.sh "$T" reel; fi
if [ "$WHAT" = all ] || [ "$WHAT" = thumbs ]; then
  bash tools/thumbs.sh "$T"
  [ -f story/upload.json ] && python3 tools/make_upload_md.py "$T" || echo "no story/upload.json: upload .md skipped"
fi
if [ -f tools/quality_gate.py ]; then
  : > final/QUALITY_GATE.txt
  for f in final/*_YouTube_1920x1080.mp4 final/*_Reel_1080x1920.mp4; do
    [ -f "$f" ] || continue
    k=long; case "$f" in *Reel_1080x1920*) k=reel;; esac
    echo "== $f" | tee -a final/QUALITY_GATE.txt
    python3 tools/quality_gate.py "$f" --kind "$k" 2>&1 | tee -a final/QUALITY_GATE.txt || STATUS=1
  done
fi
[ -f tools/qa_final.sh ] && bash tools/qa_final.sh > final/QA_numbers.txt 2>&1 || true
ls -la final
exit $STATUS
