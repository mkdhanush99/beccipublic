import React, { useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { SCHEMES, SCHEME_NOTE } from "@/data/becci";
import { EASE_OUT } from "@/lib/motion";

const SCHEME_CATEGORIES = [
  { id: "all", label: "All Programmes" },
  { id: "credit", label: "Credit & Loans" },
  { id: "skills", label: "Skills & Artisans" },
  { id: "ventures", label: "Startups & Greenfield" },
];

const getCategory = (name) => {
  if (/DAKSH|Vishwakarma/i.test(name)) return "skills";
  if (/Stand-Up|Startup/i.test(name)) return "ventures";
  return "credit";
};

export default function Schemes() {
  const [filter, setFilter] = useState("all");
  const reduce = useReducedMotion();

  const indexedSchemes = useMemo(
    () => SCHEMES.map((s, idx) => ({ ...s, idx, category: getCategory(s.name) })),
    []
  );

  const visible = useMemo(
    () => (filter === "all" ? indexedSchemes : indexedSchemes.filter((s) => s.category === filter)),
    [filter, indexedSchemes]
  );

  return (
    <>
      <PageHero
        eyebrow="Schemes"
        meta="Eight Central Government Programmes"
        title="Government schemes, with links to the official source."
        intro="A public information page. BECCI points you to relevant Central Government programmes — it does not run or process them."
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
              Official links only
            </span>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="becci-container">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Central Government schemes"
              title="Eight programmes worth knowing."
              intro="Filter by focus area and click any programme to visit its official government portal."
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

          <div className="grid gap-5 md:grid-cols-2">
            {visible.map((s) => (
              <motion.div
                key={s.name}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                <GlassSpotlight tone="light" className="h-full rounded-2xl">
                  <a
                    href={s.source}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`scheme-${s.idx}`}
                    className="hover-lift glass-light group flex h-full flex-col rounded-2xl p-7 transition-[transform,box-shadow,border-color] duration-200 hover:border-teal/40 hover:shadow-lift"
                  >
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">
                          {s.ministry}
                        </p>
                        <h3 className="mt-1.5 font-heading text-lg font-bold text-navy-950 transition-colors group-hover:text-teal-ink">
                          {s.name}
                        </h3>
                      </div>
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-frost text-teal-deep transition-colors group-hover:bg-navy-950 group-hover:text-teal-bright">
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </div>
                    <p className="relative z-10 mt-3 flex-1 font-body text-sm leading-relaxed text-navy-800/80">{s.desc}</p>
                    <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-navy-800/10 pt-4">
                      <span className="font-body text-xs font-medium text-teal-deep break-all">
                        {s.source.replace("https://", "")}
                      </span>
                      <span className="font-body text-[0.68rem] uppercase tracking-wide text-navy-800/50">
                        Official portal
                      </span>
                    </div>
                  </a>
                </GlassSpotlight>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-ice/60 bg-frost p-6">
            <p className="font-body text-sm leading-relaxed text-navy-800/80">
              No eligibility, amounts, deadlines or application status are shown here. Confirm every detail on the
              official source before acting.
            </p>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="More public portals"
        title="Visit the BECCI Knowledge Centre."
        desc="Direct links to Udyam Registration, GST, MCA, SIDBI, GeM, Startup India and other essential portals."
        to="/knowledge"
        ctaLabel="Explore Knowledge Centre"
        testid="schemes-to-knowledge"
      />
    </>
  );
}
