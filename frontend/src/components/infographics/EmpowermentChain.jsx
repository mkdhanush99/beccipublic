import React from "react";
import { EMPOWERMENT_CHAIN } from "@/data/becci";
import { motion, useReducedMotion } from "framer-motion";

// Economic empowerment chain — a connected vertical path that illuminates in sequence.
export const EmpowermentChain = () => {
  const reduce = useReducedMotion();
  return (
    <div data-testid="empowerment-chain" className="relative mx-auto max-w-3xl">
      <div className="relative pl-0">
        {EMPOWERMENT_CHAIN.map((stage, i) => {
          const last = i === EMPOWERMENT_CHAIN.length - 1;
          return (
            <motion.div
              key={i}
              className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* node + connector */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-heading text-sm font-bold ${
                    last
                      ? "border-gold bg-gold text-navy-950"
                      : "border-navy-700 bg-white text-navy-700"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                {!last && (
                  <span className="mt-1 w-[2px] flex-1 bg-gradient-to-b from-navy-700/60 to-navy-300/40" />
                )}
              </div>
              <div className={`pt-1 ${last ? "pb-1" : ""}`}>
                <h3 className={`font-heading text-lg font-semibold leading-snug sm:text-xl ${last ? "text-gold-antique" : "text-navy-950"}`}>
                  {stage.title}
                </h3>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-navy-800/70 sm:text-base">{stage.note}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EmpowermentChain;
