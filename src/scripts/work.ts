// Portfolio: tarjetas de vidrio que se apilan con el scroll (escritorio) y una miniatura que rebota en el título.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initWork() {
  const stage = document.querySelector<HTMLElement>('.wk-stage'); if (!stage) return;
  const cards = gsap.utils.toArray<HTMLElement>('.wk-card'), n = cards.length;
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ease = gsap.parseEase('power3.out'), title = stage.querySelector<HTMLElement>('.wk-title')!;
    const render = (prog: number) => {
      const p = prog * (n + 0.55), off = innerWidth * 0.5 + cards[0].offsetWidth * 0.5 + 60;
      cards.forEach((c, i) => {
        const inP = Math.min(1, Math.max(0, p - i)), e = ease(inP), behind = Math.max(0, p - i - 1);
        const x = (1 - e) * off - Math.min(behind, 4) * 13, y = 0;
        gsap.set(c, { xPercent: -50, yPercent: -50, x, y });
        (c.querySelector('.wk-dim') as HTMLElement).style.opacity = String(Math.min(0.62, behind * 0.4));
        c.dataset.covered = behind > 0.92 ? '1' : '0';
        c.style.pointerEvents = behind > 0.5 || inP < 0.6 ? 'none' : 'auto';
      });
    };
    const st = ScrollTrigger.create({ trigger: stage, start: 'top top', end: () => '+=' + innerHeight * (0.78 * (n + 0.55)), pin: true, scrub: 0.6, anticipatePin: 1, onUpdate: (s) => render(s.progress), onRefresh: (s) => render(s.progress) });
    render(0);
    // inclinación y brillo que siguen al mouse
    const offs: (() => void)[] = [];
    cards.forEach((c) => {
      const g = c.querySelector<HTMLElement>('.wk-glass')!;
      const rx = gsap.quickTo(g, 'rotationX', { duration: 0.5, ease: 'power3.out' }), ry = gsap.quickTo(g, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      gsap.set(g, { transformPerspective: 1100 });
      const move = (e: PointerEvent) => { const r = g.getBoundingClientRect(), u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height; ry((u - 0.5) * 7); rx((0.5 - v) * 5); g.style.setProperty('--lx', u * 100 + '%'); g.style.setProperty('--ly', v * 100 + '%'); };
      const leave = () => { gsap.to(g, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1,.45)' }); };
      g.addEventListener('pointermove', move); g.addEventListener('pointerleave', leave);
      offs.push(() => { g.removeEventListener('pointermove', move); g.removeEventListener('pointerleave', leave); });
    });
    return () => { st.kill(); offs.forEach((f) => f()); cards.forEach((c) => { gsap.set(c, { clearProps: 'all' }); c.style.pointerEvents = ''; }); };
  });
}
