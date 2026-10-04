// Piezas de interfaz reutilizables para los mockups del producto.
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { C, FONT, GRAD, SHADOW } from "./theme";
import { clamp01 } from "./motion";

/** Panel de cristal. */
export const Glass: React.FC<{ style?: React.CSSProperties; radius?: number; glow?: string; children?: React.ReactNode }> = ({
  style, radius = 26, glow, children,
}) => (
  <div
    style={{
      position: "relative", borderRadius: radius, background: GRAD.card, border: `1px solid ${C.line}`,
      boxShadow: glow ? `${SHADOW.card}, ${SHADOW.glow(glow)}` : SHADOW.card, fontFamily: FONT.sans, color: C.text, ...style,
    }}
  >
    {children}
  </div>
);

/** Marco de navegador con barra de URL. */
export const BrowserFrame: React.FC<{ width: number; height: number; url: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  width, height, url, children, style,
}) => (
  <div
    style={{
      width, height, borderRadius: 22, overflow: "hidden", background: C.bg1, border: `1px solid ${C.lineStrong}`,
      boxShadow: "0 60px 120px -30px rgba(0,0,0,0.75), 0 20px 50px -20px rgba(99,102,241,0.35)", fontFamily: FONT.sans, ...style,
    }}
  >
    <div style={{ height: 52, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${C.line}` }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.9 }} />)}
      <div style={{ marginLeft: 18, flex: 1, maxWidth: 620, height: 30, borderRadius: 15, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 16px", color: C.text3, fontSize: 15, fontFamily: FONT.mono }}>
        {url}
      </div>
    </div>
    <div style={{ position: "relative", width: "100%", height: height - 52 }}>{children}</div>
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.primaryLight, style }) => (
  <span
    style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, fontSize: 17, fontWeight: 600,
      color, background: `${color}1F`, border: `1px solid ${color}44`, fontFamily: FONT.sans, ...style,
    }}
  >
    {children}
  </span>
);

export const Btn: React.FC<{ children: React.ReactNode; pressed?: number; style?: React.CSSProperties; ghost?: boolean }> = ({ children, pressed = 0, style, ghost }) => (
  <div
    style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 26px", borderRadius: 14, fontSize: 20, fontWeight: 700,
      color: "#fff", background: ghost ? "rgba(255,255,255,0.07)" : GRAD.brand, border: ghost ? `1px solid ${C.lineStrong}` : "none",
      boxShadow: ghost ? undefined : `0 10px 30px -8px ${C.primary}AA, inset 0 1px 0 rgba(255,255,255,0.3)`,
      transform: `scale(${1 - pressed * 0.05})`, fontFamily: FONT.sans, ...style,
    }}
  >
    {children}
  </div>
);

/** Anillo de puntuación (0–100). `progress` (0–1) anima el llenado. */
export const Ring: React.FC<{ value: number; progress: number; size?: number; stroke?: number; color?: string; label?: string; sub?: string }> = ({
  value, progress, size = 220, stroke = 16, color = C.primary, label, sub,
}) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, p = clamp01(progress);
  return (
    <div style={{ position: "relative", width: size, height: size, fontFamily: FONT.sans }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={`rg-${size}-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={C.accentLight} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#rg-${size}-${color.replace("#", "")})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - (value / 100) * p)}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: size * 0.30, fontWeight: 800, letterSpacing: -2, color: C.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {label ?? Math.round(value * p)}
        </div>
        {sub && <div style={{ marginTop: 6, fontSize: size * 0.085, fontWeight: 600, color: C.text3 }}>{sub}</div>}
      </div>
    </div>
  );
};

/** Barra horizontal con etiqueta y porcentaje. */
export const BarRow: React.FC<{ label: string; value: number; progress: number; color?: string; width?: number; suffix?: string }> = ({
  label, value, progress, color = C.primary, width = 520, suffix = "%",
}) => (
  <div style={{ width, fontFamily: FONT.sans }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 19, fontWeight: 600, color: C.text2 }}>
      <span>{label}</span>
      <span style={{ color: C.text, fontVariantNumeric: "tabular-nums" }}>{Math.round(value * clamp01(progress))}{suffix}</span>
    </div>
    <div style={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <div style={{ width: `${value * clamp01(progress)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${color}, ${C.accentLight})` }} />
    </div>
  </div>
);

/** Línea de tendencia que se dibuja. */
export const Spark: React.FC<{ points: number[]; progress: number; w?: number; h?: number; color?: string; fill?: boolean; dot?: boolean }> = ({
  points, progress, w = 520, h = 160, color = C.primaryLight, fill = true, dot = true,
}) => {
  const max = Math.max(...points), min = Math.min(...points);
  const px = (i: number) => (i / (points.length - 1)) * w;
  const py = (v: number) => h - 14 - ((v - min) / (max - min || 1)) * (h - 28);
  const d = points.map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  // Longitud aproximada para el dash (suma de segmentos)
  let len = 0;
  for (let i = 1; i < points.length; i++) len += Math.hypot(px(i) - px(i - 1), py(points[i]) - py(points[i - 1]));
  const p = clamp01(progress);
  const idx = p * (points.length - 1), i0 = Math.floor(idx), i1 = Math.min(points.length - 1, i0 + 1);
  const hx = px(i0) + (px(i1) - px(i0)) * (idx - i0), hy = py(points[i0]) + (py(points[i1]) - py(points[i0])) * (idx - i0);
  const id = `sp-${w}-${h}-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-c`}><rect x="0" y="-10" width={w * p} height={h + 20} /></clipPath>
      </defs>
      {fill && <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} clipPath={`url(#${id}-c)`} />}
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {dot && p > 0.01 && <circle cx={hx} cy={hy} r={7} fill="#fff" stroke={color} strokeWidth={3} />}
    </svg>
  );
};

/** Esqueleto de carga con brillo que recorre la barra. */
export const Skeleton: React.FC<{ w: number | string; h: number; frame: number; radius?: number; style?: React.CSSProperties }> = ({ w, h, frame, radius = 10, style }) => {
  const x = interpolate((frame % 48) / 48, [0, 1], [-60, 160]);
  return (
    <div style={{ width: w, height: h, borderRadius: radius, background: "rgba(255,255,255,0.07)", overflow: "hidden", position: "relative", ...style }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${x - 30}%, rgba(255,255,255,0.12) ${x}%, transparent ${x + 30}%)` }} />
    </div>
  );
};

/** Logotipo real de LLMFY (destello de 4 puntas sobre índigo, public/brand/llmfy-icon-512.png) + palabra. */
export const Logo: React.FC<{ size?: number; progress?: number; showWord?: boolean }> = ({ size = 96, progress = 1, showWord = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.28, fontFamily: FONT.sans }}>
    <Img
      src={staticFile("brand/llmfy-icon-512.png")}
      style={{
        width: size, height: size, borderRadius: size * 0.27, boxShadow: `0 ${size * 0.2}px ${size * 0.5}px -${size * 0.1}px ${C.primary}AA`,
        transform: `scale(${0.6 + 0.4 * progress}) rotate(${(1 - progress) * -14}deg)`, opacity: clamp01(progress * 1.6),
      }}
    />
    {showWord && (
      <div style={{ fontSize: size * 0.62, fontWeight: 800, letterSpacing: -size * 0.02, color: C.text, opacity: clamp01((progress - 0.25) * 2), transform: `translateX(${(1 - clamp01((progress - 0.25) * 2)) * -24}px)` }}>
        LLMFY
      </div>
    )}
  </div>
);
