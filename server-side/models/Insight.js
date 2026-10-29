import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "Real Estate Analyst" },
    avatar: { type: String },
  },
  { _id: false }
);

const insightSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      enum: [
        "Legal & RERA",
        "Market Trends",
        "Investment",
        "Architecture & Design",
        "Home Loans",
        "City Guides",
      ],
      default: "Market Trends",
    },
    publishedDate: {
      type: String,
      required: true,
    },
    readingTime: {
      type: String,
      required: true,
    },
    author: {
      type: authorSchema,
      required: true,
    },
    heroImage: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
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

insightSchema.virtual("id").get(function () {
  return this.slug;
});

insightSchema.set("toJSON", { virtuals: true });
insightSchema.set("toObject", { virtuals: true });

const Insight = mongoose.models.Insight || mongoose.model("Insight", insightSchema);

export default Insight;

