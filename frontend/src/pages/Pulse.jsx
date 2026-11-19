import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Compass,
  Copy,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Eyebrow, SectionHeading, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import { InstitutionalSeal, Symbol } from "@/components/Logo";
import PulseUniverseCanvas from "@/components/visuals/PulseUniverseCanvas";
import { GlassSpotlight, Magnetic } from "@/components/visuals/MotionPrimitives";
import { PillarSvgIcon, SectorSvgIcon, WingBadgeIcon } from "@/components/illustrations/BecciArtwork";
import {
  CONTACT,
  GOVERNANCE_DISCLOSURES,
  KNOWLEDGE_PORTALS,
  NEWS,
  ORG_LEVELS,
  PHASE_INITIATIVES,
  PILLARS,
  ROADMAP,
  SCHEMES,
  SCHEME_DATASET_STATS,
  SCHEME_NOTE,
  SECTORS,
  WINGS,
} from "@/data/becci";
import { EASE_OUT } from "@/lib/motion";

const TERRITORIES = [
  {
    id: "knowledge",
    num: "01",
    name: "Knowledge & Clarity",
    axis: "Capability Territory",
    summary:
      "Structured orientation across enterprise registration, statutory compliance, taxation and skilling — guiding founders directly to primary government sources.",
    verifiedItems: [
      `${KNOWLEDGE_PORTALS.length} direct statutory & institutional portals indexed`,
      "5 practical entrepreneur guides + Udyam, GST, MCA, Skill India & NCBC orientation",
      "Phase 01 Public Information Desk available now",
    ],
    primary: { label: "Open BECCI Intelligence", to: "/intelligence" },
    secondary: { label: "Knowledge Centre", to: "/knowledge" },
  },
  {
    id: "finance",
    num: "02",
    name: "Capital & Credit Pathways",
    axis: "Formalisation Territory",
    summary:
      "Financial literacy, enterprise formalisation awareness and clear pointers to institutional lending products so growing businesses become credit-ready.",
    verifiedItems: [
      "Direct orientation to MUDRA, CGTMSE, PMEGP & NBCFDC",
      "SIDBI & MSME Samadhaan official portals",
      "Zero middlemen — BECCI never collects scheme fees or OTPs",
    ],
    primary: { label: "Explore Credit Programmes", to: "/schemes" },
    secondary: { label: "Contact Chamber Desk", to: "/contact?topic=entrepreneur" },
  },
  {
    id: "markets",
    num: "03",
    name: "Markets & Eleven Sectors",
    axis: "Commerce Territory",
    summary:
      "Spanning manufacturing, trading, services, healthcare, education, agriculture, IT, infrastructure, finance and hospitality across Bharat.",
    verifiedItems: [
      "11 productive business sectors represented",
      "6 entrepreneur constituencies from artisans to MSMEs",
      "Direct gateway to Government e-Marketplace (GeM) & NSIC",
    ],
    primary: { label: "Explore Sectors & Audiences", to: "/who-we-serve" },
    secondary: { label: "Phase 01 Initiatives", to: "/what-we-do#initiatives" },
  },
  {
    id: "reach",
    num: "04",
    name: "National Reach & Wings",
    axis: "Continuum Territory",
    summary:
      "One transparent four-tier architecture — National, State, District and City — strengthened by dedicated Women's and Youth Wings.",
    verifiedItems: [
      "4-tier structure: National → State → District → City",
      "Dedicated Women's Wing & Youth Wing representation",
      "Phase 01 district outreach & state membership desks underway",
    ],
    primary: { label: "Explore Wings & Chapters", to: "/wings-chapters" },
    secondary: { label: "Governance & Standing", to: "/about#governance" },
  },
  {
    id: "schemes",
    num: "05",
    name: "Public Programmes & Schemes",
    axis: "Institutional Territory",
    summary:
      `Transparent, scam-free access to ${SCHEME_DATASET_STATS.totalShown} verified Central, Telangana and Andhra Pradesh enterprise programmes — sourced from myScheme (Government of India) and official implementing portals.`,
    verifiedItems: [
      `${SCHEME_DATASET_STATS.totalShown} verified Central, Telangana & AP Government schemes`,
      `${SCHEME_DATASET_STATS.obcCount} OBC / Backward Classes priority & ${SCHEME_DATASET_STATS.entrepreneurCount} entrepreneur schemes`,
      `Verified ${SCHEME_DATASET_STATS.verifiedDate} · Source: myScheme, Government of India`,
    ],
    primary: { label: `Browse All ${SCHEME_DATASET_STATS.totalShown} Schemes`, to: "/schemes" },
    secondary: { label: "Membership Guide", to: "/membership" },
  },
];

const WALL_CATEGORIES = [
  { id: "all", label: "All Verified" },
  { id: "programmes", label: "Programmes" },
  { id: "initiatives", label: "Initiatives" },
  { id: "resources", label: "Resources" },
  { id: "announcements", label: "Announcements" },
  { id: "events", label: "Events" },
  { id: "publications", label: "Publications" },
];

const OBSERVATORY_TIMELINE = [
  {
    period: "2026 · Foundation",
    title: "Section 8 Incorporation under MCA",
    status: "Active",
    detail:
      "Bahujan Entrepreneurs Chamber for Commerce & Industry incorporated as a Section 8 not-for-profit company (CIN U94110TS2026NPL222589), headquartered at Begumpet, Hyderabad.",
  },
  {
    period: "2026 · Phase 01",
    title: "Public Information Platform & District Outreach",
    status: "Active · Phase 01",
    detail:
      `Public website, ${SCHEME_DATASET_STATS.totalShown} verified Central, Telangana & AP schemes (myScheme, GoI), 5 practical entrepreneur guides and ${KNOWLEDGE_PORTALS.length} statutory portals published. Phase 01 rollout initiated in Telangana and Andhra Pradesh with district outreach and state membership desks.`,
  },
  {
    period: "Upcoming · Disclosures",
    title: "Governance Directory, Membership Rules & Chapters",
    status: "[TO BE CONFIRMED]",
    detail:
      "Board of Directors profiles, MoA/AoA summaries, finalised membership categories/fees and confirmed chapter offices will enter this public Observatory only after governing-body approval.",
  },
  {
    period: "Horizon · Future Services",
    title: "Digital & Physical Ecosystem Expansion",
    status: "Planned",
    detail:
      "Member networking, B2B exchange (Under development), mentoring & investor connections (Coming soon), incubation support and multilingual access remain transparently labelled as future phases.",
  },
];

export default function Pulse() {
  const [territoryIdx, setTerritoryIdx] = useState(0);
  const [wallCat, setWallCat] = useState("all");
  const [query, setQuery] = useState("");
  const [copiedCin, setCopiedCin] = useState(false);
  const [sharedId, setSharedId] = useState(null);
  const reduce = useReducedMotion();

  const territory = TERRITORIES[territoryIdx];

  // Unified verified Opportunity Wall index — zero invented entries
  const wallItems = useMemo(() => {
    const items = [
      ...NEWS.map((n) => ({
        id: `news-${n.id}`,
        category: "announcements",
        badge: `${n.kind} · ${n.year}`,
        title: n.title,
        desc: n.body,
        meta: "Official BECCI dispatch",
        to: `/knowledge#${n.id}`,
        shareable: n,
      })),
      ...PHASE_INITIATIVES.map((init) => ({
        id: `init-${init.id}`,
        category: "initiatives",
        badge: init.status,
        title: init.name,
        desc: init.purpose,
        meta: init.audience,
        to: init.to,
        cta: init.cta,
      })),
      ...SCHEMES.map((s) => ({
        id: `scheme-${s.slug || s.id}`,
        category: "programmes",
        badge: s.ministry,
        title: s.name,
        desc: s.desc,
        meta: s.sourceCredit || "Source: myScheme, Government of India",
        to: `/schemes/${s.slug || s.id}`,
        cta: "View scheme details",
      })),
      ...KNOWLEDGE_PORTALS.map((p, idx) => ({
        id: `portal-${idx}`,
        category: "resources",
        badge: "Official Government Portal",
        title: p.name,
        desc: `Direct statutory portal at ${p.url.replace("https://", "")} — no intermediaries.`,
        meta: p.url.replace("https://", ""),
        href: p.url,
      })),
    ];
    return items;
  }, []);

  const counts = useMemo(
    () => ({
      all: wallItems.length,
      programmes: SCHEMES.length,
      initiatives: PHASE_INITIATIVES.length,
      resources: KNOWLEDGE_PORTALS.length,
      announcements: NEWS.length,
      events: 0,
      publications: 0,
    }),
    [wallItems.length]
  );

  const filteredWall = useMemo(() => {
    const q = query.trim().toLowerCase();
    return wallItems.filter((item) => {
      const catOk = wallCat === "all" || item.category === wallCat;
      if (!catOk) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q)
      );
    });
  }, [wallItems, wallCat, query]);

  const copyCin = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.cin);
      setCopiedCin(true);
      toast.success("Corporate Identity Number copied", { description: CONTACT.cin });
      window.setTimeout(() => setCopiedCin(false), 2200);
    } catch {
      toast(CONTACT.cin);
    }
  };

  const shareDispatch = async (item) => {
    const url = `${window.location.origin}/knowledge#${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text: item.body, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setSharedId(item.id);
      toast.success("Dispatch link copied", { description: item.title });
      window.setTimeout(() => setSharedId(null), 2200);
    } catch {
      toast(url);
    }
  };

  const handleTerritoryKey = (e) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (territoryIdx + 1) % TERRITORIES.length;
    else if (e.key === "ArrowLeft") next = (territoryIdx - 1 + TERRITORIES.length) % TERRITORIES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TERRITORIES.length - 1;
    if (next >= 0) {
      e.preventDefault();
      setTerritoryIdx(next);
      e.currentTarget.querySelector(`[data-testid="pulse-territory-${next}"]`)?.focus();
    }
  };

  const handleWallKey = (e) => {
    const idx = WALL_CATEGORIES.findIndex((c) => c.id === wallCat);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % WALL_CATEGORIES.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + WALL_CATEGORIES.length) % WALL_CATEGORIES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = WALL_CATEGORIES.length - 1;
    if (next >= 0) {
      e.preventDefault();
      const id = WALL_CATEGORIES[next].id;
      setWallCat(id);
      e.currentTarget.querySelector(`[data-testid="wall-tab-${id}"]`)?.focus();
    }
  };

  return (
    <>
      {/* =====================================================================
          REALM 01 — THE ENTERPRISE UNIVERSE (3D Spatial Glass Exhibition)
         ===================================================================== */}
      <section
        className="on-dark relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-navy-950 pt-24 text-white sm:pt-28"
        data-cursor-hero="true"
        data-testid="pulse-universe"
      >
        <PulseUniverseCanvas activeIndex={territoryIdx} />

        {/* Subtle legibility gradient anchoring the left editorial column */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/48 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/65 via-transparent to-navy-950"
        />

        {/* Exhibition Header & Floating Iridescent Territory Lens */}
        <div className="becci-container relative z-10 my-auto py-8 lg:py-10">
          <div className="grid items-end gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
            {/* Left: Monumental BECCI PULSE Exhibition Title & Context */}
            <div>
              <p className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-teal-bright mb-2">
                BECCI PULSE · Interactive Digital Exhibition
              </p>

              <h1 className="display-head text-[3.2rem] leading-[0.92] text-white sm:text-[4.8rem] lg:text-[5.8rem] font-bold tracking-tight">
                The Enterprise <span className="text-ice">Universe.</span>
              </h1>

              <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-frost/88 sm:text-lg">
                Step inside BECCI’s living institutional environment — explore five verified focus territories,
                discover official programmes on the Opportunity Wall, and inspect our public record in the Digital Observatory.
              </p>

              {/* Quick Realm Anchors */}
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  { id: "opportunity-wall", label: "02 · Opportunity Wall" },
                  { id: "digital-observatory", label: "03 · Digital Observatory" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => document.getElementById(r.id)?.scrollIntoView({ behavior: "smooth" })}
                    className="glass-pill inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal/60 hover:text-teal-bright"
                  >
                    <Compass className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Active Territory Optical Glass Lens - Integrated with Hero */}
            <div className="relative rounded-3xl border border-white/10 bg-navy-900/90 p-7 sm:p-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={territory.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: EASE_OUT }}
                  className="relative z-10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-teal-bright">
                      Territory {territory.num} · {territory.axis}
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800/80 border border-white/10 text-teal-bright">
                      <PillarSvgIcon index={territoryIdx} active className="h-5 w-5" />
                    </span>
                  </div>

                  <h2 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
                    {territory.name}
                  </h2>

                  <p className="mt-3 font-body text-sm leading-relaxed text-frost/88 sm:text-[0.95rem]">
                    {territory.summary}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                    {territory.verifiedItems.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 font-body text-xs text-ice/90">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Magnetic className="w-full sm:w-auto">
                      <Link
                        to={territory.primary.to}
                        data-testid="pulse-territory-cta"
                        className="group inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-colors hover:bg-teal-bright sm:w-auto"
                      >
                        <span>{territory.primary.label}</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </Magnetic>
                    <Link
                      to={territory.secondary.to}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 font-heading text-xs font-semibold text-frost transition-colors hover:border-teal/60 hover:text-teal-bright"
                    >
                      <span>{territory.secondary.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Spatial Exhibition Dock — Switch 3D Glass Territories */}
        <div className="becci-container relative z-10 pb-7 sm:pb-9">
          <div
            role="tablist"
            aria-label="BECCI Enterprise Universe Territories"
            onKeyDown={handleTerritoryKey}
            className="glass-dark grid grid-cols-2 gap-1.5 rounded-2xl p-2 sm:grid-cols-3 lg:grid-cols-5"
          >
            {TERRITORIES.map((t, i) => {
              const active = territoryIdx === i;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  tabIndex={active ? 0 : -1}
                  aria-selected={active}
                  onClick={() => setTerritoryIdx(i)}
                  data-testid={`pulse-territory-${i}`}
                  className={`relative flex min-h-[52px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                    i === TERRITORIES.length - 1 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={reduce ? undefined : "pulse-territory-dock"}
                      transition={{ type: "spring", stiffness: 360, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-teal/20 ring-1 ring-teal/55"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`tabular relative z-10 font-display text-xl leading-none ${
                      active ? "text-teal-bright" : "text-ice/55"
                    }`}
                  >
                    {t.num}
                  </span>
                  <span className="relative z-10 min-w-0">
                    <span className={`block truncate font-heading text-xs font-bold ${active ? "text-white" : "text-ice/80"}`}>
                      {PILLARS[i].title}
                    </span>
                    <span className="hidden truncate font-body text-[0.66rem] text-ice/60 xl:block">
                      {t.axis}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          REALM 02 — THE OPPORTUNITY WALL (Curated Verified Discovery)
         ===================================================================== */}
      <section id="opportunity-wall" className="section bg-frost" data-testid="pulse-opportunity-wall">
        <div className="becci-container">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Realm 02 · The Opportunity Wall"
              title="Every verified BECCI resource, in one exhibition."
              intro="Browse official Central Government schemes, active Phase 01 initiatives, statutory portals and chamber announcements. Categories without confirmed releases show honest empty states."
            />

            {/* Zero-tracking client-side instant filter */}
            <div className="relative w-full lg:w-80">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-deep"
                aria-hidden="true"
              />
              <label htmlFor="pulse-wall-search" className="sr-only">
                Search verified BECCI resources
              </label>
              <input
                id="pulse-wall-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="wall-search-input"
                placeholder="Search schemes, portals, news…"
                className="min-h-[44px] w-full rounded-full border border-navy-800/15 bg-white/90 pl-11 pr-10 font-body text-sm text-navy-950 placeholder:text-navy-800/45 focus:border-teal-deep focus:bg-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-navy-800/60 hover:bg-frost hover:text-navy-950"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* WAI-ARIA Category Filter Rail */}
          <div
            role="tablist"
            aria-label="Filter Opportunity Wall by category"
            onKeyDown={handleWallKey}
            className="mt-10 flex flex-wrap gap-2 rounded-2xl border border-ice/75 bg-white/85 p-2"
          >
            {WALL_CATEGORIES.map((c) => {
              const active = wallCat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  tabIndex={active ? 0 : -1}
                  aria-selected={active}
                  onClick={() => setWallCat(c.id)}
                  data-testid={`wall-tab-${c.id}`}
                  className={`relative inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 font-heading text-xs font-semibold transition-colors ${
                    active ? "text-white" : "text-navy-800/80 hover:text-navy-950"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={reduce ? undefined : "wall-cat-pill"}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-navy-950"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{c.label}</span>
                  <span
                    className={`tabular relative z-10 rounded-full px-2 py-0.5 text-[0.65rem] ${
                      active ? "bg-teal/25 text-teal-bright" : "bg-frost text-navy-700"
                    }`}
                  >
                    {counts[c.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Honest Empty States for Events / Publications OR No Search Match */}
          {wallCat === "events" ? (
            <div
              data-testid="wall-empty-events"
              className="glass-light mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-12 lg:flex-row lg:items-center"
            >
              <div className="max-w-2xl">
                <StatusChip label="Planned" />
                <h3 className="mt-4 font-heading text-2xl font-bold text-navy-950">
                  No confirmed public events published yet.
                </h3>
                <p className="mt-3 font-body text-base leading-relaxed text-navy-800/80">
                  BECCI is currently in Phase 01 — coordinating district outreach and state membership desks.
                  Confirmed dates, venues and registration instructions will appear here once formally finalised.
                  No sample or placeholder events are fabricated.
                </p>
              </div>
              <Link
                to="/contact?topic=entrepreneur"
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-navy-950 px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
              >
                <span>Register outreach interest</span>
                <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
              </Link>
            </div>
          ) : wallCat === "publications" ? (
            <div
              data-testid="wall-empty-publications"
              className="glass-light mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-12 lg:flex-row lg:items-center"
            >
              <div className="max-w-2xl">
                <StatusChip label="Coming soon" />
                <h3 className="mt-4 font-heading text-2xl font-bold text-navy-950">
                  BECCI guides &amp; briefings are in preparation.
                </h3>
                <p className="mt-3 font-body text-base leading-relaxed text-navy-800/80">
                  Original BECCI formalisation guides, sector briefs and governance publications will be released
                  here once cleared by the chamber. Meanwhile, you can access {KNOWLEDGE_PORTALS.length} official government portals directly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWallCat("resources")}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-navy-950 px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
              >
                <span>View {KNOWLEDGE_PORTALS.length} Official Portals</span>
                <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
              </button>
            </div>
          ) : filteredWall.length === 0 ? (
            <div className="glass-light mt-8 rounded-3xl p-10 text-center">
              <p className="font-heading text-lg font-bold text-navy-950">No verified items match “{query}”.</p>
              <p className="mt-2 font-body text-sm text-navy-800/75">
                Try searching for a scheme name (e.g. MUDRA, CGTMSE, Vishwakarma), portal (Udyam, GST, GeM), or reset the filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setWallCat("all");
                }}
                className="mt-5 inline-flex min-h-[40px] items-center rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-teal-deep"
              >
                Reset Opportunity Wall
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredWall.map((item) => {
                const isAnnouncement = item.category === "announcements";
                const isInitiative = item.category === "initiatives";
                return (
                  <GlassSpotlight
                    key={item.id}
                    tone={isAnnouncement ? "dark" : "light"}
                    as="article"
                    className={`flex h-full flex-col justify-between rounded-2xl p-6 transition-[transform,border-color,box-shadow] duration-200 ${
                      isAnnouncement
                        ? "on-dark glass-iridescent bg-navy-950 text-white"
                        : "glass-light hover-lift hover:border-teal/40"
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                            isAnnouncement ? "text-teal-bright" : "text-teal-deep"
                          }`}
                        >
                          {item.badge}
                        </span>
                        {isInitiative && <StatusChip label="Active" />}
                      </div>

                      <h3
                        className={`mt-3 font-heading text-lg font-bold leading-snug ${
                          isAnnouncement ? "text-white" : "text-navy-950"
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`mt-2.5 font-body text-sm leading-relaxed ${
                          isAnnouncement ? "text-ice/88" : "text-navy-800/78"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>

                    <div
                      className={`relative z-10 mt-6 flex items-center justify-between gap-3 border-t pt-4 ${
                        isAnnouncement ? "border-ice/15" : "border-navy-800/10"
                      }`}
                    >
                      <span
                        className={`truncate font-body text-xs ${
                          isAnnouncement ? "text-ice/70" : "text-navy-800/60"
                        }`}
                      >
                        {item.meta}
                      </span>

                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full bg-frost px-3.5 py-1.5 font-heading text-xs font-semibold text-teal-ink transition-colors hover:bg-navy-950 hover:text-teal-bright"
                        >
                          <span>Official site</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : item.shareable ? (
                        <button
                          type="button"
                          onClick={() => shareDispatch(item.shareable)}
                          className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border border-ice/25 px-3.5 py-1.5 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal hover:text-teal-bright"
                        >
                          {sharedId === item.shareable.id ? (
                            <>
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Share</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <Link
                          to={item.to}
                          className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full bg-navy-950 px-3.5 py-1.5 font-heading text-xs font-semibold text-white transition-colors hover:bg-teal-deep"
                        >
                          <span>Explore</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </GlassSpotlight>
                );
              })}
            </div>
          )}

          {/* Non-affiliation guarantee strip */}
          <div className="mt-8 flex items-start gap-3.5 rounded-2xl border border-ice/70 bg-white/85 p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
            <p className="font-body text-xs leading-relaxed text-navy-800/80 sm:text-sm">{SCHEME_NOTE}</p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          REALM 03 — THE DIGITAL OBSERVATORY (Verified Institutional Record)
         ===================================================================== */}
      <section
        id="digital-observatory"
        className="on-dark section relative overflow-hidden bg-navy-950 text-white"
        data-testid="pulse-observatory"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 50% at 82% 16%, rgba(0,184,169,0.14), transparent 62%), radial-gradient(ellipse 48% 45% at 15% 86%, rgba(121,91,255,0.12), transparent 62%)",
          }}
        />

        <div className="becci-container relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <Eyebrow tone="tealDark">Realm 03 · The Digital Observatory</Eyebrow>
              <h2 className="mt-4 font-heading text-h1 font-bold text-white">
                An honest institutional record — zero invented metrics.
              </h2>
            </div>
            <p className="font-body text-lead text-ice/82">
              BECCI measures credibility through transparency. Every milestone, legal standing record and roadmap stage
              below reflects verifiable fact rather than speculative numbers.
            </p>
          </div>

          {/* Cinematic Institutional Chronology + Verifiable Corporate Standing */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* Left: Illuminated Chronology Rail */}
            <ol className="relative space-y-6 border-l-2 border-ice/15 pl-7 sm:pl-9">
              {OBSERVATORY_TIMELINE.map((step, i) => (
                <li key={step.title} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[35px] top-6 h-3.5 w-3.5 rounded-full ring-4 ring-navy-950 sm:-left-[43px] ${
                      i < 2 ? "bg-teal shadow-[0_0_12px_rgba(0,184,169,0.75)]" : "bg-ice/40"
                    }`}
                  />
                  <GlassSpotlight tone="dark" className="glass-dark rounded-2xl p-6 sm:p-7">
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-bright">
                        {step.period}
                      </span>
                      <StatusChip label={step.status} tone="dark" />
                    </div>
                    <h3 className="relative z-10 mt-3 font-heading text-lg font-bold text-white sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="relative z-10 mt-2 font-body text-sm leading-relaxed text-ice/85">
                      {step.detail}
                    </p>
                  </GlassSpotlight>
                </li>
              ))}
            </ol>

            {/* Right: Verifiable Corporate Standing Capsule + Spatial Reach */}
            <div className="space-y-6">
              <GlassSpotlight tone="dark" className="glass-iridescent rounded-3xl p-7 sm:p-8">
                <div className="relative z-10 flex items-center gap-4 border-b border-ice/15 pb-6">
                  <InstitutionalSeal className="h-14 w-14 shrink-0" />
                  <div>
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                      Verified Section 8 Standing
                    </p>
                    <p className="mt-1 font-heading text-base font-bold text-white">
                      Ministry of Corporate Affairs
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-ice/15">
                    <div>
                      <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ice/65">
                        Corporate Identity Number
                      </p>
                      <p className="tabular mt-0.5 font-heading text-sm font-bold text-white">{CONTACT.cin}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyCin}
                      data-testid="observatory-copy-cin"
                      aria-label="Copy Corporate Identity Number"
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-teal/20 px-3.5 py-1.5 font-heading text-xs font-semibold text-teal-bright transition-colors hover:bg-teal hover:text-navy-950"
                    >
                      {copiedCin ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                      <span>{copiedCin ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-ice/10">
                      <p className="tabular font-display text-3xl leading-none text-teal-bright">11</p>
                      <p className="mt-1.5 font-body text-xs text-ice/80">Productive sectors represented</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.03] p-4 ring-1 ring-ice/10">
                      <p className="tabular font-display text-3xl leading-none text-teal-bright">
                        {SCHEME_DATASET_STATS.totalShown}
                      </p>
                      <p className="mt-1.5 font-body text-xs text-ice/80">Verified Government schemes indexed</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <a
                      href="https://www.mca.gov.in/"
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline inline-flex min-h-[38px] items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-teal-bright"
                    >
                      <span>Verify on mca.gov.in</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <Link
                      to="/about#governance"
                      className="link-underline inline-flex min-h-[38px] items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-ice/85 hover:text-white"
                    >
                      <span>Full Disclosure Ledger</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </GlassSpotlight>

              {/* Organisational Architecture & Dedicated Wings Snapshot */}
              <div className="glass-dark rounded-3xl p-7">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-bright">
                    Spatial Architecture · 4 Tiers
                  </p>
                  <Symbol variant="white" className="h-4 w-auto opacity-75" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {ORG_LEVELS.map((l, i) => (
                    <div key={l.level} className="rounded-xl bg-white/[0.04] px-3.5 py-3 ring-1 ring-ice/12">
                      <span className="tabular font-display text-lg leading-none text-teal-bright">0{i + 1}</span>
                      <p className="mt-1 font-heading text-sm font-bold text-white">{l.level}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2.5 border-t border-ice/15 pt-5">
                  {WINGS.map((w) => (
                    <div key={w.name} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/95">
                        <WingBadgeIcon name={w.name} className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-bold text-white">{w.name}</p>
                        <p className="truncate font-body text-xs text-ice/75">{w.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 11 Verified Sectors Ribbon + Transparency Statement */}
          <div className="mt-14 border-t border-ice/12 pt-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-ice/75">
                Eleven Industry Sectors Represented Across Bharat
              </p>
              <span className="font-body text-xs text-ice/60">
                Governance &amp; disclosure items pending confirmation: {GOVERNANCE_DISCLOSURES.length - 1} · Future roadmap items: {ROADMAP.length}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {SECTORS.map((s) => (
                <span
                  key={s.name}
                  className="glass-pill inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-heading text-xs font-semibold text-frost"
                >
                  <SectorSvgIcon name={s.icon} className="h-4 w-4 brightness-0 invert" />
                  <span>{s.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Continue your journey"
        title="Speak with the BECCI chamber office."
        desc="Prefer conventional browsing or direct conversation? Connect with our Begumpet, Hyderabad office."
        to="/contact"
        ctaLabel="Contact BECCI"
        testid="pulse-to-contact"
      />
    </>
  );
}
