import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "utils/getApiUrl";
import { ShieldCheck, ArrowRight, RefreshCw, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "react-toastify";

const Signup = () => {
  const [roleType, setRoleType] = useState("buyer"); // "buyer" | "owner" | "advisor"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in all required registration fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const backendRole = roleType === "advisor" ? "employee" : "customer";
      const res = await axios.post(
        `${getApiUrl()}/auth/register`,
        {
          name,
          email,
          phone,
          password,
          role: backendRole,
        },
        { withCredentials: true }
      );

      if (res.data?.success && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("auth:state-change"));
        toast.success("Account created successfully! Welcome to Makaan4U.");

        if (redirectParam && redirectParam.startsWith("/")) {
          navigate(redirectParam);
        } else if (res.data.user?.role === "admin" || res.data.user?.role === "employee") {
          navigate("/admin/dashboard");
        } else {
          navigate("/account");
        }
      } else {
        toast.error(res.data?.message || "Registration failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
          Join Makaan4U
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
          Create Your Property Account
        </h2>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          Shortlist verified properties, track site visit permits, and receive private market alerts.
        </p>
      </div>

      {/* Role Selector */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1.5">
          I am registering as:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "buyer", label: "Homebuyer / NRI" },
            { id: "owner", label: "Property Owner" },
            { id: "advisor", label: "RERA Advisor" },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleType(r.id)}
              className={`py-2 px-2.5 rounded text-center text-xs font-medium border transition-colors ${
                roleType === r.id
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent"
                  : "bg-[var(--color-subtle)] border-[var(--color-border)] text-[var(--color-foreground)]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              required
              placeholder="e.g. Rohini Nambiar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
              <input
                type="email"
                required
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
              <input
                type="tel"
                required
                placeholder="+91 98XXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
            Create Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-[var(--color-muted-foreground)]" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Registering Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted-foreground)]">
        Already registered?{" "}
        <Link to="/auth/login" className="font-semibold text-[var(--color-terracotta)] hover:underline">
          Sign In Here →
        </Link>
      </div>
    </div>
  );
};

export default Signup;
