"""Procedural paper + grain textures for the Yamishibai look (no outside images, so no licence questions).
Writes public/paper.jpg (2048x2048 warm paper with soft clouds and fibres) and public/grain0..3.png (960x540 noise)."""
import os, numpy as np
from PIL import Image, ImageFilter, ImageDraw
os.makedirs('public', exist_ok=True); rng = np.random.default_rng(11); N = 2048
def cloud(n, scale):
    small = rng.standard_normal((n // scale, n // scale)).astype(np.float32)
    im = Image.fromarray(((small - small.min()) / (np.ptp(small) + 1e-9) * 255).astype(np.uint8)).resize((n, n), Image.BICUBIC)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(scale / 3)), np.float32) / 255
c = 0.55 * cloud(N, 128) + 0.3 * cloud(N, 32) + 0.15 * cloud(N, 8)
base = np.array([238, 232, 216], np.float32)
img = base[None, None, :] * (0.93 + 0.07 * c[..., None]) + rng.normal(0, 2.2, (N, N, 1))
im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
for _ in range(2600):  # paper fibres
    x, y = rng.uniform(0, N, 2); a = rng.uniform(0, 6.28); L = rng.uniform(6, 28)
    pts = [(x, y)]
    for k in range(4): a += rng.normal(0, 0.5); x += np.cos(a) * L / 4; y += np.sin(a) * L / 4; pts.append((x, y))
    t = int(rng.uniform(188, 214)); d.line(pts, fill=(t, t - 4, t - 14), width=1)
im.filter(ImageFilter.GaussianBlur(0.6)).save('public/paper.jpg', quality=90)
for g in range(4):
    n = rng.normal(128, 38, (540, 960)); Image.fromarray(np.clip(n, 0, 255).astype(np.uint8), 'L').save(f'public/grain{g}.png')
print('textures ok')
