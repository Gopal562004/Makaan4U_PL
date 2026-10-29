import React from "react";
import { Link } from "react-router-dom";

/**
 * ============================================================================
 * 🏛️ MAKAAN4U Haute Luxury Architectural Emblem & Typography System
 * ----------------------------------------------------------------------------
 * A prestigious, warm-toned architectural brand identity created specifically
 * for luxury Indian residential intelligence. Free of harsh black or childish
 * clip-art lines, it features an origami-faceted geometric pavilion monogram
 * ("M" + vaulted "U" gateway + structural "4"), crowned by a radiant 8-point
 * Polaris compass of verified authenticity.
 *
 * Infused with continuous subtle micro-animations (specular shimmer, breathing
 * gold star, elevation aura, and smooth spring physics transitions).
 * ============================================================================
 */

export const LogoMark = ({
  size = 40,
  className = "",
  animated = true,
  inverted = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 group/mark select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Ambient Warm Golden Aura Glow on Hover */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ease-out pointer-events-none opacity-40 group-hover/mark:opacity-100 ${
          animated
            ? "blur-md group-hover/mark:blur-lg scale-90 group-hover/mark:scale-110"
            : ""
        }`}
        style={{
          background: inverted
            ? "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(217, 91, 48, 0.15) 70%, transparent 100%)"
            : "radial-gradient(circle, rgba(230, 138, 46, 0.4) 0%, rgba(194, 78, 40, 0.2) 65%, transparent 100%)",
        }}
      />

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 w-full h-full transition-all duration-500 ease-out ${
          animated
            ? "transform group-hover/mark:-translate-y-0.5 group-hover/mark:scale-105"
            : ""
        }`}
        style={{
          filter: inverted
            ? "drop-shadow(0 4px 12px rgba(0,0,0,0.35))"
            : "drop-shadow(0 4px 14px rgba(184, 78, 48, 0.16))",
        }}
      >
        <defs>
          {/* Luminous Pearl Ivory Badge Canvas */}
          <linearGradient id="m4u-badge-surface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={inverted ? "#2C1E17" : "#FFFDF8"} />
            <stop offset="50%" stopColor={inverted ? "#221611" : "#FAF3E8"} />
            <stop offset="100%" stopColor={inverted ? "#1A100C" : "#F5E9D8"} />
          </linearGradient>

          {/* Regal 24K Champagne Gold Gradient */}
          <linearGradient id="m4u-gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Radiant Burnished Terracotta Luxury Gradient */}
          <linearGradient id="m4u-terracotta-rich" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2774B" />
            <stop offset="35%" stopColor="#D45327" />
            <stop offset="70%" stopColor="#B33E17" />
            <stop offset="100%" stopColor="#87290A" />
          </linearGradient>

          {/* Deep Antique Bronze Accent */}
          <linearGradient id="m4u-bronze-accent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#783A1D" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#C97A44" />
          </linearGradient>

          {/* Metallic Jewelry Badge Border */}
          <linearGradient id="m4u-badge-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="30%" stopColor="#D9653B" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B84E30" />
          </linearGradient>

          {/* Light-Ray Specular Beam for Shimmer Effect */}
          <linearGradient id="m4u-specular-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Star Polaris Radial Flare */}
          <radialGradient id="m4u-star-flare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Badge Clipping Boundary */}
          <clipPath id="m4u-badge-clip">
            <rect x="3.5" y="3.5" width="57" height="57" rx="15" />
          </clipPath>
        </defs>

        {/* ====================================================================
            1. LUXURY BADGE CHASSIS (Soft Octagonal Chamfered Squircle)
        ==================================================================== */}
        <rect
          x="3.5"
          y="3.5"
          width="57"
          height="57"
          rx="15"
          fill="url(#m4u-badge-surface)"
          stroke="url(#m4u-badge-border)"
          strokeWidth="1.6"
        />

        {/* Concentric Precision Inset Ring */}
        <rect
          x="6.5"
          y="6.5"
          width="51"
          height="51"
          rx="12"
          fill="none"
          stroke={inverted ? "rgba(245, 158, 11, 0.25)" : "rgba(217, 101, 59, 0.22)"}
          strokeWidth="0.9"
          strokeDasharray="4 2"
        />

        {/* Ambient Specular Shimmer Sweep Across Badge */}
        <g clipPath="url(#m4u-badge-clip)" className="pointer-events-none">
          <rect
            x="-40"
            y="-10"
            width="35"
            height="84"
            fill="url(#m4u-specular-shimmer)"
            className="animate-logo-shimmer"
          />
        </g>

        {/* Corner Micro-Accents (Horology Quadrant Nails) */}
        <circle cx="10" cy="10" r="1.1" fill="url(#m4u-gold-primary)" />
        <circle cx="54" cy="10" r="1.1" fill="url(#m4u-gold-primary)" />
        <circle cx="10" cy="54" r="1.1" fill="url(#m4u-gold-primary)" />
        <circle cx="54" cy="54" r="1.1" fill="url(#m4u-gold-primary)" />

        {/* ====================================================================
            2. SCULPTED ARCHITECTURAL MONOGRAM ("M" + VAULT GATEWAY + "4")
        ==================================================================== */}
        <g className="transition-transform duration-500 ease-out origin-center group-hover/mark:scale-[1.02]">
          {/* Subtle Ambient Floor Shadow beneath pillars */}
          <ellipse cx="32" cy="49" rx="19" ry="2" fill="rgba(184, 78, 48, 0.15)" />

          {/* Left Wing Outer Pillar (Isometric Perspective Facing Left) */}
          <path
            d="M 15 47 L 15 28 L 24 17 L 28 21.5 L 20.5 30 L 20.5 47 Z"
            fill="url(#m4u-terracotta-rich)"
          />

          {/* Left Inner Slope / Facet (Champagne Gold Highlight Plane) */}
          <path
            d="M 24 17 L 32 27 L 32 32.5 L 24 22 Z"
            fill="url(#m4u-gold-primary)"
          />

          {/* Right Inner Slope / Facet (Gleaming Amber Reflected Light) */}
          <path
            d="M 32 27 L 40 17 L 40 22 L 32 32.5 Z"
            fill="url(#m4u-gold-primary)"
          />

          {/* Right Wing Outer Pillar (Isometric Perspective Facing Right) */}
          <path
            d="M 40 17 L 49 28 L 49 47 L 43.5 47 L 43.5 30 L 36 21.5 Z"
            fill="url(#m4u-terracotta-rich)"
          />

          {/* Classical Romanesque Grand Vault Arch ("U" Gateway of Discovery) */}
          <path
            d="M 24 47 L 24 37 C 24 32 40 32 40 37 L 40 47"
            fill="none"
            stroke="url(#m4u-gold-primary)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Architectural Lintel & Transom Crossbar (Forms Numeral "4") */}
          <path
            d="M 22 39.5 L 42 39.5"
            stroke="url(#m4u-gold-primary)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Central Keystone Column / Monolith */}
          <path
            d="M 34 32.5 L 34 47"
            stroke="url(#m4u-terracotta-rich)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Double Architectural Foundation Pedestal (Zero Ground Settling) */}
          <line
            x1="12"
            y1="49.5"
            x2="52"
            y2="49.5"
            stroke="url(#m4u-gold-primary)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="17"
            y1="52"
            x2="47"
            y2="52"
            stroke={inverted ? "rgba(245, 158, 11, 0.4)" : "rgba(184, 78, 48, 0.4)"}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Specular Edge Highlights on Crown Crests */}
          <line x1="15" y1="28" x2="24" y2="17" stroke="#FFE7BA" strokeWidth="1" strokeLinecap="round" />
          <line x1="49" y1="28" x2="40" y2="17" stroke="#FFE7BA" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* ====================================================================
            3. POLARIS COMPASS STAR (Crowning North Star of Certified Truth)
        ==================================================================== */}
        <g className="origin-center transition-transform duration-500 ease-out animate-star-twinkle group-hover/mark:rotate-45 group-hover/mark:scale-125">
          {/* Ambient Flare Ring */}
          <circle cx="32" cy="10" r="5" fill="url(#m4u-star-flare)" opacity="0.6" />

          {/* 8-Point Faceted Diamond Star */}
          <path
            d="M 32 4 L 33.6 8.4 L 38 10 L 33.6 11.6 L 32 16 L 30.4 11.6 L 26 10 L 30.4 8.4 Z"
            fill="url(#m4u-gold-primary)"
          />
          <path
            d="M 32 6.5 L 34.5 10 L 32 13.5 L 29.5 10 Z"
            fill="#FFFBEB"
            opacity="0.95"
          />

          {/* Center Pearl Pip */}
          <circle cx="32" cy="10" r="1.1" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

const Logo = ({
  variant = "inline", // "inline" | "stacked" | "mark" | "text"
  size = "md", // "sm" | "md" | "lg" | "xl"
  showTagline = true,
  taglineText = "Verified Real Estate Intelligence",
  inverted = false,
  to = "/",
  className = "",
  onClick,
}) => {
  // Size Matrix
  const markSizes = {
    sm: 34,
    md: 42,
    lg: 52,
    xl: 66,
  };

  const titleSizes = {
    sm: "text-[19px] tracking-[0.04em]",
    md: "text-[23px] sm:text-[25px] tracking-[0.045em]",
    lg: "text-2xl sm:text-[32px] tracking-[0.05em]",
    xl: "text-3xl sm:text-[42px] tracking-[0.055em]",
  };

  const subtitleSizes = {
    sm: "text-[7.5px] tracking-[0.24em]",
    md: "text-[8.5px] tracking-[0.26em]",
    lg: "text-[10px] tracking-[0.28em]",
    xl: "text-[11.5px] tracking-[0.3em]",
  };

  const content = (
    <div
      className={`group/logo inline-flex items-center select-none transition-all duration-300 ${
        variant === "stacked"
          ? "flex-col items-center text-center space-y-2"
          : "space-x-3.5"
      } ${className}`}
      onClick={onClick}
    >
      {/* 🏛️ Visual Insignia Mark */}
      {variant !== "text" && (
        <LogoMark
          size={markSizes[size] || 42}
          inverted={inverted}
          animated={true}
        />
      )}

      {/* 🏛️ Brand Typography Lockup (Warm Bronze & Terracotta, Never Plain Black) */}
      {variant !== "mark" && (
        <div className={`flex flex-col ${variant === "stacked" ? "items-center" : "justify-center"}`}>
          <div className="flex items-baseline leading-none">
            {/* Primary Name: Solid Metallic Bronze-Terracotta Gradient */}
            <span
              className={`font-serif font-black leading-none uppercase transition-all duration-300 ${titleSizes[size]} ${
                inverted
                  ? "bg-gradient-to-r from-[#FFF6ED] via-[#FCE8D3] to-[#F5D0A9] bg-clip-text text-transparent group-hover/logo:brightness-110"
                  : "bg-gradient-to-r from-[#4E2415] via-[#7B371D] to-[#AA4824] bg-clip-text text-transparent group-hover/logo:from-[#3D1A0D] group-hover/logo:to-[#C24D28]"
              }`}
              style={{
                letterSpacing: "0.04em",
                textShadow: inverted ? "0 2px 10px rgba(245, 158, 11, 0.25)" : "none",
              }}
            >
              MAKAAN
            </span>

            {/* Accented '4U': Imperial Gold & Sunlit Terracotta */}
            <span
              className={`font-serif font-black leading-none ml-1 bg-gradient-to-r from-[#D95B2A] via-[#E68A2E] to-[#F59E0B] bg-clip-text text-transparent transition-all duration-300 transform group-hover/logo:scale-105 group-hover/logo:translate-x-0.5 ${titleSizes[size]}`}
              style={{
                letterSpacing: "0.02em",
                filter: "drop-shadow(0 1px 2px rgba(217, 91, 48, 0.25))",
              }}
            >
              4U
            </span>

            {/* Crowning Verification Jewel: Faceted Star Pip */}
            <span
              className="inline-flex items-center justify-center ml-1 mb-1 transition-transform duration-300 group-hover/logo:rotate-45 group-hover/logo:scale-125"
              title="Verified Luxury Real Estate Network"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 5 0 L 6.2 3.8 L 10 5 L 6.2 6.2 L 5 10 L 3.8 6.2 L 0 5 L 3.8 3.8 Z"
                  fill="url(#m4u-gold-primary)"
                />
                <circle cx="5" cy="5" r="1" fill="#FFFFFF" />
              </svg>
            </span>
          </div>

          {/* Subtitle / Positioning Tagline */}
          {showTagline && (
            <div
              className={`hidden sm:flex items-center space-x-1.5 mt-1 font-mono uppercase font-bold select-none transition-colors duration-300 ${
                subtitleSizes[size]
              } ${
                inverted
                  ? "text-[#E6CDB8] group-hover/logo:text-white"
                  : "text-[#8C6D56] group-hover/logo:text-[#A84925]"
              }`}
            >
              {/* Dual-Glow Live Radar Beacon */}
              <span className="relative flex h-2 w-2 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-emerald-500 to-amber-500" />
              </span>
              <span>{taglineText}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-sm"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default React.memo(Logo);
