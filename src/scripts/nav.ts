// Menú: se esconde al bajar y vuelve al subir. En móvil abre a pantalla completa.
export function initNav(onMenu: (open: boolean) => void) {
  const nav = document.querySelector<HTMLElement>('.nav'), burger = document.querySelector<HTMLButtonElement>('.nav-burger');
  const root = document.documentElement; let last = 0;
  const onScroll = (y: number) => {
    if (!nav) return;
    if (y > 140 && y > last + 4) nav.dataset.hide = '1'; else if (y < last - 4 || y < 140) nav.dataset.hide = '0';
    last = y;
  };
  const setMenu = (open: boolean) => {
    root.classList.toggle('menu-open', open); burger?.setAttribute('aria-expanded', String(open)); burger?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.querySelector('main')?.toggleAttribute('inert', open); onMenu(open);
  };
  burger?.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.querySelectorAll('.menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  return { onScroll };
}
