import React from "react";

// Honest status labels for future / unconfirmed items. Architectural rounded-sm corners.
const STYLES = {
  Planned: "bg-navy-50 text-navy-700 border-navy-300",
  "Coming soon": "bg-ivory text-gold-antique border-gold/50",
  "Under development": "bg-ivory text-burgundy border-burgundy/30",
  TBC: "bg-navy-50 text-navy-800 border-navy-800/20",
};

const DARK = {
  Planned: "bg-white/5 text-navy-300 border-navy-400/30",
  "Coming soon": "bg-gold/10 text-gold-champagne border-gold/40",
  "Under development": "bg-white/5 text-[#E7B4C0] border-[#E7B4C0]/30",
  TBC: "bg-white/5 text-navy-300 border-white/20",
};

export const StatusChip = ({ label, tone = "light", className = "" }) => {
  const key = label === "[TO BE CONFIRMED]" ? "TBC" : label;
  const text = key === "TBC" ? "To be confirmed" : label;
  const map = tone === "dark" ? DARK : STYLES;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border px-2.5 py-1 font-heading text-[0.66rem] font-semibold uppercase tracking-[0.14em] ${map[key] || map.TBC} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" aria-hidden="true" />
      {text}
    </span>
  );
};

export default StatusChip;
