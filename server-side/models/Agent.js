import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
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
    agency: {
      type: String,
      default: "Makaan4U Advisory Network",
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    reraNo: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    experience: {
      type: String,
      default: "10+ Years in Prime Real Estate",
    },
    areasServed: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: ["English", "Hindi"],
    },
    specializations: {
      type: [String],
      default: ["Luxury Residential", "High-Net-Worth Portfolios"],
    },
    image: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    activeListingsCount: {
      type: Number,
      default: 12,
    },
    totalDealsClosed: {
      type: Number,
      default: 80,
    },
    order: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

agentSchema.virtual("id").get(function () {
  return this.slug;
});

agentSchema.set("toJSON", { virtuals: true });
agentSchema.set("toObject", { virtuals: true });

const Agent = mongoose.models.Agent || mongoose.model("Agent", agentSchema);

export default Agent;

