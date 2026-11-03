let ctx = null;
let master = null;
let enabled = false;
const listeners = new Set();

const noiseBuffer = (seconds) => {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
};

let purrNodes = null;
let unlockEl = null;

const silentWavUrl = () => {
  const sr = 8000, n = 800, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
};

// iOS: silent media element switches audio session to playback so Web Audio ignores the mute switch
const unlockMobileAudio = () => {
  if (!unlockEl) {
    unlockEl = new Audio(silentWavUrl());
    unlockEl.loop = true;
    unlockEl.setAttribute("playsinline", "");
  }
  unlockEl.play().catch(() => {});
};

const notify = () => listeners.forEach((fn) => fn(enabled));

export const onSoundChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const isSoundOn = () => enabled;

export const setSound = (on) => {
  if (on === enabled) return;
  enabled = on;
  if (on) {
    unlockMobileAudio();
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
    }
    ctx.resume();
    master.gain.setTargetAtTime(1.6, ctx.currentTime, 0.2);
    notify();
    purr(true);
    return;
  }
  purr(false);
  if (unlockEl) unlockEl.pause();
  if (master) master.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
  notify();
};

const band = (freq, q, gain) => {
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass"; bp.frequency.value = freq; bp.Q.value = q;
  const g = ctx.createGain(); g.gain.value = gain;
  bp.connect(g);
  return { input: bp, output: g };
};

// one breath: louder exhale with faster flutter, softer inhale
const scheduleBreath = (n) => {
  const t = ctx.currentTime + 0.05;
  const { breath, lfo } = n;
  breath.gain.cancelScheduledValues(t);
  breath.gain.setTargetAtTime(1, t, 0.18);
  breath.gain.setTargetAtTime(0.45, t + 1.25, 0.2);
  breath.gain.setTargetAtTime(0.7, t + 1.6, 0.25);
  breath.gain.setTargetAtTime(0.4, t + 2.3, 0.15);
  lfo.frequency.setTargetAtTime(26, t, 0.1);
  lfo.frequency.setTargetAtTime(22, t + 1.4, 0.2);
};

export const purr = (on) => {
  if (on && enabled && !purrNodes) {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(3);
    src.loop = true;
    const low = band(160, 0.7, 1.4);
    const mid = band(420, 1.1, 0.55);
    const pulse = ctx.createGain();
    pulse.gain.value = 0.5;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 24;
    const depth = ctx.createGain();
    depth.gain.value = 0.5;
    lfo.connect(depth).connect(pulse.gain);
    const soft = ctx.createBiquadFilter();
    soft.type = "lowpass"; soft.frequency.value = 850; soft.Q.value = 0.3;
    const breath = ctx.createGain();
    breath.gain.value = 0.4;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.8, t + 1);
    src.connect(low.input); src.connect(mid.input);
    low.output.connect(pulse); mid.output.connect(pulse);
    pulse.connect(soft).connect(breath).connect(out).connect(master);
    src.start(); lfo.start();
    const nodes = { src, lfo, breath, out };
    scheduleBreath(nodes);
    nodes.timer = setInterval(() => scheduleBreath(nodes), 2600);
    purrNodes = nodes;
  } else if (!on && purrNodes) {
    const { src, lfo, out, timer } = purrNodes;
    clearInterval(timer);
    const t = ctx.currentTime;
    out.gain.cancelScheduledValues(t);
    out.gain.setValueAtTime(out.gain.value, t);
    out.gain.linearRampToValueAtTime(0, t + 1.2);
    [src, lfo].forEach((n) => n.stop(t + 1.3));
    purrNodes = null;
  }
};
