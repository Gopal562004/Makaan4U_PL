import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Building2, Search, Filter, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import ProjectCard from "../../components/ui/ProjectCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { getAllProjects, getAllDevelopers } from "../../lib/mongo/services/projectService";
import { getAllCities } from "../../lib/mongo/services/cityService";
import {
  PROJECTS as FALLBACK_PROJECTS,
  CITIES as FALLBACK_CITIES,
  DEVELOPERS as FALLBACK_DEVELOPERS,
} from "../../data/propertyData";

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [projects, setProjects] = useState([]);
  const [cities, setCities] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "New Launch",
    "Ready to Move",
    "Under Construction",
    "Ultra-Luxury",
    "Premium Projects",
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getAllProjects(),
      getAllCities(),
      getAllDevelopers(),
    ])
      .then(([projectsData, citiesData, devsData]) => {
        if (!isMounted) return;
        if (projectsData?.length) setProjects(projectsData);
        if (citiesData?.length) setCities(citiesData);
        if (devsData?.length) setDevelopers(devsData);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const projectsList = projects.length ? projects : FALLBACK_PROJECTS;
  const citiesList = cities.length ? cities : FALLBACK_CITIES;
  const developersList = developers.length ? developers : FALLBACK_DEVELOPERS;

  const filteredProjects = projectsList.filter((proj) => {
    if (
      selectedCategory !== "All" &&
      proj.category !== selectedCategory &&
      proj.status !== selectedCategory
    ) {
      return false;
    }
    if (selectedCity !== "All" && proj.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        proj.title.toLowerCase().includes(q) ||
        proj.developer.toLowerCase().includes(q) ||
        proj.locality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>New Real Estate Projects & Master Developments — Makaan4U</title>
        <meta
          name="description"
          content="Discover new residential launches, masterplanned townships, and under-construction estates from India's top developers with authenticated RERA timelines."
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20 lg:pb-16">
        <Breadcrumbs items={[{ label: "New Projects & Masterplans" }]} />

        {/* Hero Headline */}
        <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
            Tier-1 Developer Portfolio
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            New Projects & Master Developments
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
            Direct developer allocations, verified master layouts, authenticated RERA completion certificates, and structured payment milestones across premier Indian micro-markets.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-sm text-xs">
          {/* Category Chips */}
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

          {/* City & Search */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-8 px-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
            >
              <option value="All">All Cities</option>
              {citiesList.map((c) => (
                <option key={c.id || c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--color-muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Developer or project..."
                className="w-full h-8 pl-8 pr-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <ProjectCard key={proj.id || proj.slug} project={proj} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-8">
            <p className="text-sm font-semibold text-[var(--color-foreground)]">No developer projects found</p>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
              Try resetting the category or city filters.
            </p>
          </div>
        )}

        {/* Partner Developer Strip */}
        <div className="pt-12 border-t border-[var(--color-border)]">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-muted-foreground)] block mb-4">
            Authorized Institutional Developers
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {developersList.map((dev) => (
              <Link
                key={dev.id || dev.slug}
                to={`/developers/${dev.slug || dev.id}`}
                className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-center transition-all group"
              >
                <p className="font-semibold text-xs text-[var(--color-foreground)] group-hover:text-[var(--color-terracotta)]">
                  {dev.name}
                </p>
                <p className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5">
                  Est. {dev.established} • {dev.activeProjectsCount || dev.completedProjects || 10}+ Projects
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default ProjectsPage;
