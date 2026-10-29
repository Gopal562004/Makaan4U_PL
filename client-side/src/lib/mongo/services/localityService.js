import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";
import { LOCALITIES } from "../../../data/propertyData";

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all dynamic localities with optional city filter
 */
export const getAllLocalities = async (params = {}) => {
  try {
    const res = await api.get("/localities", { params });
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return LOCALITIES;
  } catch (error) {
    console.warn("⚠️ API fetch for localities failed, using cached directory:", error.message);
    return LOCALITIES;
  }
};

/**
 * Fetch single locality intelligence dossier by slug
 */
export const getLocalityBySlug = async (slug) => {
  try {
    const res = await api.get(`/localities/${slug}`);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    const found = LOCALITIES.find((l) => l.slug === slug || l.id === slug);
    return found || null;
  } catch (error) {
    console.warn(`⚠️ API fetch for locality '${slug}' failed:`, error.message);
    const found = LOCALITIES.find((l) => l.slug === slug || l.id === slug);
    return found || null;
  }
};

