import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

// Shared primitives for a consistent editorial system across pages.

export const Eyebrow = ({ children, tone = "navy", className = "" }) => (
  <span
    className={`eyebrow inline-flex items-center gap-2.5 ${
      tone === "gold" ? "text-antique" : tone === "white" ? "text-navy-300" : "text-navy-700"
    } ${className}`}
  >
    <span className={`h-px w-7 ${tone === "gold" ? "bg-gold" : tone === "white" ? "bg-navy-400" : "bg-navy-600"}`} />
    {children}
  </span>
);

export const SectionHeading = ({ eyebrow, title, intro, tone = "navy", align = "left", className = "" }) => {
  const dark = tone === "white";
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={dark ? "white" : "navy"} className={align === "center" ? "justify-center" : ""}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      {title && (
        <Reveal delay={0.05}>
          <h2
            className={`mt-5 font-heading text-[1.9rem] font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.7rem] ${
              dark ? "text-white" : "text-navy-950"
            }`}
          >
            {title}
          </h2>
        </Reveal>
      )}
      {intro && (
        <Reveal delay={0.1}>
          <p className={`mt-5 font-body text-base leading-relaxed md:text-lg ${dark ? "text-navy-300" : "text-navy-800/75"}`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
};

export const CTA = ({ to, children, variant = "primary", testid, className = "" }) => {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-heading text-sm font-semibold transition-colors";
  const styles = {
    primary: "bg-navy-900 text-white hover:bg-navy-700",
    gold: "bg-gold text-navy-950 hover:bg-gold-champagne",
    outline: "border border-navy-800/25 text-navy-900 hover:border-navy-700 hover:text-navy-700",
    outlineWhite: "border border-white/30 text-white hover:border-gold hover:text-gold",
    ghost: "text-navy-700 hover:text-navy-900 px-0",
  };
  return (
    <Link to={to} data-testid={testid} className={`${base} ${styles[variant]} ${className}`}>
      {children}
      {variant === "ghost" ? (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      ) : (
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </Link>
  );
};

// Inner-page hero band (navy, editorial).
export const PageHero = ({ eyebrow, title, intro, children }) => (
  <section className="relative overflow-hidden bg-navy-950 text-white">
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.12]"
      aria-hidden="true"
      style={{
        backgroundImage:
          "linear-gradient(#7CB4F2 1px, transparent 1px), linear-gradient(90deg, #7CB4F2 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 80% 70% at 70% 0%, #000 30%, transparent 80%)",
      }}
    />
    <div className="becci-container relative py-20 md:py-28">
      {eyebrow && <Eyebrow tone="white">{eyebrow}</Eyebrow>}
      <h1 className="mt-5 max-w-4xl font-heading text-[2.4rem] font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.4rem]">
        {title}
      </h1>
      {intro && <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-navy-300">{intro}</p>}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);

export default SectionHeading;
