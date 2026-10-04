// Primitivas de movimiento. Todo se anima desde useCurrentFrame() (nada de CSS transitions/animations).
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";

export type SpringCfg = { damping?: number; stiffness?: number; mass?: number; overshootClamping?: boolean };

export const SPR = {
  smooth: { damping: 200 },                  // sin rebote, revelados sutiles
  soft: { damping: 28, stiffness: 110 },     // aterriza con suavidad
  snappy: { damping: 20, stiffness: 200 },   // elementos de interfaz
  pop: { damping: 13, stiffness: 190 },      // rebote corto, para chips y tarjetas
  heavy: { damping: 15, stiffness: 80, mass: 2 },
} as const;

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.5, 0, 0.75, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Escala de tiempo de la coreografía: si la locución real dura más que lo previsto, la animación se estira (k > 1). */
export const TimeScale = React.createContext(1);

/** Tiempo local de la escena en segundos, en "segundos de diseño" (ya dividido por la escala). */
export function useT() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = React.useContext(TimeScale);
  return { frame: frame / k, fps, t: frame / fps / k, dur: durationInFrames / fps / k, k };
}

/** Muelle 0→1 que arranca tras `delaySec` segundos. */
export function useSpr(delaySec = 0, cfg: SpringCfg = SPR.smooth, durationSec?: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = React.useContext(TimeScale);
  return spring({
    frame: frame / k,
    fps,
    delay: Math.round(delaySec * fps),
    config: cfg,
    durationInFrames: durationSec ? Math.round(durationSec * fps) : undefined,
  });
}

/** Progreso 0→1 entre dos instantes (segundos) con una curva de easing. */
export function useProg(startSec: number, durSec: number, easing: (t: number) => number = EASE.out) {
  const { frame, fps } = useT();
  return interpolate(frame, [startSec * fps, (startSec + durSec) * fps], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Entrada estándar: sube, gana nitidez y opacidad. */
export const Enter: React.FC<{
  delay?: number; y?: number; x?: number; scale?: number; blur?: number; cfg?: SpringCfg;
  style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ delay = 0, y = 28, x = 0, scale = 1, blur = 10, cfg = SPR.smooth, style, children }) => {
  const p = useSpr(delay, cfg);
  const o = interpolate(p, [0, 0.55], [0, 1], { extrapolateRight: "clamp" });
  const b = (1 - p) * blur;
  return (
    <div
      style={{
        opacity: o,
        transform: `translate3d(${(1 - p) * x}px, ${(1 - p) * y}px, 0) scale(${lerp(scale, 1, p)})`,
        filter: b > 0.25 ? `blur(${b}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Titular por líneas: cada línea sube desde una máscara (efecto editorial). */
export const Lines: React.FC<{
  lines: React.ReactNode[]; delay?: number; step?: number; style?: React.CSSProperties; lineStyle?: React.CSSProperties;
}> = ({ lines, delay = 0, step = 0.09, style, lineStyle }) => (
  <div style={style}>
    {lines.map((l, i) => (
      <LineMask key={i} delay={delay + i * step} style={lineStyle}>{l}</LineMask>
    ))}
  </div>
);

const LineMask: React.FC<{ delay: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ delay, style, children }) => {
  const p = useSpr(delay, SPR.soft);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }), ...style }}>
        {children}
      </div>
    </div>
  );
};

/** Palabra a palabra con escalonado. */
export const Words: React.FC<{ text: string; delay?: number; step?: number; style?: React.CSSProperties; wordStyle?: React.CSSProperties }> = ({
  text, delay = 0, step = 0.05, style, wordStyle,
}) => (
  <span style={style}>
    {text.split(" ").map((w, i) => (
      <Enter key={i} delay={delay + i * step} y={14} blur={6} style={{ display: "inline-block", marginRight: "0.28em", ...wordStyle }}>
        {w}
      </Enter>
    ))}
  </span>
);

/** Contador animado. */
export const CountUp: React.FC<{
  to: number; from?: number; delay?: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; style?: React.CSSProperties;
}> = ({ to, from = 0, delay = 0, dur = 1.4, decimals = 0, prefix = "", suffix = "", style }) => {
  const p = useProg(delay, dur, EASE.out);
  const v = lerp(from, to, p);
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
};

/** Texto que se escribe solo (con caret). Devuelve el texto visible y si ya terminó. */
export function useTypewriter(text: string, startSec: number, cps = 22) {
  const { frame, fps } = useT();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - startSec * fps) / fps) * cps)));
  const done = n >= text.length;
  const caretOn = Math.floor(frame / (fps * 0.45)) % 2 === 0 || !done;
  return { shown: text.slice(0, n), done, caret: caretOn && frame >= startSec * fps - 2 };
}

/** Ráfaga de ripple (círculo que se expande) en un punto, a partir de un instante. */
export const Ripple: React.FC<{ x: number; y: number; at: number; color?: string; size?: number }> = ({ x, y, at, color = "#A5B4FC", size = 90 }) => {
  const p = useProg(at, 0.6, EASE.out);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%",
        border: `3px solid ${color}`, opacity: (1 - p) * 0.9, transform: `scale(${lerp(0.25, 1.15, p)})`, pointerEvents: "none",
      }}
    />
  );
};

export type CursorPoint = { t: number; x: number; y: number; click?: boolean };

/** Cursor de tutorial: sigue una trayectoria curva por puntos y hace clic con ripple. */
export const Cursor: React.FC<{ path: CursorPoint[]; size?: number }> = ({ path, size = 40 }) => {
  const { t } = useT();
  if (path.length === 0) return null;
  let x = path[0].x, y = path[0].y;
  if (t >= path[path.length - 1].t) {
    x = path[path.length - 1].x; y = path[path.length - 1].y;
  } else if (t > path[0].t) {
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i], b = path[i + 1];
      if (t >= a.t && t < b.t) {
        const p = EASE.inOut(clamp01((t - a.t) / (b.t - a.t)));
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
        const arc = Math.sin(Math.PI * p) * Math.min(80, d * 0.14); // pequeño arco, como una mano real
        x = a.x + dx * p + (-dy / d) * arc;
        y = a.y + dy * p + (dx / d) * arc;
        break;
      }
    }
  }
  const appear = clamp01((t - path[0].t + 0.25) / 0.25);
  // Pulsación: se hunde un poco en cada clic
  let press = 0;
  for (const pt of path) if (pt.click) press = Math.max(press, 1 - clamp01(Math.abs(t - (pt.t + 0.06)) / 0.14));
  return (
    <>
      {path.filter((p) => p.click).map((p, i) => <Ripple key={i} x={p.x} y={p.y} at={p.t} />)}
      <div
        style={{
          position: "absolute", left: x, top: y, width: size, height: size, opacity: appear,
          transform: `translate(-6px, -4px) scale(${1 - press * 0.14})`, transformOrigin: "6px 4px", pointerEvents: "none",
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.55))",
        }}
      >
        <svg viewBox="0 0 24 28" width={size} height={size * (28 / 24)}>
          <path d="M3 2.2 L3 21 L8 16.6 L11.2 24.2 L14.2 22.9 L11.1 15.4 L17.6 15.4 Z" fill="#fff" stroke="#0B0A16" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
};

export type CamKey = { t: number; x?: number; y?: number; s?: number; r?: number };

/** Cámara virtual: empuja, desplaza y gira el contenido entre fotogramas clave, con deriva orgánica opcional. */
export const Camera: React.FC<{ keys: CamKey[]; drift?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ keys, drift = 0, children, style }) => {
  const { t, frame } = useT();
  const ch = (name: "x" | "y" | "s" | "r", dflt: number) => {
    const ks = keys.map((k) => ({ t: k.t, v: k[name] ?? dflt }));
    if (t <= ks[0].t) return ks[0].v;
    for (let i = 0; i < ks.length - 1; i++) {
      if (t >= ks[i].t && t < ks[i + 1].t) return lerp(ks[i].v, ks[i + 1].v, EASE.inOut(clamp01((t - ks[i].t) / (ks[i + 1].t - ks[i].t))));
    }
    return ks[ks.length - 1].v;
  };
  const dx = drift ? noise2D("cam-x", frame * 0.012, 0) * drift : 0;
  const dy = drift ? noise2D("cam-y", 0, frame * 0.012) * drift : 0;
  const dr = drift ? noise2D("cam-r", frame * 0.008, 3) * drift * 0.02 : 0;
  return (
    <div
      style={{
        position: "absolute", inset: 0, transformOrigin: "50% 50%",
        transform: `translate3d(${ch("x", 0) + dx}px, ${ch("y", 0) + dy}px, 0) scale(${ch("s", 1)}) rotate(${ch("r", 0) + dr}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Fotograma de cámara que centra el punto (px, py) del escenario con zoom s. */
export const focus = (t: number, px: number, py: number, s = 1): CamKey => ({ t, x: s * (960 - px), y: s * (540 - py), s });
