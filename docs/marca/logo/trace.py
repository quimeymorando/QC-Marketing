import numpy as np, math, json
from PIL import Image, ImageDraw
sk=np.load('sk.npy'); ys,xs=np.where(sk); pts=set(zip(xs.tolist(),ys.tolist()))
J=[(517,480),(823,700),(870,1019),(899,982),(1101,518),(1130,479),(1176,798),(1483,1020)]
rest={p for p in pts if all(math.dist(p,j)>5 for j in J)}
def nb(p,S):
    x,y=p; return [(x+dx,y+dy) for dx in (-1,0,1) for dy in (-1,0,1) if (dx or dy) and (x+dx,y+dy) in S]
seen=set(); segs=[]
for p in list(rest):
    if p in seen: continue
    comp=[]; st=[p]; seen.add(p)
    while st:
        q=st.pop(); comp.append(q)
        for n in nb(q,rest):
            if n not in seen: seen.add(n); st.append(n)
    if len(comp)<25: continue
    cs=set(comp); ends=[q for q in comp if len(nb(q,cs))==1]
    start=ends[0] if ends else comp[0]
    order=[start]; used={start}; cur=start
    while True:
        nx=[n for n in nb(cur,cs) if n not in used]
        if not nx: break
        nx.sort(key=lambda n: abs(n[0]-cur[0])+abs(n[1]-cur[1])); cur=nx[0]; used.add(cur); order.append(cur)
    segs.append(order)
segs.sort(key=lambda s:-len(s))
for i,s in enumerate(segs): print(i,len(s),s[0],s[-1])
json.dump(segs,open('segs.json','w'))
im=Image.new('RGB',(2000,1500),'white'); d=ImageDraw.Draw(im)
cols=['red','blue','green','orange','purple','brown','magenta','teal','black','gray']
for i,s in enumerate(segs):
    d.line(s,fill=cols[i%len(cols)],width=4); m=s[len(s)//2]; d.text((m[0]+10,m[1]+10),str(i),fill=cols[i%len(cols)])
im.resize((1000,750)).save('segs.png')
