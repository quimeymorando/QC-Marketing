// La ballena: un dibujo 2D en línea (como el logo) que sale del logo y baja nadando con el scroll.
// - Cruza la página de lado a lado. En el portfolio se queda a la izquierda; no entra al pie de página.
// - El cuerpo es una cadena que sigue a la cabeza (por eso no se deforma en las curvas ni al frenar).
// - Bate la cola, rema con las aletas, gira sobre su eje en algunos tramos y cuando la tocan.
// - Al nadar empuja la simulación de agua: la estela son ondas reales, no un dibujo.
import type { Water } from './water';
import type { Waterline } from './waterline';

const PROFILE: [number, number][] = [[0, 0.03], [0.04, 0.072], [0.1, 0.104], [0.2, 0.122], [0.32, 0.126], [0.45, 0.11], [0.6, 0.08], [0.75, 0.05], [0.88, 0.027], [0.96, 0.017], [1, 0.015]];
const widthAt = (s: number) => { for (let i = 0; i < PROFILE.length - 1; i++) { const [a, wa] = PROFILE[i], [b, wb] = PROFILE[i + 1]; if (s <= b) { const t = (s - a) / (b - a), e = t * t * (3 - 2 * t); return wa + (wb - wa) * e; } } return 0.015; };
const WAKE_MS = 3200;
const INK = '4,7,11', FOAM = '242,246,247';
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function createWhale(canvas: HTMLCanvasElement, water: Water | null, line: Waterline | null, onPoke: () => void = () => {}) {
  const ctx = canvas.getContext('2d')!;
  const K = 26, MAXA = 0.17;
  let vw = 1, vh = 1, dpr = 1, L = 50, u = 0, phase = 0, lastT = 0, lastSide = 0, nextMeasure = 0;
  let cx = 0, cy = 0, spinAt = -1e9, body = { x: -999, y: -999 };
  let chain: { x: number; y: number }[] | null = null, tail: { x: number; y: number } | null = null, run = 0;
  const hist: { x: number; y: number; t: number; s: number }[] = [], wk = new Float32Array(96);
  let pf0 = 1e9, pf1 = 1e9, footY = 1e9, tk0 = 1e9, tk1 = -1e9, leap = 0;
  const drops: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
  const logo = document.querySelector<HTMLElement>('.nav-logo svg'), stage = document.querySelector<HTMLElement>('.wk-stage');
  const foot = document.querySelector<HTMLElement>('footer.foot'), passBox = document.querySelector<HTMLElement>('#pases');
  const passes = Array.from(document.querySelectorAll<HTMLElement>('.pass'));
  let lx = 60, ly = 36;

  // dónde empiezan el portfolio, los pases y el pie (en coordenadas de página)
  function measure() {
    const sy = scrollY;
    if (logo && sy < 40) { const r = logo.getBoundingClientRect(); if (r.width) { lx = r.left + r.width / 2; ly = r.top + r.height / 2; } }
    if (stage) { const sp = stage.parentElement?.classList.contains('pin-spacer') ? stage.parentElement : stage; pf0 = sp.getBoundingClientRect().top + sy; pf1 = pf0 + Math.max(0, sp.offsetHeight - vh); }
    if (foot) footY = foot.getBoundingClientRect().top + sy;
    if (passBox) { const r = passBox.getBoundingClientRect(); tk0 = r.top + sy - vh; tk1 = r.bottom + sy; }
  }
  function resize() {
    vw = document.documentElement.clientWidth || innerWidth; vh = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    L = Math.min(60, Math.max(40, vw * 0.037));
    measure();
  }
  const maxS = () => Math.max(1, document.documentElement.scrollHeight - vh);
  // ruta de la cabeza bajo el agua, en coordenadas de página; roll = giro sobre su eje (0..1 = una vuelta completa)
  // Empieza en el punto donde entra al mar: el centro de la pantalla, un cuerpo por debajo de la superficie.
  const entry = () => Math.max(70, vh * 0.1);
  function route(s0: number) {
    const S1 = entry(), s = Math.max(S1, s0), narrow = vw < 760, surfP = line ? line.surfPage() : vh * 0.52;
    // barrido: cruza la pantalla de un lado al otro cada pantalla y un poco
    const W = vh * 0.42, A = narrow ? 0.3 : 0.37;
    let xr = vw * (0.5 + A * Math.sin((s - S1) / W));
    let yr = s + vh * (0.5 + 0.17 * Math.sin(s / 1270 + 0.4));
    // zambullida: desde el punto de entrada baja con impulso hasta tomar la ruta normal
    const q = s - S1, yd = surfP + L * 1.5 + q * 1.15 + vh * 0.1 * (1 - Math.exp(-q / 110));
    yr = yd + (yr - yd) * sm(S1, S1 + 640, s);
    // portfolio: se va al costado izquierdo y se queda ahí
    const w = sm(pf0 - vh * 0.9, pf0 - vh * 0.05, s) * (1 - sm(pf1 + vh * 0.05, pf1 + vh * 0.8, s));
    if (w > 0) { xr += (vw * (narrow ? 0.07 : 0.085) + vw * 0.012 * Math.sin(s / 240) - xr) * w; yr += (s + vh * (0.5 + 0.2 * Math.sin(s / 620)) - yr) * w; }
    // pie de página: no entra. Se queda en la sección anterior y la página la deja atrás.
    const o = yr - (footY - vh * 0.36); yr -= o < -200 ? 0 : o > 200 ? o : ((o + 200) * (o + 200)) / 800;
    let roll = 0; const M = maxS();
    for (const c of [0.17, 0.43, 0.69]) { const k2 = (s - (c * M - 280)) / 560; if (k2 > 0 && k2 < 1) roll = k2 * k2 * (3 - 2 * k2); }
    return { x: xr, y: yr, roll };
  }

  /** El cursor tocó la pantalla: si fue sobre la ballena, da una vuelta sobre sí misma. */
  function poke(x: number, y: number) {
    if (Math.hypot(x - body.x, y - body.y) > Math.max(46, L * 0.9)) return false;
    spinAt = performance.now(); water?.drop(body.x, body.y, 0.07, 0.05); onPoke(); return true;
  }

  // gotas de la salpicadura: suben, caen por gravedad y al volver al mar dejan su marca en la línea de agua
  function drawDrops(scroll: number, f: number) {
    if (!drops.length) return;
    ctx.fillStyle = 'rgba(14,52,72,.92)';
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i]; d.vy += 0.3 * f; d.x += d.vx * f; d.y += d.vy * f;
      const sy = line ? line.yAt(d.x) - scroll : 1e6;
      if ((d.y > sy + 2 && d.vy > 0) || d.y > vh + 20) { if (line && d.r > 1.8) line.splash(d.x, 1.4); drops.splice(i, 1); continue; }
      ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r * 0.85, d.r * (1 + Math.min(0.9, Math.abs(d.vy) * 0.07)), Math.atan2(d.vx, -d.vy), 0, Math.PI * 2); ctx.fill();
    }
  }

  function frame(t: number, scroll: number, active: boolean, pointer: [number, number] | null) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, vw, vh);
    const f = lastT ? Math.min(6, (t - lastT) / 16.667) : 1; lastT = t;   // mismo movimiento a 60 Hz, 120 Hz o con cuadros lentos
    if (t > nextMeasure) { measure(); nextMeasure = t + 1500; }
    if (!active) { u = scroll; leap = 0; chain = null; tail = null; hist.length = 0; drops.length = 0; water?.setWake(wk, 0, L); return; }
    u += (scroll - u) * (1 - Math.pow(0.915, f));
    const lag = vh * 0.28; u = Math.min(scroll + lag, Math.max(scroll - lag, u));   // nunca queda tan atrás como para pegar un salto al alcanzarte
    // salto inicial: apenas empezás a bajar sale del logo, cae en arco y entra al agua en el medio de la pantalla.
    // Tiene su propio tiempo (no depende de cuánto scrollees) y se rebobina si volvés arriba del todo.
    leap = Math.min(1, Math.max(0, leap + ((scroll > 24 ? 1 : -1) * f * 16.667) / ((window as any).__leapMs || 1150)));   // __leapMs: solo para revisar el salto en cámara lenta
    if (leap <= 0) { chain = null; tail = null; lastSide = 0; hist.length = 0; water?.setWake(wk, 0, L); body = { x: -999, y: -999 }; drawDrops(scroll, f); return; }
    const sea = route(u), head = { x: sea.x, y: sea.y, roll: sea.roll };
    if (leap < 1) {
      const fx = 1 - Math.pow(1 - leap, 1.6), fy = leap * leap * (3 - 2 * leap), y0 = ly + scroll;   // sale casi horizontal, cae y frena al entrar
      head.x = lx + (sea.x - lx) * fx; head.y = y0 + (sea.y - y0) * fy; head.roll = 0;
    }
    // en el aire se ve más grande (está más cerca) y vuelve a su tamaño al entrar al agua
    const scale = (0.12 + 0.88 * sm(0, 0.45, leap)) * (1 + 0.75 * Math.sin(Math.PI * Math.min(1, leap * 1.08))), LL = L * scale, seg = LL / (K - 1);
    if (!chain) chain = Array.from({ length: K }, (_, i) => ({ x: head.x - i * seg * 0.96, y: head.y - i * seg * 0.28 }));
    const moved = Math.hypot(head.x - chain[0].x, head.y - chain[0].y) / f;
    // cadena: cada punto sigue al anterior a distancia fija, con un límite de curvatura (un cuerpo no se dobla en ángulo)
    chain[0].x = head.x; chain[0].y = head.y;
    let pdx = 0, pdy = 0;
    for (let i = 1; i < K; i++) {
      let dx = chain[i].x - chain[i - 1].x, dy = chain[i].y - chain[i - 1].y; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
      if (i > 1) { const a = Math.atan2(pdx * dy - pdy * dx, pdx * dx + pdy * dy); if (Math.abs(a) > MAXA) { const r = Math.sign(a) * MAXA, c = Math.cos(r), sn = Math.sin(r); dx = pdx * c - pdy * sn; dy = pdx * sn + pdy * c; } }
      chain[i].x = chain[i - 1].x + dx * seg; chain[i].y = chain[i - 1].y + dy * seg; pdx = dx; pdy = dy;
    }
    phase += (0.035 + Math.min(0.5, moved * 0.07)) * f;
    // curiosidad: se arrima entera al cursor cuando está cerca (sin estirarse) y lo ignora cuando lo tiene encima
    let tx0 = Math.sin(t * 0.0011) * 4, ty0 = Math.cos(t * 0.0009) * 3;
    if (pointer && leap >= 1) { const dx = pointer[0] - (chain[8].x + cx), dy = pointer[1] - (chain[8].y - scroll + cy), d = Math.hypot(dx, dy); if (d < 420 && d > 1) { const m = Math.min(34, Math.max(0, d - L * 1.8) * 0.16); tx0 += (dx / d) * m; ty0 += (dy / d) * m; } }
    const kf = 1 - Math.pow(0.96, f); cx += (tx0 - cx) * kf; cy += (ty0 - cy) * kf;

    const pts = chain;
    const P = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(K - 1, i + 1)]; let tx = a.x - b.x, ty = a.y - b.y; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
      const s = i / (K - 1), amp = LL * (0.01 + 0.085 * s * s) * Math.sin(phase - s * 3.2);
      return { x: p.x - ty * amp + cx, y: p.y + tx * amp - scroll + cy, tx, ty, s };
    });
    for (let i = 0; i < K; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(K - 1, i + 1)]; const m = Math.hypot(a.x - b.x, a.y - b.y) || 1; P[i].tx = (a.x - b.x) / m; P[i].ty = (a.y - b.y) / m; }
    body = { x: P[Math.round(K * 0.4)].x, y: P[Math.round(K * 0.4)].y };
    if (body.y < -LL * 1.5 || body.y > vh + LL * 1.5) { tail = null; hist.length = 0; water?.setWake(wk, 0, L); return; }   // fuera de pantalla: no se dibuja ni mueve el agua
    const turn = Math.max(-1, Math.min(1, (P[2].tx * P[K - 6].ty - P[2].ty * P[K - 6].tx) * 1.6));
    // giro sobre su eje: en algunos tramos de la ruta y cuando la tocan
    const sp = (t - spinAt) / 1100, spin = sp > 0 && sp < 1 ? sp * sp * (3 - 2 * sp) : 0;
    const rollA = (head.roll + spin) * Math.PI * 2, rc = Math.cos(rollA), belly = rc < 0;

    const shape = new Path2D(), detail = new Path2D();
    const left = P.map((p) => ({ x: p.x - p.ty * widthAt(p.s) * LL, y: p.y + p.tx * widthAt(p.s) * LL }));
    const right = P.map((p) => ({ x: p.x + p.ty * widthAt(p.s) * LL, y: p.y - p.tx * widthAt(p.s) * LL }));
    const nose = { x: P[0].x + P[0].tx * LL * 0.03, y: P[0].y + P[0].ty * LL * 0.03 };
    const curve = (path: Path2D, arr: { x: number; y: number }[]) => { for (let i = 0; i < arr.length - 1; i++) path.quadraticCurveTo(arr[i].x, arr[i].y, (arr[i].x + arr[i + 1].x) / 2, (arr[i].y + arr[i + 1].y) / 2); };
    shape.moveTo(nose.x, nose.y); shape.quadraticCurveTo(left[0].x + P[0].tx * LL * 0.03, left[0].y + P[0].ty * LL * 0.03, (left[0].x + left[1].x) / 2, (left[0].y + left[1].y) / 2); curve(shape, left.slice(1));
    // cola: el batido (arriba y abajo) se ve desde arriba como la cola que se acorta y se alarga
    const T = P[K - 1], bx = -T.tx, by = -T.ty, nx = -by, ny = bx;
    const beat = 0.58 + 0.42 * Math.abs(Math.cos(phase * 0.5 - 1.2)), fl = LL * 0.19 * beat, fw = LL * 0.235 * (0.45 + 0.55 * Math.abs(rc)), w1 = widthAt(1) * LL;
    const pt = (a: number, b: number) => [T.x + bx * a + nx * b, T.y + by * a + ny * b] as const;
    shape.lineTo(...pt(0, w1));
    shape.bezierCurveTo(...pt(fl * 0.22, fw * 0.36), ...pt(fl * 0.55, fw * 0.8), ...pt(fl * 0.98, fw));
    shape.bezierCurveTo(...pt(fl * 0.94, fw * 0.66), ...pt(fl * 0.98, fw * 0.24), ...pt(fl * 0.56, 0));
    shape.bezierCurveTo(...pt(fl * 0.98, -fw * 0.24), ...pt(fl * 0.94, -fw * 0.66), ...pt(fl * 0.98, -fw));
    shape.bezierCurveTo(...pt(fl * 0.55, -fw * 0.8), ...pt(fl * 0.22, -fw * 0.36), ...pt(0, -w1));
    right.reverse(); curve(shape, right.slice(0, -1));
    shape.quadraticCurveTo(right[right.length - 1].x + P[0].tx * LL * 0.03, right[right.length - 1].y + P[0].ty * LL * 0.03, nose.x, nose.y); shape.closePath();
    // aletas pectorales: reman, se inclinan en los giros y se acortan cuando gira sobre su eje
    const fi = Math.round(K * 0.29), F = P[fi];
    for (const sgn of [1, -1]) {
      const row = Math.sin(phase * 0.5 + (sgn > 0 ? 0 : 0.5));
      const ang = (1.92 + 0.36 * row + turn * 0.3 * sgn) * sgn;
      const dx = F.tx * Math.cos(ang) - F.ty * Math.sin(ang), dy = F.tx * Math.sin(ang) + F.ty * Math.cos(ang);
      const wHere = widthAt(F.s) * LL * 0.93, bxp = F.x - F.ty * wHere * sgn, byp = F.y + F.tx * wHere * sgn;
      const len = LL * 0.4 * (1 - 0.22 * turn * sgn) * (0.88 + 0.12 * Math.cos(phase * 0.5 + (sgn > 0 ? 0 : 0.5))) * (0.22 + 0.78 * Math.abs(rc)), pw = LL * 0.06;
      const tipx = bxp + dx * len, tipy = byp + dy * len, px = -dy * sgn, py = dx * sgn;
      shape.moveTo(bxp + F.tx * pw, byp + F.ty * pw);
      shape.bezierCurveTo(bxp + dx * len * 0.35 + px * pw * 1.25, byp + dy * len * 0.35 + py * pw * 1.25, bxp + dx * len * 0.8 + px * pw * 0.9, byp + dy * len * 0.8 + py * pw * 0.9, tipx, tipy);
      shape.bezierCurveTo(bxp + dx * len * 0.72 - px * pw * 0.35, byp + dy * len * 0.72 - py * pw * 0.35, bxp + dx * len * 0.3 - px * pw * 0.5, byp + dy * len * 0.3 - py * pw * 0.5, bxp - F.tx * pw * 0.9, byp - F.ty * pw * 0.9);
      shape.closePath();
      detail.moveTo(bxp + dx * len * 0.12, byp + dy * len * 0.12); detail.lineTo(bxp + dx * len * 0.82 + px * pw * 0.2, byp + dy * len * 0.82 + py * pw * 0.2);
    }
    if (belly) {
      // panza arriba: se ven los pliegues de la garganta
      for (const f of [-0.6, -0.3, 0, 0.3, 0.6]) for (let i = 1; i < Math.round(K * 0.55); i++) { const p = P[i], w = widthAt(p.s) * LL * f, x = p.x - p.ty * w, y = p.y + p.tx * w; i === 1 ? detail.moveTo(x, y) : detail.lineTo(x, y); }
    } else {
      for (let i = 2; i < K - 2; i++) { const p = P[i]; i === 2 ? detail.moveTo(p.x, p.y) : detail.lineTo(p.x, p.y); }
      const B = P[3]; detail.moveTo(B.x + LL * 0.012, B.y); detail.arc(B.x, B.y, LL * 0.012, 0, Math.PI * 2);
    }
    detail.moveTo(...pt(fl * 0.08, 0)); detail.lineTo(...pt(fl * 0.5, 0));

    const surfY = line ? line.yAt(P[0].x) - scroll : -1e6;

    // ---- cuerpo: tinta sobre el agua y sobre el papel de los pases, espuma en el resto ----
    const draw = (rgb: string, x0: number, y0: number, x1: number, y1: number, wipe = false) => {
      if (y1 <= y0 || x1 <= x0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      if (wipe) ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
      ctx.fillStyle = `rgba(${rgb === INK ? '14,52,72' : rgb},${belly ? 0.26 : 0.13})`; ctx.fill(shape);
      ctx.strokeStyle = `rgba(${rgb},.94)`; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1, LL * 0.013); ctx.stroke(shape);
      ctx.globalAlpha = 0.5; ctx.lineWidth = Math.max(0.75, LL * 0.008); ctx.stroke(detail);
      ctx.restore();
    };
    draw(INK, 0, 0, vw, Math.min(vh, surfY)); draw(FOAM, 0, Math.max(0, surfY), vw, vh);
    if (scroll > tk0 && scroll < tk1) for (const el of passes) {
      const r = el.getBoundingClientRect();
      if (r.right > body.x - LL && r.left < body.x + LL && r.bottom > body.y - LL && r.top < body.y + LL) draw(INK, r.left, r.top, r.right, r.bottom, true);
    }

    // ---- al cruzar la superficie salpica: la línea de agua se hunde, saltan gotas y el agua de abajo se sacude ----
    if (line) {
      const side = P[0].y > surfY ? 1 : -1;
      if (lastSide && side !== lastSide) {
        const sx = P[0].x, down = side > 0, n = down ? 28 : 12;
        line.splash(sx, (down ? 15 : -9)); line.splash(sx - 26, down ? -5 : 3); line.splash(sx + 26, down ? -5 : 3);
        water?.drop(sx, surfY + 8, 0.06, 0.07);
        for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.9, v = (down ? 4.2 : 2.6) + Math.random() * (down ? 6.5 : 3.5); drops.push({ x: sx + (Math.random() - 0.5) * 22, y: surfY - 2, vx: Math.cos(a) * v * 0.75 + P[0].tx * 1.2, vy: Math.sin(a) * v, r: 1.3 + Math.random() * Math.random() * 4.2 }); }
      }
      lastSide = side;
      const ty = T.y - surfY; if (Math.abs(ty) < 14 && moved > 0.6) line.splash(T.x, 3.2 * Math.sign(ty || 1));
    }
    drawDrops(scroll, f);

    // ---- estela: no es un dibujo. El camino que dejó la cola se pasa al agua, que lo levanta como relieve (dos lomos en V
    // que se abren y se apagan) con la misma luz que el resto de las ondas. Además la cola empuja la simulación: en el abismo
    // ese movimiento enciende el plancton a su paso.
    const end = pts[K - 1], tp = { x: end.x + cx, y: end.y + cy };   // punta de la cola, sin el vaivén del batido
    const wet = leap >= 1 && T.y > surfY + 6;
    if (wet && tail) {
      const dx = tp.x - tail.x, dy = tp.y - tail.y, d = Math.hypot(dx, dy);
      if (d > 0.5 && d < 900) {
        run += d;
        if (water?.ok) { const n = Math.min(20, Math.ceil(d / 10)); for (let i = 1; i <= n; i++) water.drop(tail.x + (dx * i) / n, tail.y + (dy * i) / n - scroll, 0.016, (0.0055 * (d / n)) / 10); }
        const last = hist[hist.length - 1];
        if (!last || Math.hypot(tp.x - last.x, tp.y - last.y) > 12) hist.push({ x: tp.x, y: tp.y, t, s: run });
      }
    }
    tail = tp;
    // la estela se apaga con el tiempo (si se queda quieta) y con la distancia (si avanza rápido): así siempre se ve un tramo parecido
    const wlen = LL * 15;
    while (hist.length && (t - hist[0].t > WAKE_MS || run - hist[0].s > wlen || hist.length > 280)) hist.shift();
    if (water?.ok) {
      let n = 0;
      if (hist.length > 1) {
        const m = Math.min(19, hist.length);
        for (let i = 0; i < m; i++) { const h = hist[Math.round((i * (hist.length - 1)) / (m - 1))]; wk[n * 4] = h.x; wk[n * 4 + 1] = h.y - scroll; wk[n * 4 + 2] = Math.min(1, Math.max((t - h.t) / WAKE_MS, (run - h.s) / wlen)); wk[n * 4 + 3] = h.s; n++; }
        // la punta de la cola cierra la estela; si la ballena está quieta toma la edad del último punto (sin escalón)
        if (wet) { const lh = hist[hist.length - 1], dl = Math.hypot(tp.x - lh.x, tp.y - lh.y); wk[n * 4] = tp.x; wk[n * 4 + 1] = tp.y - scroll; wk[n * 4 + 2] = wk[n * 4 - 2] * (1 - Math.min(1, dl / 24)); wk[n * 4 + 3] = run; n++; }
      }
      water.setWake(wk, n, LL, hist.length ? Math.min(1, Math.max(0, (run - hist[0].s - LL * 0.6) / (LL * 2.4))) : 0);
    }
    (window as any).__wp = [body.x, body.y, drops.length];
  }
  resize();
  return { frame, resize, poke };
}
