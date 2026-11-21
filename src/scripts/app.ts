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
import { initSound } from './sound';

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

const sound = initSound(() => depth.value);
const whale = isHome && !reduce ? createWhale(document.getElementById('whale') as HTMLCanvasElement, water, line, () => sound.song()) : null;
let bathy: Awaited<ReturnType<typeof initBathy>> = null;
initBathy().then((b) => (bathy = b));

let lp: [number, number] | null = null, lastMove = 0;

// --- sonido: la primera vez se elige en la intro; después se recuerda durante la visita ---
let soundPref: string | null = null; try { soundPref = sessionStorage.getItem('ceto-sound'); } catch {}
if (soundPref === '1') { const arm = () => { sound.set(true); removeEventListener('pointerdown', arm); removeEventListener('keydown', arm); }; addEventListener('pointerdown', arm); addEventListener('keydown', arm); }
function askSound(): Promise<void> {
  const gate = document.querySelector<HTMLElement>('.gate'); if (!gate) return Promise.resolve();
  return new Promise((done) => {
    let closed = false;
    const choose = (v: boolean) => { if (closed) return; closed = true; clearTimeout(auto); removeEventListener('wheel', quiet); removeEventListener('touchmove', quiet); removeEventListener('keydown', esc); sound.set(v); gate.classList.remove('on'); done(); };
    const quiet = () => choose(false), esc = (e: KeyboardEvent) => { if (e.key === 'Escape') choose(false); };
    const auto = setTimeout(() => choose(false), 9000);   // sin respuesta: entra en silencio, nadie queda trabado
    gate.querySelectorAll<HTMLButtonElement>('[data-gate]').forEach((b) => b.addEventListener('click', () => choose(b.dataset.gate === 'on'), { once: true }));
    addEventListener('wheel', quiet, { passive: true }); addEventListener('touchmove', quiet, { passive: true }); addEventListener('keydown', esc);
    gate.classList.add('on');
  });
}

// --- linterna del abismo: ahí abajo no llega la luz; se ve lo que alumbra el cursor ---
const lampZone = !reduce ? document.querySelector<HTMLElement>('.zone-abismo') : null, lampEl = lampZone?.querySelector<HTMLElement>('.zone-grid') || null, lampAim = lampZone?.querySelector<HTMLElement>('.zone-pain') || null;
const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches; let lampX = 0, lampY = 0, lampK = -1, lampInit = false;
function lamp(now: number) {
  if (!lampZone || !lampEl) return;
  const vh = innerHeight, zr = lampZone.getBoundingClientRect();
  if (zr.bottom < -80 || zr.top > vh + 80) { if (lampK !== 0) { lampK = 0; lampEl.style.setProperty('--dim', '1'); } return; }
  const cover = (Math.min(zr.bottom, vh) - Math.max(zr.top, 0)) / vh, t = Math.min(1, Math.max(0, (cover - 0.35) / 0.4)), k = t * t * (3 - 2 * t);
  const r = lampEl.getBoundingClientRect(); let tx: number, ty: number;
  if (fineHover && lp && now - lastMove < 3200) { tx = lp[0]; ty = lp[1]; }
  else if (fineHover && lampAim) { const a = lampAim.getBoundingClientRect(); tx = a.left + a.width * 0.45; ty = a.top + a.height * 0.5; }   // cursor quieto: la linterna vuelve al texto
  else { tx = innerWidth * 0.5; ty = vh * 0.46; }                                                                                       // pantallas táctiles: alumbra el centro
  if (!lampInit) { lampX = tx; lampY = ty; lampInit = true; }
  const ease = fineHover && lp && now - lastMove < 3200 ? 0.2 : 0.05; lampX += (tx - lampX) * ease; lampY += (ty - lampY) * ease;
  lampEl.style.setProperty('--lx', (lampX - r.left).toFixed(1) + 'px'); lampEl.style.setProperty('--ly', (lampY - r.top).toFixed(1) + 'px');
  if (Math.abs(k - lampK) > 0.004) { lampK = k; lampEl.style.setProperty('--dim', (1 - 0.8 * k).toFixed(3)); }
}

// --- el cursor agita el agua ---
if (water) {
  addEventListener('pointermove', (e) => {
    const x = e.clientX, y = e.clientY; lastMove = performance.now();
    if (lp) { const d = Math.hypot(x - lp[0], y - lp[1]), n = Math.min(6, Math.ceil(d / 14)); for (let i = 1; i <= n; i++) water!.drop(lp[0] + ((x - lp[0]) * i) / n, lp[1] + ((y - lp[1]) * i) / n, 0.02, 0.0085); }
    lp = [x, y];
  }, { passive: true });
  addEventListener('pointerdown', (e) => { if (!whale?.poke(e.clientX, e.clientY)) water!.drop(e.clientX, e.clientY, 0.05, 0.035); }, { passive: true });
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
document.querySelectorAll<HTMLAnchorElement>('[data-contact]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); sound.ping(0.34); if (water) { const r = a.getBoundingClientRect(); water.drop(r.left + r.width / 2, r.top + r.height / 2, 0.12, 0.06); } }));
// señal de sonar: mientras el cierre está en pantalla, el botón emite un pulso que enciende el plancton a su paso
const sonarBtn = document.querySelector<HTMLElement>('[data-contact="whatsapp"]'); let sonarOn = false, nextPing = 0;
if (sonarBtn) new IntersectionObserver(([e]) => (sonarOn = e.isIntersecting), { threshold: 0.6 }).observe(sonarBtn);

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
  if (water && sonarOn && started && now > nextPing && !document.hidden) { const r = sonarBtn!.getBoundingClientRect(); water.drop(r.left + r.width / 2, r.top + r.height / 2, 0.05, 0.11); sound.ping(0.1); nextPing = now + 3400; }
  whale?.frame(now, scroll, started && !introOn, lp && now - lastMove < 2500 ? lp : null);
  if (!document.hidden) water?.frame(now);
  bathy?.draw(now); lamp(now);
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
      root.classList.add('sea-low');
      const rise = () => { root.classList.remove('sea-low'); if (line) gsap.to(line, { level: 1, duration: 1.35, ease: 'power2.inOut', onComplete: () => depth.measure() }); started = true; startType(); };
      if (water) await playIntro(water, line, rise, { ask: soundPref === null ? askSound : undefined, drip: () => sound.drip(), swell: (d) => sound.swell(d) }); else { if (line) line.level = 1; await introFallback(); rise(); }
      lenis?.start(); introOn = false;
    }
  } else await arrive();
  started = true; startType();
  addEventListener('load', () => { depth.measure(); ScrollTrigger.refresh(); });
})();
