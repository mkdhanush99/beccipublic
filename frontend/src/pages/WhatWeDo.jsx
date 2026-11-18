import React from "react";
import { PageHero, SectionHeading, CTA } from "@/components/primitives";
import PillarEcosystem from "@/components/infographics/PillarEcosystem";
import { WORK_AREAS, STAKEHOLDERS, PILLARS } from "@/data/becci";

export default function WhatWeDo() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Connecting entrepreneurs with knowledge, finance, markets, networks and institutional opportunities."
        intro="BECCI puts the entrepreneur at the centre and builds the connections around them."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading align="center" eyebrow="The five pillars" title="A support ecosystem around the entrepreneur." className="mb-14" />
          <PillarEcosystem />
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm bg-navy-800/10 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-white p-6">
                <p className="font-heading text-base font-semibold text-navy-950">{p.title}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/70">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50/50 py-20 md:py-28">
        <div className="becci-container grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Areas of work" title="Six ways BECCI engages." className="mb-8" />
            <ul className="divide-y divide-navy-800/10 border-y border-navy-800/10">
              {WORK_AREAS.map((w, i) => (
                <li key={i} className="flex items-baseline gap-4 py-4">
                  <span className="font-display text-lg text-navy-300">0{i + 1}</span>
                  <span className="font-body text-base text-navy-900/85">{w}</span>
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
            <div className="grid gap-3 sm:grid-cols-2">
              {STAKEHOLDERS.map((s) => (
                <div key={s.name} className="rounded-sm border border-navy-800/10 bg-white p-5">
                  <p className="font-heading text-base font-semibold text-navy-950">{s.name}</p>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-navy-800/70">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="becci-container flex flex-wrap items-center justify-between gap-6">
          <p className="font-heading text-xl font-semibold text-navy-950">See who BECCI serves.</p>
          <CTA to="/who-we-serve" testid="whatwedo-to-who">Who we serve</CTA>
        </div>
      </section>
    </>
  );
}
