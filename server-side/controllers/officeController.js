import RegionalOffice from "../models/RegionalOffice.js";

// @desc    Get all regional offices
// @route   GET /regional-offices
// @access  Public
export const getAllOffices = async (req, res) => {
  try {
    const offices = await RegionalOffice.find({ isActive: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: offices.length,
      data: offices.map((o) => ({ ...o, id: o._id.toString() })),
    });
  } catch (error) {
    console.error("❌ Error in getAllOffices:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching regional offices",
      error: error.message,
    });
  }
};

// @desc    Create new regional office
// @route   POST /regional-offices
// @access  Private/Admin
export const createOffice = async (req, res) => {
  try {
    const office = await RegionalOffice.create(req.body);
    res.status(201).json({
      success: true,
      data: { ...office.toObject(), id: office._id.toString() },
      message: "Regional office added successfully",
    });
  } catch (error) {
    console.error("❌ Error in createOffice:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding regional office",
      error: error.message,
    });
  }
};

// @desc    Update regional office
// @route   PUT /regional-offices/:id
// @access  Private/Admin
export const updateOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await RegionalOffice.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Regional office not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
      message: "Regional office updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in updateOffice:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating regional office",
      error: error.message,
    });
  }
};

// @desc    Delete regional office
// @route   DELETE /regional-offices/:id
// @access  Private/Admin
export const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RegionalOffice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Regional office not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Regional desk in '${deleted.city}' removed successfully`,
    });
  } catch (error) {
    console.error("❌ Error in deleteOffice:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting regional office",
      error: error.message,
    });
  }
};

