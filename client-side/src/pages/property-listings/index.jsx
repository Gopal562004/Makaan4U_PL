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
  MapPin,
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import InteractiveMap from "../../components/ui/InteractiveMap";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { EmptyProperties } from "../../components/ui/EmptyStates";
import { getAllProperties } from "../../lib/mongo/services/propertyService";
import { PROPERTIES as FALLBACK_PROPERTIES, AGENTS as FALLBACK_AGENTS } from "../../data/propertyData";
import FilterSidebar from "./components/FilterSidebar";

const CITIES_LIST = [
  { id: "All", name: "All Cities" },
  { id: "Mumbai", name: "Mumbai" },
  { id: "Delhi", name: "Delhi" },
  { id: "Bangalore", name: "Bangalore" },
  { id: "Hyderabad", name: "Hyderabad" },
  { id: "Chennai", name: "Chennai" },
  { id: "Kolkata", name: "Kolkata" },
  { id: "Pune", name: "Pune" },
  { id: "Ahmedabad", name: "Ahmedabad" },
  { id: "Thane", name: "Thane" },
  { id: "Gurugram", name: "Gurugram" },
  { id: "Noida", name: "Noida" },
];

const PropertyListings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query params
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Raw fetched properties from DB
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [cardLayout, setCardLayout] = useState("grid"); // "grid" | "list"
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState(null);

  // Top bar quick controls
  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "Buy");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("price-desc");

  // Comprehensive Filters state matching FilterSidebar
  const [filters, setFilters] = useState(() => ({
    priceRange: {
      min: searchParams.get("minPrice") || "",
      max: searchParams.get("maxPrice") || "",
    },
    location: searchParams.get("city") && searchParams.get("city") !== "All"
      ? [searchParams.get("city")]
      : searchParams.get("location")
      ? searchParams.get("location").split(",").filter(Boolean)
      : [],
    propertyType: searchParams.get("type") && searchParams.get("type") !== "All"
      ? [searchParams.get("type")]
      : [],
    bedrooms: searchParams.get("bedrooms") && searchParams.get("bedrooms") !== "All"
      ? searchParams.get("bedrooms")
      : "",
    bathrooms: searchParams.get("bathrooms") || "",
    amenities: searchParams.get("amenities")
      ? searchParams.get("amenities").split(",").filter(Boolean)
      : [],
    agent: searchParams.get("agent") || "",
  }));

  // Sync state when URL search changes externally
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("purpose")) setPurpose(params.get("purpose"));
    if (params.has("search")) setSearchQuery(params.get("search"));

    setFilters((prev) => ({
      ...prev,
      priceRange: {
        min: params.get("minPrice") || prev.priceRange.min,
        max: params.get("maxPrice") || prev.priceRange.max,
      },
      location: params.get("city") && params.get("city") !== "All"
        ? [params.get("city")]
        : params.get("location")
        ? params.get("location").split(",").filter(Boolean)
        : prev.location,
      propertyType: params.get("type") && params.get("type") !== "All"
        ? [params.get("type")]
        : prev.propertyType,
      bedrooms: params.get("bedrooms") && params.get("bedrooms") !== "All"
        ? params.get("bedrooms")
        : prev.bedrooms,
    }));
  }, [location.search]);

  // Load properties from backend with fallback to verified catalog
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllProperties({ limit: 100 })
      .then((res) => {
        if (!isMounted) return;
        const fetched = res?.properties || [];
        setProperties(fetched.length > 0 ? fetched : FALLBACK_PROPERTIES);
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error loading properties:", err);
          setProperties(FALLBACK_PROPERTIES);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update URL search parameters when filters change
  const updateUrl = (updatedFilters, updatedPurpose = purpose, updatedSearch = searchQuery) => {
    const params = new URLSearchParams();
    if (updatedPurpose && updatedPurpose !== "All") params.set("purpose", updatedPurpose);
    if (updatedSearch) params.set("search", updatedSearch);

    if (updatedFilters?.priceRange?.min) params.set("minPrice", updatedFilters.priceRange.min);
    if (updatedFilters?.priceRange?.max) params.set("maxPrice", updatedFilters.priceRange.max);
    if (updatedFilters?.location?.length === 1) {
      params.set("city", updatedFilters.location[0]);
    } else if (updatedFilters?.location?.length > 1) {
      params.set("location", updatedFilters.location.join(","));
    }
    if (updatedFilters?.propertyType?.length === 1) {
      params.set("type", updatedFilters.propertyType[0]);
    }
    if (updatedFilters?.bedrooms) params.set("bedrooms", updatedFilters.bedrooms);
    if (updatedFilters?.bathrooms) params.set("bathrooms", updatedFilters.bathrooms);
    if (updatedFilters?.amenities?.length) params.set("amenities", updatedFilters.amenities.join(","));
    if (updatedFilters?.agent) params.set("agent", updatedFilters.agent);

    navigate(`/properties?${params.toString()}`, { replace: true });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateUrl(newFilters, purpose, searchQuery);
  };

  const handlePurposeChange = (newPurpose) => {
    setPurpose(newPurpose);
    updateUrl(filters, newPurpose, searchQuery);
  };

  const handleQuickCityChange = (cityName) => {
    const nextLocations = cityName === "All" || cityName === "All Cities" ? [] : [cityName];
    const newFilters = { ...filters, location: nextLocations };
    setFilters(newFilters);
    updateUrl(newFilters, purpose, searchQuery);
  };

  const resetAllFilters = () => {
    const cleared = {
      priceRange: { min: "", max: "" },
      location: [],
      propertyType: [],
      bedrooms: "",
      bathrooms: "",
      amenities: [],
      agent: "",
    };
    setFilters(cleared);
    setSearchQuery("");
    setPurpose("Buy");
    navigate("/properties", { replace: true });
  };

  // Master filtered properties calculation
  const filteredProperties = useMemo(() => {
    let list = [...properties];

    // Purpose filter
    if (purpose && purpose !== "All") {
      if (purpose === "Commercial") {
        list = list.filter(
          (p) =>
            p.isCommercial ||
            p.propertyType?.toLowerCase().includes("commercial") ||
            p.category === "commercial" ||
            p.type?.toLowerCase().includes("commercial")
        );
      } else if (purpose === "Rent") {
        list = list.filter(
          (p) =>
            p.listingType?.toLowerCase() === "rent" ||
            p.purpose?.toLowerCase() === "rent"
        );
      } else if (purpose === "Buy") {
        list = list.filter(
          (p) =>
            !p.isCommercial &&
            (p.listingType?.toLowerCase() === "buy" ||
              p.purpose?.toLowerCase() === "buy" ||
              !p.listingType)
        );
      } else if (purpose === "Plots") {
        list = list.filter(
          (p) =>
            p.type?.toLowerCase().includes("plot") ||
            p.type?.toLowerCase().includes("land") ||
            p.propertyType?.toLowerCase().includes("plot") ||
            p.propertyType?.toLowerCase().includes("land") ||
            p.category?.toLowerCase() === "agricultural"
        );
      }
    }

    // Keyword Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.location?.city && p.location.city.toLowerCase().includes(q)) ||
          (p.location?.locality && p.location.locality.toLowerCase().includes(q)) ||
          (p.location?.address && p.location.address.toLowerCase().includes(q))
      );
    }

    // Price Range Filter
    const minP = Number(filters.priceRange?.min);
    if (!isNaN(minP) && minP > 0) {
      list = list.filter((p) => (p.priceNumeric || p.price || 0) >= minP);
    }
    const maxP = Number(filters.priceRange?.max);
    if (!isNaN(maxP) && maxP > 0) {
      list = list.filter((p) => (p.priceNumeric || p.price || 0) <= maxP);
    }

    // Location Filter (Multi-select)
    if (filters.location?.length > 0) {
      list = list.filter((p) => {
        const cityStr = (p.location?.city || p.city || "").toLowerCase();
        const locStr = (p.location?.locality || p.locality || "").toLowerCase();
        const addrStr = (p.location?.address || p.address || "").toLowerCase();
        return filters.location.some((loc) => {
          const l = loc.toLowerCase();
          return cityStr.includes(l) || locStr.includes(l) || addrStr.includes(l);
        });
      });
    }

    // Property Type Filter (Multi-select)
    if (filters.propertyType?.length > 0) {
      list = list.filter((p) => {
        const pType = (p.type || p.propertyType || p.category || "").toLowerCase();
        return filters.propertyType.some((t) => {
          const target = t.toLowerCase().replace(/-/g, " ");
          return pType.includes(target) || pType.includes(t.toLowerCase());
        });
      });
    }

    // Bedrooms Filter
    if (filters.bedrooms) {
      list = list.filter((p) => {
        const pBhk = Number(
          p.specifications?.bedrooms || p.bedrooms || p.bhk || 0
        );
        if (filters.bedrooms === "6+") {
          return pBhk >= 6;
        }
        return pBhk === Number(filters.bedrooms);
      });
    }

    // Bathrooms Filter
    if (filters.bathrooms) {
      list = list.filter((p) => {
        const pBath = Number(
          p.specifications?.bathrooms || p.bathrooms || 0
        );
        if (filters.bathrooms === "6+") {
          return pBath >= 6;
        }
        return pBath === Number(filters.bathrooms);
      });
    }

    // Amenities Filter
    if (filters.amenities?.length > 0) {
      list = list.filter((p) => {
        const pAmenities = (p.amenities || []).map((a) =>
          (typeof a === "string" ? a : a?.name || "")
            .toLowerCase()
            .replace(/-/g, " ")
        );
        return filters.amenities.every((reqA) => {
          const target = reqA.toLowerCase().replace(/-/g, " ").trim();
          return pAmenities.some(
            (pa) => pa.includes(target) || target.includes(pa)
          );
        });
      });
    }

    // Agent Filter (Real Agent matching by ID or Name)
    if (filters.agent) {
      const targetAgent = String(filters.agent).toLowerCase().trim();
      list = list.filter((p) => {
        const ag = p.agent || p.assignedAgent || p.postedBy || p.agentInfo;
        const agId = String(ag?.id || ag?._id || "").toLowerCase().trim();
        const agName = String(ag?.name || "").toLowerCase().trim();
        return (
          agId === targetAgent ||
          agName === targetAgent ||
          agName.includes(targetAgent) ||
          targetAgent.includes(agName)
        );
      });
    }

    // Sort by price
    if (sortBy === "price-desc") {
      list.sort((a, b) => (b.priceNumeric || b.price || 0) - (a.priceNumeric || a.price || 0));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => (a.priceNumeric || a.price || 0) - (b.priceNumeric || b.price || 0));
    }

    return list;
  }, [properties, purpose, searchQuery, filters, sortBy]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset to page 1 whenever filters, search, purpose, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, purpose, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, startIndex, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const feed = document.getElementById("property-results-feed");
    if (feed) {
      feed.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Active filter count for badge display
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange?.min || filters.priceRange?.max) count++;
    if (filters.location?.length > 0) count += filters.location.length;
    if (filters.propertyType?.length > 0) count += filters.propertyType.length;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.amenities?.length > 0) count += filters.amenities.length;
    if (filters.agent) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  // Active filter dismissable chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (searchQuery) {
      chips.push({
        label: `"${searchQuery}"`,
        onRemove: () => {
          setSearchQuery("");
          updateUrl(filters, purpose, "");
        },
      });
    }
    if (filters.priceRange?.min || filters.priceRange?.max) {
      const minTxt = filters.priceRange?.min ? `₹${Number(filters.priceRange.min).toLocaleString("en-IN")}` : "0";
      const maxTxt = filters.priceRange?.max ? `₹${Number(filters.priceRange.max).toLocaleString("en-IN")}` : "∞";
      chips.push({
        label: `${minTxt} - ${maxTxt}`,
        onRemove: () => handleFilterChange({ ...filters, priceRange: { min: "", max: "" } }),
      });
    }
    (filters.location || []).forEach((loc) => {
      chips.push({
        label: loc,
        onRemove: () =>
          handleFilterChange({
            ...filters,
            location: filters.location.filter((l) => l !== loc),
          }),
      });
    });
    (filters.propertyType || []).forEach((type) => {
      chips.push({
        label: type,
        onRemove: () =>
          handleFilterChange({
            ...filters,
            propertyType: filters.propertyType.filter((t) => t !== type),
          }),
      });
    });
    if (filters.bedrooms) {
      chips.push({
        label: `${filters.bedrooms} BHK`,
        onRemove: () => handleFilterChange({ ...filters, bedrooms: "" }),
      });
    }
    if (filters.bathrooms) {
      chips.push({
        label: `${filters.bathrooms} Bath`,
        onRemove: () => handleFilterChange({ ...filters, bathrooms: "" }),
      });
    }
    (filters.amenities || []).forEach((amenity) => {
      chips.push({
        label: amenity,
        onRemove: () =>
          handleFilterChange({
            ...filters,
            amenities: filters.amenities.filter((a) => a !== amenity),
          }),
      });
    });

    return chips;
  }, [filters, searchQuery, purpose]);

  const primaryCityName =
    filters.location?.length === 1 ? filters.location[0] : "India";

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`Properties for ${purpose} in ${primaryCityName} | Makaan4U`}</title>
        <meta
          name="description"
          content={`Explore verified residential and commercial properties for ${purpose} in ${primaryCityName}. Real prices, verified floor plans, authentic photos.`}
        />
      </Helmet>

      <Header />

      {/* ====================================================================
          TOP FILTER CONTROLS BAR (Sticky below Header)
      ==================================================================== */}
      <div className="sticky top-16 sm:top-20 z-30 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 py-2.5 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left Controls: Purpose + Quick City Picker */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Purpose Selector */}
            <div className="flex border border-[var(--color-border)] rounded-sm p-0.5 text-xs font-semibold bg-[var(--color-subtle)]">
              {["All", "Buy", "Rent", "Commercial", "Plots"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePurposeChange(p)}
                  className={`px-3 py-1 rounded-xs transition-colors ${
                    purpose === p
                      ? "bg-[var(--color-foreground)] text-[var(--color-surface)] shadow-xs font-bold"
                      : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {p === "Plots" ? "Plots / Land" : p}
                </button>
              ))}
            </div>

            {/* Quick City Dropdown */}
            <div className="relative">
              <select
                value={filters.location?.length === 1 ? filters.location[0] : "All"}
                onChange={(e) => handleQuickCityChange(e.target.value)}
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
              type="button"
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
            {/* Show / Hide Map Button */}
            <button
              type="button"
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
                type="button"
                onClick={() => setCardLayout("grid")}
                className={`p-1 px-1.5 rounded-xs flex items-center space-x-1 ${
                  cardLayout === "grid"
                    ? "bg-[var(--color-surface)] shadow-xs font-semibold text-[var(--color-foreground)]"
                    : "text-[var(--color-muted-foreground)]"
                }`}
                title="Grid Layout"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCardLayout("list")}
                className={`p-1 px-1.5 rounded-xs flex items-center space-x-1 ${
                  cardLayout === "list"
                    ? "bg-[var(--color-surface)] shadow-xs font-semibold text-[var(--color-foreground)]"
                    : "text-[var(--color-muted-foreground)]"
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
          PAGE CONTENT: Left Filter Sidebar (Always Open on Desktop) + Results Feed
      ==================================================================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-16 space-y-4">
        {/* Breadcrumb Trail & Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-3 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[var(--color-muted-foreground)] mb-1">
              <Link to="/" className="hover:text-[var(--color-foreground)]">Home</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-[var(--color-foreground)]">Properties</Link>
              {primaryCityName !== "India" && (
                <>
                  <span>/</span>
                  <span className="text-[var(--color-foreground)] font-medium">{primaryCityName}</span>
                </>
              )}
            </div>

            <h1 className="font-editorial text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-foreground)] flex flex-wrap items-center gap-2">
              <span>{purpose === "All" ? "All Properties" : `Properties for ${purpose}`} in {primaryCityName}</span>
              <span className="text-xs font-mono font-normal text-[var(--color-muted-foreground)] bg-[var(--color-subtle)] px-2 py-0.5 rounded-xs border border-[var(--color-border)]">
                {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
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
                    type="button"
                    onClick={chip.onRemove}
                    className="hover:text-red-600 transition-colors"
                    aria-label={`Remove ${chip.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-[var(--color-terracotta)] hover:underline font-semibold ml-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Interactive Map (Only rendered when user toggles "Show Map") */}
        {showMap && (
          <section className="w-full h-[480px] sm:h-[540px] rounded-sm overflow-hidden border border-[var(--color-border)] shadow-md animate-fade-in mb-6">
            <InteractiveMap
              properties={filteredProperties}
              activePropertyId={selectedPropId}
              centerCity={primaryCityName !== "India" ? primaryCityName : "Mumbai"}
              onSelectProperty={(p) => setSelectedPropId(p?.id || p?._id || null)}
            />
          </section>
        )}

        {/* Two-Column Layout: Left Filter Sidebar (Desktop) + Right Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
          {/* ====================================================================
              DESKTOP FILTER SIDEBAR (Always Open on Desktop lg:block)
          ==================================================================== */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28 self-start">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              propertyCount={filteredProperties.length}
              properties={properties}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                updateUrl(filters, purpose, q);
              }}
            />
          </aside>

          {/* ====================================================================
              RIGHT RESULTS FEED
          ==================================================================== */}
          <section id="property-results-feed" className="lg:col-span-8 xl:col-span-9 space-y-5">
            {loading ? (
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
            ) : filteredProperties.length === 0 ? (
              <EmptyProperties onResetFilters={resetAllFilters} />
            ) : cardLayout === "list" ? (
              <div className="space-y-4">
                {paginatedProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id || prop._id}
                    property={prop}
                    variant="horizontal"
                    onSelectOnMap={() => setSelectedPropId(prop.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id || prop._id}
                    property={prop}
                    variant="standard"
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredProperties.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[var(--color-muted-foreground)]">
                  Showing <span className="font-semibold text-[var(--color-foreground)]">{startIndex + 1}</span> -{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {Math.min(startIndex + itemsPerPage, filteredProperties.length)}
                  </span>{" "}
                  of <span className="font-semibold text-[var(--color-foreground)]">{filteredProperties.length}</span> properties
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center space-x-1.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-sm text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-subtle)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`w-7 h-7 rounded-sm text-xs font-semibold transition-colors flex items-center justify-center ${
                          currentPage === page
                            ? "bg-[var(--color-foreground)] text-[var(--color-surface)] font-bold shadow-xs"
                            : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-subtle)]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-sm text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-subtle)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ====================================================================
          MOBILE FILTER DRAWER (< lg)
      ==================================================================== */}
      <FilterSidebar
        filters={filters}
        onChange={handleFilterChange}
        propertyCount={filteredProperties.length}
        properties={properties}
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        isMobile={true}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          updateUrl(filters, purpose, q);
        }}
      />

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default PropertyListings;
