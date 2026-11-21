// Intro: una gota cae por el centro, toca el mar y el agua sube revelando "Ceto Studio".
// Después el nombre se disuelve como tinta y el agua baja hasta la línea de agua del hero.
import gsap from 'gsap';
import type { Water } from './water';
import type { Waterline } from './waterline';

export function playIntro(water: Water, line: Waterline | null): Promise<void> {
  return new Promise((resolve) => {
    const s = water.state, vh = innerHeight, vw = innerWidth;
    const sea = line ? 1 - (line.surfPage() - scrollY) / vh : 0.1;
    Object.assign(s, { intro: 1, sea, level: sea, impactT: -1, dropY: 1.12, dropOn: 0, dropStretch: 1, dissolve: 0, tintA: 1, nameA: 1 });
    water.drawName();
    const IMPACT = 1.04;
    const tick = () => { const tt = tl.time(); s.impactT = tt > IMPACT ? tt - IMPACT : -1; };
    const tl = gsap.timeline({
      onComplete() {
        gsap.ticker.remove(tick); s.intro = 0; s.impactT = -1;
        off(); resolve();
      },
    });
    gsap.ticker.add(tick); (window as any).__intro = tl;
    tl.set(s, { dropOn: 1 }, 0.3)
      .to(s, { dropY: sea + 0.012, duration: 0.74, ease: 'power2.in' }, 0.3)
      .to(s, { dropStretch: 1.75, duration: 0.74, ease: 'power2.in' }, 0.3)
      .add(() => {
        s.dropOn = 0;
        line?.splash(vw / 2, 15);
        water.drop(vw / 2, vh * (1 - sea), 0.07, 0.09);
      }, IMPACT)
      .to(s, { level: 1.1, duration: 1.5, ease: 'power2.inOut' }, 1.12)
      .add(() => { for (let i = 0; i < 5; i++) gsap.delayedCall(i * 0.22, () => water.drop(vw * (0.2 + Math.random() * 0.6), vh * (0.3 + Math.random() * 0.5), 0.04, 0.03)); }, 1.3)
      .to(s, { dissolve: 1, duration: 0.78, ease: 'power1.in' }, 3.02)
      .to(s, { level: sea, duration: 0.86, ease: 'power3.inOut' }, 3.12)
      .to(s, { tintA: 0, duration: 0.3, ease: 'power1.in' }, 3.7)
      .add(() => { document.documentElement.classList.remove('intro'); line?.splash(vw * 0.5, -6); }, 3.72)
      .to({}, { duration: 0.02 }, 4.0);
    if (location.search.includes('intro=pausa')) tl.pause();   // para revisar la intro cuadro por cuadro
    // se puede saltar: cualquier gesto acelera la intro
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
