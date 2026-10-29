import City from "../models/City.js";
import Property from "../models/Property.js";
import Project from "../models/Project.js";
import Locality from "../models/Locality.js";
import MarketTrend from "../models/MarketTrend.js";
import slugify from "slugify";

// @desc    Get all cities with dynamic listing metrics
// @route   GET /cities
// @access  Public
export const getAllCities = async (req, res) => {
  try {
    let cities = await City.find().sort({ order: 1 }).lean();

    if (!cities || cities.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const enrichedCities = await Promise.all(
      cities.map(async (city) => {
        try {
          const livePropertyCount = await Property.countDocuments({
            $or: [
              { "location.city": { $regex: new RegExp(`^${city.name}$`, "i") } },
              { city: { $regex: new RegExp(`^${city.name}$`, "i") } },
            ],
          });

          const liveProjectCount = await Project.countDocuments({
            city: { $regex: new RegExp(`^${city.name}$`, "i") },
          });

          return {
            ...city,
            id: city.slug,
            totalListings: livePropertyCount > 0 ? livePropertyCount : city.totalListings,
            activeProjects: liveProjectCount > 0 ? liveProjectCount : city.activeProjects,
          };
        } catch {
          return {
            ...city,
            id: city.slug,
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedCities.length,
      data: enrichedCities,
    });
  } catch (error) {
    console.error("❌ Error in getAllCities:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching cities",
      error: error.message,
    });
  }
};

// @desc    Get single city by slug
// @route   GET /cities/:slug
// @access  Public
export const getCityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const city = await City.findOne({
      $or: [{ slug: slug.toLowerCase() }, { name: { $regex: new RegExp(`^${slug}$`, "i") } }],
    }).lean();

    if (!city) {
      return res.status(404).json({
        success: false,
        message: `City with identifier '${slug}' not found`,
      });
    }

    const [cityProjects, cityLocalities, liveCount] = await Promise.all([
      Project.find({ city: { $regex: new RegExp(`^${city.name}$`, "i") } }).lean(),
      Locality.find({ city: { $regex: new RegExp(`^${city.name}$`, "i") } }).lean(),
      Property.countDocuments({
        $or: [
          { "location.city": { $regex: new RegExp(`^${city.name}$`, "i") } },
          { city: { $regex: new RegExp(`^${city.name}$`, "i") } },
        ],
      }),
    ]);

    const result = {
      ...city,
      id: city.slug,
      totalListings: liveCount > 0 ? liveCount : city.totalListings,
      projects: cityProjects.map((p) => ({ ...p, id: p.slug })),
      localities: cityLocalities.map((l) => ({ ...l, id: l.slug })),
    };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in getCityBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching city details",
      error: error.message,
    });
  }
};

// @desc    Create new City (Admin)
// @route   POST /cities
// @access  Private (Admin, Employee)
export const createCity = async (req, res) => {
  try {
    const { name, state, tagline, coverImage, avgPricePerSqFt, growthYoY, description, topLocalities, marketHighlights } = req.body;

    const slug = req.body.slug || slugify(name, { lower: true, strict: true });

    const existing = await City.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `City with slug '${slug}' already exists`,
      });
    }

    const city = await City.create({
      slug,
      name,
      state: state || "India",
      tagline: tagline || "",
      coverImage: coverImage || "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
      avgPricePerSqFt: avgPricePerSqFt || "₹15,000",
      growthYoY: growthYoY || "+10.0%",
      description: description || "",
      topLocalities: Array.isArray(topLocalities) ? topLocalities : (topLocalities ? topLocalities.split(",").map((s) => s.trim()) : []),
      marketHighlights: Array.isArray(marketHighlights) ? marketHighlights : (marketHighlights ? marketHighlights.split("\n").filter(Boolean) : []),
    });

    res.status(201).json({
      success: true,
      data: { ...city.toObject(), id: city.slug },
      message: "City created successfully",
    });
  } catch (error) {
    console.error("❌ Error in createCity:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating city",
      error: error.message,
    });
  }
};

// @desc    Update City (Admin)
// @route   PUT /cities/:id
// @access  Private (Admin, Employee)
export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    let city = await City.findOne({
      $or: [{ slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    const updateData = { ...req.body };
    if (typeof updateData.topLocalities === "string") {
      updateData.topLocalities = updateData.topLocalities.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (typeof updateData.marketHighlights === "string") {
      updateData.marketHighlights = updateData.marketHighlights.split("\n").filter(Boolean);
    }

    city = await City.findByIdAndUpdate(city._id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      data: { ...city.toObject(), id: city.slug },
      message: "City updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in updateCity:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating city",
      error: error.message,
    });
  }
};

// @desc    Delete City (Admin)
// @route   DELETE /cities/:id
// @access  Private (Admin)
export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findOneAndDelete({
      $or: [{ slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteCity:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting city",
      error: error.message,
    });
  }
};

// @desc    Get real-time market trends benchmarks for marquee ticker
// @route   GET /market-trends
// @access  Public
export const getMarketTrends = async (req, res) => {
  try {
    const trends = await MarketTrend.find().sort({ order: 1 }).lean();

    res.status(200).json({
      success: true,
      count: trends.length,
      data: trends,
    });
  } catch (error) {
    console.error("❌ Error in getMarketTrends:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching market trends",
      error: error.message,
    });
  }
};

// @desc    Update or create market trend (Admin)
// @route   PUT /market-trends/:city
// @access  Private (Admin, Employee)
export const updateMarketTrend = async (req, res) => {
  try {
    const { city } = req.params;
    const { avgPrice, yoyGrowth, rentalYield, topMicroMarket } = req.body;

    const trend = await MarketTrend.findOneAndUpdate(
      { city: { $regex: new RegExp(`^${city}$`, "i") } },
      { avgPrice, yoyGrowth, rentalYield, topMicroMarket, updatedAt: new Date() },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: trend,
      message: `Market trend for ${city} updated successfully`,
    });
  } catch (error) {
    console.error("❌ Error in updateMarketTrend:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating market trend",
      error: error.message,
    });
  }
};
