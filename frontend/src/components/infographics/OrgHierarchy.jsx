import React from "react";
import { ORG_LEVELS } from "@/data/becci";
import Reveal from "@/components/Reveal";

// Fluid 4-tier National -> State -> District -> City typographic scale (no boxy tree diagram).
export const OrgHierarchy = () => (
  <ol data-testid="org-hierarchy" className="divide-y divide-navy-800/10 border-y border-navy-800/10">
    {ORG_LEVELS.map((lvl, i) => (
      <Reveal key={i} delay={i * 0.06} as="li">
        <div className="flex items-baseline gap-6 py-5 sm:gap-8">
          <span className="tabular font-display text-3xl leading-none text-gold-antique">
            0{i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-bold text-navy-950">{lvl.level}</h3>
            <p className="mt-1 font-body text-sm leading-relaxed text-navy-800/75">{lvl.desc}</p>
          </div>
        </div>
      </Reveal>
    ))}
  </ol>
);

export default OrgHierarchy;
