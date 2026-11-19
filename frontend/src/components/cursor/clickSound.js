/**
 * BECCI Subtle Tactile Click Sound Engine (Original Web Audio API Synthesis)
 *
 * Acoustic profile:
 * - Soft, crisp, short digital tap (~22ms total)
 * - Clean subtle high-frequency transient + delicate upper-mid harmonic ping
 * - Zero bass thump, zero loud mechanical snap, zero copyrighted external audio
 * - Strictly OFF by default until visitor explicitly enables sound
 * - Lazily initializes AudioContext only after an explicit user click gesture
 * - Built-in 60ms rate-limiter prevents overlapping or bubbled duplicate clicks
 */

const STORAGE_KEY = "becci:click-sound";
const MIN_GAP_MS = 60;

let audioCtx = null;
let lastPlayedAt = 0;
let masterVolume = 0.085; // Subtle, adjustable default volume (0.0 – 0.25)

export function readSavedSoundPreference() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function saveSoundPreference(enabled) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Ignore private-mode storage restrictions
  }
}

export function setClickVolume(next) {
  masterVolume = Math.max(0, Math.min(0.25, Number(next) || 0));
}

export function getClickVolume() {
  return masterVolume;
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) {
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a soft, original digital tap.
 * @param {"soft" | "primary"} variant — "primary" is slightly crisper for CTAs/toggles
 */
export function playInterfaceClick(variant = "soft") {
  if (typeof window === "undefined") return false;

  const nowMs = performance.now();
  if (nowMs - lastPlayedAt < MIN_GAP_MS) return false;
  lastPlayedAt = nowMs;

  const ctx = getAudioContext();
  if (!ctx || masterVolume <= 0) return false;

  const t = ctx.currentTime;
  const vol = masterVolume * (variant === "primary" ? 1.15 : 0.92);

  try {
    // 1. Delicate high-mid sine tap (clean, crisp, zero low-end rumble)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    const startFreq = variant === "primary" ? 1960 : 1680;
    const endFreq = variant === "primary" ? 1320 : 1140;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.022);

    oscGain.gain.setValueAtTime(0.0001, t);
    oscGain.gain.linearRampToValueAtTime(vol, t + 0.0025);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.024);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.026);

    // 2. Micro-transient high-frequency air click (~10ms band-passed noise)
    const sampleCount = Math.floor(ctx.sampleRate * 0.011);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i += 1) {
      const env = Math.pow(1 - i / sampleCount, 2.8);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(4400, t);
    filter.Q.setValueAtTime(2.4, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.011);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.012);

    return true;
  } catch {
    return false;
  }
}

export function disposeClickAudio() {
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch {
      // Ignore close errors
    }
    audioCtx = null;
  }
}

/**
 * Determine whether a click target is an intentional interactive element
 * that should trigger the subtle interface click sound.
 */
const INTERACTIVE_CLICK_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "[role='button']:not([aria-disabled='true'])",
  "[role='tab']:not([aria-disabled='true'])",
  "summary",
  "[data-sound-click='true']",
].join(", ");

export function resolveInteractiveClickVariant(target) {
  if (!target || target.nodeType !== 1) return null;
  if (target.closest("[data-sound='off'], :disabled, [disabled], [aria-disabled='true']")) {
    return null;
  }
  const el = target.closest(INTERACTIVE_CLICK_SELECTOR);
  if (!el) return null;

  // Primary CTAs & tabs get the slightly crisper variant
  if (
    el.matches("[data-cursor-magnet='true'] *, [role='tab'], button[type='submit']") ||
    el.className?.toString().includes("bg-teal") ||
    el.className?.toString().includes("bg-navy-950")
  ) {
    return "primary";
  }
  return "soft";
}
