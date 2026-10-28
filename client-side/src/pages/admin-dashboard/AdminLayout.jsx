import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "utils/getApiUrl";
import Header from "../../components/ui/Header";
import FloatingChat from "../../components/ui/FloatingChat";
import Footer from "../../components/ui/Footer";
import Logo from "../../components/ui/Logo";
import Icon from "../../components/AppIcon";
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // Login Form States (for in-place admin gate)
  const [loginEmail, setLoginEmail] = useState("mayur@example.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");

  const isAdmin = useMemo(() => {
    return Boolean(
      token &&
      token !== "makaan4u-demo-token-verified" &&
      token !== "makaan4u-registered-user-token" &&
      currentUser &&
      (currentUser.role === "admin" || currentUser.role === "employee")
    );
  }, [token, currentUser]);

  // Clean up legacy mock tokens & listen for 401 unauthorized events
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken === "makaan4u-demo-token-verified" || storedToken === "makaan4u-registered-user-token") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setCurrentUser(null);
    }

    const handleUnauthorized = () => {
      setToken(null);
      setCurrentUser(null);
      setAuthError("Session expired or unauthorized. Please sign in with admin credentials.");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  // Handle In-Place Admin Login
  const handleAdminLogin = async (e, customEmail, customPassword) => {
    if (e) e.preventDefault();
    const emailToUse = customEmail || loginEmail;
    const passwordToUse = customPassword || loginPassword;

    try {
      setIsAuthenticating(true);
      setAuthError("");

      const res = await axios.post(`${getApiUrl()}/auth/login`, {
        email: emailToUse,
        password: passwordToUse,
      }, {
        withCredentials: true,
      });

      if (res.data?.success && res.data?.token) {
        const receivedToken = res.data.token;
        const receivedUser = res.data.user;

        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(receivedUser));

        setToken(receivedToken);
        setCurrentUser(receivedUser);

        toast.success(`Welcome to Admin Workspace, ${receivedUser.name || "Administrator"}`);
      } else {
        setAuthError(res.data?.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Admin authentication error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to authenticate with server";
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    toast.info("Signed out of Admin Workspace");
  }, []);

  const handleToggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  // Sidebar navigation items
  const sidebarItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "LayoutDashboard",
        path: "/admin/dashboard",
      },
      {
        id: "properties",
        label: "Properties",
        icon: "Building",
        path: "/admin/properties",
      },
      {
        id: "add-property",
        label: "Post Property",
        icon: "PlusCircle",
        path: "/admin/post-property",
      },
      {
        id: "users",
        label: "Users & Staff",
        icon: "Users",
        path: "/admin/users",
      },
      {
        id: "reports",
        label: "Reports & Audits",
        icon: "FileText",
        path: "/admin/reports",
      },
      {
        id: "analytics",
        label: "Market Trends",
        icon: "TrendingUp",
        path: "/admin/analytics",
      },
    ],
    []
  );

  const isActivePath = (path) => {
    if (path === "/admin/dashboard" && location.pathname === "/admin") return true;
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* ====================================================================
          ADMIN ACCESS CONTROL GATE (Shown when unauthenticated or non-admin)
      ==================================================================== */}
      {!isAdmin ? (
        <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[var(--color-canvas)]">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-sm shadow-sm space-y-6">
            <div className="text-center space-y-3">
              <Logo variant="stacked" size="md" taglineText="Authorized Administrator Console" />
              <p className="text-xs text-[var(--color-muted-foreground)] max-w-xs mx-auto pt-1">
                Authorized access required to review RERA registrations, client dossiers, and live financials.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-sm flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Quick Demo Admin Logins */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--color-muted-foreground)] block">
                Quick 1-Click Verification Logins:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={() => handleAdminLogin(null, "mayur@example.com", "admin123")}
                  className="p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-left transition-all hover:bg-[var(--color-surface)]"
                >
                  <span className="font-bold text-xs text-[var(--color-foreground)] block truncate">
                    Mayur Kadam
                  </span>
                  <span className="text-[10px] text-[var(--color-terracotta)] font-mono block">
                    Lead Advisor (Admin)
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={() => handleAdminLogin(null, "gopalgawas2004@gmail.com", "admin123")}
                  className="p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-left transition-all hover:bg-[var(--color-surface)]"
                >
                  <span className="font-bold text-xs text-[var(--color-foreground)] block truncate">
                    Gopal Gawas
                  </span>
                  <span className="text-[10px] text-[var(--color-terracotta)] font-mono block">
                    System Admin
                  </span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[var(--color-border)] w-full" />
              <span className="bg-[var(--color-surface)] px-2 text-[10px] text-[var(--color-muted-foreground)] uppercase font-mono absolute">
                or enter credentials
              </span>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1 uppercase tracking-wider">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-muted-foreground)] mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Admin Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ====================================================================
            AUTHENTICATED ADMIN WORKSPACE
        ==================================================================== */
        <div className="flex flex-1">
          {/* Sticky Sidebar */}
          <aside className="hidden lg:block w-64 bg-card border-r border-border flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar z-30">
            <div className="p-6 flex flex-col justify-between min-h-full">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Admin Workspace
                  </h2>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold rounded">
                    ACTIVE
                  </span>
                </div>

                <nav className="space-y-1.5">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        isActivePath(item.path)
                          ? "text-primary bg-primary/10 border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        size={18}
                        className={isActivePath(item.path) ? "text-primary" : ""}
                      />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Admin Profile Strip in Sidebar Bottom */}
              <div className="pt-4 mt-6 border-t border-border flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-foreground truncate">
                    {currentUser?.name || "Admin"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {currentUser?.email || ""}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-muted text-muted-foreground hover:text-red-600 rounded transition-colors"
                  title="Sign Out"
                >
                  <Icon name="LogOut" size={16} />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      )}

      {/* Footer spans the entire width below sidebar and content */}
      <Footer />

      <FloatingChat isOpen={isChatOpen} onToggle={handleToggleChat} />

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};

export default React.memo(AdminLayout);
