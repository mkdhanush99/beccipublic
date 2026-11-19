import React, { useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { SCHEMES, SCHEME_NOTE, SCHEME_CARD_NOTE } from "@/data/becci";
import { EASE_OUT } from "@/lib/motion";

const SCHEME_CATEGORIES = [
  { id: "all", label: "All Programmes" },
  { id: "featured", label: "Flagship OBC (4)" },
  { id: "credit", label: "Credit & Subsidies" },
  { id: "skills", label: "Skills & Artisans" },
  { id: "ventures", label: "Startups & State" },
];

const getCategory = (scheme) => {
  if (/DAKSH|Vishwakarma/i.test(scheme.name)) return "skills";
  if (/Stand-Up|Startup|Venture|ZED|Telangana|Andhra/i.test(scheme.name)) return "ventures";
  return "credit";
};

export default function Schemes() {
  const [filter, setFilter] = useState("all");
  const reduce = useReducedMotion();

  const indexedSchemes = useMemo(
    () => SCHEMES.map((s, idx) => ({ ...s, idx, category: getCategory(s) })),
    []
  );

  const visible = useMemo(() => {
    if (filter === "all") return indexedSchemes;
    if (filter === "featured") return indexedSchemes.filter((s) => s.featured);
    return indexedSchemes.filter((s) => s.category === filter);
  }, [filter, indexedSchemes]);

  const featuredVisible = useMemo(() => visible.filter((s) => s.featured), [visible]);
  const otherVisible = useMemo(() => visible.filter((s) => !s.featured), [visible]);

  return (
    <>
      <PageHero
        eyebrow="Schemes"
        meta={`${SCHEMES.length} Verified Central & State Programmes`}
        title="Government schemes, with verified facts and official links."
        intro="A public information directory compiled from official and myScheme sources. BECCI provides guidance only — it does not process applications or guarantee approvals."
      />

      <section className="bg-frost py-8">
        <div className="becci-container">
          <div className="glass-light flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
              <p className="font-body text-sm leading-relaxed text-navy-950">{SCHEME_NOTE}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-mist px-3.5 py-1.5 font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-teal-ink">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
              Last verified · 18 Nov 2026
            </span>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="becci-container">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Central & State Government schemes"
              title="Twelve programmes worth knowing."
              intro="Four flagship schemes suited to OBC entrepreneurs with verified slabs, plus eight additional Central and State programmes."
            />

            {/* Content-led Interactive Category Filter with WAI-ARIA arrow-key support */}
            <div
              role="tablist"
              aria-label="Filter government schemes"
              onKeyDown={(e) => {
                const idx = SCHEME_CATEGORIES.findIndex((c) => c.id === filter);
                let next = -1;
                if (e.key === "ArrowRight") next = (idx + 1) % SCHEME_CATEGORIES.length;
                else if (e.key === "ArrowLeft") next = (idx - 1 + SCHEME_CATEGORIES.length) % SCHEME_CATEGORIES.length;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = SCHEME_CATEGORIES.length - 1;
                if (next >= 0) {
                  e.preventDefault();
                  const nextId = SCHEME_CATEGORIES[next].id;
                  setFilter(nextId);
                  e.currentTarget.querySelector(`[data-testid="scheme-filter-${nextId}"]`)?.focus();
                }
              }}
              className="flex shrink-0 flex-wrap gap-1.5 rounded-2xl border border-ice/70 bg-frost p-1.5"
            >
              {SCHEME_CATEGORIES.map((cat) => {
                const active = filter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    tabIndex={active ? 0 : -1}
                    aria-selected={active}
                    onClick={() => setFilter(cat.id)}
                    data-testid={`scheme-filter-${cat.id}`}
                    className={`relative min-h-[38px] whitespace-nowrap rounded-xl px-3.5 py-2 font-heading text-xs font-semibold transition-colors ${
                      active ? "text-white" : "text-navy-800/75 hover:text-navy-950"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={reduce ? undefined : "scheme-filter-pill"}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-navy-950"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured 4 Flagship OBC Schemes with Detailed Verified Tables & Highlights */}
          {featuredVisible.length > 0 && (
            <div className="space-y-6" data-testid="featured-schemes-list">
              {featuredVisible.map((s) => (
                <motion.div
                  key={s.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                >
                  <GlassSpotlight
                    tone="light"
                    as="article"
                    className="glass-light min-w-0 rounded-3xl p-6 sm:p-8 lg:p-9"
                  >
                    <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-navy-800/10 pb-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">
                            {s.ministry}
                          </span>
                          <StatusChip label="Featured OBC Scheme" />
                        </div>
                        <h3 className="mt-2 font-heading text-xl font-bold text-navy-950 sm:text-2xl">
                          {s.name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-ice bg-frost px-3 py-1 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-navy-800/75">
                          Last verified: {s.lastVerified}
                        </span>
                        <a
                          href={s.source}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`scheme-${s.idx}`}
                          className="group inline-flex min-h-[40px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                        >
                          <span>Official Portal</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>

                    <div className="relative z-10 mt-5 space-y-4">
                      {s.eligibility && (
                        <div className="rounded-2xl border border-teal/25 bg-teal-mist/45 px-5 py-3.5">
                          <p className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-ink">
                            Key Eligibility &amp; Focus
                          </p>
                          <p className="mt-1 font-body text-sm leading-relaxed text-navy-950">{s.eligibility}</p>
                        </div>
                      )}

                      <p className="font-body text-sm leading-relaxed text-navy-800/85 sm:text-[0.95rem]">
                        {s.desc}
                      </p>

                      {/* Responsive NBCFDC Loan Table */}
                      {s.table && (
                        <div className="overflow-x-auto rounded-2xl border border-ice/80 bg-white/90">
                          <table className="w-full min-w-[540px] border-collapse text-left">
                            <thead>
                              <tr className="border-b border-navy-800/10 bg-frost/90">
                                <th className="px-4 py-3 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                                  Scheme
                                </th>
                                <th className="px-4 py-3 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                                  Max Loan
                                </th>
                                <th className="px-4 py-3 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                                  Interest (to beneficiary)
                                </th>
                                <th className="px-4 py-3 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                                  Repay
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-800/10 font-body text-xs text-navy-900 sm:text-sm">
                              {s.table.map((row) => (
                                <tr key={row.sub} className="hover:bg-frost/40">
                                  <td className="px-4 py-3 font-heading font-semibold text-navy-950">{row.sub}</td>
                                  <td className="tabular px-4 py-3">{row.max}</td>
                                  <td className="tabular px-4 py-3 font-medium text-teal-ink">{row.rate}</td>
                                  <td className="tabular px-4 py-3 text-navy-800/80">{row.repay}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {s.note && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-uv/25 bg-uv/[0.06] px-4 py-3">
                          <Info className="mt-0.5 h-4 w-4 shrink-0 text-uv-deep" aria-hidden="true" />
                          <p className="font-body text-xs leading-relaxed text-navy-900/85">{s.note}</p>
                        </div>
                      )}

                      {/* Verified Highlights & Worked Examples */}
                      {s.highlights && (
                        <ul className="space-y-2.5 rounded-2xl border border-ice/75 bg-frost/80 p-5">
                          {s.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2.5 font-body text-sm leading-relaxed text-navy-900/85">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Official Sources & Required Scheme Disclaimer Line */}
                    <div className="relative z-10 mt-6 space-y-3 border-t border-navy-800/10 pt-4">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <a
                          href={s.source}
                          target="_blank"
                          rel="noreferrer"
                          className="link-underline inline-flex items-center gap-1 font-body text-xs font-semibold text-teal-deep break-all"
                        >
                          <span>{s.source.replace("https://", "")}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </a>
                        {s.extraSources?.map((src) => (
                          <a
                            key={src.url}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="link-underline inline-flex items-center gap-1 font-heading text-xs font-semibold text-navy-800/75 hover:text-teal-ink"
                          >
                            <span>{src.label}</span>
                            <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                      <p className="font-body text-xs leading-relaxed text-navy-800/65">
                        {SCHEME_CARD_NOTE}
                      </p>
                    </div>
                  </GlassSpotlight>
                </motion.div>
              ))}
            </div>
          )}

          {/* Additional 8 Central & State Programmes */}
          {otherVisible.length > 0 && (
            <div className={featuredVisible.length > 0 ? "mt-12" : ""}>
              {featuredVisible.length > 0 && (
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                    Also Featured · Central &amp; State Programmes
                  </p>
                  <span className="font-body text-xs text-navy-800/60">
                    Click any card to inspect the official source directly
                  </span>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                {otherVisible.map((s) => (
                  <motion.div
                    key={s.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, ease: EASE_OUT }}
                    className="min-w-0"
                  >
                    <GlassSpotlight tone="light" className="h-full min-w-0 rounded-2xl">
                      <a
                        href={s.source}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`scheme-${s.idx}`}
                        className="hover-lift glass-light group flex h-full min-w-0 flex-col rounded-2xl p-7 transition-[transform,box-shadow,border-color] duration-200 hover:border-teal/40 hover:shadow-lift"
                      >
                        <div className="relative z-10 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">
                                {s.ministry}
                              </p>
                              {s.status && <StatusChip label={s.status} />}
                            </div>
                            <h3 className="mt-1.5 font-heading text-lg font-bold text-navy-950 transition-colors group-hover:text-teal-ink">
                              {s.name}
                            </h3>
                          </div>
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-frost text-teal-deep transition-colors group-hover:bg-navy-950 group-hover:text-teal-bright">
                            <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                          </span>
                        </div>
                        <p className="relative z-10 mt-3 flex-1 font-body text-sm leading-relaxed text-navy-800/80">
                          {s.desc}
                        </p>
                        <div className="relative z-10 mt-5 space-y-2 border-t border-navy-800/10 pt-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-body text-xs font-medium text-teal-deep break-all">
                              {s.source.replace("https://", "")}
                            </span>
                            <span className="font-body text-[0.68rem] uppercase tracking-wide text-navy-800/55">
                              Verified {s.lastVerified}
                            </span>
                          </div>
                          <p className="font-body text-[0.72rem] leading-relaxed text-navy-800/60">
                            {SCHEME_CARD_NOTE}
                          </p>
                        </div>
                      </a>
                    </GlassSpotlight>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-ice/60 bg-frost p-6">
            <p className="font-body text-sm leading-relaxed text-navy-800/80">
              {SCHEME_NOTE}
            </p>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Step-by-step guides & portals"
        title="Visit the BECCI Knowledge Centre."
        desc="Read our five practical guides — Udyam registration, BC certificates, PMEGP steps, loan decision guide — plus 11 official portals."
        to="/knowledge"
        ctaLabel="Explore Knowledge Centre"
        testid="schemes-to-knowledge"
      />
    </>
  );
}
