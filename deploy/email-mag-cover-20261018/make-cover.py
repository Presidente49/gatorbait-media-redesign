from PIL import Image, ImageDraw, ImageFont, ImageFilter
src = Image.open('src/maxres.jpg').convert('RGB')   # 1280x720, whole frame, not cropped
W, H = src.size
im = src.copy()
# Legibility gradients top and bottom (overlay only; the photo stays whole).
grad = Image.new('L', (1, H))
for y in range(H):
    a = 0
    if y < 230: a = int(200 * (1 - y / 230) ** 1.2)
    if y > H - 250: a = max(a, int(215 * ((y - (H - 250)) / 250) ** 1.1))
    grad.putpixel((0, y), a)
grad = grad.resize((W, H))
navy = Image.new('RGB', (W, H), (8, 23, 58))
im = Image.composite(navy, im, grad)
d = ImageDraw.Draw(im)
F = lambda n, s: ImageFont.truetype(f'/root/.fonts/barlow-{n}.ttf', s)
black_c = lambda s: F(8, s)   # Barlow Condensed Black
xb = lambda s: F(4, s)        # Barlow ExtraBold
bold = lambda s: F(5, s)      # Barlow Bold
med = lambda s: F(3, s)       # Barlow Medium
OR = (250, 70, 22); WH = (255, 255, 255); LT = (213, 219, 228)
def txt(x, y, s, f, fill, anchor='la', spacing=0, shadow=True):
    if shadow:
        d.text((x+2, y+3), s, font=f, fill=(0, 0, 0), anchor=anchor)
    d.text((x, y), s, font=f, fill=fill, anchor=anchor)
# Masthead: GATORBAIT (orange BAIT) + MAGAZINE
m = black_c(96)
gw = d.textlength('GATOR', font=m)
txt(40, 26, 'GATOR', m, WH); txt(40 + gw, 26, 'BAIT', m, OR)
txt(44, 128, 'M A G A Z I N E', xb(30), LT)
# Orange rule under masthead
d.rectangle([40, 172, 40 + gw + d.textlength('BAIT', font=m), 200], fill=OR)
# Top right: edition tag
tag = xb(26); label = 'POSTGAME EDITION'
tw = d.textlength(label, font=tag)
d.rectangle([W - 40 - tw - 36, 40, W - 40, 92], fill=OR)
d.text((W - 40 - 18, 66), label, font=tag, fill=WH, anchor='rm')
txt(W - 40, 108, 'SUNDAY, OCT. 18, 2026', bold(22), LT, anchor='ra')
# Bottom left: score
txt(40, H - 200, 'FINAL  ·  AUSTIN, TEXAS', xb(24), (255, 173, 134))
txt(40, H - 150, 'FLORIDA 27', black_c(92), WH)
txt(40, H - 70, 'NO. 7 TEXAS 24', black_c(50), LT)
# Bottom right: credit (never cropped, never covered)
txt(W - 40, H - 28, 'Photo: UAA / FloridaGators.com', med(22), WH, anchor='rd')
txt(W - 40, H - 60, 'Jon Sumrall after the win at DKR', bold(22), LT, anchor='rd')
im.save('gatorbait-magazine-postgame-edition-cover-2026-10-18.jpg', quality=88, optimize=True, progressive=True)
print(im.size)
