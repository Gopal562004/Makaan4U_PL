import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password successfully updated. Please sign in.");
    navigate("/auth/login");
  };

  return (
    <div className="space-y-6 text-xs">
      <div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
          Password Update
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
          Set New Account Password
        </h2>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          Please enter your updated confidential password credentials.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
            New Password *
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

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
            Confirm New Password *
          </label>
          <input
            type="password"
            required
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1"
        >
          <span>Update Password & Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
