import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  BookOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Search,
  ArrowUpRight,
  RefreshCw,
  Radio,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getAllInsights } from "../../lib/mongo/services/insightService";
import { getRealEstateNews } from "../../lib/mongo/services/newsService";
import { INSIGHTS_ARTICLES as FALLBACK_INSIGHTS } from "../../data/propertyData";

const ITEMS_PER_PAGE = 9;

// Default fallback image if external publisher image fails to load
const FALLBACK_ARTICLE_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80";

const InsightsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gridTopRef = useRef(null);

  // URL state
  const categoryParam = searchParams.get("category");
  const tabParam = searchParams.get("tab");
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const searchParam = searchParams.get("search") || "";

  const initialCategory = categoryParam || (tabParam === "live" ? "Live Wire" : "All");
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [articles, setArticles] = useState([]);
  const [liveNews, setLiveNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);
  const [newsSourceLabel, setNewsSourceLabel] = useState("Live Real Estate Wire");

  const categories = [
    "All",
    "Live Wire",
    "Legal & RERA",
    "Market Trends",
    "Investment",
    "Architecture & Design",
    "Home Loans",
    "City Guides"
  ];

  // Fetch in-house editorial publications and live real estate news
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      getAllInsights(),
      getRealEstateNews()
    ]).then(([insightsResult, newsResult]) => {
      if (!isMounted) return;

      if (insightsResult.status === "fulfilled" && insightsResult.value?.length) {
        setArticles(insightsResult.value);
      }

      if (newsResult.status === "fulfilled" && newsResult.value?.length) {
        setLiveNews(newsResult.value);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync category or tab URL changes
  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    } else if (tabParam === "live" && selectedCategory !== "Live Wire") {
      setSelectedCategory("Live Wire");
    }
  }, [categoryParam, tabParam]);

  // Handle manual live news refresh
  const handleRefreshNews = async () => {
    try {
      setIsRefreshingNews(true);
      const freshNews = await getRealEstateNews({ refresh: "true" });
      if (freshNews && freshNews.length) {
        setLiveNews(freshNews);
        setNewsSourceLabel("Updated Just Now");
        setTimeout(() => setNewsSourceLabel("Live Real Estate Wire"), 4000);
      }
    } catch (err) {
      console.warn("Manual refresh error:", err);
    } finally {
      setIsRefreshingNews(false);
    }
  };

  const inHouseList = useMemo(() => {
    return (articles.length ? articles : FALLBACK_INSIGHTS).map((art) => ({
      ...art,
      isLiveNews: false,
      url: `/insights/${art.slug}`,
      displayDate: art.publishedDate || "Recently Published",
      sourceName: "Makaan4U Editorial",
      heroImg: art.heroImage || FALLBACK_ARTICLE_IMG
    }));
  }, [articles]);

  const externalNewsList = useMemo(() => {
    return liveNews.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      slug: item.id,
      category: item.category || "Market Trends",
      readingTime: item.readTime || "4 min read",
      displayDate: item.date ? new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Today",
      author: item.author || {
        name: item.source || "News Bureau",
        role: "Market Analyst",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.source || "News")}&background=AA4824&color=fff`
      },
      heroImg: item.image || FALLBACK_ARTICLE_IMG,
      isLiveNews: true,
      url: item.url,
      sourceName: item.source || "External Wire",
      featured: item.featured
    }));
  }, [liveNews]);

  // Combine or filter depending on category
  const combinedArticles = useMemo(() => {
    if (selectedCategory === "Live Wire") {
      return externalNewsList;
    }
    if (selectedCategory === "All") {
      return [...externalNewsList.slice(0, 4), ...inHouseList, ...externalNewsList.slice(4)];
    }
    const inHouseFiltered = inHouseList.filter((art) => art.category?.toLowerCase() === selectedCategory.toLowerCase());
    const newsFiltered = externalNewsList.filter((art) => art.category?.toLowerCase() === selectedCategory.toLowerCase());
    return [...inHouseFiltered, ...newsFiltered];
  }, [selectedCategory, inHouseList, externalNewsList]);

  // Filter with search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return combinedArticles;
    const q = searchQuery.toLowerCase();
    return combinedArticles.filter((art) => (
      art.title?.toLowerCase().includes(q) ||
      art.excerpt?.toLowerCase().includes(q) ||
      art.author?.name?.toLowerCase().includes(q) ||
      art.sourceName?.toLowerCase().includes(q)
    ));
  }, [combinedArticles, searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedArticles = useMemo(() => {
    const start = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, validPage]);

  // Handle page change with SEO-friendly URL update
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    setSearchParams(params);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle category change
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (cat === "All") {
      params.delete("category");
      params.delete("tab");
    } else if (cat === "Live Wire") {
      params.set("tab", "live");
      params.delete("category");
    } else {
      params.set("category", cat);
      params.delete("tab");
    }
    setSearchParams(params);
  };

  // Handle search query change
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const featuredArticle = filteredArticles[0] || inHouseList[0];
  const latestLiveItem = externalNewsList[0];

  // Dynamic SEO variables
  const canonicalUrl = `https://makaan4u.com/insights${validPage > 1 ? `?page=${validPage}` : ""}`;
  const pageTitle = validPage > 1
    ? `Makaan4U Insights & Real-Time News Wire — Page ${validPage}`
    : "Makaan4U Insights — Real-Time Indian Real Estate Wire & Advisory";
  const pageDesc = `Authoritative legal analysis, live real estate market news from Economic Times, Livemint & Financial Express. Page ${validPage} of verified market intelligence.`;

  // Schema.org Structured Data for Google Search Rich Carousel
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Makaan4U Real Estate Insights & News Wire",
    "description": pageDesc,
    "url": canonicalUrl,
    "numberOfItems": paginatedArticles.length,
    "itemListElement": paginatedArticles.map((art, index) => ({
      "@type": "ListItem",
      "position": (validPage - 1) * ITEMS_PER_PAGE + index + 1,
      "item": {
        "@type": art.isLiveNews ? "NewsArticle" : "Article",
        "headline": art.title,
        "description": art.excerpt,
        "image": art.heroImg,
        "url": art.isLiveNews ? art.url : `https://makaan4u.com/insights/${art.slug}`,
        "datePublished": art.displayDate,
        "author": {
          "@type": "Person",
          "name": art.author?.name || "Makaan4U Editorial"
        },
        "publisher": {
          "@type": "Organization",
          "name": art.sourceName || "Makaan4U",
          "logo": {
            "@type": "ImageObject",
            "url": "https://makaan4u.com/favicon-512.png"
          }
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      {/* ================================================================
          SEO HEAD TAGS & SCHEMA.ORG STRUCTURED DATA
      ================================================================ */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        {validPage > 1 && (
          <link
            rel="prev"
            href={`https://makaan4u.com/insights${validPage - 1 === 1 ? "" : `?page=${validPage - 1}`}`}
          />
        )}
        {validPage < totalPages && (
          <link rel="next" href={`https://makaan4u.com/insights?page=${validPage + 1}`} />
        )}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-16">
        <Breadcrumbs items={[{ label: "Makaan4U Insights" }]} />

        {/* ================================================================
            REAL-TIME LIVE NEWS TICKER BANNER
        ================================================================ */}
        {latestLiveItem && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-3 px-4 flex items-center justify-between text-xs shadow-xs transition-colors hover:border-[var(--color-terracotta)]">
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-xs bg-red-500/10 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-mono font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                <span>Live Wire</span>
              </span>
              <p className="text-[11px] sm:text-xs font-medium text-[var(--color-foreground)] truncate">
                <span className="font-semibold text-[var(--color-terracotta)] hidden sm:inline mr-1">
                  [{latestLiveItem.sourceName}]
                </span>
                {latestLiveItem.title}
              </p>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <a
                href={latestLiveItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[var(--color-terracotta)] hover:underline whitespace-nowrap"
              >
                <span>Read Story</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleRefreshNews}
                disabled={isRefreshingNews}
                title="Refresh Live News Feed"
                className="p-1 rounded text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-subtle)] transition-colors"
                aria-label="Refresh Real-Time News"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingNews ? "animate-spin text-[var(--color-terracotta)]" : ""}`} />
              </button>
            </div>
          </div>
        )}

        {/* Editorial Heading */}
        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Editorial & Market Wire</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--color-muted-foreground)]">
              {newsSourceLabel} • 100% Free Live Syndication
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            Makaan4U Insights & News Wire
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-3xl leading-relaxed">
            Direct real-time coverage from leading Indian financial publications (The Economic Times, Livemint, Financial Express) alongside forensic legal due-diligence, quarterly pricing trends, and architecture commentary.
          </p>
        </div>

        {/* Featured Story Banner (Shown on Page 1) */}
        {validPage === 1 && featuredArticle && (
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all duration-300 p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-3 text-xs">
                <span className="px-2.5 py-0.5 bg-[var(--color-terracotta-subtle)] text-[var(--color-terracotta)] font-semibold rounded-xs uppercase tracking-wider">
                  {featuredArticle.category}
                </span>
                {featuredArticle.isLiveNews ? (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-600 font-mono font-semibold rounded-xs uppercase text-[10px] flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                    <span>{featuredArticle.sourceName}</span>
                  </span>
                ) : (
                  <span className="text-[var(--color-muted-foreground)] font-mono">
                    {featuredArticle.displayDate} • {featuredArticle.readingTime}
                  </span>
                )}
              </div>

              {featuredArticle.isLiveNews ? (
                <a
                  href={featuredArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group-hover:text-[var(--color-terracotta)] transition-colors"
                >
                  <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[var(--color-foreground)] leading-snug flex items-start justify-between gap-2">
                    <span>{featuredArticle.title}</span>
                    <ArrowUpRight className="w-5 h-5 flex-shrink-0 mt-1 opacity-75" />
                  </h2>
                </a>
              ) : (
                <Link to={`/insights/${featuredArticle.slug}`}>
                  <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>
                </Link>
              )}

              <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center space-x-3">
                  <img
                    src={featuredArticle.author?.avatar}
                    alt={featuredArticle.author?.name || "Author"}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = FALLBACK_ARTICLE_IMG; }}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-xs text-[var(--color-foreground)]">{featuredArticle.author?.name}</p>
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">
                      {featuredArticle.isLiveNews ? `Syndicated via ${featuredArticle.sourceName}` : featuredArticle.author?.title || featuredArticle.author?.role}
                    </p>
                  </div>
                </div>

                {featuredArticle.isLiveNews ? (
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-semibold text-xs text-[var(--color-terracotta)] hover:underline"
                  >
                    <span>Read Full Story</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    to={`/insights/${featuredArticle.slug}`}
                    className="inline-flex items-center space-x-1 font-semibold text-xs text-[var(--color-terracotta)] hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 h-64 sm:h-80 w-full overflow-hidden rounded-sm bg-[var(--color-subtle)]">
              {featuredArticle.isLiveNews ? (
                <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img
                    src={featuredArticle.heroImg}
                    alt={featuredArticle.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = FALLBACK_ARTICLE_IMG; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </a>
              ) : (
                <Link to={`/insights/${featuredArticle.slug}`} className="block w-full h-full">
                  <img
                    src={featuredArticle.heroImg}
                    alt={featuredArticle.title}
                    loading="eager"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = FALLBACK_ARTICLE_IMG; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
              )}
            </div>
          </article>
        )}

        {/* Filter Bar with Live Wire Button */}
        <div ref={gridTopRef} className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-sm text-xs">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  selectedCategory === cat
                    ? "bg-[var(--color-foreground)] text-[var(--color-surface)] font-semibold"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-subtle)]"
                }`}
              >
                {cat === "Live Wire" && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat ? "bg-red-400" : "bg-red-500 animate-pulse"}`} />
                )}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search news, topics, publishers..."
              className="w-full h-8 pl-8 pr-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
            />
          </div>
        </div>

        {/* Results Counter & Active View State */}
        <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)] font-mono px-1">
          <span>
            Showing {(validPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(validPage * ITEMS_PER_PAGE, filteredArticles.length)} of {filteredArticles.length} stories
          </span>
          <span>
            Page {validPage} of {totalPages}
          </span>
        </div>

        {/* ================================================================
            PAGINATED ARTICLE GRID (3 Columns)
        ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedArticles.map((art) => (
            <article
              key={art.id || art.slug}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[var(--color-subtle)]">
                  <img
                    src={art.heroImg}
                    alt={art.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = FALLBACK_ARTICLE_IMG; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 px-2.5 py-1 rounded text-[10px] font-mono text-white tracking-widest uppercase flex items-center space-x-1.5">
                    {art.isLiveNews && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    <span>{art.category}</span>
                  </div>

                  {art.isLiveNews && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-stone-900 font-semibold px-2 py-0.5 rounded text-[10px] uppercase font-mono shadow-xs">
                      {art.sourceName}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-[var(--color-muted-foreground)]">
                    <span>{art.displayDate}</span>
                    <span>•</span>
                    <span>{art.readingTime}</span>
                  </div>

                  {art.isLiveNews ? (
                    <a
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group-hover:text-[var(--color-terracotta)] transition-colors"
                    >
                      <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)] leading-snug line-clamp-2 flex items-start justify-between gap-1">
                        <span>{art.title}</span>
                        <ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                      </h3>
                    </a>
                  ) : (
                    <Link to={`/insights/${art.slug}`}>
                      <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h3>
                    </Link>
                  )}

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
                      alt={art.author?.name || "Author"}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.src = FALLBACK_ARTICLE_IMG; }}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-[var(--color-foreground)] text-[11px] truncate max-w-[130px]">
                      {art.author?.name}
                    </span>
                  </div>

                  {art.isLiveNews ? (
                    <a
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[11px] text-[var(--color-terracotta)] hover:underline flex items-center space-x-1"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to={`/insights/${art.slug}`}
                      className="font-semibold text-[11px] text-[var(--color-terracotta)] hover:underline flex items-center space-x-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8">
            <BookOpen className="w-8 h-8 text-[var(--color-muted-foreground)] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[var(--color-foreground)]">No articles found</p>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Try switching categories or clearing search keywords.</p>
          </div>
        )}

        {/* ================================================================
            SEO-FRIENDLY ACCESSIBLE PAGINATION CONTROLS
        ================================================================ */}
        {totalPages > 1 && (
          <nav aria-label="Insights Pagination" className="pt-8 border-t border-[var(--color-border)] flex items-center justify-between flex-wrap gap-4">
            {/* Previous Page Link */}
            <div>
              {validPage > 1 ? (
                <Link
                  to={`/insights?page=${validPage - 1}${selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : ""}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                  onClick={(e) => { e.preventDefault(); handlePageChange(validPage - 1); }}
                  className="px-3.5 py-2 border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              ) : (
                <span className="px-3.5 py-2 border border-[var(--color-border)] opacity-40 rounded-sm text-xs font-semibold inline-flex items-center space-x-1.5 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </span>
              )}
            </div>

            {/* Page Number Pills */}
            <div className="flex items-center space-x-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === validPage;
                const pageUrl = `/insights?page=${pageNum}${selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : ""}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`;

                // Show first, last, and window around current page
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= validPage - 1 && pageNum <= validPage + 1)
                ) {
                  return (
                    <Link
                      key={pageNum}
                      to={pageUrl}
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                      className={`min-w-[36px] h-9 px-2.5 flex items-center justify-center rounded-sm text-xs font-mono font-semibold transition-colors ${
                        isActive
                          ? "bg-[var(--color-foreground)] text-[var(--color-surface)] shadow-xs"
                          : "border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground)]"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                }

                if (pageNum === validPage - 2 || pageNum === validPage + 2) {
                  return (
                    <span key={`dots-${pageNum}`} className="px-1 text-xs text-[var(--color-muted-foreground)] font-mono">
                      •••
                    </span>
                  );
                }

                return null;
              })}
            </div>

            {/* Next Page Link */}
            <div>
              {validPage < totalPages ? (
                <Link
                  to={`/insights?page=${validPage + 1}${selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : ""}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`}
                  onClick={(e) => { e.preventDefault(); handlePageChange(validPage + 1); }}
                  className="px-3.5 py-2 border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="px-3.5 py-2 border border-[var(--color-border)] opacity-40 rounded-sm text-xs font-semibold inline-flex items-center space-x-1.5 cursor-not-allowed">
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          </nav>
        )}
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default InsightsPage;
