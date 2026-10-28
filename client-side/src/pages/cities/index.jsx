import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { MapPin, TrendingUp, ArrowRight, Building2 } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { CITIES } from "../../data/propertyData";

const CitiesPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Prime Indian Real Estate City Portals — Makaan4U</title>
        <meta
          name="description"
          content="Explore comprehensive property intelligence across Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, and Goa."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20 lg:pb-16">
        <Breadcrumbs items={[{ label: "Metropolitan Cities" }]} />

        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Regional Property Portals
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Prime Indian Metropolitan Real Estate
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            In-depth pricing benchmarks, infrastructure catalysts, verified residential inventory, and legal guidelines across India's premier wealth and growth centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITIES.map((city) => (
            <Link
              key={city.id}
              to={`/cities/${city.id}`}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-[var(--color-subtle)]">
                <img
                  src={city.coverImage}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 bg-black/75 px-2.5 py-1 rounded text-[10px] font-mono text-white tracking-widest uppercase">
                  {city.state}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h2 className="font-editorial text-3xl font-bold text-white group-hover:underline">
                    {city.name}
                  </h2>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs">
                <div>
                  <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                    {city.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {city.topLocalities.slice(0, 4).map((loc) => (
                      <span
                        key={loc}
                        className="px-2 py-0.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[10px] text-[var(--color-foreground)]"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <span className="text-[var(--color-muted-foreground)] block text-[10px]">Benchmark</span>
                    <strong className="text-[var(--color-foreground)]">{city.avgPricePerSqFt}/sq.ft</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[var(--color-muted-foreground)] block text-[10px]">Appreciation</span>
                    <span className="text-emerald-600 font-bold">{city.growthYoY} YoY</span>
                  </div>
                  <span className="text-[var(--color-terracotta)] font-semibold flex items-center">
                    Enter Portal →
                  </span>
                </div>
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

export default CitiesPage;
