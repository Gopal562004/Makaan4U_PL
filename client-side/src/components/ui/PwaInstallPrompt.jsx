import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("makaan_pwa_dismissed") === "true";
    } catch {
      return false;
    }
  });
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios") && !ua.includes("fxios");
    if (isIosDevice && isSafari) {
      setIsIos(true);
    }

    // Capture Chrome/Edge/Android beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("makaan_pwa_dismissed", "true");
    } catch {}
  };

  // If already installed or dismissed, do not render banner
  if (isInstalled || isDismissed) {
    return null;
  }

  // If neither Chrome install event fired nor iOS device, do not render
  if (!deferredPrompt && !isIos) {
    return null;
  }

  return (
    <aside
      aria-label="Install Makaan4U Application"
      className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-sm p-4 text-xs animate-slide-up backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <img src="/favicon.svg" alt="Makaan4U Emblem" className="w-6 h-6 object-contain" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--color-terracotta)]">
              Makaan4U App
            </span>
            <span className="text-[10px] text-[var(--color-muted-foreground)]">• Standalone</span>
          </div>
          <h4 className="font-semibold text-sm text-[var(--color-foreground)] mt-0.5">
            Install Makaan4U on Your Device
          </h4>
          <p className="text-[11px] text-[var(--color-muted-foreground)] mt-1 leading-relaxed">
            {isIos ? (
              <>
                Tap the <strong className="text-[var(--color-foreground)]">Share</strong> icon in Safari and select <strong className="text-[var(--color-foreground)]">"Add to Home Screen"</strong> for instant full-screen property access.
              </>
            ) : (
              "Enjoy instant offline shortlists, faster loading, and full-screen verified property dossiers."
            )}
          </p>

          {!isIos && (
            <div className="flex items-center space-x-2 mt-3">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-xs transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Application</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.replayPwaLaunchAnimation) window.replayPwaLaunchAnimation();
                }}
                className="px-2 py-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-500 font-mono text-[10px] flex items-center space-x-1 transition-colors"
                title="Preview App Opening Sequence"
              >
                <Sparkles className="w-3 h-3" />
                <span>Preview Launch</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-2 py-1.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              >
                Not now
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-1 rounded transition-colors"
          title="Dismiss"
          aria-label="Dismiss installation prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default PwaInstallPrompt;
