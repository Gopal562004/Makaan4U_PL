import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

const ProjectCard = ({ project }) => {
  if (!project) return null;

  const projectUrl = `/projects/${project.slug || project.id}`;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ready to move":
        return "bg-emerald-900/90 text-emerald-100 border-emerald-700";
      case "under construction":
        return "bg-amber-900/90 text-amber-100 border-amber-700";
      default:
        return "bg-stone-900/90 text-stone-100 border-stone-700";
    }
  };

  return (
    <article className="group bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] transition-all duration-300 rounded-sm overflow-hidden flex flex-col">
      {/* Top Gallery / Cover */}
      <div className="relative h-60 w-full overflow-hidden bg-[var(--color-subtle)]">
        <Link to={projectUrl} className="block w-full h-full">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Developer pill */}
        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-xs text-[11px] font-semibold text-white tracking-wide uppercase border border-white/10 flex items-center space-x-1.5">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{project.developer}</span>
        </div>

        {/* Status Pill */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-xs border backdrop-blur-xs ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[11px] uppercase tracking-wider text-amber-300 font-mono flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {project.locality}, {project.city}
          </p>
          <Link to={projectUrl} className="block">
            <h3 className="font-editorial text-xl font-bold tracking-tight text-white group-hover:underline">
              {project.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Structured Details Grid (Distinct from Resale Listings) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-[var(--color-border)] pb-2.5">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
                Starting Price
              </span>
              <span className="font-mono text-lg font-bold text-[var(--color-foreground)]">
                {project.startingPrice}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
                Configurations
              </span>
              <span className="text-xs font-semibold text-[var(--color-foreground)]">
                {project.configuration}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[var(--color-muted-foreground)]">
              <span>Possession Timeline</span>
              <span className="font-medium text-[var(--color-foreground)]">{project.possessionDate}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-muted-foreground)]">
              <span>RERA Registration</span>
              <span className="font-mono text-[11px] text-[var(--color-foreground)]">{project.reraNumber}</span>
            </div>
            {project.constructionStatus && (
              <div className="flex items-center justify-between text-[var(--color-muted-foreground)]">
                <span>Phase Progress</span>
                <span className="text-emerald-600 font-medium text-[11px]">{project.constructionStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
            {project.category || "Masterplan"}
          </span>
          <Link
            to={projectUrl}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[var(--color-subtle)] hover:bg-[var(--color-primary)] text-[var(--color-foreground)] hover:text-[var(--color-primary-foreground)] text-xs font-semibold rounded-xs transition-colors"
          >
            <span>Project Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
