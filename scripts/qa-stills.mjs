// QA visual rápido: un solo bundle y varios fotogramas (mucho más rápido que `remotion still` repetido).
// Uso:  node scripts/qa-stills.mjs [--scale=0.6] [--comp=LLMFYExplainer] 03-empieza:2.5 03-empieza:6 1500
// Cada argumento es «idEscena:segundos» (segundos DE DISEÑO de la escena, los mismos que usa la coreografía; se convierten
// a tiempo real con el estiramiento k de la escena) o un número de fotograma global.
// Las imágenes salen en out/qa/<escena>-<segundos>.png (o f<fotograma>.png).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30, TRANSITION = 16, VO_DELAY = 0.55, TAIL = 0.9;
const args = process.argv.slice(2);
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split("=")[1];
const compId = opt("comp", "LLMFYExplainer");
const scale = parseFloat(opt("scale", "0.6"));
const targets = args.filter((a) => !a.startsWith("--"));
if (!targets.length) { console.error("Indica al menos un objetivo, p. ej. 03-empieza:2.5"); process.exit(1); }

const outDir = path.join(ROOT, "out", "qa");
mkdirSync(outDir, { recursive: true });

console.log("Empaquetando…");
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.tsx"), publicDir: path.join(ROOT, "public") });
const composition = await selectComposition({ serveUrl, id: compId });
const scenes = composition.props?.scenes ?? [];
let acc = 0;
const starts = scenes.map((s, i) => { const st = acc; acc += s.frames - (i < scenes.length - 1 ? TRANSITION : 0); return st; });
console.log(`Composición ${compId}: ${composition.durationInFrames} fotogramas (${(composition.durationInFrames / FPS).toFixed(1)} s)`);

for (const tgt of targets) {
  let frame, name;
  if (tgt.includes(":")) {
    const [id, sec] = tgt.split(":");
    const i = scenes.findIndex((s) => s.id === id);
    if (i < 0) { console.error("Escena no encontrada:", id); continue; }
    const sc = scenes[i];
    const k = Math.max(1, sc.frames / FPS / (VO_DELAY + (sc.minSec ?? sc.estSec) + TAIL));
    frame = starts[i] + Math.round(parseFloat(sec) * k * FPS);
    name = `${id}-${sec}`;
  } else {
    frame = parseInt(tgt, 10);
    name = `f${frame}`;
  }
  frame = Math.max(0, Math.min(frame, composition.durationInFrames - 1));
  await renderStill({ composition, serveUrl, frame, scale, imageFormat: "png", output: path.join(outDir, `${name}.png`) });
  console.log("ok", name, "→ fotograma", frame);
}
