import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Compass,
  ExternalLink,
  Filter,
  HelpCircle,
  Languages,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import {
  BECCI_SCHEME_CATEGORIES,
  SCHEME_CATEGORY_ALIASES,
  SCHEME_DATASET_STATS,
  SCHEME_NOTE,
  SCHEME_STAGES,
} from "@/data/becci";
import { useSchemeLanguage, useSchemesIndex } from "@/lib/schemesStore";

const JURISDICTIONS = [
  { id: "All", label: "All Jurisdictions", count: SCHEME_DATASET_STATS.totalShown },
  { id: "Central", label: "Central (All India)", count: SCHEME_DATASET_STATS.centralCount },
  { id: "Telangana", label: "Telangana", count: SCHEME_DATASET_STATS.telanganaCount },
  { id: "Andhra Pradesh", label: "Andhra Pradesh", count: SCHEME_DATASET_STATS.andhraPradeshCount },
];

const BENEFIT_TYPES = ["All", "Cash", "In Kind", "Composite"];
const PAGE_SIZE = 24;

function normalizeCategoryParam(raw) {
  if (!raw) return "All";
  if (raw === "State") return "All";
  if (SCHEME_CATEGORY_ALIASES[raw]) return SCHEME_CATEGORY_ALIASES[raw];
  const valid = BECCI_SCHEME_CATEGORIES.some((c) => c.name === raw);
  return valid ? raw : "All";
}

export default function Schemes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { schemes, loading, error } = useSchemesIndex();
  const [lang, setLang] = useSchemeLanguage();

  const initialCatParam = searchParams.get("category") || "";
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [jurisdiction, setJurisdiction] = useState(() => {
    const st = searchParams.get("state");
    if (st && JURISDICTIONS.some((j) => j.id === st)) return st;
    if (initialCatParam === "State") return "Telangana";
    return "All";
  });
  const [category, setCategory] = useState(() => normalizeCategoryParam(initialCatParam));
  const [obcOnly, setObcOnly] = useState(() => searchParams.get("obc") === "1");
  const [entrepreneurOnly, setEntrepreneurOnly] = useState(
    () => searchParams.get("entrepreneur") === "1"
  );
  const [benefitType, setBenefitType] = useState("All");
  const [stage, setStage] = useState("");
  const [includeRestricted, setIncludeRestricted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Sync URL query params if user navigates via SearchDialog / Sector Explorer / Navigator
  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    const st = searchParams.get("state");
    const obc = searchParams.get("obc");
    const ent = searchParams.get("entrepreneur");
    const langParam = searchParams.get("lang");
    if (q !== null) setQuery(q);
    if (cat !== null) setCategory(normalizeCategoryParam(cat));
    if (st && JURISDICTIONS.some((j) => j.id === st)) setJurisdiction(st);
    if (obc !== null) setObcOnly(obc === "1");
    if (ent !== null) setEntrepreneurOnly(ent === "1");
    if (langParam === "te" || langParam === "en") setLang(langParam);
  }, [searchParams, setLang]);

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, jurisdiction, category, obcOnly, entrepreneurOnly, benefitType, stage, includeRestricted]);

  // Base pool: 335 BECCI-eligible schemes by default (+29 restricted only if explicitly toggled)
  const activePool = useMemo(() => {
    if (includeRestricted) return schemes;
    return schemes.filter((s) => s.showOnBecci);
  }, [schemes, includeRestricted]);

  // Pre-category filtered pool so category tab counts stay live and accurate
  const preCategoryPool = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activePool.filter((s) => {
      if (jurisdiction === "Central" && s.level !== "Central") return false;
      if (
        (jurisdiction === "Telangana" || jurisdiction === "Andhra Pradesh") &&
        s.state !== jurisdiction
      ) {
        return false;
      }
      if (obcOnly && !s.obcRelevant) return false;
      if (entrepreneurOnly && !s.entrepreneurRelevant) return false;
      if (benefitType !== "All" && s.benefitType !== benefitType) return false;
      if (stage && !(s.stages || []).includes(stage)) return false;
      if (q) {
        const hay = `${s.name} ${s.teName || ""} ${s.short || ""} ${s.ministry || ""} ${s.agency || ""} ${s.brief || ""} ${s.teBrief || ""} ${s.state || ""} ${(s.categories || []).join(" ")} ${(s.tags || []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activePool, query, jurisdiction, obcOnly, entrepreneurOnly, benefitType, stage]);

  const liveCategoryCounts = useMemo(() => {
    const counts = { All: preCategoryPool.length };
    for (const s of preCategoryPool) {
      for (const c of s.categories || []) {
        counts[c] = (counts[c] || 0) + 1;
      }
    }
    return counts;
  }, [preCategoryPool]);

  const visible = useMemo(() => {
    if (category === "All") return preCategoryPool;
    return preCategoryPool.filter((s) => (s.categories || []).includes(category));
  }, [preCategoryPool, category]);

  const paginated = useMemo(() => visible.slice(0, visibleCount), [visible, visibleCount]);

  const hasFilters = Boolean(
    query.trim() ||
      jurisdiction !== "All" ||
      category !== "All" ||
      obcOnly ||
      entrepreneurOnly ||
      benefitType !== "All" ||
      stage ||
      includeRestricted
  );

  const clearAll = () => {
    setQuery("");
    setJurisdiction("All");
    setCategory("All");
    setObcOnly(false);
    setEntrepreneurOnly(false);
    setBenefitType("All");
    setStage("");
    setIncludeRestricted(false);
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <PageHero
        eyebrow="Government Scheme Centre · English & తెలుగు"
        meta={`${SCHEME_DATASET_STATS.totalShown} Verified Schemes · ${SCHEME_DATASET_STATS.teluguCount} in తెలుగు · ${SCHEME_DATASET_STATS.totalFaqs.toLocaleString("en-IN")} Official FAQs`}
        title="Find the schemes that fit your enterprise."
        intro={`Browse ${SCHEME_DATASET_STATS.totalShown} verified Central, Telangana and Andhra Pradesh Government programmes sourced from myScheme (Government of India) — with Telugu translations, ${SCHEME_DATASET_STATS.totalFaqs.toLocaleString("en-IN")} official FAQs, eligibility, benefits, required documents and direct portal links.`}
      />

      {/* Verified Source Attribution & Non-Affiliation Strip */}
      <section className="bg-frost py-7">
        <div className="becci-container space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" data-testid="schemes-stats-bar">
            <div className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3.5">
              <p className="tabular font-heading text-2xl font-bold text-navy-950">
                {SCHEME_DATASET_STATS.totalShown}
              </p>
              <p className="mt-0.5 font-body text-xs text-navy-800/70">BECCI-eligible schemes</p>
            </div>
            <div className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3.5">
              <p className="tabular font-heading text-2xl font-bold text-teal-deep">
                {SCHEME_DATASET_STATS.obcCount}
              </p>
              <p className="mt-0.5 font-body text-xs text-navy-800/70">OBC / BC priority</p>
            </div>
            <div className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3.5">
              <p className="tabular font-heading text-2xl font-bold text-navy-950">
                {SCHEME_DATASET_STATS.centralCount}
              </p>
              <p className="mt-0.5 font-body text-xs text-navy-800/70">Central Government</p>
            </div>
            <div className="rounded-2xl border border-navy-800/10 bg-white px-4 py-3.5">
              <p className="tabular font-heading text-2xl font-bold text-navy-950">
                {SCHEME_DATASET_STATS.telanganaCount}
              </p>
              <p className="mt-0.5 font-body text-xs text-navy-800/70">Telangana State</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-navy-800/10 bg-white px-4 py-3.5 sm:col-span-1">
              <p className="tabular font-heading text-2xl font-bold text-navy-950">
                {SCHEME_DATASET_STATS.andhraPradeshCount}
              </p>
              <p className="mt-0.5 font-body text-xs text-navy-800/70">Andhra Pradesh State</p>
            </div>
          </div>

          <div className="glass-light flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
              <p className="font-body text-xs leading-relaxed text-navy-950 sm:text-sm">{SCHEME_NOTE}</p>
            </div>
            <a
              href="https://www.myscheme.gov.in/"
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-mist px-3.5 py-2 font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-teal-ink transition-colors hover:bg-teal hover:text-navy-950"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
              <span>Source: myScheme, GoI</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="becci-container">
          {/* Interactive Opportunity Finder Console */}
          <GlassSpotlight
            tone="light"
            data-testid="scheme-opportunity-finder"
            className="glass-light mb-12 rounded-3xl p-5 sm:p-8"
          >
            {/* Header + Instant Search */}
            <div className="relative z-10 flex flex-col justify-between gap-4 border-b border-navy-800/10 pb-5 lg:flex-row lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  <span>Verified Scheme Finder · Instant Client-Side Filtering</span>
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-navy-950">
                  Filter {SCHEME_DATASET_STATS.totalShown} programmes by state, community focus &amp; category.
                </h2>
                <p className="mt-1 font-body text-xs text-navy-800/70">
                  All filtering happens privately on your device.{" "}
                  <Link
                    to="/navigator"
                    data-testid="schemes-to-navigator"
                    className="link-underline font-heading font-semibold text-teal-ink"
                  >
                    Want guided goal + industry recommendations too? Try Opportunity Navigator →
                  </Link>
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                {/* Bilingual English / Telugu Toggle */}
                <div
                  role="group"
                  aria-label="Scheme display language"
                  data-testid="schemes-lang-toggle"
                  className="inline-flex shrink-0 items-center rounded-full border border-navy-800/15 bg-white p-1"
                >
                  <button
                    type="button"
                    aria-pressed={lang === "en"}
                    onClick={() => setLang("en")}
                    data-testid="schemes-lang-en"
                    className={`min-h-[36px] rounded-full px-3.5 py-1 font-heading text-xs font-semibold transition-colors ${
                      lang === "en"
                        ? "bg-navy-950 text-white"
                        : "text-navy-800/75 hover:text-navy-950"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    aria-pressed={lang === "te"}
                    onClick={() => setLang("te")}
                    data-testid="schemes-lang-te"
                    className={`font-telugu inline-flex min-h-[36px] items-center gap-1 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                      lang === "te"
                        ? "bg-teal-deep text-white"
                        : "text-navy-800/75 hover:text-navy-950"
                    }`}
                  >
                    <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>తెలుగు</span>
                  </button>
                </div>

                <div className="relative w-full lg:w-80">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-deep" aria-hidden="true" />
                  <label htmlFor="schemes-search" className="sr-only">
                    Search government schemes
                  </label>
                  <input
                    id="schemes-search"
                    type="text"
                    role="searchbox"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    data-testid="schemes-search-input"
                    placeholder={
                      lang === "te"
                        ? "పథకం పేరు శోధించండి (ఉదా. PMEGP, కళ్యాణ లక్ష్మీ)…"
                        : "Search PMEGP, NBCFDC, Vishwakarma, తెలుగు…"
                    }
                    className={`min-h-[46px] w-full rounded-full border border-navy-800/15 bg-white/95 pl-11 pr-10 text-sm text-navy-950 placeholder:text-navy-800/45 focus:border-teal-deep ${
                      lang === "te" ? "font-telugu" : "font-body"
                    }`}
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear scheme search"
                      className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-navy-800/60 hover:bg-frost hover:text-navy-950"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Row 1: Jurisdiction + Priority Toggles */}
            <div className="relative z-10 mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                  1 · Jurisdiction / State
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {JURISDICTIONS.map((j) => {
                    const active = jurisdiction === j.id;
                    return (
                      <button
                        key={j.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setJurisdiction(j.id)}
                        data-testid={`scheme-jurisdiction-${j.id.toLowerCase().replace(/\s+/g, "-")}`}
                        className={`min-h-[40px] rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                          active
                            ? "border-navy-950 bg-navy-950 text-white"
                            : "border-navy-800/15 bg-white/90 text-navy-900 hover:border-teal-deep hover:text-teal-ink"
                        }`}
                      >
                        {j.label}{" "}
                        <span className={active ? "text-teal-bright" : "text-navy-800/55"}>
                          ({j.count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                  2 · Quick Priority Filters
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={obcOnly}
                    onClick={() => setObcOnly((v) => !v)}
                    data-testid="scheme-toggle-obc"
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                      obcOnly
                        ? "border-teal-deep bg-teal-deep text-white"
                        : "border-navy-800/15 bg-white/90 text-navy-900 hover:border-teal-deep hover:text-teal-ink"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>OBC / Backward Classes ({SCHEME_DATASET_STATS.obcCount})</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={entrepreneurOnly}
                    onClick={() => setEntrepreneurOnly((v) => !v)}
                    data-testid="scheme-toggle-entrepreneur"
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                      entrepreneurOnly
                        ? "border-teal-deep bg-teal-deep text-white"
                        : "border-navy-800/15 bg-white/90 text-navy-900 hover:border-teal-deep hover:text-teal-ink"
                    }`}
                  >
                    <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Entrepreneur &amp; Business ({SCHEME_DATASET_STATS.entrepreneurCount})</span>
                  </button>

                  <button
                    type="button"
                    aria-expanded={showAdvanced}
                    onClick={() => setShowAdvanced((v) => !v)}
                    data-testid="scheme-toggle-advanced"
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-navy-800/15 bg-frost px-4 py-1.5 font-heading text-xs font-semibold text-navy-900 transition-colors hover:border-teal-deep hover:text-teal-ink"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{showAdvanced ? "Hide stage & benefit filters" : "Stage & benefit type"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Collapsible Stage + Benefit Type Filters */}
            {showAdvanced && (
              <div className="relative z-10 mt-5 grid gap-5 rounded-2xl border border-navy-800/10 bg-white/80 p-4 lg:grid-cols-2">
                <div>
                  <p className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                    Enterprise Stage
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {SCHEME_STAGES.map((st) => {
                      const active = stage === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setStage(active ? "" : st)}
                          data-testid={`scheme-stage-${st.toLowerCase().replace(/\s+/g, "-")}`}
                          className={`min-h-[36px] rounded-full border px-3.5 py-1 font-heading text-xs font-semibold transition-colors ${
                            active
                              ? "border-navy-950 bg-navy-950 text-white"
                              : "border-navy-800/15 bg-white text-navy-900 hover:border-teal-deep"
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                    Benefit Type
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {BENEFIT_TYPES.map((bt) => {
                      const active = benefitType === bt;
                      return (
                        <button
                          key={bt}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setBenefitType(bt)}
                          data-testid={`scheme-benefit-${bt.toLowerCase().replace(/\s+/g, "-")}`}
                          className={`min-h-[36px] rounded-full border px-3.5 py-1 font-heading text-xs font-semibold transition-colors ${
                            active
                              ? "border-teal-deep bg-teal-deep text-white"
                              : "border-navy-800/15 bg-white text-navy-900 hover:border-teal-deep"
                          }`}
                        >
                          {bt === "All" ? "All Benefit Types" : bt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter Rail (All 15 BECCI Categories with Live Counts) */}
            <div className="relative z-10 mt-6 border-t border-navy-800/10 pt-5">
              <p className="mb-2.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                3 · BECCI Scheme Categories
              </p>
              <div
                role="tablist"
                aria-label="Filter government schemes by category"
                className="flex flex-wrap gap-1.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={category === "All"}
                  onClick={() => setCategory("All")}
                  data-testid="scheme-filter-all"
                  className={`min-h-[36px] rounded-xl px-3.5 py-1.5 font-heading text-xs font-semibold transition-colors ${
                    category === "All"
                      ? "bg-navy-950 text-white"
                      : "bg-frost text-navy-800/80 hover:text-navy-950"
                  }`}
                >
                  All ({liveCategoryCounts.All || 0})
                </button>
                {BECCI_SCHEME_CATEGORIES.map((catObj) => {
                  const active = category === catObj.name;
                  const count = liveCategoryCounts[catObj.name] || 0;
                  return (
                    <button
                      key={catObj.name}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(catObj.name)}
                      data-testid={`scheme-filter-${catObj.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      className={`min-h-[36px] rounded-xl px-3.5 py-1.5 font-heading text-xs font-semibold transition-colors ${
                        active
                          ? "bg-navy-950 text-white"
                          : count === 0
                            ? "bg-frost/50 text-navy-800/40"
                            : "bg-frost text-navy-800/80 hover:text-navy-950"
                      }`}
                    >
                      {catObj.name}{" "}
                      <span className={active ? "text-teal-bright" : "opacity-65"}>({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Count + Restricted Toggle + Clear */}
            <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-navy-800/10 pt-4">
              <label className="inline-flex cursor-pointer items-center gap-2.5 font-body text-xs text-navy-800/75">
                <input
                  type="checkbox"
                  checked={includeRestricted}
                  onChange={(e) => setIncludeRestricted(e.target.checked)}
                  data-testid="scheme-toggle-restricted"
                  className="h-4 w-4 rounded border-navy-800/25 text-teal-deep focus:ring-teal-deep"
                />
                <span>
                  Include {SCHEME_DATASET_STATS.totalRestricted} SC/ST/Minority-only schemes
                  <span className="text-navy-800/55"> (hidden by default · not open to OBC)</span>
                </span>
              </label>

              <div className="flex items-center gap-4">
                <span
                  className="tabular font-heading text-xs font-bold text-navy-950"
                  aria-live="polite"
                  data-testid="schemes-result-count"
                >
                  {loading
                    ? "Loading verified schemes…"
                    : `Showing ${paginated.length} of ${visible.length} matching (${activePool.length} total)`}
                </span>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    data-testid="schemes-clear-filters"
                    className="link-underline min-h-[36px] font-heading text-xs font-semibold text-teal-ink"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </GlassSpotlight>

          <SectionHeading
            eyebrow="Verified Official Directory"
            title="Central, Telangana & Andhra Pradesh programmes."
            intro="Click any scheme to view verified overview, benefits, eligibility criteria, exclusions, step-by-step application instructions, documents required and official government links."
            className="mb-10"
          />

          {error ? (
            <div className="rounded-3xl border border-amber-500/30 bg-amber-50 p-8 text-center">
              <p className="font-heading text-lg font-bold text-navy-950">
                Could not load the verified schemes catalog.
              </p>
              <p className="mt-2 font-body text-sm text-navy-800/75">{error}</p>
            </div>
          ) : loading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-3xl border border-navy-800/10 bg-frost/80 p-6"
                />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="glass-light rounded-3xl p-10 text-center">
              <p className="font-heading text-lg font-bold text-navy-950">
                No schemes match these exact filters.
              </p>
              <p className="mt-2 font-body text-sm text-navy-800/75">
                Try clearing a category, jurisdiction or priority toggle to explore all{" "}
                {SCHEME_DATASET_STATS.totalShown} verified programmes.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-navy-950 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-teal-deep"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2" data-testid="schemes-grid">
                {paginated.map((s, idx) => (
                  <article
                    key={s.slug}
                    data-testid={`scheme-card-${s.slug}`}
                    className="group flex h-full min-w-0 flex-col justify-between rounded-3xl border border-navy-800/10 bg-frost/55 p-6 transition-all duration-200 hover:border-teal-deep/55 hover:bg-white hover:shadow-soft sm:p-7"
                  >
                    <div className="min-w-0">
                      {/* Eyebrow & Status Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                          {s.level} · {s.state}
                          {s.benefitType ? ` · ${s.benefitType}` : ""}
                        </span>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {!s.showOnBecci && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-100/90 px-2.5 py-0.5 font-heading text-[0.62rem] font-bold uppercase tracking-wider text-amber-900">
                              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                              <span>Restricted · {s.restrictedTo || "Not open to OBC"}</span>
                            </span>
                          )}
                          {s.obcRelevant && s.showOnBecci && (
                            <span className="rounded-full bg-teal-mist px-2.5 py-0.5 font-heading text-[0.62rem] font-bold uppercase tracking-wider text-teal-ink">
                              OBC / BC Priority
                            </span>
                          )}
                          {s.status && <StatusChip label={s.status} />}
                        </div>
                      </div>

                      {/* Scheme Title (Links directly to full detail view) */}
                      <h3
                        className={`mt-2.5 text-lg font-bold leading-snug text-navy-950 sm:text-xl ${
                          lang === "te" && s.teName ? "font-telugu" : "font-heading"
                        }`}
                      >
                        <Link
                          to={`/schemes/${s.slug}`}
                          className="transition-colors hover:text-teal-ink"
                        >
                          {lang === "te" && s.teName ? s.teName : s.name}
                        </Link>
                      </h3>

                      {lang === "te" && s.teName && (
                        <p className="mt-1 font-heading text-xs font-semibold text-navy-800/75">
                          {s.name}
                        </p>
                      )}

                      {/* Ministry & Short Title */}
                      <p className="mt-1 font-body text-xs text-navy-800/65">
                        {s.short && (
                          <span className="mr-2 inline-block rounded bg-white px-1.5 py-0.5 font-heading text-[0.65rem] font-bold text-navy-950 shadow-xs">
                            {s.short}
                          </span>
                        )}
                        {s.ministry}
                        {s.agency && s.agency !== s.ministry ? ` · ${s.agency}` : ""}
                      </p>

                      {/* Brief Description */}
                      <p
                        className={`mt-3.5 text-sm text-navy-900/85 ${
                          lang === "te" && s.teBrief ? "font-telugu" : "font-body leading-relaxed"
                        }`}
                      >
                        {lang === "te" && s.teBrief ? s.teBrief : s.brief}
                      </p>

                      {/* Category Tags + Bilingual / FAQ Availability */}
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {(s.categories || []).slice(0, 3).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCategory(c)}
                            className="rounded-full border border-navy-800/10 bg-white px-2.5 py-0.5 font-heading text-[0.62rem] font-semibold text-navy-800/80 transition-colors hover:border-teal-deep hover:text-teal-ink"
                          >
                            {c}
                          </button>
                        ))}
                        {(s.categories || []).length > 3 && (
                          <span className="rounded-full bg-white/80 px-2 py-0.5 font-heading text-[0.62rem] font-semibold text-navy-800/55">
                            +{s.categories.length - 3}
                          </span>
                        )}
                        {s.hasTelugu && (
                          <span className="font-telugu rounded-full border border-teal/25 bg-teal-mist/55 px-2.5 py-0.5 text-[0.62rem] font-semibold text-teal-ink">
                            తెలుగు
                          </span>
                        )}
                        {s.faqCount > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-navy-800/10 bg-white px-2.5 py-0.5 font-heading text-[0.62rem] font-semibold text-navy-800/70">
                            <HelpCircle className="h-3 w-3 text-teal-deep" aria-hidden="true" />
                            <span>{s.faqCount} FAQs</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Row & Mandatory myScheme Attribution */}
                    <div className="mt-6 space-y-3 border-t border-navy-800/10 pt-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                          to={`/schemes/${s.slug}`}
                          data-testid={`scheme-detail-btn-${idx}`}
                          className="group/btn inline-flex min-h-[42px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                        >
                          <span>Full Details</span>
                          <ArrowRight className="h-3.5 w-3.5 text-teal-bright transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
                        </Link>

                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="open"
                          data-testid={`scheme-${idx}`}
                          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-navy-800/15 bg-white px-4 py-2 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-navy-800/65">
                        {s.myschemeUrl ? (
                          <a
                            href={s.myschemeUrl}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor="open"
                            className="link-underline inline-flex items-center gap-1 font-heading font-semibold text-teal-ink"
                          >
                            <span>{s.sourceCredit}</span>
                            <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="font-heading font-semibold text-navy-800/75">
                            {s.sourceCredit}
                          </span>
                        )}
                        <span className="tabular font-body">Verified · {s.verifiedDate}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination / Load More Controls */}
              {visibleCount < visible.length && (
                <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
                  <p className="tabular font-body text-xs text-navy-800/70">
                    Showing {paginated.length} of {visible.length} matching verified schemes
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, visible.length))}
                      data-testid="schemes-load-more"
                      className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-navy-950 px-7 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                    >
                      <span>
                        Load {Math.min(PAGE_SIZE, visible.length - visibleCount)} More Schemes
                      </span>
                    </button>
                    {visible.length - visibleCount > PAGE_SIZE && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount(visible.length)}
                        data-testid="schemes-show-all"
                        className="inline-flex min-h-[46px] items-center rounded-full border border-navy-800/20 bg-white px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                      >
                        Show all {visible.length}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-12 rounded-2xl border border-ice/60 bg-frost p-6">
            <p className="font-body text-sm leading-relaxed text-navy-800/80">{SCHEME_NOTE}</p>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Step-by-step guides & portals"
        title="Visit the BECCI Knowledge Centre."
        desc="Read our five practical guides — Udyam registration, BC certificates, PMEGP steps, loan decision guide — plus 14 official portals."
        to="/knowledge"
        ctaLabel="Explore Knowledge Centre"
        testid="schemes-to-knowledge"
      />
    </>
  );
}
