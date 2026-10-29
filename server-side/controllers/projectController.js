import Project from "../models/Project.js";
import Developer from "../models/Developer.js";
import slugify from "slugify";

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

// @desc    Create new Project (Admin)
// @route   POST /projects
// @access  Private (Admin, Employee)
export const createProject = async (req, res) => {
  try {
    const {
      title,
      developer,
      city,
      locality,
      status,
      category,
      startingPrice,
      configurations,
      possessionTimeline,
      reraNumber,
      phaseProgress,
      coverImage,
      description,
      amenities,
    } = req.body;

    const slug = req.body.slug || slugify(title, { lower: true, strict: true });

    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Project with slug '${slug}' already exists`,
      });
    }

    const project = await Project.create({
      slug,
      title,
      developer,
      city,
      locality,
      status: status || "Under Construction",
      category: category || "New Launch",
      startingPrice: startingPrice || "Price on Request",
      configurations: configurations || "3 & 4 BHK Luxury Residences",
      possessionTimeline: possessionTimeline || "Under Construction",
      reraNumber: reraNumber || "Applied",
      phaseProgress: phaseProgress || "Under Construction",
      coverImage: coverImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
      description: description || "",
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(",").map((s) => s.trim()) : []),
    });

    res.status(201).json({
      success: true,
      data: { ...project.toObject(), id: project.slug },
      message: "Project created successfully",
    });
  } catch (error) {
    console.error("❌ Error in createProject:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating project",
      error: error.message,
    });
  }
};

// @desc    Update Project (Admin)
// @route   PUT /projects/:id
// @access  Private (Admin, Employee)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    let project = await Project.findOne({
      $or: [{ slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updateData = { ...req.body };
    if (typeof updateData.amenities === "string") {
      updateData.amenities = updateData.amenities.split(",").map((s) => s.trim()).filter(Boolean);
    }

    project = await Project.findByIdAndUpdate(project._id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      data: { ...project.toObject(), id: project.slug },
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in updateProject:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating project",
      error: error.message,
    });
  }
};

// @desc    Delete Project (Admin)
// @route   DELETE /projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({
      $or: [{ slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteProject:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting project",
      error: error.message,
    });
  }
};
