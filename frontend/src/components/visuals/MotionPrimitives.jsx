import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Magnetic — Subtle pointer-responsive magnetic pull for primary interactive controls.
 * Automatically disabled on touch devices and when `prefers-reduced-motion` is enabled.
 */
export const Magnetic = ({ children, strength = 0.22, className = "" }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 24, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 24, mass: 0.4 });

  const onMove = (e) => {
    if (reduce || e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduce) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
};

/**
 * GlassSpotlight — Zero-re-render pointer-tracking specular refraction sheen
 * for frosted glass surfaces. Updates CSS variables directly on the DOM node.
 */
export const GlassSpotlight = ({
  children,
  className = "",
  tone = "dark",
  as: Tag = "div",
  ...props
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const onMove = (e) => {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--gx", `${px.toFixed(1)}%`);
    ref.current.style.setProperty("--gy", `${py.toFixed(1)}%`);
  };

  const glareBg =
    tone === "dark"
      ? "radial-gradient(420px circle at var(--gx, 50%) var(--gy, 20%), rgba(212,175,90,0.14), rgba(61,143,232,0.08) 40%, transparent 72%)"
      : "radial-gradient(380px circle at var(--gx, 50%) var(--gy, 20%), rgba(61,143,232,0.10), rgba(212,175,90,0.06) 45%, transparent 72%)";

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      className={`group/spot relative overflow-hidden ${className}`}
      {...props}
    >
      {!reduce && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
          style={{ background: glareBg }}
        />
      )}
      {children}
    </Tag>
  );
};

/**
 * ParallaxFrame — Scroll-linked depth offset for editorial photography cards.
 * Keeps transform GPU-composited (`translateY` only) and disables cleanly on reduced motion.
 */
export const ParallaxFrame = ({ children, offset = 24, className = "" }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
};
