import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  SlidersHorizontal,
  Map,
  Grid,
  List,
  Search,
  X,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Building,
  Check,
  MapPin,
  ArrowUpDown,
  Filter,
  Sparkles
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import InteractiveMap from "../../components/ui/InteractiveMap";
import CompareDrawer from "../../components/ui/CompareDrawer";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { EmptyProperties } from "../../components/ui/EmptyStates";
import { getAllProperties } from "../../lib/mongo/services/propertyService";

const CITIES_LIST = [
  { id: "All", name: "All Cities" },
  { id: "Mumbai", name: "Mumbai" },
  { id: "Thane", name: "Thane" },
  { id: "Pune", name: "Pune" },
  { id: "Bangalore", name: "Bangalore" },
  { id: "Delhi NCR", name: "Delhi NCR" },
  { id: "Hyderabad", name: "Hyderabad" },
  { id: "Goa", name: "Goa" }
];

const PROPERTY_TYPES = [
  { id: "All", label: "All Types" },
  { id: "apartment", label: "Apartments" },
  { id: "villa", label: "Villas" },
  { id: "penthouse", label: "Penthouses" },
  { id: "commercial", label: "Commercial" }
];

const PropertyListings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false); // Map hidden by default as requested
  const [cardLayout, setCardLayout] = useState("grid"); // "grid" | "list"
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState(null);

  // Filter facets
  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "Buy");
  const [city, setCity] = useState(searchParams.get("city") || "All");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "All");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "All");
  const [maxBudget, setMaxBudget] = useState(Number(searchParams.get("maxBudget")) || 100000000);
  const [possession, setPossession] = useState(searchParams.get("possession") || "All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("price-desc");

  // Keep state synchronized with URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("purpose")) setPurpose(params.get("purpose"));
    if (params.has("city")) setCity(params.get("city"));
    if (params.has("type")) setPropertyType(params.get("type"));
    if (params.has("bedrooms")) setBedrooms(params.get("bedrooms"));
    if (params.has("search")) setSearchQuery(params.get("search"));
  }, [location.search]);

  // Update URL search parameters cleanly
  const updateUrl = (newFilters) => {
    const params = new URLSearchParams(location.search);
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "All" && v !== "") {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    navigate(`/properties?${params.toString()}`, { replace: true });
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
    updateUrl({ city: newCity });
  };

  const handlePurposeChange = (newPurpose) => {
    setPurpose(newPurpose);
    updateUrl({ purpose: newPurpose });
  };

  const handleTypeChange = (newType) => {
    setPropertyType(newType);
    updateUrl({ type: newType });
  };

  const handleBedroomsChange = (newBhk) => {
    setBedrooms(newBhk);
    updateUrl({ bedrooms: newBhk });
  };

  // Fetch properties from live MongoDB service
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const apiFilters = {
      search: searchQuery,
      city: city !== "All" ? city : undefined,
      type: propertyType !== "All" ? propertyType.toLowerCase() : undefined,
      bedrooms: bedrooms !== "All" ? bedrooms : undefined,
      maxPrice: maxBudget < 100000000 ? maxBudget : undefined,
    };

    getAllProperties(apiFilters)
      .then((res) => {
        if (!isMounted) return;
        let list = res?.properties || [];

        // Apply purpose filter (Buy / Rent / Commercial)
        if (purpose && purpose !== "All") {
          if (purpose === "Commercial") {
            list = list.filter((p) => p.isCommercial || p.propertyType?.toLowerCase().includes("commercial"));
          } else if (purpose === "Rent") {
            list = list.filter((p) => p.listingType?.toLowerCase() === "rent");
          } else if (purpose === "Buy") {
            list = list.filter((p) => !p.isCommercial && p.listingType?.toLowerCase() === "buy");
          }
        }

        // Apply verified filter
        if (verifiedOnly) {
          list = list.filter((p) => p.verified);
        }

        // Apply possession
        if (possession && possession !== "All") {
          list = list.filter((p) => p.possession?.toLowerCase().includes(possession.toLowerCase()));
        }

        // Sort by price
        if (sortBy === "price-desc") {
          list.sort((a, b) => (b.priceNumeric || 0) - (a.priceNumeric || 0));
        } else if (sortBy === "price-asc") {
          list.sort((a, b) => (a.priceNumeric || 0) - (b.priceNumeric || 0));
        }

        setProperties(list);
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error loading properties:", err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [purpose, city, propertyType, bedrooms, maxBudget, possession, verifiedOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setPurpose("Buy");
    setCity("All");
    setPropertyType("All");
    setBedrooms("All");
    setMaxBudget(100000000);
    setPossession("All");
    setVerifiedOnly(false);
    setSearchQuery("");
    navigate("/properties", { replace: true });
  };

  const formatRupees = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (city !== "All") count++;
    if (propertyType !== "All") count++;
    if (bedrooms !== "All") count++;
    if (maxBudget < 100000000) count++;
    if (searchQuery) count++;
    if (verifiedOnly) count++;
    if (possession !== "All") count++;
    return count;
  }, [city, propertyType, bedrooms, maxBudget, searchQuery, verifiedOnly, possession]);

  // Active filter dismissable chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (city !== "All") chips.push({ label: `City: ${city}`, onRemove: () => handleCityChange("All") });
    if (propertyType !== "All") chips.push({ label: `Type: ${propertyType}`, onRemove: () => handleTypeChange("All") });
    if (bedrooms !== "All") chips.push({ label: `${bedrooms} BHK`, onRemove: () => handleBedroomsChange("All") });
    if (searchQuery) chips.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery("") });
    if (maxBudget < 100000000) chips.push({ label: `≤ ${formatRupees(maxBudget)}`, onRemove: () => setMaxBudget(100000000) });
    if (verifiedOnly) chips.push({ label: "Verified Only", onRemove: () => setVerifiedOnly(false) });
    if (possession !== "All") chips.push({ label: possession, onRemove: () => setPossession("All") });
    return chips;
  }, [city, propertyType, bedrooms, searchQuery, maxBudget, verifiedOnly, possession]);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`Properties for ${purpose} in ${city === "All" ? "India" : city} | Makaan4U`}</title>
        <meta
          name="description"
          content={`Explore verified residential and commercial properties for ${purpose} in ${city}. Real prices, verified floor plans, authentic photos.`}
        />
      </Helmet>

      <Header />

      {/* ====================================================================
          TOP FILTER CONTROLS BAR (Sticky below Header)
      ==================================================================== */}
      <div className="sticky top-16 sm:top-20 z-30 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 py-2.5 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left Controls: Purpose + City Picker */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Purpose Selector */}
            <div className="flex border border-[var(--color-border)] rounded-sm p-0.5 text-xs font-semibold bg-[var(--color-subtle)]">
              {["Buy", "Rent", "Commercial"].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePurposeChange(p)}
                  className={`px-3 py-1 rounded-xs transition-colors ${
                    purpose === p
                      ? "bg-[var(--color-foreground)] text-[var(--color-surface)] shadow-xs"
                      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="h-8 pl-7 pr-7 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-xs font-medium text-[var(--color-foreground)] focus:outline-none cursor-pointer appearance-none"
              >
                {CITIES_LIST.map((c) => (
                  <option key={c.id} value={c.name === "All Cities" ? "All" : c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-[var(--color-terracotta)] absolute left-2 top-2.5 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-[var(--color-muted-foreground)] absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Mobile Filters Button (< lg) */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center space-x-1.5 h-8 px-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs font-semibold text-[var(--color-foreground)]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[var(--color-terracotta)] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Controls: Sort, Show Map Toggle & View Mode */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            {/* Show / Hide Map Button (Hidden by default as requested) */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center space-x-1.5 h-8 px-3 rounded-sm border text-xs font-semibold transition-colors ${
                showMap
                  ? "bg-[var(--color-foreground)] text-[var(--color-surface)] border-[var(--color-foreground)] shadow-xs"
                  : "bg-[var(--color-subtle)] text-[var(--color-foreground)] border-[var(--color-border)] hover:border-[var(--color-foreground)]"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{showMap ? "Hide Map" : "Show Map"}</span>
            </button>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 px-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none truncate"
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>

            {/* Grid / List Layout Switcher */}
            <div className="flex border border-[var(--color-border)] rounded-sm p-0.5 bg-[var(--color-subtle)]">
              <button
                onClick={() => setCardLayout("grid")}
                className={`p-1 px-1.5 rounded-xs flex items-center space-x-1 ${
                  cardLayout === "grid" ? "bg-[var(--color-surface)] shadow-xs font-semibold text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
                }`}
                title="Grid Layout"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCardLayout("list")}
                className={`p-1 px-1.5 rounded-xs flex items-center space-x-1 ${
                  cardLayout === "list" ? "bg-[var(--color-surface)] shadow-xs font-semibold text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
                }`}
                title="List Layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PAGE CONTENT: Left Filter Sidebar (Always Open on Desktop) + Properties
      ==================================================================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-16 space-y-4">
        {/* Breadcrumb Trail & Clean Headline Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-3 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[var(--color-muted-foreground)] mb-1">
              <Link to="/" className="hover:text-[var(--color-foreground)]">Home</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-[var(--color-foreground)]">Properties</Link>
              {city !== "All" && (
                <>
                  <span>/</span>
                  <span className="text-[var(--color-foreground)] font-medium">{city}</span>
                </>
              )}
            </div>

            <h1 className="font-editorial text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-foreground)] flex flex-wrap items-center gap-2">
              <span>Properties for {purpose} in {city === "All" ? "India" : city}</span>
              <span className="text-xs font-mono font-normal text-[var(--color-muted-foreground)] bg-[var(--color-subtle)] px-2 py-0.5 rounded-xs border border-[var(--color-border)]">
                {properties.length} {properties.length === 1 ? "listing" : "listings"}
              </span>
            </h1>
          </div>

          {/* Active Chips Strip */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-medium text-[var(--color-foreground)] shadow-2xs"
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={chip.onRemove}
                    className="hover:text-red-600 transition-colors"
                    aria-label={`Remove ${chip.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="text-xs text-[var(--color-terracotta)] hover:underline font-semibold ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Actual Google Map (Only rendered when user toggles "Show Map") */}
        {showMap && (
          <section className="w-full h-[480px] sm:h-[540px] rounded-sm overflow-hidden border border-[var(--color-border)] shadow-md animate-fade-in mb-6">
            <InteractiveMap
              properties={properties}
              activePropertyId={selectedPropId}
              centerCity={city !== "All" ? city : "Mumbai"}
              onSelectProperty={(p) => setSelectedPropId(p?.id || p?._id || null)}
            />
          </section>
        )}

        {/* Two-Column Layout: Left Filter Sidebar (Always Open on Desktop) + Right Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
          {/* ====================================================================
              LEFT FILTER SIDEBAR: Always Open for Desktop (lg:block)
          ==================================================================== */}
          <aside className="hidden lg:block lg:col-span-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 space-y-6 sticky top-28 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center space-x-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[var(--color-terracotta)]" />
                <span className="font-editorial text-base font-bold text-[var(--color-foreground)]">
                  Filter Catalog
                </span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-[var(--color-muted-foreground)] hover:text-red-600 flex items-center space-x-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFilterCount})</span>
                </button>
              )}
            </div>

            {/* Keyword / Locality Search */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
                Keyword / Locality
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--color-muted-foreground)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateUrl({ search: e.target.value });
                  }}
                  placeholder="e.g. Worli, Powai, Bandra..."
                  className="w-full pl-8 pr-2.5 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
                />
              </div>
            </div>

            {/* Property Category */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
                Property Category
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {PROPERTY_TYPES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleTypeChange(cat.id === "All" ? "All" : cat.id)}
                    className={`py-1.5 px-2 text-left rounded-xs text-[11px] border transition-colors ${
                      propertyType.toLowerCase() === cat.id.toLowerCase()
                        ? "bg-[var(--color-foreground)] font-bold text-[var(--color-surface)] border-[var(--color-foreground)] shadow-xs"
                        : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-subtle)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms (BHK) Filter */}
            {!purpose.includes("Commercial") && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
                  Bedrooms
                </label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {["All", "1", "2", "3", "4"].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => handleBedroomsChange(bhk)}
                      className={`py-1.5 rounded-xs border text-center transition-colors text-[11px] ${
                        bedrooms === bhk
                          ? "bg-[var(--color-foreground)] text-[var(--color-surface)] font-bold shadow-xs"
                          : "border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                      }`}
                    >
                      {bhk === "All" ? "Any" : `${bhk} BHK`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Maximum Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)]">
                  Max Budget
                </span>
                <span className="font-mono font-bold text-[var(--color-foreground)]">
                  {maxBudget >= 100000000 ? "Any Budget" : formatRupees(maxBudget)}
                </span>
              </div>
              <input
                type="range"
                min="1000000"
                max="100000000"
                step="2500000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-[var(--color-terracotta)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-muted-foreground)] font-mono mt-1">
                <span>₹10 L</span>
                <span>₹5 Cr</span>
                <span>₹10 Cr+</span>
              </div>
            </div>

            {/* Verified Listings Only Toggle */}
            <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--color-foreground)]">Verified Listings</p>
                <p className="text-[10px] text-[var(--color-muted-foreground)]">Physically verified on-site</p>
              </div>
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  verifiedOnly ? "bg-emerald-600" : "bg-[var(--color-border)]"
                }`}
                aria-label="Toggle Verified Only"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    verifiedOnly ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>
          </aside>

          {/* ====================================================================
              RIGHT RESULTS FEED: Properties (Spacious, No Map Squeeze)
          ==================================================================== */}
          <section className="lg:col-span-9 space-y-5">
            {loading ? (
              /* Skeletons */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
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
            ) : properties.length === 0 ? (
              <EmptyProperties onResetFilters={resetFilters} />
            ) : cardLayout === "list" ? (
              /* LIST VIEW: Full-Width Horizontal Cards */
              <div className="space-y-4">
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop.id || prop._id}
                    property={prop}
                    variant="horizontal"
                    onSelectOnMap={() => setSelectedPropId(prop.id)}
                  />
                ))}
              </div>
            ) : (
              /* GRID VIEW: 2 or 3 Columns of Standard Property Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop.id || prop._id}
                    property={prop}
                    variant="standard"
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ====================================================================
          MOBILE FILTER DRAWER (< lg)
      ==================================================================== */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in">
          <div className="w-full max-w-sm bg-[var(--color-surface)] h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--color-terracotta)]" />
                  <span className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                    Filter Catalogue
                  </span>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1.5 hover:text-red-600 rounded-sm transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5 text-[var(--color-foreground)]" />
                </button>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
                  Metro City
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)]"
                >
                  {CITIES_LIST.map((c) => (
                    <option key={c.id} value={c.name === "All Cities" ? "All" : c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
                  Search Locality / Landmark
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      updateUrl({ search: e.target.value });
                    }}
                    placeholder="e.g. Powai, Worli, Bandra..."
                    className="w-full pl-9 pr-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
                  Property Category
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {PROPERTY_TYPES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleTypeChange(cat.id === "All" ? "All" : cat.id)}
                      className={`py-2 px-3 text-left rounded-sm border transition-colors ${
                        propertyType.toLowerCase() === cat.id.toLowerCase()
                          ? "bg-[var(--color-foreground)] text-[var(--color-surface)] font-bold shadow-xs"
                          : "border-[var(--color-border)] text-[var(--color-muted-foreground)]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms (BHK) */}
              <div>
                <label className="block text-xs font-semibold text-[var(--color-foreground)] mb-1.5">
                  Bedrooms
                </label>
                <div className="grid grid-cols-5 gap-1.5 text-xs">
                  {["All", "1", "2", "3", "4"].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => handleBedroomsChange(bhk)}
                      className={`py-2 rounded-sm border text-center transition-colors ${
                        bedrooms === bhk
                          ? "bg-[var(--color-foreground)] text-[var(--color-surface)] font-bold"
                          : "border-[var(--color-border)] text-[var(--color-muted-foreground)]"
                      }`}
                    >
                      {bhk === "All" ? "Any" : `${bhk}B`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[var(--color-foreground)]">Maximum Budget</span>
                  <span className="font-mono font-bold text-[var(--color-terracotta)]">
                    {maxBudget >= 100000000 ? "Any Budget" : formatRupees(maxBudget)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000000"
                  max="100000000"
                  step="2500000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[var(--color-terracotta)]"
                />
              </div>

              {/* Verified Toggle */}
              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-foreground)]">Verified Listings</p>
                  <p className="text-[10px] text-[var(--color-muted-foreground)]">Physically verified on-site</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    verifiedOnly ? "bg-emerald-600" : "bg-[var(--color-border)]"
                  }`}
                  aria-label="Toggle Verified Only"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      verifiedOnly ? "translate-x-4" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[var(--color-border)] flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 text-xs font-semibold border border-[var(--color-border)] rounded-sm"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-sm"
              >
                Show {properties.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default PropertyListings;
