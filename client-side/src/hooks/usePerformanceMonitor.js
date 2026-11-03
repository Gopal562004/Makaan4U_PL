import React, { useEffect } from "react";

/**
 * Initializes Core Web Vitals (LCP, CLS) performance monitoring.
 * Can be called as a standard function inside useEffect or as a hook.
 * Returns a cleanup function to disconnect observers.
 */
export const initPerformanceMonitor = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  let lcpObserver = null;
  let clsObserver = null;

  try {
    // LCP Monitoring
    lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      if (window.gtag && lastEntry) {
        window.gtag("event", "core_vital", {
          event_category: "Web Vitals",
          event_label: "LCP",
          value: Math.round(lastEntry.startTime),
        });
      }
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch (err) {
    // PerformanceObserver entryType might not be supported in some browsers
  }

  try {
    // CLS Monitoring
    let clsValue = 0;
    clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      if (window.gtag && clsValue > 0) {
        window.gtag("event", "core_vital", {
          event_category: "Web Vitals",
          event_label: "CLS",
          value: Math.round(clsValue * 1000),
        });
      }
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  } catch (err) {
    // PerformanceObserver entryType might not be supported in some browsers
  }

  return () => {
    try {
      if (lcpObserver) lcpObserver.disconnect();
      if (clsObserver) clsObserver.disconnect();
    } catch {}
  };
};

export const usePerformanceMonitor = () => {
  try {
    if (typeof useEffect === "function") {
      useEffect(() => {
        return initPerformanceMonitor();
      }, []);
    }
  } catch {
    // Fallback if called outside React hook dispatcher
  }
};
