import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";
import { CITIES, MARKET_TRENDS_DATA } from "../../../data/propertyData";

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all dynamic cities with real-time property counts from MongoDB
 */
export const getAllCities = async () => {
  try {
    const res = await api.get("/cities");
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return CITIES;
  } catch (error) {
    console.warn("⚠️ API fetch for cities failed, using cached catalog:", error.message);
    return CITIES;
  }
};

/**
 * Fetch single city dossier by slug
 */
export const getCityBySlug = async (slug) => {
  try {
    const res = await api.get(`/cities/${slug}`);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    const found = CITIES.find((c) => c.id === slug || c.slug === slug);
    return found || null;
  } catch (error) {
    console.warn(`⚠️ API fetch for city '${slug}' failed:`, error.message);
    const found = CITIES.find((c) => c.id === slug || c.slug === slug);
    return found || null;
  }
};

/**
 * Fetch dynamic real-time market benchmark trends for live ticker marquee
 */
export const getMarketTrends = async () => {
  try {
    const res = await api.get("/market-trends");
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return MARKET_TRENDS_DATA;
  } catch (error) {
    console.warn("⚠️ API fetch for market trends failed, using benchmark data:", error.message);
    return MARKET_TRENDS_DATA;
  }
};

