import mongoose from "mongoose";

const developerSchema = new mongoose.Schema(
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
    established: {
      type: String, // Can be "1990" or number
      required: true,
    },
    headquarters: {
      type: String,
      required: true,
      trim: true,
    },
    totalDeliveredSqFt: {
      type: String,
      default: "10M+ sq.ft",
    },
    activeProjectsCount: {
      type: Number,
      default: 0,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    reraCompliance: {
      type: String,
      default: "100% RERA Registered",
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    ongoingProjects: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featuredProjects: {
      type: [String],
      default: [],
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

developerSchema.virtual("id").get(function () {
  return this.slug;
});

developerSchema.set("toJSON", { virtuals: true });
developerSchema.set("toObject", { virtuals: true });

const Developer = mongoose.models.Developer || mongoose.model("Developer", developerSchema);

export default Developer;
