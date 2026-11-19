import React from "react";

// Official BECCI Brand Kit v1.0 SVG Assets
import infinityLight from "@/assets/brand/emblem/becci-infinity-emblem.svg";
import infinityDark from "@/assets/brand/emblem/becci-infinity-emblem-dark.svg";

import pillarB from "@/assets/brand/pillar-emblems/pillar-b-beginning.svg";
import pillarBRev from "@/assets/brand/pillar-emblems/pillar-b-beginning-reverse.svg";
import pillarE from "@/assets/brand/pillar-emblems/pillar-e-enterprise.svg";
import pillarERev from "@/assets/brand/pillar-emblems/pillar-e-enterprise-reverse.svg";
import pillarC1 from "@/assets/brand/pillar-emblems/pillar-c1-community.svg";
import pillarC1Rev from "@/assets/brand/pillar-emblems/pillar-c1-community-reverse.svg";
import pillarC2 from "@/assets/brand/pillar-emblems/pillar-c2-commerce.svg";
import pillarC2Rev from "@/assets/brand/pillar-emblems/pillar-c2-commerce-reverse.svg";
import pillarI from "@/assets/brand/pillar-emblems/pillar-i-impact.svg";
import pillarIRev from "@/assets/brand/pillar-emblems/pillar-i-impact-reverse.svg";

import iconKnowledge from "@/assets/brand/icons/pillars/icon-pillar-knowledge.svg";
import iconKnowledgeRev from "@/assets/brand/icons/pillars/reverse/icon-pillar-knowledge.svg";
import iconFinance from "@/assets/brand/icons/pillars/icon-pillar-finance.svg";
import iconFinanceRev from "@/assets/brand/icons/pillars/reverse/icon-pillar-finance.svg";
import iconMarkets from "@/assets/brand/icons/pillars/icon-pillar-markets.svg";
import iconMarketsRev from "@/assets/brand/icons/pillars/reverse/icon-pillar-markets.svg";
import iconNetworks from "@/assets/brand/icons/pillars/icon-pillar-networks.svg";
import iconNetworksRev from "@/assets/brand/icons/pillars/reverse/icon-pillar-networks.svg";
import iconSchemes from "@/assets/brand/icons/pillars/icon-pillar-schemes.svg";
import iconSchemesRev from "@/assets/brand/icons/pillars/reverse/icon-pillar-schemes.svg";

import secManufacturing from "@/assets/brand/icons/sectors/icon-sector-manufacturing.svg";
import secTrading from "@/assets/brand/icons/sectors/icon-sector-trading.svg";
import secServices from "@/assets/brand/icons/sectors/icon-sector-services.svg";
import secHealthcare from "@/assets/brand/icons/sectors/icon-sector-healthcare.svg";
import secEducation from "@/assets/brand/icons/sectors/icon-sector-education.svg";
import secAgriculture from "@/assets/brand/icons/sectors/icon-sector-agriculture.svg";
import secTechnology from "@/assets/brand/icons/sectors/icon-sector-technology.svg";
import secConstruction from "@/assets/brand/icons/sectors/icon-sector-construction.svg";
import secFinance from "@/assets/brand/icons/sectors/icon-sector-finance.svg";
import secHospitality from "@/assets/brand/icons/sectors/icon-sector-hospitality.svg";
import secOther from "@/assets/brand/icons/sectors/icon-sector-other.svg";

import badgeWomens from "@/assets/brand/icons/wings/badge-womens-wing.svg";
import badgeWomensRev from "@/assets/brand/icons/wings/reverse/badge-womens-wing.svg";
import badgeYouth from "@/assets/brand/icons/wings/badge-youth-wing.svg";
import badgeYouthRev from "@/assets/brand/icons/wings/reverse/badge-youth-wing.svg";

import diagramBridge from "@/assets/brand/diagrams/diagram-institutional-bridge.svg";
import diagramSkillToNation from "@/assets/brand/diagrams/diagram-skill-to-nation.svg";
import diagramNationalToCity from "@/assets/brand/diagrams/diagram-national-to-city.svg";
import diagramSupportEcosystem from "@/assets/brand/diagrams/diagram-support-ecosystem.svg";

/* ---------------- 1. Official BECCI Infinity Continuum Emblem (Illustration, not a logo) ---------------- */
export const BecciInfinityEmblem = ({ className = "h-24 w-auto", dark = false }) => (
  <img
    src={dark ? infinityDark : infinityLight}
    alt="BECCI Infinity Continuum Emblem — Chamber and Commerce interlocked in a virtuous cycle"
    className={className}
    draggable={false}
  />
);

/* ---------------- 2. Official 5 B-E-C-C-I Philosophical Pillar Emblems ---------------- */
const PILLAR_EMBLEMS = [
  { light: pillarB, dark: pillarBRev, alt: "Beginning of a Journey emblem" },
  { light: pillarE, dark: pillarERev, alt: "Enterprise & Entrepreneurship emblem" },
  { light: pillarC1, dark: pillarC1Rev, alt: "Community Building emblem" },
  { light: pillarC2, dark: pillarC2Rev, alt: "Commerce & Collaboration emblem" },
  { light: pillarI, dark: pillarIRev, alt: "Impact Created emblem" },
];

export const PillarEmblemIcon = ({ index = 0, reverse = false, className = "h-9 w-9" }) => {
  const item = PILLAR_EMBLEMS[index] || PILLAR_EMBLEMS[0];
  return (
    <img
      src={reverse ? item.dark : item.light}
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
    />
  );
};

/* ---------------- 3. Official 5 Support Pillar Icons ---------------- */
const SUPPORT_PILLAR_ICONS = [
  { light: iconKnowledge, dark: iconKnowledgeRev },
  { light: iconFinance, dark: iconFinanceRev },
  { light: iconMarkets, dark: iconMarketsRev },
  { light: iconNetworks, dark: iconNetworksRev },
  { light: iconSchemes, dark: iconSchemesRev },
];

export const PillarSvgIcon = ({ index = 0, active = false, className = "h-6 w-6" }) => {
  const item = SUPPORT_PILLAR_ICONS[index] || SUPPORT_PILLAR_ICONS[0];
  return (
    <img
      src={active ? item.dark : item.light}
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
    />
  );
};

/* ---------------- 4. Official 11 Business Sector Icons ---------------- */
const SECTOR_ICON_MAP = {
  Factory: secManufacturing,
  Truck: secTrading,
  Handshake: secServices,
  HeartPulse: secHealthcare,
  GraduationCap: secEducation,
  Sprout: secAgriculture,
  Cpu: secTechnology,
  Building2: secConstruction,
  Landmark: secFinance,
  Hotel: secHospitality,
  Boxes: secOther,
};

export const SectorSvgIcon = ({ name, className = "h-6 w-6" }) => (
  <img
    src={SECTOR_ICON_MAP[name] || secOther}
    alt=""
    aria-hidden="true"
    className={className}
    draggable={false}
  />
);

/* ---------------- 5. Official Dedicated Wing Badges ---------------- */
export const WingBadgeIcon = ({ name = "", reverse = false, className = "h-10 w-10" }) => {
  const isWomen = name.toLowerCase().includes("women");
  const src = isWomen
    ? reverse
      ? badgeWomensRev
      : badgeWomens
    : reverse
      ? badgeYouthRev
      : badgeYouth;
  return <img src={src} alt="" aria-hidden="true" className={className} draggable={false} />;
};

/* ---------------- 6. Official Institutional Brand Kit Diagrams ---------------- */
export const InstitutionalBridgeDiagram = ({ className = "" }) => (
  <div className={`overflow-hidden rounded-sm border border-gold/25 bg-[#030E1E] p-3 shadow-lift sm:p-5 ${className}`}>
    <img
      src={diagramBridge}
      alt="The Institutional Bridge — Inherited skills, crafts and trades connected via BECCI Chamber Continuum to sustainable, formal enterprise"
      className="h-auto w-full"
      loading="lazy"
      draggable={false}
    />
  </div>
);

export const SkillToNationDiagram = ({ className = "" }) => (
  <div className={`overflow-hidden rounded-sm border border-white/12 bg-[#030E1E] p-3 shadow-lift sm:p-5 ${className}`}>
    <img
      src={diagramSkillToNation}
      alt="Four-stage elevation from 01 Skill to 02 Enterprise, 03 Prosperity, and 04 Nation Building"
      className="h-auto w-full"
      loading="lazy"
      draggable={false}
    />
  </div>
);

export const NationalToCityDiagram = ({ className = "" }) => (
  <div className={`overflow-hidden rounded-sm border border-navy-800/12 bg-navy-50/60 p-3 shadow-soft sm:p-4 ${className}`}>
    <img
      src={diagramNationalToCity}
      alt="National Apex to State Coordination, District Presence, and City Chapters organisational structure"
      className="h-auto w-full"
      loading="lazy"
      draggable={false}
    />
  </div>
);

export const SupportEcosystemDiagram = ({ className = "" }) => (
  <div className={`overflow-hidden rounded-sm border border-navy-800/12 bg-white p-4 shadow-soft sm:p-6 ${className}`}>
    <img
      src={diagramSupportEcosystem}
      alt="BECCI Support Pillars — Knowledge, Finance, Markets, Networks, and Schemes radiating from the BECCI Infinity Continuum"
      className="h-auto w-full"
      loading="lazy"
      draggable={false}
    />
  </div>
);

export default BecciInfinityEmblem;
