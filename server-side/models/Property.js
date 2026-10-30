import mongoose from "mongoose";
import slugify from "slugify";
import { generateSitemap } from "../scripts/generateSitemap.js";
import "./User.js";

const propertySchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Please provide a property title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
      default: "New Property",
    },
    description: {
      type: String,
      required: [true, "Please provide a property description"],
      maxlength: [5000, "Description cannot be more than 5000 characters"],
      default: "Property description",
    },

    // Pricing & Financial Details
    price: {
      type: Number,
      required: [true, "Please provide a property price"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    priceNegotiable: {
      type: Boolean,
      default: false,
    },
    maintenanceCharges: {
      amount: { type: Number, default: 0 },
      period: {
        type: String,
        enum: ["monthly", "quarterly", "yearly"],
        default: "monthly",
      },
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    bookingAmount: {
      type: Number,
      default: 0,
    },

    // Enhanced Location Information
    location: {
      address: {
        type: String,
        required: true,
        default: "Address not specified",
      },
      city: {
        type: String,
        required: true,
        default: "City not specified",
      },
      state: {
        type: String,
        required: true,
        default: "State not specified",
      },
      pincode: {
        type: String,
        required: true,
        default: "000000",
      },
      locality: {
        type: String,
        default: "",
      },
      landmark: {
        type: String,
        default: "",
      },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        accuracy: {
          type: String,
          enum: ["exact", "approximate", "neighborhood"],
          default: "approximate",
        },
      },
      googlePlaceId: {
        type: String,
        default: "",
      },
    },

    // Status & Features
    status: {
      type: String,
      enum: [
        "available",
        "sold",
        "rented",
        "under-maintenance",
        "under-construction",
        "resale",
      ],
      default: "available",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "premium"],
      default: "medium",
    },

    // Enhanced Specifications
    specifications: {
      // Basic specs
      bedrooms: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
      balconies: { type: Number, default: 0 },
      area: { type: Number, default: 500 },
      areaUnit: {
        type: String,
        enum: ["sqft", "sqm", "sqyd", "acre", "hectare"],
        default: "sqft",
      },
      carpetArea: { type: Number, default: 0 },
      builtUpArea: { type: Number, default: 0 },
      superBuiltUpArea: { type: Number, default: 0 },

      // Property type
      type: {
        type: String,
        enum: [
          "apartment",
          "independent-house",
          "villa",
          "studio-apartment",
          "penthouse",
          "duplex",
          "farm-house",
          "plot",
          "commercial-office",
          "commercial-shop",
          "commercial-warehouse",
          "industrial",
          "agricultural-land",
          "hotel-resort",
        ],
        default: "apartment",
      },
      category: {
        type: String,
        enum: ["residential", "commercial", "industrial", "agricultural"],
        default: "residential",
      },

      // Construction details
      builtYear: { type: String, default: "" },
      ageOfConstruction: { type: String, default: "" },
      constructionStatus: {
        type: String,
        enum: ["ready-to-move", "under-construction", "new-launch", "resale"],
        default: "ready-to-move",
      },
      possessionDate: { type: Date },

      // Layout & structure
      floor: { type: Number, default: 1 },
      totalFloors: { type: Number, default: 1 },
      facing: {
        type: String,
        enum: [
          "north",
          "south",
          "east",
          "west",
          "north-east",
          "north-west",
          "south-east",
          "south-west",
        ],
        default: "north",
      },
      furnishing: {
        type: String,
        enum: ["unfurnished", "semi-furnished", "fully-furnished"],
        default: "unfurnished",
      },

      // Additional features
      parking: {
        type: String,
        default: "none",
        trim: true,
      },
      parkingCount: { type: Number, default: 0 },
      lift: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      waterSupply: {
        type: String,
        default: "corporation",
      },
      overlooking: [
        {
          type: String,
          trim: true,
        },
      ],

      // Legal details
      ownership: {
        type: String,
        default: "freehold",
      },
      approvedBy: [
        {
          type: String,
          trim: true,
        },
      ],
      occupancyCertificate: { type: Boolean, default: false },
    },

    // Enhanced Amenities (Accepts standard or custom amenities)
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    // Property Features (Accepts standard or custom features)
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // Enhanced Media
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, default: "Property image" },
        isPrimary: { type: Boolean, default: false },
        storage: {
          type: String,
          enum: ["cloudinary", "local"],
          default: "local",
        },
        filename: String,
        category: {
          type: String,
          enum: [
            "exterior",
            "interior",
            "bedroom",
            "bathroom",
            "kitchen",
            "living-room",
            "garden",
            "amenities",
            "floor-plan",
            "location",
            "other",
          ],
          default: "other",
        },
        caption: { type: String, default: "" },
      },
    ],

    videos: [
      {
        url: { type: String },
        thumbnail: { type: String },
        duration: { type: String },
        type: {
          type: String,
          enum: ["walkthrough", "drone", "neighborhood", "other"],
        },
        caption: { type: String, default: "" },
      },
    ],

    floorPlans: [
      {
        url: { type: String },
        title: { type: String },
        type: { type: String, enum: ["2d", "3d", "structural"] },
        area: { type: Number },
        caption: { type: String, default: "" },
      },
    ],

    // Nearby Places & Connectivity
    nearbyPlaces: [
      {
        name: { type: String, required: true },
        distance: { type: String, default: "" },
        distanceInKm: { type: Number, default: 0 },
        type: {
          type: String,
          enum: [
            "metro-station",
            "bus-stop",
            "railway-station",
            "airport",
            "shopping-mall",
            "supermarket",
            "hospital",
            "clinic",
            "school",
            "college",
            "university",
            "bank",
            "atm",
            "restaurant",
            "cafe",
            "park",
            "gym",
            "movie-theater",
            "police-station",
            "fire-station",
            "post-office",
          ],
          default: "restaurant",
        },
        rating: { type: Number, min: 0, max: 5, default: 0 },
      },
    ],

    // Transportation
    transportation: [
      {
        destination: { type: String, required: true },
        time: { type: String, default: "" },
        timeInMinutes: { type: Number, default: 0 },
        mode: {
          type: String,
          enum: ["drive", "walk", "public-transport", "metro", "bus"],
          default: "drive",
        },
        distance: { type: String, default: "" },
      },
    ],

    // Enhanced Agent Information
    agentInfo: {
      name: { type: String, default: "Agent" },
      email: { type: String, default: "agent@example.com" },
      phone: { type: String, default: "0000000000" },
      alternatePhone: { type: String, default: "" },
      designation: { type: String, default: "Property Consultant" },
      company: { type: String, default: "" },
      avatar: { type: String, default: "" },
      experience: { type: String, default: "0+" },
      languages: { type: [String], default: ["English", "Hindi"] },
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      propertiesSold: { type: Number, default: 0 },
      responseTime: { type: String, default: "" },
      availability: {
        type: String,
        enum: ["immediate", "within-24h", "within-48h", "weekdays", "weekends"],
        default: "within-24h",
      },
      isManualAgent: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
    },

    // Contact & Viewing Information
    contactInfo: {
      showPhone: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: true },
      preferredContact: {
        type: String,
        enum: ["phone", "email", "whatsapp", "all"],
        default: "all",
      },
      viewingSchedule: {
        type: String,
        enum: [
          "flexible",
          "appointment-only",
          "weekdays",
          "weekends",
          "specific-times",
        ],
        default: "appointment-only",
      },
      availableFrom: { type: Date },
      availableTill: { type: Date },
    },

    // System Fields
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    propertyId: { type: String, unique: true },
    listedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "under-review"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    featuredExpiry: { type: Date },
    priorityExpiry: { type: Date },

    // SEO & Marketing
    slug: { type: String, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],

    // Analytics
    lastViewed: { type: Date },
    popularScore: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for property age
propertySchema.virtual("propertyAge").get(function () {
  if (this.specifications.builtYear) {
    const builtYear = parseInt(this.specifications.builtYear);
    if (!isNaN(builtYear)) {
      return new Date().getFullYear() - builtYear;
    }
  }
  return null;
});

// Virtual for price per sqft
propertySchema.virtual("pricePerSqft").get(function () {
  if (this.price && this.specifications.area) {
    return Math.round(this.price / this.specifications.area);
  }
  return null;
});

// Auto-generate property ID and handle agent info
propertySchema.pre("save", async function (next) {
  if (!this.propertyId) {
    const count = await mongoose.model("Property").countDocuments();
    this.propertyId = `RC${String(count + 1).padStart(6, "0")}`;
  }

  // Generate slug from title
  // if (this.isModified("title") && !this.slug) {
  //   this.slug = this.title
  //     .toLowerCase()
  //     .replace(/[^a-z0-9 -]/g, "")
  //     .replace(/\s+/g, "-")
  //     .replace(/-+/g, "-")
  //     .substring(0, 100);
  // }

  // // Update lastUpdated
  // this.lastUpdated = new Date();
  if (
    this.isModified("title") ||
    this.isModified("location.city") ||
    !this.slug
  ) {
    const titlePart = slugify(this.title || "property", {
      lower: true,
      strict: true,
    });

    const cityPart = this.location?.city
      ? slugify(this.location.city, { lower: true, strict: true })
      : "";

    let baseSlug = cityPart ? `${titlePart}-in-${cityPart}` : titlePart;

    let slug = baseSlug;
    let counter = 1;

    const Property = mongoose.model("Property");

    // Ensure uniqueness
    while (await Property.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Update lastUpdated
  this.lastUpdated = new Date();

  // Only auto-populate agentInfo if it's NOT a manual agent and postedBy exists
  if (
    !this.agentInfo.isManualAgent &&
    this.postedBy &&
    (this.isModified("postedBy") ||
      !this.agentInfo.name ||
      this.agentInfo.name === "Agent")
  ) {
    try {
      const User = mongoose.model("User");
      const agent = await User.findById(this.postedBy);
      if (agent) {
        this.agentInfo = {
          name: agent.name || "Agent",
          email: agent.email || "agent@example.com",
          phone: agent.phone || "0000000000",
          designation: agent.designation || "Property Consultant",
          company: agent.company || "",
          avatar: agent.avatar || "",
          experience: agent.experience ? `${agent.experience}+` : "0+",
          languages: agent.languages || ["English", "Hindi"],
          rating: agent.rating?.average || 0,
          reviewCount: agent.rating?.totalReviews || 0,
          propertiesSold: agent.performance?.totalPropertiesSold || 0,
          responseTime: agent.responseTime || "",
          availability: agent.availability || "within-24h",
          verified: agent.verified || false,
          isManualAgent: false,
        };
      }
    } catch (error) {
      console.log("Agent info population failed:", error.message);
    }
  }
  next();
});

// Indexes for better performance
propertySchema.index({ "location.city": 1 });
propertySchema.index({ "location.coordinates": "2dsphere" });
propertySchema.index({ price: 1 });
propertySchema.index({ "specifications.type": 1 });
propertySchema.index({ "specifications.bedrooms": 1 });
propertySchema.index({ "specifications.bathrooms": 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ featured: 1 });
propertySchema.index({ priority: 1 });
propertySchema.index({ postedBy: 1 });
propertySchema.index({ isActive: 1 });
propertySchema.index({ isVerified: 1 });
propertySchema.index({ listedDate: -1 });
propertySchema.index({ views: -1 });
propertySchema.index({ slug: 1 });
propertySchema.index({ "specifications.constructionStatus": 1 });
propertySchema.index({ "specifications.furnishing": 1 });

// Compound indexes for common queries
propertySchema.index({
  "location.city": 1,
  "specifications.type": 1,
  price: 1,
});
propertySchema.index({
  "location.city": 1,
  "specifications.bedrooms": 1,
  "specifications.bathrooms": 1,
});

// Post-save hook to regenerate sitemap


// ⭐ AUTO SITEMAP UPDATE HOOKS
propertySchema.post("save", async function () {
  await generateSitemap();
});

propertySchema.post("findOneAndUpdate", async function () {
  await generateSitemap();
});

propertySchema.post("findOneAndDelete", async function () {
  await generateSitemap();
});

export default mongoose.model("Property", propertySchema);