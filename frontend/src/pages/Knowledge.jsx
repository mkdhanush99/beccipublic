import React from "react";
import { PageHero, SectionHeading } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import StatusChip from "@/components/StatusChip";
import { KNOWLEDGE_SAMPLES } from "@/data/becci";
import { toast } from "sonner";

export default function Knowledge() {
  const notify = () =>
    toast("Sample article", {
      description: "This is a labelled placeholder. Real articles will be published here once supplied.",
    });

  return (
    <>
      <PageHero
        eyebrow="News & Knowledge"
        title="Ideas and information for people building enterprises."
        intro="An editorial space for guides, explainers and perspectives. The items below are clearly labelled samples."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <StatusChip label="Coming soon" />
            <p className="font-body text-sm text-navy-800/60">
              No events, press coverage or achievements have been invented. Real content replaces these samples when supplied.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Feature */}
            <Reveal className="lg:col-span-2">
              <article className="group flex h-full flex-col justify-between rounded-sm border border-navy-800/10 bg-navy-950 p-8 text-white md:p-10">
                <div>
                  <span className="eyebrow text-gold">Sample · Perspective</span>
                  <h2 className="mt-5 font-heading text-2xl font-bold leading-tight md:text-3xl">
                    From skill to enterprise: how the journey begins
                  </h2>
                  <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-navy-300">
                    A placeholder feature article. This is where a flagship piece on enterprise and opportunity would sit.
                  </p>
                </div>
                <button
                  onClick={notify}
                  data-testid="knowledge-feature-btn"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-sm border border-white/25 px-5 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
                >
                  Sample article
                </button>
              </article>
            </Reveal>

            {/* list */}
            <div className="flex flex-col gap-4">
              {KNOWLEDGE_SAMPLES.map((k, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <button
                    onClick={notify}
                    data-testid={`knowledge-item-${i}`}
                    className="group block w-full rounded-sm border border-navy-800/10 p-6 text-left transition-colors hover:border-navy-700/40 hover:bg-navy-50/40"
                  >
                    <span className="eyebrow text-navy-700">Sample · {k.kind}</span>
                    <p className="mt-3 font-heading text-base font-semibold leading-snug text-navy-950">{k.title}</p>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
