import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Building,
  MapPin,
  Camera,
  IndianRupee,
  ShieldCheck,
  Eye,
  Send,
  Save,
  CheckCircle2
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { CITIES } from "../../data/propertyData";
import { toast } from "react-toastify";

const PostProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    purpose: "Sell", // "Sell" | "Rent"
    propertyType: "Apartment",
    title: "",
    city: "Mumbai",
    locality: "",
    address: "",
    bedrooms: "3",
    bathrooms: "3",
    carpetArea: "",
    superArea: "",
    floor: "",
    totalFloors: "",
    possession: "Ready to Move",
    ageOfProperty: "Under 2 Years",
    furnishing: "Semi-Furnished",
    expectedPrice: "",
    maintenance: "",
    reraNumber: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    description: "",
    amenities: ["24/7 Security", "Lift", "Power Backup"]
  });

  const steps = [
    { number: 1, title: "Purpose & Type" },
    { number: 2, title: "Location" },
    { number: 3, title: "Specifications" },
    { number: 4, title: "Valuation & Price" },
    { number: 5, title: "RERA & Verification" },
    { number: 6, title: "Live Preview & Submit" }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !formData.title) {
      toast.error("Please enter a property title");
      return;
    }
    if (currentStep === 2 && !formData.locality) {
      toast.error("Please enter a locality name");
      return;
    }
    if (currentStep === 3 && !formData.carpetArea) {
      toast.error("Please enter carpet area in sq.ft");
      return;
    }
    if (currentStep === 4 && !formData.expectedPrice) {
      toast.error("Please enter expected valuation / price");
      return;
    }
    setCurrentStep((s) => Math.min(6, s + 1));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleSaveDraft = () => {
    localStorage.setItem("makaan_property_draft", JSON.stringify(formData));
    toast.success("Draft saved locally. You can resume anytime.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success("Listing submitted for physical verification!");
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>List Your Property — Makaan4U Verification Gateway</title>
        <meta
          name="description"
          content="List your residential property or development for certified RERA physical verification and direct buyer connection."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-16">
        <Breadcrumbs items={[{ label: "List Property" }]} />

        {/* Step Header */}
        <div className="border-b border-[var(--color-border)] pb-6 space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Verified Listing Onboarding
          </span>
          <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)]">
            List Your Residence on Makaan4U
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">
            Every listing undergoes our 48-hour title and on-site physical verification check prior to general market publication.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-6 gap-2">
          {steps.map((st) => (
            <div key={st.number} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  st.number <= currentStep ? "bg-[var(--color-terracotta)]" : "bg-[var(--color-border)]"
                }`}
              />
              <span className="hidden sm:block text-[10px] font-mono text-[var(--color-muted-foreground)] truncate">
                {st.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        {isSubmitted ? (
          <div className="p-8 sm:p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
              Listing Submitted for Audit & Verification
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] max-w-md mx-auto leading-relaxed">
              Your property <strong>{formData.title}</strong> in <strong>{formData.locality}, {formData.city}</strong> has been logged into the Makaan4U advisory desk. Our technical audit team will contact you on <strong>{formData.ownerPhone || "+91 98XXX XXXXX"}</strong> within 24 hours to schedule photography and title inspection.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/account"
                className="px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-semibold rounded-sm"
              >
                Go to Workspace
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 sm:p-8 space-y-6 text-xs">
            {/* STEP 1: PURPOSE & TYPE */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Step 1: Listing Intent & Property Type
                </h3>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
                    Listing Purpose
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Sell", "Rent"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: p })}
                        className={`py-2.5 px-4 rounded text-center text-xs font-semibold border transition-colors ${
                          formData.purpose === p
                            ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent"
                            : "bg-[var(--color-subtle)] border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-foreground)]"
                        }`}
                      >
                        I want to {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
                    Property Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Apartment", "Independent Villa", "Penthouse", "Duplex"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, propertyType: t })}
                        className={`py-2 px-3 rounded text-center text-xs border transition-colors ${
                          formData.propertyType === t
                            ? "bg-[var(--color-foreground)] text-[var(--color-surface)] font-bold border-transparent"
                            : "bg-[var(--color-subtle)] border-[var(--color-border)] text-[var(--color-foreground)]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
                    Property Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sea-Facing High-Rise Duplex at Worli"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Step 2: Geographic Location & Micro-Market
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    >
                      {CITIES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Locality / Micro-Market *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bandra West, Indiranagar"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                    Building / Society Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Raheja Vivarea, Tower 2, Flat 1801"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SPECIFICATIONS */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Step 3: Dimensions & Configurations
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Bedrooms
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    >
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                      <option value="5">5+ BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Bathrooms
                    </label>
                    <select
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Carpet Area (sq.ft) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1850"
                      value={formData.carpetArea}
                      onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Super Area (sq.ft)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2400"
                      value={formData.superArea}
                      onChange={(e) => setFormData({ ...formData, superArea: e.target.value })}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Furnishing Status
                    </label>
                    <select
                      value={formData.furnishing}
                      onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    >
                      <option value="Unfurnished">Bare Shell / Unfurnished</option>
                      <option value="Semi-Furnished">Semi-Furnished (Kitchen + Wardrobes)</option>
                      <option value="Fully Furnished">Fully Furnished (Turnkey)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Possession Status
                    </label>
                    <select
                      value={formData.possession}
                      onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    >
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Under Construction">Under Construction</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: VALUATION & PRICING */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Step 4: Valuation & Financial Expectations
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Expected Price (₹ in Crores or Lakhs) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹5.50 Cr or ₹1.75 L/mo"
                      value={formData.expectedPrice}
                      onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Monthly Society Maintenance
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹12,000 / month"
                      value={formData.maintenance}
                      onChange={(e) => setFormData({ ...formData, maintenance: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                    Architectural Summary / Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Highlight view, sun exposure, interior upgrades, floor finishes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: RERA & VERIFICATION */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Step 5: RERA Registration & Ownership Identity
                </h3>

                <div className="p-4 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs space-y-2">
                  <p className="font-semibold text-[var(--color-foreground)] flex items-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                    <span>Makaan4U Anti-Fraud Guarantee</span>
                  </p>
                  <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                    We strictly forbid unverified, speculative, or duplicate proxy listings. Please provide your RERA number (if applicable) or property index tax registration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      RERA Registration No. (Optional for resale)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. P51900008342"
                      value={formData.reraNumber}
                      onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Owner / Representative Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                    Contact Phone (for Physical Audit Scheduling) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: PREVIEW & PUBLISH */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Step 6: Dossier Preview & Final Sign-Off
                </h3>

                <div className="p-5 border border-[var(--color-border)] rounded bg-[var(--color-subtle)] space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-xl font-bold text-[var(--color-terracotta)]">
                      {formData.expectedPrice || "₹ Price on Request"}
                    </span>
                    <span className="text-[11px] uppercase font-mono px-2 py-0.5 bg-black/10 rounded">
                      {formData.purpose} • {formData.propertyType}
                    </span>
                  </div>
                  <h4 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                    {formData.title || "Untitled Listing"}
                  </h4>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {formData.locality}, {formData.city} • {formData.address}
                  </p>
                  <div className="flex gap-4 text-xs font-medium pt-2 border-t border-[var(--color-border)]">
                    <span>{formData.bedrooms} Bedrooms</span>
                    <span>•</span>
                    <span>{formData.carpetArea} sq.ft Carpet</span>
                    <span>•</span>
                    <span>{formData.possession}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>
                    Upon clicking Submit, an authorized Makaan4U property inspector will contact you to conduct physical inspection and capture professional architectural photography at no upfront cost.
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] text-[var(--color-foreground)] rounded hover:border-[var(--color-foreground)] transition-colors flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-2 border border-[var(--color-border)] hover:bg-[var(--color-subtle)] rounded text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded flex items-center space-x-1"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[var(--color-terracotta)] text-white hover:bg-[var(--color-terracotta-hover)] font-semibold rounded flex items-center space-x-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Physical Verification</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default PostProperty;
