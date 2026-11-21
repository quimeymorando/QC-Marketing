// Arranque del sitio: conecta scroll, agua, texto, ballena, intro y transiciones.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initType, startType } from './type';
import { createWater, type Water } from './water';
import { createWaterline } from './waterline';
import { createDepth } from './depth';
import { createWhale } from './whale';
import { playIntro, introFallback } from './intro';
import { initCursor } from './cursor';
import { initNav } from './nav';
import { initWork } from './work';
import { initBathy } from './bathy';
import { initTransitions, arrive } from './transition';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const reduce = root.classList.contains('rm');
const isHome = root.dataset.page === 'home';
const hero = document.querySelector<HTMLElement>('.hero');

// --- agua y superficie ---
let water: Water | null = null;
if (!reduce) { const w = createWater(document.getElementById('gl') as HTMLCanvasElement); if (w.ok) water = w; }
const line = createWaterline(document.getElementById('waterline') as HTMLCanvasElement | null, hero);
const depth = createDepth(() => (line ? line.surfPage() : -1000));

// --- texto ---
initType({ onChange: (el) => { if (water && hero && hero.contains(el)) water.textDirty(); } });

// --- scroll suave ---
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.115, wheelMultiplier: 1, touchMultiplier: 1.3, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const nav = initNav((open) => (open ? lenis?.stop() : lenis?.start()));
initCursor();
initTransitions();
initWork();
ScrollTrigger.addEventListener('refresh', () => depth.measure());

const whale = isHome && !reduce ? createWhale(document.getElementById('whale') as HTMLCanvasElement, water, line) : null;
let bathy: Awaited<ReturnType<typeof initBathy>> = null;
initBathy().then((b) => (bathy = b));

// --- el cursor agita el agua ---
let lp: [number, number] | null = null, lastMove = 0;
if (water) {
  addEventListener('pointermove', (e) => {
    const x = e.clientX, y = e.clientY; lastMove = performance.now();
    if (lp) { const d = Math.hypot(x - lp[0], y - lp[1]), n = Math.min(6, Math.ceil(d / 14)); for (let i = 1; i <= n; i++) water!.drop(lp[0] + ((x - lp[0]) * i) / n, lp[1] + ((y - lp[1]) * i) / n, 0.02, 0.0085); }
    lp = [x, y];
  }, { passive: true });
  addEventListener('pointerdown', (e) => water!.drop(e.clientX, e.clientY, 0.05, 0.035), { passive: true });
  addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') lp = null; }, { passive: true });
  document.addEventListener('pointerleave', () => (lp = null));
}

// --- láminas: el cursor las ilumina ---
const plates = Array.from(document.querySelectorAll<HTMLElement>('.plate'));
if (plates.length) addEventListener('pointermove', (e) => {
  for (const p of plates) { const r = p.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) continue; p.style.setProperty('--mx', e.clientX - r.left + 'px'); p.style.setProperty('--my', e.clientY - r.top + 'px'); }
}, { passive: true });

// --- videos: solo se reproducen en pantalla ---
const vio = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target as HTMLVideoElement; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }), { rootMargin: '10%' });
document.querySelectorAll('video[data-auto]').forEach((v) => vio.observe(v));

// --- pases: se imprimen al entrar y muestran fecha y hora reales ---
const pio = new IntersectionObserver((es) => { let k = 0; es.forEach((e) => { if (!e.isIntersecting) return; const el = e.target as HTMLElement; setTimeout(() => el.classList.add('printed'), 160 * k++); pio.unobserve(el); }); }, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.pass').forEach((p) => pio.observe(p));
const live = () => {
  const d = new Date(), time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }), date = d.toLocaleDateString('es', { day: '2-digit', month: '2-digit', year: 'numeric' });
  document.querySelectorAll<HTMLElement>('[data-live]').forEach((el) => (el.textContent = el.dataset.live === 'date' ? date : time));
  const y = document.querySelector('[data-year]'); if (y) y.textContent = String(d.getFullYear());
};
live(); setInterval(live, 15000);

// --- contacto: todavía sin destino (se conecta en la segunda vuelta) ---
document.querySelectorAll<HTMLAnchorElement>('[data-contact]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); if (water) { const r = a.getBoundingClientRect(); water.drop(r.left + r.width / 2, r.top + r.height / 2, 0.12, 0.06); } }));

// --- bucle ---
let started = false, introOn = false, nextAmb = 0;
gsap.ticker.add(() => {
  const now = performance.now(), scroll = window.scrollY;
  nav.onScroll(scroll); depth.update(scroll);
  line?.frame(now);
  if (water) {
    const s = water.state; s.scroll = scroll; s.surf = line ? line.surfPage() : -1000; s.bio = depth.bio();
    if (started && now > nextAmb && now - lastMove > 1400 && !document.hidden) { water.drop(innerWidth * Math.random(), innerHeight * (0.15 + Math.random() * 0.7), 0.03, 0.014); nextAmb = now + 1600 + Math.random() * 2200; }
  }
  whale?.frame(now, scroll, started && !introOn);
  if (!document.hidden) water?.frame(now);
  bathy?.draw(now);
});

let rz = 0;
addEventListener('resize', () => { clearTimeout(rz); rz = window.setTimeout(() => { line?.resize(); water?.resize(); whale?.resize(); bathy?.resize(); depth.measure(); ScrollTrigger.refresh(); }, 120); });

// --- arranque ---
(async () => {
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2800))]);
  line?.resize(); water?.resize(); whale?.resize(); depth.measure(); ScrollTrigger.refresh();
  if (isHome && root.classList.contains('intro')) {
    if (location.hash) root.classList.remove('intro');
    else {
      introOn = true; history.scrollRestoration = 'manual'; window.scrollTo(0, 0); lenis?.stop();
      if (water) await playIntro(water, line); else await introFallback();
      lenis?.start(); introOn = false;
    }
  } else await arrive();
  started = true; startType();
  addEventListener('load', () => { depth.measure(); ScrollTrigger.refresh(); });
})();
