import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  User,
  Heart,
  Calendar,
  Bell,
  Clock,
  Settings,
  Scale,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Clock3,
  LogOut,
  MapPin,
  ArrowRight
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { EmptyShortlist } from "../../components/ui/EmptyStates";
import { useShortlist } from "../../contexts/ShortlistContext";
import { usePreferences } from "../../contexts/PreferencesContext";
import { toast } from "react-toastify";

const AccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedProperties, siteVisits, enquiries, savedSearches, recentlyViewed } = useShortlist();
  const { currency, setCurrency, language, setLanguage } = usePreferences();

  // Determine subview from pathname
  const getTabFromPath = (path) => {
    if (path.includes("/visits")) return "visits";
    if (path.includes("/enquiries")) return "enquiries";
    if (path.includes("/alerts")) return "alerts";
    if (path.includes("/recent")) return "recent";
    if (
      path.includes("/settings") ||
      path.includes("/profile") ||
      path === "/account" ||
      path === "/account/"
    ) {
      return "settings";
    }
    if (path.includes("/saved")) return "saved";
    return "saved";
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  // Sync activeTab whenever URL route changes
  useEffect(() => {
    const matchedTab = getTabFromPath(location.pathname);
    setActiveTab(matchedTab);
  }, [location.pathname]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/account/${tabId}`);
  };

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : {
        name: "Vikramaditya Sengupta",
        email: "vikramaditya.s@example.com",
        phone: "+91 98201 44820",
        city: "Mumbai",
        buyerType: "Individual Private Investor"
      };
    } catch {
      return {
        name: "Vikramaditya Sengupta",
        email: "vikramaditya.s@example.com",
        phone: "+91 98201 44820",
        city: "Mumbai",
        buyerType: "Individual Private Investor"
      };
    }
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-950/20 text-emerald-600 border-emerald-600/30";
      case "requested":
        return "bg-amber-950/20 text-amber-600 border-amber-600/30";
      case "completed":
        return "bg-stone-900/10 text-stone-600 border-stone-300";
      case "cancelled":
        return "bg-red-950/20 text-red-600 border-red-600/30";
      default:
        return "bg-[var(--color-subtle)] text-[var(--color-muted-foreground)]";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Personal Property Workspace & Shortlist — Makaan4U</title>
        <meta
          name="description"
          content="Manage your shortlisted residences, upcoming site visits, search alerts, and developer enquiries."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-16">
        <Breadcrumbs items={[{ label: "Account Workspace" }, { label: activeTab }]} />

        {/* User Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-full flex items-center justify-center font-editorial text-xl font-bold text-[var(--color-foreground)]">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
                Verified Buyer Account
              </span>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                {userProfile.name}
              </h1>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {userProfile.email} • {userProfile.city}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/properties"
              className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors"
            >
              Discover Properties
            </Link>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex border-b border-[var(--color-border)] gap-6 overflow-x-auto text-xs font-semibold pb-1">
          {[
            { id: "saved", label: `Saved Shortlist (${savedProperties.length})`, icon: Heart },
            { id: "visits", label: `Site Visits (${siteVisits.length})`, icon: Calendar },
            { id: "enquiries", label: `Enquiries (${enquiries.length})`, icon: PhoneCall },
            { id: "alerts", label: `Search Alerts (${savedSearches.length})`, icon: Bell },
            { id: "recent", label: `Recently Viewed (${recentlyViewed.length})`, icon: Clock },
            { id: "settings", label: "Preferences & Profile", icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`pb-2.5 transition-colors whitespace-nowrap flex items-center space-x-1.5 border-b-2 ${
                  activeTab === tab.id
                    ? "border-[var(--color-terracotta)] text-[var(--color-foreground)]"
                    : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            TAB CONTENT: SAVED PROPERTIES
        ==================================================================== */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            {savedProperties.length === 0 ? (
              <EmptyShortlist />
            ) : (
              <div className="space-y-4">
                {savedProperties.map((prop) => (
                  <PropertyCard key={prop.id || prop._id} property={prop} variant="saved" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: SITE VISITS
        ==================================================================== */}
        {activeTab === "visits" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                Scheduled Site Appointments
              </h3>
              <span className="text-xs text-[var(--color-muted-foreground)]">
                QR gate pass will be SMS/WhatsApp dispatched prior to arrival.
              </span>
            </div>

            {siteVisits.map((sv) => (
              <div
                key={sv.id}
                className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getStatusBadge(sv.status)}`}>
                      {sv.status}
                    </span>
                    <span className="text-[var(--color-muted-foreground)]">•</span>
                    <span className="font-medium text-[var(--color-foreground)]">{sv.visitType}</span>
                  </div>
                  <h4 className="font-semibold text-base text-[var(--color-foreground)]">
                    {sv.propertyTitle}
                  </h4>
                  <p className="text-[var(--color-muted-foreground)] flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-[var(--color-terracotta)]" />
                    {sv.location}
                  </p>
                  <p className="text-[var(--color-muted-foreground)] pt-1">
                    Date: <strong className="text-[var(--color-foreground)]">{sv.date}</strong> at <strong className="text-[var(--color-foreground)]">{sv.timeSlot}</strong>
                  </p>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">
                    Authorized Advisor: {sv.agentName} ({sv.agentPhone})
                  </p>
                </div>

                <div className="flex items-center space-x-2 sm:self-center">
                  <button
                    onClick={() => toast.info(`Pass details re-sent for ${sv.propertyTitle}`)}
                    className="px-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded font-medium transition-colors"
                  >
                    Resend Gate Pass
                  </button>
                  <button
                    onClick={() => toast.info("To reschedule, advisor will contact you shortly.")}
                    className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded font-semibold transition-colors"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: ENQUIRIES
        ==================================================================== */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Dispatched Enquiries & Callback Requests
            </h3>
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950/20 text-emerald-600 rounded">
                    {enq.status}
                  </span>
                  <h4 className="font-semibold text-sm text-[var(--color-foreground)] mt-1">
                    {enq.propertyTitle}
                  </h4>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">
                    Submitted on: {enq.submittedDate} • {enq.notes || "Brochure dispatched"}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-terracotta)]">
                  Senior Advisor Connected
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: SEARCH ALERTS
        ==================================================================== */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Active Property Alerts & Saved Searches
            </h3>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Notify me instantly via WhatsApp or daily email when newly verified inventory matching these parameters is published.
            </p>
            {savedSearches.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-foreground)]">{alert.query}</h4>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">
                    {alert.city} ({alert.locality}) • Max Budget: {alert.maxBudget} • Channel: {alert.frequency}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] rounded uppercase tracking-wider">
                  Monitoring Active
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: RECENTLY VIEWED
        ==================================================================== */}
        {activeTab === "recent" && (
          <div className="space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Recently Inspected Residences
            </h3>
            {recentlyViewed.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                You haven't inspected any properties in this session yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewed.map((prop) => (
                  <PropertyCard key={prop.id || prop._id} property={prop} variant="standard" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: PREFERENCES & SETTINGS
        ==================================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 space-y-6 text-xs">
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Account & Regional Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Phone (Verification)
                </label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Valuation Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    toast.info(`Currency set to ${e.target.value}`);
                  }}
                  className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)]"
                >
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="USD">USD ($ United States Dollar)</option>
                  <option value="AED">AED (د.إ UAE Dirham)</option>
                  <option value="GBP">GBP (£ British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    toast.info("Language preference saved");
                  }}
                  className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)]"
                >
                  <option value="en">English (Default)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("user", JSON.stringify(userProfile));
                  toast.success("Profile changes saved");
                }}
                className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold rounded-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default AccountPage;
