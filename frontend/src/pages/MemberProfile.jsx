import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  FileCheck2,
  Info,
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useMemberAuth } from "@/context/MemberAuthContext";
import {
  BECCI_SECTORS,
  BUSINESS_STAGES,
  BUSINESS_TYPES,
  ENTITY_TYPES,
  GST_STATUSES,
  INDIAN_STATES,
  OPPORTUNITY_CATEGORIES,
  UDYAM_STATUSES,
  saveMemberProfile,
} from "@/lib/opportunityApi";

const STEPS = [
  { id: 1, title: "Business Identity", subtitle: "Name, enterprise type & BECCI sector", Icon: Building2 },
  { id: 2, title: "Location & Structure", subtitle: "State, district, stage & legal entity", Icon: MapPin },
  { id: 3, title: "Registrations", subtitle: "Udyam, GST & optional track record", Icon: FileCheck2 },
  { id: 4, title: "Preferences", subtitle: "Products, capabilities & categories", Icon: Sparkles },
];

const INITIAL_FORM = {
  business_name: "",
  business_type: "service_provider",
  becci_sector: "",
  industry: "",
  secondary_sectors: [],
  state: "Telangana",
  district: "",
  business_stage: "micro",
  entity_type: "sole_proprietorship",
  msme_udyam_status: "unknown",
  gst_status: "unknown",
  annual_turnover_lakhs: "",
  years_of_experience: "",
  licences_and_registrations: [],
  products_and_services: [],
  capabilities: [],
  preferred_categories: ["tender", "funding", "job"],
};

function TagInput({ id, label, hint, placeholder, items, onChange }) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const clean = draft.trim();
    if (!clean) return;
    if (!items.includes(clean)) {
      onChange([...items, clean]);
    }
    setDraft("");
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-heading text-xs font-semibold text-navy-900">
        {label}
      </label>
      {hint && <p className="mb-2 font-body text-xs text-navy-800/65">{hint}</p>}
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="min-h-[42px] flex-1 rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
        />
        <button
          type="button"
          onClick={addItem}
          className="inline-flex min-h-[42px] shrink-0 items-center gap-1 rounded-xl border border-navy-800/15 bg-white px-3.5 font-heading text-xs font-semibold text-navy-950 hover:border-navy-600"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Add</span>
        </button>
      </div>
      {items.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-600/20 bg-frost px-3 py-1 font-heading text-xs font-semibold text-navy-900"
            >
              <span>{item}</span>
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(items.filter((x) => x !== item))}
                className="text-navy-700 hover:text-rose-700"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MemberProfile() {
  const navigate = useNavigate();
  const { member, profile, profileLoading, setProfile } = useMemberAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = profile
      ? "Edit Business Profile · BECCI Member Portal"
      : "Business Profile Onboarding · BECCI Member Portal";
  }, [profile]);

  // Hydrate form from existing backend profile when loaded
  useEffect(() => {
    if (!profile) return;
    setForm({
      business_name: profile.business_name || "",
      business_type: profile.business_type || "service_provider",
      becci_sector: profile.becci_sector || "",
      industry: profile.industry || "",
      secondary_sectors: Array.isArray(profile.secondary_sectors) ? profile.secondary_sectors : [],
      state: profile.state || "Telangana",
      district: profile.district || "",
      business_stage: profile.business_stage || "micro",
      entity_type: profile.entity_type || "sole_proprietorship",
      msme_udyam_status: profile.msme_udyam_status || "unknown",
      gst_status: profile.gst_status || "unknown",
      annual_turnover_lakhs:
        profile.annual_turnover_lakhs !== null && profile.annual_turnover_lakhs !== undefined
          ? String(profile.annual_turnover_lakhs)
          : "",
      years_of_experience:
        profile.years_of_experience !== null && profile.years_of_experience !== undefined
          ? String(profile.years_of_experience)
          : "",
      licences_and_registrations: Array.isArray(profile.licences_and_registrations)
        ? profile.licences_and_registrations
        : [],
      products_and_services: Array.isArray(profile.products_and_services)
        ? profile.products_and_services
        : [],
      capabilities: Array.isArray(profile.capabilities) ? profile.capabilities : [],
      preferred_categories:
        Array.isArray(profile.preferred_categories) && profile.preferred_categories.length > 0
          ? profile.preferred_categories
          : ["tender", "funding", "job"],
    });
  }, [profile]);

  const updateField = (key, value) => {
    setError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSecondarySector = (sec) => {
    if (sec === form.becci_sector) return;
    setForm((prev) => {
      const exists = prev.secondary_sectors.includes(sec);
      if (exists) {
        return { ...prev, secondary_sectors: prev.secondary_sectors.filter((s) => s !== sec) };
      }
      if (prev.secondary_sectors.length >= 5) {
        toast.info("You can select up to 5 secondary BECCI sectors.");
        return prev;
      }
      return { ...prev, secondary_sectors: [...prev.secondary_sectors, sec] };
    });
  };

  const togglePreferredCategory = (catVal) => {
    setForm((prev) => {
      const exists = prev.preferred_categories.includes(catVal);
      if (exists && prev.preferred_categories.length === 1) {
        toast.info("Keep at least one opportunity category selected.");
        return prev;
      }
      return {
        ...prev,
        preferred_categories: exists
          ? prev.preferred_categories.filter((c) => c !== catVal)
          : [...prev.preferred_categories, catVal],
      };
    });
  };

  const validateStep = (targetStep) => {
    if (targetStep === 1) {
      if (form.business_name.trim().length < 2) {
        setError("Please enter your business or enterprise name (at least 2 characters).");
        return false;
      }
      if (!form.becci_sector) {
        setError("Please choose your primary BECCI sector.");
        return false;
      }
    }
    if (targetStep === 2) {
      if (!form.state || form.state.trim().length < 2) {
        setError("Please select your primary State / UT.");
        return false;
      }
    }
    if (targetStep === 3) {
      if (form.annual_turnover_lakhs !== "" && Number(form.annual_turnover_lakhs) < 0) {
        setError("Annual turnover cannot be negative.");
        return false;
      }
      if (form.years_of_experience !== "" && Number(form.years_of_experience) < 0) {
        setError("Years of experience cannot be negative.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    const payload = {
      business_name: form.business_name.trim(),
      business_type: form.business_type,
      becci_sector: form.becci_sector,
      industry: form.industry.trim() || null,
      secondary_sectors: form.secondary_sectors.filter((s) => s !== form.becci_sector),
      state: form.state.trim(),
      district: form.district.trim() || null,
      business_stage: form.business_stage,
      entity_type: form.entity_type,
      msme_udyam_status: form.msme_udyam_status,
      gst_status: form.gst_status,
      annual_turnover_lakhs:
        form.annual_turnover_lakhs !== "" ? Number(form.annual_turnover_lakhs) : null,
      years_of_experience:
        form.years_of_experience !== "" ? Number(form.years_of_experience) : null,
      licences_and_registrations: form.licences_and_registrations,
      products_and_services: form.products_and_services,
      capabilities: form.capabilities,
      preferred_categories: form.preferred_categories,
    };

    setSaving(true);
    setError("");
    try {
      const saved = await saveMemberProfile(payload, Boolean(profile));
      setProfile(saved);
      toast.success(
        profile
          ? "Business profile updated — recommendations refreshed."
          : "Business profile created! Opening your personalised dashboard."
      );
      navigate("/member/dashboard");
    } catch (err) {
      setError(err?.message || "Unable to save business profile. Please review your entries.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-[85vh] bg-frost pb-20 pt-28 sm:pt-32">
      <div className="becci-container max-w-4xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-navy-600">
              BECCI Member Onboarding · {member?.display_name}
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold text-navy-950 sm:text-3xl">
              {profile ? "Update Your Business Profile" : "Set Up Your Business Profile"}
            </h1>
          </div>
          {profile && (
            <Link
              to="/member/dashboard"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-navy-800/15 bg-white px-4 py-1.5 font-heading text-xs font-semibold text-navy-950 hover:border-navy-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Dashboard</span>
            </Link>
          )}
        </div>

        {/* Why Business Profile Matters + Data Minimisation */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-navy-600/20 bg-white p-4 shadow-soft">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-navy-600" aria-hidden="true" />
          <div className="font-body text-xs leading-relaxed text-navy-900/85 sm:text-sm">
            <strong>Why we ask for this:</strong> BECCI’s matching engine compares your sector, state,
            enterprise type, and registration status against official tender, scheme, and job criteria so you
            immediately see why an opportunity matches and which requirements (such as Udyam or GST) you may
            need before applying. <strong>You do not need every optional field</strong>, and we never ask for
            PAN, Aadhaar, GSTIN, Udyam numbers, or bank details.
          </div>
        </div>

        {/* Step Indicator */}
        <nav aria-label="Onboarding steps" className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {STEPS.map((st) => {
            const active = step === st.id;
            const completed = step > st.id;
            const Icon = st.Icon;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  if (st.id < step || validateStep(step)) setStep(st.id);
                }}
                data-testid={`profile-step-tab-${st.id}`}
                className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-colors ${
                  active
                    ? "border-navy-950 bg-navy-950 text-white"
                    : completed
                      ? "border-teal-deep/30 bg-teal-mist/50 text-navy-950"
                      : "border-navy-800/10 bg-white text-navy-800/80 hover:border-navy-600/35"
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-teal text-navy-950"
                      : completed
                        ? "bg-teal-deep text-white"
                        : "bg-frost text-navy-800"
                  }`}
                >
                  {completed ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-xs font-bold leading-tight">{st.title}</p>
                  <p
                    className={`mt-0.5 truncate font-body text-[0.68rem] ${
                      active ? "text-ice/80" : "text-navy-800/60"
                    }`}
                  >
                    {st.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Form Card */}
        <form
          onSubmit={handleSave}
          className="mt-6 rounded-3xl border border-navy-800/12 bg-white p-6 shadow-soft sm:p-8"
          noValidate
        >
          {profileLoading && (
            <div className="mb-4 flex items-center gap-2 font-body text-xs text-navy-800/70">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading saved business profile…</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              data-testid="profile-form-error"
              className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-700/25 bg-rose-50 p-4 text-xs text-rose-900"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: BUSINESS IDENTITY & SECTOR */}
          {step === 1 && (
            <div className="space-y-5" data-testid="profile-step-1">
              <div>
                <h2 className="font-heading text-lg font-bold text-navy-950">
                  1. Business Identity &amp; Industry Sector
                </h2>
                <p className="mt-1 font-body text-xs text-navy-800/70">
                  Required fields are marked with *. Your primary BECCI sector drives the largest weight in
                  opportunity matching.
                </p>
              </div>

              <div>
                <label
                  htmlFor="business-name"
                  className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                >
                  Business / Enterprise Name <span className="text-rose-700">*</span>
                </label>
                <input
                  id="business-name"
                  type="text"
                  required
                  value={form.business_name}
                  onChange={(e) => updateField("business_name", e.target.value)}
                  data-testid="profile-business-name"
                  placeholder="e.g. Deccan Precision Engineering Works"
                  className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-4 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="business-type"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    Business Type <span className="text-rose-700">*</span>
                  </label>
                  <select
                    id="business-type"
                    value={form.business_type}
                    onChange={(e) => updateField("business_type", e.target.value)}
                    data-testid="profile-business-type"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  >
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt.value} value={bt.value}>
                        {bt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="becci-sector"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    Primary BECCI Sector <span className="text-rose-700">*</span>
                  </label>
                  <select
                    id="becci-sector"
                    value={form.becci_sector}
                    onChange={(e) => updateField("becci_sector", e.target.value)}
                    data-testid="profile-becci-sector"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  >
                    <option value="">Select primary sector…</option>
                    {BECCI_SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="industry-sub"
                  className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                >
                  Specific Industry / Sub-Sector (Optional)
                </label>
                <input
                  id="industry-sub"
                  type="text"
                  value={form.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                  data-testid="profile-industry"
                  placeholder="e.g. Cloud software, Medical supplies, Cold-chain logistics, Handloom textiles"
                  className="min-h-[44px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-4 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <p className="mb-1.5 font-heading text-xs font-semibold text-navy-900">
                  Secondary BECCI Sectors (Optional — up to 5)
                </p>
                <div className="flex flex-wrap gap-2">
                  {BECCI_SECTORS.filter((s) => s !== form.becci_sector).map((sec) => {
                    const selected = form.secondary_sectors.includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => toggleSecondarySector(sec)}
                        className={`rounded-full border px-3 py-1.5 font-heading text-xs font-semibold transition-colors ${
                          selected
                            ? "border-navy-950 bg-navy-950 text-white"
                            : "border-navy-800/15 bg-frost/70 text-navy-900 hover:border-navy-600"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {sec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & BUSINESS STRUCTURE */}
          {step === 2 && (
            <div className="space-y-5" data-testid="profile-step-2">
              <div>
                <h2 className="font-heading text-lg font-bold text-navy-950">
                  2. Location, Enterprise Stage &amp; Structure
                </h2>
                <p className="mt-1 font-body text-xs text-navy-800/70">
                  Used to match state-specific programmes and rank regional tenders alongside All-India
                  opportunities.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-state"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    State / Union Territory <span className="text-rose-700">*</span>
                  </label>
                  <select
                    id="profile-state"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    data-testid="profile-state"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="profile-district"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    District / City (Optional)
                  </label>
                  <input
                    id="profile-district"
                    type="text"
                    value={form.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    data-testid="profile-district"
                    placeholder="e.g. Hyderabad, Visakhapatnam, Pune"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-4 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-stage"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    Business Stage
                  </label>
                  <select
                    id="profile-stage"
                    value={form.business_stage}
                    onChange={(e) => updateField("business_stage", e.target.value)}
                    data-testid="profile-stage"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  >
                    {BUSINESS_STAGES.map((bs) => (
                      <option key={bs.value} value={bs.value}>
                        {bs.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="profile-entity"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    Business Legal Structure
                  </label>
                  <select
                    id="profile-entity"
                    value={form.entity_type}
                    onChange={(e) => updateField("entity_type", e.target.value)}
                    data-testid="profile-entity"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  >
                    {ENTITY_TYPES.map((et) => (
                      <option key={et.value} value={et.value}>
                        {et.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REGISTRATIONS & TRACK RECORD */}
          {step === 3 && (
            <div className="space-y-5" data-testid="profile-step-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-navy-950">
                  3. Registrations &amp; Optional Track Record
                </h2>
                <p className="mt-1 font-body text-xs text-navy-800/70">
                  We never assume GST or Udyam registration. Select your actual status so eligibility
                  explanations accurately flag missing registrations or MSE relaxations.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-udyam"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    MSME / Udyam Registration Status
                  </label>
                  <select
                    id="profile-udyam"
                    value={form.msme_udyam_status}
                    onChange={(e) => updateField("msme_udyam_status", e.target.value)}
                    data-testid="profile-udyam"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  >
                    {UDYAM_STATUSES.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="profile-gst"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    GST Registration Status
                  </label>
                  <select
                    id="profile-gst"
                    value={form.gst_status}
                    onChange={(e) => updateField("gst_status", e.target.value)}
                    data-testid="profile-gst"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  >
                    {GST_STATUSES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-turnover"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    Approximate Annual Turnover in ₹ Lakhs (Optional)
                  </label>
                  <input
                    id="profile-turnover"
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.annual_turnover_lakhs}
                    onChange={(e) => updateField("annual_turnover_lakhs", e.target.value)}
                    data-testid="profile-turnover"
                    placeholder="Leave blank if pre-revenue or prefer not to share"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-4 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-experience"
                    className="mb-1.5 block font-heading text-xs font-semibold text-navy-900"
                  >
                    Years in Operation / Experience (Optional)
                  </label>
                  <input
                    id="profile-experience"
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.years_of_experience}
                    onChange={(e) => updateField("years_of_experience", e.target.value)}
                    data-testid="profile-experience"
                    placeholder="e.g. 2"
                    className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-4 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <TagInput
                id="profile-licences"
                label="Relevant Licences & Certifications (Optional)"
                hint="Add names only (e.g. ISO 9001, FSSAI, GeM Seller, Startup India DPIIT, Shop & Establishment) — never enter licence numbers."
                placeholder="Type a licence or certification and press Add"
                items={form.licences_and_registrations}
                onChange={(vals) => updateField("licences_and_registrations", vals)}
              />

              <div className="flex items-start gap-2.5 rounded-2xl border border-teal-deep/20 bg-teal-mist/40 p-3.5 text-xs text-navy-950">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                <span>
                  <strong>Privacy Protection:</strong> Do not enter PAN, Aadhaar, GSTIN, Udyam numbers, or
                  bank account numbers anywhere in your profile.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: PRODUCTS, CAPABILITIES & OPPORTUNITY PREFERENCES */}
          {step === 4 && (
            <div className="space-y-5" data-testid="profile-step-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-navy-950">
                  4. Products, Capabilities &amp; Preferred Categories
                </h2>
                <p className="mt-1 font-body text-xs text-navy-800/70">
                  Tell us what you supply or build and which types of opportunities matter most to your
                  business.
                </p>
              </div>

              <TagInput
                id="profile-products"
                label="Products & Services Offered (Optional)"
                placeholder="e.g. Catering services, Software development, Solar installation"
                items={form.products_and_services}
                onChange={(vals) => updateField("products_and_services", vals)}
              />

              <TagInput
                id="profile-capabilities"
                label="Core Capabilities (Optional)"
                placeholder="e.g. Government supply, Manpower staffing, CNC machining"
                items={form.capabilities}
                onChange={(vals) => updateField("capabilities", vals)}
              />

              <div>
                <p className="mb-2 font-heading text-xs font-semibold text-navy-900">
                  Preferred Opportunity Categories
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {OPPORTUNITY_CATEGORIES.slice(0, 4).map((cat) => {
                    const checked = form.preferred_categories.includes(cat.value);
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => togglePreferredCategory(cat.value)}
                        data-testid={`profile-pref-cat-${cat.value}`}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                          checked
                            ? "border-navy-950 bg-navy-950 text-white"
                            : "border-navy-800/15 bg-frost/60 text-navy-900 hover:border-navy-600"
                        }`}
                      >
                        <span className="font-heading text-xs font-semibold">{cat.label}</span>
                        {checked && <CheckCircle2 className="h-4 w-4 text-teal-bright" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-navy-800/10 pt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy-800/15 bg-frost px-5 py-2 font-heading text-xs font-semibold text-navy-950 hover:border-navy-600"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Previous Step</span>
              </button>
            ) : (
              <span className="font-body text-xs text-navy-800/60">Step {step} of 4</span>
            )}

            <div className="flex flex-wrap items-center gap-2.5">
              {profile && step < 4 && (
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy-600/30 bg-white px-5 py-2 font-heading text-xs font-semibold text-navy-950 hover:border-navy-950"
                >
                  <span>Save Changes Now</span>
                </button>
              )}

              {step < 4 ? (
                <button
                  key="profile-next-btn"
                  type="button"
                  onClick={handleNext}
                  data-testid="profile-next-step"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy-950 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-700"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                </button>
              ) : (
                <button
                  key="profile-submit-btn"
                  type="submit"
                  disabled={saving}
                  data-testid="profile-save-submit"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-navy-950 px-7 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Saving Profile…</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                      <span>{profile ? "Update Business Profile" : "Save & View My Matches"}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
