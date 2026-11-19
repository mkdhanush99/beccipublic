import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PILLARS } from "@/data/becci";
import Img from "@/components/Img";
import { PillarSvgIcon } from "@/components/illustrations/BecciArtwork";
import { GlassSpotlight, Magnetic } from "@/components/visuals/MotionPrimitives";
import { EASE_OUT } from "@/lib/motion";

const PILLAR_MEDIA = [
  {
    img: "about",
    kicker: "01 · Capability & Clarity",
    detail:
      "Structured learning, compliance orientation and practical guidance that help founders make sound business decisions from day one.",
    to: "/knowledge",
    cta: "Explore Knowledge Centre",
  },
  {
    img: "professionals",
    kicker: "02 · Capital Readiness",
    detail:
      "Financial literacy, awareness of institutional lending products and formalisation pathways that bridge the gap between entrepreneurs and banks.",
    to: "/what-we-do",
    cta: "See financial literacy work",
  },
  {
    img: "manufacturers",
    kicker: "03 · Demand & Trade",
    detail:
      "Opening pathways to institutional buyers, supply chains and broader commercial markets across eleven productive sectors.",
    to: "/who-we-serve",
    cta: "View 11 industry sectors",
  },
  {
    img: "women",
    kicker: "04 · Institutional Connections",
    detail:
      "Convening peers, mentors, dedicated Women's & Youth Wings and local chapters so no founder builds in isolation.",
    to: "/wings-chapters",
    cta: "Explore Wings & Chapters",
  },
  {
    img: "hero",
    kicker: "05 · Public Programmes",
    detail:
      "Clear, transparent information on eight Central Government enterprise programmes with direct links to official portals.",
    to: "/schemes",
    cta: "Explore 8 Government Schemes",
  },
];

// Full-Bleed Immersive Glassmorphism Business Ecosystem Stage
// Panoramic atmospheric photography fills the entire surface while frosted dark glass panels float above it.
export const PillarEcosystem = () => {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div
      data-testid="pillar-ecosystem"
      className="on-dark relative min-h-[580px] overflow-hidden rounded-3xl bg-navy-950 text-white shadow-lift lg:min-h-[620px]"
    >
      {/* Full-bleed crossfading cinematic photography backdrop */}
      {PILLAR_MEDIA.map((media, i) => {
        const on = active === i;
        return (
          <motion.div
            key={media.kicker}
            initial={false}
            animate={{
              opacity: on ? 1 : 0,
              scale: reduce ? 1 : on ? 1 : 1.06,
            }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="absolute inset-0"
            style={{ pointerEvents: "none" }}
          >
            <Img
              name={media.img}
              sizes="(min-width: 1024px) 1240px, 100vw"
              alt={PILLARS[i].title}
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-navy-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-navy-950/30" />
          </motion.div>
        );
      })}

      {/* Floating Glass Panels over the full-bleed stage */}
      <div className="relative z-10 grid min-h-[580px] gap-6 p-5 sm:p-8 lg:min-h-[620px] lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:p-10">
        {/* Left: Floating Frosted Glass Pillar Switcher with Electric Teal spring highlight */}
        <GlassSpotlight tone="dark" className="glass-dark flex flex-col gap-1.5 rounded-2xl p-2.5">
          {PILLARS.map((p, i) => {
            const on = active === i;
            return (
              <button
                key={p.title}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                data-testid={`pillar-node-${i}`}
                className="group relative flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-transform duration-200 active:scale-[0.99]"
              >
                {on && (
                  <motion.span
                    layoutId={reduce ? undefined : "active-pillar-glass"}
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-teal/15 ring-1 ring-teal/40"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    on ? "bg-teal/20 ring-1 ring-teal/55" : "bg-white/10"
                  }`}
                >
                  <PillarSvgIcon index={i} active className="h-5 w-5" />
                </span>
                <div className="relative z-10 min-w-0 flex-1">
                  <p className={`font-heading text-base font-bold transition-colors ${on ? "text-teal-bright" : "text-white"}`}>
                    {p.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 font-body text-xs text-ice/80">
                    {p.desc}
                  </p>
                </div>
                <ArrowUpRight
                  className={`relative z-10 h-4 w-4 shrink-0 transition-transform duration-150 ${
                    on ? "translate-x-0.5 -translate-y-0.5 text-teal-bright" : "text-white/40"
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </GlassSpotlight>

        {/* Right: Floating Iridescent Glass Detail Lens with choreographed swap */}
        <GlassSpotlight tone="dark" className="glass-iridescent rounded-2xl p-7 sm:p-9 lg:ml-auto lg:w-full lg:max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="relative z-10"
            >
              <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-teal-bright">
                {PILLAR_MEDIA[active].kicker}
              </span>
              <h3 className="mt-2 font-display text-4xl uppercase leading-none tracking-wide text-white sm:text-5xl">
                {PILLARS[active].title}
              </h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-frost/90 sm:text-base">
                {PILLAR_MEDIA[active].detail}
              </p>
              <div className="mt-6">
                <Magnetic strength={0.14} className="w-full sm:w-auto">
                  <Link
                    to={PILLAR_MEDIA[active].to}
                    className="group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-teal px-5 py-3.5 font-heading text-[0.72rem] font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-[transform,background-color] duration-150 hover:bg-teal-bright active:scale-[0.97] sm:w-auto sm:px-6 sm:text-xs"
                  >
                    <span>{PILLAR_MEDIA[active].cta}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </Magnetic>
              </div>
            </motion.div>
          </AnimatePresence>
        </GlassSpotlight>
      </div>
    </div>
  );
};

export default PillarEcosystem;
