// Ventana del producto: barra de navegador, barra lateral con los grupos reales del dashboard,
// cabecera con chips de plan y créditos, y los formularios de URL de las herramientas.
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import {
  Activity, BarChart3, Bot, Building2, Check, ChevronDown, ChevronRight, Code2, Eye, FolderKanban, Globe, Heart, Layers, LayoutGrid, Lightbulb, Moon,
  ScanSearch, Search, Settings, Shield, Sparkles, Target, UserCheck, Wrench, Zap, type LucideIcon,
} from "lucide-react";
import { C, FONT } from "./theme";
import { lerp, SPR, useSpr, useT, clamp01 } from "./motion";
import { Card, Tag, U } from "./widgets";

export type NavKey = "overview" | "projects" | "llm" | "eeat" | "semantic" | "human" | "infogain" | "geo" | "inspect" | "schema" | "robots" | "indexnow" | "building" | "tracker" | "prompt" | "sentiment" | "traffic";
export type GroupId = "ia" | "tec" | "build" | "track";

export const NAV: Record<NavKey, { label: string; sub: string; icon: LucideIcon; badge?: "NEW" | "BETA" }> = {
  overview: { label: "Resumen General", sub: "Panel general", icon: LayoutGrid },
  projects: { label: "Proyectos", sub: "Gestiona tus proyectos", icon: FolderKanban },
  llm: { label: "Optimización LLM", sub: "Mejora citabilidad por IAs", icon: Sparkles },
  eeat: { label: "Auditoría E-E-A-T", sub: "Experiencia y confianza", icon: Shield },
  semantic: { label: "AIO Semántico", sub: "Compara con competidores", icon: Layers },
  human: { label: "Human-First Score", sub: "Texto humano vs IA", icon: UserCheck, badge: "NEW" },
  infogain: { label: "Information Gain", sub: "Qué aportas de nuevo", icon: Lightbulb, badge: "NEW" },
  geo: { label: "Ampliaciones GEO", sub: "Auditoría por prompts", icon: Globe, badge: "BETA" },
  inspect: { label: "LLM Inspect", sub: "Inspecciona una URL como la lee la IA", icon: ScanSearch },
  schema: { label: "Schema Scan", sub: "Valida datos estructurados", icon: Code2 },
  robots: { label: "Robots.txt Optimizer", sub: "Abre tu web a los bots de IA", icon: Bot },
  indexnow: { label: "Index Now", sub: "Indexa en Bing al instante", icon: Zap },
  building: { label: "AI Building", sub: "Co-citaciones", icon: Building2, badge: "NEW" },
  tracker: { label: "LLM Tracker", sub: "Rastrea menciones en IA", icon: Eye, badge: "BETA" },
  prompt: { label: "Prompt Tracker", sub: "Sigue tus prompts", icon: Target, badge: "NEW" },
  sentiment: { label: "Brand Sentiment", sub: "Qué dicen de tu marca", icon: Heart },
  traffic: { label: "AI Traffic Analytics", sub: "Tráfico desde chats de IA", icon: BarChart3, badge: "NEW" },
};

const GROUPS: { id: GroupId; label: string; icon: LucideIcon; items: NavKey[] }[] = [
  { id: "ia", label: "IA OPTIMIZATION", icon: Sparkles, items: ["llm", "eeat", "semantic"] },
  { id: "tec", label: "AIO TÉCNICO", icon: Wrench, items: ["inspect", "schema", "robots"] },
  { id: "build", label: "AI BUILDING", icon: Building2, items: ["building"] },
  { id: "track", label: "AI TRACKING", icon: Activity, items: ["tracker", "prompt", "traffic"] },
];

// Geometría de la ventana en el escenario de 1920×1080
export const WIN = { x: 120, y: 108, w: 1360, h: 744, bar: 52, side: 268, head: 68 } as const;
export const CONTENT = { x: WIN.x + WIN.side, y: WIN.y + WIN.bar + WIN.head, w: WIN.w - WIN.side, h: WIN.h - WIN.bar - WIN.head } as const;
/** Punto del contenido (coordenadas locales) → coordenadas del escenario. */
export const pt = (x: number, y: number) => ({ x: CONTENT.x + x, y: CONTENT.y + y });

export function sidebarRows(open: GroupId | null) {
  const rows: { key: string; top: number; h: number; kind: "top" | "group" | "item" }[] = [];
  let y = 86;
  for (const k of ["overview", "projects"] as const) { rows.push({ key: k, top: y, h: 62, kind: "top" }); y += 62; }
  for (const g of GROUPS) {
    rows.push({ key: "g:" + g.id, top: y, h: 46, kind: "group" }); y += 46;
    if (open === g.id) for (const it of g.items) { rows.push({ key: it, top: y, h: it === "inspect" || it === "robots" ? 64 : 60, kind: "item" }); y += rows[rows.length - 1].h; }
  }
  return rows;
}
/** Centro (en el escenario) de una fila de la barra lateral. */
export function navPoint(open: GroupId | null, key: NavKey) {
  const r = sidebarRows(open).find((x) => x.key === key)!;
  return { x: WIN.x + 150, y: WIN.y + WIN.bar + r.top + r.h / 2 };
}

const Sidebar: React.FC<{ open: GroupId | null; active: NavKey; prev?: NavKey; switchAt: number }> = ({ open, active, prev, switchAt }) => {
  const rows = sidebarRows(open);
  const rowOf = (k: string) => rows.find((r) => r.key === k);
  const p = useSpr(switchAt, SPR.snappy);
  const a = rowOf(active), b = prev ? rowOf(prev) : a;
  const top = a && b ? lerp(b.top, a.top, p) : a?.top ?? 0, h = a && b ? lerp(b.h, a.h, p) : a?.h ?? 60;
  const current = prev && p < 0.5 ? prev : active; // la fila solo se marca como activa tras el clic
  return (
    <div style={{ position: "relative", width: WIN.side, height: "100%", background: "#fff", borderRight: `1px solid ${U.border}`, fontFamily: FONT.sans }}>
      <div style={{ position: "absolute", left: 22, top: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <Img src={staticFile("brand/llmfy-icon-512.png")} style={{ width: 44, height: 44, borderRadius: 13 }} />
        <span style={{ fontSize: 28, fontWeight: 800, color: U.text, letterSpacing: -0.6 }}>LLMFY</span>
      </div>
      <div style={{ position: "absolute", left: 12, right: 12, top, height: h, borderRadius: 14, background: U.primary50, borderLeft: `4px solid ${U.primary}` }} />
      {rows.map((r) => {
        if (r.kind === "group") {
          const g = GROUPS.find((x) => "g:" + x.id === r.key)!;
          return (
            <div key={r.key} style={{ position: "absolute", left: 26, right: 22, top: r.top, height: r.h, display: "flex", alignItems: "center", gap: 12, color: U.text3, fontWeight: 700, fontSize: 15, letterSpacing: 0.4 }}>
              <g.icon size={20} strokeWidth={2.1} />
              {g.label}
              <span style={{ marginLeft: "auto" }}>{open === g.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
            </div>
          );
        }
        const n = NAV[r.key as NavKey];
        const on = r.key === current;
        return (
          <div key={r.key} style={{ position: "absolute", left: 26, right: 18, top: r.top, height: r.h, display: "flex", alignItems: "center", gap: 14, paddingLeft: r.kind === "item" ? 6 : 0 }}>
            <n.icon size={26} color={on ? U.primaryDark : U.text2} strokeWidth={2} style={{ flex: "none" }} />
            <div style={{ lineHeight: 1.2, minWidth: 0 }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: on ? U.primaryDark : U.text, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                {n.label}
                {n.badge && <Tag tone={n.badge === "NEW" ? "green" : "amber"} size={11}>{n.badge}</Tag>}
              </div>
              <div style={{ fontSize: 14, color: U.text3, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 190 }}>{n.sub}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 26, bottom: 18, display: "flex", alignItems: "center", gap: 14, color: U.text2, fontSize: 19, fontWeight: 600 }}>
        <Settings size={24} strokeWidth={2} /> Configuración
      </div>
    </div>
  );
};

const Header: React.FC<{ plan: string; credits: string; creditPulse: number }> = ({ plan, credits, creditPulse }) => (
  <div style={{ height: WIN.head, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14, padding: "0 28px", background: "#fff", borderBottom: `1px solid ${U.border}`, fontFamily: FONT.sans }}>
    <span style={{ padding: "8px 16px", borderRadius: 10, background: U.primary50, border: `1px solid ${U.primary100}`, color: U.primaryDark, fontWeight: 700, fontSize: 17 }}>{plan}</span>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: U.primary100, color: U.primaryDark, fontWeight: 700, fontSize: 17, transform: `scale(${1 + creditPulse * 0.08})` }}>
      <Zap size={18} strokeWidth={2.4} /> {credits}
    </span>
    <div style={{ width: 42, height: 42, borderRadius: 21, display: "flex", alignItems: "center", justifyContent: "center", color: U.text2 }}><Moon size={22} /></div>
    <div style={{ display: "flex", padding: 4, borderRadius: 14, background: "#F1F5F9", fontSize: 16, fontWeight: 700 }}>
      <span style={{ padding: "6px 14px", borderRadius: 10, background: "#fff", color: U.primaryDark, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>ES</span>
      <span style={{ padding: "6px 14px", color: U.text3 }}>EN</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, fontWeight: 600, color: U.text }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: "linear-gradient(135deg,#818CF8,#A855F7)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>AL</div>
      Ana López <ChevronDown size={18} color={U.text3} />
    </div>
  </div>
);

/** Ventana completa del dashboard. Los hijos se pintan en el área de contenido (coordenadas locales de CONTENT). */
export const AppWindow: React.FC<{
  route: string; open: GroupId | null; active: NavKey; prev?: NavKey; switchAt?: number; plan?: string; credits?: string; creditPulse?: number; children?: React.ReactNode; style?: React.CSSProperties;
}> = ({ route, open, active, prev, switchAt = 0, plan = "Plan Pro", credits = "150 créditos", creditPulse = 0, children, style }) => (
  <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 24, overflow: "hidden", background: U.page, border: "1px solid rgba(255,255,255,0.28)", boxShadow: "0 70px 130px -34px rgba(0,0,0,0.85), 0 26px 60px -24px rgba(99,102,241,0.5)", ...style }}>
    <div style={{ height: WIN.bar, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", background: "#EEF1F7", borderBottom: `1px solid ${U.border}`, fontFamily: FONT.sans }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <div style={{ marginLeft: 22, height: 32, width: 560, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", gap: 8, color: U.text2, fontSize: 16, fontFamily: FONT.mono, border: `1px solid ${U.border}` }}>
        <span style={{ color: U.green }}>●</span> llmfy.ai/dashboard{route}
      </div>
    </div>
    <div style={{ display: "flex", height: WIN.h - WIN.bar }}>
      <Sidebar open={open} active={active} prev={prev} switchAt={switchAt} />
      <div style={{ flex: 1, position: "relative" }}>
        <Header plan={plan} credits={credits} creditPulse={creditPulse} />
        <div style={{ position: "absolute", left: 0, right: 0, top: WIN.head, bottom: 0, overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  </div>
);

/** Cabecera de herramienta: miga de pan, icono, título y subtítulo. */
export const PageHead: React.FC<{ icon: LucideIcon; title: string; sub: string; crumb: string; badge?: React.ReactNode; opacity?: number; x?: number; y?: number }> = ({ icon: I, title, sub, crumb, badge, opacity = 1, x = 40, y = 26 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, transform: `translateY(${(1 - opacity) * 14}px)`, fontFamily: FONT.sans }}>
    <div style={{ fontSize: 15, color: U.text3, fontWeight: 600 }}>Inicio › Dashboard › <span style={{ color: U.primaryDark }}>{crumb}</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: U.grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px -8px rgba(99,102,241,0.6)" }}><I size={29} color="#fff" strokeWidth={2.2} /></div>
      <div>
        <div style={{ fontSize: 38, fontWeight: 800, color: U.text, letterSpacing: -1, lineHeight: 1.05, display: "flex", alignItems: "center", gap: 14 }}>{title}{badge}</div>
        <div style={{ marginTop: 4, fontSize: 19, color: U.text2, fontWeight: 500 }}>{sub}</div>
      </div>
    </div>
  </div>
);

export const FORM = { left: 40, top: 150, w: 996, pad: 28, inputH: 62, btnW: 286 } as const;
/** Centros (en coordenadas del escenario) del campo y del botón del formulario de URL. */
export const formPoints = () => {
  const inputW = FORM.w - FORM.pad * 2 - FORM.btnW - 16;
  return {
    input: pt(FORM.left + FORM.pad + inputW / 2, FORM.top + 84 + FORM.inputH / 2),
    inputLeft: pt(FORM.left + FORM.pad + 60, FORM.top + 84 + FORM.inputH / 2),
    button: pt(FORM.left + FORM.w - FORM.pad - FORM.btnW / 2, FORM.top + 84 + FORM.inputH / 2),
  };
};

/** Tarjeta «URL a analizar» con campo, botón y créditos. */
export const UrlCard: React.FC<{
  label?: string; placeholder?: string; value?: string; caret?: boolean; focus?: boolean; button?: string; pressed?: number; ready?: boolean; credit?: string; icon?: LucideIcon; opacity?: number; helper?: string;
}> = ({ label = "URL a analizar", placeholder = "https://ejemplo.com/articulo", value = "", caret = false, focus = false, button = "Analizar Citabilidad", pressed = 0, ready = true, credit = "1 crédito por análisis", icon: BtnIcon = Sparkles, opacity = 1, helper = "Analiza una URL específica. Este análisis evalúa la página indicada, no todo el sitio web." }) => {
  const inputW = FORM.w - FORM.pad * 2 - FORM.btnW - 16;
  return (
    <div style={{ position: "absolute", left: FORM.left, top: FORM.top, width: FORM.w, padding: FORM.pad, background: "#fff", border: `1px solid ${U.border}`, borderRadius: 22, boxShadow: "0 14px 34px -18px rgba(15,23,42,0.2)", fontFamily: FONT.sans, opacity, transform: `translateY(${(1 - opacity) * 18}px)` }}>
      <div style={{ fontSize: 19, fontWeight: 700, color: U.text2, marginBottom: 14, height: 26 }}>{label}</div>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ width: inputW, height: FORM.inputH, borderRadius: 16, border: `2px solid ${focus ? U.primary : U.border}`, boxShadow: focus ? "0 0 0 5px rgba(99,102,241,0.16)" : undefined, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, fontSize: 23, background: "#fff" }}>
          <Search size={26} color={U.text3} />
          {value ? <span style={{ color: U.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden" }}>{value}</span> : <span style={{ color: U.text3 }}>{placeholder}</span>}
          {caret && <span style={{ width: 2, height: 30, background: U.primary, marginLeft: -10 }} />}
        </div>
        <div style={{ width: FORM.btnW, height: FORM.inputH, borderRadius: 16, background: ready ? U.grad : "#C7D2FE", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 21, fontWeight: 800, transform: `scale(${1 - pressed * 0.05})`, boxShadow: ready ? "0 14px 28px -10px rgba(99,102,241,0.7)" : undefined }}>
          <BtnIcon size={24} strokeWidth={2.3} /> {button}
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 16, color: U.text3, fontWeight: 500 }}>ⓘ {helper}</div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, color: U.text2, fontWeight: 500 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${U.border}` }} /> Forzar re-análisis (ignorar caché)</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Tag tone="indigo" size={15}><Zap size={15} /> 1</Tag> {credit.replace(/^1 /, "")}</span>
      </div>
    </div>
  );
};

/** Modal de progreso mientras se analiza. */
export const ProgressModal: React.FC<{ progress: number; title?: string; steps: string[]; eta?: string }> = ({ progress, title = "Analizando tu URL…", steps, eta = "30-45 s" }) => {
  const p = clamp01(progress);
  const enter = interpolate(p, [0, 0.06], [0, 1], { extrapolateRight: "clamp" }), leave = interpolate(p, [0.94, 1], [1, 0], { extrapolateLeft: "clamp" });
  const o = Math.min(enter, leave);
  const { frame } = useT();
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.35 * o})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.sans }}>
      <div style={{ width: 600, padding: "34px 38px", borderRadius: 26, background: "#fff", boxShadow: "0 50px 90px -30px rgba(0,0,0,0.6)", transform: `scale(${lerp(0.94, 1, o)}) translateY(${(1 - o) * 20}px)`, opacity: o }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: U.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={27} color="#fff" style={{ transform: `rotate(${frame * 6}deg)` }} />
          </div>
          <div>
            <div style={{ fontSize: 27, fontWeight: 800, color: U.text, letterSpacing: -0.6 }}>{title}</div>
            <div style={{ fontSize: 17, color: U.text3, fontWeight: 600 }}>Suele tardar {eta}</div>
          </div>
        </div>
        <div style={{ marginTop: 26, display: "grid", gap: 14 }}>
          {steps.map((s, i) => {
            const done = p > (i + 1) / steps.length - 0.02, now = !done && p > i / steps.length;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, fontWeight: 600, color: done ? U.text : now ? U.primaryDark : U.text3 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: done ? U.green : "transparent", border: done ? "none" : `2.5px solid ${now ? U.primary : U.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done && <Check size={18} color="#fff" strokeWidth={3.2} />}
                </div>
                {s}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 26, height: 10, borderRadius: 6, background: "#EDF0F7", overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 6, background: U.grad }} />
        </div>
      </div>
    </div>
  );
};

/** Texto "Datos de ejemplo" bajo la ventana. */
export const SampleNote: React.FC<{ opacity?: number }> = ({ opacity = 0.7 }) => (
  <div style={{ position: "absolute", left: WIN.x, top: WIN.y + WIN.h + 14, fontFamily: FONT.sans, fontSize: 16, fontWeight: 600, color: C.text3, opacity, letterSpacing: 0.3 }}>
    Pantallas con datos de ejemplo
  </div>
);

/** Página «Resumen General» (la que se ve nada más entrar): configuración de herramientas y KPIs a cero. */
export const OverviewPage: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div style={{ position: "absolute", inset: 0, opacity, transform: `translateY(${(1 - opacity) * 12}px)` }}>
    <PageHead icon={LayoutGrid} title="Resumen General" sub="Vista general de tu optimización AI SEO" crumb="Resumen" />
    <div style={{ position: "absolute", left: 40, top: 190, width: 996, padding: "26px 30px", background: "#fff", border: `1px solid ${U.border}`, borderRadius: 22, display: "flex", alignItems: "center", gap: 24, fontFamily: FONT.sans }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: U.primary50, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={30} color={U.primary} /></div>
      <div style={{ fontSize: 24, fontWeight: 800, color: U.text }}>Configuración de herramientas</div>
      <div style={{ flex: 1, height: 12, borderRadius: 8, background: "#EDF0F7" }}><div style={{ width: "4%", height: "100%", borderRadius: 8, background: U.grad }} /></div>
      <div style={{ fontSize: 21, fontWeight: 700, color: U.text2 }}>0 de 11</div>
    </div>
    <div style={{ position: "absolute", left: 40, top: 300, display: "flex", gap: 22 }}>
      {[["Análisis totales", "0"], ["Score E-E-A-T", "—"], ["Citabilidad LLM", "—"]].map(([l, v]) => (
        <Card key={l} style={{ width: 318, padding: "26px 28px" }}><div style={{ fontSize: 54, fontWeight: 800, color: U.primaryDark }}>{v}</div><div style={{ fontSize: 20, color: U.text2, fontWeight: 600, marginTop: 6 }}>{l}</div></Card>
      ))}
    </div>
  </div>
);

/** Página «fantasma» (esqueleto) para el instante previo al clic cuando venimos de otra herramienta. */
export const GhostPage: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { frame } = useT();
  const sh = 0.55 + 0.25 * Math.sin(frame / 9);
  const bar = (w: number, h: number, extra?: React.CSSProperties) => <div style={{ width: w, height: h, borderRadius: 12, background: "#E8EDF5", opacity: sh, ...extra }} />;
  return (
    <div style={{ position: "absolute", inset: 0, opacity, padding: "34px 40px" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>{bar(56, 56, { borderRadius: 16 })}<div style={{ display: "grid", gap: 10 }}>{bar(340, 26)}{bar(520, 16)}</div></div>
      <div style={{ marginTop: 34 }}>{bar(996, 230, { borderRadius: 22 })}</div>
      <div style={{ marginTop: 22, display: "flex", gap: 22 }}>{bar(318, 150, { borderRadius: 22 })}{bar(318, 150, { borderRadius: 22 })}{bar(318, 150, { borderRadius: 22 })}</div>
    </div>
  );
};
