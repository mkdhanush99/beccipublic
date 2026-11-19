import React, { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import { Symbol } from "@/components/Logo";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { NEWS, KNOWLEDGE_PORTALS } from "@/data/becci";
import { EASE_OUT } from "@/lib/motion";

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

const PORTAL_TABS = [
  { id: "all", label: "All Portals" },
  { id: "compliance", label: "Registration & Tax" },
  { id: "finance", label: "MSME & Finance" },
  { id: "growth", label: "Markets & Skilling" },
];

const getPortalGroup = (name) => {
  if (/Udyam|GST|MCA|NCBC/i.test(name)) return "compliance";
  if (/SIDBI|MSME|Samadhaan/i.test(name)) return "finance";
  return "growth";
};

export default function Knowledge() {
  const [tab, setTab] = useState("all");
  const reduce = useReducedMotion();

  const visiblePortals = useMemo(
    () => (tab === "all" ? KNOWLEDGE_PORTALS : KNOWLEDGE_PORTALS.filter((p) => getPortalGroup(p.name) === tab)),
    [tab]
  );

  return (
    <>
      <PageHero
        eyebrow="News & Knowledge"
        meta="Official Updates · Eleven Public Portals"
        title="What’s happening, and where to go next."
        intro="Official updates from BECCI, and direct links to the government portals entrepreneurs use most."
      />

      {/* Asymmetric Magazine Editorial Feature Spread (distinct layout for Updates) */}
      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading eyebrow="Latest Dispatch" title="Official updates from BECCI." className="mb-12" />
          <div className="grid gap-6 lg:grid-cols-12">
            {NEWS.map((n, i) => (
              <Reveal key={i} delay={i * 0.08} className={i === 0 ? "lg:col-span-7" : "lg:col-span-5"}>
                <GlassSpotlight
                  tone={i === 0 ? "dark" : "light"}
                  as="article"
                  className={`flex h-full flex-col justify-between rounded-3xl p-8 md:p-11 ${
                    i === 0
                      ? "on-dark glass-iridescent bg-navy-950 text-white"
                      : "glass-light text-navy-950"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`eyebrow ${i === 0 ? "text-teal-bright" : "text-teal-deep"}`}>
                        {n.kind} · {n.year}
                      </span>
                      <Symbol variant={i === 0 ? "white" : "navy"} className="h-4 w-auto opacity-80" />
                    </div>
                    <h2
                      className={`mt-6 font-heading font-bold leading-snug ${
                        i === 0 ? "text-2xl text-white md:text-3xl" : "text-xl text-navy-950 md:text-2xl"
                      }`}
                    >
                      {n.title}
                    </h2>
                    <p
                      className={`mt-4 font-body text-base leading-relaxed ${
                        i === 0 ? "text-ice/90" : "text-navy-800/80"
                      }`}
                    >
                      {n.body}
                    </p>
                  </div>
                  <div
                    className={`relative z-10 mt-10 flex items-center justify-between border-t pt-4 font-body text-xs ${
                      i === 0 ? "border-ice/15 text-ice/70" : "border-navy-800/10 text-navy-600/75"
                    }`}
                  >
                    <span>Official BECCI announcement</span>
                    <span className="tabular font-heading font-semibold">{n.year}</span>
                  </div>
                </GlassSpotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Knowledge Centre Portal Directory */}
      <section className="section bg-frost">
        <div className="becci-container">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Knowledge Centre"
              title="Official portals, in one place."
              intro="Registration, taxes, credit and skilling — go straight to the source."
            />

            <div
              role="tablist"
              aria-label="Filter official portals"
              onKeyDown={(e) => {
                const idx = PORTAL_TABS.findIndex((t) => t.id === tab);
                let next = -1;
                if (e.key === "ArrowRight") next = (idx + 1) % PORTAL_TABS.length;
                else if (e.key === "ArrowLeft") next = (idx - 1 + PORTAL_TABS.length) % PORTAL_TABS.length;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = PORTAL_TABS.length - 1;
                if (next >= 0) {
                  e.preventDefault();
                  const nextId = PORTAL_TABS[next].id;
                  setTab(nextId);
                  e.currentTarget.querySelector(`[data-testid="portal-tab-${nextId}"]`)?.focus();
                }
              }}
              className="flex shrink-0 flex-wrap gap-1.5 rounded-2xl border border-ice/70 bg-white/80 p-1.5"
            >
              {PORTAL_TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    tabIndex={active ? 0 : -1}
                    aria-selected={active}
                    onClick={() => setTab(t.id)}
                    data-testid={`portal-tab-${t.id}`}
                    className={`relative min-h-[38px] whitespace-nowrap rounded-xl px-3.5 py-2 font-heading text-xs font-semibold transition-colors ${
                      active ? "text-white" : "text-navy-800/75 hover:text-navy-950"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={reduce ? undefined : "portal-filter-pill"}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-navy-950"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePortals.map((p) => (
              <motion.div
                key={p.name}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`portal-${slug(p.name)}`}
                  className="glass-light hover-lift group flex h-full items-center justify-between gap-3 rounded-2xl p-5 transition-[transform,border-color,box-shadow] hover:border-teal/35"
                >
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-navy-950 transition-colors group-hover:text-teal-ink">
                      {p.name}
                    </p>
                    <p className="mt-0.5 truncate font-body text-xs text-navy-800/60">{p.url.replace("https://", "")}</p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-800/10 bg-frost text-teal-deep transition-colors group-hover:bg-navy-950 group-hover:text-teal-bright">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </a>
              </motion.div>
            ))}
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-navy-950 p-5 text-white shadow-glass-dark ring-1 ring-ice/15">
              <div>
                <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-widest text-teal-bright">
                  Publications
                </span>
                <p className="mt-1 font-heading text-sm font-semibold text-white">
                  BECCI guides &amp; briefings
                </p>
              </div>
              <StatusChip label="Coming soon" tone="dark" />
            </div>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Get in touch"
        title="Reach the BECCI chamber office."
        desc="Connect with our registered office in Begumpet, Hyderabad for institutional or membership enquiries."
        to="/contact"
        ctaLabel="Contact BECCI"
        testid="knowledge-to-contact"
      />
    </>
  );
}
