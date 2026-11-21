import json, math, numpy as np
from PIL import Image, ImageDraw
segs=[np.array(s,float) for s in json.load(open('segs.json'))]
C=np.array([1000.0,748.7])
rot=lambda P: 2*C-P
def nearest(seg,p): return int(np.argmin(((seg-np.array(p))**2).sum(1)))
# piezas de la cola izquierda (coordenadas del boceto)
tipL=np.array([[518,476.]]); tipR=np.array([[1129,476.]]); vpt=np.array([[823.5,702.]])
V_left=np.vstack([tipL, segs[4][::-1], vpt])
V_right=np.vstack([vpt, segs[6][::-1], segs[7][::-1], tipR])
i=nearest(segs[1],(791,1000)); edge=np.vstack([segs[1][i:], tipL])[::-1]     # punta -> borde -> tallo -> (790,1000)
S=np.vstack([tipR, segs[2], [[871,1022.]]])
def resample(P,step=6.0):
    d=np.r_[0,np.cumsum(np.hypot(*np.diff(P,axis=0).T))]; n=max(2,int(d[-1]/step)+1); t=np.linspace(0,d[-1],n)
    return np.c_[np.interp(t,d,P[:,0]),np.interp(t,d,P[:,1])]
def smooth(P,k=4,it=3):
    Q=P.copy()
    for _ in range(it):
        R=Q.copy()
        for j in range(1,len(Q)-1):
            a=max(0,j-k); b=min(len(Q),j+k+1); w=min(j-a,b-1-j); R[j]=Q[j-w:j+w+1].mean(0)
        Q=R
    return Q
def corners(P,w=5,th=38):
    out=[]; 
    for j in range(w,len(P)-w):
        a=P[j]-P[j-w]; b=P[j+w]-P[j]; ang=abs(math.degrees(math.atan2(a[0]*b[1]-a[1]*b[0],a@b)))
        out.append((ang,j))
    idx=[]; 
    for ang,j in sorted(out,reverse=True):
        if ang<th: break
        if all(abs(j-k)>2*w for k in idx): idx.append(j)
    return sorted(idx)
def pieces(P):
    P=resample(P); cs=corners(P); cuts=[0]+cs+[len(P)-1]
    return [smooth(P[a:b+1]) for a,b in zip(cuts[:-1],cuts[1:])], [P[c] for c in cs]
def sym(P):  # promedio con su copia rotada 180° (para la S, que es simétrica)
    R=rot(P)[::-1]; A=resample(P,6); B=resample(R,6); n=min(len(A),len(B)); A=resample(P,1)[np.linspace(0,len(resample(P,1))-1,n).astype(int)]; B=resample(R,1)[np.linspace(0,len(resample(R,1))-1,n).astype(int)]
    return (A+B)/2
def bez(P):  # Catmull-Rom -> Bézier cúbicas
    d=f"M {P[0][0]:.1f},{P[0][1]:.1f}"
    for j in range(len(P)-1):
        p0=P[max(0,j-1)]; p1=P[j]; p2=P[j+1]; p3=P[min(len(P)-1,j+2)]
        c1=p1+(p2-p0)/6; c2=p2-(p3-p1)/6
        d+=f" C {c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d
def thin(P,step=3):  # menos nodos
    idx=list(range(0,len(P),step)); 
    if idx[-1]!=len(P)-1: idx.append(len(P)-1)
    return P[idx]
out={}
for name,P in [('V_left',V_left),('V_right',V_right),('edge',edge),('S',S)]:
    ps,cs=pieces(P); out[name]=ps; print(name,len(ps),'corners',[tuple(np.round(c)) for c in cs])
# trazos finales, centrados en C
def path(ps,xf=lambda P:P): return ' '.join(bez(thin(xf(p)-C)) for p in ps)
strokes={
 'a_v': path(out['V_left'])+' '+path(out['V_right']),
 'a_edge': path(out['edge']),
 's': path(out['S']),
 'b_v': path(out['V_left'],rot)+' '+path(out['V_right'],rot),
 'b_edge': path(out['edge'],rot),
}
json.dump(strokes,open('strokes.json','w'))
allp=np.vstack([p for ps in out.values() for p in ps]); allp=np.vstack([allp,rot(allp)])-C
print('bbox',allp.min(0),allp.max(0))
svg=lambda sw,col: f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-520 -310 1040 620" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">'+''.join(f'<path d="{d}"/>' for d in strokes.values())+'</svg>'
open('trazo.svg','w').write(svg(3,'#e11'))
# superponer sobre el boceto para verificar fidelidad
html=f'''<body style="margin:0"><div style="position:relative;width:1000px;height:750px"><img src="/home/user/QC-Marketing/docs/marca/boceto-logo-original.jpg" style="width:1000px;opacity:.5">
<div style="position:absolute;left:{(C[0]-520)/2}px;top:{(C[1]-310)/2}px;width:520px">{svg(3,'#e11')}</div></div>'''
open('overlay.html','w').write(html)
# puntos suavizados (centrados) para armar las versiones finales
pts={k:[(thin(p)-C).round(1).tolist() for p in v] for k,v in out.items()}
json.dump(pts,open('pts.json','w'))
