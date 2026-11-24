import sys, os
from PIL import Image, ImageDraw
seq, out, cols, rows, scale = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5])
labels = sys.argv[6].split(',') if len(sys.argv) > 6 else None
files = sorted(f for f in os.listdir(seq) if f.endswith('.jpeg') or f.endswith('.jpg') or f.endswith('.png'))
im0 = Image.open(os.path.join(seq, files[0])); w, h = int(im0.size[0] * scale), int(im0.size[1] * scale)
per = cols * rows; os.makedirs(out, exist_ok=True)
for p in range(0, len(files), per):
    sh = Image.new('RGB', (cols * w, rows * (h + 16)), 'white'); d = ImageDraw.Draw(sh)
    for i, f in enumerate(files[p:p + per]):
        im = Image.open(os.path.join(seq, f)).resize((w, h)); x, y = (i % cols) * w, (i // cols) * (h + 16)
        sh.paste(im, (x, y + 16)); d.text((x + 3, y + 2), f"{p + i} {labels[p + i] if labels and p + i < len(labels) else f}", fill='black')
    sh.save(f'{out}/s_{p // per:02d}.jpg', quality=85)
print('ok')
