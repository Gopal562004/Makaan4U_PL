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

// @desc    Get single developer by slug or id
// @route   GET /developers/:slug
// @access  Public
export const getDeveloperBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const developer = await Developer.findOne({
      $or: [
        { slug: slug.toLowerCase() },
        { name: { $regex: new RegExp(`^${slug}$`, "i") } },
        ...(slug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: slug }] : []),
      ],
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

// @desc    Create a new developer
// @route   POST /developers
// @access  Private/Admin
export const createDeveloper = async (req, res) => {
  try {
    const body = req.body;
    let slug = body.slug || body.id;
    if (!slug && body.name) {
      slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }

    const existing = await Developer.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Developer with slug '${slug}' already exists`,
      });
    }

    const newDev = await Developer.create({
      ...body,
      slug: slug.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      data: {
        ...newDev.toObject(),
        id: newDev.slug,
      },
      message: "Developer profile created successfully",
    });
  } catch (error) {
    console.error("❌ Error in createDeveloper:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating developer",
      error: error.message,
    });
  }
};

// @desc    Update developer
// @route   PUT /developers/:id
// @access  Private/Admin
export const updateDeveloper = async (req, res) => {
  try {
    const { slug } = req.params;
    const body = req.body;

    const filter = {
      $or: [
        { slug: slug.toLowerCase() },
        { name: { $regex: new RegExp(`^${slug}$`, "i") } },
        ...(slug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: slug }] : []),
      ],
    };

    const updated = await Developer.findOneAndUpdate(filter, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Developer '${slug}' not found for update`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...updated.toObject(),
        id: updated.slug,
      },
      message: "Developer profile updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in updateDeveloper:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating developer",
      error: error.message,
    });
  }
};

// @desc    Delete developer
// @route   DELETE /developers/:id
// @access  Private/Admin
export const deleteDeveloper = async (req, res) => {
  try {
    const { slug } = req.params;
    const filter = {
      $or: [
        { slug: slug.toLowerCase() },
        ...(slug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: slug }] : []),
      ],
    };

    const deleted = await Developer.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Developer '${slug}' not found for deletion`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Developer '${deleted.name}' deleted successfully`,
    });
  } catch (error) {
    console.error("❌ Error in deleteDeveloper:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting developer",
      error: error.message,
    });
  }
};
