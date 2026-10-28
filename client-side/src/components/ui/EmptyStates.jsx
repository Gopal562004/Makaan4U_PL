import React from "react";
import { Link } from "react-router-dom";
import { Search, Heart, RefreshCw, ArrowRight, Building, SlidersHorizontal } from "lucide-react";

export const EmptyProperties = ({ onResetFilters }) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 sm:p-12 text-center max-w-lg mx-auto">
      <div className="w-12 h-12 bg-[var(--color-subtle)] text-[var(--color-terracotta)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
        No Matching Verified Properties Found
      </h3>
      <p className="text-xs text-[var(--color-muted-foreground)] mt-2 leading-relaxed">
        Try broadening your search criteria: expand budget boundaries, remove specific BHK filters, or select an adjacent micro-market.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-semibold rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
        <Link
          to="/properties"
          className="px-4 py-2 bg-[var(--color-subtle)] text-[var(--color-foreground)] text-xs font-medium border border-[var(--color-border)] rounded-sm hover:border-[var(--color-foreground)] transition-colors"
        >
          View All Prime Residences
        </Link>
      </div>
    </div>
  );
};

export const EmptyShortlist = () => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 sm:p-12 text-center max-w-md mx-auto">
      <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart className="w-6 h-6" />
      </div>
      <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
        Your Shortlist is Waiting
      </h3>
      <p className="text-xs text-[var(--color-muted-foreground)] mt-2 leading-relaxed">
        Curate your personal collection of residences across Mumbai, Bangalore, NCR, and Goa. Tap the heart on any property to compare and review anytime.
      </p>
      <div className="mt-6">
        <Link
          to="/properties"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors"
        >
          <span>Explore Verified Properties</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export const ErrorState = ({ onRetry, message = "Something went wrong while retrieving property data." }) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8 text-center max-w-md mx-auto">
      <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
        Unable to Load Properties
      </h3>
      <p className="text-xs text-[var(--color-muted-foreground)] mt-1.5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-semibold rounded-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
