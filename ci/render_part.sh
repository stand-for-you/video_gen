#!/bin/bash
# Render ONE planned part (one runner of the matrix). Usage: bash ci/render_part.sh <Long|Reel> <first frame> <last frame> <file> "<flags>"
# Output: renders/<file> (the exact name tools/render.sh looks for, so it never renders that part again).
set -e
cd "$(dirname "$0")/.."
COMP="$1"; A="$2"; B="$3"; FILE="$4"; FLAGS="$5"
case "$COMP" in Long|Reel) ;; *) echo "bad composition $COMP"; exit 1;; esac
[[ "$A" =~ ^[0-9]+$ && "$B" =~ ^[0-9]+$ && "$FILE" =~ ^[a-z_0-9]+\.mp4$ ]] || { echo "bad part values"; exit 1; }
mkdir -p renders
BR=""; [ -f .browser ] && BR="--browser-executable=$(cat .browser)"
[ -d build ] || npx remotion bundle src/index.ts --out-dir build > renders/bundle.log 2>&1 || { cat renders/bundle.log; exit 1; }
C=$(nproc 2>/dev/null || echo 2)
echo "rendering $COMP frames $A-$B -> renders/$FILE (concurrency $C)"
# shellcheck disable=SC2086
npx remotion render build "$COMP" "renders/tmp_$FILE" --frames="$A-$B" $FLAGS --concurrency="$C" $BR
mv "renders/tmp_$FILE" "renders/$FILE"
ls -la "renders/$FILE"
