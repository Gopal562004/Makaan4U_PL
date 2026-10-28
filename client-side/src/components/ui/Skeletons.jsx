import React from "react";

export const PropertyCardSkeleton = ({ variant = "standard" }) => {
  if (variant === "horizontal") {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col md:flex-row animate-pulse">
        <div className="w-full md:w-72 lg:w-80 h-52 bg-[var(--color-subtle)] flex-shrink-0" />
        <div className="p-4 sm:p-5 flex-1 space-y-3">
          <div className="flex justify-between">
            <div className="h-6 w-32 bg-[var(--color-subtle)] rounded" />
            <div className="h-4 w-24 bg-[var(--color-subtle)] rounded" />
          </div>
          <div className="h-5 w-3/4 bg-[var(--color-subtle)] rounded" />
          <div className="h-4 w-1/2 bg-[var(--color-subtle)] rounded" />
          <div className="h-12 w-full bg-[var(--color-subtle)] rounded mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden animate-pulse">
      <div className="h-52 w-full bg-[var(--color-subtle)]" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-24 bg-[var(--color-subtle)] rounded" />
          <div className="h-4 w-16 bg-[var(--color-subtle)] rounded" />
        </div>
        <div className="h-4 w-3/4 bg-[var(--color-subtle)] rounded" />
        <div className="h-3 w-1/2 bg-[var(--color-subtle)] rounded" />
        <div className="pt-2 border-t border-[var(--color-border)] flex justify-between">
          <div className="h-3 w-16 bg-[var(--color-subtle)] rounded" />
          <div className="h-3 w-16 bg-[var(--color-subtle)] rounded" />
        </div>
      </div>
    </div>
  );
};

export const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-96 w-full animate-pulse">
      <div className="md:col-span-2 md:row-span-2 bg-[var(--color-subtle)] rounded-sm" />
      <div className="bg-[var(--color-subtle)] rounded-sm" />
      <div className="bg-[var(--color-subtle)] rounded-sm" />
      <div className="bg-[var(--color-subtle)] rounded-sm" />
      <div className="bg-[var(--color-subtle)] rounded-sm" />
    </div>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden animate-pulse">
      <div className="h-56 w-full bg-[var(--color-subtle)]" />
      <div className="p-5 space-y-3">
        <div className="h-6 w-1/2 bg-[var(--color-subtle)] rounded" />
        <div className="h-4 w-3/4 bg-[var(--color-subtle)] rounded" />
        <div className="h-10 w-full bg-[var(--color-subtle)] rounded" />
      </div>
    </div>
  );
};
