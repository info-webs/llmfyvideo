// Transición de escena premium: la escena saliente retrocede y se desenfoca, la entrante llega con
// profundidad, y una barra de luz con el degradado de marca cruza el cuadro como remate.
import React from "react";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";
import { C } from "./theme";

type Props = { direction?: 1 | -1 };

const Comp: React.FC<TransitionPresentationComponentProps<Props>> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const dir = passedProps.direction ?? 1;
  const p = presentationProgress; // 0→1 durante la transición
  const exiting = presentationDirection === "exiting";
  const move = exiting ? interpolate(p, [0, 1], [0, -9 * dir]) : interpolate(p, [0, 1], [9 * dir, 0]);
  const scale = exiting ? interpolate(p, [0, 1], [1, 0.94]) : interpolate(p, [0, 1], [1.06, 1]);
  const blur = exiting ? interpolate(p, [0, 1], [0, 16]) : interpolate(p, [0, 1], [16, 0]);
  const opacity = exiting ? interpolate(p, [0.35, 1], [1, 0], { extrapolateLeft: "clamp" }) : interpolate(p, [0, 0.55], [0, 1], { extrapolateRight: "clamp" });
  // Barra de luz (solo la dibuja la escena entrante para no duplicarla)
  const bar = !exiting ? interpolate(p, [0, 1], [-30, 130]) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate3d(${move}%, 0, 0) scale(${scale})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity }}>{children}</AbsoluteFill>
      {!exiting && p > 0.02 && p < 0.98 && (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
          <div
            style={{
              position: "absolute", top: "-10%", height: "120%", width: "26%", left: `${dir > 0 ? bar : 100 - bar - 26}%`,
              transform: "skewX(-16deg)", background: `linear-gradient(90deg, transparent, ${C.primary}66, ${C.accent}88, ${C.cyan}44, transparent)`, filter: "blur(18px)",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const premiumSlide = (props: Props = {}): TransitionPresentation<Props> => ({ component: Comp, props });
