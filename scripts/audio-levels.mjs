// Mide el nivel de un audio o vídeo (RMS, pico y curva por segundos) con el ffmpeg que trae Remotion.
// Uso: node scripts/audio-levels.mjs out/llmfy-explainer.mp4 [segundos-por-bloque]
// La LUFS aproximada se calcula como RMS ponderado simple (sin ponderación K): vale para comparar mezclas, no para certificar.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const file = process.argv[2];
const block = parseFloat(process.argv[3] ?? "10");
if (!file || !existsSync(file)) { console.error("Indica un archivo existente"); process.exit(1); }

const SR = 22050;
const r = spawnSync("npx", ["remotion", "ffmpeg", "-hide_banner", "-loglevel", "error", "-i", file, "-vn", "-ac", "1", "-ar", String(SR), "-c:a", "pcm_s16le", "-fflags", "+bitexact", "-flags:a", "+bitexact", "-f", "wav", "pipe:1"], { maxBuffer: 1024 * 1024 * 600, shell: true });
if (r.status !== 0 || !r.stdout?.length) { console.error("No se pudo decodificar:", r.stderr?.toString().slice(0, 400)); process.exit(1); }
const buf = r.stdout;
// WAV por tubería: cabecera de 44 bytes y muestras de 16 bits
const pcm = new Int16Array(buf.buffer.slice(buf.byteOffset + 44, buf.byteOffset + 44 + Math.floor((buf.length - 44) / 2) * 2));
const samples = Float32Array.from(pcm, (v) => v / 32768);
const db = (v) => (v > 0 ? 20 * Math.log10(v) : -120);

let peak = 0, sum = 0;
for (let i = 0; i < samples.length; i++) { const a = Math.abs(samples[i]); if (a > peak) peak = a; sum += samples[i] * samples[i]; }
console.log(`Duración: ${(samples.length / SR).toFixed(1)} s · RMS total: ${db(Math.sqrt(sum / samples.length)).toFixed(1)} dBFS · pico: ${db(peak).toFixed(1)} dBFS`);

const n = Math.round(block * SR);
const rows = [];
for (let s = 0; s < samples.length; s += n) {
  let e = 0, p = 0; const end = Math.min(samples.length, s + n);
  for (let i = s; i < end; i++) { e += samples[i] * samples[i]; const a = Math.abs(samples[i]); if (a > p) p = a; }
  rows.push(`${String(Math.round(s / SR)).padStart(4)} s  RMS ${db(Math.sqrt(e / (end - s))).toFixed(1).padStart(6)} dBFS  pico ${db(p).toFixed(1).padStart(6)}`);
}
console.log(rows.join("\n"));
