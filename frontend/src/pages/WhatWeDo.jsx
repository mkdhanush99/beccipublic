import React from "react";
import { ArrowDown } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import PillarEcosystem from "@/components/infographics/PillarEcosystem";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { WORK_AREAS, STAKEHOLDERS } from "@/data/becci";

const CHAPTER_JUMPS = [
  { id: "pillars", num: "01", label: "Five Pillars" },
  { id: "areas", num: "02", label: "Six Areas of Work" },
  { id: "stakeholders", num: "03", label: "Ecosystem Stakeholders" },
];

export default function WhatWeDo() {
  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHero
        eyebrow="What we do"
        meta="Five Pillars · Six Areas of Work"
        title="Connecting entrepreneurs with knowledge, finance, markets, networks and institutional opportunities."
        intro="BECCI puts the entrepreneur at the centre and builds the connections around them."
      >
        {CHAPTER_JUMPS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => jump(c.id)}
            className="glass-pill group inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-heading text-xs font-semibold text-frost transition-colors hover:border-teal/60 hover:text-teal-bright"
          >
            <span className="tabular text-teal-bright">{c.num}</span>
            <span>{c.label}</span>
            <ArrowDown className="h-3.5 w-3.5 text-ice/70 transition-transform group-hover:translate-y-0.5 group-hover:text-teal-bright" aria-hidden="true" />
          </button>
        ))}
      </PageHero>

      <section id="pillars" className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Chapter 01 · The five pillars"
            title="A support ecosystem around the entrepreneur."
            intro="Select any pillar below to explore how BECCI supports founders from knowledge to public schemes."
            className="mb-12"
          />
          <PillarEcosystem />
        </div>
      </section>

      <section id="areas" className="section bg-frost">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Chapter 02 · Areas of work"
            title="Six ways BECCI engages."
            intro="Practical areas where the chamber focuses its programmes, awareness and institutional outreach."
            className="mb-12"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WORK_AREAS.map((w, i) => (
              <Reveal key={i} delay={(i % 3) * 0.05}>
                <GlassSpotlight
                  tone="light"
                  className="glass-light hover-lift flex h-full flex-col justify-between rounded-2xl p-7"
                >
                  <span className="tabular relative z-10 font-display text-4xl leading-none text-teal-deep">
                    0{i + 1}
                  </span>
                  <p className="relative z-10 mt-6 font-heading text-lg font-bold leading-snug text-navy-950">
                    {w}
                  </p>
                </GlassSpotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="stakeholders" className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Chapter 03 · Ecosystem stakeholders"
            title="Who we seek to work alongside."
            intro="Shown as stakeholder categories — not existing or confirmed partners."
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STAKEHOLDERS.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.05}>
                <GlassSpotlight tone="light" className="glass-light flex h-full flex-col rounded-2xl p-7">
                  <span className="relative z-10 h-1.5 w-8 rounded-full bg-teal" aria-hidden="true" />
                  <p className="relative z-10 mt-5 font-heading text-lg font-bold text-navy-950">{s.name}</p>
                  <p className="relative z-10 mt-2 font-body text-sm leading-relaxed text-navy-800/75">{s.desc}</p>
                </GlassSpotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Next chapter"
        title="See who BECCI serves across Bharat."
        desc="Explore the six entrepreneur groups and eleven industry sectors represented by the chamber."
        to="/who-we-serve"
        ctaLabel="Who we serve"
        testid="whatwedo-to-who"
      />
    </>
  );
}
