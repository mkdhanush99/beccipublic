import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading, Eyebrow, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import Img from "@/components/Img";
import { Symbol, InstitutionalSeal } from "@/components/Logo";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { CinemaAperture } from "@/components/visuals/CinemaStoryPrimitives";
import { ORG, WHY_BAHUJAN, VISION_MISSION, STAKEHOLDERS, CONTACT } from "@/data/becci";
import { EASE_OUT } from "@/lib/motion";

const APPROACH = [
  { title: "Information first", desc: "Clear, honest information about enterprise, finance and public programmes." },
  { title: "Access & connection", desc: "Linking entrepreneurs to knowledge, markets, mentorship and institutions." },
  { title: "Capacity building", desc: "Helping skills become formal, sustainable enterprises." },
  { title: "Relationships that last", desc: "Engagement that continues beyond a single transaction." },
];

export default function About() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Distinctive Editorial Photographic Split Opening (unique to About BECCI) */}
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

      {/* Editorial Chamber Narrative + Photographic Moment */}
      <section className="section bg-white">
        <div className="becci-container grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
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
        title="See the five pillars of BECCI’s work."
        desc="Explore how BECCI connects entrepreneurs with knowledge, finance, markets, networks and government schemes."
        to="/what-we-do"
        ctaLabel="See what BECCI does"
        testid="about-to-what"
      />
    </>
  );
}
