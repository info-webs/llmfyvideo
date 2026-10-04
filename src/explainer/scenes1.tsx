// Escenas 1-3: el gancho, qué es LLMFY y el primer paso (empezar gratis).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Check, ChevronRight, Clock, Gift, MessageCircle, Search, Sparkles, X } from "lucide-react";
import { SceneShell } from "./shell";
import type { SceneRuntime } from "./config";
import { Camera, Cursor, EASE, Enter, focus, Lines, SPR, useProg, useSpr, useT, useTypewriter, lerp, clamp01, type CursorPoint } from "./motion";
import { Glass, Pill } from "./ui";
import { C, FONT, GRAD, SHADOW } from "./theme";
import { Orb, Sheen } from "./fx";
import { AppWindow, OverviewPage } from "./product";
import { Callout, Card, Pin, Tag, U } from "./widgets";
import type { Cue } from "./audio";

type SP = { def: SceneRuntime };

/* ───────────────────────── 01 · GANCHO ───────────────────────── */
export const Scene01: React.FC<SP> = ({ def }) => {
  const { t } = useT();
  const q = "¿Qué tienda online me recomiendas para comprar zapatillas de running?";
  const { shown, caret } = useTypewriter(q, 0.9, 30);
  const items = [
    { n: "Running Norte", d: "runningnorte.es", c: "#6366F1" },
    { n: "Corre Online", d: "correonline.com", c: "#14B8A6" },
    { n: "Tienda del Corredor", d: "tiendadelcorredor.es", c: "#F59E0B" },
  ];
  const ghost = useSpr(5.0, SPR.soft);
  const stamp = useSpr(5.6, SPR.pop);
  const cues: Cue[] = [
    ...Array.from({ length: 12 }, (_, i) => ({ at: 1.0 + i * 0.17, sfx: (["key1", "key2", "key3"] as const)[i % 3], vol: 0.2 })),
    { at: 3.4, sfx: "pop", vol: 0.35 }, { at: 3.9, sfx: "pop", vol: 0.35 }, { at: 4.4, sfx: "pop", vol: 0.35 },
    { at: 5.0, sfx: "riser", vol: 0.5 }, { at: 5.65, sfx: "impact", vol: 0.55 },
  ];
  return (
    <SceneShell def={def} variant="b" cues={cues} badge={false}>
      <Camera keys={[{ t: 0, s: 1.0, x: 0, y: 0 }, { t: 7.5, s: 1.07, x: -16, y: -8 }]} drift={6}>
        {/* ventana de chat */}
        <div style={{ position: "absolute", left: 250, top: 120 }}>
          <Enter delay={0.2} y={50} cfg={SPR.soft} blur={14}>
            <div style={{ width: 1100, borderRadius: 34, background: "rgba(255,255,255,0.97)", boxShadow: "0 80px 150px -40px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.6)", overflow: "hidden", fontFamily: FONT.sans }}>
              <div style={{ height: 76, display: "flex", alignItems: "center", gap: 16, padding: "0 32px", borderBottom: `1px solid ${U.border}`, background: "#F8FAFC" }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: "linear-gradient(135deg,#10B981,#14B8A6)", display: "flex", alignItems: "center", justifyContent: "center" }}><MessageCircle size={22} color="#fff" /></div>
                <div style={{ fontSize: 24, fontWeight: 800, color: U.text }}>Asistente de IA</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                  {["ChatGPT", "Perplexity", "Gemini"].map((n) => <Tag key={n} tone="slate" size={16}>{n}</Tag>)}
                </div>
              </div>
              <div style={{ padding: "34px 40px 40px", minHeight: 560 }}>
                {/* pregunta del usuario */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ maxWidth: 720, padding: "20px 28px", borderRadius: "26px 26px 6px 26px", background: U.grad, color: "#fff", fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>
                    {shown}{caret && t < 3 && <span style={{ display: "inline-block", width: 3, height: 30, background: "#fff", marginLeft: 3, verticalAlign: "middle" }} />}
                  </div>
                </div>
                {/* respuesta */}
                <div style={{ marginTop: 28, display: "flex", gap: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg,#10B981,#14B8A6)", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", opacity: clamp01((t - 3.0) / 0.3) }}><Sparkles size={26} color="#fff" /></div>
                  <div style={{ flex: 1 }}>
                    <Enter delay={3.0} y={14} blur={6}><div style={{ fontSize: 26, color: U.text, fontWeight: 600, marginBottom: 16 }}>Para zapatillas de running te recomiendo estas tiendas:</div></Enter>
                    {items.map((it, i) => (
                      <Enter key={it.n} delay={3.4 + i * 0.5} y={18} blur={6} cfg={SPR.snappy}>
                        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", marginBottom: 12, borderRadius: 18, background: "#F8FAFC", border: `1px solid ${U.border}` }}>
                          <div style={{ width: 44, height: 44, borderRadius: 14, background: it.c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>{i + 1}</div>
                          <div style={{ fontSize: 28, fontWeight: 800, color: U.text }}>{it.n}</div>
                          <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "#EEF2FF", color: U.primaryDark, fontSize: 18, fontWeight: 700 }}><Check size={18} strokeWidth={3} />{it.d}</div>
                        </div>
                      </Enter>
                    ))}
                    {/* tu marca: ausente */}
                    <div style={{ opacity: ghost, transform: `translateY(${(1 - ghost) * 16}px)`, display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 18, border: `3px dashed ${U.red}66`, background: "#FEF2F2" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, border: `3px dashed ${U.red}`, color: U.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>?</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#B91C1C" }}>Tu tienda</div>
                      <div style={{ marginLeft: "auto", fontSize: 20, fontWeight: 700, color: "#B91C1C" }}>no aparece</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Enter>
          <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: 16, fontWeight: 600, color: C.text3, letterSpacing: 0.3 }}>Ejemplo ilustrativo</div>
        </div>
        {/* sello */}
        <div style={{ position: "absolute", left: 1390, top: 470, transform: `scale(${lerp(2.2, 1, stamp)}) rotate(${lerp(-14, -7, stamp)}deg)`, opacity: clamp01(stamp * 1.5) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "20px 34px 20px 26px", borderRadius: 22, border: `6px solid ${U.red}`, color: U.red, background: "rgba(254,242,242,0.97)", fontSize: 50, lineHeight: 1.04, fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase", boxShadow: "0 30px 60px -20px rgba(239,68,68,0.6)", fontFamily: FONT.sans }}>
            <X size={64} strokeWidth={4.5} />
            <span>Invisible<br />para la IA</span>
          </div>
        </div>
      </Camera>
    </SceneShell>
  );
};

/* ───────────────────────── 02 · QUÉ ES LLMFY ───────────────────────── */
export const Scene02: React.FC<SP> = ({ def }) => {
  const logo = useSpr(0.35, SPR.heavy);
  const word = useSpr(0.75, SPR.soft);
  const up = useProg(3.4, 1.0, EASE.inOut);
  const engines = [["ChatGPT", "#10B981"], ["Gemini", "#818CF8"], ["Perplexity", "#14B8A6"], ["Google AI Overviews", "#60A5FA"]] as const;
  const steps = [["1", "Analiza", "tu URL"], ["2", "Optimiza", "con un plan claro"], ["3", "Mide", "si te citan"]] as const;
  const cues: Cue[] = [
    { at: 0.3, sfx: "impact", vol: 0.55 }, { at: 3.3, sfx: "whooshSoft", vol: 0.4 },
    { at: 4.2, sfx: "pop", vol: 0.4 }, { at: 4.8, sfx: "pop", vol: 0.4 }, { at: 5.4, sfx: "pop", vol: 0.4 }, { at: 6.2, sfx: "tick", vol: 0.3 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues} badge={false}>
      <Orb x="50%" y="42%" size={1100} color={C.primary} opacity={0.45 * logo} drift={20} seed="logo" />
      <Camera keys={[{ t: 0, s: 1.1, y: 30 }, { t: 3.2, s: 1.0, y: 0 }]}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateY(${-up * 250}px) scale(${lerp(1, 0.62, up)})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -40, borderRadius: 80, background: `radial-gradient(circle, ${C.primary}88, transparent 70%)`, opacity: logo }} />
              <Img src={staticFile("brand/llmfy-icon-512.png")} style={{ position: "relative", width: 230, height: 230, borderRadius: 62, transform: `scale(${lerp(0.4, 1, logo)}) rotate(${lerp(-24, 0, logo)}deg)`, opacity: clamp01(logo * 2), boxShadow: SHADOW.glow(C.primary) }} />
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 190, fontWeight: 800, letterSpacing: -9, color: C.text, opacity: clamp01(word * 1.6), transform: `translateX(${(1 - word) * -80}px)`, lineHeight: 1 }}>LLMFY</div>
          </div>
          <div style={{ marginTop: 26, fontFamily: FONT.sans, fontSize: 52, fontWeight: 700, letterSpacing: -1, color: C.text2 }}>
            <Lines delay={1.2} lines={[<span key="a">Haz que la IA <span style={{ background: GRAD.text, WebkitBackgroundClip: "text", color: "transparent" }}>cite tu marca</span></span>]} lineStyle={{ whiteSpace: "nowrap" }} />
          </div>
        </AbsoluteFill>
      </Camera>
      <Sheen at={1.0} />
      {/* pasos y buscadores */}
      <AbsoluteFill style={{ fontFamily: FONT.sans }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 462, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
          {steps.map(([n, a, b], i) => (
            <React.Fragment key={n}>
              {i > 0 && <Enter delay={3.9 + i * 0.6} x={-14} y={0} blur={0} cfg={SPR.snappy}><ChevronRight size={50} color={C.text3} strokeWidth={2.4} /></Enter>}
              <Enter delay={4.0 + i * 0.6} y={50} cfg={SPR.pop}>
                <Glass radius={32} style={{ width: 470, padding: "34px 38px", display: "flex", alignItems: "center", gap: 28 }}>
                  <div style={{ width: 96, height: 96, borderRadius: 30, background: GRAD.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, fontWeight: 800, color: "#fff", boxShadow: SHADOW.glow(C.primary), flex: "none" }}>{n}</div>
                  <div><div style={{ fontSize: 54, fontWeight: 800, color: C.text, letterSpacing: -1.4, lineHeight: 1.05 }}>{a}</div><div style={{ fontSize: 28, color: C.text2, fontWeight: 500, marginTop: 4 }}>{b}</div></div>
                </Glass>
              </Enter>
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 742, display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", padding: "0 160px" }}>
          {engines.map(([n, c], i) => (
            <Enter key={n} delay={6.0 + i * 0.2} y={20} blur={6} cfg={SPR.snappy}>
              <Pill color={c} style={{ fontSize: 32, padding: "12px 30px" }}><span style={{ width: 14, height: 14, borderRadius: 7, background: c }} />{n}</Pill>
            </Enter>
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* ───────────────────────── 03 · EMPIEZA GRATIS ───────────────────────── */
export const Scene03: React.FC<SP> = ({ def }) => {
  const { t } = useT();
  const url = "https://tu-web.com/tu-mejor-pagina";
  const { shown, caret } = useTypewriter(url, 2.6, 24);
  const phaseB = useProg(5.5, 0.7, EASE.inOut);       // aparece el acceso
  const phaseC = useProg(8.4, 0.8, EASE.inOut);       // aparece el dashboard
  const btnPressed = Math.max(0, 1 - Math.abs(t - 5.06) / 0.14);
  const googlePressed = Math.max(0, 1 - Math.abs(t - 8.26) / 0.14);
  const path: CursorPoint[] = [
    { t: 1.0, x: 1500, y: 640 }, { t: 2.3, x: 900, y: 690, click: true },
    { t: 4.2, x: 1000, y: 740 }, { t: 5.0, x: 1480, y: 690, click: true },
    { t: 7.0, x: 1000, y: 520 }, { t: 8.2, x: 960, y: 600, click: true },
  ];
  const cues: Cue[] = [
    { at: 0.6, sfx: "whoosh", vol: 0.35 }, { at: 2.3, sfx: "click", vol: 0.45 },
    ...Array.from({ length: 14 }, (_, i) => ({ at: 2.7 + i * 0.16, sfx: (["key1", "key2", "key3"] as const)[i % 3], vol: 0.2 })),
    { at: 5.0, sfx: "click", vol: 0.5 }, { at: 5.5, sfx: "whooshSoft", vol: 0.4 }, { at: 8.2, sfx: "click", vol: 0.5 }, { at: 8.7, sfx: "ding", vol: 0.45 },
  ];
  return (
    <SceneShell def={def} variant="a" cues={cues}>
      <Camera keys={[{ t: 0, s: 1, x: 0, y: 0 }, focus(2.0, 980, 640, 1.07), focus(5.2, 960, 540, 1.0), { t: 8.0, s: 1, x: 0, y: 0 }]} drift={4}>
        {/* A · la web */}
        <AbsoluteFill style={{ opacity: 1 - phaseB, transform: `scale(${lerp(1, 0.94, phaseB)})` }}>
          <div style={{ position: "absolute", left: 250, top: 130, width: 1420, height: 730, borderRadius: 26, overflow: "hidden", background: "linear-gradient(180deg,#FFFFFF,#F5F3FF)", boxShadow: "0 70px 130px -34px rgba(0,0,0,0.85)", fontFamily: FONT.sans }}>
            <div style={{ height: 52, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", background: "#EEF1F7", borderBottom: `1px solid ${U.border}` }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
              <div style={{ marginLeft: 22, height: 32, width: 480, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", color: U.text2, fontSize: 16, fontFamily: FONT.mono, border: `1px solid ${U.border}` }}>llmfy.ai/es</div>
            </div>
            <div style={{ padding: "26px 56px", display: "flex", alignItems: "center", gap: 14 }}>
              <Img src={staticFile("brand/llmfy-icon-512.png")} style={{ width: 46, height: 46, borderRadius: 14 }} />
              <span style={{ fontSize: 30, fontWeight: 800, color: U.text }}>LLMFY</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 36, fontSize: 20, color: U.text2, fontWeight: 600, alignItems: "center" }}><span>Productos</span><span>Soluciones</span><span>Precios</span><span style={{ padding: "10px 22px", borderRadius: 14, background: U.grad, color: "#fff" }}>Análisis Gratis</span></div>
            </div>
            <div style={{ padding: "26px 80px" }}>
              <Tag tone="indigo" size={20}>LLMO: Optimización LLM para la Era de la IA</Tag>
              <div style={{ marginTop: 22, fontSize: 70, fontWeight: 800, color: U.text, letterSpacing: -2.5, lineHeight: 1.03, maxWidth: 1000 }}>
                La herramienta <span style={{ color: U.primary }}>SEO</span><br />
                <span style={{ color: "#64748B" }}>que te posiciona en las Google AI Overviews</span>
              </div>
              <div style={{ marginTop: 36, display: "flex", gap: 16, width: 1010 }}>
                <div style={{ flex: 1, height: 74, borderRadius: 18, border: `2px solid ${t > 2.3 ? U.primary : U.border}`, boxShadow: t > 2.3 ? "0 0 0 6px rgba(99,102,241,0.16)" : undefined, background: "#fff", display: "flex", alignItems: "center", padding: "0 26px", gap: 14, fontSize: 28 }}>
                  <Search size={28} color={U.text3} />
                  {shown ? <span style={{ color: U.text, fontWeight: 600 }}>{shown}</span> : <span style={{ color: U.text3 }}>https://tu-web.com/tu-mejor-pagina</span>}
                  {caret && t < 5 && <span style={{ width: 2, height: 34, background: U.primary, marginLeft: -10 }} />}
                </div>
                <div style={{ width: 300, height: 74, borderRadius: 18, background: U.grad, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, gap: 12, transform: `scale(${1 - btnPressed * 0.05})`, boxShadow: "0 18px 34px -12px rgba(99,102,241,0.75)" }}><Sparkles size={26} />Analizar con IA</div>
              </div>
              <div style={{ marginTop: 22, display: "flex", gap: 30, fontSize: 21, color: U.text2, fontWeight: 600 }}>
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Check size={22} color={U.green} strokeWidth={3} />3 análisis gratis</span>
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Check size={22} color={U.green} strokeWidth={3} />Sin tarjeta requerida</span>
              </div>
            </div>
          </div>
          <Pin x={960} y={690} n={1} delay={1.6} label="Pega tu URL" />
          <Pin x={1480} y={690} n={2} delay={4.5} label="Analizar con IA" />
        </AbsoluteFill>

        {/* B · acceso */}
        <AbsoluteFill style={{ opacity: phaseB * (1 - phaseC), transform: `scale(${lerp(1.06, 1, phaseB)})`, alignItems: "center", justifyContent: "center", fontFamily: FONT.sans }}>
          <Card style={{ width: 620, padding: "44px 48px", borderRadius: 30, boxShadow: "0 70px 120px -34px rgba(0,0,0,0.8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Img src={staticFile("brand/llmfy-icon-512.png")} style={{ width: 52, height: 52, borderRadius: 15 }} />
              <div style={{ fontSize: 34, fontWeight: 800, color: U.text, letterSpacing: -0.8 }}>Entra en LLMFY</div>
            </div>
            <div style={{ marginTop: 28, height: 64, borderRadius: 16, border: `2px solid ${U.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 24, fontWeight: 700, color: U.text, transform: `scale(${1 - googlePressed * 0.04})`, background: googlePressed > 0 ? U.primary50 : "#fff" }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, background: "conic-gradient(#EA4335 0 25%, #FBBC05 0 50%, #34A853 0 75%, #4285F4 0)" }} /> Continuar con Google
            </div>
            <div style={{ marginTop: 18, height: 64, borderRadius: 16, background: U.primary50, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 22, fontWeight: 700, color: U.primaryDark }}>Enviar enlace de acceso</div>
          </Card>
          <Pin x={1340} y={470} n={3} delay={6.2} label="Con Google o por enlace" />
        </AbsoluteFill>

        {/* C · dashboard con 3 créditos */}
        <AbsoluteFill style={{ opacity: phaseC, transform: `scale(${lerp(1.06, 1, phaseC)})` }}>
          <AppWindow route="" open={null} active="overview" plan="Plan Free" credits="3 créditos" creditPulse={Math.max(0, 1 - Math.abs(t - 9.0) / 0.5)}>
            <OverviewPage />
          </AppWindow>
          <Callout x={1500} y={250} delay={9.2} icon={Gift} tone="green" title="3 análisis gratis" body="Sin tarjeta y sin caducidad." w={400} tilt={2} />
          <Callout x={1500} y={440} delay={10.0} icon={Clock} tone="indigo" title="Listo en 1 minuto" body="Pega una URL y analiza." w={380} tilt={-2} />
        </AbsoluteFill>
        <Cursor path={path} />
      </Camera>
    </SceneShell>
  );
};
