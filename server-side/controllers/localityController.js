import Locality from "../models/Locality.js";

// @desc    Get all localities
// @route   GET /localities
// @access  Public
export const getAllLocalities = async (req, res) => {
  try {
    const { city, search, limit } = req.query;

    const query = {};

    if (city && city !== "All") {
      query.city = { $regex: new RegExp(`^${city}$`, "i") };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { city: regex }, { description: regex }];
    }

    let localityQuery = Locality.find(query).sort({ order: 1, name: 1 });

    if (limit) {
      localityQuery = localityQuery.limit(parseInt(limit, 10));
    }

    const localities = await localityQuery.lean();

    const formatted = localities.map((l) => ({
      ...l,
      id: l.slug,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("❌ Error in getAllLocalities:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching localities",
      error: error.message,
    });
  }
};

// @desc    Get single locality by slug
// @route   GET /localities/:slug
// @access  Public
export const getLocalityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const locality = await Locality.findOne({
      $or: [{ slug: slug.toLowerCase() }, { name: { $regex: new RegExp(`^${slug}$`, "i") } }],
    }).lean();

    if (!locality) {
      return res.status(404).json({
        success: false,
        message: `Locality with identifier '${slug}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...locality,
        id: locality.slug,
      },
    });
  } catch (error) {
    console.error("❌ Error in getLocalityBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching locality details",
      error: error.message,
    });
  }
};

