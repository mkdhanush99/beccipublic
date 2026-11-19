import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, DUR, VIEWPORT } from "@/lib/motion";

// Dignified scroll reveal. Respects reduced-motion (renders static).
export const Reveal = ({ children, delay = 0, y = 22, className = "", as = "div" }) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, delay, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
