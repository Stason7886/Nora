let ctx = null;
let master = null;
let tickTimer = null;
let purrNodes = null;
let enabled = false;
let tickIdx = 0;
const listeners = new Set();

const noiseBuffer = (seconds, brown = false) => {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
  }
  return buf;
};

const tick = () => {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(0.03);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = tickIdx++ % 2 ? 2300 : 3200;
  bp.Q.value = 6;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + 0.04);
};

const notify = () => listeners.forEach((fn) => fn(enabled));

export const onSoundChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const isSoundOn = () => enabled;

export const setSound = (on) => {
  if (on === enabled) return;
  enabled = on;
  if (on) {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    ctx.resume();
    master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.2);
    tickTimer = setInterval(tick, 1000);
  } else {
    clearInterval(tickTimer);
    purr(false);
    if (master) master.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
  }
  notify();
};

export const purr = (on) => {
  if (on && enabled && !purrNodes) {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(4, true);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    const amp = ctx.createGain();
    amp.gain.value = 0.5;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 26;
    const depth = ctx.createGain();
    depth.gain.value = 0.5;
    lfo.connect(depth).connect(amp.gain);
    const breath = ctx.createOscillator();
    breath.frequency.value = 0.45;
    const bDepth = ctx.createGain();
    bDepth.gain.value = 0.25;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.9, t + 0.8);
    breath.connect(bDepth).connect(out.gain);
    src.connect(lp).connect(amp).connect(out).connect(master);
    src.start(); lfo.start(); breath.start();
    purrNodes = { src, lfo, breath, out };
  } else if (!on && purrNodes) {
    const { src, lfo, breath, out } = purrNodes;
    const t = ctx.currentTime;
    out.gain.cancelScheduledValues(t);
    out.gain.setValueAtTime(out.gain.value, t);
    out.gain.linearRampToValueAtTime(0, t + 1.2);
    [src, lfo, breath].forEach((n) => n.stop(t + 1.3));
    purrNodes = null;
  }
};
