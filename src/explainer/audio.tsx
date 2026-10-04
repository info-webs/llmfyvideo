// Mezcla de audio: música con "ducking" bajo la voz, efectos sincronizados y locución por escena.
import React from "react";
import { Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";

export const SFX = {
  whoosh: "audio/sfx/whoosh.wav",
  whooshSoft: "audio/sfx/whoosh-soft.wav",
  whooshLow: "audio/sfx/whoosh-low.wav",
  pop: "audio/sfx/pop.wav",
  click: "audio/sfx/click.wav",
  tick: "audio/sfx/tick.wav",
  key1: "audio/sfx/key1.wav",
  key2: "audio/sfx/key2.wav",
  key3: "audio/sfx/key3.wav",
  ding: "audio/sfx/ding.wav",
  riser: "audio/sfx/riser.wav",
  impact: "audio/sfx/impact.wav",
} as const;
export type SfxName = keyof typeof SFX;
export type Cue = { at: number; sfx: SfxName; vol?: number };

/** Efectos de sonido sincronizados con la animación (tiempos en segundos locales de la escena). */
export const Sfx: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(c.at * fps))} layout="none">
          <Audio src={staticFile(SFX[c.sfx])} volume={c.vol ?? 0.5} />
        </Sequence>
      ))}
    </>
  );
};

/** Locución de una escena (solo si el archivo existe: lo decide calculateMetadata). */
export const VoiceOver: React.FC<{ file: string; delaySec: number }> = ({ file, delaySec }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(delaySec * fps)} layout="none">
      <Audio src={staticFile(file)} volume={1} />
    </Sequence>
  );
};

export type Interval = { from: number; to: number }; // en fotogramas globales

/** Música de fondo: entra con fundido, baja cuando habla la voz y sale con fundido. */
export const Music: React.FC<{ src: string; total: number; duck: Interval[]; base?: number; ducked?: number }> = ({ src, total, duck, base = 0.3, ducked = 0.15 }) => {
  const { fps } = useVideoConfig();
  return (
    <Audio
      src={staticFile(src)}
      loop
      loopVolumeCurveBehavior="extend"
      volume={(f) => {
        const fadeIn = interpolate(f, [0, 1.6 * fps], [0, 1], { extrapolateRight: "clamp" });
        const fadeOut = interpolate(f, [total - 3.2 * fps, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        let d = 0;
        for (const iv of duck) {
          const v = interpolate(f, [iv.from - 0.35 * fps, iv.from + 0.25 * fps, iv.to - 0.2 * fps, iv.to + 0.6 * fps], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          d = Math.max(d, v);
        }
        return (base + (ducked - base) * d) * fadeIn * fadeOut;
      }}
    />
  );
};
