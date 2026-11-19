import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  ExternalLink,
  Info,
  Languages,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { Eyebrow, SectionHeading } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import EnterpriseField3D from "@/components/visuals/EnterpriseField3D";
import { GlassSpotlight, Magnetic } from "@/components/visuals/MotionPrimitives";
import { SectorSvgIcon } from "@/components/illustrations/BecciArtwork";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SCHEME_CARD_NOTE, SCHEME_DATASET_STATS, SCHEME_NOTE, SECTORS } from "@/data/becci";
import {
  EXPLORATION_GOALS,
  NAVIGATOR_STAGES,
  buildDiscoveryBrief,
} from "@/lib/navigatorEngine";
import { useSchemeLanguage, useSchemesIndex } from "@/lib/schemesStore";
import { EASE_OUT } from "@/lib/motion";

const STEP_META = [
  { num: "01", id: "goal", label: "Your Focus" },
  { num: "02", id: "industry", label: "Your Industry" },
  { num: "03", id: "brief", label: "Discovery Brief" },
];

export default function Navigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { schemes: schemesCatalog } = useSchemesIndex();
  const [lang, setLang] = useSchemeLanguage();
  const isTelugu = lang === "te";
  const reduce = useReducedMotion();
  const briefAnchorRef = useRef(null);

  const paramGoal = searchParams.get("goal");
  const paramIndustry = searchParams.get("industry");
  const paramStage = searchParams.get("stage");

  const validGoal = EXPLORATION_GOALS.some((g) => g.id === paramGoal) ? paramGoal : "";
  const validIndustry = SECTORS.some((s) => s.id === paramIndustry) ? paramIndustry : "";
  const validStage = NAVIGATOR_STAGES.includes(paramStage) ? paramStage : "all";

  const [goalId, setGoalId] = useState(validGoal);
  const [sectorId, setSectorId] = useState(validIndustry);
  const [stage, setStage] = useState(validStage);
  const [step, setStep] = useState(() => {
    if (validGoal && validIndustry) return 2;
    if (validGoal) return 1;
    return 0;
  });

  // Live hover/focus preview items for editorial split stage
  const [previewGoalId, setPreviewGoalId] = useState(validGoal || EXPLORATION_GOALS[0].id);
  const [previewSectorId, setPreviewSectorId] = useState(validIndustry || SECTORS[0].id);

  // Sync browser back/forward navigation cleanly
  useEffect(() => {
    const g = EXPLORATION_GOALS.some((x) => x.id === paramGoal) ? paramGoal : "";
    const s = SECTORS.some((x) => x.id === paramIndustry) ? paramIndustry : "";
    const st = NAVIGATOR_STAGES.includes(paramStage) ? paramStage : "all";
    setGoalId(g);
    setSectorId(s);
    setStage(st);
    if (g && s) setStep(2);
    else if (g) setStep(1);
    else setStep(0);
  }, [paramGoal, paramIndustry, paramStage]);

  const syncUrl = (nextGoal, nextSector, nextStage) => {
    const next = {};
    if (nextGoal) next.goal = nextGoal;
    if (nextSector) next.industry = nextSector;
    if (nextStage && nextStage !== "all") next.stage = nextStage;
    setSearchParams(next, { replace: false });
  };

  const selectGoal = (id) => {
    setGoalId(id);
    setPreviewGoalId(id);
    if (sectorId) {
      setStep(2);
      syncUrl(id, sectorId, stage);
    } else {
      setStep(1);
      syncUrl(id, "", stage);
    }
  };

  const selectSector = (id) => {
    const activeGoal = goalId || EXPLORATION_GOALS[0].id;
    setGoalId(activeGoal);
    setSectorId(id);
    setPreviewSectorId(id);
    setStep(2);
    syncUrl(activeGoal, id, stage);
    window.setTimeout(() => {
      briefAnchorRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }, 60);
  };

  const selectStage = (nextStage) => {
    setStage(nextStage);
    syncUrl(goalId, sectorId, nextStage);
  };

  const resetNavigator = () => {
    setGoalId("");
    setSectorId("");
    setStage("all");
    setStep(0);
    setSearchParams({}, { replace: false });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const previewGoal =
    EXPLORATION_GOALS.find((g) => g.id === previewGoalId) || EXPLORATION_GOALS[0];
  const previewSector =
    SECTORS.find((s) => s.id === previewSectorId) || SECTORS[0];

  const brief = useMemo(() => {
    if (!goalId || !sectorId) return null;
    return buildDiscoveryBrief({ goalId, sectorId, stage, schemesCatalog });
  }, [goalId, sectorId, stage, schemesCatalog]);

  const progressPct = step === 0 ? 33 : step === 1 ? 66 : 100;

  return (
    <>
      {/* =====================================================================
          IMMERSIVE GUIDED DISCOVERY STAGE (Deep Navy & Electric Blue Environment)
         ===================================================================== */}
      <section
        className="on-dark relative overflow-hidden bg-navy-950 pb-20 pt-28 text-white sm:pt-32 lg:pb-24"
        data-cursor-hero="true"
        data-testid="navigator-hero"
      >
        <LiquidAuroraCanvas variant="page" />
        <EnterpriseField3D density="closing" className="opacity-45" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/45 via-navy-950/30 to-navy-950"
        />

        <div className="becci-container relative z-10 pt-4">
          {/* Top Metadata & Privacy Guarantee */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow tone="tealDark">BECCI Opportunity Navigator</Eyebrow>
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip label="Available now" tone="dark" />
              <span className="glass-pill rounded-full px-3.5 py-1 font-heading text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ice">
                No login · No personal data collected
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="font-heading text-h1 font-bold leading-[1.03] text-white">
                Chart your pathway across BECCI.
              </h1>
              <p className="mt-4 max-w-2xl font-body text-lead text-ice/88">
                Two simple choices assemble a tailored brief of verified government schemes, practical guides,
                statutory portals, sector context and honest BECCI pathways.
              </p>
            </div>

            {/* Interactive Step Progress Rail */}
            <div className="glass-dark rounded-2xl p-4 sm:p-5" data-testid="navigator-progress">
              <div className="flex items-center justify-between gap-2">
                {STEP_META.map((s, idx) => {
                  const isCurrent = step === idx;
                  const canJump =
                    idx === 0 ||
                    (idx === 1 && Boolean(goalId)) ||
                    (idx === 2 && Boolean(goalId && sectorId));
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!canJump}
                      aria-current={isCurrent ? "step" : undefined}
                      data-testid={`nav-step-${s.id}`}
                      onClick={() => canJump && setStep(idx)}
                      className={`flex min-h-[44px] flex-1 flex-col items-start justify-center rounded-xl px-3 py-2 text-left transition-colors ${
                        isCurrent
                          ? "bg-teal/15 text-white ring-1 ring-teal/55"
                          : canJump
                            ? "text-ice/80 hover:bg-white/[0.06] hover:text-white"
                            : "cursor-not-allowed text-ice/35"
                      }`}
                    >
                      <span className="tabular font-display text-base leading-none text-teal-bright">
                        {s.num}
                      </span>
                      <span className="mt-1 truncate font-heading text-[0.7rem] font-semibold">
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Progress Hairline */}
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                <motion.div
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                  className="bg-spectrum h-full rounded-full"
                />
              </div>
            </div>
          </div>

          {/* =================================================================
              PROGRESSIVE STAGE CONTAINER (Step 01 -> Step 02 -> Brief Header)
             ================================================================= */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              {/* STEP 01: WHAT ARE YOU EXPLORING? */}
              {step === 0 && (
                <motion.div
                  key="step-goal"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  data-testid="navigator-step-goal"
                >
                  <GlassSpotlight
                    tone="dark"
                    className="glass-iridescent grid gap-8 rounded-3xl p-6 sm:p-9 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12"
                  >
                    <div className="relative z-10 min-w-0">
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-bright">
                        Step 01 of 02 · Choose Your Focus
                      </p>
                      <h2 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
                        What are you exploring today?
                      </h2>

                      <div
                        role="radiogroup"
                        aria-label="What are you exploring?"
                        className="mt-6 divide-y divide-ice/12 border-y border-ice/12"
                      >
                        {EXPLORATION_GOALS.map((g) => {
                          const selected = goalId === g.id;
                          const previewing = previewGoalId === g.id;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onMouseEnter={() => setPreviewGoalId(g.id)}
                              onFocus={() => setPreviewGoalId(g.id)}
                              onClick={() => selectGoal(g.id)}
                              data-testid={`navigator-goal-${g.id}`}
                              className={`group flex min-h-[58px] w-full items-center justify-between gap-4 px-3 py-4 text-left transition-colors sm:px-4 ${
                                selected || previewing
                                  ? "bg-white/[0.06] text-white"
                                  : "text-frost/85 hover:bg-white/[0.04]"
                              }`}
                            >
                              <div className="flex min-w-0 items-baseline gap-4">
                                <span
                                  className={`tabular font-display text-2xl leading-none transition-colors ${
                                    selected || previewing ? "text-teal-bright" : "text-ice/50"
                                  }`}
                                >
                                  {g.num}
                                </span>
                                <div className="min-w-0">
                                  <span className="block font-heading text-base font-bold text-white sm:text-lg">
                                    {g.label}
                                  </span>
                                  <span className="mt-0.5 block font-body text-xs text-ice/75 sm:hidden">
                                    {g.summary}
                                  </span>
                                </div>
                              </div>
                              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ice/20 text-ice transition-all group-hover:border-teal group-hover:bg-teal group-hover:text-navy-950">
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Editorial Context Preview (Desktop) */}
                    <div className="relative z-10 hidden flex-col justify-between rounded-2xl border border-ice/15 bg-navy-950/65 p-7 lg:flex">
                      <div>
                        <span className="inline-flex items-center gap-2 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-teal-bright">
                          <Compass className="h-4 w-4" aria-hidden="true" />
                          <span>Pathway Preview · {previewGoal.num}</span>
                        </span>
                        <h3 className="mt-4 font-heading text-2xl font-bold text-white">
                          {previewGoal.label}
                        </h3>
                        <p className="mt-3 font-body text-sm leading-relaxed text-ice/88">
                          {previewGoal.summary}
                        </p>

                        <div className="mt-6 space-y-2.5 border-t border-ice/12 pt-5">
                          <p className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ice/65">
                            What your brief will assemble
                          </p>
                          <ul className="space-y-2 font-body text-xs text-frost/88">
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                              <span>Matched official government schemes with direct portal links</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                              <span>{previewGoal.guideSlugs.length} step-by-step BECCI practical guides</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                              <span>Industry coverage, statutory portals &amp; tailored FAQs</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-ice/12 pt-4 font-body text-xs leading-relaxed text-ice/65">
                        Transparent metadata discovery — zero AI speculation, zero registration required.
                      </div>
                    </div>
                  </GlassSpotlight>
                </motion.div>
              )}

              {/* STEP 02: INDUSTRY SELECTION (ALL 11 SECTORS) */}
              {step === 1 && (
                <motion.div
                  key="step-industry"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  data-testid="navigator-step-industry"
                >
                  <GlassSpotlight
                    tone="dark"
                    className="glass-iridescent rounded-3xl p-6 sm:p-9"
                  >
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-ice/15 pb-5">
                      <div>
                        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-bright">
                          Step 02 of 02 · Select Your Industry
                        </p>
                        <h2 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
                          Which industry sector fits your enterprise?
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        data-testid="navigator-back-to-goal"
                        className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ice/25 px-4 py-2 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal hover:text-teal-bright"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          Focus: {EXPLORATION_GOALS.find((g) => g.id === goalId)?.short || "Change"}
                        </span>
                      </button>
                    </div>

                    <div className="relative z-10 mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
                      <div
                        role="radiogroup"
                        aria-label="Choose your industry sector"
                        className="flex flex-wrap gap-2.5"
                      >
                        {SECTORS.map((sec) => {
                          const selected = sectorId === sec.id;
                          const previewing = previewSectorId === sec.id;
                          return (
                            <button
                              key={sec.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onMouseEnter={() => setPreviewSectorId(sec.id)}
                              onFocus={() => setPreviewSectorId(sec.id)}
                              onClick={() => selectSector(sec.id)}
                              data-testid={`navigator-sector-${sec.id}`}
                              className={`inline-flex min-h-[48px] items-center gap-3 rounded-2xl border px-4 py-2.5 font-heading text-sm font-semibold transition-all ${
                                selected
                                  ? "border-teal bg-teal text-navy-950 shadow-teal-glow"
                                  : previewing
                                    ? "border-teal/65 bg-white/[0.10] text-white"
                                    : "border-ice/20 bg-white/[0.04] text-frost hover:border-teal/55 hover:bg-white/[0.08]"
                              }`}
                            >
                              <SectorSvgIcon
                                name={sec.icon}
                                className={`h-4 w-4 shrink-0 ${selected ? "" : "brightness-0 invert"}`}
                              />
                              <span>{sec.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Live Sector Coverage Preview */}
                      <div className="rounded-2xl border border-ice/15 bg-navy-950/65 p-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/15 ring-1 ring-teal/40">
                            <SectorSvgIcon name={previewSector.icon} className="h-5 w-5 brightness-0 invert" />
                          </span>
                          <div>
                            <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
                              Sector Coverage
                            </p>
                            <h3 className="font-heading text-lg font-bold text-white">
                              {previewSector.name}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-4 font-body text-sm leading-relaxed text-ice/88">
                          {previewSector.covers}
                        </p>
                        {previewSector.schemeCategories?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-ice/12 pt-4">
                            {previewSector.schemeCategories.map((c) => (
                              <span
                                key={c}
                                className="rounded-full bg-white/[0.07] px-2.5 py-1 font-heading text-[0.64rem] font-semibold text-ice"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassSpotlight>
                </motion.div>
              )}

              {/* STEP 03: DISCOVERY BRIEF CONTROL HEADER (WITH LIVE STAGE REFINEMENT) */}
              {step === 2 && brief && (
                <motion.div
                  key="step-brief-header"
                  ref={briefAnchorRef}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  data-testid="navigator-brief-header"
                >
                  <GlassSpotlight
                    tone="dark"
                    className="glass-iridescent rounded-3xl p-6 sm:p-9"
                  >
                    <div className="relative z-10 flex flex-col justify-between gap-6 border-b border-ice/15 pb-6 lg:flex-row lg:items-center">
                      <div>
                        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-bright">
                          Your Discovery Brief · Metadata-Matched
                        </p>
                        <h2 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
                          {brief.goal.label}{" "}
                          <span className="text-ice/60">in</span>{" "}
                          <span className="text-gradient-teal">{brief.sector.name}</span>
                        </h2>
                        <p className="mt-2 max-w-2xl font-body text-sm text-ice/82">
                          {brief.sector.covers}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          data-testid="navigator-change-goal"
                          className="min-h-[42px] rounded-full border border-ice/25 px-4 py-2 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal hover:text-teal-bright"
                        >
                          Change focus
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          data-testid="navigator-change-industry"
                          className="min-h-[42px] rounded-full border border-ice/25 px-4 py-2 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal hover:text-teal-bright"
                        >
                          Change industry
                        </button>
                        <button
                          type="button"
                          onClick={resetNavigator}
                          data-testid="navigator-reset"
                          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-white/[0.08] px-4 py-2 font-heading text-xs font-semibold text-white transition-colors hover:bg-teal hover:text-navy-950"
                        >
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Start over</span>
                        </button>
                      </div>
                    </div>

                    {/* Optional Live Stage Filter */}
                    <div className="relative z-10 mt-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ice/75">
                          <SlidersHorizontal className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                          <span>Refine by stage:</span>
                        </span>
                        {NAVIGATOR_STAGES.map((st) => {
                          const active = stage === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              aria-pressed={active}
                              onClick={() => selectStage(st)}
                              data-testid={`navigator-stage-${st.toLowerCase().replace(/\s+/g, "-")}`}
                              className={`min-h-[38px] rounded-full border px-3.5 py-1.5 font-heading text-xs font-semibold transition-colors ${
                                active
                                  ? "border-teal bg-teal text-navy-950"
                                  : "border-ice/20 bg-white/[0.04] text-ice hover:border-teal/55 hover:text-white"
                              }`}
                            >
                              {st === "all" ? "All stages" : st}
                            </button>
                          );
                        })}
                      </div>

                      <p className="font-body text-xs text-ice/65">
                        {brief.schemes.length} scheme{brief.schemes.length === 1 ? "" : "s"} ·{" "}
                        {brief.guides.length} guides · {brief.portals.length} official portals
                      </p>
                    </div>
                  </GlassSpotlight>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PERSONALISED EDITORIAL DISCOVERY BRIEF SECTIONS (Visible at Step 03)
         ===================================================================== */}
      {step === 2 && brief ? (
        <div data-testid="navigator-results">
          {/* Honest Transparency Strip */}
          <section className="border-b border-ice/60 bg-frost py-6">
            <div className="becci-container flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
                <p className="font-body text-xs leading-relaxed text-navy-900/85 sm:text-sm">
                  This brief is matched deterministically from verified BECCI metadata — not AI predictions.
                  Selecting choices here does not submit an application, assess formal eligibility or contact BECCI.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER A — RECOMMENDED PRACTICAL GUIDES (& MEMBERSHIP / LOAN MATRIX WHEN RELEVANT) */}
          <section className="section bg-white">
            <div className="becci-container">
              <SectionHeading
                eyebrow="Chapter 01 · Practical Knowledge"
                title="Where to read first."
                intro="Step-by-step BECCI guides selected for your focus and sector — every walkthrough links straight to official government portals."
                className="mb-10"
              />

              <ol className="divide-y divide-navy-800/12 border-y border-navy-800/12">
                {brief.guides.map((guide, idx) => (
                  <li key={guide.slug}>
                    <Link
                      to={`/intelligence/article/${guide.slug}`}
                      data-cursor="explore"
                      data-testid={`navigator-guide-${idx}`}
                      className="group grid gap-4 py-6 transition-colors hover:bg-frost/70 sm:px-4 lg:grid-cols-[0.12fr_0.5fr_0.38fr] lg:items-center lg:gap-8"
                    >
                      <span className="tabular font-display text-3xl leading-none text-teal-deep">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-navy-800/60">
                          {guide.label} · {guide.readTime}
                        </span>
                        <h3 className="mt-1 font-heading text-lg font-bold text-navy-950 transition-colors group-hover:text-teal-ink sm:text-xl">
                          {guide.title}
                        </h3>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-body text-xs leading-relaxed text-navy-800/80 sm:text-sm">
                          <span className="font-heading font-semibold text-teal-ink">Why relevant: </span>
                          {guide.whyRelevant}
                        </p>
                        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy-800/12 bg-white text-teal-deep transition-colors group-hover:bg-navy-950 group-hover:text-teal-bright">
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>

              {/* Contextual Membership Comparison (shown for Membership & Starting focus) */}
              {brief.membershipTypes.length > 0 && (
                <div className="mt-12 rounded-3xl border border-ice/80 bg-frost/80 p-6 sm:p-8" data-testid="navigator-membership-preview">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-800/10 pb-5">
                    <div>
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                        Membership Pathways
                      </p>
                      <h3 className="mt-1 font-heading text-xl font-bold text-navy-950">
                        Individual vs. Business Membership
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <StatusChip label="Under development" />
                      <Link
                        to="/membership#eligibility"
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 font-heading text-xs font-semibold text-white transition-colors hover:bg-teal-deep"
                      >
                        <span>Check Eligibility &amp; Details</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {brief.membershipTypes.map((m) => (
                      <div key={m.id} className="rounded-2xl bg-white/95 p-6 shadow-soft">
                        <p className="font-heading text-base font-bold text-navy-950">{m.title}</p>
                        <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">{m.audience}</p>
                        <ul className="mt-4 space-y-2">
                          {m.provide.map((pt) => (
                            <li key={pt} className="flex items-start gap-2 font-body text-xs text-navy-900">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contextual Loan Decision Reference (shown for Finance & Schemes focus) */}
              {brief.loanMatrix.length > 0 && (
                <div className="mt-12 rounded-3xl border border-ice/80 bg-frost/80 p-6 sm:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                        Quick Orientation · Guide 04
                      </p>
                      <h3 className="mt-1 font-heading text-xl font-bold text-navy-950">
                        Matching enterprise situations to official programmes
                      </h3>
                    </div>
                    <Link
                      to="/intelligence/article/which-loan-fits-you-decision-guide"
                      className="link-underline inline-flex items-center gap-1 font-heading text-xs font-semibold text-teal-ink"
                    >
                      <span>Read full decision guide</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-ice/80 bg-white">
                    <table className="w-full min-w-[480px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-navy-800/10 bg-frost/90">
                          <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                            Situation
                          </th>
                          <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                            Official Programme Starting Point
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-800/10 font-body text-sm text-navy-900">
                        {brief.loanMatrix.map((row) => (
                          <tr key={row.situation} className="hover:bg-frost/40">
                            <td className="px-4 py-3 font-heading font-semibold text-navy-950">{row.situation}</td>
                            <td className="px-4 py-3">
                              <a
                                href={row.url}
                                target="_blank"
                                rel="noreferrer"
                                data-cursor="open"
                                className="link-underline inline-flex items-center gap-1 font-medium text-teal-ink"
                              >
                                <span>{row.startWith}</span>
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CHAPTER B — RELEVANT GOVERNMENT SCHEMES (OFFICIAL SOURCES ONLY) */}
          <section className="section bg-frost" data-testid="navigator-schemes-section">
            <div className="becci-container">
              <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <SectionHeading
                  eyebrow="Chapter 02 · Government Scheme Information"
                  title="Relevant Central & State programmes."
                  intro="Matched transparently by industry, focus and stage. Confirm live terms, ceilings and eligibility solely on each official government portal."
                />
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    role="group"
                    aria-label="Scheme display language"
                    data-testid="navigator-lang-toggle"
                    className="inline-flex shrink-0 items-center rounded-full border border-navy-800/15 bg-white p-1"
                  >
                    <button
                      type="button"
                      aria-pressed={!isTelugu}
                      onClick={() => setLang("en")}
                      data-testid="navigator-lang-en"
                      className={`min-h-[36px] rounded-full px-3.5 py-1 font-heading text-xs font-semibold transition-colors ${
                        !isTelugu
                          ? "bg-navy-950 text-white"
                          : "text-navy-800/75 hover:text-navy-950"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      aria-pressed={isTelugu}
                      onClick={() => setLang("te")}
                      data-testid="navigator-lang-te"
                      className={`font-telugu inline-flex min-h-[36px] items-center gap-1 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                        isTelugu
                          ? "bg-teal-deep text-white"
                          : "text-navy-800/75 hover:text-navy-950"
                      }`}
                    >
                      <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>తెలుగు</span>
                    </button>
                  </div>

                  <Link
                    to={
                      brief.sector.schemeCategories?.[0]
                        ? `/schemes?category=${encodeURIComponent(brief.sector.schemeCategories[0])}`
                        : "/schemes"
                    }
                    className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-navy-800/20 bg-white px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                  >
                    <span>Open Full {SCHEME_DATASET_STATS.totalShown}-Scheme Finder</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {brief.unmatchedSchemeNote ? (
                <div
                  data-testid="navigator-unmatched-schemes"
                  className="glass-light rounded-3xl p-8 sm:p-10"
                >
                  <div className="flex items-start gap-3.5">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-navy-950">
                        No direct scheme match for this exact stage filter.
                      </h3>
                      <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-navy-800/80">
                        {brief.unmatchedSchemeNote}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => selectStage("all")}
                          data-testid="navigator-broaden-stage"
                          className="inline-flex min-h-[44px] items-center rounded-full bg-navy-950 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-teal-deep"
                        >
                          Show all enterprise stages
                        </button>
                        <Link
                          to="/schemes"
                          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-navy-800/20 bg-white px-5 py-2.5 font-heading text-xs font-semibold text-navy-950 hover:border-teal-deep"
                        >
                          <span>Browse all {SCHEME_DATASET_STATS.totalShown} schemes</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {brief.schemes.map((s) => (
                    <GlassSpotlight
                      key={s.slug || s.id}
                      tone="light"
                      as="article"
                      className="glass-light grid gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center"
                    >
                      <div className="relative z-10 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                            {s.level} · {s.state || "All India"} · {s.type}
                          </span>
                          {s.obcRelevant && (
                            <span className="rounded-full bg-teal-mist px-2.5 py-0.5 font-heading text-[0.62rem] font-bold uppercase tracking-wider text-teal-ink">
                              OBC / BC Priority
                            </span>
                          )}
                          {s.status && <StatusChip label={s.status} />}
                        </div>
                        <h3
                          className={`mt-2 text-xl font-bold text-navy-950 ${
                            isTelugu && s.teName ? "font-telugu" : "font-heading"
                          }`}
                        >
                          <Link
                            to={`/schemes/${s.slug || s.id}`}
                            className="transition-colors hover:text-teal-ink"
                          >
                            {isTelugu && s.teName ? s.teName : s.name}
                          </Link>
                        </h3>
                        {isTelugu && s.teName && (
                          <p className="mt-0.5 font-heading text-xs font-semibold text-navy-800/75">
                            {s.name}
                          </p>
                        )}
                        <p className="mt-1 font-body text-xs text-navy-800/65">
                          {s.ministry}
                          {s.agency && s.agency !== s.ministry ? ` · ${s.agency}` : ""}
                        </p>
                        <p
                          className={`mt-3 text-sm text-navy-900/85 ${
                            isTelugu && s.teBrief ? "font-telugu" : "font-body leading-relaxed"
                          }`}
                        >
                          {isTelugu && s.teBrief ? s.teBrief : s.desc}
                        </p>
                        <p className="mt-3 rounded-xl border border-teal/20 bg-teal-mist/45 px-4 py-2.5 font-body text-xs leading-relaxed text-navy-950">
                          <span className="font-heading font-semibold text-teal-ink">Why matched: </span>
                          {s.whyRelevant}
                        </p>
                      </div>

                      <div className="relative z-10 flex flex-col justify-between gap-4 border-t border-navy-800/10 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                        <div className="space-y-2.5">
                          <Link
                            to={`/schemes/${s.slug || s.id}`}
                            className="group inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                          >
                            <span>View Full Scheme Details</span>
                            <ArrowRight className="h-3.5 w-3.5 text-teal-bright transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </Link>
                          <a
                            href={s.source}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor="open"
                            className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-navy-800/15 bg-white px-5 py-2 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                          >
                            <span>Visit Official Portal</span>
                            <ExternalLink className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                          </a>
                          <div className="flex flex-wrap items-center justify-between gap-1 pt-1 font-body text-[0.7rem] text-navy-800/65">
                            {s.myschemeUrl ? (
                              <a
                                href={s.myschemeUrl}
                                target="_blank"
                                rel="noreferrer"
                                data-cursor="open"
                                className="link-underline font-heading font-semibold text-teal-ink"
                              >
                                {s.sourceCredit || "Source: myScheme, Government of India"}
                              </a>
                            ) : (
                              <span>{s.sourceCredit || "Official Implementing Agency"}</span>
                            )}
                            <span>Verified · {s.lastVerified || SCHEME_DATASET_STATS.verifiedDate}</span>
                          </div>
                        </div>
                        <p className="font-body text-[0.72rem] leading-relaxed text-navy-800/65">
                          {SCHEME_CARD_NOTE}
                        </p>
                      </div>
                    </GlassSpotlight>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CHAPTER C — INDUSTRY CONTEXT & HONEST BECCI INITIATIVE STATUS */}
          <section className="section bg-white">
            <div className="becci-container grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <SectionHeading
                  eyebrow="Chapter 03 · Industry & Chamber Status"
                  title={`${brief.sector.name} inside BECCI.`}
                  intro={brief.sector.covers}
                  className="mb-8"
                />

                <div className="space-y-4">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    Available Today (Phase 01)
                  </p>
                  {brief.activeInitiatives.map((init) => (
                    <div key={init.id} className="rounded-2xl border border-ice/80 bg-frost/75 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-heading text-base font-bold text-navy-950">{init.name}</h3>
                        <StatusChip label={init.status} />
                      </div>
                      <p className="mt-2 font-body text-xs leading-relaxed text-navy-800/80">
                        {init.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-ice/80 bg-frost/60 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800/10 pb-4">
                  <div>
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-navy-700">
                      Roadmap Alignment · Not Yet Operational
                    </p>
                    <h3 className="mt-1 font-heading text-xl font-bold text-navy-950">
                      Upcoming programmes relevant to your choice
                    </h3>
                  </div>
                </div>
                <p className="mt-3 font-body text-xs leading-relaxed text-navy-800/70">
                  Shown transparently so you know what BECCI is building for Phases 02–04 — none of these tracks are accepting applications or fees today.
                </p>

                <div className="mt-5 space-y-4">
                  {brief.upcomingTracks.map((track) => (
                    <div key={track.id} className="rounded-2xl bg-white/95 p-5 shadow-soft">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-heading text-sm font-bold text-navy-950">{track.title}</p>
                        <StatusChip label={track.status} />
                      </div>
                      <p className="mt-2 font-body text-xs leading-relaxed text-navy-800/80">{track.desc}</p>
                      {track.disclaimer && (
                        <p className="mt-2.5 border-t border-navy-800/10 pt-2 font-body text-[0.72rem] text-navy-800/65">
                          {track.disclaimer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CHAPTER D — OFFICIAL GOVERNMENT PORTALS & RELEVANT FAQS */}
          <section className="section bg-frost">
            <div className="becci-container grid gap-12 lg:grid-cols-2 lg:items-start">
              <div>
                <SectionHeading
                  eyebrow="Chapter 04 · Official Government Resources"
                  title="Statutory portals to bookmark."
                  intro="Direct Government of India portals matched to your selections — BECCI is not affiliated with them and never asks for passwords or OTPs."
                  className="mb-8"
                />
                <div className="space-y-3">
                  {brief.portals.map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="open"
                      className="glass-light group flex items-start justify-between gap-4 rounded-2xl p-5 transition-colors hover:border-teal/40"
                    >
                      <div className="min-w-0">
                        <p className="font-heading text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                          {p.source}
                        </p>
                        <h3 className="mt-1 font-heading text-base font-bold text-navy-950 group-hover:text-teal-ink">
                          {p.name}
                        </h3>
                        <p className="mt-1 font-body text-xs leading-relaxed text-navy-800/80">{p.summary}</p>
                        <p className="mt-1.5 font-body text-[0.72rem] text-teal-ink">{p.whyRelevant}</p>
                      </div>
                      <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-frost text-teal-deep transition-colors group-hover:bg-navy-950 group-hover:text-teal-bright">
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeading
                  eyebrow="Key Clarifications"
                  title="Questions entrepreneurs ask here."
                  intro="Straight answers drawn directly from BECCI’s verified public guidance."
                  className="mb-8"
                />
                <div className="glass-light rounded-3xl px-6 py-2 sm:px-7">
                  <Accordion type="single" collapsible className="w-full">
                    {brief.faqs.map((f, i) => (
                      <AccordionItem
                        key={f.q}
                        value={`nav-faq-${i}`}
                        className="border-navy-800/10 last:border-b-0"
                      >
                        <AccordionTrigger className="py-4 text-left font-heading text-sm font-bold text-navy-950 hover:no-underline sm:text-base">
                          {f.q}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 font-body text-sm leading-relaxed text-navy-800/80">
                          {f.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </section>

          {/* CHAPTER E — CONNECT TO THE WIDER BECCI ECOSYSTEM */}
          <section className="on-dark bg-navy-950 py-20 text-white">
            <div className="becci-container">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <Eyebrow tone="tealDark">Continue Exploring BECCI</Eyebrow>
                  <h2 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
                    Go deeper anywhere in the chamber ecosystem.
                  </h2>
                </div>
                <Magnetic strength={0.14} maxOffset={5}>
                  <button
                    type="button"
                    onClick={resetNavigator}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-teal px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-colors hover:bg-teal-bright"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Explore another combination</span>
                  </button>
                </Magnetic>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {brief.ecosystemLinks.map((lnk) => (
                  <Link
                    key={lnk.to}
                    to={lnk.to}
                    className="glass-dark group flex min-w-0 flex-col justify-between rounded-2xl p-6 transition-colors hover:border-teal/55"
                  >
                    <div>
                      <StatusChip label={lnk.status} tone="dark" />
                      <h3 className="mt-3 flex items-center justify-between gap-2 font-heading text-base font-bold text-white group-hover:text-teal-bright">
                        <span>{lnk.label}</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-teal-bright" aria-hidden="true" />
                      </h3>
                      <p className="mt-2 font-body text-xs leading-relaxed text-ice/80">{lnk.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="mt-10 border-t border-ice/12 pt-6 font-body text-xs leading-relaxed text-ice/65">
                {SCHEME_NOTE}
              </p>
            </div>
          </section>
        </div>
      ) : (
        /* Editorial Explanation Below Entry Stage Before Selection Completes */
        <section className="section bg-white">
          <div className="becci-container grid gap-10 lg:grid-cols-3">
            {[
              {
                num: "01",
                title: "Zero sign-up, zero personal data",
                body: "Explore public guides, industry coverage and official government scheme portals freely — BECCI never collects caste or identity records during public discovery.",
              },
              {
                num: "02",
                title: "Transparent metadata matching",
                body: "Every recommended guide, scheme and portal explains clearly why it matches your focus and sector, with zero fabricated AI claims.",
              },
              {
                num: "03",
                title: "Direct official portals & honest status",
                body: "Government schemes link straight to official domains, and upcoming BECCI Phase 02–04 services remain transparently labelled.",
              },
            ].map((item) => (
              <div key={item.num} className="border-t border-navy-800/12 pt-6">
                <span className="tabular font-display text-3xl leading-none text-teal-deep">
                  {item.num}
                </span>
                <h2 className="mt-3 font-heading text-lg font-bold text-navy-950">{item.title}</h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
