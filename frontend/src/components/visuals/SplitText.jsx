import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * Kinetic masked word-by-word headline reveal.
 * Renders immediately without motion under `prefers-reduced-motion: reduce`.
 */
export const SplitHeadline = ({
  lines = [],
  className = "",
  highlightWord = "",
  highlightClass = "text-gradient-teal",
  as = "h1",
}) => {
  const reduce = useReducedMotion();
  const Tag = as;

  let wordIdx = 0;

  return (
    <Tag className={className}>
      {lines.map((line, lIdx) => (
        <span key={lIdx} className="block">
          {line.split(" ").map((word, wIdx, arr) => {
            const idx = wordIdx++;
            const isHighlight =
              highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
            return (
              <span key={`${lIdx}-${wIdx}`} className="inline-block overflow-hidden align-top">
                <motion.span
                  className={`inline-block ${isHighlight ? highlightClass : ""}`}
                  initial={reduce ? false : { y: "105%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.72,
                    delay: idx * 0.055,
                    ease: EASE_OUT,
                  }}
                >
                  {word}
                </motion.span>
                {wIdx < arr.length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};

export default SplitHeadline;
