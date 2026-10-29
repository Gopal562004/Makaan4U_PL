import React from "react";
import { motion } from "framer-motion";

/**
 * ============================================================================
 * 🎬 LUXURY PWA PAGE TRANSITION WRAPPER
 * ----------------------------------------------------------------------------
 * Wraps page components with GPU-accelerated enter and exit animations.
 * Provides a fluid, native app feel on route transitions with subtle y-translation,
 * micro scale-in, and opacity cross-fades.
 * ============================================================================
 */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.992,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const PageTransition = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`pwa-page-container w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

