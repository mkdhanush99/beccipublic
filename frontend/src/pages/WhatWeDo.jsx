import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import PillarEcosystem from "@/components/infographics/PillarEcosystem";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import {
  OBJECTIVES,
  WORK_AREAS,
  STAKEHOLDERS,
  PHASE_INITIATIVES,
  FUTURE_INITIATIVE_TRACKS,
  PLATFORM_PHASES,
  STATUS_LEGEND,
} from "@/data/becci";

const CHAPTER_JUMPS = [
  { id: "pillars", num: "01", label: "Five Pillars" },
  { id: "initiatives", num: "02", label: "Phase 01 & Roadmap" },
  { id: "areas", num: "03", label: "Objectives & Areas" },
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
                      Registered office secretariat: +91 94943 03234 · Mon–Sat, 9:30 am – 6:30 pm IST
                    </span>
                    <Link
                      to={init.to}
                      className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-deep"
                    >
                      <span>{init.cta}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </GlassSpotlight>
              </Reveal>
            ))}
          </div>

          {/* Five Planned & Coming-Soon Programme Tracks (Honestly Separated from Phase 01 Active Work) */}
          <div className="mt-14 space-y-6" data-testid="future-tracks">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                  Progressive Rollout · Not Yet Operational
                </p>
                <h3 className="mt-1.5 font-heading text-2xl font-bold text-navy-950">
                  Five upcoming programme tracks.
                </h3>
              </div>
              <p className="max-w-md font-body text-xs leading-relaxed text-navy-800/70">
                Listed transparently for roadmap clarity. None of these programmes are collecting applications or fees today.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FUTURE_INITIATIVE_TRACKS.map((track) => (
                <div
                  key={track.id}
                  id={track.id}
                  className="glass-light flex min-w-0 flex-col justify-between rounded-2xl p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-heading text-base font-bold text-navy-950">{track.title}</h4>
                      <StatusChip label={track.status} />
                    </div>
                    <p className="mt-3 font-body text-sm leading-relaxed text-navy-800/80">{track.desc}</p>
                  </div>
                  {track.disclaimer && (
                    <p className="mt-4 border-t border-navy-800/10 pt-3 font-body text-xs leading-relaxed text-navy-800/65">
                      {track.disclaimer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Four-Phase Platform Rollout & Honest Status Legend */}
          <div className="mt-14 rounded-3xl border border-ice/75 bg-white/90 p-7 sm:p-9" data-testid="platform-phases">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                  Digital Platform Roadmap
                </p>
                <h3 className="mt-1.5 font-heading text-2xl font-bold text-navy-950">
                  Built honestly in four phases.
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_LEGEND.map((s) => (
                  <StatusChip key={s.label} label={s.label} />
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PLATFORM_PHASES.map((ph) => (
                <div
                  key={ph.phase}
                  className={`flex min-w-0 flex-col rounded-2xl border p-5 ${
                    ph.tag ? "border-teal/45 bg-teal-mist/35" : "border-ice/80 bg-frost/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="tabular font-heading text-xs font-bold uppercase tracking-[0.16em] text-teal-deep">
                      {ph.phase}
                    </span>
                    {ph.tag && (
                      <span className="rounded-full bg-navy-950 px-2.5 py-0.5 font-heading text-[0.62rem] font-semibold uppercase tracking-wider text-gold">
                        {ph.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 font-heading text-sm font-bold text-navy-950">{ph.title}</h4>
                  <ul className="mt-4 space-y-3">
                    {ph.items.map((item) => (
                      <li key={item.title} className="space-y-1">
                        <p className="font-body text-xs leading-snug text-navy-900">{item.title}</p>
                        <StatusChip label={item.status} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <dl className="mt-8 grid gap-4 border-t border-navy-800/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {STATUS_LEGEND.map((s) => (
                <div key={s.label}>
                  <dt className="font-heading text-xs font-bold text-navy-950">{s.label}</dt>
                  <dd className="mt-1 font-body text-xs leading-relaxed text-navy-800/70">{s.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="areas" className="section bg-white">
        <div className="becci-container space-y-16">
          <div>
            <SectionHeading
              eyebrow="Chapter 03 · Institutional objectives"
              title="Six formal objectives."
              intro="The guiding objectives established in BECCI’s institutional charter."
              className="mb-10"
            />
            <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {OBJECTIVES.map((obj, i) => (
                <Reveal key={obj} delay={(i % 3) * 0.05} as="li">
                  <GlassSpotlight
                    tone="light"
                    className="glass-light flex h-full min-w-0 flex-col justify-between rounded-2xl p-7"
                  >
                    <span className="tabular relative z-10 font-display text-3xl leading-none text-teal-deep">
                      0{i + 1}
                    </span>
                    <p className="relative z-10 mt-5 font-heading text-base font-bold leading-snug text-navy-950">
                      {obj}
                    </p>
                  </GlassSpotlight>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="border-t border-navy-800/12 pt-14">
            <SectionHeading
              eyebrow="Core work areas"
              title="Nine areas, one purpose: enterprises that last."
              intro="Practical domains where the chamber organises programmes, awareness and institutional dialogue."
              className="mb-10"
            />
            <div className="flex flex-wrap gap-3">
              {WORK_AREAS.map((w, i) => (
                <div
                  key={w}
                  className="glass-light inline-flex items-center gap-3 rounded-full px-5 py-3"
                >
                  <span className="tabular font-display text-lg leading-none text-teal-deep">0{i + 1}</span>
                  <span className="font-heading text-sm font-semibold text-navy-950">{w}</span>
                </div>
              ))}
            </div>
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
