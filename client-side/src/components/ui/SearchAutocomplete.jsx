import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, MapPin, Building, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import { LOCALITIES, CITIES, PROJECTS, PROPERTIES } from "../../data/propertyData";

const SearchAutocomplete = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const cleanQuery = query.trim().toLowerCase();

  // Find matching localities
  const matchingLocalities = LOCALITIES.filter(
    (l) => l.name.toLowerCase().includes(cleanQuery) || l.city.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  // Find matching cities
  const matchingCities = CITIES.filter(
    (c) => c.name.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  // Find matching projects
  const matchingProjects = PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(cleanQuery) ||
      p.developer.toLowerCase().includes(cleanQuery) ||
      p.locality.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  // Find matching properties
  const matchingProperties = PROPERTIES.filter(
    (p) =>
      p.title.toLowerCase().includes(cleanQuery) ||
      p.locality.toLowerCase().includes(cleanQuery) ||
      p.address.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!cleanQuery) return;
    onClose();
    navigate(`/properties?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-md overflow-hidden">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center px-4 py-3.5 border-b border-[var(--color-border)]">
          <Search className="w-5 h-5 text-[var(--color-muted-foreground)] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type city (e.g. Mumbai), locality (e.g. Worli, Bandra), or project..."
            className="w-full bg-transparent text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] border border-[var(--color-border)] rounded"
          >
            ESC
          </button>
        </form>

        {/* Suggestion Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query && (
            <div className="space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-2">
                  Popular High-Demand Markets
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Worli, Mumbai", "Bandra West, Mumbai", "Indiranagar, Bangalore", "Golf Course Road, Gurgaon", "Assagao, Goa"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelect(`/properties?search=${encodeURIComponent(tag.split(",")[0])}`)}
                      className="px-2.5 py-1 text-xs bg-[var(--color-subtle)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] rounded transition-colors flex items-center space-x-1"
                    >
                      <MapPin className="w-3 h-3 text-[var(--color-terracotta)]" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-2">
                  Market Intelligence Quick Links
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleSelect("/market-insights")}
                    className="p-2.5 rounded text-left border border-[var(--color-border)] hover:bg-[var(--color-subtle)] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-[var(--color-foreground)]">City Price Trends & Yields</p>
                      <p className="text-[11px] text-[var(--color-muted-foreground)]">Q3 2026 Residential Benchmark</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                  </button>
                  <button
                    onClick={() => handleSelect("/insights/rera-2-compliance-homebuyer-checklist")}
                    className="p-2.5 rounded text-left border border-[var(--color-border)] hover:bg-[var(--color-subtle)] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-[var(--color-foreground)]">RERA 2.0 Buyer Checklist</p>
                      <p className="text-[11px] text-[var(--color-muted-foreground)]">Legal Due Diligence</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {query && (
            <>
              {/* Localities & Cities */}
              {(matchingLocalities.length > 0 || matchingCities.length > 0) && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-2">
                    Micro-Markets & Localities
                  </p>
                  <div className="space-y-1">
                    {matchingLocalities.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => handleSelect(`/localities/${loc.id}`)}
                        className="w-full px-3 py-2 text-left rounded hover:bg-[var(--color-subtle)] flex items-center justify-between text-xs sm:text-sm"
                      >
                        <div className="flex items-center space-x-2.5">
                          <MapPin className="w-4 h-4 text-[var(--color-terracotta)]" />
                          <div>
                            <span className="font-semibold text-[var(--color-foreground)]">{loc.name}</span>
                            <span className="text-[var(--color-muted-foreground)] ml-1.5 font-normal">
                              {loc.city} • Avg {loc.avgPrice}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-mono">{loc.growthRate}</span>
                      </button>
                    ))}
                    {matchingCities.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleSelect(`/cities/${city.id}`)}
                        className="w-full px-3 py-2 text-left rounded hover:bg-[var(--color-subtle)] flex items-center justify-between text-xs sm:text-sm"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Building className="w-4 h-4 text-[var(--color-secondary)]" />
                          <div>
                            <span className="font-semibold text-[var(--color-foreground)]">{city.name}</span>
                            <span className="text-[var(--color-muted-foreground)] ml-1.5 font-normal">
                              {city.totalListings} Active Listings
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[var(--color-muted-foreground)]">Explore City Guide →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {matchingProjects.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-2">
                    Projects & Developments
                  </p>
                  <div className="space-y-1">
                    {matchingProjects.map((proj) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => handleSelect(`/projects/${proj.slug}`)}
                        className="w-full px-3 py-2 text-left rounded hover:bg-[var(--color-subtle)] flex items-center justify-between text-xs sm:text-sm"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Building className="w-4 h-4 text-[var(--color-terracotta)]" />
                          <div>
                            <p className="font-semibold text-[var(--color-foreground)]">{proj.title}</p>
                            <p className="text-[11px] text-[var(--color-muted-foreground)]">
                              by {proj.developer} • {proj.locality}, {proj.city}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[var(--color-foreground)]">{proj.startingPrice}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Properties */}
              {matchingProperties.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-2">
                    Individual Verified Listings
                  </p>
                  <div className="space-y-1">
                    {matchingProperties.map((prop) => (
                      <button
                        key={prop.id}
                        type="button"
                        onClick={() => handleSelect(`/properties/${prop.slug}`)}
                        className="w-full px-3 py-2 text-left rounded hover:bg-[var(--color-subtle)] flex items-center justify-between text-xs sm:text-sm"
                      >
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-9 h-9 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-[var(--color-foreground)] truncate max-w-[280px]">
                              {prop.title}
                            </p>
                            <p className="text-[11px] text-[var(--color-muted-foreground)]">
                              {prop.bedrooms} BHK • {prop.carpetArea} • {prop.locality}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[var(--color-terracotta)] font-mono">
                          {prop.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingLocalities.length === 0 && matchingCities.length === 0 && matchingProjects.length === 0 && matchingProperties.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-[var(--color-foreground)]">
                    No exact match for "{query}"
                  </p>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                    Press Enter to view all marketplace listings with this keyword.
                  </p>
                  <button
                    onClick={handleSearchSubmit}
                    className="mt-3 inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded"
                  >
                    <span>Search Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAutocomplete;
