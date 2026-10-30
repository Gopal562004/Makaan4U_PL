import mongoose from "mongoose";

const companySettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "about_page",
      index: true,
    },
    convictionTagline: {
      type: String,
      default: "Our Founding Conviction",
    },
    convictionTitle: {
      type: String,
      default: "Indian real estate was broken by speculative, phantom listings.",
    },
    convictionSubtitle: {
      type: String,
      default: "We rebuilt the marketplace around forensic proof.",
    },
    convictionDescription: {
      type: String,
      default:
        "For decades, buying property in Mumbai, Bangalore, or Gurgaon meant navigating unverified portal bait, duplicate broker listings, and speculative price inflation. Makaan4U was established by real estate valuers, legal counsels, and product designers with a single standard: zero unverified inventory.",
    },
    pillars: [
      {
        number: { type: String, default: "01" },
        category: { type: String, default: "REGULATORY AUDIT" },
        title: { type: String, default: "State RERA Title Reconciliation" },
        description: {
          type: String,
          default:
            "Before any residential development is approved on Makaan4U, our legal team verifies the promoter's active MahaRERA, KarRERA, or HRERA quarterly compliance reports, confirming that 70% of buyer collections remain ring-fenced within designated escrow accounts.",
        },
      },
      {
        number: { type: String, default: "02" },
        category: { type: String, default: "PHYSICAL AUDIT" },
        title: { type: String, default: "On-Site Measurement & Acoustic Verification" },
        description: {
          type: String,
          default:
            "We physically deploy certified property inspectors to measure usable carpet area in compliance with the statutory RERA definition. We verify floor orientation, cross-ventilation, daylight penetration, and building maintenance fund reserves.",
        },
      },
      {
        number: { type: String, default: "03" },
        category: { type: String, default: "VALUATION SCRUTINY" },
        title: { type: String, default: "Registered Registry Price Calibration" },
        description: {
          type: String,
          default:
            "Our guide valuations reflect genuine sub-registrar stamp duty transaction data, not speculative asking prices inflated by multi-tier broker chains.",
        },
      },
    ],
    footprint: [
      { city: { type: String, default: "Mumbai & MMR" }, localities: { type: String, default: "BKC, Worli, Bandra, Thane" } },
      { city: { type: String, default: "Delhi NCR" }, localities: { type: String, default: "Golf Course Rd, DLF 5, South Delhi" } },
      { city: { type: String, default: "Bangalore" }, localities: { type: String, default: "Indiranagar, Lavelle Rd, Whitefield" } },
      { city: { type: String, default: "Pune" }, localities: { type: String, default: "Koregaon Park, Baner, Kalyani Nagar" } },
      { city: { type: String, default: "Hyderabad" }, localities: { type: String, default: "Jubilee Hills, Kokapet, Gachibowli" } },
      { city: { type: String, default: "Goa" }, localities: { type: String, default: "Assagao, Siolim, Candolim" } },
    ],
    leadershipDeskTitle: {
      type: String,
      default: "Connect with our Leadership Desk",
    },
    leadershipDeskSubtitle: {
      type: String,
      default: "For institutional mandates, family office representation, or developer onboarding.",
    },
  },
  {
    timestamps: true,
  }
);

const CompanySetting =
  mongoose.models.CompanySetting || mongoose.model("CompanySetting", companySettingSchema);

export default CompanySetting;

