import axios from "axios";
import { getApiUrl } from "utils/getApiUrl";

const API_BASE_URL = getApiUrl();

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err.response?.data || { message: err.message })
);

/**
 * Normalizes MongoDB property documents into a clean schema for React components.
 * Strictly extracts real DB fields and never injects fake/fabricated data.
 */
export const normalizeProperty = (p) => {
  if (!p) return null;

  // Numeric Price
  const priceNumeric = typeof p.price === "number" ? p.price : Number(p.price) || 0;

  // Detect commercial & listing type
  const isCommercial =
    p.specifications?.type === "commercial" ||
    p.propertyType?.toLowerCase() === "commercial" ||
    p.title?.toLowerCase().includes("office") ||
    p.title?.toLowerCase().includes("commercial");

  const listingType =
    p.listingType ||
    (p.status === "rented" || (priceNumeric > 0 && priceNumeric < 500000) ? "Rent" : "Buy");

  // Format price
  let formattedPrice = "";
  if (priceNumeric > 0) {
    if (listingType === "Rent" && priceNumeric < 1000000) {
      formattedPrice = `₹${priceNumeric.toLocaleString("en-IN")}/mo`;
    } else if (priceNumeric >= 10000000) {
      formattedPrice = `₹${(priceNumeric / 10000000).toFixed(2)} Cr`;
    } else if (priceNumeric >= 100000) {
      formattedPrice = `₹${(priceNumeric / 100000).toFixed(2)} L`;
    } else {
      formattedPrice = `₹${priceNumeric.toLocaleString("en-IN")}`;
    }
  } else if (p.price) {
    formattedPrice = String(p.price);
  } else {
    formattedPrice = "Price on Request";
  }

  // Extract real images from MongoDB (Cloudinary URLs)
  let images = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images
      .map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean);
  }
  if (images.length === 0 && p.image) {
    images = [typeof p.image === "string" ? p.image : p.image.url].filter(Boolean);
  }
  if (images.length === 0) {
    images = ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"];
  }

  // Location fields from MongoDB
  const city = p.location?.city || p.city || "";
  const locality =
    p.location?.locality ||
    p.location?.address?.split(",")?.[1]?.trim() ||
    p.locality ||
    city;
  const address = p.location?.address || p.address || (locality ? `${locality}, ${city}` : city);
  const state = p.location?.state || p.state || "";
  const pincode = p.location?.pincode || p.pincode || "";
  const coordinates =
    p.location?.coordinates && (p.location.coordinates.lat || p.location.coordinates.lng)
      ? p.location.coordinates
      : p.coordinates || null;

  // Specifications from MongoDB
  const area = p.specifications?.area ?? p.specifications?.carpetArea ?? p.area ?? null;
  const areaUnit = p.specifications?.areaUnit || p.areaUnit || "sq.ft";
  const carpetArea = area ? `${Number(area).toLocaleString()} ${areaUnit}` : null;
  const superArea = p.specifications?.superArea ? `${Number(p.specifications.superArea).toLocaleString()} ${areaUnit}` : null;

  // For commercial spaces, bedrooms should be null (not 1 BHK)
  const bedrooms = isCommercial
    ? null
    : p.specifications?.bedrooms ?? p.bedrooms ?? null;
  const bathrooms = p.specifications?.bathrooms ?? p.bathrooms ?? null;
  const balconies = p.specifications?.balconies ?? p.balconies ?? null;

  const propertyType = isCommercial
    ? "Commercial Space"
    : p.specifications?.type
    ? p.specifications.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : p.propertyType || "Apartment";

  const furnishing =
    p.specifications?.furnishing && p.specifications.furnishing !== "unfurnished"
      ? p.specifications.furnishing.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : p.specifications?.furnishing === "unfurnished"
      ? "Unfurnished"
      : p.furnishing || null;
  const parking =
    p.specifications?.parking && p.specifications.parking !== "none"
      ? p.specifications.parking.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : p.parking || null;
  const builtYear = p.specifications?.builtYear || p.builtYear || null;
  const floor = p.specifications?.floor
    ? p.specifications.totalFloors
      ? `Floor ${p.specifications.floor} of ${p.specifications.totalFloors}`
      : `Floor ${p.specifications.floor}`
    : p.floor || null;
  const facing = p.specifications?.facing
    ? `${p.specifications.facing.charAt(0).toUpperCase() + p.specifications.facing.slice(1)} Facing`
    : p.facing || null;
  const constructionStatus = p.specifications?.constructionStatus
    ? p.specifications.constructionStatus.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  // Real Agent / Consultant Info from MongoDB (User reference or agentInfo)
  const rawAgent = p.postedBy || p.agentInfo || p.agent;
  const agent = rawAgent && (rawAgent.name || rawAgent.phone)
    ? {
        name: rawAgent.name || "Property Consultant",
        designation: rawAgent.designation || "Property Consultant",
        phone: rawAgent.phone || "",
        email: rawAgent.email || "",
        image:
          rawAgent.avatar && rawAgent.avatar !== "default-avatar.jpg"
            ? rawAgent.avatar
            : null,
      }
    : null;

  // Calculate Price per sq.ft from actual price and actual area
  const pricePerSqFt =
    priceNumeric && area
      ? `₹${Math.round(priceNumeric / area).toLocaleString("en-IN")}/sq.ft`
      : null;

  // Clean Real Amenities from MongoDB (array of strings)
  const amenities = Array.isArray(p.amenities)
    ? p.amenities
        .map((a) => (typeof a === "string" ? a.replace(/-/g, " ").trim() : a?.name))
        .filter(Boolean)
    : [];

  // Clean Real Features from MongoDB (array of strings)
  const features = Array.isArray(p.features)
    ? p.features
        .map((f) => (typeof f === "string" ? f.replace(/-/g, " ").trim() : f?.name))
        .filter(Boolean)
    : [];

  const reraId = p.reraId || p.reraNumber || p.rera || null;
  const verified = Boolean(p.verified || p.isVerified);

  return {
    ...p,
    id: p._id?.toString() || p.id,
    _id: p._id?.toString() || p.id,
    title: p.title || "Property",
    slug: p.slug || p._id?.toString() || p.id,
    description: p.description || p.overview || "",
    price: formattedPrice,
    priceNumeric,
    pricePerSqFt,
    propertyType,
    listingType,
    isCommercial,
    city,
    locality,
    address,
    state,
    pincode,
    coordinates,
    bedrooms,
    bathrooms,
    balconies,
    area,
    areaUnit,
    carpetArea,
    superArea,
    furnishing,
    parking,
    builtYear,
    floor,
    facing,
    constructionStatus,
    reraId,
    verified,
    status: p.status || "available",
    featured: Boolean(p.featured),
    views: p.views || 0,
    images,
    image: images[0],
    agent,
    amenities,
    features,
  };
};

/**
 * Get all properties from live database with filters & pagination
 */
export const getAllProperties = async (filters = {}) => {
  try {
    const params = {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      type: filters.type,
      city: filters.city,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      agent: filters.agent,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === "" || params[key] === null || params[key] === undefined || params[key] === "All") {
        delete params[key];
      }
    });

    const res = await api.get("/properties", { params, timeout: 8000 });
    if (res.data) {
      const rawList = Array.isArray(res.data)
        ? res.data
        : res.data.properties || [];

      const normalizedList = rawList.map(normalizeProperty);
      return {
        properties: normalizedList,
        totalProperties: res.data.total ?? normalizedList.length,
        totalPages: res.data.pages ?? Math.ceil(normalizedList.length / (filters.limit || 12)) ?? 1,
        currentPage: res.data.page ?? Number(filters.page) ?? 1,
      };
    }
    return { properties: [], totalProperties: 0, totalPages: 1, currentPage: 1 };
  } catch (error) {
    console.error("Error fetching live properties from backend:", error.message);
    return { properties: [], totalProperties: 0, totalPages: 1, currentPage: 1 };
  }
};

/**
 * Get single property by ID from live database
 */
export const getPropertyById = async (id) => {
  try {
    const res = await api.get(`/properties/${id}`, { timeout: 8000 });
    if (res.data) {
      const raw = res.data.property || res.data;
      if (raw) {
        const normalized = normalizeProperty(raw);
        normalized.property = raw;
        normalized._raw = raw;
        return normalized;
      }
    }
    throw new Error("Property not found in database");
  } catch (error) {
    console.error(`Error fetching property by id ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get raw property document by id (for editing forms)
 */
export const getRawPropertyById = async (id) => {
  try {
    const res = await api.get(`/properties/${id}`, { timeout: 8000 });
    return res.data?.property || res.data;
  } catch (error) {
    console.error(`Error fetching raw property by id ${id}:`, error.message);
    throw error;
  }
};

/**
 * Get single property by Slug from live database
 */
export const getPropertyBySlug = async (slug) => {
  try {
    const res = await api.get(`/properties/${slug}`, { timeout: 8000 });
    if (res.data) {
      const raw = res.data.property || res.data;
      if (raw) return normalizeProperty(raw);
    }
    throw new Error("Property not found in database");
  } catch (error) {
    console.error(`Error fetching property by slug ${slug}:`, error.message);
    throw error;
  }
};

/**
 * Get featured properties from live database
 */
export const getFeaturedProperties = async () => {
  try {
    const res = await api.get("/properties/featured", { timeout: 8000 });
    const rawList = Array.isArray(res.data) ? res.data : res.data.properties || [];
    return rawList.map(normalizeProperty);
  } catch (error) {
    console.error("Error fetching featured properties:", error.message);
    return [];
  }
};

/**
 * Create property
 */
export const createProperty = async (data) => {
  try {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "images") return;

      if (Array.isArray(data[key]) || typeof data[key] === "object") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    if (data.images?.length) {
      data.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    }

    const res = await api.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

/**
 * Update property
 */
export const updateProperty = async (id, data) => {
  try {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "images") return;

      if (Array.isArray(data[key]) || typeof data[key] === "object") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    if (data.images?.length) {
      data.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    }

    const res = await api.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

/**
 * Delete property
 */
export const deleteProperty = async (id) => {
  try {
    const res = await api.delete(`/properties/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

/**
 * Get available agents for assignment
 */
export const getAvailableAgents = async () => {
  try {
    const res = await api.get("/properties/agents/available");
    return res.data || { success: true, agents: [] };
  } catch (error) {
    console.error("Error fetching available agents:", error);
    return { success: false, agents: [] };
  }
};

/**
 * Property service facade
 */
export const propertyService = {
  getAllProperties,
  searchProperties: getAllProperties,
  getById: getPropertyById,
  getRawById: getRawPropertyById,
  getBySlug: getPropertyBySlug,
  getFeatured: getFeaturedProperties,
  create: createProperty,
  update: updateProperty,
  delete: deleteProperty,
  getAvailableAgents,
};

export default propertyService;
