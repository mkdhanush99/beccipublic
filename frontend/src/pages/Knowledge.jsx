import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import { Symbol } from "@/components/Logo";
import { NEWS, KNOWLEDGE_PORTALS } from "@/data/becci";

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

export default function Knowledge() {
  return (
    <>
      <PageHero
        eyebrow="News & Knowledge"
        meta="Official Updates · Eleven Public Portals"
        title="What’s happening, and where to go next."
        intro="Official updates from BECCI, and direct links to the government portals entrepreneurs use most."
      />

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading eyebrow="Latest" title="From BECCI." className="mb-12" />
          <div className="grid gap-6 lg:grid-cols-2">
            {NEWS.map((n, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <article
                  className={`relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 md:p-10 ${
                    i === 0
                      ? "bg-navy-950 text-white shadow-glass-dark"
                      : "glass-light text-navy-950"
                  }`}
                >
                  {i === 0 && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-navy-600/25 blur-3xl"
                    />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`eyebrow ${i === 0 ? "text-gold" : "text-navy-700"}`}>
                        {n.kind} · {n.year}
                      </span>
                      <Symbol variant={i === 0 ? "white" : "navy"} className="h-4 w-auto opacity-75" />
                    </div>
                    <h2
                      className={`mt-5 font-heading text-xl font-bold leading-snug md:text-2xl ${
                        i === 0 ? "text-white" : "text-navy-950"
                      }`}
                    >
                      {n.title}
                    </h2>
                    <p
                      className={`mt-4 font-body text-base leading-relaxed ${
                        i === 0 ? "text-navy-100/85" : "text-navy-800/80"
                      }`}
                    >
                      {n.body}
                    </p>
                  </div>
                  <div
                    className={`relative z-10 mt-8 border-t pt-4 font-body text-xs ${
                      i === 0 ? "border-white/10 text-navy-300" : "border-navy-800/10 text-navy-600/75"
                    }`}
                  >
                    Official BECCI announcement · {n.year}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Knowledge Centre"
            title="Official portals, in one place."
            intro="Registration, taxes, credit and skilling — go straight to the source."
            className="mb-12"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KNOWLEDGE_PORTALS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                data-testid={`portal-${slug(p.name)}`}
                className="glass-light hover-lift group flex items-center justify-between gap-3 rounded-2xl p-5"
              >
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold text-navy-950 transition-colors group-hover:text-navy-700">
                    {p.name}
                  </p>
                  <p className="mt-0.5 truncate font-body text-xs text-navy-800/60">{p.url.replace("https://", "")}</p>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-800/10 bg-navy-950/[0.04] text-navy-700 transition-colors group-hover:bg-navy-950 group-hover:text-gold">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </a>
            ))}
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-navy-950 p-5 text-white shadow-glass-dark">
              <div>
                <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-widest text-gold">
                  Publications
                </span>
                <p className="mt-1 font-heading text-sm font-semibold text-white">
                  BECCI guides &amp; briefings
                </p>
              </div>
              <StatusChip label="Coming soon" tone="dark" />
            </div>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Get in touch"
        title="Reach the BECCI chamber office."
        desc="Connect with our registered office in Begumpet, Hyderabad for institutional or membership enquiries."
        to="/contact"
        ctaLabel="Contact BECCI"
        testid="knowledge-to-contact"
      />
    </>
  );
}
