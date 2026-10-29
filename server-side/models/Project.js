import mongoose from "mongoose";

const bhkOptionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    carpetArea: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    developer: {
      type: String,
      required: true,
      trim: true,
    },
    developerSlug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Under Construction", "Ready to Move", "New Launch"],
      default: "Under Construction",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "New Launch",
        "Ready to Move",
        "Under Construction",
        "Ultra-Luxury",
        "Premium Projects",
      ],
      default: "New Launch",
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    startingPrice: {
      type: String,
      required: true,
    },
    startingPriceNumeric: {
      type: Number,
      default: 0,
    },
    configurations: {
      type: String,
      required: true,
    },
    possessionTimeline: {
      type: String,
      required: true,
    },
    reraNumber: {
      type: String,
      required: true,
      trim: true,
    },
    phaseProgress: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    amenities: {
      type: [String],
      default: [],
    },
    bhkOptions: {
      type: [bhkOptionSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.virtual("id").get(function () {
  return this.slug;
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;

