// Escenas 4-6: Optimización LLM, E-E-A-T + Schema Scan y LLM Inspect (los pasos de análisis de una URL).
import React from "react";
import { Sequence } from "remotion";
import { AlertTriangle, Award, Braces, CheckCircle2, Code2, Gauge as GaugeIcon, Layers, ListChecks, ScanSearch, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { SceneShell } from "./shell";
import type { SceneRuntime } from "./config";
import { Enter, EASE, SPR, useProg, useT, clamp01 } from "./motion";
import { Callout, Card, Gauge, MetricBar, Tabs, Tag, U, Code } from "./widgets";
import { CardHead, Panel, Radar, Results, SignalChip, Status, StepDot } from "./results";
import { ToolFlow, toolCues, type ToolSpec } from "./ToolFlow";
import { navPoint } from "./product";
import type { Cue } from "./audio";
import { FONT } from "./theme";

type SP = { def: SceneRuntime };
const SIDE_X = 1500; // columna de avisos a la derecha de la ventana

/* ───────────────────────── 04 · OPTIMIZACIÓN LLM ───────────────────────── */
const SPEC04: ToolSpec = {
  nav: "llm", open: "ia", prev: "overview", route: "/llm-optimization", crumb: "LLM Optimization",
  icon: Sparkles, title: "LLM Optimization", sub: "Optimiza tu contenido para ser citado por ChatGPT, Perplexity y Google AI Overviews",
  form: { placeholder: "https://ejemplo.com/articulo", url: "https://tu-web.com/guia-zapatillas-running", button: "Analizar Citabilidad" },
  modal: { title: "Analizando con IA", steps: ["Leyendo el contenido de tu página", "Evaluando los 12 factores de citabilidad", "Preparando tu plan de optimización"], eta: "30-45 s" },
  times: { nav: 1.9, field: 2.7, type: 2.9, cps: 24, button: 5.3, modal: 5.45, modalDur: 1.55, results: 7.1 },
  credits: [150, 149],
};
const FACTORS: [string, number][] = [
  ["Answer Engine", 78], ["Entidades", 71], ["Datos Cuantitativos", 54], ["Multi-Perspectiva", 66],
  ["Calidad de Citas", 48], ["Consultas Conv.", 82], ["Multimedia", 60], ["Actualización", 74],
  ["People-First", 69], ["Estructura", 85], ["Riqueza Semántica", 63], ["Accionabilidad", 58],
];
const factorColor = (v: number) => (v >= 70 ? U.green : v >= 55 ? U.amber : U.red);
const FactorBar: React.FC<{ name: string; value: number; delay: number }> = ({ name, value, delay }) => (
  <MetricBar label={name} value={value} progress={useProg(delay, 0.9)} color={factorColor(value)} width={192} size={13.5} />
);

const LlmResults: React.FC = () => {
  const T0 = SPEC04.times.results;
  const g = useProg(T0 + 0.35, 1.5);
  const QW = ["Párrafo introductorio breve con la respuesta directa", "H2 con la definición del concepto principal", "Definición clara y concisa en 2-3 frases", "Párrafo de ampliación con más detalle"];
  return (
    <Results>
      <div style={{ display: "flex", gap: 20 }}>
        <Enter delay={T0 + 0.1} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 320, height: 314, padding: "22px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ alignSelf: "stretch" }}><CardHead title="Citabilidad LLM" /></div>
            <Gauge value={68} progress={g} size={172} stroke={17} />
            <div style={{ marginTop: 18 }}><Status tone="green" size={17}>Buena</Status></div>
            <div style={{ marginTop: 10, fontSize: 14.5, color: U.text2, fontWeight: 500, textAlign: "center", lineHeight: 1.35 }}>Tu contenido tiene buenas bases para citación.</div>
          </Card>
        </Enter>
        <Enter delay={T0 + 2.6} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 672, height: 314, padding: "22px 24px", boxSizing: "border-box" }}>
            <CardHead title="Análisis por factor" right={<Tag tone="indigo" size={15}>12 factores</Tag>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 192px)", gap: "14px 22px" }}>
              {FACTORS.map(([n, v], i) => <FactorBar key={n} name={n} value={v} delay={T0 + 2.8 + i * 0.1} />)}
            </div>
          </Card>
        </Enter>
      </div>
      <Enter delay={T0 + 3.8} y={30} cfg={SPR.soft} blur={6}>
        <Card style={{ marginTop: 18, padding: "20px 24px" }}>
          <CardHead icon={Zap} tone="amber" title="Quick Win — Google AI Overviews" sub="Responde a la intención de búsqueda al inicio del contenido" right={<Status tone="amber">Impacto Alto</Status>} />
          <div style={{ display: "flex", gap: 12 }}>
            {QW.map((q, i) => (
              <Enter key={q} delay={T0 + 4.1 + i * 0.22} y={14} blur={4} cfg={SPR.snappy} style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", borderRadius: 14, background: U.amber50, border: "1px solid #FDE68A", height: 92, boxSizing: "border-box" }}>
                  <StepDot n={i + 1} tone="amber" />
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#78350F", lineHeight: 1.35 }}>{q}</span>
                </div>
              </Enter>
            ))}
          </div>
        </Card>
      </Enter>
    </Results>
  );
};

export const Scene04: React.FC<SP> = ({ def }) => {
  const T0 = SPEC04.times.results;
  const cues: Cue[] = [
    ...toolCues(SPEC04),
    { at: T0 + 0.3, sfx: "riser", vol: 0.32 }, { at: T0 + 1.85, sfx: "ding", vol: 0.45 },
    { at: T0 + 0.5, sfx: "pop", vol: 0.35 }, { at: T0 + 2.7, sfx: "pop", vol: 0.35 }, { at: T0 + 3.9, sfx: "pop", vol: 0.35 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <ToolFlow spec={SPEC04} scroll={410} extra={
        <>
          <Callout x={SIDE_X} y={290} delay={T0 + 0.7} icon={GaugeIcon} tone="indigo" title="Score de 0 a 100" body="Probabilidad de que la IA te cite." w={380} tilt={1.5} />
          <Callout x={SIDE_X} y={450} delay={T0 + 2.8} icon={ListChecks} tone="violet" title="12 factores" body="Cada uno con su puntuación." w={380} tilt={-1.5} />
          <Callout x={SIDE_X} y={610} delay={T0 + 4.0} icon={Zap} tone="amber" title="Plan con quick wins" body="Qué cambiar primero." w={380} tilt={1.5} />
        </>
      }>
        <LlmResults />
      </ToolFlow>
    </SceneShell>
  );
};

/* ───────────────────────── 05 · E-E-A-T + SCHEMA SCAN ───────────────────────── */
const SPEC05A: ToolSpec = {
  nav: "eeat", open: "ia", prev: "llm", route: "/eeat-audit", crumb: "E-E-A-T Audit",
  icon: ShieldCheck, title: "E-E-A-T Audit", sub: "Analiza Experience, Expertise, Authority y Trust de tu contenido",
  form: { placeholder: "https://ejemplo.com/tu-articulo", url: "https://tu-web.com/guia-zapatillas-running", button: "Analizar E-E-A-T" },
  modal: { title: "Analizando con IA", steps: ["Leyendo la página", "Evaluando los 4 pilares", "Detectando señales técnicas"], eta: "20-30 s" },
  times: { nav: 0.7, field: 1.2, type: 1.3, cps: 70, button: 2.0, modal: 2.1, modalDur: 0.7, results: 2.9 },
  credits: [149, 148],
};
const PART_B = 5.5; // instante (de diseño) en que arranca Schema Scan
const SPEC05B: ToolSpec = {
  nav: "schema", open: "tec", prev: "eeat", route: "/schema-scan", crumb: "Schema Scan",
  icon: Code2, title: "Schema Scan", sub: "Detecta, valida y optimiza Schema.org para SEO y citabilidad en IA",
  form: { label: "URL a escanear", placeholder: "ejemplo.com o https://ejemplo.com", url: "https://tu-web.com/guia-zapatillas-running", button: "Escanear", icon: ScanSearch },
  modal: { title: "Escaneando datos estructurados…", steps: ["Descargando la página", "Detectando schemas", "Validando propiedades"], eta: "15-25 s" },
  times: { nav: 0.6, field: 1.1, type: 1.2, cps: 70, button: 1.8, modal: 1.9, modalDur: 0.7, results: 2.6 },
  credits: [148, 147],
};

const EeatResults: React.FC = () => {
  const T0 = SPEC05A.times.results;
  const g = useProg(T0 + 0.3, 1.3), r = useProg(T0 + 0.7, 1.3);
  const SIGNALS: [boolean, string][] = [[true, "HTTPS activo"], [true, "Contacto visible"], [true, "Política de privacidad"], [true, "Términos de servicio"], [false, "Redes sociales"], [true, "Referencias externas"]];
  return (
    <Results>
      <div style={{ display: "flex", gap: 20 }}>
        <Enter delay={T0 + 0.1} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 320, height: 300, padding: "22px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ alignSelf: "stretch" }}><CardHead title="Score E-E-A-T" /></div>
            <Gauge value={76} progress={g} size={160} stroke={15} from="#8B5CF6" to="#6366F1" />
            <div style={{ marginTop: 14 }}><Status tone="green" size={16}>Buen E-E-A-T</Status></div>
          </Card>
        </Enter>
        <Enter delay={T0 + 0.5} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 672, height: 300, padding: "22px 24px", boxSizing: "border-box" }}>
            <CardHead title="Desglose por Categoría" sub="Visualización de cada pilar E-E-A-T" />
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: -4 }}>
              <div style={{ marginLeft: -4 }}><Radar values={[70, 82, 64, 88]} labels={["Experiencia", "Pericia", "Autoridad", "Confianza"]} progress={r} size={132} /></div>
              <div style={{ display: "grid", gap: 14 }}>
                <MetricBar label="Experiencia" value={70} progress={r} color={U.primary} width={220} suffix="" />
                <MetricBar label="Pericia" value={82} progress={r} color={U.teal} width={220} suffix="" />
                <MetricBar label="Autoridad" value={64} progress={r} color={U.amber} width={220} suffix="" />
                <MetricBar label="Confianza" value={88} progress={r} color={U.green} width={220} suffix="" />
              </div>
            </div>
          </Card>
        </Enter>
      </div>
      <Enter delay={T0 + 1.5} y={30} cfg={SPR.soft} blur={6}>
        <Card style={{ marginTop: 18, padding: "20px 24px" }}>
          <CardHead title="Señales Técnicas Detectadas" sub="Solo checks automáticos" right={<Tag tone="green" size={15}>5 de 6</Tag>} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SIGNALS.map(([ok, label], i) => <SignalChip key={label} ok={ok} delay={T0 + 1.7 + i * 0.1}>{label}</SignalChip>)}
          </div>
        </Card>
      </Enter>
    </Results>
  );
};

const SCHEMA_LINES = [
  { t: "{" },
  { t: '  "@context": "https://schema.org",', kind: "key" as const },
  { t: '  "@type": "Article",', kind: "key" as const },
  { t: '  "headline": "Guía de zapatillas de running",' },
  { t: '  "author": { "@type": "Person", "name": "Ana López" },' },
  { t: '  "datePublished": "2026-09-12",' },
  { t: '  "dateModified": "2026-10-01",', kind: "add" as const },
  { t: '  "image": "https://tu-web.com/img/guia.jpg"' },
  { t: "}" },
];
const STAT_BG = { indigo: U.primary50, green: U.green50, amber: U.amber50, red: U.red50, violet: U.violet50 } as const;
const STAT_FG = { indigo: U.primaryDark, green: "#047857", amber: "#B45309", red: "#B91C1C", violet: "#6D28D9" } as const;
const SchemaResults: React.FC = () => {
  const T0 = SPEC05B.times.results;
  const g = useProg(T0 + 0.3, 1.2), c = useProg(T0 + 1.0, 1.4, EASE.inOut);
  const STATS: [string, number, keyof typeof STAT_BG][] = [["Detectados", 4, "indigo"], ["Válidos", 3, "green"], ["Warnings", 1, "amber"], ["Errores", 0, "red"], ["IA Ready", 3, "violet"]];
  return (
    <Results>
      <div style={{ display: "flex", gap: 20 }}>
        <Enter delay={T0 + 0.1} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 320, height: 196, padding: "20px 24px", boxSizing: "border-box" }}>
            <CardHead title="Puntuación General" />
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Gauge value={84} progress={g} size={112} stroke={12} from="#14B8A6" to="#6366F1" sub="" />
              <div><Status tone="green" size={15}>Excelente</Status><div style={{ marginTop: 8, fontSize: 14, color: U.text2, fontWeight: 600 }}>Tipo detectado:<br />Blog / Artículo</div></div>
            </div>
          </Card>
        </Enter>
        <Enter delay={T0 + 0.4} y={30} cfg={SPR.soft} blur={6}>
          <Card style={{ width: 672, height: 196, padding: "20px 24px", boxSizing: "border-box" }}>
            <CardHead title="Schemas encontrados" sub="Completitud promedio 87 %" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
              {STATS.map(([l, v, tone], i) => (
                <Enter key={l} delay={T0 + 0.6 + i * 0.1} y={14} blur={4} cfg={SPR.snappy}>
                  <div style={{ padding: "14px 10px", borderRadius: 16, background: STAT_BG[tone], textAlign: "center" }}>
                    <div style={{ fontSize: 40, fontWeight: 800, color: STAT_FG[tone], lineHeight: 1 }}>{v}</div>
                    <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: U.text2 }}>{l}</div>
                  </div>
                </Enter>
              ))}
            </div>
          </Card>
        </Enter>
      </div>
      <Enter delay={T0 + 0.9} y={30} cfg={SPR.soft} blur={6}>
        <Card style={{ marginTop: 18, padding: "20px 24px" }}>
          <CardHead icon={Braces} tone="indigo" title="Código JSON-LD Completo" sub="Versión corregida, lista para pegar" right={<div style={{ display: "flex", gap: 10 }}><Tag tone="slate" size={15}>Copiar</Tag><Tag tone="indigo" size={15}>Descargar JSON</Tag></div>} />
          <Code lines={SCHEMA_LINES} reveal={c} fontSize={16} width={962} />
        </Card>
      </Enter>
    </Results>
  );
};

export const Scene05: React.FC<SP> = ({ def }) => {
  const { k, fps } = useT();
  const offB = Math.round(PART_B * k * fps);
  const a = 1 - useProg(PART_B + 0.1, 0.45, EASE.inOut);
  const b = useProg(PART_B, 0.4, EASE.out);
  const A0 = SPEC05A.times.results, B0 = SPEC05B.times.results;
  const cues: Cue[] = [
    ...toolCues(SPEC05A),
    { at: A0 + 0.3, sfx: "riser", vol: 0.3 }, { at: A0 + 1.5, sfx: "ding", vol: 0.45 },
    ...toolCues(SPEC05B).map((c) => ({ ...c, at: c.at + PART_B })),
    { at: PART_B + B0 + 0.3, sfx: "pop", vol: 0.35 }, { at: PART_B + B0 + 1.4, sfx: "ding", vol: 0.4 },
  ];
  const eeat = navPoint("ia", "eeat");
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <div style={{ position: "absolute", inset: 0, opacity: a }}>
        <ToolFlow spec={SPEC05A} scroll={410} extra={
          <Callout x={SIDE_X} y={300} delay={A0 + 0.5} icon={Award} tone="indigo" title="4 pilares" body="Experiencia, pericia, autoridad y confianza." w={380} tilt={1.5} />
        }>
          <EeatResults />
        </ToolFlow>
      </div>
      <Sequence from={offB} layout="none">
        <div style={{ position: "absolute", inset: 0, opacity: b }}>
          <ToolFlow spec={SPEC05B} scroll={410} startAt={eeat} extra={
            <Callout x={SIDE_X} y={300} delay={B0 + 0.5} icon={Layers} tone="teal" title="Datos estructurados" body="Detecta, valida y corrige tu JSON-LD." w={380} tilt={-1.5} />
          }>
            <SchemaResults />
          </ToolFlow>
        </div>
      </Sequence>
    </SceneShell>
  );
};

/* ───────────────────────── 06 · LLM INSPECT ───────────────────────── */
const SPEC06: ToolSpec = {
  nav: "inspect", open: "tec", prev: "schema", route: "/llm-inspect", crumb: "LLM Inspect",
  icon: ScanSearch, title: "LLM Inspect", sub: "Como la Inspección de Google Search Console, pero para IA",
  form: { label: "URL a inspeccionar", placeholder: "https://tudominio.com/pagina", url: "https://tu-web.com/guia-zapatillas-running", button: "Inspeccionar URL" },
  modal: { title: "Inspeccionando…", steps: ["Comprobando robots.txt y el acceso por bot…", "Leyendo el HTML sin JavaScript…", "Renderizando con Chromium…", "Extrayendo y troceando el contenido…"], eta: "8-15 s" },
  times: { nav: 0.8, field: 1.5, type: 1.7, cps: 36, button: 3.1, modal: 3.25, modalDur: 1.35, results: 4.7 },
  credits: [147, 146],
};
const TABS = ["Resumen", "URL en la IA", "Vista IA", "Sin JavaScript", "Fragmentos", "Estructura", "Agentes"];
const TAB_AT: [number, number][] = [[0, 0], [2, 5.3], [3, 6.9], [5, 8.4]]; // [índice de pestaña, instante en que se pulsa]
const RB = SPEC06.times.results;

const AccessPanel: React.FC = () => (
  <Card style={{ padding: "20px 24px" }}>
    <CardHead title="Acceso por bot" sub="GPTBot, ClaudeBot y PerplexityBot leen el HTML del servidor" />
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.5fr 1fr 0.7fr 0.8fr", fontSize: 14, fontWeight: 700, color: U.text3, padding: "0 6px 8px", borderBottom: `1px solid ${U.border}` }}>
      <span>Bot</span><span>Tipo</span><span>robots.txt</span><span>HTTP</span><span>Palabras</span>
    </div>
    {[["GPTBot", "Búsqueda / usuario"], ["ClaudeBot", "Búsqueda / usuario"], ["PerplexityBot", "Búsqueda / usuario"]].map(([b, r], i) => (
      <Enter key={b} delay={RB + 0.5 + i * 0.15} y={10} blur={3} cfg={SPR.snappy}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.5fr 1fr 0.7fr 0.8fr", alignItems: "center", padding: "12px 6px", borderBottom: `1px solid ${U.borderSoft}`, fontSize: 17, fontWeight: 600, color: U.text }}>
          <span style={{ fontWeight: 800 }}>{b}</span><span style={{ color: U.text2 }}>{r}</span><span><Status tone="green" size={14}>Permitido</Status></span><span>200</span><span style={{ fontVariantNumeric: "tabular-nums" }}>734</span>
        </div>
      </Enter>
    ))}
  </Card>
);

const AiViewPanel: React.FC<{ from: number }> = ({ from }) => {
  const reveal = useProg(from + 0.2, 1.3, EASE.inOut);
  const MD = [
    { t: "# Guía de zapatillas de running" },
    { t: "## Cómo elegir tus zapatillas", kind: "key" as const },
    { t: "Elegir bien depende de tu pisada, tu peso y el", kind: "dim" as const },
    { t: "terreno por el que sueles correr…", kind: "dim" as const },
    { t: "Aceptar cookies · Suscríbete a la newsletter", color: "#FCD34D" },
    { t: "## Amortiguación y drop", kind: "key" as const },
    { t: "| Modelo | Peso | Drop |   ← llega como texto", color: "#FCA5A5" },
  ];
  const M: [string, string, "green" | "amber" | "red"][] = [["H1 en el texto", "Sí", "green"], ["Encabezados conservados", "12 de 12", "green"], ["Tablas conservadas", "0 de 1", "amber"], ["Ruido colado", "2 líneas", "amber"], ["Palabras extraídas", "734", "green"]];
  return (
    <Card style={{ padding: "20px 24px" }}>
      <CardHead icon={ScanSearch} title="Lo que recibe el modelo" sub="Markdown que sale del HTML del servidor · En amarillo, el ruido que se cuela" />
      <div style={{ display: "flex", gap: 20 }}>
        <Code lines={MD} reveal={reveal} fontSize={16} width={520} />
        <div style={{ flex: 1, display: "grid", gap: 8, alignContent: "start" }}>
          {M.map(([l, v, tone], i) => (
            <Enter key={l} delay={from + 0.5 + i * 0.12} y={10} blur={3} cfg={SPR.snappy}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16, fontWeight: 600, color: U.text2, padding: "8px 0", borderBottom: `1px solid ${U.borderSoft}` }}>
                {l}<Status tone={tone} size={14}>{v}</Status>
              </div>
            </Enter>
          ))}
        </div>
      </div>
    </Card>
  );
};

const NoJsPanel: React.FC<{ from: number }> = ({ from }) => {
  const p = useProg(from + 0.2, 1.4);
  return (
    <Card style={{ padding: "20px 24px" }}>
      <CardHead title="Cobertura sin JavaScript" sub="Palabras en el HTML del servidor ÷ palabras en el DOM renderizado" right={<Status tone="amber">Aviso</Status>} />
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <div style={{ width: 250, textAlign: "center" }}>
          <div style={{ fontSize: 76, fontWeight: 800, color: "#B45309", letterSpacing: -3, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(62 * p)}<span style={{ fontSize: 40 }}>%</span></div>
          <div style={{ marginTop: 6, fontSize: 13, color: U.text3, fontWeight: 600 }}>≥ 90 % bien · 60–90 % aviso · &lt; 60 % crítico</div>
        </div>
        <div style={{ flex: 1, display: "grid", gap: 14 }}>
          <MetricBar label="HTML del servidor (palabras)" value={62} progress={p} color={U.amber} width={560} suffix="%" size={16} />
          <MetricBar label="DOM renderizado (palabras)" value={100} progress={p} color={U.green} width={560} suffix="%" size={16} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Tag tone="amber" size={15}>3 encabezados solo con JS</Tag><Tag tone="amber" size={15}>14 enlaces solo con JS</Tag>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StructurePanel: React.FC<{ from: number }> = ({ from }) => {
  const CH: [boolean, string, string][] = [[true, "H1", "1"], [true, "<main>", "1"], [true, "IDs duplicados", "0"], [true, "lang", "es"], [false, "Tablas sin <th>", "1"], [false, "Imágenes sin alt", "4"], [false, "time[datetime]", "0"], [true, "Encabezados H2/H3", "9"]];
  return (
    <Card style={{ padding: "20px 24px" }}>
      <CardHead title="Estructura HTML" sub="¿Tu HTML semántico se lo pone fácil a la IA?" right={<Status tone="amber">3 avisos</Status>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {CH.map(([ok, l, v], i) => (
          <Enter key={l} delay={from + 0.25 + i * 0.1} y={12} blur={3} cfg={SPR.snappy}>
            <div style={{ padding: "14px 16px", borderRadius: 16, background: ok ? U.green50 : U.amber50, border: `1px solid ${ok ? "#A7F3D0" : "#FDE68A"}` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: U.text2 }}>{l}</div>
              <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8, fontSize: 30, fontWeight: 800, color: ok ? "#047857" : "#B45309" }}>
                {ok ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}{v}
              </div>
            </div>
          </Enter>
        ))}
      </div>
    </Card>
  );
};

const InspectResults: React.FC = () => {
  const { t } = useT();
  const n = TAB_AT.reduce((a, [, at], i) => (t >= at ? i : a), 0);
  const idx = TAB_AT[n][0], prevIdx = TAB_AT[Math.max(0, n - 1)][0];
  const tp = clamp01((t - TAB_AT[n][1]) / 0.4);
  const score = useProg(RB + 0.3, 1.2);
  return (
    <Results>
      <Enter delay={RB + 0.05} y={26} cfg={SPR.soft} blur={6}>
        <Card style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 22 }}>
          <div>
            <div style={{ fontSize: 14, color: U.text3, fontWeight: 700 }}>Estado general</div>
            <div style={{ marginTop: 6 }}><Status tone="amber" size={19}>Aviso</Status></div>
          </div>
          <div style={{ width: 1, height: 52, background: U.border }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, color: U.text3, fontWeight: 700 }}>URL final</div>
            <div style={{ marginTop: 4, fontSize: 18, fontWeight: 700, color: U.text, fontFamily: FONT.mono, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>https://tu-web.com/guia-zapatillas-running</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, color: U.text3, fontWeight: 700 }}>Nota orientativa</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: U.primaryDark, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>{Math.round(71 * score)}<span style={{ fontSize: 20, color: U.text3 }}>/100</span></div>
          </div>
        </Card>
      </Enter>
      <Enter delay={RB + 0.3} y={16} blur={4}>
        <div style={{ marginTop: 16 }}><Tabs items={TABS} active={idx} from={prevIdx} progress={tp} size={17} gap={26} /></div>
      </Enter>
      <div style={{ position: "relative", marginTop: 16, height: 330 }}>
        <Panel from={RB + 0.6} to={TAB_AT[1][1]}><AccessPanel /></Panel>
        <Panel from={TAB_AT[1][1] + 0.06} to={TAB_AT[2][1]}><AiViewPanel from={TAB_AT[1][1]} /></Panel>
        <Panel from={TAB_AT[2][1] + 0.06} to={TAB_AT[3][1]}><NoJsPanel from={TAB_AT[2][1]} /></Panel>
        <Panel from={TAB_AT[3][1] + 0.06}><StructurePanel from={TAB_AT[3][1]} /></Panel>
      </div>
    </Results>
  );
};

export const Scene06: React.FC<SP> = ({ def }) => {
  const cues: Cue[] = [
    ...toolCues(SPEC06),
    { at: RB + 0.3, sfx: "riser", vol: 0.3 }, { at: RB + 1.4, sfx: "ding", vol: 0.4 },
    { at: TAB_AT[1][1], sfx: "tick", vol: 0.5 }, { at: TAB_AT[2][1], sfx: "tick", vol: 0.5 }, { at: TAB_AT[3][1], sfx: "tick", vol: 0.5 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <ToolFlow spec={SPEC06} scroll={410} extra={
        <>
          <Callout x={SIDE_X} y={300} delay={TAB_AT[1][1] + 0.3} icon={ScanSearch} tone="indigo" title="El texto que recibe" body="Lo que la IA lee de tu HTML." w={380} tilt={1.5} />
          <Callout x={SIDE_X} y={470} delay={TAB_AT[2][1] + 0.3} icon={Code2} tone="amber" title="Qué ve sin JavaScript" body="Cobertura del contenido sin JS." w={380} tilt={-1.5} />
          <Callout x={SIDE_X} y={640} delay={TAB_AT[3][1] + 0.3} icon={ListChecks} tone="green" title="HTML semántico" body="Estructura fácil de leer." w={380} tilt={1.5} />
        </>
      }>
        <InspectResults />
      </ToolFlow>
    </SceneShell>
  );
};
