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

