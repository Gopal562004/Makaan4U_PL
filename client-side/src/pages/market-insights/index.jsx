import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  TrendingUp,
  BarChart3,
  Percent,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CheckCircle2
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { MARKET_TRENDS_DATA, LOCALITIES, CITIES } from "../../data/propertyData";

const MarketInsightsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Indian Real Estate Market Index & Rental Yield Benchmarks — Makaan4U</title>
        <meta
          name="description"
          content="Quarterly residential pricing index, gross rental yields, supply absorption, and micro-market analysis across India's top 6 metropolitan regions."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10 pb-24 lg:pb-16">
        <Breadcrumbs items={[{ label: "Market Intelligence & Indices" }]} />

        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Institutional Research
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Indian Residential Valuation Index (Q3 2026)
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            Data aggregated from registered sub-registrar stamp duty transactions, statutory RERA quarterly progress reports, and verified institutional transactions.
          </p>
        </div>

        {/* Metro Benchmarking Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
              Metropolitan Comparative Metrics
            </h2>
            <span className="text-xs text-[var(--color-muted-foreground)] font-mono">
              Base Year: 2023 = 100
            </span>
          </div>

          <div className="border border-[var(--color-border)] rounded-sm overflow-hidden bg-[var(--color-surface)] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-subtle)] border-b border-[var(--color-border)] text-[var(--color-muted-foreground)] text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">City Region</th>
                    <th className="p-4 font-semibold">Avg Capital Value</th>
                    <th className="p-4 font-semibold">YoY Price Momentum</th>
                    <th className="p-4 font-semibold">Gross Rental Yield</th>
                    <th className="p-4 font-semibold">Demand Index (0-100)</th>
                    <th className="p-4 font-semibold text-right">Portal Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] font-mono">
                  {MARKET_TRENDS_DATA.map((item) => (
                    <tr key={item.city} className="hover:bg-[var(--color-subtle)] transition-colors">
                      <td className="p-4 font-sans font-semibold text-sm text-[var(--color-foreground)]">
                        {item.city}
                      </td>
                      <td className="p-4 font-bold text-[var(--color-foreground)]">
                        ₹{item.avgPrice.toLocaleString("en-IN")}/sq.ft
                      </td>
                      <td className="p-4 text-emerald-600 font-bold">
                        +{item.yoyGrowth}%
                      </td>
                      <td className="p-4 text-[var(--color-terracotta)] font-bold">
                        {item.rentalYield}% p.a.
                      </td>
                      <td className="p-4 font-sans">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-[var(--color-border)] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[var(--color-foreground)] h-full"
                              style={{ width: `${item.demandIndex}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono">{item.demandIndex}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-sans">
                        <Link
                          to={`/properties?city=${item.city}`}
                          className="font-semibold text-[var(--color-terracotta)] hover:underline"
                        >
                          View Listings →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Micro-market Analysis Commentary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-3">
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Rental Yield Dynamics in IT & Financial Corridors
            </h3>
            <p className="text-[var(--color-muted-foreground)] leading-relaxed">
              Bangalore and Hyderabad continue to record the strongest residential rental yields among top metros, ranging between 4.5% and 5.2%. In contrast, Mumbai's South and Central markets trade at premium capital multiples with lower yields (2.8% - 3.4%) compensated by sustained capital preservation and illiquidity premiums.
            </p>
          </div>

          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-3">
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              The Luxury Resurgence & High-Rise Expansion
            </h3>
            <p className="text-[var(--color-muted-foreground)] leading-relaxed">
              Homes priced above ₹5 Crore accounted for 24% of all registered residential transaction volume across Mumbai and Gurgaon in the trailing 12 months. Discerning buyers increasingly prioritize low-density towers, 11-foot clear slab ceilings, and dedicated concierge management over speculative peripheral plots.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default MarketInsightsPage;
