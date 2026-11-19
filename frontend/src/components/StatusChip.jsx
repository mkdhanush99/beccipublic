import React from "react";

// Honest status labels calibrated to the BECCI Frost · Electric Teal · Ice Blue · Controlled UV system.
const STYLES = {
  Planned: "bg-frost text-navy-800 border-ice",
  "Coming soon": "bg-teal-mist text-teal-ink border-teal/35",
  "Under development": "bg-uv/10 text-uv-deep border-uv/25",
  TBC: "bg-frost text-navy-800 border-navy-800/18",
};

const DARK = {
  Planned: "bg-white/5 text-ice border-ice/25",
  "Coming soon": "bg-teal/15 text-teal-bright border-teal/40",
  "Under development": "bg-uv/15 text-uv-soft border-uv/35",
  TBC: "bg-white/5 text-ice border-white/20",
};

export const StatusChip = ({ label, tone = "light", className = "" }) => {
  const key = label === "[TO BE CONFIRMED]" ? "TBC" : label;
  const text = key === "TBC" ? "To be confirmed" : label;
  const map = tone === "dark" ? DARK : STYLES;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-heading text-[0.66rem] font-semibold uppercase tracking-[0.14em] ${map[key] || map.TBC} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-85" aria-hidden="true" />
      {text}
    </span>
  );
};

export default StatusChip;
