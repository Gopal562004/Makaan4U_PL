import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronUp,
  ChevronDown,
  X,
  RotateCcw,
  Building2,
  Home,
  Square,
  Building,
  TreePine,
  Warehouse,
  Search,
  Check,
  Star,
  MapPin,
} from "lucide-react";
import { AGENTS as STATIC_AGENTS } from "../../../data/propertyData";

// Icon mapping for property types
const TYPE_ICONS = {
  Apartment: Building2,
  Villa: Home,
  "Independent House": Home,
  Penthouse: Building,
  "Commercial Space": Warehouse,
  "Studio Apartment": Building2,
  "Plot / Land": Square,
  Plot: Square,
  "Farm House": TreePine,
  Duplex: Home,
};

// Stable top-level FilterSection component to prevent DOM remounting & scroll-jumping
const FilterSection = React.memo(({ title, children, isExpanded, onToggle, count = 0 }) => (
  <div className="border-b border-[var(--color-border)] pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      className="w-full flex items-center justify-between py-1.5 text-left rounded transition-colors group cursor-pointer"
    >
      <div className="flex items-center space-x-2">
        <h3 className="font-semibold text-xs text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)]">
          {title}
        </h3>
        {count > 0 && (
          <span className="text-[9px] bg-[var(--color-terracotta)] text-white px-1.5 py-0.2 rounded-full font-bold">
            {count}
          </span>
        )}
      </div>
      {isExpanded ? (
        <ChevronUp
          size={14}
          className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]"
        />
      ) : (
        <ChevronDown
          size={14}
          className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]"
        />
      )}
    </button>
    {isExpanded && <div className="mt-2 space-y-2">{children}</div>}
  </div>
));

const FilterSidebar = ({
  filters = {},
  onChange,
  propertyCount = 0,
  properties = [],
  isOpen = false,
  onClose,
  isMobile = false,
  searchQuery = "",
  onSearchChange,
}) => {
  const [localFilters, setLocalFilters] = useState(() => ({
    priceRange: filters?.priceRange || { min: "", max: "" },
    location: filters?.location || [],
    propertyType: filters?.propertyType || [],
    bedrooms: filters?.bedrooms || "",
    bathrooms: filters?.bathrooms || "",
    amenities: filters?.amenities || [],
    agent: filters?.agent || "",
  }));

  // Smart collapsible sections: keep most frequent open, others collapsed
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    location: true,
    type: true,
    bedrooms: true,
    bathrooms: false,
    amenities: true,
    agent: false,
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [amenitySearch, setAmenitySearch] = useState("");
  const scrollContainerRef = useRef(null);

  // Sync incoming filters with local state
  useEffect(() => {
    if (filters) {
      setLocalFilters({
        priceRange: filters.priceRange || { min: "", max: "" },
        location: filters.location || [],
        propertyType: filters.propertyType || [],
        bedrooms: filters.bedrooms || "",
        bathrooms: filters.bathrooms || "",
        amenities: filters.amenities || [],
        agent: filters.agent || "",
      });
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onChange) onChange(newFilters);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: { min: "", max: "" },
      location: [],
      propertyType: [],
      bedrooms: "",
      bathrooms: "",
      amenities: [],
      agent: "",
    };
    setLocalFilters(clearedFilters);
    if (onSearchChange) onSearchChange("");
    if (onChange) onChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.priceRange?.min || localFilters.priceRange?.max) count++;
    if (localFilters.location?.length > 0) count += localFilters.location.length;
    if (localFilters.propertyType?.length > 0) count += localFilters.propertyType.length;
    if (localFilters.bedrooms) count++;
    if (localFilters.bathrooms) count++;
    if (localFilters.amenities?.length > 0) count += localFilters.amenities.length;
    if (localFilters.agent) count++;
    if (searchQuery) count++;
    return count;
  };

  // =========================================================================
  // DYNAMIC REAL DATA AGGREGATION FROM PROPERTIES
  // =========================================================================

  // 1. Real Locations aggregated directly from data
  const realLocations = useMemo(() => {
    const cityMap = new Map();

    const defaultHubs = ["Mumbai", "Bangalore", "Delhi NCR", "Pune", "Goa", "Hyderabad", "Thane"];
    defaultHubs.forEach((hub) => {
      cityMap.set(hub.toLowerCase(), { name: hub, count: 0 });
    });

    (properties || []).forEach((p) => {
      const city = p.city || p.location?.city;
      if (city && city.trim()) {
        const clean = city.trim();
        const key = clean.toLowerCase();
        if (!cityMap.has(key)) {
          cityMap.set(key, { name: clean, count: 0 });
        }
        cityMap.get(key).count += 1;
      }
    });

    return Array.from(cityMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [properties]);

  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return realLocations;
    const q = locationSearch.toLowerCase().trim();
    return realLocations.filter((item) => item.name.toLowerCase().includes(q));
  }, [locationSearch, realLocations]);

  // 2. Real Property Types aggregated from data
  const realPropertyTypes = useMemo(() => {
    const typeMap = new Map();

    const baseTypes = [
      "Apartment",
      "Villa",
      "Independent House",
      "Penthouse",
      "Commercial Space",
      "Studio Apartment",
      "Plot / Land",
    ];
    baseTypes.forEach((t) => {
      typeMap.set(t.toLowerCase(), { label: t, value: t, count: 0 });
    });

    (properties || []).forEach((p) => {
      const raw = p.propertyType || p.type || p.specifications?.type;
      if (raw && String(raw).trim()) {
        const normalized = String(raw)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .trim();
        const key = normalized.toLowerCase();
        if (!typeMap.has(key)) {
          typeMap.set(key, { label: normalized, value: normalized, count: 0 });
        }
        typeMap.get(key).count += 1;
      }
    });

    return Array.from(typeMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label);
    });
  }, [properties]);

  // 3. Real Price Ranges with live property counts
  const realPriceRanges = useMemo(() => {
    const ranges = [
      { label: "Under ₹1 Cr", min: 0, max: 10000000 },
      { label: "₹1 Cr - ₹3 Cr", min: 10000000, max: 30000000 },
      { label: "₹3 Cr - ₹5 Cr", min: 30000000, max: 50000000 },
      { label: "₹5 Cr - ₹15 Cr", min: 50000000, max: 150000000 },
      { label: "₹15 Cr - ₹30 Cr", min: 150000000, max: 300000000 },
      { label: "Above ₹30 Cr", min: 300000000, max: 9999999999 },
    ];

    return ranges.map((r) => {
      const matchingCount = (properties || []).filter((p) => {
        const price = Number(p.priceNumeric || p.price || 0);
        return price >= r.min && price <= r.max;
      }).length;
      return { ...r, count: matchingCount };
    });
  }, [properties]);

  // 4. Real Bedroom Counts
  const bedroomCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, "5+": 0 };
    (properties || []).forEach((p) => {
      const bhk = Number(p.specifications?.bedrooms || p.bedrooms || p.bhk || 0);
      if (bhk === 1) counts[1] += 1;
      else if (bhk === 2) counts[2] += 1;
      else if (bhk === 3) counts[3] += 1;
      else if (bhk === 4) counts[4] += 1;
      else if (bhk >= 5) counts["5+"] += 1;
    });
    return counts;
  }, [properties]);

  // 5. Real Bathroom Counts
  const bathroomCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, "5+": 0 };
    (properties || []).forEach((p) => {
      const bath = Number(p.specifications?.bathrooms || p.bathrooms || 0);
      if (bath === 1) counts[1] += 1;
      else if (bath === 2) counts[2] += 1;
      else if (bath === 3) counts[3] += 1;
      else if (bath === 4) counts[4] += 1;
      else if (bath >= 5) counts["5+"] += 1;
    });
    return counts;
  }, [properties]);

  // 6. Real Amenities extracted directly from properties
  const realAmenities = useMemo(() => {
    const amenityMap = new Map();

    (properties || []).forEach((p) => {
      (p.amenities || []).forEach((a) => {
        const rawName = typeof a === "string" ? a : a?.name;
        if (rawName && rawName.trim()) {
          const clean = rawName.replace(/-/g, " ").trim();
          const normalized = clean.charAt(0).toUpperCase() + clean.slice(1);
          const key = clean.toLowerCase();
          if (!amenityMap.has(key)) {
            amenityMap.set(key, { name: normalized, count: 0 });
          }
          amenityMap.get(key).count += 1;
        }
      });
    });

    return Array.from(amenityMap.values()).sort((a, b) => b.count - a.count);
  }, [properties]);

  const filteredAmenities = useMemo(() => {
    if (!amenitySearch.trim()) return realAmenities;
    const q = amenitySearch.toLowerCase().trim();
    return realAmenities.filter((item) => item.name.toLowerCase().includes(q));
  }, [amenitySearch, realAmenities]);

  // 7. Real Agents derived from properties and verified roster
  const realAgents = useMemo(() => {
    const agentMap = new Map();

    (STATIC_AGENTS || []).forEach((ag) => {
      const key = String(ag.id || ag.name).toLowerCase();
      agentMap.set(key, {
        id: ag.id,
        name: ag.name,
        agency: ag.agency || "Makaan4U Advisory",
        rating: ag.rating || 4.9,
        image: ag.image,
        count: 0,
      });
    });

    (properties || []).forEach((p) => {
      const ag = p.agent || p.assignedAgent || p.postedBy || p.agentInfo;
      if (ag && ag.name) {
        const key = String(ag.id || ag.name).toLowerCase();
        if (!agentMap.has(key)) {
          agentMap.set(key, {
            id: ag.id || ag._id || ag.name,
            name: ag.name,
            agency: ag.agency || ag.designation || "Property Consultant",
            rating: ag.rating || 4.8,
            image: ag.image || ag.avatar,
            count: 0,
          });
        }
        agentMap.get(key).count += 1;
      }
    });

    return Array.from(agentMap.values()).sort((a, b) => b.count - a.count);
  }, [properties]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-surface)] text-[var(--color-foreground)] overflow-hidden">
      {/* 1. Header (Fixed at top) */}
      <div className="flex-shrink-0 flex items-center justify-between p-3.5 sm:p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div>
          <h2 className="text-base font-bold font-editorial text-[var(--color-foreground)]">
            Filters
          </h2>
          <p className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5">
            {propertyCount} {propertyCount === 1 ? "property" : "properties"} found
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <span className="bg-[var(--color-terracotta)]/15 text-[var(--color-terracotta)] border border-[var(--color-terracotta)]/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              {getActiveFilterCount()} active
            </span>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Common Search Bar (Fixed right under header) */}
      <div className="flex-shrink-0 p-3 sm:p-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <label className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
          Search Properties
        </label>
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-2.5 text-[var(--color-muted-foreground)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search by city, locality, project..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-2 top-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Scrollable Filters Body (with stable refs and no unmounting components) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-1 custom-filter-scrollbar"
      >
        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection("price")}
          count={localFilters.priceRange?.min || localFilters.priceRange?.max ? 1 : 0}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-[var(--color-muted-foreground)] mb-0.5">
                  Min (₹)
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.priceRange?.min || ""}
                  onChange={(e) =>
                    handleFilterChange("priceRange", {
                      ...localFilters.priceRange,
                      min: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-xs bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-terracotta)]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--color-muted-foreground)] mb-0.5">
                  Max (₹)
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.priceRange?.max || ""}
                  onChange={(e) =>
                    handleFilterChange("priceRange", {
                      ...localFilters.priceRange,
                      max: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-xs bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-terracotta)]"
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1">
                Quick select:
              </p>
              <div className="space-y-1">
                {realPriceRanges.map((range) => {
                  const isSelected =
                    String(localFilters.priceRange?.min) === String(range.min) &&
                    String(localFilters.priceRange?.max) === String(range.max);
                  return (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleFilterChange("priceRange", { min: "", max: "" });
                        } else {
                          handleFilterChange("priceRange", {
                            min: range.min.toString(),
                            max: range.max.toString(),
                          });
                        }
                      }}
                      className={`w-full text-left px-2 py-1 text-[11px] rounded border transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-[var(--color-terracotta)]/15 text-[var(--color-terracotta)] border-[var(--color-terracotta)] font-semibold"
                          : "bg-[var(--color-surface)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-subtle)]"
                      }`}
                    >
                      <span>{range.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[var(--color-muted-foreground)]">
                          ({range.count})
                        </span>
                        {isSelected && <Check size={11} className="text-[var(--color-terracotta)]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Location (Real Cities) */}
        <FilterSection
          title="Location"
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection("location")}
          count={localFilters.location?.length || 0}
        >
          <div className="space-y-1.5">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2 top-2 text-[var(--color-muted-foreground)]"
              />
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search city..."
                className="w-full pl-6 pr-2 py-1 text-xs bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none"
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1 custom-filter-scrollbar">
              {filteredLocations.map((loc) => {
                const isChecked = (localFilters.location || []).includes(loc.name);
                return (
                  <label
                    key={loc.name}
                    className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-[var(--color-subtle)] cursor-pointer text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const cur = localFilters.location || [];
                          const next = e.target.checked
                            ? [...cur, loc.name]
                            : cur.filter((l) => l !== loc.name);
                          handleFilterChange("location", next);
                        }}
                        className="rounded border-[var(--color-border)] accent-[var(--color-terracotta)]"
                      />
                      <span
                        className={`text-[var(--color-foreground)] ${
                          isChecked ? "font-semibold text-[var(--color-terracotta)]" : ""
                        }`}
                      >
                        {loc.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--color-muted-foreground)]">
                      ({loc.count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </FilterSection>

        {/* Property Type (Real Types with real counts) */}
        <FilterSection
          title="Property Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection("type")}
          count={localFilters.propertyType?.length || 0}
        >
          <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1 custom-filter-scrollbar">
            {realPropertyTypes.map((type) => {
              const isChecked = (localFilters.propertyType || []).includes(type.value);
              const IconComp = TYPE_ICONS[type.label] || Building2;
              return (
                <label
                  key={type.value}
                  className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-[var(--color-subtle)] cursor-pointer text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const cur = localFilters.propertyType || [];
                        const next = e.target.checked
                          ? [...cur, type.value]
                          : cur.filter((t) => t !== type.value);
                        handleFilterChange("propertyType", next);
                      }}
                      className="rounded border-[var(--color-border)] accent-[var(--color-terracotta)]"
                    />
                    <IconComp
                      size={13}
                      className="text-[var(--color-muted-foreground)] flex-shrink-0"
                    />
                    <span
                      className={`text-[var(--color-foreground)] ${
                        isChecked ? "font-semibold text-[var(--color-terracotta)]" : ""
                      }`}
                    >
                      {type.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--color-muted-foreground)]">
                    ({type.count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Bedrooms */}
        <FilterSection
          title="Bedrooms"
          isExpanded={expandedSections.bedrooms}
          onToggle={() => toggleSection("bedrooms")}
          count={localFilters.bedrooms ? 1 : 0}
        >
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, "5+"].map((bhk) => {
              const isSelected = String(localFilters.bedrooms) === String(bhk);
              const count = bedroomCounts[bhk] || 0;
              return (
                <button
                  key={bhk}
                  type="button"
                  onClick={() =>
                    handleFilterChange("bedrooms", isSelected ? "" : bhk)
                  }
                  className={`py-1.5 text-xs font-semibold rounded border transition-colors flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-[var(--color-terracotta)] text-white border-[var(--color-terracotta)] shadow-xs"
                      : "bg-[var(--color-surface)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-subtle)]"
                  }`}
                >
                  <span>{bhk} BHK</span>
                  <span
                    className={`text-[9px] ${
                      isSelected ? "text-white/80" : "text-[var(--color-muted-foreground)]"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Bathrooms */}
        <FilterSection
          title="Bathrooms"
          isExpanded={expandedSections.bathrooms}
          onToggle={() => toggleSection("bathrooms")}
          count={localFilters.bathrooms ? 1 : 0}
        >
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, "5+"].map((bath) => {
              const isSelected = String(localFilters.bathrooms) === String(bath);
              const count = bathroomCounts[bath] || 0;
              return (
                <button
                  key={bath}
                  type="button"
                  onClick={() =>
                    handleFilterChange("bathrooms", isSelected ? "" : bath)
                  }
                  className={`py-1.5 text-xs font-semibold rounded border transition-colors flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-[var(--color-terracotta)] text-white border-[var(--color-terracotta)] shadow-xs"
                      : "bg-[var(--color-surface)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-subtle)]"
                  }`}
                >
                  <span>{bath} Bath</span>
                  <span
                    className={`text-[9px] ${
                      isSelected ? "text-white/80" : "text-[var(--color-muted-foreground)]"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Real Amenities from Properties */}
        <FilterSection
          title="Amenities"
          isExpanded={expandedSections.amenities}
          onToggle={() => toggleSection("amenities")}
          count={localFilters.amenities?.length || 0}
        >
          <div className="space-y-1.5">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2 top-2 text-[var(--color-muted-foreground)]"
              />
              <input
                type="text"
                value={amenitySearch}
                onChange={(e) => setAmenitySearch(e.target.value)}
                placeholder="Search amenities..."
                className="w-full pl-6 pr-2 py-1 text-xs bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none"
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-0.5 pr-1 custom-filter-scrollbar">
              {filteredAmenities.length === 0 ? (
                <p className="text-[11px] text-[var(--color-muted-foreground)] py-1 italic">
                  No matching amenities
                </p>
              ) : (
                filteredAmenities.map((amenity) => {
                  const isChecked = (localFilters.amenities || []).some(
                    (a) => a.toLowerCase() === amenity.name.toLowerCase()
                  );
                  return (
                    <label
                      key={amenity.name}
                      className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-[var(--color-subtle)] cursor-pointer text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = localFilters.amenities || [];
                            const next = e.target.checked
                              ? [...cur, amenity.name]
                              : cur.filter(
                                  (a) => a.toLowerCase() !== amenity.name.toLowerCase()
                                );
                            handleFilterChange("amenities", next);
                          }}
                          className="rounded border-[var(--color-border)] accent-[var(--color-terracotta)]"
                        />
                        <span
                          className={`text-[var(--color-foreground)] ${
                            isChecked ? "font-semibold text-[var(--color-terracotta)]" : ""
                          }`}
                        >
                          {amenity.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">
                        ({amenity.count})
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </FilterSection>

        {/* Top Real Agents */}
        <FilterSection
          title="Top Agents"
          isExpanded={expandedSections.agent}
          onToggle={() => toggleSection("agent")}
          count={localFilters.agent ? 1 : 0}
        >
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-filter-scrollbar">
            {realAgents.map((ag) => {
              const isSelected =
                String(localFilters.agent).toLowerCase() === String(ag.id).toLowerCase() ||
                String(localFilters.agent).toLowerCase() === String(ag.name).toLowerCase();
              return (
                <div
                  key={ag.id || ag.name}
                  onClick={() =>
                    handleFilterChange("agent", isSelected ? "" : ag.id || ag.name)
                  }
                  className={`p-2 rounded border cursor-pointer transition-colors text-xs flex items-center justify-between ${
                    isSelected
                      ? "bg-[var(--color-terracotta)]/15 border-[var(--color-terracotta)] text-[var(--color-terracotta)]"
                      : "bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-subtle)] text-[var(--color-foreground)]"
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    {ag.image ? (
                      <img
                        src={ag.image}
                        alt={ag.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[var(--color-terracotta)]/15 text-[var(--color-terracotta)] font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {ag.name?.charAt(0) || "A"}
                      </div>
                    )}
                    <div className="truncate">
                      <span className="font-semibold block text-[11px] truncate">
                        {ag.name}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] flex items-center gap-1">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        {ag.rating} • {ag.agency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-[var(--color-muted-foreground)]">
                      ({ag.count})
                    </span>
                    {isSelected && <Check size={12} className="text-[var(--color-terracotta)]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </FilterSection>
      </div>

      {/* 4. Footer / Clear All (Fixed at bottom) */}
      <div className="flex-shrink-0 p-3 sm:p-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-2">
        <button
          type="button"
          onClick={clearAllFilters}
          disabled={getActiveFilterCount() === 0}
          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-subtle)] rounded text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw size={13} />
          <span>Clear All Filters</span>
        </button>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-3 bg-[var(--color-terracotta)] text-white rounded text-xs font-semibold hover:opacity-95 transition-opacity"
          >
            Show {propertyCount} {propertyCount === 1 ? "Property" : "Properties"}
          </button>
        )}
      </div>
    </div>
  );

  // Desktop sidebar container
  if (!isMobile) {
    return (
      <div className="w-full max-h-[calc(100vh-8rem)] rounded-xs border border-[var(--color-border)] shadow-xs overflow-hidden flex flex-col bg-[var(--color-surface)]">
        {sidebarContent}
      </div>
    );
  }

  // Mobile Drawer container
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative ml-auto w-full max-w-xs h-full bg-[var(--color-surface)] shadow-2xl flex flex-col z-10 animate-slide-left">
        {sidebarContent}
      </div>
    </div>
  );
};

export default FilterSidebar;
