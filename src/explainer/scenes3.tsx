// Escenas 7-9: Robots.txt Optimizer, AIO Semántico y medición (LLM Tracker + Prompt Tracker).
import React from "react";
import { ArrowRight, Bot, Check, Download, Eye, FileText, Layers, Minus, Play, Plus, Search, Target, Trophy } from "lucide-react";
import { SceneShell } from "./shell";
import type { SceneRuntime } from "./config";
import { Enter, EASE, lerp, SPR, useProg, useSpr, useT, useTypewriter, type CursorPoint } from "./motion";
import { AreaChart, Callout, Card, Code, Gauge, KPI, MetricBar, MiniSpark, Tag, U } from "./widgets";
import { CardHead, Results, Status } from "./results";
import { AppFlow, bump, defaultToolPath, ToolFlow, toolCues, type ToolSpec } from "./ToolFlow";
import { CONTENT, navPoint, PageHead } from "./product";
import type { Cue } from "./audio";
import { FONT } from "./theme";

type SP = { def: SceneRuntime };
const SIDE_X = 1500;
const SCROLL = 410;

/** Botón degradado de la interfaz (con pulsación). */
const GradBtn: React.FC<{ children: React.ReactNode; pressed?: number; width?: number; height?: number; ghost?: boolean; size?: number }> = ({ children, pressed = 0, width = 300, height = 58, ghost, size = 20 }) => (
  <div style={{
    width, height, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: size, fontWeight: 800, fontFamily: FONT.sans,
    background: ghost ? "#fff" : U.grad, color: ghost ? U.primaryDark : "#fff", border: ghost ? `2px solid ${U.primary100}` : "none",
    transform: `scale(${1 - pressed * 0.05})`, boxShadow: ghost ? undefined : "0 14px 28px -10px rgba(99,102,241,0.7)",
  }}>{children}</div>
);

/* ───────────────────────── 07 · ROBOTS.TXT OPTIMIZER ───────────────────────── */
const SPEC07: ToolSpec = {
  nav: "robots", open: "tec", prev: "inspect", route: "/robots-optimizer", crumb: "Robots.txt Optimizer",
  icon: Bot, title: "Robots.txt Optimizer", sub: "Optimiza tu robots.txt para bots de IA",
  form: {
    label: "Introduce la URL de tu sitio web", placeholder: "Introduce la URL de tu sitio web", url: "https://tu-web.com", button: "Analizar robots.txt", icon: Bot,
    helper: "Analiza y genera un robots.txt optimizado para maximizar tu visibilidad en ChatGPT, Perplexity, Claude y otros motores de búsqueda IA.",
  },
  modal: { title: "Analizando robots.txt…", steps: ["Descargando tu robots.txt", "Puntuando 17 bots de IA", "Generando la versión optimizada"], eta: "10-20 s" },
  times: { nav: 0.6, field: 1.1, type: 1.2, cps: 30, button: 2.2, modal: 2.3, modalDur: 1.0, results: 3.5 },
  credits: [146, 145],
};
const R7 = SPEC07.times.results;
const BOTS = [
  { n: "GPTBot", c: "OpenAI", imp: "Crítico", before: "Bloqueado" },
  { n: "ClaudeBot", c: "Anthropic", imp: "Crítico", before: "Sin regla" },
  { n: "PerplexityBot", c: "Perplexity", imp: "Crítico", before: "Bloqueado" },
  { n: "ChatGPT-User", c: "OpenAI", imp: "Alto", before: "Permitido" },
];
const FLIP = (i: number) => R7 + 2.4 + i * 0.35;
const BotStatus: React.FC<{ before: string; flipAt: number; changes: boolean }> = ({ before, flipAt, changes }) => {
  const p = useSpr(flipAt, SPR.pop);
  const { t } = useT();
  const after = changes && t >= flipAt;
  const tone = after || before === "Permitido" ? "green" : before === "Bloqueado" ? "red" : "slate";
  return <span style={{ display: "inline-block", transform: `scale(${after ? lerp(1.2, 1, p) : 1})` }}><Status tone={tone} size={15}>{after ? "Permitido" : before}</Status></span>;
};
const DIFF = [
  { t: "User-agent: GPTBot", kind: "dim" as const }, { t: "Disallow: /", kind: "del" as const }, { t: "Allow: /", kind: "add" as const },
  { t: "User-agent: PerplexityBot", kind: "dim" as const }, { t: "Disallow: /", kind: "del" as const }, { t: "Allow: /", kind: "add" as const },
];
const DL_AT = R7 + 5.4;
const DL_POS = { x: CONTENT.x + 40 + 640 + 20 + 176, y: CONTENT.y + 420 + (300 + 18 + 66 + 58 + 14 + 29) - SCROLL };

const RobotsResults: React.FC = () => {
  const { t } = useT();
  const g1 = useProg(R7 + 0.4, 1.0), g2 = useProg(R7 + 3.1, 1.2), dif = useProg(R7 + 3.9, 1.1, EASE.inOut);
  const press = Math.max(0, bump(t, DL_AT));
  return (
    <Results>
      <div style={{ display: "flex", gap: 20 }}>
        <Enter delay={R7 + 0.1} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 330, height: 300, padding: "22px 24px", boxSizing: "border-box" }}>
            <CardHead title="Puntuación LLMO" sub="Actual frente a optimizada" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <div style={{ textAlign: "center" }}>
                <Gauge value={38} progress={g1} size={112} stroke={12} from={U.red} to={U.amber} color="#B91C1C" sub="" />
                <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: U.text2 }}>Actual</div>
              </div>
              <ArrowRight size={30} color={U.text3} />
              <div style={{ textAlign: "center", opacity: Math.min(1, g2 * 3) }}>
                <Gauge value={94} progress={g2} size={112} stroke={12} from={U.green} to={U.teal} color="#047857" sub="" />
                <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: U.text2 }}>Optimizado</div>
              </div>
            </div>
            <div style={{ marginTop: 18, textAlign: "center", opacity: g2 }}><Tag tone="green" size={15}>+56 puntos</Tag></div>
          </Card>
        </Enter>
        <Enter delay={R7 + 0.3} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 662, height: 300, padding: "22px 24px", boxSizing: "border-box" }}>
            <CardHead title="Estado de Bots de IA" right={<Tag tone="slate" size={15}>17 bots analizados</Tag>} />
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1fr 1.2fr", fontSize: 14, fontWeight: 700, color: U.text3, padding: "0 6px 8px", borderBottom: `1px solid ${U.border}` }}>
              <span>Bot</span><span>Empresa</span><span>Impacto</span><span>Estado</span>
            </div>
            {BOTS.map((b, i) => (
              <Enter key={b.n} delay={R7 + 0.6 + i * 0.15} y={10} blur={3} cfg={SPR.snappy}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1fr 1.2fr", alignItems: "center", height: 44, padding: "0 6px", borderBottom: `1px solid ${U.borderSoft}`, fontSize: 17, fontWeight: 600, color: U.text }}>
                  <span style={{ fontWeight: 800 }}>{b.n}</span>
                  <span style={{ color: U.text2 }}>{b.c}</span>
                  <span><Status tone={b.imp === "Crítico" ? "red" : "amber"} size={14}>{b.imp}</Status></span>
                  <BotStatus before={b.before} flipAt={FLIP(i)} changes={b.before !== "Permitido"} />
                </div>
              </Enter>
            ))}
          </Card>
        </Enter>
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
        <Enter delay={R7 + 3.5} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 640, height: 262, padding: "20px 24px", boxSizing: "border-box" }}>
            <CardHead icon={FileText} tone="indigo" title="Cambios Realizados" sub="robots.txt actual → optimizado" />
            <Code lines={DIFF} reveal={dif} fontSize={15} width={592} />
          </Card>
        </Enter>
        <Enter delay={R7 + 3.7} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 352, height: 262, padding: "0 28px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
            <GradBtn ghost width={296} size={18}><FileText size={22} /> Copiar Optimizado</GradBtn>
            <GradBtn pressed={press} width={296} size={18}><Download size={22} /> Descargar robots.txt</GradBtn>
          </Card>
        </Enter>
      </div>
    </Results>
  );
};

export const Scene07: React.FC<SP> = ({ def }) => {
  const path: CursorPoint[] = [...defaultToolPath(SPEC07), { t: DL_AT, x: DL_POS.x, y: DL_POS.y, click: true }, { t: DL_AT + 0.9, x: DL_POS.x + 90, y: DL_POS.y + 50 }];
  const cues: Cue[] = [
    ...toolCues(SPEC07),
    { at: R7 + 0.3, sfx: "riser", vol: 0.3 }, { at: FLIP(0), sfx: "pop", vol: 0.4 }, { at: FLIP(1), sfx: "pop", vol: 0.4 }, { at: FLIP(2), sfx: "pop", vol: 0.4 },
    { at: R7 + 3.1, sfx: "ding", vol: 0.45 }, { at: DL_AT, sfx: "click", vol: 0.5 }, { at: DL_AT + 0.15, sfx: "ding", vol: 0.4 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <ToolFlow spec={SPEC07} scroll={SCROLL} path={path} extra={
        <>
          <Callout x={SIDE_X} y={300} delay={R7 + 0.7} icon={Bot} tone="indigo" title="Bots de IA" body="GPTBot, ClaudeBot, PerplexityBot…" w={380} tilt={1.5} />
          <Callout x={SIDE_X} y={470} delay={FLIP(0)} icon={Check} tone="green" title="Reglas corregidas" body="De bloqueado a permitido." w={380} tilt={-1.5} />
          <Callout x={SIDE_X} y={640} delay={R7 + 4.1} icon={Download} tone="violet" title="robots.txt optimizado" body="Listo para descargar y subir." w={380} tilt={1.5} />
        </>
      }>
        <RobotsResults />
      </ToolFlow>
    </SceneShell>
  );
};

/* ───────────────────────── 08 · AIO SEMÁNTICO ───────────────────────── */
const SPEC08: ToolSpec = {
  nav: "semantic", open: "ia", prev: "robots", route: "/semantic-relevance", crumb: "AIO Semántico",
  icon: Layers, title: "AIO Semántico SEO", sub: "Analiza la alineación semántica de tu contenido",
  form: { placeholder: "", url: "", button: "Analizar AIO Semántico" },
  modal: { title: "Analizando AIO semántico…", steps: ["Extrayendo tu URL y las de la competencia", "Comparando con embeddings de IA", "Detectando gaps y entidades"], eta: "45-60 s" },
  times: { nav: 0.7, field: 1.0, type: 1.1, button: 4.0, modal: 4.1, modalDur: 1.1, results: 5.4 },
  credits: [145, 144],
};
const T8 = SPEC08.times, R8 = T8.results, S8 = 570, RT8 = 590;
const COMPETITORS = ["competidor1.com/zapatillas-running", "competidor2.com/guia-running", "competidor3.es/comprar-zapatillas", "competidor4.com/running-top", "competidor5.es/mejores-zapatillas"];
const FieldBox: React.FC<{ value: string; placeholder?: string; focus?: boolean; caret?: boolean; h?: number }> = ({ value, placeholder, focus, caret, h = 46 }) => (
  <div style={{ height: h, borderRadius: 14, border: `2px solid ${focus ? U.primary : U.border}`, boxShadow: focus ? "0 0 0 5px rgba(99,102,241,0.16)" : undefined, display: "flex", alignItems: "center", padding: "0 16px", fontSize: 18, background: "#fff", whiteSpace: "nowrap", overflow: "hidden" }}>
    {value ? <span style={{ color: U.text, fontWeight: 600 }}>{value}</span> : <span style={{ color: U.text3 }}>{placeholder}</span>}
    {caret && <span style={{ width: 2, height: 24, background: U.primary, marginLeft: 3 }} />}
  </div>
);
const FieldLabel: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 700, color: U.text2, marginBottom: 10 }}><span>{children}</span>{right}</div>
);
const CompRow: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const ty = useTypewriter(text, delay + 0.12, 46);
  return <Enter delay={delay} y={10} blur={3} cfg={SPR.snappy} style={{ marginBottom: 8 }}><FieldBox value={ty.shown} placeholder="https://competidor.com/articulo" caret={ty.shown.length > 0 && !ty.done} h={42} /></Enter>;
};
const SemanticForm: React.FC = () => {
  const { t } = useT();
  const formIn = useProg(T8.nav + 0.3, 0.7);
  const url = useTypewriter("https://tu-web.com/guia-zapatillas-running", 1.0, 70);
  const press = Math.max(0, bump(t, T8.button));
  const KW = ["zapatillas running", "mejores zapatillas"];
  return (
    <div style={{ position: "absolute", left: 40, top: 140, width: 996, height: 414, padding: 24, boxSizing: "border-box", background: "#fff", border: `1px solid ${U.border}`, borderRadius: 22, boxShadow: "0 14px 34px -18px rgba(15,23,42,0.2)", fontFamily: FONT.sans, opacity: formIn, transform: `translateY(${(1 - formIn) * 18}px)` }}>
      <div style={{ display: "flex", gap: 28 }}>
        <div style={{ width: 430 }}>
          <FieldLabel>Tu URL a analizar</FieldLabel>
          <FieldBox value={url.shown} placeholder="https://tusitio.com/articulo" focus={t > 1.0 && t < 1.8} caret={url.shown.length > 0 && !url.done} h={52} />
          <div style={{ marginTop: 26 }}><FieldLabel right={<span style={{ color: U.text3, fontWeight: 600 }}>{t > 3.3 ? 2 : t > 3.0 ? 1 : 0}/5 keywords</span>}>Keywords target</FieldLabel></div>
          <div style={{ minHeight: 52, borderRadius: 14, border: `2px solid ${U.border}`, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", flexWrap: "wrap" }}>
            {KW.map((k, i) => <Enter key={k} delay={3.0 + i * 0.3} y={6} blur={0} cfg={SPR.pop}><Tag tone="indigo" size={16}>{k}</Tag></Enter>)}
            {t < 3.0 && <span style={{ color: U.text3, fontSize: 18 }}>seo, chatgpt, optimización...</span>}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <FieldLabel right={<span style={{ color: U.text3, fontWeight: 600 }}>hasta 5</span>}>URLs de competidores en SERP</FieldLabel>
          {COMPETITORS.map((c, i) => <CompRow key={c} text={c} delay={1.5 + i * 0.3} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, color: U.text2, fontWeight: 500 }}><span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${U.border}` }} /> Forzar re-análisis (ignorar caché)</span>
        <GradBtn pressed={press}><Layers size={22} /> Analizar AIO Semántico</GradBtn>
      </div>
    </div>
  );
};
const URLS8: [string, number][] = [["tu-web.com/guia-zapatillas", 74], ["competidor1.com/zapatillas-running", 82], ["competidor2.com/guia-running", 78], ["competidor3.es/comprar-zapatillas", 71], ["competidor4.com/running-top", 66], ["competidor5.es/mejores-zapatillas", 63]];
const GAPS: [string, string][] = [["Comparativa de drop y amortiguación", "Alto"], ["Guía de tallas y ajuste", "Alto"], ["Pisada pronadora o supinadora", "Medio"]];
const ENTS = ["Nike Pegasus", "drop", "pronación", "Asics Gel-Nimbus", "amortiguación"];
const SemanticResults: React.FC = () => {
  const p = useProg(R8 + 0.4, 1.2);
  const cov = useProg(R8 + 4.0, 1.2);
  return (
    <Results>
      <Enter delay={R8 + 0.1} y={30} cfg={SPR.soft} blur={6}>
        <Card style={{ padding: "20px 24px", height: 282, boxSizing: "border-box" }}>
          <CardHead icon={Layers} tone="indigo" title="Scores por URL" sub="Tu página frente a la competencia" right={<Status tone="amber" size={14}>Mejor URL Overall: competidor1.com</Status>} />
          <div style={{ display: "grid", gap: 7 }}>
            {URLS8.map(([u, v], i) => {
              const me = i === 0, best = i === 1;
              return (
                <div key={u} style={{ display: "flex", alignItems: "center", gap: 14, height: 26 }}>
                  <span style={{ width: 290, fontSize: 15, fontWeight: me ? 800 : 600, color: me ? U.primaryDark : U.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me ? "Tú · " : ""}{u}</span>
                  <div style={{ flex: 1, height: 12, borderRadius: 8, background: "#EDF0F7", overflow: "hidden" }}>
                    <div style={{ width: `${v * Math.min(1, Math.max(0, p * 1.4 - i * 0.07))}%`, height: "100%", borderRadius: 8, background: me ? U.grad : best ? `linear-gradient(90deg, ${U.amber}, #FBBF24)` : "#94A3B8" }} />
                  </div>
                  <span style={{ width: 66, textAlign: "right", fontSize: 16, fontWeight: 800, color: me ? U.primaryDark : U.text2, fontVariantNumeric: "tabular-nums", display: "inline-flex", justifyContent: "flex-end", gap: 6, alignItems: "center" }}>{best && <Trophy size={15} color={U.amber} />}{Math.round(v * p)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </Enter>
      <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
        <Enter delay={R8 + 2.1} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 510, height: 226, padding: "18px 24px", boxSizing: "border-box" }}>
            <CardHead title="Content Gaps" sub="Temas que cubren ellos y tú no" />
            <div style={{ display: "grid", gap: 8 }}>
              {GAPS.map(([g, imp], i) => (
                <Enter key={g} delay={R8 + 2.4 + i * 0.25} y={10} blur={3} cfg={SPR.snappy}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, height: 36, padding: "0 12px", borderRadius: 12, background: "#F8FAFC", border: `1px solid ${U.borderSoft}`, fontSize: 16, fontWeight: 700, color: U.text }}>
                    <Minus size={18} color={U.red} strokeWidth={3} /><span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g}</span><Status tone={imp === "Alto" ? "red" : "amber"} size={13}>{imp}</Status>
                  </div>
                </Enter>
              ))}
            </div>
          </Card>
        </Enter>
        <Enter delay={R8 + 3.8} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 482, height: 226, padding: "18px 24px", boxSizing: "border-box" }}>
            <CardHead title="Entidades SEO" sub="Entidades semánticas frente a la competencia" />
            <MetricBar label="Cobertura" value={58} progress={cov} color={U.violet} width={434} size={15} />
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: U.text3 }}>Entidades Faltantes</div>
            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ENTS.map((e, i) => <Enter key={e} delay={R8 + 4.3 + i * 0.12} y={8} blur={0} cfg={SPR.pop}><Tag tone="violet" size={14}><Plus size={13} strokeWidth={3} />{e}</Tag></Enter>)}
            </div>
          </Card>
        </Enter>
      </div>
    </Results>
  );
};

export const Scene08: React.FC<SP> = ({ def }) => {
  const nav = navPoint("ia", "semantic");
  const ox = CONTENT.x + 40, oy = CONTENT.y + 140;
  const path: CursorPoint[] = [
    { t: T8.nav - 1.1, x: 1420, y: 560 },
    { t: T8.nav, x: nav.x, y: nav.y, click: true },
    { t: 1.05, x: ox + 24 + 200, y: oy + 24 + 31 + 26, click: true },
    { t: 1.7, x: ox + 24 + 430 + 28 + 120, y: oy + 24 + 31 + 21, click: true },
    { t: 3.6, x: ox + 24 + 200, y: oy + 190 },
    { t: T8.button, x: ox + 996 - 24 - 150, y: oy + 414 - 24 - 29, click: true },
    { t: R8 + 0.6, x: 1340, y: 660 },
  ];
  const cues: Cue[] = [
    ...Array.from({ length: 5 }, (_, i) => ({ at: 1.5 + i * 0.3, sfx: "tick" as const, vol: 0.35 })),
    { at: T8.nav, sfx: "click", vol: 0.45 }, { at: 1.05, sfx: "click", vol: 0.4 }, { at: 1.7, sfx: "click", vol: 0.4 },
    { at: 3.0, sfx: "pop", vol: 0.35 }, { at: 3.3, sfx: "pop", vol: 0.35 }, { at: T8.button, sfx: "click", vol: 0.5 }, { at: R8 - 0.1, sfx: "whooshSoft", vol: 0.4 },
    { at: R8 + 0.4, sfx: "riser", vol: 0.3 }, { at: R8 + 1.6, sfx: "ding", vol: 0.4 }, { at: R8 + 2.4, sfx: "pop", vol: 0.35 }, { at: R8 + 4.3, sfx: "pop", vol: 0.35 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <ToolFlow spec={SPEC08} scroll={S8} resTop={RT8} formNode={<SemanticForm />} path={path} cam={[{ t: 0, s: 1, x: 0, y: 0 }]} extra={
        <>
          <Callout x={SIDE_X} y={320} delay={2.3} until={R8 + 0.2} icon={Layers} tone="indigo" title="Hasta 5 competidores" body="Las URLs que ya posicionan." w={380} tilt={1.5} />
          <Callout x={SIDE_X} y={560} delay={R8 + 2.4} icon={Minus} tone="red" title="Lagunas de contenido" body="Lo que ellos cubren y tú no." w={380} tilt={-1.5} />
          <Callout x={SIDE_X} y={700} delay={R8 + 4.1} icon={Target} tone="violet" title="Entidades que faltan" body="Para que la IA te entienda mejor." w={380} tilt={1.5} />
        </>
      }>
        <SemanticResults />
      </ToolFlow>
    </SceneShell>
  );
};

/* ───────────────────────── 09 · MEDIR: LLM TRACKER + PROMPT TRACKER ───────────────────────── */
const PART_B9 = 6.6;
const NAV_A = 0.9, CHECK_AT = 2.3, RES_A = 3.3;
const NAV_B = PART_B9 + 0.35, RUN_AT = PART_B9 + 2.3;
const TRACKER_BTN = { x: CONTENT.x + 40 + 996 - 14 - 130, y: CONTENT.y + 140 + 42 };
const RUN_BTN = { x: CONTENT.x + 40 + 996 - 100, y: CONTENT.y + 128 + 26 };

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = "#fff" }) => {
  const { frame } = useT();
  return <span style={{ width: size, height: size, borderRadius: "50%", border: `3px solid ${color}55`, borderTopColor: color, display: "inline-block", transform: `rotate(${frame * 12}deg)` }} />;
};

const TrackerPage: React.FC = () => {
  const { t } = useT();
  const headIn = useProg(NAV_A + 0.15, 0.6), barIn = useProg(NAV_A + 0.35, 0.6);
  const checking = t >= CHECK_AT && t < RES_A;
  const press = Math.max(0, bump(t, CHECK_AT));
  const k = useProg(RES_A + 0.1, 1.4), ch = useProg(RES_A + 0.6, 1.5, EASE.inOut), pl = useProg(RES_A + 1.1, 1.0);
  const showRes = t >= RES_A - 0.2;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PageHead icon={Eye} title="Rastreador de Visibilidad LLM" sub="Monitoriza cómo Google AI Overviews y ChatGPT mencionan tu dominio" crumb="LLM Tracker" opacity={headIn} badge={<Tag tone="amber" size={13}>BETA</Tag>} />
      <div style={{ position: "absolute", left: 40, top: 140, width: 996, height: 84, boxSizing: "border-box", padding: "0 14px 0 24px", background: "#fff", border: `1px solid ${U.border}`, borderRadius: 22, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 14px 34px -18px rgba(15,23,42,0.2)", fontFamily: FONT.sans, opacity: barIn, transform: `translateY(${(1 - barIn) * 14}px)` }}>
        <Search size={24} color={U.text3} /><span style={{ fontSize: 22, fontWeight: 700, color: U.text }}>tu-web.com</span>
        <Tag tone="slate" size={14}>España · es</Tag>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 15, color: U.text3, fontWeight: 600 }}>3 créditos por comprobación</span>
        <GradBtn pressed={press} width={260} height={56} size={19}>{checking ? <><Spinner size={20} /> Comprobando…</> : <><Play size={20} /> Comprobar Ahora</>}</GradBtn>
      </div>
      {showRes && (
        <>
          <div style={{ position: "absolute", left: 40, top: 244, display: "flex", gap: 20 }}>
            <Enter delay={RES_A} y={24} blur={4} cfg={SPR.soft}><KPI label="Menciones Totales" value={String(Math.round(128 * k))} icon={Eye} accent={U.primary} delta="+12 %" spark={[40, 52, 48, 66, 74, 92, 128]} progress={k} w={317} /></Enter>
            <Enter delay={RES_A + 0.15} y={24} blur={4} cfg={SPR.soft}><KPI label="Citaciones" value={String(Math.round(46 * k))} icon={Check} accent={U.teal} delta="+5" spark={[12, 18, 15, 24, 30, 38, 46]} progress={k} w={317} /></Enter>
            <Enter delay={RES_A + 0.3} y={24} blur={4} cfg={SPR.soft}><KPI label="Posición Media" value="3,2" icon={Target} accent={U.violet} delta="−0,6" spark={[5.2, 4.8, 4.6, 4.1, 3.8, 3.5, 3.2]} progress={k} w={317} /></Enter>
          </div>
          <Enter delay={RES_A + 0.5} y={26} blur={4} cfg={SPR.soft}>
            <Card style={{ position: "absolute", left: 40, top: 426, width: 600, height: 188, boxSizing: "border-box", padding: "16px 22px 12px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: U.text, marginBottom: 4 }}>Evolución de Menciones</div>
              <AreaChart points={[40, 52, 48, 66, 74, 92, 128]} progress={ch} w={556} h={128} labels={["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Hoy"]} />
            </Card>
          </Enter>
          <Enter delay={RES_A + 0.9} y={26} blur={4} cfg={SPR.soft}>
            <Card style={{ position: "absolute", left: 660, top: 426, width: 376, height: 188, boxSizing: "border-box", padding: "16px 22px" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: U.text, marginBottom: 12 }}>Por plataforma</div>
              <MetricBar label="Google AI Overviews" value={84} progress={pl} color={U.blue} width={332} suffix=" menciones" size={15} />
              <div style={{ height: 12 }} />
              <MetricBar label="ChatGPT" value={44} progress={pl} color={U.green} width={332} suffix=" menciones" size={15} />
              <div style={{ marginTop: 10, fontSize: 13, color: U.text3, fontWeight: 600 }}>ChatGPT: datos de EE. UU. en inglés</div>
            </Card>
          </Enter>
        </>
      )}
    </div>
  );
};

const PROMPTS: { q: string; g: string | null; c: boolean; p: boolean; trend: number[] }[] = [
  { q: "mejores zapatillas de running para principiantes", g: "#3", c: true, p: false, trend: [8, 7, 6, 5, 4, 3] },
  { q: "zapatillas running con amortiguación", g: "#5", c: false, p: true, trend: [9, 8, 8, 7, 6, 5] },
  { q: "dónde comprar zapatillas de running online", g: "#2", c: true, p: true, trend: [6, 5, 4, 4, 3, 2] },
  { q: "qué drop elegir en zapatillas de running", g: null, c: false, p: true, trend: [12, 12, 10, 9, 8, 6] },
];
const Dash: React.FC = () => <span style={{ color: U.text3, fontWeight: 700 }}>—</span>;
const CellResult: React.FC<{ at: number; ok: boolean; label: string }> = ({ at, ok, label }) => {
  const { t } = useT();
  const p = useSpr(at + 0.35, SPR.pop);
  if (t < at) return <Dash />;
  if (t < at + 0.35) return <Spinner size={18} color={U.primary} />;
  return <span style={{ display: "inline-block", transform: `scale(${lerp(0.7, 1, p)})`, opacity: Math.min(1, p * 2) }}>{ok ? <Status tone="green" size={14}>{label}</Status> : <Status tone="slate" size={14}>No citado</Status>}</span>;
};
const TrendCell: React.FC<{ at: number; points: number[] }> = ({ at, points }) => {
  const p = useProg(at, 0.9);
  const { t } = useT();
  if (t < at) return <Dash />;
  return <MiniSpark points={points.map((v) => 14 - v)} progress={p} color={U.green} w={90} h={34} />;
};
const PromptPage: React.FC = () => {
  const { t } = useT();
  const headIn = useProg(NAV_B + 0.15, 0.6), barIn = useProg(NAV_B + 0.35, 0.6);
  const press = Math.max(0, bump(t, RUN_AT));
  const running = t >= RUN_AT;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PageHead icon={Target} title="Prompt Tracker" sub="Sigue cómo responden las IAs a tus prompts" crumb="Prompt Tracker" opacity={headIn} badge={<Tag tone="green" size={13}>NEW</Tag>} />
      <div style={{ position: "absolute", left: 40, top: 128, width: 996, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.sans, opacity: barIn }}>
        <GradBtn ghost width={190} height={52} size={17}><Plus size={20} /> Añadir Prompt</GradBtn>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 15, color: U.text3, fontWeight: 600 }}>1 crédito por prompt</span>
        <GradBtn pressed={press} width={200} height={52} size={17}><Play size={19} /> Ejecutar Todos</GradBtn>
      </div>
      <Card style={{ position: "absolute", left: 40, top: 200, width: 996, boxSizing: "border-box", padding: "10px 24px 14px", opacity: barIn }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.9fr 0.9fr 1.1fr 1.2fr 0.9fr", fontSize: 14, fontWeight: 700, color: U.text3, padding: "10px 6px", borderBottom: `1px solid ${U.border}` }}>
          <span>Prompt</span><span>Google</span><span>ChatGPT</span><span>Perplexity</span><span>Tendencia</span>
        </div>
        {PROMPTS.map((r, i) => {
          const at = RUN_AT + 0.3 + i * 0.5;
          return (
            <Enter key={r.q} delay={PART_B9 + 1.1 + i * 0.18} y={10} blur={3} cfg={SPR.snappy}>
              <div style={{ display: "grid", gridTemplateColumns: "2.9fr 0.9fr 1.1fr 1.2fr 0.9fr", alignItems: "center", height: 66, padding: "0 6px", borderBottom: i < 3 ? `1px solid ${U.borderSoft}` : "none", fontSize: 17, fontWeight: 600, color: U.text }}>
                <span style={{ paddingRight: 14, lineHeight: 1.3 }}>{r.q}</span>
                <span>{running ? <CellResult at={at} ok={r.g !== null} label={r.g ?? ""} /> : <Dash />}</span>
                <span>{running ? <CellResult at={at + 0.15} ok={r.c} label="Citado" /> : <Dash />}</span>
                <span>{running ? <CellResult at={at + 0.3} ok={r.p} label="Citado" /> : <Dash />}</span>
                <span>{running ? <TrendCell at={at + 0.8} points={r.trend} /> : <Dash />}</span>
              </div>
            </Enter>
          );
        })}
      </Card>
    </div>
  );
};

export const Scene09: React.FC<SP> = ({ def }) => {
  const { t } = useT();
  const inB = t >= PART_B9;
  const aVis = 1 - useProg(PART_B9 + 0.05, 0.3, EASE.inOut), bVis = useProg(PART_B9 + 0.25, 0.4);
  const navT = navPoint("track", "tracker"), navP = navPoint("track", "prompt");
  const path: CursorPoint[] = [
    { t: NAV_A - 1.1, x: 1420, y: 560 }, { t: NAV_A, x: navT.x, y: navT.y, click: true },
    { t: CHECK_AT, x: TRACKER_BTN.x, y: TRACKER_BTN.y, click: true }, { t: RES_A + 1.6, x: 1340, y: 700 },
    { t: NAV_B, x: navP.x, y: navP.y, click: true }, { t: RUN_AT, x: RUN_BTN.x, y: RUN_BTN.y, click: true }, { t: RUN_AT + 1.5, x: 1340, y: 720 },
  ];
  const credits = t < CHECK_AT + 0.05 ? "144 créditos" : t < RUN_AT + 0.05 ? "141 créditos" : "137 créditos";
  const pulse = Math.max(0, 1 - Math.abs(t - (CHECK_AT + 0.1)) / 0.35, 1 - Math.abs(t - (RUN_AT + 0.1)) / 0.35);
  const cues: Cue[] = [
    { at: NAV_A, sfx: "click", vol: 0.45 }, { at: CHECK_AT, sfx: "click", vol: 0.5 }, { at: RES_A - 0.1, sfx: "whooshSoft", vol: 0.4 }, { at: RES_A + 0.3, sfx: "riser", vol: 0.3 }, { at: RES_A + 1.5, sfx: "ding", vol: 0.4 },
    { at: NAV_B, sfx: "click", vol: 0.45 }, { at: RUN_AT, sfx: "click", vol: 0.5 },
    ...Array.from({ length: 4 }, (_, i) => ({ at: RUN_AT + 0.65 + i * 0.5, sfx: "pop" as const, vol: 0.32 })), { at: RUN_AT + 2.8, sfx: "ding", vol: 0.4 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <AppFlow
        open="track" active={inB ? "prompt" : "tracker"} prev={inB ? "tracker" : "overview"} switchAt={inB ? NAV_B + 0.05 : NAV_A + 0.05} route={inB ? "/prompt-tracker" : "/llmo-tracker"}
        path={path} credits={credits} creditPulse={pulse}
        extra={
          <>
            <Callout x={SIDE_X} y={300} delay={RES_A + 0.8} until={PART_B9 + 1.0} icon={Eye} tone="indigo" title="LLM Tracker" body="Menciones en Google AI Overviews y ChatGPT." w={380} tilt={1.5} />
            <Callout x={SIDE_X} y={470} delay={PART_B9 + 1.2} icon={Target} tone="green" title="Prompt Tracker" body="Tus prompts en Google, ChatGPT y Perplexity." w={380} tilt={-1.5} />
          </>
        }
      >
        <div style={{ position: "absolute", inset: 0, opacity: aVis }}><TrackerPage /></div>
        <div style={{ position: "absolute", inset: 0, opacity: bVis }}>{t >= PART_B9 && <PromptPage />}</div>
      </AppFlow>
    </SceneShell>
  );
};
