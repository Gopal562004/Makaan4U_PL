/**
 * ============================================================
 * 🧠 Admin Dashboard Services
 * ------------------------------------------------------------
 * Centralized service layer for all Admin API calls.
 * Handles Dashboard metrics, Users, Reports, Trends, and more.
 * ============================================================
 */

import axios from "axios";
import { getApiUrl } from "utils/getApiUrl";
// ✅ Create a reusable Axios instance
const API = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true, // Required for cookie/session authentication
});

// ✅ Automatically attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Gracefully handle 401 Unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

/* ============================================================
   📊 DASHBOARD OVERVIEW (Main Summary Stats)
============================================================ */
export const fetchDashboardStats = async () => {
  const { data } = await API.get("/admin/dashboard");
  return data;
};

/* ============================================================
   👥 USER MANAGEMENT (List / Update)
============================================================ */
export const fetchAllUsers = async (params = {}) => {
  const { data } = await API.get("/admin/users", { params });
  return data;
};

export const updateUserStatus = async (id, updateData) => {
  const { data } = await API.put(`/admin/users/${id}`, updateData);
  return data;
};

/* ============================================================
   🏠 PROPERTY MANAGEMENT (Admin)
============================================================ */
export const fetchAllProperties = async () => {
  const { data } = await API.get("/admin/properties");
  return data;
};

export const updatePropertyAdminStatus = async (id, updateData) => {
  const { data } = await API.put(`/admin/properties/${id}`, updateData);
  return data;
};

/* ============================================================
   🧾 EXPORT DASHBOARD DATA (PDF / CSV / EXCEL)
============================================================ */
export const exportDashboardData = async (exportConfig) => {
  const response = await API.post("/admin/export", exportConfig, {
    responseType: "blob", // ensures correct file handling
  });

  // 🧠 If backend returns a list of file names
  const disposition = response.headers["content-disposition"];
  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });

  // Try to extract filename from response header
  let fileName = "dashboard_export";
  if (disposition && disposition.includes("filename=")) {
    fileName = disposition.split("filename=")[1].replace(/['"]/g, "");
  }

  // ✅ Trigger download automatically in browser
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return { success: true, fileName };
};

/* ============================================================
   📈 SALES TREND (Monthly Revenue, Property Sales)
============================================================ */
export const fetchSalesTrend = async () => {
  const { data } = await API.get("/admin/sales-trend");
  return data;
};

/* ============================================================
   🏠 PROPERTY STATUS OVERVIEW (Sold / Active / Rented / etc.)
============================================================ */
export const fetchPropertyStatusOverview = async () => {
  const { data } = await API.get("/admin/property-status");
  return data;
};

/* ============================================================
   ⚡ RECENT ACTIVITY (Properties / Appointments / Leads)
============================================================ */
export const fetchRecentActivity = async () => {
  const { data } = await API.get("/admin/recent-activity");
  return data;
};

/* ============================================================
   📅 DATE RANGE ANALYTICS (Filter Stats by Date)
============================================================ */
export const fetchDataByDateRange = async (startDate, endDate) => {
  const { data } = await API.get("/admin/date-range", {
    params: { startDate, endDate },
  });
  return data;
};

/* ============================================================
   ⚙️ QUICK ACTIONS SUMMARY (Shortcuts / KPIs)
============================================================ */
export const fetchQuickActionsSummary = async () => {
  const { data } = await API.get("/admin/quick-actions");
  return data;
};

/* ============================================================
   🧩 DEFAULT EXPORT (Grouped Service Object)
============================================================ */

export const getReportsSummary = async () => {
  const { data } = await API.get("/reports/summary");
  return data;
};

export const exportReportsData = async (config) => {
  // Step 1: Request export creation
  const { data } = await API.post("/reports/export", config);

  // Step 2: Download ZIP if backend created it
  if (data?.files?.length) {
    const filename = data.files[0];
    const response = await API.get(`/reports/download/${filename}`, {
      responseType: "blob",
    });

    // Step 3: Trigger browser download
    const blob = new Blob([response.data], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return data;
};

const adminDashboardServices = {
  // Dashboard Core
  fetchDashboardStats,
  fetchSalesTrend,
  fetchPropertyStatusOverview,
  fetchRecentActivity,
  fetchDataByDateRange,
  fetchQuickActionsSummary,

  // User Management
  fetchAllUsers,
  updateUserStatus,

  // Property Management
  fetchAllProperties,
  updatePropertyAdminStatus,

  // Export / Reports
  exportDashboardData,
  exportReportsData,
  getReportsSummary,
};

export default adminDashboardServices;
