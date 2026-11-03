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
    master.gain.setTargetAtTime(1, ctx.currentTime, 0.1);
    notify();
    tick();
    tickTimer = setInterval(tick, 1000);
    return;
  }
  clearInterval(tickTimer);
  if (unlockEl) unlockEl.pause();
  if (master) master.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
  notify();
};

let tickTimer = null;
let tickIdx = 0;

// tick-tock of a pocket watch: short filtered click, alternating pitch
const tick = () => {
  const t = ctx.currentTime + 0.01;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(0.04);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = tickIdx++ % 2 ? 2100 : 2900;
  bp.Q.value = 4;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.9, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + 0.05);
};
