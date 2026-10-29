import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Building2, ShieldCheck, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getAllDevelopers } from "../../lib/mongo/services/projectService";
import { DEVELOPERS as FALLBACK_DEVELOPERS } from "../../data/propertyData";

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllDevelopers()
      .then((data) => {
        if (!isMounted) return;
        if (data?.length) setDevelopers(data);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const developersList = developers.length ? developers : FALLBACK_DEVELOPERS;

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Tier-1 Real Estate Developers & Promoters — Makaan4U</title>
        <meta
          name="description"
          content="Explore accredited institutional developers across India including Godrej Properties, Oberoi Realty, DLF Limited, Prestige Group, and Lodha."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20 lg:pb-16">
        <Breadcrumbs items={[{ label: "Developers Directory" }]} />

        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Accredited Promoters
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Premier Indian Real Estate Developers
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            Every featured developer is audited for historical delivery punctuality, statutory RERA compliance track record, and structural engineering benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developersList.map((dev) => (
            <Link
              key={dev.id || dev.slug}
              to={`/developers/${dev.slug || dev.id}`}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm transition-all duration-300 flex flex-col justify-between group space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={dev.logo}
                    alt={dev.name}
                    className="w-14 h-14 object-cover rounded border border-[var(--color-border)]"
                  />
                  <div>
                    <h2 className="font-editorial text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors">
                      {dev.name}
                    </h2>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Est. {dev.established} • HQ in {dev.headquarters}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-3 leading-relaxed">
                  {dev.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-600 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% RERA Certified</span>
                </div>
                <span className="text-[var(--color-terracotta)] font-semibold flex items-center">
                  View Portfolio →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default DevelopersPage;
