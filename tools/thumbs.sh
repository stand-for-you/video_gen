#!/bin/bash
# Render the 4 thumbnails (ThumbA/B/C 1280x720, ThumbR 1080x1920) from src/ThumbsStory.tsx and save JPG quality 90 in final/.
# Usage (work folder): bash tools/thumbs.sh <File_Prefix>
set -e
cd "$(dirname "$0")/.."
T="${1:?give a file prefix}"; mkdir -p qa final
BR=""; [ -f .browser ] && BR="--browser-executable=$(cat .browser)"
for t in A B C R; do npx remotion still src/index.ts Thumb$t qa/thumb$t.png --gl=swiftshader --timeout=240000 --log=error $BR > /dev/null; done
python3 - "$T" <<'PY'
import sys
from PIL import Image
T = sys.argv[1]
for x, n in [('A', f'{T}_Thumb_A_1280x720'), ('B', f'{T}_Thumb_B_1280x720'), ('C', f'{T}_Thumb_C_1280x720'), ('R', f'{T}_Reel_Thumb_1080x1920')]:
    Image.open(f'qa/thumb{x}.png').convert('RGB').save(f'final/{n}.jpg', quality=90, optimize=True)
a, b, c, r = [Image.open(f'qa/thumb{x}.png').convert('RGB') for x in 'ABCR']
sh = Image.new('RGB', (1280 * 2 + 20 + 560, 1460), 'white'); sh.paste(a, (0, 0)); sh.paste(b, (1300, 0)); sh.paste(c, (0, 740)); sh.paste(r.resize((560, 996)), (2580, 0))
sh.resize((sh.width // 2, sh.height // 2)).save('qa/thumbs_sheet.jpg', quality=88)
print('thumbnails ok -> final/, review qa/thumbs_sheet.jpg')
PY
