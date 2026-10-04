// Fondos y efectos atmosféricos (todos deterministas y dirigidos por el fotograma).
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { C } from "./theme";

/** Orbe de luz difusa. */
export const Orb: React.FC<{
  x: number | string; y: number | string; size: number; color: string; opacity?: number; drift?: number; seed?: string;
}> = ({ x, y, size, color, opacity = 0.5, drift = 40, seed = "orb" }) => {
  const f = useCurrentFrame();
  const dx = noise2D(seed + "x", f * 0.006, 1) * drift;
  const dy = noise2D(seed + "y", 2, f * 0.006) * drift;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
        borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}00 68%)`,
        opacity, transform: `translate3d(${dx}px, ${dy}px, 0)`, pointerEvents: "none",
      }}
    />
  );
};

/** Fondo base: degradado oscuro + aurora índigo/púrpura. La variante reparte el color de forma distinta entre escenas. */
export const Backdrop: React.FC<{ variant?: "a" | "b" | "c" | "d"; intensity?: number }> = ({ variant = "a", intensity = 1 }) => {
  const sets = {
    a: [[C.primary, "18%", "12%"], [C.accent, "82%", "20%"], [C.cyan, "50%", "108%"]],
    b: [[C.accent, "14%", "30%"], [C.primary, "86%", "70%"], [C.pink, "55%", "-6%"]],
    c: [[C.cyan, "20%", "85%"], [C.primary, "78%", "18%"], [C.accent, "50%", "50%"]],
    d: [[C.primary, "50%", "-10%"], [C.accent, "10%", "90%"], [C.cyan, "92%", "88%"]],
  } as const;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 0%, ${C.bg2} 0%, ${C.bg1} 45%, ${C.bg0} 100%)` }}>
      {sets[variant].map(([c, x, y], i) => (
        <Orb key={i} x={x} y={y} size={1100 - i * 160} color={c as string} opacity={(0.36 - i * 0.06) * intensity} drift={70} seed={`${variant}${i}`} />
      ))}
    </AbsoluteFill>
  );
};

/** Cuadrícula con perspectiva que se desplaza hacia la cámara (suelo digital). */
export const GridFloor: React.FC<{ opacity?: number; speed?: number }> = ({ opacity = 0.35, speed = 0.6 }) => {
  const f = useCurrentFrame();
  const off = (f * speed) % 80;
  return (
    <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 38%", overflow: "hidden", opacity }}>
      <div
        style={{
          position: "absolute", left: "-50%", top: "52%", width: "200%", height: "140%", transformOrigin: "50% 0%",
          transform: "rotateX(68deg)",
          backgroundImage: `linear-gradient(${C.primary}66 1px, transparent 1px), linear-gradient(90deg, ${C.primary}66 1px, transparent 1px)`,
          backgroundSize: "80px 80px", backgroundPosition: `0 ${off}px`,
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 55%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Partículas flotantes deterministas. */
export const Particles: React.FC<{ count?: number; seed?: string; opacity?: number }> = ({ count = 34, seed = "p", opacity = 0.7 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const r1 = random(`${seed}-x-${i}`), r2 = random(`${seed}-y-${i}`), r3 = random(`${seed}-s-${i}`), r4 = random(`${seed}-v-${i}`);
        const size = 2 + r3 * 5;
        const y = (((r2 * height - f * (0.25 + r4 * 0.6)) % height) + height) % height;
        const x = r1 * width + noise2D(`${seed}${i}`, f * 0.01, i) * 26;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f * 0.04 + i * 1.7));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: i % 3 === 0 ? C.accentLight : i % 3 === 1 ? C.primaryLight : C.cyan, opacity: tw * 0.8, boxShadow: `0 0 ${size * 3}px ${C.primaryLight}` }} />
        );
      })}
    </AbsoluteFill>
  );
};

/** Viñeta suave. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.5 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,${strength}) 100%)` }} />
);

/** Grano de película muy sutil (textura fija que se desplaza para que parezca viva). */
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`;
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const f = useCurrentFrame();
  const sx = Math.floor(random(`gx${f}`) * 240), sy = Math.floor(random(`gy${f}`) * 240);
  return <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundPosition: `${sx}px ${sy}px` }} />;
};

/** Barrido de luz diagonal (para remates y logos). */
export const Sheen: React.FC<{ at: number; dur?: number; width?: number }> = ({ at, dur = 1.1, width = 420 }) => {
  const f = useCurrentFrame();
  const { fps, width: W } = useVideoConfig();
  const p = (f - at * fps) / (dur * fps);
  if (p < 0 || p > 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", top: "-20%", height: "140%", width, left: -width + p * (W + width * 2), transform: "skewX(-18deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
    </AbsoluteFill>
  );
};
