#!/usr/bin/env python3
"""Contact sheets (page-by-page proofs) of a built issue PDF.
Usage: make-proofs.py <issue.pdf> <out-dir> <name-prefix> [--cols N] [--dpi N] [--per-sheet N]
Writes <out-dir>/<prefix>-NN.jpg, each sheet showing per-sheet pages with the physical page number in a corner.
Needs pdftoppm (poppler) and Pillow; on this container run it with /usr/bin/python3."""
import glob
import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw

args = sys.argv[1:]
opt = {'--cols': 4, '--dpi': 48, '--per-sheet': 12}
for k in list(opt):
    if k in args:
        i = args.index(k)
        opt[k] = int(args[i + 1])
        del args[i:i + 2]
pdf, out, prefix = args
os.makedirs(out, exist_ok=True)
info = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True, check=True).stdout
pages = int([l for l in info.splitlines() if l.startswith('Pages:')][0].split()[1])
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(['pdftoppm', '-r', str(opt['--dpi']), '-png', pdf, os.path.join(tmp, 'p')], check=True)
    files = sorted(glob.glob(os.path.join(tmp, 'p-*.png')))
    assert len(files) == pages, (len(files), pages)
    per, cols = opt['--per-sheet'], opt['--cols']
    for n, start in enumerate(range(0, pages, per), 1):
        ims = [Image.open(f).convert('RGB') for f in files[start:start + per]]
        w, h = ims[0].size
        rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * (w + 6) + 6, rows * (h + 6) + 6), (84, 84, 84))
        d = ImageDraw.Draw(sheet)
        for i, im in enumerate(ims):
            x, y = 6 + (i % cols) * (w + 6), 6 + (i // cols) * (h + 6)
            sheet.paste(im, (x, y))
            d.rectangle([x, y, x + 26, y + 13], fill=(0, 0, 0))
            d.text((x + 3, y + 1), str(start + i + 1), fill=(255, 235, 59))
        path = os.path.join(out, '%s-%02d.jpg' % (prefix, n))
        sheet.save(path, 'JPEG', quality=80, optimize=True)
        print(path, sheet.size, os.path.getsize(path) // 1024, 'KB')
