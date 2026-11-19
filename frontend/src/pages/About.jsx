import React from "react";
import { PageHero, SectionHeading, Eyebrow, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import Img from "@/components/Img";
import { Symbol, InstitutionalSeal } from "@/components/Logo";
import { ORG, WHY_BAHUJAN, VISION_MISSION, STAKEHOLDERS, CONTACT } from "@/data/becci";

const APPROACH = [
  { title: "Information first", desc: "Clear, honest information about enterprise, finance and public programmes." },
  { title: "Access & connection", desc: "Linking entrepreneurs to knowledge, markets, mentorship and institutions." },
  { title: "Capacity building", desc: "Helping skills become formal, sustainable enterprises." },
  { title: "Relationships that last", desc: "Engagement that continues beyond a single transaction." },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About BECCI"
        meta={`CIN ${CONTACT.cin}`}
        title="An institution for entrepreneurship and enterprise development."
        intro={ORG.type}
      />

      <section className="section bg-white">
        <div className="becci-container grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="A chamber built to bring entrepreneurs and institutions together."
            />
            <p className="mt-6 font-body text-lead text-navy-800/80">
              BECCI — the Bahujan Entrepreneurs Chamber for Commerce &amp; Industry — exists to bring entrepreneurs,
              aspiring founders, MSMEs, manufacturers, professionals and institutions into a stronger business
              ecosystem. It is a bridge between entrepreneurs and government, financial institutions, industry and academia.
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-navy-800/75">
              BECCI is not a charity, political organisation or government department. Its focus is economic
              participation, enterprise growth and nation building.
            </p>

            {/* Glass institutional registry capsule */}
            <div className="glass-light mt-8 flex flex-col gap-5 rounded-2xl p-5 sm:flex-row sm:items-center">
              <InstitutionalSeal className="h-16 w-16 shrink-0" />
              <dl className="grid flex-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-navy-700">
                    Legal Structure
                  </dt>
                  <dd className="mt-1 font-heading text-sm font-bold text-navy-950">{CONTACT.incorporation}</dd>
                </div>
                <div>
                  <dt className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-navy-700">
                    Corporate Identity Number
                  </dt>
                  <dd className="tabular mt-1 font-heading text-sm font-bold text-navy-950">{CONTACT.cin}</dd>
                </div>
              </dl>
            </div>
          </div>

          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-3xl bg-navy-950 shadow-lift">
              <Img
                name="about"
                sizes="(min-width: 1024px) 560px, 100vw"
                alt="Business professionals in discussion in an institutional boardroom"
                className="h-[380px] w-full object-cover lg:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />
              <div className="glass-dark absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl px-4 py-3 text-xs text-navy-100">
                <Symbol variant="white" className="h-4 w-auto shrink-0" />
                <span>Registered office in Begumpet, Hyderabad · Serving enterprise across Bharat</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="on-dark section relative overflow-hidden bg-[#041022] text-white">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #1769C2 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="becci-container relative z-10">
          <div className="glass-dark grid gap-10 rounded-3xl p-8 sm:p-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow tone="gold">Why Bahujan</Eyebrow>
              <h2 className="mt-4 font-heading text-h2 font-bold text-white">
                The welfare of the many.
              </h2>
              <div className="mt-7 flex flex-wrap gap-2">
                {WHY_BAHUJAN.occupations.map((o) => (
                  <span
                    key={o}
                    className="glass-pill rounded-full px-3.5 py-1.5 font-body text-xs text-white"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-lead text-navy-100/85">{WHY_BAHUJAN.intro}</p>
              <blockquote className="mt-8 border-l-2 border-gold pl-6 font-serif text-2xl italic leading-snug text-gold sm:text-3xl">
                “{WHY_BAHUJAN.quote.text}”
                <footer className="mt-4 font-body not-italic">
                  <p className="text-base text-white/90">{WHY_BAHUJAN.quote.translation}</p>
                  <p className="mt-2 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-navy-300">
                    {WHY_BAHUJAN.quote.attribution} · {WHY_BAHUJAN.quote.note}
                  </p>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed Vision & Mission split */}
      <section className="grid md:grid-cols-2">
        <div className="on-dark bg-navy-950 px-8 py-20 text-white sm:px-14 lg:px-20 lg:py-24">
          <div className="max-w-xl lg:ml-auto">
            <Eyebrow tone="gold">Vision</Eyebrow>
            <p className="mt-6 font-heading text-2xl font-semibold leading-snug text-white sm:text-3xl">
              {VISION_MISSION.vision.text}
            </p>
          </div>
        </div>
        <div className="bg-paper px-8 py-20 text-navy-950 sm:px-14 lg:px-20 lg:py-24">
          <div className="max-w-xl">
            <Eyebrow tone="antique">Mission</Eyebrow>
            <p className="mt-6 font-heading text-2xl font-semibold leading-snug text-navy-950 sm:text-3xl">
              {VISION_MISSION.mission.text}
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading eyebrow="Our approach" title="How BECCI works." className="mb-14" />
          <div className="grid gap-10 border-t border-navy-800/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <Reveal key={a.title} delay={(i % 4) * 0.06}>
                <div>
                  <span className="tabular font-display text-3xl text-gold-antique">0{i + 1}</span>
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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STAKEHOLDERS.map((s) => (
                <div key={s.name} className="glass-light rounded-2xl p-6">
                  <p className="font-heading text-base font-bold text-navy-950">{s.name}</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">{s.desc}</p>
                </div>
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
