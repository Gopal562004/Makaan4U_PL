import Insight from "../models/Insight.js";

// @desc    Get all insights articles with filtering
// @route   GET /insights
// @access  Public
export const getAllInsights = async (req, res) => {
  try {
    const { category, search, featured, limit } = req.query;

    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { excerpt: regex },
        { tags: regex },
        { "author.name": regex },
      ];
    }

    let insightQuery = Insight.find(query).sort({ order: 1, createdAt: -1 });

    if (limit) {
      insightQuery = insightQuery.limit(parseInt(limit, 10));
    }

    const articles = await insightQuery.lean();

    const formatted = articles.map((a) => ({
      ...a,
      id: a.slug,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("❌ Error in getAllInsights:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching insights articles",
      error: error.message,
    });
  }
};

// @desc    Get single insight article by slug
// @route   GET /insights/:slug
// @access  Public
export const getInsightBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Insight.findOneAndUpdate(
      {
        $or: [{ slug: slug.toLowerCase() }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
      },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: `Insight article with identifier '${slug}' not found`,
      });
    }

    // Related articles
    const related = await Insight.find({
      category: article.category,
      slug: { $ne: article.slug },
    })
      .limit(3)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...article,
        id: article.slug,
        relatedArticles: related.map((r) => ({ ...r, id: r.slug })),
      },
    });
  } catch (error) {
    console.error("❌ Error in getInsightBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching article details",
      error: error.message,
    });
  }
};

