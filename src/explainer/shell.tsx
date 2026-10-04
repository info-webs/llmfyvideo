// Envoltorio común de cada capítulo: fondo, insignia del capítulo, subtítulos, locución y efectos.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Backdrop, GridFloor, Particles } from "./fx";
import { Captions } from "./captions";
import { Sfx, VoiceOver, type Cue } from "./audio";
import { C, FONT } from "./theme";
import { Enter, SPR, TimeScale } from "./motion";
import { TAIL, VO_DELAY, type SceneRuntime } from "./config";

export const SceneShell: React.FC<{
  def: SceneRuntime; variant?: "a" | "b" | "c" | "d"; cues?: Cue[]; grid?: boolean; badge?: boolean; captions?: boolean; children?: React.ReactNode;
}> = ({ def, variant = "a", cues = [], grid = false, badge = true, captions = true, children }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const dur = durationInFrames / fps;
  const voSec = def.voSec ?? def.estSec;
  // La coreografía se escribe en "segundos de diseño" (minSec); si la locución real es más larga, se estira.
  const designDur = VO_DELAY + (def.minSec ?? def.estSec) + TAIL;
  const k = Math.max(1, dur / designDur);
  return (
    <AbsoluteFill style={{ fontFamily: FONT.sans }}>
      <Backdrop variant={variant} />
      {grid && <GridFloor />}
      <Particles seed={def.id} count={26} opacity={0.55} />
      <TimeScale.Provider value={k}>
        <AbsoluteFill>{children}</AbsoluteFill>
      {badge && def.chapter && (
        <div style={{ position: "absolute", left: 84, top: 36 }}>
          <Enter delay={0.25} y={-14} x={-20} cfg={SPR.soft}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "10px 20px 10px 12px", borderRadius: 999, background: "rgba(12,11,28,0.82)", border: `1px solid ${C.line}`, color: C.text, fontSize: 21, fontWeight: 600, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.7)" }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#6366F1,#A855F7)", color: "#fff", fontWeight: 800, fontSize: 19 }}>{def.chapter.n}</span>
              {def.chapter.label}
            </div>
          </Enter>
        </div>
      )}
      </TimeScale.Provider>
      {captions && <Captions text={def.narration} from={VO_DELAY} to={Math.min(dur - 0.35, VO_DELAY + voSec)} />}
      {def.voFile && <VoiceOver file={def.voFile} delaySec={VO_DELAY} />}
      <Sfx cues={cues.map((c) => ({ ...c, at: c.at * k }))} />
    </AbsoluteFill>
  );
};
