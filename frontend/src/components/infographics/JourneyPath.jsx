import React from "react";
import { JOURNEY } from "@/data/becci";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

// SKILL -> ENTERPRISE -> PROSPERITY -> NATION BUILDING progression.
export const JourneyPath = () => {
  const reduce = useReducedMotion();
  return (
    <div data-testid="journey-path" className="grid gap-4 md:grid-cols-7 md:items-stretch">
      {JOURNEY.map((j, i) => (
        <React.Fragment key={i}>
          <motion.div
            className="relative md:col-span-1 md:flex-1"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-full flex-col justify-between border-t-2 border-gold/80 bg-white/5 pt-5">
              <div>
                <span className="font-display text-sm tracking-widest text-gold">0{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl uppercase leading-none tracking-wide text-white sm:text-[1.7rem]">
                  {j.step}
                </h3>
              </div>
              <p className="mt-4 font-body text-sm leading-relaxed text-navy-300">{j.line}</p>
            </div>
          </motion.div>
          {i < JOURNEY.length - 1 && (
            <div className="hidden items-center justify-center md:flex">
              <ChevronRight className="h-6 w-6 text-navy-500" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default JourneyPath;
