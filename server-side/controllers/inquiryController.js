import ClientInquiry from "../models/ClientInquiry.js";

// @desc    Get all inquiries / visits / leads with filters
// @route   GET /inquiries
// @access  Private (Employee/Admin)
export const getAllInquiries = async (req, res) => {
  try {
    const { type, status, search, limit = 100, page = 1 } = req.query;

    const query = {};

    if (type && type !== "all") {
      query.type = type;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { propertyTitle: regex },
        { city: regex },
        { department: regex },
        { message: regex },
      ];
    }

    const total = await ClientInquiry.countDocuments(query);
    const inquiries = await ClientInquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .limit(parseInt(limit, 10))
      .lean();

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      data: inquiries,
    });
  } catch (error) {
    console.error("❌ Error in getAllInquiries:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching inquiries",
      error: error.message,
    });
  }
};

// @desc    Get single inquiry by ID
// @route   GET /inquiries/:id
// @access  Private (Employee/Admin)
export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await ClientInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("❌ Error in getInquiryById:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching inquiry",
      error: error.message,
    });
  }
};

// @desc    Create new inquiry (Public: site visit, callback, or contact form)
// @route   POST /inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const {
      type = "contact-form",
      name,
      phone,
      email,
      propertyId,
      propertyTitle,
      propertyLocation,
      propertyPrice,
      propertyImage,
      date,
      timeSlot,
      visitType,
      department,
      city,
      message,
      priority = "Medium",
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name and phone number are required",
      });
    }

    // Default status based on inquiry type
    let defaultStatus = "New";
    if (type === "site-visit") defaultStatus = "Requested";
    if (type === "callback") defaultStatus = "New";

    const inquiry = await ClientInquiry.create({
      type,
      name,
      phone,
      email: email || "",
      propertyId: propertyId || "",
      propertyTitle: propertyTitle || "",
      propertyLocation: propertyLocation || "",
      propertyPrice: propertyPrice || "",
      propertyImage: propertyImage || "",
      date: date || "",
      timeSlot: timeSlot || "",
      visitType: visitType || "In-Person Guided Tour",
      department: department || "Private Client Advisory",
      city: city || "Mumbai",
      message: message || "",
      status: defaultStatus,
      priority,
    });

    res.status(201).json({
      success: true,
      message: `${
        type === "site-visit"
          ? "Site visit requested"
          : type === "callback"
          ? "Callback requested"
          : "Inquiry submitted"
      } successfully`,
      data: inquiry,
    });
  } catch (error) {
    console.error("❌ Error in createInquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating inquiry",
      error: error.message,
    });
  }
};

// @desc    Update inquiry status / notes / agent
// @route   PUT /inquiries/:id
// @access  Private (Employee/Admin)
export const updateInquiry = async (req, res) => {
  try {
    const { status, priority, assignedAgent, newNote } = req.body;

    const inquiry = await ClientInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry record not found",
      });
    }

    if (status) inquiry.status = status;
    if (priority) inquiry.priority = priority;
    if (assignedAgent) inquiry.assignedAgent = assignedAgent;

    if (newNote && typeof newNote === "string" && newNote.trim()) {
      inquiry.adminNotes.push({
        text: newNote.trim(),
        author: req.user?.name || "Admin",
        createdAt: new Date(),
      });
    }

    await inquiry.save();

    res.status(200).json({
      success: true,
      message: "Inquiry updated successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("❌ Error in updateInquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating inquiry",
      error: error.message,
    });
  }
};

// @desc    Delete inquiry
// @route   DELETE /inquiries/:id
// @access  Private (Admin)
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await ClientInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteInquiry:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting inquiry",
      error: error.message,
    });
  }
};

// @desc    Get inquiry KPI statistics
// @route   GET /inquiries/stats
// @access  Private (Employee/Admin)
export const getInquiryStats = async (req, res) => {
  try {
    const [total, siteVisits, callbacks, contactForms, pendingVisits, newCallbacks] =
      await Promise.all([
        ClientInquiry.countDocuments(),
        ClientInquiry.countDocuments({ type: "site-visit" }),
        ClientInquiry.countDocuments({ type: "callback" }),
        ClientInquiry.countDocuments({ type: "contact-form" }),
        ClientInquiry.countDocuments({
          type: "site-visit",
          status: { $in: ["Requested", "Pending"] },
        }),
        ClientInquiry.countDocuments({
          type: "callback",
          status: { $in: ["New", "Pending"] },
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        siteVisits,
        callbacks,
        contactForms,
        pendingVisits,
        newCallbacks,
      },
    });
  } catch (error) {
    console.error("❌ Error in getInquiryStats:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching inquiry stats",
      error: error.message,
    });
  }
};
