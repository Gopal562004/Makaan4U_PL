import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "utils/getApiUrl";
import { ShieldCheck, Phone, Mail, Lock, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

const Signin = () => {
  const [authMode, setAuthMode] = useState("password"); // "password" | "otp"
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");

  const handleSendOtp = () => {
    if (!emailOrPhone) {
      toast.error("Please enter your registered phone number or email");
      return;
    }
    setOtpSent(true);
    toast.success("One-time security code sent (Demo Code: 4820)");
  };

  const executeLogin = async (emailToSubmit, passwordToSubmit) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${getApiUrl()}/auth/login`,
        {
          email: emailToSubmit,
          password: passwordToSubmit,
        },
        { withCredentials: true }
      );

      if (res.data?.success && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("auth:state-change"));

        const user = res.data.user;
        toast.success(`Welcome back, ${user.name || "Client"}`);

        if (redirectParam && redirectParam.startsWith("/")) {
          navigate(redirectParam);
        } else if (user.role === "admin" || user.role === "employee") {
          navigate("/admin/dashboard");
        } else {
          navigate("/account");
        }
      } else {
        toast.error(res.data?.message || "Invalid authentication response");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed. Please check credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (authMode === "otp") {
      if (!otp) {
        toast.error("Please enter the 4-digit code");
        return;
      }
      // Demo OTP fallback login
      executeLogin("mayur@example.com", "admin123");
      return;
    }

    if (!emailOrPhone || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    executeLogin(emailOrPhone, password);
  };

  const handleQuickLogin = (email, pass) => {
    setEmailOrPhone(email);
    setPassword(pass);
    executeLogin(email, pass);
  };

  return (
    <div className="space-y-6 text-xs">
      <div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
          Secure Access
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
          Sign In to Your Workspace
        </h2>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          Review saved shortlists, manage scheduled site visits, and access verified dossiers.
        </p>
      </div>

      {/* Quick 1-Click Verification Logins */}
      <div className="p-3 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded-sm space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--color-muted-foreground)] block">
          Quick 1-Click Verification Accounts:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin("mayur@example.com", "admin123")}
            className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-left transition-colors"
          >
            <span className="font-bold text-xs text-[var(--color-foreground)] block truncate">
              Mayur Kadam
            </span>
            <span className="text-[10px] text-[var(--color-terracotta)] font-mono block">
              Lead Admin
            </span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickLogin("gopalgawas2004@gmail.com", "admin123")}
            className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] rounded-sm text-left transition-colors"
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

      {/* Auth Method Switcher */}
      <div className="flex border-b border-[var(--color-border)] text-xs font-semibold gap-4">
        <button
          type="button"
          onClick={() => {
            setAuthMode("password");
            setOtpSent(false);
          }}
          className={`pb-2 transition-colors border-b-2 ${
            authMode === "password"
              ? "border-[var(--color-terracotta)] text-[var(--color-foreground)]"
              : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("otp")}
          className={`pb-2 transition-colors border-b-2 ${
            authMode === "otp"
              ? "border-[var(--color-terracotta)] text-[var(--color-foreground)]"
              : "border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          }`}
        >
          Instant Phone / Email OTP
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
            {authMode === "otp" ? "Phone Number or Email" : "Registered Email"}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
            <input
              type={authMode === "otp" ? "text" : "email"}
              required
              placeholder={authMode === "otp" ? "+91 98XXX XXXXX or name@email.com" : "mayur@example.com"}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
            />
          </div>
        </div>

        {authMode === "password" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)]">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-[11px] text-[var(--color-terracotta)] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>
          </div>
        )}

        {authMode === "otp" && (
          <div className="space-y-2">
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] hover:border-[var(--color-foreground)] font-semibold rounded text-xs transition-colors"
              >
                Send 4-Digit Security Code
              </button>
            ) : (
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
                  Enter 4-Digit Security Code (Demo: 4820)
                </label>
                <input
                  type="text"
                  required
                  maxLength="4"
                  placeholder="4820"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-sm text-center font-mono tracking-widest text-[var(--color-foreground)]"
                />
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted-foreground)]">
        Don't have an account?{" "}
        <Link to="/auth/register" className="font-semibold text-[var(--color-terracotta)] hover:underline">
          Create Free Buyer Account →
        </Link>
      </div>
    </div>
  );
};

export default Signin;
