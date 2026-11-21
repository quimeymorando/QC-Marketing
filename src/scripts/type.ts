// Motor de texto "lectura de sonar": el texto aparece letra por letra.
// - [data-tw]            se escribe cuando entra en pantalla
// - data-tw-step="58"    ms por letra (si no, depende del tamaño de la letra)
// - data-tw-caret        "end" (cursor mientras escribe) | "stay" (queda parpadeando)
// - data-tw-name / data-tw-after   encadena textos (primero el título, después la bajada)
// - [data-tw-scrub]      avanza con el scroll en vez de escribirse solo

type Item = {
  el: HTMLElement; chars: HTMLElement[]; ms: number; caret: string | null;
  name?: string; after?: string; visible: boolean; start: number; shown: number; done: boolean; doneAt: number;
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const seg = 'Segmenter' in Intl ? new (Intl as any).Segmenter('es', { granularity: 'grapheme' }) : null;
const graphemes = (s: string): string[] => (seg ? Array.from(seg.segment(s), (x: any) => x.segment) : Array.from(s));

const items: Item[] = [];
const byName = new Map<string, Item>();
const scrubs: { el: HTMLElement; chars: HTMLElement[]; shown: number }[] = [];
let started = false;
let onChange: (el: HTMLElement) => void = () => {};
const caretEl = () => { const k = document.createElement('span'); k.className = 'tw-k'; k.setAttribute('aria-hidden', 'true'); k.textContent = '\u2060'; return k; };

function split(el: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        const txt = (child.textContent || '').replace(/\s+/g, ' ');
        if (!txt.trim() && !txt.length) continue;
        const frag = document.createDocumentFragment();
        for (const g of graphemes(txt)) {
          const s = document.createElement('span'); s.className = 'tw-c'; s.textContent = g; frag.appendChild(s); out.push(s);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && (child as HTMLElement).tagName !== 'BR') walk(child);
    }
  };
  // texto completo para lectores de pantalla; las letras sueltas quedan ocultas para ellos
  const full = (el.textContent || '').replace(/\s+/g, ' ').trim();
  walk(el);
  // los espacios sobrantes al principio y al final no cuentan como letras
  while (out.length && !out[0].textContent!.trim()) out.shift()!.remove();
  while (out.length && !out[out.length - 1].textContent!.trim()) out.pop()!.remove();
  if (!el.hasAttribute('aria-label') && full) {
    const wrap = document.createElement('span'); wrap.setAttribute('aria-hidden', 'true'); wrap.style.display = 'contents';
    while (el.firstChild) wrap.appendChild(el.firstChild);
    const sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = full;
    el.append(sr, wrap);
  }
  return out;
}

function placeCaret(it: { el: HTMLElement; chars: HTMLElement[] }, k: HTMLElement, n: number) {
  const c = it.chars[Math.max(0, n - 1)];
  if (!c) return;
  if (n <= 0) c.before(k); else c.after(k);
}

function finish(it: Item, now: number) {
  for (const c of it.chars) c.classList.add('on');
  it.shown = it.chars.length; it.done = true; it.doneAt = now;
  const k = it.el.querySelector<HTMLElement>('.tw-k');
  if (k) { if (it.caret === 'stay') placeCaret(it, k, it.chars.length); else setTimeout(() => k.remove(), 700); }
  onChange(it.el);
}

function tick(now: number) {
  if (started) {
    for (const it of items) {
      if (it.done) continue;
      if (!it.start) {
        const dep = it.after ? byName.get(it.after) : undefined;
        if (dep && !dep.done) {
          // si el texto del que depende quedó arriba de la pantalla sin escribirse, se completa de una
          if (!dep.start && dep.el.getBoundingClientRect().bottom < 0) finish(dep, now);
          continue;
        }
        if (dep && now - dep.doneAt < 160) continue;
        if (!it.visible) { if (it.el.getBoundingClientRect().bottom < -40) finish(it, now); continue; }
        it.start = now;
        if (it.caret) { const k = caretEl(); placeCaret(it, k, 0); }
      }
      const n = Math.min(it.chars.length, Math.floor((now - it.start) / it.ms) + 1);
      if (n > it.shown) {
        for (let i = it.shown; i < n; i++) it.chars[i].classList.add('on');
        it.shown = n;
        const k = it.el.querySelector<HTMLElement>('.tw-k'); if (k) placeCaret(it, k, n);
        onChange(it.el);
      }
      if (n >= it.chars.length) finish(it, now);
    }
  }
  requestAnimationFrame(tick);
}

function scrubUpdate() {
  const vh = innerHeight;
  for (const s of scrubs) {
    const r = s.el.getBoundingClientRect();
    const a = vh * 0.84, b = vh * 0.46;
    const p = Math.min(1, Math.max(0, (a - r.top) / (r.height + a - b)));
    const n = Math.round(p * s.chars.length);
    if (n === s.shown) continue;
    const lo = Math.max(0, Math.min(n, s.shown) - 6), hi = Math.min(s.chars.length, Math.max(n, s.shown) + 6);
    for (let i = lo; i < hi; i++) {
      const c = s.chars[i]; c.classList.toggle('on', i < n); c.classList.toggle('pre', i >= n && i < n + 5);
    }
    s.shown = n;
    let k = s.el.querySelector<HTMLElement>('.tw-k');
    if (!k) { k = caretEl(); }
    if (n > 0 && n < s.chars.length) placeCaret(s, k, n); else if (n >= s.chars.length) placeCaret(s, k, s.chars.length); else k.remove();
  }
}

export function initType(opts: { onChange?: (el: HTMLElement) => void } = {}) {
  if (opts.onChange) onChange = opts.onChange;
  if (reduce) return;
  const io = new IntersectionObserver((es) => {
    for (const e of es) { const it = (e.target as any).__tw as Item; if (it) it.visible = e.isIntersecting || it.visible; }
  }, { rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll<HTMLElement>('[data-tw]').forEach((el) => {
    const chars = split(el); if (!chars.length) return;
    const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    let ms = el.dataset.twStep ? +el.dataset.twStep : Math.min(38, Math.max(4, fs * 0.5));
    if (!el.dataset.twStep) ms = Math.min(1000, Math.max(260, ms * chars.length)) / chars.length;
    ms = Math.min(ms, 2400 / chars.length);
    const it: Item = { el, chars, ms, caret: el.dataset.twCaret ?? null, name: el.dataset.twName, after: el.dataset.twAfter, visible: false, start: 0, shown: 0, done: false, doneAt: 0 };
    (el as any).__tw = it; items.push(it); if (it.name) byName.set(it.name, it);
    io.observe(el);
  });

  document.querySelectorAll<HTMLElement>('[data-tw-scrub]').forEach((el) => {
    scrubs.push({ el, chars: split(el), shown: -1 });
  });
  if (scrubs.length) { addEventListener('scroll', scrubUpdate, { passive: true }); addEventListener('resize', scrubUpdate); scrubUpdate(); }
  requestAnimationFrame(tick);
}

export function startType() { started = true; }

/** Escribe un texto corto en un elemento (cursor, telón de transición). */
export function typeInto(el: HTMLElement, text: string, ms = 45): Promise<void> {
  return new Promise((res) => {
    if (reduce) { el.textContent = text; res(); return; }
    const gs = graphemes(text); let i = 0; el.textContent = '';
    const id = setInterval(() => { el.textContent = gs.slice(0, ++i).join(''); if (i >= gs.length) { clearInterval(id); res(); } }, ms);
    (el as any).__ty && clearInterval((el as any).__ty); (el as any).__ty = id;
  });
}
