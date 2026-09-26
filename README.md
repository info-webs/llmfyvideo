# LLMFY YouTube Ad - Remotion Video

## 🎬 Video Premium de 30 segundos para YouTube Ads

Este proyecto genera un video animado profesional para promocionar LLMFY.

### 🎵 Añadir Música (IMPORTANTE)

Antes de renderizar, descarga música royalty-free y guárdala en el proyecto:

1. Ve a **[Pixabay Music](https://pixabay.com/music/search/corporate%20technology/)** 
2. Busca "corporate technology" o "tech upbeat"
3. Descarga un track de ~30 segundos
4. Guárdalo en: `public/audio/background.mp3`

**Recomendaciones de tracks gratuitos:**
- [Corporate Technology](https://pixabay.com/music/corporate-corporate-technology-137766/)
- [Inspiring Cinematic](https://pixabay.com/music/beautiful-plays-inspiring-cinematic-ambient-116199/)
- [Future Technology](https://pixabay.com/music/beats-future-technology-corporate-128604/)

### Estructura del Video (30 segundos)

| Tiempo | Escena | Descripción |
|--------|--------|-------------|
| 0-5s | **Logo + Hook** | Logo LLMFY con animación + "¿Tu web aparece cuando ChatGPT responde?" |
| 5-12s | **El Problema** | Stats impactantes sobre la adopción de IA |
| 12-20s | **La Solución** | Features de LLMFY con iconos animados |
| 20-25s | **Demo** | Preview del dashboard con scores animados |
| 25-30s | **CTA** | "Empieza gratis en llmfy.ai" con partículas |

### Especificaciones Técnicas

- **Resolución**: 1920x1080 (Full HD)
- **FPS**: 30
- **Duración**: 30 segundos (900 frames)
- **Formato**: MP4 (H.264)

## 🎞️ Vídeo Motion Graphics de 60 segundos

Composición `LLMFYMotion60` (`src/LLMFYMotion60.tsx`): kinetic typography, data viz y transiciones
sincronizadas con la música (`backgroundv2.mp3`, 130 BPM). Los cortes caen en los compases y el logo
se revela justo en el *drop* musical (16,6 s). Sin locución: solo música.

| Tiempo | Escena | Descripción |
|--------|--------|-------------|
| 0-9,2s | **Hook + demo IA** | "Tus clientes ya no buscan. Preguntan." → la IA responde y `tuweb.com` no aparece entre las fuentes |
| 9,2-14,7s | **El problema** | 73,7 % búsquedas en Google · 3,2 % herramientas IA · −20 % tráfico por AI Overviews (donut, waffle y gráfico de caída) |
| 14,7-16,6s | **Remate** | "Si la IA no te cita, no existes." (una palabra por tiempo) |
| 16,6-20,3s | **Drop → Logo** | Flash, ondas expansivas y montaje del logo LLMFY |
| 20,3-24s | **Plataformas** | Órbita con ChatGPT, Perplexity, Claude y Google AI alrededor del logo |
| 24-35s | **Analiza · Optimiza · Monitoriza** | Las 11 funcionalidades en tres pasos, con barrido de cámara entre paneles |
| 35-42,4s | **Panel 3D** | LLMO Score 92, análisis E-E-A-T, visibilidad en IA y presencia por plataforma |
| 42,4-46,1s | **Resultado** | La misma pregunta del inicio, ahora con `tuweb.com` como fuente citada |
| 46,1-49,8s | **Titular** | "Aparece en las AI Overviews y en los LLMs" |
| 49,8-60s | **CTA + cierre** | Formulario con clic en "Analiza tu web AHORA" y pantalla final con `llmfy.ai` |

```bash
# Renderizar el vídeo de 60 segundos → out/llmfy-motion-60s.mp4
npm run render:60
```

Las tipografías (Plus Jakarta Sans y JetBrains Mono, licencia OFL) están en `public/fonts/`, así que el
render no depende de las fuentes instaladas en el sistema.

### 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Opcional: Instalar Chromium para renderizado
npx remotion browser ensure
```

### 📺 Preview en Navegador

```bash
npm run start
# Abre http://localhost:3000
```

### 🎥 Renderizar Video

```bash
# Renderizar a MP4
npm run render

# El video se guardará en: out/llmfy-ad.mp4
```

### Paleta de Colores

- **Primary**: #6366F1 (Indigo 500)
- **Accent**: #A855F7 (Purple 500)
- **Background**: #0F0D1A → #080612

### Personalización

Edita `src/LLMFYAd.tsx` para:
- Cambiar textos y copy
- Ajustar timing de escenas
- Modificar animaciones
- Cambiar colores

### Exportar a Otros Formatos

```bash
# GIF (para preview)
npx remotion render src/index.tsx LLMFYAd out/llmfy-ad.gif --codec gif

# WebM (para web)
npx remotion render src/index.tsx LLMFYAd out/llmfy-ad.webm --codec vp8

# ProRes (para edición)
npx remotion render src/index.tsx LLMFYAd out/llmfy-ad.mov --codec prores
```

### Requisitos del Sistema

- Node.js 18+
- 4GB RAM mínimo
- Chrome/Chromium instalado (se descarga automáticamente)

---

Creado con ❤️ usando Remotion
