import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  MapPin,
  TrendingUp,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import ProjectCard from "../../components/ui/ProjectCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { CITIES, LOCALITIES, PROJECTS } from "../../data/propertyData";
import { getAllProperties } from "../../lib/mongo/services/propertyService";

const CityDetails = () => {
  const { city: cityParam } = useParams();
  const city = CITIES.find((c) => c.id === cityParam || c.name.toLowerCase() === cityParam?.toLowerCase()) || CITIES[0];

  const [cityProperties, setCityProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingProps(true);
    getAllProperties({ city: city.name, limit: 6 })
      .then((res) => {
        if (isMounted) {
          setCityProperties(res?.properties || []);
          setLoadingProps(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCityProperties([]);
          setLoadingProps(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [city.name]);

  const cityProjects = PROJECTS.filter((p) => p.city.toLowerCase() === city.name.toLowerCase());
  const cityLocalities = LOCALITIES.filter((l) => l.city.toLowerCase() === city.name.toLowerCase());

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`${city.name} Real Estate Intelligence & Verified Properties — Makaan4U`}</title>
        <meta name="description" content={city.description} />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12 pb-24 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: "Cities", href: "/cities" },
            { label: city.name }
          ]}
        />

        {/* Editorial City Hero Banner */}
        <div className="relative h-96 sm:h-[460px] rounded-sm overflow-hidden bg-[var(--color-subtle)]">
          <img
            src={city.coverImage}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-3xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300">
              {city.state} • Prime Property Dossier
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white">
              {city.name}
            </h1>
            <p className="text-xs sm:text-base text-stone-200 leading-relaxed font-light">
              {city.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">Benchmark Capital Value</span>
                <strong className="text-white text-base">{city.avgPricePerSqFt}/sq.ft</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Annual Price Momentum</span>
                <span className="text-emerald-400 font-bold text-base">{city.growthYoY} YoY</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Verified Listings</span>
                <span className="text-white text-base">{city.totalListings} Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure & Market Catalyst Highlights */}
        <section className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-4">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Market Catalysts & Connectivity
          </span>
          <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">
            Infrastructure Drivers Shaping {city.name} Real Estate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {city.marketHighlights.map((hl, i) => (
              <div key={i} className="p-4 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm space-y-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
                <p className="text-[var(--color-foreground)] leading-relaxed">{hl}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Micro-markets & Neighborhoods */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Localities
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)] mt-0.5">
                Prime Neighborhoods in {city.name}
              </h2>
            </div>
            <Link to="/localities" className="text-xs font-semibold text-[var(--color-terracotta)] hover:underline">
              View All Localities →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {city.topLocalities.map((locName) => (
              <Link
                key={locName}
                to={`/properties?city=${city.name}&search=${locName}`}
                className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm transition-all group"
              >
                <div className="flex items-center space-x-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />
                  <span className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)]">
                    {locName}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-muted-foreground)] mt-2">
                  Explore verified luxury residences & new launches in {locName}.
                </p>
                <span className="text-[10px] text-[var(--color-terracotta)] font-semibold block mt-2">
                  Browse Properties →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Verified Properties in this City */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Available Inventory
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)] mt-0.5">
                Featured Residences in {city.name}
              </h2>
            </div>
            <Link
              to={`/properties?city=${city.name}`}
              className="text-xs font-semibold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)]"
            >
              Search All {city.name} Listings →
            </Link>
          </div>

          {loadingProps ? (
            <div className="py-12 text-center text-xs text-[var(--color-muted-foreground)]">
              Loading properties in {city.name}...
            </div>
          ) : cityProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityProperties.map((p) => (
                <PropertyCard key={p.id || p._id} property={p} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-2">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                No active listings currently recorded in {city.name}.
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Check back shortly or explore neighboring metropolitan markets.
              </p>
            </div>
          )}
        </section>

        {/* New Projects in this City */}
        {cityProjects.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                  Master Developments
                </span>
                <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)] mt-0.5">
                  New Project Launches in {city.name}
                </h2>
              </div>
              <Link to="/projects" className="text-xs font-semibold hover:underline">
                View All Projects →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default CityDetails;
