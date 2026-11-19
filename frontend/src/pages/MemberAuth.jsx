import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useMemberAuth } from "@/context/MemberAuthContext";
import { isApiConfigured } from "@/lib/opportunityApi";

export default function MemberAuth({ defaultMode = "login" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, profile, profileChecked, sessionNotice, clearSessionNotice, login, register } =
    useMemberAuth();

  const [mode, setMode] = useState(defaultMode === "register" ? "register" : "login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const nextUrl = searchParams.get("next") || "";
  const apiReady = isApiConfigured();

  useEffect(() => {
    setMode(defaultMode === "register" ? "register" : "login");
    setFormError("");
  }, [defaultMode]);

  useEffect(() => {
    document.title =
      mode === "register" ? "Create Member Account · BECCI Portal" : "Member Sign In · BECCI Portal";
  }, [mode]);

  // If already authenticated (and not mid-submit), redirect cleanly
  useEffect(() => {
    if (submitting) return;
    if (isAuthenticated && profileChecked) {
      if (nextUrl && nextUrl.startsWith("/")) {
        navigate(nextUrl, { replace: true });
      } else {
        navigate(profile ? "/member/dashboard" : "/member/profile", { replace: true });
      }
    }
  }, [submitting, isAuthenticated, profile, profileChecked, nextUrl, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    clearSessionNotice();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || cleanEmail.length < 5) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (mode === "register") {
      if (displayName.trim().length < 2) {
        setFormError("Please enter your full name or founder display name (at least 2 characters).");
        return;
      }
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters long.");
        return;
      }
    } else if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "register") {
        await register({
          email: cleanEmail,
          password,
          display_name: displayName.trim(),
        });
        toast.success("Member account created! Complete your business profile to unlock matches.");
        navigate("/member/profile", { replace: true });
      } else {
        const res = await login({ email: cleanEmail, password });
        toast.success(`Welcome back, ${res.member.display_name}.`);
        if (nextUrl && nextUrl.startsWith("/")) {
          navigate(nextUrl, { replace: true });
        } else {
          navigate(res.profile ? "/member/dashboard" : "/member/profile", { replace: true });
        }
      }
    } catch (err) {
      setFormError(err?.message || "Authentication failed. Please check your credentials and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[85vh] bg-navy-950 pb-20 pt-28 text-white sm:pt-32">
      <div className="becci-container">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          {/* Left Institutional Context */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-ice/20 bg-white/[0.06] px-3.5 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>BECCI Member Opportunity Portal</span>
            </span>

            <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              Evidence-backed opportunities matched to your enterprise.
            </h1>

            <p className="font-body text-sm leading-relaxed text-ice/85 sm:text-base">
              Register or sign in to create your private BECCI business profile, receive ranked government
              tenders, schemes, and jobs matched to your sector and state, inspect missing eligibility
              requirements, and save opportunities before deadlines close.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "Deterministic matching powered by BECCI's verified Opportunity Engine — zero fabricated listings.",
                "Strict data minimisation: no PAN, Aadhaar, GSTIN, Udyam numbers, or bank details required.",
                "Complete member isolation: your business profile, saved items, and viewing history stay private.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-body text-xs leading-relaxed text-ice/80 sm:text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-bright" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-ice/15 pt-4">
              <Link
                to="/opportunities"
                className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-teal-bright hover:text-white"
              >
                <span>Browse Public Verified Opportunities without signing in</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Auth Card */}
          <div className="rounded-3xl border border-ice/15 bg-white p-6 text-navy-950 shadow-lift sm:p-8">
            {/* Mode Switcher */}
            <div
              role="tablist"
              aria-label="Member authentication mode"
              className="grid grid-cols-2 gap-1 rounded-2xl bg-frost p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                data-testid="auth-tab-login"
                onClick={() => {
                  setMode("login");
                  setFormError("");
                  navigate("/member/login", { replace: true });
                }}
                className={`min-h-[42px] rounded-xl font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${
                  mode === "login"
                    ? "bg-navy-950 text-white shadow-xs"
                    : "text-navy-800/75 hover:text-navy-950"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                data-testid="auth-tab-register"
                onClick={() => {
                  setMode("register");
                  setFormError("");
                  navigate("/member/register", { replace: true });
                }}
                className={`min-h-[42px] rounded-xl font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${
                  mode === "register"
                    ? "bg-navy-950 text-white shadow-xs"
                    : "text-navy-800/75 hover:text-navy-950"
                }`}
              >
                Register Account
              </button>
            </div>

            {!apiReady && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-600/30 bg-amber-50 p-4 text-xs text-amber-950"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                <span>
                  The Opportunity Engine API endpoint is not configured for this environment yet. Member
                  sign-in requires a connected backend API (`REACT_APP_BECCI_API_BASE_URL`).
                </span>
              </div>
            )}

            {sessionNotice && (
              <div
                role="alert"
                data-testid="auth-session-notice"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-600/30 bg-amber-50 p-4 text-xs text-amber-950"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                <span>{sessionNotice}</span>
              </div>
            )}

            {formError && (
              <div
                role="alert"
                data-testid="auth-form-error"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-rose-700/25 bg-rose-50 p-4 text-xs text-rose-900"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="member-display-name"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    Full Name / Founder Name <span className="text-rose-700">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600"
                      aria-hidden="true"
                    />
                    <input
                      id="member-display-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      data-testid="auth-display-name"
                      placeholder="e.g. Ramesh Kumar"
                      className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 pl-10 pr-4 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="member-email"
                  className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                >
                  Email Address <span className="text-rose-700">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600"
                    aria-hidden="true"
                  />
                  <input
                    id="member-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="auth-email"
                    placeholder="founder@enterprise.in"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 pl-10 pr-4 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="member-password"
                  className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                >
                  Password <span className="text-rose-700">*</span>
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600"
                    aria-hidden="true"
                  />
                  <input
                    id="member-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="auth-password"
                    placeholder={mode === "register" ? "Minimum 8 characters" : "Enter your password"}
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 pl-10 pr-11 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-navy-800/60 hover:bg-frost hover:text-navy-950"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "register" && (
                  <p className="mt-1 font-body text-[0.72rem] text-navy-800/65">
                    Use at least 8 characters. Your password is never stored in browser storage.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !apiReady}
                data-testid="auth-submit-btn"
                className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>{mode === "register" ? "Creating Account…" : "Signing In…"}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "register" ? "Create Member Account" : "Sign In to Member Portal"}</span>
                    <ArrowRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            {mode === "login" && (
              <p className="mt-5 border-t border-navy-800/10 pt-4 text-center font-body text-xs text-navy-800/70">
                Self-service password recovery is not yet enabled on the backend API. If you need account
                assistance, please{" "}
                <Link to="/contact" className="font-heading font-semibold text-navy-700 underline">
                  contact the BECCI Secretariat
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
