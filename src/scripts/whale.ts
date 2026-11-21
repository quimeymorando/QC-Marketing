// La ballena: un dibujo 2D (no 3D) que sale del logo y baja nadando con el scroll.
// El cuerpo es una cadena de puntos que sigue una ruta ligada al scroll; la cola empuja el agua y deja estela.
import type { Water } from './water';
import type { Waterline } from './waterline';

const PROFILE: [number, number][] = [[0, 0.03], [0.04, 0.072], [0.1, 0.104], [0.2, 0.122], [0.32, 0.126], [0.45, 0.11], [0.6, 0.08], [0.75, 0.05], [0.88, 0.027], [0.96, 0.017], [1, 0.015]];
const widthAt = (s: number) => { for (let i = 0; i < PROFILE.length - 1; i++) { const [a, wa] = PROFILE[i], [b, wb] = PROFILE[i + 1]; if (s <= b) { const t = (s - a) / (b - a), e = t * t * (3 - 2 * t); return wa + (wb - wa) * e; } } return 0.013; };

export function createWhale(canvas: HTMLCanvasElement, water: Water | null, line: Waterline | null) {
  const ctx = canvas.getContext('2d')!;
  const K = 26;
  let vw = 1, vh = 1, dpr = 1, L = 160, u = 0, phase = 0, prev: { x: number; y: number } | null = null, lastSide = 0;
  const logo = document.querySelector<HTMLElement>('.nav-logo svg');
  let lx = 60, ly = 36;

  function resize() {
    vw = innerWidth; vh = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    L = Math.min(112, Math.max(72, vw * 0.072));
    if (logo) { const r = logo.getBoundingClientRect(); lx = r.left + r.width / 2; ly = r.top + r.height / 2 + scrollY; }
  }
  // ruta en coordenadas de página
  const maxS = () => Math.max(1, document.documentElement.scrollHeight - vh);
  function route(s: number) {
    const k = Math.min(1, Math.max(0, s / 520)), e = k * k * (3 - 2 * k);
    const end = Math.min(1, Math.max(0, (maxS() - s) / 700));
    // nada sobre todo por la derecha, donde no hay texto
    const mid = vw < 760 ? 0.62 : 0.7, side = vw < 760 ? 0.24 : 0.19;
    const xr = vw * (mid + side * Math.sin(s / 940 + 0.9) + 0.05 * Math.sin(s / 310 + 2)) * end + vw * 0.74 * (1 - end);
    const yr = s + vh * (0.52 + 0.16 * Math.sin(s / 1270 + 0.4)) * end + vh * 0.42 * (1 - end);
    // vueltas completas en dos puntos del recorrido
    let ox = 0, oy = 0; const M = maxS();
    for (const [c, dir] of [[0.2, 1], [0.47, -1], [0.78, 1]] as const) {
      const w = 760, k2 = (s - (c * M - w / 2)) / w;
      if (k2 > 0 && k2 < 1) { const q = k2 * k2 * (3 - 2 * k2), th = q * Math.PI * 2, R = Math.min(vw, vh) * 0.13; ox += dir * R * Math.sin(th); oy += -R * (1 - Math.cos(th)); }
    }
    return { x: lx + (xr + ox - lx) * e, y: ly + s * (1 - e) + (yr + oy - (ly + s * (1 - e))) * e, e };
  }

  function frame(t: number, scroll: number, active: boolean) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, vw, vh);
    if (!active) { u = scroll; prev = null; return; }
    u += (scroll - u) * 0.085;
    const head = route(u);
    const scale = 0.12 + 0.88 * head.e;
    if (u < 3) { prev = null; return; }
    // columna: puntos hacia atrás a lo largo de la ruta
    const pts: { x: number; y: number }[] = []; let uu = u; const seg = (L * scale) / (K - 1);
    for (let i = 0; i < K; i++) {
      const p = route(uu); pts.push({ x: p.x, y: p.y });
      const q = route(uu - 4), sp = Math.hypot(p.x - q.x, p.y - q.y) / 4 || 1; uu -= seg / sp;
    }
    const moved = prev ? Math.hypot(pts[0].x - prev.x, pts[0].y - prev.y) : 0;
    // ciclo de nado: avanza siempre (planeo lento) y se acelera con el recorrido, como el aleteo de la grulla
    phase += 0.035 + Math.min(0.5, moved * 0.07);
    const P = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(K - 1, i + 1)]; let tx = a.x - b.x, ty = a.y - b.y; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
      const s = i / (K - 1), amp = L * scale * (0.01 + 0.085 * s * s) * Math.sin(phase - s * 3.2);
      return { x: p.x - ty * amp, y: p.y + tx * amp - scroll, tx, ty, s };
    });
    for (let i = 0; i < K; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(K - 1, i + 1)]; const m = Math.hypot(a.x - b.x, a.y - b.y) || 1; P[i].tx = (a.x - b.x) / m; P[i].ty = (a.y - b.y) / m; }
    const LL = L * scale;
    // giro: cuánto dobla el cuerpo (para inclinar las aletas, como si se ladeara)
    const turn = Math.max(-1, Math.min(1, (P[2].tx * P[K - 6].ty - P[2].ty * P[K - 6].tx) * 1.6));

    const body = new Path2D(), detail = new Path2D();
    const left = P.map((p) => ({ x: p.x - p.ty * widthAt(p.s) * LL, y: p.y + p.tx * widthAt(p.s) * LL }));
    const right = P.map((p) => ({ x: p.x + p.ty * widthAt(p.s) * LL, y: p.y - p.tx * widthAt(p.s) * LL }));
    const nose = { x: P[0].x + P[0].tx * LL * 0.03, y: P[0].y + P[0].ty * LL * 0.03 };
    const curve = (path: Path2D, arr: { x: number; y: number }[]) => { for (let i = 0; i < arr.length - 1; i++) { const mx = (arr[i].x + arr[i + 1].x) / 2, my = (arr[i].y + arr[i + 1].y) / 2; path.quadraticCurveTo(arr[i].x, arr[i].y, mx, my); } };
    body.moveTo(nose.x, nose.y); body.quadraticCurveTo(left[0].x + P[0].tx * LL * 0.03, left[0].y + P[0].ty * LL * 0.03, (left[0].x + left[1].x) / 2, (left[0].y + left[1].y) / 2); curve(body, left.slice(1));
    // cola: aletas anchas con muesca, como en el logo. El batido (arriba y abajo) se ve desde arriba como la cola que se acorta y se alarga.
    const T = P[K - 1], bx = -T.tx, by = -T.ty, nx = -by, ny = bx;
    const beat = 0.58 + 0.42 * Math.abs(Math.cos(phase * 0.5 - 1.2)), fl = LL * 0.19 * beat, fw = LL * 0.235, w1 = widthAt(1) * LL;
    const pt = (a: number, b: number) => [T.x + bx * a + nx * b, T.y + by * a + ny * b] as const;
    body.lineTo(...pt(0, w1));
    body.bezierCurveTo(...pt(fl * 0.22, fw * 0.36), ...pt(fl * 0.55, fw * 0.8), ...pt(fl * 0.98, fw));
    body.bezierCurveTo(...pt(fl * 0.94, fw * 0.66), ...pt(fl * 0.98, fw * 0.24), ...pt(fl * 0.56, 0));
    body.bezierCurveTo(...pt(fl * 0.98, -fw * 0.24), ...pt(fl * 0.94, -fw * 0.66), ...pt(fl * 0.98, -fw));
    body.bezierCurveTo(...pt(fl * 0.55, -fw * 0.8), ...pt(fl * 0.22, -fw * 0.36), ...pt(0, -w1));
    right.reverse(); curve(body, right.slice(0, -1));
    body.quadraticCurveTo(right[right.length - 1].x + P[0].tx * LL * 0.03, right[right.length - 1].y + P[0].ty * LL * 0.03, nose.x, nose.y); body.closePath();
    // aletas pectorales largas (jorobada): reman de adelante hacia atrás y se inclinan en los giros
    const fi = Math.round(K * 0.29), F = P[fi];
    for (const sgn of [1, -1]) {
      const row = Math.sin(phase * 0.5 + (sgn > 0 ? 0 : 0.5));
      const ang = (1.92 + 0.36 * row + turn * 0.3 * sgn) * sgn;
      const dx = F.tx * Math.cos(ang) - F.ty * Math.sin(ang), dy = F.tx * Math.sin(ang) + F.ty * Math.cos(ang);
      const wHere = widthAt(F.s) * LL * 0.93, bxp = F.x - F.ty * wHere * sgn, byp = F.y + F.tx * wHere * sgn;
      const len = LL * 0.4 * (1 - 0.22 * turn * sgn) * (0.88 + 0.12 * Math.cos(phase * 0.5 + (sgn > 0 ? 0 : 0.5))), pw = LL * 0.06;
      const tipx = bxp + dx * len, tipy = byp + dy * len, px = -dy * sgn, py = dx * sgn;   // perpendicular (hacia adelante)
      body.moveTo(bxp + F.tx * pw, byp + F.ty * pw);
      body.bezierCurveTo(bxp + dx * len * 0.35 + px * pw * 1.25, byp + dy * len * 0.35 + py * pw * 1.25, bxp + dx * len * 0.8 + px * pw * 0.9, byp + dy * len * 0.8 + py * pw * 0.9, tipx, tipy);
      body.bezierCurveTo(bxp + dx * len * 0.72 - px * pw * 0.35, byp + dy * len * 0.72 - py * pw * 0.35, bxp + dx * len * 0.3 - px * pw * 0.5, byp + dy * len * 0.3 - py * pw * 0.5, bxp - F.tx * pw * 0.9, byp - F.ty * pw * 0.9);
      body.closePath();
      detail.moveTo(bxp + dx * len * 0.12, byp + dy * len * 0.12); detail.lineTo(bxp + dx * len * 0.82 + px * pw * 0.2, byp + dy * len * 0.82 + py * pw * 0.2);
    }
    // líneas interiores (como los pliegues de la grulla): lomo, espiráculo y nervio de la cola
    for (let i = 2; i < K - 2; i++) { const p = P[i]; i === 2 ? detail.moveTo(p.x, p.y) : detail.lineTo(p.x, p.y); }
    detail.moveTo(...pt(fl * 0.08, 0)); detail.lineTo(...pt(fl * 0.5, 0));
    const B = P[3]; detail.moveTo(B.x - B.ty * LL * 0.012, B.y + B.tx * LL * 0.012); detail.arc(B.x, B.y, LL * 0.012, 0, Math.PI * 2);
    // dos pasadas: tinta sobre el agua, espuma debajo. Dibujo en línea, como el logo (no tapa el texto).
    const surfY = line ? line.yAt(P[0].x) - scroll : -1e6;
    const draw = (fill: string, lineCol: string, y0: number, y1: number) => {
      if (y1 <= y0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(0, y0, vw, y1 - y0); ctx.clip();
      ctx.fillStyle = fill; ctx.fill(body);
      ctx.strokeStyle = lineCol; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, LL * 0.011); ctx.stroke(body);
      ctx.globalAlpha = 0.5; ctx.lineWidth = Math.max(0.75, LL * 0.007); ctx.stroke(detail);
      ctx.restore();
    };
    draw('rgba(14,52,72,.16)', 'rgba(4,7,11,.92)', 0, Math.min(vh, surfY));
    draw('rgba(242,246,247,.12)', 'rgba(242,246,247,.94)', Math.max(0, surfY), vh);

    // estela de agua: la cola y el morro empujan la simulación
    if (water && water.ok && moved > 0.4 && head.e > 0.3) {
      const k = Math.min(0.02, 0.0035 + moved * 0.0016);
      water.drop(T.x, T.y, 0.02, k); water.drop(P[Math.round(K * 0.55)].x, P[Math.round(K * 0.55)].y, 0.014, k * 0.45);
      if (moved > 2) water.drop(P[0].x, P[0].y, 0.012, k * 0.5);
    }
    // al cruzar la superficie, salpica
    if (line) { const side = P[0].y > surfY ? 1 : -1; if (lastSide && side !== lastSide) line.splash(P[0].x, 8 * side); lastSide = side;
      const ty = T.y - surfY; if (Math.abs(ty) < 14 && moved > 0.6) line.splash(T.x, 2.2 * Math.sign(ty || 1)); }
    prev = { x: pts[0].x, y: pts[0].y };
    (window as any).__wp = [P[Math.round(K / 2)].x, P[Math.round(K / 2)].y];
  }
  resize();
  return { frame, resize };
}
