import CompanySetting from "../models/CompanySetting.js";

// Default content fallback
const defaultCompanyData = {
  key: "about_page",
  convictionTagline: "Our Founding Conviction",
  convictionTitle: "Indian real estate was broken by speculative, phantom listings.",
  convictionSubtitle: "We rebuilt the marketplace around forensic proof.",
  convictionDescription:
    "For decades, buying property in Mumbai, Bangalore, or Gurgaon meant navigating unverified portal bait, duplicate broker listings, and speculative price inflation. Makaan4U was established by real estate valuers, legal counsels, and product designers with a single standard: zero unverified inventory.",
  pillars: [
    {
      number: "01",
      category: "REGULATORY AUDIT",
      title: "State RERA Title Reconciliation",
      description:
        "Before any residential development is approved on Makaan4U, our legal team verifies the promoter's active MahaRERA, KarRERA, or HRERA quarterly compliance reports, confirming that 70% of buyer collections remain ring-fenced within designated escrow accounts.",
    },
    {
      number: "02",
      category: "PHYSICAL AUDIT",
      title: "On-Site Measurement & Acoustic Verification",
      description:
        "We physically deploy certified property inspectors to measure usable carpet area in compliance with the statutory RERA definition. We verify floor orientation, cross-ventilation, daylight penetration, and building maintenance fund reserves.",
    },
    {
      number: "03",
      category: "VALUATION SCRUTINY",
      title: "Registered Registry Price Calibration",
      description:
        "Our guide valuations reflect genuine sub-registrar stamp duty transaction data, not speculative asking prices inflated by multi-tier broker chains.",
    },
  ],
  footprint: [
    { city: "Mumbai & MMR", localities: "BKC, Worli, Bandra, Thane" },
    { city: "Delhi NCR", localities: "Golf Course Rd, DLF 5, South Delhi" },
    { city: "Bangalore", localities: "Indiranagar, Lavelle Rd, Whitefield" },
    { city: "Pune", localities: "Koregaon Park, Baner, Kalyani Nagar" },
    { city: "Hyderabad", localities: "Jubilee Hills, Kokapet, Gachibowli" },
    { city: "Goa", localities: "Assagao, Siolim, Candolim" },
  ],
  leadershipDeskTitle: "Connect with our Leadership Desk",
  leadershipDeskSubtitle: "For institutional mandates, family office representation, or developer onboarding.",
};

// @desc    Get company & trust settings (About page content)
// @route   GET /company-settings
// @access  Public
export const getCompanySettings = async (req, res) => {
  try {
    let setting = await CompanySetting.findOne({ key: "about_page" }).lean();

    if (!setting) {
      setting = await CompanySetting.create(defaultCompanyData);
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error("❌ Error in getCompanySettings:", error);
    res.status(200).json({
      success: true,
      data: defaultCompanyData,
      warning: "Loaded default offline structure",
    });
  }
};

// @desc    Update company & trust settings
// @route   PUT /company-settings
// @access  Private/Admin
export const updateCompanySettings = async (req, res) => {
  try {
    const updated = await CompanySetting.findOneAndUpdate(
      { key: "about_page" },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Company & Trust narrative updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in updateCompanySettings:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating company settings",
      error: error.message,
    });
  }
};

