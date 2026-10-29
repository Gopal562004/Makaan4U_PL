import React, { useState, useEffect } from "react";
import {
  Calendar,
  PhoneCall,
  Mail,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Send,
  Trash2,
  ShieldCheck,
  Building,
  TrendingUp,
  X,
  Phone,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
} from "../../../lib/mongo/services/inquiryService";

const InquiriesDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "site-visit" | "callback" | "contact-form"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Manage / Detail Modal state
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusInput, setStatusInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Manual Creation Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: "site-visit",
    name: "",
    phone: "",
    email: "",
    propertyTitle: "",
    propertyLocation: "Mumbai",
    propertyPrice: "",
    date: "",
    timeSlot: "11:00 AM - 12:30 PM",
    visitType: "In-Person Guided Tour",
    department: "Private Client Advisory",
    city: "Mumbai",
    message: "",
    priority: "Medium",
  });
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleAdded = () => fetchData();
    const handleStorage = (e) => {
      if (
        !e ||
        !e.key ||
        e.key.includes("inquir") ||
        e.key.includes("visit")
      ) {
        fetchData();
      }
    };

    window.addEventListener("makaan:inquiry_added", handleAdded);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("makaan:inquiry_added", handleAdded);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Filtered List
  const filteredInquiries = inquiries.filter((inq) => {
    if (activeTab !== "all" && inq.type !== activeTab) return false;
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    if (priorityFilter !== "all" && inq.priority !== priorityFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (inq.name || inq.fullName || inq.buyerName)?.toLowerCase().includes(q);
      const matchPhone = (inq.phone || inq.buyerPhone)?.toLowerCase().includes(q);
      const matchEmail = (inq.email || inq.buyerEmail)?.toLowerCase().includes(q);
      const matchProp = (inq.propertyTitle || inq.location)?.toLowerCase().includes(q);
      const matchCity = inq.city?.toLowerCase().includes(q);
      const matchMsg = (inq.message || inq.notes)?.toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail || matchProp || matchCity || matchMsg;
    }
    return true;
  });

  // KPI Calculations
  const siteVisitsCount = inquiries.filter((i) => i.type === "site-visit").length;
  const pendingVisitsCount = inquiries.filter(
    (i) => i.type === "site-visit" && (i.status === "Requested" || i.status === "Pending")
  ).length;

  const callbacksCount = inquiries.filter((i) => i.type === "callback").length;
  const newCallbacksCount = inquiries.filter(
    (i) => i.type === "callback" && (i.status === "New" || i.status === "Pending")
  ).length;

  const contactFormsCount = inquiries.filter((i) => i.type === "contact-form").length;
  const newContactCount = inquiries.filter(
    (i) => i.type === "contact-form" && (i.status === "New" || i.status === "In Progress")
  ).length;

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
      case "Completed":
      case "Resolved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      case "Requested":
      case "New":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      case "Contacted":
      case "In Progress":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-600 border-rose-500/30";
      default:
        return "bg-stone-500/10 text-stone-600 border-stone-500/30";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-600 text-white font-bold";
      case "High":
        return "bg-amber-600 text-white font-semibold";
      case "Medium":
        return "bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200";
      default:
        return "bg-stone-100 dark:bg-stone-900 text-stone-500";
    }
  };

  // Actions
  const handleOpenDetail = (inq) => {
    setSelectedInquiry(inq);
    setStatusInput(inq.status || "New");
    setPriorityInput(inq.priority || "Medium");
    setNoteInput("");
    setModalOpen(true);
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setIsUpdating(true);

    try {
      const updated = await updateInquiry(selectedInquiry._id || selectedInquiry.id, {
        status: statusInput,
        priority: priorityInput,
        newNote: noteInput,
      });

      // Update in state
      setInquiries((prev) =>
        prev.map((item) =>
          (item._id || item.id) === (selectedInquiry._id || selectedInquiry.id)
            ? {
                ...item,
                status: statusInput,
                priority: priorityInput,
                adminNotes: noteInput
                  ? [
                      ...(item.adminNotes || []),
                      {
                        text: noteInput,
                        author: "Admin",
                        createdAt: new Date().toISOString(),
                      },
                    ]
                  : item.adminNotes,
              }
            : item
        )
      );

      toast.success("Inquiry record updated successfully!");
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to update inquiry");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this client request?")) return;

    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => (item._id || item.id) !== id));
      toast.success("Inquiry deleted");
      if (selectedInquiry && (selectedInquiry._id || selectedInquiry.id) === id) {
        setModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.phone) {
      toast.error("Name and phone number are required");
      return;
    }

    setIsCreating(true);
    try {
      const created = await createInquiry(createForm);
      setInquiries((prev) => [created, ...prev]);
      toast.success("New client request logged into system!");
      setCreateModalOpen(false);
      setCreateForm({
        type: "site-visit",
        name: "",
        phone: "",
        email: "",
        propertyTitle: "",
        propertyLocation: "Mumbai",
        propertyPrice: "",
        date: "",
        timeSlot: "11:00 AM - 12:30 PM",
        visitType: "In-Person Guided Tour",
        department: "Private Client Advisory",
        city: "Mumbai",
        message: "",
        priority: "Medium",
      });
    } catch (error) {
      toast.error("Failed to create request");
    } finally {
      setIsCreating(false);
    }
  };

  // WhatsApp Generator
  const generateWhatsAppLink = (inquiry) => {
    const cleanPhone = inquiry.phone?.replace(/[^0-9]/g, "") || "";
    let message = `Hello ${inquiry.name}, this is Makaan4U Private Client Advisory.`;

    if (inquiry.type === "site-visit") {
      message += ` Regarding your scheduled site visit appointment for *${inquiry.propertyTitle || "the property"}* on *${inquiry.date || "your requested date"}* at *${inquiry.timeSlot}*, we have prepared your digital QR gate pass.`;
    } else if (inquiry.type === "callback") {
      message += ` Regarding your priority callback request for *${inquiry.propertyTitle || "property inquiry"}*, our regional property specialist is available now to speak with you.`;
    } else {
      message += ` Thank you for contacting our ${inquiry.department || "Advisory"} desk regarding ${inquiry.city || "your query"}.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--color-border)] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold bg-[var(--color-terracotta-subtle)] text-[var(--color-terracotta)]">
              Lead Intelligence & Dispatch Desk
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)]">•</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
              Live CRM Gateway
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
            Visits, Callbacks & Client Requests
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">
            Manage scheduled physical property tours, confidential callbacks, and regional office inquiries.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded text-xs text-[var(--color-foreground)] flex items-center space-x-1.5 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync Live</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-3.5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Visit / Lead</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              Scheduled Site Visits
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
            {siteVisitsCount}
          </div>
          <p className="text-[11px] text-[var(--color-muted-foreground)]">
            <strong className="text-amber-600 font-semibold">{pendingVisitsCount}</strong> pending confirmation
          </p>
        </div>

        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              Priority Callbacks
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
            {callbacksCount}
          </div>
          <p className="text-[11px] text-[var(--color-muted-foreground)]">
            <strong className="text-blue-600 font-semibold">{newCallbacksCount}</strong> awaiting first response
          </p>
        </div>

        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              Support & Regional Forms
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
            {contactFormsCount}
          </div>
          <p className="text-[11px] text-[var(--color-muted-foreground)]">
            <strong className="text-emerald-600 font-semibold">{newContactCount}</strong> active desk tickets
          </p>
        </div>

        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              Advisory Dispatch SLA
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
            18 Mins
          </div>
          <p className="text-[11px] text-[var(--color-muted-foreground)]">
            Avg advisor response velocity
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-[var(--color-border)] flex items-center space-x-2 sm:space-x-6 overflow-x-auto text-xs font-semibold pb-1 scrollbar-none">
        {[
          { id: "all", label: `All Interactions (${inquiries.length})`, icon: MessageSquare },
          { id: "site-visit", label: `Site Visits (${siteVisitsCount})`, icon: Calendar },
          { id: "callback", label: `Callback Requests (${callbacksCount})`, icon: PhoneCall },
          { id: "contact-form", label: `Contact & Support (${contactFormsCount})`, icon: Mail },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 transition-colors whitespace-nowrap flex items-center space-x-1.5 border-b-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-[var(--color-terracotta)] text-[var(--color-foreground)]"
                  : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-sm">
        <div className="sm:col-span-6 relative">
          <Search className="w-3.5 h-3.5 text-[var(--color-muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by buyer name, phone, email, property title, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
          />
        </div>

        <div className="sm:col-span-3 flex items-center space-x-2">
          <label className="text-[11px] font-mono uppercase text-[var(--color-muted-foreground)] whitespace-nowrap">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Requested">Requested</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Resolved">Resolved</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center space-x-2">
          <label className="text-[11px] font-mono uppercase text-[var(--color-muted-foreground)] whitespace-nowrap">
            Priority:
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-2 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Records List / Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--color-muted-foreground)]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--color-terracotta)]" />
          Loading client requests from live database...
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-3">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
          <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
            No inquiries match your criteria
          </h3>
          <p className="text-xs text-[var(--color-muted-foreground)] max-w-sm mx-auto">
            Try resetting your search query or status filter, or log a new walk-in client request using the button above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inq) => {
            const id = inq._id || inq.id;
            return (
              <div
                key={id}
                onClick={() => handleOpenDetail(inq)}
                className="p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-muted-foreground)] transition-all rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer group shadow-2xs"
              >
                {/* Left Section: Client & Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Inquiry Type Pill */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        inq.type === "site-visit"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                          : inq.type === "callback"
                          ? "bg-blue-500/10 text-blue-600 border border-blue-500/30"
                          : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      }`}
                    >
                      {inq.type === "site-visit"
                        ? "Site Visit Appointment"
                        : inq.type === "callback"
                        ? "Callback Request"
                        : "Regional Contact Form"}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                        inq.status
                      )}`}
                    >
                      {inq.status}
                    </span>

                    {/* Priority Tag */}
                    {inq.priority && inq.priority !== "Medium" && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono ${getPriorityBadge(
                          inq.priority
                        )}`}
                      >
                        {inq.priority}
                      </span>
                    )}

                    <span className="text-[11px] text-[var(--color-muted-foreground)] font-mono">
                      Logged {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Client Name & Heading */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors">
                      {inq.name || inq.fullName || inq.buyerName || "Private Client"}
                    </h3>
                    <div className="text-xs text-[var(--color-muted-foreground)] flex items-center space-x-2">
                      <span>{inq.phone || inq.buyerPhone}</span>
                      {(inq.email || inq.buyerEmail) && (
                        <>
                          <span>•</span>
                          <span>{inq.email || inq.buyerEmail}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Specific content based on type */}
                  {inq.type === "site-visit" && (
                    <div className="text-xs bg-[var(--color-subtle)] p-2.5 rounded border border-[var(--color-border)] flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-semibold text-[var(--color-foreground)] flex items-center">
                        <Building className="w-3 h-3 mr-1 text-[var(--color-terracotta)]" />
                        {inq.propertyTitle || "Property Tour"}
                      </span>
                      <span className="text-[var(--color-muted-foreground)]">
                        Date: <strong className="text-[var(--color-foreground)]">{inq.date || inq.preferredDate || "Upcoming"}</strong> at <strong className="text-[var(--color-foreground)]">{inq.timeSlot || inq.preferredTime || "11:00 AM"}</strong>
                      </span>
                      <span className="text-[var(--color-muted-foreground)] font-mono text-[11px]">
                        {inq.visitType || "In-Person Tour"}
                      </span>
                    </div>
                  )}

                  {inq.type === "callback" && inq.propertyTitle && (
                    <div className="text-xs text-[var(--color-muted-foreground)] flex items-center">
                      <Building className="w-3 h-3 mr-1 text-[var(--color-terracotta)]" />
                      Interested in: <strong className="text-[var(--color-foreground)] ml-1">{inq.propertyTitle}</strong>
                      {inq.propertyPrice && <span className="ml-2 font-mono">({inq.propertyPrice})</span>}
                    </div>
                  )}

                  {inq.type === "contact-form" && (
                    <div className="text-xs text-[var(--color-muted-foreground)] flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[11px]">
                        Dept: {inq.department}
                      </span>
                      <span className="px-2 py-0.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[11px]">
                        City: {inq.city}
                      </span>
                    </div>
                  )}

                  {/* Customer Message / Notes preview */}
                  {inq.message && (
                    <p className="text-xs text-[var(--color-foreground)] italic line-clamp-1 bg-[var(--color-canvas)] px-2 py-1 rounded border border-[var(--color-border)]">
                      "{inq.message}"
                    </p>
                  )}

                  {/* Admin notes badge if any */}
                  {inq.adminNotes && inq.adminNotes.length > 0 && (
                    <div className="text-[11px] text-emerald-600 flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{inq.adminNotes.length} internal remarks logged</span>
                    </div>
                  )}
                </div>

                {/* Right Section: Quick Action Buttons */}
                <div className="flex items-center space-x-2 sm:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--color-border)]">
                  {/* WhatsApp Quick Link */}
                  <a
                    href={generateWhatsAppLink(inq)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1 transition-colors"
                    title="Open WhatsApp chat with pre-written message"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>

                  {/* Phone Quick Call */}
                  <a
                    href={`tel:${inq.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-[var(--color-subtle)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] rounded border border-[var(--color-border)] text-xs font-semibold flex items-center space-x-1 transition-colors"
                    title="Direct Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call</span>
                  </a>

                  {/* Email Button */}
                  {inq.email && (
                    <a
                      href={`mailto:${inq.email}?subject=Regarding your Makaan4U property inquiry`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-[var(--color-subtle)] hover:bg-[var(--color-border)] text-[var(--color-foreground)] rounded border border-[var(--color-border)] text-xs transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Open Details Button */}
                  <button
                    onClick={() => handleOpenDetail(inq)}
                    className="px-3 py-1.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>Manage</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(id, e)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          MODAL 1: VIEW & MANAGE INQUIRY / UPDATE STATUS & NOTES
      ==================================================================== */}
      {modalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-subtle)]">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                  Client Request Dossier
                </span>
                <h2 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  {selectedInquiry.name || selectedInquiry.fullName || selectedInquiry.buyerName || "Private Client"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleUpdateInquiry} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Client Brief */}
              <div className="p-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase block">
                    Phone Number
                  </span>
                  <a href={`tel:${selectedInquiry.phone || selectedInquiry.buyerPhone}`} className="font-semibold text-emerald-600 hover:underline">
                    {selectedInquiry.phone || selectedInquiry.buyerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase block">
                    Email Address
                  </span>
                  <span className="font-medium text-[var(--color-foreground)]">
                    {selectedInquiry.email || selectedInquiry.buyerEmail || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase block">
                    Inquiry Type
                  </span>
                  <span className="font-semibold text-[var(--color-foreground)] uppercase">
                    {selectedInquiry.type}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--color-muted-foreground)] uppercase block">
                    Assigned Region
                  </span>
                  <span className="font-medium text-[var(--color-foreground)]">
                    {selectedInquiry.city || "Mumbai"}
                  </span>
                </div>
              </div>

              {/* Property Details if applicable */}
              {(selectedInquiry.propertyTitle || selectedInquiry.location) && (
                <div className="p-3 border border-[var(--color-border)] rounded bg-[var(--color-surface)] space-y-1">
                  <span className="text-[10px] text-[var(--color-terracotta)] uppercase font-semibold block">
                    Referenced Property
                  </span>
                  <h4 className="font-semibold text-sm text-[var(--color-foreground)]">
                    {selectedInquiry.propertyTitle || "Private Residence Tour"}
                  </h4>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">
                    {selectedInquiry.propertyLocation || selectedInquiry.location} {selectedInquiry.propertyPrice && `• ${selectedInquiry.propertyPrice}`}
                  </p>
                </div>
              )}

              {/* Site Visit Specifics */}
              {selectedInquiry.type === "site-visit" && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded space-y-1">
                  <span className="text-[10px] text-amber-600 uppercase font-bold block">
                    Site Visit Appointment Schedule
                  </span>
                  <p className="font-semibold text-xs text-[var(--color-foreground)]">
                    Date: {selectedInquiry.date || selectedInquiry.preferredDate || "Upcoming"} | Time Slot: {selectedInquiry.timeSlot || selectedInquiry.preferredTime || "11:00 AM"}
                  </p>
                  <p className="text-[11px] text-[var(--color-muted-foreground)]">
                    Format: {selectedInquiry.visitType || "In-Person Guided Tour"}
                  </p>
                </div>
              )}

              {/* Customer's Original Message */}
              {selectedInquiry.message && (
                <div>
                  <label className="text-[10px] uppercase font-mono text-[var(--color-muted-foreground)] block mb-1">
                    Customer Note / Special Requirements
                  </label>
                  <div className="p-3 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] leading-relaxed italic">
                    "{selectedInquiry.message}"
                  </div>
                </div>
              )}

              {/* Edit Status & Priority Controls */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Update Workflow Status
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                  >
                    <option value="New">New</option>
                    <option value="Requested">Requested</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Priority Rating
                  </label>
                  <select
                    value={priorityInput}
                    onChange={(e) => setPriorityInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Internal Remarks / New Note */}
              <div>
                <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                  Add Internal Advisor Remark / Audit Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Called customer, confirmed visit timing, gate pass QR SMS sent..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                />
              </div>

              {/* Audit Trail of Previous Notes */}
              {selectedInquiry.adminNotes && selectedInquiry.adminNotes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono text-[var(--color-muted-foreground)] block">
                    Internal Remark History ({selectedInquiry.adminNotes.length})
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {selectedInquiry.adminNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-[11px] flex justify-between"
                      >
                        <span className="text-[var(--color-foreground)]">{note.text}</span>
                        <span className="text-[10px] text-[var(--color-muted-foreground)] ml-2 whitespace-nowrap font-mono">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Actions in Modal */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={generateWhatsAppLink(selectedInquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Gate Pass</span>
                </a>

                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="px-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] text-[var(--color-foreground)] rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Buyer Now</span>
                </a>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[var(--color-border)] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[var(--color-border)] rounded text-xs hover:bg-[var(--color-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isUpdating ? "Saving..." : "Save Record Updates"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: LOG NEW VISIT / MANUAL LEAD ENTRY
      ==================================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-subtle)]">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                  Manual CRM Entry
                </span>
                <h2 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Log Site Visit or Client Lead
                </h2>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Entry Type *
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                  >
                    <option value="site-visit">Site Visit Appointment</option>
                    <option value="callback">Priority Callback Request</option>
                    <option value="contact-form">Regional Support / Contact</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Priority
                  </label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kothari"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Property of Interest
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oberoi Forestville 3BHK"
                    value={createForm.propertyTitle}
                    onChange={(e) => setCreateForm({ ...createForm, propertyTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                    Target City
                  </label>
                  <select
                    value={createForm.city}
                    onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Goa">Goa</option>
                  </select>
                </div>
              </div>

              {/* Site visit specifics */}
              {createForm.type === "site-visit" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded">
                  <div>
                    <label className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 block mb-1 uppercase">
                      Visit Date
                    </label>
                    <input
                      type="date"
                      value={createForm.date}
                      onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                      className="w-full px-2 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 block mb-1 uppercase">
                      Time Slot
                    </label>
                    <select
                      value={createForm.timeSlot}
                      onChange={(e) => setCreateForm({ ...createForm, timeSlot: e.target.value })}
                      className="w-full px-2 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs"
                    >
                      <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM</option>
                      <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
                      <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                      <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-[var(--color-foreground)] block mb-1">
                  Customer Notes & Specific Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Budget ₹4 Cr, needs sea view high rise, ready to move only..."
                  value={createForm.message}
                  onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                />
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-[var(--color-border)] rounded text-xs hover:bg-[var(--color-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreating ? "Logging..." : "Create CRM Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesDashboard;

