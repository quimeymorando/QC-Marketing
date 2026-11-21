// Sonido opcional (apagado por defecto): ambiente submarino generado por código que se vuelve más grave con la profundidad,
// canto real de ballena jorobada (NOAA PMEL) y ping de sonar sintetizado.
export function initSound(getDepth: () => number) {
  const btns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sound]'));
  let ctx: AudioContext | null = null, on = false, master: GainNode, lp: BiquadFilterNode, deep: GainNode, surf: GainNode, wet: GainNode;
  const songs: AudioBuffer[] = []; let nextSong = 0, timer = 0;

  function build() {
    const AC = window.AudioContext || (window as any).webkitAudioContext; ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    // eco largo: bajo el agua el sonido viaja lejos
    const dl = ctx.createDelay(1.5), fb = ctx.createGain(), dlp = ctx.createBiquadFilter(); wet = ctx.createGain();
    dl.delayTime.value = 0.46; fb.gain.value = 0.42; dlp.type = 'lowpass'; dlp.frequency.value = 1500; wet.gain.value = 0.5;
    wet.connect(dl); dl.connect(dlp); dlp.connect(fb); fb.connect(dl); dlp.connect(master);
    // ruido marrón: el fondo del mar
    const len = ctx.sampleRate * 7, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0); let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.4; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; deep = ctx.createGain(); deep.gain.value = 0.2;
    src.connect(lp); lp.connect(deep); deep.connect(master); src.start();
    // oleaje en la superficie
    const wlen = ctx.sampleRate * 5, wb = ctx.createBuffer(1, wlen, ctx.sampleRate), wd = wb.getChannelData(0);
    for (let i = 0; i < wlen; i++) wd[i] = (Math.random() * 2 - 1) * (0.35 + 0.65 * Math.pow(Math.sin((i / wlen) * Math.PI * 2) * 0.5 + 0.5, 2));
    const ws = ctx.createBufferSource(); ws.buffer = wb; ws.loop = true; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 620; bp.Q.value = 0.5;
    surf = ctx.createGain(); surf.gain.value = 0; ws.connect(bp); bp.connect(surf); surf.connect(master); ws.start();
    for (const f of ['/audio/ballena-1.mp3', '/audio/ballena-2.mp3']) fetch(f).then((r) => r.arrayBuffer()).then((a) => ctx!.decodeAudioData(a)).then((b) => songs.push(b)).catch(() => {});
  }
  function tick() {
    if (!ctx || !on) return;
    const d = getDepth(), k = Math.min(1, Math.log10(1 + d) / 3.6), t = ctx.currentTime;
    lp.frequency.setTargetAtTime(1100 - 900 * k, t, 0.6); deep.gain.setTargetAtTime(0.14 + 0.16 * k, t, 0.6);
    surf.gain.setTargetAtTime(d < 1 ? 0.07 : 0.07 * Math.exp(-d / 12), t, 0.5);
    if (d > 15 && performance.now() > nextSong) song();
  }
  function song() {
    if (!ctx || !on || !songs.length) return;
    const s = ctx.createBufferSource(); s.buffer = songs[Math.floor(Math.random() * songs.length)]; s.playbackRate.value = 0.86 + Math.random() * 0.2;
    const g = ctx.createGain(); g.gain.value = 0.5; s.connect(g); g.connect(master); g.connect(wet); s.start();
    nextSong = performance.now() + 26000 + Math.random() * 30000;
  }
  function ping(vol = 0.3) {
    if (!ctx || !on) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(1180, t); o.frequency.exponentialRampToValueAtTime(1085, t + 1.2);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0008, t + 1.5);
    o.connect(g); g.connect(master); g.connect(wet); o.start(t); o.stop(t + 1.6);
  }
  // gota que toca el mar: un tono que sube muy rápido (el "plip") con un cuerpo grave debajo
  function drip() {
    if (!ctx || !on) return;
    const t = ctx.currentTime + 0.01;
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(380, t); o.frequency.exponentialRampToValueAtTime(1650, t + 0.075);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.55, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.2);
    o.connect(g); g.connect(master); g.connect(wet); o.start(t); o.stop(t + 0.25);
    const o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.type = 'sine';
    o2.frequency.setValueAtTime(210, t); o2.frequency.exponentialRampToValueAtTime(82, t + 0.3);
    g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(0.4, t + 0.012); g2.gain.exponentialRampToValueAtTime(0.0008, t + 0.42);
    o2.connect(g2); g2.connect(master); o2.start(t); o2.stop(t + 0.5);
  }
  // agua que sube: ruido filtrado que crece, pasa por encima y queda sordo, como al hundir la cabeza
  function swell(dur = 2.2) {
    if (!ctx || !on) return;
    const t = ctx.currentTime, len = Math.ceil(ctx.sampleRate * (dur + 0.6)), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 0.8;
    f.frequency.setValueAtTime(260, t); f.frequency.exponentialRampToValueAtTime(1900, t + dur * 0.55); f.frequency.exponentialRampToValueAtTime(320, t + dur + 0.5);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.17, t + dur * 0.5); g.gain.exponentialRampToValueAtTime(0.0008, t + dur + 0.55);
    src.connect(f); f.connect(g); g.connect(master); src.start(t);
  }
  function set(v: boolean) {
    on = v;
    if (v && !ctx) build();
    if (ctx) { if (v) ctx.resume(); master.gain.setTargetAtTime(v ? 1 : 0, ctx.currentTime, v ? 0.5 : 0.12); }
    btns.forEach((b) => { b.setAttribute('aria-pressed', String(v)); const s = b.querySelector('[data-sound-state]'); if (s) s.textContent = v ? 'sí' : 'no'; });
    clearInterval(timer); if (v) { nextSong = performance.now() + 5000; timer = window.setInterval(tick, 250); tick(); }
    try { sessionStorage.setItem('ceto-sound', v ? '1' : '0'); } catch {}
  }
  btns.forEach((b) => b.addEventListener('click', () => set(!on)));
  document.addEventListener('visibilitychange', () => { if (ctx && on) master.gain.setTargetAtTime(document.hidden ? 0 : 1, ctx.currentTime, 0.2); });
  return { ping, song, drip, swell, set, get on() { return on; } };
}
