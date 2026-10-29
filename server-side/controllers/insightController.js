import Insight from "../models/Insight.js";
import slugify from "slugify";

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

// @desc    Create new Insight Article (Admin)
// @route   POST /insights
// @access  Private (Admin, Employee)
export const createInsight = async (req, res) => {
  try {
    const { title, category, publishedDate, readingTime, author, heroImage, excerpt, content, tags } = req.body;

    const slug = req.body.slug || slugify(title, { lower: true, strict: true });

    const existing = await Insight.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Article with slug '${slug}' already exists`,
      });
    }

    const article = await Insight.create({
      slug,
      title,
      category: category || "Market Trends",
      publishedDate: publishedDate || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readingTime: readingTime || "5 min read",
      author: author || { name: req.user?.name || "Makaan4U Intelligence", role: "Real Estate Analyst" },
      heroImage: heroImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
      excerpt: excerpt || "",
      content: content || "",
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t) => t.trim()) : []),
    });

    res.status(201).json({
      success: true,
      data: { ...article.toObject(), id: article.slug },
      message: "Insight article published successfully",
    });
  } catch (error) {
    console.error("❌ Error in createInsight:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating insight article",
      error: error.message,
    });
  }
};

// @desc    Update Insight Article (Admin)
// @route   PUT /insights/:id
// @access  Private (Admin, Employee)
export const updateInsight = async (req, res) => {
  try {
    const { id } = req.params;
    let article = await Insight.findOne({
      $or: [{ slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const updateData = { ...req.body };
    if (typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    article = await Insight.findByIdAndUpdate(article._id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      data: { ...article.toObject(), id: article.slug },
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in updateInsight:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating article",
      error: error.message,
    });
  }
};

// @desc    Delete Insight Article (Admin)
// @route   DELETE /insights/:id
// @access  Private (Admin)
export const deleteInsight = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Insight.findOneAndDelete({
      $or: [{ slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteInsight:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting article",
      error: error.message,
    });
  }
};
