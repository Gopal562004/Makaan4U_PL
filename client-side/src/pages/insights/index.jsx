import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BookOpen, Clock, ArrowRight, ShieldCheck, TrendingUp, Search } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getAllInsights } from "../../lib/mongo/services/insightService";
import { INSIGHTS_ARTICLES as FALLBACK_INSIGHTS } from "../../data/propertyData";

const InsightsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Legal & RERA",
    "Market Trends",
    "Investment",
    "Architecture & Design",
    "Home Loans",
    "City Guides"
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllInsights()
      .then((data) => {
        if (!isMounted) return;
        if (data?.length) setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const articlesList = articles.length ? articles : FALLBACK_INSIGHTS;

  const filteredArticles = articlesList.filter((art) => {
    if (selectedCategory !== "All" && art.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.author?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const featuredArticle = filteredArticles[0] || articlesList[0];

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>Makaan4U Insights — Indian Real Estate Publication & Legal Research</title>
        <meta
          name="description"
          content="Authoritative legal analysis, RERA compliance checklists, micro-market pricing trends, and architecture commentary from industry leaders."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12 pb-24 lg:pb-16">
        <Breadcrumbs items={[{ label: "Makaan4U Insights" }]} />

        {/* Editorial Heading */}
        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Editorial Publication
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Makaan4U Insights
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            Forensic legal due-diligence, quarterly property price movements, infrastructure catalysts, and design narratives written by legal counsels, chartered valuers, and urban researchers.
          </p>
        </div>

        {/* Featured Story Banner (Publication Lead) */}
        {featuredArticle && (
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all duration-300 p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-3 text-xs">
                <span className="px-2.5 py-0.5 bg-[var(--color-terracotta-subtle)] text-[var(--color-terracotta)] font-semibold rounded-xs uppercase tracking-wider">
                  {featuredArticle.category}
                </span>
                <span className="text-[var(--color-muted-foreground)] font-mono">
                  {featuredArticle.publishedDate} • {featuredArticle.readingTime}
                </span>
              </div>

              <Link to={`/insights/${featuredArticle.slug}`}>
                <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>
              </Link>

              <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center space-x-3">
                  <img
                    src={featuredArticle.author?.avatar}
                    alt={featuredArticle.author?.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-xs text-[var(--color-foreground)]">{featuredArticle.author?.name}</p>
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">{featuredArticle.author?.title || featuredArticle.author?.role}</p>
                  </div>
                </div>

                <Link
                  to={`/insights/${featuredArticle.slug}`}
                  className="inline-flex items-center space-x-1 font-semibold text-xs text-[var(--color-terracotta)] hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 sm:h-80 w-full overflow-hidden rounded-sm bg-[var(--color-subtle)]">
              <Link to={`/insights/${featuredArticle.slug}`} className="block w-full h-full">
                <img
                  src={featuredArticle.heroImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            </div>
          </article>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-sm text-xs">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-[var(--color-foreground)] text-[var(--color-surface)] font-semibold"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-subtle)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal topics, authors..."
              className="w-full h-8 pl-8 pr-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
            />
          </div>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id || art.slug}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[var(--color-subtle)]">
                  <img
                    src={art.heroImage}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 px-2.5 py-1 rounded text-[10px] font-mono text-white tracking-widest uppercase">
                    {art.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-[var(--color-muted-foreground)]">
                    <span>{art.publishedDate}</span>
                    <span>•</span>
                    <span>{art.readingTime}</span>
                  </div>

                  <Link to={`/insights/${art.slug}`}>
                    <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <img
                      src={art.author?.avatar}
                      alt={art.author?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-[var(--color-foreground)] text-[11px] truncate max-w-[130px]">
                      {art.author?.name}
                    </span>
                  </div>

                  <Link
                    to={`/insights/${art.slug}`}
                    className="font-semibold text-[11px] text-[var(--color-terracotta)] hover:underline flex items-center space-x-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8">
            <BookOpen className="w-8 h-8 text-[var(--color-muted-foreground)] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[var(--color-foreground)]">No articles found</p>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Try searching for other legal or market terms.</p>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default InsightsPage;
