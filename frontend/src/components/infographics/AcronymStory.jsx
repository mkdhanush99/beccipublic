import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ACRONYM, WHY_BAHUJAN } from "@/data/becci";
import Img from "@/components/Img";
import { BecciInfinityEmblem, PillarEmblemIcon } from "@/components/illustrations/BecciArtwork";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

const INFINITY_DIMENSIONS = [
  {
    tag: "Why our ecosystem exists",
    title: "Inherited skills into modern enterprise",
    body: "The skills, crafts and trades of Bahujan communities have always powered India's economy. BECCI exists so those capabilities grow into formal, sustainable enterprises.",
  },
  {
    tag: "How it works",
    title: "The two facing C’s — an open continuum",
    body: "Chamber (Community Building) and Commerce (Collaboration) face one another to form BECCI's infinity loop — connecting entrepreneurs with knowledge, finance, markets, networks and schemes.",
  },
  {
    tag: "What it seeks to accomplish",
    title: "A virtuous cycle of nation building",
    body: "When one skill becomes an enterprise, it generates employment, strengthens families, anchors communities and builds a stronger Bharat.",
  },
];

// TiE-inspired 5 photographic cards with institutional-blue overlays, floating glass pills,
// official Brand Kit v1.0 emblem & pillar emblems, and unboxed editorial Why · How · What philosophy.
export const AcronymStory = () => {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div data-testid="acronym-infographic">
      {/* 1. Heart of the section: Official BECCI Infinity Continuum Emblem */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.65, ease: EASE_OUT }}
        className="mx-auto max-w-4xl text-center"
      >
        <div className="flex justify-center">
          <BecciInfinityEmblem className="h-24 w-auto sm:h-28" />
        </div>

        <p className="mt-5 font-heading text-xs font-semibold uppercase tracking-[0.22em] text-teal-deep">
          The BECCI Infinity Philosophy
        </p>

        <h2 className="mt-3 font-heading text-h1 font-bold text-navy-950">
          A New Beginning. A Shared Vision. A Greater Impact.
        </h2>

        <p className="mx-auto mt-6 max-w-3xl font-body text-lead text-navy-800/80">
          BECCI builds an entrepreneurial ecosystem that gives aspiring and existing entrepreneurs access to{" "}
          <strong className="font-semibold text-navy-950">
            knowledge, mentorship, technology, finance, markets, professional networks and institutional support
          </strong>{" "}
          — helping transform inherited skills into modern entrepreneurship.
        </p>

        <p className="mt-6 font-serif text-2xl italic text-navy-900 sm:text-3xl">
          “{WHY_BAHUJAN.quote.text}”
        </p>
        <p className="mt-1.5 font-body text-xs text-navy-800/70">
          {WHY_BAHUJAN.quote.translation}
        </p>
      </motion.div>

      {/* 2. Five Photographic Cards — 1 horizontal row on desktop, 2-column grid on mobile */}
      <div
        className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5"
        role="list"
        aria-label="The five BECCI philosophical pillars"
      >
        {ACRONYM.map((item, i) => {
          const isC = i === 2 || i === 3;
          const isLastOdd = i === ACRONYM.length - 1;
          const selected = active === i;

          return (
            <motion.div
              key={i}
              role="listitem"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.55, delay: i * 0.07, ease: EASE_OUT }}
              className={isLastOdd ? "col-span-2 lg:col-span-1" : ""}
            >
              <Link
                to={item.to}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                data-testid={`acronym-letter-${i}`}
                aria-label={`${item.letter} — ${item.title} (${item.word}): ${item.line}`}
                className={`group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl p-5 text-white shadow-soft transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lift active:scale-[0.98] sm:min-h-[360px] sm:p-6 ${
                  selected ? "ring-2 ring-teal/85" : ""
                }`}
              >
                {/* Background photograph */}
                <Img
                  name={item.img}
                  sizes="(min-width: 1024px) 260px, 50vw"
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Institutional-Blue Duotone Wash (refined with Midnight depth on hover) */}
                <div
                  className="absolute inset-0 bg-[#124B8C]/55 mix-blend-multiply transition-colors duration-300 group-hover:bg-[#061B3A]/82"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy-950/94 via-navy-900/42 to-[#1769C2]/18 transition-opacity duration-300 group-hover:from-navy-950/96 group-hover:via-navy-900/75"
                  aria-hidden="true"
                />

                {/* Top floating glass pills (facing Cs retain restrained Champagne Gold heritage badge) */}
                <div className="relative z-10 flex items-center justify-between gap-1.5">
                  <span className="glass-pill whitespace-nowrap rounded-full px-2.5 py-1 font-heading text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white">
                    {item.word}
                  </span>
                  {isC ? (
                    <span className="glass-pill whitespace-nowrap rounded-full px-2 py-1 font-heading text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-gold">
                      ∞ <span className="hidden xl:inline">Continuum</span>
                    </span>
                  ) : (
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-ice/85 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-bright"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Bottom initial + official pillar emblem + title + Electric Teal hover reveal */}
                <div className="relative z-10 mt-auto pt-6">
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="display-head text-[3.85rem] leading-[0.82] text-white transition-colors duration-200 group-hover:text-teal-bright sm:text-[4.6rem]">
                        {item.letter}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                    </div>
                    <PillarEmblemIcon
                      index={i}
                      reverse
                      className="h-10 w-10 opacity-85 transition-opacity duration-200 group-hover:opacity-100 sm:h-11 sm:w-11"
                    />
                  </div>

                  <div className="mt-2.5 h-[2px] w-10 bg-teal transition-[width] duration-200 ease-out group-hover:w-16" />

                  <h3 className="mt-3 font-heading text-[0.95rem] font-bold leading-snug text-white sm:text-[1.1rem]">
                    {item.title}
                  </h3>

                  {/* Compact tap cue on touch screens where hover reveal isn't active */}
                  <span className="mt-2 inline-flex items-center gap-1 font-heading text-[0.68rem] font-semibold text-teal-bright lg:hidden">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>

                  {/* Hover / focus reveal */}
                  <div className="mt-2.5 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100">
                    <div className="overflow-hidden">
                      <p className="pt-1 font-body text-xs leading-relaxed text-ice">
                        {item.line}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-teal-bright">
                        <span>{item.cta}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Unboxed Editorial Why · How · What Strip */}
      <div className="mt-14 grid gap-10 border-t border-navy-800/10 pt-10 md:grid-cols-3">
        {INFINITY_DIMENSIONS.map((d) => (
          <div key={d.tag}>
            <span className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-teal-deep">
              {d.tag}
            </span>
            <h4 className="mt-2.5 font-heading text-lg font-bold text-navy-950">{d.title}</h4>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">
              {d.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcronymStory;
