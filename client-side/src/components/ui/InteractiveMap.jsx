import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Plus,
  Minus,
  Layers,
  ExternalLink,
  Compass,
  ArrowRight,
  X,
  RotateCcw,
  Maximize2
} from "lucide-react";

/**
 * City default coordinates for smooth centering
 */
const CITY_COORDINATES = {
  Mumbai: { lat: 19.076, lng: 72.8777, zoom: 12 },
  Thane: { lat: 19.2183, lng: 72.9781, zoom: 13 },
  Pune: { lat: 18.5204, lng: 73.8567, zoom: 12 },
  Bangalore: { lat: 12.9716, lng: 77.5946, zoom: 12 },
  "Delhi NCR": { lat: 28.6139, lng: 77.209, zoom: 11 },
  Hyderabad: { lat: 17.385, lng: 78.4867, zoom: 12 },
  Goa: { lat: 15.4909, lng: 73.8278, zoom: 11 },
};

/**
 * InteractiveMap: Renders an actual interactive Google Map with real roadmaps,
 * satellite views, location pins, and property selection.
 */
const InteractiveMap = ({
  properties = [],
  activePropertyId,
  onSelectProperty,
  className = "",
  centerCity = "Mumbai",
}) => {
  const [selectedProp, setSelectedProp] = useState(null);
  const [mapType, setMapType] = useState("m"); // "m" = roadmap, "k" = satellite, "p" = terrain
  const [zoom, setZoom] = useState(13);
  const [isLoading, setIsLoading] = useState(true);

  // Sync active property from parent if provided
  useEffect(() => {
    if (activePropertyId && properties.length > 0) {
      const found = properties.find(
        (p) => (p.id || p._id) === activePropertyId
      );
      if (found) {
        setSelectedProp(found);
        setZoom(16);
      }
    }
  }, [activePropertyId, properties]);

  // Adjust zoom and reset property selection when city changes
  useEffect(() => {
    if (!activePropertyId) {
      setSelectedProp(null);
      const cityConfig = CITY_COORDINATES[centerCity] || CITY_COORDINATES.Mumbai;
      setZoom(cityConfig.zoom);
    }
  }, [centerCity, activePropertyId]);

  // Compute Google Map Target Query
  const mapTarget = useMemo(() => {
    if (selectedProp) {
      // 1. Try actual lat/lng coordinates if non-zero
      if (
        selectedProp.coordinates?.lat &&
        selectedProp.coordinates?.lng &&
        (selectedProp.coordinates.lat !== 0 || selectedProp.coordinates.lng !== 0)
      ) {
        return `${selectedProp.coordinates.lat},${selectedProp.coordinates.lng}`;
      }
      // 2. Fall back to verified address or title + city
      const addressString = [
        selectedProp.address,
        selectedProp.locality,
        selectedProp.city,
        "India",
      ]
        .filter(Boolean)
        .join(", ");
      return encodeURIComponent(addressString);
    }

    // Default to city center or first property with valid coords
    const cityConfig = CITY_COORDINATES[centerCity];
    if (cityConfig) {
      return `${cityConfig.lat},${cityConfig.lng}`;
    }

    return encodeURIComponent(`${centerCity}, Maharashtra, India`);
  }, [selectedProp, centerCity]);

  // Google Maps Embed URL
  const googleMapsEmbedUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${mapTarget}&t=${mapType}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  }, [mapTarget, mapType, zoom]);

  // External Google Maps Web / App Link
  const externalMapsUrl = useMemo(() => {
    return `https://www.google.com/maps/search/?api=1&query=${mapTarget}`;
  }, [mapTarget]);

  const handleSelectProperty = (prop) => {
    setSelectedProp(prop);
    setZoom(16);
    if (onSelectProperty) {
      onSelectProperty(prop);
    }
  };

  const handleRecenter = () => {
    setSelectedProp(null);
    const cityConfig = CITY_COORDINATES[centerCity] || CITY_COORDINATES.Mumbai;
    setZoom(cityConfig.zoom);
    if (onSelectProperty) {
      onSelectProperty(null);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[460px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden select-none flex flex-col ${className}`}
    >
      {/* ====================================================================
          TOP BAR CONTROLS OVERLAY: City badge, Mode switchers, Google link
      ==================================================================== */}
      <div className="absolute top-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Active Location Pill */}
        <div className="pointer-events-auto flex items-center space-x-2 bg-[var(--color-surface)]/95 backdrop-blur-md px-3 py-1.5 border border-[var(--color-border)] rounded-xs shadow-md text-xs font-medium text-[var(--color-foreground)]">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-terracotta)] flex-shrink-0 animate-pulse" />
          <span className="font-semibold truncate max-w-[200px] sm:max-w-xs">
            {selectedProp
              ? selectedProp.title
              : `${centerCity} (${properties.length} verified listings)`}
          </span>
          {selectedProp && (
            <button
              onClick={handleRecenter}
              className="text-[10px] text-[var(--color-terracotta)] hover:underline ml-1 font-mono uppercase"
              title="Reset to City View"
            >
              Reset
            </button>
          )}
        </div>

        {/* Right: Map Type & External Google Maps Link */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-[var(--color-surface)]/95 backdrop-blur-md p-1 border border-[var(--color-border)] rounded-xs shadow-md">
          {/* Map / Satellite Toggle */}
          <div className="flex border border-[var(--color-border)] rounded-xs overflow-hidden text-[11px] font-semibold">
            <button
              onClick={() => setMapType("m")}
              className={`px-2.5 py-1 transition-colors ${
                mapType === "m"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType("k")}
              className={`px-2.5 py-1 transition-colors ${
                mapType === "k"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType("p")}
              className={`px-2.5 py-1 hidden sm:inline-block transition-colors ${
                mapType === "p"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              Terrain
            </button>
          </div>

          {/* External Google Maps Button */}
          <a
            href={externalMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-[var(--color-subtle)] rounded-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors flex items-center space-x-1 text-xs"
            title="Open in full Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Google Maps</span>
          </a>
        </div>
      </div>

      {/* ====================================================================
          ZOOM & NAVIGATION CONTROLS (Top Right Side)
      ==================================================================== */}
      <div className="absolute right-3 top-16 z-20 flex flex-col space-y-1 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-xs shadow-md p-1">
        <button
          onClick={() => setZoom((z) => Math.min(19, z + 1))}
          className="p-2 text-[var(--color-foreground)] hover:bg-[var(--color-subtle)] rounded transition-colors"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(9, z - 1))}
          className="p-2 text-[var(--color-foreground)] hover:bg-[var(--color-subtle)] rounded transition-colors"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="border-t border-[var(--color-border)] my-0.5" />
        <button
          onClick={handleRecenter}
          className="p-2 text-[var(--color-foreground)] hover:bg-[var(--color-subtle)] rounded transition-colors"
          title="Recenter Map"
          aria-label="Recenter"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ====================================================================
          REAL GOOGLE MAP IFRAME CONTAINER
      ==================================================================== */}
      <div className="relative flex-1 w-full h-full bg-stone-100">
        <iframe
          key={`${mapTarget}-${mapType}-${zoom}`}
          title={`Google Map - ${centerCity}`}
          src={googleMapsEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-[var(--color-surface)]/80 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="text-center space-y-2">
              <div className="w-7 h-7 border-2 border-[var(--color-terracotta)] border-t-transparent rounded-full animate-spin mx-auto" />
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--color-muted-foreground)]">
                Loading Google Maps...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          BOTTOM INTERACTIVE PROPERTY SELECTOR CAROUSEL
      ==================================================================== */}
      {properties.length > 0 && (
        <div className="relative z-20 bg-[var(--color-surface)] border-t border-[var(--color-border)] p-2">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--color-muted-foreground)]">
              Click a property to pan Google Map
            </span>
            <span className="text-[10px] font-mono text-[var(--color-terracotta)] font-semibold">
              {properties.length} Listings in {centerCity}
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
            {properties.map((p) => {
              const isSelected =
                (selectedProp?.id || selectedProp?._id) === (p.id || p._id);
              return (
                <button
                  key={p.id || p._id}
                  onClick={() => handleSelectProperty(p)}
                  className={`flex-shrink-0 flex items-center space-x-2.5 p-1.5 pr-3 rounded-xs border text-left transition-all ${
                    isSelected
                      ? "bg-[var(--color-subtle)] border-[var(--color-terracotta)] ring-1 ring-[var(--color-terracotta)]"
                      : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-foreground)]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xs overflow-hidden bg-stone-900 flex-shrink-0">
                    <img
                      src={p.images?.[0] || p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 max-w-[140px] sm:max-w-[180px]">
                    <span className="font-mono text-xs font-bold text-[var(--color-foreground)] block truncate">
                      {p.price}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted-foreground)] block truncate">
                      {p.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================
          ACTIVE PROPERTY FLOATING PREVIEW CARD (When a property is selected)
      ==================================================================== */}
      {selectedProp && (
        <div className="absolute bottom-18 left-3 sm:left-4 z-30 max-w-sm w-[calc(100%-24px)] sm:w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-3 shadow-2xl animate-fade-in text-xs space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-1.5 py-0.5 bg-[var(--color-terracotta-subtle)] text-[var(--color-terracotta)] text-[10px] font-semibold rounded-xs uppercase">
                {selectedProp.propertyType || "Property"}
              </span>
              <h4 className="font-editorial text-sm font-bold text-[var(--color-foreground)] mt-1 line-clamp-1">
                {selectedProp.title}
              </h4>
              <p className="text-[11px] text-[var(--color-muted-foreground)] truncate flex items-center mt-0.5">
                <MapPin className="w-3 h-3 mr-1 text-[var(--color-terracotta)] flex-shrink-0" />
                <span>{selectedProp.address || selectedProp.locality}</span>
              </p>
            </div>
            <button
              onClick={() => setSelectedProp(null)}
              className="p-1 hover:bg-[var(--color-subtle)] rounded text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              title="Close card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]">
            <span className="font-mono font-bold text-sm text-[var(--color-foreground)]">
              {selectedProp.price}
            </span>
            <div className="flex items-center space-x-1.5">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapTarget}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 bg-[var(--color-subtle)] hover:bg-[var(--color-border)] rounded-xs text-[11px] font-semibold transition-colors flex items-center space-x-1"
                title="Get Google Maps Driving Directions"
              >
                <Navigation className="w-3 h-3 text-[var(--color-terracotta)]" />
                <span>Directions</span>
              </a>
              <Link
                to={`/properties/${selectedProp.slug || selectedProp.id || selectedProp._id}`}
                className="px-2.5 py-1 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] rounded-xs text-[11px] font-semibold transition-colors flex items-center space-x-1"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
