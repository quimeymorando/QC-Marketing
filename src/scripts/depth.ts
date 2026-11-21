// Profundidad: depende de la posición del scroll. Define el color de fondo, el medidor y cuánto plancton hay.
const STOPS: [number, number[]][] = [[0, [14, 52, 72]], [30, [14, 52, 72]], [200, [10, 28, 43]], [1000, [6, 13, 20]], [4000, [3, 5, 8]]];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const colorAt = (d: number) => {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [d0, c0] = STOPS[i], [d1, c1] = STOPS[i + 1];
    if (d <= d1) { const t = Math.max(0, (d - d0) / (d1 - d0)); return c0.map((v, k) => Math.round(lerp(v, c1[k], t))); }
  }
  return STOPS[STOPS.length - 1][1];
};
const zone = (d: number) => (d < 10 ? 'Superficie' : d < 200 ? 'Zona de luz' : d < 1000 ? 'Zona crepuscular' : d < 3950 ? 'Abismo' : 'Fondo del mar');

export function createDepth(surfPage: () => number) {
  const root = document.documentElement;
  const fixed = root.dataset.page !== 'home' ? +(root.dataset.depth || 300) : null;
  const mEl = document.getElementById('meter-m'), zEl = document.getElementById('meter-z'), dot = document.getElementById('meter-dot');
  let marks: { y: number; d: number }[] = [], value = 0, lastTxt = '';
  function measure() {
    marks = [{ y: surfPage(), d: 0 }];
    document.querySelectorAll<HTMLElement>('main [data-depth], footer[data-depth]').forEach((el) => {
      const d = +el.dataset.depth!; if (!d || el.hidden) return;
      const r = el.getBoundingClientRect(); marks.push({ y: r.top + scrollY + r.height * 0.5, d });
    });
    marks.sort((a, b) => a.y - b.y);
  }
  function update(scroll: number) {
    if (fixed !== null) value = fixed;
    else {
      const y = scroll + innerHeight * 0.5;
      if (y <= marks[0].y) value = 0;
      else {
        value = marks[marks.length - 1].d;
        for (let i = 0; i < marks.length - 1; i++) if (y <= marks[i + 1].y) { value = lerp(marks[i].d, marks[i + 1].d, (y - marks[i].y) / (marks[i + 1].y - marks[i].y)); break; }
      }
    }
    const end = scroll + innerHeight >= document.documentElement.scrollHeight - 90 ? '1' : '0'; if (root.dataset.end !== end) root.dataset.end = end;
    const c = colorAt(value);
    root.style.setProperty('--bg', `rgb(${c})`);
    const txt = String(Math.round(value));
    if (txt !== lastTxt && mEl) { mEl.innerHTML = `<i>${'0'.repeat(Math.max(0, 4 - txt.length))}</i>${txt} m`; lastTxt = txt; zEl!.textContent = zone(value); dot!.style.left = (Math.min(4000, value) / 4000) * 63 + 'px'; }
    return value;
  }
  measure();
  return { measure, update, get value() { return value; }, bio: () => Math.min(1, Math.max(0, (value - 780) / 520)) };
}
