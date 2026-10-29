import mongoose from "mongoose";

const localitySchema = new mongoose.Schema(
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
    city: {
      type: String,
      required: true,
      trim: true,
    },
    avgPrice: {
      type: String,
      required: true,
    },
    avgPriceNumeric: {
      type: Number,
      default: 0,
    },
    growthRate: {
      type: String,
      required: true,
    },
    rentalYield: {
      type: String,
      required: true,
    },
    connectivityScore: {
      type: String,
      default: "9.2/10",
    },
    description: {
      type: String,
      required: true,
    },
    metroLines: {
      type: [String],
      default: [],
    },
    topProjects: {
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

localitySchema.virtual("id").get(function () {
  return this.slug;
});

localitySchema.set("toJSON", { virtuals: true });
localitySchema.set("toObject", { virtuals: true });

const Locality = mongoose.models.Locality || mongoose.model("Locality", localitySchema);

export default Locality;

