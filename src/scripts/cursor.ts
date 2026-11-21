// Cursor propio (punto + aro que invierte colores) y botones magnéticos.
import gsap from 'gsap';
import { typeInto } from './type';

export function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const dot = document.querySelector<HTMLElement>('.cur-dot'), ring = document.querySelector<HTMLElement>('.cur-ring');
  if (!dot || !ring) return;
  const label = ring.querySelector<HTMLElement>('.cur-label')!;
  const dx = gsap.quickSetter(dot, 'x', 'px'), dy = gsap.quickSetter(dot, 'y', 'px');
  const rx = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' });
  let cur = '';
  addEventListener('pointermove', (e) => {
    document.documentElement.classList.add('has-cursor');
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button') as HTMLElement | null;
    const text = t?.dataset.cursor || '';
    const hot = text ? '2' : t ? '1' : '0';
    if (ring.dataset.hot !== hot) ring.dataset.hot = hot;
    if (text !== cur) { cur = text; if (text) typeInto(label, text, 38); else label.textContent = ''; }
  }, { passive: true });
  document.addEventListener('pointerleave', () => document.documentElement.classList.remove('has-cursor'));

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,.5)' }), my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,.5)' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.28); my((e.clientY - r.top - r.height / 2) * 0.4); });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}
