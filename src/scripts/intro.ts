// Intro en dos actos.
// 1) El agua sube y revela "Ceto Studio"; el logo se dibuja trazo por trazo. Ahí se elige entrar con o sin sonido.
// 2) El nombre se disuelve, el logo viaja al menú y el agua baja. Cae una gota (suena), toca el mar y el mar sube hasta el título.
import gsap from 'gsap';
import type { Water } from './water';
import type { Waterline } from './waterline';

type Opts = { ask?: () => Promise<void>; drip?: () => void; swell?: (s: number) => void; onSea?: () => void };

export function playIntro(water: Water, line: Waterline | null, onHero: () => void, opts: Opts = {}): Promise<void> {
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

  return new Promise((resolve) => {
    const GATE = 3.05, OUT = 3.25, IMPACT = 5.0; let gated = false;
    const tick = () => { const tt = tl.time(); s.impactT = tt > IMPACT ? tt - IMPACT : -1; };
    const tl = gsap.timeline({ onComplete() { gsap.ticker.remove(tick); s.intro = 0; s.impactT = -1; off(); if (logo) gsap.set(logo, { opacity: 0 }); onHero(); resolve(); } });
    gsap.ticker.add(tick); (window as any).__intro = tl;
    // --- acto 1: el agua sube y revela el nombre; el logo se dibuja ---
    tl.add(() => { line?.splash(vw / 2, 7); }, 0.2)
      .to(s, { level: 1.1, duration: 2.1, ease: 'power2.inOut' }, 0.25)
      .add(() => { for (let i = 0; i < 5; i++) gsap.delayedCall(i * 0.3, () => water.drop(vw * (0.2 + Math.random() * 0.6), vh * (0.3 + Math.random() * 0.5), 0.04, 0.03)); }, 0.5);
    if (paths.length) tl.to(paths, { strokeDashoffset: 0, duration: 1.15, ease: 'power2.inOut', stagger: 0.14 }, 1.3);
    // con el nombre ya revelado se elige el sonido (solo la primera vez de la visita)
    tl.add(() => { if (!opts.ask || paused) return; tl.pause(); gated = true; opts.ask().then(() => { gated = false; tl.timeScale(1).play(); }); }, GATE);
    // --- acto 2: se va el nombre, el logo viaja al menú, baja el agua ---
    tl.add(() => opts.swell?.(1.3), OUT)
      .to(s, { dissolve: 1, duration: 0.95, ease: 'power1.in' }, OUT)
      .to(s, { level: sea, duration: 1.05, ease: 'power3.inOut' }, OUT + 0.15)
      .to(s, { tintA: 0, duration: 0.3, ease: 'power1.in' }, OUT + 0.9);
    const nav = document.querySelector<SVGElement>('.nav-logo svg')?.getBoundingClientRect();
    if (logo && nav && nav.width) tl.to(logo, { x: nav.left, y: nav.top, scale: nav.width / lw, color: '#04070B', duration: 1.05, ease: 'power3.inOut' }, OUT);
    // la gota cae, toca el mar (suena) y el mar sube hasta el título
    tl.set(s, { dropOn: 1 }, IMPACT - 1.0)
      .to(s, { dropY: sea + 0.012, duration: 1.0, ease: 'power2.in' }, IMPACT - 1.0)
      .to(s, { dropStretch: 1.75, duration: 1.0, ease: 'power2.in' }, IMPACT - 1.0)
      .add(() => { s.dropOn = 0; line?.splash(vw / 2, 16); opts.drip?.(); document.documentElement.classList.remove('intro'); }, IMPACT)
      .add(() => { opts.swell?.(1.5); opts.onSea?.(); }, IMPACT + 0.12);
    if (logo) tl.to(logo, { opacity: 0, duration: 0.3, ease: 'none' }, IMPACT + 0.25);
    tl.to({}, { duration: 0.02 }, IMPACT + 0.6);   // las gotas de la salpicadura terminan de caer y arranca el título
    if (paused) tl.pause();   // para revisar la intro cuadro por cuadro
    const skip = () => { if (!gated) tl.timeScale(4); };
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
