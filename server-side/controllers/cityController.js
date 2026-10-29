import City from "../models/City.js";
import Property from "../models/Property.js";
import Project from "../models/Project.js";
import Locality from "../models/Locality.js";
import MarketTrend from "../models/MarketTrend.js";

// @desc    Get all cities with dynamic listing metrics
// @route   GET /cities
// @access  Public
export const getAllCities = async (req, res) => {
  try {
    let cities = await City.find().sort({ order: 1 }).lean();

    // If database is empty, return empty array (or seed triggered)
    if (!cities || cities.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Dynamically compute real-time property counts from the Property collection
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

    // Attach real projects and localities for this city
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

