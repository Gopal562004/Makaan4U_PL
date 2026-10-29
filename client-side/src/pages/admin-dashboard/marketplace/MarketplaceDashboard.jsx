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
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
  getMarketTrends,
  updateMarketTrend,
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

const MarketplaceDashboard = () => {
  const [activeTab, setActiveTab] = useState("cities"); // "cities" | "projects" | "insights" | "trends"

  // Data states
  const [cities, setCities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [citiesData, projectsData, insightsData, trendsData] = await Promise.all([
        getAllCities(),
        getAllProjects(),
        getAllInsights(),
        getMarketTrends(),
      ]);
      setCities(citiesData || []);
      setProjects(projectsData || []);
      setInsights(insightsData || []);
      setTrends(trendsData || []);
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
        state: "",
        tagline: "",
        avgPricePerSqFt: "₹18,500",
        growthYoY: "+10.5%",
        coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
        description: "",
        topLocalities: "Bandra, Worli, Powai",
      });
    } else if (activeTab === "projects") {
      setFormData({
        title: "",
        developer: "",
        city: "Mumbai",
        locality: "",
        status: "Under Construction",
        category: "New Launch",
        startingPrice: "₹2.50 Cr",
        configurations: "3 & 4 BHK Luxury Residences",
        possessionTimeline: "December 2028",
        reraNumber: "P51700050312",
        phaseProgress: "Foundation Completed & 12 Floors Cast",
        coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
        description: "",
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
        avgPrice: 15000,
        yoyGrowth: 9.5,
        rentalYield: 4.0,
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
          topLocalities: formData.topLocalities ? formData.topLocalities.split(",").map((s) => s.trim()) : [],
        };
        if (modalMode === "create") {
          await createCity(payload);
          toast.success("City created successfully!");
        } else {
          await updateCity(editingItem.id || editingItem.slug, payload);
          toast.success("City updated successfully!");
        }
      } else if (activeTab === "projects") {
        if (modalMode === "create") {
          await createProject(formData);
          toast.success("Project created successfully!");
        } else {
          await updateProject(editingItem.id || editingItem.slug, formData);
          toast.success("Project updated successfully!");
        }
      } else if (activeTab === "insights") {
        const payload = {
          ...formData,
          author: {
            name: formData.authorName,
            role: formData.authorRole,
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
          },
        };
        if (modalMode === "create") {
          await createInsight(payload);
          toast.success("Insight article published!");
        } else {
          await updateInsight(editingItem.id || editingItem.slug, payload);
          toast.success("Insight article updated!");
        }
      } else if (activeTab === "trends") {
        await updateMarketTrend(formData.city, {
          avgPrice: Number(formData.avgPrice),
          yoyGrowth: Number(formData.yoyGrowth),
          rentalYield: Number(formData.rentalYield),
        });
        toast.success(`Market trend benchmark for ${formData.city} updated!`);
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
    const id = item.id || item.slug || item._id;
    const name = item.name || item.title || item.city;
    if (!window.confirm(`Are you sure you want to delete '${name}'? This action is permanent.`)) {
      return;
    }

    try {
      if (activeTab === "cities") {
        await deleteCity(id);
        toast.success(`City '${name}' deleted successfully`);
      } else if (activeTab === "projects") {
        await deleteProject(id);
        toast.success(`Project '${name}' deleted successfully`);
      } else if (activeTab === "insights") {
        await deleteInsight(id);
        toast.success(`Article '${name}' deleted successfully`);
      }
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to delete item");
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Marketplace Catalog & Content Manager — Admin Workspace</title>
      </Helmet>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
            Live Database Content Management
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-0.5">
            Marketplace Catalog & Content
          </h1>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
            Modify metro cities, developer project launches, publication stories, and live running ticker benchmarks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 border border-[var(--color-border)] hover:bg-[var(--color-subtle)] text-[var(--color-foreground)] rounded-sm text-xs flex items-center space-x-1"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-3.5 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold text-xs rounded-sm transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === "cities" && "Add New City"}
              {activeTab === "projects" && "Add New Project"}
              {activeTab === "insights" && "Publish Article"}
              {activeTab === "trends" && "Add Ticker Trend"}
            </span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-[var(--color-border)] gap-2 overflow-x-auto text-xs font-semibold pb-1">
        {[
          { id: "cities", label: `Metros & Cities (${cities.length})`, icon: Building2 },
          { id: "projects", label: `Developer Projects (${projects.length})`, icon: Building },
          { id: "insights", label: `Insights & Articles (${insights.length})`, icon: BookOpen },
          { id: "trends", label: `Live Ticker Indexes (${trends.length})`, icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm("");
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

      {/* Search Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 rounded-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-8 pr-3 py-1.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none"
          />
        </div>

        <div className="text-[11px] font-mono text-[var(--color-muted-foreground)]">
          Realtime MongoDB Connected
        </div>
      </div>

      {/* ====================================================================
          TAB 1: CITIES MANAGEMENT
      ==================================================================== */}
      {activeTab === "cities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-36 w-full bg-[var(--color-subtle)] overflow-hidden">
                  <img
                    src={city.coverImage}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300">
                      {city.state}
                    </span>
                    <h3 className="font-editorial text-xl font-bold">{city.name}</h3>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[var(--color-muted-foreground)] line-clamp-2 text-[11px]">
                      {city.tagline || city.description}
                    </p>
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[var(--color-border)] font-mono text-[11px]">
                      <span>Avg: <strong className="text-[var(--color-foreground)]">{city.avgPricePerSqFt}</strong></span>
                      <span className="text-emerald-600 font-semibold">{city.growthYoY} YoY</span>
                      <span className="text-[var(--color-terracotta)] font-semibold">{city.totalListings || 0} listings</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                    <a
                      href={`/cities/${city.slug || city.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center space-x-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(city)}
                        className="p-1.5 hover:bg-[var(--color-subtle)] text-[var(--color-foreground)] rounded border border-[var(--color-border)]"
                        title="Edit city"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(city)}
                        className="p-1.5 hover:bg-red-500/10 text-red-600 rounded border border-red-500/20"
                        title="Delete city"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 2: DEVELOPER PROJECTS MANAGEMENT
      ==================================================================== */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-36 w-full bg-[var(--color-subtle)] overflow-hidden">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                    {proj.status}
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <span className="text-[10px] text-amber-300 font-medium block">{proj.developer}</span>
                    <h3 className="font-editorial text-lg font-bold truncate">{proj.title}</h3>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-[var(--color-muted-foreground)] flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[var(--color-terracotta)]" />
                      {proj.locality}, {proj.city}
                    </p>
                    <div className="font-mono text-[11px] flex items-center justify-between pt-1 border-t border-[var(--color-border)]">
                      <span className="text-[var(--color-muted-foreground)]">Starts: <strong className="text-[var(--color-foreground)]">{proj.startingPrice}</strong></span>
                      <span className="text-[var(--color-terracotta)] font-semibold">{proj.configurations}</span>
                    </div>
                    <div className="text-[10px] font-mono text-[var(--color-muted-foreground)]">
                      RERA: {proj.reraNumber}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                    <a
                      href={`/projects/${proj.slug || proj.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center space-x-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 hover:bg-[var(--color-subtle)] text-[var(--color-foreground)] rounded border border-[var(--color-border)]"
                        title="Edit project"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj)}
                        className="p-1.5 hover:bg-red-500/10 text-red-600 rounded border border-red-500/20"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 3: INSIGHTS & ARTICLES
      ==================================================================== */}
      {activeTab === "insights" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights
            .filter((art) =>
              searchTerm
                ? art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  art.category?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
            )
            .map((art) => (
              <div
                key={art.id || art.slug}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-36 w-full bg-[var(--color-subtle)] overflow-hidden">
                  <img
                    src={art.heroImage}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                    {art.category}
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--color-muted-foreground)]">
                      {art.publishedDate} • {art.readingTime}
                    </span>
                    <h3 className="font-editorial text-base font-bold text-[var(--color-foreground)] line-clamp-2 mt-1">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-[var(--color-muted-foreground)] line-clamp-2 mt-1">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                    <a
                      href={`/insights/${art.slug || art.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center space-x-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(art)}
                        className="p-1.5 hover:bg-[var(--color-subtle)] text-[var(--color-foreground)] rounded border border-[var(--color-border)]"
                        title="Edit article"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(art)}
                        className="p-1.5 hover:bg-red-500/10 text-red-600 rounded border border-red-500/20"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ====================================================================
          TAB 4: LIVE TICKER INDEXES
      ==================================================================== */}
      {activeTab === "trends" && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-subtle)] flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-xs text-[var(--color-foreground)]">
                Homepage Live Benchmark Ticker Rates
              </h2>
              <p className="text-[11px] text-[var(--color-muted-foreground)]">
                Modifying these numbers dynamically updates the running marquee on the homepage in real time.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--color-canvas)] border-b border-[var(--color-border)] text-[11px] font-mono uppercase text-[var(--color-muted-foreground)]">
                <tr>
                  <th className="p-3">City</th>
                  <th className="p-3">Avg Benchmark (₹/sq.ft)</th>
                  <th className="p-3">YoY Capital Growth</th>
                  <th className="p-3">Rental Yield</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {trends.map((item) => (
                  <tr key={item.city} className="hover:bg-[var(--color-subtle)] transition-colors">
                    <td className="p-3 font-semibold text-[var(--color-foreground)]">{item.city}</td>
                    <td className="p-3 font-mono">₹{Number(item.avgPrice).toLocaleString("en-IN")}/sq.ft</td>
                    <td className="p-3 font-mono font-semibold text-emerald-600">+{item.yoyGrowth}%</td>
                    <td className="p-3 font-mono">{item.rentalYield || 3.8}%</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-2.5 py-1 text-xs border border-[var(--color-border)] hover:bg-[var(--color-surface)] rounded-sm"
                      >
                        Edit Rate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
          CREATE / EDIT MODAL
      ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-subtle)]">
              <h2 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
                {modalMode === "create" ? "Create New" : "Edit"}{" "}
                {activeTab === "cities" && "City Portal"}
                {activeTab === "projects" && "Developer Project"}
                {activeTab === "insights" && "Insight Article"}
                {activeTab === "trends" && "Live Marquee Benchmark"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[var(--color-border)] rounded text-[var(--color-muted-foreground)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* CITIES FORM */}
              {activeTab === "cities" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        City Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>
                </>
              )}

              {/* PROJECTS FORM */}
              {activeTab === "projects" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Locality *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.locality || ""}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        placeholder="Kolshet, Thane West"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status || "Under Construction"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      >
                        <option value="New Launch">New Launch</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Ready to Move">Ready to Move</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Starting Price
                      </label>
                      <input
                        type="text"
                        value={formData.startingPrice || ""}
                        onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                        placeholder="₹2.25 Cr"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Configurations
                      </label>
                      <input
                        type="text"
                        value={formData.configurations || ""}
                        onChange={(e) => setFormData({ ...formData, configurations: e.target.value })}
                        placeholder="3 & 4 BHK Luxury Residences"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        RERA Number
                      </label>
                      <input
                        type="text"
                        value={formData.reraNumber || ""}
                        onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                        placeholder="P51700050312"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Phase Progress
                      </label>
                      <input
                        type="text"
                        value={formData.phaseProgress || ""}
                        onChange={(e) => setFormData({ ...formData, phaseProgress: e.target.value })}
                        placeholder="Foundation Completed & 14 Floors Cast"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>
                </>
              )}

              {/* INSIGHTS FORM */}
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category || "Market Trends"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={formData.authorName || ""}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      Executive Excerpt
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerpt || ""}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {/* TRENDS FORM */}
              {activeTab === "trends" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                      City Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1">
                        YoY Growth Percentage (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.yoyGrowth || ""}
                        onChange={(e) => setFormData({ ...formData, yoyGrowth: e.target.value })}
                        placeholder="7.8"
                        className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs font-mono"
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
                      className="w-full px-3 py-2 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-subtle)] rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Record"}</span>
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

