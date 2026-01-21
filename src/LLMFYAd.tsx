import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
  Audio,
  staticFile,
} from "remotion";
import React from "react";

// ============================================
// LLMFY YOUTUBE AD - 30 SECONDS PREMIUM VIDEO
// ============================================

// Brand Colors
const COLORS = {
  primary: "#6366F1", // Indigo 500
  primaryDark: "#4F46E5", // Indigo 600
  primaryLight: "#818CF8", // Indigo 400
  accent: "#A855F7", // Purple 500
  accentLight: "#C084FC", // Purple 400
  dark: "#0F0D1A",
  darker: "#080612",
  white: "#FFFFFF",
  gray: "#9CA3AF",
  grayLight: "#E5E7EB",
};

// ============================================
// SCENE 1: LOGO + HOOK (0-5 seconds)
// ============================================
const Scene1_LogoHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.7]
  );

  // Hook text animation
  const hookOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hookY = interpolate(frame, [30, 50], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.sin(i * 0.5) * 400 + Math.sin(frame * 0.02 + i) * 50,
    y: Math.cos(i * 0.7) * 300 + Math.cos(frame * 0.015 + i * 0.5) * 30,
    size: 2 + Math.sin(i) * 1.5,
    opacity: 0.3 + Math.sin(frame * 0.05 + i) * 0.2,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          backgroundImage: `
            linear-gradient(${COLORS.primary}15 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.primary}15 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translate(-25%, -25%) rotate(${frame * 0.05}deg)`,
          opacity: 0.5,
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 2 === 0 ? COLORS.primary : COLORS.accent,
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            opacity: p.opacity * logoOpacity,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}${Math.floor(glowIntensity * 99).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          filter: "blur(60px)",
          opacity: logoOpacity,
        }}
      />

      {/* Logo Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        {/* Logo Mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 30,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 20px 60px ${COLORS.primary}60`,
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontSize: 90,
              fontWeight: 800,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.02em",
              background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.grayLight} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LLMFY
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.gray,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          AI Search Optimization
        </div>
      </div>

      {/* Hook Text */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          opacity: hookOpacity,
          transform: `translateY(${hookY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: COLORS.white,
            lineHeight: 1.2,
          }}
        >
          ¿Tu web aparece cuando{" "}
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ChatGPT
          </span>{" "}
          responde?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2: THE PROBLEM (5-12 seconds)
// ============================================
const Scene2_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Stats animation
  const stat1Progress = spring({ frame: frame - 20, fps, config: { damping: 15 } });
  const stat2Progress = spring({ frame: frame - 35, fps, config: { damping: 15 } });
  const stat3Progress = spring({ frame: frame - 50, fps, config: { damping: 15 } });

  // Animated percentage
  const percentage = Math.min(Math.floor(interpolate(frame, [20, 80], [0, 70])), 70);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.darker} 0%, ${COLORS.dark} 100%)`,
        padding: 100,
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          right: -200,
          top: -200,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}15 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      {/* Title */}
      <div
        style={{
          opacity: fadeIn,
          marginBottom: 80,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: COLORS.accent,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: 20,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          El Problema
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.1,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          El SEO tradicional ya no es suficiente
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 40,
        }}
      >
        {/* Stat 1 */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.accent}10 100%)`,
            borderRadius: 24,
            padding: 50,
            border: `1px solid ${COLORS.primary}30`,
            transform: `scale(${stat1Progress})`,
            opacity: stat1Progress,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {percentage}%
          </div>
          <div
            style={{
              fontSize: 24,
              color: COLORS.gray,
              marginTop: 10,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            de usuarios usan IA para buscar
          </div>
        </div>

        {/* Stat 2 */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.primary}10 100%)`,
            borderRadius: 24,
            padding: 50,
            border: `1px solid ${COLORS.accent}30`,
            transform: `scale(${stat2Progress})`,
            opacity: stat2Progress,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            0
          </div>
          <div
            style={{
              fontSize: 24,
              color: COLORS.gray,
              marginTop: 10,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            herramientas de optimización para LLMs
          </div>
        </div>

        {/* Stat 3 */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.accent}10 100%)`,
            borderRadius: 24,
            padding: 50,
            border: `1px solid ${COLORS.primary}30`,
            transform: `scale(${stat3Progress})`,
            opacity: stat3Progress,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: "#EF4444",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            ∞
          </div>
          <div
            style={{
              fontSize: 24,
              color: COLORS.gray,
              marginTop: 10,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            oportunidades perdidas cada día
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 3: THE SOLUTION (12-20 seconds)
// ============================================
const Scene3_Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Feature cards animation
  const features = [
    { icon: "🎯", title: "E-E-A-T Audit", desc: "Analiza tu autoridad y confianza" },
    { icon: "📊", title: "Schema Scan", desc: "Optimiza datos estructurados" },
    { icon: "🧠", title: "Semantic Analysis", desc: "Compara con competidores" },
    { icon: "⚡", title: "LLM Optimization", desc: "Mejora citabilidad en IAs" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
        padding: 100,
      }}
    >
      {/* Animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}30 0%, transparent 70%)`,
          filter: "blur(80px)",
          transform: `translate(${Math.sin(frame * 0.03) * 30}px, ${Math.cos(frame * 0.02) * 20}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "15%",
          bottom: "15%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}25 0%, transparent 70%)`,
          filter: "blur(80px)",
          transform: `translate(${Math.cos(frame * 0.025) * 25}px, ${Math.sin(frame * 0.035) * 25}px)`,
        }}
      />

      {/* Header */}
      <div
        style={{
          opacity: fadeIn,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: COLORS.primary,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: 20,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          La Solución
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: COLORS.white }}>Optimiza para </span>
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ChatGPT, Perplexity, Claude
          </span>
        </div>
      </div>

      {/* Features Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {features.map((feature, i) => {
          const cardProgress = spring({
            frame: frame - 30 - i * 12,
            fps,
            config: { damping: 12, stiffness: 80 },
          });

          return (
            <div
              key={i}
              style={{
                background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
                borderRadius: 24,
                padding: 40,
                border: `1px solid ${COLORS.primary}40`,
                display: "flex",
                alignItems: "center",
                gap: 30,
                transform: `scale(${cardProgress}) translateY(${(1 - cardProgress) * 30}px)`,
                opacity: cardProgress,
                boxShadow: `0 20px 40px ${COLORS.darker}80`,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${COLORS.primary}30 0%, ${COLORS.accent}20 100%)`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 40,
                }}
              >
                {feature.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: COLORS.white,
                    marginBottom: 8,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {feature.title}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: COLORS.gray,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {feature.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 4: DEMO/DASHBOARD PREVIEW (20-25 seconds)
// ============================================
const Scene4_Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dashboardScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Animated score
  const score = Math.min(Math.floor(interpolate(frame, [30, 100], [0, 92])), 92);

  // Progress bars animation
  const progressBars = [
    { label: "Experience", value: 85, color: COLORS.primary },
    { label: "Expertise", value: 92, color: COLORS.accent },
    { label: "Authority", value: 78, color: COLORS.primaryLight },
    { label: "Trust", value: 88, color: COLORS.accentLight },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.darker} 0%, ${COLORS.dark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 50%, ${COLORS.primary}15 0%, transparent 60%)`,
        }}
      />

      {/* Dashboard mockup */}
      <div
        style={{
          width: "100%",
          maxWidth: 1600,
          background: COLORS.dark,
          borderRadius: 32,
          border: `1px solid ${COLORS.primary}30`,
          overflow: "hidden",
          transform: `scale(${dashboardScale})`,
          boxShadow: `0 40px 100px ${COLORS.darker}`,
        }}
      >
        {/* Header bar */}
        <div
          style={{
            background: COLORS.darker,
            padding: "20px 40px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: `1px solid ${COLORS.primary}20`,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#EF4444" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#F59E0B" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#22C55E" }} />
          <div
            style={{
              marginLeft: 30,
              padding: "8px 20px",
              background: COLORS.dark,
              borderRadius: 8,
              color: COLORS.gray,
              fontSize: 16,
              fontFamily: "monospace",
            }}
          >
            https://llmfy.ai/dashboard
          </div>
        </div>

        {/* Dashboard content */}
        <div
          style={{
            display: "flex",
            padding: 50,
            gap: 50,
          }}
        >
          {/* Left: Score */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 20,
                color: COLORS.gray,
                marginBottom: 20,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              LLM Optimization Score
            </div>
            <div
              style={{
                width: 250,
                height: 250,
                borderRadius: "50%",
                background: `conic-gradient(${COLORS.primary} ${score * 3.6}deg, ${COLORS.dark} 0deg)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: COLORS.dark,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: COLORS.white,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {score}
                </div>
                <div style={{ fontSize: 18, color: COLORS.gray }}>/ 100</div>
              </div>
            </div>
          </div>

          {/* Right: E-E-A-T bars */}
          <div
            style={{
              flex: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 30,
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: COLORS.white,
                marginBottom: 10,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              E-E-A-T Analysis
            </div>
            {progressBars.map((bar, i) => {
              const barProgress = interpolate(
                frame,
                [40 + i * 10, 80 + i * 10],
                [0, bar.value],
                { extrapolateRight: "clamp" }
              );

              return (
                <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        color: COLORS.gray,
                        fontSize: 18,
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {bar.label}
                    </span>
                    <span
                      style={{
                        color: COLORS.white,
                        fontSize: 18,
                        fontWeight: 600,
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      {Math.floor(barProgress)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 12,
                      background: COLORS.darker,
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${barProgress}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${bar.color} 0%, ${bar.color}80 100%)`,
                        borderRadius: 6,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 5: CTA (25-30 seconds)
// ============================================
const Scene5_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleIn = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const buttonPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [1, 1.05]
  );

  // Confetti-like particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i / 30) * 1920,
    y: -50 + frame * 3 + Math.sin(i * 2) * 100,
    rotation: frame * 2 + i * 30,
    size: 8 + Math.random() * 8,
    color: i % 3 === 0 ? COLORS.primary : i % 3 === 1 ? COLORS.accent : COLORS.primaryLight,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animated particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y % 1200 - 100,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: i % 2 === 0 ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}40 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scaleIn})`,
          zIndex: 10,
        }}
      >
        {/* Main headline */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: COLORS.white,
            marginBottom: 30,
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.1,
          }}
        >
          Domina el SEO del futuro
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 32,
            color: COLORS.gray,
            marginBottom: 60,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Prueba gratis 7 días • Cancela cuando quieras
        </div>

        {/* CTA Button */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "28px 60px",
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
            borderRadius: 20,
            transform: `scale(${buttonPulse})`,
            boxShadow: `0 20px 60px ${COLORS.primary}50`,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Empieza gratis en llmfy.ai
          </span>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        {/* Logo at bottom */}
        <div
          style={{
            marginTop: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            LLMFY
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
export const LLMFYAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.darker }}>
      {/* Background Music - Corporate Tech Upbeat */}
      {/* Descarga música de: https://pixabay.com/music/search/corporate%20technology/ */}
      {/* Guárdala en: public/audio/background.mp3 */}
      <Audio
        src={staticFile("audio/background.mp3")}
        volume={0.6}
        startFrom={0}
      />
      {/* Scene 1: Logo + Hook (0-5 sec = frames 0-150) */}
      <Sequence from={0} durationInFrames={150}>
        <Scene1_LogoHook />
      </Sequence>

      {/* Scene 2: Problem (5-12 sec = frames 150-360) */}
      <Sequence from={150} durationInFrames={210}>
        <Scene2_Problem />
      </Sequence>

      {/* Scene 3: Solution (12-20 sec = frames 360-600) */}
      <Sequence from={360} durationInFrames={240}>
        <Scene3_Solution />
      </Sequence>

      {/* Scene 4: Demo (20-25 sec = frames 600-750) */}
      <Sequence from={600} durationInFrames={150}>
        <Scene4_Demo />
      </Sequence>

      {/* Scene 5: CTA (25-30 sec = frames 750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <Scene5_CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
