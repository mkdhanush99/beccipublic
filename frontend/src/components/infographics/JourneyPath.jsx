import React from "react";
import { JOURNEY } from "@/data/becci";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";
import { SkillToNationDiagram } from "@/components/illustrations/BecciArtwork";

// SKILL -> ENTERPRISE -> PROSPERITY -> NATION BUILDING 4-step progression
// Anchored by the official BECCI Brand Kit v1.0 Skill-to-Nation elevation schematic.
export const JourneyPath = () => {
  const reduce = useReducedMotion();
  return (
    <div data-testid="journey-path" className="space-y-8">
      <SkillToNationDiagram />

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY.map((j, i) => {
          const last = i === JOURNEY.length - 1;
          return (
            <motion.li
              key={i}
              className="relative"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE_OUT }}
            >
              <div
                className={`relative flex h-full flex-col justify-between rounded-sm border p-6 transition-colors ${
                  last
                    ? "border-gold/75 bg-gradient-to-b from-gold/15 to-navy-900/90"
                    : "border-white/12 bg-navy-900/75 hover:border-gold/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tabular font-display text-lg tracking-widest text-gold">
                      0{i + 1}
                    </span>
                    {!last && (
                      <ArrowRight className="h-4 w-4 text-navy-400" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl uppercase leading-none tracking-wide text-white sm:text-[1.85rem]">
                    {j.step}
                  </h3>
                </div>
                <p className="mt-4 border-t border-white/10 pt-3.5 font-body text-sm leading-relaxed text-navy-300">
                  {j.line}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export default JourneyPath;
