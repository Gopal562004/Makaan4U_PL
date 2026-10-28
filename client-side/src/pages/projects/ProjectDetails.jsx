import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  CalendarCheck,
  Download,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import MobileNav from "../../components/ui/MobileNav";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import SiteVisitModal from "../../components/ui/SiteVisitModal";
import EnquiryModal from "../../components/ui/EnquiryModal";
import CompareDrawer from "../../components/ui/CompareDrawer";
import { PROJECTS, DEVELOPERS } from "../../data/propertyData";
import { toast } from "react-toastify";

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    const match = PROJECTS.find((p) => p.slug === slug || p.id === slug) || PROJECTS[0];
    setProject(match);
  }, [slug]);

  if (!project) return null;

  const gallery = project.gallery || [project.coverImage];
  const developerInfo = DEVELOPERS.find((d) => d.name.toLowerCase().includes(project.developer.toLowerCase())) || DEVELOPERS[0];

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-foreground)] flex flex-col font-sans transition-colors duration-300">
      <Helmet>
        <title>{`${project.title} by ${project.developer} — ${project.locality}, ${project.city} | Makaan4U`}</title>
        <meta name="description" content={`Explore ${project.title} masterplan, unit configurations, and RERA registration ${project.reraNumber}.`} />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24 lg:pb-16">
        <Breadcrumbs
          items={[
            { label: "Projects", href: "/projects" },
            { label: project.city, href: `/projects?city=${project.city}` },
            { label: project.title }
          ]}
        />

        {/* Top Title Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-[var(--color-border)] pb-6 gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 bg-[var(--color-subtle)] text-[var(--color-terracotta)] font-semibold uppercase tracking-wider rounded-xs">
                {project.category}
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-950/20 text-emerald-600 font-semibold rounded-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RERA: {project.reraNumber}</span>
              </span>
              <span className="text-[var(--color-muted-foreground)]">
                by <strong className="text-[var(--color-foreground)]">{project.developer}</strong>
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-foreground)]">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-[var(--color-terracotta)]" />
              <span>{project.locality}, {project.city}</span>
            </p>
          </div>

          <div className="lg:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
              Starting Guide Price
            </span>
            <span className="font-mono text-3xl sm:text-4xl font-bold text-[var(--color-foreground)]">
              {project.startingPrice}
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)] block mt-0.5">
              Price Range: {project.priceRange}
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="h-80 sm:h-[480px] w-full rounded-sm overflow-hidden bg-[var(--color-subtle)] relative">
            <img
              src={gallery[activeImgIdx] || project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1 rounded">
              Rendering {activeImgIdx + 1} of {gallery.length}
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIdx(i)}
                  className={`w-20 h-14 rounded overflow-hidden border-2 flex-shrink-0 ${
                    activeImgIdx === i ? "border-[var(--color-terracotta)] scale-105" : "border-transparent opacity-75"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid: Info + Sticky Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Overview, Unit Configurations Table, Construction */}
          <div className="lg:col-span-8 space-y-8 text-xs sm:text-sm">
            {/* Master Overview */}
            <div className="space-y-3">
              <h3 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
                Master Development Vision
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                {project.title} represents a signature master development in {project.locality}, balancing expansive landscaped biophilic open spaces with state-of-the-art residential infrastructure.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {project.highlights.map((h, i) => (
                  <div key={i} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm flex items-start space-x-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-foreground)]">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Units & Configurations Table */}
            <div className="space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
                Available Unit Typologies & Floor Sizes
              </h3>
              <div className="border border-[var(--color-border)] rounded-sm overflow-hidden bg-[var(--color-surface)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-subtle)] border-b border-[var(--color-border)] text-[var(--color-muted-foreground)] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3 font-semibold">Typology</th>
                      <th className="p-3 font-semibold">Carpet Area</th>
                      <th className="p-3 font-semibold">Price Bracket</th>
                      <th className="p-3 font-semibold text-right">Floor Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {project.units.map((u, i) => (
                      <tr key={i} className="hover:bg-[var(--color-subtle)] transition-colors">
                        <td className="p-3 font-semibold text-[var(--color-foreground)]">{u.type}</td>
                        <td className="p-3 font-mono text-[var(--color-muted-foreground)]">{u.carpetArea}</td>
                        <td className="p-3 font-mono font-bold text-[var(--color-terracotta)]">{u.price}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              toast.info(`Requesting floor plan CAD for ${u.type}`);
                              setIsEnquiryOpen(true);
                            }}
                            className="font-semibold text-[var(--color-foreground)] hover:underline"
                          >
                            Request CAD →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Construction & RERA Details */}
            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-4">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-foreground)]">
                Regulatory Milestones & Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[var(--color-muted-foreground)] block">Possession Commitment</span>
                  <span className="font-semibold text-[var(--color-foreground)] mt-0.5 block">{project.possessionDate}</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted-foreground)] block">Current Site Status</span>
                  <span className="text-emerald-600 font-semibold mt-0.5 block">{project.constructionStatus}</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted-foreground)] block">RERA Number</span>
                  <span className="font-mono font-bold text-[var(--color-foreground)] mt-0.5 block">{project.reraNumber}</span>
                </div>
              </div>
            </div>

            {/* Developer Card */}
            <div className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block">
                Promoter Credentials
              </span>
              <div className="flex items-center space-x-4">
                <img src={developerInfo.logo} alt={developerInfo.name} className="w-14 h-14 object-cover rounded" />
                <div>
                  <h4 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">{developerInfo.name}</h4>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Est. {developerInfo.established} • HQ in {developerInfo.headquarters} • {developerInfo.completedProjects} Completed Projects
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed pt-2 border-t border-[var(--color-border)]">
                {developerInfo.description}
              </p>
            </div>
          </div>

          {/* Right: Sticky Action Panel */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 space-y-4 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-terracotta)]">
                Direct Developer Allocation
              </span>
              <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)]">
                Secure Priority Unit Access
              </h3>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                Receive the uncompressed master plan brochure, stage-wise payment schedules, and schedule an exclusive site review with senior advisory personnel.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setIsVisitOpen(true)}
                  className="w-full py-2.5 px-4 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] text-xs font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1.5"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Site Experience</span>
                </button>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full py-2.5 px-4 bg-[var(--color-subtle)] text-[var(--color-foreground)] hover:border-[var(--color-foreground)] border border-[var(--color-border)] text-xs font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1.5"
                >
                  <PhoneCall className="w-4 h-4 text-[var(--color-terracotta)]" />
                  <span>Request Master Brochure</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-muted-foreground)] space-y-1">
                <p className="flex items-center text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Zero Brokerage on Direct Developer Allocations</span>
                </p>
                <p>MahaRERA / State RERA Authenticated</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteVisitModal
        property={{
          id: project.id,
          title: project.title,
          locality: project.locality,
          city: project.city,
          price: project.startingPrice,
          images: gallery
        }}
        isOpen={isVisitOpen}
        onClose={() => setIsVisitOpen(false)}
      />

      <EnquiryModal
        property={{
          id: project.id,
          title: project.title,
          locality: project.locality,
          city: project.city,
          price: project.startingPrice
        }}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        mode="brochure"
      />

      <Footer />
      <MobileNav />
      <CompareDrawer />
    </div>
  );
};

export default ProjectDetails;
