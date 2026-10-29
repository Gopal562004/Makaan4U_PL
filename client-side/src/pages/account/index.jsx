import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
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
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  RefreshCw,
  KeyRound,
  Sparkles,
  AlertCircle
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

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      if (!token || !stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  // Sync auth state across tabs and custom events
  useEffect(() => {
    const handleAuthSync = () => {
      try {
        const token = localStorage.getItem("token");
        const stored = localStorage.getItem("user");
        if (!token || !stored) {
          setCurrentUser(null);
        } else {
          setCurrentUser(JSON.parse(stored));
        }
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", handleAuthSync);
    window.addEventListener("auth:state-change", handleAuthSync);
    return () => {
      window.removeEventListener("storage", handleAuthSync);
      window.removeEventListener("auth:state-change", handleAuthSync);
    };
  }, []);

  // Determine subview from pathname
  const getTabFromPath = (path) => {
    if (path.includes("/visits")) return "visits";
    if (path.includes("/enquiries")) return "enquiries";
    if (path.includes("/alerts")) return "alerts";
    if (path.includes("/recent")) return "recent";
    if (path.includes("/settings") || path.includes("/profile")) return "settings";
    if (path.includes("/saved")) return "saved";
    // For root /account or /account/, default to settings if logged in, or saved if guest
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    return token && stored ? "settings" : "saved";
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

  // Editable Profile Settings (synced to currentUser)
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    city: "Mumbai"
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        city: currentUser.city || "Mumbai"
      });
    }
  }, [currentUser]);

  // In-Page Sign-In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleExecuteLogin = async (emailToSubmit, passwordToSubmit) => {
    try {
      setIsAuthenticating(true);
      setLoginError("");
      const res = await axios.post(
        `${getApiUrl()}/auth/login`,
        {
          email: emailToSubmit,
          password: passwordToSubmit
        },
        { withCredentials: true }
      );

      if (res.data?.success && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
        window.dispatchEvent(new Event("auth:state-change"));
        toast.success(`Welcome back, ${res.data.user.name || "Client"}`);
      } else {
        setLoginError(res.data?.message || "Invalid email or password.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Sign in failed. Please verify credentials.";
      setLoginError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password");
      return;
    }
    handleExecuteLogin(loginEmail, loginPassword);
  };

  const handleQuickLogin = (email, password) => {
    setLoginEmail(email);
    setLoginPassword(password);
    handleExecuteLogin(email, password);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    window.dispatchEvent(new Event("auth:state-change"));
    toast.info("Signed out of your client workspace");
    navigate("/account/saved");
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      name: profileForm.name || currentUser.name,
      phone: profileForm.phone,
      city: profileForm.city
    };
    localStorage.setItem("user", JSON.stringify(updated));
    setCurrentUser(updated);
    window.dispatchEvent(new Event("auth:state-change"));
    toast.success("Profile preferences saved successfully");
  };

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

  // Filter site visits for logged-in user
  const userVisits = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "admin") return siteVisits;
    return siteVisits.filter((sv) => {
      const svEmail = (sv.buyerEmail || sv.email || "").toLowerCase();
      const uEmail = (currentUser.email || "").toLowerCase();
      const svPhone = (sv.buyerPhone || sv.phone || "").replace(/\D/g, "");
      const uPhone = (currentUser.phone || "").replace(/\D/g, "");

      if (svEmail && uEmail && svEmail === uEmail) return true;
      if (svPhone && uPhone && (svPhone.includes(uPhone) || uPhone.includes(svPhone))) return true;
      // Also match visits without email if scheduled in current browser
      if (!svEmail && !svPhone) return true;
      return false;
    });
  }, [siteVisits, currentUser]);

  // Filter enquiries for logged-in user
  const userEnquiries = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "admin") return enquiries;
    return enquiries.filter((enq) => {
      const enqEmail = (enq.buyerEmail || enq.email || "").toLowerCase();
      const uEmail = (currentUser.email || "").toLowerCase();
      const enqPhone = (enq.buyerPhone || enq.phone || "").replace(/\D/g, "");
      const uPhone = (currentUser.phone || "").replace(/\D/g, "");

      if (enqEmail && uEmail && enqEmail === uEmail) return true;
      if (enqPhone && uPhone && (enqPhone.includes(uPhone) || uPhone.includes(enqPhone))) return true;
      if (!enqEmail && !enqPhone) return true;
      return false;
    });
  }, [enquiries, currentUser]);

  // Determine if active tab strictly requires login
  const tabRequiresAuth = activeTab !== "saved" && activeTab !== "recent";
  const showAuthGate = !currentUser && (tabRequiresAuth || (activeTab === "saved" && savedProperties.length === 0 && location.pathname === "/account"));

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>
          {currentUser
            ? `${currentUser.name} — Client Workspace | Makaan4U`
            : "Client Workspace & Shortlist — Makaan4U"}
        </title>
        <meta
          name="description"
          content="Manage your shortlisted residences, upcoming site visits, search alerts, and developer enquiries."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: "Account Workspace", path: "/account" },
            { label: currentUser ? activeTab : tabRequiresAuth ? "Sign In Required" : activeTab }
          ]}
        />

        {/* ====================================================================
            HEADER BAR: GUEST VS AUTHENTICATED
        ==================================================================== */}
        {currentUser ? (
          /* Authenticated User Header */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-terracotta)]/20 to-amber-500/20 border border-[var(--color-terracotta)]/40 rounded-full flex items-center justify-center font-editorial text-xl font-bold text-[var(--color-terracotta)] shadow-sm">
                {(currentUser.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentUser.role === "admin"
                    ? "System Administrator"
                    : currentUser.role === "employee"
                    ? "Certified Luxury Advisor"
                    : "Verified Buyer & Investor Account"}
                </span>
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {currentUser.email}
                  {currentUser.phone ? ` • ${currentUser.phone}` : ""}
                  {currentUser.city ? ` • ${currentUser.city}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {currentUser.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="px-3.5 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] text-xs font-semibold rounded-sm transition-colors text-[var(--color-foreground)]"
                >
                  Admin Console
                </Link>
              )}
              <Link
                to="/properties"
                className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors"
              >
                Discover Properties
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-[var(--color-muted-foreground)] hover:text-red-600 border border-[var(--color-border)] hover:border-red-300 rounded-sm transition-colors"
                title="Sign Out"
                aria-label="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Guest Workspace Header */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] pb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-full flex items-center justify-center font-editorial text-xl font-bold text-[var(--color-muted-foreground)]">
                <Heart className="w-6 h-6 text-[var(--color-terracotta)]" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[var(--color-terracotta)]" />
                  Guest Session (Not Signed In)
                </span>
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                  {activeTab === "saved" ? "Your Shortlisted Residences" : "Private Client Workspace"}
                </h1>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {activeTab === "saved"
                    ? `Saved locally on this device (${savedProperties.length} residences) • Sign in to sync across devices`
                    : "Sign in with your verified buyer account to manage appointments and dossiers."}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`}
                className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to={`/auth/register?redirect=${encodeURIComponent(location.pathname)}`}
                className="px-3.5 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] text-xs font-medium rounded-sm transition-colors text-[var(--color-foreground)]"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Tab Navigation Strip */}
        <div className="flex border-b border-[var(--color-border)] gap-6 overflow-x-auto text-xs font-semibold pb-1">
          {[
            { id: "saved", label: `Saved Shortlist (${savedProperties.length})`, icon: Heart, requiresAuth: false },
            { id: "visits", label: `Site Visits (${currentUser ? userVisits.length : 0})`, icon: Calendar, requiresAuth: true },
            { id: "enquiries", label: `Enquiries (${currentUser ? userEnquiries.length : 0})`, icon: PhoneCall, requiresAuth: true },
            { id: "alerts", label: `Search Alerts (${currentUser ? savedSearches.length : 0})`, icon: Bell, requiresAuth: true },
            { id: "recent", label: `Recently Viewed (${recentlyViewed.length})`, icon: Clock, requiresAuth: false },
            { id: "settings", label: "Preferences & Profile", icon: Settings, requiresAuth: true }
          ].map((tab) => {
            const Icon = tab.icon;
            const isLocked = !currentUser && tab.requiresAuth;
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
                {isLocked && <Lock className="w-2.5 h-2.5 text-[var(--color-muted-foreground)] opacity-60 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            AUTHENTICATION REQUIRED GATE (Rendered for unauthenticated visitors)
        ==================================================================== */}
        {showAuthGate ? (
          <div className="max-w-xl mx-auto py-6 sm:py-10">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-amber-500/10 text-[var(--color-terracotta)] border border-[var(--color-terracotta)]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
                  Verified Client Services
                </span>
                <h2 className="font-editorial text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
                  {activeTab === "visits"
                    ? "Sign In to Access Scheduled Site Visits"
                    : activeTab === "enquiries"
                    ? "Sign In to View Dispatched Enquiries"
                    : activeTab === "alerts"
                    ? "Sign In to Manage Search Alerts"
                    : activeTab === "settings"
                    ? "Sign In to Access Preferences & Profile"
                    : "Sign In to Your Client Workspace"}
                </h2>
                <p className="text-xs text-[var(--color-muted-foreground)] max-w-md mx-auto leading-relaxed">
                  Scheduled site appointments, advisor contacts, digital QR gate passes, and personalized searches are protected under your private verified account.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/20 border border-red-800/40 text-red-500 rounded-sm text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Quick 1-Click Verification Logins */}
              <div className="p-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--color-muted-foreground)] block">
                  Quick 1-Click Verification Sign-In:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isAuthenticating}
                    onClick={() => handleQuickLogin("mayur@example.com", "admin123")}
                    className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-left transition-colors"
                  >
                    <span className="font-bold text-xs text-[var(--color-foreground)] block truncate">
                      Mayur Kadam
                    </span>
                    <span className="text-[10px] text-[var(--color-terracotta)] font-mono block">
                      Lead Admin
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={isAuthenticating}
                    onClick={() => handleQuickLogin("gopalgawas2004@gmail.com", "admin123")}
                    className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-left transition-colors"
                  >
                    <span className="font-bold text-xs text-[var(--color-foreground)] block truncate">
                      Gopal Gawas
                    </span>
                    <span className="text-[10px] text-[var(--color-terracotta)] font-mono block">
                      System Admin
                    </span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-[var(--color-border)] w-full" />
                <span className="bg-[var(--color-surface)] px-3 text-[10px] text-[var(--color-muted-foreground)] uppercase font-mono absolute">
                  or sign in with credentials
                </span>
              </div>

              {/* Direct In-Place Login Form */}
              <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1 uppercase tracking-wider">
                    Registered Email or Phone
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. client@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Unlock Client Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted-foreground)] space-y-2">
                <p>
                  Don't have a verified account yet?{" "}
                  <Link
                    to={`/auth/register?redirect=${encodeURIComponent(location.pathname)}`}
                    className="text-[var(--color-foreground)] underline font-semibold hover:text-[var(--color-terracotta)]"
                  >
                    Create Free Account
                  </Link>
                </p>
                <div>
                  <Link
                    to="/properties"
                    className="text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                  >
                    ← Return to Property Discovery
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
              UNLOCKED TAB CONTENT
          ==================================================================== */
          <>
            {/* ====================================================================
                TAB CONTENT: SAVED PROPERTIES
            ==================================================================== */}
            {activeTab === "saved" && (
              <div className="space-y-6">
                {!currentUser && savedProperties.length > 0 && (
                  <div className="p-4 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-[var(--color-foreground)]">
                      <Sparkles className="w-4 h-4 text-[var(--color-terracotta)] flex-shrink-0" />
                      <span>
                        You have <strong>{savedProperties.length} residences</strong> shortlisted in this browser. Sign in to sync them permanently across your devices.
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`}
                        className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-semibold rounded-sm whitespace-nowrap"
                      >
                        Sign In to Sync
                      </Link>
                    </div>
                  </div>
                )}

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                      Scheduled Site Appointments
                    </h3>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Digital QR gate pass will be dispatched via WhatsApp/SMS prior to your scheduled arrival.
                    </p>
                  </div>
                  {currentUser?.role === "admin" && (
                    <Link
                      to="/admin/inquiries"
                      className="text-xs font-semibold text-[var(--color-terracotta)] hover:underline flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>Manage In Admin Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {userVisits.length === 0 ? (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 sm:p-12 text-center max-w-md mx-auto space-y-4">
                    <div className="w-12 h-12 bg-[var(--color-subtle)] text-[var(--color-terracotta)] rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h4 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                      No Scheduled Site Appointments
                    </h4>
                    <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                      You haven't scheduled any private property tours yet. Select any verified residence to book an in-person guided tour or live virtual walkthrough with an authorized advisor.
                    </p>
                    <div>
                      <Link
                        to="/properties"
                        className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors"
                      >
                        <span>Browse Verified Residences</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  userVisits.map((sv) => (
                    <div
                      key={sv.id || sv._id}
                      className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getStatusBadge(sv.status)}`}>
                            {sv.status || "Requested"}
                          </span>
                          <span className="text-[var(--color-muted-foreground)]">•</span>
                          <span className="font-medium text-[var(--color-foreground)]">{sv.visitType || "In-Person Guided Tour"}</span>
                        </div>
                        <h4 className="font-semibold text-base text-[var(--color-foreground)]">
                          {sv.propertyTitle || sv.property?.title || "Exclusive Residence"}
                        </h4>
                        <p className="text-[var(--color-muted-foreground)] flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-[var(--color-terracotta)]" />
                          {sv.location || sv.propertyLocation || "Prime Micro-Market"}
                        </p>
                        <p className="text-[var(--color-muted-foreground)] pt-1">
                          Date: <strong className="text-[var(--color-foreground)]">{sv.date || sv.preferredDate || "Scheduled Date"}</strong> at <strong className="text-[var(--color-foreground)]">{sv.timeSlot || "Scheduled Slot"}</strong>
                        </p>
                        <p className="text-[11px] text-[var(--color-muted-foreground)]">
                          Authorized Advisor: {sv.agentName || sv.assignedAgent?.name || "Senior Property Advisor"} ({sv.agentPhone || sv.assignedAgent?.phone || "+91 98201 44820"})
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 sm:self-center">
                        <button
                          onClick={() => toast.info(`Pass details re-sent for ${sv.propertyTitle || "residence"}`)}
                          className="px-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded font-medium transition-colors"
                        >
                          Resend Gate Pass
                        </button>
                        <button
                          onClick={() => toast.info("To reschedule, advisor will contact you shortly via WhatsApp.")}
                          className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded font-semibold transition-colors"
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ====================================================================
                TAB CONTENT: ENQUIRIES
            ==================================================================== */}
            {activeTab === "enquiries" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                      Dispatched Enquiries & Callback Requests
                    </h3>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Track legal due-diligence dossiers, developer brochure requests, and callback inquiries.
                    </p>
                  </div>
                </div>

                {userEnquiries.length === 0 ? (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 sm:p-12 text-center max-w-md mx-auto space-y-4">
                    <div className="w-12 h-12 bg-[var(--color-subtle)] text-[var(--color-terracotta)] rounded-full flex items-center justify-center mx-auto">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <h4 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                      No Dispatched Enquiries
                    </h4>
                    <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                      When you request brochures, RERA legal due-diligence dossiers, or pricing breakdowns on prime inventory, their fulfillment status will be tracked here.
                    </p>
                    <div>
                      <Link
                        to="/properties"
                        className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors"
                      >
                        <span>Explore Verified Residences</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  userEnquiries.map((enq) => (
                    <div
                      key={enq.id || enq._id}
                      className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950/20 text-emerald-600 rounded">
                          {enq.status || "Assigned"}
                        </span>
                        <h4 className="font-semibold text-sm text-[var(--color-foreground)] mt-1">
                          {enq.propertyTitle || "Property Enquiry"}
                        </h4>
                        <p className="text-[11px] text-[var(--color-muted-foreground)]">
                          Submitted on: {enq.submittedDate || enq.createdAt?.split("T")[0] || "Recent"} • {enq.notes || "Dossier dispatched"}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[var(--color-terracotta)]">
                        Senior Advisor Connected
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ====================================================================
                TAB CONTENT: SEARCH ALERTS
            ==================================================================== */}
            {activeTab === "alerts" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                    Active Property Alerts & Saved Searches
                  </h3>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                    Notify me instantly via WhatsApp or daily email when newly verified inventory matching these parameters is published.
                  </p>
                </div>

                {savedSearches.length === 0 ? (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 sm:p-12 text-center max-w-md mx-auto space-y-4">
                    <div className="w-12 h-12 bg-[var(--color-subtle)] text-[var(--color-terracotta)] rounded-full flex items-center justify-center mx-auto">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h4 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                      No Active Property Alerts
                    </h4>
                    <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                      Save custom search filters on the property listings directory to receive instant dispatches as soon as off-market or newly registered inventory arrives.
                    </p>
                    <div>
                      <Link
                        to="/properties"
                        className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors"
                      >
                        <span>Set Filters on Property Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  savedSearches.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-[var(--color-foreground)]">{alert.query || "Custom Micro-Market Filter"}</h4>
                        <p className="text-[11px] text-[var(--color-muted-foreground)]">
                          {alert.city} ({alert.locality || "All Localities"}) • Max Budget: {alert.maxBudget || "Any"} • Channel: {alert.frequency || "Instant WhatsApp"}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] rounded uppercase tracking-wider">
                        Monitoring Active
                      </span>
                    </div>
                  ))
                )}
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
                    You haven't inspected any property dossiers in this session yet.
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
            {activeTab === "settings" && currentUser && (
              <div className="max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 space-y-6 text-xs">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                    Account & Regional Preferences
                  </h3>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                    Manage your verified client profile details and regional valuation parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Gopal Gawas"
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-muted-foreground)] cursor-not-allowed opacity-80"
                      title="Primary verified account email cannot be edited directly."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Phone (QR Gate Pass Verification)
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Primary Investment City
                    </label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
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

                <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                  <span className="text-[11px] text-[var(--color-muted-foreground)]">
                    Account Role: <strong className="text-[var(--color-foreground)] capitalize">{currentUser.role || "Buyer"}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors shadow-xs"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default AccountPage;
