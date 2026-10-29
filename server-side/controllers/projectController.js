import Project from "../models/Project.js";
import Developer from "../models/Developer.js";

// @desc    Get all developer projects with flexible filtering
// @route   GET /projects
// @access  Public
export const getAllProjects = async (req, res) => {
  try {
    const { category, city, status, search, developer, featured, limit } = req.query;

    const query = {};

    if (category && category !== "All") {
      query.$or = [{ category }, { status: category }];
    }

    if (city && city !== "All") {
      query.city = { $regex: new RegExp(`^${city}$`, "i") };
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (developer && developer !== "All") {
      query.developer = { $regex: new RegExp(developer, "i") };
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { developer: regex },
        { locality: regex },
        { city: regex },
        { reraNumber: regex },
      ];
    }

    let projectQuery = Project.find(query).sort({ order: 1, createdAt: -1 });

    if (limit) {
      projectQuery = projectQuery.limit(parseInt(limit, 10));
    }

    const projects = await projectQuery.lean();

    const formattedProjects = projects.map((p) => ({
      ...p,
      id: p.slug,
    }));

    res.status(200).json({
      success: true,
      count: formattedProjects.length,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("❌ Error in getAllProjects:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching projects",
      error: error.message,
    });
  }
};

// @desc    Get single project dossier by slug
// @route   GET /projects/:slug
// @access  Public
export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({
      $or: [{ slug: slug.toLowerCase() }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with identifier '${slug}' not found`,
      });
    }

    let developerInfo = null;
    if (project.developer) {
      developerInfo = await Developer.findOne({
        name: { $regex: new RegExp(`^${project.developer}$`, "i") },
      }).lean();
    }

    res.status(200).json({
      success: true,
      data: {
        ...project,
        id: project.slug,
        developerDetails: developerInfo ? { ...developerInfo, id: developerInfo.slug } : null,
      },
    });
  } catch (error) {
    console.error("❌ Error in getProjectBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching project dossier",
      error: error.message,
    });
  }
};

