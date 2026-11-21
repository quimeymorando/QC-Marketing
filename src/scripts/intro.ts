// Intro: una gota cae por el centro, toca el mar y el agua sube revelando "Ceto Studio".
// Después el nombre se disuelve como tinta, el agua baja y el mar del hero sube hasta el título.
import gsap from 'gsap';
import type { Water } from './water';
import type { Waterline } from './waterline';

export function playIntro(water: Water, line: Waterline | null, onHero: () => void): Promise<void> {
  return new Promise((resolve) => {
    const s = water.state, vh = innerHeight, vw = innerWidth;
    if (line) line.level = 0;
    const sea = line ? 1 - (line.surfPage() - scrollY) / vh : 0.1;
    Object.assign(s, { intro: 1, sea, level: sea, impactT: -1, dropY: 1.12, dropOn: 0, dropStretch: 1, dissolve: 0, tintA: 1, nameA: 1 });
    water.drawName();
    const IMPACT = 1.5;
    const tick = () => { const tt = tl.time(); s.impactT = tt > IMPACT ? tt - IMPACT : -1; };
    const tl = gsap.timeline({ onComplete() { gsap.ticker.remove(tick); s.intro = 0; s.impactT = -1; off(); onHero(); resolve(); } });
    gsap.ticker.add(tick); (window as any).__intro = tl;
    tl.set(s, { dropOn: 1 }, 0.45)
      .to(s, { dropY: sea + 0.012, duration: 1.05, ease: 'power2.in' }, 0.45)
      .to(s, { dropStretch: 1.75, duration: 1.05, ease: 'power2.in' }, 0.45)
      .add(() => { s.dropOn = 0; line?.splash(vw / 2, 15); water.drop(vw / 2, vh * (1 - sea), 0.07, 0.09); }, IMPACT)
      .to(s, { level: 1.1, duration: 2.1, ease: 'power2.inOut' }, IMPACT + 0.12)
      .add(() => { for (let i = 0; i < 6; i++) gsap.delayedCall(i * 0.3, () => water.drop(vw * (0.2 + Math.random() * 0.6), vh * (0.3 + Math.random() * 0.5), 0.04, 0.03)); }, IMPACT + 0.4)
      // el nombre queda un momento quieto antes de irse
      .to(s, { dissolve: 1, duration: 1.0, ease: 'power1.in' }, 4.9)
      .to(s, { level: sea, duration: 1.05, ease: 'power3.inOut' }, 5.05)
      .to(s, { tintA: 0, duration: 0.3, ease: 'power1.in' }, 5.8)
      .add(() => { document.documentElement.classList.remove('intro'); }, 5.85)
      .to({}, { duration: 0.02 }, 6.1);
    if (location.search.includes('intro=pausa')) tl.pause();   // para revisar la intro cuadro por cuadro
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
