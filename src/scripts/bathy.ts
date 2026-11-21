// Fondo del mar: curvas de nivel reales (ETOPO) del footer. El cursor las ondula.
type Bathy = { name: string; maxDepth: number; maxDepthAt?: { lat: number; lon: number }; bbox: { lat0: number; lat1: number; lon0: number; lon1: number }; levels: { depth: number; lines: number[][] }[] };

export async function initBathy() {
  const cv = document.getElementById('bathy') as HTMLCanvasElement | null; if (!cv) return null;
  let data: Bathy;
  try { const r = await fetch('/media/bathy.json'); if (!r.ok) return null; data = await r.json(); } catch { return null; }
  const fmt = (n: number) => Math.round(n).toLocaleString('es-ES').replace(/ /g, '.');
  const set = (sel: string, txt: string) => { const el = document.querySelector(sel); if (el) el.textContent = txt; };
  set('[data-bathy-name]', data.name); set('[data-bathy-depth]', `${fmt(data.maxDepth)} m de profundidad`);
  if (data.maxDepthAt) set('[data-bathy-pos]', `${Math.abs(data.maxDepthAt.lat).toFixed(1)}° ${data.maxDepthAt.lat < 0 ? 'S' : 'N'} · ${Math.abs(data.maxDepthAt.lon).toFixed(1)}° ${data.maxDepthAt.lon < 0 ? 'O' : 'E'}`);
  const ctx = cv.getContext('2d')!; let w = 1, h = 1, dpr = 1, visible = false, dirty = true;
  const rings: { x: number; y: number; t: number }[] = [];
  const maxD = Math.max(...data.levels.map((l) => l.depth)), minD = Math.min(...data.levels.map((l) => l.depth));
  function resize() { w = cv!.clientWidth; h = cv!.clientHeight; dpr = Math.min(2, devicePixelRatio || 1); cv!.width = Math.round(w * dpr); cv!.height = Math.round(h * dpr); dirty = true; }
  function draw(t: number) {
    if (!visible || (!dirty && !rings.length)) return;
    dirty = false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    // el mapa cubre el footer manteniendo proporción (cover)
    const s = Math.max(w, h * 1.15), ox = (w - s) / 2, oy = (h - s) / 2;
    for (let i = rings.length - 1; i >= 0; i--) if (t - rings[i].t > 2600) rings.splice(i, 1);
    for (const lv of data.levels) {
      const k = (lv.depth - minD) / (maxD - minD || 1), major = Math.round(lv.depth) % 2000 === 0;
      ctx.strokeStyle = `rgba(${Math.round(150 - 80 * k)},${Math.round(215 - 60 * k)},${Math.round(232 - 30 * k)},${(major ? 0.34 : 0.17) + 0.1 * k})`;
      ctx.lineWidth = major ? 1.1 : 0.7; ctx.beginPath();
      for (const ln of lv.lines) {
        for (let i = 0; i < ln.length; i += 2) {
          let x = ox + ln[i] * s, y = oy + ln[i + 1] * s;
          for (const r of rings) { const dx = x - r.x, dy = y - r.y, d = Math.hypot(dx, dy) || 1, age = (t - r.t) / 1000, rad = age * 240, f = Math.exp(-((d - rad) ** 2) / 2600) * 9 * Math.max(0, 1 - age / 2.6); x += (dx / d) * f; y += (dy / d) * f; }
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    }
  }
  const foot = cv.parentElement!; let lastRing = 0;
  foot.addEventListener('pointermove', (e) => { const now = performance.now(); if (now - lastRing < 140) return; lastRing = now; const r = cv.getBoundingClientRect(); rings.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: now }); if (rings.length > 7) rings.shift(); }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; dirty = true; }).observe(cv);
  resize();
  return { draw, resize };
}
