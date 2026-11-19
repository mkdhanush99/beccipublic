import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import PillarEcosystem from "@/components/infographics/PillarEcosystem";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { WORK_AREAS, STAKEHOLDERS, PHASE_INITIATIVES, ROADMAP } from "@/data/becci";

const CHAPTER_JUMPS = [
  { id: "pillars", num: "01", label: "Five Pillars" },
  { id: "initiatives", num: "02", label: "Phase 01 Initiatives" },
  { id: "areas", num: "03", label: "Six Areas of Work" },
  { id: "stakeholders", num: "04", label: "Stakeholders" },
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
        meta="Five Pillars · Phase 01 Activities"
        title="Connecting entrepreneurs with knowledge, finance, markets, networks and institutional opportunities."
        intro="BECCI puts the entrepreneur at the centre — transparently distinguishing active Phase 01 initiatives from planned future services."
      >
        {CHAPTER_JUMPS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => jump(c.id)}
            className="glass-pill group inline-flex min-h-[38px] items-center gap-2.5 rounded-full px-4 py-2 font-heading text-xs font-semibold text-frost transition-colors hover:border-teal/60 hover:text-teal-bright"
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

      {/* Structured Active Phase 01 Initiatives vs. Clearly Separated Planned Services */}
      <section id="initiatives" className="section bg-frost" data-testid="phase-initiatives">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Chapter 02 · Programmes & initiatives"
            title="Active in Phase 01 — and what comes next."
            intro="Every active initiative below states its purpose, intended audience, scope and how to engage today. Future services are listed separately so nothing planned is presented as operational."
            className="mb-12"
          />

          <div className="space-y-6">
            {PHASE_INITIATIVES.map((init, idx) => (
              <Reveal key={init.id} delay={idx * 0.06}>
                <GlassSpotlight tone="light" className="glass-light rounded-3xl p-7 sm:p-9">
                  <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-navy-800/10 pb-6">
                    <div>
                      <span className="tabular font-display text-2xl leading-none text-teal-deep">0{idx + 1}</span>
                      <h3 className="mt-2 font-heading text-xl font-bold text-navy-950 sm:text-2xl">
                        {init.name}
                      </h3>
                    </div>
                    <StatusChip label={init.status} />
                  </div>

                  <dl className="relative z-10 mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <dt className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                        Purpose
                      </dt>
                      <dd className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">{init.purpose}</dd>
                    </div>
                    <div>
                      <dt className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                        Intended Audience
                      </dt>
                      <dd className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">{init.audience}</dd>
                    </div>
                    <div>
                      <dt className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                        Activities &amp; Scope
                      </dt>
                      <dd className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">{init.scope}</dd>
                    </div>
                    <div>
                      <dt className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                        How to Engage
                      </dt>
                      <dd className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">{init.engagement}</dd>
                    </div>
                  </dl>

                  <div className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-navy-800/10 pt-5">
                    <span className="font-body text-xs text-navy-800/60">
                      Registered office desk: +91 94943 03234 · becciglobal@gmail.com · Mon–Sat, 9:30 am – 6:30 pm IST
                    </span>
                    <Link
                      to={init.to}
                      className="group inline-flex min-h-[40px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                    >
                      <span>{init.cta}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </GlassSpotlight>
              </Reveal>
            ))}
          </div>

          {/* Transparent separation of future planned initiatives */}
          <div className="mt-12 rounded-3xl border border-ice/70 bg-white/80 p-7 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-navy-700">
                  Upcoming Roadmap · Not Yet Operational
                </p>
                <h3 className="mt-1.5 font-heading text-lg font-bold text-navy-950">
                  Planned future services
                </h3>
              </div>
              <p className="max-w-md font-body text-xs leading-relaxed text-navy-800/70">
                Listed transparently for roadmap visibility. None of these services are accepting applications or fees today.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {ROADMAP.map((r) => (
                <div
                  key={r.title}
                  className="inline-flex items-center gap-3 rounded-full border border-navy-800/10 bg-frost px-4 py-2.5"
                >
                  <span className="font-heading text-xs font-semibold text-navy-950">{r.title}</span>
                  <StatusChip label={r.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="areas" className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Chapter 03 · Areas of work"
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

      <section id="stakeholders" className="section bg-frost">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Chapter 04 · Ecosystem stakeholders"
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
