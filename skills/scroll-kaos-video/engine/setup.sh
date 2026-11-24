#!/bin/bash
# One-time setup of a Scroll Kaos work folder. Usage: bash <this engine folder>/setup.sh <work folder>
# Copies the engine, installs Node + Python packages, gets the Kokoro voice model, the Lora font and a browser,
# and makes the paper/grain textures. Safe to run again (it skips what is already there).
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"; W="${1:?give a work folder, e.g. ~/scroll-kaos/smile-dog}"
mkdir -p "$W"; W="$(cd "$W" && pwd)"
if [ ! -f "$W/package.json" ]; then
  (cd "$SRC" && tar --exclude=node_modules --exclude=setup.sh -cf - .) | (cd "$W" && tar -xf -)
  echo "engine copied to $W"
fi
cd "$W"
command -v ffmpeg >/dev/null || { echo "ERROR: ffmpeg is missing (needed for audio, captions and encoding)"; exit 1; }
command -v node >/dev/null || { echo "ERROR: Node.js is missing"; exit 1; }
[ -d node_modules/remotion ] || npm install --no-audit --no-fund --loglevel=error
python3 -c "import kokoro_onnx, soundfile, scipy, numpy, PIL" 2>/dev/null || pip install -q kokoro-onnx soundfile scipy numpy pillow 2>/dev/null || pip install -q --break-system-packages kokoro-onnx soundfile scipy numpy pillow
# Kokoro-82M ONNX model (Apache-2.0 model licence; per-voice terms UNVERIFIED). Reuse $KOKORO_DIR if it already has the files.
mkdir -p models
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  if [ ! -s "models/$f" ]; then
    if [ -n "$KOKORO_DIR" ] && [ -s "$KOKORO_DIR/$f" ]; then ln -sf "$KOKORO_DIR/$f" "models/$f"
    else curl -sSL --retry 3 -o "models/$f" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f"; fi
  fi
  [ "$(stat -Lc %s "models/$f")" -gt 10000000 ] || { echo "ERROR: models/$f did not download (check that github.com release downloads are allowed)"; rm -f "models/$f"; exit 1; }
done
# Lora font (SIL Open Font Licence) for ffmpeg-burned Reel captions; the Remotion frames load Lora from @remotion/google-fonts.
if ! fc-list 2>/dev/null | grep -qi "Lora"; then
  mkdir -p fonts
  [ -s fonts/Lora.ttf ] || curl -sSL --retry 3 -o fonts/Lora.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/lora/Lora%5Bwght%5D.ttf"
  [ -s fonts/Lora-Italic.ttf ] || curl -sSL --retry 3 -o fonts/Lora-Italic.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/lora/Lora-Italic%5Bwght%5D.ttf"
  for t in fonts/Lora.ttf fonts/Lora-Italic.ttf; do python3 -c "import sys; sys.exit(0 if open('$t','rb').read(4) in (b'\\x00\\x01\\x00\\x00', b'OTTO', b'true') else 1)" 2>/dev/null || { echo "WARNING: $t is not a font (download blocked?); Reel captions will use a fallback font"; rm -f "$t"; }; done
  fc-cache -f fonts > /dev/null 2>&1 || true
fi
# Browser for Remotion: use an installed Chrome if there is one, else let Remotion fetch its own headless shell.
for b in /usr/bin/google-chrome /usr/bin/chromium /usr/bin/chromium-browser /tmp/chromium; do [ -x "$b" ] && { echo "$b" > .browser; break; }; done
[ -f .browser ] || npx remotion browser ensure > /dev/null
[ -s public/paper.jpg ] || python3 tools/make_textures.py
python3 -c "from kokoro_onnx import Kokoro; k=Kokoro('models/kokoro-v1.0.onnx','models/voices-v1.0.bin'); v=k.get_voices(); print(len(v), 'Kokoro voices:', ' '.join(v))"
npx tsc --noEmit -p . && echo "SETUP OK: $W"
