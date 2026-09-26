# CLAUDE.md - Guía del proyecto para Claude Code

## Descripción del proyecto

LLMFY YouTube Ad es un generador de video publicitario animado de 30 segundos para YouTube Ads, construido con Remotion y React. Promociona LLMFY, una plataforma de optimización de sitios web para modelos de IA (ChatGPT, Perplexity, Claude, Google AI).

Incluye también un segundo vídeo, `LLMFYMotion60`: una pieza de motion graphics de 60 segundos (kinetic typography + data viz) sincronizada con la música.

## Stack tecnológico

- **TypeScript** + **React 18** + **Remotion 4**
- Animaciones custom con `interpolate()` y `spring()` de Remotion
- Sin librerías de animación externas

## Comandos principales

```bash
npm install                    # Instalar dependencias
npm run start                  # Preview en navegador (Remotion Studio, localhost:3000)
npm run render                 # Renderizar video a out/llmfy-ad.mp4 (H.264)
npm run build                  # Igual que render
npm run render:60              # Renderizar el vídeo de 60 s a out/llmfy-motion-60s.mp4
npx remotion browser ensure    # Pre-descargar Chromium
```

## Estructura del proyecto

```
src/
  LLMFYAd.tsx       # Composición principal del video (~1950 líneas, 5 escenas)
  LLMFYMotion60.tsx  # Vídeo motion graphics de 60 s (10 escenas sincronizadas a 130 BPM)
  Root.tsx           # Composiciones Remotion: LLMFYAd (900 frames) y LLMFYMotion60 (1800 frames), 30fps, 1920x1080
  index.tsx          # Entry point de Remotion (registerRoot)
  index.ts           # Entry point alternativo
  components/
    LLMFYAd.tsx      # Versión componente
public/
  audio/             # Assets de audio (backgroundv2.mp3, voiceoverv5.mp3)
  fonts/             # Plus Jakarta Sans y JetBrains Mono (woff2, licencia OFL) para LLMFYMotion60
out/                 # Directorio de salida para videos renderizados
remotion.config.ts   # Config de Remotion (JPEG, overwrite=true)
```

## Arquitectura del video

El video tiene 5 escenas secuenciales (30s total a 30fps = 900 frames):

1. **Scene1_LogoHook** (0-5s): Logo + "¿Tu web aparece cuando ChatGPT responde?"
2. **Scene2_Problem** (5-12s): Estadísticas de adopción de IA
3. **Scene3_Solution** (12-20s): Features de LLMFY (E-E-A-T Audit, Schema Scan, etc.)
4. **Scene4_Demo** (20-25s): Dashboard mockup con score animado
5. **Scene5_CTA** (25-30s): Call-to-action con partículas y confetti

Efectos compartidos: `AuroraBackground`, `Scanlines`, `FilmGrain`, `Vignette`, `SceneTransition`

## Arquitectura del vídeo de 60 segundos (`LLMFYMotion60`)

Todo está en `src/LLMFYMotion60.tsx`. Los tiempos salen de una rejilla musical: `backgroundv2.mp3` va a 130 BPM
(1 tiempo = 13,85 frames, primer tiempo fuerte en el frame 54,5). `bar(n)` devuelve el frame del compás `n` y
`TIMELINE` fija cada escena en un compás; el logo se revela en el drop (compás 8, 16,6 s).

1. **Scene1_Hook** (0-9,2s): "Tus clientes ya no buscan. Preguntan." + demo de IA donde `tuweb.com` no aparece
2. **Scene2_Stats** (9,2-14,7s): 73,7 % / 3,2 % / −20 % (mismas cifras y fuentes que el anuncio de 30 s)
3. **Scene3_Kicker** (14,7-16,6s): "Si la IA no te cita, no existes."
4. **Scene4_Logo** (16,6-20,3s): drop musical, flash y montaje del logo
5. **Scene5_Platforms** (20,3-24s): órbita ChatGPT / Perplexity / Claude / Google AI alrededor del logo
6. **Scene6_Features** (24-35s): Analiza · Optimiza · Monitoriza con las 11 funcionalidades
7. **Scene7_Dashboard** (35-42,4s): panel 3D (LLMO Score, E-E-A-T, visibilidad, plataformas)
8. **Scene8_Results** (42,4-46,1s): la misma pregunta del hook, ahora con `tuweb.com` citada
9. **Scene9_Headline** (46,1-49,8s): "Aparece en las AI Overviews y en los LLMs"
10. **Scene10_CTA** (49,8-60s): formulario + clic en "Analiza tu web AHORA" y pantalla final `llmfy.ai`

Transiciones propias (`SceneShell` para zoom / iris / push, `ShutterWipe`, `GlitchOverlay`, `FlashOverlay`).
Las fuentes se cargan con `FontFace` + `delayRender` dentro del componente (`useLocalFonts`). No llamar a
`delayRender` al importar el módulo: Remotion reinicia su lista de handles al inicializarse, el handle nunca se
libera y el render se cancela a los 30 s. Para textos con degradado usar `GradientText`
(`backgroundImage` + `background-clip: text`), nunca el shorthand `background`.

## Paleta de colores

```
primary: "#6366F1"      primaryDark: "#4F46E5"    primaryLight: "#818CF8"
accent: "#A855F7"       accentLight: "#C084FC"    accentDark: "#7C3AED"
dark: "#0F0D1A"         darker: "#080612"
cyan: "#22D3EE"         pink: "#EC4899"
```

## Convenciones de código

- Todo el código de cada vídeo está en un único archivo (`src/LLMFYAd.tsx`, `src/LLMFYMotion60.tsx`) como componentes React funcionales
- Las escenas son componentes independientes que reciben `frame` como prop implícito via `useCurrentFrame()`
- Las animaciones usan `interpolate()` para transiciones lineales y `spring()` para movimiento orgánico
- Los textos del video están en español
- Audio: background a volumen 0.25, voiceover a volumen 1.0 (el vídeo de 60 s no tiene locución y usa la música a 0.8)
- Nada de `Math.random()`: usar valores deterministas derivados del frame

## Especificaciones técnicas

- **Resolución**: 1920x1080 (Full HD)
- **FPS**: 30
- **Duración**: 30 segundos (900 frames) · 60 segundos (1800 frames) en `LLMFYMotion60`
- **Formato de salida**: MP4 (H.264)
- **Node.js**: 18+ requerido

## CI/CD

GitHub Actions workflow (`.github/workflows/render-video.yml`) con trigger manual (`workflow_dispatch`) que renderiza el video elegido (`LLMFYAd` o `LLMFYMotion60`) y sube el artefacto.
