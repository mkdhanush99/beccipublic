import React from "react";
import * as Icons from "lucide-react";
import { PageHero, SectionHeading } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import OrgHierarchy from "@/components/infographics/OrgHierarchy";
import { WINGS, SECTORS } from "@/data/becci";

export default function WingsChapters() {
  return (
    <>
      <PageHero
        eyebrow="Wings & Chapters"
        title="How BECCI is organised across Bharat."
        intro="Dedicated wings, eleven sectors, and a structure that reaches from the nation to the city."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Dedicated wings" title="Focused representation." className="mb-12" />
          <div className="grid gap-5 md:grid-cols-2">
            {WINGS.map((w) => (
              <Reveal key={w.name}>
                <div className="rounded-sm border-l-2 border-gold bg-navy-50/40 p-8">
                  <h3 className="font-heading text-xl font-semibold text-navy-950">{w.name}</h3>
                  <p className="mt-3 font-body text-base leading-relaxed text-navy-800/75">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50/50 py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Industry sectors" title="Eleven sectors, one chamber." className="mb-12" />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-navy-800/10 sm:grid-cols-3 lg:grid-cols-4">
            {SECTORS.map((s) => {
              const Icon = Icons[s.icon] || Icons.Boxes;
              return (
                <div key={s.name} className="flex items-center gap-3 bg-white p-5">
                  <Icon className="h-5 w-5 shrink-0 text-navy-700" />
                  <span className="font-body text-sm font-medium text-navy-900/85">{s.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Organisational structure"
              title="National to city."
              intro="A single structure so entrepreneurs can connect close to home."
              className="mb-10"
            />
            <OrgHierarchy />
          </div>
          <div className="lg:pt-24">
            <h3 className="font-heading text-xl font-semibold text-navy-950">Chapters</h3>
            <div className="mt-6 flex items-start gap-3 rounded-sm border border-navy-800/10 bg-navy-50/40 p-6">
              <StatusChip label="Planned" />
              <p className="font-body text-sm leading-relaxed text-navy-800/75">
                Specific chapter locations, offices and leadership are not published here. Chapter information will be
                added as locations become operational. No active chapters, offices or leadership names have been invented.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
