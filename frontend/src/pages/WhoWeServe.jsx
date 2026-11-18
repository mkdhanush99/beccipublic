import React from "react";
import * as Icons from "lucide-react";
import { PageHero, SectionHeading, CTA } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import { AUDIENCES, SECTORS } from "@/data/becci";

export default function WhoWeServe() {
  return (
    <>
      <PageHero
        eyebrow="Who we serve"
        title="From a first idea to an established enterprise — there is a place for you here."
        intro="BECCI is built for the full range of people who make and grow businesses across Bharat."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="The people BECCI serves" title="Recognise your own journey." className="mb-14" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.08}>
                <article className="group h-full overflow-hidden rounded-sm border border-navy-800/10">
                  <div className="relative h-60 overflow-hidden">
                    <img src={a.img} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 to-transparent" />
                    <h3 className="absolute bottom-4 left-5 right-5 font-heading text-lg font-semibold text-white">{a.title}</h3>
                  </div>
                  <p className="p-5 font-body text-sm leading-relaxed text-navy-800/75">{a.line}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50/50 py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Eleven business sectors"
            title="The breadth of enterprise BECCI represents."
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-navy-800/10 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s, i) => {
              const Icon = Icons[s.icon] || Icons.Boxes;
              return (
                <Reveal key={s.name} delay={(i % 3) * 0.05}>
                  <div className="flex h-full items-center gap-4 bg-white p-6 transition-colors hover:bg-navy-50">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-heading text-base font-medium text-navy-950">{s.name}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-12">
            <CTA to="/membership" variant="ghost" testid="who-to-membership">How to become a member</CTA>
          </div>
        </div>
      </section>
    </>
  );
}
