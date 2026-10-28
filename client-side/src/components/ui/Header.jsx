import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Scale,
  Sun,
  Moon,
  Plus,
  User,
  Menu,
  X,
  Compass,
  Building,
  Briefcase,
  Layers,
  BookOpen,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useShortlist } from "../../contexts/ShortlistContext";
import SearchAutocomplete from "./SearchAutocomplete";
import Logo from "./Logo";

const Header = () => {
  const { theme, isEvening, toggleTheme } = useTheme();
  const { savedProperties, compareList } = useShortlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const location = useLocation();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  // Subtle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
    setIsSearchModalOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAccountMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Buy", href: "/properties?purpose=Buy" },
    { label: "Rent", href: "/properties?purpose=Rent" },
    { label: "Commercial", href: "/properties?type=Commercial" },
    { label: "Projects", href: "/projects" },
    { label: "Cities", href: "/cities" },
    { label: "Insights", href: "/insights" },
  ];

  const isActive = (path) => {
    if (path.includes("?")) {
      const basePath = path.split("?")[0];
      return location.pathname === basePath && location.search.includes(path.split("?")[1]);
    }
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-300 border-b ${
          isScrolled
            ? "bg-[var(--color-surface)] border-[var(--color-border)] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            : "bg-[var(--color-canvas)] border-[var(--color-border)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand Identity */}
            <div className="flex items-center space-x-8">
              <Logo size="md" />

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`px-3.5 py-1.5 text-sm font-medium transition-colors rounded-sm ${
                      isActive(link.href)
                        ? "text-[var(--color-foreground)] bg-[var(--color-subtle)] font-semibold"
                        : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-subtle)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Quick Discovery & User Utilities */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-[var(--color-muted-foreground)] bg-[var(--color-surface)] hover:text-[var(--color-foreground)] border border-[var(--color-border)] rounded-sm transition-all hover:border-[var(--color-muted-foreground)]"
                aria-label="Search properties"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline text-xs font-normal">Search city, locality, RERA...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono border border-[var(--color-border)] bg-[var(--color-subtle)] rounded text-[var(--color-muted-foreground)]">
                  ⌘K
                </kbd>
              </button>

              {/* Day ↔ Evening Switch */}
              <button
                onClick={toggleTheme}
                className="p-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded-sm border border-transparent hover:border-[var(--color-border)] transition-colors"
                title={isEvening ? "Switch to Day Mode" : "Switch to Evening Mode"}
                aria-label="Toggle day and evening theme"
              >
                {isEvening ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-charcoal-700" />
                )}
              </button>

              {/* Saved / Shortlist Trigger */}
              <Link
                to="/account/saved"
                className="relative p-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded-sm transition-colors"
                title="Saved Shortlist"
                aria-label="Saved properties"
              >
                <Heart className="w-4 h-4" />
                {savedProperties.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-terracotta)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {savedProperties.length}
                  </span>
                )}
              </Link>

              {/* Compare Pill (Shows when active) */}
              {compareList.length > 0 && (
                <Link
                  to="/compare"
                  className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-[var(--color-foreground)] bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm hover:border-[var(--color-foreground)] transition-colors"
                  title="Compare Properties"
                >
                  <Scale className="w-3.5 h-3.5 text-[var(--color-terracotta)]" />
                  <span>Compare</span>
                  <span className="px-1.5 py-0.2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px] font-mono rounded">
                    {compareList.length}
                  </span>
                </Link>
              )}

              {/* Post Property CTA */}
              <Link
                to="/post-property"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-foreground)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Property</span>
              </Link>

              {/* User Account Menu */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 flex items-center space-x-2 text-sm text-[var(--color-foreground)] border border-[var(--color-border)] rounded-sm hover:bg-[var(--color-subtle)] transition-colors"
                  aria-label="User account"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline text-xs font-medium">
                    {user ? user.name || "Account" : "Sign In"}
                  </span>
                </button>

                {/* Account Dropdown */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg rounded-sm z-50 text-sm">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-[var(--color-border)]">
                          <p className="font-semibold text-xs text-[var(--color-foreground)] truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-[var(--color-muted-foreground)] truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center px-4 py-2 text-xs hover:bg-[var(--color-subtle)] text-[var(--color-foreground)]"
                        >
                          <User className="w-3.5 h-3.5 mr-2 text-[var(--color-muted-foreground)]" />
                          Account Workspace
                        </Link>
                        <Link
                          to="/account/saved"
                          className="flex items-center px-4 py-2 text-xs hover:bg-[var(--color-subtle)] text-[var(--color-foreground)]"
                        >
                          <Heart className="w-3.5 h-3.5 mr-2 text-[var(--color-muted-foreground)]" />
                          Shortlisted Properties ({savedProperties.length})
                        </Link>
                        <Link
                          to="/account/visits"
                          className="flex items-center px-4 py-2 text-xs hover:bg-[var(--color-subtle)] text-[var(--color-foreground)]"
                        >
                          <Calendar className="w-3.5 h-3.5 mr-2 text-[var(--color-muted-foreground)]" />
                          Scheduled Site Visits
                        </Link>
                        <Link
                          to="/account/settings"
                          className="flex items-center px-4 py-2 text-xs hover:bg-[var(--color-subtle)] text-[var(--color-foreground)]"
                        >
                          <Settings className="w-3.5 h-3.5 mr-2 text-[var(--color-muted-foreground)]" />
                          Preferences
                        </Link>
                        <div className="border-t border-[var(--color-border)] my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
                          <p className="text-xs font-medium text-[var(--color-foreground)]">
                            Unlock Verified Property Discovery
                          </p>
                          <p className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5">
                            Save shortlists, track visits & compare floor plans.
                          </p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to="/auth/login"
                            className="w-full block text-center py-2 text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/auth/register"
                            className="w-full block text-center py-2 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-subtle)] rounded-sm transition-colors"
                          >
                            Create Free Account
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Drawer Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-[var(--color-foreground)] rounded-sm border border-[var(--color-border)]"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 pt-3 pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3 py-2.5 rounded-sm bg-[var(--color-subtle)] text-xs font-medium text-[var(--color-foreground)] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                </Link>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] pt-3 flex flex-col space-y-2">
              <Link
                to="/post-property"
                className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-foreground)] bg-[var(--color-primary)] rounded-sm"
              >
                Post Property Free
              </Link>
              <div className="flex items-center justify-between px-1 text-xs text-[var(--color-muted-foreground)]">
                <span>Theme: {isEvening ? "Evening" : "Day"}</span>
                <button
                  onClick={toggleTheme}
                  className="px-2 py-1 border border-[var(--color-border)] rounded text-xs"
                >
                  Toggle to {isEvening ? "Day" : "Evening"}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {isSearchModalOpen && (
        <SearchAutocomplete onClose={() => setIsSearchModalOpen(false)} />
      )}
    </>
  );
};

export default Header;