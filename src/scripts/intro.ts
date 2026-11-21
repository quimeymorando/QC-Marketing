// Intro: se elige el sonido, una gota cae por el centro, toca el mar y el agua sube revelando "Ceto Studio".
// Mientras sube, el logo se dibuja trazo por trazo. Después el nombre se disuelve como tinta, el logo viaja a su lugar
// en el menú, el agua baja y el mar del hero sube hasta el título.
import gsap from 'gsap';
import type { Water } from './water';
import type { Waterline } from './waterline';

type Opts = { ask?: () => Promise<void>; drip?: () => void; swell?: (s: number) => void };

export async function playIntro(water: Water, line: Waterline | null, onHero: () => void, opts: Opts = {}): Promise<void> {
  const s = water.state, vh = innerHeight, vw = innerWidth;
  if (line) line.level = 0;
  const sea = line ? 1 - (line.surfPage() - scrollY) / vh : 0.1;
  Object.assign(s, { intro: 1, sea, level: sea, impactT: -1, dropY: 1.12, dropOn: 0, dropStretch: 1, dissolve: 0, tintA: 1, nameA: 1 });
  const name = water.drawName();
  // logo: arriba del nombre, sin dibujar todavía
  const logo = document.querySelector<SVGSVGElement>('.intro-logo'), paths = logo ? Array.from(logo.querySelectorAll('path')) : [];
  const lw = Math.min(vw * 0.34, name.fs * 0.86), lh = lw * (578 / 1048), lx = (vw - lw) / 2, ly = Math.max(56, name.top - lh - name.fs * 0.3);
  if (logo) { gsap.set(logo, { x: lx, y: ly, width: lw, height: lh, scale: 1, opacity: 1, color: '#0E3448', transformOrigin: '0 0' }); gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 }); }
  const paused = location.search.includes('intro=pausa');
  if (opts.ask && !paused) await opts.ask();   // la primera vez de la visita: con o sin sonido, antes de que caiga la gota

  return new Promise((resolve) => {
    const IMPACT = 1.5;
    const tick = () => { const tt = tl.time(); s.impactT = tt > IMPACT ? tt - IMPACT : -1; };
    const tl = gsap.timeline({ onComplete() { gsap.ticker.remove(tick); s.intro = 0; s.impactT = -1; off(); if (logo) gsap.set(logo, { opacity: 0 }); onHero(); resolve(); } });
    gsap.ticker.add(tick); (window as any).__intro = tl;
    tl.set(s, { dropOn: 1 }, 0.45)
      .to(s, { dropY: sea + 0.012, duration: 1.05, ease: 'power2.in' }, 0.45)
      .to(s, { dropStretch: 1.75, duration: 1.05, ease: 'power2.in' }, 0.45)
      .add(() => { s.dropOn = 0; line?.splash(vw / 2, 15); water.drop(vw / 2, vh * (1 - sea), 0.07, 0.09); opts.drip?.(); }, IMPACT)
      .add(() => opts.swell?.(2.3), IMPACT + 0.1)
      .to(s, { level: 1.1, duration: 2.1, ease: 'power2.inOut' }, IMPACT + 0.12)
      .add(() => { for (let i = 0; i < 6; i++) gsap.delayedCall(i * 0.3, () => water.drop(vw * (0.2 + Math.random() * 0.6), vh * (0.3 + Math.random() * 0.5), 0.04, 0.03)); }, IMPACT + 0.4);
    // el logo se dibuja cuando el agua llega a su altura
    if (paths.length) tl.to(paths, { strokeDashoffset: 0, duration: 1.15, ease: 'power2.inOut', stagger: 0.14 }, IMPACT + 1.35);
    // el nombre queda un momento quieto antes de irse
    tl.to(s, { dissolve: 1, duration: 1.0, ease: 'power1.in' }, 5.0)
      .to(s, { level: sea, duration: 1.05, ease: 'power3.inOut' }, 5.15)
      .to(s, { tintA: 0, duration: 0.3, ease: 'power1.in' }, 5.9);
    // el logo viaja a su lugar en el menú y se funde con el de verdad
    const nav = document.querySelector<SVGElement>('.nav-logo svg')?.getBoundingClientRect();
    if (logo && nav && nav.width) tl.to(logo, { x: nav.left, y: nav.top, scale: nav.width / lw, color: '#04070B', duration: 1.05, ease: 'power3.inOut' }, 5.0);
    tl.add(() => { document.documentElement.classList.remove('intro'); }, 5.95);
    if (logo) tl.to(logo, { opacity: 0, duration: 0.3, ease: 'none' }, 6.2);
    tl.to({}, { duration: 0.02 }, 6.5);
    if (paused) tl.pause();   // para revisar la intro cuadro por cuadro
    const skip = () => tl.timeScale(4);
    const evs = ['pointerdown', 'wheel', 'keydown', 'touchstart'] as const;
    evs.forEach((e) => addEventListener(e, skip, { passive: true }));
    const off = () => evs.forEach((e) => removeEventListener(e, skip));
  });
}

/** Sin WebGL: el nombre aparece y se va con un fundido simple. */
export function introFallback(): Promise<void> {
  return new Promise((res) => {
    const d = document.createElement('div'); d.className = 'intro-fallback'; d.textContent = 'Ceto Studio'; document.body.appendChild(d);
    setTimeout(() => { document.documentElement.classList.remove('intro'); }, 1500);
    setTimeout(() => { d.remove(); res(); }, 2250);
  });
}
