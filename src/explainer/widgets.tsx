// Widgets del dashboard de LLMFY (tema claro, como el producto real): anillos, barras, KPIs, pestañas,
// bloques de código y las llamadas/pines que explican cada paso del tutorial.
import React from "react";
import type { LucideIcon } from "lucide-react";
import { FONT } from "./theme";
import { clamp01, lerp, SPR, useProg, useSpr, useT, EASE } from "./motion";

export const U = {
  page: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  borderSoft: "#EEF2F7",
  text: "#0F172A",
  text2: "#475569",
  text3: "#94A3B8",
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  primary50: "#EEF2FF",
  primary100: "#E0E7FF",
  violet: "#8B5CF6",
  violet50: "#F5F3FF",
  teal: "#14B8A6",
  teal50: "#F0FDFA",
  green: "#10B981",
  green50: "#ECFDF5",
  amber: "#F59E0B",
  amber50: "#FFFBEB",
  red: "#EF4444",
  red50: "#FEF2F2",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  orange: "#F97316",
  grad: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
} as const;

export const TONE = {
  indigo: { fg: U.primaryDark, bg: U.primary50, solid: U.primary },
  green: { fg: "#047857", bg: U.green50, solid: U.green },
  amber: { fg: "#B45309", bg: U.amber50, solid: U.amber },
  violet: { fg: "#6D28D9", bg: U.violet50, solid: U.violet },
  red: { fg: "#B91C1C", bg: U.red50, solid: U.red },
  teal: { fg: "#0F766E", bg: U.teal50, solid: U.teal },
  slate: { fg: "#334155", bg: "#F1F5F9", solid: "#64748B" },
} as const;
export type Tone = keyof typeof TONE;

export const Tag: React.FC<{ tone?: Tone; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ tone = "indigo", children, size = 15, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: `${size * 0.28}px ${size * 0.7}px`, borderRadius: 999, background: TONE[tone].bg, color: TONE[tone].fg, fontWeight: 700, fontSize: size, fontFamily: FONT.sans, letterSpacing: 0.2, ...style }}>
    {children}
  </span>
);

export const IconBox: React.FC<{ icon: LucideIcon; size?: number; grad?: string; color?: string; radius?: number; style?: React.CSSProperties }> = ({
  icon: I, size = 56, grad = U.grad, color = "#fff", radius, style,
}) => (
  <div style={{ width: size, height: size, borderRadius: radius ?? size * 0.28, background: grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px -8px rgba(99,102,241,0.55)", flex: "none", ...style }}>
    <I size={size * 0.5} color={color} strokeWidth={2.2} />
  </div>
);

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: U.card, border: `1px solid ${U.border}`, borderRadius: 22, boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 14px 34px -18px rgba(15,23,42,0.18)", fontFamily: FONT.sans, color: U.text, ...style }}>
    {children}
  </div>
);

/** Anillo de puntuación con degradado, aro interior y resplandor (como el del Resumen General). */
export const Gauge: React.FC<{
  value: number; progress: number; size?: number; stroke?: number; from?: string; to?: string; color?: string; sub?: string; label?: string;
}> = ({ value, progress, size = 240, stroke = 20, from = U.primary, to = U.violet, color = U.primaryDark, sub = "de 100", label }) => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, p = clamp01(progress);
  const id = `gg-${from.replace("#", "")}-${to.replace("#", "")}-${size}`;
  return (
    <div style={{ position: "relative", width: size, height: size, fontFamily: FONT.sans }}>
      <div style={{ position: "absolute", inset: -size * 0.12, borderRadius: "50%", background: `radial-gradient(circle, ${from}30 0%, ${from}00 68%)` }} />
      <svg width={size} height={size} style={{ position: "relative", transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r - stroke * 1.25} fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (value / 100) * p)} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: size * 0.3, fontWeight: 800, color, letterSpacing: -2, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{label ?? Math.round(value * p)}</div>
        <div style={{ marginTop: 6, fontSize: size * 0.075, color: U.text3, fontWeight: 600 }}>{sub}</div>
      </div>
    </div>
  );
};

/** Barra métrica con punto de color, etiqueta y porcentaje. */
export const MetricBar: React.FC<{ label: string; value: number; progress: number; color: string; width?: number; suffix?: string; size?: number }> = ({
  label, value, progress, color, width = 420, suffix = "%", size = 20,
}) => (
  <div style={{ width, fontFamily: FONT.sans }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: size, fontWeight: 600, color: U.text2 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: color }} />
        {label}
      </span>
      <span style={{ color, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{Math.round(value * clamp01(progress))}{suffix}</span>
    </div>
    <div style={{ height: 9, borderRadius: 6, background: "#EDF0F7", overflow: "hidden" }}>
      <div style={{ width: `${value * clamp01(progress)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${color}, ${color}CC)` }} />
    </div>
  </div>
);

/** Tarjeta KPI con borde superior de color. */
export const KPI: React.FC<{ label: string; value: string; icon: LucideIcon; accent: string; delta?: string; deltaTone?: Tone; spark?: number[]; progress?: number; w?: number; note?: string }> = ({
  label, value, icon: I, accent, delta, deltaTone = "green", spark, progress = 1, w = 330, note,
}) => (
  <Card style={{ width: w, padding: "22px 24px 20px", borderTop: `5px solid ${accent}`, position: "relative", overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, color: U.text2, fontSize: 17, fontWeight: 600 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}><I size={21} color={accent} strokeWidth={2.2} /></div>
      {label}
    </div>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
      <div>
        <div style={{ fontSize: 46, fontWeight: 800, color: U.text, letterSpacing: -1.5, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
        {delta && <div style={{ marginTop: 10 }}><Tag tone={deltaTone} size={14}>{delta}</Tag></div>}
        {note && <div style={{ marginTop: 8, fontSize: 14, color: U.text3, fontWeight: 600 }}>{note}</div>}
      </div>
      {spark && <MiniSpark points={spark} progress={progress} color={accent} w={120} h={46} />}
    </div>
  </Card>
);

export const MiniSpark: React.FC<{ points: number[]; progress: number; color: string; w?: number; h?: number }> = ({ points, progress, color, w = 120, h = 46 }) => {
  const max = Math.max(...points), min = Math.min(...points);
  const px = (i: number) => (i / (points.length - 1)) * w, py = (v: number) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
  const d = points.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  let len = 0;
  for (let i = 1; i < points.length; i++) len += Math.hypot(px(i) - px(i - 1), py(points[i]) - py(points[i - 1]));
  return (
    <svg width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - clamp01(progress))} />
    </svg>
  );
};

/** Gráfico de área simple con línea que se dibuja. */
export const AreaChart: React.FC<{ points: number[]; progress: number; w: number; h: number; color?: string; labels?: string[] }> = ({ points, progress, w, h, color = U.primary, labels }) => {
  const max = Math.max(...points) * 1.15, px = (i: number) => (i / (points.length - 1)) * w, py = (v: number) => h - 28 - (v / max) * (h - 44);
  const d = points.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  let len = 0;
  for (let i = 1; i < points.length; i++) len += Math.hypot(px(i) - px(i - 1), py(points[i]) - py(points[i - 1]));
  const p = clamp01(progress);
  const id = `ac-${color.replace("#", "")}-${w}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible", fontFamily: FONT.sans }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.28" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient>
        <clipPath id={`${id}-c`}><rect x="0" y="-6" width={w * p} height={h + 12} /></clipPath>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={w} y1={py(max * g)} y2={py(max * g)} stroke={U.borderSoft} strokeWidth="1.5" />)}
      <path d={`${d} L${w} ${h - 28} L0 ${h - 28} Z`} fill={`url(#${id})`} clipPath={`url(#${id}-c)`} />
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {labels?.map((l, i) => <text key={i} x={(i / (labels.length - 1)) * w} y={h - 4} fontSize="14" fill={U.text3} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} fontWeight="600">{l}</text>)}
    </svg>
  );
};

/** Pestañas con subrayado que se desliza. */
export const Tabs: React.FC<{ items: string[]; active: number; progress?: number; from?: number; size?: number; gap?: number }> = ({ items, active, progress = 1, from, size = 19, gap = 30 }) => {
  const widths = items.map((s) => s.length * size * 0.56 + 12);
  const left = (i: number) => widths.slice(0, i).reduce((a, b) => a + b + gap, 0);
  const x = lerp(left(from ?? active), left(active), clamp01(progress));
  const w = lerp(widths[from ?? active], widths[active], clamp01(progress));
  return (
    <div style={{ position: "relative", display: "flex", gap, fontFamily: FONT.sans, fontSize: size, fontWeight: 700, borderBottom: `2px solid ${U.border}` }}>
      {items.map((t, i) => <div key={t} style={{ width: widths[i], textAlign: "center", paddingBottom: 12, color: i === active ? U.primaryDark : U.text3, whiteSpace: "nowrap" }}>{t}</div>)}
      <div style={{ position: "absolute", left: x, bottom: -2, width: w, height: 3, borderRadius: 2, background: U.grad }} />
    </div>
  );
};

/** Bloque de código oscuro con líneas resaltadas (añadida / eliminada). */
export const Code: React.FC<{ lines: { t: string; kind?: "add" | "del" | "dim" | "key"; color?: string }[]; reveal?: number; fontSize?: number; width?: number; title?: string }> = ({ lines, reveal = 1, fontSize = 18, width = 480, title }) => {
  const shown = reveal * lines.length;
  return (
    <div style={{ width, borderRadius: 18, background: "#0F172A", border: "1px solid #1E293B", overflow: "hidden", boxShadow: "0 24px 50px -24px rgba(15,23,42,0.6)", fontFamily: FONT.mono }}>
      {title && <div style={{ padding: "12px 18px", fontSize: 14, color: "#94A3B8", borderBottom: "1px solid #1E293B", fontWeight: 600, fontFamily: FONT.sans }}>{title}</div>}
      <div style={{ padding: "14px 0" }}>
        {lines.map((l, i) => {
          const o = clamp01(shown - i);
          const bg = l.kind === "add" ? "rgba(16,185,129,0.16)" : l.kind === "del" ? "rgba(239,68,68,0.16)" : "transparent";
          const col = l.color ?? (l.kind === "add" ? "#6EE7B7" : l.kind === "del" ? "#FCA5A5" : l.kind === "dim" ? "#64748B" : l.kind === "key" ? "#A5B4FC" : "#E2E8F0");
          return (
            <div key={i} style={{ display: "flex", gap: 14, padding: "1px 18px", background: bg, opacity: o, transform: `translateX(${(1 - o) * -10}px)`, fontSize, lineHeight: 1.55, whiteSpace: "pre", color: col }}>
              <span style={{ width: 22, textAlign: "right", color: "#475569", flex: "none" }}>{l.kind === "add" ? "+" : l.kind === "del" ? "−" : i + 1}</span>
              <span>{l.t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Llamada flotante que explica un resultado (en coordenadas del escenario). */
export const Callout: React.FC<{ x: number; y: number; delay: number; icon: LucideIcon; title: string; body?: string; tone?: Tone; w?: number; tilt?: number; until?: number }> = ({
  x, y, delay, icon: I, title, body, tone = "indigo", w = 380, tilt = -1.5, until,
}) => {
  const p = useSpr(delay, SPR.pop);
  const out = useProg(until ?? 99999, 0.35, EASE.inOut);
  if (out >= 0.99) return null;
  const { t } = useT();
  const float = Math.sin((t + x * 0.01) * 1.6) * 5;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, opacity: clamp01(p * 1.6) * (1 - out), transform: `translate3d(${out * 60}px, ${(1 - p) * 40 + float}px, 0) scale(${lerp(0.86, 1, p)}) rotate(${lerp(tilt * 3, tilt, p)}deg)`,
        background: "#fff", borderRadius: 22, padding: "18px 22px", display: "flex", gap: 16, alignItems: "flex-start", fontFamily: FONT.sans, color: U.text,
        boxShadow: "0 40px 70px -26px rgba(2,6,23,0.7), 0 0 0 1px rgba(255,255,255,0.7)",
      }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 16, background: TONE[tone].bg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <I size={26} color={TONE[tone].solid} strokeWidth={2.3} />
      </div>
      <div>
        <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2 }}>{title}</div>
        {body && <div style={{ marginTop: 6, fontSize: 18, color: U.text2, lineHeight: 1.4, fontWeight: 500 }}>{body}</div>}
      </div>
    </div>
  );
};

/** Pin numerado de paso (con pulso) en coordenadas del escenario. */
export const Pin: React.FC<{ x: number; y: number; n: number | string; delay: number; label?: string }> = ({ x, y, n, delay, label }) => {
  const p = useSpr(delay, SPR.pop);
  const pulse = useProg(delay + 0.2, 1.4, EASE.out);
  const { t } = useT();
  const loop = ((t - delay) * 0.9) % 1;
  return (
    <div style={{ position: "absolute", left: x - 25, top: y - 25, width: 50, height: 50, transform: `scale(${p})`, opacity: clamp01(p * 2), fontFamily: FONT.sans }}>
      {pulse < 1 && <div style={{ position: "absolute", inset: -8 - pulse * 22, borderRadius: "50%", border: "3px solid #A5B4FC", opacity: 1 - pulse }} />}
      {t > delay + 1.2 && <div style={{ position: "absolute", inset: -6 - loop * 14, borderRadius: "50%", border: "2px solid #A5B4FC", opacity: (1 - loop) * 0.55 }} />}
      <div style={{ width: 50, height: 50, borderRadius: 25, background: U.grad, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, boxShadow: "0 12px 26px -6px rgba(79,70,229,0.75), inset 0 1px 0 rgba(255,255,255,0.4)", border: "3px solid #fff" }}>{n}</div>
      {label && <div style={{ position: "absolute", left: 62, top: 7, whiteSpace: "nowrap", padding: "6px 16px", borderRadius: 999, background: "#0F172A", color: "#fff", fontSize: 18, fontWeight: 700, boxShadow: "0 10px 24px -8px rgba(0,0,0,0.6)" }}>{label}</div>}
    </div>
  );
};
