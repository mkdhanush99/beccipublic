import React from "react";

// Honest status labels for future / unconfirmed items.
const STYLES = {
  Planned: "bg-navy-50 text-navy-700 border-navy-300",
  "Coming soon": "bg-ivory text-antique border-gold/50",
  "Under development": "bg-ivory text-burgundy border-burgundy/30",
  TBC: "bg-navy-50 text-navy-800 border-navy-800/20",
};

export const StatusChip = ({ label, className = "" }) => {
  const key = label === "[TO BE CONFIRMED]" ? "TBC" : label;
  const text = key === "TBC" ? "To be confirmed" : label;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${STYLES[key] || STYLES.TBC} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {text}
    </span>
  );
};

export default StatusChip;
