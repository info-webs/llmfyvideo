// Tabla de tiempos del explainer: duración de cada escena y fotograma global donde empieza/acaba.
// Usa las mismas fórmulas que src/explainer/config.ts. Uso: node scripts/scene-frames.mjs [id-de-escena segundos-locales]
//   p. ej.  node scripts/scene-frames.mjs 04-citabilidad 8.5   → fotograma global de ese instante (para `remotion still --frame=N`)
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30, VO_DELAY = 0.55, TAIL = 0.9, TRANSITION = 16, WPS = 2.7;
const src = readFileSync(join(ROOT, "src/explainer/registry.tsx"), "utf8");

const estimate = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const pauses = (text.match(/[.!?…]/g) ?? []).length * 0.28 + (text.match(/[,;:]/g) ?? []).length * 0.12;
  return words / WPS + pauses;
};
const scenes = [...src.matchAll(/\{\s*id:\s*"([^"]+)",\s*minSec:\s*([\d.]+),.*?narration:\s*"([^"]+)"\s*\}/gs)].map((m) => ({ id: m[1], minSec: +m[2], narration: m[3] }));

let acc = 0;
const rows = scenes.map((s, i) => {
  const voFile = join(ROOT, "public/audio/vo", s.id + ".mp3");
  const est = estimate(s.narration);
  const frames = Math.ceil((VO_DELAY + Math.max(s.minSec, est) + TAIL) * FPS);
  const start = acc;
  acc += frames - (i < scenes.length - 1 ? TRANSITION : 0);
  return { ...s, est, frames, start, end: start + frames, vo: existsSync(voFile) ? "sí" : "no" };
});
const total = rows.length ? rows[rows.length - 1].end : 0;

const [qid, qsec] = process.argv.slice(2);
if (qid) {
  const r = rows.find((x) => x.id === qid);
  if (!r) { console.error("Escena no encontrada:", qid); process.exit(1); }
  console.log(r.start + Math.round(parseFloat(qsec ?? "0") * FPS));
} else {
  console.log("escena            est(s) frames  inicio  fin    voz");
  for (const r of rows) console.log(`${r.id.padEnd(17)} ${r.est.toFixed(1).padStart(5)} ${String(r.frames).padStart(6)} ${String(r.start).padStart(7)} ${String(r.end).padStart(6)}  ${r.vo}`);
  console.log(`\nTotal: ${total} fotogramas = ${(total / FPS).toFixed(1)} s (música disponible: 136,6 s)`);
}
