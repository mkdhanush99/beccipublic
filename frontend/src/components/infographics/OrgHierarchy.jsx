import React from "react";
import { ORG_LEVELS } from "@/data/becci";
import Reveal from "@/components/Reveal";

// National -> State -> District -> City hierarchy.
export const OrgHierarchy = () => (
  <div data-testid="org-hierarchy" className="mx-auto max-w-2xl">
    {ORG_LEVELS.map((lvl, i) => (
      <Reveal key={i} delay={i * 0.08}>
        <div className="relative" style={{ paddingLeft: `${i * 1.75}rem` }}>
          {i > 0 && (
            <span
              className="absolute top-0 h-full border-l border-navy-800/15"
              style={{ left: `${i * 1.75 - 0.9}rem` }}
              aria-hidden="true"
            />
          )}
          <div className="relative mb-3 flex items-center gap-4 rounded-sm border border-navy-800/10 bg-white px-5 py-4">
            {i > 0 && (
              <span
                className="absolute -left-[0.95rem] top-1/2 w-[0.95rem] border-t border-navy-800/15"
                aria-hidden="true"
              />
            )}
            <span className="font-display text-2xl leading-none text-navy-300">0{i + 1}</span>
            <div>
              <h3 className="font-heading text-base font-semibold text-navy-950">{lvl.level}</h3>
              <p className="font-body text-sm text-navy-800/70">{lvl.desc}</p>
            </div>
          </div>
        </div>
      </Reveal>
    ))}
  </div>
);

export default OrgHierarchy;
