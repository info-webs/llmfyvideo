// Sintetiza los efectos de sonido del explainer (sin dependencias ni samples con licencia).
// Salida: public/audio/sfx/*.wav  (PCM 16 bit, mono, 44,1 kHz, normalizados a -3 dBFS de pico).
// Uso: node scripts/make-sfx.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio", "sfx");
mkdirSync(OUT, { recursive: true });

// ---------- utilidades ----------
let seed = 20261004;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1; // ruido determinista [-1,1]
const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d)); // ataque lineal + caída exponencial

// Filtro de variables de estado (Chamberlin) con frecuencia variable en el tiempo
function svf(input, freqAt, q, mode) {
  const out = new Float32Array(input.length);
  let low = 0, band = 0;
  for (let i = 0; i < input.length; i++) {
    const f = 2 * Math.sin(Math.PI * Math.min(0.2, freqAt(i / SR) / SR));
    low += f * band;
    const high = input[i] - low - band / q;
    band += f * high;
    out[i] = mode === "band" ? band : mode === "low" ? low : high;
  }
  return out;
}

// Reverb sencillo de cuatro peines paralelos para dar cola a campanillas e impactos
function reverb(x, mix = 0.25, size = 1) {
  const delays = [1557, 1617, 1491, 1422].map((d) => Math.round(d * size));
  const len = x.length + Math.round(SR * 1.2);
  const wet = new Float32Array(len);
  for (const d of delays) {
    const comb = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const dry = i < x.length ? x[i] : 0;
      comb[i] = dry + (i >= d ? comb[i - d] * 0.78 : 0);
    }
    for (let i = 0; i < len; i++) wet[i] += comb[i] * 0.25;
  }
  const res = new Float32Array(len);
  for (let i = 0; i < len; i++) res[i] = (i < x.length ? x[i] : 0) * (1 - mix) + wet[i] * mix;
  return res;
}

function fadeEnd(x, sec) { const n = Math.round(sec * SR); for (let i = 0; i < n; i++) x[x.length - 1 - i] *= i / n; }

function save(name, data, { fadeOut = 0.01 } = {}) {
  let peak = 0;
  for (const v of data) peak = Math.max(peak, Math.abs(v));
  const gain = peak > 0 ? 0.708 / peak : 1; // -3 dBFS
  const n = data.length, fo = Math.min(n, Math.round(fadeOut * SR));
  const pcm = Buffer.alloc(44 + n * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 2, 4); pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36); pcm.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const tail = i > n - fo ? (n - i) / fo : 1;
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i] * gain * tail)) * 32767), 44 + i * 2);
  }
  writeFileSync(join(OUT, name + ".wav"), pcm);
  console.log(`${name}.wav  ${(n / SR).toFixed(2)} s`);
}

// ---------- efectos ----------
// Whoosh de transición: ruido filtrado con barrido de frecuencia y envolvente suave
function whoosh(sec, f0, f1, q, peakAt = 0.45) {
  const x = buf(sec);
  for (let i = 0; i < x.length; i++) x[i] = rnd();
  const sweep = (t) => f0 * Math.pow(f1 / f0, Math.min(1, t / sec));
  const y = svf(svf(x, sweep, q, "band"), sweep, q, "band"); // dos etapas: flancos más limpios
  for (let i = 0; i < y.length; i++) {
    const t = i / SR / sec;
    const e = t < peakAt ? Math.sin((t / peakAt) * Math.PI / 2) : Math.cos(((t - peakAt) / (1 - peakAt)) * Math.PI / 2);
    y[i] *= e * e;
  }
  return y;
}
save("whoosh", whoosh(0.9, 260, 3800, 3.2));
save("whoosh-soft", whoosh(0.55, 500, 2600, 3.6, 0.4));
save("whoosh-low", whoosh(1.1, 120, 1400, 2.6, 0.5));

// Pop (aparición de tarjetas y chips)
{
  const x = buf(0.22);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (180 + 420 * Math.exp(-t / 0.035))) / SR;
    x[i] = Math.sin(ph) * env(t, 0.004, 0.06) + rnd() * 0.05 * env(t, 0.001, 0.008);
  }
  save("pop", x);
}

// Clic de ratón (hueco y corto)
{
  const x = buf(0.09);
  const hp = svf(Float32Array.from({ length: x.length }, () => rnd()), () => 2400, 0.9, "high");
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * 1500) / SR;
    x[i] = hp[i] * env(t, 0.0008, 0.012) * 0.8 + Math.sin(ph) * env(t, 0.0006, 0.018) * 0.5;
  }
  save("click", x);
}

// Tick suave (contadores)
{
  const x = buf(0.06);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * 2600) / SR;
    x[i] = Math.sin(ph) * env(t, 0.0008, 0.011);
  }
  save("tick", x);
}

// Teclas (3 variantes) para el efecto de escritura
for (const [k, fc] of [[1, 1900], [2, 2500], [3, 1400]]) {
  const x = buf(0.05);
  const bp = svf(Float32Array.from({ length: x.length }, () => rnd()), () => fc, 2.2, "band");
  for (let i = 0; i < x.length; i++) x[i] = bp[i] * env(i / SR, 0.0005, 0.009);
  save("key" + k, x);
}

// Campanilla de éxito (parciales armónicos + reverb corta)
{
  const x = buf(2.4);
  const parts = [[880, 1, 0.45], [1320, 0.55, 0.32], [2640, 0.22, 0.2], [1760, 0.3, 0.25]];
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const [f, a, tau] of parts) v += Math.sin(2 * Math.PI * f * t) * a * env(t, 0.003, tau);
    x[i] = v;
  }
  fadeEnd(x, 0.15);
  save("ding", reverb(x, 0.3, 1), { fadeOut: 0.2 });
}

// Riser (subida de tensión antes de un reveal)
{
  const sec = 2.0;
  const x = buf(sec);
  for (let i = 0; i < x.length; i++) x[i] = rnd();
  const y = svf(x, (t) => 180 * Math.pow(7000 / 180, Math.pow(t / sec, 1.4)), 2.4, "band");
  for (let i = 0; i < y.length; i++) {
    const t = i / SR / sec;
    y[i] *= Math.pow(t, 2.2) * (t > 0.96 ? (1 - t) / 0.04 : 1);
  }
  save("riser", y);
}

// Impacto grave (revelado del logo): sub + ruido filtrado + cola
{
  const sec = 2.2;
  const x = buf(sec);
  let ph = 0;
  const lp = svf(Float32Array.from({ length: x.length }, () => rnd()), () => 420, 0.7, "low");
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (38 + 42 * Math.exp(-t / 0.09))) / SR;
    x[i] = Math.sin(ph) * env(t, 0.002, 0.42) + lp[i] * 0.9 * env(t, 0.001, 0.12);
  }
  fadeEnd(x, 0.2);
  save("impact", reverb(x, 0.22, 1.4), { fadeOut: 0.3 });
}

console.log("SFX listos en", OUT);
