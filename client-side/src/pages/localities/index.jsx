import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapPin, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getAllLocalities } from "../../lib/mongo/services/localityService";
import { LOCALITIES as FALLBACK_LOCALITIES } from "../../data/propertyData";

const LocalitiesPage = () => {
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllLocalities()
      .then((data) => {
        if (!isMounted) return;
        if (data?.length) setLocalities(data);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const localitiesList = localities.length ? localities : FALLBACK_LOCALITIES;

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Indian Micro-Market Locality Intelligence — Makaan4U</title>
        <meta
          name="description"
          content="Explore capital valuations, ₹/sq.ft trends, civic infrastructure, and live inventory across India's top residential localities."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20 lg:pb-16">
        <Breadcrumbs items={[{ label: "Locality Intelligence Directory" }]} />

        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Micro-Market Directory
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Locality Valuation & Lifestyle Intelligence
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            In-depth micro-market data: capital price bands, 3-year YoY appreciation trends, connectivity infrastructure, top schools, healthcare, and active verified inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localitiesList.map((loc) => (
            <Link
              key={loc.id || loc.slug}
              to={`/localities/${loc.slug || loc.id}`}
              className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm transition-all duration-300 flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    {loc.city}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {loc.growthRate}
                  </span>
                </div>

                <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors mt-1">
                  {loc.name}
                </h2>

                <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-3 mt-2 leading-relaxed">
                  {loc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[var(--color-muted-foreground)] block">Benchmark</span>
                  <span className="font-bold text-[var(--color-foreground)]">{loc.avgPrice}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[var(--color-muted-foreground)] block">Yield</span>
                  <span className="text-emerald-600 font-semibold">{loc.rentalYield || "3.8%"}</span>
                </div>
                <span className="text-[var(--color-terracotta)] text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                  Explore →
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

export default LocalitiesPage;
