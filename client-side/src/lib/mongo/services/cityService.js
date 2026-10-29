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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
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
 * Create a new city (Admin)
 */
export const createCity = async (cityData) => {
  const res = await api.post("/cities", cityData);
  return res.data;
};

/**
 * Update an existing city (Admin)
 */
export const updateCity = async (id, cityData) => {
  const res = await api.put(`/cities/${id}`, cityData);
  return res.data;
};

/**
 * Delete a city (Admin)
 */
export const deleteCity = async (id) => {
  const res = await api.delete(`/cities/${id}`);
  return res.data;
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

/**
 * Update or create market trend benchmark for live ticker (Admin)
 */
export const updateMarketTrend = async (city, trendData) => {
  const res = await api.put(`/market-trends/${city}`, trendData);
  return res.data;
};
