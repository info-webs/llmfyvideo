// Escenas 10-12: AI Traffic Analytics, el resto de herramientas y planes + llamada a la acción.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BarChart3, Building2, Check, Globe, Heart, Lightbulb, Lock, ShieldCheck, Star, UserCheck, Zap, type LucideIcon } from "lucide-react";
import { SceneShell } from "./shell";
import type { SceneRuntime } from "./config";
import { Camera, Cursor, EASE, Enter, lerp, SPR, clamp01, useProg, useSpr, useT, type CursorPoint } from "./motion";
import { AreaChart, Callout, Card, IconBox, KPI, MetricBar, Tabs, Tag, U } from "./widgets";
import { AppFlow, bump } from "./ToolFlow";
import { CONTENT, navPoint, PageHead } from "./product";
import { CardHead, Status } from "./results";
import { Glass, Pill, Ring } from "./ui";
import { Orb, Sheen } from "./fx";
import { C, FONT, GRAD, SHADOW } from "./theme";
import type { Cue } from "./audio";

type SP = { def: SceneRuntime };
const SIDE_X = 1500;

/* ───────────────────────── 10 · AI TRAFFIC ANALYTICS ───────────────────────── */
const NAV10 = 0.9, CONNECT = 3.4, OVERLAY = 4.0, PICK = 4.9, RES10 = 5.6;
const HERO = { left: 40, top: 118, w: 996, h: 440 };
const CONNECT_BTN = { x: CONTENT.x + HERO.left + 190 + 190, y: CONTENT.y + HERO.top + 322 + 29 };
const PICK_POS = { x: CONTENT.x + CONTENT.w / 2, y: CONTENT.y + 312 - 16 };

const Dots: React.FC = () => {
  const { frame } = useT();
  return <span style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", display: "inline-block", transform: `rotate(${frame * 12}deg)` }} />;
};

const TrafficOnboarding: React.FC = () => {
  const { t } = useT();
  const a = useProg(NAV10 + 0.2, 0.7), out = useProg(RES10 - 0.15, 0.35, EASE.inOut);
  const press = Math.max(0, bump(t, CONNECT));
  const connecting = t >= CONNECT && t < OVERLAY + 0.6;
  if (out >= 0.99) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <div style={{ position: "absolute", left: HERO.left, top: HERO.top, width: HERO.w, height: HERO.h, borderRadius: 26, background: "linear-gradient(180deg,#fff,#F5F3FF)", border: `1px solid ${U.border}`, boxShadow: "0 24px 54px -26px rgba(79,70,229,0.4)", fontFamily: FONT.sans, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center" }}><IconBox icon={BarChart3} size={84} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontSize: 46, fontWeight: 800, color: U.text, letterSpacing: -1.5 }}>AI Traffic Analytics</div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 196, textAlign: "center", fontSize: 22, fontWeight: 600, color: U.text2, lineHeight: 1.4 }}>Descubre cuánto tráfico envían ChatGPT, Gemini, Perplexity y otros chatbots de IA a tu web</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 266, textAlign: "center", fontSize: 18, fontWeight: 500, color: U.text3 }}>Conecta Google Analytics en 30 segundos y obtén insights que ninguna otra herramienta te ofrece.</div>
        <div style={{ position: "absolute", left: 190, top: 322, display: "flex", gap: 16 }}>
          <div style={{ width: 380, height: 58, borderRadius: 16, background: U.grad, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 20, fontWeight: 800, transform: `scale(${1 - press * 0.05})`, boxShadow: "0 14px 28px -10px rgba(99,102,241,0.7)" }}>
            {connecting ? <><Dots /> Conectando…</> : <><BarChart3 size={22} /> Conectar Google Analytics</>}
          </div>
          <div style={{ width: 220, height: 58, borderRadius: 16, background: "#fff", border: `2px solid ${U.primary100}`, color: U.primaryDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>Ver cómo funciona</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 398, display: "flex", justifyContent: "center", gap: 14 }}>
          <Tag tone="green" size={16}><Lock size={15} /> Acceso de solo lectura</Tag>
          <Tag tone="indigo" size={16}><ShieldCheck size={15} /> No modificamos tu Analytics</Tag>
        </div>
      </div>
    </div>
  );
};

const PropertyPicker: React.FC = () => {
  const { t } = useT();
  const inn = useProg(OVERLAY, 0.4), out = useProg(RES10 - 0.35, 0.3, EASE.inOut);
  const o = Math.min(inn, 1 - out);
  const sel = useProg(PICK, 0.25);
  if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(15,23,42,${0.35 * o})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.sans }}>
      <div style={{ width: 600, padding: "30px 34px", borderRadius: 26, background: "#fff", boxShadow: "0 50px 90px -30px rgba(0,0,0,0.6)", opacity: o, transform: `scale(${lerp(0.94, 1, o)}) translateY(${(1 - o) * 18}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: U.green50, display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldCheck size={26} color={U.green} /></div>
          <div><div style={{ fontSize: 26, fontWeight: 800, color: U.text, letterSpacing: -0.5 }}>Elige tu propiedad de GA4</div><div style={{ fontSize: 16, color: U.text3, fontWeight: 600 }}>Conectado en solo lectura</div></div>
        </div>
        <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
          {[["tu-web.com", "GA4 · 3 flujos de datos"], ["tienda-demo.es", "GA4 · 1 flujo de datos"]].map(([n, s], i) => {
            const on = i === 0 && sel > 0.5;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 16, border: `2px solid ${on ? U.primary : U.border}`, background: on ? U.primary50 : "#fff", boxShadow: on ? "0 0 0 5px rgba(99,102,241,0.14)" : undefined }}>
                <div style={{ width: 26, height: 26, borderRadius: 13, border: `2px solid ${on ? U.primary : U.border}`, background: on ? U.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{on && <Check size={16} color="#fff" strokeWidth={3.4} />}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 20, fontWeight: 800, color: U.text }}>{n}</div><div style={{ fontSize: 15, color: U.text3, fontWeight: 600 }}>{s}</div></div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20, height: 8, borderRadius: 6, background: "#EDF0F7", overflow: "hidden", opacity: t > PICK ? 1 : 0 }}><div style={{ width: `${clamp01((t - PICK - 0.1) / 0.5) * 100}%`, height: "100%", background: U.grad }} /></div>
      </div>
    </div>
  );
};

const CHATS: [string, number, string][] = [["ChatGPT", 62, U.green], ["Perplexity", 18, U.teal], ["Gemini", 12, U.violet], ["Otros", 8, U.amber]];
const WEEKLY = [96, 128, 141, 177, 214, 248, 280];
const fmt = (n: number) => Math.round(n).toString().replace(/B(?=(d{3})+(?!d))/g, ".");
const TrafficResults: React.FC = () => {
  const { t } = useT();
  const inn = useProg(RES10, 0.5);
  const k = useProg(RES10 + 0.2, 1.4), bars = useProg(RES10 + 0.9, 1.2), ch = useProg(RES10 + 1.3, 1.6, EASE.inOut);
  if (t < RES10 - 0.1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: inn }}>
      <PageHead icon={BarChart3} title="AI Traffic Analytics" sub="Tráfico que llega a tu web desde chats de IA" crumb="AI Traffic Analytics" badge={<Tag tone="green" size={13}>NEW</Tag>} />
      <div style={{ position: "absolute", left: 40, top: 134, width: 996 }}><Tabs items={["Overview", "AI Chats", "Geografía", "Conversiones", "eCommerce"]} active={1} size={18} gap={34} /></div>
      <div style={{ position: "absolute", left: 40, top: 198, display: "flex", gap: 20 }}>
        <Enter delay={RES10 + 0.1} y={24} blur={4} cfg={SPR.soft}><KPI label="Sesiones AI Chats" value={fmt(1284 * k)} icon={BarChart3} accent={U.primary} delta="+38 %" spark={WEEKLY} progress={k} w={317} /></Enter>
        <Enter delay={RES10 + 0.25} y={24} blur={4} cfg={SPR.soft}><KPI label="Usuarios" value={fmt(1052 * k)} icon={UserCheck} accent={U.teal} delta="+31 %" spark={[80, 104, 112, 138, 170, 205, 243]} progress={k} w={317} /></Enter>
        <Enter delay={RES10 + 0.4} y={24} blur={4} cfg={SPR.soft}><KPI label="Conversiones" value={String(Math.round(63 * k))} icon={Check} accent={U.violet} delta="+9" spark={[4, 6, 7, 9, 10, 12, 15]} progress={k} w={317} /></Enter>
      </div>
      <Enter delay={RES10 + 0.6} y={26} blur={4} cfg={SPR.soft}>
        <Card style={{ position: "absolute", left: 40, top: 384, width: 520, height: 228, boxSizing: "border-box", padding: "16px 24px" }}>
          <CardHead title="Tráfico por chat de IA" sub="Origen de las sesiones" />
          <div style={{ display: "grid", gap: 12 }}>{CHATS.map(([n, v, c]) => <MetricBar key={n} label={n} value={v} progress={bars} color={c} width={472} size={15} />)}</div>
        </Card>
      </Enter>
      <Enter delay={RES10 + 1.0} y={26} blur={4} cfg={SPR.soft}>
        <Card style={{ position: "absolute", left: 580, top: 384, width: 456, height: 228, boxSizing: "border-box", padding: "16px 24px 10px" }}>
          <CardHead title="Tendencia semanal" sub="Sesiones desde chats de IA" />
          <AreaChart points={WEEKLY} progress={ch} w={408} h={132} labels={["S1", "S2", "S3", "S4", "S5", "S6", "S7"]} />
        </Card>
      </Enter>
    </div>
  );
};

export const Scene10: React.FC<SP> = ({ def }) => {
  const nav = navPoint("track", "traffic");
  const path: CursorPoint[] = [
    { t: NAV10 - 1.1, x: 1420, y: 560 }, { t: NAV10, x: nav.x, y: nav.y, click: true },
    { t: CONNECT, x: CONNECT_BTN.x, y: CONNECT_BTN.y, click: true },
    { t: PICK, x: PICK_POS.x, y: PICK_POS.y, click: true }, { t: RES10 + 1.2, x: 1340, y: 700 },
  ];
  const cues: Cue[] = [
    { at: NAV10, sfx: "click", vol: 0.45 }, { at: CONNECT, sfx: "click", vol: 0.5 }, { at: OVERLAY, sfx: "pop", vol: 0.4 }, { at: PICK, sfx: "click", vol: 0.45 },
    { at: RES10 - 0.1, sfx: "whooshSoft", vol: 0.4 }, { at: RES10 + 0.3, sfx: "riser", vol: 0.3 }, { at: RES10 + 1.5, sfx: "ding", vol: 0.45 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <AppFlow open="track" active="traffic" prev="prompt" switchAt={NAV10 + 0.05} route="/ai-traffic" path={path} extra={
        <>
          <Callout x={SIDE_X} y={300} delay={CONNECT + 0.9} until={RES10 - 0.1} icon={Lock} tone="green" title="Solo lectura" body="Conectas GA4 sin tocar nada." w={380} tilt={1.5} />
          <Callout x={SIDE_X} y={470} delay={RES10 + 0.8} icon={BarChart3} tone="indigo" title="Visitas desde chats de IA" body="ChatGPT, Perplexity, Gemini…" w={380} tilt={-1.5} />
        </>
      }>
        <TrafficOnboarding />
        <PropertyPicker />
        <TrafficResults />
      </AppFlow>
    </SceneShell>
  );
};

/* ───────────────────────── 11 · Y HAY MÁS ───────────────────────── */
const TOOLS: { n: string; d: string; icon: LucideIcon; color: string; at: number; mini: "ring" | "risk" | "gain" | "geo" | "tiers" | "bing"; tag?: string }[] = [
  { n: "Brand Sentiment", d: "Qué dice la IA de tu marca", icon: Heart, color: C.pink, at: 1.5, mini: "ring" },
  { n: "Human-First Score", d: "Texto humano vs patrones de IA", icon: UserCheck, color: C.green, at: 2.7, mini: "risk" },
  { n: "Information Gain", d: "Qué aportas de nuevo", icon: Lightbulb, color: C.amber, at: 4.0, mini: "gain" },
  { n: "Ampliaciones GEO", d: "Auditoría contra citas reales de la IA", icon: Globe, color: C.cyan, at: 5.2, mini: "geo", tag: "BETA" },
  { n: "AI Building", d: "Co-citaciones y autoridad", icon: Building2, color: C.accentLight, at: 6.4, mini: "tiers" },
  { n: "Index Now", d: "Indexa en Bing al instante", icon: Zap, color: C.primaryLight, at: 7.3, mini: "bing" },
];
const MiniVisual: React.FC<{ kind: (typeof TOOLS)[number]["mini"]; color: string; at: number }> = ({ kind, color, at }) => {
  const p = useProg(at + 0.3, 1.1);
  if (kind === "ring") return <Ring value={72} progress={p} size={92} stroke={10} color={color} sub="/100" />;
  if (kind === "risk") return <div style={{ display: "grid", gap: 8, justifyItems: "end" }}><Pill color={C.green} style={{ fontSize: 17 }}>Riesgo SEO: Bajo</Pill><Pill color={C.text2} style={{ fontSize: 15 }}>29 patrones de IA</Pill></div>;
  if (kind === "gain") {
    const seg: [string, number, string][] = [["Original", 62, C.green], ["Compartido", 24, C.amber], ["Duplicado", 14, C.red]];
    return (
      <div style={{ width: 380 }}>
        <div style={{ display: "flex", height: 14, borderRadius: 8, overflow: "hidden", gap: 3 }}>{seg.map(([l, v, c]) => <div key={l} style={{ width: `${v * p}%`, background: c, borderRadius: 4 }} />)}</div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: C.text2 }}>{seg.map(([l, v, c]) => <span key={l} style={{ color: c }}>{l} {v} %</span>)}</div>
      </div>
    );
  }
  if (kind === "geo") return <div style={{ display: "grid", gap: 8, justifyItems: "end" }}><Pill color={C.cyan} style={{ fontSize: 17 }}>Score GEO 71</Pill><Pill color={C.text2} style={{ fontSize: 15 }}>ChatGPT · Gemini · Perplexity</Pill></div>;
  if (kind === "tiers") return <div style={{ display: "flex", gap: 8 }}>{["Tier 1", "Tier 2", "Tier 3"].map((t, i) => <Pill key={t} color={[C.accentLight, C.primaryLight, C.text2][i]} style={{ fontSize: 16, padding: "6px 12px" }}>{t}</Pill>)}</div>;
  return <div style={{ display: "grid", gap: 8, justifyItems: "end" }}><Pill color={C.primaryLight} style={{ fontSize: 17 }}>Hasta 10.000 URLs</Pill><Pill color={C.text2} style={{ fontSize: 15 }}>Bing · IndexNow</Pill></div>;
};
const ToolCard: React.FC<{ tool: (typeof TOOLS)[number]; index: number }> = ({ tool, index }) => {
  const { t } = useT();
  const p = useSpr(tool.at, SPR.pop);
  const active = t >= tool.at && t < tool.at + 1.5;
  const glow = active ? clamp01(Math.min((t - tool.at) / 0.25, (tool.at + 1.5 - t) / 0.4)) : 0;
  const I = tool.icon;
  return (
    <div style={{ opacity: clamp01(p * 1.6), transform: `translateY(${(1 - p) * 50 + Math.sin((t + index) * 1.3) * 4}px) scale(${lerp(0.88, 1, p) + glow * 0.035})` }}>
      <Glass radius={30} glow={glow > 0.05 ? tool.color : undefined} style={{ width: 520, height: 272, padding: "30px 32px", boxSizing: "border-box", borderColor: glow > 0.05 ? `${tool.color}99` : C.line, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: `${tool.color}26`, border: `1px solid ${tool.color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}><I size={34} color={tool.color} strokeWidth={2.2} /></div>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, color: C.text, letterSpacing: -0.8, display: "flex", alignItems: "center", gap: 12 }}>{tool.n}{tool.tag && <Pill color={C.amber} style={{ fontSize: 13, padding: "3px 10px" }}>{tool.tag}</Pill>}</div>
            <div style={{ marginTop: 4, fontSize: 21, color: C.text2, fontWeight: 500 }}>{tool.d}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", minHeight: 92 }}><MiniVisual kind={tool.mini} color={tool.color} at={tool.at} /></div>
      </Glass>
    </div>
  );
};
export const Scene11: React.FC<SP> = ({ def }) => {
  const head = useSpr(0.4, SPR.soft);
  const cues: Cue[] = [
    { at: 0.4, sfx: "whooshSoft", vol: 0.4 },
    ...TOOLS.flatMap((tl) => [{ at: tl.at, sfx: "pop" as const, vol: 0.4 }, { at: tl.at + 0.02, sfx: "tick" as const, vol: 0.3 }]),
    { at: 8.2, sfx: "ding", vol: 0.35 },
  ];
  return (
    <SceneShell def={def} variant="b" cues={cues} badge={false}>
      <Orb x="50%" y="55%" size={1300} color={C.primary} opacity={0.3} drift={24} seed="more" />
      <AbsoluteFill style={{ fontFamily: FONT.sans }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontSize: 84, fontWeight: 800, letterSpacing: -3, color: C.text, opacity: clamp01(head * 1.5), transform: `translateY(${(1 - head) * 30}px)` }}>
          Y hay <span style={{ background: GRAD.text, WebkitBackgroundClip: "text", color: "transparent" }}>más</span>
        </div>
        <div style={{ position: "absolute", left: 144, top: 232, display: "grid", gridTemplateColumns: "repeat(3, 520px)", gap: 40 }}>
          {TOOLS.map((tl, i) => <ToolCard key={tl.n} tool={tl} index={i} />)}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* ───────────────────────── 12 · PLANES Y LLAMADA A LA ACCIÓN ───────────────────────── */
const PLANS: { n: string; price: string; feat: string; sub?: string; pop?: boolean }[] = [
  { n: "Free", price: "0 €", feat: "3 análisis gratis", sub: "Sin tarjeta" },
  { n: "Freelance", price: "19 €", feat: "15 análisis al mes" },
  { n: "Starter", price: "49 €", feat: "50 análisis al mes" },
  { n: "Pro", price: "99 €", feat: "150 análisis al mes", pop: true },
  { n: "Business", price: "199 €", feat: "400 análisis al mes", sub: "Equipo de hasta 5" },
];
const PLAN_AT = 4.3, FROM_AT = 6.0, PLANS_OUT = 7.7, CTA_AT = 8.1;
const PlanCard: React.FC<{ plan: (typeof PLANS)[number]; i: number }> = ({ plan, i }) => {
  const { t } = useT();
  const p = useSpr(PLAN_AT + i * 0.2, SPR.pop);
  const hi = i === 1 ? clamp01(Math.min((t - FROM_AT) / 0.3, (PLANS_OUT - 0.1 - t) / 0.3)) : 0;
  const pop = !!plan.pop;
  return (
    <div style={{ opacity: clamp01(p * 1.6), transform: `translateY(${(1 - p) * 60}px) scale(${lerp(0.9, 1, p) * (pop ? 1.05 : 1) * (1 + hi * 0.045)})`, position: "relative" }}>
      {pop && <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}><Pill color={C.amber} style={{ fontSize: 16, padding: "5px 16px", background: "#2A2108" }}><Star size={15} fill={C.amber} /> Más popular</Pill></div>}
      <Glass radius={28} glow={pop ? C.primary : hi > 0.05 ? C.green : undefined} style={{ width: 316, height: 330, padding: "34px 28px", boxSizing: "border-box", borderColor: pop ? `${C.primary}AA` : hi > 0.05 ? `${C.green}99` : C.line, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.text2, letterSpacing: -0.4 }}>{plan.n}</div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 68, fontWeight: 800, letterSpacing: -3, color: C.text, lineHeight: 1 }}>{plan.price}</span>
          {i > 0 && <span style={{ fontSize: 22, color: C.text3, fontWeight: 600 }}>/mes</span>}
        </div>
        <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 600, color: C.text }}><Check size={22} color={C.green} strokeWidth={3} />{plan.feat}</div>
          {plan.sub && <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 500, color: C.text2 }}><Check size={20} color={C.green} strokeWidth={3} />{plan.sub}</div>}
        </div>
      </Glass>
    </div>
  );
};
export const Scene12: React.FC<SP> = ({ def }) => {
  const { t } = useT();
  const title = useSpr(0.3, SPR.heavy);
  const up = useProg(PLAN_AT - 0.35, 0.9, EASE.inOut);
  const out = useProg(PLANS_OUT, 0.5, EASE.inOut);
  const cta = useSpr(CTA_AT, SPR.heavy), word = useSpr(CTA_AT + 0.25, SPR.soft), btn = useSpr(CTA_AT + 0.7, SPR.pop);
  const pulse = ((t - (CTA_AT + 1.4)) * 0.8) % 1;
  const chips = [useSpr(1.7, SPR.pop), useSpr(2.1, SPR.pop)];
  const cues: Cue[] = [
    { at: 0.3, sfx: "impact", vol: 0.5 }, { at: 1.7, sfx: "pop", vol: 0.4 }, { at: 2.1, sfx: "pop", vol: 0.4 },
    { at: PLAN_AT - 0.35, sfx: "whooshSoft", vol: 0.4 }, ...PLANS.map((_, i) => ({ at: PLAN_AT + i * 0.2, sfx: "pop" as const, vol: 0.32 })),
    { at: FROM_AT, sfx: "ding", vol: 0.45 }, { at: CTA_AT - 0.1, sfx: "riser", vol: 0.4 }, { at: CTA_AT + 0.25, sfx: "impact", vol: 0.55 }, { at: CTA_AT + 0.7, sfx: "pop", vol: 0.45 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues} badge={false}>
      <Orb x="50%" y="46%" size={1400} color={C.primary} opacity={0.34} drift={22} seed="cta" />
      <Camera keys={[{ t: 0, s: 1.04, y: 14 }, { t: 3, s: 1, y: 0 }]}>
        {/* A · Empieza gratis */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.sans, transform: `translateY(${-up * 310}px) scale(${lerp(1, 0.46, up)})`, opacity: 1 - out }}>
          <div style={{ fontSize: 176, fontWeight: 800, letterSpacing: -7, lineHeight: 1, color: C.text, transform: `scale(${lerp(0.82, 1, title)})`, opacity: clamp01(title * 1.6) }}>
            Empieza <span style={{ background: GRAD.text, WebkitBackgroundClip: "text", color: "transparent" }}>gratis</span>
          </div>
          <div style={{ marginTop: 34, display: "flex", gap: 22, opacity: 1 - up }}>
            {["3 análisis gratis", "Sin tarjeta"].map((c, i) => (
              <div key={c} style={{ opacity: clamp01(chips[i] * 1.6), transform: `translateY(${(1 - chips[i]) * 24}px) scale(${lerp(0.9, 1, chips[i])})` }}>
                <Pill color={C.green} style={{ fontSize: 34, padding: "12px 30px", gap: 12 }}><Check size={32} strokeWidth={3.2} />{c}</Pill>
              </div>
            ))}
          </div>
        </AbsoluteFill>
        {/* B · Planes */}
        <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1, 0.97, out)})`, fontFamily: FONT.sans }}>
          <div style={{ position: "absolute", left: 122, top: 392, display: "flex", gap: 24 }}>{PLANS.map((pl, i) => <PlanCard key={pl.n} plan={pl} i={i} />)}</div>
          <div style={{ position: "absolute", left: 122 + 316 + 24, top: 318, width: 316, textAlign: "center", opacity: clamp01(Math.min((t - FROM_AT) / 0.3, (PLANS_OUT - 0.1 - t) / 0.3)), transform: `translateY(${(1 - clamp01((t - FROM_AT) / 0.4)) * 14}px)` }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 999, background: "rgba(52,211,153,0.16)", border: `1px solid ${C.green}99`, color: C.green, fontSize: 24, fontWeight: 800 }}>Desde 19 €/mes</span>
          </div>
          <div style={{ position: "absolute", right: 122, top: 318, opacity: clamp01((t - PLAN_AT - 1.2) / 0.5) * (1 - out) }}><Pill color={C.text2} style={{ fontSize: 20 }}>Anual −20 %</Pill></div>
        </AbsoluteFill>
        {/* C · Llamada a la acción */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT.sans }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: clamp01(cta * 1.6), transform: `translateY(${(1 - cta) * -30}px) scale(${lerp(0.7, 1, cta)})` }}>
            <Img src={staticFile("brand/llmfy-icon-512.png")} style={{ width: 120, height: 120, borderRadius: 33, boxShadow: SHADOW.glow(C.primary) }} />
            <span style={{ fontSize: 100, fontWeight: 800, letterSpacing: -4, color: C.text }}>LLMFY</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 168, fontWeight: 800, letterSpacing: -7, lineHeight: 1, opacity: clamp01(word * 1.6), transform: `translateY(${(1 - word) * 36}px)`, background: GRAD.text, WebkitBackgroundClip: "text", color: "transparent" }}>llmfy.ai</div>
          <div style={{ marginTop: 40, position: "relative", opacity: clamp01(btn * 1.6), transform: `scale(${lerp(0.8, 1, btn)})` }}>
            {pulse >= 0 && pulse < 1 && t > CTA_AT + 1.4 && <div style={{ position: "absolute", inset: -10 - pulse * 40, borderRadius: 34, border: `3px solid ${C.primaryLight}`, opacity: (1 - pulse) * 0.7 }} />}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "26px 56px", borderRadius: 24, background: GRAD.brand, color: "#fff", fontSize: 44, fontWeight: 800, boxShadow: `0 24px 60px -14px ${C.primary}CC, inset 0 1px 0 rgba(255,255,255,0.35)` }}>Empieza Gratis</div>
          </div>
          <div style={{ marginTop: 26, fontSize: 36, fontWeight: 600, color: C.text2, opacity: clamp01((btn - 0.3) * 2) }}>Analiza tu web hoy</div>
        </AbsoluteFill>
      </Camera>
      <Sheen at={CTA_AT + 0.2} />
    </SceneShell>
  );
};
