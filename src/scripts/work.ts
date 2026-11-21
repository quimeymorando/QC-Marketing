// Portfolio: tarjetas de vidrio que se apilan con el scroll (escritorio) y una miniatura que rebota en el título.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initWork() {
  const stage = document.querySelector<HTMLElement>('.wk-stage'); if (!stage) return;
  const cards = gsap.utils.toArray<HTMLElement>('.wk-card'), n = cards.length;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const ease = gsap.parseEase('power3.out'), title = stage.querySelector<HTMLElement>('.wk-title')!;
    const render = (prog: number) => {
      const p = prog * (n + 0.55), off = innerWidth * 0.5 + cards[0].offsetWidth * 0.5 + 60;
      cards.forEach((c, i) => {
        const inP = Math.min(1, Math.max(0, p - i)), e = ease(inP), behind = Math.max(0, p - i - 1);
        const x = (1 - e) * off - Math.min(behind, 4) * 18, y = (1 - e) * 46 - Math.min(behind, 4) * 7;
        gsap.set(c, { xPercent: -50, yPercent: -50, x, y, rotate: (1 - e) * 5, scale: 1 - Math.min(behind, 4) * 0.022 });
        (c.querySelector('.wk-dim') as HTMLElement).style.opacity = String(Math.min(0.62, behind * 0.4));
        c.dataset.covered = behind > 0.92 ? '1' : '0';
        c.style.pointerEvents = behind > 0.5 || inP < 0.6 ? 'none' : 'auto';
      });
      title.style.opacity = String(1 - Math.min(0.72, Math.max(0, p - 0.35) * 0.9));
    };
    const st = ScrollTrigger.create({ trigger: stage, start: 'top top', end: () => '+=' + innerHeight * (0.78 * (n + 0.55)), pin: true, scrub: 0.6, anticipatePin: 1, onUpdate: (s) => render(s.progress), onRefresh: (s) => render(s.progress) });
    render(0);
    // inclinación y brillo que siguen al mouse
    const offs: (() => void)[] = [];
    cards.forEach((c) => {
      const g = c.querySelector<HTMLElement>('.wk-glass')!;
      const rx = gsap.quickTo(g, 'rotationX', { duration: 0.5, ease: 'power3.out' }), ry = gsap.quickTo(g, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      gsap.set(g, { transformPerspective: 1100 });
      const move = (e: PointerEvent) => { const r = g.getBoundingClientRect(), u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height; ry((u - 0.5) * 9); rx((0.5 - v) * 7); g.style.setProperty('--lx', u * 100 + '%'); g.style.setProperty('--ly', v * 100 + '%'); };
      const leave = () => { gsap.to(g, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1,.45)' }); };
      g.addEventListener('pointermove', move); g.addEventListener('pointerleave', leave);
      offs.push(() => { g.removeEventListener('pointermove', move); g.removeEventListener('pointerleave', leave); });
    });
    // miniatura que rebota (como el logo del DVD) y cambia de caso en cada choque
    const thumb = stage.querySelector<HTMLElement>('.wk-thumb'), frames = thumb ? Array.from(thumb.children) as HTMLElement[] : [];
    let x = innerWidth * 0.46, y = innerHeight * 0.3, vx = 1.5, vy = 1.1, k = 0, on = false;
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting)); io.observe(stage);
    const tick = () => {
      if (!on || !thumb) return;
      const w = thumb.offsetWidth, h = thumb.offsetHeight, W = stage.clientWidth, H = stage.clientHeight; let hit = false;
      x += vx; y += vy;
      if (x < 12 || x > W - w - 12) { vx *= -1; x = Math.min(W - w - 12, Math.max(12, x)); hit = true; }
      if (y < 84 || y > H - h - 70) { vy *= -1; y = Math.min(H - h - 70, Math.max(84, y)); hit = true; }
      if (hit && frames.length) { frames[k].hidden = true; k = (k + 1) % frames.length; frames[k].hidden = false; }
      thumb.style.transform = `translate3d(${x}px,${y}px,0) rotate(${vx * 2.2}deg)`;
    };
    gsap.ticker.add(tick);
    return () => { st.kill(); gsap.ticker.remove(tick); io.disconnect(); offs.forEach((f) => f()); cards.forEach((c) => { gsap.set(c, { clearProps: 'all' }); c.style.pointerEvents = ''; }); };
  });
}
