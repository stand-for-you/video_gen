#!/bin/bash
# Prepare a runner (or your computer) for rendering: Lora font installed for the browser and copied to public/fonts,
# paper/grain textures made if missing, and (v0.4 work folders) engine.json "parts" set to the planned number.
# Usage: bash ci/prepare.sh [parts]
set -e
cd "$(dirname "$0")/.."
mkdir -p fonts public/fonts "$HOME/.local/share/fonts"
for n in Lora Lora-Italic; do   # work folder without the font: fetch it (SIL Open Font Licence, Google Fonts repo)
  if [ ! -s "fonts/$n.ttf" ]; then
    u="https://raw.githubusercontent.com/google/fonts/main/ofl/lora/${n}%5Bwght%5D.ttf"
    curl -fsSL --retry 3 -o "fonts/$n.ttf" "$u" || { echo "WARNING: could not get $n.ttf; a fallback font will be used"; rm -f "fonts/$n.ttf"; }
  fi
done
for n in Lora Lora-Italic; do
  if [ -s "fonts/$n.ttf" ]; then
    cp "fonts/$n.ttf" "$HOME/.local/share/fonts/$n.ttf"
    [ -s "public/fonts/$n.ttf" ] || cp "fonts/$n.ttf" "public/fonts/$n.ttf"
  fi
done
fc-cache -f "$HOME/.local/share/fonts" > /dev/null 2>&1 || true
if [ ! -s public/paper.jpg ] || [ ! -s public/grain0.png ]; then
  python3 -c "import numpy, PIL" 2>/dev/null || pip install -q numpy pillow
  python3 tools/make_textures.py
fi
if [ -n "$1" ] && [ -f engine.json ]; then
  python3 - "$1" <<'PY'
import json, sys
p = 'engine.json'; c = json.load(open(p)); c['parts'] = int(sys.argv[1]); json.dump(c, open(p, 'w'), indent=1)
print('engine.json parts =', c['parts'])
PY
fi
echo "prepare OK"
