import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  MapPin,
  Heart,
  Scale,
  Share2,
  Maximize2,
  BedDouble,
  Bath,
  Building,
  CalendarCheck,
  PhoneCall,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Car,
  X,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Compass,
  Calendar,
  Layers,
  Navigation
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import PropertyCard from "../../components/ui/PropertyCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import SiteVisitModal from "../../components/ui/SiteVisitModal";
import EnquiryModal from "../../components/ui/EnquiryModal";
import EMICalculator from "../../components/ui/EMICalculator";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getPropertyBySlug, getAllProperties } from "../../lib/mongo/services/propertyService";
import { useShortlist } from "../../contexts/ShortlistContext";
import { toast } from "react-toastify";

const PropertyDetails = () => {
  const { slug } = useParams();
  const { isSaved, toggleSaveProperty, isInCompare, toggleCompare, addRecentlyViewed } = useShortlist();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [mobileGalleryIdx, setMobileGalleryIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryMode, setEnquiryMode] = useState("callback");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getPropertyBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError("Property not found in live database");
          setProperty(null);
        } else {
          setProperty(data);
          addRecentlyViewed(data);
          // Fetch similar properties from same city
          if (data.city) {
            getAllProperties({ city: data.city, limit: 4 })
              .then((res) => {
                if (isMounted && res?.properties) {
                  setSimilarProperties(
                    res.properties.filter((p) => p.slug !== slug && p.id !== data.id).slice(0, 3)
                  );
                }
              })
              .catch(() => {});
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load property:", err.message);
        setError("Property not found in live database");
        setProperty(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev === 0 ? (property?.images?.length || 1) - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev + 1) % (property?.images?.length || 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen, property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-2 border-[var(--color-terracotta)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] font-mono">
            Loading property dossier...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-20 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[var(--color-subtle)] text-[var(--color-terracotta)] flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h1 className="font-editorial text-3xl font-bold text-[var(--color-foreground)]">
            Property Not Found
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-md mx-auto">
            The requested property could not be found in the database. It may have been removed or the link might be incorrect.
          </p>
          <div className="pt-2">
            <Link
              to="/properties"
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-sm text-xs font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              <span>Explore All Live Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const saved = isSaved(property.id || property._id);
  const compared = isInCompare(property.id || property._id);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Property link copied to clipboard");
    }
  };

  const openLightboxAt = (idx) => {
    setActiveImageIdx(idx);
    setIsLightboxOpen(true);
  };

  // Google Maps link if coordinates available
  const hasCoordinates =
    property.coordinates &&
    (property.coordinates.lat !== 0 || property.coordinates.lng !== 0);
  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address || property.city)}`;

  // Direct WhatsApp contact link if phone is present
  const cleanPhone = property.agent?.phone ? property.agent.phone.replace(/\D/g, "") : "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${property.agent?.name || "Advisor"}, I am interested in "${property.title}" listed on Makaan4U.`)}`
    : null;

  // Navigation tabs for smooth in-page jumping
  const navTabs = [
    { id: "sec-overview", label: "Overview" },
    { id: "sec-details", label: "Specifications" },
    ...(property.features?.length || property.amenities?.length ? [{ id: "sec-amenities", label: "Amenities" }] : []),
    { id: "sec-location", label: "Location" },
    ...(property.priceNumeric > 0 ? [{ id: "sec-emi", label: "EMI Calculator" }] : []),
  ];

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`${property.title} — ${property.locality || property.city} | Makaan4U`}</title>
        <meta name="description" content={property.description?.slice(0, 160)} />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 lg:pb-16 space-y-6">
        {/* Breadcrumb Trail */}
        <Breadcrumbs
          items={[
            { label: "Properties", href: "/properties" },
            { label: property.city, href: `/properties?city=${property.city}` },
            { label: property.title }
          ]}
        />

        {/* ====================================================================
            HEADER STRIP: Title, Location, Price & Quick Actions
        ==================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[var(--color-border)] pb-5 gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 bg-[var(--color-terracotta-subtle)] text-[var(--color-terracotta)] font-semibold rounded-xs uppercase tracking-wider">
                {property.propertyType} • For {property.listingType}
              </span>
              {property.status && property.status !== "available" && (
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 font-semibold rounded-xs uppercase text-[11px]">
                  {property.status}
                </span>
              )}
              {property.reraId && (
                <span className="px-2 py-0.5 bg-emerald-900/10 text-emerald-700 font-mono text-[11px] rounded-xs flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>RERA: {property.reraId}</span>
                </span>
              )}
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-foreground)]">
              {property.title}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-[var(--color-terracotta)] flex-shrink-0" />
              <span>{property.address}</span>
            </p>
          </div>

          {/* Pricing & Primary Quick Actions */}
          <div className="flex flex-row items-center justify-between sm:justify-end gap-3 sm:gap-5 lg:text-right border-t sm:border-t-0 border-[var(--color-border)] pt-3 sm:pt-0 flex-wrap">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
                Guide Valuation
              </span>
              <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-foreground)] tracking-tight">
                {property.price}
              </span>
              {property.pricePerSqFt && (
                <span className="text-xs font-mono text-[var(--color-muted-foreground)] block">
                  {property.pricePerSqFt}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  toggleSaveProperty(property);
                  toast.success(saved ? "Removed from Shortlist" : "Saved to Shortlist");
                }}
                className={`p-2.5 rounded-sm border transition-colors ${
                  saved
                    ? "bg-[var(--color-terracotta)] text-white border-transparent"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-foreground)]"
                }`}
                title="Save to shortlist"
                aria-label="Save to shortlist"
              >
                <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={() => {
                  toggleCompare(property);
                  toast.info(compared ? "Removed from Comparison" : "Added to Comparison");
                }}
                className={`p-2.5 rounded-sm border transition-colors ${
                  compared
                    ? "bg-stone-900 text-white border-transparent"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-foreground)]"
                }`}
                title="Compare with another property"
                aria-label="Compare"
              >
                <Scale className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm transition-colors"
                title="Share property"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ====================================================================
            PHOTO GALLERY: Responsive Hero with Mobile Swipe/Tap Controls
        ==================================================================== */}
        <section className="relative rounded-sm overflow-hidden bg-[var(--color-subtle)] border border-[var(--color-border)] shadow-xs">
          {/* Desktop Multi-Grid (>= md) */}
          <div className="hidden md:block h-[380px] lg:h-[460px] w-full">
            {images.length > 1 ? (
              <div className="grid grid-cols-12 gap-2 h-full p-2">
                {/* Main Featured Photo */}
                <div
                  onClick={() => openLightboxAt(0)}
                  className="col-span-8 h-full relative rounded-xs overflow-hidden cursor-pointer group bg-stone-900"
                >
                  <img
                    src={images[0]}
                    alt={`${property.title} - Main View`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-3 py-1 rounded-xs">
                    1 of {images.length} Photos
                  </div>
                </div>

                {/* Secondary Photos 2x2 Grid */}
                <div className="col-span-4 grid grid-cols-2 grid-rows-2 gap-2 h-full">
                  {images.slice(1, 5).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => openLightboxAt(idx + 1)}
                      className="relative rounded-xs overflow-hidden cursor-pointer group bg-stone-900 h-full"
                    >
                      <img
                        src={img}
                        alt={`${property.title} - View ${idx + 2}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                onClick={() => openLightboxAt(0)}
                className="w-full h-full relative cursor-pointer group bg-stone-900 p-2"
              >
                <img
                  src={images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-xs transition-transform duration-500 group-hover:scale-102"
                />
              </div>
            )}
          </div>

          {/* Mobile Interactive Gallery (< md) */}
          <div className="md:hidden relative h-[280px] sm:h-[340px] w-full overflow-hidden bg-stone-900">
            <img
              src={images[mobileGalleryIdx] || images[0]}
              alt={`${property.title} photo ${mobileGalleryIdx + 1}`}
              onClick={() => openLightboxAt(mobileGalleryIdx)}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Mobile Arrow Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileGalleryIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-xs"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileGalleryIdx((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-xs"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Mobile Counter Pill */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-xs">
              {mobileGalleryIdx + 1} / {images.length} Photos
            </div>
          </div>

          {/* View All Photos Button */}
          {images.length > 1 && (
            <button
              onClick={() => openLightboxAt(0)}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/75 hover:bg-black text-white text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-sm backdrop-blur-xs flex items-center space-x-1.5 shadow-md transition-all z-10"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>View All {images.length} Photos</span>
            </button>
          )}

          {/* Mobile Bottom Thumbnail Track (< md) */}
          {images.length > 1 && (
            <div className="md:hidden flex items-center space-x-2 p-2 overflow-x-auto bg-[var(--color-surface)] border-t border-[var(--color-border)]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileGalleryIdx(idx)}
                  className={`relative flex-shrink-0 w-14 h-11 rounded-xs overflow-hidden border-2 transition-all ${
                    mobileGalleryIdx === idx
                      ? "border-[var(--color-terracotta)] scale-102"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ====================================================================
            STICKY IN-PAGE NAVIGATION TABS
        ==================================================================== */}
        <div className="sticky top-16 sm:top-20 z-20 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-sm p-1.5 shadow-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xs whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--color-foreground)] text-[var(--color-surface)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-subtle)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================================
            KEY SPECIFICATIONS: Real DB Attributes Only
        ==================================================================== */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {property.area && (
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
              <div className="flex items-center text-[var(--color-muted-foreground)] mb-1">
                <Maximize2 className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Area</span>
              </div>
              <span className="font-bold text-sm text-[var(--color-foreground)] block">
                {property.area.toLocaleString()} {property.areaUnit || "sq.ft"}
              </span>
            </div>
          )}

          {property.bedrooms && (
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
              <div className="flex items-center text-[var(--color-muted-foreground)] mb-1">
                <BedDouble className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Bedrooms</span>
              </div>
              <span className="font-bold text-sm text-[var(--color-foreground)] block">
                {property.bedrooms} BHK
              </span>
            </div>
          )}

          {property.bathrooms && (
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
              <div className="flex items-center text-[var(--color-muted-foreground)] mb-1">
                <Bath className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Bathrooms</span>
              </div>
              <span className="font-bold text-sm text-[var(--color-foreground)] block">
                {property.bathrooms} Bath
              </span>
            </div>
          )}

          {property.propertyType && (
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
              <div className="flex items-center text-[var(--color-muted-foreground)] mb-1">
                <Building className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Type</span>
              </div>
              <span className="font-bold text-sm text-[var(--color-foreground)] block truncate">
                {property.propertyType}
              </span>
            </div>
          )}

          {property.furnishing && (
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] block mb-1">
                Furnishing
              </span>
              <span className="font-bold text-sm text-[var(--color-foreground)] block truncate">
                {property.furnishing}
              </span>
            </div>
          )}

          {property.parking ? (
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
              <div className="flex items-center text-[var(--color-muted-foreground)] mb-1">
                <Car className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Parking</span>
              </div>
              <span className="font-bold text-sm text-[var(--color-foreground)] block truncate">
                {property.parking}
              </span>
            </div>
          ) : property.city ? (
            <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
              <div className="flex items-center text-[var(--color-muted-foreground)] mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--color-terracotta)]" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">City</span>
              </div>
              <span className="font-bold text-sm text-[var(--color-foreground)] block truncate">
                {property.city}
              </span>
            </div>
          ) : null}
        </section>

        {/* ====================================================================
            MAIN DETAILS: Left 8 Cols (Data) + Right 4 Cols (Sticky Contact Panel)
        ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Real Database Information */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview / Description */}
            <section id="sec-overview" className="space-y-3 scroll-mt-24">
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">
                About this Property
              </h2>
              {property.description ? (
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              ) : (
                <p className="text-xs text-[var(--color-muted-foreground)] italic">
                  No additional description provided for this listing.
                </p>
              )}
            </section>

            {/* Additional Real Specifications */}
            {(property.floor || property.builtYear || property.facing || property.balconies || property.constructionStatus) && (
              <section id="sec-details" className="space-y-3 scroll-mt-24">
                <h2 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                  Property Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {property.floor && (
                    <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
                      <span className="text-[var(--color-muted-foreground)] block">Floor Level</span>
                      <span className="font-semibold text-sm text-[var(--color-foreground)] mt-0.5 block">
                        {property.floor}
                      </span>
                    </div>
                  )}
                  {property.facing && (
                    <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
                      <span className="text-[var(--color-muted-foreground)] block">Orientation</span>
                      <span className="font-semibold text-sm text-[var(--color-foreground)] mt-0.5 block">
                        {property.facing}
                      </span>
                    </div>
                  )}
                  {property.balconies && (
                    <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
                      <span className="text-[var(--color-muted-foreground)] block">Balconies</span>
                      <span className="font-semibold text-sm text-[var(--color-foreground)] mt-0.5 block">
                        {property.balconies}
                      </span>
                    </div>
                  )}
                  {property.builtYear && (
                    <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
                      <span className="text-[var(--color-muted-foreground)] block">Year of Construction</span>
                      <span className="font-semibold text-sm text-[var(--color-foreground)] mt-0.5 block">
                        {property.builtYear}
                      </span>
                    </div>
                  )}
                  {property.constructionStatus && (
                    <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm">
                      <span className="text-[var(--color-muted-foreground)] block">Possession / Status</span>
                      <span className="font-semibold text-sm text-[var(--color-foreground)] mt-0.5 block">
                        {property.constructionStatus}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Features & Amenities */}
            {(property.features?.length > 0 || property.amenities?.length > 0) && (
              <section id="sec-amenities" className="space-y-6 scroll-mt-24">
                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                      Key Highlights
                    </h2>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {property.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm text-[var(--color-foreground)] font-medium flex items-center space-x-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />
                          <span>{feature}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                      Amenities
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      {property.amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex items-center space-x-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="font-medium text-[var(--color-foreground)] truncate">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Location Section with Actual Embedded Google Map */}
            <section id="sec-location" className="space-y-3 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                  Location & Accessibility
                </h2>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[var(--color-terracotta)] hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-4 text-xs">
                <div className="flex items-start text-sm font-medium text-[var(--color-foreground)]">
                  <MapPin className="w-4 h-4 mr-2 text-[var(--color-terracotta)] flex-shrink-0 mt-0.5" />
                  <div>
                    <span>{property.address}</span>
                    {property.pincode && (
                      <span className="text-[var(--color-muted-foreground)] block text-xs mt-0.5">
                        Postal Code: <strong className="text-[var(--color-foreground)] font-mono">{property.pincode}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {hasCoordinates && (
                  <div className="pt-2 border-t border-[var(--color-border)] flex items-center space-x-3 text-[11px] text-[var(--color-muted-foreground)] font-mono">
                    <Compass className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />
                    <span>Lat: {property.coordinates.lat.toFixed(4)}°, Lng: {property.coordinates.lng.toFixed(4)}°</span>
                  </div>
                )}

                {/* Actual Embedded Google Map */}
                <div className="relative w-full h-64 sm:h-80 rounded-xs overflow-hidden border border-[var(--color-border)] shadow-xs">
                  <iframe
                    title={`Google Map - ${property.title}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      hasCoordinates
                        ? `${property.coordinates.lat},${property.coordinates.lng}`
                        : `${property.address || property.locality || property.title}, ${property.city}, India`
                    )}&t=m&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-xs text-xs font-semibold text-[var(--color-foreground)] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />
                    <span>View on Google Maps</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      hasCoordinates
                        ? `${property.coordinates.lat},${property.coordinates.lng}`
                        : `${property.address || property.locality || property.title}, ${property.city}, India`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-xs text-xs font-semibold text-[var(--color-foreground)] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Get Driving Directions</span>
                  </a>
                </div>
              </div>
            </section>

            {/* EMI Calculator */}
            {property.priceNumeric > 0 && (
              <section id="sec-emi" className="scroll-mt-24">
                <EMICalculator initialPrice={property.priceNumeric} />
              </section>
            )}
          </div>

          {/* Right Column: Sticky Contact & Schedule Visit Panel (Desktop) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)] block">
                  Direct Facilitation
                </span>
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)] mt-0.5">
                  Arrange Access & Consultation
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1 leading-relaxed">
                  Connect with the assigned consultant for a physical walkthrough or priority callback.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full py-2.5 px-4 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Schedule Site Visit</span>
                </button>

                <button
                  onClick={() => {
                    setEnquiryMode("callback");
                    setIsEnquiryModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-[var(--color-subtle)] text-[var(--color-foreground)] hover:border-[var(--color-foreground)] border border-[var(--color-border)] text-xs font-semibold rounded-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4 text-[var(--color-terracotta)]" />
                  <span>Request Callback</span>
                </button>
              </div>
            </div>

            {/* Real Consultant Info (Only if present in DB) */}
            {property.agent && (
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-4 space-y-3.5 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] block">
                    Listing Consultant
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-900/10 text-emerald-700 text-[10px] font-semibold rounded-xs">
                    Verified Advisor
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {property.agent.image ? (
                    <img
                      src={property.agent.image}
                      alt={property.agent.name}
                      className="w-12 h-12 rounded-full object-cover border border-[var(--color-border)]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--color-subtle)] text-[var(--color-terracotta)] font-bold flex items-center justify-center text-sm border border-[var(--color-border)]">
                      {property.agent.name?.charAt(0) || "A"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-[var(--color-foreground)] truncate">
                      {property.agent.name}
                    </h4>
                    <p className="text-[11px] text-[var(--color-muted-foreground)] truncate">
                      {property.agent.designation}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
                  {property.agent.phone && (
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-[var(--color-subtle)] hover:bg-[var(--color-border)] rounded-xs font-semibold text-[11px] text-[var(--color-foreground)] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />
                        <span>Call</span>
                      </a>

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs font-semibold text-[11px] transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  )}

                  {property.agent.email && (
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center space-x-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] truncate pt-1 text-[11px]"
                    >
                      <Mail className="w-3.5 h-3.5 text-[var(--color-terracotta)] flex-shrink-0" />
                      <span className="truncate">{property.agent.email}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====================================================================
            SIMILAR PROPERTIES (Only rendered if other real properties exist in DB)
        ==================================================================== */}
        {similarProperties.length > 0 && (
          <section className="pt-10 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
                  Micro-Market Context
                </span>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--color-foreground)] mt-0.5">
                  More Properties in {property.city}
                </h3>
              </div>
              <Link to="/properties" className="text-xs font-semibold hover:underline inline-flex items-center">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id || p._id} property={p} variant="standard" />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ====================================================================
          MOBILE STICKY ACTION BAR (< lg)
      ==================================================================== */}
      <aside className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] px-4 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="font-mono text-base sm:text-lg font-bold text-[var(--color-foreground)] block">
            {property.price}
          </span>
          <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-wider block">
            {property.bedrooms ? `${property.bedrooms} BHK • ` : ""}{property.propertyType}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {property.agent?.phone && (
            <a
              href={`tel:${property.agent.phone}`}
              className="p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] text-[var(--color-foreground)] rounded-sm"
              title="Call Consultant"
              aria-label="Call Consultant"
            >
              <Phone className="w-4 h-4 text-[var(--color-terracotta)]" />
            </a>
          )}

          <button
            onClick={() => setIsVisitModalOpen(true)}
            className="px-4 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-sm text-xs font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center space-x-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Schedule Tour</span>
          </button>
        </div>
      </aside>

      {/* ====================================================================
          FULLSCREEN LIGHTBOX MODAL
      ==================================================================== */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div className="space-y-0.5">
              <h3 className="font-editorial text-sm sm:text-base font-bold text-white">
                {property.title}
              </h3>
              <p className="text-xs text-white/70 font-mono">
                Photo {activeImageIdx + 1} of {images.length}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              title="Close gallery (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {images.length > 1 && (
              <button
                onClick={() =>
                  setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                }
                className="absolute left-2 sm:left-6 z-10 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                title="Previous Photo"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={images[activeImageIdx]}
              alt={`${property.title} view ${activeImageIdx + 1}`}
              className="max-h-[72vh] max-w-full object-contain rounded-xs shadow-2xl transition-all duration-300"
            />

            {images.length > 1 && (
              <button
                onClick={() => setActiveImageIdx((prev) => (prev + 1) % images.length)}
                className="absolute right-2 sm:right-6 z-10 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                title="Next Photo"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-12 flex-shrink-0 rounded-xs overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx
                      ? "border-[var(--color-terracotta)] scale-105 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <SiteVisitModal
        property={property}
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />

      <EnquiryModal
        property={property}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        mode={enquiryMode}
      />

      <Footer />
      <CompareDrawer />
    </div>
  );
};

export default PropertyDetails;
