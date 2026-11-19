import React from "react";
import { AlertCircle, ArrowUpRight, ShieldCheck } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import { SCHEMES, SCHEME_NOTE } from "@/data/becci";

export default function Schemes() {
  return (
    <>
      <PageHero
        eyebrow="Schemes"
        meta="Eight Central Government Programmes"
        title="Government schemes, with links to the official source."
        intro="A public information page. BECCI points you to relevant Central Government programmes — it does not run or process them."
      />

      <section className="bg-ivory/70 py-8">
        <div className="becci-container">
          <div className="glass-light flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-antique" aria-hidden="true" />
              <p className="font-body text-sm leading-relaxed text-navy-950">{SCHEME_NOTE}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-navy-50 px-3.5 py-1.5 font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800">
              <ShieldCheck className="h-3.5 w-3.5 text-navy-700" aria-hidden="true" />
              Official links only
            </span>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Central Government schemes"
            title="Eight programmes worth knowing."
            intro="Each card links directly to the official government portal where current eligibility rules and guidelines are published."
            className="mb-14"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {SCHEMES.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 0.05}>
                <a
                  href={s.source}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`scheme-${i}`}
                  className="hover-lift glass-light group flex h-full flex-col rounded-2xl p-7 transition-[transform,box-shadow] duration-200 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-700">
                        {s.ministry}
                      </p>
                      <h3 className="mt-1.5 font-heading text-lg font-bold text-navy-950 group-hover:text-navy-700">
                        {s.name}
                      </h3>
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-950 group-hover:text-gold">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-800/80">{s.desc}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-navy-800/10 pt-4">
                    <span className="font-body text-xs font-medium text-navy-700 break-all">
                      {s.source.replace("https://", "")}
                    </span>
                    <span className="font-body text-[0.68rem] uppercase tracking-wide text-navy-800/50">
                      Official portal
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-paper p-6">
            <p className="font-body text-sm leading-relaxed text-navy-800/80">
              No eligibility, amounts, deadlines or application status are shown here. Confirm every detail on the
              official source before acting.
            </p>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="More public portals"
        title="Visit the BECCI Knowledge Centre."
        desc="Direct links to Udyam Registration, GST, MCA, SIDBI, GeM, Startup India and other essential portals."
        to="/knowledge"
        ctaLabel="Explore Knowledge Centre"
        testid="schemes-to-knowledge"
      />
    </>
  );
}
