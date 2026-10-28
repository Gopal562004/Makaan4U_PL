import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Lazy-loaded Core Public Pages
const HomePage = lazy(() => import("./pages/home-page"));
const PropertyListings = lazy(() => import("./pages/property-listings"));
const PropertyDetails = lazy(() => import("./pages/property-details"));
const ProjectsPage = lazy(() => import("./pages/projects"));
const ProjectDetails = lazy(() => import("./pages/projects/ProjectDetails"));
const CitiesPage = lazy(() => import("./pages/cities"));
const CityDetails = lazy(() => import("./pages/cities/CityDetails"));
const LocalitiesPage = lazy(() => import("./pages/localities"));
const LocalityDetails = lazy(() => import("./pages/localities/LocalityDetails"));
const InsightsPage = lazy(() => import("./pages/insights"));
const ArticleDetails = lazy(() => import("./pages/insights/ArticleDetails"));
const MarketInsightsPage = lazy(() => import("./pages/market-insights"));
const ComparePage = lazy(() => import("./pages/compare"));
const AgentsPage = lazy(() => import("./pages/agents"));
const AgentDetails = lazy(() => import("./pages/agents/AgentDetails"));
const DevelopersPage = lazy(() => import("./pages/developers"));
const DeveloperDetails = lazy(() => import("./pages/developers/DeveloperDetails"));
const About = lazy(() => import("./pages/about/About"));
const ContactPage = lazy(() => import("./pages/contact"));
const PostProperty = lazy(() => import("./pages/post-property"));
const NotFound = lazy(() => import("pages/NotFound"));

// Auth Pages
const AuthLayout = lazy(() => import("./pages/auth"));
const Signin = lazy(() => import("./pages/auth/signin/signin"));
const Signup = lazy(() => import("./pages/auth/signup/signup"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password/ResetPassword"));

// User Account Workspace
const AccountPage = lazy(() => import("./pages/account"));

// Legacy Admin Layout
const AdminLayout = lazy(() => import("./pages/admin-dashboard/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin-dashboard/dashboard/AdminDashboard"));
const ReportsDashboard = lazy(() => import("./pages/admin-dashboard/reports/ReportsDashboard"));
const PropertyDashboard = lazy(() => import("./pages/admin-dashboard/property/PropertyDashboard"));
const UserDashboard = lazy(() => import("./pages/admin-dashboard/users/UserDashboard"));
const AnalyticsDashboard = lazy(() => import("./pages/admin-dashboard/analytics/AnalyticsDashboard"));

// Subtle Architectural Page Loader
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-[var(--color-canvas)]">
    <div className="space-y-3 text-center">
      <div className="w-8 h-8 border-2 border-[var(--color-terracotta)] border-t-transparent rounded-full animate-spin mx-auto" />
      <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)] font-mono block">
        Loading Verified Dossier...
      </span>
    </div>
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <RouterRoutes>
            {/* Primary Discovery & Marketplace Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route path="/properties" element={<PropertyListings />} />
            <Route path="/property-listings" element={<PropertyListings />} />
            <Route path="/properties/:slug" element={<PropertyDetails />} />
            <Route path="/property-details/:slug" element={<PropertyDetails />} />

            {/* Project Discovery Routes */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />

            {/* City Regional Portals */}
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/cities/:city" element={<CityDetails />} />

            {/* Micro-Market Locality Intelligence */}
            <Route path="/localities" element={<LocalitiesPage />} />
            <Route path="/localities/:slug" element={<LocalityDetails />} />

            {/* Insights & Publication */}
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/blog" element={<InsightsPage />} />
            <Route path="/insights/:slug" element={<ArticleDetails />} />
            <Route path="/market-insights" element={<MarketInsightsPage />} />

            {/* Comparison Experience */}
            <Route path="/compare" element={<ComparePage />} />

            {/* Certified Advisors & Developer Profiles */}
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/:id" element={<AgentDetails />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/developers/:id" element={<DeveloperDetails />} />

            {/* Institutional Information & Contact */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Property Listing Onboarding */}
            <Route path="/post-property" element={<PostProperty />} />

            {/* User Account Workspace */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/saved" element={<AccountPage />} />
            <Route path="/account/visits" element={<AccountPage />} />
            <Route path="/account/enquiries" element={<AccountPage />} />
            <Route path="/account/alerts" element={<AccountPage />} />
            <Route path="/account/recent" element={<AccountPage />} />
            <Route path="/account/settings" element={<AccountPage />} />
            <Route path="/profile" element={<AccountPage />} />
            <Route path="/profile/*" element={<AccountPage />} />

            {/* Auth Routes with Layout */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Signin />} />
              <Route path="register" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>
            <Route path="/login" element={<AuthLayout><Signin /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><Signup /></AuthLayout>} />

            {/* Admin Management Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="reports" element={<ReportsDashboard />} />
              <Route path="post-property" element={<PostProperty />} />
              <Route path="properties/edit/:id" element={<PostProperty />} />
              <Route path="properties" element={<PropertyDashboard />} />
              <Route path="users" element={<UserDashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
            </Route>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/reports-dashboard" element={<ReportsDashboard />} />

            {/* Architectural 404 Route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;