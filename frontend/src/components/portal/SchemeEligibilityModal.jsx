import React, { useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  HelpCircle,
  Info,
  Loader2,
  RotateCcw,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { checkSchemeEligibility } from "@/lib/opportunityApi";

const CASTE_COMMUNITIES = [
  "BC-A",
  "BC-B",
  "BC-C",
  "BC-D",
  "BC-E",
  "OBC",
  "EBC",
  "DNT",
  "General",
  "SC",
  "ST",
];

const DOMICILE_STATES = [
  "Telangana",
  "Andhra Pradesh",
  "National / Other State",
];

export default function SchemeEligibilityModal({ scheme, isOpen, onClose }) {
  const [domicileState, setDomicileState] = useState("Telangana");
  const [casteCommunity, setCasteCommunity] = useState("BC-B");
  const [isNonCreamyLayer, setIsNonCreamyLayer] = useState(true);
  const [annualIncome, setAnnualIncome] = useState("180000");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("female");
  const [education, setEducation] = useState("Graduate");
  const [isEntrepreneur, setIsEntrepreneur] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen || !scheme) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      domicile_state: domicileState === "National / Other State" ? null : domicileState,
      caste_community: casteCommunity,
      is_non_creamy_layer: isNonCreamyLayer,
      annual_family_income: annualIncome ? Number(annualIncome) : null,
      age: age ? Number(age) : null,
      gender: gender || null,
      education: education || null,
      is_entrepreneur: isEntrepreneur,
    };

    try {
      const assessment = await checkSchemeEligibility(scheme.id || scheme.slug, payload);
      setResult(assessment);
    } catch (err) {
      setError(err?.message || "Unable to evaluate eligibility. Please verify details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="eligibility-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy-950/70 p-4 backdrop-blur-sm"
    >
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-navy-800/15 bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-2 text-navy-800/60 transition-colors hover:bg-frost hover:text-navy-950"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 border-b border-navy-800/10 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/15 text-navy-900">
            <Sparkles className="h-5 w-5 text-teal-deep" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal/15 px-2.5 py-0.5 font-heading text-[0.66rem] font-bold uppercase tracking-wider text-teal-deep">
                AI Eligibility Advisor
              </span>
              <span className="font-heading text-xs font-semibold text-navy-800/70">
                Official Scheme Evaluation
              </span>
            </div>
            <h2 id="eligibility-modal-title" className="mt-1 font-heading text-lg font-bold text-navy-950 sm:text-xl">
              {scheme.title}
            </h2>
            <p className="mt-0.5 font-body text-xs text-navy-800/70">
              Issuing Authority: <strong>{scheme.issuing_organisation || "Government Department"}</strong>
            </p>
          </div>
        </div>

        {/* Evaluation Form */}
        {!result && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <p className="font-body text-xs leading-relaxed text-navy-800/80">
              Enter your applicant profile parameters below. BECCI's assessment engine compares your inputs against the official government scheme guidelines in real-time.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Domicile State */}
              <div>
                <label className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75">
                  Domicile State
                </label>
                <select
                  value={domicileState}
                  onChange={(e) => setDomicileState(e.target.value)}
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                >
                  {DOMICILE_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caste / Community */}
              <div>
                <label className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75">
                  Caste / Community Category
                </label>
                <select
                  value={casteCommunity}
                  onChange={(e) => setCasteCommunity(e.target.value)}
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                >
                  {CASTE_COMMUNITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Annual Family Income */}
              <div>
                <label className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75">
                  Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="e.g. 180000"
                  required
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                />
              </div>

              {/* Age */}
              <div>
                <label className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75">
                  Applicant Age (Years)
                </label>
                <input
                  type="number"
                  min="16"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 25"
                  required
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Transgender / Other</option>
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75">
                  Highest Qualification
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                >
                  <option value="SSC / Class 10">SSC / Class 10</option>
                  <option value="Intermediate / 10+2">Intermediate / 10+2</option>
                  <option value="Graduate">Graduate (Degree / B.Tech / etc.)</option>
                  <option value="Post Graduate">Post Graduate / Professional</option>
                </select>
              </div>
            </div>

            {/* Checkbox row */}
            <div className="flex flex-wrap items-center gap-6 rounded-xl border border-navy-800/10 bg-frost/40 p-3.5">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={isNonCreamyLayer}
                  onChange={(e) => setIsNonCreamyLayer(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-800/30 text-teal focus:ring-teal"
                />
                <span className="font-body text-xs font-medium text-navy-900">
                  Holds Non-Creamy Layer (NCL) Certificate
                </span>
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={isEntrepreneur}
                  onChange={(e) => setIsEntrepreneur(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-800/30 text-teal focus:ring-teal"
                />
                <span className="font-body text-xs font-medium text-navy-900">
                  Registered Entrepreneur / Business Owner
                </span>
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-600/30 bg-rose-50/50 p-3 text-xs text-rose-900">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-navy-800/15 px-4 py-2 font-heading text-xs font-semibold text-navy-800 hover:bg-frost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white shadow-soft transition-colors hover:bg-navy-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Evaluating with AI Advisor…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
                    <span>Check AI Eligibility</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Assessment Result */}
        {result && (
          <div className="mt-5 space-y-4">
            {/* Status Header */}
            <div
              className={`rounded-2xl border p-4 sm:p-5 ${
                result.status === "eligible"
                  ? "border-emerald-600/30 bg-emerald-50/60"
                  : result.status === "ineligible"
                  ? "border-rose-600/30 bg-rose-50/60"
                  : "border-amber-600/30 bg-amber-50/60"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.status === "eligible" ? (
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
                ) : result.status === "ineligible" ? (
                  <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-700" aria-hidden="true" />
                ) : (
                  <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
                )}
                <div>
                  <h3 className="font-heading text-base font-bold text-navy-950 sm:text-lg">
                    {result.status_label || (result.status === "eligible" ? "Eligible" : "Assessment Complete")}
                  </h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-navy-900/80">
                    {result.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* Matched Criteria */}
            {Array.isArray(result.matched_conditions) && result.matched_conditions.length > 0 && (
              <div className="rounded-xl border border-emerald-600/20 bg-white p-4">
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Matched Conditions ({result.matched_conditions.length})
                </p>
                <ul className="mt-2 space-y-1.5 font-body text-xs text-navy-900/85">
                  {result.matched_conditions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Unmatched Conditions */}
            {Array.isArray(result.unmatched_conditions) && result.unmatched_conditions.length > 0 && (
              <div className="rounded-xl border border-rose-600/20 bg-white p-4">
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-rose-900">
                  Unmatched Conditions ({result.unmatched_conditions.length})
                </p>
                <ul className="mt-2 space-y-1.5 font-body text-xs text-navy-900/85">
                  {result.unmatched_conditions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Information */}
            {Array.isArray(result.missing_information) && result.missing_information.length > 0 && (
              <div className="rounded-xl border border-sky-600/20 bg-sky-50/40 p-4">
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-sky-900">
                  Required Documents / Information
                </p>
                <ul className="mt-2 space-y-1.5 font-body text-xs text-navy-900/85">
                  {result.missing_information.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Official Disclaimer */}
            <div className="flex items-start gap-2.5 rounded-xl border border-navy-800/10 bg-frost/60 p-3.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" aria-hidden="true" />
              <p className="font-body text-[0.7rem] leading-relaxed text-navy-800/80">
                <strong>Official Advisory Disclaimer:</strong> {result.disclaimer || "Eligibility assessment is advisory only based on user-supplied parameters. BECCI does not promise or guarantee approval of any grant, subsidy, loan or scholarship. Final eligibility is determined exclusively by the respective issuing government department."}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-full border border-navy-800/15 bg-white px-4 py-2 font-heading text-xs font-semibold text-navy-800 hover:bg-frost"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Re-Evaluate Details</span>
              </button>

              <div className="flex items-center gap-2">
                {scheme.application_url && (
                  <a
                    href={scheme.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-teal px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-colors hover:bg-teal-bright"
                  >
                    <span>Apply on Official Portal</span>
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold text-white hover:bg-navy-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
