import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ShieldCheck, Scale, FileText, ArrowRight, CheckCircle2, Award, Building2 } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>About Makaan4U — The Verification Philosophy & Brand Story</title>
        <meta
          name="description"
          content="Learn why Makaan4U was founded: to replace opaque, unverified Indian real estate listings with forensic on-site audits, RERA registry matching, and transparent valuations."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24 lg:pb-16 text-xs sm:text-sm">
        <Breadcrumbs items={[{ label: "About Makaan4U" }]} />

        {/* Editorial Narrative Intro */}
        <div className="space-y-4 border-b border-[var(--color-border)] pb-10">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Our Founding Conviction
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)] leading-tight">
            Indian real estate was broken by speculative, phantom listings. <br />
            <span className="italic font-normal text-[var(--color-secondary)]">We rebuilt the marketplace around forensic proof.</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-muted-foreground)] leading-relaxed font-light pt-2">
            For decades, buying property in Mumbai, Bangalore, or Gurgaon meant navigating unverified portal bait, duplicate broker listings, and speculative price inflation. Makaan4U was established by real estate valuers, legal counsels, and product designers with a single standard: zero unverified inventory.
          </p>
        </div>

        {/* The 3 Pillars of Verification */}
        <section className="space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-muted-foreground)]">
              Operational Standard
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mt-1">
              How the Verification Protocol Works
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--color-terracotta)]">01 / REGULATORY AUDIT</span>
              <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                State RERA Title Reconciliation
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                Before any residential development is approved on Makaan4U, our legal team verifies the promoter's active MahaRERA, KarRERA, or HRERA quarterly compliance reports, confirming that 70% of buyer collections remain ring-fenced within designated escrow accounts.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--color-terracotta)]">02 / PHYSICAL AUDIT</span>
              <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                On-Site Measurement & Acoustic Verification
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                We physically deploy certified property inspectors to measure usable carpet area in compliance with the statutory RERA definition. We verify floor orientation, cross-ventilation, daylight penetration, and building maintenance fund reserves.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-2">
              <span className="font-mono text-xs font-bold text-[var(--color-terracotta)]">03 / VALUATION SCRUTINY</span>
              <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                Registered Registry Price Calibration
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                Our guide valuations reflect genuine sub-registrar stamp duty transaction data, not speculative asking prices inflated by multi-tier broker chains.
              </p>
            </div>
          </div>
        </section>

        {/* Coverage & Pan-India Footprint */}
        <section className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-4">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Pan-India Footprint
          </span>
          <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
            Regional Advisory Desks
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Mumbai & MMR</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">BKC, Worli, Bandra, Thane</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Delhi NCR</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">Golf Course Rd, DLF 5, South Delhi</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Bangalore</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">Indiranagar, Lavelle Rd, Whitefield</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Pune</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">Koregaon Park, Baner, Kalyani Nagar</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Hyderabad</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">Jubilee Hills, Kokapet, Gachibowli</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Goa</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">Assagao, Siolim, Candolim</p>
            </div>
          </div>
        </section>

        {/* Closing Contact CTA */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Connect with our Leadership Desk
            </h3>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              For institutional mandates, family office representation, or developer onboarding.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors whitespace-nowrap"
          >
            Regional Offices & Contact →
          </Link>
        </div>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default About;
