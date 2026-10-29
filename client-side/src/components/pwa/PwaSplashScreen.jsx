import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ============================================================================
 * 🏛️ MAKAAN4U HAUTE LUXURY PWA CINEMATIC OPENING & EXIT SPLASH SCREEN
 * ----------------------------------------------------------------------------
 * Designed to provide a native luxury app experience with:
 * - Obsidian & warm terracotta radial ambient field
 * - Expanding resonant gold sonar rings
 * - Faceted architectural monogram with 3D levitation and specular shimmer sweep
 * - Crowning Polaris compass star with 360° rotation and brilliant lens flare
 * - Staggered gold-foil typographic reveal
 * - Architectural progress gauge with micro-status telemetry
 * - Ultra-smooth cinema exit transition (radial scale + blur dissolve)
 * ============================================================================
 */
const PwaSplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SECURE PROTOCOL...");
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Global hook to allow replaying opening animation on demand
    window.replayPwaLaunchAnimation = () => {
      setProgress(0);
      setIsVisible(true);
    };

    // Prevent body scrolling while splash is active
    document.body.style.overflow = "hidden";

    // Progress increments with architectural status updates
    const timer1 = setTimeout(() => {
      setProgress(35);
      setStatusText("CURATING VERIFIED RESIDENTIAL DOSSIERS...");
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStatusText("SYNCHRONIZING MICRO-MARKET INTELLIGENCE...");
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("WELCOME TO MAKAAN4U");
    }, 1450);

    // Auto-dismiss after sequence finishes
    const timerFinish = setTimeout(() => {
      handleDismiss();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinish);
      document.body.style.overflow = "";
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    document.body.style.overflow = "";
    try {
      sessionStorage.setItem("makaan4u_pwa_splash_shown", "true");
    } catch {}
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="pwa-splash-canvas"
          role="dialog"
          aria-label="Launching Makaan4U"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(14px)",
            transition: {
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center select-none cursor-pointer bg-[#0D0806] text-white overflow-hidden p-6"
        >
          {/* ====================================================================
              1. AMBIENT BACKDROP: Drafting Grid & Warm Radial Gradient
          ==================================================================== */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 animate-scanline-pan"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(245, 158, 11, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 158, 11, 0.08) 1px, transparent 1px)",
            }}
          />

          {/* Deep Luminous Center Core Aura */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-60 blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, rgba(217, 83, 39, 0.45) 0%, rgba(245, 158, 11, 0.25) 45%, transparent 70%)",
            }}
          />

          {/* Expanding Resonant Sonar Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-56 h-56 rounded-full border border-amber-500/25 animate-pulse-ring-1" />
            <div className="absolute w-56 h-56 rounded-full border border-orange-500/20 animate-pulse-ring-2" />
            <div className="absolute w-56 h-56 rounded-full border border-amber-400/15 animate-pulse-ring-3" />
          </div>

          {/* ====================================================================
              2. CENTERPIECE: 3D LEVITATING MONOGRAM & CROWNING POLARIS STAR
          ==================================================================== */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 30 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 18,
                  stiffness: 140,
                  delay: 0.08,
                },
              }}
              className="relative animate-float-subtle"
            >
              {/* Outer Golden Corona Flare */}
              <div
                className="absolute -inset-4 rounded-[26px] blur-xl opacity-60 pointer-events-none animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(217, 83, 39, 0.3) 60%, transparent 100%)",
                }}
              />

              {/* Architectural Emblem Badge */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-[0_12px_28px_rgba(217,83,39,0.45)]"
                >
                  <defs>
                    <linearGradient id="splash-surface" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2A1B14" />
                      <stop offset="50%" stopColor="#1E120D" />
                      <stop offset="100%" stopColor="#140B07" />
                    </linearGradient>

                    <linearGradient id="splash-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE68A" />
                      <stop offset="35%" stopColor="#F59E0B" />
                      <stop offset="70%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>

                    <linearGradient id="splash-terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F2774B" />
                      <stop offset="50%" stopColor="#D45327" />
                      <stop offset="100%" stopColor="#963617" />
                    </linearGradient>

                    <linearGradient id="splash-border" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="50%" stopColor="#D9653B" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>

                    <linearGradient id="splash-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75" />
                      <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>

                    <clipPath id="splash-clip">
                      <rect x="3.5" y="3.5" width="57" height="57" rx="15" />
                    </clipPath>
                  </defs>

                  {/* Chamfered Squircle Badge */}
                  <rect
                    x="3.5"
                    y="3.5"
                    width="57"
                    height="57"
                    rx="15"
                    fill="url(#splash-surface)"
                    stroke="url(#splash-border)"
                    strokeWidth="1.8"
                  />

                  {/* Concentric Precision Dashed Inset */}
                  <rect
                    x="6.5"
                    y="6.5"
                    width="51"
                    height="51"
                    rx="12"
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.35)"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />

                  {/* Shimmer Sweep */}
                  <g clipPath="url(#splash-clip)">
                    <rect
                      x="-40"
                      y="-10"
                      width="35"
                      height="84"
                      fill="url(#splash-shimmer)"
                      className="animate-logo-shimmer"
                    />
                  </g>

                  {/* Precision Horology Nails */}
                  <circle cx="10" cy="10" r="1.2" fill="url(#splash-gold)" />
                  <circle cx="54" cy="10" r="1.2" fill="url(#splash-gold)" />
                  <circle cx="10" cy="54" r="1.2" fill="url(#splash-gold)" />
                  <circle cx="54" cy="54" r="1.2" fill="url(#splash-gold)" />

                  {/* Architectural Monogram Pillars */}
                  <g>
                    {/* Left Wing Outer Pillar */}
                    <path
                      d="M 15 47 L 15 28 L 24 17 L 28 21.5 L 20.5 30 L 20.5 47 Z"
                      fill="url(#splash-terracotta)"
                    />
                    {/* Left Inner Slope */}
                    <path
                      d="M 24 17 L 32 27 L 32 32.5 L 24 22 Z"
                      fill="url(#splash-gold)"
                    />
                    {/* Right Inner Slope */}
                    <path
                      d="M 32 27 L 40 17 L 40 22 L 32 32.5 Z"
                      fill="url(#splash-gold)"
                    />
                    {/* Right Wing Outer Pillar */}
                    <path
                      d="M 40 17 L 49 28 L 49 47 L 43.5 47 L 43.5 30 L 36 21.5 Z"
                      fill="url(#splash-terracotta)"
                    />

                    {/* Grand Romanesque Arch ("U" Gateway) */}
                    <path
                      d="M 24 47 L 24 37 C 24 32 40 32 40 37 L 40 47"
                      fill="none"
                      stroke="url(#splash-gold)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Crossbar Transom */}
                    <path
                      d="M 22 39.5 L 42 39.5"
                      stroke="url(#splash-gold)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Keystone Column */}
                    <path
                      d="M 34 32.5 L 34 47"
                      stroke="url(#splash-terracotta)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />

                    {/* Pedestal Base */}
                    <line
                      x1="12"
                      y1="49.5"
                      x2="52"
                      y2="49.5"
                      stroke="url(#splash-gold)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="17"
                      y1="52"
                      x2="47"
                      y2="52"
                      stroke="rgba(245, 158, 11, 0.45)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Crowning Polaris Compass Star */}
                  <g className="origin-center animate-star-flare-burst">
                    <circle cx="32" cy="10" r="6" fill="url(#splash-gold)" opacity="0.4" />
                    <path
                      d="M 32 4 L 33.6 8.4 L 38 10 L 33.6 11.6 L 32 16 L 30.4 11.6 L 26 10 L 30.4 8.4 Z"
                      fill="url(#splash-gold)"
                    />
                    <path
                      d="M 32 6.5 L 34.5 10 L 32 13.5 L 29.5 10 Z"
                      fill="#FFFFFF"
                      opacity="0.95"
                    />
                    <circle cx="32" cy="10" r="1.3" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>
            </motion.div>

            {/* ====================================================================
                3. BRAND TYPOGRAPHY: Staggered Metallic Foil Reveal
            ==================================================================== */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center space-x-1.5 animate-text-glow">
                <span className="font-serif font-black text-2xl sm:text-3xl tracking-[0.16em] uppercase bg-gradient-to-r from-[#FFF6ED] via-[#FCE8D3] to-[#F5D0A9] bg-clip-text text-transparent">
                  MAKAAN
                </span>
                <span className="font-serif font-black text-2xl sm:text-3xl tracking-[0.08em] bg-gradient-to-r from-[#D95B2A] via-[#E68A2E] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
                  4U
                </span>
              </div>

              {/* Tagline with Hairline Accent Rules */}
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-amber-500/50" />
                <span className="text-[9px] sm:text-[10.5px] font-mono tracking-[0.28em] uppercase text-amber-200/80 font-medium">
                  Verified Luxury Real Estate
                </span>
                <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-amber-500/50" />
              </div>
            </motion.div>

            {/* ====================================================================
                4. ARCHITECTURAL PROGRESS METER & TELEMETRY
            ==================================================================== */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-8 w-48 sm:w-56"
            >
              {/* Sleek Hairline Track */}
              <div className="h-[2px] w-full bg-stone-800/90 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-600 via-amber-400 to-amber-200 shadow-[0_0_10px_#F59E0B]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.4 }}
                />
              </div>

              {/* Dynamic Status Text */}
              <div className="mt-2.5 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                <span className="truncate pr-2">{statusText}</span>
                <span className="text-amber-400 font-bold tabular-nums">{progress}%</span>
              </div>
            </motion.div>

            {/* Standalone Badge or Skip Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 text-[9px] font-mono text-stone-500 uppercase tracking-widest flex items-center space-x-1.5"
            >
              {isStandalone ? (
                <span className="flex items-center space-x-1 text-amber-400/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Makaan4U Native Workspace Active</span>
                </span>
              ) : (
                <span>Tap anywhere to enter</span>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PwaSplashScreen;

