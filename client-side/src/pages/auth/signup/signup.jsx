import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { toast } from "react-toastify";

const Signup = () => {
  const [role, setRole] = useState("buyer"); // "buyer" | "owner" | "advisor"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in all required registration fields");
      return;
    }

    const newUser = {
      name,
      email,
      phone,
      role,
      city: "Mumbai"
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", "makaan4u-registered-user-token");
    toast.success("Account created successfully!");
    navigate("/account");
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
            { id: "advisor", label: "RERA Broker" }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`py-2 px-2.5 rounded text-center text-xs font-medium border transition-colors ${
                role === r.id
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
          <input
            type="text"
            required
            placeholder="e.g. Rohini Nambiar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
              Mobile Number (WhatsApp) *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98XXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
            Create Password *
          </label>
          <input
            type="password"
            required
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1 shadow-xs"
        >
          <span>Complete Registration</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
