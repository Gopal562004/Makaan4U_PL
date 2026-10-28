import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Scale, X, Plus, ShieldCheck, ArrowRight, Building } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { useShortlist } from "../../contexts/ShortlistContext";

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useShortlist();

  const comparisonAttributes = [
    {
      label: "Price / Valuation",
      render: (p) => (
        <span className="font-mono text-base sm:text-lg font-bold text-[var(--color-terracotta)]">
          {p.price || "Contact for Price"}
        </span>
      ),
    },
    {
      label: "Price per Sq.Ft",
      render: (p) => (
        <span className="font-mono text-xs">{p.pricePerSqFt || "—"}</span>
      ),
    },
    {
      label: "Type & Layout",
      render: (p) => (
        <span>
          {p.bedrooms ? `${p.bedrooms} BHK` : p.propertyType || "Commercial"}
          {p.bathrooms ? ` • ${p.bathrooms} Baths` : ""}
        </span>
      ),
    },
    {
      label: "Carpet Usable Area",
      render: (p) => (
        <span className="font-semibold">{p.carpetArea || (p.area ? `${p.area.toLocaleString()} sq.ft` : "—")}</span>
      ),
    },
    {
      label: "Super Built-up Area",
      render: (p) => <span>{p.superArea || "—"}</span>,
    },
    {
      label: "Locality & City",
      render: (p) => <span>{p.locality ? `${p.locality}, ` : ""}{p.city}</span>,
    },
    {
      label: "Possession Status",
      render: (p) => <span>{p.constructionStatus || p.possession || p.status || "Available"}</span>,
    },
    {
      label: "Floor Level",
      render: (p) => <span>{p.floor || "—"}</span>,
    },
    {
      label: "Orientation / Facing",
      render: (p) => <span>{p.facing || "—"}</span>,
    },
    {
      label: "Allocated Parking",
      render: (p) => <span>{p.parking || "—"}</span>,
    },
    {
      label: "Furnishing Status",
      render: (p) => <span>{p.furnishing || "—"}</span>,
    },
    {
      label: "RERA Registration",
      render: (p) =>
        p.reraId ? (
          <span className="font-mono text-emerald-600 font-semibold flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span>{p.reraId}</span>
          </span>
        ) : (
          <span className="text-[var(--color-muted-foreground)]">—</span>
        ),
    },
    {
      label: "Verified Advisor",
      render: (p) => (
        <span>{p.agent?.name || "Local Authorized Advisor"}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Side-by-Side Property Comparison Matrix — Makaan4U</title>
        <meta
          name="description"
          content="Compare carpet areas, RERA numbers, price per sq.ft, maintenance, and possession status for Indian luxury residences."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-16">
        <Breadcrumbs items={[{ label: "Property Comparison Matrix" }]} />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--color-border)] pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
              Specification Analysis
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)]">
              Side-by-Side Property Comparison
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] max-w-xl leading-relaxed">
              Forensic comparison of dimensions, statutory RERA registrations, maintenance charges, and layout specifications.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-[var(--color-muted-foreground)] hover:text-red-600 transition-colors"
              >
                Clear Queue
              </button>
            )}
            <Link
              to="/properties"
              className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors"
            >
              Add Another Residence +
            </Link>
          </div>
        </div>

        {/* Clean Architectural Comparison Matrix Table or Empty State */}
        {compareList.length === 0 ? (
          <div className="border border-[var(--color-border)] rounded-sm p-12 text-center bg-[var(--color-surface)] space-y-4 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-subtle)] text-[var(--color-terracotta)] flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              No Properties in Comparison Matrix
            </h3>
            <p className="text-xs text-[var(--color-muted-foreground)] max-w-md mx-auto leading-relaxed">
              Select properties across the live catalog and click the comparison icon to analyze their carpet area, pricing, and specifications side-by-side.
            </p>
            <div className="pt-2">
              <Link
                to="/properties"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] rounded-sm text-xs font-semibold transition-colors"
              >
                <span>Browse Verified Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-[var(--color-border)] rounded-sm overflow-hidden bg-[var(--color-surface)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
                    <th className="p-4 w-48 text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] align-top">
                      Property Dossier
                    </th>
                    {compareList.map((prop) => (
                      <th key={prop.id || prop._id} className="p-4 min-w-[240px] max-w-[280px] align-top border-l border-[var(--color-border)]">
                        <div className="space-y-2 relative">
                          <div className="relative h-36 w-full rounded overflow-hidden bg-[var(--color-subtle)]">
                            <img
                              src={prop.images?.[0] || prop.image}
                              alt={prop.title}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeFromCompare(prop.id || prop._id)}
                              className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <Link
                            to={`/properties/${prop.slug || prop.id || prop._id}`}
                            className="font-editorial text-base font-bold text-[var(--color-foreground)] hover:text-[var(--color-terracotta)] line-clamp-1 block"
                          >
                            {prop.title}
                          </Link>
                          <p className="text-[11px] text-[var(--color-muted-foreground)]">
                            {prop.locality ? `${prop.locality}, ` : ""}{prop.city}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {comparisonAttributes.map((attr, idx) => (
                    <tr key={idx} className="hover:bg-[var(--color-subtle)]/50 transition-colors">
                      <td className="p-3.5 font-semibold text-[var(--color-muted-foreground)] text-xs bg-[var(--color-subtle)]/20">
                        {attr.label}
                      </td>
                      {compareList.map((prop) => (
                        <td key={prop.id || prop._id} className="p-3.5 border-l border-[var(--color-border)] text-xs text-[var(--color-foreground)]">
                          {attr.render(prop)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ComparePage;
