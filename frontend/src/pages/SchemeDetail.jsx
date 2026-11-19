import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Gift,
  HelpCircle,
  Info,
  Languages,
  Layers,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Eyebrow, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import SchemeRichText from "@/components/SchemeRichText";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SCHEME_NOTE, SCHEME_DATASET_STATS } from "@/data/becci";
import { useSchemeDetail, useSchemeLanguage, useSchemesIndex } from "@/lib/schemesStore";

function SectionCard({
  id,
  icon: Icon,
  eyebrow,
  title,
  badge,
  children,
  tone = "default",
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-3xl border p-6 sm:p-8 ${
        tone === "warn"
          ? "border-amber-500/30 bg-amber-50/45"
          : "border-navy-800/10 bg-white shadow-soft"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
              tone === "warn" ? "bg-amber-500/15 text-amber-800" : "bg-teal-mist text-teal-deep"
            }`}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
              {eyebrow}
            </p>
            <h2
              className={`mt-1 text-xl font-bold text-navy-950 sm:text-2xl ${
                /[\u0C00-\u0C7F]/.test(title) ? "font-telugu" : "font-heading"
              }`}
            >
              {title}
            </h2>
          </div>
        </div>
        {badge && (
          <span
            className={`rounded-full border border-navy-800/12 bg-frost px-3 py-1 text-[0.65rem] font-semibold text-navy-800/75 ${
              /[\u0C00-\u0C7F]/.test(badge) ? "font-telugu" : "font-heading"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="mt-5 min-w-0">{children}</div>
    </section>
  );
}

export default function SchemeDetail() {
  const { slug } = useParams();
  const { scheme, loading, error } = useSchemeDetail(slug);
  const { schemes: allIndex } = useSchemesIndex();
  const [lang, setLang] = useSchemeLanguage();
  const [faqQuery, setFaqQuery] = useState("");

  useEffect(() => {
    setFaqQuery("");
  }, [slug]);

  useEffect(() => {
    if (scheme?.name) {
      document.title = `${scheme.name} · BECCI Schemes`;
    }
  }, [scheme]);

  const relatedSchemes = useMemo(() => {
    if (!scheme || !allIndex.length) return [];
    const candidates = allIndex.filter(
      (item) => item.slug !== scheme.slug && item.showOnBecci
    );
    const scored = candidates.map((item) => {
      let score = 0;
      if (item.primaryCategory === scheme.primaryCategory) score += 4;
      if (item.state === scheme.state && scheme.state !== "All India") score += 3;
      if (item.obcRelevant && scheme.obcRelevant) score += 3;
      const overlap = (item.categories || []).filter((c) =>
        (scheme.categories || []).includes(c)
      ).length;
      score += overlap;
      if (item.featured) score += 1;
      return { item, score };
    });
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((x) => x.item);
  }, [scheme, allIndex]);

  const faqs = useMemo(() => scheme?.faqs || [], [scheme]);

  const filteredFaqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((item) => {
      const hay = `${item.q || ""} ${item.a || ""} ${item.qTe || ""} ${item.aTe || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [faqs, faqQuery]);

  if (loading) {
    return (
      <section className="on-dark relative min-h-[75vh] overflow-hidden bg-navy-950 pb-24 pt-28 text-white sm:pt-32">
        <LiquidAuroraCanvas variant="page" />
        <div className="becci-container relative z-10 pt-8">
          <div className="h-4 w-44 animate-pulse rounded-full bg-white/15" />
          <div className="mt-6 h-12 max-w-3xl animate-pulse rounded-2xl bg-white/10" />
          <div className="mt-4 h-6 max-w-2xl animate-pulse rounded-xl bg-white/10" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="h-72 animate-pulse rounded-3xl bg-white/10" />
            <div className="h-72 animate-pulse rounded-3xl bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !scheme) {
    return (
      <section className="on-dark relative min-h-[72vh] overflow-hidden bg-navy-950 pb-24 pt-32 text-white">
        <LiquidAuroraCanvas variant="page" />
        <div className="becci-container relative z-10 max-w-2xl pt-10">
          <Eyebrow tone="tealDark">Government Scheme Centre</Eyebrow>
          <h1 className="mt-4 font-heading text-h1 font-bold text-white">
            {error ? "Unable to load this scheme right now." : "Scheme record not found."}
          </h1>
          <p className="mt-4 font-body text-lead text-ice/85">
            {error ||
              "This scheme link may have moved or is not part of BECCI's verified Government of India myScheme dataset."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/schemes"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-teal px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 transition-colors hover:bg-teal-bright"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Browse All {SCHEME_DATASET_STATS.totalShown} Schemes</span>
            </Link>
            <Link
              to="/navigator"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-ice/25 px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-teal"
            >
              <span>Open Opportunity Navigator</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const te = scheme.te || {};
  const isTelugu = lang === "te" && Boolean(scheme.hasTelugu);

  const heroTitle = isTelugu && te.name ? te.name : scheme.name;
  const heroBrief = isTelugu && te.brief ? te.brief : scheme.briefFull;

  const benefitsText = isTelugu && te.benefits ? te.benefits : scheme.benefits;
  const benefitsIsTe = Boolean(isTelugu && te.benefits);

  const eligibilityText = isTelugu && te.eligibility ? te.eligibility : scheme.eligibility;
  const eligibilityIsTe = Boolean(isTelugu && te.eligibility);

  const exclusionsText = isTelugu && te.exclusions ? te.exclusions : scheme.exclusions;
  const exclusionsIsTe = Boolean(isTelugu && te.exclusions);

  const howToApplyText = isTelugu && te.howToApply ? te.howToApply : scheme.howToApply;
  const howToApplyIsTe = Boolean(isTelugu && te.howToApply);

  const docsText = isTelugu && te.documentsRequired ? te.documentsRequired : scheme.documentsRequired;
  const docsIsTe = Boolean(isTelugu && te.documentsRequired);

  const jumpLinks = [
    { id: "overview", label: isTelugu ? "అవలోకనం · Overview" : "Overview", show: Boolean(scheme.details || scheme.briefFull) },
    { id: "benefits", label: isTelugu ? "ప్రయోజనాలు · Benefits" : "Benefits", show: true },
    { id: "eligibility", label: isTelugu ? "అర్హత · Eligibility" : "Eligibility", show: Boolean(eligibilityText) },
    { id: "exclusions", label: isTelugu ? "మినహాయింపులు · Exclusions" : "Exclusions", show: Boolean(exclusionsText) },
    { id: "how-to-apply", label: isTelugu ? "దరఖాస్తు విధానం · Apply" : "How to Apply", show: true },
    { id: "documents", label: isTelugu ? "పత్రాలు · Documents" : "Documents", show: Boolean(docsText) },
    { id: "faqs", label: `FAQs (${faqs.length})`, show: faqs.length > 0 },
  ].filter((x) => x.show);

  return (
    <>
      {/* =====================================================================
          HERO OPENING — VERIFIED SCHEME IDENTITY, LANGUAGE TOGGLE & PORTAL LINKS
         ===================================================================== */}
      <section
        className="on-dark relative overflow-hidden bg-navy-950 pb-16 pt-28 text-white sm:pt-32 lg:pb-20"
        data-testid="scheme-detail-hero"
      >
        <LiquidAuroraCanvas variant="page" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/40 to-navy-950"
        />

        <div className="becci-container relative z-10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/schemes"
              data-testid="scheme-detail-back"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-ice/20 bg-white/[0.04] px-4 py-1.5 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
              <span>All {SCHEME_DATASET_STATS.totalShown} Verified Schemes</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Bilingual English / Telugu Toggle */}
              {scheme.hasTelugu && (
                <div
                  role="group"
                  aria-label="Scheme reading language"
                  data-testid="scheme-detail-lang-toggle"
                  className="inline-flex items-center rounded-full border border-ice/25 bg-white/[0.06] p-1"
                >
                  <button
                    type="button"
                    aria-pressed={lang === "en"}
                    onClick={() => setLang("en")}
                    data-testid="scheme-detail-lang-en"
                    className={`min-h-[32px] rounded-full px-3 py-1 font-heading text-xs font-semibold transition-colors ${
                      lang === "en"
                        ? "bg-teal text-navy-950"
                        : "text-ice/80 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    aria-pressed={lang === "te"}
                    onClick={() => setLang("te")}
                    data-testid="scheme-detail-lang-te"
                    className={`font-telugu inline-flex min-h-[32px] items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      lang === "te"
                        ? "bg-teal text-navy-950"
                        : "text-ice/80 hover:text-white"
                    }`}
                  >
                    <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>తెలుగు</span>
                  </button>
                </div>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/35 bg-teal/15 px-3.5 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-teal-bright">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Verified · {scheme.verifiedDate}</span>
              </span>
              {scheme.obcRelevant && (
                <span className="rounded-full border border-heritage-gold/45 bg-heritage-gold/15 px-3.5 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-heritage-gold">
                  OBC / Backward Classes Relevant
                </span>
              )}
              {scheme.status && <StatusChip label={scheme.status} />}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal-bright">
            <span>{scheme.level} Government</span>
            <span aria-hidden="true">·</span>
            <span>{scheme.state}</span>
            {scheme.benefitType && (
              <>
                <span aria-hidden="true">·</span>
                <span>{scheme.benefitType} Benefit</span>
              </>
            )}
            {scheme.primaryCategory && (
              <>
                <span aria-hidden="true">·</span>
                <span>{scheme.primaryCategory}</span>
              </>
            )}
          </div>

          <h1
            className={`mt-3 max-w-4xl text-h1 font-bold leading-tight text-white ${
              isTelugu && te.name ? "font-telugu" : "font-heading"
            }`}
          >
            {heroTitle}
          </h1>

          {isTelugu && te.name && (
            <p className="mt-2 font-heading text-base font-semibold text-teal-bright/90">
              {scheme.name}
            </p>
          )}

          {(scheme.ministry || scheme.agency) && (
            <p className="mt-3 max-w-3xl font-body text-sm text-ice/80">
              {scheme.ministry}
              {scheme.agency && scheme.agency !== scheme.ministry ? ` · ${scheme.agency}` : ""}
            </p>
          )}

          {heroBrief && (
            <p
              className={`mt-5 max-w-3xl text-lead text-ice/90 ${
                isTelugu && te.brief ? "font-telugu" : "font-body"
              }`}
            >
              {heroBrief}
            </p>
          )}

          {/* Primary Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              data-testid="scheme-detail-official-link"
              className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-teal px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 transition-colors hover:bg-teal-bright"
            >
              <span>Visit Official Scheme Portal</span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>

            {scheme.myschemeUrl && (
              <a
                href={scheme.myschemeUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                data-testid="scheme-detail-myscheme-link"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-ice/25 bg-white/[0.05] px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-teal hover:text-teal-bright"
              >
                <span>View on myScheme (GoI)</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>

          {/* Section Jump Pills */}
          <nav
            aria-label="Jump to scheme sections"
            className="mt-8 flex flex-wrap gap-2 border-t border-ice/15 pt-5"
          >
            {jumpLinks.map((lnk) => (
              <a
                key={lnk.id}
                href={`#${lnk.id}`}
                className={`inline-flex min-h-[36px] items-center rounded-full border border-ice/15 bg-white/[0.04] px-3.5 py-1 text-xs font-medium text-ice/85 transition-colors hover:border-teal hover:text-white ${
                  isTelugu ? "font-telugu" : "font-heading"
                }`}
              >
                {lnk.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* =====================================================================
          COMMUNITY-RESTRICTION NOTICE (ONLY IF showOnBecci === false)
         ===================================================================== */}
      {!scheme.showOnBecci && (
        <section className="border-b border-amber-500/25 bg-amber-50 py-5">
          <div className="becci-container">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <p className="font-body text-sm leading-relaxed text-amber-950">
                <strong className="font-heading font-semibold">
                  Community-restricted scheme ({scheme.restrictedTo || "Specific non-OBC category"}):
                </strong>{" "}
                This Government of India scheme is restricted to{" "}
                <strong>{scheme.restrictedTo || "a non-OBC category"}</strong> and is hidden from
                BECCI&apos;s default OBC/BC entrepreneur directory. Details are shown for transparency only.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          MAIN TWO-COLUMN VERIFIED CONTENT & METADATA SIDEBAR
         ===================================================================== */}
      <section className="section bg-frost">
        <div className="becci-container">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
            {/* LEFT EDITORIAL COLUMN */}
            <div className="min-w-0 space-y-6">
              {(scheme.details || scheme.briefFull) && (
                <SectionCard
                  id="overview"
                  icon={FileText}
                  eyebrow="Section 01 · Official Description"
                  title={isTelugu ? "పథకం అవలోకనం · Scheme Overview" : "Scheme Overview"}
                  badge={isTelugu ? "Original English description" : undefined}
                >
                  {isTelugu && te.brief && (
                    <div className="font-telugu mb-5 rounded-2xl border border-teal/20 bg-teal-mist/40 p-4 text-sm text-navy-950">
                      <p className="font-heading text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-teal-ink">
                        తెలుగు సారాంశం · Telugu Summary
                      </p>
                      <p className="mt-1.5">{te.brief}</p>
                    </div>
                  )}
                  <SchemeRichText text={scheme.details || scheme.briefFull} />
                </SectionCard>
              )}

              <SectionCard
                id="benefits"
                icon={Gift}
                eyebrow="Section 02 · Financial & Institutional Support"
                title={benefitsIsTe ? "ప్రయోజనాలు · Benefits & Assistance" : "Benefits & Assistance"}
                badge={benefitsIsTe ? "తెలుగు" : isTelugu ? "Original English text" : undefined}
              >
                {benefitsText ? (
                  <SchemeRichText
                    text={benefitsText}
                    className={benefitsIsTe ? "font-telugu" : ""}
                  />
                ) : (
                  <div className="flex items-start gap-3 rounded-2xl border border-ice/80 bg-frost/90 p-4">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                    <p className="font-body text-sm leading-relaxed text-navy-900/80">
                      A separate benefits breakdown is not published on myScheme for this programme.
                      Please refer to the <strong>Scheme Overview</strong> above and confirm active
                      financial terms directly on the official scheme portal linked on this page.
                    </p>
                  </div>
                )}
              </SectionCard>

              {eligibilityText && (
                <SectionCard
                  id="eligibility"
                  icon={CheckCircle2}
                  eyebrow="Section 03 · Qualifying Criteria"
                  title={isTelugu ? "అర్హత ప్రమాణాలు · Eligibility" : "Eligibility"}
                  badge={
                    eligibilityIsTe
                      ? "తెలుగు"
                      : isTelugu
                        ? "Original English text · తెలుగు translation pending"
                        : undefined
                  }
                >
                  <SchemeRichText
                    text={eligibilityText}
                    className={eligibilityIsTe ? "font-telugu" : ""}
                  />
                </SectionCard>
              )}

              {scheme.trades?.length > 0 && (
                <SectionCard
                  id="notified-trades"
                  icon={Layers}
                  eyebrow="Traditional Trades Coverage"
                  title="18 Notified Traditional Trades"
                >
                  <div className="flex flex-wrap gap-2">
                    {scheme.trades.map((trade) => (
                      <span
                        key={trade}
                        className="rounded-full border border-navy-800/12 bg-frost px-3.5 py-1.5 font-heading text-xs font-semibold text-navy-950"
                      >
                        {trade}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}

              {exclusionsText && (
                <SectionCard
                  id="exclusions"
                  icon={ShieldAlert}
                  eyebrow="Section 04 · Who Is Not Eligible"
                  title={exclusionsIsTe ? "మినహాయింపులు · Exclusions" : "Exclusions"}
                  badge={exclusionsIsTe ? "తెలుగు" : isTelugu ? "Original English text" : undefined}
                  tone="warn"
                >
                  <SchemeRichText
                    text={exclusionsText}
                    className={exclusionsIsTe ? "font-telugu" : ""}
                  />
                </SectionCard>
              )}

              <SectionCard
                id="how-to-apply"
                icon={ClipboardList}
                eyebrow="Section 05 · Official Application Process"
                title={howToApplyIsTe ? "దరఖాస్తు విధానం · How to Apply" : "How to Apply"}
                badge={howToApplyIsTe ? "తెలుగు" : isTelugu && howToApplyText ? "Original English text" : undefined}
              >
                {howToApplyText ? (
                  <SchemeRichText
                    text={howToApplyText}
                    className={howToApplyIsTe ? "font-telugu" : ""}
                  />
                ) : (
                  <div className="space-y-3 rounded-2xl border border-ice/80 bg-frost/90 p-5">
                    <p className="font-body text-sm leading-relaxed text-navy-900/85">
                      Step-by-step application instructions for this scheme are managed directly by
                      the implementing agency. Visit the official scheme portal or myScheme page
                      below to apply directly — never share portal passwords or OTPs with
                      third parties.
                    </p>
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="open"
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                    >
                      <span>Open Official Application Source</span>
                      <ExternalLink className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </SectionCard>

              {docsText && (
                <SectionCard
                  id="documents"
                  icon={FileText}
                  eyebrow="Section 06 · Required Paperwork"
                  title={docsIsTe ? "అవసరమైన పత్రాలు · Documents Required" : "Documents Required"}
                  badge={docsIsTe ? "తెలుగు" : isTelugu ? "Original English text" : undefined}
                >
                  <SchemeRichText
                    text={docsText}
                    className={docsIsTe ? "font-telugu" : ""}
                  />
                </SectionCard>
              )}

              {/* SECTION 07 — OFFICIAL MYSCHEME FAQs */}
              {faqs.length > 0 && (
                <SectionCard
                  id="faqs"
                  icon={HelpCircle}
                  eyebrow={`Section 07 · Official Frequently Asked Questions (${faqs.length})`}
                  title={
                    isTelugu
                      ? "తరచుగా అడిగే ప్రశ్నలు · Official FAQs"
                      : "Frequently Asked Questions"
                  }
                  badge={
                    isTelugu
                      ? "తెలుగు questions · Official English answers"
                      : `${faqs.length} verified Q&As`
                  }
                >
                  {faqs.length > 6 && (
                    <div className="relative mb-5">
                      <Search
                        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-deep"
                        aria-hidden="true"
                      />
                      <label htmlFor="scheme-faq-search" className="sr-only">
                        Search scheme FAQs
                      </label>
                      <input
                        id="scheme-faq-search"
                        type="text"
                        role="searchbox"
                        value={faqQuery}
                        onChange={(e) => setFaqQuery(e.target.value)}
                        data-testid="scheme-faq-search"
                        placeholder={
                          isTelugu
                            ? `${faqs.length} ప్రశ్నలలో శోధించండి (ఉదా. సబ్సిడీ, వయస్సు, రుణం)…`
                            : `Filter ${faqs.length} FAQs (e.g. subsidy, age, income, collateral)…`
                        }
                        className="min-h-[42px] w-full rounded-full border border-navy-800/15 bg-frost/75 pl-11 pr-10 font-body text-sm text-navy-950 placeholder:text-navy-800/45 focus:border-teal-deep focus:bg-white"
                      />
                      {faqQuery && (
                        <button
                          type="button"
                          onClick={() => setFaqQuery("")}
                          aria-label="Clear FAQ search"
                          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-navy-800/60 hover:bg-frost hover:text-navy-950"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}

                  {filteredFaqs.length === 0 ? (
                    <p className="rounded-2xl border border-ice/75 bg-frost/70 p-4 font-body text-sm text-navy-800/75">
                      No FAQs match &ldquo;{faqQuery}&rdquo;. Try another keyword or clear the filter.
                    </p>
                  ) : (
                    <Accordion
                      type="multiple"
                      defaultValue={["faq-0"]}
                      data-testid="scheme-faqs-accordion"
                      className="divide-y divide-navy-800/10 rounded-2xl border border-navy-800/10 bg-frost/45 px-4 sm:px-6"
                    >
                      {filteredFaqs.map((qa, idx) => {
                        const questionText = isTelugu && qa.qTe ? qa.qTe : qa.q;
                        const answerText = isTelugu && qa.aTe ? qa.aTe : qa.a;
                        const answerIsTe = Boolean(isTelugu && qa.aTe);
                        return (
                          <AccordionItem
                            key={`faq-${idx}`}
                            value={`faq-${idx}`}
                            className="border-none"
                          >
                            <AccordionTrigger
                              className={`py-4 text-left text-sm font-semibold text-navy-950 hover:text-teal-ink hover:no-underline sm:text-[0.95rem] ${
                                isTelugu && qa.qTe ? "font-telugu" : "font-heading"
                              }`}
                            >
                              <span className="pr-3">
                                <span className="mr-2 font-heading text-xs font-bold text-teal-deep">
                                  Q{idx + 1}.
                                </span>
                                {questionText}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 pt-0">
                              {isTelugu && qa.qTe && (
                                <p className="mb-2 font-heading text-xs font-medium text-navy-800/60">
                                  {qa.q}
                                </p>
                              )}
                              <SchemeRichText
                                text={answerText}
                                className={answerIsTe ? "font-telugu text-sm" : "text-sm"}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}
                </SectionCard>
              )}
            </div>

            {/* RIGHT STICKY METADATA & SOURCE ATTRIBUTION SIDEBAR */}
            <aside className="min-w-0 space-y-6 lg:sticky lg:top-28">
              {/* Quick Fact Sheet */}
              <GlassSpotlight tone="light" className="glass-light rounded-3xl p-6">
                <div className="relative z-10">
                  <p className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    Verified Fact Sheet
                  </p>
                  <dl className="mt-4 space-y-3.5 text-sm">
                    {scheme.short && (
                      <div className="flex items-start justify-between gap-3 border-b border-navy-800/10 pb-3">
                        <dt className="font-heading text-xs font-semibold text-navy-800/65">Short Title</dt>
                        <dd className="text-right font-heading text-xs font-bold text-navy-950">
                          {scheme.short}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3 border-b border-navy-800/10 pb-3">
                      <dt className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-navy-800/65">
                        <MapPin className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                        <span>Jurisdiction</span>
                      </dt>
                      <dd className="text-right font-heading text-xs font-bold text-navy-950">
                        {scheme.level} · {scheme.state}
                      </dd>
                    </div>
                    {scheme.ministry && (
                      <div className="border-b border-navy-800/10 pb-3">
                        <dt className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-navy-800/65">
                          <Building2 className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                          <span>Ministry / Department</span>
                        </dt>
                        <dd className="mt-1 font-body text-xs leading-relaxed text-navy-950">
                          {scheme.ministry}
                        </dd>
                      </div>
                    )}
                    {scheme.agency && (
                      <div className="border-b border-navy-800/10 pb-3">
                        <dt className="font-heading text-xs font-semibold text-navy-800/65">
                          Implementing Agency
                        </dt>
                        <dd className="mt-1 font-body text-xs leading-relaxed text-navy-950">
                          {scheme.agency}
                        </dd>
                      </div>
                    )}
                    {scheme.benefitType && (
                      <div className="flex items-start justify-between gap-3 border-b border-navy-800/10 pb-3">
                        <dt className="font-heading text-xs font-semibold text-navy-800/65">Benefit Type</dt>
                        <dd className="font-heading text-xs font-bold text-navy-950">
                          {scheme.benefitType}
                        </dd>
                      </div>
                    )}
                    {faqs.length > 0 && (
                      <div className="flex items-start justify-between gap-3 border-b border-navy-800/10 pb-3">
                        <dt className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-navy-800/65">
                          <HelpCircle className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                          <span>Official FAQs</span>
                        </dt>
                        <dd className="font-heading text-xs font-bold text-teal-ink">
                          <a href="#faqs" className="link-underline">
                            {faqs.length} Q&amp;As
                          </a>
                        </dd>
                      </div>
                    )}
                    {scheme.openDate && (
                      <div className="flex items-start justify-between gap-3 border-b border-navy-800/10 pb-3">
                        <dt className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-navy-800/65">
                          <Calendar className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                          <span>Launch / Open Date</span>
                        </dt>
                        <dd className="tabular font-heading text-xs font-bold text-navy-950">
                          {scheme.openDate}
                        </dd>
                      </div>
                    )}
                    {scheme.closeDate && (
                      <div className="flex items-start justify-between gap-3 border-b border-navy-800/10 pb-3">
                        <dt className="font-heading text-xs font-semibold text-navy-800/65">Close Date</dt>
                        <dd className="tabular font-heading text-xs font-bold text-amber-800">
                          {scheme.closeDate}
                        </dd>
                      </div>
                    )}
                    {scheme.targetBeneficiaries?.length > 0 && (
                      <div>
                        <dt className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-navy-800/65">
                          <Users className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                          <span>Target Beneficiaries</span>
                        </dt>
                        <dd className="mt-1.5 flex flex-wrap gap-1.5">
                          {scheme.targetBeneficiaries.map((tb) => (
                            <span
                              key={tb}
                              className="rounded-full bg-frost px-2.5 py-0.5 font-body text-[0.7rem] text-navy-900"
                            >
                              {tb}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {/* Categories */}
                  {scheme.categories?.length > 0 && (
                    <div className="mt-5 border-t border-navy-800/10 pt-4">
                      <p className="font-heading text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-navy-800/65">
                        BECCI Categories
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {scheme.categories.map((cat) => (
                          <Link
                            key={cat}
                            to={`/schemes?category=${encodeURIComponent(cat)}`}
                            className="rounded-full border border-navy-800/12 bg-white px-3 py-1 font-heading text-[0.68rem] font-semibold text-navy-900 transition-colors hover:border-teal-deep hover:text-teal-ink"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassSpotlight>

              {/* Official References */}
              {scheme.references?.length > 0 && (
                <div className="rounded-3xl border border-navy-800/10 bg-white p-6 shadow-soft">
                  <p className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    Official References &amp; Guidelines
                  </p>
                  <ul className="mt-3.5 space-y-2.5">
                    {scheme.references.map((ref, idx) => (
                      <li key={`${ref.url}-${idx}`}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="open"
                          className="group flex items-start justify-between gap-2 rounded-xl border border-navy-800/10 bg-frost/70 px-3.5 py-2.5 transition-colors hover:border-teal-deep hover:bg-teal-mist/40"
                        >
                          <span className="min-w-0 break-words font-heading text-xs font-semibold text-navy-950 group-hover:text-teal-ink">
                            {ref.label}
                          </span>
                          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mandatory Source Attribution & Non-Affiliation Box */}
              <div
                data-testid="scheme-source-attribution"
                className="rounded-3xl border border-teal/25 bg-navy-950 p-6 text-white"
              >
                <div className="flex items-center gap-2 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Verified Government Source</span>
                </div>
                <p className="mt-2.5 font-heading text-sm font-bold text-white">
                  {scheme.sourceCredit}
                </p>
                <p className="mt-1 font-body text-xs text-ice/75">
                  Verified on {scheme.verifiedDate}. Schemes are periodically revised by ministries.
                </p>
                {scheme.myschemeUrl && (
                  <a
                    href={scheme.myschemeUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="open"
                    className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-full bg-teal px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 transition-colors hover:bg-teal-bright"
                  >
                    <span>Open Source on myScheme.gov.in</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                <div className="mt-4 flex items-start gap-2 border-t border-ice/15 pt-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ice/70" aria-hidden="true" />
                  <p className="font-body text-[0.72rem] leading-relaxed text-ice/75">
                    {SCHEME_NOTE}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================================
          RELATED VERIFIED SCHEMES
         ===================================================================== */}
      {relatedSchemes.length > 0 && (
        <section className="section bg-white">
          <div className="becci-container">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <Eyebrow tone="teal">Continue Exploring</Eyebrow>
                <h2 className="mt-2 font-heading text-h2 font-bold text-navy-950">
                  Related verified schemes.
                </h2>
              </div>
              <Link
                to={`/schemes?category=${encodeURIComponent(scheme.primaryCategory)}`}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-navy-800/15 px-5 py-2 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
              >
                <span>Browse {scheme.primaryCategory}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedSchemes.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/schemes/${rel.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-navy-800/10 bg-frost/60 p-5 transition-all hover:-translate-y-0.5 hover:border-teal-deep hover:bg-white hover:shadow-soft"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-heading text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                        {rel.state}
                      </span>
                      {rel.obcRelevant && (
                        <span className="rounded-full bg-teal-mist px-2 py-0.5 font-heading text-[0.6rem] font-bold uppercase text-teal-ink">
                          OBC / BC
                        </span>
                      )}
                    </div>
                    <h3
                      className={`mt-2 text-base font-bold leading-snug text-navy-950 group-hover:text-teal-ink ${
                        isTelugu && rel.teName ? "font-telugu" : "font-heading"
                      }`}
                    >
                      {isTelugu && rel.teName ? rel.teName : rel.name}
                    </h3>
                    <p
                      className={`mt-2 line-clamp-3 text-xs text-navy-800/75 ${
                        isTelugu && rel.teBrief ? "font-telugu" : "font-body leading-relaxed"
                      }`}
                    >
                      {isTelugu && rel.teBrief ? rel.teBrief : rel.brief}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs font-semibold text-teal-ink">
                    <span>Read full details</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NextPageBand
        eyebrow="Need personalised orientation?"
        title="Try BECCI Opportunity Navigator."
        desc="Combine your business goal, industry sector and stage to surface matching verified schemes, practical guides and statutory portals."
        to="/navigator"
        ctaLabel="Open Opportunity Navigator"
        testid="scheme-detail-to-navigator"
      />
    </>
  );
}
