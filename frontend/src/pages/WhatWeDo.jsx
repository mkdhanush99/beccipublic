import React from "react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import PillarEcosystem from "@/components/infographics/PillarEcosystem";
import { WORK_AREAS, STAKEHOLDERS } from "@/data/becci";

export default function WhatWeDo() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        meta="Five Pillars · Six Areas of Work"
        title="Connecting entrepreneurs with knowledge, finance, markets, networks and institutional opportunities."
        intro="BECCI puts the entrepreneur at the centre and builds the connections around them."
      />

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="The five pillars"
            title="A support ecosystem around the entrepreneur."
            intro="Select any pillar below to explore how BECCI supports founders from knowledge to public schemes."
            className="mb-12"
          />
          <PillarEcosystem />
        </div>
      </section>

      <section className="section bg-navy-50/50">
        <div className="becci-container grid gap-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Areas of work" title="Six ways BECCI engages." className="mb-8" />
            <ul className="divide-y divide-navy-800/10 border-y border-navy-800/10">
              {WORK_AREAS.map((w, i) => (
                <li key={i} className="flex items-baseline gap-5 py-4">
                  <span className="tabular font-display text-xl text-gold-antique">0{i + 1}</span>
                  <span className="font-body text-base font-medium text-navy-950">{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading
              eyebrow="Ecosystem stakeholders"
              title="Who we seek to work alongside."
              intro="Shown as stakeholder categories — not existing or confirmed partners."
              className="mb-8"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {STAKEHOLDERS.map((s) => (
                <div key={s.name} className="glass-light rounded-2xl p-6">
                  <p className="font-heading text-base font-bold text-navy-950">{s.name}</p>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-navy-800/75">{s.desc}</p>
                </div>
              ))}
            </div>
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
