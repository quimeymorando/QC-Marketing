import json, numpy as np, base64, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
pts={k:[np.array(p) for p in v] for k,v in json.load(open('pts.json')).items()}
rot=lambda P:-P
def segs(P, first=True):
    d=f"M {P[0][0]:.1f},{P[0][1]:.1f}" if first else f"L {P[0][0]:.1f},{P[0][1]:.1f}"
    for j in range(len(P)-1):
        p0=P[max(0,j-1)]; p1=P[j]; p2=P[j+1]; p3=P[min(len(P)-1,j+2)]
        c1=p1+(p2-p0)/6; c2=p2-(p3-p1)/6
        d+=f" C {c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d
def chain(parts):  # lista de polilíneas consecutivas -> un solo trazado
    return ' '.join(segs(p, i==0) for i,p in enumerate(parts))
rv=lambda ps:[p[::-1] for p in ps[::-1]]
V=pts['V_left']+pts['V_right']; E=pts['edge']; S=pts['S']
# trazos abiertos (línea, como el boceto)
STROKES=[chain(V), chain(E), chain(S), chain([rot(p) for p in V]), chain([rot(p) for p in E])]
# formas cerradas (relleno)
A=chain(rv(E)+V+S)+' Z'                                   # cola de arriba: tallo -> borde -> V -> S -> cierra
B=chain([rot(p) for p in rv(E)]+[rot(p) for p in V]+rv(S))+' Z'   # cola de abajo
VB='-524 -289 1048 578'
def line_svg(col='#0E3448', sw=9): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">'+''.join(f'<path d="{d}"/>' for d in STROKES)+'</svg>'
def fill_svg(col='#0E3448', gap=14, uid='m'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}"><mask id="{uid}"><rect x="-524" y="-289" width="1048" height="578" fill="#fff"/><path d="{chain(S)}" fill="none" stroke="#000" stroke-width="{gap}" stroke-linecap="round"/></mask>'
            f'<g mask="url(#{uid})" fill="{col}"><path d="{A}"/><path d="{B}"/></g></svg>')
def duo_svg(col='#0E3448', sw=9):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}"><path d="{B}" fill="{col}" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round"/>'
            f'<g fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"><path d="{STROKES[0]}"/><path d="{STROKES[1]}"/></g></svg>')
def favicon(bg='#0E3448', fg='#F2F6F7'):
    inner=''.join(f'<path d="{d}"/>' for d in STROKES)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="{bg}"/><g transform="translate(256,256) scale(.41)" fill="none" stroke="{fg}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round">{inner}</g></svg>'
def text_path(txt, otf, size, tracking=0):
    f=TTFont(otf); gs=f.getGlyphSet(); cmap=f.getBestCmap(); sc=size/f['head'].unitsPerEm; d=[]; cx=0
    for ch in txt:
        g=cmap[ord(ch)]; pen=SVGPathPen(gs); gs[g].draw(TransformPen(pen,(sc,0,0,-sc,cx,0))); d.append(pen.getCommands()); cx+=gs[g].width*sc+tracking
    return ' '.join(d), cx
def lockup(col='#0E3448', kind='line'):
    d,w=text_path('Ceto Studio','/home/user/QC-Marketing/assets/fonts/sprat/Sprat-Regular.otf',300,2)
    h=360; sc=h/578; sw=1048*sc; gap=100
    inner=(''.join(f'<path d="{x}"/>' for x in STROKES))
    sym=f'<g transform="translate({524*sc:.1f},{h/2:.1f}) scale({sc:.4f})" fill="none" stroke="{col}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">{inner}</g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 {sw+gap+w+40:.0f} {h+40}">{sym}<path d="{d}" transform="translate({sw+gap:.1f},{h/2+78:.1f})" fill="{col}"/></svg>'
if __name__=='__main__':
    out='/home/user/QC-Marketing/docs/marca/logo'
    for f in os.listdir(out):
        if f.endswith('.svg') or f.endswith('.png') or f=='generar-logo.py': os.remove(f'{out}/{f}')
    files={'ceto-simbolo.svg':line_svg(),'ceto-simbolo-claro.svg':line_svg('#F2F6F7'),'ceto-simbolo-relleno.svg':fill_svg(),'ceto-simbolo-relleno-claro.svg':fill_svg('#F2F6F7'),
           'ceto-favicon.svg':favicon(),'ceto-logo-horizontal.svg':lockup(),'ceto-logo-horizontal-claro.svg':lockup('#F2F6F7')}
    for k,v in files.items(): open(f'{out}/{k}','w').write(v)
    json.dump({'viewBox':VB,'strokes':STROKES,'A':A,'B':B,'S':chain(S)},open(f'{out}/ceto-trazados.json','w'))
    L=lambda c:lockup(c)
    html=f'''<meta charset="utf-8"><style>body{{margin:0;font:12px monospace;display:grid;grid-template-columns:1.25fr 1fr 1fr;background:#F2F6F7;color:#0E3448}}
    figure{{margin:0;padding:44px 40px 18px;border:1px solid #d5dde0;display:flex;flex-direction:column;justify-content:space-between;min-height:270px}} figure svg{{width:100%;max-height:190px}} figcaption{{margin-top:16px;opacity:.6}}
    .d{{background:#04070B;color:#F2F6F7}} .p{{background:#0E3448;color:#F2F6F7}} .row{{display:flex;gap:22px;align-items:flex-end}} .row svg{{width:auto}}</style>
    <figure><div>{line_svg()}</div><figcaption>Símbolo · calcado de tu boceto, sin los óvalos</figcaption></figure>
    <figure><div>{fill_svg(uid='m1')}</div><figcaption>Relleno</figcaption></figure>
    <figure><div>{duo_svg()}</div><figcaption>Una en línea, una rellena</figcaption></figure>
    <figure class="d"><div>{L('#F2F6F7')}</div><figcaption>Logo horizontal · sobre casi negro</figcaption></figure>
    <figure class="p"><div>{line_svg('#F2F6F7')}</div><figcaption>Sobre azul petróleo</figcaption></figure>
    <figure class="d"><div>{fill_svg('#5CFFC4',uid='m2')}</div><figcaption>Bioluminiscencia (solo abismo)</figcaption></figure>
    <figure><div>{L('#0E3448')}</div><figcaption>Logo horizontal · azul petróleo sobre espuma</figcaption></figure>
    <figure><div class="row">{''.join(f'<span style="width:{s}px;height:{s}px;display:inline-block">{favicon()}</span>' for s in (128,64,32,16))}</div><figcaption>Ícono de app y pestaña: 128, 64, 32 y 16 px</figcaption></figure>
    <figure><div class="row"><span style="width:300px">{L('#0E3448')}</span><span style="width:150px">{L('#0E3448')}</span><span style="width:90px">{L('#0E3448')}</span></div><figcaption>Prueba de tamaño: 300, 150 y 90 px</figcaption></figure>'''
    open('sheet3.html','w').write(html)
