import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";
import Routes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ShortlistProvider } from "./contexts/ShortlistContext";
import { PreferencesProvider } from "./contexts/PreferencesContext";
import PwaInstallPrompt from "./components/ui/PwaInstallPrompt";

// Core Web Vitals & Performance Monitoring
import { usePerformanceMonitor } from "./hooks/usePerformanceMonitor";
import { checkPerformanceBudget } from "./utils/performanceBudget";
import { trackSEOEvents } from "./utils/analytics";

function App() {
  // Track Core Web Vitals (LCP, CLS)
  usePerformanceMonitor();

  useEffect(() => {
    // Check performance budget
    const result = checkPerformanceBudget();
    console.log("Performance Budget:", result);

    // Track first page view
    if (window.gtag) {
      window.gtag("config", "G-BKYZF93DS4", {
        page_path: window.location.pathname,
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <ShortlistProvider>
        <PreferencesProvider>
          <Routes />
          <PwaInstallPrompt />
          <ToastContainer 
            position="bottom-right"
            autoClose={3500}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            toastClassName="!bg-[var(--color-surface)] !text-[var(--color-foreground)] !rounded-sm !border !border-[var(--color-border)] !shadow-lg !font-medium !text-xs !mb-2"
            bodyClassName="!m-0 !p-3 flex items-center"
            closeButton={true}
          />
        </PreferencesProvider>
      </ShortlistProvider>
    </ThemeProvider>
  );
}

export default App;
