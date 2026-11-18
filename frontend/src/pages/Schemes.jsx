import React from "react";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import { SCHEMES, SCHEME_NOTE } from "@/data/becci";

export default function Schemes() {
  return (
    <>
      <PageHero
        eyebrow="Schemes"
        title="Government schemes, with links to the official source."
        intro="A public information page. BECCI points you to relevant Central Government programmes — it does not run or process them."
      />

      {/* Safety note */}
      <section className="bg-ivory py-10">
        <div className="becci-container">
          <div className="flex items-start gap-4 rounded-sm border border-gold/40 bg-white p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-antique" />
            <p className="font-body text-sm leading-relaxed text-navy-900/85">{SCHEME_NOTE}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Central Government schemes" title="Eight programmes worth knowing." className="mb-14" />
          <div className="grid gap-5 md:grid-cols-2">
            {SCHEMES.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 0.06}>
                <a
                  href={s.source}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`scheme-${i}`}
                  className="group flex h-full flex-col rounded-sm border border-navy-800/10 p-7 transition-colors hover:border-navy-700/40 hover:bg-navy-50/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-lg font-semibold text-navy-950">{s.name}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-navy-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-700" />
                  </div>
                  <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-navy-700/70">{s.ministry}</p>
                  <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-800/75">{s.desc}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-navy-800/10 pt-4">
                    <span className="font-body text-xs text-navy-800/55 break-all">{s.source.replace("https://", "")}</span>
                    <span className="ml-3 shrink-0 font-body text-[0.68rem] uppercase tracking-wide text-navy-800/45">
                      Last verified: pending BECCI review
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-sm bg-navy-50 p-6">
            <p className="font-body text-sm leading-relaxed text-navy-800/75">
              No eligibility, amounts, deadlines or application status are shown here. Confirm every detail on the
              official source before acting.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
