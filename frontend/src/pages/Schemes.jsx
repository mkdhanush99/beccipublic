import React from "react";
import { AlertCircle, ExternalLink } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import { SCHEME_CATEGORIES, TBC } from "@/data/becci";

export default function Schemes() {
  return (
    <>
      <PageHero
        eyebrow="Schemes"
        title="Government scheme information, organised and honest."
        intro="A public information page. BECCI shares information about relevant public programmes — it does not run them."
      />

      {/* Disclaimer */}
      <section className="bg-ivory py-10">
        <div className="becci-container">
          <div className="flex items-start gap-4 rounded-sm border border-gold/40 bg-white p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-antique" />
            <p className="font-body text-sm leading-relaxed text-navy-900/85">
              <span className="font-semibold">BECCI is not a government agency.</span> It does not administer any scheme and
              does not guarantee approval of any application. Eligibility, benefits, deadlines and application status are
              decided by the relevant scheme authorities. Always confirm details on the official source.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Scheme categories" title="Organised by the need they address." className="mb-14" />
          <div className="grid gap-5 md:grid-cols-2">
            {SCHEME_CATEGORIES.map((c, i) => (
              <Reveal key={c.name} delay={(i % 2) * 0.08}>
                <div className="flex h-full flex-col rounded-sm border border-navy-800/10 p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-lg font-semibold text-navy-950">{c.name}</h3>
                    <StatusChip label={TBC} />
                  </div>
                  <p className="mt-3 font-body text-sm leading-relaxed text-navy-800/75">{c.desc}</p>
                  <div className="mt-6 flex items-center gap-2 border-t border-navy-800/10 pt-4">
                    <ExternalLink className="h-4 w-4 text-navy-400" />
                    <span className="font-body text-sm text-navy-800/55">
                      Official source link to be added: {c.source}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-sm bg-navy-50 p-6">
            <p className="font-body text-sm leading-relaxed text-navy-800/75">
              Specific schemes, eligibility and benefit details will be published here only when supported by official
              sources, with links to those sources. No eligibility, amounts, deadlines or application status have been
              fabricated for this page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
