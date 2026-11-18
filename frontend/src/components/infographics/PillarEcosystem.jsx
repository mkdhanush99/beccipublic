import React, { useState } from "react";
import { PILLARS } from "@/data/becci";
import { BookOpen, Banknote, Store, Network, Landmark } from "lucide-react";

const ICONS = [BookOpen, Banknote, Store, Network, Landmark];

// Five-pillar support ecosystem with the entrepreneur at the centre.
export const PillarEcosystem = () => {
  const [active, setActive] = useState(null);

  return (
    <div data-testid="pillar-ecosystem">
      {/* Radial composition for desktop */}
      <div className="relative mx-auto hidden aspect-[16/10] max-w-4xl lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          {[
            [150, 110], [650, 110], [110, 360], [690, 360], [400, 450],
          ].map(([x, y], i) => (
            <line
              key={i}
              x1="400" y1="250" x2={x} y2={y}
              stroke={active === i ? "#D4AF5A" : "#B8D7FA"}
              strokeWidth={active === i ? 2.5 : 1.5}
              className="transition-all duration-300"
            />
          ))}
          <circle cx="400" cy="250" r="88" fill="#061B3A" />
          <circle cx="400" cy="250" r="88" fill="none" stroke="#D4AF5A" strokeWidth="1.5" />
        </svg>

        {/* center */}
        <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center">
          <span className="font-display text-xl uppercase tracking-wide text-gold">The</span>
          <span className="font-display text-3xl uppercase leading-none tracking-wide text-white">Entrepreneur</span>
          <span className="mt-1 font-body text-[0.7rem] text-navy-300">at the centre</span>
        </div>

        {/* nodes */}
        {[
          { pos: "left-[12%] top-[12%]" },
          { pos: "right-[12%] top-[12%]" },
          { pos: "left-[6%] top-[64%]" },
          { pos: "right-[6%] top-[64%]" },
          { pos: "left-1/2 top-[84%] -translate-x-1/2" },
        ].map((p, i) => {
          const Icon = ICONS[i];
          const on = active === i;
          return (
            <button
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              data-testid={`pillar-node-${i}`}
              className={`absolute ${p.pos} w-48 -translate-y-1/2 rounded-sm border bg-white px-4 py-3 text-left shadow-[0_8px_30px_-16px_rgba(6,27,58,0.45)] outline-none transition-all duration-300 ${
                on ? "border-gold ring-1 ring-gold" : "border-navy-800/10"
              }`}
            >
              <Icon className={`h-5 w-5 ${on ? "text-gold-antique" : "text-navy-700"}`} />
              <p className="mt-2 font-heading text-sm font-semibold text-navy-950">{PILLARS[i].title}</p>
              <p className="mt-1 font-body text-xs leading-snug text-navy-800/70">{PILLARS[i].desc}</p>
            </button>
          );
        })}
      </div>

      {/* Stacked list for tablet/mobile */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        <div className="flex flex-col items-start justify-center rounded-sm bg-navy-900 p-6 sm:col-span-2">
          <span className="eyebrow text-gold">At the centre</span>
          <p className="mt-2 font-display text-3xl uppercase tracking-wide text-white">The Entrepreneur</p>
        </div>
        {PILLARS.map((p, i) => {
          const Icon = ICONS[i];
          return (
            <div key={i} className="rounded-sm border border-navy-800/10 bg-white p-5">
              <Icon className="h-5 w-5 text-navy-700" />
              <p className="mt-3 font-heading text-base font-semibold text-navy-950">{p.title}</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-navy-800/70">{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PillarEcosystem;
