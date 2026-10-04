// Identidad visual del explainer. Parte de la paleta del anuncio existente (LLMFYAd) y de la
// tipografía real de la web (Plus Jakarta Sans), para que el vídeo suene a LLMFY.
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const jakarta = loadJakarta("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin", "latin-ext"] });
const mono = loadMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const FONT = { sans: jakarta.fontFamily, mono: mono.fontFamily };

export const C = {
  bg0: "#07060F",
  bg1: "#0D0B1A",
  bg2: "#14112A",
  panel: "#15132B",
  panel2: "#1B1836",
  primary: "#6366F1",
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",
  accent: "#A855F7",
  accentLight: "#C084FC",
  cyan: "#22D3EE",
  pink: "#EC4899",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
  text: "#F6F6FF",
  text2: "#B7B7D6",
  text3: "#7E7EA3",
  line: "rgba(255,255,255,0.10)",
  lineStrong: "rgba(255,255,255,0.18)",
} as const;

export const GRAD = {
  brand: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`,
  brandSoft: `linear-gradient(135deg, ${C.primary}33 0%, ${C.accent}33 100%)`,
  text: `linear-gradient(90deg, ${C.primaryLight} 0%, ${C.accentLight} 55%, ${C.pink} 100%)`,
  card: "linear-gradient(180deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.028) 100%)",
  green: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
} as const;

export const SHADOW = {
  card: "0 40px 90px -20px rgba(0,0,0,0.6), 0 12px 30px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)",
  glow: (c: string = C.primary) => `0 0 60px -10px ${c}88, 0 0 120px -30px ${c}66`,
} as const;

// Formato de salida: 16:9 a 1080p y 30 fps (igual que el anuncio existente)
export const VIDEO = { width: 1920, height: 1080, fps: 30 } as const;
// Zona segura para subtítulos (parte inferior): los mockups no deben invadirla
export const CAPTION_SAFE_BOTTOM = 170;
