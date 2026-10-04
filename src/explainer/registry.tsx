// Guion del explainer (texto de la locución por escena) y registro de componentes.
// La locución es la misma que figura en EXPLAINER.md: el id de cada escena es el nombre del mp3 (public/audio/vo/<id>.mp3).
import React from "react";
import { AbsoluteFill } from "remotion";
import { estimateSec, sceneFrames, type SceneDef, type SceneRuntime } from "./config";
import { VIDEO, C, FONT } from "./theme";
import { SceneShell } from "./shell";
import { Scene01, Scene02, Scene03 } from "./scenes1";
import { Scene04, Scene05, Scene06 } from "./scenes2";
import { Scene07, Scene08, Scene09 } from "./scenes3";
import { Scene10, Scene11, Scene12 } from "./scenes4";

export const SCENES: SceneDef[] = [
  { id: "01-gancho", minSec: 7.0, narration: "Le preguntas a ChatGPT por tu sector y recomienda a tu competencia. ¿Y tu marca? Ni aparece." },
  { id: "02-que-es", minSec: 9.5, narration: "LLMFY mide si tu web está lista para que ChatGPT, Gemini, Perplexity y las Google AI Overviews la citen, y te dice qué cambiar." },
  { id: "03-empieza", minSec: 11.5, chapter: { n: 1, label: "Empieza gratis" }, narration: "Paso uno: pega la URL de tu página en llmfy.ai y pulsa Analizar con IA. Entra con Google o con un enlace al correo y tendrás tres análisis gratis, sin tarjeta." },
  { id: "04-citabilidad", minSec: 13.0, chapter: { n: 2, label: "Optimización LLM" }, narration: "Paso dos, la Optimización LLM. Pega tu URL y pulsa Analizar Citabilidad: en menos de un minuto tienes un score de cero a cien, doce factores y un plan con los quick wins." },
  { id: "05-eeat-schema", minSec: 9.8, chapter: { n: 3, label: "E-E-A-T y Schema" }, narration: "Paso tres: la Auditoría E-E-A-T puntúa experiencia, pericia, autoridad y confianza, y Schema Scan revisa tus datos estructurados." },
  { id: "06-inspect", minSec: 10.6, chapter: { n: 4, label: "LLM Inspect" }, narration: "Paso cuatro: con LLM Inspect ves tu URL como la lee una IA: el texto que recibe, qué ve sin JavaScript y si tu HTML se lo pone fácil." },
  { id: "07-robots", minSec: 9.4, chapter: { n: 5, label: "Robots.txt Optimizer" }, narration: "Paso cinco: el Robots.txt Optimizer comprueba si GPTBot, ClaudeBot o PerplexityBot pueden rastrear tu web y te descarga un robots.txt optimizado." },
  { id: "08-semantico", minSec: 9.6, chapter: { n: 6, label: "AIO Semántico" }, narration: "Paso seis: AIO Semántico compara tu página con hasta cinco competidores y te muestra las lagunas de contenido y las entidades que te faltan." },
  { id: "09-tracking", minSec: 11.6, chapter: { n: 7, label: "Medir si te citan" }, narration: "Paso siete: mide resultados. El LLM Tracker comprueba si Google AI Overviews y ChatGPT te mencionan, y el Prompt Tracker sigue tus prompts en Google, ChatGPT y Perplexity." },
  { id: "10-trafico", minSec: 9.4, chapter: { n: 8, label: "AI Traffic Analytics" }, narration: "Y paso ocho: con AI Traffic Analytics conectas Google Analytics en solo lectura y ves cuántas visitas te llegan desde chats de IA." },
  { id: "11-mas", minSec: 7.6, narration: "Y hay más: Brand Sentiment, Human-First Score, Information Gain, Ampliaciones GEO, AI Building e Index Now." },
  { id: "12-planes-cta", minSec: 10.8, narration: "Empieza gratis, con tres análisis y sin tarjeta. Los planes de pago van desde diecinueve euros al mes. Entra en llmfy.ai y analiza tu web hoy." },
];

/** Marcador provisional para escenas aún sin construir. */
const Placeholder: React.FC<{ def: SceneRuntime }> = ({ def }) => (
  <SceneShell def={def} variant="c">
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.sans, color: C.text, fontSize: 90, fontWeight: 800 }}>{def.id}</AbsoluteFill>
  </SceneShell>
);

export const COMPONENTS: Record<string, React.FC<{ def: SceneRuntime }>> = {
  "01-gancho": Scene01,
  "02-que-es": Scene02,
  "03-empieza": Scene03,
  "04-citabilidad": Scene04,
  "05-eeat-schema": Scene05,
  "06-inspect": Scene06,
  "07-robots": Scene07,
  "08-semantico": Scene08,
  "09-tracking": Scene09,
  "10-trafico": Scene10,
  "11-mas": Scene11,
  "12-planes-cta": Scene12,
};
export const sceneComponent = (id: string) => COMPONENTS[id] ?? Placeholder;

/** Escenas con duraciones estimadas (sin locución), para el valor por defecto de la composición. */
export const DEFAULT_SCENES: SceneRuntime[] = SCENES.map((d) => ({ ...d, estSec: estimateSec(d.narration), frames: sceneFrames(d, undefined, VIDEO.fps) }));
