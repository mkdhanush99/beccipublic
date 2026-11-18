import React, { useState } from "react";
import { ACRONYM } from "@/data/becci";
import { Symbol } from "@/components/Logo";
import Reveal from "@/components/Reveal";

// Interactive B-E-C-C-I story. Understandable without interaction (all text visible below).
export const AcronymStory = () => {
  const [active, setActive] = useState(0);

  return (
    <div data-testid="acronym-infographic">
      {/* Large connected letters */}
      <div className="flex flex-wrap items-end justify-center gap-1 sm:gap-3">
        {ACRONYM.map((item, i) => {
          const isC = i === 2 || i === 3;
          const selected = active === i;
          return (
            <button
              key={i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              data-testid={`acronym-letter-${i}`}
              aria-label={`${item.letter} — ${item.word}`}
              className="group relative flex flex-col items-center outline-none"
            >
              <span
                className={`display-head text-[5rem] leading-[0.8] transition-colors duration-300 sm:text-[7rem] lg:text-[9rem] ${
                  selected ? "text-navy-700" : "text-navy-900/25 group-hover:text-navy-900/50"
                }`}
              >
                {item.letter}
              </span>
              <span
                className={`mt-2 h-[3px] w-full origin-left rounded-full transition-all duration-300 ${
                  selected ? "scale-x-100 bg-gold" : "scale-x-0 bg-gold"
                }`}
              />
              <span
                className={`mt-3 font-heading text-xs font-semibold uppercase tracking-[0.18em] transition-colors sm:text-sm ${
                  selected ? "text-navy-900" : "text-navy-900/45"
                }`}
              >
                {item.word}
              </span>
            </button>
          );
        })}
      </div>

      {/* Infinity relationship note (the two facing C's) */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <Symbol variant="navy" className="h-5 opacity-80" />
        <p className="font-body text-xs text-navy-800/60">
          The two facing C's form BECCI's infinity — Chamber and Commerce, held open for the next relationship.
        </p>
      </div>

      {/* Active description */}
      <Reveal className="mx-auto mt-8 max-w-2xl rounded-sm border-l-2 border-gold bg-navy-50/60 px-6 py-6 text-center">
        <p className="font-heading text-lg font-semibold text-navy-900">
          {ACRONYM[active].letter} — {ACRONYM[active].word}
        </p>
        <p className="mt-2 font-body text-base leading-relaxed text-navy-800/80">{ACRONYM[active].line}</p>
      </Reveal>

      {/* Static text equivalent (accessible / no-motion) */}
      <dl className="sr-only">
        {ACRONYM.map((item, i) => (
          <React.Fragment key={i}>
            <dt>{item.letter} — {item.word}</dt>
            <dd>{item.line}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};

export default AcronymStory;
