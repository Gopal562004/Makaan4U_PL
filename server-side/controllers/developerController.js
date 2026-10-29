import Developer from "../models/Developer.js";
import Project from "../models/Project.js";

// @desc    Get all institutional developers
// @route   GET /developers
// @access  Public
export const getAllDevelopers = async (req, res) => {
  try {
    const developers = await Developer.find().sort({ order: 1, name: 1 }).lean();

    const formatted = developers.map((d) => ({
      ...d,
      id: d.slug,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("❌ Error in getAllDevelopers:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching developers",
      error: error.message,
    });
  }
};

// @desc    Get single developer by slug
// @route   GET /developers/:slug
// @access  Public
export const getDeveloperBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const developer = await Developer.findOne({
      $or: [{ slug: slug.toLowerCase() }, { name: { $regex: new RegExp(`^${slug}$`, "i") } }],
    }).lean();

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: `Developer with identifier '${slug}' not found`,
      });
    }

    const projects = await Project.find({
      developer: { $regex: new RegExp(`^${developer.name}$`, "i") },
    }).lean();

    res.status(200).json({
      success: true,
      data: {
        ...developer,
        id: developer.slug,
        projects: projects.map((p) => ({ ...p, id: p.slug })),
      },
    });
  } catch (error) {
    console.error("❌ Error in getDeveloperBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching developer details",
      error: error.message,
    });
  }
};

