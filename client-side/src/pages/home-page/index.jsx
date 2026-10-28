import React, { useState, useEffect } from "react";
import { getAllProperties } from "../../lib/mongo/services/propertyService";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Building,
  Sparkles,
  Layers,
  ChevronRight,
  Compass,
  ArrowUpRight,
  FileCheck2,
  Scale
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import ProjectCard from "../../components/ui/ProjectCard";
import CompareDrawer from "../../components/ui/CompareDrawer";
import {
  PROJECTS,
  CITIES,
  LOCALITIES,
  INSIGHTS_ARTICLES,
  MARKET_TRENDS_DATA
} from "../../data/propertyData";

const HomePage = () => {
  const [activePurpose, setActivePurpose] = useState("Buy"); // "Buy" | "Rent" | "Commercial" | "Projects"
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchLocation, setSearchLocation] = useState("");
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activePurpose) params.set("purpose", activePurpose);
    if (selectedCity && selectedCity !== "All") params.set("city", selectedCity);
    if (searchLocation) params.set("search", searchLocation);
    navigate(`/properties?${params.toString()}`);
  };

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [marqueeProperty, setMarqueeProperty] = useState(null);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingProperties(true);
    getAllProperties({ limit: 6 })
      .then((res) => {
        if (!isMounted) return;
        if (res?.properties?.length) {
          setFeaturedProperties(res.properties.slice(0, 4));
          setMarqueeProperty(res.properties[0]);
        }
        setLoadingProperties(false);
      })
      .catch(() => {
        if (isMounted) setLoadingProperties(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);
  const trendingProjects = PROJECTS.slice(0, 3);
  const editorialArticles = INSIGHTS_ARTICLES.slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Makaan4U — Verified Indian Residential Real Estate & Architectural Discovery</title>
        <meta
          name="description"
          content="Discover verified luxury residences, penthouses, gated estates, and new developer launches across Mumbai, NCR, Bangalore, Pune, and Goa with forensic RERA intelligence."
        />
      </Helmet>

      <Header />

      <main className="flex-1 pb-16 lg:pb-0">
        {/* ====================================================================
            SECTION 01: ASYMMETRIC EDITORIAL HERO & DISCOVERY ENGINE
        ==================================================================== */}
        <section className="relative border-b border-[var(--color-border)] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Editorial Statement & Purpose Switcher */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta)] animate-pulse" />
                  <span className="font-medium text-[var(--color-foreground)]">
                    Q3 2026 Residential Market Dispatch Active
                  </span>
                </div>

                <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-foreground)] leading-[1.08]">
                  Architectural homes. <br />
                  <span className="italic font-normal text-[var(--color-secondary)]">Forensic verification.</span>
                </h1>

                <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] max-w-xl leading-relaxed">
                  Makaan4U provides discerning buyers, owners, and capital allocators with 100% physically inspected properties, clear RERA title registries, and deep micro-market valuations across India’s primary economic hubs.
                </p>

                {/* Purpose Tab Switcher & Integrated Search Form */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-2 sm:p-2.5 rounded-sm shadow-sm max-w-2xl">
                  {/* Mode Tabs */}
                  <div className="flex border-b border-[var(--color-border)] pb-2 px-1 gap-1 text-xs font-semibold">
                    {[
                      { id: "Buy", label: "Buy Residences" },
                      { id: "Rent", label: "Executive Rentals" },
                      { id: "Commercial", label: "Commercial" },
                      { id: "Projects", label: "New Launches" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActivePurpose(tab.id)}
                        className={`px-3 py-1.5 rounded transition-colors ${
                          activePurpose === tab.id
                            ? "bg-[var(--color-foreground)] text-[var(--color-surface)]"
                            : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Inputs Bar */}
                  <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2 pt-2">
                    {/* City Selector */}
                    <div className="sm:w-1/3">
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full h-11 px-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      >
                        <option value="All">All Indian Metros</option>
                        {CITIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Term Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3.5 text-[var(--color-muted-foreground)]" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="Search locality (e.g. Worli, Indiranagar)..."
                        className="w-full h-11 pl-9 pr-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>

                    {/* Search Submit */}
                    <button
                      type="submit"
                      className="h-11 px-6 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold text-xs rounded-sm transition-colors flex items-center justify-center space-x-1 whitespace-nowrap"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Micro-market shortcuts */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--color-muted-foreground)]">
                  <span className="font-semibold text-[var(--color-foreground)]">Popular:</span>
                  {["Worli Sea Face", "Bandra West", "Golf Course Rd", "Indiranagar", "Assagao"].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => navigate(`/properties?search=${encodeURIComponent(loc)}`)}
                      className="px-2 py-0.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded hover:border-[var(--color-muted-foreground)] text-[11px]"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Marquee Architectural Showcase (Not a card grid) */}
              <div className="lg:col-span-5">
                <div className="relative">
                  {/* Subtle Framing Line */}
                  <div className="absolute -inset-2 border border-[var(--color-border)] rounded-sm pointer-events-none -rotate-1 hidden sm:block" />

                  {loadingProperties ? (
                    <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden shadow-lg p-6 space-y-4 animate-pulse">
                      <div className="h-72 bg-[var(--color-subtle)] rounded-xs" />
                      <div className="h-4 bg-[var(--color-subtle)] rounded w-1/3" />
                      <div className="h-6 bg-[var(--color-subtle)] rounded w-3/4" />
                      <div className="h-3 bg-[var(--color-subtle)] rounded w-full" />
                    </div>
                  ) : marqueeProperty ? (
                    <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden shadow-lg">
                      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                        <img
                          src={marqueeProperty?.images?.[0] || marqueeProperty?.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"}
                          alt={marqueeProperty?.title || "Property"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                          Featured Property
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="font-mono text-xl sm:text-2xl font-bold">
                            {marqueeProperty?.price}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[var(--color-muted-foreground)]">
                          <span>{marqueeProperty?.locality || marqueeProperty?.city}, {marqueeProperty?.city}</span>
                          {marqueeProperty?.reraId && (
                            <span className="font-mono text-emerald-600 font-semibold">
                              RERA: {marqueeProperty.reraId}
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/properties/${marqueeProperty?.slug || marqueeProperty?.id}`}
                          className="block font-editorial text-lg sm:text-xl font-bold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors"
                        >
                          {marqueeProperty?.title}
                        </Link>
                        <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2">
                          {marqueeProperty?.description || marqueeProperty?.overview}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs">
                          <span className="text-[var(--color-foreground)] font-medium">
                            {marqueeProperty?.bedrooms ? `${marqueeProperty.bedrooms} BHK` : ""} {marqueeProperty?.area ? `• ${marqueeProperty.area.toLocaleString()} sq.ft` : marqueeProperty?.carpetArea ? `• ${marqueeProperty.carpetArea}` : ""}
                          </span>
                          <Link
                            to={`/properties/${marqueeProperty?.slug || marqueeProperty?.id}`}
                            className="font-semibold text-[var(--color-terracotta)] hover:underline inline-flex items-center"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Live Micro-Market Benchmark Ticker */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-subtle)] py-2.5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
              <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-[var(--color-terracotta)] flex items-center flex-shrink-0 mr-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live Index:
              </span>
              <div className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap text-[11px] font-mono">
                {MARKET_TRENDS_DATA.map((item) => (
                  <div key={item.city} className="flex items-center space-x-1.5 flex-shrink-0">
                    <span className="font-semibold text-[var(--color-foreground)]">{item.city}:</span>
                    <span className="text-[var(--color-muted-foreground)]">₹{item.avgPrice.toLocaleString("en-IN")}/sq.ft</span>
                    <span className="text-emerald-600 font-medium">(+{item.yoyGrowth}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 02: CITY DISCOVERY PORTALS (Editorial Typography)
        ==================================================================== */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Regional Portals
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
                Explore Prime Indian Metros
              </h2>
            </div>
            <Link
              to="/cities"
              className="text-xs font-semibold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors inline-flex items-center"
            >
              <span>View All 6 Cities & Market Indexes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.map((city, idx) => (
              <Link
                key={city.id}
                to={`/cities/${city.id}`}
                className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden bg-[var(--color-subtle)]">
                  <img
                    src={city.coverImage}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                      {city.state}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-white group-hover:underline">
                      {city.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 text-xs">
                  <p className="text-[var(--color-muted-foreground)] line-clamp-2 leading-relaxed">
                    {city.tagline}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] font-mono text-[11px]">
                    <span className="text-[var(--color-muted-foreground)]">
                      Avg: <strong className="text-[var(--color-foreground)]">{city.avgPricePerSqFt}</strong>
                    </span>
                    <span className="text-emerald-600 font-semibold">{city.growthYoY} YoY</span>
                    <span className="text-[var(--color-terracotta)] font-semibold">
                      {city.totalListings} Listings →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================================================================
            SECTION 03: VERIFIED FEATURED RESIDENCES
        ==================================================================== */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Curated Shortlist
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
                Verified Residences of Distinction
              </h2>
            </div>
            <Link
              to="/properties"
              className="text-xs font-semibold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors inline-flex items-center"
            >
              <span>Explore Marketplace Directory</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingProperties
              ? [1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm animate-pulse p-4 space-y-3"
                  >
                    <div className="h-44 bg-[var(--color-subtle)] rounded-xs" />
                    <div className="h-4 bg-[var(--color-subtle)] rounded w-1/3" />
                    <div className="h-5 bg-[var(--color-subtle)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--color-subtle)] rounded w-1/2" />
                  </div>
                ))
              : featuredProperties.map((prop) => (
                  <PropertyCard key={prop.id || prop._id} property={prop} variant="standard" />
                ))}
          </div>
        </section>

        {/* ====================================================================
            SECTION 04: NEW PROJECT LAUNCHES (Distinct Layout)
        ==================================================================== */}
        <section className="py-14 sm:py-20 bg-[var(--color-subtle)] border-b border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                  Tier-1 Master Developments
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
                  New Project Launches & Estates
                </h2>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  Direct developer allocations with verified RERA construction timelines and payment milestones.
                </p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-semibold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors inline-flex items-center"
              >
                <span>Browse All Developer Projects</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 05: DEEP LOCALITY INTELLIGENCE (Asymmetric Layout)
        ==================================================================== */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Micro-Market Intelligence
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                Locality Benchmarks & Infrastructure
              </h2>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                We track capital values, rental yield trajectories, metro connectivity expansions, and civic infrastructure for over 180 key residential neighbourhoods.
              </p>
              <Link
                to="/localities"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] rounded-sm text-xs font-semibold transition-colors"
              >
                <span>View Locality Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LOCALITIES.slice(0, 4).map((loc) => (
                <Link
                  key={loc.id}
                  to={`/localities/${loc.id}`}
                  className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-foreground)]">
                      {loc.city}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                      {loc.growthRate}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors mt-1">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1.5 line-clamp-2">
                    {loc.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--color-border)] text-xs">
                    <span className="font-mono font-bold text-[var(--color-foreground)]">
                      {loc.avgPrice}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] flex items-center">
                      Explore Intelligence →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 06: MAKAAN4U INSIGHTS (Publication View)
        ==================================================================== */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Makaan4U Insights Publication
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
                Legal, Financial & Architectural Analysis
              </h2>
            </div>
            <Link
              to="/insights"
              className="text-xs font-semibold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors inline-flex items-center"
            >
              <span>View All Publication Stories</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {editorialArticles.map((art) => (
              <article
                key={art.id}
                className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[var(--color-subtle)]">
                  <img
                    src={art.heroImage}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                    {art.category}
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--color-muted-foreground)]">
                      {art.publishedDate} • {art.readingTime}
                    </span>
                    <Link to={`/insights/${art.slug}`} className="block mt-1">
                      <h3 className="font-editorial text-base sm:text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors line-clamp-2">
                        {art.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1.5 line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs">
                    <div className="flex items-center space-x-2">
                      <img
                        src={art.author.avatar}
                        alt={art.author.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-[var(--color-muted-foreground)] truncate max-w-[140px]">
                        {art.author.name}
                      </span>
                    </div>
                    <Link
                      to={`/insights/${art.slug}`}
                      className="font-semibold text-[var(--color-terracotta)] hover:underline"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ====================================================================
            SECTION 07: VERIFICATION MANIFESTO (Trust Signals - No Clichés)
        ==================================================================== */}
        <section className="py-14 sm:py-20 bg-[var(--color-subtle)] border-b border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
              The Makaan4U Standard
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)] leading-tight">
              "We do not publish properties we have not physically stepped inside and verified against state title archives."
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-6 text-xs border-t border-[var(--color-border)]">
              <div className="space-y-1">
                <p className="font-semibold text-sm text-[var(--color-foreground)] flex items-center space-x-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>RERA Cross-Reference</span>
                </p>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  Every listed development is verified against sanctioned building plans and state authority quarterly escrow disclosures.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-[var(--color-foreground)] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Physical Inspection</span>
                </p>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  Real carpet areas, acoustic levels, actual window orientations, and maintenance conditions verified on-site.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-[var(--color-foreground)] flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Price Transparency</span>
                </p>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  No artificial inflated quotations. Benchmark ₹/sq.ft analytics calibrated from registered stamp duty registry transactions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default HomePage;