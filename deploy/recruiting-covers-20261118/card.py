from PIL import Image, ImageDraw, ImageFont
F = 'fonts/'  # Barlow TTFs (SIL OFL) from github.com/google/fonts, not committed
BG=(7,27,52); ORANGE=(250,69,22); BLUE=(4,30,115); RING=(224,65,25); KICK=(245,137,76); SUB=(200,214,238); WHITE=(255,255,255)
def spaced(d, xy, text, font, fill, spacing):
    x,y=xy
    for ch in text:
        d.text((x,y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + spacing
    return x
def spaced_width(d, text, font, spacing):
    return sum(d.textlength(ch, font=font)+spacing for ch in text)-spacing
def card(kicker, lines, sub_regular, sub_bold, out):
    W,H=1920,1080
    im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
    d.ellipse((1280,-260,2180,640), fill=BLUE)
    d.ellipse((950,652,1800,1502), fill=RING); d.ellipse((994,696,1756,1458), fill=BG)
    d.rectangle((0,0,36,H), fill=ORANGE)
    kf=ImageFont.truetype(F+'Barlow-ExtraBold.ttf',38)
    spaced(d,(150,222),kicker.upper(),kf,KICK,13)
    size=214
    while True:
        tf=ImageFont.truetype(F+'Barlow-ExtraBold.ttf',size)
        if max(d.textlength(l,font=tf) for l in lines) <= 1150 or size<90: break
        size-=4
    lh=int(size*0.92)+ (0 if len(lines)>1 else 0)
    ytop=300 if len(lines)>1 else 400
    y=ytop
    for l in lines:
        d.text((150,y), l.upper(), font=tf, fill=WHITE)
        y+=int(size*0.905)
    ry=max(y+30,744) if len(lines)<=2 else y+30
    d.rectangle((150,ry,570,ry+8), fill=ORANGE)
    rf=ImageFont.truetype(F+'Barlow-Regular.ttf',58); bf=ImageFont.truetype(F+'Barlow-ExtraBold.ttf',58)
    sy=ry+52
    d.text((150,sy), sub_regular, font=rf, fill=SUB)
    if sub_bold:
        x=150+d.textlength(sub_regular+' ',font=rf)
        d.text((x,sy), sub_bold, font=bf, fill=WHITE)
    wf=ImageFont.truetype(F+'Barlow-ExtraBold.ttf',46)
    x=150
    for part,col in (('GATOR',WHITE),('BAIT',ORANGE),(' MEDIA',WHITE)):
        x=spaced(d,(x,962),part,wf,col,5)
    im.save(out,'JPEG',quality=92)
if __name__=='__main__':
    card('Florida Football',['Recruiting','Report'],'Class of 2027 and 2028 watch','','recruiting-report-cover.jpg')
    print('ok')
