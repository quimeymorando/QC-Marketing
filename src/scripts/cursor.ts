// Cursor propio (una cruz de posición que invierte colores y se abre en mira sobre lo clicable) y botones magnéticos.
import gsap from 'gsap';
import { typeInto } from './type';

export function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cur = document.querySelector<HTMLElement>('.cur');
  if (!cur) return;
  const label = cur.querySelector<HTMLElement>('.cur-label')!;
  const sx = gsap.quickSetter(cur, 'x', 'px'), sy = gsap.quickSetter(cur, 'y', 'px');
  let text0 = '';
  addEventListener('pointermove', (e) => {
    document.documentElement.classList.add('has-cursor');
    sx(e.clientX); sy(e.clientY);
    const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button') as HTMLElement | null;
    const text = t?.dataset.cursor || '';
    const hot = text ? '2' : t ? '1' : '0';
    if (cur.dataset.hot !== hot) cur.dataset.hot = hot;
    if (text !== text0) { text0 = text; if (text) typeInto(label, text, 38); else label.textContent = ''; }
  }, { passive: true });
  addEventListener('pointerdown', () => (cur.dataset.down = '1'), { passive: true });
  addEventListener('pointerup', () => (cur.dataset.down = '0'), { passive: true });
  document.addEventListener('pointerleave', () => document.documentElement.classList.remove('has-cursor'));

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,.5)' }), my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,.5)' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.28); my((e.clientY - r.top - r.height / 2) * 0.4); });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}
