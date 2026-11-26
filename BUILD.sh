#!/bin/bash
# =====================================================================================
#  I KNOW YOU'RE AWAKE - build the whole deliverable set, in order.
#  Run it from inside this folder:   bash BUILD.sh
#
#  Every step before the render takes seconds. The render takes hours. The order matters:
#  voice is measured FIRST, then the pictures are stretched onto it, then everything is
#  gated, and only then does anything render.
#
#  Safe to run again. Finished render parts are never redone (delete renders/long_partN.mp4
#  to force one). If a step fails, FIX IT and run the script again - never skip past it.
# =====================================================================================
set -e
cd "$(dirname "$0")"
PREFIX="I_Know_Youre_Awake"

say() { echo; echo "=============== $* ==============="; }

say "0. setup (node + python packages, Kokoro voice model, fonts, browser)"
# If you have not run setup yet:  bash setup.sh "$PWD"
[ -d node_modules/remotion ] || { echo "run:  bash setup.sh \"$PWD\"   first"; exit 1; }
[ -s models/kokoro-v1.0.onnx ] || { echo "run:  bash setup.sh \"$PWD\"   first (voice model missing)"; exit 1; }

say "1. voice (the slow one - about 10-25 min for the long script)"
python3 tools/tts.py long
python3 tools/tts.py reel

say "2. put every picture on its own words"
python3 tools/retime.py long
python3 tools/retime.py reel
python3 tools/build_shots.py long
python3 tools/build_shots.py reel

say "3. aim each camera at what its shot is of, keep every camera unique"
python3 tools/aim.py long  && python3 tools/build_shots.py long
python3 tools/aim.py reel  && python3 tools/build_shots.py reel

say "4. the gates that run before anything is drawn"
python3 tools/selftest.py
python3 tools/lint_story.py
python3 tools/lint_poses.py
python3 tools/sigmap.py long
python3 tools/sigmap.py reel
python3 tools/gate_shots.py long
python3 tools/gate_shots.py reel

say "5. film layout (title card, choice cards, end screen) + subtitles + sound"
python3 tools/film.py
python3 tools/cues.py long
python3 tools/cues.py reel
python3 tools/subs.py long
python3 tools/subs.py reel
python3 tools/mix.py long   && python3 tools/loud.py long
python3 tools/mix.py reel   && python3 tools/loud.py reel

say "6. LOOK AT IT - this stage is not automatic"
python3 tools/qa_shots.py
node tools/preview/shot_preview.mjs qa/env_shots.json  qa/preview
node tools/preview/shot_preview.mjs qa/cast_shots.json qa/preview
echo
echo "Open qa/preview/*.png and answer the questions in AGENT_INSTRUCTIONS.md section 6."
echo "Any 'yes' is a rebuild, not a note. Press Enter when you have actually looked."
read -r _

say "7. render (hours - leave it running)"
bash tools/render.sh "$PREFIX" all

say "8. thumbnails and the upload .md"
bash tools/thumbs.sh "$PREFIX"
python3 tools/make_upload_md.py "$PREFIX"

say "9. the gates that run on the finished files"
python3 tools/quality_gate.py "final/${PREFIX}_YouTube_1920x1080.mp4" --kind long --sheet qa/long_sheet.png
python3 tools/quality_gate.py "final/${PREFIX}_Reel_1080x1920.mp4"    --kind reel --sheet qa/reel_sheet.png
python3 tools/frame_ledger.py checksig src/shots_long.json i-know-youre-awake || true
python3 tools/frame_ledger.py check "final/${PREFIX}_YouTube_1920x1080.mp4" i-know-youre-awake || true
bash tools/qa_final.sh || true

say "DONE - the deliverables are in final/"
ls -la final/
echo
echo "Send ONLY these 9 files. After the owner approves, record them so the channel never"
echo "repeats a picture:"
echo "  python3 tools/frame_ledger.py add    final/${PREFIX}_YouTube_1920x1080.mp4 i-know-youre-awake"
echo "  python3 tools/frame_ledger.py addsig src/shots_long.json i-know-youre-awake"
