// Guion y tiempos del explainer. Aquí vive el texto de la locución de cada escena.
// Si existe public/audio/vo/<id>.mp3, la duración de la escena se ajusta sola a esa locución;
// si no existe, se estima por número de palabras (castellano, ritmo explicativo).
import { staticFile, type CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { VIDEO } from "./theme";

export const VO_DELAY = 0.55;      // la voz entra cuando la transición ya casi ha terminado
export const TAIL = 0.9;           // aire al final de cada escena
export const TRANSITION = 16;      // fotogramas que dura cada transición entre escenas
export const WPS = 2.7;            // palabras por segundo estimadas

export type SceneDef = {
  id: string;
  narration: string;
  minSec?: number;                 // duración mínima de la parte "hablada" si la animación necesita más aire
  chapter?: { n: number | string; label: string };
};

export type SceneRuntime = SceneDef & {
  estSec: number;                  // duración estimada de la locución
  voSec?: number;                  // duración real si hay audio
  voFile?: string;                 // ruta (relativa a public/) si hay audio
  frames: number;                  // duración total de la escena en fotogramas
};

export const estimateSec = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const pauses = (text.match(/[.!?…]/g) ?? []).length * 0.28 + (text.match(/[,;:]/g) ?? []).length * 0.12;
  return words / WPS + pauses;
};

export const sceneFrames = (def: SceneDef, voSec: number | undefined, fps: number) => {
  const speak = Math.max(def.minSec ?? 0, voSec ?? estimateSec(def.narration));
  return Math.ceil((VO_DELAY + speak + TAIL) * fps);
};

/** Fotogramas de inicio de cada escena en la línea de tiempo global (las transiciones solapan escenas). */
export const sceneStarts = (scenes: SceneRuntime[]) => {
  let acc = 0;
  return scenes.map((s, i) => {
    const start = acc;
    acc += s.frames - (i < scenes.length - 1 ? TRANSITION : 0);
    return start;
  });
};

export const totalFrames = (scenes: SceneRuntime[]) => scenes.reduce((a, s) => a + s.frames, 0) - TRANSITION * Math.max(0, scenes.length - 1);

export type ExplainerProps = { scenes: SceneRuntime[] };

export const makeCalculateMetadata = (defs: SceneDef[]): CalculateMetadataFunction<ExplainerProps> => async () => {
  const scenes: SceneRuntime[] = [];
  for (const d of defs) {
    let voSec: number | undefined;
    let voFile: string | undefined;
    try {
      const file = `audio/vo/${d.id}.mp3`;
      const sec = await getAudioDurationInSeconds(staticFile(file));
      if (Number.isFinite(sec) && sec > 0.5) { voSec = sec; voFile = file; }
    } catch {
      // sin locución para esta escena: se usa la estimación por palabras
    }
    scenes.push({ ...d, estSec: estimateSec(d.narration), voSec, voFile, frames: sceneFrames(d, voSec, VIDEO.fps) });
  }
  return { durationInFrames: totalFrames(scenes), props: { scenes } };
};
