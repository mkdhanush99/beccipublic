import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import { NEWS, KNOWLEDGE_PORTALS } from "@/data/becci";

export default function Knowledge() {
  return (
    <>
      <PageHero
        eyebrow="News & Knowledge"
        title="What’s happening, and where to go next."
        intro="Official updates from BECCI, and direct links to the government portals entrepreneurs use most."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Latest" title="From BECCI." className="mb-12" />
          <div className="grid gap-6 lg:grid-cols-2">
            {NEWS.map((n, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <article
                  className={`flex h-full flex-col rounded-sm p-8 md:p-10 ${
                    i === 0 ? "bg-navy-950 text-white" : "border border-navy-800/10"
                  }`}
                >
                  <span className={`eyebrow ${i === 0 ? "text-gold" : "text-navy-700"}`}>
                    {n.kind} · {n.year}
                  </span>
                  <h2 className={`mt-5 font-heading text-xl font-bold leading-snug md:text-2xl ${i === 0 ? "text-white" : "text-navy-950"}`}>
                    {n.title}
                  </h2>
                  <p className={`mt-4 font-body text-base leading-relaxed ${i === 0 ? "text-navy-300" : "text-navy-800/75"}`}>
                    {n.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50/50 py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Knowledge Centre"
            title="Official portals, in one place."
            intro="Registration, taxes, credit and skilling — go straight to the source."
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-navy-800/10 sm:grid-cols-2 lg:grid-cols-3">
            {KNOWLEDGE_PORTALS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                data-testid={`portal-${p.name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
                className="group flex items-center justify-between gap-3 bg-white p-5 transition-colors hover:bg-navy-50"
              >
                <div>
                  <p className="font-heading text-sm font-semibold text-navy-950">{p.name}</p>
                  <p className="mt-0.5 font-body text-xs text-navy-800/50">{p.url.replace("https://", "")}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-700" />
              </a>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <StatusChip label="Coming soon" />
            <p className="font-body text-sm text-navy-800/65">BECCI’s own guides and reports are being prepared.</p>
          </div>
        </div>
      </section>
    </>
  );
}
