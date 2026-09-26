import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React, { useEffect, useState } from "react";

// ============================================
// LLMFY — VÍDEO MOTION GRAPHICS DE 60 SEGUNDOS
// Kinetic typography, data viz y transiciones sincronizadas
// con la música de fondo (backgroundv2.mp3, 130 BPM)
// ============================================

export const MOTION60_FPS = 30;
export const MOTION60_DURATION = 1800; // 60 segundos a 30 fps

// Sin locución: la música es la única pista, por eso va más alta que en el anuncio de 30 s
const MUSIC_VOLUME = 0.8;

// Brand Colors
const COLORS = {
  primary: "#6366F1", // Indigo 500
  primaryDark: "#4F46E5", // Indigo 600
  primaryLight: "#818CF8", // Indigo 400
  accent: "#A855F7", // Purple 500
  accentLight: "#C084FC", // Purple 400
  accentDark: "#7C3AED", // Violet 600
  dark: "#0F0D1A",
  darker: "#080612",
  white: "#FFFFFF",
  gray: "#9CA3AF",
  grayLight: "#E5E7EB",
  cyan: "#22D3EE",
  pink: "#EC4899",
  red: "#EF4444",
  green: "#22C55E",
};

const BRAND_GRADIENT = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`;
const HERO_GRADIENT = `linear-gradient(90deg, ${COLORS.primaryLight} 0%, ${COLORS.accentLight} 50%, ${COLORS.cyan} 100%)`;
const SUCCESS_GRADIENT = `linear-gradient(90deg, ${COLORS.green} 0%, ${COLORS.cyan} 100%)`;
const WARNING_GRADIENT = `linear-gradient(90deg, ${COLORS.accentLight} 0%, ${COLORS.pink} 100%)`;

// ============================================
// TIPOGRAFÍAS (public/fonts, licencia OFL)
// Se cargan con FontFace y la composición espera con delayRender para que
// ningún frame se pinte con la fuente de sistema. El delayRender se pide al
// montar el componente y no al importar el módulo: Remotion reinicia su lista
// de handles al inicializarse y un handle pedido antes nunca se libera
// (el render se cancela a los 30 s).
// ============================================
const FONT = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

let fontsLoading: Promise<void> | null = null;

const loadLocalFonts = () => {
  if (!fontsLoading) {
    const faces = [
      new FontFace("Plus Jakarta Sans", `url('${staticFile("fonts/PlusJakartaSans-latin-wght.woff2")}') format('woff2')`, {
        weight: "200 800",
      }),
      new FontFace("JetBrains Mono", `url('${staticFile("fonts/JetBrainsMono-latin-wght.woff2")}') format('woff2')`, {
        weight: "100 800",
      }),
    ];
    fontsLoading = Promise.all(
      faces.map((face) =>
        face.load().then(() => {
          document.fonts.add(face);
        })
      )
    ).then(() => undefined);
  }
  return fontsLoading;
};

const useLocalFonts = () => {
  const [handle] = useState(() => delayRender("Cargando fuentes"));
  useEffect(() => {
    loadLocalFonts()
      .catch((err) => console.error("No se pudieron cargar las fuentes", err))
      .finally(() => continueRender(handle));
  }, [handle]);
};

// ============================================
// REJILLA MUSICAL
// backgroundv2.mp3: 130 BPM → 1 tiempo = 13,85 frames.
// Primer tiempo fuerte en 1,817 s; el "drop" cae en el compás 8 (16,6 s)
// y ahí se revela el logo. La música baja de intensidad en el compás 24.
// ============================================
const BEAT = (MOTION60_FPS * 60) / 130;
const FIRST_DOWNBEAT = 54.5;
const bar = (n: number) => Math.round(FIRST_DOWNBEAT + n * 4 * BEAT);
const beats = (n: number) => Math.round(n * BEAT);

const TIMELINE = {
  hook: 0, // 0,0 s  Hook + demo IA
  stats: bar(4), // 9,2 s  Estadísticas
  kicker: bar(7), // 14,7 s "Si la IA no te cita, no existes."
  logo: bar(8), // 16,6 s Drop → logo
  platforms: bar(10), // 20,3 s Plataformas IA
  features: bar(12), // 24,0 s Analiza / Optimiza / Monitoriza
  dashboard: bar(18), // 35,0 s Panel
  results: bar(22), // 42,4 s La IA ya te cita
  headline: bar(24), // 46,1 s Titular
  cta: bar(26), // 49,8 s CTA + cierre
  end: MOTION60_DURATION,
};

// ============================================
// UTILIDADES DE ANIMACIÓN
// ============================================
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);

// Progreso 0→1 entre `start` y `start + duration`
const progress = (frame: number, start: number, duration: number, easing = EASE_OUT) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing });

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Pseudoaleatorio determinista (Math.random rompe el render por frames)
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Opacidad 0-1 → sufijo hexadecimal para colores #RRGGBB
const alpha = (value: number) =>
  Math.round(Math.min(Math.max(value, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");

// Pulso que salta a 1 en cada tiempo musical y decae (glows y escalas al ritmo)
const beatPulse = (frame: number, decay = 5) => {
  const t = ((frame % BEAT) + BEAT) % BEAT;
  return Math.exp(-t / decay);
};

// Temblor de cámara que se amortigua tras un impacto
const shake = (frame: number, at: number, intensity: number, duration = 14) => {
  const t = frame - at;
  if (t < 0 || t > duration) return { x: 0, y: 0 };
  const decay = 1 - t / duration;
  return {
    x: Math.sin(t * 2.9) * intensity * decay,
    y: Math.cos(t * 3.7) * intensity * decay * 0.6,
  };
};

// Números con coma decimal española
const formatEs = (value: number, decimals: number) => value.toFixed(decimals).replace(".", ",");

// ============================================
// ELEMENTOS COMPARTIDOS
// ============================================

// Texto con degradado. Usa backgroundImage y no el shorthand `background`:
// si el shorthand cambia entre frames React no vuelve a aplicar background-clip
// y el texto se ve como un rectángulo sólido.
const GradientText: React.FC<{
  children: React.ReactNode;
  gradient: string;
  style?: React.CSSProperties;
}> = ({ children, gradient, style }) => (
  <span
    style={{
      backgroundImage: gradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "transparent",
      padding: "0.12em 0.06em",
      margin: "-0.12em -0.06em",
      ...style,
    }}
  >
    {children}
  </span>
);

// Palabras que suben desde una máscara, una detrás de otra
const KineticWords: React.FC<{
  text: string;
  frame: number;
  start: number;
  fontSize: number;
  stagger?: number;
  duration?: number;
  weight?: number;
  color?: string;
  letterSpacing?: string;
  align?: React.CSSProperties["justifyContent"];
  highlight?: Record<number, string>; // índice de palabra → degradado
  renderWord?: (word: string, index: number) => React.ReactNode;
}> = ({
  text,
  frame,
  start,
  fontSize,
  stagger = 4,
  duration = 16,
  weight = 800,
  color = COLORS.white,
  letterSpacing = "-0.035em",
  align = "center",
  highlight = {},
  renderWord,
}) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: align,
      columnGap: fontSize * 0.26,
      fontSize,
      fontWeight: weight,
      fontFamily: FONT,
      letterSpacing,
      lineHeight: 1.12,
      color,
    }}
  >
    {text.split(" ").map((word, i) => {
      const p = progress(frame, start + i * stagger, duration);
      const content = renderWord
        ? renderWord(word, i)
        : highlight[i]
          ? <GradientText gradient={highlight[i]}>{word}</GradientText>
          : word;
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            padding: "0.12em 0.06em 0.16em",
            margin: "-0.12em -0.06em -0.16em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - p) * 118}%) rotate(${(1 - p) * 7}deg)`,
              transformOrigin: "0% 100%",
            }}
          >
            {content}
          </span>
        </span>
      );
    })}
  </div>
);

// Iconos de línea (24x24) dibujados a mano para no depender de emojis
type IconName =
  | "gauge"
  | "shield"
  | "semantic"
  | "quote"
  | "tag"
  | "robot"
  | "bolt"
  | "network"
  | "target"
  | "sentiment"
  | "chart"
  | "sparkle"
  | "send"
  | "check"
  | "cross"
  | "globe"
  | "arrow"
  | "warning";

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  gauge: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4.5-5" />
      <circle cx="12" cy="17" r="1.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V6l7-3z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  semantic: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20.5 20.5l-4.8-4.8" />
      <path d="M8.5 9.5h5M8.5 12.5h3.5" />
    </>
  ),
  quote: (
    <>
      <path d="M5 7h5v5c0 3-1.8 5-4.5 5.5" />
      <path d="M14 7h5v5c0 3-1.8 5-4.5 5.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4h8.5l8.5 8.5-8 8-9-8z" />
      <circle cx="8" cy="8.5" r="1.3" />
    </>
  ),
  robot: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 4.7V8" />
      <circle cx="12" cy="3.8" r="0.9" />
      <path d="M9.5 12.5v1M14.5 12.5v1" />
      <path d="M9.5 16.2h5" />
    </>
  ),
  bolt: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-8z" />,
  network: (
    <>
      <circle cx="5.5" cy="6" r="2.2" />
      <circle cx="18.5" cy="6" r="2.2" />
      <circle cx="12" cy="18.5" r="2.2" />
      <circle cx="12" cy="10.5" r="1.8" />
      <path d="M7.3 7.2l3.2 2.3M16.7 7.2l-3.2 2.3M12 12.3v4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </>
  ),
  sentiment: (
    <>
      <path d="M4 5h16v11H10l-6 4.5V5z" />
      <path d="M9 10.5c1.6 1.8 4.4 1.8 6 0" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M4.5 16l5-5 3.5 3.5 7-7.5" />
      <path d="M15.5 7h4.5v4.5" />
    </>
  ),
  sparkle: <path d="M12 2.5l2.3 7.2 7.2 2.3-7.2 2.3-2.3 7.2-2.3-7.2L2.5 12l7.2-2.3z" />,
  send: (
    <>
      <path d="M12 19V5.5" />
      <path d="M5.5 12L12 5.5 18.5 12" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  cross: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.5l9.5 16.5h-19L12 3.5z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.6v.1" />
    </>
  ),
};

const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}> = ({ name, size = 24, color = COLORS.white, strokeWidth = 2, fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", overflow: "visible" }}
  >
    {ICON_PATHS[name]}
  </svg>
);

// Logo LLMFY (las tres capas se pueden dibujar por separado)
const LOGO_PATHS = ["M12 2L2 7l10 5 10-5-10-5z", "M2 12l10 5 10-5", "M2 17l10 5 10-5"];

const LogoMark: React.FC<{
  size: number;
  draw?: [number, number, number];
  glow?: number;
}> = ({ size, draw = [1, 1, 1], glow = 1 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      backgroundImage: BRAND_GRADIENT,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
      boxShadow: `0 ${size * 0.16}px ${size * 0.5}px ${COLORS.primary}${alpha(0.5 * glow)}, 0 0 ${size * 0.45}px ${COLORS.accent}${alpha(0.4 * glow)}`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.3) 0%, transparent 45%)",
      }}
    />
    <svg
      width={size * 0.6}
      height={size * 0.6}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: "relative" }}
    >
      {LOGO_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw[i]}
          opacity={draw[i] > 0.01 ? 1 : 0}
        />
      ))}
    </svg>
  </div>
);

// Fondo de marca: degradado profundo + orbes de color + suelo en perspectiva opcional
const Backdrop: React.FC<{
  frame: number;
  tint?: string;
  tint2?: string;
  grid?: number;
  glow?: number;
}> = ({ frame, tint = COLORS.primary, tint2 = COLORS.accent, grid = 0, glow = 1 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(ellipse 120% 90% at 50% 45%, #16122E 0%, ${COLORS.dark} 45%, ${COLORS.darker} 100%)`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: 1500,
        height: 1500,
        left: -450 + Math.sin(frame * 0.012) * 140,
        top: -800 + Math.cos(frame * 0.01) * 90,
        backgroundImage: `radial-gradient(circle, ${tint}${alpha(0.26 * glow)} 0%, transparent 62%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 1400,
        height: 1400,
        left: 1050 + Math.cos(frame * 0.011) * 120,
        top: 200 + Math.sin(frame * 0.013) * 100,
        backgroundImage: `radial-gradient(circle, ${tint2}${alpha(0.22 * glow)} 0%, transparent 62%)`,
      }}
    />
    {grid > 0 && (
      <div
        style={{
          position: "absolute",
          left: "-50%",
          width: "200%",
          top: "56%",
          height: 620,
          transform: "perspective(700px) rotateX(74deg)",
          transformOrigin: "50% 0%",
          backgroundImage: `linear-gradient(${tint}${alpha(0.6)} 2px, transparent 2px), linear-gradient(90deg, ${tint}${alpha(0.6)} 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `center ${frame * 1.6}px`,
          opacity: grid,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 45%)",
        }}
      />
    )}
  </AbsoluteFill>
);

// Partículas flotantes deterministas
const Particles: React.FC<{
  frame: number;
  count?: number;
  seed?: number;
  colors?: string[];
  speed?: number;
  opacity?: number;
}> = ({
  frame,
  count = 36,
  seed = 1,
  colors = [COLORS.primaryLight, COLORS.accentLight, COLORS.cyan],
  speed = 0.6,
  opacity = 0.7,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: count }, (_, i) => {
      const r1 = rand(seed * 100 + i);
      const r2 = rand(seed * 200 + i);
      const r3 = rand(seed * 300 + i);
      const size = 2 + r3 * 4;
      const travel = 1120;
      const x = r1 * 1920 + Math.sin(frame * 0.02 + i) * 20;
      const y = ((((r2 * travel - frame * speed * (0.4 + r3)) % travel) + travel) % travel) - 20;
      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.05 + i * 1.7));
      const color = colors[i % colors.length];
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size,
            borderRadius: "50%",
            background: color,
            opacity: opacity * twinkle,
            boxShadow: `0 0 ${size * 3}px ${color}`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// Anillo expansivo de impacto
const Shockwave: React.FC<{
  frame: number;
  at: number;
  x: number;
  y: number;
  color?: string;
  radius?: number;
  duration?: number;
}> = ({ frame, at, x, y, color = COLORS.primaryLight, radius = 700, duration = 26 }) => {
  const t = (frame - at) / duration;
  if (t < 0 || t > 1) return null;
  const r = EASE_OUT(t) * radius;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `${1 + 4 * (1 - t)}px solid ${color}`,
        opacity: (1 - t) * 0.85,
        boxShadow: `0 0 40px ${color}${alpha(0.6 * (1 - t))}, inset 0 0 40px ${color}${alpha(0.35 * (1 - t))}`,
        pointerEvents: "none",
      }}
    />
  );
};

// Etiqueta pequeña en mayúsculas
const Eyebrow: React.FC<{ children: React.ReactNode; color: string; style?: React.CSSProperties }> = ({
  children,
  color,
  style,
}) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

// Viñeta
const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.55 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,${intensity}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// Grano estático: rompe el banding de los degradados sin disparar el bitrate
const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      mixBlendMode: "overlay",
      pointerEvents: "none",
    }}
  />
);

// ============================================
// TRANSICIONES
// ============================================
type ShellTransition = "none" | "fade" | "zoom" | "push-up" | "iris";

// Envuelve una escena y aplica su entrada y su salida
const SceneShell: React.FC<{
  children: React.ReactNode;
  enter?: ShellTransition;
  exit?: ShellTransition;
  enterFrames?: number;
  exitFrames?: number;
  origin?: string; // punto de fuga del zoom de salida
  irisOrigin?: [number, number];
}> = ({
  children,
  enter = "none",
  exit = "none",
  enterFrames = 14,
  exitFrames = 14,
  origin = "50% 50%",
  irisOrigin = [960, 540],
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = enter === "none" ? 1 : progress(frame, 0, enterFrames, EASE_IN_OUT);
  const outP = exit === "none" ? 0 : progress(frame, durationInFrames - exitFrames, exitFrames, EASE_IN);

  const transforms: string[] = [];
  const filters: string[] = [];
  let opacity = 1;
  let clipPath: string | undefined;

  if (enter === "fade") opacity *= inP;
  if (enter === "zoom") {
    transforms.push(`scale(${lerp(0.72, 1, inP)})`);
    filters.push(`blur(${(1 - inP) * 16}px)`);
    opacity *= inP;
  }
  if (enter === "push-up") transforms.push(`translateY(${(1 - inP) * 1080}px)`);
  if (enter === "iris" && inP < 1) {
    clipPath = `circle(${inP * 1250}px at ${irisOrigin[0]}px ${irisOrigin[1]}px)`;
  }

  if (exit === "fade") opacity *= 1 - outP;
  if (exit === "zoom") {
    transforms.push(`scale(${lerp(1, 2.4, outP)})`);
    filters.push(`blur(${outP * 20}px)`);
    opacity *= 1 - outP;
  }
  if (exit === "push-up") transforms.push(`translateY(${-outP * 1080}px)`);

  return (
    <AbsoluteFill
      style={{
        transform: transforms.length ? transforms.join(" ") : undefined,
        transformOrigin: origin,
        filter: filters.length && (inP < 1 || outP > 0) ? filters.join(" ") : undefined,
        opacity,
        clipPath,
        overflow: "hidden",
      }}
    >
      {children}
      {enter === "iris" && inP < 1 && (
        <div
          style={{
            position: "absolute",
            left: irisOrigin[0] - inP * 1250,
            top: irisOrigin[1] - inP * 1250,
            width: inP * 2500,
            height: inP * 2500,
            borderRadius: "50%",
            border: `6px solid ${COLORS.primaryLight}`,
            boxShadow: `0 0 60px ${COLORS.accent}, inset 0 0 60px ${COLORS.accent}`,
            opacity: 1 - inP,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Destello blanco (drop musical)
const FlashOverlay: React.FC<{ duration?: number }> = ({ duration = 18 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, duration], [0.95, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  return <AbsoluteFill style={{ background: COLORS.white, opacity, pointerEvents: "none" }} />;
};

// Barras de color que tapan la pantalla y se retiran: el corte ocurre tapado
const ShutterWipe: React.FC<{
  direction?: "right" | "down";
  colors?: string[];
  half?: number;
}> = ({
  direction = "right",
  colors = [COLORS.primaryDark, COLORS.primary, COLORS.accent, COLORS.accentDark, COLORS.primaryLight],
  half = 10,
}) => {
  const frame = useCurrentFrame();
  const n = colors.length;
  const step = 1.2;
  const travel = half - (n - 1) * step;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {colors.map((color, i) => {
        const inP = progress(frame, i * step, travel, EASE_IN_OUT);
        const outP = progress(frame, half + i * step, travel, EASE_IN_OUT);
        const offset = (inP - 1 + outP) * 2300;
        const common: React.CSSProperties = {
          position: "absolute",
          backgroundImage: `linear-gradient(${direction === "right" ? 90 : 180}deg, ${color} 0%, ${color} 92%, ${COLORS.white}AA 100%)`,
        };
        return direction === "right" ? (
          <div
            key={i}
            style={{
              ...common,
              left: -200,
              width: 2320,
              top: (1080 / n) * i - 2,
              height: 1080 / n + 4,
              transform: `translateX(${offset}px) skewX(-14deg)`,
            }}
          />
        ) : (
          <div
            key={i}
            style={{
              ...common,
              top: -120,
              height: 1320,
              left: (1920 / n) * i - 2,
              width: 1920 / n + 4,
              transform: `translateY(${offset * 0.6}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Corte con glitch: franjas RGB desplazadas
const GlitchOverlay: React.FC<{ duration?: number }> = ({ duration = 14 }) => {
  const frame = useCurrentFrame();
  if (frame >= duration) return null;
  const strength = Math.sin((frame / duration) * Math.PI);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: 10 }, (_, i) => {
        const r = rand(frame * 31 + i * 7);
        const top = rand(frame * 17 + i * 3) * 1080;
        const height = 4 + r * 70;
        const color = [COLORS.cyan, COLORS.pink, COLORS.primaryLight][i % 3];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (rand(i + frame * 5) - 0.5) * 240,
              width: 2160,
              top,
              height,
              background: color,
              opacity: 0.32 * strength * (0.4 + r),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================
// DEMO DE IA (se usa en el hook y en el resultado)
// ============================================
const QUESTION = "¿Qué clínica dental me recomiendas en Madrid?";
const ANSWER_INTRO = "Estas son las clínicas más recomendadas:";

const PromptBox: React.FC<{
  id: string;
  typed: number;
  draw: number;
  fill: number;
  cursorOn: boolean;
  sendScale?: number;
  width?: number;
}> = ({ id, typed, draw, fill, cursorOn, sendScale = 1, width = 1180 }) => {
  const height = 116;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: 32,
        background: `rgba(22,18,44,${0.82 * fill})`,
        boxShadow: `0 30px 80px rgba(0,0,0,${0.5 * fill}), 0 0 70px ${COLORS.primary}${alpha(0.28 * fill)}`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 26px",
        fontFamily: FONT,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.primaryLight} />
            <stop offset="55%" stopColor={COLORS.accent} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
        </defs>
        <rect
          x={1.5}
          y={1.5}
          width={width - 3}
          height={height - 3}
          rx={31}
          fill="none"
          stroke={`url(#${id}-stroke)`}
          strokeWidth={3}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - draw}
        />
      </svg>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          backgroundImage: BRAND_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: fill,
          flexShrink: 0,
        }}
      >
        <Icon name="sparkle" size={34} fill={COLORS.white} color={COLORS.white} strokeWidth={1} />
      </div>
      <div
        style={{
          flex: 1,
          fontSize: 38,
          fontWeight: 500,
          color: typed > 0 ? COLORS.white : `${COLORS.gray}AA`,
          whiteSpace: "nowrap",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          opacity: fill,
        }}
      >
        {typed > 0 ? QUESTION.slice(0, typed) : "Pregunta a la IA…"}
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: 44,
            marginLeft: 4,
            background: COLORS.primaryLight,
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </div>
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundImage: BRAND_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${sendScale})`,
          opacity: fill,
          boxShadow: `0 0 30px ${COLORS.accent}66`,
          flexShrink: 0,
        }}
      >
        <Icon name="send" size={34} strokeWidth={2.6} />
      </div>
    </div>
  );
};

type ChipTone = "neutral" | "missing" | "cited";
type SourceChip = { domain: string; tone: ChipTone; appearAt: number; resolveAt?: number };

const CARD_W = 1180;
const CARD_H = 500;
const CARD_PAD = 48;
const CHIP_W = 252;
const CHIP_GAP = 16;
const CHIPS_TOP = 342;

const SourceChipView: React.FC<{ chip: SourceChip; frame: number; fps: number }> = ({ chip, frame, fps }) => {
  const pop = spring({ frame: frame - chip.appearAt, fps, config: { damping: 13, stiffness: 160 } });
  const resolved = chip.resolveAt === undefined ? 1 : progress(frame, chip.resolveAt, 6);
  const jolt = chip.resolveAt === undefined ? { x: 0, y: 0 } : shake(frame, chip.resolveAt, 9, 12);

  const isMissing = chip.tone === "missing";
  const isCited = chip.tone === "cited";
  const accent = isMissing ? COLORS.red : isCited ? COLORS.green : COLORS.primaryLight;
  const border = isMissing
    ? resolved > 0
      ? `2px solid ${COLORS.red}`
      : `2px dashed ${COLORS.gray}88`
    : isCited
      ? `2px solid ${COLORS.green}`
      : "1px solid rgba(255,255,255,0.16)";

  return (
    <div
      style={{
        width: CHIP_W,
        height: 56,
        borderRadius: 28,
        border,
        background: isMissing
          ? `rgba(239,68,68,${0.14 * resolved})`
          : isCited
            ? "rgba(34,197,94,0.14)"
            : "rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 18px",
        boxSizing: "border-box",
        opacity: Math.min(1, pop * 1.5),
        transform: `translate(${jolt.x}px, ${(1 - pop) * 26 + jolt.y}px) scale(${lerp(0.7, 1, pop)})`,
        boxShadow: isCited
          ? `0 0 34px ${COLORS.green}66`
          : isMissing && resolved > 0
            ? `0 0 30px ${COLORS.red}${alpha(0.5 * resolved)}`
            : "none",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isMissing || isCited ? accent : `linear-gradient(135deg, #4B5563 0%, #6B7280 100%)`,
          opacity: isMissing ? 0.35 + 0.65 * resolved : 1,
        }}
      >
        {isMissing ? (
          <Icon name="cross" size={16} strokeWidth={3} />
        ) : isCited ? (
          <Icon name="check" size={16} strokeWidth={3} />
        ) : (
          <Icon name="globe" size={16} strokeWidth={2} />
        )}
      </div>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 20,
          fontWeight: 600,
          color: isMissing ? (resolved > 0 ? "#FEE2E2" : COLORS.gray) : isCited ? COLORS.white : COLORS.grayLight,
          textDecoration: isMissing && resolved > 0.5 ? "line-through" : "none",
          textDecorationColor: COLORS.red,
          textDecorationThickness: 3,
          whiteSpace: "nowrap",
        }}
      >
        {chip.domain}
      </span>
    </div>
  );
};

const AIAnswerCard: React.FC<{
  frame: number;
  openAt: number;
  chips: SourceChip[];
  slideInFirst?: number; // la primera fuente entra empujando a las demás
  scanFrom?: number;
  focusChip: number;
  dim?: number;
  callout?: { at: number; text: string; color: string };
}> = ({ frame, openAt, chips, slideInFirst, scanFrom, focusChip, dim = 0, callout }) => {
  const { fps } = useVideoConfig();
  const t = frame - openAt;
  const open = progress(t, 0, 16);
  const header = progress(t, 2, 10);
  const thinking = t > 2 && t < 14;
  const introChars = Math.max(0, Math.min(ANSWER_INTRO.length, Math.floor((t - 6) * 3.2)));
  const rows = [0, 1, 2].map((i) => progress(t, 12 + i * 4, 14));
  const sourcesLabel = progress(t, 18, 10);
  const slide = slideInFirst === undefined ? 1 : progress(frame, slideInFirst, 16, EASE_IN_OUT);
  const others = 1 - dim * 0.7;
  const calloutP = callout ? spring({ frame: frame - callout.at, fps, config: { damping: 12, stiffness: 150 } }) : 0;
  const focusX = CARD_PAD + focusChip * (CHIP_W + CHIP_GAP) + CHIP_W / 2;

  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        borderRadius: 34,
        background: "rgba(20,17,38,0.9)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 80px ${COLORS.primary}22`,
        fontFamily: FONT,
        clipPath: open < 1 ? `inset(0 0 ${(1 - open) * 100}% 0 round 34px)` : undefined,
        opacity: open > 0 ? 1 : 0,
      }}
    >
      {/* Cabecera */}
      <div
        style={{
          position: "absolute",
          left: CARD_PAD,
          top: 34,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: header * others,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundImage: BRAND_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="sparkle" size={24} fill={COLORS.white} strokeWidth={1} />
        </div>
        <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.grayLight }}>Respuesta de la IA</span>
        {thinking &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 9,
                height: 9,
                borderRadius: 5,
                background: COLORS.primaryLight,
                transform: `translateY(${-7 * Math.max(0, Math.sin(frame * 0.45 - i * 0.9))}px)`,
              }}
            />
          ))}
      </div>

      {/* Texto de la respuesta */}
      <div
        style={{
          position: "absolute",
          left: CARD_PAD,
          top: 104,
          fontSize: 31,
          fontWeight: 600,
          color: COLORS.white,
          opacity: others,
          whiteSpace: "nowrap",
        }}
      >
        {ANSWER_INTRO.slice(0, introChars)}
      </div>
      {rows.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: CARD_PAD,
            top: 164 + i * 46,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: Math.min(1, p * 2) * others,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              background: "rgba(129,140,248,0.2)",
              color: COLORS.primaryLight,
              fontSize: 17,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {i + 1}
          </div>
          <div
            style={{
              width: [720, 590, 660][i] * p,
              height: 16,
              borderRadius: 8,
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 100%)`,
            }}
          />
          <div
            style={{
              width: [120, 180, 90][i] * p,
              height: 16,
              borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
            }}
          />
        </div>
      ))}

      {/* Fuentes */}
      <div
        style={{
          position: "absolute",
          left: CARD_PAD,
          top: 302,
          fontFamily: MONO,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: COLORS.gray,
          opacity: sourcesLabel * others,
        }}
      >
        Fuentes citadas
      </div>
      <div
        style={{
          position: "absolute",
          left: CARD_PAD,
          top: CHIPS_TOP,
          width: CARD_W - CARD_PAD * 2,
          height: 64,
          display: "flex",
          overflow: "hidden",
          padding: "4px 0",
          margin: "-4px 0",
        }}
      >
        {chips.map((chip, i) => (
          <div
            key={chip.domain}
            style={{
              width: (CHIP_W + CHIP_GAP) * (i === 0 ? slide : 1),
              flexShrink: 0,
              opacity: i === focusChip ? 1 : others,
            }}
          >
            <SourceChipView chip={chip} frame={frame} fps={fps} />
          </div>
        ))}
        {/* Barrido de búsqueda */}
        {scanFrom !== undefined && frame >= scanFrom && frame <= scanFrom + 14 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 90,
              left: lerp(-90, CARD_W - CARD_PAD * 2, progress(frame, scanFrom, 14, EASE_IN_OUT)),
              backgroundImage: `linear-gradient(90deg, transparent, ${COLORS.cyan}88, transparent)`,
            }}
          />
        )}
      </div>

      {/* Llamada sobre la fuente destacada */}
      {callout && calloutP > 0 && (
        <div
          style={{
            position: "absolute",
            top: CHIPS_TOP + 76,
            left: focusX,
            transform: `translateX(-50%) translateY(${(1 - calloutP) * 20}px) scale(${lerp(0.6, 1, calloutP)})`,
            opacity: Math.min(1, calloutP * 1.5),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: `12px solid ${callout.color}`,
            }}
          />
          <div
            style={{
              background: callout.color,
              color: COLORS.white,
              fontSize: 25,
              fontWeight: 800,
              padding: "10px 24px",
              borderRadius: 16,
              whiteSpace: "nowrap",
              boxShadow: `0 10px 40px ${callout.color}88`,
            }}
          >
            {callout.text}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// ESCENA 1: HOOK + DEMO IA (0 – 9,2 s)
// "Tus clientes ya no buscan. Preguntan." → la IA responde y tu web no aparece
// ============================================
const HOOK_CARD = { left: 370, top: 320 };
const HOOK_FOCUS = {
  x: HOOK_CARD.left + CARD_PAD + 3 * (CHIP_W + CHIP_GAP) + CHIP_W / 2,
  y: HOOK_CARD.top + CHIPS_TOP + 28,
};

const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Titular
  const slam = spring({ frame: frame - 54, fps, config: { damping: 11, stiffness: 170, mass: 0.8 } });
  const slamOpacity = interpolate(frame, [54, 58], [0, 1], CLAMP);
  const strike = progress(frame, 40, 10);
  const headMove = progress(frame, 72, 30, EASE_IN_OUT);
  const headExit = progress(frame, 132, 18, EASE_IN);
  const impact = shake(frame, 54, 16, 16);

  // Prompt
  const boxIn = progress(frame, 76, 26);
  const boxDraw = progress(frame, 80, 24, EASE_IN_OUT);
  const boxFill = progress(frame, 86, 16);
  const typed = Math.max(0, Math.min(QUESTION.length, Math.floor((frame - 96) * 1.5)));
  const typing = typed > 0 && typed < QUESTION.length;
  const cursorOn = typing || Math.floor(frame / 8) % 2 === 0;
  const press = interpolate(frame, [128, 131, 138], [1, 0.82, 1], CLAMP);
  const boxUp = progress(frame, 134, 26, EASE_IN_OUT);
  const boxY = lerp(lerp(1200, 590, boxIn), 230, boxUp);

  // Acercamiento final a "tuweb.com"
  const push = progress(frame, 226, 64, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame} grid={0.4 - 0.25 * boxUp} />
      <Particles frame={frame} count={30} seed={1} opacity={0.5} />

      <AbsoluteFill
        style={{
          transform: `translate(${impact.x}px, ${impact.y}px) scale(${1 + 0.24 * push})`,
          transformOrigin: `${HOOK_FOCUS.x}px ${HOOK_FOCUS.y}px`,
        }}
      >
        {/* Titular */}
        <div
          style={{
            position: "absolute",
            top: 330,
            left: 0,
            width: 1920,
            transformOrigin: "50% 0%",
            transform: `translateY(${-250 * headMove - 80 * headExit}px) scale(${1 - 0.42 * headMove})`,
            opacity: 1 - headExit,
          }}
        >
          <KineticWords
            text="Tus clientes ya no buscan."
            frame={frame}
            start={6}
            stagger={6}
            fontSize={90}
            weight={700}
            renderWord={(word, i) =>
              i === 4 ? (
                <span style={{ position: "relative", display: "inline-block", color: COLORS.gray }}>
                  {word}
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "52%",
                      height: 9,
                      width: `${strike * 100}%`,
                      borderRadius: 5,
                      backgroundImage: WARNING_GRADIENT,
                      boxShadow: `0 0 20px ${COLORS.pink}`,
                    }}
                  />
                </span>
              ) : (
                word
              )
            }
          />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              opacity: slamOpacity,
              transform: `scale(${interpolate(slam, [0, 1], [1.9, 1])})`,
              filter: `blur(${Math.max(0, 1 - slam) * 14}px) drop-shadow(0 0 50px ${COLORS.accent}88)`,
            }}
          >
            <GradientText
              gradient={HERO_GRADIENT}
              style={{ fontSize: 180, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.05 }}
            >
              Preguntan.
            </GradientText>
          </div>
        </div>
        <Shockwave frame={frame} at={54} x={960} y={560} color={COLORS.accentLight} radius={900} />
        <Shockwave frame={frame} at={58} x={960} y={560} color={COLORS.cyan} radius={700} />

        {/* Respuesta de la IA */}
        <div style={{ position: "absolute", left: HOOK_CARD.left, top: HOOK_CARD.top }}>
          <AIAnswerCard
            frame={frame}
            openAt={154}
            focusChip={3}
            scanFrom={206}
            dim={push}
            chips={[
              { domain: "competidor1.com", tone: "neutral", appearAt: 179 },
              { domain: "competidor2.com", tone: "neutral", appearAt: 193 },
              { domain: "competidor3.com", tone: "neutral", appearAt: 207 },
              { domain: "tuweb.com", tone: "missing", appearAt: 212, resolveAt: 221 },
            ]}
            callout={{ at: 228, text: "Tu web no aparece", color: COLORS.red }}
          />
        </div>

        {/* Prompt a la IA */}
        <div
          style={{
            position: "absolute",
            left: 960 - 590,
            top: boxY - 58,
            transform: `scale(${lerp(1, 0.92, boxUp)})`,
            opacity: boxIn > 0 ? 1 : 0,
          }}
        >
          <PromptBox id="hook-prompt" typed={typed} draw={boxDraw} fill={boxFill} cursorOn={cursorOn} sendScale={press} />
          {/* Onda al enviar */}
          {frame >= 128 && frame < 150 && (
            <div
              style={{
                position: "absolute",
                right: 26 + 35 - (frame - 128) * 4,
                top: 58 - (frame - 128) * 4,
                width: (frame - 128) * 8,
                height: (frame - 128) * 8,
                borderRadius: "50%",
                border: `3px solid ${COLORS.accentLight}`,
                opacity: 1 - (frame - 128) / 22,
                transform: "translateX(50%)",
              }}
            />
          )}
        </div>

      </AbsoluteFill>

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 2: EL PROBLEMA EN DATOS (9,2 – 14,7 s)
// ============================================
type StatViz = "donut" | "waffle" | "drop";
const STATS: {
  value: number;
  decimals: number;
  prefix: string;
  label: string;
  source: string;
  color: string;
  viz: StatViz;
  at: number;
}[] = [
  {
    value: 73.7,
    decimals: 1,
    prefix: "",
    label: "de las búsquedas siguen en Google",
    source: "SparkToro/Datos 2026",
    color: COLORS.primaryLight,
    viz: "donut",
    at: 6,
  },
  {
    value: 3.2,
    decimals: 1,
    prefix: "",
    label: "en herramientas IA (ChatGPT, etc.)",
    source: "Todas combinadas",
    color: COLORS.cyan,
    viz: "waffle",
    at: beats(3),
  },
  {
    value: 20,
    decimals: 0,
    prefix: "−",
    label: "de tráfico orgánico por AI Overviews",
    source: "Datos propios de agencia",
    color: COLORS.red,
    viz: "drop",
    at: beats(6),
  },
];

const DonutViz: React.FC<{ frame: number; at: number; value: number }> = ({ frame, at, value }) => {
  const p = progress(frame, at + 4, 40, EASE_IN_OUT);
  const r = 92;
  const c = 2 * Math.PI * r;
  return (
    <svg width={230} height={230} viewBox="0 0 230 230">
      <defs>
        <linearGradient id="stats-donut" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COLORS.primaryLight} />
          <stop offset="100%" stopColor={COLORS.accent} />
        </linearGradient>
      </defs>
      <circle cx={115} cy={115} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={24} />
      <circle
        cx={115}
        cy={115}
        r={r}
        fill="none"
        stroke="url(#stats-donut)"
        strokeWidth={24}
        strokeLinecap="round"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={c * (1 - (p * value) / 100)}
        transform="rotate(-90 115 115)"
      />
      <text x={115} y={124} textAnchor="middle" fill={COLORS.grayLight} fontSize={26} fontWeight={700} fontFamily={FONT}>
        Google
      </text>
    </svg>
  );
};

const WaffleViz: React.FC<{ frame: number; at: number; value: number; color: string }> = ({
  frame,
  at,
  value,
  color,
}) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 17px)", gap: 5 }}>
    {Array.from({ length: 100 }, (_, i) => {
      const row = Math.floor(i / 10);
      const col = i % 10;
      const appear = progress(frame, at + (row + col) * 0.8, 8);
      const lit = Math.min(1, Math.max(0, value - i)) * progress(frame, at + 22 + i * 3, 8);
      return (
        <div
          key={i}
          style={{
            width: 17,
            height: 17,
            borderRadius: 4,
            background: "rgba(255,255,255,0.1)",
            opacity: appear,
            transform: `scale(${lerp(0.3, 1, appear)})`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {lit > 0 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${lit * 100}%`,
                background: color,
                boxShadow: `0 0 12px ${color}`,
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

const DropViz: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const p = progress(frame, at + 2, 34, EASE_IN_OUT);
  const marker = progress(frame, at + 16, 12);
  const lost = progress(frame, at + 26, 12);
  // Tráfico estable y caída del 20 % con la llegada de las AI Overviews.
  // El eje empieza en 0 (y = 220) para no exagerar la caída.
  const bottom = 220;
  const dropX = 228;
  const points: [number, number][] = [
    [0, 70], [38, 64], [76, 68], [114, 60], [152, 64], [190, 58], [dropX, 62],
    [266, 94], [304, 88], [342, 96], [380, 89], [400, 92],
  ];
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const area = `${line} L 400 ${bottom} L 0 ${bottom} Z`;
  const gap = `M ${dropX} 62 L 400 58 L 400 92 L 380 89 L 342 96 L 304 88 L 266 94 Z`;
  return (
    <svg width={400} height={236} viewBox="0 0 400 236" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="stats-drop-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.4} />
          <stop offset="100%" stopColor={COLORS.red} stopOpacity={0} />
        </linearGradient>
        <clipPath id="stats-drop-reveal">
          <rect x={-10} y={-10} width={410 * p + 10} height={bottom + 30} />
        </clipPath>
      </defs>
      {[40, 100, 160, bottom].map((y) => (
        <line key={y} x1={0} x2={400} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      ))}
      <g clipPath="url(#stats-drop-reveal)">
        <path d={area} fill="url(#stats-drop-area)" />
        <path
          d={line}
          fill="none"
          stroke={COLORS.red}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 8px ${COLORS.red})` }}
        />
      </g>
      {/* Tráfico perdido frente a la tendencia anterior */}
      <path d={gap} fill={`${COLORS.white}14`} opacity={lost} />
      <path d={`M ${dropX} 62 L 400 58`} fill="none" stroke={COLORS.grayLight} strokeWidth={2} strokeDasharray="6 6" opacity={0.7 * lost} />
      <line x1={dropX} x2={dropX} y1={24} y2={bottom} stroke={COLORS.accentLight} strokeWidth={2} strokeDasharray="5 6" opacity={marker} />
      <g opacity={marker} transform={`translate(${dropX} 8)`}>
        <rect x={-78} y={-18} width={156} height={34} rx={10} fill={COLORS.accentDark} />
        <text x={0} y={5} textAnchor="middle" fill={COLORS.white} fontSize={17} fontWeight={700} fontFamily={FONT}>
          AI Overviews
        </text>
      </g>
    </svg>
  );
};

const Scene2_Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jitter = frame > 154 ? (rand(frame) - 0.5) * 18 : 0;

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame + 300} tint={COLORS.accentDark} tint2={COLORS.pink} glow={0.8} />
      <Particles frame={frame} count={24} seed={2} opacity={0.35} />

      <AbsoluteFill style={{ transform: `translateX(${jitter}px) scale(${lerp(1.03, 1, progress(frame, 0, 160, EASE_IN_OUT))})` }}>
        <div style={{ position: "absolute", top: 110, width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: progress(frame, 0, 12) }}>
            <Icon name="warning" size={28} color={COLORS.accentLight} strokeWidth={2.2} />
            <Eyebrow color={COLORS.accentLight}>El problema</Eyebrow>
          </div>
          <KineticWords
            text="El SEO tradicional ya no es suficiente"
            frame={frame}
            start={4}
            stagger={3}
            fontSize={70}
            highlight={{ 3: WARNING_GRADIENT, 4: WARNING_GRADIENT, 5: WARNING_GRADIENT, 6: WARNING_GRADIENT }}
          />
        </div>

        <div style={{ position: "absolute", top: 360, left: 130, display: "flex", gap: 50 }}>
          {STATS.map((stat, i) => {
            const enter = spring({ frame: frame - stat.at, fps, config: { damping: 15, stiffness: 120 } });
            const count = progress(frame, stat.at + 6, 34, EASE_IN_OUT) * stat.value;
            const pulse = frame >= stat.at ? beatPulse(frame, 6) : 0;
            return (
              <div
                key={i}
                style={{
                  width: 520,
                  height: 580,
                  borderRadius: 34,
                  padding: 44,
                  boxSizing: "border-box",
                  background: "rgba(20,17,38,0.78)",
                  border: `1px solid ${stat.color}${alpha(0.35)}`,
                  boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 ${40 + 30 * pulse}px ${stat.color}${alpha(0.12 + 0.12 * pulse)}`,
                  opacity: Math.min(1, enter * 1.4),
                  transform: `translateY(${(1 - enter) * 90}px) scale(${lerp(0.9, 1, enter)})`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {stat.viz === "donut" && <DonutViz frame={frame} at={stat.at} value={stat.value} />}
                  {stat.viz === "waffle" && <WaffleViz frame={frame} at={stat.at} value={stat.value} color={stat.color} />}
                  {stat.viz === "drop" && <DropViz frame={frame} at={stat.at} />}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    fontSize: 104,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    color: stat.viz === "drop" ? COLORS.red : COLORS.white,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {stat.prefix}
                  {formatEs(count, stat.decimals)}
                  <span style={{ fontSize: 64, marginLeft: 6 }}>%</span>
                </div>
                <div style={{ marginTop: 16, fontSize: 29, fontWeight: 600, lineHeight: 1.3, color: COLORS.grayLight }}>
                  {stat.label}
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    fontFamily: MONO,
                    fontSize: 16,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: COLORS.gray,
                    opacity: 0.75,
                  }}
                >
                  {stat.source}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 3: "SI LA IA NO TE CITA, NO EXISTES." (14,7 – 16,6 s)
// Una palabra por tiempo hasta el drop
// ============================================
const KICKER: { text: string; at: number; line: 0 | 1 }[] = [
  { text: "Si la IA", at: 0, line: 0 },
  { text: "no te cita,", at: beats(1), line: 0 },
  { text: "no", at: beats(2), line: 1 },
  { text: "existes.", at: beats(3), line: 1 },
];

const Scene3_Kicker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = KICKER.reduce((acc, k) => (frame >= k.at ? acc + Math.exp(-(frame - k.at) / 5) : acc), 0);
  const suck = progress(frame, 46, 10, EASE_IN);
  const last = KICKER[3].at;
  const glitchOn = frame >= last && (frame - last) % 5 < 2;

  const renderChunk = (k: (typeof KICKER)[number], index: number) => {
    const p = spring({ frame: frame - k.at, fps, config: { damping: 13, stiffness: 200, mass: 0.7 } });
    const visible = frame >= k.at;
    const isLast = index === 3;
    const base: React.CSSProperties = {
      display: "inline-block",
      opacity: visible ? Math.min(1, (frame - k.at + 1) / 3) : 0,
      transform: `scale(${lerp(1.7, 1, p)})`,
      filter: `blur(${Math.max(0, 1 - p) * 16}px)`,
      color: isLast ? COLORS.red : COLORS.white,
      position: "relative",
    };
    return (
      <span key={index} style={base}>
        {k.text}
        {isLast && glitchOn && (
          <>
            <span style={{ position: "absolute", left: -8, top: 0, color: COLORS.cyan, opacity: 0.7, clipPath: "inset(12% 0 55% 0)" }}>
              {k.text}
            </span>
            <span style={{ position: "absolute", left: 10, top: 0, color: COLORS.pink, opacity: 0.7, clipPath: "inset(60% 0 8% 0)" }}>
              {k.text}
            </span>
          </>
        )}
      </span>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(239,68,68,${0.08 + 0.18 * Math.min(punch, 1)}) 0%, ${COLORS.darker} 60%)`,
        overflow: "hidden",
        fontFamily: FONT,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          fontWeight: 800,
          letterSpacing: "-0.045em",
          lineHeight: 1.05,
          transform: `scale(${(1 + 0.035 * punch) * lerp(1, 0.86, suck)})`,
          filter: `brightness(${lerp(1, 2.6, suck)})`,
        }}
      >
        <div style={{ display: "flex", gap: 34, fontSize: 116 }}>
          {KICKER.filter((k) => k.line === 0).map((k) => renderChunk(k, KICKER.indexOf(k)))}
        </div>
        <div style={{ display: "flex", gap: 50, fontSize: 230 }}>
          {KICKER.filter((k) => k.line === 1).map((k) => renderChunk(k, KICKER.indexOf(k)))}
        </div>
      </div>
      <Vignette intensity={0.7} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 4: DROP → LOGO LLMFY (16,6 – 20,3 s)
// ============================================
const LOCKUP = { tileX: 615, wordX: 737, y: 500 };
const CORE = { x: 960, y: 660, size: 120 };

const Scene4_Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tile = spring({ frame, fps, config: { damping: 12, stiffness: 110 } });
  const draw: [number, number, number] = [progress(frame, 6, 14), progress(frame, 15, 14), progress(frame, 24, 14)];
  const slide = progress(frame, 26, 22, EASE_IN_OUT);
  const toCore = progress(frame, 88, 22, EASE_IN_OUT);
  const tagline = progress(frame, beats(4), 22);
  const underline = progress(frame, beats(4) + 6, 20);
  const outText = progress(frame, 84, 12, EASE_IN);

  const tileSize = lerp(170, CORE.size, toCore);
  const tileX = lerp(lerp(960, LOCKUP.tileX, slide), CORE.x, toCore);
  const tileY = lerp(LOCKUP.y, CORE.y, toCore);
  const pulse = beatPulse(frame, 6);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame + 500} glow={1.2} />

      {/* Rayos de luz */}
      <div
        style={{
          position: "absolute",
          left: 960 - 1400,
          top: 500 - 1400,
          width: 2800,
          height: 2800,
          backgroundImage: `repeating-conic-gradient(from ${frame * 0.4}deg at 50% 50%, ${COLORS.primaryLight}26 0deg 5deg, transparent 5deg 18deg)`,
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 55%)",
          maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
          opacity: lerp(1, 0.35, progress(frame, 0, 30)) * (1 - toCore * 0.6),
        }}
      />

      {/* Explosión de partículas */}
      {Array.from({ length: 70 }, (_, i) => {
        const angle = rand(i + 40) * Math.PI * 2;
        const dist = (200 + rand(i + 90) * 900) * (1 - Math.exp(-frame / 12));
        const size = 3 + rand(i + 7) * 6;
        const color = [COLORS.primaryLight, COLORS.accentLight, COLORS.cyan, COLORS.pink][i % 4];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 + Math.cos(angle) * dist,
              top: 500 + Math.sin(angle) * dist * 0.75,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
              opacity: interpolate(frame, [0, 10, 70], [0, 1, 0], CLAMP),
            }}
          />
        );
      })}

      <Shockwave frame={frame} at={0} x={960} y={500} color={COLORS.white} radius={1100} duration={30} />
      <Shockwave frame={frame} at={5} x={960} y={500} color={COLORS.accentLight} radius={900} duration={30} />
      <Shockwave frame={frame} at={10} x={960} y={500} color={COLORS.cyan} radius={700} duration={30} />

      {/* Halo detrás del logo */}
      <div
        style={{
          position: "absolute",
          left: tileX - 450,
          top: tileY - 450,
          width: 900,
          height: 900,
          borderRadius: "50%",
          backgroundImage: `radial-gradient(circle, ${COLORS.primary}${alpha(0.45 + 0.25 * pulse)} 0%, transparent 60%)`,
        }}
      />

      {/* Icono */}
      <div
        style={{
          position: "absolute",
          left: tileX - tileSize / 2,
          top: tileY - tileSize / 2,
          transform: `scale(${tile}) rotate(${(1 - tile) * -120}deg)`,
        }}
      >
        <LogoMark size={tileSize} draw={draw} glow={1 + pulse * 0.6} />
      </div>

      {/* Wordmark */}
      <div
        style={{
          position: "absolute",
          left: LOCKUP.wordX,
          top: LOCKUP.y - 118,
          display: "flex",
          fontSize: 200,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.18,
          color: COLORS.white,
        }}
      >
        {"LLMFY".split("").map((letter, i) => {
          const p = spring({ frame: frame - (32 + i * 4), fps, config: { damping: 14, stiffness: 170 } });
          const out = progress(frame, 84 + i * 2, 10, EASE_IN);
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0 0.02em" }}>
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - p) * 110 + out * 110}%)`,
                }}
              >
                {letter}
              </span>
            </span>
          );
        })}
      </div>

      {/* Claim */}
      <div
        style={{
          position: "absolute",
          top: 648,
          width: 1920,
          textAlign: "center",
          fontSize: 32,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: `${lerp(0.9, 0.34, tagline)}em`,
          color: COLORS.grayLight,
          opacity: tagline * (1 - outText),
        }}
      >
        AI Search Optimization
      </div>
      <div
        style={{
          position: "absolute",
          top: 710,
          left: 960 - 260 * underline,
          width: 520 * underline,
          height: 4,
          borderRadius: 2,
          backgroundImage: HERO_GRADIENT,
          boxShadow: `0 0 20px ${COLORS.accent}`,
          opacity: 1 - outText,
        }}
      />

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 5: PLATAFORMAS IA (20,3 – 24,0 s)
// El logo es el núcleo de una órbita con ChatGPT, Perplexity, Claude y Google AI
// ============================================
const PLATFORMS = [
  { name: "ChatGPT", color: COLORS.accent },
  { name: "Perplexity", color: COLORS.cyan },
  { name: "Claude", color: COLORS.primaryLight },
  { name: "Google AI", color: COLORS.pink },
];
const PLATFORM_SWITCH = PLATFORMS.map((_, i) => beats(i * 2));
const ORBIT = { rx: 560, ry: 175 };

const Scene5_Platforms: React.FC = () => {
  const frame = useCurrentFrame();

  // Cada dos tiempos la órbita gira y trae la siguiente plataforma al frente
  const turn = PLATFORM_SWITCH.slice(1).reduce((acc, at) => acc + progress(frame, at - 4, 14, EASE_IN_OUT), 0);
  const drift = frame * 0.08;
  const pulse = beatPulse(frame, 6);

  const nodes = PLATFORMS.map((platform, i) => {
    const angle = ((90 + (i - turn) * 90 + drift) * Math.PI) / 180;
    const x = CORE.x + Math.cos(angle) * ORBIT.rx;
    const y = CORE.y + Math.sin(angle) * ORBIT.ry;
    const depth = (Math.sin(angle) + 1) / 2;
    const active = Math.max(0, 1 - Math.abs(turn - i));
    return { ...platform, x, y, depth, active };
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame + 700} tint={COLORS.primaryDark} tint2={COLORS.cyan} glow={0.9} />
      <Particles frame={frame} count={40} seed={5} opacity={0.55} />

      {/* Titular con nombre rotatorio */}
      <div style={{ position: "absolute", top: 70, width: 1920 }}>
        <KineticWords text="Optimiza tu web para" frame={frame} start={2} stagger={3} fontSize={62} weight={700} color={COLORS.grayLight} />
        <div
          style={{
            position: "relative",
            height: 240,
            marginTop: -34,
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        >
          {PLATFORMS.map((platform, i) => {
            const enterP = i === 0 ? progress(frame, 4, 12) : progress(frame, PLATFORM_SWITCH[i] - 2, 10);
            const exitP = i < PLATFORMS.length - 1 ? progress(frame, PLATFORM_SWITCH[i + 1] - 2, 10) : 0;
            return (
              <div
                key={platform.name}
                style={{
                  position: "absolute",
                  top: 40,
                  width: 1920,
                  textAlign: "center",
                  fontSize: 132,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.2,
                  color: platform.color,
                  transform: `translateY(${(1 - enterP) * 100 - exitP * 100}%)`,
                  filter: `blur(${(1 - enterP) * 10 + exitP * 10}px) drop-shadow(0 0 40px ${platform.color}88)`,
                  opacity: enterP * (1 - exitP),
                }}
              >
                {platform.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Órbita */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="platforms-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.white} />
            <stop offset="100%" stopColor={COLORS.accentLight} />
          </linearGradient>
        </defs>
        <ellipse cx={CORE.x} cy={CORE.y} rx={ORBIT.rx} ry={ORBIT.ry} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={2} strokeDasharray="4 10" />
        <ellipse cx={CORE.x} cy={CORE.y} rx={ORBIT.rx + 140} ry={ORBIT.ry + 46} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} />
        {[0, 1].map((k) => {
          const t = (((frame + k * BEAT * 2) % (BEAT * 4)) / (BEAT * 4));
          return (
            <ellipse
              key={k}
              cx={CORE.x}
              cy={CORE.y}
              rx={80 + t * 520}
              ry={(80 + t * 520) * 0.31}
              fill="none"
              stroke={COLORS.primaryLight}
              strokeWidth={2}
              opacity={(1 - t) * 0.5}
            />
          );
        })}
        {nodes.map((node) =>
          node.active > 0.02 ? (
            <g key={node.name} opacity={node.active}>
              <line
                x1={CORE.x}
                y1={CORE.y}
                x2={node.x}
                y2={node.y}
                stroke={node.color}
                strokeWidth={4}
                strokeDasharray="14 12"
                strokeDashoffset={-frame * 3}
                style={{ filter: `drop-shadow(0 0 8px ${node.color})` }}
              />
              {[0, 1, 2].map((m) => {
                const t = (frame * 0.05 + m / 3) % 1;
                return (
                  <circle key={m} cx={lerp(CORE.x, node.x, t)} cy={lerp(CORE.y, node.y, t)} r={6} fill={COLORS.white} style={{ filter: `drop-shadow(0 0 6px ${node.color})` }} />
                );
              })}
            </g>
          ) : null
        )}
      </svg>

      {/* Nodos de plataforma detrás del núcleo */}
      {nodes
        .filter((node) => node.depth < 0.5)
        .map((node) => (
          <PlatformNode key={node.name} {...node} />
        ))}

      {/* Núcleo LLMFY */}
      <div
        style={{
          position: "absolute",
          left: CORE.x - 300,
          top: CORE.y - 300,
          width: 600,
          height: 600,
          borderRadius: "50%",
          backgroundImage: `radial-gradient(circle, ${COLORS.primary}${alpha(0.4 + 0.25 * pulse)} 0%, transparent 60%)`,
        }}
      />
      <div style={{ position: "absolute", left: CORE.x - CORE.size / 2, top: CORE.y - CORE.size / 2, transform: `scale(${1 + 0.06 * pulse})` }}>
        <LogoMark size={CORE.size} glow={1 + pulse} />
      </div>

      {/* Nodos delante del núcleo */}
      {nodes
        .filter((node) => node.depth >= 0.5)
        .map((node) => (
          <PlatformNode key={node.name} {...node} />
        ))}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

const PlatformNode: React.FC<{ name: string; color: string; x: number; y: number; depth: number; active: number }> = ({
  name,
  color,
  x,
  y,
  depth,
  active,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${(0.72 + 0.4 * depth) * (1 + 0.14 * active)})`,
      opacity: 0.35 + 0.65 * depth,
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 30px",
      borderRadius: 40,
      background: `rgba(20,17,38,${0.85})`,
      border: `2px solid ${color}${alpha(0.35 + 0.65 * active)}`,
      boxShadow: `0 0 ${20 + 50 * active}px ${color}${alpha(0.2 + 0.5 * active)}`,
      fontSize: 34,
      fontWeight: 800,
      color: COLORS.white,
      whiteSpace: "nowrap",
      fontFamily: FONT,
    }}
  >
    <div style={{ width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 12px ${color}` }} />
    {name}
  </div>
);

// ============================================
// ESCENA 6: ANALIZA · OPTIMIZA · MONITORIZA (24,0 – 35,0 s)
// Tres paneles en una tira horizontal que la cámara recorre al compás
// ============================================
type Feature = { icon: IconName; title: string; desc: string; isNew?: boolean };
type FeatureStep = {
  number: string;
  verb: string;
  subtitle: string;
  color: string;
  visual: "scan" | "graph" | "radar";
  features: Feature[];
};

const FEATURE_STEPS: FeatureStep[] = [
  {
    number: "01",
    verb: "Analiza",
    subtitle: "Descubre cómo te ve la IA",
    color: COLORS.cyan,
    visual: "scan",
    features: [
      { icon: "gauge", title: "LLMO Score", desc: "Puntuación de optimización IA" },
      { icon: "shield", title: "E-E-A-T Audit", desc: "Auditoría de confianza y autoridad" },
      { icon: "semantic", title: "Semantic Analysis", desc: "Profundidad semántica vs competencia" },
      { icon: "quote", title: "LLM Citability", desc: "Probabilidad de citación por LLMs" },
    ],
  },
  {
    number: "02",
    verb: "Optimiza",
    subtitle: "Haz tu web fácil de citar",
    color: COLORS.accent,
    visual: "graph",
    features: [
      { icon: "tag", title: "Schema Scan", desc: "Datos estructurados para IA" },
      { icon: "robot", title: "Robots.txt Optimizer", desc: "Controla el acceso de bots IA" },
      { icon: "bolt", title: "IndexNow", desc: "Notifica cambios a buscadores al instante" },
      { icon: "network", title: "AI Building", desc: "Vecindario de co-citación IA", isNew: true },
    ],
  },
  {
    number: "03",
    verb: "Monitoriza",
    subtitle: "Sigue tu visibilidad en IA",
    color: COLORS.pink,
    visual: "radar",
    features: [
      { icon: "target", title: "Prompt Tracker", desc: "Monitoriza tu visibilidad en 5 plataformas IA", isNew: true },
      { icon: "sentiment", title: "Brand Sentiment", desc: "Análisis de sentimiento de marca" },
      { icon: "chart", title: "AI Analytics", desc: "Tráfico IA en tu Google Analytics", isNew: true },
    ],
  },
];

const STEP_STARTS = [0, bar(14) - bar(12), bar(16) - bar(12)];
const PAN_FRAMES = 16;

const VISUAL_BOX = { left: 930, top: 150, width: 880, height: 780 };

const ScanVisual: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const scanY = ((frame * 10) % 900) - 60;
  const line = (top: number, left: number, width: number, h = 14) => (
    <div style={{ position: "absolute", top, left, width, height: h, borderRadius: h / 2, background: `${color}${alpha(0.22)}` }} />
  );
  return (
    <div
      style={{
        position: "absolute",
        ...VISUAL_BOX,
        borderRadius: 28,
        border: `2px solid ${color}${alpha(0.3)}`,
        background: `${color}${alpha(0.03)}`,
        overflow: "hidden",
      }}
    >
      <div style={{ height: 54, borderBottom: `2px solid ${color}${alpha(0.22)}`, display: "flex", alignItems: "center", gap: 10, padding: "0 24px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: `${color}${alpha(0.4)}` }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 90, left: 40, width: 360, height: 200, borderRadius: 16, border: `2px solid ${color}${alpha(0.25)}` }} />
      {line(100, 440, 380, 22)}
      {line(146, 440, 320)}
      {line(176, 440, 350)}
      {line(206, 440, 260)}
      {line(330, 40, 780)}
      {line(360, 40, 720)}
      {line(390, 40, 760)}
      {line(420, 40, 540)}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", top: 480, left: 40 + i * 270, width: 240, height: 180, borderRadius: 16, border: `2px solid ${color}${alpha(0.22)}` }} />
      ))}
      {line(700, 40, 620)}
      {line(730, 40, 480)}
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY - 180, height: 180, backgroundImage: `linear-gradient(to bottom, transparent, ${color}${alpha(0.16)})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 3, background: color, boxShadow: `0 0 26px 8px ${color}${alpha(0.55)}` }} />
    </div>
  );
};

const GRAPH_NODES: [number, number, string][] = [
  [110, 110, "Organization"],
  [430, 70, "WebSite"],
  [760, 150, "Product"],
  [250, 340, "FAQPage"],
  [600, 320, ""],
  [820, 460, "Review"],
  [130, 590, "Article"],
  [470, 560, ""],
  [740, 690, "Person"],
];
const GRAPH_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 5],
  [3, 6],
  [4, 7],
  [6, 7],
  [7, 8],
  [5, 8],
  [2, 5],
];

const GraphVisual: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const pulse = beatPulse(frame, 6);
  return (
    <svg width={VISUAL_BOX.width} height={VISUAL_BOX.height} style={{ position: "absolute", left: VISUAL_BOX.left, top: VISUAL_BOX.top, overflow: "visible" }}>
      {GRAPH_EDGES.map(([a, b], i) => {
        const p = progress(frame, 4 + i * 3, 18);
        const [x1, y1] = GRAPH_NODES[a];
        const [x2, y2] = GRAPH_NODES[b];
        return <line key={i} x1={x1} y1={y1} x2={lerp(x1, x2, p)} y2={lerp(y1, y2, p)} stroke={color} strokeWidth={2.5} opacity={0.45} />;
      })}
      {GRAPH_NODES.map(([x, y, label], i) => {
        const p = progress(frame, i * 3, 14);
        return (
          <g key={i} opacity={p}>
            <circle cx={x} cy={y} r={14 + 6 * pulse * (i % 2)} fill={`${color}${alpha(0.25)}`} />
            <circle cx={x} cy={y} r={8} fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
            {label && (
              <text x={x + 22} y={y + 7} fill={COLORS.grayLight} fontSize={20} fontFamily={MONO} opacity={0.7}>
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const RADAR_BLIPS: [number, number][] = [
  [30, 230],
  [95, 140],
  [160, 300],
  [215, 190],
  [280, 260],
  [330, 110],
];

const RadarVisual: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const cx = VISUAL_BOX.width / 2;
  const cy = VISUAL_BOX.height / 2;
  const sweep = (frame * 5) % 360;
  return (
    <div style={{ position: "absolute", ...VISUAL_BOX }}>
      <div
        style={{
          position: "absolute",
          left: cx - 360,
          top: cy - 360,
          width: 720,
          height: 720,
          borderRadius: "50%",
          backgroundImage: `conic-gradient(from ${sweep - 70}deg, transparent 0deg, ${color}${alpha(0.32)} 70deg, transparent 71deg)`,
        }}
      />
      <svg width={VISUAL_BOX.width} height={VISUAL_BOX.height} style={{ position: "absolute", left: 0, top: 0 }}>
        {[120, 240, 360].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} opacity={0.3} />
        ))}
        <line x1={cx - 380} x2={cx + 380} y1={cy} y2={cy} stroke={color} strokeWidth={1.5} opacity={0.25} />
        <line x1={cx} x2={cx} y1={cy - 380} y2={cy + 380} stroke={color} strokeWidth={1.5} opacity={0.25} />
        {RADAR_BLIPS.map(([deg, r], i) => {
          const diff = (((sweep - deg) % 360) + 360) % 360;
          const glow = Math.exp(-diff / 60);
          const a = ((deg - 90) * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={cx + Math.cos(a) * r}
              cy={cy + Math.sin(a) * r}
              r={7 + 5 * glow}
              fill={color}
              opacity={0.25 + 0.75 * glow}
              style={{ filter: `drop-shadow(0 0 ${6 + 10 * glow}px ${color})` }}
            />
          );
        })}
      </svg>
    </div>
  );
};

const FeatureCard: React.FC<{ feature: Feature; color: string; frame: number; at: number }> = ({
  feature,
  color,
  frame,
  at,
}) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 120 } });
  const sweep = progress(frame, at + 6, 16, EASE_IN_OUT);
  const pulse = frame >= at ? beatPulse(frame, 6) : 0;
  return (
    <div
      style={{
        position: "relative",
        height: 118,
        borderRadius: 24,
        padding: "0 30px",
        display: "flex",
        alignItems: "center",
        gap: 26,
        background: "rgba(16,13,32,0.86)",
        border: `1px solid ${color}${alpha(0.4)}`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 ${30 + 24 * pulse}px ${color}${alpha(0.14 + 0.12 * pulse)}`,
        opacity: Math.min(1, p * 1.4),
        transform: `perspective(1400px) translateX(${(1 - p) * 360}px) rotateY(${(1 - p) * -40}deg)`,
        transformOrigin: "100% 50%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 18,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(135deg, ${color}${alpha(0.55)} 0%, ${color}${alpha(0.14)} 100%)`,
          boxShadow: `0 0 26px ${color}${alpha(0.35 + 0.3 * pulse)}`,
        }}
      >
        <Icon name={feature.icon} size={36} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: COLORS.white, letterSpacing: "-0.01em" }}>{feature.title}</span>
          {feature.isNew && (
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: COLORS.white,
                background: COLORS.accentLight,
                padding: "3px 9px",
                borderRadius: 7,
                letterSpacing: "0.06em",
              }}
            >
              NEW
            </span>
          )}
        </div>
        <div style={{ fontSize: 23, color: COLORS.grayLight, opacity: 0.75, marginTop: 4, whiteSpace: "nowrap" }}>{feature.desc}</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: -20,
          bottom: -20,
          width: 180,
          left: lerp(-240, 900, sweep),
          backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
          transform: "skewX(-20deg)",
          opacity: sweep > 0 && sweep < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};

const FeaturePanel: React.FC<{ step: FeatureStep; frame: number }> = ({ step, frame }) => {
  const numberIn = progress(frame, 0, 26);
  const label = progress(frame, 4, 14);
  const subtitle = progress(frame, 14, 16);
  const accentLine = progress(frame, 18, 18);
  const cardsTop = 540 - (step.features.length * 118 + (step.features.length - 1) * 24) / 2;
  return (
    <AbsoluteFill>
      <div style={{ opacity: 0.55 }}>
        {step.visual === "scan" && <ScanVisual frame={frame} color={step.color} />}
        {step.visual === "graph" && <GraphVisual frame={frame} color={step.color} />}
        {step.visual === "radar" && <RadarVisual frame={frame} color={step.color} />}
      </div>

      {/* Número gigante en contorno */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 120,
          fontSize: 400,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `3px ${step.color}`,
          opacity: 0.22 * numberIn,
          transform: `translateX(${(1 - numberIn) * -160}px)`,
        }}
      >
        {step.number}
      </div>

      <div style={{ position: "absolute", left: 130, top: 360, width: 760 }}>
        <Eyebrow color={step.color} style={{ opacity: label, transform: `translateY(${(1 - label) * 20}px)` }}>
          Paso {step.number}
        </Eyebrow>
        <div style={{ marginTop: 18 }}>
          <KineticWords
            text={step.verb}
            frame={frame}
            start={6}
            fontSize={124}
            align="flex-start"
            highlight={{ 0: `linear-gradient(90deg, ${COLORS.white} 0%, ${step.color} 100%)` }}
          />
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.grayLight,
            opacity: subtitle,
            transform: `translateY(${(1 - subtitle) * 24}px)`,
          }}
        >
          {step.subtitle}
        </div>
        <div style={{ marginTop: 30, width: 160 * accentLine, height: 6, borderRadius: 3, background: step.color, boxShadow: `0 0 20px ${step.color}` }} />
      </div>

      <div style={{ position: "absolute", left: 960, top: cardsTop, width: 840, display: "flex", flexDirection: "column", gap: 24 }}>
        {step.features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} color={step.color} frame={frame} at={beats(i + 1)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Scene6_Features: React.FC = () => {
  const frame = useCurrentFrame();
  const pans = STEP_STARTS.slice(1).map((at) => progress(frame, at - PAN_FRAMES / 2, PAN_FRAMES, EASE_IN_OUT));
  const pan = pans[0] + pans[1];
  const blur = pans.reduce((acc, p) => acc + Math.sin(p * Math.PI) * 16, 0);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame + 900} tint={FEATURE_STEPS[Math.min(2, Math.round(pan))].color} tint2={COLORS.primaryDark} glow={0.7} />
      <Particles frame={frame} count={26} seed={6} opacity={0.35} />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920 * 3,
          height: 1080,
          transform: `translateX(${-pan * 1920}px)`,
          filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        }}
      >
        {FEATURE_STEPS.map((step, i) => (
          <div key={step.verb} style={{ position: "absolute", left: i * 1920, top: 0, width: 1920, height: 1080 }}>
            <FeaturePanel step={step} frame={frame - STEP_STARTS[i]} />
          </div>
        ))}
      </div>

      {/* Indicador de pasos */}
      <div style={{ position: "absolute", bottom: 64, width: 1920, display: "flex", justifyContent: "center", gap: 70 }}>
        {FEATURE_STEPS.map((step, i) => {
          const activeness = Math.max(0, 1 - Math.abs(pan - i));
          return (
            <div key={step.verb} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: activeness > 0.5 ? step.color : COLORS.gray,
                  opacity: 0.45 + 0.55 * activeness,
                }}
              >
                {step.number} {step.verb}
              </div>
              <div style={{ width: 200, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${activeness * 100}%`, height: "100%", background: step.color, boxShadow: `0 0 12px ${step.color}` }} />
              </div>
            </div>
          );
        })}
      </div>

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 7: PANEL LLMFY EN 3D (35,0 – 42,4 s)
// ============================================
const EEAT = [
  { label: "Experiencia", value: 85, color: COLORS.primary },
  { label: "Conocimiento", value: 92, color: COLORS.accent },
  { label: "Autoridad", value: 78, color: COLORS.primaryLight },
  { label: "Confianza", value: 88, color: COLORS.accentLight },
];
const VISIBILITY = [0.16, 0.2, 0.18, 0.28, 0.34, 0.31, 0.45, 0.52, 0.6, 0.72, 0.84];
// Mejoras aplicadas: flotan sobre zonas del panel sin datos clave
const CALLOUTS = [
  { text: "Datos estructurados", x: 150, y: 690 },
  { text: "Bots IA permitidos", x: 1330, y: 140 },
  { text: "IndexNow activo", x: 1290, y: 915 },
];

// Curva suave (Catmull-Rom → Bézier) para el gráfico
const smoothPath = (points: [number, number][]) =>
  points.reduce((d, [x, y], i, arr) => {
    if (i === 0) return `M ${x} ${y}`;
    const [x0, y0] = arr[Math.max(0, i - 2)];
    const [x1, y1] = arr[i - 1];
    const [x3, y3] = arr[Math.min(arr.length - 1, i + 1)];
    const c1x = x1 + (x - x0) / 6;
    const c1y = y1 + (y - y0) / 6;
    const c2x = x - (x3 - x1) / 6;
    const c2y = y - (y3 - y1) / 6;
    return `${d} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x} ${y}`;
  }, "");

const DashCard: React.FC<{ title: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  title,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 24,
      padding: 28,
      boxSizing: "border-box",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      ...style,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.02em" }}>{title}</div>
    {children}
  </div>
);

const Scene7_Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = progress(frame, 0, 46);
  const orbit = progress(frame, 40, 182, EASE_IN_OUT);
  const rx = lerp(34, 9, enter) - 4 * orbit;
  const ry = lerp(-18, -6, enter) + 11 * orbit;
  const ty = lerp(260, 0, enter);
  const sc = lerp(0.8, 0.96, enter) + 0.05 * orbit;

  const scoreP = progress(frame, 22, 64, EASE_IN_OUT);
  const score = Math.round(scoreP * 92);
  const ringR = 96;
  const ringC = 2 * Math.PI * ringR;
  const scoreDone = progress(frame, 86, 12);
  const chartP = progress(frame, 40, 80, EASE_IN_OUT);
  const pulse = beatPulse(frame, 6);

  const chartW = 700;
  const chartH = 200;
  const chartPoints = VISIBILITY.map((v, i) => [(i / (VISIBILITY.length - 1)) * chartW, chartH - v * 180] as [number, number]);
  const headIndex = chartP * (VISIBILITY.length - 1);
  const i0 = Math.floor(headIndex);
  const i1 = Math.min(VISIBILITY.length - 1, i0 + 1);
  const headX = lerp(chartPoints[i0][0], chartPoints[i1][0], headIndex - i0);
  const headY = lerp(chartPoints[i0][1], chartPoints[i1][1], headIndex - i0);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame + 1100} grid={0.3} glow={1} />
      <Particles frame={frame} count={30} seed={7} opacity={0.4} />

      {/* Título */}
      <div style={{ position: "absolute", top: 48, width: 1920, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: progress(frame, 6, 16) }}>
        <Eyebrow color={COLORS.primaryLight}>Todo en un solo panel</Eyebrow>
      </div>

      {/* Panel */}
      <div
        style={{
          position: "absolute",
          left: 960 - 780,
          top: 560 - 420,
          width: 1560,
          height: 840,
          transform: `perspective(2400px) translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`,
          opacity: Math.min(1, enter * 2),
          borderRadius: 30,
          background: "rgba(14,12,28,0.94)",
          border: `1px solid ${COLORS.primary}55`,
          boxShadow: `0 60px 140px rgba(0,0,0,0.7), 0 0 90px ${COLORS.primary}33`,
          overflow: "hidden",
        }}
      >
        {/* Barra del navegador */}
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 28px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(8,6,18,0.8)" }}>
          {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <div style={{ marginLeft: 26, padding: "9px 22px", borderRadius: 10, background: "rgba(255,255,255,0.05)", fontFamily: MONO, fontSize: 19, color: COLORS.gray }}>
            llmfy.ai/dashboard
          </div>
        </div>

        {/* Menú lateral */}
        <div style={{ position: "absolute", left: 0, top: 64, bottom: 0, width: 240, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "30px 24px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <LogoMark size={40} glow={0.4} />
            <span style={{ fontSize: 28, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.03em" }}>LLMFY</span>
          </div>
          {["Resumen", "LLMO Score", "Prompts", "E-E-A-T", "Schema"].map((item, i) => (
            <div
              key={item}
              style={{
                padding: "12px 16px",
                marginBottom: 8,
                borderRadius: 12,
                fontSize: 20,
                fontWeight: 600,
                color: i === 0 ? COLORS.white : COLORS.gray,
                background: i === 0 ? `${COLORS.primary}33` : "transparent",
                opacity: progress(frame, 10 + i * 3, 12),
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Tarjetas */}
        <div style={{ position: "absolute", left: 240, top: 64, right: 0, bottom: 0 }}>
          <DashCard title="LLMO Score" style={{ left: 36, top: 36, width: 400, height: 352 }}>
            <div style={{ position: "relative", width: 230, height: 230, margin: "18px auto 0" }}>
              <svg width={230} height={230}>
                <defs>
                  <linearGradient id="dash-score" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={COLORS.cyan} />
                    <stop offset="50%" stopColor={COLORS.primary} />
                    <stop offset="100%" stopColor={COLORS.accent} />
                  </linearGradient>
                </defs>
                <circle cx={115} cy={115} r={ringR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={18} />
                <circle
                  cx={115}
                  cy={115}
                  r={ringR}
                  fill="none"
                  stroke="url(#dash-score)"
                  strokeWidth={18}
                  strokeLinecap="round"
                  strokeDasharray={`${ringC} ${ringC}`}
                  strokeDashoffset={ringC * (1 - scoreP * 0.92)}
                  transform="rotate(-90 115 115)"
                  style={{ filter: `drop-shadow(0 0 ${8 + 10 * scoreDone * pulse}px ${COLORS.primary})` }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 84, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {score}
                </div>
                <div style={{ fontSize: 20, color: COLORS.gray, fontWeight: 600 }}>/ 100</div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: 24,
                top: 24,
                padding: "6px 14px",
                borderRadius: 10,
                background: `${COLORS.green}26`,
                color: "#86EFAC",
                fontSize: 17,
                fontWeight: 800,
                opacity: scoreDone,
                transform: `scale(${lerp(0.6, 1, scoreDone)})`,
              }}
            >
              Excelente
            </div>
          </DashCard>

          <DashCard title="Análisis E-E-A-T" style={{ left: 464, top: 36, width: 820, height: 352 }}>
            <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 24 }}>
              {EEAT.map((row, i) => {
                const p = progress(frame, 30 + i * beats(1) * 0.75, 30, EASE_IN_OUT);
                return (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 170, fontSize: 21, color: COLORS.grayLight, fontWeight: 600 }}>{row.label}</div>
                    <div style={{ flex: 1, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${row.value * p}%`,
                          height: "100%",
                          borderRadius: 8,
                          backgroundImage: `linear-gradient(90deg, ${row.color} 0%, ${row.color}AA 100%)`,
                          boxShadow: `0 0 16px ${row.color}`,
                        }}
                      />
                    </div>
                    <div style={{ width: 70, textAlign: "right", fontSize: 22, fontWeight: 800, color: COLORS.white, fontVariantNumeric: "tabular-nums" }}>
                      {Math.round(row.value * p)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </DashCard>

          <DashCard title="Visibilidad en IA" style={{ left: 36, top: 416, width: 820, height: 352 }}>
            <svg width={chartW + 20} height={chartH + 40} style={{ marginTop: 34, overflow: "visible" }}>
              <defs>
                <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dash-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.primaryLight} />
                  <stop offset="100%" stopColor={COLORS.accentLight} />
                </linearGradient>
                <clipPath id="dash-reveal">
                  <rect x={-10} y={-20} width={headX + 10} height={chartH + 60} />
                </clipPath>
              </defs>
              {[0, 1, 2, 3].map((k) => (
                <line key={k} x1={0} x2={chartW} y1={20 + k * 60} y2={20 + k * 60} stroke="rgba(255,255,255,0.06)" />
              ))}
              <g clipPath="url(#dash-reveal)">
                <path d={`${smoothPath(chartPoints)} L ${chartW} ${chartH + 20} L 0 ${chartH + 20} Z`} fill="url(#dash-area)" />
                <path d={smoothPath(chartPoints)} fill="none" stroke="url(#dash-line)" strokeWidth={5} strokeLinecap="round" />
              </g>
              <circle cx={headX} cy={headY} r={9 + 4 * pulse} fill={COLORS.white} style={{ filter: `drop-shadow(0 0 12px ${COLORS.accentLight})` }} opacity={chartP > 0 ? 1 : 0} />
            </svg>
          </DashCard>

          <DashCard title="Presencia en IA" style={{ left: 884, top: 416, width: 400, height: 352 }}>
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              {PLATFORMS.map((platform, i) => {
                const at = bar(20) - TIMELINE.dashboard + beats(i);
                const cited = progress(frame, at, 8);
                return (
                  <div key={platform.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 7, background: platform.color, boxShadow: `0 0 10px ${platform.color}` }} />
                    <div style={{ flex: 1, fontSize: 22, fontWeight: 700, color: COLORS.white }}>{platform.name}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        borderRadius: 10,
                        fontSize: 16,
                        fontWeight: 800,
                        background: cited > 0.5 ? `${COLORS.green}26` : "rgba(255,255,255,0.06)",
                        color: cited > 0.5 ? "#86EFAC" : COLORS.gray,
                        transform: `scale(${1 + 0.15 * Math.sin(cited * Math.PI)})`,
                      }}
                    >
                      {cited > 0.5 && <Icon name="check" size={14} color="#86EFAC" strokeWidth={3.2} />}
                      {cited > 0.5 ? "Citada" : "Analizando…"}
                    </div>
                  </div>
                );
              })}
            </div>
          </DashCard>
        </div>
      </div>

      {/* Mejoras aplicadas flotando delante del panel */}
      {CALLOUTS.map((callout, i) => {
        const at = bar(21) - TIMELINE.dashboard + beats(i);
        const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 140 } });
        return (
          <div
            key={callout.text}
            style={{
              position: "absolute",
              left: callout.x,
              top: callout.y + Math.sin(frame * 0.07 + i * 2) * 8,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 26px",
              borderRadius: 20,
              background: "rgba(22,18,44,0.92)",
              border: `1px solid ${COLORS.green}66`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.55), 0 0 30px ${COLORS.green}33`,
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.white,
              opacity: Math.min(1, p * 1.5),
              transform: `scale(${lerp(0.5, 1, p)}) translateY(${(1 - p) * 30}px)`,
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 18, background: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={22} strokeWidth={3.2} />
            </div>
            {callout.text}
          </div>
        );
      })}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 8: AHORA LA IA TE CITA (42,4 – 46,1 s)
// La misma pregunta del inicio, ahora con tu web como fuente
// ============================================
const RESULTS_CARD = { left: 370, top: 410 };
const RESULTS_FOCUS = { x: RESULTS_CARD.left + CARD_PAD + CHIP_W / 2, y: RESULTS_CARD.top + CHIPS_TOP + 28 };

const Scene8_Results: React.FC = () => {
  const frame = useCurrentFrame();
  const push = progress(frame, 40, 71, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame + 1300} tint={COLORS.green} tint2={COLORS.primary} glow={0.6} />
      <Particles frame={frame} count={30} seed={8} colors={[COLORS.green, COLORS.cyan, COLORS.primaryLight]} opacity={0.5} />

      <AbsoluteFill style={{ transform: `scale(${1 + 0.08 * push})`, transformOrigin: `${RESULTS_FOCUS.x}px ${RESULTS_FOCUS.y}px` }}>
        <div style={{ position: "absolute", top: 90, width: 1920 }}>
          <KineticWords
            text="Ahora, la IA te recomienda."
            frame={frame}
            start={2}
            stagger={4}
            fontSize={84}
            highlight={{ 3: SUCCESS_GRADIENT, 4: SUCCESS_GRADIENT }}
          />
        </div>

        <div style={{ position: "absolute", left: 960 - 590, top: 256, transform: "scale(0.92)", transformOrigin: "50% 0%" }}>
          <PromptBox id="results-prompt" typed={QUESTION.length} draw={1} fill={1} cursorOn={false} />
        </div>

        <div style={{ position: "absolute", left: RESULTS_CARD.left, top: RESULTS_CARD.top }}>
          <AIAnswerCard
            frame={frame}
            openAt={-60}
            focusChip={0}
            slideInFirst={beats(1)}
            chips={[
              { domain: "tuweb.com", tone: "cited", appearAt: beats(1) + 4 },
              { domain: "competidor1.com", tone: "neutral", appearAt: -60 },
              { domain: "competidor2.com", tone: "neutral", appearAt: -60 },
              { domain: "competidor3.com", tone: "neutral", appearAt: -60 },
            ]}
            dim={push * 0.8}
            callout={{ at: beats(2) + 4, text: "Tu web, citada como fuente", color: COLORS.green }}
          />
        </div>

        {/* Destellos alrededor de la fuente citada */}
        {Array.from({ length: 6 }, (_, i) => {
          const at = beats(2) + i * 3;
          const p = progress(frame, at, 20);
          const angle = (i / 6) * Math.PI * 2 + 0.4;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: RESULTS_FOCUS.x + Math.cos(angle) * (150 + 40 * p) - 14,
                top: RESULTS_FOCUS.y + Math.sin(angle) * (70 + 30 * p) - 14,
                transform: `scale(${Math.sin(p * Math.PI)}) rotate(${p * 90}deg)`,
              }}
            >
              <Icon name="sparkle" size={28} fill={i % 2 ? COLORS.green : COLORS.cyan} color="transparent" />
            </div>
          );
        })}
      </AbsoluteFill>

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 9: TITULAR (46,1 – 49,8 s)
// ============================================
const MARQUEE = "ChatGPT · Perplexity · Claude · Google AI · ";

const Scene9_Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = progress(frame, 62, 30, EASE_IN_OUT);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      <Backdrop frame={frame + 1500} glow={1.1} />

      {/* Marquesina de plataformas en contorno */}
      {[140, 540, 940].map((y, row) => (
        <div
          key={y}
          style={{
            position: "absolute",
            top: y - 115,
            left: 0,
            whiteSpace: "nowrap",
            fontSize: 210,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.08)",
            transform: `translateX(${row % 2 === 0 ? -600 - frame * 3 : -2400 + frame * 3}px)`,
          }}
        >
          {MARQUEE.repeat(4)}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: 960 - 900,
          top: 540 - 380,
          width: 1800,
          height: 760,
          backgroundImage: `radial-gradient(ellipse at center, ${COLORS.darker}F2 0%, ${COLORS.darker}AA 45%, transparent 72%)`,
        }}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${lerp(0.96, 1.04, progress(frame, 0, 125, EASE_IN_OUT))})` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <KineticWords text="Aparece en las" frame={frame} start={2} stagger={4} fontSize={92} weight={700} />
          <KineticWords
            text="AI Overviews"
            frame={frame}
            start={10}
            stagger={5}
            fontSize={168}
            renderWord={(word, i) => {
              // El destello recorre "AI" y luego "Overviews" dentro de las letras
              const pos = (sweep * 2.4 - i * 0.9) * 100;
              return (
                <GradientText
                  gradient={`linear-gradient(100deg, transparent ${pos - 22}%, rgba(255,255,255,0.85) ${pos}%, transparent ${pos + 22}%), ${HERO_GRADIENT}`}
                >
                  {word}
                </GradientText>
              );
            }}
          />
          <KineticWords text="y en los LLMs" frame={frame} start={beats(3)} stagger={4} fontSize={92} weight={700} highlight={{ 3: HERO_GRADIENT }} />
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.55} />
    </AbsoluteFill>
  );
};

// ============================================
// ESCENA 10: CTA + CIERRE (49,8 – 60 s)
// ============================================
const CTA_URL = "tuweb.com";
const CTA_BUTTON = { x: 960, y: 690 };

const CtaButton: React.FC<{ frame: number; scale?: number }> = ({ frame, scale = 1 }) => {
  const shine = ((frame % 75) / 75) * 900 - 200;
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "30px 64px",
        borderRadius: 26,
        backgroundImage: BRAND_GRADIENT,
        boxShadow: `0 24px 70px ${COLORS.primary}77, 0 0 50px ${COLORS.accent}55`,
        transform: `scale(${scale})`,
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: shine,
          width: 80,
          height: "200%",
          backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
          transform: "skewX(-20deg)",
        }}
      />
      <span style={{ position: "relative", fontSize: 40, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.01em" }}>
        Analiza tu web AHORA
      </span>
      <div style={{ position: "relative" }}>
        <Icon name="arrow" size={40} strokeWidth={2.8} />
      </div>
    </div>
  );
};

const Scene10_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const click = bar(28) - TIMELINE.cta;

  // Fase A: formulario
  const inputIn = spring({ frame: frame - 14, fps, config: { damping: 15, stiffness: 120 } });
  const buttonIn = spring({ frame: frame - 24, fps, config: { damping: 12, stiffness: 130 } });
  const typed = Math.max(0, Math.min(CTA_URL.length, Math.floor((frame - 34) / 2)));
  const cursorP = progress(frame, 62, 36, EASE_IN_OUT);
  const cursorX = lerp(1560, CTA_BUTTON.x + 150, cursorP);
  const cursorY = lerp(1000, CTA_BUTTON.y + 20, cursorP);
  const pressed = interpolate(frame, [click - 3, click, click + 6], [1, 0.9, 1.04], CLAMP);
  const hover = progress(frame, 94, 8);

  // Fase B: cierre revelado desde el botón
  const reveal = progress(frame, click, 18, EASE_IN_OUT);
  const endFrame = frame - click;
  const lockup = spring({ frame: endFrame - 4, fps, config: { damping: 13, stiffness: 120 } });
  const tagline = progress(endFrame, 20, 18);
  const endButton = spring({ frame: endFrame - 26, fps, config: { damping: 12, stiffness: 130 } });
  const url = progress(endFrame, 36, 18);
  const smallPrint = progress(endFrame, 48, 18);
  const pulse = beatPulse(frame + 1, 7);
  const breathe = 1 + 0.03 * Math.sin(endFrame * 0.2);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT }}>
      {/* Fase A */}
      <AbsoluteFill>
        <Backdrop frame={frame + 1700} grid={0.3} glow={1} />
        <Particles frame={frame} count={30} seed={9} opacity={0.45} />
        <div style={{ position: "absolute", top: 170, width: 1920 }}>
          <KineticWords
            text="¿Qué puntuación tiene tu web para los LLMs?"
            frame={frame}
            start={4}
            stagger={3}
            fontSize={74}
            highlight={{ 6: HERO_GRADIENT, 7: HERO_GRADIENT }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 960 - 500,
            top: 430,
            width: 1000,
            height: 112,
            borderRadius: 30,
            background: "rgba(22,18,44,0.9)",
            border: `2px solid ${COLORS.primary}88`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${COLORS.primary}33`,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 34px",
            boxSizing: "border-box",
            opacity: Math.min(1, inputIn * 1.5),
            transform: `translateY(${(1 - inputIn) * 60}px)`,
          }}
        >
          <Icon name="globe" size={40} color={COLORS.primaryLight} />
          <span style={{ fontFamily: MONO, fontSize: 40, color: COLORS.gray }}>
            https://
            <span style={{ color: COLORS.white, fontWeight: 600 }}>{CTA_URL.slice(0, typed)}</span>
          </span>
          <span style={{ width: 3, height: 46, background: COLORS.primaryLight, opacity: Math.floor(frame / 8) % 2 === 0 || (typed > 0 && typed < CTA_URL.length) ? 1 : 0, marginLeft: -16 }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: CTA_BUTTON.x,
            top: CTA_BUTTON.y,
            transform: `translate(-50%, -50%) scale(${lerp(0.4, 1, buttonIn) * pressed * (1 + 0.04 * hover)})`,
            opacity: Math.min(1, buttonIn * 1.5),
          }}
        >
          <CtaButton frame={frame} />
        </div>

        {/* Cursor */}
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            opacity: progress(frame, 58, 8) * (1 - reveal),
            transform: `scale(${frame >= click - 3 && frame < click + 4 ? 0.85 : 1})`,
            transformOrigin: "0 0",
          }}
        >
          <svg width={52} height={52} viewBox="0 0 24 24">
            <path d="M5 3l14 9-8 2-2 8z" fill={COLORS.white} stroke={COLORS.darker} strokeWidth={1.2} strokeLinejoin="round" />
          </svg>
        </div>
      </AbsoluteFill>

      {/* Fase B: pantalla final */}
      {reveal > 0 && (
        <AbsoluteFill
          style={{
            clipPath: reveal < 1 ? `circle(${reveal * 2300}px at ${CTA_BUTTON.x}px ${CTA_BUTTON.y}px)` : undefined,
          }}
        >
          <Backdrop frame={frame + 1900} glow={1.4} />
          <div
            style={{
              position: "absolute",
              left: 960 - 1400,
              top: 420 - 1400,
              width: 2800,
              height: 2800,
              backgroundImage: `repeating-conic-gradient(from ${frame * 0.25}deg at 50% 50%, ${COLORS.primaryLight}1F 0deg 4deg, transparent 4deg 15deg)`,
              WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 50%)",
              maskImage: "radial-gradient(circle, black 0%, transparent 50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 960 - 520,
              top: 400 - 520,
              width: 1040,
              height: 1040,
              borderRadius: "50%",
              backgroundImage: `radial-gradient(circle, ${COLORS.primary}${alpha(0.35 + 0.15 * pulse)} 0%, transparent 60%)`,
            }}
          />
          <Particles frame={frame} count={50} seed={10} opacity={0.6} speed={0.9} />

          <AbsoluteFill style={{ alignItems: "center" }}>
            <div
              style={{
                position: "absolute",
                top: 250,
                display: "flex",
                alignItems: "center",
                gap: 34,
                opacity: Math.min(1, lockup * 1.4),
                transform: `scale(${lerp(0.6, 1, lockup)})`,
              }}
            >
              <LogoMark size={140} glow={1 + pulse * 0.5} />
              <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.045em", color: COLORS.white, lineHeight: 1 }}>LLMFY</div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 440,
                fontSize: 28,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: `${lerp(0.7, 0.32, tagline)}em`,
                color: COLORS.grayLight,
                opacity: tagline,
              }}
            >
              AI Search Optimization
            </div>
            <div
              style={{
                position: "absolute",
                top: 540,
                opacity: Math.min(1, endButton * 1.5),
                transform: `scale(${lerp(0.5, 1, endButton) * breathe})`,
              }}
            >
              <CtaButton frame={frame} />
            </div>
            <div
              style={{
                position: "absolute",
                top: 720,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                opacity: url,
                transform: `translateY(${(1 - url) * 30}px)`,
              }}
            >
              <div style={{ fontSize: 76, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.03em" }}>llmfy.ai</div>
              <div style={{ width: 300 * url, height: 5, borderRadius: 3, backgroundImage: HERO_GRADIENT, boxShadow: `0 0 18px ${COLORS.accent}` }} />
            </div>
            <div
              style={{
                position: "absolute",
                top: 878,
                fontSize: 30,
                fontWeight: 600,
                color: COLORS.gray,
                opacity: smallPrint,
                letterSpacing: "0.02em",
              }}
            >
              Sin tarjeta • Sin spam • Solo resultados
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

// ============================================
// MARCA DE AGUA
// ============================================
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [0, 12, durationInFrames - 12, durationInFrames], [0, 0.85, 0.85, 0], CLAMP);
  return (
    <div style={{ position: "absolute", left: 56, top: 44, display: "flex", alignItems: "center", gap: 12, opacity, fontFamily: FONT }}>
      <LogoMark size={36} glow={0.3} />
      <span style={{ fontSize: 26, fontWeight: 800, color: COLORS.white, letterSpacing: "-0.03em" }}>LLMFY</span>
    </div>
  );
};

// ============================================
// COMPOSICIÓN PRINCIPAL
// ============================================
export const LLMFYMotion60: React.FC = () => {
  useLocalFonts();
  const frame = useCurrentFrame();
  const T = TIMELINE;
  const fadeOut = interpolate(frame, [T.end - 18, T.end], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: COLORS.darker }}>
      <Audio
        src={staticFile("audio/backgroundv2.mp3")}
        volume={(f) => interpolate(f, [0, 8, T.end - 60, T.end], [0, MUSIC_VOLUME, MUSIC_VOLUME, 0], CLAMP)}
      />

      {/* Escena 1: Hook + demo IA */}
      <Sequence from={T.hook} durationInFrames={T.stats - T.hook + 14}>
        <SceneShell enter="fade" enterFrames={8} exit="zoom" exitFrames={14} origin={`${HOOK_FOCUS.x}px ${HOOK_FOCUS.y}px`}>
          <Scene1_Hook />
        </SceneShell>
      </Sequence>

      {/* Escena 2: Estadísticas */}
      <Sequence from={T.stats} durationInFrames={T.kicker - T.stats}>
        <SceneShell enter="zoom" enterFrames={14}>
          <Scene2_Stats />
        </SceneShell>
      </Sequence>

      {/* Escena 3: "Si la IA no te cita, no existes." */}
      <Sequence from={T.kicker} durationInFrames={T.logo - T.kicker}>
        <Scene3_Kicker />
      </Sequence>

      {/* Escena 4: Drop → logo */}
      <Sequence from={T.logo} durationInFrames={T.platforms - T.logo}>
        <Scene4_Logo />
      </Sequence>

      {/* Escena 5: Plataformas IA (el logo pasa a ser el núcleo de la órbita) */}
      <Sequence from={T.platforms} durationInFrames={T.features - T.platforms + 16}>
        <Scene5_Platforms />
      </Sequence>

      {/* Escena 6: Analiza · Optimiza · Monitoriza */}
      <Sequence from={T.features} durationInFrames={T.dashboard - T.features}>
        <SceneShell enter="iris" enterFrames={16} irisOrigin={[CORE.x, CORE.y]}>
          <Scene6_Features />
        </SceneShell>
      </Sequence>

      {/* Escena 7: Panel en 3D */}
      <Sequence from={T.dashboard} durationInFrames={T.results - T.dashboard + 14}>
        <SceneShell exit="zoom" exitFrames={14}>
          <Scene7_Dashboard />
        </SceneShell>
      </Sequence>

      {/* Escena 8: Ahora la IA te cita */}
      <Sequence from={T.results} durationInFrames={T.headline - T.results}>
        <SceneShell enter="zoom" enterFrames={14}>
          <Scene8_Results />
        </SceneShell>
      </Sequence>

      {/* Escena 9: Titular */}
      <Sequence from={T.headline} durationInFrames={T.cta - T.headline + 16}>
        <SceneShell exit="push-up" exitFrames={16}>
          <Scene9_Headline />
        </SceneShell>
      </Sequence>

      {/* Escena 10: CTA + cierre */}
      <Sequence from={T.cta} durationInFrames={T.end - T.cta}>
        <SceneShell enter="push-up" enterFrames={16}>
          <Scene10_CTA />
        </SceneShell>
      </Sequence>

      {/* Transiciones globales */}
      <Sequence from={T.kicker - 6} durationInFrames={14}>
        <GlitchOverlay duration={14} />
      </Sequence>
      <Sequence from={T.logo} durationInFrames={18}>
        <FlashOverlay duration={18} />
      </Sequence>
      <Sequence from={T.dashboard - 10} durationInFrames={20}>
        <ShutterWipe direction="right" />
      </Sequence>
      <Sequence from={T.headline - 10} durationInFrames={20}>
        <ShutterWipe direction="down" colors={[COLORS.accentDark, COLORS.accent, COLORS.primary, COLORS.primaryDark, COLORS.cyan]} />
      </Sequence>

      <Sequence from={T.features + 16} durationInFrames={T.cta - T.features - 16}>
        <Watermark />
      </Sequence>

      <Grain opacity={0.05} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
