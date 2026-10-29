import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    avgPricePerSqFt: {
      type: String,
      required: true,
    },
    avgPriceNumeric: {
      type: Number,
      default: 0,
    },
    growthYoY: {
      type: String,
      required: true,
    },
    growthNumeric: {
      type: Number,
      default: 0,
    },
    totalListings: {
      type: Number,
      default: 0,
    },
    activeProjects: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    topLocalities: {
      type: [String],
      default: [],
    },
    marketHighlights: {
      type: [String],
      default: [],
    },
    tier: {
      type: String,
      default: "Tier-1",
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

// Virtual for id
citySchema.virtual("id").get(function () {
  return this.slug;
});

citySchema.set("toJSON", { virtuals: true });
citySchema.set("toObject", { virtuals: true });

const City = mongoose.models.City || mongoose.model("City", citySchema);

export default City;

