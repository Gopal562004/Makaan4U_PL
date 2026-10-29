import Property from "../models/Property.js";
import User from "../models/User.js";
import PropertyView from "../models/PropertyView.js";
import mongoose from "mongoose";
import {
  deleteMultipleFromCloudinary,
  getPublicIdFromUrl,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { isCloudinaryConfigured } from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

// @desc    Get all properties with filtering, sorting and pagination
// @route   GET /api/properties
// @access  Public
// export const getAllProperties = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 12,
//       type,
//       minPrice,
//       maxPrice,
//       city,
//       bedrooms,
//       bathrooms,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       search,
//       searchQuery,
//       agent,
//       amenities,
//       status = "available",
//     } = req.query;

//     // Build filter object
//     const filter = {
//       status: status,
//       isActive: true,
//     };

//     // Property Type filter
//     if (type) {
//       filter["specifications.type"] = type;
//     }

//     // Location filter - handle city search
//     const locationSearch = city;
//     if (locationSearch) {
//       filter.$or = [
//         { "location.city": new RegExp(locationSearch, "i") },
//         { "location.address": new RegExp(locationSearch, "i") },
//       ];
//     }

//     // Search filter - handle both search and searchQuery parameters
//     const searchTerm = search || searchQuery;
//     if (searchTerm) {
//       filter.$or = [
//         { title: new RegExp(searchTerm, "i") },
//         { description: new RegExp(searchTerm, "i") },
//         { "location.city": new RegExp(searchTerm, "i") },
//         { "location.address": new RegExp(searchTerm, "i") },
//         { "location.state": new RegExp(searchTerm, "i") },
//         { "specifications.type": new RegExp(searchTerm, "i") },
//       ];
//     }

//     // Bedrooms filter - handle both string and number
//     if (bedrooms) {
//       if (bedrooms === "4+") {
//         filter["specifications.bedrooms"] = { $gte: 4 };
//       } else {
//         filter["specifications.bedrooms"] = parseInt(bedrooms);
//       }
//     }

//     // Bathrooms filter - handle both string and number
//     if (bathrooms) {
//       if (bathrooms === "4+") {
//         filter["specifications.bathrooms"] = { $gte: 4 };
//       } else {
//         filter["specifications.bathrooms"] = parseInt(bathrooms);
//       }
//     }

//     // Price filter
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = parseInt(minPrice);
//       if (maxPrice) filter.price.$lte = parseInt(maxPrice);
//     }

//     // Agent filter
//     if (agent) {
//       // Handle both agent ID and agent name search
//       if (mongoose.Types.ObjectId.isValid(agent)) {
//         filter.postedBy = agent;
//       } else {
//         filter["agentInfo.name"] = new RegExp(agent, "i");
//       }
//     }

//     // Amenities filter
//     if (amenities) {
//       const amenitiesArray = Array.isArray(amenities)
//         ? amenities
//         : amenities.split(",");
//       filter.amenities = { $in: amenitiesArray.map((a) => new RegExp(a, "i")) };
//     }

//     // Sort options
//     const sortOptions = {};

//     // Map frontend sort values to database fields
//     const sortFieldMap = {
//       relevance: "createdAt",
//       "price-low": "price",
//       "price-high": "price",
//       newest: "createdAt",
//       oldest: "createdAt",
//       "area-large": "specifications.area",
//       "area-small": "specifications.area",
//       bedrooms: "specifications.bedrooms",
//       bathrooms: "specifications.bathrooms",
//     };

//     const actualSortBy = sortFieldMap[sortBy] || sortBy;

//     // Determine sort order based on the sort type
//     let actualSortOrder = sortOrder === "desc" ? -1 : 1;

//     // Specific sort order handling for certain fields
//     if (sortBy === "price-low") actualSortOrder = 1;
//     if (sortBy === "price-high") actualSortOrder = -1;
//     if (sortBy === "area-large") actualSortOrder = -1;
//     if (sortBy === "area-small") actualSortOrder = 1;
//     if (sortBy === "bedrooms") actualSortOrder = -1;
//     if (sortBy === "bathrooms") actualSortOrder = -1;

//     sortOptions[actualSortBy] = actualSortOrder;

//     // Calculate pagination
//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);
//     const skip = (pageNum - 1) * limitNum;

//     // Execute query with population
//     const properties = await Property.find(filter)
//       .populate(
//         "postedBy",
//         "name email phone avatar designation experience languages"
//       )
//       .sort(sortOptions)
//       .limit(limitNum)
//       .skip(skip);

//     // Get total count for pagination
//     const total = await Property.countDocuments(filter);

//     // Format response
//     const response = {
//       success: true,
//       count: properties.length,
//       total,
//       page: pageNum,
//       pages: Math.ceil(total / limitNum),
//       properties: properties.map((property) => ({
//         _id: property._id,
//         title: property.title,
//         description: property.description,
//         price: property.price,
//         originalPrice: property.originalPrice,
//         location: property.location,
//         status: property.status,
//         featured: property.featured,
//         specifications: property.specifications,
//         amenities: property.amenities,
//         features: property.features,
//         images: property.images,
//         agentInfo: property.agentInfo,
//         postedBy: property.postedBy,
//         propertyId: property.propertyId,
//         listedDate: property.listedDate,
//         views: property.views,
//         createdAt: property.createdAt,
//         updatedAt: property.updatedAt,
//       })),
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching properties",
//       error: error.message,
//     });
//   }
// };
// export const getAllProperties = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 12,
//       type,
//       minPrice,
//       maxPrice,
//       city,
//       bedrooms,
//       bathrooms,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//       search,
//       searchQuery,
//       agent,
//       amenities,
//       status, // Remove default value - handle "all" case
//       category,
//       constructionStatus,
//       furnishing,
//     } = req.query;

//     // Build filter object - FIXED: Don't filter by status by default
//     const filter = {
//       isActive: true,
//     };

//     // FIXED: Handle status filter properly
//     if (status && status !== "all") {
//       // Support multiple statuses (comma-separated)
//       if (status.includes(",")) {
//         const statuses = status.split(",").map((s) => s.trim());
//         filter.status = { $in: statuses };
//       } else {
//         filter.status = status;
//       }
//     }
//     // If status is "all" or not provided, don't filter by status

//     // Property Type filter
//     if (type && type !== "all") {
//       if (type.includes(",")) {
//         // Handle multiple types
//         const types = type.split(",").map((t) => t.trim());
//         filter["specifications.type"] = { $in: types };
//       } else {
//         filter["specifications.type"] = type;
//       }
//     }

//     // Category filter
//     if (category && category !== "all") {
//       filter["specifications.category"] = category;
//     }

//     // Construction Status filter
//     if (constructionStatus && constructionStatus !== "all") {
//       filter["specifications.constructionStatus"] = constructionStatus;
//     }

//     // Furnishing filter
//     if (furnishing && furnishing !== "all") {
//       filter["specifications.furnishing"] = furnishing;
//     }

//     // Location filter - handle city search
//     const locationSearch = city;
//     if (locationSearch && locationSearch !== "all") {
//       filter.$or = [
//         { "location.city": new RegExp(locationSearch, "i") },
//         { "location.address": new RegExp(locationSearch, "i") },
//         { "location.locality": new RegExp(locationSearch, "i") },
//       ];
//     }

//     // Search filter - handle both search and searchQuery parameters
//     const searchTerm = search || searchQuery;
//     if (searchTerm) {
//       if (!filter.$or) filter.$or = [];

//       filter.$or.push(
//         { title: new RegExp(searchTerm, "i") },
//         { description: new RegExp(searchTerm, "i") },
//         { "location.city": new RegExp(searchTerm, "i") },
//         { "location.address": new RegExp(searchTerm, "i") },
//         { "location.state": new RegExp(searchTerm, "i") },
//         { "location.locality": new RegExp(searchTerm, "i") },
//         { "specifications.type": new RegExp(searchTerm, "i") }
//       );
//     }

//     // Bedrooms filter - handle both string and number
//     if (bedrooms && bedrooms !== "all") {
//       if (bedrooms === "4+") {
//         filter["specifications.bedrooms"] = { $gte: 4 };
//       } else {
//         const bedNum = parseInt(bedrooms);
//         if (!isNaN(bedNum)) {
//           filter["specifications.bedrooms"] = bedNum;
//         }
//       }
//     }

//     // Bathrooms filter - handle both string and number
//     if (bathrooms && bathrooms !== "all") {
//       if (bathrooms === "4+") {
//         filter["specifications.bathrooms"] = { $gte: 4 };
//       } else {
//         const bathNum = parseInt(bathrooms);
//         if (!isNaN(bathNum)) {
//           filter["specifications.bathrooms"] = bathNum;
//         }
//       }
//     }

//     // Price filter
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) {
//         const min = parseInt(minPrice);
//         if (!isNaN(min)) filter.price.$gte = min;
//       }
//       if (maxPrice) {
//         const max = parseInt(maxPrice);
//         if (!isNaN(max)) filter.price.$lte = max;
//       }
//     }

//     // Agent filter
//     if (agent && agent !== "all") {
//       // Handle both agent ID and agent name search
//       if (mongoose.Types.ObjectId.isValid(agent)) {
//         filter.postedBy = agent;
//       } else {
//         filter.$or = filter.$or || [];
//         filter.$or.push(
//           { "agentInfo.name": new RegExp(agent, "i") },
//           { "agentInfo.email": new RegExp(agent, "i") }
//         );
//       }
//     }

//     // Amenities filter
//     if (amenities && amenities !== "all") {
//       const amenitiesArray = Array.isArray(amenities)
//         ? amenities
//         : amenities.split(",");

//       // Clean and trim amenity values
//       const cleanAmenities = amenitiesArray.map((a) => a.trim().toLowerCase());

//       if (cleanAmenities.length > 0) {
//         filter.amenities = {
//           $all: cleanAmenities.map(
//             (amenity) => new RegExp(`^${amenity}$`, "i")
//           ),
//         };
//       }
//     }

//     // Sort options
//     const sortOptions = {};

//     // Map frontend sort values to database fields
//     const sortFieldMap = {
//       relevance: "createdAt",
//       "price-low": "price",
//       "price-high": "price",
//       newest: "createdAt",
//       oldest: "createdAt",
//       "area-large": "specifications.area",
//       "area-small": "specifications.area",
//       bedrooms: "specifications.bedrooms",
//       bathrooms: "specifications.bathrooms",
//       featured: "featured",
//       views: "views",
//     };

//     const actualSortBy = sortFieldMap[sortBy] || sortBy || "createdAt";

//     // Determine sort order based on the sort type
//     let actualSortOrder = sortOrder === "desc" ? -1 : 1;

//     // Specific sort order handling for certain fields
//     if (sortBy === "price-low") actualSortOrder = 1;
//     else if (sortBy === "price-high") actualSortOrder = -1;
//     else if (sortBy === "area-large") actualSortOrder = -1;
//     else if (sortBy === "area-small") actualSortOrder = 1;
//     else if (sortBy === "bedrooms") actualSortOrder = -1;
//     else if (sortBy === "bathrooms") actualSortOrder = -1;
//     else if (sortBy === "newest") actualSortOrder = -1;
//     else if (sortBy === "oldest") actualSortOrder = 1;

//     sortOptions[actualSortBy] = actualSortOrder;

//     // Add secondary sort for consistent results
//     if (actualSortBy !== "createdAt") {
//       sortOptions.createdAt = -1;
//     }

//     // Calculate pagination with validation
//     const pageNum = Math.max(1, parseInt(page) || 1);
//     const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12));
//     const skip = (pageNum - 1) * limitNum;

//     console.log("🔍 FINAL Property filter:", JSON.stringify(filter, null, 2));
//     console.log("📊 Sort options:", sortOptions);
//     console.log("📄 Pagination:", { page: pageNum, limit: limitNum, skip });

//     // Execute query with population
//     const properties = await Property.find(filter)
//       .populate(
//         "postedBy",
//         "name email phone avatar designation experience languages rating performance"
//       )
//       .sort(sortOptions)
//       .limit(limitNum)
//       .skip(skip)
//       .lean();




//     // Get total count for pagination
//     const total = await Property.countDocuments(filter);

//     // Log the actual properties found for debugging
//     console.log("🏠 Properties found:", properties.length);
//     properties.forEach((prop, index) => {
//       console.log(
//         `  ${index + 1}. ${prop.title} (${prop.status}) - ${prop.propertyId}`
//       );
//     });

//     // Format response
//     const response = {
//       success: true,
//       count: properties.length,
//       total,
//       page: pageNum,
//       pages: Math.ceil(total / limitNum),
//       hasNextPage: pageNum < Math.ceil(total / limitNum),
//       hasPrevPage: pageNum > 1,
//       filters: {
//         type,
//         minPrice,
//         maxPrice,
//         city,
//         bedrooms,
//         bathrooms,
//         status,
//         category,
//         constructionStatus,
//         furnishing,
//       },
//       properties: properties.map((property) => ({
//         _id: property._id,
//         title: property.title,
//         slug: property.slug,
//         description: property.description,
//         price: property.price,
//         originalPrice: property.originalPrice,
//         priceNegotiable: property.priceNegotiable,
//         location: property.location,
//         status: property.status,
//         featured: property.featured,
//         priority: property.priority,
//         specifications: property.specifications,
//         amenities: property.amenities,
//         features: property.features,
//         images: property.images,
//         agentInfo: property.agentInfo,
//         postedBy: property.postedBy,
//         propertyId: property.propertyId,
//         listedDate: property.listedDate,
//         views: property.views,
//         contactInfo: property.contactInfo,
//         createdAt: property.createdAt,
//         updatedAt: property.updatedAt,
//         pricePerSqft: property.specifications?.area
//           ? Math.round(property.price / property.specifications.area)
//           : null,
//       })),
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("❌ Error fetching properties:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching properties",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// Helper delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      minPrice,
      maxPrice,
      city,
      bedrooms,
      bathrooms,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      searchQuery,
      agent,
      amenities,
      status,
      category,
      constructionStatus,
      furnishing,
    } = req.query;

    const filter = { isActive: true };
    const andConditions = [];

    // Status filter
    if (status && status !== "all") {
      if (status.includes(",")) {
        const statuses = status.split(",").map((s) => s.trim());
        filter.status = { $in: statuses };
      } else {
        filter.status = status;
      }
    }

    // Type filter
    if (type && type !== "all") {
      if (type.includes(",")) {
        const types = type.split(",").map((t) => t.trim());
        filter["specifications.type"] = { $in: types };
      } else {
        filter["specifications.type"] = type;
      }
    }

    if (category && category !== "all") {
      filter["specifications.category"] = category;
    }

    if (constructionStatus && constructionStatus !== "all") {
      filter["specifications.constructionStatus"] = constructionStatus;
    }

    if (furnishing && furnishing !== "all") {
      filter["specifications.furnishing"] = furnishing;
    }

    // Location filter
    if (city && city !== "all") {
      const cityRegex = city.includes(",") ? city.split(",").map(c => c.trim()).join("|") : city;
      andConditions.push({
        $or: [
          { "location.city": new RegExp(cityRegex, "i") },
          { "location.address": new RegExp(cityRegex, "i") },
          { "location.locality": new RegExp(cityRegex, "i") },
        ]
      });
    }

    // Search filter
    const searchTerm = search || searchQuery;
    if (searchTerm) {
      andConditions.push({
        $or: [
          { title: new RegExp(searchTerm, "i") },
          { description: new RegExp(searchTerm, "i") },
          { "location.city": new RegExp(searchTerm, "i") },
          { "location.address": new RegExp(searchTerm, "i") },
          { "location.state": new RegExp(searchTerm, "i") },
          { "location.locality": new RegExp(searchTerm, "i") },
          { "specifications.type": new RegExp(searchTerm, "i") }
        ]
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    // Bedrooms
    if (bedrooms && bedrooms !== "all") {
      if (bedrooms === "4+") {
        filter["specifications.bedrooms"] = { $gte: 4 };
      } else {
        const bedNum = parseInt(bedrooms);
        if (!isNaN(bedNum)) {
          filter["specifications.bedrooms"] = bedNum;
        }
      }
    }

    // Bathrooms
    if (bathrooms && bathrooms !== "all") {
      if (bathrooms === "4+") {
        filter["specifications.bathrooms"] = { $gte: 4 };
      } else {
        const bathNum = parseInt(bathrooms);
        if (!isNaN(bathNum)) {
          filter["specifications.bathrooms"] = bathNum;
        }
      }
    }

    // Price
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Agent
    if (agent && agent !== "all") {
      if (mongoose.Types.ObjectId.isValid(agent)) {
        filter.postedBy = agent;
      } else {
        filter.$or = filter.$or || [];
        filter.$or.push(
          { "agentInfo.name": new RegExp(agent, "i") },
          { "agentInfo.email": new RegExp(agent, "i") }
        );
      }
    }

    // Amenities
    if (amenities && amenities !== "all") {
      const amenitiesArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");

      const cleanAmenities = amenitiesArray.map((a) =>
        a.trim().toLowerCase()
      );

      filter.amenities = {
        $all: cleanAmenities.map(
          (a) => new RegExp(`^${a}$`, "i")
        ),
      };
    }

    // Sorting
    const sortOptions = {};
    const sortFieldMap = {
      relevance: "createdAt",
      "price-low": "price",
      "price-high": "price",
      newest: "createdAt",
      oldest: "createdAt",
      "area-large": "specifications.area",
      "area-small": "specifications.area",
      bedrooms: "specifications.bedrooms",
      bathrooms: "specifications.bathrooms",
      featured: "featured",
      views: "views",
    };

    const actualSortBy = sortFieldMap[sortBy] || sortBy;
    let actualSortOrder = sortOrder === "desc" ? -1 : 1;

    if (sortBy === "price-low") actualSortOrder = 1;
    else if (sortBy === "price-high") actualSortOrder = -1;
    else if (sortBy === "area-large") actualSortOrder = -1;
    else if (sortBy === "area-small") actualSortOrder = 1;
    else if (sortBy === "newest") actualSortOrder = -1;
    else if (sortBy === "oldest") actualSortOrder = 1;

    sortOptions[actualSortBy] = actualSortOrder;

    if (actualSortBy !== "createdAt") {
      sortOptions.createdAt = -1;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Query
    const properties = await Property.find(filter)
      .populate("postedBy", "name email")
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip)
      .lean();

    const total = await Property.countDocuments(filter);

    const response = {
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      properties,
    };


    return res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching properties:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// @desc    Get filter options for properties
// @route   GET /api/properties/filter-options
// @access  Public
export const getFilterOptions = async (req, res) => {
  try {
    // Get distinct values for filters
    const cities = await Property.distinct("location.city", {
      isActive: true,
      status: "available",
    });
    const types = await Property.distinct("specifications.type", {
      isActive: true,
      status: "available",
    });
    const amenities = await Property.distinct("amenities", {
      isActive: true,
      status: "available",
    });

    // Get price range
    const priceStats = await Property.aggregate([
      {
        $match: {
          isActive: true,
          status: "available",
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    const priceRange =
      priceStats.length > 0
        ? {
            min: priceStats[0].minPrice,
            max: priceStats[0].maxPrice,
            avg: priceStats[0].avgPrice,
          }
        : { min: 0, max: 0, avg: 0 };

    res.status(200).json({
      success: true,
      options: {
        cities: cities
          .filter((city) => city && city !== "City not specified")
          .sort(),
        types: types.filter((type) => type).sort(),
        amenities: amenities.filter((amenity) => amenity).sort(),
        priceRange,
        bedrooms: [1, 2, 3, "4+"],
        bathrooms: [1, 2, 3, "4+"],
      },
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching filter options",
      error: error.message,
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
// export const createProperty = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       price,
//       type,
//       category,
//       location,
//       specifications,
//       amenities = [],
//       features = [],
//       nearbyPlaces = [],
//       transportation = [],
//       status = "available",
//       featured = false,
//       assignedAgent, // For selected agent ID
//       manualAgent, // For manual agent info (object with name, email, phone, etc.)
//     } = req.body;

//     console.log("📝 Raw data received:", {
//       title: title?.length,
//       type,
//       category,
//       assignedAgent,
//       manualAgent: manualAgent ? "Manual agent provided" : "No manual agent",
//       userRole: req.user.role,
//     });

//     // Parse JSON fields with proper error handling
//     let locationData = {};
//     let specsData = {};
//     let amenitiesData = [];
//     let featuresData = [];
//     let nearbyPlacesData = [];
//     let transportationData = [];
//     let manualAgentData = {};

//     try {
//       locationData =
//         typeof location === "string" ? JSON.parse(location) : location || {};
//     } catch (error) {
//       console.log("❌ Location parse error:", error.message);
//       locationData = {};
//     }

//     try {
//       specsData =
//         typeof specifications === "string"
//           ? JSON.parse(specifications)
//           : specifications || {};
//     } catch (error) {
//       console.log("❌ Specifications parse error:", error.message);
//       specsData = {};
//     }

//     try {
//       manualAgentData =
//         typeof manualAgent === "string"
//           ? JSON.parse(manualAgent)
//           : manualAgent || {};
//     } catch (error) {
//       console.log("❌ Manual agent parse error:", error.message);
//       manualAgentData = {};
//     }

//     try {
//       amenitiesData =
//         typeof amenities === "string"
//           ? JSON.parse(amenities)
//           : Array.isArray(amenities)
//           ? amenities
//           : [];
//     } catch (error) {
//       console.log("❌ Amenities parse error:", error.message);
//       amenitiesData = [];
//     }

//     try {
//       featuresData =
//         typeof features === "string"
//           ? JSON.parse(features)
//           : Array.isArray(features)
//           ? features
//           : [];
//     } catch (error) {
//       console.log("❌ Features parse error:", error.message);
//       featuresData = [];
//     }

//     try {
//       nearbyPlacesData =
//         typeof nearbyPlaces === "string"
//           ? JSON.parse(nearbyPlaces)
//           : Array.isArray(nearbyPlaces)
//           ? nearbyPlaces
//           : [];
//     } catch (error) {
//       console.log("❌ Nearby places parse error:", error.message);
//       nearbyPlacesData = [];
//     }

//     try {
//       transportationData =
//         typeof transportation === "string"
//           ? JSON.parse(transportation)
//           : Array.isArray(transportation)
//           ? transportation
//           : [];
//     } catch (error) {
//       console.log("❌ Transportation parse error:", error.message);
//       transportationData = [];
//     }

//     // **AGENT ASSIGNMENT LOGIC**
//     let postedByUserId = req.user.id;
//     let agentInfo = {};

//     // Handle manual agent input (store directly in property schema)
//     if (manualAgentData && manualAgentData.name) {
//       console.log("👨‍💼 Manual agent info provided:", manualAgentData);

//       agentInfo = {
//         name: manualAgentData.name || "Agent",
//         email: manualAgentData.email || "agent@example.com",
//         phone: manualAgentData.phone || "0000000000",
//         designation: manualAgentData.designation || "Property Consultant",
//         avatar: manualAgentData.avatar || "",
//         experience: manualAgentData.experience || "0+",
//         languages: manualAgentData.languages || ["English", "Hindi"],
//         rating: manualAgentData.rating || 0,
//         reviewCount: manualAgentData.reviewCount || 0,
//         propertiesSold: manualAgentData.propertiesSold || 0,
//         isManualAgent: true, // Mark as manual agent
//       };

//       // For manual agents, postedBy can be the current user (admin) or null
//       if (req.user.role === "customer") {
//         // Customers need a valid postedBy (existing agent)
//         if (assignedAgent) {
//           const assignedUser = await User.findById(assignedAgent);
//           if (!assignedUser || assignedUser.role === "customer") {
//             return res.status(400).json({
//               success: false,
//               message: "Invalid agent assignment",
//             });
//           }
//           postedByUserId = assignedAgent;
//         } else {
//           return res.status(400).json({
//             success: false,
//             message: "Customer must assign an existing agent",
//           });
//         }
//       }
//       // For admin/employee, they can be the postedBy even with manual agent info
//       else {
//         postedByUserId = req.user.id;
//       }

//       console.log("✅ Using manual agent info stored in property");
//     }
//     // Handle existing agent assignment
//     else if (assignedAgent) {
//       console.log("👨‍💼 Assigning existing agent:", assignedAgent);

//       // Validate if assigned agent exists and is an employee/admin
//       const assignedUser = await User.findById(assignedAgent);
//       if (!assignedUser) {
//         return res.status(400).json({
//           success: false,
//           message: "Assigned agent not found",
//         });
//       }

//       if (assignedUser.role === "customer") {
//         return res.status(400).json({
//           success: false,
//           message: "Cannot assign property to customer role",
//         });
//       }

//       postedByUserId = assignedAgent;
//       console.log("✅ Property assigned to existing agent:", assignedUser.name);
//     }
//     // If user is employee/admin and no agent specified, they become the agent
//     else if (req.user.role === "employee" || req.user.role === "admin") {
//       console.log("👨‍💼 User creating property - assigned as agent");
//       postedByUserId = req.user.id;
//     }
//     // If customer tries to create property without agent assignment
//     else if (req.user.role === "customer") {
//       console.log("👤 Customer creating property - needs agent assignment");
//       return res.status(400).json({
//         success: false,
//         message: "Customer must assign an agent for the property",
//       });
//     }

//     // Validate and format data according to schema
//     const propertyData = {
//       // Basic Information
//       title: title?.trim() || "New Property",
//       description: description?.trim() || "Property description",

//       // Pricing
//       price: Number(price) || 0,

//       // Type & Category
//       type: (type || "apartment").toLowerCase(),
//       category: (category || "sale").toLowerCase(),

//       // Location - with proper defaults
//       location: {
//         address: locationData.address || "Address not specified",
//         city: locationData.city || "City not specified",
//         state: locationData.state || "State not specified",
//         pincode: locationData.pincode || "000000",
//         coordinates: locationData.coordinates || { lat: 0, lng: 0 },
//       },

//       // Status & Features
//       status: status || "available",
//       featured: Boolean(featured),

//       // Specifications - with proper defaults
//       specifications: {
//         bedrooms: parseInt(specsData.bedrooms) || 1,
//         bathrooms: parseInt(specsData.bathrooms) || 1,
//         area: parseInt(specsData.area) || 500,
//         areaUnit: specsData.areaUnit || "sqft",
//         type: (specsData.type || type || "apartment").toLowerCase(),
//         builtYear: specsData.builtYear || "",
//         parking: specsData.parking || "",
//         possession: specsData.possession || "ready-to-move",
//         facing: specsData.facing || "north",
//         floors: parseInt(specsData.floors) || 1,
//       },

//       // Arrays
//       amenities: amenitiesData.filter((item) => typeof item === "string"),
//       features: featuresData.filter((item) => typeof item === "string"),

//       // Nearby Places
//       nearbyPlaces: Array.isArray(nearbyPlacesData)
//         ? nearbyPlacesData.map((item) => {
//             if (typeof item === "string") {
//               return {
//                 name: item,
//                 distance: "",
//                 type: "restaurant",
//               };
//             }
//             return {
//               name: item.name || "",
//               distance: item.distance || "",
//               type: item.type || "restaurant",
//             };
//           })
//         : [],

//       // Transportation
//       transportation: Array.isArray(transportationData)
//         ? transportationData.map((item) => {
//             if (typeof item === "string") {
//               return {
//                 destination: item,
//                 time: "",
//                 mode: "drive",
//               };
//             }
//             return {
//               destination: item.destination || "",
//               time: item.time || "",
//               mode: item.mode || "drive",
//             };
//           })
//         : [],

//       // **Posted by - using determined user ID**
//       postedBy: postedByUserId,
//     };

//     // Add manual agent info if provided (this will override auto-population)
//     if (manualAgentData && manualAgentData.name) {
//       propertyData.agentInfo = agentInfo;
//     }

//     // Handle uploaded images
//     let images = [];
//     if (req.files && req.files.length > 0) {
//       console.log("🌐 STORAGE CHECK - Processing files:");

//       images = req.files.map((file, index) => {
//         const isCloudinaryFile =
//           file.path && file.path.includes("res.cloudinary.com");

//         if (isCloudinaryFile) {
//           return {
//             url: file.path,
//             altText: `${title} - Image ${index + 1}`,
//             isPrimary: index === 0,
//             storage: "cloudinary",
//           };
//         } else {
//           return {
//             url: `/uploads/${file.filename}`,
//             altText: `${title} - Image ${index + 1}`,
//             isPrimary: index === 0,
//             storage: "local",
//             filename: file.filename,
//           };
//         }
//       });

//       console.log(`✅ Processed ${images.length} images`);
//     }

//     propertyData.images = images;

//     console.log("🏠 Final property data:", {
//       title: propertyData.title,
//       type: propertyData.type,
//       assignedTo: postedByUserId,
//       userRole: req.user.role,
//       imagesCount: propertyData.images.length,
//       hasManualAgent: !!(manualAgentData && manualAgentData.name),
//     });

//     // Create the property
//     const property = await Property.create(propertyData);

//     // Update agent's performance metrics ONLY for existing users (not manual agents)
//     if (!manualAgentData?.name && postedByUserId) {
//       const assignedUser = await User.findById(postedByUserId);
//       if (assignedUser && assignedUser.role !== "customer") {
//         await User.findByIdAndUpdate(postedByUserId, {
//           $inc: { "performance.totalPropertiesListed": 1 },
//         });
//         console.log(
//           "📈 Updated performance metrics for agent:",
//           assignedUser.name
//         );
//       }
//     }

//     res.status(201).json({
//       success: true,
//       message: manualAgentData?.name
//         ? "Property created successfully with manual agent information!"
//         : "Property created successfully!",
//       property,
//       agentType: manualAgentData?.name ? "manual" : "existing",
//     });
//   } catch (error) {
//     console.error("❌ Property creation error:", error);

//     // Cleanup uploaded files if property creation fails
//     if (req.files && req.files.length > 0) {
//       req.files.forEach((file) => {
//         if (
//           file.path &&
//           !file.path.includes("cloudinary") &&
//           fs.existsSync(file.path)
//         ) {
//           fs.unlinkSync(file.path);
//           console.log(`🗑️ Cleaned up local file: ${file.filename}`);
//         }
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: error.message,
//       errorDetails:
//         process.env.NODE_ENV === "development"
//           ? {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//             }
//           : undefined,
//     });
//   }
// };
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      category,
      location,
      specifications,
      amenities = [],
      features = [],
      nearbyPlaces = [],
      transportation = [],
      status = "available",
      featured = false,
      priceNegotiable,
      maintenanceCharges,
      securityDeposit,
      bookingAmount,
      contactInfo,
      assignedAgent,
      manualAgent,
    } = req.body;

    console.log("📝 Raw data received:", {
      title: title?.length,
      type,
      category,
      assignedAgent,
      manualAgent: manualAgent ? "Manual agent provided" : "No manual agent",
      userRole: req.user.role,
    });

    // Parse JSON fields with proper error handling
    let locationData = {};
    let specsData = {};
    let amenitiesData = [];
    let featuresData = [];
    let nearbyPlacesData = [];
    let transportationData = [];
    let manualAgentData = {};
    let maintenanceChargesData = {};
    let contactInfoData = {};

    try {
      locationData =
        typeof location === "string" ? JSON.parse(location) : location || {};
    } catch (error) {
      console.log("❌ Location parse error:", error.message);
      locationData = {};
    }

    try {
      specsData =
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications || {};
    } catch (error) {
      console.log("❌ Specifications parse error:", error.message);
      specsData = {};
    }

    try {
      manualAgentData =
        typeof manualAgent === "string"
          ? JSON.parse(manualAgent)
          : manualAgent || {};
    } catch (error) {
      console.log("❌ Manual agent parse error:", error.message);
      manualAgentData = {};
    }

    try {
      amenitiesData =
        typeof amenities === "string"
          ? JSON.parse(amenities)
          : Array.isArray(amenities)
          ? amenities
          : [];
    } catch (error) {
      console.log("❌ Amenities parse error:", error.message);
      amenitiesData = [];
    }

    try {
      featuresData =
        typeof features === "string"
          ? JSON.parse(features)
          : Array.isArray(features)
          ? features
          : [];
    } catch (error) {
      console.log("❌ Features parse error:", error.message);
      featuresData = [];
    }

    try {
      nearbyPlacesData =
        typeof nearbyPlaces === "string"
          ? JSON.parse(nearbyPlaces)
          : Array.isArray(nearbyPlaces)
          ? nearbyPlaces
          : [];
    } catch (error) {
      console.log("❌ Nearby places parse error:", error.message);
      nearbyPlacesData = [];
    }

    try {
      transportationData =
        typeof transportation === "string"
          ? JSON.parse(transportation)
          : Array.isArray(transportation)
          ? transportation
          : [];
    } catch (error) {
      console.log("❌ Transportation parse error:", error.message);
      transportationData = [];
    }

    try {
      maintenanceChargesData =
        typeof maintenanceCharges === "string"
          ? JSON.parse(maintenanceCharges)
          : maintenanceCharges || {};
    } catch (error) {
      console.log("❌ Maintenance charges parse error:", error.message);
      maintenanceChargesData = {};
    }

    try {
      contactInfoData =
        typeof contactInfo === "string"
          ? JSON.parse(contactInfo)
          : contactInfo || {};
    } catch (error) {
      console.log("❌ Contact info parse error:", error.message);
      contactInfoData = {};
    }

    // **AGENT ASSIGNMENT LOGIC**
    let postedByUserId = req.user.id;
    let agentInfo = {};

    // Handle manual agent input (store directly in property schema)
    if (manualAgentData && manualAgentData.name) {
      console.log("👨‍💼 Manual agent info provided:", manualAgentData);

      agentInfo = {
        name: manualAgentData.name || "Agent",
        email: manualAgentData.email || "agent@example.com",
        phone: manualAgentData.phone || "0000000000",
        alternatePhone: manualAgentData.alternatePhone || "",
        designation: manualAgentData.designation || "Property Consultant",
        company: manualAgentData.company || "",
        avatar: manualAgentData.avatar || "",
        experience: manualAgentData.experience || "0+",
        languages: manualAgentData.languages || ["English", "Hindi"],
        rating: manualAgentData.rating || 0,
        reviewCount: manualAgentData.reviewCount || 0,
        propertiesSold: manualAgentData.propertiesSold || 0,
        responseTime: manualAgentData.responseTime || "",
        availability: manualAgentData.availability || "within-24h",
        verified: manualAgentData.verified || false,
        isManualAgent: true,
      };

      // For manual agents, postedBy can be the current user (admin) or null
      if (req.user.role === "customer") {
        // Customers need a valid postedBy (existing agent)
        if (assignedAgent) {
          const assignedUser = await User.findById(assignedAgent);
          if (!assignedUser || assignedUser.role === "customer") {
            return res.status(400).json({
              success: false,
              message: "Invalid agent assignment",
            });
          }
          postedByUserId = assignedAgent;
        } else {
          return res.status(400).json({
            success: false,
            message: "Customer must assign an existing agent",
          });
        }
      }
      // For admin/employee, they can be the postedBy even with manual agent info
      else {
        postedByUserId = req.user.id;
      }

      console.log("✅ Using manual agent info stored in property");
    }
    // Handle existing agent assignment
    else if (assignedAgent) {
      console.log("👨‍💼 Assigning existing agent:", assignedAgent);

      // Validate if assigned agent exists and is an employee/admin
      const assignedUser = await User.findById(assignedAgent);
      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          message: "Assigned agent not found",
        });
      }

      if (assignedUser.role === "customer") {
        return res.status(400).json({
          success: false,
          message: "Cannot assign property to customer role",
        });
      }

      postedByUserId = assignedAgent;
      console.log("✅ Property assigned to existing agent:", assignedUser.name);
    }
    // If user is employee/admin and no agent specified, they become the agent
    else if (req.user.role === "employee" || req.user.role === "admin") {
      console.log("👨‍💼 User creating property - assigned as agent");
      postedByUserId = req.user.id;
    }
    // If customer tries to create property without agent assignment
    else if (req.user.role === "customer") {
      console.log("👤 Customer creating property - needs agent assignment");
      return res.status(400).json({
        success: false,
        message: "Customer must assign an agent for the property",
      });
    }

    // Validate and format data according to enhanced schema
    const propertyData = {
      // Basic Information
      title: title?.trim() || "New Property",
      description: description?.trim() || "Property description",

      // Pricing & Financial Details
      price: Number(price) || 0,
      originalPrice: Number(specsData.originalPrice) || undefined,
      priceNegotiable: Boolean(priceNegotiable),
      maintenanceCharges: {
        amount: Number(maintenanceChargesData.amount) || 0,
        period: maintenanceChargesData.period || "monthly",
      },
      securityDeposit: Number(securityDeposit) || 0,
      bookingAmount: Number(bookingAmount) || 0,

      // Enhanced Location Information
      location: {
        address: locationData.address || "Address not specified",
        city: locationData.city || "City not specified",
        state: locationData.state || "State not specified",
        pincode: locationData.pincode || "000000",
        locality: locationData.locality || "",
        landmark: locationData.landmark || "",
        coordinates: locationData.coordinates || { lat: 0, lng: 0 },
        googlePlaceId: locationData.googlePlaceId || "",
      },

      // Status & Features
      status: status || "available",
      featured: Boolean(featured),
      priority: specsData.priority || "medium",

      // Enhanced Specifications
      specifications: {
        // Basic specs
        bedrooms: parseInt(specsData.bedrooms) || 1,
        bathrooms: parseInt(specsData.bathrooms) || 1,
        balconies: parseInt(specsData.balconies) || 0,
        area: parseInt(specsData.area) || 500,
        areaUnit: specsData.areaUnit || "sqft",
        carpetArea: parseInt(specsData.carpetArea) || 0,
        builtUpArea: parseInt(specsData.builtUpArea) || 0,
        superBuiltUpArea: parseInt(specsData.superBuiltUpArea) || 0,

        // Property type
        type: (specsData.type || type || "apartment").toLowerCase(),
        category: (
          specsData.category ||
          category ||
          "residential"
        ).toLowerCase(),

        // Construction details
        builtYear: specsData.builtYear || "",
        ageOfConstruction: specsData.ageOfConstruction || "",
        constructionStatus: specsData.constructionStatus || "ready-to-move",
        possessionDate: specsData.possessionDate || undefined,

        // Layout & structure
        floor: parseInt(specsData.floor) || 1,
        totalFloors: parseInt(specsData.totalFloors) || 1,
        facing: specsData.facing || "north",
        furnishing: specsData.furnishing || "unfurnished",

        // Additional features
        parking: specsData.parking || "none",
        parkingCount: parseInt(specsData.parkingCount) || 0,
        lift: Boolean(specsData.lift),
        powerBackup: Boolean(specsData.powerBackup),
        waterSupply: specsData.waterSupply || "corporation",
        overlooking: Array.isArray(specsData.overlooking)
          ? specsData.overlooking
          : [],

        // Legal details
        ownership: specsData.ownership || "freehold",
        approvedBy: Array.isArray(specsData.approvedBy)
          ? specsData.approvedBy
          : [],
        occupancyCertificate: Boolean(specsData.occupancyCertificate),
      },

      // Enhanced Arrays
      amenities: amenitiesData.filter((item) => typeof item === "string"),
      features: featuresData.filter((item) => typeof item === "string"),

      // Enhanced Nearby Places
      nearbyPlaces: Array.isArray(nearbyPlacesData)
        ? nearbyPlacesData.map((item) => {
            if (typeof item === "string") {
              return {
                name: item,
                distance: "",
                distanceInKm: 0,
                type: "restaurant",
                rating: 0,
              };
            }
            return {
              name: item.name || "",
              distance: item.distance || "",
              distanceInKm: Number(item.distanceInKm) || 0,
              type: item.type || "restaurant",
              rating: Number(item.rating) || 0,
            };
          })
        : [],

      // Enhanced Transportation
      transportation: Array.isArray(transportationData)
        ? transportationData.map((item) => {
            if (typeof item === "string") {
              return {
                destination: item,
                time: "",
                timeInMinutes: 0,
                mode: "drive",
                distance: "",
              };
            }
            return {
              destination: item.destination || "",
              time: item.time || "",
              timeInMinutes: Number(item.timeInMinutes) || 0,
              mode: item.mode || "drive",
              distance: item.distance || "",
            };
          })
        : [],

      // Contact & Viewing Information
      contactInfo: {
        showPhone:
          contactInfoData.showPhone !== undefined
            ? contactInfoData.showPhone
            : true,
        showEmail:
          contactInfoData.showEmail !== undefined
            ? contactInfoData.showEmail
            : true,
        preferredContact: contactInfoData.preferredContact || "all",
        viewingSchedule: contactInfoData.viewingSchedule || "appointment-only",
        availableFrom: contactInfoData.availableFrom || undefined,
        availableTill: contactInfoData.availableTill || undefined,
      },

      // **Posted by - using determined user ID**
      postedBy: postedByUserId,
    };

    // Add manual agent info if provided (this will override auto-population)
    if (manualAgentData && manualAgentData.name) {
      propertyData.agentInfo = agentInfo;
    }

    // Handle uploaded images with enhanced structure
    let images = [];
    if (req.files && req.files.length > 0) {
      console.log("🌐 STORAGE CHECK - Processing files:");

      images = req.files.map((file, index) => {
        const isCloudinaryFile =
          file.path && file.path.includes("res.cloudinary.com");

        const imageData = {
          url: isCloudinaryFile ? file.path : `/uploads/${file.filename}`,
          altText: `${title} - Image ${index + 1}`,
          isPrimary: index === 0,
          storage: isCloudinaryFile ? "cloudinary" : "local",
          category: "other",
          caption: "",
        };

        if (!isCloudinaryFile) {
          imageData.filename = file.filename;
        }

        return imageData;
      });

      console.log(`✅ Processed ${images.length} images`);
    }

    propertyData.images = images;

    console.log("🏠 Final property data:", {
      title: propertyData.title,
      type: propertyData.specifications.type,
      category: propertyData.specifications.category,
      price: propertyData.price,
      location: propertyData.location.city,
      assignedTo: postedByUserId,
      userRole: req.user.role,
      imagesCount: propertyData.images.length,
      hasManualAgent: !!(manualAgentData && manualAgentData.name),
    });

    // Create the property
    const property = await Property.create(propertyData);

    // Update agent's performance metrics ONLY for existing users (not manual agents)
    if (!manualAgentData?.name && postedByUserId) {
      const assignedUser = await User.findById(postedByUserId);
      if (assignedUser && assignedUser.role !== "customer") {
        await User.findByIdAndUpdate(postedByUserId, {
          $inc: { "performance.totalPropertiesListed": 1 },
        });
        console.log(
          "📈 Updated performance metrics for agent:",
          assignedUser.name
        );
      }
    }

    res.status(201).json({
      success: true,
      message: manualAgentData?.name
        ? "Property created successfully with manual agent information!"
        : "Property created successfully!",
      property,
      agentType: manualAgentData?.name ? "manual" : "existing",
    });
  } catch (error) {
    console.error("❌ Property creation error:", error);

    // Cleanup uploaded files if property creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (
          file.path &&
          !file.path.includes("cloudinary") &&
          fs.existsSync(file.path)
        ) {
          fs.unlinkSync(file.path);
          console.log(`🗑️ Cleaned up local file: ${file.filename}`);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
      errorDetails:
        process.env.NODE_ENV === "development"
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : undefined,
    });
  }
};
// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
// export const getProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id).populate(
//       "postedBy",
//       "name email phone avatar designation experience languages rating performance"
//     );

//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: "Property not found",
//       });
//     }

//     // Track property view
//     if (req.user) {
//       await PropertyView.create({
//         property: property._id,
//         user: req.user.id,
//         ipAddress: req.ip,
//         userAgent: req.get("User-Agent"),
//       });
//     }

//     res.status(200).json({
//       success: true,
//       property,
//     });
//   } catch (error) {
//     console.error("Error fetching property:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching property",
//       error: error.message,
//     });
//   }
// };
// export const getProperty = async (req, res) => {
//   try {
//     // Use lean() to bypass Mongoose validation and get plain JavaScript object
//     const property = await Property.findById(req.params.id)
//       .populate(
//         "postedBy",
//         "name email phone avatar designation experience languages rating performance"
//       )
//       .lean(); // Convert to plain object to avoid validation errors

//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: "Property not found",
//       });
//     }

//     // ✅ Count view for ALL users (both logged-in and non-logged-in)
//     // Update without validation to avoid schema issues
//     await Property.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { views: 1 } },
//       { runValidators: false } // Disable validation for this update
//     );

//     // ✅ Track detailed property view for logged-in users only
//     if (req.user) {
//       try {
//         await PropertyView.create({
//           property: property._id,
//           user: req.user.id,
//           ipAddress: req.ip,
//           userAgent: req.get("User-Agent"),
//         });
//       } catch (viewError) {
//         console.warn("Failed to track detailed view:", viewError.message);
//         // Continue anyway - don't fail the main request
//       }
//     }

//     res.status(200).json({
//       success: true,
//       property,
//     });
//   } catch (error) {
//     console.error("Error fetching property:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching property",
//       error: error.message,
//     });
//   }
// };
export const getProperty = async (req, res) => {
  try {
    const param = req.params.slug;

    let property;

    // Check if param is a valid MongoDB ObjectId → fetch by ID
    if (/^[0-9a-fA-F]{24}$/.test(param)) {
      property = await Property.findById(param)
        .populate(
          "postedBy",
          "name email phone avatar designation experience languages rating performance"
        )
        .lean();

      // If property found using ID, return it directly for API clients
      if (property) {
        return res.status(200).json({
          success: true,
          property,
        });
      }
    }

    // Otherwise → fetch by slug
    if (!property) {
      property = await Property.findOne({ slug: param })
        .populate(
          "postedBy",
          "name email phone avatar designation experience languages rating performance"
        )
        .lean();
    }

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Count views for everyone (disable validators)
    await Property.findByIdAndUpdate(
      property._id,
      { $inc: { views: 1 } },
      { runValidators: false }
    );

    // Track detailed view (logged-in only)
    if (req.user) {
      try {
        await PropertyView.create({
          property: property._id,
          user: req.user.id,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        });
      } catch (viewError) {
        console.warn("Failed to track detailed view:", viewError.message);
      }
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching property",
      error: error.message,
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      property.postedBy &&
      property.postedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this property",
      });
    }

    // Parse JSON fields safely
    const jsonFields = [
      "location",
      "specifications",
      "manualAgent",
      "amenities",
      "features",
      "nearbyPlaces",
      "transportation",
      "maintenanceCharges",
      "contactInfo",
    ];

    for (const field of jsonFields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          console.warn(`Failed to parse JSON for field ${field}:`, e.message);
        }
      }
    }

    if (req.body.price !== undefined) {
      req.body.price = Number(req.body.price) || 0;
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => {
        if (file.path && file.path.includes("res.cloudinary.com")) {
          return {
            url: file.path,
            altText: `${req.body.title || property.title} - Image ${index + 1}`,
            isPrimary: index === 0,
            storage: "cloudinary",
          };
        } else {
          return {
            url: `/uploads/${file.filename}`,
            altText: `${req.body.title || property.title} - Image ${index + 1}`,
            isPrimary: index === 0,
            storage: "local",
            filename: file.filename,
          };
        }
      });

      req.body.images = [...property.images, ...newImages];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: false,
    }).populate("postedBy", "name email phone avatar designation");

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating property",
      error: error.message,
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Check authorization
    if (
      property.postedBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this property",
      });
    }

    // Delete images
    if (property.images && property.images.length > 0) {
      for (const image of property.images) {
        if (image.storage === "local" && image.filename) {
          const filePath = path.join(process.cwd(), "uploads", image.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted local file: ${image.filename}`);
          }
        }
        // Delete Cloudinary images
        if (
          image.storage === "cloudinary" &&
          image.url &&
          isCloudinaryConfigured
        ) {
          const publicId = getPublicIdFromUrl(image.url);
          if (publicId) {
            try {
              await deleteFromCloudinary(publicId);
              console.log(`🗑️ Deleted Cloudinary image: ${publicId}`);
            } catch (error) {
              console.log(
                "⚠️ Failed to delete Cloudinary image:",
                error.message
              );
            }
          }
        }
      }
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting property",
      error: error.message,
    });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      featured: true,
      status: "available",
      isActive: true,
    })
      .populate("postedBy", "name avatar designation")
      .limit(6)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured properties",
      error: error.message,
    });
  }
};

// @desc    Get properties by agent
// @route   GET /api/properties/agent/:agentId
// @access  Public
export const getAgentProperties = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const properties = await Property.find({
      postedBy: agentId,
      isActive: true,
    })
      .populate("postedBy", "name avatar designation")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments({
      postedBy: agentId,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      properties,
    });
  } catch (error) {
    console.error("Error fetching agent properties:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching agent properties",
      error: error.message,
    });
  }
};

// @desc    Get available agents for property assignment
// @route   GET /api/properties/agents/available
// @access  Private
export const getAvailableAgents = async (req, res) => {
  try {
    const agents = await User.find({
      role: { $in: ["employee", "admin"] },
      isActive: true,
    }).select("name email phone avatar designation experience rating");

    res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    console.error("Error fetching available agents:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching available agents",
      error: error.message,
    });
  }
};


// @desc    Get top 6 featured properties
// @route   GET /api/properties/featured/top
// @access  Public
export const getTopFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      featured: true,
      status: "available",
      isActive: true,
    })
      .populate(
        "postedBy",
        "name email phone avatar designation experience rating"
      )
      .sort({ featuredExpiry: -1, priority: -1, createdAt: -1 })
      .limit(6)
      .lean();

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("❌ Error fetching top featured properties:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching featured properties",
      error: error.message,
    });
  }
};
