import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  BookOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  Share2,
  MapPin,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import PropertyCard from "../../components/ui/PropertyCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { INSIGHTS_ARTICLES } from "../../data/propertyData";
import { getInsightBySlug, getAllInsights } from "../../lib/mongo/services/insightService";
import { getAllProperties } from "../../lib/mongo/services/propertyService";
import { toast } from "react-toastify";

/**
 * Parses inline markdown: turns **bold** into <strong> and strips residual markers
 */
const formatInlineText = (text = "") => {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--color-foreground)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

/**
 * Transforms raw markdown text (###, **, 1., -) into elegant, clean typography
 * Completely removes raw "###" and "**" artifacts from user view
 */
const renderFormattedContent = (content = "") => {
  if (!content) return null;

  const lines = content.trim().split("\n");
  const elements = [];
  let currentList = [];
  let listType = null; // 'ol' | 'ul'

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === "ol") {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-3 my-4 pl-1">
            {currentList.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-2 text-xs sm:text-sm leading-relaxed text-[var(--color-foreground)]"
              >
                <span className="font-bold text-[var(--color-terracotta)] font-mono min-w-[20px]">
                  {item.num}.
                </span>
                <span className="flex-1">{formatInlineText(item.text)}</span>
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${elements.length}`}
            className="space-y-2 my-4 pl-4 list-disc text-xs sm:text-sm leading-relaxed text-[var(--color-foreground)]"
          >
            {currentList.map((item, idx) => (
              <li key={idx}>{formatInlineText(item.text)}</li>
            ))}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Heading ### -> Styled Subheading without "###"
    if (trimmed.startsWith("### ")) {
      flushList();
      const headingText = trimmed.replace(/^###\s+/, "");
      elements.push(
        <h3
          key={`h3-${index}`}
          className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-foreground)] mt-8 mb-3 border-b border-[var(--color-border)] pb-2"
        >
          {headingText}
        </h3>
      );
      return;
    }

    // Heading ## -> Styled Major Section Heading without "##"
    if (trimmed.startsWith("## ")) {
      flushList();
      const headingText = trimmed.replace(/^##\s+/, "");
      elements.push(
        <h2
          key={`h2-${index}`}
          className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-10 mb-4"
        >
          {headingText}
        </h2>
      );
      return;
    }

    // Numbered list: "1. Item"
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      if (listType !== "ol") flushList();
      listType = "ol";
      currentList.push({ num: numberedMatch[1], text: numberedMatch[2] });
      return;
    }

    // Bullet list: "- Item" or "* Item"
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (listType !== "ul") flushList();
      listType = "ul";
      currentList.push({ text: bulletMatch[1] });
      return;
    }

    flushList();
    elements.push(
      <p
        key={`p-${index}`}
        className="text-xs sm:text-sm leading-relaxed text-[var(--color-muted-foreground)] mb-4"
      >
        {formatInlineText(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
};

const ArticleDetails = () => {
  const { slug } = useParams();
  const fallback =
    INSIGHTS_ARTICLES.find((a) => a.slug === slug || a.id === slug) || INSIGHTS_ARTICLES[0];
  const [article, setArticle] = useState(fallback);
  const [loading, setLoading] = useState(false);
  const [liveInsightsList, setLiveInsightsList] = useState([]);
  const [contextualProperties, setContextualProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Fetch article details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getInsightBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        if (data) setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not fetch article by slug, using fallback:", err.message);
        if (isMounted) setLoading(false);
      });

    // Also fetch all insights for dynamic related stories
    getAllInsights()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setLiveInsightsList(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Fetch REAL, ACTUAL portal properties from MongoDB database
  useEffect(() => {
    let isMounted = true;
    setLoadingProperties(true);

    getAllProperties({ limit: 12, status: "available" })
      .then((res) => {
        if (!isMounted) return;
        const list = res?.properties || [];
        if (list.length > 0) {
          // Contextual matching: prioritize properties matching article's micro-markets or city
          let matched = [];
          if (article?.relatedLocalities && article.relatedLocalities.length > 0) {
            matched = list.filter((p) =>
              article.relatedLocalities.some((loc) => {
                const locLower = loc.toLowerCase();
                return (
                  p.location?.locality?.toLowerCase().includes(locLower) ||
                  p.location?.city?.toLowerCase().includes(locLower) ||
                  p.title?.toLowerCase().includes(locLower) ||
                  p.address?.toLowerCase().includes(locLower)
                );
              })
            );
          }

          // If category is Commercial, try matching commercial properties
          if (article?.category?.toLowerCase().includes("commercial") || article?.category?.toLowerCase().includes("investment")) {
            const commMatch = list.filter((p) =>
              p.propertyType?.toLowerCase().includes("commercial") ||
              p.title?.toLowerCase().includes("office") ||
              p.title?.toLowerCase().includes("commercial")
            );
            if (commMatch.length > 0) {
              matched = [...commMatch, ...matched.filter(p => !commMatch.some(c => c.id === p.id))];
            }
          }

          // Use matched properties if found, otherwise show the latest available properties from portal
          const finalProperties = matched.length >= 2 ? matched : list;
          setContextualProperties(finalProperties.slice(0, 2));
        } else {
          setContextualProperties([]);
        }
        setLoadingProperties(false);
      })
      .catch((err) => {
        console.warn("Could not fetch real properties for article details:", err.message);
        if (isMounted) {
          setContextualProperties([]);
          setLoadingProperties(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [article]);

  const relatedPool = liveInsightsList.length > 0 ? liveInsightsList : INSIGHTS_ARTICLES;
  const relatedArticles = (
    article?.relatedArticles?.length
      ? article.relatedArticles
      : relatedPool.filter((a) => (a.slug || a.id) !== (article?.slug || article?.id))
  ).slice(0, 2);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Article link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`${article.title} — Makaan4U Insights`}</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: "Insights", href: "/insights" },
            { label: article.category, href: `/insights?category=${article.category}` },
            { label: article.title }
          ]}
        />

        {/* Editorial Article Header */}
        <header className="space-y-4 border-b border-[var(--color-border)] pb-8">
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-2.5 py-0.5 bg-[var(--color-terracotta-subtle)] text-[var(--color-terracotta)] font-semibold rounded-xs uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-[var(--color-muted-foreground)] font-mono">
              Published {article.publishedDate} • {article.readingTime}
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)] leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-muted-foreground)] leading-relaxed font-light">
            {article.excerpt}
          </p>

          {/* Author Byline Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center space-x-3">
              <img
                src={
                  article.author?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                }
                alt={article.author?.name || "Author"}
                className="w-11 h-11 rounded-full object-cover border border-[var(--color-border)]"
              />
              <div>
                <p className="font-semibold text-xs sm:text-sm text-[var(--color-foreground)]">
                  {article.author?.name || "Editorial Desk"}
                </p>
                <p className="text-[11px] text-[var(--color-muted-foreground)]">
                  {article.author?.title || "Property Research"}
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-2 border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </header>

        {/* Immersive Hero Photo */}
        <div className="h-80 sm:h-[450px] w-full rounded-sm overflow-hidden bg-[var(--color-subtle)]">
          <img
            src={
              article.heroImage ||
              article.coverImage ||
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80"
            }
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content: Rendered cleanly without any raw ### or ** symbols */}
        <article className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[var(--color-foreground)] space-y-6">
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--color-foreground)]">
            {renderFormattedContent(article.content)}
          </div>

          {/* Relevant Localities Box */}
          {article.relatedLocalities && (
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-2 mt-8">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)] block">
                Directly Referencing Micro-Markets
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {article.relatedLocalities.map((loc) => (
                  <Link
                    key={loc}
                    to={`/properties?search=${encodeURIComponent(loc)}`}
                    className="px-2.5 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded hover:border-[var(--color-foreground)] font-medium flex items-center space-x-1"
                  >
                    <MapPin className="w-3 h-3 text-[var(--color-terracotta)]" />
                    <span>{loc}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Contextual Properties Strip - Real Portal Properties Only */}
        {(contextualProperties.length > 0 || loadingProperties) && (
          <section className="pt-10 border-t border-[var(--color-border)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                  Contextual Verified Properties
                </h3>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  Live inventory from our physically inspected portal database
                </p>
              </div>
              <Link
                to="/properties"
                className="text-xs font-semibold text-[var(--color-terracotta)] hover:underline"
              >
                View All ({contextualProperties.length > 0 ? "Verified Portal Listings" : "→"}) →
              </Link>
            </div>

            {loadingProperties ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="h-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm animate-pulse" />
                <div className="h-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm animate-pulse hidden sm:block" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contextualProperties.map((p) => (
                  <PropertyCard key={p.id || p._id} property={p} variant="standard" />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Related Articles */}
        <section className="pt-8 border-t border-[var(--color-border)] space-y-4">
          <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
            Continue Reading Makaan4U Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((art) => (
              <Link
                key={art.id || art.slug}
                to={`/insights/${art.slug || art.id}`}
                className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm transition-all group block space-y-2"
              >
                <span className="text-[10px] font-mono uppercase text-[var(--color-terracotta)] font-semibold">
                  {art.category}
                </span>
                <h4 className="font-editorial text-base font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)] transition-colors">
                  {art.title}
                </h4>
                <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2">
                  {art.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default ArticleDetails;
