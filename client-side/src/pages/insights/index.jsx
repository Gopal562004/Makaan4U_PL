import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BookOpen, Clock, ArrowRight, ShieldCheck, TrendingUp, Search } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { INSIGHTS_ARTICLES } from "../../data/propertyData";

const InsightsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Legal & RERA",
    "Market Trends",
    "Investment",
    "Architecture & Design",
    "Home Loans",
    "City Guides"
  ];

  const filteredArticles = INSIGHTS_ARTICLES.filter((art) => {
    if (selectedCategory !== "All" && art.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.author.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const featuredArticle = INSIGHTS_ARTICLES[0];

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
                    src={featuredArticle.author.avatar}
                    alt={featuredArticle.author.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-xs text-[var(--color-foreground)]">{featuredArticle.author.name}</p>
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">{featuredArticle.author.title}</p>
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

        {/* Categories Bar & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--color-border)] py-3 text-xs">
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

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search analysis & articles..."
              className="w-full h-8 pl-8 pr-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[var(--color-subtle)]">
                <img
                  src={art.heroImage}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/75 px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                  {art.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-[var(--color-muted-foreground)]">
                    {art.publishedDate} • {art.readingTime}
                  </span>
                  <Link to={`/insights/${art.slug}`} className="block mt-1">
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs">
                  <span className="text-[11px] text-[var(--color-muted-foreground)]">
                    By {art.author.name}
                  </span>
                  <Link
                    to={`/insights/${art.slug}`}
                    className="font-semibold text-[var(--color-terracotta)] hover:underline"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default InsightsPage;
