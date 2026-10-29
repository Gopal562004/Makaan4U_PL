import mongoose from "mongoose";

const clientInquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["site-visit", "callback", "contact-form", "general-support"],
      default: "contact-form",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Contact phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Property Snapshot (if inquiry is property-specific)
    propertyId: {
      type: String,
      default: "",
    },
    propertyTitle: {
      type: String,
      default: "",
    },
    propertyLocation: {
      type: String,
      default: "",
    },
    propertyPrice: {
      type: String,
      default: "",
    },
    propertyImage: {
      type: String,
      default: "",
    },

    // Site Visit Details
    date: {
      type: String,
      default: "",
    },
    timeSlot: {
      type: String,
      default: "",
    },
    visitType: {
      type: String,
      default: "In-Person Guided Tour",
    },

    // Contact Form / Regional Desk Details
    department: {
      type: String,
      default: "Private Client Advisory",
    },
    city: {
      type: String,
      default: "Mumbai",
    },

    // Message / Special Instructions
    message: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    // Status Tracking
    status: {
      type: String,
      enum: [
        "New",
        "Requested",
        "Pending",
        "Confirmed",
        "Contacted",
        "In Progress",
        "Completed",
        "Resolved",
        "Cancelled",
      ],
      default: "New",
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    // Assigned Regional Advisor
    assignedAgent: {
      name: { type: String, default: "Senior Property Advisor" },
      phone: { type: String, default: "+91 98201 44820" },
      email: { type: String, default: "advisory@makaan4u.com" },
      designation: { type: String, default: "Regional Property Consultant" },
    },

    // Internal Admin Notes & Audit Trail
    adminNotes: [
      {
        text: { type: String, required: true },
        author: { type: String, default: "Admin" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

clientInquirySchema.index({ type: 1, status: 1, createdAt: -1 });

export default mongoose.model("ClientInquiry", clientInquirySchema);
