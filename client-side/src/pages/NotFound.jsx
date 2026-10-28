import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapPin, Search, ArrowRight, Home } from "lucide-react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import MobileNav from "../components/ui/MobileNav";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>This Address Doesn't Exist — Makaan4U</title>
      </Helmet>

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-full flex items-center justify-center mx-auto text-[var(--color-terracotta)]">
            <MapPin className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Registry Code 404
            </span>
            <h1 className="font-editorial text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
              This address does not exist.
            </h1>
            <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
              The property parcel or URL you are attempting to locate has either been sold, reassigned, or never registered in our directory.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/properties"
              className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Back to Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] text-xs font-medium rounded-sm transition-colors flex items-center justify-center space-x-1"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>Discovery Homepage</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default NotFound;
