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
// LLMFY YOUTUBE AD V2 - 30 SECONDS PREMIUM VIDEO
// Enhanced visuals with gradients, animations, and effects
// ============================================

// Brand Colors
const COLORS = {
  primary: "#6366F1", // Indigo 500
  primaryDark: "#4F46E5", // Indigo 600
  primaryLight: "#818CF8", // Indigo 400
  accent: "#A855F7", // Purple 500
  accentLight: "#C084FC", // Purple 400
  accentDark: "#7C3AED", // Violet 600
  dark: "#0F0D1A",
  darker: "#080612",
  white: "#FFFFFF",
  gray: "#9CA3AF",
  grayLight: "#E5E7EB",
  cyan: "#22D3EE",
  pink: "#EC4899",
};

// ============================================
// SHARED COMPONENTS
// ============================================

// Aurora Borealis Background Effect
const AuroraBackground: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <>
      {/* Aurora Layer 1 */}
      <div
        style={{
          position: "absolute",
          width: "150%",
          height: "60%",
          top: "-10%",
          left: "-25%",
          background: `linear-gradient(${90 + Math.sin(frame * 0.02) * 20}deg,
            transparent 0%,
            ${COLORS.primary}30 20%,
            ${COLORS.accent}25 40%,
            ${COLORS.cyan}20 60%,
            transparent 80%)`,
          filter: "blur(80px)",
          transform: `translateX(${Math.sin(frame * 0.015) * 100}px) rotate(${Math.sin(frame * 0.01) * 5}deg)`,
          opacity: 0.6 * intensity,
        }}
      />
      {/* Aurora Layer 2 */}
      <div
        style={{
          position: "absolute",
          width: "120%",
          height: "50%",
          top: "0%",
          left: "-10%",
          background: `linear-gradient(${70 + Math.cos(frame * 0.025) * 15}deg,
            transparent 0%,
            ${COLORS.accentDark}25 30%,
            ${COLORS.primary}30 50%,
            ${COLORS.pink}15 70%,
            transparent 90%)`,
          filter: "blur(100px)",
          transform: `translateX(${Math.cos(frame * 0.02) * 80}px) rotate(${Math.cos(frame * 0.015) * 3}deg)`,
          opacity: 0.5 * intensity,
        }}
      />
    </>
  );
};

// Scanlines Effect
const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "200%",
        top: 0,
        left: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,${opacity}) 2px,
          rgba(255,255,255,${opacity}) 4px
        )`,
        transform: `translateY(${(frame * 0.5) % 4}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

// Film Grain Effect
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.015 }) => {
  const frame = useCurrentFrame();
  // Use frame to create pseudo-random noise pattern
  const seed = frame * 1.5;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${Math.floor(seed)}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        mixBlendMode: "overlay",
      }}
    />
  );
};

// Vignette Effect
const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.4 }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: "none",
      }}
    />
  );
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

  // Multi-layer glow pulse
  const glowIntensity1 = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.7]);
  const glowIntensity2 = interpolate(Math.sin(frame * 0.08 + 1), [-1, 1], [0.2, 0.5]);
  const glowIntensity3 = interpolate(Math.cos(frame * 0.12), [-1, 1], [0.15, 0.4]);

  // Shimmer effect for logo text
  const shimmerX = interpolate(frame, [0, 60, 120], [-200, 400, -200], {
    extrapolateRight: "extend",
  });

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

  // Particles with trails
  const particles = Array.from({ length: 25 }, (_, i) => {
    const baseX = Math.sin(i * 0.5) * 400;
    const baseY = Math.cos(i * 0.7) * 300;
    const moveX = Math.sin(frame * 0.02 + i) * 50;
    const moveY = Math.cos(frame * 0.015 + i * 0.5) * 30;

    return {
      x: baseX + moveX,
      y: baseY + moveY,
      prevX: baseX + Math.sin((frame - 5) * 0.02 + i) * 50,
      prevY: baseY + Math.cos((frame - 5) * 0.015 + i * 0.5) * 30,
      size: 3 + Math.sin(i) * 2,
      opacity: 0.4 + Math.sin(frame * 0.05 + i) * 0.3,
      color: i % 3 === 0 ? COLORS.primary : i % 3 === 1 ? COLORS.accent : COLORS.cyan,
    };
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Aurora Background */}
      <AuroraBackground intensity={logoOpacity} />

      {/* Animated background grid */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          backgroundImage: `
            linear-gradient(${COLORS.primary}12 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.primary}12 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translate(-25%, -25%) rotate(${frame * 0.05}deg)`,
          opacity: 0.4,
        }}
      />

      {/* Floating particles with trails */}
      {particles.map((p, i) => (
        <React.Fragment key={i}>
          {/* Trail */}
          <div
            style={{
              position: "absolute",
              left: `calc(50% + ${p.prevX}px)`,
              top: `calc(50% + ${p.prevY}px)`,
              width: p.size * 3,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${p.color}60)`,
              transform: `rotate(${Math.atan2(p.y - p.prevY, p.x - p.prevX) * 180 / Math.PI}deg)`,
              opacity: p.opacity * 0.5 * logoOpacity,
              filter: "blur(2px)",
            }}
          />
          {/* Particle */}
          <div
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              opacity: p.opacity * logoOpacity,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              filter: "blur(0.5px)",
            }}
          />
        </React.Fragment>
      ))}

      {/* Multi-layer glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}${Math.floor(glowIntensity3 * 40).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
          filter: "blur(100px)",
          opacity: logoOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primary}${Math.floor(glowIntensity2 * 60).toString(16).padStart(2, '0')} 0%, transparent 65%)`,
          filter: "blur(80px)",
          opacity: logoOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.primaryLight}${Math.floor(glowIntensity1 * 80).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
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
              boxShadow: `0 20px 60px ${COLORS.primary}60, 0 0 40px ${COLORS.accent}40`,
              position: "relative",
              overflow: "hidden",
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

          {/* Wordmark with shimmer */}
          <div
            style={{
              fontSize: 90,
              fontWeight: 800,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.02em",
              background: `linear-gradient(90deg, ${COLORS.grayLight} ${shimmerX - 10}%, rgba(255,255,255,0.95) ${shimmerX}%, ${COLORS.grayLight} ${shimmerX + 10}%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",
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
            fontSize: 48,
            fontWeight: 700,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: COLORS.white,
            lineHeight: 1.2,
          }}
        >
          ¿Tu web aparece en las{" "}
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Google AI Overviews
          </span>
          ?
        </div>
      </div>

      {/* Scanlines */}
      <Scanlines opacity={0.02} />

      {/* Vignette */}
      <Vignette intensity={0.3} />

      {/* Film Grain */}
      <FilmGrain opacity={0.012} />
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

  // Animated percentages for each stat
  const stat1Value = Math.min(
    parseFloat(interpolate(frame, [20, 80], [0, 73.7]).toFixed(1)),
    73.7
  );
  const stat2Value = Math.min(
    parseFloat(interpolate(frame, [35, 80], [0, 3.2]).toFixed(1)),
    3.2
  );
  const stat3Value = Math.min(
    Math.floor(interpolate(frame, [50, 80], [0, 20])),
    20
  );

  // Spark effect when counter completes
  const showSparks = frame > 80;
  const sparkOpacity = interpolate(frame, [80, 100], [1, 0], { extrapolateRight: "clamp" });

  // Glitch effect - deterministic pseudo-random based on frame
  const pseudoRandom = Math.sin(frame * 12.9898 + 78.233) * 43758.5453 % 1;
  const glitchOffset = frame % 30 < 2 ? pseudoRandom * 4 - 2 : 0;
  const glitchOpacity = frame % 45 < 3 ? 0.7 : 1;

  // Pulse effect for cards
  const pulse1 = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.98, 1.02]);
  const pulse2 = interpolate(Math.sin(frame * 0.08 + 1), [-1, 1], [0.98, 1.02]);
  const pulse3 = interpolate(Math.sin(frame * 0.08 + 2), [-1, 1], [0.98, 1.02]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.darker} 0%, ${COLORS.dark} 100%)`,
        padding: 100,
        overflow: "hidden",
      }}
    >
      {/* Mesh gradient background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-10%",
            top: "-20%",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.accent}20 0%, transparent 60%)`,
            filter: "blur(80px)",
            transform: `translate(${Math.sin(frame * 0.02) * 30}px, ${Math.cos(frame * 0.015) * 20}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-15%",
            bottom: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.primary}15 0%, transparent 60%)`,
            filter: "blur(100px)",
            transform: `translate(${Math.cos(frame * 0.025) * 25}px, ${Math.sin(frame * 0.02) * 25}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "40%",
            top: "30%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.pink}10 0%, transparent 60%)`,
            filter: "blur(120px)",
            transform: `translate(${Math.sin(frame * 0.018) * 40}px, ${Math.cos(frame * 0.022) * 30}px)`,
          }}
        />
      </div>

      {/* Title with warning icon */}
      <div
        style={{
          opacity: fadeIn,
          marginBottom: 80,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginBottom: 20,
          }}
        >
          {/* Animated warning icon */}
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${interpolate(Math.sin(frame * 0.15), [-1, 1], [0.9, 1.1])})`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke={COLORS.accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: COLORS.accent,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            El Problema
          </div>
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
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Stat 1 - 70% */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.accent}10 100%)`,
            borderRadius: 24,
            padding: 50,
            border: `1px solid ${COLORS.primary}40`,
            transform: `scale(${stat1Progress * pulse1})`,
            opacity: stat1Progress,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Pulse border effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              border: `2px solid ${COLORS.primary}`,
              opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.1, 0.4]),
            }}
          />
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "system-ui, -apple-system, sans-serif",
              position: "relative",
            }}
          >
            {stat1Value}%
            {/* Sparks when complete */}
            {showSparks && Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: COLORS.primary,
                  top: "50%",
                  left: "50%",
                  transform: `translate(${Math.cos(i * Math.PI / 4) * (frame - 80) * 2}px, ${Math.sin(i * Math.PI / 4) * (frame - 80) * 2}px)`,
                  opacity: sparkOpacity,
                  boxShadow: `0 0 6px ${COLORS.primary}`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 22,
              color: COLORS.gray,
              marginTop: 10,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            de búsquedas siguen en Google
          </div>
          <div
            style={{
              fontSize: 14,
              color: COLORS.gray,
              marginTop: 6,
              fontFamily: "system-ui, -apple-system, sans-serif",
              opacity: 0.6,
            }}
          >
            SparkToro/Datos 2026
          </div>
        </div>

        {/* Stat 2 - 0 */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.primary}10 100%)`,
            borderRadius: 24,
            padding: 50,
            border: `1px solid ${COLORS.accent}40`,
            transform: `scale(${stat2Progress * pulse2})`,
            opacity: stat2Progress,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              border: `2px solid ${COLORS.accent}`,
              opacity: interpolate(Math.sin(frame * 0.1 + 1), [-1, 1], [0.1, 0.4]),
            }}
          />
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {stat2Value}%
          </div>
          <div
            style={{
              fontSize: 22,
              color: COLORS.gray,
              marginTop: 10,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            herramientas IA (ChatGPT, etc.)
          </div>
          <div
            style={{
              fontSize: 14,
              color: COLORS.gray,
              marginTop: 6,
              fontFamily: "system-ui, -apple-system, sans-serif",
              opacity: 0.6,
            }}
          >
            Todas combinadas
          </div>
        </div>

        {/* Stat 3 - Infinity with glitch */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${COLORS.primary}20 0%, ${COLORS.accent}10 100%)`,
            borderRadius: 24,
            padding: 50,
            border: `1px solid ${COLORS.primary}40`,
            transform: `scale(${stat3Progress * pulse3})`,
            opacity: stat3Progress,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              border: `2px solid ${COLORS.primary}`,
              opacity: interpolate(Math.sin(frame * 0.1 + 2), [-1, 1], [0.1, 0.4]),
            }}
          />
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: "#EF4444",
              fontFamily: "system-ui, -apple-system, sans-serif",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "relative",
                display: "inline-block",
                transform: `translateX(${glitchOffset}px)`,
                opacity: glitchOpacity,
              }}
            >
              -{stat3Value}%
            </span>
            {/* Glitch overlay */}
            {frame % 30 < 2 && (
              <span
                style={{
                  position: "absolute",
                  left: 2,
                  top: 0,
                  color: COLORS.cyan,
                  opacity: 0.5,
                  clipPath: "inset(30% 0 40% 0)",
                }}
              >
                -{stat3Value}%
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 22,
              color: COLORS.gray,
              marginTop: 10,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            tráfico orgánico por AI Overviews
          </div>
          <div
            style={{
              fontSize: 14,
              color: COLORS.gray,
              marginTop: 6,
              fontFamily: "system-ui, -apple-system, sans-serif",
              opacity: 0.6,
            }}
          >
            Datos propios de agencia
          </div>
        </div>
      </div>

      <Vignette intensity={0.35} />
      <FilmGrain opacity={0.015} />
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

  // 3-column layout: left (4), center (3), right (4)
  const columns: {
    emoji: string;
    title: string;
    desc: string;
    color: string;
    isNew: boolean;
  }[][] = [
    // Left column (4 features)
    [
      { emoji: "📊", title: "LLMO Score", desc: "Puntuación de optimización IA", color: COLORS.primary, isNew: false },
      { emoji: "🔍", title: "Prompt Tracker", desc: "Monitoriza tu visibilidad en 5 plataformas IA", color: COLORS.cyan, isNew: true },
      { emoji: "💬", title: "Brand Sentiment", desc: "Análisis de sentimiento de marca", color: COLORS.accent, isNew: false },
      { emoji: "📎", title: "LLM Citability", desc: "Probabilidad de citación por LLMs", color: COLORS.pink, isNew: false },
    ],
    // Center column (3 features)
    [
      { emoji: "🛡️", title: "E-E-A-T Audit", desc: "Auditoría de confianza y autoridad", color: COLORS.primary, isNew: false },
      { emoji: "📈", title: "AI Analytics", desc: "Tráfico IA en tu Google Analytics", color: COLORS.accent, isNew: true },
      { emoji: "🤖", title: "Robots.txt Optimizer", desc: "Controla el acceso de bots IA", color: COLORS.primary, isNew: false },
    ],
    // Right column (4 features)
    [
      { emoji: "🏷️", title: "Schema Scan", desc: "Datos estructurados para IA", color: COLORS.accent, isNew: false },
      { emoji: "🏗️", title: "AI Building", desc: "Vecindario de co-citación IA", color: COLORS.cyan, isNew: true },
      { emoji: "🧠", title: "Semantic Analysis", desc: "Profundidad semántica vs competencia", color: COLORS.cyan, isNew: false },
      { emoji: "⚡", title: "IndexNow", desc: "Notifica cambios a buscadores al instante", color: COLORS.pink, isNew: false },
    ],
  ];

  // Column animation delays (wave from left to right)
  const columnDelays = [0, 15, 25];

  // Circuit pattern lines
  const circuitLines = Array.from({ length: 8 }, (_, i) => ({
    x1: 100 + i * 200,
    y1: 150,
    x2: 200 + i * 200,
    y2: 250 + (i % 2) * 100,
    delay: i * 15,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
        padding: "50px 60px",
        overflow: "hidden",
      }}
    >
      {/* Circuit pattern background */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          opacity: 0.15,
        }}
      >
        {circuitLines.map((line, i) => {
          const progress = interpolate(frame - line.delay, [0, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={i}>
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x1 + (line.x2 - line.x1) * progress}
                y2={line.y1 + (line.y2 - line.y1) * progress}
                stroke={i % 2 === 0 ? COLORS.primary : COLORS.accent}
                strokeWidth="2"
              />
              <circle
                cx={line.x1 + (line.x2 - line.x1) * progress}
                cy={line.y1 + (line.y2 - line.y1) * progress}
                r="4"
                fill={i % 2 === 0 ? COLORS.primary : COLORS.accent}
                opacity={progress}
              />
            </g>
          );
        })}
      </svg>

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
          marginBottom: 25,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.primary,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: 14,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          La Solución
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.1,
            color: COLORS.white,
          }}
        >
          Optimiza para{" "}
          <span style={{ color: COLORS.accent }}>ChatGPT</span>,{" "}
          <span style={{ color: COLORS.cyan }}>Perplexity</span>,{" "}
          <span style={{ color: COLORS.primary }}>Claude</span> y{" "}
          <span style={{ color: COLORS.pink }}>Google AI</span>
        </div>
      </div>

      {/* Features Grid — 3 columns */}
      <div
        style={{
          display: "flex",
          gap: 16,
          maxWidth: 1760,
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
          justifyContent: "center",
        }}
      >
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              flex: colIdx === 1 ? "0 0 31%" : "0 0 31%",
            }}
          >
            {col.map((feature, rowIdx) => {
              const cardDelay = 20 + columnDelays[colIdx] + rowIdx * 5;
              const cardProgress = spring({
                frame: frame - cardDelay,
                fps,
                config: { damping: 12, stiffness: 80 },
              });

              const sweepAngle = interpolate(
                (frame - cardDelay) % 120,
                [0, 120],
                [0, 360]
              );

              return (
                <div
                  key={rowIdx}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
                    borderRadius: 16,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transform: `scale(${cardProgress}) translateY(${(1 - cardProgress) * 30}px)`,
                    opacity: cardProgress,
                    boxShadow: `0 12px 30px ${COLORS.darker}80`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Border with light sweep */}
                  <div
                    style={{
                      position: "absolute",
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      borderRadius: 18,
                      background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, ${feature.color} 30deg, transparent 60deg)`,
                      opacity: cardProgress * 0.6,
                    }}
                  />
                  {/* Static border */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 16,
                      border: `1px solid ${feature.color}40`,
                    }}
                  />

                  {/* Emoji icon container */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${feature.color}30 0%, ${feature.color}10 100%)`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      zIndex: 1,
                      boxShadow: `0 0 20px ${feature.color}30`,
                      fontSize: 22,
                    }}
                  >
                    {feature.emoji}
                  </div>

                  <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: COLORS.white,
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      >
                        {feature.title}
                      </div>
                      {feature.isNew && (
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: COLORS.white,
                            background: COLORS.accentLight,
                            padding: "1px 6px",
                            borderRadius: 5,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                          }}
                        >
                          NEW
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: COLORS.gray,
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        lineHeight: 1.3,
                      }}
                    >
                      {feature.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Vignette intensity={0.35} />
      <FilmGrain opacity={0.015} />
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

  // Cursor animation
  const cursorX = interpolate(frame, [40, 80, 120], [200, 600, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cursorY = interpolate(frame, [40, 80, 120], [200, 300, 250], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cursorOpacity = interpolate(frame, [40, 50, 130, 140], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress bars animation with glow
  const progressBars = [
    { label: "Experiencia", value: 85, color: COLORS.primary },
    { label: "Conocimiento", value: 92, color: COLORS.accent },
    { label: "Autoridad", value: 78, color: COLORS.primaryLight },
    { label: "Confianza", value: 88, color: COLORS.accentLight },
  ];

  // Data particles flowing towards dashboard
  const dataParticles = Array.from({ length: 15 }, (_, i) => {
    const angle = (i / 15) * Math.PI * 2;
    const radius = 600 - frame * 3;
    const x = Math.cos(angle) * Math.max(radius, 0);
    const y = Math.sin(angle) * Math.max(radius, 0) * 0.5;
    return {
      x,
      y,
      opacity: interpolate(radius, [0, 200, 600], [0, 1, 0.3]),
      size: 4 + Math.sin(i) * 2,
    };
  });

  // Score ring particles
  const ringParticles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + frame * 0.02;
    return {
      x: Math.cos(angle) * 140,
      y: Math.sin(angle) * 140,
      opacity: 0.3 + Math.sin(frame * 0.1 + i) * 0.2,
    };
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.darker} 0%, ${COLORS.dark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        overflow: "hidden",
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

      {/* Data particles */}
      {dataParticles.map((p, i) => (
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
            opacity: p.opacity * dashboardScale,
            boxShadow: `0 0 10px ${i % 2 === 0 ? COLORS.primary : COLORS.accent}`,
          }}
        />
      ))}

      {/* Dashboard mockup with glassmorphism */}
      <div
        style={{
          width: "100%",
          maxWidth: 1600,
          background: `linear-gradient(135deg, ${COLORS.dark}E0 0%, ${COLORS.darker}F0 100%)`,
          backdropFilter: "blur(20px)",
          borderRadius: 32,
          border: `1px solid ${COLORS.primary}40`,
          overflow: "hidden",
          transform: `scale(${dashboardScale})`,
          boxShadow: `0 40px 100px ${COLORS.darker}, 0 0 60px ${COLORS.primary}20`,
          position: "relative",
        }}
      >
        {/* Glassmorphism reflection */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* Header bar */}
        <div
          style={{
            background: `${COLORS.darker}E0`,
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
                boxShadow: `0 0 40px ${COLORS.primary}30`,
              }}
            >
              {/* Ring particles */}
              {ringParticles.map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: COLORS.primaryLight,
                    left: `calc(50% + ${p.x}px - 3px)`,
                    top: `calc(50% + ${p.y}px - 3px)`,
                    opacity: p.opacity,
                    boxShadow: `0 0 8px ${COLORS.primary}`,
                  }}
                />
              ))}
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

              const glowPulse = interpolate(
                Math.sin(frame * 0.1 + i),
                [-1, 1],
                [0.3, 0.8]
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
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${barProgress}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${bar.color} 0%, ${bar.color}80 100%)`,
                        borderRadius: 6,
                        boxShadow: `0 0 ${20 * glowPulse}px ${bar.color}${Math.floor(glowPulse * 99).toString(16).padStart(2, '0')}`,
                        position: "relative",
                      }}
                    >
                      {/* Shimmer on progress bar */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                          transform: `translateX(${((frame * 2) % 200) - 100}%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated cursor */}
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            opacity: cursorOpacity,
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M5 3l14 9-8 2-2 8z"
              fill={COLORS.white}
              stroke={COLORS.dark}
              strokeWidth="1"
            />
          </svg>
          {/* Click ripple */}
          {frame > 75 && frame < 90 && (
            <div
              style={{
                position: "absolute",
                width: (frame - 75) * 4,
                height: (frame - 75) * 4,
                borderRadius: "50%",
                border: `2px solid ${COLORS.primary}`,
                left: 0,
                top: 0,
                transform: "translate(-50%, -50%)",
                opacity: 1 - (frame - 75) / 15,
              }}
            />
          )}
        </div>
      </div>

      <Scanlines opacity={0.009} />
      <Vignette intensity={0.35} />
      <FilmGrain opacity={0.015} />
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

  // Button shine sweep
  const shineSweep = interpolate(frame % 90, [0, 90], [-100, 400]);

  // Logo breathing
  const logoBreathing = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.98, 1.02]
  );

  // Spotlight effect
  const spotlightX = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [-100, 100]
  );

  // Enhanced confetti with physics
  const confettiParticles = Array.from({ length: 40 }, (_, i) => {
    const startX = (i / 40) * 1920;
    const speed = 2 + (i % 5) * 0.5;
    const wobble = Math.sin(frame * 0.05 + i) * 50;
    const rotationSpeed = (i % 2 === 0 ? 1 : -1) * (2 + i % 3);
    const size = 6 + Math.abs(Math.sin(i * 12.9898 + frame * 78.233)) % 1 * 10;
    const shape = i % 4; // 0: circle, 1: rect, 2: star, 3: diamond

    return {
      x: startX + wobble,
      y: -60 + (frame * speed) % 1300,
      rotation: frame * rotationSpeed + i * 30,
      size,
      shape,
      color: i % 4 === 0 ? COLORS.primary :
             i % 4 === 1 ? COLORS.accent :
             i % 4 === 2 ? COLORS.cyan : COLORS.pink,
      opacity: 0.7,
    };
  });

  // Ripple waves from button
  const ripples = Array.from({ length: 3 }, (_, i) => {
    const rippleFrame = (frame + i * 30) % 90;
    return {
      scale: 1 + rippleFrame * 0.03,
      opacity: 1 - rippleFrame / 90,
    };
  });

  const getConfettiShape = (shape: number, size: number, color: string, rotation: number) => {
    switch (shape) {
      case 0: // Circle
        return { borderRadius: "50%", width: size, height: size };
      case 1: // Rectangle
        return { borderRadius: "2px", width: size, height: size * 0.4 };
      case 2: // Star (using clip-path)
        return {
          width: size,
          height: size,
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        };
      case 3: // Diamond
        return {
          width: size * 0.7,
          height: size,
          transform: `rotate(${rotation}deg)`,
          borderRadius: "2px",
        };
      default:
        return { borderRadius: "50%", width: size, height: size };
    }
  };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${COLORS.dark} 0%, ${COLORS.darker} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Spotlight effect */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 800,
          background: `radial-gradient(ellipse at 50% 0%, ${COLORS.primary}20 0%, transparent 70%)`,
          top: -200,
          left: `calc(50% - 300px + ${spotlightX}px)`,
          filter: "blur(40px)",
        }}
      />

      {/* Animated confetti particles */}
      {confettiParticles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            background: p.color,
            opacity: p.opacity,
            transform: `rotate(${p.rotation}deg)`,
            ...getConfettiShape(p.shape, p.size, p.color, p.rotation),
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
          Aparece en las AI Overviews y en los LLMs
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 32,
            color: COLORS.gray,
            marginBottom: 15,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          ¿Qué puntuación tiene tu web para los LLMs?
        </div>

        {/* Secondary line */}
        <div
          style={{
            fontSize: 24,
            color: COLORS.gray,
            marginBottom: 60,
            fontFamily: "system-ui, -apple-system, sans-serif",
            opacity: 0.8,
          }}
        >
          Sin tarjeta • Sin spam • Solo resultados
        </div>

        {/* CTA Button with ripples */}
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Ripple waves */}
          {ripples.map((ripple, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${ripple.scale})`,
                width: "100%",
                height: "100%",
                borderRadius: 20,
                border: `2px solid ${COLORS.primary}`,
                opacity: ripple.opacity * 0.5,
                pointerEvents: "none",
              }}
            />
          ))}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              padding: "28px 60px",
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              borderRadius: 20,
              transform: `scale(${buttonPulse})`,
              boxShadow: `0 20px 60px ${COLORS.primary}50, 0 0 40px ${COLORS.accent}30`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Button shine sweep */}
            <div
              style={{
                position: "absolute",
                width: 60,
                height: "200%",
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                left: shineSweep,
                top: "-50%",
                transform: "skewX(-20deg)",
              }}
            />

            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: "system-ui, -apple-system, sans-serif",
                position: "relative",
              }}
            >
              Analiza tu web AHORA
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
              style={{ position: "relative" }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Logo at bottom with breathing effect */}
        <div
          style={{
            marginTop: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            transform: `scale(${logoBreathing})`,
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
              boxShadow: `0 0 30px ${COLORS.primary}40`,
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
            llmfy.ai
          </span>
        </div>
      </div>

      <Scanlines opacity={0.009} />
      <Vignette intensity={0.4} />
      <FilmGrain opacity={0.012} />
    </AbsoluteFill>
  );
};

// ============================================
// TRANSITION COMPONENT
// ============================================
const SceneTransition: React.FC<{ children: React.ReactNode; fadeFrames?: number }> = ({
  children,
  fadeFrames = 12
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// ============================================
export const LLMFYAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.darker }}>
      {/* Background Music V2 */}
      <Audio
        src={staticFile("audio/backgroundv2.mp3")}
        volume={0.25}
        startFrom={0}
      />

      {/* Voiceover V4 */}
      <Audio
        src={staticFile("audio/voiceoverv5.mp3")}
        volume={1}
        startFrom={0}
      />

      {/* Scene 1: Logo + Hook (0-5 sec = frames 0-150) */}
      <Sequence from={0} durationInFrames={150}>
        <SceneTransition fadeFrames={10}>
          <Scene1_LogoHook />
        </SceneTransition>
      </Sequence>

      {/* Scene 2: Problem (5-12 sec = frames 150-360) */}
      <Sequence from={150} durationInFrames={210}>
        <SceneTransition fadeFrames={10}>
          <Scene2_Problem />
        </SceneTransition>
      </Sequence>

      {/* Scene 3: Solution (12-20 sec = frames 360-600) */}
      <Sequence from={360} durationInFrames={240}>
        <SceneTransition fadeFrames={10}>
          <Scene3_Solution />
        </SceneTransition>
      </Sequence>

      {/* Scene 4: Demo (20-25 sec = frames 600-750) */}
      <Sequence from={600} durationInFrames={150}>
        <SceneTransition fadeFrames={10}>
          <Scene4_Demo />
        </SceneTransition>
      </Sequence>

      {/* Scene 5: CTA (25-30 sec = frames 750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <SceneTransition fadeFrames={10}>
          <Scene5_CTA />
        </SceneTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
