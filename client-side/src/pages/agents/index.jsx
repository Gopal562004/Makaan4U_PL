import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ShieldCheck, Phone, Mail, MapPin, Award, Star, ArrowRight } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getAllAgents } from "../../lib/mongo/services/companyService";
import { AGENTS as FALLBACK_AGENTS } from "../../data/propertyData";

const AgentsPage = () => {
  const [agents, setAgents] = useState(FALLBACK_AGENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAllAgents()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setAgents(data);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>RERA-Certified Luxury Property Advisors & Private Offices — Makaan4U</title>
        <meta
          name="description"
          content="Connect with verified, licensed RERA property consultants specializing in high-value residential transactions across Indian metros."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20 lg:pb-16">
        <Breadcrumbs items={[{ label: "Authorized Property Advisors" }]} />

        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Institutional Facilitation Network
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Certified RERA Property Advisors
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            Every advisor operates under strict statutory RERA broker registration, adhering to our code of absolute confidentiality, zero hidden markups, and forensic title due diligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id || agent.slug}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm p-6 space-y-5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-border)]"
                  />
                  <div>
                    <h2 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                      {agent.name}
                    </h2>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{agent.agency}</p>
                    <span className="inline-flex items-center space-x-1 mt-1 text-[11px] font-mono text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>RERA: {agent.reraNo}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-3 leading-relaxed">
                  {agent.bio}
                </p>

                <div className="space-y-2 text-xs pt-2 border-t border-[var(--color-border)]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
                      Micro-Markets Covered
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(Array.isArray(agent.areasServed) ? agent.areasServed : []).map((a) => (
                        <span key={a} className="px-2 py-0.5 bg-[var(--color-subtle)] text-[11px] rounded">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
                      Specializations
                    </span>
                    <p className="text-[11px] text-[var(--color-foreground)] font-medium mt-0.5">
                      {(Array.isArray(agent.specializations) ? agent.specializations : []).join(" • ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--color-muted-foreground)]">
                  {agent.activeListingsCount || 10} Active Mandates
                </span>
                <Link
                  to={`/agents/${agent.slug || agent.id}`}
                  className="font-semibold text-xs text-[var(--color-terracotta)] hover:underline inline-flex items-center space-x-1"
                >
                  <span>Advisor Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default AgentsPage;
