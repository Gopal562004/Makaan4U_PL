import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";
import { AGENTS, DEVELOPERS } from "../../../data/propertyData";

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

// Fallback regional offices
export const FALLBACK_OFFICES = [
  {
    id: "off-1",
    city: "Mumbai (Headquarters)",
    address: "Maker Maxity, 5th Floor, North Avenue, Bandra Kurla Complex (BKC), Mumbai 400051",
    phone: "+91 22 6982 4400",
    email: "mumbai@makaan4u.com",
    order: 1,
  },
  {
    id: "off-2",
    city: "Delhi NCR (Gurgaon)",
    address: "One Horizon Center, 14th Floor, Golf Course Road, DLF Phase 5, Gurgaon 122002",
    phone: "+91 124 489 2200",
    email: "ncr@makaan4u.com",
    order: 2,
  },
  {
    id: "off-3",
    city: "Bangalore",
    address: "Prestige Meridian II, 8th Floor, MG Road / Lavelle Road Corridor, Bangalore 560001",
    phone: "+91 80 4120 8800",
    email: "bangalore@makaan4u.com",
    order: 3,
  },
  {
    id: "off-4",
    city: "Goa (Coastal Desk)",
    address: "Assagao Heritage Villa 12, Badem Road, Assagao, North Goa 403507",
    phone: "+91 832 291 0400",
    email: "goa@makaan4u.com",
    order: 4,
  },
];

// Fallback About narrative
export const FALLBACK_COMPANY_SETTINGS = {
  key: "about_page",
  convictionTagline: "Our Founding Conviction",
  convictionTitle: "Indian real estate was broken by speculative, phantom listings.",
  convictionSubtitle: "We rebuilt the marketplace around forensic proof.",
  convictionDescription:
    "For decades, buying property in Mumbai, Bangalore, or Gurgaon meant navigating unverified portal bait, duplicate broker listings, and speculative price inflation. Makaan4U was established by real estate valuers, legal counsels, and product designers with a single standard: zero unverified inventory.",
  pillars: [
    {
      number: "01",
      category: "REGULATORY AUDIT",
      title: "State RERA Title Reconciliation",
      description:
        "Before any residential development is approved on Makaan4U, our legal team verifies the promoter's active MahaRERA, KarRERA, or HRERA quarterly compliance reports, confirming that 70% of buyer collections remain ring-fenced within designated escrow accounts.",
    },
    {
      number: "02",
      category: "PHYSICAL AUDIT",
      title: "On-Site Measurement & Acoustic Verification",
      description:
        "We physically deploy certified property inspectors to measure usable carpet area in compliance with the statutory RERA definition. We verify floor orientation, cross-ventilation, daylight penetration, and building maintenance fund reserves.",
    },
    {
      number: "03",
      category: "VALUATION SCRUTINY",
      title: "Registered Registry Price Calibration",
      description:
        "Our guide valuations reflect genuine sub-registrar stamp duty transaction data, not speculative asking prices inflated by multi-tier broker chains.",
    },
  ],
  footprint: [
    { city: "Mumbai & MMR", localities: "BKC, Worli, Bandra, Thane" },
    { city: "Delhi NCR", localities: "Golf Course Rd, DLF 5, South Delhi" },
    { city: "Bangalore", localities: "Indiranagar, Lavelle Rd, Whitefield" },
    { city: "Pune", localities: "Koregaon Park, Baner, Kalyani Nagar" },
    { city: "Hyderabad", localities: "Jubilee Hills, Kokapet, Gachibowli" },
    { city: "Goa", localities: "Assagao, Siolim, Candolim" },
  ],
  leadershipDeskTitle: "Connect with our Leadership Desk",
  leadershipDeskSubtitle: "For institutional mandates, family office representation, or developer onboarding.",
};

// ============================================================================
// AGENTS API SERVICES
// ============================================================================

export const getAllAgents = async () => {
  try {
    const res = await api.get("/agents");
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return AGENTS;
  } catch (err) {
    console.warn("⚠️ API fetch for agents failed, using fallback:", err.message);
    return AGENTS;
  }
};

export const getAgentById = async (id) => {
  try {
    const res = await api.get(`/agents/${id}`);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    return AGENTS.find((a) => a.id === id || a.slug === id) || null;
  } catch (err) {
    console.warn(`⚠️ API fetch for agent '${id}' failed:`, err.message);
    return AGENTS.find((a) => a.id === id || a.slug === id) || null;
  }
};

export const createAgent = async (agentData) => {
  const res = await api.post("/agents", agentData);
  return res.data;
};

export const updateAgent = async (id, agentData) => {
  const res = await api.put(`/agents/${id}`, agentData);
  return res.data;
};

export const deleteAgent = async (id) => {
  const res = await api.delete(`/agents/${id}`);
  return res.data;
};

// ============================================================================
// DEVELOPERS API SERVICES
// ============================================================================

export const getAllDevelopers = async () => {
  try {
    const res = await api.get("/developers");
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return DEVELOPERS;
  } catch (err) {
    console.warn("⚠️ API fetch for developers failed, using fallback:", err.message);
    return DEVELOPERS;
  }
};

export const getDeveloperBySlug = async (slug) => {
  try {
    const res = await api.get(`/developers/${slug}`);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    return DEVELOPERS.find((d) => d.slug === slug || d.id === slug) || null;
  } catch (err) {
    console.warn(`⚠️ API fetch for developer '${slug}' failed:`, err.message);
    return DEVELOPERS.find((d) => d.slug === slug || d.id === slug) || null;
  }
};

export const createDeveloper = async (devData) => {
  const res = await api.post("/developers", devData);
  return res.data;
};

export const updateDeveloper = async (slug, devData) => {
  const res = await api.put(`/developers/${slug}`, devData);
  return res.data;
};

export const deleteDeveloper = async (slug) => {
  const res = await api.delete(`/developers/${slug}`);
  return res.data;
};

// ============================================================================
// REGIONAL OFFICES API SERVICES
// ============================================================================

export const getAllOffices = async () => {
  try {
    const res = await api.get("/regional-offices");
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return FALLBACK_OFFICES;
  } catch (err) {
    console.warn("⚠️ API fetch for regional offices failed, using fallback:", err.message);
    return FALLBACK_OFFICES;
  }
};

export const createOffice = async (officeData) => {
  const res = await api.post("/regional-offices", officeData);
  return res.data;
};

export const updateOffice = async (id, officeData) => {
  const res = await api.put(`/regional-offices/${id}`, officeData);
  return res.data;
};

export const deleteOffice = async (id) => {
  const res = await api.delete(`/regional-offices/${id}`);
  return res.data;
};

// ============================================================================
// COMPANY & TRUST SETTINGS (ABOUT PAGE)
// ============================================================================

export const getCompanySettings = async () => {
  try {
    const res = await api.get("/company-settings");
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    return FALLBACK_COMPANY_SETTINGS;
  } catch (err) {
    console.warn("⚠️ API fetch for company settings failed, using fallback:", err.message);
    return FALLBACK_COMPANY_SETTINGS;
  }
};

export const updateCompanySettings = async (settingsData) => {
  const res = await api.put("/company-settings", settingsData);
  return res.data;
};

