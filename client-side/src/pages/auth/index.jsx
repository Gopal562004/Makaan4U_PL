import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left: Editorial Photography & Branding Pane */}
          <div className="hidden md:flex md:col-span-5 bg-[var(--color-subtle)] relative flex-col justify-between p-8 text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
              alt="Makaan4U Residences"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10">
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                MAKAAN4U
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300 mt-1">
                Verified Indian Real Estate
              </p>
            </div>
            <div className="relative z-10 space-y-2">
              <p className="font-editorial text-lg font-bold text-white leading-snug">
                "Direct access to authentic Indian residences without broker inflation or speculative noise."
              </p>
              <p className="text-[11px] text-stone-300 font-mono">
                100% RERA & physically verified portfolios.
              </p>
            </div>
          </div>

          {/* Right: Dynamic Auth Form Body */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {children || <Outlet />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
