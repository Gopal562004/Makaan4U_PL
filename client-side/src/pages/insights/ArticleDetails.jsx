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
import { INSIGHTS_ARTICLES, PROPERTIES, LOCALITIES } from "../../data/propertyData";
import { getInsightBySlug } from "../../lib/mongo/services/insightService";
import { toast } from "react-toastify";

const ArticleDetails = () => {
  const { slug } = useParams();
  const fallback = INSIGHTS_ARTICLES.find((a) => a.slug === slug || a.id === slug) || INSIGHTS_ARTICLES[0];
  const [article, setArticle] = useState(fallback);
  const [loading, setLoading] = useState(false);

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

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const relatedArticles = (article?.relatedArticles?.length
    ? article.relatedArticles
    : INSIGHTS_ARTICLES.filter((a) => a.id !== article?.id)
  ).slice(0, 2);

  const relatedProperties = PROPERTIES.slice(0, 2);

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
                src={article.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
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
            src={article.heroImage || article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <article className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[var(--color-foreground)] space-y-6">
          <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-[var(--color-foreground)]">
            {article.content}
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
                    to={`/properties?search=${loc}`}
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

        {/* Contextual Properties Strip */}
        <section className="pt-10 border-t border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
              Contextual Verified Properties
            </h3>
            <Link to="/properties" className="text-xs font-semibold text-[var(--color-terracotta)] hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProperties.map((p) => (
              <PropertyCard key={p.id} property={p} variant="standard" />
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section className="pt-8 border-t border-[var(--color-border)] space-y-4">
          <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
            Continue Reading Makaan4U Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedArticles.map((art) => (
              <Link
                key={art.id}
                to={`/insights/${art.slug}`}
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
