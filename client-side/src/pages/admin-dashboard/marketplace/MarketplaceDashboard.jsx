import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Building2,
  Building,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  BookOpen,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  RefreshCw,
  X,
  Save,
  Layers,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
  Mail,
  Globe,
  Users,
  Briefcase,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
  getMarketTrends,
  updateMarketTrend,
  deleteMarketTrend,
} from "../../../lib/mongo/services/cityService";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../lib/mongo/services/projectService";
import {
  getAllInsights,
  createInsight,
  updateInsight,
  deleteInsight,
} from "../../../lib/mongo/services/insightService";
import {
  getAllAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  getAllDevelopers,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getAllOffices,
  createOffice,
  updateOffice,
  deleteOffice,
  getCompanySettings,
  updateCompanySettings,
  FALLBACK_COMPANY_SETTINGS,
} from "../../../lib/mongo/services/companyService";

const MarketplaceDashboard = () => {
  // Tabs: "cities" | "projects" | "developers" | "agents" | "insights" | "trends" | "offices" | "company"
  const [activeTab, setActiveTab] = useState("cities");

  // Data states
  const [cities, setCities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);
  const [offices, setOffices] = useState([]);
  const [companySettings, setCompanySettings] = useState(FALLBACK_COMPANY_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for modal items
  const [formData, setFormData] = useState({});

  // Form state for About/Company Settings
  const [companyForm, setCompanyForm] = useState(FALLBACK_COMPANY_SETTINGS);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        citiesData,
        projectsData,
        devsData,
        agentsData,
        insightsData,
        trendsData,
        officesData,
        companyData,
      ] = await Promise.all([
        getAllCities(),
        getAllProjects(),
        getAllDevelopers(),
        getAllAgents(),
        getAllInsights(),
        getMarketTrends(),
        getAllOffices(),
        getCompanySettings(),
      ]);

      setCities(citiesData || []);
      setProjects(projectsData || []);
      setDevelopers(devsData || []);
      setAgents(agentsData || []);
      setInsights(insightsData || []);
      setTrends(trendsData || []);
      setOffices(officesData || []);

      if (companyData) {
        setCompanySettings(companyData);
        setCompanyForm(companyData);
      }
    } catch (err) {
      console.error("Error fetching admin catalog data:", err);
      toast.error("Failed to load catalog data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingItem(null);

    if (activeTab === "cities") {
      setFormData({
        name: "",
        state: "Maharashtra",
        tagline: "",
        avgPricePerSqFt: "₹18,500",
        growthYoY: "+10.5%",
        coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
        description: "",
        topLocalities: "Bandra West, Worli, Powai",
      });
    } else if (activeTab === "projects") {
      setFormData({
        title: "",
        developer: "",
        city: "Mumbai",
        locality: "",
        status: "Under Construction",
        category: "New Launch",
        startingPrice: "₹2.25 Cr",
        configurations: "3 & 4 BHK Luxury Residences",
        possessionTimeline: "December 2028",
        reraNumber: "P51700050312",
        phaseProgress: "Foundation Completed & 14 Floors Cast",
        coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
        description: "",
      });
    } else if (activeTab === "developers") {
      setFormData({
        name: "",
        established: "1995",
        headquarters: "Mumbai, Maharashtra",
        reraCompliance: "100% RERA Registered",
        completedProjects: 40,
        ongoingProjects: 12,
        rating: 4.8,
        logo: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?w=200&auto=format&fit=crop&q=80",
        description: "",
      });
    } else if (activeTab === "agents") {
      setFormData({
        name: "",
        agency: "Makaan4U Private Office",
        phone: "+91 98201 44820",
        email: "",
        reraNo: "A51900034821",
        rating: 4.9,
        experience: "12 Years in Prime Real Estate",
        areasServed: "Worli, Bandra West, Lower Parel",
        languages: "English, Hindi",
        specializations: "Sea-Facing Penthouses, High-Net-Worth Portfolios",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        bio: "",
        activeListingsCount: 15,
        totalDealsClosed: 85,
      });
    } else if (activeTab === "insights") {
      setFormData({
        title: "",
        category: "Market Trends",
        publishedDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readingTime: "6 min read",
        authorName: "Adv. Sunita Mahapatra",
        authorRole: "Legal Counsel & RERA Specialist",
        heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
        excerpt: "",
        content: "",
      });
    } else if (activeTab === "trends") {
      setFormData({
        city: "",
        avgPrice: 16500,
        yoyGrowth: 10.2,
        rentalYield: 4.0,
      });
    } else if (activeTab === "offices") {
      setFormData({
        city: "",
        address: "",
        phone: "+91 22 6982 4400",
        email: "",
        order: offices.length + 1,
        isActive: true,
      });
    }

    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditingItem(item);

    if (activeTab === "cities") {
      setFormData({
        name: item.name || "",
        state: item.state || "",
        tagline: item.tagline || "",
        avgPricePerSqFt: item.avgPricePerSqFt || "",
        growthYoY: item.growthYoY || "",
        coverImage: item.coverImage || "",
        description: item.description || "",
        topLocalities: Array.isArray(item.topLocalities) ? item.topLocalities.join(", ") : item.topLocalities || "",
      });
    } else if (activeTab === "projects") {
      setFormData({
        title: item.title || "",
        developer: item.developer || "",
        city: item.city || "",
        locality: item.locality || "",
        status: item.status || "Under Construction",
        category: item.category || "New Launch",
        startingPrice: item.startingPrice || "",
        configurations: item.configurations || "",
        possessionTimeline: item.possessionTimeline || "",
        reraNumber: item.reraNumber || "",
        phaseProgress: item.phaseProgress || "",
        coverImage: item.coverImage || "",
        description: item.description || "",
      });
    } else if (activeTab === "developers") {
      setFormData({
        name: item.name || "",
        established: item.established || "1990",
        headquarters: item.headquarters || "",
        reraCompliance: item.reraCompliance || "100% RERA Registered",
        completedProjects: item.completedProjects || 0,
        ongoingProjects: item.ongoingProjects || 0,
        rating: item.rating || 4.8,
        logo: item.logo || "",
        description: item.description || "",
      });
    } else if (activeTab === "agents") {
      setFormData({
        name: item.name || "",
        agency: item.agency || "",
        phone: item.phone || "",
        email: item.email || "",
        reraNo: item.reraNo || "",
        rating: item.rating || 4.9,
        experience: item.experience || "",
        areasServed: Array.isArray(item.areasServed) ? item.areasServed.join(", ") : item.areasServed || "",
        languages: Array.isArray(item.languages) ? item.languages.join(", ") : item.languages || "",
        specializations: Array.isArray(item.specializations) ? item.specializations.join(", ") : item.specializations || "",
        image: item.image || "",
        bio: item.bio || "",
        activeListingsCount: item.activeListingsCount || 10,
        totalDealsClosed: item.totalDealsClosed || 50,
      });
    } else if (activeTab === "insights") {
      setFormData({
        title: item.title || "",
        category: item.category || "Market Trends",
        publishedDate: item.publishedDate || "",
        readingTime: item.readingTime || "5 min read",
        authorName: item.author?.name || "",
        authorRole: item.author?.role || item.author?.title || "",
        heroImage: item.heroImage || "",
        excerpt: item.excerpt || "",
        content: item.content || "",
      });
    } else if (activeTab === "trends") {
      setFormData({
        city: item.city || "",
        avgPrice: item.avgPrice || 15000,
        yoyGrowth: item.yoyGrowth || 8.0,
        rentalYield: item.rentalYield || 3.8,
      });
    } else if (activeTab === "offices") {
      setFormData({
        city: item.city || "",
        address: item.address || "",
        phone: item.phone || "",
        email: item.email || "",
        order: item.order || 1,
        isActive: item.isActive !== false,
      });
    }

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === "cities") {
        const payload = {
          ...formData,
          topLocalities: formData.topLocalities
            ? typeof formData.topLocalities === "string"
              ? formData.topLocalities.split(",").map((s) => s.trim()).filter(Boolean)
              : formData.topLocalities
            : [],
        };
        if (modalMode === "create") {
          await createCity(payload);
          toast.success(`City '${payload.name}' created successfully!`);
        } else {
          await updateCity(editingItem.id || editingItem.slug, payload);
          toast.success(`City '${payload.name}' updated successfully!`);
        }
      } else if (activeTab === "projects") {
        if (modalMode === "create") {
          await createProject(formData);
          toast.success(`Project '${formData.title}' created successfully!`);
        } else {
          await updateProject(editingItem.id || editingItem.slug, formData);
          toast.success(`Project '${formData.title}' updated successfully!`);
        }
      } else if (activeTab === "developers") {
        if (modalMode === "create") {
          await createDeveloper(formData);
          toast.success(`Developer '${formData.name}' created successfully!`);
        } else {
          await updateDeveloper(editingItem.slug || editingItem.id, formData);
          toast.success(`Developer '${formData.name}' updated successfully!`);
        }
      } else if (activeTab === "agents") {
        const payload = {
          ...formData,
          areasServed: typeof formData.areasServed === "string"
            ? formData.areasServed.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.areasServed,
          languages: typeof formData.languages === "string"
            ? formData.languages.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.languages,
          specializations: typeof formData.specializations === "string"
            ? formData.specializations.split(",").map((s) => s.trim()).filter(Boolean)
            : formData.specializations,
        };
        if (modalMode === "create") {
          await createAgent(payload);
          toast.success(`Certified Advisor '${payload.name}' added successfully!`);
        } else {
          await updateAgent(editingItem.slug || editingItem.id, payload);
          toast.success(`Certified Advisor '${payload.name}' updated successfully!`);
        }
      } else if (activeTab === "insights") {
        const payload = {
          ...formData,
          author: {
            name: formData.authorName || "Makaan4U Analyst",
            role: formData.authorRole || "Market Analyst",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
          },
        };
        if (modalMode === "create") {
          await createInsight(payload);
          toast.success(`Insight '${payload.title}' published successfully!`);
        } else {
          await updateInsight(editingItem.id || editingItem.slug, payload);
          toast.success(`Insight '${payload.title}' updated successfully!`);
        }
      } else if (activeTab === "trends") {
        await updateMarketTrend(formData.city, {
          city: formData.city,
          avgPrice: Number(formData.avgPrice),
          yoyGrowth: Number(formData.yoyGrowth),
          rentalYield: Number(formData.rentalYield || 3.8),
        });
        toast.success(`Market trend for '${formData.city}' updated in live marquee!`);
      } else if (activeTab === "offices") {
        if (modalMode === "create") {
          await createOffice(formData);
          toast.success(`Regional office in '${formData.city}' added successfully!`);
        } else {
          await updateOffice(editingItem.id || editingItem._id, formData);
          toast.success(`Regional office in '${formData.city}' updated successfully!`);
        }
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to save record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const id = item.id || item.slug || item._id || item.city;
    const name = item.name || item.title || item.city;

    if (!window.confirm(`Are you sure you want to delete '${name}'? This will remove it from database immediately.`)) {
      return;
    }

    try {
      if (activeTab === "cities") {
        await deleteCity(id);
        toast.success(`City '${name}' deleted successfully`);
      } else if (activeTab === "projects") {
        await deleteProject(id);
        toast.success(`Project '${name}' deleted successfully`);
      } else if (activeTab === "developers") {
        await deleteDeveloper(id);
        toast.success(`Developer '${name}' deleted successfully`);
      } else if (activeTab === "agents") {
        await deleteAgent(id);
        toast.success(`Certified Advisor '${name}' deleted successfully`);
      } else if (activeTab === "insights") {
        await deleteInsight(id);
        toast.success(`Article '${name}' deleted successfully`);
      } else if (activeTab === "trends") {
        await deleteMarketTrend(item.city);
        toast.success(`Benchmark rate for '${item.city}' deleted`);
      } else if (activeTab === "offices") {
        await deleteOffice(id);
        toast.success(`Regional office in '${name}' deleted`);
      }
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to delete item");
    }
  };

  const handleSaveCompanySettings = async (e) => {
    e.preventDefault();
    setIsSavingCompany(true);
    try {
      await updateCompanySettings(companyForm);
      toast.success("About Makaan4U narrative & verification pillars updated live!");
      fetchData();
    } catch (err) {
      console.error("Error updating company settings:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update About content");
    } finally {
      setIsSavingCompany(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <Helmet>
        <title>Marketplace Catalog & Company Trust Manager — Admin Workspace</title>
      </Helmet>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
              Realtime Database Content Management
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-0.5">
            Company & Trust Catalog Manager
          </h1>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
            Modify metropolitan cities, projects, certified RERA advisors, featured developers, research publications, regional offices, and brand trust narrative.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 border border-[var(--color-border)] hover:bg-[var(--color-subtle)] text-[var(--color-foreground)] rounded-sm text-xs flex items-center space-x-1.5 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[var(--color-terracotta)]" : ""}`} />
            <span className="hidden sm:inline font-medium">Sync DB</span>
          </button>

          {activeTab !== "company" && (
            <button
              onClick={openCreateModal}
              className="px-3.5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold text-xs rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeTab === "cities" && "Add New City"}
                {activeTab === "projects" && "Add New Project"}
                {activeTab === "developers" && "Add Developer"}
                {activeTab === "agents" && "Add Certified Advisor"}
                {activeTab === "insights" && "Publish Article"}
                {activeTab === "trends" && "Add Ticker Trend"}
                {activeTab === "offices" && "Add Regional Office"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-[var(--color-border)] gap-2 overflow-x-auto text-xs font-semibold pb-1 scrollbar-none">
        {[
          { id: "cities", label: `Metros & Cities (${cities.length})`, icon: Building2 },
          { id: "projects", label: `Projects (${projects.length})`, icon: Building },
          { id: "developers", label: `Featured Developers (${developers.length})`, icon: Award },
          { id: "agents", label: `Certified Advisors (${agents.length})`, icon: ShieldCheck },
          { id: "insights", label: `Insights & Articles (${insights.length})`, icon: BookOpen },
          { id: "trends", label: `Live Ticker (${trends.length})`, icon: TrendingUp },
          { id: "offices", label: `Regional Offices (${offices.length})`, icon: MapPin },
          { id: "company", label: `About & Trust Story`, icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm("");
                setCategoryFilter("All");
              }}
              className={`pb-2.5 px-3 transition-colors whitespace-nowrap flex items-center space-x-2 border-b-2 ${
                activeTab === tab.id
                  ? "border-[var(--color-terracotta)] text-[var(--color-foreground)] font-bold"
                  : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Filter Strip (for list tabs) */}
      {activeTab !== "company" && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab} by name, city, rera...`}
              className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
            />
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono text-[var(--color-muted-foreground)]">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Atlas MongoDB Synced</span>
            </span>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 1: CITIES MANAGEMENT
      ==================================================================== */}
      {activeTab === "cities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cities
            .filter((c) =>
              searchTerm
                ? c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.state?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((city) => (
              <div
                key={city.id || city.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-foreground)] transition-all group"
              >
                <div>
                  <div className="h-40 relative overflow-hidden bg-[var(--color-subtle)]">
                    <img
                      src={city.coverImage}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 bg-black/60 rounded">
                        {city.state}
                      </span>
                      <h3 className="font-editorial text-2xl font-bold mt-1">{city.name}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <p className="text-[var(--color-muted-foreground)] line-clamp-2 leading-relaxed">
                      {city.tagline || city.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-border)] font-mono text-[11px]">
                      <div>
                        <span className="text-[10px] text-[var(--color-muted-foreground)] block">Avg / Sq.Ft</span>
                        <span className="font-bold text-[var(--color-foreground)]">{city.avgPricePerSqFt || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-muted-foreground)] block">YoY Growth</span>
                        <span className="font-bold text-emerald-600">{city.growthYoY || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[var(--color-subtle)] border-t border-[var(--color-border)] flex items-center justify-between">
                  <a
                    href={`/cities/${city.slug || city.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center space-x-1"
                  >
                    <span>View Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(city)}
                      className="p-1.5 hover:bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
                      title="Edit City Details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(city)}
                      className="p-1.5 hover:bg-red-500/10 text-[var(--color-muted-foreground)] hover:text-red-600 rounded transition-colors"
                      title="Delete City"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 2: PROJECTS MANAGEMENT
      ==================================================================== */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects
            .filter((p) =>
              searchTerm
                ? p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.developer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.city?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((proj) => (
              <div
                key={proj.id || proj.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-foreground)] transition-all group"
              >
                <div>
                  <div className="h-40 relative overflow-hidden bg-[var(--color-subtle)]">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-[10px] font-mono uppercase tracking-wider rounded">
                        {proj.status || "Under Construction"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
                        {proj.developer} • {proj.city}
                      </span>
                      <h3 className="font-editorial text-xl font-bold mt-0.5 leading-snug">{proj.title}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div>
                        <span className="text-[10px] text-[var(--color-muted-foreground)] block">Pricing</span>
                        <span className="font-bold text-[var(--color-foreground)]">{proj.startingPrice || "₹2.25 Cr"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-muted-foreground)] block">Timeline</span>
                        <span className="font-bold text-[var(--color-foreground)]">{proj.possessionTimeline || "Dec 2028"}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--color-border)] text-[11px] text-[var(--color-muted-foreground)]">
                      <span className="font-mono text-emerald-600 font-semibold block">RERA: {proj.reraNumber || "Approved"}</span>
                      <p className="line-clamp-1 mt-0.5">{proj.configurations || "3 & 4 BHK Luxury Residences"}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[var(--color-subtle)] border-t border-[var(--color-border)] flex items-center justify-between">
                  <a
                    href={`/projects/${proj.slug || proj.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center space-x-1"
                  >
                    <span>View Dossier</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 hover:bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
                      title="Edit Project Details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj)}
                      className="p-1.5 hover:bg-red-500/10 text-[var(--color-muted-foreground)] hover:text-red-600 rounded transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 3: FEATURED DEVELOPERS MANAGEMENT
      ==================================================================== */}
      {activeTab === "developers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {developers
            .filter((d) =>
              searchTerm
                ? d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  d.headquarters?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((dev) => (
              <div
                key={dev.id || dev.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 flex flex-col justify-between hover:border-[var(--color-foreground)] transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={dev.logo}
                      alt={dev.name}
                      className="w-14 h-14 object-cover rounded border border-[var(--color-border)]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold block">
                        {dev.reraCompliance || "100% RERA Registered"}
                      </span>
                      <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)] truncate">
                        {dev.name}
                      </h3>
                      <p className="text-xs text-[var(--color-muted-foreground)]">
                        Est. {dev.established} • HQ: {dev.headquarters}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-3 leading-relaxed">
                    {dev.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-border)] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] block">Completed</span>
                      <span className="font-bold text-[var(--color-foreground)]">{dev.completedProjects || 50}+ Projects</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] block">Active Pipeline</span>
                      <span className="font-bold text-emerald-600">{dev.ongoingProjects || 12} Projects</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                  <a
                    href={`/developers/${dev.slug || dev.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--color-terracotta)] font-semibold flex items-center space-x-1"
                  >
                    <span>Developer Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(dev)}
                      className="p-1.5 hover:bg-[var(--color-subtle)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
                      title="Edit Developer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dev)}
                      className="p-1.5 hover:bg-red-500/10 text-[var(--color-muted-foreground)] hover:text-red-600 rounded transition-colors"
                      title="Delete Developer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 4: CERTIFIED RERA ADVISORS MANAGEMENT
      ==================================================================== */}
      {activeTab === "agents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents
            .filter((a) =>
              searchTerm
                ? a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  a.agency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  a.reraNo?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((agent) => (
              <div
                key={agent.id || agent.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 flex flex-col justify-between hover:border-[var(--color-foreground)] transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="w-14 h-14 object-cover rounded-full border-2 border-[var(--color-border)]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold block">
                        RERA: {agent.reraNo}
                      </span>
                      <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)] truncate">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-[var(--color-muted-foreground)] truncate">{agent.agency}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2 leading-relaxed">
                    {agent.bio}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)] text-[11px]">
                    <div className="flex items-center text-[var(--color-foreground)] font-mono">
                      <Phone className="w-3 h-3 text-[var(--color-muted-foreground)] mr-1.5" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center text-[var(--color-muted-foreground)] font-mono truncate">
                      <Mail className="w-3 h-3 mr-1.5 shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(Array.isArray(agent.areasServed) ? agent.areasServed : []).slice(0, 3).map((area) => (
                      <span key={area} className="px-1.5 py-0.5 bg-[var(--color-subtle)] text-[10px] rounded">
                        {area}
                      </span>
                    ))}
                    {(agent.areasServed?.length || 0) > 3 && (
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">+{agent.areasServed.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                  <a
                    href={`/agents/${agent.slug || agent.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--color-terracotta)] font-semibold flex items-center space-x-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(agent)}
                      className="p-1.5 hover:bg-[var(--color-subtle)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
                      title="Edit Advisor"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent)}
                      className="p-1.5 hover:bg-red-500/10 text-[var(--color-muted-foreground)] hover:text-red-600 rounded transition-colors"
                      title="Delete Advisor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 5: INSIGHTS & ARTICLES
      ==================================================================== */}
      {activeTab === "insights" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {insights
            .filter((i) =>
              searchTerm
                ? i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  i.category?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((art) => (
              <div
                key={art.id || art.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-foreground)] transition-all group"
              >
                <div>
                  <div className="h-36 relative overflow-hidden bg-[var(--color-subtle)]">
                    <img
                      src={art.heroImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 bg-[var(--color-terracotta)] text-white text-[10px] font-mono uppercase tracking-wider rounded">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)] line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-[var(--color-muted-foreground)] line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                    <div className="pt-2 text-[11px] text-[var(--color-muted-foreground)] flex items-center justify-between border-t border-[var(--color-border)]">
                      <span>{art.author?.name || "Makaan4U Desk"}</span>
                      <span>{art.readingTime || "5 min read"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[var(--color-subtle)] border-t border-[var(--color-border)] flex items-center justify-between">
                  <a
                    href={`/insights/${art.slug || art.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center space-x-1"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(art)}
                      className="p-1.5 hover:bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
                      title="Edit Article"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(art)}
                      className="p-1.5 hover:bg-red-500/10 text-[var(--color-muted-foreground)] hover:text-red-600 rounded transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 6: LIVE TICKER TRENDS
      ==================================================================== */}
      {activeTab === "trends" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trends
            .filter((t) => (searchTerm ? t.city?.toLowerCase().includes(searchTerm.toLowerCase()) : true))
            .map((trend) => (
              <div
                key={trend.city}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
                      {trend.city}
                    </h3>
                    <span className="font-mono text-xs font-bold text-emerald-600">
                      +{trend.yoyGrowth}% YoY
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-[var(--color-border)] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] block">Avg / sq.ft</span>
                      <span className="font-bold text-base text-[var(--color-foreground)]">
                        ₹{Number(trend.avgPrice).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-muted-foreground)] block">Gross Yield</span>
                      <span className="font-bold text-base text-emerald-600">
                        {trend.rentalYield || 3.8}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end space-x-1.5">
                  <button
                    onClick={() => openEditModal(trend)}
                    className="p-1.5 hover:bg-[var(--color-subtle)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
                    title="Edit Benchmark Trend"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(trend)}
                    className="p-1.5 hover:bg-red-500/10 text-[var(--color-muted-foreground)] hover:text-red-600 rounded transition-colors"
                    title="Delete Ticker Rate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 7: REGIONAL BRANCH OFFICES MANAGEMENT
      ==================================================================== */}
      {activeTab === "offices" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offices
            .filter((o) =>
              searchTerm
                ? o.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  o.address?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((office) => (
              <div
                key={office.id || office._id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[var(--color-terracotta)]" />
                      <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                        {office.city}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-semibold rounded">
                      ACTIVE
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                    {office.address}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)] font-mono text-xs">
                    <div className="flex items-center text-[var(--color-foreground)]">
                      <Phone className="w-3 h-3 text-[var(--color-muted-foreground)] mr-2" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center text-[var(--color-muted-foreground)]">
                      <Mail className="w-3 h-3 mr-2" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                  <a
                    href="/contact"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--color-terracotta)] font-semibold flex items-center space-x-1"
                  >
                    <span>View on Contact Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openEditModal(office)}
                      className="p-1.5 hover:bg-[var(--color-subtle)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded transition-colors"
                      title="Edit Office"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(office)}
                      className="p-1.5 hover:bg-red-500/10 text-[var(--color-muted-foreground)] hover:text-red-600 rounded transition-colors"
                      title="Delete Office"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 8: ABOUT & TRUST PHILOSOPHY LIVE EDITOR
      ==================================================================== */}
      {activeTab === "company" && (
        <form onSubmit={handleSaveCompanySettings} className="space-y-8 bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[var(--color-foreground)]">
                About Makaan4U & Brand Story Customizer
              </h2>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                Edit the founding conviction, three verification pillars, pan-India regional desks, and executive CTA.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSavingCompany}
              className="px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold text-xs rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingCompany ? "Publishing Changes..." : "Save About Story"}</span>
            </button>
          </div>

          {/* Section 1: Founding Conviction */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-[var(--color-terracotta)] uppercase tracking-wider">
              1. Founding Conviction Header
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={companyForm.convictionTagline || ""}
                  onChange={(e) => setCompanyForm({ ...companyForm, convictionTagline: e.target.value })}
                  placeholder="Our Founding Conviction"
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={companyForm.convictionTitle || ""}
                  onChange={(e) => setCompanyForm({ ...companyForm, convictionTitle: e.target.value })}
                  placeholder="Indian real estate was broken by speculative, phantom listings."
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                Sub-Headline (Italic Highlight)
              </label>
              <input
                type="text"
                value={companyForm.convictionSubtitle || ""}
                onChange={(e) => setCompanyForm({ ...companyForm, convictionSubtitle: e.target.value })}
                placeholder="We rebuilt the marketplace around forensic proof."
                className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                Founding Narrative Story
              </label>
              <textarea
                rows={3}
                value={companyForm.convictionDescription || ""}
                onChange={(e) => setCompanyForm({ ...companyForm, convictionDescription: e.target.value })}
                placeholder="Comprehensive narrative story..."
                className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>
          </div>

          {/* Section 2: 3 Verification Pillars */}
          <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
            <h3 className="font-semibold text-sm text-[var(--color-terracotta)] uppercase tracking-wider">
              2. The 3 Pillars of Verification Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(companyForm.pillars || []).map((pillar, idx) => (
                <div key={idx} className="p-4 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm space-y-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[var(--color-terracotta)]">{pillar.number}</span>
                    <input
                      type="text"
                      value={pillar.category || ""}
                      onChange={(e) => {
                        const nextPillars = [...companyForm.pillars];
                        nextPillars[idx].category = e.target.value;
                        setCompanyForm({ ...companyForm, pillars: nextPillars });
                      }}
                      className="px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[11px] font-mono uppercase font-bold flex-1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--color-muted-foreground)] mb-0.5">Pillar Title</label>
                    <input
                      type="text"
                      value={pillar.title || ""}
                      onChange={(e) => {
                        const nextPillars = [...companyForm.pillars];
                        nextPillars[idx].title = e.target.value;
                        setCompanyForm({ ...companyForm, pillars: nextPillars });
                      }}
                      className="w-full px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--color-muted-foreground)] mb-0.5">Description</label>
                    <textarea
                      rows={4}
                      value={pillar.description || ""}
                      onChange={(e) => {
                        const nextPillars = [...companyForm.pillars];
                        nextPillars[idx].description = e.target.value;
                        setCompanyForm({ ...companyForm, pillars: nextPillars });
                      }}
                      className="w-full px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs text-[var(--color-muted-foreground)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Leadership Desk CTA */}
          <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
            <h3 className="font-semibold text-sm text-[var(--color-terracotta)] uppercase tracking-wider">
              3. Leadership Desk Closing CTA
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                  CTA Title
                </label>
                <input
                  type="text"
                  value={companyForm.leadershipDeskTitle || ""}
                  onChange={(e) => setCompanyForm({ ...companyForm, leadershipDeskTitle: e.target.value })}
                  placeholder="Connect with our Leadership Desk"
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                  CTA Subtitle
                </label>
                <input
                  type="text"
                  value={companyForm.leadershipDeskSubtitle || ""}
                  onChange={(e) => setCompanyForm({ ...companyForm, leadershipDeskSubtitle: e.target.value })}
                  placeholder="For institutional mandates, family office representation, or developer onboarding."
                  className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[var(--color-terracotta)] font-semibold flex items-center space-x-1"
            >
              <span>Preview Live About Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              disabled={isSavingCompany}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold text-xs rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingCompany ? "Publishing Changes..." : "Save About Story Live"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ====================================================================
          UNIVERSAL CREATE / EDIT MODAL (For Cities, Projects, Developers, Agents, Insights, Trends, Offices)
      ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-terracotta)] font-semibold">
                  {modalMode === "create" ? "Add New Record" : "Modify Record"}
                </span>
                <h3 className="font-editorial text-xl font-bold text-[var(--color-foreground)] capitalize">
                  {modalMode} {activeTab.slice(0, -1)}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] rounded hover:bg-[var(--color-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* ================= CITIES FORM ================= */}
              {activeTab === "cities" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        City Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Mumbai"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        State / Territory *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state || ""}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Maharashtra"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Editorial Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline || ""}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="India's financial capital & premier coastal luxury market"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Average Price / sq.ft *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.avgPricePerSqFt || ""}
                        onChange={(e) => setFormData({ ...formData, avgPricePerSqFt: e.target.value })}
                        placeholder="₹34,800"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        YoY Appreciation *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.growthYoY || ""}
                        onChange={(e) => setFormData({ ...formData, growthYoY: e.target.value })}
                        placeholder="+7.8%"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.coverImage || ""}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                    {formData.coverImage && (
                      <div className="mt-2 h-24 w-full rounded overflow-hidden border border-[var(--color-border)] bg-[var(--color-subtle)]">
                        <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Top Localities (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.topLocalities || ""}
                      onChange={(e) => setFormData({ ...formData, topLocalities: e.target.value })}
                      placeholder="Worli, Bandra West, Lower Parel, Powai"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Regional Overview Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive overview of the market..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>
                </>
              )}

              {/* ================= PROJECTS FORM ================= */}
              {activeTab === "projects" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Oberoi Forestville"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Developer *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.developer || ""}
                        onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                        placeholder="Oberoi Realty"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city || ""}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Mumbai"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Micro-Locality
                      </label>
                      <input
                        type="text"
                        value={formData.locality || ""}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        placeholder="Kolshet, Thane West"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Starting Price
                      </label>
                      <input
                        type="text"
                        value={formData.startingPrice || ""}
                        onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                        placeholder="₹2.25 Cr"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Possession Timeline
                      </label>
                      <input
                        type="text"
                        value={formData.possessionTimeline || ""}
                        onChange={(e) => setFormData({ ...formData, possessionTimeline: e.target.value })}
                        placeholder="December 2028"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        RERA Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.reraNumber || ""}
                        onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                        placeholder="P51700050312"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Configurations
                      </label>
                      <input
                        type="text"
                        value={formData.configurations || ""}
                        onChange={(e) => setFormData({ ...formData, configurations: e.target.value })}
                        placeholder="3 & 4 BHK Luxury Residences"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.coverImage || ""}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                    {formData.coverImage && (
                      <div className="mt-2 h-24 w-full rounded overflow-hidden border border-[var(--color-border)] bg-[var(--color-subtle)]">
                        <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ================= DEVELOPERS FORM ================= */}
              {activeTab === "developers" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Developer / Group Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Godrej Properties"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Year Established *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.established || ""}
                        onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                        placeholder="1990"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Corporate Headquarters *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.headquarters || ""}
                        onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                        placeholder="Mumbai, Maharashtra"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        RERA Compliance Status
                      </label>
                      <input
                        type="text"
                        value={formData.reraCompliance || "100% RERA Registered"}
                        onChange={(e) => setFormData({ ...formData, reraCompliance: e.target.value })}
                        placeholder="100% RERA Registered"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Delivered Projects Count
                      </label>
                      <input
                        type="number"
                        value={formData.completedProjects || ""}
                        onChange={(e) => setFormData({ ...formData, completedProjects: Number(e.target.value) })}
                        placeholder="80"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Active Under Construction
                      </label>
                      <input
                        type="number"
                        value={formData.ongoingProjects || ""}
                        onChange={(e) => setFormData({ ...formData, ongoingProjects: Number(e.target.value) })}
                        placeholder="24"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Logo / Emblem URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.logo || ""}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                    {formData.logo && (
                      <div className="mt-2 w-14 h-14 rounded overflow-hidden border border-[var(--color-border)] bg-[var(--color-subtle)]">
                        <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Developer Background & Track Record *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Corporate legacy, architectural milestones..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>
                </>
              )}

              {/* ================= AGENTS FORM ================= */}
              {activeTab === "agents" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Advisor Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Rajeshwar Sengupta"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        RERA License Registration *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.reraNo || ""}
                        onChange={(e) => setFormData({ ...formData, reraNo: e.target.value })}
                        placeholder="A51900034821"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98201 44820"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rajeshwar.s@makaan4u.com"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Agency / Private Desk
                      </label>
                      <input
                        type="text"
                        value={formData.agency || ""}
                        onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                        placeholder="South Mumbai Private Office"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        value={formData.experience || ""}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="16 Years in Luxury S-Mumbai"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Micro-Markets Covered (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.areasServed || ""}
                      onChange={(e) => setFormData({ ...formData, areasServed: e.target.value })}
                      placeholder="Worli, Prabhadevi, Lower Parel, BKC"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Specializations (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.specializations || ""}
                      onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                      placeholder="Sea-Facing Penthouses, High-Net-Worth Portfolios"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Profile Headshot URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                    {formData.image && (
                      <div className="mt-2 w-14 h-14 rounded-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-subtle)]">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Professional Dossier Bio *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.bio || ""}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Specialized advisor to family offices, HNIs..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>
                </>
              )}

              {/* ================= INSIGHTS FORM ================= */}
              {activeTab === "insights" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="RERA 2.0 Compliance: The Definitive Homebuyer Due-Diligence Checklist"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category || "Market Trends"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      >
                        <option value="Legal & RERA">Legal & RERA</option>
                        <option value="Market Trends">Market Trends</option>
                        <option value="Investment">Investment</option>
                        <option value="Architecture & Design">Architecture & Design</option>
                        <option value="Home Loans">Home Loans</option>
                        <option value="City Guides">City Guides</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Reading Time
                      </label>
                      <input
                        type="text"
                        value={formData.readingTime || "6 min read"}
                        onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={formData.authorName || ""}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        placeholder="Adv. Sunita Mahapatra"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Author Title / Role
                      </label>
                      <input
                        type="text"
                        value={formData.authorRole || ""}
                        onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                        placeholder="Senior Real Estate Counsel"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Hero Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.heroImage || ""}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                    {formData.heroImage && (
                      <div className="mt-2 h-24 w-full rounded overflow-hidden border border-[var(--color-border)] bg-[var(--color-subtle)]">
                        <img src={formData.heroImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Executive Excerpt
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerpt || ""}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief overview of the article..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Article Content (Markdown / Text)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.content || ""}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Full analysis or markdown content..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>
                </>
              )}

              {/* ================= TRENDS FORM ================= */}
              {activeTab === "trends" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Metro City Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === "edit"}
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)] disabled:opacity-60"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Average Benchmark Price (₹/sq.ft) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.avgPrice || ""}
                        onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                        placeholder="34800"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        YoY Capital Growth (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.yoyGrowth || ""}
                        onChange={(e) => setFormData({ ...formData, yoyGrowth: e.target.value })}
                        placeholder="7.8"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Gross Rental Yield (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rentalYield || ""}
                      onChange={(e) => setFormData({ ...formData, rentalYield: e.target.value })}
                      placeholder="3.8"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>
                </>
              )}

              {/* ================= OFFICES FORM ================= */}
              {activeTab === "offices" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        City & Desk Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city || ""}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Mumbai (Headquarters)"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.order || 1}
                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                        placeholder="1"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Physical Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Maker Maxity, 5th Floor, North Avenue, Bandra Kurla Complex (BKC)..."
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 22 6982 4400"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Desk Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="mumbai@makaan4u.com"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-subtle)] text-[var(--color-foreground)] rounded text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] rounded text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving to Database..." : "Save Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceDashboard;
