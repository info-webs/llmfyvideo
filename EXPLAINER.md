# LLMFY · Explainer tutorial (≈ 2 min)

Vídeo tutorial de uso de LLMFY: de la primera URL a medir si la IA te cita. 1920×1080, 30 fps, en castellano.

- Composición de Remotion: `LLMFYExplainer` (`src/explainer/`).
- Estilo: escenario oscuro con aurora y ventanas de producto claras, fieles al dashboard real (Plus Jakarta Sans, paleta «Indigo Clarity»). Todas las cifras de las pantallas son **datos de ejemplo**.
- Sonido: música `public/audio/background.mp3`, efectos sintetizados (`npm run sfx`) y, si existe, la locución `public/audio/vo/<id>.mp3`.

## Guion de la locución (un mp3 por escena)

El nombre del archivo es el `id` de la escena. Si falta un mp3, esa escena dura lo que estima el texto (≈ 2,5 palabras por segundo) y los subtítulos se reparten sobre esa duración. Con el mp3 puesto, la escena **se ajusta sola a su duración real**, así que no hay que tocar código.

| id | Escena | Locución |
|---|---|---|
| `01-gancho` | Gancho | Le preguntas a ChatGPT por tu sector y recomienda a tu competencia. ¿Y tu marca? Ni aparece. |
| `02-que-es` | Qué es LLMFY | LLMFY mide si tu web está lista para que ChatGPT, Gemini, Perplexity y las Google AI Overviews la citen, y te dice qué cambiar. |
| `03-empieza` | Paso 1 · Empieza gratis | Paso uno: pega la URL de tu página en llmfy.ai y pulsa Analizar con IA. Entra con Google o con un enlace al correo y tendrás tres análisis gratis, sin tarjeta. |
| `04-citabilidad` | Paso 2 · Optimización LLM | Paso dos, la Optimización LLM. Pega tu URL y pulsa Analizar Citabilidad: en menos de un minuto tienes un score de cero a cien, doce factores y un plan con los quick wins. |
| `05-eeat-schema` | Paso 3 · E-E-A-T y Schema | Paso tres: la Auditoría E-E-A-T puntúa experiencia, pericia, autoridad y confianza, y Schema Scan revisa tus datos estructurados. |
| `06-inspect` | Paso 4 · LLM Inspect | Paso cuatro: con LLM Inspect ves tu URL como la lee una IA: el texto que recibe, qué ve sin JavaScript y si tu HTML se lo pone fácil. |
| `07-robots` | Paso 5 · Robots.txt | Paso cinco: el Robots.txt Optimizer comprueba si GPTBot, ClaudeBot o PerplexityBot pueden rastrear tu web y te descarga un robots.txt optimizado. |
| `08-semantico` | Paso 6 · AIO Semántico | Paso seis: AIO Semántico compara tu página con hasta cinco competidores y te muestra las lagunas de contenido y las entidades que te faltan. |
| `09-tracking` | Paso 7 · Medir | Paso siete: mide resultados. El LLM Tracker comprueba si Google AI Overviews y ChatGPT te mencionan, y el Prompt Tracker sigue tus prompts en Google, ChatGPT y Perplexity. |
| `10-trafico` | Paso 8 · AI Traffic | Y paso ocho: con AI Traffic Analytics conectas Google Analytics en solo lectura y ves cuántas visitas te llegan desde chats de IA. |
| `11-mas` | Más herramientas | Y hay más: Brand Sentiment, Human-First Score, Information Gain, Ampliaciones GEO, AI Building e Index Now. |
| `12-planes-cta` | Planes y llamada a la acción | Empieza gratis, con tres análisis y sin tarjeta. Los planes de pago van desde diecinueve euros al mes. Entra en llmfy.ai y analiza tu web hoy. |

Consejos para generar la voz: tono cercano y seguro, ritmo medio, sin pausas largas entre frases; siglas y nombres en inglés (GPTBot, ClaudeBot) pronunciados en inglés.

## Qué el guion evita decir a propósito (el producto no lo respalda)

- «7 días de prueba» o «10 análisis gratuitos»: el plan gratuito son **3 análisis**, sin caducidad.
- «Las 5 herramientas», «once/doce herramientas», «39 factores», «9 tipos de schema», «precio inicial 49 €»: están desfasados (hay 15 herramientas, 12 factores y el plan más barato es de 19 €).
- Que el LLM Tracker mide Claude, Perplexity o Gemini, o que avisa con alertas: mide **Google AI Overviews y ChatGPT** (este último solo EE. UU. y en inglés) y no tiene alertas.
- «Visibilidad LLM» como citas reales: es una estimación a partir del último análisis.
- Funciones ocultas o ajenas: Search Console, el chat «Consultor AIO/LLMO», la tarjeta «AI Merchant Pro» y los «Próximamente».

## Renderizar

```bash
npm ci
npm run sfx                  # genera los efectos de sonido (ya incluidos en public/audio/sfx)
npm run start                # Remotion Studio: previsualizar
npm run render:explainer     # → out/llmfy-explainer.mp4
```

En GitHub: *Actions → Render Remotion Video → Run workflow* y elige la composición `LLMFYExplainer`.
