import React from "react";
import { MEMBERSHIP_STEPS } from "@/data/becci";
import Reveal from "@/components/Reveal";

// Clean horizontal 5-step editorial progression (no heavy boxed grid).
export const MembershipSteps = ({ tone = "light" }) => {
  const dark = tone === "dark";
  return (
    <ol
      data-testid="membership-steps"
      className="grid gap-8 border-t border-navy-800/15 pt-8 md:grid-cols-5"
    >
      {MEMBERSHIP_STEPS.map((s, i) => (
        <Reveal key={i} delay={i * 0.06} as="li">
          <div className="flex h-full flex-col">
            <span className={`tabular font-display text-4xl leading-none ${dark ? "text-gold" : "text-navy-700"}`}>
              0{i + 1}
            </span>
            <div className="mt-3 h-[2px] w-8 bg-gold" aria-hidden="true" />
            <h3 className={`mt-4 font-heading text-base font-bold ${dark ? "text-white" : "text-navy-950"}`}>
              {s.title}
            </h3>
            <p className={`mt-2 font-body text-sm leading-relaxed ${dark ? "text-navy-300" : "text-navy-800/75"}`}>
              {s.desc}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
};

export default MembershipSteps;
