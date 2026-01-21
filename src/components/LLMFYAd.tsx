import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  Easing,
} from "remotion";

// Colores de marca LLMFY
const COLORS = {
  primary: "#6366f1", // Indigo
  secondary: "#8b5cf6", // Violet
  accent: "#06b6d4", // Cyan
  dark: "#0f172a", // Slate 900
  darker: "#020617", // Slate 950
  light: "#f8fafc", // Slate 50
  gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
};

export interface LLMFYAdProps {
  duration?: "short" | "full";
  vertical?: boolean;
}

// Componente de partículas flotantes de fondo
const FloatingParticles: React.FC<{ count: number }> = ({ count }) => {
  const frame = useCurrentFrame();
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 137.5) % 100;
        const y = (i * 73.7) % 100;
        const size = 2 + (i % 4);
        const speed = 0.5 + (i % 3) * 0.3;
        const opacity = 0.1 + (i % 5) * 0.05;
        
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${(y + frame * speed * 0.1) % 120 - 10}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 2 === 0 ? COLORS.primary : COLORS.accent,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// Logo animado LLMFY
const AnimatedLogo: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  
  const glowPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;
  
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16 * scale,
        transform: `scale(${logoSpring * scale})`,
      }}
    >
      {/* Icono */}
      <div
        style={{
          width: 60 * scale,
          height: 60 * scale,
          borderRadius: 12 * scale,
          background: COLORS.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${30 * glowPulse}px ${COLORS.primary}`,
        }}
      >
        <svg
          width={36 * scale}
          height={36 * scale}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Texto */}
      <span
        style={{
          fontSize: 48 * scale,
          fontWeight: 800,
          color: COLORS.light,
          letterSpacing: -1,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        LLMFY
      </span>
    </div>
  );
};

// Texto con efecto de escritura
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}> = ({ text, startFrame, fontSize = 64, color = COLORS.light, fontWeight = 700 }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  
  const charsToShow = Math.floor(relativeFrame / 2);
  const displayText = text.slice(0, Math.min(charsToShow, text.length));
  const showCursor = relativeFrame < text.length * 2 + 30 && Math.floor(frame / 15) % 2 === 0;
  
  return (
    <span
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {displayText}
      {showCursor && (
        <span style={{ color: COLORS.accent }}>|</span>
      )}
    </span>
  );
};

// Barra de estadísticas animada
const StatBar: React.FC<{
  label: string;
  value: number;
  delay: number;
  color: string;
}> = ({ label, value, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  
  const width = Math.min(progress * value, value);
  
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 18,
          color: COLORS.light,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span>{label}</span>
        <span style={{ color }}>{Math.round(width)}%</span>
      </div>
      <div
        style={{
          height: 12,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: color,
            borderRadius: 6,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      </div>
    </div>
  );
};

// Componente de AI Chatbots
const AILogos: React.FC<{ frame: number }> = ({ frame }) => {
  const logos = [
    { name: "ChatGPT", color: "#10a37f" },
    { name: "Perplexity", color: "#20b8cd" },
    { name: "Claude", color: "#d97706" },
    { name: "Gemini", color: "#4285f4" },
  ];
  
  return (
    <div
      style={{
        display: "flex",
        gap: 30,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {logos.map((logo, i) => {
        const delay = i * 8;
        const scale = interpolate(
          frame - delay,
          [0, 15],
          [0, 1],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        const pulse = Math.sin((frame - delay) * 0.15) * 0.1 + 1;
        
        return (
          <div
            key={logo.name}
            style={{
              transform: `scale(${scale * pulse})`,
              padding: "16px 32px",
              background: `${logo.color}20`,
              border: `2px solid ${logo.color}`,
              borderRadius: 12,
              color: logo.color,
              fontSize: 24,
              fontWeight: 600,
              fontFamily: "Inter, system-ui, sans-serif",
              boxShadow: `0 0 30px ${logo.color}40`,
            }}
          >
            {logo.name}
          </div>
        );
      })}
    </div>
  );
};

// Mockup de Dashboard
const DashboardMockup: React.FC<{ frame: number }> = ({ frame }) => {
  const scale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  return (
    <div
      style={{
        transform: `scale(${scale}) perspective(1000px) rotateY(-5deg)`,
        opacity,
        background: "rgba(15, 23, 42, 0.9)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        borderRadius: 16,
        padding: 24,
        width: 600,
        boxShadow: `
          0 0 60px rgba(99, 102, 241, 0.2),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: COLORS.gradient,
          }}
        />
        <span
          style={{
            color: COLORS.light,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          LLMFY Dashboard
        </span>
      </div>
      
      {/* Stats */}
      <StatBar label="Visibilidad en ChatGPT" value={87} delay={20} color="#10a37f" />
      <StatBar label="Menciones en Perplexity" value={72} delay={35} color="#20b8cd" />
      <StatBar label="Ranking en Claude" value={94} delay={50} color="#d97706" />
    </div>
  );
};

// Escena del Hook (inicio)
const HookScene: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  
  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const scale = interpolate(frame, [0, 30], [1.2, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  
  return (
    <AbsoluteFill
      style={{
        background: COLORS.darker,
        justifyContent: "center",
        alignItems: "center",
        padding: vertical ? 60 : 100,
      }}
    >
      <FloatingParticles count={30} />
      
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scale})`,
          opacity: textOpacity,
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: vertical ? 42 : 56,
            fontWeight: 800,
            color: COLORS.light,
            marginBottom: 24,
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.2,
          }}
        >
          ¿Tu web aparece cuando
        </div>
        <div
          style={{
            fontSize: vertical ? 48 : 72,
            fontWeight: 800,
            background: COLORS.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          preguntan a ChatGPT?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Escena del problema
const ProblemScene: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill
      style={{
        background: COLORS.darker,
        justifyContent: "center",
        alignItems: "center",
        padding: vertical ? 60 : 100,
      }}
    >
      <FloatingParticles count={20} />
      
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: vertical ? 28 : 36,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 32,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          El 40% de las búsquedas ya pasan por IAs
        </div>
        
        <AILogos frame={frame} />
        
        <div
          style={{
            marginTop: 48,
            fontSize: vertical ? 24 : 32,
            color: COLORS.accent,
            fontWeight: 600,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Y el SEO tradicional no funciona aquí
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Escena de la solución
const SolutionScene: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const logoSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  
  return (
    <AbsoluteFill
      style={{
        background: COLORS.darker,
        justifyContent: "center",
        alignItems: "center",
        padding: vertical ? 60 : 100,
      }}
    >
      <FloatingParticles count={40} />
      
      <div
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          gap: vertical ? 48 : 80,
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: vertical ? "center" : "left" }}>
          <div
            style={{
              opacity: logoSpring,
              transform: `translateY(${(1 - logoSpring) * 30}px)`,
              marginBottom: 24,
            }}
          >
            <AnimatedLogo scale={vertical ? 0.8 : 1} />
          </div>
          
          <div
            style={{
              fontSize: vertical ? 22 : 28,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 400,
              lineHeight: 1.6,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            La primera plataforma de
            <span style={{ color: COLORS.accent, fontWeight: 600 }}>
              {" "}LLMO{" "}
            </span>
            para optimizar tu visibilidad en buscadores IA
          </div>
        </div>
        
        {!vertical && <DashboardMockup frame={frame} />}
      </div>
    </AbsoluteFill>
  );
};

// Escena de características
const FeaturesScene: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  
  const features = [
    { icon: "📊", text: "Monitoriza menciones en IAs" },
    { icon: "🎯", text: "Optimiza tu contenido para LLMs" },
    { icon: "📈", text: "Trackea tu ranking en tiempo real" },
    { icon: "🚀", text: "Aumenta tu visibilidad AI" },
  ];
  
  return (
    <AbsoluteFill
      style={{
        background: COLORS.darker,
        justifyContent: "center",
        alignItems: "center",
        padding: vertical ? 60 : 100,
      }}
    >
      <FloatingParticles count={25} />
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: vertical ? "1fr" : "1fr 1fr",
          gap: 24,
          maxWidth: 800,
          zIndex: 1,
        }}
      >
        {features.map((feature, i) => {
          const delay = i * 12;
          const progress = interpolate(
            frame - delay,
            [0, 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 24,
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: 16,
                transform: `translateX(${(1 - progress) * 50}px)`,
                opacity: progress,
              }}
            >
              <span style={{ fontSize: 32 }}>{feature.icon}</span>
              <span
                style={{
                  fontSize: 20,
                  color: COLORS.light,
                  fontWeight: 500,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                {feature.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Escena CTA final
const CTAScene: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const buttonSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  
  const pulse = Math.sin(frame * 0.15) * 0.05 + 1;
  
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: vertical ? 60 : 100,
      }}
    >
      <FloatingParticles count={50} />
      
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ marginBottom: 32 }}>
          <AnimatedLogo scale={vertical ? 1 : 1.2} />
        </div>
        
        <div
          style={{
            fontSize: vertical ? 32 : 48,
            fontWeight: 700,
            color: COLORS.light,
            marginBottom: 16,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Domina el SEO del futuro
        </div>
        
        <div
          style={{
            fontSize: vertical ? 20 : 24,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 48,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Empieza gratis hoy
        </div>
        
        <div
          style={{
            transform: `scale(${buttonSpring * pulse})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "20px 48px",
              background: COLORS.gradient,
              borderRadius: 12,
              fontSize: 24,
              fontWeight: 700,
              color: "white",
              fontFamily: "Inter, system-ui, sans-serif",
              boxShadow: `0 0 40px ${COLORS.primary}80`,
            }}
          >
            llmfy.ai
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Componente principal del anuncio
export const LLMFYAd: React.FC<LLMFYAdProps> = ({ duration = "short", vertical = false }) => {
  const isShort = duration === "short";
  
  // Timing para versión corta (15s = 450 frames)
  const shortTiming = {
    hook: { start: 0, duration: 90 },      // 0-3s
    problem: { start: 90, duration: 90 },   // 3-6s
    solution: { start: 180, duration: 120 }, // 6-10s
    cta: { start: 300, duration: 150 },     // 10-15s
  };
  
  // Timing para versión completa (30s = 900 frames)
  const fullTiming = {
    hook: { start: 0, duration: 150 },      // 0-5s
    problem: { start: 150, duration: 180 }, // 5-11s
    solution: { start: 330, duration: 180 }, // 11-17s
    features: { start: 510, duration: 180 }, // 17-23s
    cta: { start: 690, duration: 210 },     // 23-30s
  };
  
  const timing = isShort ? shortTiming : fullTiming;
  
  return (
    <AbsoluteFill style={{ background: COLORS.darker }}>
      <Sequence from={timing.hook.start} durationInFrames={timing.hook.duration}>
        <HookScene vertical={vertical} />
      </Sequence>
      
      <Sequence from={timing.problem.start} durationInFrames={timing.problem.duration}>
        <ProblemScene vertical={vertical} />
      </Sequence>
      
      <Sequence from={timing.solution.start} durationInFrames={timing.solution.duration}>
        <SolutionScene vertical={vertical} />
      </Sequence>
      
      {!isShort && (
        <Sequence from={fullTiming.features.start} durationInFrames={fullTiming.features.duration}>
          <FeaturesScene vertical={vertical} />
        </Sequence>
      )}
      
      <Sequence from={timing.cta.start} durationInFrames={timing.cta.duration}>
        <CTAScene vertical={vertical} />
      </Sequence>
    </AbsoluteFill>
  );
};
