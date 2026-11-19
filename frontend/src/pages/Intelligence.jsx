import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Compass,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Eyebrow, SectionHeading, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import {
  INSIGHT_ARTICLES,
  INTELLIGENCE_DISCLAIMER,
  LEARNING_JOURNEYS,
  LIBRARY_ITEMS,
  LIBRARY_TYPES,
  OPPORTUNITIES,
  OPPORTUNITY_CATEGORIES,
  QUICK_INTENTS,
} from "@/data/intelligence";
import { EASE_OUT } from "@/lib/motion";

const PENDING_LIBRARY_COPY = {
  reports: {
    status: "Planned",
    title: "No formal BECCI reports published yet.",
    body: "Annual institutional reports and sector studies will be added to the Knowledge Library once formally issued following BECCI’s inaugural operating cycle. No sample or placeholder PDFs are published.",
  },
  research: {
    status: "Planned",
    title: "Research publications are planned for upcoming phases.",
    body: "Original enterprise research and policy briefs are not yet published. Verified studies will appear here with clear publication dates and methodology once released.",
  },
  presentations: {
    status: "Coming soon",
    title: "Official chamber decks are not yet uploaded.",
    body: "Approved institutional overview decks and orientation presentations will be hosted here once cleared for public distribution.",
  },
};

export default function Intelligence() {
  const [finderQuery, setFinderQuery] = useState("");
  const [finderScope, setFinderScope] = useState("all");
  const [oppCat, setOppCat] = useState("all");
  const [activeJourneyIdx, setActiveJourneyIdx] = useState(0);
  const [checkedStages, setCheckedStages] = useState({});
  const [libType, setLibType] = useState("all");
  const reduce = useReducedMotion();

  const activeJourney = LEARNING_JOURNEYS[activeJourneyIdx];

  // Unified deterministic Resource Finder index (zero fake AI, zero tracking)
  const unifiedIndex = useMemo(() => {
    const ops = OPPORTUNITIES.map((o) => ({
      id: o.id,
      scope: "opportunities",
      kind: o.sourceLabel,
      title: o.name,
      summary: o.editorialSummary,
      meta: o.authority,
      href: o.url,
    }));
    const journeys = LEARNING_JOURNEYS.map((j) => ({
      id: `find-${j.id}`,
      scope: "journeys",
      kind: `Learning Journey · ${j.topic}`,
      title: j.title,
      summary: j.summary,
      meta: `${j.readTime} · Non-certified orientation`,
      jumpId: "learning-journeys",
      journeyIndex: LEARNING_JOURNEYS.findIndex((x) => x.id === j.id),
    }));
    const articles = INSIGHT_ARTICLES.map((a) => ({
      id: `find-${a.slug}`,
      scope: "insights",
      kind: a.category,
      title: a.title,
      summary: a.excerpt,
      meta: a.attribution,
      to: `/intelligence/article/${a.slug}`,
    }));
    const docs = LIBRARY_ITEMS.filter((i) => i.type === "official-documents").map((d) => ({
      id: `find-${d.id}`,
      scope: "library",
      kind: d.format,
      title: d.title,
      summary: d.summary,
      meta: d.sourceKind,
      href: d.href,
      to: d.to,
    }));
    return [...ops, ...journeys, ...articles, ...docs];
  }, []);

  const finderResults = useMemo(() => {
    const q = finderQuery.trim().toLowerCase();
    if (!q && finderScope === "all") return [];
    return unifiedIndex.filter((item) => {
      const scopeOk = finderScope === "all" || item.scope === finderScope;
      if (!scopeOk) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.kind.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q)
      );
    });
  }, [unifiedIndex, finderQuery, finderScope]);

  const filteredOpps = useMemo(() => {
    if (oppCat === "all") return OPPORTUNITIES;
    if (oppCat === "business-events") return [];
    return OPPORTUNITIES.filter((o) => o.categories.includes(oppCat));
  }, [oppCat]);

  const filteredLibrary = useMemo(() => {
    if (libType === "all") return LIBRARY_ITEMS;
    if (PENDING_LIBRARY_COPY[libType]) return [];
    return LIBRARY_ITEMS.filter((i) => i.type === libType);
  }, [libType]);

  const libCounts = useMemo(() => {
    const map = { all: LIBRARY_ITEMS.length, reports: 0, research: 0, presentations: 0 };
    LIBRARY_ITEMS.forEach((i) => {
      map[i.type] = (map[i.type] || 0) + 1;
    });
    return map;
  }, []);

  const toggleStage = (journeyId, stageIdx) => {
    const key = `${journeyId}-${stageIdx}`;
    setCheckedStages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedInActive = activeJourney.stages.filter(
    (_, idx) => checkedStages[`${activeJourney.id}-${idx}`]
  ).length;

  const handleTabKeys = (e, list, currentId, setter, prefix) => {
    const idx = list.findIndex((item) => item.id === currentId);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % list.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + list.length) % list.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = list.length - 1;
    if (next >= 0) {
      e.preventDefault();
      const nextId = list[next].id;
      setter(nextId);
      e.currentTarget.querySelector(`[data-testid="${prefix}-${nextId}"]`)?.focus();
    }
  };

  return (
    <>
      {/* =====================================================================
          OPENING & INTELLIGENT RESOURCE FINDER
         ===================================================================== */}
      <section
        className="on-dark relative overflow-hidden bg-navy-950 pb-20 pt-28 text-white sm:pt-32 lg:pb-24"
        data-testid="intelligence-hero"
      >
        <LiquidAuroraCanvas variant="page" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/45 via-navy-950/35 to-navy-950"
        />

        <div className="becci-container relative z-10 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow tone="tealDark">BECCI Intelligence</Eyebrow>
            <span className="glass-pill rounded-full px-3.5 py-1 font-heading text-xs font-medium text-ice">
              Verified Portals · Guided Learning · Editorial Insights
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl font-heading text-h1 font-bold text-white">
            Entrepreneurial knowledge, verified opportunities and practical pathways.
          </h1>
          <p className="mt-5 max-w-2xl font-body text-lead text-ice/88">
            Search verified Central Government schemes, statutory portals, progressive learning journeys and official BECCI
            dispatches — clearly distinguishing primary government sources from educational orientation.
          </p>

          {/* Intelligent Resource Finder Bar (Deterministic Search + Scope Filters + Intent Chips) */}
          <GlassSpotlight
            tone="dark"
            className="glass-iridescent mt-10 rounded-3xl p-5 sm:p-7"
          >
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-bright"
                  aria-hidden="true"
                />
                <label htmlFor="intelligence-finder-input" className="sr-only">
                  Search BECCI Intelligence resources, schemes and guides
                </label>
                <input
                  id="intelligence-finder-input"
                  type="search"
                  value={finderQuery}
                  onChange={(e) => setFinderQuery(e.target.value)}
                  data-testid="intelligence-search"
                  placeholder="Search Udyam, CGTMSE, MUDRA, GeM, Vishwakarma, financial literacy…"
                  className="min-h-[48px] w-full rounded-2xl border border-ice/25 bg-navy-950/75 pl-12 pr-11 font-body text-sm text-white placeholder:text-ice/55 focus:border-teal focus:bg-navy-950"
                />
                {finderQuery && (
                  <button
                    type="button"
                    onClick={() => setFinderQuery("")}
                    aria-label="Clear resource search"
                    className="absolute right-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ice/70 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter search scope">
                {[
                  { id: "all", label: "All" },
                  { id: "opportunities", label: "Opportunities" },
                  { id: "journeys", label: "Learning" },
                  { id: "library", label: "Portals" },
                  { id: "insights", label: "Insights" },
                ].map((s) => {
                  const on = finderScope === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFinderScope(s.id)}
                      data-testid={`finder-scope-${s.id}`}
                      className={`min-h-[42px] rounded-xl px-3.5 py-2 font-heading text-xs font-semibold transition-colors ${
                        on
                          ? "bg-teal text-navy-950"
                          : "border border-ice/20 bg-white/[0.04] text-ice hover:border-teal/55 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick-Intent Discovery Chips */}
            <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2">
              <span className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ice/65">
                Quick find:
              </span>
              {QUICK_INTENTS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setFinderQuery(chip.query);
                    setFinderScope("all");
                  }}
                  data-testid={`quick-intent-${chip.query.toLowerCase()}`}
                  className="inline-flex min-h-[34px] items-center rounded-full border border-ice/20 bg-white/[0.05] px-3.5 py-1 font-body text-xs text-ice transition-colors hover:border-teal hover:text-teal-bright"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Live Instant Search Results Panel (only expands when searching or scoping) */}
            {(finderQuery.trim() !== "" || finderScope !== "all") && (
              <div
                data-testid="finder-results"
                className="relative z-10 mt-6 border-t border-ice/15 pt-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-bright">
                    {finderResults.length} verified {finderResults.length === 1 ? "result" : "results"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFinderQuery("");
                      setFinderScope("all");
                    }}
                    className="font-heading text-xs font-semibold text-ice/75 hover:text-white"
                  >
                    Clear finder
                  </button>
                </div>

                {finderResults.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-ice/15 bg-navy-950/60 p-6 text-sm text-ice/85">
                    No verified BECCI Intelligence entry matches “{finderQuery}”. Try searching for a verified scheme (MUDRA, CGTMSE, PMEGP, PM-DAKSH), portal (Udyam, GST, GeM, SIDBI), or browse the four sections below.
                  </div>
                ) : (
                  <div className="mt-4 grid max-h-[380px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                    {finderResults.map((res) => (
                      <div
                        key={res.id}
                        className="flex flex-col justify-between rounded-2xl border border-ice/15 bg-navy-950/70 p-4"
                      >
                        <div>
                          <span className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
                            {res.kind}
                          </span>
                          <p className="mt-1.5 font-heading text-sm font-bold text-white">{res.title}</p>
                          <p className="mt-1.5 line-clamp-2 font-body text-xs leading-relaxed text-ice/80">
                            {res.summary}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-ice/10 pt-3">
                          <span className="truncate font-body text-[0.68rem] text-ice/60">{res.meta}</span>
                          {res.href ? (
                            <a
                              href={res.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex shrink-0 items-center gap-1 font-heading text-xs font-semibold text-teal-bright hover:underline"
                            >
                              <span>Official link</span>
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          ) : res.to ? (
                            <Link
                              to={res.to}
                              className="inline-flex shrink-0 items-center gap-1 font-heading text-xs font-semibold text-teal-bright hover:underline"
                            >
                              <span>Open</span>
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveJourneyIdx(res.journeyIndex ?? 0);
                                document.getElementById(res.jumpId)?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="inline-flex shrink-0 items-center gap-1 font-heading text-xs font-semibold text-teal-bright hover:underline"
                            >
                              <span>View pathway</span>
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </GlassSpotlight>

          {/* Section Quick Navigation */}
          <div className="mt-7 flex flex-wrap gap-2.5">
            {[
              { id: "opportunities", icon: Compass, label: "01 · Opportunity Intelligence" },
              { id: "learning-journeys", icon: GraduationCap, label: "02 · Learning Journeys" },
              { id: "library", icon: BookOpen, label: "03 · Knowledge Library" },
              { id: "insights", icon: FileText, label: "04 · BECCI Insights" },
            ].map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: "smooth" })}
                className="glass-pill inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal/60 hover:text-teal-bright"
              >
                <nav.icon className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                <span>{nav.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Integrity Notice Strip */}
      <section className="border-b border-ice/70 bg-frost py-5">
        <div className="becci-container flex items-start gap-3.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
          <p className="font-body text-xs leading-relaxed text-navy-900/85 sm:text-sm">
            {INTELLIGENCE_DISCLAIMER}
          </p>
        </div>
      </section>

      {/* =====================================================================
          01 — OPPORTUNITY INTELLIGENCE
         ===================================================================== */}
      <section id="opportunities" className="section bg-white" data-testid="intelligence-opportunities">
        <div className="becci-container">
          <SectionHeading
            eyebrow="01 · Opportunity Intelligence"
            title="Verified public schemes, procurement & skilling opportunities."
            intro="Every listing links straight to its primary government authority and clearly separates official portals from BECCI’s editorial summary."
            className="mb-10"
          />

          <div
            role="tablist"
            aria-label="Filter opportunities by category"
            onKeyDown={(e) => handleTabKeys(e, OPPORTUNITY_CATEGORIES, oppCat, setOppCat, "opp-tab")}
            className="flex flex-wrap gap-1.5 rounded-2xl border border-ice/75 bg-frost p-2"
          >
            {OPPORTUNITY_CATEGORIES.map((c) => {
              const active = oppCat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  tabIndex={active ? 0 : -1}
                  aria-selected={active}
                  onClick={() => setOppCat(c.id)}
                  data-testid={`opp-tab-${c.id}`}
                  className={`relative min-h-[40px] whitespace-nowrap rounded-xl px-4 py-2 font-heading text-xs font-semibold transition-colors ${
                    active ? "text-white" : "text-navy-800/80 hover:text-navy-950"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={reduce ? undefined : "opp-cat-pill"}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-navy-950"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{c.label}</span>
                </button>
              );
            })}
          </div>

          {oppCat === "business-events" ? (
            <div
              data-testid="opp-empty-events"
              className="glass-light mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-10 lg:flex-row lg:items-center"
            >
              <div className="max-w-2xl">
                <StatusChip label="Planned" />
                <h3 className="mt-4 font-heading text-xl font-bold text-navy-950">
                  No verified business events listed yet.
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">
                  Confirmed BECCI district outreach sessions and verified public trade convenings will appear here with
                  dates, locations and official registration links once finalised.
                </p>
              </div>
              <Link
                to="/contact?topic=entrepreneur"
                className="inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-full bg-navy-950 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-teal-deep"
              >
                <span>Register interest</span>
                <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {filteredOpps.map((o) => (
                <GlassSpotlight
                  key={o.id}
                  tone="light"
                  as="article"
                  className="glass-light flex h-full min-w-0 flex-col justify-between rounded-3xl p-6 sm:p-7"
                >
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-teal-deep">
                        {o.authority}
                      </span>
                      <span className="rounded-full bg-teal-mist px-3 py-1 font-heading text-[0.62rem] font-semibold uppercase tracking-wider text-teal-ink">
                        {o.sourceLabel}
                      </span>
                    </div>

                    <h3 className="mt-3 font-heading text-xl font-bold text-navy-950">{o.name}</h3>

                    {/* Explicitly distinguished Editorial Explanation vs. Official Verification */}
                    <div className="mt-4 space-y-3 rounded-2xl bg-white/85 p-4 ring-1 ring-navy-800/8">
                      <div>
                        <p className="font-heading text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-navy-700">
                          Editorial Summary (BECCI Orientation)
                        </p>
                        <p className="mt-1 font-body text-sm leading-relaxed text-navy-800/85">
                          {o.editorialSummary}
                        </p>
                      </div>
                      <div className="border-t border-navy-800/10 pt-3">
                        <p className="font-heading text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                          Eligibility &amp; Status Verification
                        </p>
                        <p className="mt-1 font-body text-xs leading-relaxed text-navy-800/75">
                          {o.eligibilityNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-navy-800/10 pt-4">
                    <span className="font-body text-xs text-navy-800/60">{o.publishedDate}</span>
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                    >
                      <span>Visit Official Source</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                    </a>
                  </div>
                </GlassSpotlight>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          02 — ENTREPRENEUR LEARNING JOURNEYS
         ===================================================================== */}
      <section
        id="learning-journeys"
        className="on-dark section relative overflow-hidden bg-navy-950 text-white"
        data-testid="intelligence-journeys"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 86% 18%, rgba(0,184,169,0.16), transparent 62%), radial-gradient(ellipse 48% 44% at 12% 85%, rgba(121,91,255,0.12), transparent 62%)",
          }}
        />

        <div className="becci-container relative z-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              tone="white"
              eyebrow="02 · Entrepreneur Learning Journeys"
              title="Progressive orientation pathways for founders."
              intro="Step-by-step educational reading tracks covering enterprise formalisation, MSME fundamentals, credit readiness and institutional markets."
            />
            <span className="glass-pill self-start rounded-full px-4 py-2 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ice lg:self-end">
              Informational Guide · Non-Certified
            </span>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            {/* Left: 4 Learning Track Selector */}
            <div className="glass-dark flex flex-col gap-2 rounded-3xl p-3">
              {LEARNING_JOURNEYS.map((j, idx) => {
                const active = activeJourneyIdx === idx;
                const doneCount = j.stages.filter((_, sIdx) => checkedStages[`${j.id}-${sIdx}`]).length;
                return (
                  <button
                    key={j.id}
                    id={`journey-${j.id}`}
                    type="button"
                    onClick={() => setActiveJourneyIdx(idx)}
                    data-testid={`journey-btn-${idx}`}
                    aria-pressed={active}
                    className={`relative flex items-start gap-4 rounded-2xl p-4 text-left transition-colors ${
                      active ? "bg-teal/15 ring-1 ring-teal/50" : "hover:bg-white/[0.05]"
                    }`}
                  >
                    <span
                      className={`tabular font-display text-2xl leading-none ${
                        active ? "text-teal-bright" : "text-ice/45"
                      }`}
                    >
                      {j.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
                        {j.topic}
                      </p>
                      <p className="mt-1 font-heading text-base font-bold text-white">{j.title}</p>
                      <p className="mt-1 font-body text-xs text-ice/75">
                        {j.readTime}
                        {doneCount > 0 ? ` · ${doneCount}/${j.stages.length} reviewed` : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Active Progressive Stages Reader */}
            <GlassSpotlight tone="dark" className="glass-iridescent rounded-3xl p-7 sm:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeJourney.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="relative z-10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ice/15 pb-5">
                    <div>
                      <span className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-bright">
                        Pathway {activeJourney.num} · {activeJourney.topic}
                      </span>
                      <h3 className="mt-2 font-heading text-2xl font-bold text-white">
                        {activeJourney.title}
                      </h3>
                      <p className="mt-1.5 font-body text-xs text-ice/75">
                        Designed for: {activeJourney.audience}
                      </p>
                    </div>
                    <span className="tabular rounded-full border border-teal/40 bg-teal/15 px-3.5 py-1 font-heading text-xs font-semibold text-teal-bright">
                      {completedInActive}/{activeJourney.stages.length} reviewed
                    </span>
                  </div>

                  <p className="mt-5 font-body text-sm leading-relaxed text-frost/88">
                    {activeJourney.summary}
                  </p>

                  <ol className="mt-6 space-y-4">
                    {activeJourney.stages.map((st, sIdx) => {
                      const done = Boolean(checkedStages[`${activeJourney.id}-${sIdx}`]);
                      return (
                        <li
                          key={st.title}
                          className={`rounded-2xl border p-5 transition-colors ${
                            done
                              ? "border-teal/45 bg-teal/10"
                              : "border-ice/15 bg-navy-950/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <button
                                type="button"
                                onClick={() => toggleStage(activeJourney.id, sIdx)}
                                data-testid={`journey-check-${sIdx}`}
                                aria-label={`Mark stage ${sIdx + 1} (${st.title}) as reviewed`}
                                aria-pressed={done}
                                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-teal-bright transition-colors hover:bg-white/10"
                              >
                                {done ? (
                                  <CheckCircle2 className="h-5 w-5 text-teal-bright" aria-hidden="true" />
                                ) : (
                                  <Circle className="h-5 w-5 text-ice/50" aria-hidden="true" />
                                )}
                              </button>
                              <div>
                                <p className="font-heading text-sm font-bold text-white sm:text-base">
                                  Stage 0{sIdx + 1}: {st.title}
                                </p>
                                <p className="mt-1.5 font-body text-sm leading-relaxed text-ice/85">
                                  {st.detail}
                                </p>
                                {st.portal && (
                                  <a
                                    href={st.portal.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="link-underline mt-3 inline-flex min-h-[36px] items-center gap-1.5 font-heading text-xs font-semibold text-teal-bright"
                                  >
                                    <span>Official portal: {st.portal.label}</span>
                                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  <p className="mt-5 font-body text-xs text-ice/65">
                    Reading progress stays only in your current browser tab — no account or tracking is used. BECCI does not issue certificates or represent training bodies.
                  </p>
                </motion.div>
              </AnimatePresence>
            </GlassSpotlight>
          </div>
        </div>
      </section>

      {/* =====================================================================
          03 — KNOWLEDGE LIBRARY
         ===================================================================== */}
      <section id="library" className="section bg-frost" data-testid="intelligence-library">
        <div className="becci-container">
          <SectionHeading
            eyebrow="03 · Knowledge Library"
            title="Official records, statutory portals & orientation guides."
            intro="Filter by document type. Formal reports, research publications and presentations will be added only once BECCI publishes verified originals."
            className="mb-10"
          />

          <div
            role="tablist"
            aria-label="Filter Knowledge Library by content type"
            onKeyDown={(e) => handleTabKeys(e, LIBRARY_TYPES, libType, setLibType, "lib-tab")}
            className="flex flex-wrap gap-1.5 rounded-2xl border border-ice/75 bg-white/85 p-2"
          >
            {LIBRARY_TYPES.map((t) => {
              const active = libType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  tabIndex={active ? 0 : -1}
                  aria-selected={active}
                  onClick={() => setLibType(t.id)}
                  data-testid={`lib-tab-${t.id}`}
                  className={`relative inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 font-heading text-xs font-semibold transition-colors ${
                    active ? "text-white" : "text-navy-800/80 hover:text-navy-950"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={reduce ? undefined : "lib-type-pill"}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-navy-950"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                  <span
                    className={`tabular relative z-10 rounded-full px-2 py-0.5 text-[0.65rem] ${
                      active ? "bg-teal/25 text-teal-bright" : "bg-frost text-navy-700"
                    }`}
                  >
                    {libCounts[t.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {PENDING_LIBRARY_COPY[libType] ? (
            <div
              data-testid={`lib-empty-${libType}`}
              className="glass-light mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-10 lg:flex-row lg:items-center"
            >
              <div className="max-w-2xl">
                <StatusChip label={PENDING_LIBRARY_COPY[libType].status} />
                <h3 className="mt-4 font-heading text-xl font-bold text-navy-950">
                  {PENDING_LIBRARY_COPY[libType].title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">
                  {PENDING_LIBRARY_COPY[libType].body}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLibType("all")}
                className="inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-full bg-navy-950 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-teal-deep"
              >
                <span>Browse available library items</span>
                <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLibrary.map((item) => (
                <div
                  key={item.id}
                  className="glass-light hover-lift flex h-full min-w-0 flex-col justify-between rounded-2xl p-6 transition-[transform,border-color,box-shadow] hover:border-teal/35"
                >
                  <div className="min-w-0">
                    <span className="font-heading text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                      {item.format}
                    </span>
                    <h3 className="mt-2.5 font-heading text-base font-bold leading-snug text-navy-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 break-words font-body text-xs leading-relaxed text-navy-800/80">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-5 flex min-w-0 items-center justify-between gap-2 border-t border-navy-800/10 pt-3.5">
                    <span className="min-w-0 truncate font-body text-[0.7rem] text-navy-800/60">{item.sourceKind}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[36px] shrink-0 items-center gap-1 font-heading text-xs font-semibold text-teal-ink hover:underline"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        className="inline-flex min-h-[36px] shrink-0 items-center gap-1 font-heading text-xs font-semibold text-teal-ink hover:underline"
                      >
                        <span>Read</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          04 — BECCI INSIGHTS (Shareable Editorial Publication Experience)
         ===================================================================== */}
      <section id="insights" className="section bg-white" data-testid="intelligence-insights">
        <div className="becci-container">
          <SectionHeading
            eyebrow="04 · BECCI Insights"
            title="Dispatches, business knowledge & editorial perspectives."
            intro="Long-form verified institutional dispatches and plain-language orientation guides with dedicated, shareable reading pages."
            className="mb-12"
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {INSIGHT_ARTICLES.map((art, i) => {
              const isOfficial = art.category === "Official Update";
              return (
                <GlassSpotlight
                  key={art.slug}
                  tone={isOfficial ? "dark" : "light"}
                  as="article"
                  className={`flex h-full flex-col justify-between rounded-3xl p-8 md:p-9 ${
                    isOfficial
                      ? "on-dark glass-iridescent bg-navy-950 text-white"
                      : "glass-light text-navy-950"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`eyebrow ${isOfficial ? "text-teal-bright" : "text-teal-deep"}`}>
                        {art.category} · {art.published}
                      </span>
                      <span
                        className={`font-body text-xs ${
                          isOfficial ? "text-ice/70" : "text-navy-800/60"
                        }`}
                      >
                        {art.readTime}
                      </span>
                    </div>

                    <h3
                      className={`mt-4 font-heading text-xl font-bold leading-snug sm:text-2xl ${
                        isOfficial ? "text-white" : "text-navy-950"
                      }`}
                    >
                      {art.title}
                    </h3>

                    <p
                      className={`mt-3 font-body text-sm leading-relaxed sm:text-base ${
                        isOfficial ? "text-ice/88" : "text-navy-800/80"
                      }`}
                    >
                      {art.excerpt}
                    </p>
                  </div>

                  <div
                    className={`relative z-10 mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${
                      isOfficial ? "border-ice/15" : "border-navy-800/10"
                    }`}
                  >
                    <span
                      className={`font-body text-xs ${
                        isOfficial ? "text-ice/70" : "text-navy-800/65"
                      }`}
                    >
                      {art.attribution}
                    </span>
                    <Link
                      to={`/intelligence/article/${art.slug}`}
                      data-testid={`insight-read-${i}`}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${
                        isOfficial
                          ? "bg-teal text-navy-950 hover:bg-teal-bright"
                          : "bg-navy-950 text-white hover:bg-teal-deep"
                      }`}
                    >
                      <span>Read article</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </GlassSpotlight>
              );
            })}
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Interactive Exhibition"
        title="Explore BECCI PULSE — The Living Digital Universe."
        desc="Navigate BECCI’s 3D territories, Opportunity Wall and verifiable Digital Observatory."
        to="/pulse"
        ctaLabel="Enter BECCI PULSE"
        testid="intelligence-to-pulse"
      />
    </>
  );
}
