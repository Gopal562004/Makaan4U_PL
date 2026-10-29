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
      type: Number,
      required: true,
    },
    headquarters: {
      type: String,
      required: true,
      trim: true,
    },
    totalDeliveredSqFt: {
      type: String,
      required: true,
    },
    activeProjectsCount: {
      type: Number,
      default: 0,
    },
    experienceYears: {
      type: Number,
      default: 0,
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

