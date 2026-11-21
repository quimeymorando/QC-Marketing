// Agua: una sola simulación de ondas (WebGL2) que usa todo el sitio.
// - El cursor y la ballena la agitan.
// - En el hero refracta el título.
// - Bajo el agua dibuja líneas de luz.
// - En el abismo, el plancton destella donde el agua se mueve (canal B = excitación, A = reserva).
// - En la intro dibuja la gota, el agua que sube y el nombre que se revela.

export type WaterState = {
  scroll: number; heroH: number; surf: number; bio: number;
  intro: number; level: number; sea: number; impactT: number;
  dropY: number; dropOn: number; dropStretch: number; dissolve: number; tintA: number; nameA: number;
};
export type Water = {
  ok: boolean; state: WaterState;
  drop(x: number, y: number, r?: number, k?: number): void;
  textDirty(ms?: number): void;
  drawName(): void;
  frame(t: number): void;
  resize(): void;
};

const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
const HEAD = `#version 300 es
precision highp float; in vec2 uv; out vec4 o;
`;

const STEP = HEAD + `uniform sampler2D s; uniform vec2 px; uniform float shift;
vec4 at(vec2 p){ if(p.y<0.||p.y>1.) return vec4(0.,0.,0.,1.); return texture(s,p); }
void main(){
  vec2 p = uv - vec2(0., shift);
  vec4 c = at(p);
  float a = (at(p+vec2(px.x,0.)).r + at(p-vec2(px.x,0.)).r + at(p+vec2(0.,px.y)).r + at(p-vec2(0.,px.y)).r)*.25;
  c.g += (a - c.r)*2.; c.g *= .9935; c.r += c.g; c.r *= .9975;
  // plancton: se enciende con el movimiento del agua, se agota y se recarga
  float fire = smoothstep(.0007,.0045,abs(c.g))*c.a;
  c.b = max(c.b*.95, fire);
  c.a = clamp(c.a - fire*.045 + .004, 0., 1.);
  o = c;
}`;

const DROP = HEAD + `uniform sampler2D s; uniform vec2 at; uniform float r, k, asp;
void main(){ vec4 c = texture(s,uv); vec2 d = uv-at; d.x *= asp; float f = max(0.,1.-length(d)/r); f = .5-cos(f*3.14159)*.5; c.r += f*k; o = c; }`;

const SHOW = HEAD + `uniform sampler2D s, tx, nm;
uniform vec2 px; uniform vec4 vp; uniform vec4 hero; uniform vec4 intro; uniform vec4 intro2; uniform vec2 intro3;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
float fbm(vec2 p){ return .5*vn(p)+.25*vn(p*2.03+7.)+.125*vn(p*4.1+13.); }
vec4 over(vec4 d, vec3 c, float a){ a = clamp(a,0.,1.); return vec4(c*a + d.rgb*(1.-a), a + d.a*(1.-a)); }
void main(){
  float vw=vp.x, vh=vp.y, scroll=vp.z, t=vp.w;
  float l=texture(s,uv-vec2(px.x,0.)).r, r=texture(s,uv+vec2(px.x,0.)).r, d=texture(s,uv-vec2(0.,px.y)).r, u=texture(s,uv+vec2(0.,px.y)).r;
  vec2 g = vec2(l-r,d-u); float gl = length(g);
  vec3 n = normalize(vec3(g*28.,1.));
  float sp = pow(max(0.,dot(reflect(normalize(vec3(-.4,.6,-1.)),n),vec3(0.,0.,1.))),60.);
  float pageY = scroll + (1.-uv.y)*vh;
  vec4 col = vec4(0.);
  vec3 cyan = vec3(.22,.84,.91);

  if(intro.x < .5){
    float heroH = hero.x;
    if(pageY < heroH){
      vec2 tuv = vec2(uv.x, 1.-pageY/heroH) + g*vec2(1.5, 1.5*vh/heroH);
      // lo que está bajo la superficie se mece apenas, como visto a través del agua
      float under = smoothstep(hero.y, hero.y+40., pageY);
      tuv += under*vec2(sin(pageY*.045+t*1.3), cos(uv.x*vw*.021+t*1.05))*vec2(.0011, .0016*vh/heroH);
      col = texture(tx, tuv);
    }
    float above = 1.-smoothstep(hero.y-24., hero.y+24., pageY);
    col = over(col, cyan, (clamp(gl*9.,0.,.34) + sp*.3)*above);
    // bajo el agua: relieve. Una pendiente de la onda recibe luz y la otra queda en sombra.
    float rel = dot(g, vec2(-.53,.85))*70.;
    col = over(col, vec3(0.,.025,.045), clamp(-rel,0.,1.)*.2*(1.-above));
    col = over(col, vec3(.74,.94,.98), (clamp(rel,0.,1.)*.2 + sp*.5 + smoothstep(.003,.03,gl)*.05)*(1.-above));
    float bio = hero.z;
    if(bio > .01){
      float cs = 7.; vec2 pp = vec2(uv.x*vw, pageY); vec2 id = floor(pp/cs), f = fract(pp/cs);
      float h = hash(id);
      if(h < .08){
        vec2 cuv = vec2((id.x+.5)*cs/vw, 1.-((id.y+.5)*cs-scroll)/vh);
        float e = texture(s,cuv).b;
        e = max(e, step(.9993,hash(id+floor(t*1.1)))*.4)*bio;
        vec2 q = abs(f-.5);
        float core = step(max(q.x,q.y),.17);
        float arms = step(min(q.x,q.y),.17)*step(max(q.x,q.y),.47);
        float shape = h < .022 ? max(core, arms*step(.5,e)) : core;
        float lvl = e > .58 ? 1. : (e > .28 ? .68 : (e > .08 ? .34 : 0.));
        vec3 c = mix(vec3(.36,1.,.77), vec3(.93,1.,.97), step(.58,e)*core);
        col = over(col, c, shape*lvl);
      }
    }
  } else {
    // ----- intro: gota, agua que sube y nombre -----
    float asp = vw/vh, pxv = 1./vh;
    float level = intro.y, sea = intro.z, it = intro.w, tintA = intro2.w, dis = intro2.z;
    float dx = abs(uv.x-.5)*asp;
    float wv = .0026*sin(uv.x*13.+t*1.6) + .0017*sin(uv.x*29.-t*2.2);
    if(it > 0.) wv += .016*exp(-it*.85)*sin(dx*30.-it*11.)*exp(-dx*1.2)*smoothstep(0.,.14,it*1.25-dx);
    float rise = smoothstep(sea, sea+.05, level);
    float sy = level + wv*rise;
    float below = sy - uv.y;
    if(below > 0. && uv.y > sea-.012 && rise > 0.){
      float a = tintA*(.085 + .075*smoothstep(0.,.75,below)) + tintA*(sp*.22 + clamp(gl*6.,0.,.18));
      col = over(col, cyan, a);
    }
    vec2 nuv = uv + g*1.3*step(0.,below);
    float nz = fbm(vec2(uv.x*asp,uv.y*1.6)*9. + vec2(0.,t*.07));
    nuv.y += dis*.03*nz;
    vec4 nc = texture(nm, nuv);
    float dev = smoothstep(0.,.05,below);
    float keep = 1.-smoothstep(nz-.035, nz+.035, dis*1.2-.1);
    nc *= dev*keep*intro3.y;
    col = vec4(nc.rgb + col.rgb*(1.-nc.a), nc.a + col.a*(1.-nc.a));
    if(rise > 0. && uv.y > sea){
      col = over(col, vec3(.05,.2,.28), smoothstep(3.6*pxv,1.2*pxv,abs(below-3.2*pxv))*.3*tintA*rise);
      col = over(col, vec3(.62,.94,.98), smoothstep(2.*pxv,.4*pxv,abs(below-1.*pxv))*.95*tintA*rise);
    }
    if(intro2.y > .5){
      vec2 p = vec2((uv.x-.5)*asp, uv.y-intro2.x)*vh;
      float R = min(21., vw*.034), st = intro3.x; vec2 q = p;
      if(q.y > 0.){ q.x *= 1. + q.y/(R*2.3*st)*1.5; q.y /= 1.55*st; }
      float dd = length(q)-R;
      vec3 c = mix(cyan, vec3(.055,.2,.28), .5 + .5*smoothstep(-R*.8,0.,dd));
      c = mix(c, vec3(1.), smoothstep(R*.27,R*.08,length(p-vec2(-R*.34,-R*.2)))*.92);
      col = over(col, c, smoothstep(.9,-.9,dd));
    }
    if(it > 0. && it < .95){
      for(int i=0;i<8;i++){
        float fi = float(i);
        vec2 v = vec2((hash(vec2(fi,1.7))-.5)*.62, .5 + hash(vec2(fi,2.3))*.62);
        vec2 pos = vec2(.5*asp, sea) + v*it*.92 + vec2(0.,-1.05)*it*it;
        float rr = 2.2 + 2.6*hash(vec2(fi,5.1));
        float dd = length((vec2(uv.x*asp,uv.y)-pos)*vh) - rr;
        col = over(col, mix(cyan, vec3(.055,.2,.28), .6), smoothstep(.8,-.8,dd)*step(sea,pos.y)*(1.-smoothstep(.6,.95,it)));
      }
    }
  }
  o = col;
}`;

export function createWater(canvas: HTMLCanvasElement): Water {
  const state: WaterState = { scroll: 0, heroH: 0, surf: 0, bio: 0, intro: 0, level: 0, sea: 0, impactT: -1, dropY: 2, dropOn: 0, dropStretch: 1, dissolve: 0, tintA: 1, nameA: 1 };
  const dead: Water = { ok: false, state, drop() {}, textDirty() {}, drawName() {}, frame() {}, resize() {} };
  const coarse = matchMedia('(pointer: coarse)').matches;
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: coarse ? 'low-power' : 'high-performance' });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return dead;

  const mk = (fs: string) => {
    const P = gl.createProgram()!;
    for (const [k, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, fs]] as const) {
      const sh = gl.createShader(k)!; gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader');
      gl.attachShader(P, sh);
    }
    gl.bindAttribLocation(P, 0, 'p'); gl.linkProgram(P);
    const loc: Record<string, WebGLUniformLocation | null> = {};
    return { P, u: (n: string) => (loc[n] ??= gl.getUniformLocation(P, n)) };
  };
  let step, drop, show;
  try { step = mk(STEP); drop = mk(DROP); show = mk(SHOW); } catch (e) { console.warn('[agua]', e); return dead; }

  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  let W = 1, H = 1, SW = 1, SH = 1, vw = 1, vh = 1, dpr = 1, maxDpr = coarse ? 1.5 : 2;
  let tex: WebGLTexture[] = [], fbo: WebGLFramebuffer[] = [], cur = 0;
  const ttex = gl.createTexture()!, ntex = gl.createTexture()!;
  const tcv = document.createElement('canvas'), ncv = document.createElement('canvas');
  const tcx = tcv.getContext('2d')!, ncx = ncv.getContext('2d')!;
  const hero = document.querySelector<HTMLElement>('.hero');
  let dirtyUntil = 0, lastScroll = 0, alive = true;

  const params = (t: WebGLTexture) => {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  const upload = (t: WebGLTexture, c: HTMLCanvasElement) => {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    params(t);
  };

  function resize() {
    vw = innerWidth; vh = innerHeight; dpr = Math.min(maxDpr, devicePixelRatio || 1);
    W = canvas.width = Math.round(vw * dpr); H = canvas.height = Math.round(vh * dpr);
    SW = coarse ? 176 : 288; SH = Math.max(64, Math.round(SW * vh / vw));
    for (const t of tex) gl.deleteTexture(t); for (const f of fbo) gl.deleteFramebuffer(f);
    tex = []; fbo = [];
    for (let i = 0; i < 2; i++) {
      const t = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, SW, SH, 0, gl.RGBA, gl.HALF_FLOAT, null); params(t);
      const f = gl.createFramebuffer()!; gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      tex.push(t); fbo.push(f);
    }
    state.heroH = hero ? hero.offsetHeight : 0;
    drawText(); if (state.intro) drawName();
  }

  // El texto del hero se copia a una textura, letra por letra, en su posición exacta.
  const fontCache = new WeakMap<Element, { font: string; color: string; asc: number }>();
  function drawText() {
    if (!hero) return;
    const hh = hero.offsetHeight, r0 = hero.getBoundingClientRect();
    const w = Math.round(vw * dpr), h = Math.round(hh * dpr);
    if (tcv.width !== w || tcv.height !== h) { tcv.width = w; tcv.height = h; }
    tcx.setTransform(1, 0, 0, 1, 0, 0); tcx.clearRect(0, 0, w, h); tcx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tcx.textBaseline = 'alphabetic';
    hero.querySelectorAll<HTMLElement>('[data-gl] .tw-c.on').forEach((c) => {
      const par = c.parentElement!;
      let fc = fontCache.get(par);
      if (!fc) {
        const cs = getComputedStyle(par);
        const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        tcx.font = font; const m = tcx.measureText('H');
        fc = { font, color: cs.color, asc: m.fontBoundingBoxAscent }; fontCache.set(par, fc);
      }
      const ch = c.textContent || ''; if (!ch.trim()) return;
      const r = c.getBoundingClientRect(); if (!r.width) return;
      const op = parseFloat(getComputedStyle(c).opacity);
      tcx.globalAlpha = isNaN(op) ? 1 : op; tcx.font = fc.font; tcx.fillStyle = fc.color;
      tcx.fillText(ch, r.left - r0.left, r.top - r0.top + fc.asc);
    });
    tcx.globalAlpha = 1;
    upload(ttex, tcv);
  }

  function drawName() {
    const w = Math.round(vw * dpr), h = Math.round(vh * dpr);
    ncv.width = w; ncv.height = h; ncx.setTransform(dpr, 0, 0, dpr, 0, 0); ncx.clearRect(0, 0, vw, vh);
    const two = vw < 640, lines = two ? ['Ceto', 'Studio'] : ['Ceto Studio'];
    let fs = Math.min(two ? vw * 0.3 : vw * 0.165, vh * (two ? 0.2 : 0.34));
    ncx.font = `400 ${fs}px Sprat, Georgia, serif`;
    const widest = Math.max(...lines.map((l) => ncx.measureText(l).width));
    if (widest > vw * 0.86) { fs *= (vw * 0.86) / widest; ncx.font = `400 ${fs}px Sprat, Georgia, serif`; }
    ncx.fillStyle = '#0E3448'; ncx.textAlign = 'center'; ncx.textBaseline = 'alphabetic';
    try { (ncx as any).letterSpacing = `${-fs * 0.014}px`; } catch {}
    const lh = fs * 0.92, y0 = vh * 0.5 - ((lines.length - 1) * lh) / 2 + fs * 0.3;
    lines.forEach((l, i) => ncx.fillText(l, vw / 2, y0 + i * lh));
    upload(ntex, ncv);
  }

  function pass(prog: any, set: () => void, shift = 0) {
    gl.useProgram(prog.P); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[1 - cur]); gl.viewport(0, 0, SW, SH); gl.disable(gl.BLEND);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[cur]); gl.uniform1i(prog.u('s'), 0);
    set(); gl.drawArrays(gl.TRIANGLES, 0, 3); cur = 1 - cur;
  }

  function addDrop(x: number, y: number, r = 0.022, k = 0.01) {
    if (!alive) return;
    pass(drop, () => { gl.uniform2f(drop.u('at'), x / vw, 1 - y / vh); gl.uniform1f(drop.u('r'), r); gl.uniform1f(drop.u('k'), k); gl.uniform1f(drop.u('asp'), vw / vh); });
  }

  // calidad adaptativa: si los cuadros tardan, baja la resolución
  let slow = 0, lastT = 0;
  function frame(t: number) {
    if (!alive) return;
    const dt = t - lastT; lastT = t;
    if (dt > 30 && dt < 200) { if (++slow > 40 && maxDpr > 1) { maxDpr = Math.max(1, maxDpr - 0.5); slow = 0; resize(); } } else if (slow > 0) slow--;
    if (performance.now() < dirtyUntil) drawText();
    const shift = (state.scroll - lastScroll) / vh; lastScroll = state.scroll;
    pass(step, () => { gl.uniform2f(step.u('px'), 1 / SW, 1 / SH); gl.uniform1f(step.u('shift'), shift); });
    pass(step, () => { gl.uniform2f(step.u('px'), 1 / SW, 1 / SH); gl.uniform1f(step.u('shift'), 0); });
    gl.useProgram(show.P); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[cur]); gl.uniform1i(show.u('s'), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, ttex); gl.uniform1i(show.u('tx'), 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, ntex); gl.uniform1i(show.u('nm'), 2);
    gl.uniform2f(show.u('px'), 1 / SW, 1 / SH);
    gl.uniform4f(show.u('vp'), vw, vh, state.scroll, t / 1000);
    gl.uniform4f(show.u('hero'), state.heroH, state.surf, state.bio, 0);
    gl.uniform4f(show.u('intro'), state.intro, state.level, state.sea, state.impactT);
    gl.uniform4f(show.u('intro2'), state.dropY, state.dropOn, state.dissolve, state.tintA);
    gl.uniform2f(show.u('intro3'), state.dropStretch, state.nameA);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); alive = false; document.documentElement.classList.remove('gl-on'); });
  // texturas vacías hasta que haya texto
  tcv.width = tcv.height = 2; upload(ttex, tcv); ncv.width = ncv.height = 2; upload(ntex, ncv);
  resize();
  document.documentElement.classList.add('gl-on');

  return {
    ok: true, state, drop: addDrop, drawName, frame, resize,
    textDirty(ms = 260) { dirtyUntil = Math.max(dirtyUntil, performance.now() + ms); },
  };
}
