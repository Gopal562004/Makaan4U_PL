import React, { useState } from "react";
import { X, Calendar, Clock, User, Phone, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useShortlist } from "../../contexts/ShortlistContext";
import { toast } from "react-toastify";

const SiteVisitModal = ({ property, isOpen, onClose }) => {
  const { scheduleVisit } = useShortlist();
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "11:00 AM - 12:30 PM",
    visitType: "In-Person Guided Tour",
    name: "",
    phone: "",
    email: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      toast.error("Please fill in date, full name, and phone number.");
      return;
    }

    scheduleVisit({
      propertyId: property.id || property._id,
      propertyTitle: property.title,
      location: `${property.locality}, ${property.city}`,
      date: formData.date,
      timeSlot: formData.timeSlot,
      visitType: formData.visitType,
      agentName: property.agent?.name || "Senior Property Advisor",
      agentPhone: property.agent?.phone || "+91 98201 44820",
      buyerName: formData.name,
      buyerPhone: formData.phone,
      buyerEmail: formData.email,
      notes: formData.notes
    });

    setSubmitted(true);
    toast.success("Site Visit appointment scheduled!");
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
              Authorized Site Access
            </span>
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--color-foreground)]">
              Schedule Private Property Tour
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Property Brief */}
        <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center space-x-3 text-xs bg-[var(--color-surface)]">
          <img
            src={property.images?.[0] || property.image}
            alt={property.title}
            className="w-12 h-12 object-cover rounded-xs"
          />
          <div className="min-w-0">
            <p className="font-semibold text-[var(--color-foreground)] truncate">{property.title}</p>
            <p className="text-[11px] text-[var(--color-muted-foreground)]">
              {property.locality}, {property.city} • <span className="font-mono font-bold text-[var(--color-terracotta)]">{property.price}</span>
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Appointment Request Confirmed
            </h4>
            <p className="text-xs text-[var(--color-muted-foreground)] max-w-sm mx-auto leading-relaxed">
              Your RERA-registered advisor, <strong>{property.agent?.name || "Senior Property Advisor"}</strong>, has received your slot request for <strong>{formData.date} ({formData.timeSlot})</strong>. A gate security QR pass will be messaged to your phone.
            </p>
            <div className="p-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-left max-w-sm mx-auto space-y-1">
              <p><strong>Visitor:</strong> {formData.name}</p>
              <p><strong>Contact:</strong> {formData.phone}</p>
              <p><strong>Format:</strong> {formData.visitType}</p>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-semibold rounded-sm"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Visit Type Toggle */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
                Tour Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["In-Person Guided Tour", "Live Virtual Walkthrough"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, visitType: type })}
                    className={`py-2 px-3 text-xs font-medium rounded border transition-colors ${
                      formData.visitType === type
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent"
                        : "bg-[var(--color-subtle)] text-[var(--color-foreground)] border-[var(--color-border)] hover:border-[var(--color-muted-foreground)]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Time Window
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                >
                  <option>10:00 AM - 11:30 AM</option>
                  <option>11:30 AM - 01:00 PM</option>
                  <option>02:30 PM - 04:00 PM</option>
                  <option>04:00 PM - 05:30 PM</option>
                  <option>05:30 PM - 07:00 PM (Sunset)</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Malhotra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                    Work Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[var(--color-border)]">
              <span className="text-[10px] text-[var(--color-muted-foreground)] flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Zero Spam • Direct Advisor Connect
              </span>
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SiteVisitModal;
