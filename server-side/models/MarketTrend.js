import mongoose from "mongoose";

const marketTrendSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avgPrice: {
      type: Number,
      required: true,
    },
    yoyGrowth: {
      type: Number,
      required: true,
    },
    rentalYield: {
      type: Number,
      default: 3.8,
    },
    topMicroMarket: {
      type: String,
      default: "",
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

const MarketTrend =
  mongoose.models.MarketTrend ||
  mongoose.model("MarketTrend", marketTrendSchema);

export default MarketTrend;

