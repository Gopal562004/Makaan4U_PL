import React, { useState } from "react";
import { X, PhoneCall, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { useShortlist } from "../../contexts/ShortlistContext";
import { createInquiry } from "../../lib/mongo/services/inquiryService";
import { toast } from "react-toastify";

const EnquiryModal = ({ property, isOpen, onClose, mode = "callback" }) => {
  const { addEnquiry } = useShortlist();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    try {
      setIsSubmitting(true);
      await createInquiry({
        type: "callback",
        name: name,
        fullName: name,
        buyerName: name,
        phone: phone,
        buyerPhone: phone,
        message: message || "Requesting full property dossier and priority callback.",
        propertyId: property.id || property._id,
        propertyTitle: property.title,
        propertyLocation: `${property.locality || ""}, ${property.city || ""}`.trim().replace(/^,|,$/g, ""),
        propertyPrice: property.price ? String(property.price) : "",
        propertyImage: property.images?.[0] || property.image || "",
        sourcePage: window.location.pathname,
      });
    } catch (err) {
      console.warn("Direct callback sync error, offline fallback engaged:", err);
    } finally {
      setIsSubmitting(false);
    }

    addEnquiry({
      propertyId: property.id || property._id,
      propertyTitle: property.title,
      location: `${property.locality}, ${property.city}`,
      buyerName: name,
      buyerPhone: phone,
      message: message || "Requesting full property dossier and callback.",
      mode
    });

    setSubmitted(true);
    toast.success("Callback request registered");
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-[var(--color-terracotta)]" />
            <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
              {mode === "callback" ? "Request Priority Callback" : "Send Confidential Enquiry"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 text-xs">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
              Request Dispatched to Senior Advisor
            </h4>
            <div className="p-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-left space-y-1">
              <p className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Response: Within 15 Minutes</span>
              </p>
              <p className="text-[11px] text-[var(--color-muted-foreground)] pt-1">
                Your dedicated advisor for <strong>{property.locality}</strong> ({property.agent?.name || "South Mumbai Desk"}) will call you on <strong>{phone}</strong> with the full architectural brochure and title history.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold rounded-sm"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div className="p-2.5 bg-[var(--color-subtle)] rounded border border-[var(--color-border)]">
              <p className="font-semibold text-[var(--color-foreground)] truncate">{property.title}</p>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">
                {property.locality}, {property.city} • <span className="font-mono font-bold text-[var(--color-terracotta)]">{property.price}</span>
              </p>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98XXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                Specific Queries (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Inquire about floor levels, payment schedule, or parking bays..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[var(--color-border)]">
              <span className="text-[10px] text-[var(--color-muted-foreground)] flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Zero Spam Guarantee
              </span>
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors"
              >
                Request Callback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
