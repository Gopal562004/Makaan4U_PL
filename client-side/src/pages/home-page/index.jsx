import React, { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  Compass,
  ArrowUpRight,
  FileCheck2,
  Scale,
  Play,
  Pause,
  Maximize2,
  BedDouble,
  Car
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import ProjectCard from "../../components/ui/ProjectCard";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getAllCities, getMarketTrends } from "../../lib/mongo/services/cityService";
import { getAllProjects } from "../../lib/mongo/services/projectService";
import { getAllInsights } from "../../lib/mongo/services/insightService";
import { getAllLocalities } from "../../lib/mongo/services/localityService";
import {
  PROJECTS as FALLBACK_PROJECTS,
  CITIES as FALLBACK_CITIES,
  LOCALITIES as FALLBACK_LOCALITIES,
  INSIGHTS_ARTICLES as FALLBACK_INSIGHTS,
  MARKET_TRENDS_DATA as FALLBACK_MARKET_TRENDS
} from "../../data/propertyData";

// Phrases for the auto-typing headline effect
const TYPEWRITER_PHRASES = [
  "Forensic verification.",
  "Zero spam advisors.",
  "100% physically audited.",
  "Direct owner mandates.",
  "Clear statutory RERA titles.",
  "Institutional diligence."
];

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

  // ====================================================================
  // 1. DYNAMIC AUTO-TYPING HEADLINE EFFECT
  // ====================================================================
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIdx];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        setTypingSpeed(80);

        if (displayText.length + 1 >= currentPhrase.length) {
          // Pause when word complete before backspacing
          setTypingSpeed(2200);
          setIsDeleting(true);
        }
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        setTypingSpeed(45);

        if (displayText.length <= 0) {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
          setTypingSpeed(400);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIdx, typingSpeed]);

  // ====================================================================
  // 2. LIVE DATABASE DATA FETCHING
  // ====================================================================
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Dynamic Marketplace Catalog State (Fetched from Backend API)
  const [cities, setCities] = useState([]);
  const [marketTrends, setMarketTrends] = useState([]);
  const [projects, setProjects] = useState([]);
  const [insights, setInsights] = useState([]);
  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setLoadingProperties(true);

    // Fetch live properties from database
    getAllProperties({ limit: 12 })
      .then((res) => {
        if (!isMounted) return;
        if (res?.properties?.length) {
          setProperties(res.properties);
        }
        setLoadingProperties(false);
      })
      .catch(() => {
        if (isMounted) setLoadingProperties(false);
      });

    // Fetch dynamic cities with live listing metrics from backend
    getAllCities().then((data) => {
      if (isMounted && data?.length) setCities(data);
    });

    // Fetch dynamic live market trends ticker data
    getMarketTrends().then((data) => {
      if (isMounted && data?.length) setMarketTrends(data);
    });

    // Fetch dynamic master development projects
    getAllProjects({ limit: 6 }).then((data) => {
      if (isMounted && data?.length) setProjects(data);
    });

    // Fetch dynamic insights publication
    getAllInsights({ limit: 3 }).then((data) => {
      if (isMounted && data?.length) setInsights(data);
    });

    // Fetch dynamic micro-market localities
    getAllLocalities({ limit: 4 }).then((data) => {
      if (isMounted && data?.length) setLocalities(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // ====================================================================
  // 3. FEATURED PROPERTY HERO SPOTLIGHT (Auto-Transitioning)
  // ====================================================================
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);

  useEffect(() => {
    if (!properties.length || isSpotlightPaused) return;

    const interval = setInterval(() => {
      setSpotlightIdx((prev) => (prev + 1) % properties.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [properties.length, isSpotlightPaused]);

  const activeSpotlightProp = properties[spotlightIdx] || properties[0] || null;

  // ====================================================================
  // 4. VERIFIED RESIDENCES SLIDER (Section 03 Auto-Slider)
  // ====================================================================
  const [sliderIdx, setSliderIdx] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(4);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else if (window.innerWidth < 1280) {
        setCardsPerView(3);
      } else {
        setCardsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxSliderIdx = Math.max(0, properties.length - cardsPerView);

  useEffect(() => {
    if (!properties.length || isSliderPaused || maxSliderIdx <= 0) return;

    const interval = setInterval(() => {
      setSliderIdx((prev) => (prev >= maxSliderIdx ? 0 : prev + 1));
    }, 3800);

    return () => clearInterval(interval);
  }, [properties.length, isSliderPaused, maxSliderIdx]);

  const handleSliderPrev = () => {
    setSliderIdx((prev) => (prev === 0 ? maxSliderIdx : prev - 1));
  };

  const handleSliderNext = () => {
    setSliderIdx((prev) => (prev >= maxSliderIdx ? 0 : prev + 1));
  };

  const citiesList = cities.length ? cities : FALLBACK_CITIES;
  const trendsList = marketTrends.length ? marketTrends : FALLBACK_MARKET_TRENDS;
  const trendingProjects = (projects.length ? projects : FALLBACK_PROJECTS).slice(0, 3);
  const localitiesList = localities.length ? localities : FALLBACK_LOCALITIES;
  const editorialArticles = (insights.length ? insights : FALLBACK_INSIGHTS).slice(0, 3);

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
              {/* Left Column: Editorial Statement with Typewriter Headline */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta)] animate-pulse" />
                  <span className="font-medium text-[var(--color-foreground)]">
                    Q3 2026 Residential Market Dispatch Active
                  </span>
                </div>

                {/* Auto-Typing Headline */}
                <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-foreground)] leading-[1.12]">
                  Architectural homes. <br />
                  <span className="italic font-normal text-[var(--color-terracotta)] inline-block min-h-[1.2em] break-words">
                    {displayText}
                    <span className="animate-typewriter-cursor font-light not-italic ml-0.5 text-[var(--color-terracotta)]">
                      |
                    </span>
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] max-w-xl leading-relaxed">
                  Makaan4U provides discerning buyers, owners, and capital allocators with 100% physically inspected properties, clear RERA title registries, and deep micro-market valuations across India’s primary economic hubs.
                </p>

                {/* Purpose Tab Switcher & Integrated Search Form */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-2 sm:p-2.5 rounded-sm shadow-sm max-w-2xl">
                  {/* Mode Tabs */}
                  <div className="flex border-b border-[var(--color-border)] pb-2 px-1 gap-1 text-xs font-semibold overflow-x-auto scrollbar-none whitespace-nowrap">
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
                        {citiesList.map((c) => (
                          <option key={c.id || c.slug} value={c.name}>
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

              {/* Right Column: Auto-Transitioning Featured Property Spotlight */}
              <div
                className="lg:col-span-5"
                onMouseEnter={() => setIsSpotlightPaused(true)}
                onMouseLeave={() => setIsSpotlightPaused(false)}
              >
                <div className="relative">
                  {/* Framing Frame */}
                  <div className="absolute -inset-2 border border-[var(--color-border)] rounded-sm pointer-events-none -rotate-1 hidden sm:block" />

                  {loadingProperties ? (
                    <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden shadow-lg p-6 space-y-4 animate-pulse">
                      <div className="h-72 bg-[var(--color-subtle)] rounded-xs" />
                      <div className="h-4 bg-[var(--color-subtle)] rounded w-1/3" />
                      <div className="h-6 bg-[var(--color-subtle)] rounded w-3/4" />
                      <div className="h-3 bg-[var(--color-subtle)] rounded w-full" />
                    </div>
                  ) : activeSpotlightProp ? (
                    <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden shadow-lg group">
                      {/* Image Stage with Slide Navigation Controls */}
                      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-900">
                        <img
                          key={activeSpotlightProp.id || activeSpotlightProp._id}
                          src={
                            activeSpotlightProp.images?.[0] ||
                            activeSpotlightProp.image ||
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
                          }
                          alt={activeSpotlightProp.title}
                          className="w-full h-full object-cover animate-fade-in transition-transform duration-700 group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                          <span className="bg-[var(--color-terracotta)] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-xs uppercase tracking-wider">
                            Featured Spotlight
                          </span>
                          <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-xs">
                            {activeSpotlightProp.propertyType || "Residences"}
                          </span>
                        </div>

                        {/* Manual Chevron Chevrons */}
                        {properties.length > 1 && (
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSpotlightIdx((prev) =>
                                  prev === 0 ? properties.length - 1 : prev - 1
                                );
                              }}
                              className="pointer-events-auto p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors backdrop-blur-xs"
                              aria-label="Previous Property"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSpotlightIdx((prev) =>
                                  (prev + 1) % properties.length
                                );
                              }}
                              className="pointer-events-auto p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors backdrop-blur-xs"
                              aria-label="Next Property"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Price & Location Bottom Bar on Photo */}
                        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                          <div>
                            <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight block">
                              {activeSpotlightProp.price}
                            </span>
                            {activeSpotlightProp.pricePerSqFt && (
                              <span className="text-[11px] font-mono text-stone-300">
                                {activeSpotlightProp.pricePerSqFt}
                              </span>
                            )}
                          </div>
                          {/* Slide Progress Pill */}
                          <div className="text-[10px] font-mono bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-xs text-white">
                            {spotlightIdx + 1} / {properties.length}
                          </div>
                        </div>
                      </div>

                      {/* Spotlight Property Metadata */}
                      <div className="p-4 sm:p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-[var(--color-muted-foreground)]">
                          <span className="flex items-center truncate">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)] flex-shrink-0" />
                            <strong className="text-[var(--color-foreground)] font-medium mr-1">
                              {activeSpotlightProp.locality ? `${activeSpotlightProp.locality}, ` : ""}
                            </strong>
                            <span>{activeSpotlightProp.city}</span>
                          </span>
                          {activeSpotlightProp.reraId && (
                            <span className="font-mono text-emerald-600 font-semibold flex items-center flex-shrink-0">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              RERA
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/properties/${activeSpotlightProp.slug || activeSpotlightProp.id || activeSpotlightProp._id}`}
                          className="block font-editorial text-lg sm:text-xl font-bold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors truncate"
                        >
                          {activeSpotlightProp.title}
                        </Link>

                        <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2 leading-relaxed">
                          {activeSpotlightProp.description || "Forensically verified residential listing with clear title."}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs">
                          <span className="text-[var(--color-foreground)] font-medium">
                            {activeSpotlightProp.bedrooms ? `${activeSpotlightProp.bedrooms} BHK • ` : ""}
                            {activeSpotlightProp.carpetArea || (activeSpotlightProp.area ? `${activeSpotlightProp.area.toLocaleString()} sq.ft` : "Verified Layout")}
                            {activeSpotlightProp.parking ? ` • ${activeSpotlightProp.parking}` : ""}
                          </span>
                          <Link
                            to={`/properties/${activeSpotlightProp.slug || activeSpotlightProp.id || activeSpotlightProp._id}`}
                            className="font-semibold text-[var(--color-terracotta)] hover:underline inline-flex items-center space-x-1"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Spotlight Carousel Dot Indicators */}
                      {properties.length > 1 && (
                        <div className="flex items-center justify-center space-x-1.5 pb-3">
                          {properties.slice(0, 8).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSpotlightIdx(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                spotlightIdx === idx
                                  ? "w-6 bg-[var(--color-terracotta)]"
                                  : "w-1.5 bg-[var(--color-border)] hover:bg-[var(--color-foreground)]"
                              }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
              LIVE MICRO-MARKET BENCHMARK TICKER (Infinite Smooth Marquee)
          ==================================================================== */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-subtle)] py-2.5 overflow-hidden relative flex items-center">
            {/* Fixed Left Badge with subtle gradient separator */}
            <div className="z-10 bg-[var(--color-subtle)] pl-4 sm:pl-6 pr-3 flex items-center shadow-xs flex-shrink-0">
              <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-[var(--color-terracotta)] flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-[var(--color-terracotta)]" />
                Live Index:
              </span>
              <div className="h-4 w-px bg-[var(--color-border)] ml-3" />
            </div>

            {/* Seamless Infinite Running Track (Duplicated list for 100% loop) */}
            <div className="overflow-hidden flex-1 relative">
              <div className="animate-marquee-track flex items-center space-x-8 text-[11px] font-mono">
                {/* Track Part 1 */}
                <div className="flex items-center space-x-8 flex-shrink-0">
                  {trendsList.map((item) => (
                    <div key={`part1-${item.city}`} className="flex items-center space-x-1.5 flex-shrink-0">
                      <span className="font-bold text-[var(--color-foreground)]">{item.city}:</span>
                      <span className="text-[var(--color-foreground)]">₹{Number(item.avgPrice).toLocaleString("en-IN")}/sq.ft</span>
                      <span className="text-emerald-600 font-semibold">(+{item.yoyGrowth}%)</span>
                    </div>
                  ))}
                </div>

                {/* Track Part 2 (Exact Duplicate for Continuous Loop) */}
                <div className="flex items-center space-x-8 flex-shrink-0" aria-hidden="true">
                  {trendsList.map((item) => (
                    <div key={`part2-${item.city}`} className="flex items-center space-x-1.5 flex-shrink-0">
                      <span className="font-bold text-[var(--color-foreground)]">{item.city}:</span>
                      <span className="text-[var(--color-foreground)]">₹{Number(item.avgPrice).toLocaleString("en-IN")}/sq.ft</span>
                      <span className="text-emerald-600 font-semibold">(+{item.yoyGrowth}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 02: CITY DISCOVERY PORTALS (Dynamic Live Catalog)
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
              <span>View All {citiesList.length} Cities & Market Indexes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesList.map((city) => (
              <Link
                key={city.id || city.slug}
                to={`/cities/${city.slug || city.id}`}
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
            SECTION 03: VERIFIED FEATURED RESIDENCES (Dynamic Auto-Slider)
        ==================================================================== */}
        <section
          className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)]"
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Curated Shortlist
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
                Verified Residences of Distinction
              </h2>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                Forensically audited residences featuring genuine carpet areas, verified RERA certificates, and authorized advisors.
              </p>
            </div>

            {/* Slider Navigation & Pause Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 border border-[var(--color-border)] rounded-sm p-1 bg-[var(--color-surface)]">
                <button
                  onClick={() => setIsSliderPaused(!isSliderPaused)}
                  className="p-1.5 hover:bg-[var(--color-subtle)] rounded text-[var(--color-foreground)] transition-colors"
                  title={isSliderPaused ? "Resume auto-slide" : "Pause auto-slide"}
                  aria-label={isSliderPaused ? "Resume" : "Pause"}
                >
                  {isSliderPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />}
                </button>
                <div className="h-4 w-px bg-[var(--color-border)]" />
                <button
                  onClick={handleSliderPrev}
                  className="p-1.5 hover:bg-[var(--color-subtle)] rounded text-[var(--color-foreground)] transition-colors"
                  title="Previous"
                  aria-label="Previous Properties"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSliderNext}
                  className="p-1.5 hover:bg-[var(--color-subtle)] rounded text-[var(--color-foreground)] transition-colors"
                  title="Next"
                  aria-label="Next Properties"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <Link
                to="/properties"
                className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors"
              >
                <span>Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Dynamic Auto-Sliding Track Container */}
          <div className="relative overflow-hidden">
            {loadingProperties ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm animate-pulse p-4 space-y-3"
                  >
                    <div className="h-44 bg-[var(--color-subtle)] rounded-xs" />
                    <div className="h-4 bg-[var(--color-subtle)] rounded w-1/3" />
                    <div className="h-5 bg-[var(--color-subtle)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--color-subtle)] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${sliderIdx * (100 / cardsPerView)}%)`,
                }}
              >
                {properties.map((prop) => (
                  <div
                    key={prop.id || prop._id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / cardsPerView}%` }}
                  >
                    <PropertyCard property={prop} variant="standard" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-muted-foreground)]">
                No properties currently loaded from database.
              </div>
            )}
          </div>

          {/* Slider Pagination Dots */}
          {properties.length > cardsPerView && (
            <div className="flex items-center justify-center space-x-1.5 pt-6">
              {Array.from({ length: maxSliderIdx + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    sliderIdx === idx
                      ? "w-6 bg-[var(--color-terracotta)]"
                      : "w-1.5 bg-[var(--color-border)] hover:bg-[var(--color-foreground)]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
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
              {localitiesList.slice(0, 4).map((loc) => (
                <Link
                  key={loc.id || loc.slug}
                  to={`/localities/${loc.slug || loc.id}`}
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
                key={art.id || art.slug}
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
