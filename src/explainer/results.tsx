// Piezas de resultados compartidas por las escenas de herramientas: radar, chips de estado, cabeceras de tarjeta y revelado escalonado.
import React from "react";
import type { LucideIcon } from "lucide-react";
import { Check, X } from "lucide-react";
import { FONT } from "./theme";
import { clamp01, Enter, SPR, useProg, EASE } from "./motion";
import { Card, Tag, TONE, U, type Tone } from "./widgets";

/** Ancho útil de los resultados dentro del área de contenido (40 px de margen a cada lado). */
export const RW = 1012;
export const Results: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginLeft: 40, width: RW, fontFamily: FONT.sans }}>{children}</div>
);

/** Cabecera de una tarjeta de resultados: título, subtítulo y contenido a la derecha. */
export const CardHead: React.FC<{ title: string; sub?: string; right?: React.ReactNode; icon?: LucideIcon; tone?: Tone }> = ({ title, sub, right, icon: I, tone = "indigo" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
    {I && <div style={{ width: 40, height: 40, borderRadius: 12, background: TONE[tone].bg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><I size={22} color={TONE[tone].solid} strokeWidth={2.3} /></div>}
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: U.text, letterSpacing: -0.4, lineHeight: 1.15 }}>{title}</div>
      {sub && <div style={{ fontSize: 15, color: U.text3, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
    </div>
    {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
  </div>
);

/** Chip de estado con punto de color (Permitido / Bloqueado / Aviso…). */
export const Status: React.FC<{ tone: Tone; children: React.ReactNode; size?: number }> = ({ tone, children, size = 15 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: `${size * 0.3}px ${size * 0.75}px`, borderRadius: 999, background: TONE[tone].bg, color: TONE[tone].fg, fontWeight: 700, fontSize: size, whiteSpace: "nowrap" }}>
    <span style={{ width: size * 0.5, height: size * 0.5, borderRadius: "50%", background: TONE[tone].solid }} />
    {children}
  </span>
);

/** Fila «señal»: icono de acierto o fallo y su nombre. */
export const SignalChip: React.FC<{ ok: boolean; children: React.ReactNode; delay: number }> = ({ ok, children, delay }) => (
  <Enter delay={delay} y={12} blur={4} cfg={SPR.snappy}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 14, background: ok ? U.green50 : U.amber50, border: `1px solid ${ok ? "#A7F3D0" : "#FDE68A"}`, fontSize: 17, fontWeight: 700, color: ok ? "#047857" : "#B45309", whiteSpace: "nowrap" }}>
      <span style={{ width: 24, height: 24, borderRadius: 12, background: ok ? U.green : U.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {ok ? <Check size={15} color="#fff" strokeWidth={3.4} /> : <X size={15} color="#fff" strokeWidth={3.4} />}
      </span>
      {children}
    </div>
  </Enter>
);

/** Radar de N ejes (diamante para 4): rejilla, polígono con relleno y puntos. */
export const Radar: React.FC<{ values: number[]; labels: string[]; progress: number; size?: number; color?: string }> = ({ values, labels, progress, size = 230, color = U.primary }) => {
  const n = values.length, R = size / 2, W = size + 190, H = size + 90, cx = W / 2, cy = H / 2 + 4;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, f: number) => [cx + Math.cos(ang(i)) * R * f, cy + Math.sin(ang(i)) * R * f] as const;
  const poly = (f: (i: number) => number) => Array.from({ length: n }, (_, i) => pt(i, f(i)).join(",")).join(" ");
  const p = clamp01(progress);
  return (
    <svg width={W} height={H} style={{ overflow: "visible", fontFamily: FONT.sans }}>
      {[0.25, 0.5, 0.75, 1].map((g) => <polygon key={g} points={poly(() => g)} fill="none" stroke={g === 1 ? "#CBD5E1" : "#E2E8F0"} strokeWidth={g === 1 ? 2 : 1.5} />)}
      {values.map((_, i) => <line key={i} x1={cx} y1={cy} x2={pt(i, 1)[0]} y2={pt(i, 1)[1]} stroke="#E2E8F0" strokeWidth={1.5} />)}
      <polygon points={poly((i) => (values[i] / 100) * p)} fill={`${color}33`} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      {values.map((v, i) => { const [x, y] = pt(i, (v / 100) * p); return <circle key={i} cx={x} cy={y} r={7} fill="#fff" stroke={color} strokeWidth={4} />; })}
      {labels.map((l, i) => {
        const [x, y] = pt(i, 1.2), a = ang(i);
        const anchor = Math.abs(Math.cos(a)) < 0.3 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
        return <text key={l} x={x} y={y + (Math.sin(a) > 0.3 ? 14 : Math.sin(a) < -0.3 ? -2 : 6)} textAnchor={anchor} fontSize={19} fontWeight={700} fill={U.text2}>{l}</text>;
      })}
    </svg>
  );
};

/** Pastilla numerada de paso (para listas de recomendaciones). */
export const StepDot: React.FC<{ n: number | string; tone?: Tone }> = ({ n, tone = "indigo" }) => (
  <span style={{ width: 34, height: 34, borderRadius: 17, background: TONE[tone].bg, color: TONE[tone].fg, fontWeight: 800, fontSize: 17, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{n}</span>
);

/** Panel que entra (opacidad + deslizamiento) en `from` y sale en `to`; sirve para el contenido de las pestañas. */
export const Panel: React.FC<{ from: number; to?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ from, to, children, style }) => {
  const inn = useProg(from, 0.45, EASE.out);
  const out = useProg(to ?? 99999, 0.28, EASE.inOut);
  const o = clamp01(inn) * (1 - out);
  if (o < 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: o, transform: `translateX(${(1 - inn) * 26 - out * 18}px)`, ...style }}>{children}</div>;
};

export { Card, Tag };
