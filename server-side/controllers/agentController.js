import Agent from "../models/Agent.js";

// @desc    Get all certified agents
// @route   GET /agents
// @access  Public
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ order: 1, name: 1 }).lean();

    const formatted = agents.map((a) => ({
      ...a,
      id: a.slug,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("❌ Error in getAllAgents:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching agents",
      error: error.message,
    });
  }
};

// @desc    Get single agent by id or slug
// @route   GET /agents/:id
// @access  Public
export const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { name: { $regex: new RegExp(`^${id}$`, "i") } },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
      ],
    }).lean();

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: `Agent with identifier '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...agent,
        id: agent.slug,
      },
    });
  } catch (error) {
    console.error("❌ Error in getAgentById:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching agent details",
      error: error.message,
    });
  }
};

// @desc    Create new agent
// @route   POST /agents
// @access  Private/Admin
export const createAgent = async (req, res) => {
  try {
    const body = req.body;
    let slug = body.slug || body.id;
    if (!slug && body.name) {
      slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }

    const existing = await Agent.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Agent with identifier '${slug}' already exists`,
      });
    }

    const newAgent = await Agent.create({
      ...body,
      slug: slug.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      data: {
        ...newAgent.toObject(),
        id: newAgent.slug,
      },
      message: "Certified Advisor added successfully",
    });
  } catch (error) {
    console.error("❌ Error in createAgent:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating agent",
      error: error.message,
    });
  }
};

// @desc    Update agent
// @route   PUT /agents/:id
// @access  Private/Admin
export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const filter = {
      $or: [
        { slug: id.toLowerCase() },
        { name: { $regex: new RegExp(`^${id}$`, "i") } },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
      ],
    };

    const updated = await Agent.findOneAndUpdate(filter, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Agent '${id}' not found for update`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...updated.toObject(),
        id: updated.slug,
      },
      message: "Certified Advisor profile updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in updateAgent:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating agent",
      error: error.message,
    });
  }
};

// @desc    Delete agent
// @route   DELETE /agents/:id
// @access  Private/Admin
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = {
      $or: [
        { slug: id.toLowerCase() },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
      ],
    };

    const deleted = await Agent.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Agent '${id}' not found for deletion`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Agent '${deleted.name}' deleted successfully`,
    });
  } catch (error) {
    console.error("❌ Error in deleteAgent:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting agent",
      error: error.message,
    });
  }
};

