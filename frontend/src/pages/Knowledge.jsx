import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Share2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import { Symbol } from "@/components/Logo";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { NEWS, KNOWLEDGE_PORTALS, SCHEME_CARD_NOTE } from "@/data/becci";
import { INSIGHT_ARTICLES, LOAN_DECISION_GUIDE } from "@/data/intelligence";
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
  const [sharedId, setSharedId] = useState(null);
  const reduce = useReducedMotion();

  const practicalGuides = useMemo(
    () => INSIGHT_ARTICLES.filter((a) => a.category === "Knowledge Guide"),
    []
  );

  const visiblePortals = useMemo(
    () => (tab === "all" ? KNOWLEDGE_PORTALS : KNOWLEDGE_PORTALS.filter((p) => getPortalGroup(p.name) === tab)),
    [tab]
  );

  const shareAnnouncement = async (item) => {
    const url = `${window.location.origin}/knowledge#${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text: item.body, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setSharedId(item.id);
      toast.success("Announcement link copied", { description: item.title });
      window.setTimeout(() => setSharedId(null), 2200);
    } catch {
      toast(url);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Newsroom & Knowledge"
        meta="5 Practical Guides · 11 Statutory Portals"
        title="What’s happening, and where to go next."
        intro="Verified BECCI announcements, five step-by-step entrepreneur guides, a loan decision guide, and direct links to official government portals."
      >
        <Link
          to="/intelligence"
          data-testid="knowledge-to-intelligence-hero"
          className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-teal px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-colors hover:bg-teal-bright"
        >
          <span>Open BECCI Intelligence (Library &amp; Learning Journeys)</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </PageHero>

      {/* Asymmetric Magazine Editorial Newsroom */}
      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Official Newsroom"
            title="Announcements from BECCI."
            intro="Only verified institutional milestones and official rollout announcements are published here."
            className="mb-12"
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {NEWS.map((n, i) => (
              <Reveal key={n.id} delay={i * 0.08} className={i === 0 ? "lg:col-span-7" : "lg:col-span-5"}>
                <GlassSpotlight
                  id={n.id}
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
                    className={`relative z-10 mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-4 font-body text-xs ${
                      i === 0 ? "border-ice/15 text-ice/75" : "border-navy-800/10 text-navy-600/75"
                    }`}
                  >
                    <span>Official BECCI dispatch · {n.year}</span>
                    <button
                      type="button"
                      onClick={() => shareAnnouncement(n)}
                      data-testid={`share-news-${i}`}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-heading text-[0.68rem] font-semibold uppercase tracking-wider transition-colors ${
                        i === 0
                          ? "border-ice/25 text-ice hover:border-teal hover:text-teal-bright"
                          : "border-navy-800/15 text-navy-900 hover:border-teal-deep hover:text-teal-deep"
                      }`}
                    >
                      {sharedId === n.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Link copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </GlassSpotlight>
              </Reveal>
            ))}
          </div>

          {/* Transparent Events & Publications Shelf (zero invented events/briefings) */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-ice/70 bg-frost p-6">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  Events &amp; Convenings
                </p>
                <p className="mt-1 font-body text-sm text-navy-800/80">
                  Confirmed district outreach sessions and public chamber events will be listed here once dates are finalised.
                </p>
              </div>
              <StatusChip label="Planned" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-ice/70 bg-frost p-6">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  Reports &amp; Policy Briefings
                </p>
                <p className="mt-1 font-body text-sm text-navy-800/80">
                  Five practical entrepreneur guides are live below. Formal research reports and policy briefs will be published here upon release.
                </p>
              </div>
              <StatusChip label="Coming soon" />
            </div>
          </div>
        </div>
      </section>

      {/* Five Practical Entrepreneur Guides + Loan Decision Guide Matrix */}
      <section id="guides" className="section bg-frost" data-testid="knowledge-guides">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Practical Entrepreneur Guides"
            title="Five guides answering the questions members ask first."
            intro="Clear, step-by-step walkthroughs linking straight to official government portals — no middlemen, no paid look-alike sites."
            className="mb-12"
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {practicalGuides.map((guide, i) => (
              <Reveal key={guide.slug} delay={(i % 3) * 0.05}>
                <GlassSpotlight
                  tone="light"
                  as="article"
                  className="glass-light flex h-full min-w-0 flex-col justify-between rounded-2xl p-6"
                >
                  <div className="relative z-10 min-w-0">
                    <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                      {guide.label}
                    </span>
                    <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-navy-950">
                      {guide.title}
                    </h3>
                    <p className="mt-2.5 font-body text-sm leading-relaxed text-navy-800/80">
                      {guide.excerpt}
                    </p>
                  </div>
                  <div className="relative z-10 mt-6 border-t border-navy-800/10 pt-4">
                    <Link
                      to={`/intelligence/article/${guide.slug}`}
                      data-testid={`knowledge-guide-${i}`}
                      className="link-underline inline-flex min-h-[38px] items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-teal-ink"
                    >
                      <span>Read full guide</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </GlassSpotlight>
              </Reveal>
            ))}
          </div>

          {/* Guide 04 Interactive Reference Table: Which Loan Fits You? */}
          <div className="glass-light mt-12 rounded-3xl p-6 sm:p-9" data-testid="loan-decision-guide">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  Quick Reference · Guide 04
                </p>
                <h3 className="mt-1.5 font-heading text-2xl font-bold text-navy-950">
                  Which loan fits you?
                </h3>
              </div>
              <Link
                to="/schemes"
                className="link-underline inline-flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-wider text-teal-ink"
              >
                <span>Compare all 12 schemes</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-ice/80 bg-white/95">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-navy-800/10 bg-frost/90">
                    <th className="px-5 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                      Your Situation
                    </th>
                    <th className="px-5 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                      Start With
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/10 font-body text-sm text-navy-900">
                  {LOAN_DECISION_GUIDE.map((row) => (
                    <tr key={row.situation} className="hover:bg-frost/40">
                      <td className="px-5 py-3.5 font-heading font-semibold text-navy-950">{row.situation}</td>
                      <td className="px-5 py-3.5">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noreferrer"
                          className="link-underline inline-flex items-center gap-1.5 font-medium text-teal-ink"
                        >
                          <span>{row.startWith}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-body text-xs leading-relaxed text-navy-800/65">
              {SCHEME_CARD_NOTE}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Knowledge Centre Portal Directory */}
      <section className="section bg-white">
        <div className="becci-container">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Knowledge Centre"
              title="Official portals, in one place."
              intro="Registration, taxes, credit and skilling — go straight to the official statutory source."
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
