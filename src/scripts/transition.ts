// Transición entre páginas: una ola cubre la pantalla, se escribe el nombre de la página de destino y se navega.
import gsap from 'gsap';
import { typeInto } from './type';

const cur = document.querySelector<HTMLElement>('.curtain'), path = cur?.querySelector('path'), nameEl = cur?.querySelector<HTMLElement>('.curtain-name');
const shape = (top: number, bot: number, a: number) => `M0 ${top + a} C 28 ${top - a} 62 ${top + a * 1.4} 100 ${top - a * 0.6} L100 ${bot - a * 0.6} C 62 ${bot + a * 1.4} 28 ${bot - a} 0 ${bot + a} Z`;
const NAMES: Record<string, string> = { '/': 'Ceto Studio', '/portfolio': 'Portfolio', '/servicios': 'Servicios', '/ia': 'IA', '/nosotros': 'Nosotros' };
const norm = (p: string) => p.replace(/\/$/, '') || '/';

export function initTransitions() {
  if (!cur || !path || !nameEl || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.origin !== location.origin) return;
    if (norm(a.pathname) === norm(location.pathname)) return;   // mismo documento: lo maneja el scroll suave
    e.preventDefault();
    const o = { top: 112, a: 7 };
    cur.style.visibility = 'visible'; nameEl.style.opacity = '1'; nameEl.textContent = '';
    gsap.to(o, { top: -14, a: 0, duration: 0.8, ease: 'power3.inOut', onUpdate: () => path.setAttribute('d', shape(o.top, 114, o.a)) });
    gsap.delayedCall(0.42, () => typeInto(nameEl, NAMES[norm(a.pathname)] || 'Ceto Studio', 55));
    gsap.delayedCall(1.15, () => { try { sessionStorage.setItem('ceto-nav', '1'); } catch {} location.href = a.href; });
  });
  addEventListener('pageshow', (e) => { if ((e as PageTransitionEvent).persisted) { cur.style.visibility = 'hidden'; } });
}

/** Al llegar desde otra página: el telón ya cubre la pantalla y se retira hacia arriba. */
export function arrive(): Promise<void> {
  return new Promise((res) => {
    const root = document.documentElement;
    if (!cur || !path || !root.classList.contains('arriving')) { res(); return; }
    const o = { bot: 114, a: 0 };
    path.setAttribute('d', shape(-14, 114, 0)); cur.style.visibility = 'visible';
    nameEl!.textContent = NAMES[norm(location.pathname)] || ''; nameEl!.style.opacity = '1';
    gsap.to(nameEl, { opacity: 0, duration: 0.3, delay: 0.1 });
    gsap.to(o, { bot: -14, a: 7, duration: 0.85, delay: 0.15, ease: 'power3.inOut', onUpdate: () => path.setAttribute('d', shape(-14, o.bot, o.a)), onComplete: () => { cur.style.visibility = 'hidden'; root.classList.remove('arriving'); } });
    gsap.delayedCall(0.45, res);
  });
}
