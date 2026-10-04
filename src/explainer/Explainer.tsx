// Composición principal: escenas encadenadas con transición premium + música con ducking + viñeta y grano globales.
import React from "react";
import { AbsoluteFill } from "remotion";
import { springTiming, TransitionSeries } from "@remotion/transitions";
import { Music, type Interval } from "./audio";
import { Grain, Vignette } from "./fx";
import { premiumSlide } from "./transition";
import { sceneStarts, totalFrames, TRANSITION, VO_DELAY, type ExplainerProps } from "./config";
import { sceneComponent } from "./registry";
import { C, VIDEO } from "./theme";

export const Explainer: React.FC<ExplainerProps> = ({ scenes }) => {
  const total = totalFrames(scenes);
  const starts = sceneStarts(scenes);
  // La música baja mientras habla la voz (solo en escenas con locución real)
  const duck: Interval[] = scenes.flatMap((s, i) =>
    s.voFile && s.voSec ? [{ from: starts[i] + Math.round(VO_DELAY * VIDEO.fps), to: starts[i] + Math.round((VO_DELAY + s.voSec) * VIDEO.fps) }] : [],
  );
  const hasVoice = duck.length > 0;

  const children: React.ReactElement[] = [];
  scenes.forEach((s, i) => {
    if (i > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${s.id}`}
          presentation={premiumSlide({ direction: 1 })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />,
      );
    }
    const Scene = sceneComponent(s.id);
    children.push(
      <TransitionSeries.Sequence key={s.id} durationInFrames={s.frames}>
        <Scene def={s} />
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill style={{ background: C.bg0 }}>
      <TransitionSeries>{children}</TransitionSeries>
      <Music src="audio/background.mp3" total={total} duck={duck} base={hasVoice ? 0.3 : 0.34} ducked={hasVoice ? 0.13 : 0.34} />
      <Vignette strength={0.42} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
