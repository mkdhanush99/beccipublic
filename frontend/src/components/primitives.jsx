import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import EnterpriseField3D from "@/components/visuals/EnterpriseField3D";
import { Magnetic } from "@/components/visuals/MotionPrimitives";
import { EASE_OUT } from "@/lib/motion";

export const Eyebrow = ({ children, tone = "navy", className = "" }) => {
  const textTone =
    tone === "gold"
      ? "text-gold"
      : tone === "antique"
        ? "text-gold-antique"
        : tone === "white"
          ? "text-navy-300"
          : "text-navy-700";
  const lineTone =
    tone === "gold" || tone === "antique"
      ? "bg-gold"
      : tone === "white"
        ? "bg-navy-400"
        : "bg-navy-600";
  return (
    <span className={`eyebrow inline-flex items-center gap-2.5 ${textTone} ${className}`}>
      <span className={`h-px w-6 ${lineTone}`} aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
};

export const SectionHeading = ({
  eyebrow,
  title,
  intro,
  tone = "navy",
  align = "left",
  className = "",
}) => {
  const dark = tone === "white";
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && (
        <Reveal>
          <Eyebrow
            tone={dark ? "gold" : "navy"}
            className={align === "center" ? "justify-center" : ""}
          >
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      {title && (
        <Reveal delay={0.05}>
          <h2
            className={`mt-4 font-heading text-h2 font-bold ${
              dark ? "text-white" : "text-navy-950"
            }`}
          >
            {title}
          </h2>
        </Reveal>
      )}
      {intro && (
        <Reveal delay={0.1}>
          <p className={`mt-5 max-w-[65ch] font-body text-lead ${align === "center" ? "mx-auto" : ""} ${dark ? "text-navy-300" : "text-navy-800/75"}`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
};

export const CTA = ({ to, children, variant = "primary", testid, className = "" }) => {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-heading text-sm font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out active:scale-[0.97]";
  const styles = {
    primary: "bg-navy-950 text-white hover:bg-navy-700 shadow-soft",
    gold: "bg-gold text-navy-950 hover:bg-gold-champagne shadow-[0_12px_32px_-10px_rgb(212_175_90/0.6)]",
    outline: "border border-navy-800/20 text-navy-900 hover:border-navy-700 hover:bg-navy-50/70",
    outlineWhite: "glass-pill text-white hover:border-gold/60 hover:text-gold",
    ghost: "text-navy-700 hover:text-navy-950 px-0 py-1 rounded-none",
  };
  return (
    <Link to={to} data-testid={testid} className={`${base} ${styles[variant]} ${className}`}>
      <span>{children}</span>
      {variant === "ghost" ? (
        <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" aria-hidden="true" />
      ) : (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      )}
    </Link>
  );
};

// Inner-page hero band powered by the WebGL Liquid Light Shader + 3D Enterprise Field
export const PageHero = ({ eyebrow, title, intro, meta, children }) => {
  const reduce = useReducedMotion();
  return (
    <section className="on-dark relative overflow-hidden bg-navy-950 pt-28 text-white sm:pt-32">
      <LiquidAuroraCanvas />
      <EnterpriseField3D density="closing" className="opacity-55" />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/30 via-transparent to-navy-950"
        aria-hidden="true"
      />

      <div className="becci-container relative z-10 py-16 md:py-24 lg:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          {eyebrow && <Eyebrow tone="gold">{eyebrow}</Eyebrow>}
          {meta && (
            <span className="glass-pill rounded-full px-3.5 py-1 font-heading text-xs font-medium text-navy-100">
              {meta}
            </span>
          )}
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: EASE_OUT }}
          className="mt-5 max-w-4xl font-heading text-h1 font-bold text-white"
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14, ease: EASE_OUT }}
            className="mt-6 max-w-[62ch] font-body text-lead text-navy-100/85"
          >
            {intro}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_OUT }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export const NextPageBand = ({ eyebrow = "Continue exploring", title, desc, to, ctaLabel, testid }) => (
  <section className="bg-navy-50/50 py-16 md:py-24">
    <div className="becci-container flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="max-w-xl">
        <Eyebrow tone="antique">{eyebrow}</Eyebrow>
        <h2 className="mt-3 font-heading text-2xl font-bold text-navy-950 md:text-3xl">{title}</h2>
        {desc && <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">{desc}</p>}
      </div>
      <Magnetic strength={0.18}>
        <CTA to={to} variant="primary" testid={testid}>
          {ctaLabel}
        </CTA>
      </Magnetic>
    </div>
  </section>
);

export default SectionHeading;
