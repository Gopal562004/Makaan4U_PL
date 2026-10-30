import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { AGENTS } from "../../data/propertyData";
import { getAgentById } from "../../lib/mongo/services/companyService";
import { getAllProperties } from "../../lib/mongo/services/propertyService";
import { toast } from "react-toastify";

const AgentDetails = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(() => AGENTS.find((a) => a.id === id || a.slug === id) || AGENTS[0]);

  useEffect(() => {
    let isMounted = true;
    getAgentById(id)
      .then((data) => {
        if (isMounted && data) {
          setAgent(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [id]);

  const [agentProperties, setAgentProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoadingProps(true);
    getAllProperties({ limit: 6 })
      .then((res) => {
        if (isMounted) {
          const list = res?.properties || [];
          const matched = list.filter((p) => p.agent?.name?.toLowerCase().includes(agent.name.toLowerCase()));
          setAgentProperties(matched.length > 0 ? matched : list.slice(0, 3));
          setLoadingProps(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAgentProperties([]);
          setLoadingProps(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [agent.name]);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      toast.error("Please enter your name and phone number");
      return;
    }
    setSent(true);
    toast.success(`Message dispatched directly to ${agent.name}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`${agent.name} — Licensed Property Consultant | Makaan4U`}</title>
        <meta name="description" content={agent.bio} />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10 pb-24 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: "Advisors", href: "/agents" },
            { label: agent.name }
          ]}
        />

        {/* Profile Header Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[var(--color-border)]"
              />
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950/20 text-emerald-600 font-semibold rounded flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    <span>RERA ID: {agent.reraNo}</span>
                  </span>
                  <span className="text-[11px] text-[var(--color-muted-foreground)]">•</span>
                  <span className="text-xs font-semibold text-[var(--color-foreground)]">{agent.experience}</span>
                </div>

                <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)]">
                  {agent.name}
                </h1>

                <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">
                  {agent.agency}
                </p>

                <p className="text-xs text-[var(--color-foreground)] font-medium pt-1">
                  Languages: {(Array.isArray(agent.languages) ? agent.languages : ["English", "Hindi"]).join(", ")}
                </p>
              </div>
            </div>

            {/* Quick Stats on Right */}
            <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-4 md:pt-0 md:pl-6 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">Client Rating</span>
                <span className="font-mono text-xl font-bold text-[var(--color-foreground)] flex items-center mt-0.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                  {agent.rating} / 5.0
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">Deals Closed</span>
                <span className="font-mono text-xl font-bold text-[var(--color-foreground)] mt-0.5 block">
                  {agent.totalDealsClosed}+ Marquee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Exclusive Mandates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8 text-xs sm:text-sm">
            <div className="space-y-3">
              <h3 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
                Professional Background & Advisory Mandate
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                {agent.bio}
              </p>
            </div>

            {/* Areas & Specializations */}
            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-4">
              <div>
                <h4 className="font-semibold text-xs text-[var(--color-foreground)] uppercase tracking-wider mb-2">
                  Operating Micro-Markets
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(agent.areasServed) ? agent.areasServed : []).map((area) => (
                    <span key={area} className="px-2.5 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[var(--color-foreground)] uppercase tracking-wider mb-2">
                  Asset Specializations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(agent.specializations) ? agent.specializations : []).map((spec) => (
                    <span key={spec} className="px-2.5 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Exclusive Listings by this Agent */}
            <div className="space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
                Exclusive Active Mandates
              </h3>
              <div className="space-y-4">
                {agentProperties.map((p) => (
                  <PropertyCard key={p.id || p._id} property={p} variant="horizontal" />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 space-y-4 shadow-sm text-xs">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Direct Contact Desk
              </span>
              <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                Consult with {agent.name.split(" ")[0]}
              </h3>

              {sent ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                  <p className="font-semibold">Message Dispatched</p>
                  <p className="text-[11px]">{agent.name} will reach you on {contactPhone} shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Consultation Note
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Specify your micro-market, budget, or target property..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors"
                  >
                    Send Confidential Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default AgentDetails;
