import React, { useState } from "react";
import { EMPOWERMENT_CHAIN } from "@/data/becci";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

// Unboxed Fluid Editorial Multiplier Sequence (zero rectangular boxes or geometric circles).
export const EmpowermentChain = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(4);

  return (
    <ol data-testid="empowerment-chain" className="divide-y divide-navy-800/10 border-y border-navy-800/10">
      {EMPOWERMENT_CHAIN.map((stage, i) => {
        const last = i === EMPOWERMENT_CHAIN.length - 1;
        const on = active === i;
        return (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.45, delay: i * 0.06, ease: EASE_OUT }}
          >
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`group flex w-full items-baseline gap-6 py-6 text-left transition-colors duration-200 sm:gap-8 ${
                on ? "pl-3" : ""
              }`}
            >
              <span
                className={`tabular font-display text-3xl leading-none transition-colors sm:text-4xl ${
                  last || on ? "text-gold-antique" : "text-navy-300 group-hover:text-navy-700"
                }`}
              >
                0{i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className={`font-heading text-lg font-bold transition-colors sm:text-xl ${
                    last ? "text-navy-950" : on ? "text-navy-700" : "text-navy-950"
                  }`}
                >
                  {stage.title}
                </h3>
                <p className="mt-1 font-body text-sm leading-relaxed text-navy-800/75 sm:text-base">
                  {stage.note}
                </p>
              </div>
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
};

export default EmpowermentChain;
