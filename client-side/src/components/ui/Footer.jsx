import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileText
} from "lucide-react";
import { CITIES, LOCALITIES } from "../../data/propertyData";
import Logo from "./Logo";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail("");
    }, 4000);
  };

  return (
    <footer className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] text-[var(--color-foreground)] transition-colors duration-300">
      {/* Editorial Newsletter Strip */}
      <div className="border-b border-[var(--color-border)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
              Makaan4U Intelligence Dispatch
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold mt-1 text-[var(--color-foreground)]">
              Curated Indian Property & Architectural Insights
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-2 max-w-xl">
              Fortnightly market benchmarks, RERA regulatory audits, infrastructure updates, and discreet prime property releases across Mumbai, NCR, Bangalore & Goa.
            </p>
          </div>
          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You are subscribed to the Makaan4U Intelligence Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter executive email..."
                  required
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] rounded-sm transition-colors whitespace-nowrap flex items-center justify-center space-x-1"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-[var(--color-muted-foreground)] mt-1.5">
              Strict privacy. Zero spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-xs">
          {/* Col 1: Brand & Philosophy */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" taglineText="Indian Residential Intelligence" />
            <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed max-w-sm">
              Makaan4U is an architectural property discovery marketplace bridging high-trust verified residential inventory with deep micro-market intelligence across India's leading economic centres.
            </p>
            <div className="pt-2 space-y-1.5 text-[11px] text-[var(--color-muted-foreground)]">
              <p className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Physically Inspected & Title-Verified</span>
              </p>
              <p className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-[var(--color-secondary)] flex-shrink-0" />
                <span>MahaRERA Registered Agency</span>
              </p>
            </div>
          </div>

          {/* Col 2: Residential Markets */}
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-wider text-[11px] text-[var(--color-foreground)]">
              Major Cities
            </p>
            <ul className="space-y-2 text-[var(--color-muted-foreground)]">
              {CITIES.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/cities/${c.id}`}
                    className="hover:text-[var(--color-foreground)] transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Prime Localities */}
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-wider text-[11px] text-[var(--color-foreground)]">
              Prime Localities
            </p>
            <ul className="space-y-2 text-[var(--color-muted-foreground)]">
              {LOCALITIES.map((l) => (
                <li key={l.id}>
                  <Link
                    to={`/localities/${l.id}`}
                    className="hover:text-[var(--color-foreground)] transition-colors"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Property Types */}
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-wider text-[11px] text-[var(--color-foreground)]">
              Discovery
            </p>
            <ul className="space-y-2 text-[var(--color-muted-foreground)]">
              <li>
                <Link to="/properties?purpose=Buy" className="hover:text-[var(--color-foreground)]">
                  Buy Residences
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=Rent" className="hover:text-[var(--color-foreground)]">
                  Executive Rentals
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[var(--color-foreground)]">
                  New Project Launches
                </Link>
              </li>
              <li>
                <Link to="/properties?type=Commercial" className="hover:text-[var(--color-foreground)]">
                  Commercial & Offices
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[var(--color-foreground)]">
                  Compare Properties
                </Link>
              </li>
              <li>
                <Link to="/post-property" className="hover:text-[var(--color-foreground)]">
                  Post Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div className="space-y-3">
            <p className="font-semibold uppercase tracking-wider text-[11px] text-[var(--color-foreground)]">
              Company & Trust
            </p>
            <ul className="space-y-2 text-[var(--color-muted-foreground)]">
              <li>
                <Link to="/about" className="hover:text-[var(--color-foreground)]">
                  About Makaan4U
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-[var(--color-foreground)]">
                  Makaan4U Insights
                </Link>
              </li>
              <li>
                <Link to="/market-insights" className="hover:text-[var(--color-foreground)]">
                  Market Trends & Index
                </Link>
              </li>
              <li>
                <Link to="/agents" className="hover:text-[var(--color-foreground)]">
                  Certified Agents
                </Link>
              </li>
              <li>
                <Link to="/developers" className="hover:text-[var(--color-foreground)]">
                  Featured Developers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--color-foreground)]">
                  Regional Offices
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & RERA Disclaimer */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-[11px] text-[var(--color-muted-foreground)] space-y-4">
          <p className="leading-relaxed">
            <span className="font-semibold text-[var(--color-foreground)]">RERA Compliance Disclaimer:</span> Makaan4U Technologies Private Limited functions as an authorized real estate facilitation marketplace under the Real Estate (Regulation and Development) Act, 2016. All property specifications, dimensions, amenities, and pricing presented on this platform are corroborated against respective state RERA registrations (MahaRERA, KarRERA, HRERA, GujRERA, TS RERA). Buyers are advised to independently review certified project disclosures on statutory state authority portals before entering into financial agreements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] border-t border-[var(--color-border)] pt-4 gap-4">
            <p>© {new Date().getFullYear()} Makaan4U Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 text-[var(--color-muted-foreground)]">
              <Link to="/about" className="hover:underline">Verification Philosophy</Link>
              <Link to="/contact" className="hover:underline">Grievance Redressal</Link>
              <Link to="/about" className="hover:underline">Terms of Service</Link>
              <Link to="/about" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;