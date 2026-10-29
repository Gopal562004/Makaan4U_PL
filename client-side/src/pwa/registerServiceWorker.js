/**
 * Makaan4U Service Worker Registration
 */
export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for service worker updates periodically
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // New version available
                  window.dispatchEvent(new CustomEvent("pwa:update-available"));
                } else {
                  // Content is cached for offline use
                  window.dispatchEvent(new CustomEvent("pwa:offline-ready"));
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn("ServiceWorker registration skipped or failed:", error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
