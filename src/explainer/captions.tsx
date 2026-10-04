// Subtítulos estilo "karaoke": se reparten por palabras según el peso (letras + pausas de puntuación)
// dentro del intervalo de la locución. Si hay audio real, el reparto se ajusta a su duración.
import React from "react";
import { interpolate } from "remotion";
import { C, FONT, GRAD } from "./theme";
import { useT } from "./motion";

type W = { text: string; start: number; end: number };
export type CaptionPage = { words: W[]; start: number; end: number };

export function buildPages(text: string, startSec: number, endSec: number, maxWords = 7): CaptionPage[] {
  const raw = text.trim().split(/\s+/).filter(Boolean);
  if (raw.length === 0) return [];
  const weights = raw.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 2 + (/[.!?…]$/.test(w) ? 5 : /[,;:]$/.test(w) ? 2.5 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const words: W[] = raw.map((w, i) => {
    const s = startSec + (acc / total) * (endSec - startSec);
    acc += weights[i];
    return { text: w, start: s, end: startSec + (acc / total) * (endSec - startSec) };
  });
  const pages: CaptionPage[] = [];
  let cur: W[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const sentenceEnd = /[.!?…]$/.test(w.text);
    const softBreak = /[,;:]$/.test(w.text) && cur.length >= 4;
    if (sentenceEnd || softBreak || cur.length >= maxWords || i === words.length - 1) {
      pages.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    }
  });
  return pages;
}

export const Captions: React.FC<{ text: string; from: number; to: number; bottom?: number; size?: number }> = ({ text, from, to, bottom = 70, size = 46 }) => {
  const { t } = useT();
  const pages = React.useMemo(() => buildPages(text, from, to), [text, from, to]);
  const idx = pages.findIndex((p, i) => t >= p.start - 0.06 && t < (pages[i + 1] ? pages[i + 1].start - 0.06 : p.end + 0.35));
  if (idx < 0) return null;
  const page = pages[idx];
  const pIn = interpolate(t, [page.start - 0.06, page.start + 0.16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const last = idx === pages.length - 1;
  const pOut = last ? interpolate(t, [page.end + 0.1, page.end + 0.35], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 190, pointerEvents: "none", background: "linear-gradient(to top, rgba(7,6,15,0.84) 0%, rgba(7,6,15,0.5) 50%, rgba(7,6,15,0) 100%)", opacity: Math.min(pIn, pOut) }}>
      <div
        style={{
          position: "absolute", left: "50%", bottom, transform: `translate(-50%, ${(1 - pIn) * 14}px)`, width: "max-content", maxWidth: 1560, textAlign: "center", fontFamily: FONT.sans,
          fontSize: size, fontWeight: 700, lineHeight: 1.22, letterSpacing: -0.5, textShadow: "0 2px 26px rgba(0,0,0,0.7)",
        }}
      >
        {page.words.map((w, i) => {
          const spoken = t >= w.start, active = t >= w.start && t < w.end;
          const pop = active ? 1 + 0.05 * Math.sin(Math.PI * Math.min(1, (t - w.start) / Math.max(0.12, w.end - w.start))) : 1;
          return (
            <span
              key={i}
              style={{
                display: "inline-block", marginRight: "0.26em", transform: `scale(${pop})`,
                opacity: spoken ? 1 : 0.38,
                ...(active ? { background: GRAD.text, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : { color: C.text }),
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
