import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading, Eyebrow, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import Img from "@/components/Img";
import StatusChip from "@/components/StatusChip";
import { Symbol, InstitutionalSeal } from "@/components/Logo";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { CinemaAperture } from "@/components/visuals/CinemaStoryPrimitives";
import OrgHierarchy from "@/components/infographics/OrgHierarchy";
import {
  ORG,
  WHY_BAHUJAN,
  VISION_MISSION,
  STAKEHOLDERS,
  CONTACT,
  INSTITUTIONAL_BRIEF,
  INSTITUTIONAL_REGISTRY,
  GOVERNANCE_DISCLOSURES,
  HEADLINE_FACT_LINE,
  VERIFIED_STATS,
} from "@/data/becci";
import { EASE_OUT } from "@/lib/motion";

const APPROACH = [
  { title: "Information first", desc: "Clear, honest information about enterprise, finance and public programmes." },
  { title: "Access & connection", desc: "Linking entrepreneurs to knowledge, markets, mentorship and institutions." },
  { title: "Capacity building", desc: "Helping skills become formal, sustainable enterprises." },
  { title: "Relationships that last", desc: "Engagement that continues beyond a single transaction." },
];

export default function About() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copyCin = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.cin);
      setCopied(true);
      toast.success("Corporate Identity Number copied", { description: CONTACT.cin });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast(CONTACT.cin);
    }
  };

  return (
    <>
      {/* Distinctive Editorial Photographic Split Opening */}
      <section className="on-dark relative overflow-hidden bg-navy-950 pb-20 pt-28 text-white sm:pt-32 lg:pb-28">
        <LiquidAuroraCanvas variant="page" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/35 via-navy-950/20 to-navy-950"
          aria-hidden="true"
        />

        <div className="becci-container relative z-10 grid items-center gap-12 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="flex flex-wrap items-center gap-3"
            >
              <Eyebrow tone="tealDark">About BECCI</Eyebrow>
              <span className="glass-pill tabular rounded-full px-3.5 py-1 font-heading text-[0.68rem] font-medium text-ice">
                CIN {CONTACT.cin}
              </span>
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: EASE_OUT }}
              className="mt-6 font-heading text-h1 font-bold leading-[1.03] text-white"
            >
              An institution for entrepreneurship and enterprise development.
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14, ease: EASE_OUT }}
              className="mt-6 max-w-xl font-body text-lead text-ice/88"
            >
              {ORG.type}
            </motion.p>

            {/* Floating Glass Institutional Registry Bar inside the Opening */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: EASE_OUT }}
              className="mt-8"
            >
              <GlassSpotlight
                tone="dark"
                className="glass-iridescent flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center"
              >
                <InstitutionalSeal className="relative z-10 h-14 w-14 shrink-0" />
                <dl className="relative z-10 grid flex-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
                      Legal Structure
                    </dt>
                    <dd className="mt-1 font-heading text-sm font-semibold text-white">{CONTACT.incorporation}</dd>
                  </div>
                  <div>
                    <dt className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
                      Registered Office
                    </dt>
                    <dd className="mt-1 font-heading text-sm font-semibold text-white">Begumpet, Hyderabad</dd>
                  </div>
                </dl>
              </GlassSpotlight>
            </motion.div>
          </div>

          {/* Human Editorial Portrait directly inside the opening composition */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.12, ease: EASE_OUT }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 shadow-lift ring-1 ring-ice/18">
              <Img
                name="about"
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                alt="Business professionals in discussion in an institutional boardroom"
                className="h-[360px] w-full object-cover sm:h-[440px] lg:h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
              <div className="glass-dark absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl px-4 py-3 text-xs text-ice">
                <Symbol variant="white" className="h-4 w-auto shrink-0" />
                <span>Registered in Begumpet, Hyderabad · Serving enterprise across Bharat</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial Chamber Narrative + Institutional Identity Brief (6 Core Questions) */}
      <section className="section bg-white">
        <div className="becci-container">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
            <CinemaAperture>
              <div className="relative overflow-hidden rounded-3xl bg-navy-950 shadow-soft">
                <Img
                  name="craft"
                  sizes="(min-width: 1024px) 540px, 100vw"
                  alt="Artisan handloom weaving craft in India"
                  className="h-[340px] w-full object-cover lg:h-[420px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-transparent" />
                <p className="glass-dark absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3 font-body text-xs text-ice">
                  Transforming inherited capability and crafts into formal, bankable enterprise.
                </p>
              </div>
            </CinemaAperture>

            <div>
              <SectionHeading
                eyebrow="Who we are"
                title="A chamber built to bring entrepreneurs and institutions together."
              />
              <p className="mt-6 font-body text-lead text-navy-800/85">
                BECCI — the Bahujan Entrepreneurs Chamber for Commerce &amp; Industry — exists to bring entrepreneurs,
                aspiring founders, MSMEs, manufacturers, professionals and institutions into a stronger business
                ecosystem. It is a bridge between entrepreneurs and government, financial institutions, industry and academia.
              </p>
              <p className="mt-4 font-body text-base leading-relaxed text-navy-800/75">
                BECCI is not a charity, political organisation or government department. Its focus is economic
                participation, enterprise growth and nation building.
              </p>
            </div>
          </div>

          {/* Verified Economic Evidence — Sourced Public MSME Data */}
          <div className="mt-20 border-t border-navy-800/12 pt-16" data-testid="about-msme-evidence">
            <SectionHeading
              eyebrow="Sourced economic context"
              title="Why an organised chamber matters."
              intro={HEADLINE_FACT_LINE}
              className="mb-12"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VERIFIED_STATS.map((stat, idx) => (
                <Reveal key={stat.id} delay={(idx % 4) * 0.05}>
                  <GlassSpotlight tone="light" className="glass-light flex h-full min-w-0 flex-col justify-between rounded-2xl p-6">
                    <div className="relative z-10 min-w-0">
                      <p className="tabular font-display text-4xl leading-none text-teal-deep">
                        {stat.figure}
                      </p>
                      <p className="mt-3 font-heading text-sm font-bold text-navy-950">
                        {stat.label}
                      </p>
                      <p className="mt-2 font-body text-xs leading-relaxed text-navy-800/80">
                        {stat.detail}
                      </p>
                    </div>
                    <div className="relative z-10 mt-5 border-t border-navy-800/10 pt-3">
                      <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-navy-800/60">
                        {stat.year}
                      </p>
                      <a
                        href={stat.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline mt-1 inline-flex items-center gap-1 font-heading text-xs font-semibold text-teal-ink"
                      >
                        <span>{stat.sourceLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    </div>
                  </GlassSpotlight>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 6-Point Institutional Clarity Matrix */}
          <div className="mt-20 border-t border-navy-800/12 pt-16">
            <SectionHeading
              eyebrow="Institutional clarity"
              title="BECCI in plain terms."
              intro="Clear answers on BECCI’s mandate, legal standing and present-phase scope."
              className="mb-12"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {INSTITUTIONAL_BRIEF.map((item, idx) => (
                <Reveal key={item.question} delay={(idx % 3) * 0.05}>
                  <GlassSpotlight tone="light" className="glass-light flex h-full flex-col rounded-2xl p-7">
                    <span className="tabular relative z-10 font-display text-2xl leading-none text-teal-deep">
                      0{idx + 1}
                    </span>
                    <h3 className="relative z-10 mt-3 font-heading text-lg font-bold text-navy-950">
                      {item.question}
                    </h3>
                    <p className="relative z-10 mt-2.5 font-body text-sm leading-relaxed text-navy-800/80">
                      {item.answer}
                    </p>
                  </GlassSpotlight>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Bahujan — Iridescent Glass Heritage Lens */}
      <section className="on-dark section relative overflow-hidden bg-navy-900 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 88% 12%, rgba(0,184,169,0.16), transparent 60%), radial-gradient(ellipse 50% 45% at 10% 88%, rgba(184,215,250,0.12), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="becci-container relative z-10">
          <GlassSpotlight
            tone="dark"
            className="glass-iridescent grid gap-10 rounded-3xl p-8 sm:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16"
          >
            <div className="relative z-10">
              <Eyebrow tone="tealDark">Why Bahujan</Eyebrow>
              <h2 className="mt-4 font-heading text-h2 font-bold text-white">
                The welfare of the many.
              </h2>
              <div className="mt-7 flex flex-wrap gap-2">
                {WHY_BAHUJAN.occupations.map((o) => (
                  <span
                    key={o}
                    className="glass-pill rounded-full px-3.5 py-1.5 font-body text-xs text-frost"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative z-10">
              <p className="font-body text-lead text-frost/88">{WHY_BAHUJAN.intro}</p>
              <blockquote className="mt-8 border-l-2 border-gold pl-6 font-serif text-2xl italic leading-snug text-gold sm:text-3xl">
                “{WHY_BAHUJAN.quote.text}”
                <footer className="mt-4 font-body not-italic">
                  <p className="text-base text-white/90">{WHY_BAHUJAN.quote.translation}</p>
                  <p className="mt-2 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-ice/75">
                    {WHY_BAHUJAN.quote.attribution} · {WHY_BAHUJAN.quote.note}
                  </p>
                </footer>
              </blockquote>
            </div>
          </GlassSpotlight>
        </div>
      </section>

      {/* Spacious Monumental Vision & Mission Split */}
      <section className="grid md:grid-cols-2">
        <div className="on-dark relative overflow-hidden bg-navy-950 px-8 py-24 text-white sm:px-14 lg:px-20 lg:py-32">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #00B8A9 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-xl lg:ml-auto">
            <Eyebrow tone="tealDark">Vision</Eyebrow>
            <p className="mt-7 font-heading text-2xl font-semibold leading-snug text-white sm:text-3xl lg:text-[2.1rem]">
              {VISION_MISSION.vision.text}
            </p>
          </div>
        </div>
        <div className="bg-frost px-8 py-24 text-navy-950 sm:px-14 lg:px-20 lg:py-32">
          <div className="max-w-xl">
            <Eyebrow tone="teal">Mission</Eyebrow>
            <p className="mt-7 font-heading text-2xl font-semibold leading-snug text-navy-950 sm:text-3xl lg:text-[2.1rem]">
              {VISION_MISSION.mission.text}
            </p>
          </div>
        </div>
      </section>

      {/* Governance, Corporate Standing & Public Transparency Ledger */}
      <section id="governance" className="section bg-frost" data-testid="about-governance">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Governance & Transparency"
            title="Verified registration and honest public disclosures."
            intro="BECCI publishes only verified institutional facts. Leadership profiles, constitutional documents and formal partnerships will appear here as they are approved for release."
            className="mb-14"
          />

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            {/* Official Corporate Registry Ledger */}
            <GlassSpotlight tone="light" className="glass-light rounded-3xl p-7 sm:p-9">
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-navy-800/10 pb-6">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-mist text-teal-deep">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                      Public Corporate Record
                    </p>
                    <h3 className="font-heading text-lg font-bold text-navy-950">Section 8 Registration</h3>
                  </div>
                </div>
                <StatusChip label="Active" />
              </div>

              <dl className="relative z-10 divide-y divide-navy-800/10 pt-2">
                {INSTITUTIONAL_REGISTRY.map((row) => (
                  <div key={row.label} className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center sm:gap-6">
                    <dt className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/60">
                      {row.label}
                    </dt>
                    <dd className="flex items-center gap-2 font-body text-sm font-medium text-navy-950 sm:text-right">
                      {row.href ? (
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noreferrer"
                          className="link-underline inline-flex items-center gap-1 text-teal-ink"
                        >
                          <span>{row.value}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className={row.copyable ? "tabular font-heading font-bold" : ""}>{row.value}</span>
                      )}
                      {row.copyable && (
                        <button
                          type="button"
                          onClick={copyCin}
                          data-testid="copy-cin-btn"
                          aria-label="Copy Corporate Identity Number"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-800/12 bg-white text-teal-deep transition-colors hover:bg-teal-mist"
                        >
                          {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                        </button>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </GlassSpotlight>

            {/* Governance, Leadership & Document Publication Status */}
            <div className="space-y-4">
              {GOVERNANCE_DISCLOSURES.map((doc) => (
                <div key={doc.title} className="glass-light rounded-2xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-heading text-base font-bold text-navy-950">{doc.title}</h3>
                    <StatusChip label={doc.status} />
                  </div>
                  <p className="mt-2.5 font-body text-sm leading-relaxed text-navy-800/80">{doc.desc}</p>
                  {doc.href && (
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline mt-3 inline-flex min-h-[36px] items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-teal-deep"
                    >
                      <span>{doc.actionLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Organisational Governance Tiers */}
          <div className="mt-16 grid gap-12 border-t border-navy-800/10 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <Eyebrow tone="teal">Organisational architecture</Eyebrow>
              <h3 className="mt-3 font-heading text-2xl font-bold text-navy-950">
                Four-tier institutional reach.
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-800/75">
                Designed from the National apex body down to State, District and City chapters so governance stays accountable and accessible close to entrepreneurs.
              </p>
            </div>
            <OrgHierarchy />
          </div>
        </div>
      </section>

      {/* Approach & Collaborative Ecosystem */}
      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading eyebrow="Our approach" title="How BECCI works." className="mb-14" />
          <div className="grid gap-10 border-t border-navy-800/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <Reveal key={a.title} delay={(i % 4) * 0.06}>
                <div>
                  <span className="tabular font-display text-3xl text-teal-deep">0{i + 1}</span>
                  <h3 className="mt-3 font-heading text-lg font-bold text-navy-950">{a.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 border-t border-navy-800/12 pt-16">
            <SectionHeading
              eyebrow="Collaborative ecosystem"
              title="The institutions BECCI seeks to work alongside."
              intro="Shown as stakeholder categories — not existing or confirmed partners."
              className="mb-12"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STAKEHOLDERS.map((s) => (
                <GlassSpotlight key={s.name} tone="light" className="glass-light rounded-2xl p-6">
                  <p className="relative z-10 font-heading text-base font-bold text-navy-950">{s.name}</p>
                  <p className="relative z-10 mt-2 font-body text-sm leading-relaxed text-navy-800/75">{s.desc}</p>
                </GlassSpotlight>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Next chapter"
        title="See BECCI’s five pillars and Phase 01 initiatives."
        desc="Explore active Phase 01 activities, core areas of work and how BECCI engages entrepreneurs and institutions."
        to="/what-we-do"
        ctaLabel="See what BECCI does"
        testid="about-to-what"
      />
    </>
  );
}
