import React from "react";
import { Link } from "react-router-dom";
import { Scale, X, ArrowRight } from "lucide-react";
import { useShortlist } from "../../contexts/ShortlistContext";

const CompareDrawer = () => {
  const { compareList, removeFromCompare, clearCompare } = useShortlist();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl rounded-sm p-3 sm:p-4 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left Indicator */}
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded">
            <Scale className="w-4 h-4 text-[var(--color-terracotta)]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--color-foreground)]">
              Comparison Queue ({compareList.length} of 4)
            </p>
            <p className="text-[10px] text-[var(--color-muted-foreground)]">
              Compare specs, RERA, carpet areas & ₹/sq.ft
            </p>
          </div>
        </div>

        {/* Middle Thumbnails */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1">
          {compareList.map((prop) => (
            <div
              key={prop.id || prop._id}
              className="relative group flex items-center space-x-2 px-2 py-1 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs flex-shrink-0"
            >
              <img
                src={prop.images?.[0] || prop.image}
                alt={prop.title}
                className="w-7 h-7 object-cover rounded-xs"
              />
              <div className="text-left">
                <p className="font-semibold text-[11px] text-[var(--color-foreground)] truncate max-w-[100px]">
                  {prop.title}
                </p>
                <p className="font-mono text-[10px] text-[var(--color-terracotta)] font-bold">
                  {prop.price}
                </p>
              </div>
              <button
                onClick={() => removeFromCompare(prop.id || prop._id)}
                className="ml-1 p-0.5 text-[var(--color-muted-foreground)] hover:text-red-600 rounded"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-[11px] text-[var(--color-muted-foreground)] hover:text-red-600 transition-colors px-2 py-1"
          >
            Clear All
          </button>
          <Link
            to="/compare"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors shadow-xs"
          >
            <span>Launch Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareDrawer;
