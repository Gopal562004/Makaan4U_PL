import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  MapPin,
  TrendingUp,
  School,
  Hospital,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  Navigation
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { LOCALITIES, PROJECTS } from "../../data/propertyData";
import { getAllProperties } from "../../lib/mongo/services/propertyService";

const LocalityDetails = () => {
  const { slug } = useParams();
  const locality = LOCALITIES.find((l) => l.id === slug || l.name.toLowerCase() === slug?.toLowerCase()) || LOCALITIES[0];

  const [matchingProperties, setMatchingProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingProps(true);
    getAllProperties({ city: locality.city, search: locality.name, limit: 6 })
      .then((res) => {
        if (isMounted) {
          setMatchingProperties(res?.properties || []);
          setLoadingProps(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMatchingProperties([]);
          setLoadingProps(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [locality.city, locality.name]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`${locality.name}, ${locality.city} — Price Trends, ₹/sq.ft, Infrastructure & Properties | Makaan4U`}</title>
        <meta name="description" content={locality.description} />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10 pb-24 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: "Localities", href: "/localities" },
            { label: locality.city, href: `/cities/${locality.cityId || "mumbai"}` },
            { label: locality.name }
          ]}
        />

        {/* Editorial Locality Header */}
        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-mono text-[var(--color-muted-foreground)] uppercase tracking-wider">
              {locality.city} Micro-Market Intelligence
            </span>
            <span>•</span>
            <span className="text-emerald-600 font-bold font-mono">{locality.growthRate}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            {locality.name}, {locality.city}
          </h1>

          <p className="text-sm text-[var(--color-muted-foreground)] max-w-3xl leading-relaxed">
            {locality.description}
          </p>
        </div>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              Average Capital Price
            </span>
            <span className="font-mono text-2xl font-bold text-[var(--color-foreground)] mt-1 block">
              {locality.avgPrice}
            </span>
            <span className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5 block">
              Range: {locality.priceRange}
            </span>
          </div>

          <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              YoY Price Movement
            </span>
            <span className="font-mono text-2xl font-bold text-emerald-600 mt-1 block">
              {locality.growthRate}
            </span>
            <span className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5 block">
              High Capital Liquidity
            </span>
          </div>

          <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              Lifestyle & Livability
            </span>
            <span className="font-mono text-2xl font-bold text-[var(--color-terracotta)] mt-1 block">
              {locality.lifestyleRating} / 10
            </span>
            <span className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5 block">
              Civic Infrastructure Score
            </span>
          </div>

          <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              Active Inventory
            </span>
            <span className="font-mono text-2xl font-bold text-[var(--color-foreground)] mt-1 block">
              {locality.totalProperties}
            </span>
            <span className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5 block">
              Verified Listings
            </span>
          </div>
        </section>

        {/* Civic Infrastructure: Schools, Hospitals, Transit */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Schools */}
          <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-[var(--color-border)] pb-2.5">
              <School className="w-4 h-4 text-[var(--color-secondary)]" />
              <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
                Top Academic Institutions
              </h3>
            </div>
            <ul className="space-y-2 text-[var(--color-muted-foreground)]">
              {locality.schools.map((s) => (
                <li key={s} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hospitals */}
          <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-[var(--color-border)] pb-2.5">
              <Hospital className="w-4 h-4 text-[var(--color-terracotta)]" />
              <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
                Super-Speciality Healthcare
              </h3>
            </div>
            <ul className="space-y-2 text-[var(--color-muted-foreground)]">
              {locality.hospitals.map((h) => (
                <li key={h} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Landmarks */}
          <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-[var(--color-border)] pb-2.5">
              <Navigation className="w-4 h-4 text-[var(--color-foreground)]" />
              <h3 className="font-semibold text-sm text-[var(--color-foreground)]">
                Lifestyle & Transit Nodes
              </h3>
            </div>
            <ul className="space-y-2 text-[var(--color-muted-foreground)]">
              {locality.landmarks.map((l) => (
                <li key={l} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Active Properties in this Locality */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Marketplace Feed
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)] mt-0.5">
                Verified Residences in {locality.name}
              </h2>
            </div>
            <Link
              to={`/properties?search=${locality.name}`}
              className="text-xs font-semibold text-[var(--color-terracotta)] hover:underline"
            >
              Search All {locality.name} Properties →
            </Link>
          </div>

          {loadingProps ? (
            <div className="py-12 text-center text-xs text-[var(--color-muted-foreground)]">
              Loading verified residences in {locality.name}...
            </div>
          ) : matchingProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProperties.slice(0, 6).map((p) => (
                <PropertyCard key={p.id || p._id} property={p} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-2">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                No active listings recorded in {locality.name} at this time.
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Explore nearby micro-markets or search across all {locality.city} listings.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default LocalityDetails;
