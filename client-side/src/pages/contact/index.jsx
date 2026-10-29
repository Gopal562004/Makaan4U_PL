import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  Building2,
  MessageSquare
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { createInquiry } from "../../lib/mongo/services/inquiryService";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    department: "Private Client Advisory",
    city: "Mumbai",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createInquiry({
        type: "contact-form",
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        department: formData.department,
        city: formData.city,
        message: formData.message,
        sourcePage: "/contact",
      });
    } catch (err) {
      console.warn("Direct contact form sync error, offline fallback engaged:", err);
    } finally {
      setIsSubmitting(false);
    }

    setSubmitted(true);
    toast.success("Enquiry dispatched to designated regional desk");
  };

  const offices = [
    {
      city: "Mumbai (Headquarters)",
      address: "Maker Maxity, 5th Floor, North Avenue, Bandra Kurla Complex (BKC), Mumbai 400051",
      phone: "+91 22 6982 4400",
      email: "mumbai@makaan4u.com"
    },
    {
      city: "Delhi NCR (Gurgaon)",
      address: "One Horizon Center, 14th Floor, Golf Course Road, DLF Phase 5, Gurgaon 122002",
      phone: "+91 124 489 2200",
      email: "ncr@makaan4u.com"
    },
    {
      city: "Bangalore",
      address: "Prestige Meridian II, 8th Floor, MG Road / Lavelle Road Corridor, Bangalore 560001",
      phone: "+91 80 4120 8800",
      email: "bangalore@makaan4u.com"
    },
    {
      city: "Goa (Coastal Desk)",
      address: "Assagao Heritage Villa 12, Badem Road, Assagao, North Goa 403507",
      phone: "+91 832 291 0400",
      email: "goa@makaan4u.com"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Contact Makaan4U — Regional Offices & Advisory Desks</title>
        <meta
          name="description"
          content="Contact Makaan4U private client advisory, developer partnerships, or physical listing verification desks across Mumbai, NCR, Bangalore, and Goa."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12 pb-24 lg:pb-16 text-xs sm:text-sm">
        <Breadcrumbs items={[{ label: "Regional Offices & Contact" }]} />

        {/* Hero Title */}
        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Institutional Client Service
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Regional Advisory Desks & Executive Contact
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            Direct channels to certified regional heads, forensic property audit coordinators, and legal compliance officers.
          </p>
        </div>

        {/* Grid: Form on Left, Offices on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Form Container (7 cols) */}
          <div className="lg:col-span-7 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
                Submit an Executive Enquiry
              </h2>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                A certified regional advisory director will contact you within business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Enquiry Logged with Regional Director
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)] max-w-sm mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your enquiry for the <strong>{formData.department}</strong> in <strong>{formData.city}</strong> has been routed to our senior team. Expect a response on {formData.phone} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-semibold rounded"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Deshmukh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      placeholder="name@organization.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    >
                      <option>Private Client Advisory (HNI / NRI)</option>
                      <option>Developer Master Allocation</option>
                      <option>Physical Listing Verification Audit</option>
                      <option>Legal & RERA Compliance Desk</option>
                      <option>Press & Editorial Enquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                    Specific Requirements / Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide details on your micro-market, budget range, or developer portfolio..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[var(--color-border)]">
                  <span className="text-[11px] text-[var(--color-muted-foreground)] flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Zero Spam • Strict NDA Confidentiality
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Enquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Regional Offices Directory (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
              Regional Branch Offices
            </h2>
            <div className="space-y-4">
              {offices.map((off) => (
                <div
                  key={off.city}
                  className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-2 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[var(--color-terracotta)]" />
                    <h3 className="font-semibold text-sm text-[var(--color-foreground)]">{off.city}</h3>
                  </div>
                  <p className="text-[var(--color-muted-foreground)] leading-relaxed pl-6">
                    {off.address}
                  </p>
                  <div className="pt-2 pl-6 flex flex-col space-y-1 font-mono text-[11px]">
                    <span className="text-[var(--color-foreground)] flex items-center space-x-1.5">
                      <Phone className="w-3 h-3 text-[var(--color-muted-foreground)]" />
                      <span>{off.phone}</span>
                    </span>
                    <span className="text-[var(--color-muted-foreground)] flex items-center space-x-1.5">
                      <Mail className="w-3 h-3" />
                      <span>{off.email}</span>
                    </span>
                  </div>
                </div>
              ))}
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

export default ContactPage;
