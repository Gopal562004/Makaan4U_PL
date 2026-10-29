import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Fallback initial demo inquiries if database is newly started or offline
const INITIAL_DEMO_INQUIRIES = [
  {
    _id: "inq-101",
    id: "inq-101",
    type: "site-visit",
    name: "Vikramaditya Singhania",
    phone: "+91 98200 87654",
    email: "v.singhania@apexholding.in",
    propertyTitle: "Oberoi Forestville — 4 BHK Forest Vista",
    propertyLocation: "Kolshet Road, Thane West, Mumbai",
    propertyPrice: "₹3.85 Cr",
    propertyImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    date: "2026-11-02",
    timeSlot: "11:00 AM - 12:30 PM",
    visitType: "In-Person Guided Tour",
    status: "Confirmed",
    priority: "High",
    message: "Interested in the high-floor tower B unit with uninterrupted Yeoor Hills deck views. Need technical architect to discuss customized layout.",
    assignedAgent: {
      name: "Sunil Varma",
      phone: "+91 98201 44820",
      email: "sunil.varma@makaan4u.com",
      designation: "Senior Luxury Consultant",
    },
    adminNotes: [
      { text: "QR Pass dispatched via WhatsApp. Buyer pre-qualified through ICICI Wealth Desk.", author: "Admin", createdAt: "2026-10-28T10:30:00Z" },
    ],
    createdAt: "2026-10-28T09:15:00Z",
  },
  {
    _id: "inq-102",
    id: "inq-102",
    type: "site-visit",
    name: "Meera Nair",
    phone: "+91 97401 22345",
    email: "meera.nair@techventures.io",
    propertyTitle: "DLF The Camellias — Ultra Luxury Penthouse",
    propertyLocation: "Golf Course Road, Gurgaon, Delhi NCR",
    propertyPrice: "₹35.00 Cr",
    propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    date: "2026-11-04",
    timeSlot: "03:00 PM - 04:30 PM",
    visitType: "Private Executive Escort",
    status: "Requested",
    priority: "Urgent",
    message: "Relocating from Singapore next month. Seeking fully furnished turnkey residence with DLF Golf Club view.",
    assignedAgent: {
      name: "Rohit Malhotra",
      phone: "+91 98110 33456",
      email: "rohit.m@makaan4u.com",
      designation: "NCR Regional Director",
    },
    adminNotes: [],
    createdAt: "2026-10-27T16:45:00Z",
  },
  {
    _id: "inq-103",
    id: "inq-103",
    type: "callback",
    name: "Dr. Arvind Swaminathan",
    phone: "+91 98450 11998",
    email: "dr.arvind@apollohospitals.org",
    propertyTitle: "Prestige Kingfisher Towers — 4 BHK Imperial Residence",
    propertyLocation: "Lavelle Road, Ashok Nagar, Bangalore",
    propertyPrice: "₹28.50 Cr",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    message: "Requesting full title search report and maintenance fee schedule before signing token.",
    status: "New",
    priority: "High",
    assignedAgent: {
      name: "Pooja Hegde",
      phone: "+91 98800 77123",
      email: "pooja.h@makaan4u.com",
      designation: "Bangalore Prime Advisor",
    },
    adminNotes: [],
    createdAt: "2026-10-28T14:20:00Z",
  },
  {
    _id: "inq-104",
    id: "inq-104",
    type: "callback",
    name: "Rajeshwar Rao",
    phone: "+91 99890 44556",
    email: "r.rao@hyderabadtech.com",
    propertyTitle: "Luxury Penthouse with Private Terrace",
    propertyLocation: "Worli, South Mumbai",
    propertyPrice: "₹3.50 Cr",
    propertyImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80",
    message: "Need callback to discuss home loan eligibility under SBI High Net Worth NRI scheme.",
    status: "Contacted",
    priority: "Medium",
    assignedAgent: {
      name: "Sunil Varma",
      phone: "+91 98201 44820",
      email: "sunil.varma@makaan4u.com",
      designation: "Senior Luxury Consultant",
    },
    adminNotes: [
      { text: "Spoke with client. Arranging discussion with SBI Wealth Branch Manager on Friday.", author: "Sunil Varma", createdAt: "2026-10-28T18:00:00Z" }
    ],
    createdAt: "2026-10-26T11:00:00Z",
  },
  {
    _id: "inq-105",
    id: "inq-105",
    type: "contact-form",
    name: "Anita & Cyrus Godrej",
    phone: "+91 98210 55667",
    email: "anita.godrej@consortium.in",
    department: "Developer Partnerships",
    city: "Mumbai",
    message: "We have a 4.5-acre parcel in Alibaug suitable for gated ultra-luxury wellness villas. Requesting developer onboarding and title audit meeting at BKC office.",
    status: "New",
    priority: "Urgent",
    adminNotes: [],
    createdAt: "2026-10-29T08:30:00Z",
  },
  {
    _id: "inq-106",
    id: "inq-106",
    type: "contact-form",
    name: "Captain Devender Sharma",
    phone: "+91 98100 99887",
    email: "d.sharma@aviationgroup.com",
    department: "Private Client Advisory",
    city: "Goa",
    message: "Looking for a Portuguese heritage villa in North Goa (Assagao/Anjuna) with minimum 12,000 sq.ft plot and clear legal sanad. Budget ₹15-20 Cr.",
    status: "In Progress",
    priority: "High",
    adminNotes: [
      { text: "Shared 2 off-market Assagao listings via encrypted dossier.", author: "Admin", createdAt: "2026-10-29T10:00:00Z" }
    ],
    createdAt: "2026-10-25T12:00:00Z",
  },
];

/**
 * Helper to normalize any incoming inquiry / visit / lead object
 */
export const normalizeInquiryRecord = (raw, fallbackType = "site-visit") => {
  if (!raw) return null;
  const id = raw._id || raw.id || `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const clientName = raw.name || raw.fullName || raw.buyerName || "Private Client";
  const clientPhone = raw.phone || raw.buyerPhone || "";
  const clientEmail = raw.email || raw.buyerEmail || "";
  const visitDate = raw.date || raw.preferredDate || "";
  const visitSlot = raw.timeSlot || raw.preferredTime || "11:00 AM - 12:30 PM";
  const propTitle = raw.propertyTitle || raw.title || "Private Residence";
  const propLoc = raw.propertyLocation || raw.location || "Mumbai";
  const propPrice = raw.propertyPrice || raw.price || "";
  const notesText = raw.message || raw.notes || "";

  return {
    _id: id,
    id: id,
    type: raw.type || fallbackType,
    name: clientName,
    fullName: clientName,
    buyerName: clientName,
    phone: clientPhone,
    buyerPhone: clientPhone,
    email: clientEmail,
    buyerEmail: clientEmail,
    propertyId: raw.propertyId || "",
    propertyTitle: propTitle,
    propertyLocation: propLoc,
    location: propLoc,
    propertyPrice: propPrice,
    propertyImage: raw.propertyImage || raw.image || raw.images?.[0] || "",
    date: visitDate,
    preferredDate: visitDate,
    timeSlot: visitSlot,
    preferredTime: visitSlot,
    visitType: raw.visitType || "In-Person Guided Tour",
    department: raw.department || "Private Client Advisory",
    city: raw.city || (propLoc.includes(",") ? propLoc.split(",").pop().trim() : "Mumbai"),
    message: notesText,
    notes: notesText,
    status: raw.status || (raw.type === "site-visit" || fallbackType === "site-visit" ? "Requested" : "New"),
    priority: raw.priority || "High",
    assignedAgent: raw.assignedAgent || {
      name: raw.agentName || "Senior Property Advisor",
      phone: raw.agentPhone || "+91 98201 44820",
    },
    adminNotes: Array.isArray(raw.adminNotes) ? raw.adminNotes : [],
    createdAt: raw.createdAt || raw.submittedDate || new Date().toISOString(),
  };
};

/**
 * Get all inquiries (visits, callbacks, contact forms)
 * Merges MongoDB backend + localStorage admin inquiries + user site visits + enquiries
 */
export const getAllInquiries = async (params = {}) => {
  let apiInquiries = [];

  try {
    const res = await api.get("/inquiries", { params });
    if (res?.data?.success && Array.isArray(res.data.data)) {
      apiInquiries = res.data.data.map((item) => normalizeInquiryRecord(item, item.type));
    }
  } catch (error) {
    console.warn("ℹ️ /inquiries API endpoint unreachable or non-admin session; reading local stores:", error.message);
  }

  // Gather records from all local storages
  const localMap = new Map();

  // 1. Add API inquiries first
  apiInquiries.forEach((item) => {
    if (item) localMap.set(String(item._id || item.id), item);
  });

  // 2. Read explicit admin inquiries storage
  try {
    const rawAdmin = localStorage.getItem("makaan_admin_inquiries");
    if (rawAdmin) {
      const parsed = JSON.parse(rawAdmin);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          const norm = normalizeInquiryRecord(item, item.type || "site-visit");
          if (norm && !localMap.has(String(norm._id || norm.id))) {
            localMap.set(String(norm._id || norm.id), norm);
          }
        });
      }
    }
  } catch (e) {
    console.warn("Error parsing makaan_admin_inquiries:", e);
  }

  // 3. Read site visits scheduled from website via ShortlistContext
  try {
    const rawVisits = localStorage.getItem("makaan_site_visits");
    if (rawVisits) {
      const parsed = JSON.parse(rawVisits);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          const norm = normalizeInquiryRecord({ ...item, type: "site-visit" }, "site-visit");
          if (norm) {
            const key = String(norm._id || norm.id);
            if (!localMap.has(key)) {
              localMap.set(key, norm);
            }
          }
        });
      }
    }
  } catch (e) {
    console.warn("Error parsing makaan_site_visits:", e);
  }

  // 4. Read callback enquiries from website via ShortlistContext
  try {
    const rawEnq = localStorage.getItem("makaan_enquiries");
    if (rawEnq) {
      const parsed = JSON.parse(rawEnq);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          const norm = normalizeInquiryRecord({ ...item, type: "callback" }, "callback");
          if (norm) {
            const key = String(norm._id || norm.id);
            if (!localMap.has(key)) {
              localMap.set(key, norm);
            }
          }
        });
      }
    }
  } catch (e) {
    console.warn("Error parsing makaan_enquiries:", e);
  }

  // 5. If completely empty, seed with INITIAL_DEMO_INQUIRIES
  if (localMap.size === 0) {
    INITIAL_DEMO_INQUIRIES.forEach((item) => {
      const norm = normalizeInquiryRecord(item, item.type);
      localMap.set(String(norm._id || norm.id), norm);
    });
    localStorage.setItem("makaan_admin_inquiries", JSON.stringify(Array.from(localMap.values())));
  }

  // Convert to sorted array (most recent first)
  const combined = Array.from(localMap.values()).sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return combined;
};

/**
 * Create new inquiry (public or admin manual entry)
 */
export const createInquiry = async (inquiryData) => {
  const normalized = normalizeInquiryRecord(inquiryData, inquiryData.type || "site-visit");
  let serverCreated = null;

  try {
    const res = await api.post("/inquiries", {
      type: normalized.type,
      name: normalized.name,
      phone: normalized.phone,
      email: normalized.email,
      propertyId: normalized.propertyId,
      propertyTitle: normalized.propertyTitle,
      propertyLocation: normalized.propertyLocation,
      propertyPrice: normalized.propertyPrice,
      propertyImage: normalized.propertyImage,
      date: normalized.date,
      timeSlot: normalized.timeSlot,
      visitType: normalized.visitType,
      department: normalized.department,
      city: normalized.city,
      message: normalized.message,
      priority: normalized.priority,
      status: normalized.status,
    });
    if (res?.data?.success && res.data.data) {
      serverCreated = normalizeInquiryRecord(res.data.data, normalized.type);
    }
  } catch (error) {
    console.warn("ℹ️ API inquiry POST offline/unreachable, caching to local stores:", error.message);
  }

  const finalRecord = serverCreated || normalized;

  // Immediately persist to makaan_admin_inquiries
  try {
    const local = localStorage.getItem("makaan_admin_inquiries");
    const currentList = local ? JSON.parse(local) : INITIAL_DEMO_INQUIRIES;
    const filtered = currentList.filter(
      (item) => (item._id || item.id) !== (finalRecord._id || finalRecord.id)
    );
    const updated = [finalRecord, ...filtered];
    localStorage.setItem("makaan_admin_inquiries", JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save to makaan_admin_inquiries:", e);
  }

  // If it's a site-visit, also sync to makaan_site_visits so user account sees it too
  if (finalRecord.type === "site-visit") {
    try {
      const rawVisits = localStorage.getItem("makaan_site_visits");
      const currentVisits = rawVisits ? JSON.parse(rawVisits) : [];
      const updatedVisits = [
        {
          id: finalRecord.id,
          propertyId: finalRecord.propertyId,
          propertyTitle: finalRecord.propertyTitle,
          location: finalRecord.propertyLocation,
          date: finalRecord.date,
          timeSlot: finalRecord.timeSlot,
          visitType: finalRecord.visitType,
          agentName: finalRecord.assignedAgent?.name || "Senior Property Advisor",
          agentPhone: finalRecord.assignedAgent?.phone || "+91 98201 44820",
          buyerName: finalRecord.name,
          buyerPhone: finalRecord.phone,
          buyerEmail: finalRecord.email,
          notes: finalRecord.message,
          status: finalRecord.status,
          createdAt: finalRecord.createdAt,
        },
        ...currentVisits.filter((v) => v.id !== finalRecord.id),
      ];
      localStorage.setItem("makaan_site_visits", JSON.stringify(updatedVisits));
    } catch {}
  }

  // Notify active windows/tabs
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("makaan:inquiry_added", { detail: finalRecord }));
  }

  return finalRecord;
};

/**
 * Update inquiry status, priority, or notes
 */
export const updateInquiry = async (id, updateData) => {
  try {
    const res = await api.put(`/inquiries/${id}`, updateData);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
  } catch (error) {
    console.warn("⚠️ API update inquiry failed, updating local state:", error.message);
  }

  // Update localStorage
  try {
    const local = localStorage.getItem("makaan_admin_inquiries");
    if (local) {
      const list = JSON.parse(local);
      const index = list.findIndex((item) => (item._id || item.id) === id);
      if (index !== -1) {
        const item = list[index];
        if (updateData.status) item.status = updateData.status;
        if (updateData.priority) item.priority = updateData.priority;
        if (updateData.assignedAgent) item.assignedAgent = updateData.assignedAgent;
        if (updateData.newNote) {
          if (!item.adminNotes) item.adminNotes = [];
          item.adminNotes.push({
            text: updateData.newNote,
            author: "Admin",
            createdAt: new Date().toISOString(),
          });
        }
        list[index] = { ...item, ...updateData };
        localStorage.setItem("makaan_admin_inquiries", JSON.stringify(list));
        return list[index];
      }
    }
  } catch {}

  return { success: true, ...updateData };
};

/**
 * Delete inquiry
 */
export const deleteInquiry = async (id) => {
  try {
    await api.delete(`/inquiries/${id}`);
  } catch (error) {
    console.warn("⚠️ API delete inquiry failed, removing from local state:", error.message);
  }

  // Update localStorage
  try {
    const local = localStorage.getItem("makaan_admin_inquiries");
    if (local) {
      const list = JSON.parse(local);
      const filtered = list.filter((item) => (item._id || item.id) !== id);
      localStorage.setItem("makaan_admin_inquiries", JSON.stringify(filtered));
    }
  } catch {}

  return { success: true };
};

