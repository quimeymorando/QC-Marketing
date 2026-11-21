// La ballena: un dibujo 2D en línea (como el logo) que sale del logo y baja nadando con el scroll.
// - El cuerpo es una cadena de puntos que sigue una ruta ligada al scroll, con vueltas completas.
// - Bate la cola, rema con las aletas, gira sobre sí misma en las vueltas y se acerca curiosa al cursor.
// - Al nadar empuja la simulación de agua: la estela son ondas reales, no un dibujo.
import type { Water } from './water';
import type { Waterline } from './waterline';

const PROFILE: [number, number][] = [[0, 0.03], [0.04, 0.072], [0.1, 0.104], [0.2, 0.122], [0.32, 0.126], [0.45, 0.11], [0.6, 0.08], [0.75, 0.05], [0.88, 0.027], [0.96, 0.017], [1, 0.015]];
const widthAt = (s: number) => { for (let i = 0; i < PROFILE.length - 1; i++) { const [a, wa] = PROFILE[i], [b, wb] = PROFILE[i + 1]; if (s <= b) { const t = (s - a) / (b - a), e = t * t * (3 - 2 * t); return wa + (wb - wa) * e; } } return 0.015; };
const INK = '4,7,11', FOAM = '242,246,247';

export function createWhale(canvas: HTMLCanvasElement, water: Water | null, line: Waterline | null, onPoke: () => void = () => {}) {
  const ctx = canvas.getContext('2d')!;
  const K = 26;
  let vw = 1, vh = 1, dpr = 1, L = 100, u = 0, phase = 0, prev: { x: number; y: number } | null = null, lastSide = 0;
  let cx = 0, cy = 0, spinAt = -1e9, body = { x: -999, y: -999 };
  let tail: { x: number; y: number } | null = null, trail = 0;
  const logo = document.querySelector<HTMLElement>('.nav-logo svg');
  let lx = 60, ly = 36;

  function resize() {
    vw = innerWidth; vh = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    L = Math.min(82, Math.max(54, vw * 0.052));
    if (logo) { const r = logo.getBoundingClientRect(); lx = r.left + r.width / 2; ly = r.top + r.height / 2 + scrollY; }
  }
  const maxS = () => Math.max(1, document.documentElement.scrollHeight - vh);
  // ruta en coordenadas de página; roll = giro sobre su eje (0..1 = una vuelta completa)
  function route(s: number) {
    const k = Math.min(1, Math.max(0, s / 560)), e = k * k * (3 - 2 * k);
    const end = Math.min(1, Math.max(0, (maxS() - s) / 700));
    const mid = vw < 760 ? 0.62 : 0.7, side = vw < 760 ? 0.24 : 0.19;
    const xr = vw * (mid + side * Math.sin(s / 940 + 0.9) + 0.05 * Math.sin(s / 310 + 2)) * end + vw * 0.74 * (1 - end);
    const yr = s + vh * (0.52 + 0.16 * Math.sin(s / 1270 + 0.4)) * end + vh * 0.42 * (1 - end);
    let ox = 0, oy = 0, roll = 0; const M = maxS();
    for (const [c, dir] of [[0.2, 1], [0.47, -1], [0.78, 1]] as const) {
      const w = 760, k2 = (s - (c * M - w / 2)) / w;
      if (k2 > 0 && k2 < 1) { const q = k2 * k2 * (3 - 2 * k2), th = q * Math.PI * 2, R = Math.min(vw, vh) * 0.13; ox += dir * R * Math.sin(th); oy += -R * (1 - Math.cos(th)); roll = q * dir; }
    }
    return { x: lx + (xr + ox - lx) * e, y: ly + s * (1 - e) + (yr + oy - (ly + s * (1 - e))) * e, e, roll };
  }

  /** El cursor tocó la pantalla: si fue sobre la ballena, da una vuelta sobre sí misma. */
  function poke(x: number, y: number) {
    if (Math.hypot(x - body.x, y - body.y) > L * 0.75) return false;
    spinAt = performance.now(); water?.drop(body.x, body.y, 0.07, 0.05); onPoke(); return true;
  }

  function frame(t: number, scroll: number, active: boolean, pointer: [number, number] | null) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, vw, vh);
    if (!active) { u = scroll; prev = null; tail = null; return; }
    u += (scroll - u) * 0.085;
    const head = route(u), scale = 0.12 + 0.88 * head.e;
    if (u < 3) { prev = null; tail = null; body = { x: -999, y: -999 }; return; }
    const pts: { x: number; y: number }[] = []; let uu = u; const seg = (L * scale) / (K - 1);
    for (let i = 0; i < K; i++) { const p = route(uu); pts.push({ x: p.x, y: p.y }); const q = route(uu - 4), sp = Math.hypot(p.x - q.x, p.y - q.y) / 4 || 1; uu -= seg / sp; }
    const moved = prev ? Math.hypot(pts[0].x - prev.x, pts[0].y - prev.y) : 0;
    phase += 0.035 + Math.min(0.5, moved * 0.07);
    // curiosidad: se arrima al cursor cuando está cerca. Deriva lenta cuando la página está quieta.
    let tx0 = Math.sin(t * 0.0011) * 5, ty0 = Math.cos(t * 0.0009) * 4;
    if (pointer && head.e > 0.9) { const dx = pointer[0] - pts[0].x, dy = pointer[1] - (pts[0].y - scroll), d = Math.hypot(dx, dy); if (d < 430 && d > 1) { const m = Math.min(66, d * 0.2); tx0 += (dx / d) * m; ty0 += (dy / d) * m; } }
    cx += (tx0 - cx) * 0.045; cy += (ty0 - cy) * 0.045;

    const P = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(K - 1, i + 1)]; let tx = a.x - b.x, ty = a.y - b.y; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
      const s = i / (K - 1), amp = L * scale * (0.01 + 0.085 * s * s) * Math.sin(phase - s * 3.2), fol = 1 - s * 0.35;
      return { x: p.x - ty * amp + cx * fol, y: p.y + tx * amp - scroll + cy * fol, tx, ty, s };
    });
    for (let i = 0; i < K; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(K - 1, i + 1)]; const m = Math.hypot(a.x - b.x, a.y - b.y) || 1; P[i].tx = (a.x - b.x) / m; P[i].ty = (a.y - b.y) / m; }
    const LL = L * scale;
    body = { x: P[Math.round(K * 0.4)].x, y: P[Math.round(K * 0.4)].y };
    const turn = Math.max(-1, Math.min(1, (P[2].tx * P[K - 6].ty - P[2].ty * P[K - 6].tx) * 1.6));
    // giro sobre su eje: en las vueltas de la ruta y cuando la tocan
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

    // ---- cuerpo: tinta sobre el agua, espuma debajo ----
    const draw = (rgb: string, y0: number, y1: number) => {
      if (y1 <= y0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(0, y0, vw, y1 - y0); ctx.clip();
      ctx.fillStyle = `rgba(${rgb === INK ? '14,52,72' : rgb},${belly ? 0.26 : 0.13})`; ctx.fill(shape);
      ctx.strokeStyle = `rgba(${rgb},.94)`; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1, LL * 0.011); ctx.stroke(shape);
      ctx.globalAlpha = 0.5; ctx.lineWidth = Math.max(0.75, LL * 0.007); ctx.stroke(detail);
      ctx.restore();
    };
    draw(INK, 0, Math.min(vh, surfY)); draw(FOAM, Math.max(0, surfY), vh);

    // ---- salpicadura al cruzar la superficie ----
    if (line) {
      const side = P[0].y > surfY ? 1 : -1;
      if (lastSide && side !== lastSide) {
        line.splash(P[0].x, 7 * side); water?.drop(P[0].x, surfY, 0.05, 0.04);
      }
      lastSide = side;
      const ty = T.y - surfY; if (Math.abs(ty) < 14 && moved > 0.6) line.splash(T.x, 2.6 * Math.sign(ty || 1));
    }
    // la cola y el morro empujan el agua de verdad (ondas y plancton)
    // estela: la cola deja un rastro continuo en la simulación de agua (ondas reales que se abren y se apagan solas).
    // Se siembra a lo largo del camino recorrido, alternando lados como los remolinos que deja una cola al batir.
    const tp = { x: T.x, y: T.y + scroll };
    if (water && water.ok && head.e > 0.3 && tail) {
      const dx = tp.x - tail.x, dy = tp.y - tail.y, d = Math.hypot(dx, dy);
      if (d > 0.6 && d < 900) {
        // muchas gotas chicas y seguidas: sus ondas se suman y abren sola la V que deja cualquier cosa que avanza en el agua
        const n = Math.min(16, Math.ceil(d / 7)), ux = dx / d, uy = dy / d, power = Math.min(1, 0.3 + d * 0.045);
        for (let i = 1; i <= n; i++) {
          trail += d / n;
          const beat = Math.sin(trail / (LL * 0.2)), off = beat * LL * 0.04;
          water.drop(tail.x + (dx * i) / n - uy * off, tail.y + (dy * i) / n + ux * off - scroll, 0.012, (0.011 + 0.006 * Math.abs(beat)) * power);
        }
      }
    }
    tail = tp;
    prev = { x: pts[0].x, y: pts[0].y };
    (window as any).__wp = [body.x, body.y];
  }
  resize();
  return { frame, resize, poke };
}
