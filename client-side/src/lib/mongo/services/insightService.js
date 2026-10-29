import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";
import { INSIGHTS_ARTICLES } from "../../../data/propertyData";

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

/**
 * Fetch all dynamic insights articles with optional category/search filters
 */
export const getAllInsights = async (params = {}) => {
  try {
    const res = await api.get("/insights", { params });
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return INSIGHTS_ARTICLES;
  } catch (error) {
    console.warn("⚠️ API fetch for insights failed, using cached publication:", error.message);
    return INSIGHTS_ARTICLES;
  }
};

/**
 * Fetch single insight article by slug
 */
export const getInsightBySlug = async (slug) => {
  try {
    const res = await api.get(`/insights/${slug}`);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    const found = INSIGHTS_ARTICLES.find((a) => a.slug === slug || a.id === slug);
    return found || null;
  } catch (error) {
    console.warn(`⚠️ API fetch for insight '${slug}' failed:`, error.message);
    const found = INSIGHTS_ARTICLES.find((a) => a.slug === slug || a.id === slug);
    return found || null;
  }
};

/**
 * Create a new insight publication article (Admin)
 */
export const createInsight = async (insightData) => {
  const res = await api.post("/insights", insightData);
  return res.data;
};

/**
 * Update an existing insight article (Admin)
 */
export const updateInsight = async (id, insightData) => {
  const res = await api.put(`/insights/${id}`, insightData);
  return res.data;
};

/**
 * Delete an insight article (Admin)
 */
export const deleteInsight = async (id) => {
  const res = await api.delete(`/insights/${id}`);
  return res.data;
};
