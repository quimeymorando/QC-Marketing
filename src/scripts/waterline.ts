// Línea de agua del hero: una superficie viva (resortes 1D) que responde al cursor, a la gota y a la ballena.
// El nivel del mar es variable: durante la intro está bajo; después sube hasta quedar justo entre las dos líneas del título.
export type Waterline = { profile(): { h: Float32Array; n: number; step: number }; splash(x: number, power: number): void; yAt(x: number): number; surfPage(): number; frame(t: number): void; resize(): void; level: number };

export function createWaterline(canvas: HTMLCanvasElement | null, hero: HTMLElement | null): Waterline | null {
  if (!canvas || !hero) return null;
  const ctx = canvas.getContext('2d')!;
  const STEP = 7;
  let w = 1, hpx = 200, dpr = 1, n = 2, h = new Float32Array(2), v = new Float32Array(2), visible = true, time = 0, high = 300, low = 500;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mark = hero.querySelector<HTMLElement>('.hero-l2');
  const api: Waterline = { profile: () => ({ h, n, step: STEP }), splash, yAt, surfPage, frame, resize, level: 1 };
  const base = () => low + (high - low) * api.level;

  function resize() {
    w = canvas.clientWidth; hpx = canvas.clientHeight; dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(hpx * dpr);
    n = Math.ceil(w / STEP) + 2; h = new Float32Array(n); v = new Float32Array(n);
    // nivel alto: justo arriba de la segunda línea del título ("bajo el agua."); nivel bajo: una franja al pie
    const hr = hero.getBoundingClientRect();
    high = mark ? mark.getBoundingClientRect().top - hr.top + parseFloat(getComputedStyle(mark).fontSize) * 0.045 : hpx * 0.56;
    low = Math.min(hpx - 70, innerHeight - 92);
  }
  const amb = (x: number, t: number, k = 1) => (Math.sin(x / 170 + t * 0.0011) * 7 + Math.sin(x / 61 - t * 0.0017) * 3.2 + Math.sin(x / 23 + t * 0.0026) * 1.1) * k;
  function surfPage() { return hero.offsetTop + base(); }
  function splash(x: number, power: number) {
    const i = Math.round(x / STEP);
    for (let k = -4; k <= 4; k++) { const j = i + k; if (j > 0 && j < n - 1) v[j] += power * Math.cos((k / 4) * Math.PI * 0.5); }
  }
  function yAt(x: number) {
    const f = Math.min(n - 2, Math.max(0, x / STEP)), i = Math.floor(f);
    return surfPage() + h[i] + (h[i + 1] - h[i]) * (f - i) + amb(x, time, reduce ? 0 : 1);
  }
  function frame(t: number) {
    time = t;
    if (!visible) return;
    for (let i = 1; i < n - 1; i++) { v[i] += -0.02 * h[i]; v[i] *= 0.972; }
    for (let p = 0; p < 3; p++) for (let i = 1; i < n - 1; i++) v[i] += 0.085 * (h[i - 1] + h[i + 1] - 2 * h[i]);
    for (let i = 1; i < n - 1; i++) h[i] += v[i];
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, hpx);
    const a = reduce ? 0 : 1, B = base();
    const trace = (dy: number, tt: number, k: number, lag: number) => {
      ctx.beginPath(); ctx.moveTo(-2, hpx + 2);
      for (let i = 0; i < n; i++) { const x = i * STEP; const j = Math.min(n - 1, Math.max(0, i - lag)); ctx.lineTo(x, B + dy + h[j] * 0.8 + amb(x + 140 * (lag ? 1 : 0), tt, k * a)); }
      ctx.lineTo(w + 2, hpx + 2); ctx.closePath();
    };
    trace(-9, t * 0.8 + 900, 1.25, 3); ctx.fillStyle = 'rgba(56,214,232,.16)'; ctx.fill();
    trace(-4, t * 0.9 + 400, 1.1, 1); ctx.fillStyle = 'rgba(20,84,110,.55)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-2, hpx + 2);
    for (let i = 0; i < n; i++) { const x = i * STEP; ctx.lineTo(x, B + h[i] + amb(x, t, a)); }
    ctx.lineTo(w + 2, hpx + 2); ctx.closePath(); ctx.fillStyle = '#0E3448'; ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = i * STEP, y = B + h[i] + amb(x, t, a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = 'rgba(170,236,248,.6)'; ctx.lineWidth = 1.25; ctx.stroke();
  }
  let ly: number | null = null;
  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect(), y = e.clientY - r.top - base(), x = e.clientX - r.left;
    if (ly !== null && Math.abs(y) < 60) { const vy = y - ly; if ((y > 0) !== (ly > 0) || Math.abs(y) < 26) splash(x, Math.max(-9, Math.min(9, vy * 0.6))); }
    ly = y;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => (ly = null));
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  resize();
  return api;
}
