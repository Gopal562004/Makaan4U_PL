import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Building2, ShieldCheck, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import ProjectCard from "../../components/ui/ProjectCard";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { DEVELOPERS, PROJECTS } from "../../data/propertyData";
import { getDeveloperBySlug } from "../../lib/mongo/services/companyService";

const DeveloperDetails = () => {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(
    () => DEVELOPERS.find((d) => d.id === id || d.slug === id || d.name.toLowerCase().includes(id?.toLowerCase())) || DEVELOPERS[0]
  );

  useEffect(() => {
    let isMounted = true;
    getDeveloperBySlug(id)
      .then((data) => {
        if (isMounted && data) {
          setDeveloper(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [id]);

  const developerProjects = PROJECTS.filter(
    (p) => p.developer?.toLowerCase().includes(developer.name?.toLowerCase()) || p.developerId === developer.id || p.developerId === developer.slug
  );

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`${developer.name} — Real Estate Projects & Portfolio | Makaan4U`}</title>
        <meta name="description" content={developer.description} />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10 pb-24 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: "Developers", href: "/developers" },
            { label: developer.name }
          ]}
        />

        {/* Developer Dossier Header */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <img
                src={developer.logo}
                alt={developer.name}
                className="w-20 h-20 rounded object-cover border border-[var(--color-border)]"
              />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950/20 text-emerald-600 font-semibold rounded flex items-center w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  <span>{developer.reraCompliance || "100% RERA Registered"}</span>
                </span>
                <h1 className="font-editorial text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)]">
                  {developer.name}
                </h1>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  Established {developer.established} • Headquarters: {developer.headquarters}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-[var(--color-border)] pt-4 md:pt-0 md:pl-6 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">Delivered Track Record</span>
                <span className="font-mono text-xl font-bold text-[var(--color-foreground)] mt-0.5 block">
                  {developer.completedProjects || 80}+ Completed
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">Under Construction</span>
                <span className="font-mono text-xl font-bold text-emerald-600 mt-0.5 block">
                  {developer.ongoingProjects || developer.activeProjectsCount || 12} Active
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-xs sm:text-sm text-[var(--color-muted-foreground)] leading-relaxed">
            {developer.description}
          </div>
        </div>

        {/* Master Projects by this Developer */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
              Featured Projects by {developer.name}
            </h2>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              Direct developer allocation & zero brokerage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerProjects.length > 0 ? (
              developerProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))
            ) : (
              PROJECTS.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default DeveloperDetails;
