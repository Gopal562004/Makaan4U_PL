import React from "react";
import { Link } from "react-router-dom";

/**
 * ============================================================================
 * 🏛️ MAKAAN4U Bespoke Architectural Brand Mark & Typography System
 * ----------------------------------------------------------------------------
 * A high-craft, minimalist architectural identity designed for luxury Indian
 * residential intelligence. Synthesizes an isometric "M" pavilion with the
 * four-quadrant foundation of certified verification (Legal, Physical,
 * Financial, Structural) and a radiant forensic intelligence compass star.
 * ============================================================================
 */

export const LogoMark = ({
  size = 38,
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
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transition-transform duration-300 ease-out ${
          animated ? "group-hover/mark:scale-105" : ""
        }`}
      >
        <defs>
          {/* Subtle Terracotta Luxury Gradient */}
          <linearGradient id="m4u-terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9653B" />
            <stop offset="100%" stopColor="#9E3B1B" />
          </linearGradient>

          {/* Warm Champagne Gold Accent */}
          <linearGradient id="m4u-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Architectural Blueprint Facet Gradient */}
          <linearGradient id="m4u-facet-left" x1="16" y1="11" x2="16" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D9653B" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#D9653B" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="m4u-facet-right" x1="28" y1="11" x2="28" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
          </linearGradient>

          {/* Container Background Filter */}
          <radialGradient id="m4u-ambient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={inverted ? "#292524" : "var(--color-surface, #ffffff)"} stopOpacity="1" />
            <stop offset="100%" stopColor={inverted ? "#1c1917" : "var(--color-subtle, #f5f4f0)"} stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Squircle Chassis with Hairline Precision Border */}
        <rect
          x="2"
          y="2"
          width="40"
          height="40"
          rx="10"
          fill="url(#m4u-ambient)"
          className={
            inverted
              ? "stroke-stone-700/80"
              : "stroke-[var(--color-border)] dark:stroke-stone-800"
          }
          strokeWidth="1.2"
        />

        {/* Subtle Architectural Grid Dots */}
        <circle cx="10" cy="18" r="0.8" className={inverted ? "fill-stone-600" : "fill-[var(--color-muted-foreground)]/30"} />
        <circle cx="34" cy="18" r="0.8" className={inverted ? "fill-stone-600" : "fill-[var(--color-muted-foreground)]/30"} />

        {/* Shaded Architectural Roof Facets */}
        <path
          d="M 10 18 L 16 11 L 22 18 L 22 25 L 10 25 Z"
          fill="url(#m4u-facet-left)"
        />
        <path
          d="M 22 18 L 28 11 L 34 18 L 34 25 L 22 25 Z"
          fill="url(#m4u-facet-right)"
        />

        {/* Twin Modernist Roof Gables Forming the "M" Monogram */}
        <path
          d="M 10 33 L 10 18 L 16 11 L 22 18 L 28 11 L 34 18 L 34 33"
          className={inverted ? "stroke-stone-100" : "stroke-[var(--color-foreground)]"}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Architectural Horizontal Lintel (Forms numeral "4" crossbar) */}
        <path
          d="M 7 25 L 37 25"
          className={inverted ? "stroke-stone-300" : "stroke-[var(--color-foreground)]"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Center Vertical Structural Spine */}
        <path
          d="M 22 18 L 22 33"
          stroke="url(#m4u-terracotta)"
          strokeWidth="1.9"
          strokeLinecap="round"
        />

        {/* Foundation Base Plate */}
        <path
          d="M 8 33 L 36 33"
          className={inverted ? "stroke-stone-500" : "stroke-[var(--color-muted-foreground)]/50"}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Intelligence Focal Star (North Star of Certified Truth) */}
        <path
          d="M 22 5.5 L 23.2 8.2 L 26 9.2 L 23.2 10.2 L 22 13 L 20.8 10.2 L 18 9.2 L 20.8 8.2 Z"
          fill="url(#m4u-terracotta)"
          className="transition-transform duration-300 origin-center group-hover/mark:rotate-12"
        />
        <circle cx="22" cy="9.2" r="0.75" fill="#FFE8D6" />
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
    sm: 32,
    md: 38,
    lg: 48,
    xl: 60,
  };

  const titleSizes = {
    sm: "text-lg tracking-[0.04em]",
    md: "text-xl sm:text-[22px] tracking-[0.05em]",
    lg: "text-2xl sm:text-3xl tracking-[0.06em]",
    xl: "text-3xl sm:text-4xl tracking-[0.07em]",
  };

  const subtitleSizes = {
    sm: "text-[7.5px] tracking-[0.22em]",
    md: "text-[8.5px] tracking-[0.26em]",
    lg: "text-[10px] tracking-[0.28em]",
    xl: "text-[11px] tracking-[0.3em]",
  };

  const content = (
    <div
      className={`group/logo inline-flex ${
        variant === "stacked"
          ? "flex-col items-center text-center space-y-2.5"
          : "items-center space-x-3"
      } ${className}`}
      onClick={onClick}
    >
      {/* Visual Insignia Mark */}
      {variant !== "text" && (
        <LogoMark
          size={markSizes[size] || 38}
          inverted={inverted}
          className="transition-transform duration-300 ease-out group-hover/logo:scale-105"
        />
      )}

      {/* Brand Typography Lockup */}
      {variant !== "mark" && (
        <div className={`flex flex-col ${variant === "stacked" ? "items-center" : ""}`}>
          <div className="flex items-baseline">
            {/* Primary Name */}
            <span
              className={`font-editorial font-bold leading-none transition-colors ${titleSizes[size]} ${
                inverted
                  ? "text-white group-hover/logo:text-stone-200"
                  : "text-[var(--color-foreground)] group-hover/logo:text-[var(--color-foreground)]"
              }`}
            >
              MAKAAN
            </span>

            {/* Accented '4U' with Terracotta Luxury Treatment */}
            <span
              className={`font-editorial font-black leading-none ml-0.5 text-[var(--color-terracotta)] ${titleSizes[size]} transition-transform duration-200 group-hover/logo:translate-x-0.5`}
            >
              4
            </span>
            <span
              className={`font-editorial font-bold leading-none ${titleSizes[size]} ${
                inverted ? "text-white" : "text-[var(--color-foreground)]"
              }`}
            >
              U
            </span>

            {/* Delicate Certification Micro-Pip */}
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta)] ml-1 mb-1 transition-opacity opacity-85 group-hover/logo:opacity-100"
              title="Verified Real Estate Network"
            />
          </div>

          {/* Subtitle / Positioning Tagline */}
          {showTagline && (
            <div
              className={`hidden sm:flex items-center space-x-1.5 mt-0.5 font-mono uppercase font-semibold select-none ${
                subtitleSizes[size]
              } ${
                inverted
                  ? "text-stone-400 group-hover/logo:text-stone-300"
                  : "text-[var(--color-muted-foreground)] group-hover/logo:text-[var(--color-foreground)]"
              } transition-colors`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
              <span>{taglineText}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default React.memo(Logo);
