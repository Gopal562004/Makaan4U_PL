import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("makaan_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
    }
    return "light"; // Light-first by default as requested
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("makaan_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const root = document.documentElement;
    // Activate smooth 550ms theme transition
    root.classList.add("theme-transitioning");

    setTheme((prev) => (prev === "light" ? "dark" : "light"));

    setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 600);
  };

  const isEvening = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isEvening, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
