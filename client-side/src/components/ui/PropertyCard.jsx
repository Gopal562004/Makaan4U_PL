import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Scale,
  Share2,
  ShieldCheck,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Building,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Trash2
} from "lucide-react";
import { useShortlist } from "../../contexts/ShortlistContext";
import { toast } from "react-toastify";

const PropertyCard = ({
  property,
  variant = "standard", // "feature" | "standard" | "horizontal" | "map-preview" | "saved" | "recently-viewed"
  className = "",
  onSelectOnMap,
}) => {
  const { isSaved, toggleSaveProperty, removeSavedProperty, isInCompare, toggleCompare, removeFromCompare } = useShortlist();

  if (!property) return null;

  const saved = isSaved(property.id || property._id);
  const compared = isInCompare(property.id || property._id);
  const mainImage = property.images?.[0] || property.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80";
  const propertyUrl = `/properties/${property.slug || property._id || property.id}`;

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.origin + propertyUrl;
    if (navigator.share) {
      navigator.share({ title: property.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.info("Property link copied to clipboard");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProperty(property);
    toast.success(saved ? "Removed from Shortlist" : "Saved to Shortlist");
  };

  const handleRemoveSaved = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof removeSavedProperty === "function") {
      removeSavedProperty(property);
    } else {
      toggleSaveProperty(property);
    }
    toast.success("Removed from Shortlist");
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(property);
    toast.info(compared ? "Removed from Comparison" : "Added to Comparison");
  };

  // ==========================================
  // VARIANT: MAP PREVIEW POPOVER
  // ==========================================
  if (variant === "map-preview") {
    return (
      <div className="w-64 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl rounded-sm overflow-hidden text-xs">
        <div className="relative h-28 overflow-hidden">
          <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 bg-[var(--color-surface)]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[var(--color-foreground)]">
            {property.price}
          </div>
          {property.verified && (
            <div className="absolute top-2 right-2 bg-emerald-700 text-white p-1 rounded-full">
              <ShieldCheck className="w-3 h-3" />
            </div>
          )}
        </div>
        <div className="p-2.5 space-y-1">
          <h4 className="font-semibold text-[var(--color-foreground)] truncate">{property.title}</h4>
          <p className="text-[11px] text-[var(--color-muted-foreground)] flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-[var(--color-terracotta)]" />
            {property.locality}, {property.city}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)] text-[10px] text-[var(--color-muted-foreground)]">
            <span>{property.bedrooms} BHK • {property.carpetArea}</span>
            <Link to={propertyUrl} className="font-semibold text-[var(--color-terracotta)] hover:underline">
              View →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VARIANT: RECENTLY VIEWED (Compact)
  // ==========================================
  if (variant === "recently-viewed") {
    return (
      <Link
        to={propertyUrl}
        className="flex items-center space-x-3 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm transition-all group"
      >
        <img src={mainImage} alt={property.title} className="w-14 h-14 object-cover rounded-xs flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-bold text-[var(--color-terracotta)]">{property.price}</p>
          <p className="font-medium text-xs text-[var(--color-foreground)] truncate group-hover:text-[var(--color-terracotta)]">
            {property.title}
          </p>
          <p className="text-[10px] text-[var(--color-muted-foreground)] truncate">
            {property.bedrooms} BHK • {property.locality}
          </p>
        </div>
      </Link>
    );
  }

  // ==========================================
  // VARIANT: SAVED PROPERTY
  // ==========================================
  if (variant === "saved") {
    return (
      <div className="flex flex-col sm:flex-row bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden transition-all hover:border-[var(--color-muted-foreground)]">
        <div className="relative w-full sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
          <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 bg-[var(--color-surface)]/90 px-2 py-0.5 text-[11px] font-mono font-semibold">
            {property.price}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-terracotta)] font-semibold">
                {property.propertyType} • {property.listingType}
              </span>
              <span className="text-[11px] text-emerald-600 font-mono">
                RERA: {property.reraId || "Verified"}
              </span>
            </div>
            <Link to={propertyUrl} className="block mt-1">
              <h3 className="font-semibold text-base text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors">
                {property.title}
              </h3>
            </Link>
            <p className="text-xs text-[var(--color-muted-foreground)] flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)]" />
              {property.address || `${property.locality}, ${property.city}`}
            </p>
            <div className="flex items-center space-x-4 mt-3 text-xs text-[var(--color-foreground)]">
              <span><strong>{property.bedrooms}</strong> BHK</span>
              <span>•</span>
              <span><strong>{property.carpetArea}</strong> Carpet</span>
              <span>•</span>
              <span>{property.furnishing}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-border)] text-xs">
            <button
              type="button"
              onClick={handleRemoveSaved}
              className="text-red-600 hover:text-red-700 hover:underline flex items-center space-x-1 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCompare}
                className="px-2.5 py-1 text-xs border border-[var(--color-border)] hover:bg-[var(--color-subtle)] rounded"
              >
                {compared ? "In Comparison" : "Add to Compare"}
              </button>
              <Link
                to={propertyUrl}
                className="px-3 py-1 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded hover:bg-[var(--color-primary-hover)]"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VARIANT: HORIZONTAL (Search Results)
  // ==========================================
  if (variant === "horizontal") {
    return (
      <article className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-muted-foreground)] transition-all duration-200 rounded-sm overflow-hidden flex flex-col md:flex-row">
        {/* Photo Section */}
        <div className="relative w-full md:w-72 lg:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-[var(--color-subtle)]">
          <Link to={propertyUrl} className="block w-full h-full">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
          {/* Status Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
            {property.verified && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-900/90 text-emerald-100 text-[10px] font-semibold tracking-wide uppercase rounded-xs backdrop-blur-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Verified</span>
              </span>
            )}
            {property.featured && (
              <span className="inline-flex items-center px-2 py-0.5 bg-stone-900/90 text-stone-100 text-[10px] font-semibold tracking-wide uppercase rounded-xs backdrop-blur-xs">
                Featured
              </span>
            )}
          </div>
          {/* Quick Action Overlay */}
          <div className="absolute top-2.5 right-2.5 flex items-center space-x-1">
            <button
              onClick={handleSave}
              className={`p-1.5 rounded-full transition-colors ${
                saved ? "bg-[var(--color-terracotta)] text-white" : "bg-black/40 text-white hover:bg-black/70"
              }`}
              title="Save to shortlist"
              aria-label="Save to shortlist"
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleCompare}
              className={`p-1.5 rounded-full transition-colors ${
                compared ? "bg-stone-900 text-white" : "bg-black/40 text-white hover:bg-black/70"
              }`}
              title="Compare"
              aria-label="Compare property"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 bg-black/40 text-white hover:bg-black/70 rounded-full transition-colors"
              title="Share"
              aria-label="Share property"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {property.possession && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-mono tracking-tight rounded-xs backdrop-blur-xs">
              {property.possession}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--color-border)] pb-3">
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
                  {property.price}
                </span>
                {property.pricePerSqFt && (
                  <span className="ml-2 text-xs font-mono text-[var(--color-muted-foreground)]">
                    ({property.pricePerSqFt})
                  </span>
                )}
              </div>
              {property.reraId ? (
                <span className="text-[11px] font-mono text-[var(--color-muted-foreground)]">
                  RERA: <span className="text-[var(--color-foreground)] font-medium">{property.reraId}</span>
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-[var(--color-terracotta)] uppercase tracking-wider">
                  {property.propertyType}
                </span>
              )}
            </div>

            <Link to={propertyUrl} className="block mt-2.5">
              <h3 className="font-semibold text-base sm:text-lg text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors leading-snug">
                {property.title}
              </h3>
            </Link>

            <p className="text-xs text-[var(--color-muted-foreground)] flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)] flex-shrink-0" />
              <span>{property.locality}, {property.city}</span>
              {property.developer && (
                <span className="ml-2 pl-2 border-l border-[var(--color-border)] text-[var(--color-secondary)]">
                  by {property.developer}
                </span>
              )}
            </p>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 py-2 px-3 bg-[var(--color-subtle)] rounded-xs text-xs">
              <div>
                <p className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {property.isCommercial ? "Space Type" : "Bedrooms"}
                </p>
                <p className="font-semibold text-[var(--color-foreground)] mt-0.5">
                  {property.isCommercial ? (property.propertyType || "Commercial") : property.bedrooms ? `${property.bedrooms} BHK` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider">Carpet Area</p>
                <p className="font-semibold text-[var(--color-foreground)] mt-0.5">
                  {property.carpetArea || (property.area ? `${property.area.toLocaleString()} sq.ft` : "—")}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {property.parking ? "Parking" : property.builtYear ? "Built Year" : property.bathrooms ? "Bathrooms" : property.floor ? "Floor" : "Status"}
                </p>
                <p className="font-semibold text-[var(--color-foreground)] mt-0.5 truncate">
                  {property.parking || property.builtYear || (property.bathrooms ? `${property.bathrooms} Baths` : property.floor || property.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer of Card */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-border)] text-xs">
            <div className="flex items-center space-x-2">
              {property.agent?.image && (
                <img src={property.agent.image} alt={property.agent.name} className="w-6 h-6 rounded-full object-cover" />
              )}
              <span className="text-[11px] text-[var(--color-muted-foreground)]">
                {property.agent?.name || "Direct Advisor"}
              </span>
            </div>
            <Link
              to={propertyUrl}
              className="inline-flex items-center space-x-1 font-semibold text-xs text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] transition-colors"
            >
              <span>Explore Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // ==========================================
  // VARIANT: FEATURE PROPERTY (Large Hero Card)
  // ==========================================
  if (variant === "feature") {
    return (
      <article className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden transition-all duration-300">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-[var(--color-terracotta)] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xs">
              Marquee Listing
            </span>
            {property.verified && (
              <span className="px-2.5 py-1 bg-emerald-950/90 text-emerald-200 text-[11px] font-semibold tracking-wider rounded-xs flex items-center space-x-1 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center space-x-1.5">
            <button
              onClick={handleSave}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                saved ? "bg-[var(--color-terracotta)] text-white" : "bg-black/40 text-white hover:bg-black/70"
              }`}
              title="Save to shortlist"
            >
              <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleCompare}
              className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                compared ? "bg-stone-900 text-white" : "bg-black/40 text-white hover:bg-black/70"
              }`}
              title="Compare"
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Overlay Content */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-mono uppercase tracking-widest text-amber-300">
              {property.locality}, {property.city}
            </p>
            <Link to={propertyUrl} className="block mt-1">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-white hover:underline">
                {property.title}
              </h2>
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/20 text-xs">
              <div className="flex items-center space-x-4">
                <span className="font-mono text-xl font-bold">{property.price}</span>
                <span className="text-white/80">{property.bedrooms} BHK • {property.carpetArea}</span>
              </div>
              <Link
                to={propertyUrl}
                className="px-4 py-1.5 bg-white text-stone-950 font-semibold text-xs rounded-xs hover:bg-stone-100 transition-colors"
              >
                Inquire & Tour →
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ==========================================
  // VARIANT: STANDARD (Compact Grid)
  // ==========================================
  return (
    <article className={`group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-muted-foreground)] transition-all duration-200 rounded-sm overflow-hidden flex flex-col ${className}`}>
      {/* Photo */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[var(--color-subtle)]">
        <Link to={propertyUrl} className="block w-full h-full">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
          {property.verified && (
            <span className="px-2 py-0.5 bg-emerald-900/90 text-emerald-100 text-[10px] font-semibold uppercase tracking-wider rounded-xs backdrop-blur-xs flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>Verified</span>
            </span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 flex items-center space-x-1">
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
              saved ? "bg-[var(--color-terracotta)] text-white" : "bg-black/40 text-white hover:bg-black/70"
            }`}
            title="Save"
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleCompare}
            className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
              compared ? "bg-stone-900 text-white" : "bg-black/40 text-white hover:bg-black/70"
            }`}
            title="Compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-mono rounded-xs backdrop-blur-xs">
          {property.propertyType}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between flex-wrap gap-1">
            <span className="font-mono text-lg font-bold text-[var(--color-foreground)]">
              {property.price}
            </span>
            {property.pricePerSqFt && (
              <span className="text-[11px] font-mono text-[var(--color-muted-foreground)]">
                {property.pricePerSqFt}
              </span>
            )}
          </div>

          <Link to={propertyUrl} className="block mt-1.5">
            <h3 className="font-semibold text-sm sm:text-base text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          <p className="text-xs text-[var(--color-muted-foreground)] flex items-center mt-1">
            <MapPin className="w-3 h-3 mr-1 text-[var(--color-terracotta)] flex-shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-2.5 border-t border-[var(--color-border)] text-xs text-[var(--color-foreground)]">
            {property.isCommercial ? (
              <span className="flex items-center font-medium">
                <Building className="w-3.5 h-3.5 mr-1 text-[var(--color-muted-foreground)]" />
                {property.propertyType || "Commercial"}
              </span>
            ) : property.bedrooms ? (
              <span className="flex items-center">
                <BedDouble className="w-3.5 h-3.5 mr-1 text-[var(--color-muted-foreground)]" />
                {property.bedrooms} BHK
              </span>
            ) : null}
            {property.bedrooms && (property.carpetArea || property.area) && <span>•</span>}
            {(property.carpetArea || property.area) && (
              <span className="flex items-center">
                <Maximize2 className="w-3.5 h-3.5 mr-1 text-[var(--color-muted-foreground)]" />
                {property.carpetArea || `${property.area?.toLocaleString()} sq.ft`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--color-border)] text-[11px] text-[var(--color-muted-foreground)]">
          <span className="truncate max-w-[130px] sm:max-w-[160px]">
            {property.parking || property.furnishing || property.possession || ""}
          </span>
          <Link to={propertyUrl} className="font-semibold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] flex items-center flex-shrink-0 ml-1">
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
