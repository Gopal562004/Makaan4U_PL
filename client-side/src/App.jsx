// import React from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Routes from "./Routes";

// function App() {
//   return (
//     <>
//       <Routes />
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </>
//   );
// }

// export default App;
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";
import Routes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ShortlistProvider } from "./contexts/ShortlistContext";
import { PreferencesProvider } from "./contexts/PreferencesContext";

// IMPORT YOUR 4 PERFORMANCE FILES
import { usePerformanceMonitor } from "./hooks/usePerformanceMonitor";
import { checkPerformanceBudget } from "./utils/performanceBudget";
import { trackSEOEvents } from "./utils/analytics";

function App() {
  // ✔ 1. Track Core Web Vitals (LCP, CLS)
  usePerformanceMonitor();

  useEffect(() => {
    // ✔ 2. Check performance budget (page size, load time)
    const result = checkPerformanceBudget();
    console.log("Performance Budget:", result);

    // ✔ 3. Track first page view
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
