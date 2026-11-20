import re, base64, io, random, math, sys
from PIL import Image, ImageOps, ImageChops
REPO='/home/claude/wd2-venues/'
CW,CH=8,7            # one stitch, in px (desktop)
NC,NR=104,96         # stitches per tile
TW,TH=NC*CW,NR*CH    # tile in px
# --- the "2" from Conor's file ---
src='/mnt/user-data/attachments/323a3309-b0ce-51b8-9013-2b5d68bcb718/7c84f07a-image.png'
rgba=Image.open(src).convert('RGBA'); r,g,b,a=rgba.split()
two=ImageChops.multiply(ImageOps.invert(Image.merge('RGB',(r,g,b)).convert('L')),a)
two=two.crop(two.point(lambda v:255 if v>128 else 0).getbbox())
random.seed(int(sys.argv[1]) if len(sys.argv)>1 else 7)
N=int(sys.argv[2]) if len(sys.argv)>2 else 17
canvas=Image.new('L',(TW,TH),0)
pts=[]; tries=0
while len(pts)<N and tries<4000:
    tries+=1
    x=random.uniform(0,TW); y=random.uniform(0,TH)
    ok=True
    for (px,py) in pts:
        dx=min(abs(x-px),TW-abs(x-px)); dy=min(abs(y-py),TH-abs(y-py))
        if math.hypot(dx,dy)<132: ok=False;break
    if ok: pts.append((x,y))
for (x,y) in pts:
    h=random.uniform(80,102); w=two.size[0]*h/two.size[1]
    t=two.resize((round(w),round(h)),Image.LANCZOS).rotate(random.uniform(0,360),expand=True,resample=Image.BICUBIC)
    for ox in (-TW,0,TW):
        for oy in (-TH,0,TH):
            X=round(x-t.size[0]/2)+ox; Y=round(y-t.size[1]/2)+oy
            if X>TW or Y>TH or X+t.size[0]<0 or Y+t.size[1]<0: continue
            layer=Image.new('L',(TW,TH),0); layer.paste(t,(X,Y)); canvas=ImageChops.lighter(canvas,layer)
cells=canvas.resize((NC,NR),Image.BOX).point(lambda v:255 if v>=84 else 0)
big=cells.resize((NC*4,NR*4),Image.NEAREST)
pal=Image.new('P',big.size); pal.putpalette([255,255,255,255,255,255]); pal.putdata([1 if v else 0 for v in big.getdata()])
buf=io.BytesIO(); pal.save(buf,'PNG',optimize=True,transparency=0); b64=base64.b64encode(buf.getvalue()).decode()
print('twos',len(pts),'mask png',len(buf.getvalue()),'b64',len(b64), file=sys.stderr)
def enc(x): return 'url("data:image/svg+xml,' + x.replace('#','%23').replace('<','%3C').replace('>','%3E').replace('"',"'") + '")'
def stitch(c1,c2):
    # one knit stitch: two fat leaf-shaped lobes meeting in a point, lighter on the outside edge
    lobe='M.35 1.5Q.3 .1 1.9 .25 3.45 .7 3.85 3.4L3.95 7Q1.7 5.8 .7 3.4Z'
    return enc(f'<svg xmlns="http://www.w3.org/2000/svg" width="{CW}" height="{CH}" viewBox="0 0 {CW} {CH}"><defs><linearGradient id="a" x1="0" x2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient><linearGradient id="b" x1="1" x2="0"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs><path fill="url(#a)" d="{lobe}"/><path fill="url(#b)" transform="matrix(-1 0 0 1 {CW} 0)" d="{lobe}"/></svg>')
sel='section.page-section:has(.wd2-cards) .section-background'
BASE=stitch('#2f918a','#1f6b66'); TWO=stitch('#57b3ab','#35857f')
css=(
f'{sel}{{overflow:hidden!important;background-color:#020607!important;background-image:{BASE};background-size:{CW}px {CH}px;background-position:0 0}}\n'
f'/* the wave: a dark veil with soft gaps slides across, so bands of the knit light up and drift (only the veil moves, which phones handle easily) */\n'
f'{sel}::before{{content:"";position:absolute;top:0;bottom:0;left:0;width:300%;background-image:linear-gradient(90deg,rgba(2,6,7,.84) 0,rgba(2,6,7,.84) 22%,rgba(2,6,7,.38) 50%,rgba(2,6,7,.84) 78%,rgba(2,6,7,.84) 100%);background-size:22.2222% 100%;animation:wd2Knit 26s linear infinite;will-change:transform;pointer-events:none}}\n'
f'/* knitted Wedding Day 2 "2"s, pointing every way (the shape comes from Conor\'s own "Copy of c (Logo).png"). Each 2 is made of whole stitches:\n   a small picture, one dot per stitch, says which stitches are lit. */\n'
f'{sel}{{--wd2-knit:url(data:image/png;base64,{b64})}}\n'
f'{sel}::after{{content:"";position:absolute;inset:0;opacity:.62;background-image:{TWO};background-size:{CW}px {CH}px;-webkit-mask-image:var(--wd2-knit);mask-image:var(--wd2-knit);-webkit-mask-size:{TW}px {TH}px;mask-size:{TW}px {TH}px;-webkit-mask-repeat:repeat;mask-repeat:repeat;image-rendering:pixelated;pointer-events:none}}\n'
f'@keyframes wd2Knit{{from{{transform:translate3d(0,0,0)}}to{{transform:translate3d(-22.2222%,0,0)}}}}\n'
f'@media (prefers-reduced-motion:reduce){{{sel}::before{{animation:none}}}}\n'
f'@keyframes wd2KnitM{{from{{transform:translate3d(0,0,0)}}to{{transform:translate3d(-33.3333%,0,0)}}}}\n'
)
mw,mh=CW*.75,CH*.75
mob=(f'{sel},{sel}::after{{background-size:{mw:g}px {mh:g}px}}{sel}::after{{-webkit-mask-size:{TW*.75:g}px {TH*.75:g}px;mask-size:{TW*.75:g}px {TH*.75:g}px}}{sel}::before{{background-size:33.3333% 100%;animation-name:wd2KnitM;animation-duration:20s}}')
s=open(REPO+'home-cards.html').read()
i=s.index(sel+'{overflow:hidden'); j=s.index('/* on bigger screens the cards keep')
s=s[:i]+css+s[j:]
k=s.index('@media (max-width:767px){'); k2=s.index('.wd2-cards{grid-template-columns:repeat(2',k)
s=s[:k]+'@media (max-width:767px){'+mob+s[k2:]
open(REPO+'home-cards.html','w').write(s)
print('html',len(s), file=sys.stderr)
# local test page
st=s[s.index('<style>')+7:s.index('</style>')]
page=f'''<!doctype html><meta charset=utf-8><style>body{{margin:0;background:#111}}section.page-section{{position:relative;height:420px;margin:0 0 20px}}.section-background{{position:absolute;inset:0}}.fluid-engine{{position:relative}}{st}</style>
<section class="page-section"><div class="section-background"></div><div class="fluid-engine"><div class="fe-block"><div class="sqs-block"><nav class="wd2-cards" style="visibility:hidden"><a></a></nav></div></div></div></section>'''
open('test.html','w').write(page)
