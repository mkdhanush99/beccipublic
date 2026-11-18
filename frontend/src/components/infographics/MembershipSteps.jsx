import React from "react";
import { MEMBERSHIP_STEPS } from "@/data/becci";
import Reveal from "@/components/Reveal";

// Five-step membership process — explanatory only, no working form.
export const MembershipSteps = ({ tone = "light" }) => {
  const dark = tone === "dark";
  return (
    <ol data-testid="membership-steps" className="grid gap-px overflow-hidden rounded-sm bg-navy-800/10 md:grid-cols-5">
      {MEMBERSHIP_STEPS.map((s, i) => (
        <Reveal key={i} delay={i * 0.08} as="li" className={dark ? "bg-navy-900" : "bg-white"}>
          <div className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <span className={`font-display text-4xl leading-none ${dark ? "text-navy-500" : "text-navy-300"}`}>
                0{i + 1}
              </span>
              <span className="h-2 w-2 rounded-full bg-gold" />
            </div>
            <h3 className={`mt-5 font-heading text-base font-semibold ${dark ? "text-white" : "text-navy-950"}`}>
              {s.title}
            </h3>
            <p className={`mt-2 font-body text-sm leading-relaxed ${dark ? "text-navy-300" : "text-navy-800/70"}`}>
              {s.desc}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
};

export default MembershipSteps;
