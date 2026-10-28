import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email");
      return;
    }
    setSubmitted(true);
    toast.success("Password recovery instructions dispatched.");
  };

  return (
    <div className="space-y-6 text-xs">
      <div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-terracotta)]">
          Account Security
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-foreground)] mt-1">
          Recover Your Password
        </h2>
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          Enter your registered email address and we will dispatch a secure reset token.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-editorial text-lg font-bold text-[var(--color-foreground)]">
            Instructions Sent
          </h3>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            A secure recovery link has been dispatched to <strong>{email}</strong>. Please check your inbox.
          </p>
          <Link
            to="/auth/login"
            className="inline-block mt-2 font-semibold text-[var(--color-terracotta)] hover:underline"
          >
            Return to Sign In →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)] mb-1">
              Registered Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-subtle)] border border-[var(--color-border)] rounded text-xs text-[var(--color-foreground)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Recovery Link</span>
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-[var(--color-border)] text-center text-xs">
        <Link
          to="/auth/login"
          className="inline-flex items-center space-x-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
