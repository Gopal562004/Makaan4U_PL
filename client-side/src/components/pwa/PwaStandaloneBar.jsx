import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Wifi, WifiOff, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ============================================================================
 * 📱 PWA STANDALONE CONTROLS & LUXURY APP BAR
 * ----------------------------------------------------------------------------
 * Floating bottom-left/top navigation aid designed for PWA Standalone Mode
 * on Mobile and Desktop where native browser URL bars and back arrows are hidden.
 * Includes instant back navigation, home shortcut, offline indicator, and
 * a button to replay the cinematic opening splash sequence.
 * ============================================================================
 */
const PwaStandaloneBar = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Detect Standalone display mode or query param
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        window.location.search.includes("source=pwa");
      setIsStandalone(standalone);
    };

    checkStandalone();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkStandalone);

    // Online / Offline status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      mediaQuery.removeEventListener("change", checkStandalone);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isStandalone) {
    return null;
  }

  const isHome = location.pathname === "/" || location.pathname === "/home-page";

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-label="PWA Navigation Controller"
        className="fixed bottom-3 left-4 z-40 hidden sm:flex items-center space-x-1.5 p-1.5 bg-[#140E0C]/90 border border-amber-500/25 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md text-white select-none"
      >
        {/* Back Button (Only when not on root) */}
        {!isHome && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Go Back"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700/80 text-xs font-medium text-stone-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px]">Back</span>
          </button>
        )}

        {/* Home Button */}
        {!isHome && (
          <button
            type="button"
            onClick={() => navigate("/")}
            title="Go to Homepage"
            className="p-1.5 rounded-full bg-stone-800/60 hover:bg-stone-700/80 text-stone-300 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Replay Cinematic Opening Sequence */}
        <button
          type="button"
          onClick={() => {
            if (window.replayPwaLaunchAnimation) {
              window.replayPwaLaunchAnimation();
            }
          }}
          title="Replay App Opening Sequence"
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-[10px] font-mono text-amber-300 transition-all hover:scale-105"
        >
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Intro</span>
        </button>

        {/* Online / Offline Connectivity Status Pill */}
        <div
          title={isOnline ? "Network Connected" : "Operating in Offline Cache"}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium ${
            isOnline
              ? "text-emerald-400 bg-emerald-950/40 border border-emerald-500/30"
              : "text-amber-400 bg-amber-950/40 border border-amber-500/30 animate-pulse"
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Offline Mode</span>
            </>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default PwaStandaloneBar;

