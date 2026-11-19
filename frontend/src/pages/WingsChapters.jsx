import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import OrgHierarchy from "@/components/infographics/OrgHierarchy";
import { SectorSvgIcon, WingBadgeIcon } from "@/components/illustrations/BecciArtwork";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { WINGS, SECTORS, REGIONAL_CONTEXT } from "@/data/becci";

export default function WingsChapters() {
  return (
    <>
      <PageHero
        eyebrow="Wings & Chapters"
        meta="Four Levels · Two Wings · Eleven Sectors"
        title="How BECCI is organised across Bharat."
        intro="Dedicated wings, eleven sectors, and a structure that reaches from the nation to the city."
      />

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Dedicated wings"
            title="Focused representation."
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {WINGS.map((w, idx) => (
              <Reveal key={w.name} delay={idx * 0.08}>
                <div className="glass-light hover-lift flex h-full items-start gap-5 rounded-3xl p-8 md:p-9">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-soft">
                    <WingBadgeIcon name={w.name} className="h-9 w-9" />
                  </span>
                  <div>
                    <span className="eyebrow text-teal-deep">Dedicated Wing</span>
                    <h3 className="mt-1.5 font-heading text-xl font-bold text-navy-950">{w.name}</h3>
                    <p className="mt-2.5 font-body text-base leading-relaxed text-navy-800/80">{w.desc}</p>
                    <p className="mt-4 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/55">
                      Wing lead: To be announced by BECCI
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Industry sectors"
            title="Eleven sectors, one chamber."
            intro="Pan-India sector committees are planned as chapters open across Bharat."
            className="mb-12"
          />
          <div className="flex flex-wrap gap-3">
            {SECTORS.map((s) => (
              <div
                key={s.name}
                className="glass-light hover-lift inline-flex items-center gap-3 rounded-full px-5 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950/[0.05]">
                  <SectorSvgIcon name={s.icon} className="h-4 w-4" />
                </span>
                <span className="font-heading text-sm font-semibold text-navy-950">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="becci-container">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Organisational structure"
                title="National to city."
                intro="A single structure so entrepreneurs can connect close to home."
                className="mb-10"
              />
              <OrgHierarchy />
            </div>
            <div className="lg:pt-16">
              <div className="glass-light rounded-3xl p-8 sm:p-10">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-xl font-bold text-navy-950">Chapters</h3>
                  <StatusChip label="Planned" />
                </div>
                <p className="mt-4 font-body text-sm leading-relaxed text-navy-800/80">
                  Chapters will be listed here as they open. Registered office: Begumpet, Hyderabad (Telangana). No chapter locations, offices or office-holder names are published until formally confirmed.
                </p>
                <div className="mt-6 border-t border-navy-800/10 pt-4 font-body text-xs text-navy-800/65">
                  Phase 01 rollout begins with Telangana and Andhra Pradesh, focusing on district outreach and state membership desks, with other states following in phases.
                </div>
              </div>
            </div>
          </div>

          {/* Phase 01 Launch States — Sourced Regional Context (Telangana & Andhra Pradesh) */}
          <div className="mt-20 border-t border-navy-800/12 pt-16" data-testid="regional-context">
            <SectionHeading
              eyebrow="Phase 01 launch states"
              title="Telangana & Andhra Pradesh context."
              intro="Published state demographic and budget figures cited directly from official and news sources."
              className="mb-10"
            />
            <div className="grid gap-6 md:grid-cols-2">
              {REGIONAL_CONTEXT.map((region) => (
                <GlassSpotlight
                  key={region.state}
                  tone="light"
                  as="article"
                  className="glass-light flex h-full min-w-0 flex-col justify-between rounded-3xl p-7 sm:p-9"
                >
                  <div className="relative z-10 min-w-0">
                    <span className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                      {region.tag}
                    </span>
                    <h3 className="mt-2 font-heading text-2xl font-bold text-navy-950">{region.state}</h3>
                    <p className="mt-3 font-heading text-base font-semibold text-teal-ink">{region.headline}</p>
                    <p className="mt-2.5 font-body text-sm leading-relaxed text-navy-800/80">{region.detail}</p>
                  </div>

                  <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4 border-t border-navy-800/10 pt-4">
                    <span className="font-heading text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-navy-800/55">
                      Sources
                    </span>
                    {region.sources.map((src) => (
                      <a
                        key={src.url}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline inline-flex items-center gap-1 font-heading text-xs font-semibold text-teal-ink"
                      >
                        <span>{src.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </GlassSpotlight>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Stay informed"
        title="Read official updates from BECCI."
        desc="Follow announcements on Phase 01 district outreach and access essential government portals."
        to="/knowledge"
        ctaLabel="News & Knowledge"
        testid="wings-to-knowledge"
      />
    </>
  );
}
