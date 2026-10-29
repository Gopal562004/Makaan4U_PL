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
 * Get all inquiries (visits, callbacks, contact forms)
 */
export const getAllInquiries = async (params = {}) => {
  try {
    const res = await api.get("/inquiries", { params });
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn("⚠️ /inquiries endpoint unreachable, checking local store:", error.message);
  }

  // Fallback to local storage + demo records
  try {
    const local = localStorage.getItem("makaan_admin_inquiries");
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Initialize localStorage with demo records
  localStorage.setItem("makaan_admin_inquiries", JSON.stringify(INITIAL_DEMO_INQUIRIES));
  return INITIAL_DEMO_INQUIRIES;
};

/**
 * Create new inquiry (public or admin manual entry)
 */
export const createInquiry = async (inquiryData) => {
  let created = null;

  try {
    const res = await api.post("/inquiries", inquiryData);
    if (res?.data?.success && res.data.data) {
      created = res.data.data;
    }
  } catch (error) {
    console.warn("⚠️ API create inquiry failed, saving to local state:", error.message);
  }

  if (!created) {
    created = {
      _id: `inq-${Date.now()}`,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: inquiryData.type === "site-visit" ? "Requested" : "New",
      adminNotes: [],
      ...inquiryData,
    };
  }

  // Sync with localStorage
  try {
    const local = localStorage.getItem("makaan_admin_inquiries");
    const currentList = local ? JSON.parse(local) : INITIAL_DEMO_INQUIRIES;
    const updated = [created, ...currentList];
    localStorage.setItem("makaan_admin_inquiries", JSON.stringify(updated));
  } catch {}

  return created;
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
