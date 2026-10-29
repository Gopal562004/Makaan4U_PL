import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";
import { PROJECTS, DEVELOPERS } from "../../../data/propertyData";

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all dynamic projects with optional filters (category, city, search, etc.)
 */
export const getAllProjects = async (params = {}) => {
  try {
    const res = await api.get("/projects", { params });
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return PROJECTS;
  } catch (error) {
    console.warn("⚠️ API fetch for projects failed, using fallback catalog:", error.message);
    return PROJECTS;
  }
};

/**
 * Fetch single project dossier by slug
 */
export const getProjectBySlug = async (slug) => {
  try {
    const res = await api.get(`/projects/${slug}`);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    const found = PROJECTS.find((p) => p.slug === slug || p.id === slug);
    return found || null;
  } catch (error) {
    console.warn(`⚠️ API fetch for project '${slug}' failed:`, error.message);
    const found = PROJECTS.find((p) => p.slug === slug || p.id === slug);
    return found || null;
  }
};

/**
 * Fetch all institutional developers
 */
export const getAllDevelopers = async () => {
  try {
    const res = await api.get("/developers");
    if (res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return DEVELOPERS;
  } catch (error) {
    console.warn("⚠️ API fetch for developers failed:", error.message);
    return DEVELOPERS;
  }
};

/**
 * Fetch developer by slug
 */
export const getDeveloperBySlug = async (slug) => {
  try {
    const res = await api.get(`/developers/${slug}`);
    if (res?.data?.success && res.data.data) {
      return res.data.data;
    }
    const found = DEVELOPERS.find((d) => d.slug === slug || d.id === slug);
    return found || null;
  } catch (error) {
    console.warn(`⚠️ API fetch for developer '${slug}' failed:`, error.message);
    const found = DEVELOPERS.find((d) => d.slug === slug || d.id === slug);
    return found || null;
  }
};

