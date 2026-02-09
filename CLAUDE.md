# CLAUDE.md - Guía del proyecto para Claude Code

## Descripción del proyecto

LLMFY YouTube Ad es un generador de video publicitario animado de 30 segundos para YouTube Ads, construido con Remotion y React. Promociona LLMFY, una plataforma de optimización de sitios web para modelos de IA (ChatGPT, Perplexity, Claude, Google AI).

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
npx remotion browser ensure    # Pre-descargar Chromium
```

## Estructura del proyecto

```
src/
  LLMFYAd.tsx       # Composición principal del video (~1950 líneas, 5 escenas)
  Root.tsx           # Configuración de composición Remotion (900 frames, 30fps, 1920x1080)
  index.tsx          # Entry point de Remotion (registerRoot)
  index.ts           # Entry point alternativo
  components/
    LLMFYAd.tsx      # Versión componente
public/
  audio/             # Assets de audio (backgroundv2.mp3, voiceoverv5.mp3)
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

## Paleta de colores

```
primary: "#6366F1"      primaryDark: "#4F46E5"    primaryLight: "#818CF8"
accent: "#A855F7"       accentLight: "#C084FC"    accentDark: "#7C3AED"
dark: "#0F0D1A"         darker: "#080612"
cyan: "#22D3EE"         pink: "#EC4899"
```

## Convenciones de código

- Todo el código del video está en `src/LLMFYAd.tsx` como componentes React funcionales
- Las escenas son componentes independientes que reciben `frame` como prop implícito via `useCurrentFrame()`
- Las animaciones usan `interpolate()` para transiciones lineales y `spring()` para movimiento orgánico
- Los textos del video están en español
- Audio: background a volumen 0.25, voiceover a volumen 1.0

## Especificaciones técnicas

- **Resolución**: 1920x1080 (Full HD)
- **FPS**: 30
- **Duración**: 30 segundos (900 frames)
- **Formato de salida**: MP4 (H.264)
- **Node.js**: 18+ requerido

## CI/CD

GitHub Actions workflow (`.github/workflows/render-video.yml`) con trigger manual (`workflow_dispatch`) que renderiza el video y sube el artefacto.
