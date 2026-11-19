/**
 * BECCI Opportunity Navigator — Pure Deterministic Discovery Engine
 *
 * Completely decoupled from React/UI presentation.
 * Reads strictly from verified single-source data in `@/data/becci` and `@/data/intelligence`.
 *
 * Safeguards:
 * - Transparent metadata-based relevance matching (no fake AI or live-data claims)
 * - Zero personal data or caste/community collection
 * - Zero invented scheme amounts, interest slabs, eligibility decisions or guarantees
 * - Honest status labels distinguishing Available now / Under development / Coming soon / Planned
 */

import {
  FAQS,
  FUTURE_INITIATIVE_TRACKS,
  KNOWLEDGE_PORTALS,
  MEMBERSHIP_TYPES,
  PHASE_INITIATIVES,
  SCHEMES,
  SCHEME_DATASET_STATS,
  SCHEME_STAGES,
  SECTORS,
} from "@/data/becci";
import { INSIGHT_ARTICLES, LOAN_DECISION_GUIDE } from "@/data/intelligence";

// Map each exploration goal to verified BECCI myScheme categories
const GOAL_CATEGORIES = {
  starting: ["Startup & Innovation", "Loans & Credit", "Subsidies & Grants", "OBC / Backward Classes"],
  formalising: ["Technology, Quality & Certification", "Credit Guarantee", "Loans & Credit"],
  schemes: [
    "OBC / Backward Classes",
    "Loans & Credit",
    "Subsidies & Grants",
    "Startup & Innovation",
    "Skill Development & Training",
    "Artisans & Traditional Trades",
    "Women Entrepreneurs",
    "Credit Guarantee",
  ],
  skills: ["Skill Development & Training", "Artisans & Traditional Trades", "Education & Scholarships"],
  finance: ["Loans & Credit", "Credit Guarantee", "Subsidies & Grants", "OBC / Backward Classes"],
  membership: ["OBC / Backward Classes", "Loans & Credit", "Subsidies & Grants"],
  industry: [
    "Technology, Quality & Certification",
    "Marketing, Export & Procurement",
    "Startup & Innovation",
    "Credit Guarantee",
  ],
};

// Sector keywords for sharper relevance across the 335-scheme myScheme dataset
const SECTOR_KEYWORDS = {
  manufacturing: ["manufacturing", "industrial", "msme", "factory", "textile", "handloom", "machinery", "zed", "cluster", "production", "jute", "coir"],
  trading: ["trading", "retail", "export", "market", "procurement", "commerce", "distribution", "mudra", "vendor"],
  services: ["service", "enterprise", "micro", "msme", "mudra", "self-employment", "credit"],
  healthcare: ["health", "medical", "clinic", "hospital", "pharma", "ayush", "insurance", "wellness"],
  education: ["education", "scholarship", "training", "skill", "student", "coaching", "fellowship", "apprentice"],
  agriculture: ["agriculture", "agri", "dairy", "fisheries", "poultry", "food processing", "farmer", "animal", "kisan", "horticulture"],
  it: ["startup", "software", "technology", "digital", "innovation", "incubation", "seed fund", "electronics", "it", "stpi"],
  construction: ["construction", "infrastructure", "contractor", "mason", "building", "housing", "worker"],
  finance: ["finance", "credit", "loan", "venture", "guarantee", "banking", "insurance", "professional"],
  hospitality: ["tourism", "hospitality", "hotel", "catering", "food", "artisan", "handicraft", "culture"],
  other: ["obc", "backward", "artisan", "vishwakarma", "entrepreneur", "micro"],
};

export const EXPLORATION_GOALS = [
  {
    id: "starting",
    num: "01",
    label: "Starting a business",
    short: "Starting a Business",
    summary: "Turn a skill, craft or first idea into a structured, formal enterprise.",
    stages: ["Aspiring entrepreneur", "New entrepreneur"],
    schemeTypes: ["Credit-linked subsidy", "Loan", "Integrated support", "Seed funding"],
    guideSlugs: [
      "how-to-register-on-udyam-free",
      "five-documents-every-entrepreneur-should-keep-ready",
      "pmegp-in-6-steps-obc-subsidy",
      "which-loan-fits-you-decision-guide",
    ],
    portalNames: ["Udyam Registration", "Ministry of MSME", "Startup India", "PM Vishwakarma"],
    faqIndices: [1, 0, 4, 9],
    futureTrackIds: ["business", "startup"],
  },
  {
    id: "formalising",
    num: "02",
    label: "Formalising a business",
    short: "Formalising a Business",
    summary: "Complete free Udyam registration, align tax/corporate records and prepare documentation.",
    stages: ["New entrepreneur", "Existing micro enterprise"],
    schemeTypes: ["Certification", "Credit guarantee", "Loan"],
    guideSlugs: [
      "how-to-register-on-udyam-free",
      "getting-your-caste-bc-certificate",
      "five-documents-every-entrepreneur-should-keep-ready",
    ],
    portalNames: [
      "Udyam Registration",
      "GST Portal",
      "Ministry of Corporate Affairs (MCA)",
      "NCBC (Central OBC Lists)",
      "MSME Samadhaan",
    ],
    faqIndices: [4, 7, 9, 1],
    futureTrackIds: ["business"],
  },
  {
    id: "schemes",
    num: "03",
    label: "Finding government scheme information",
    short: "Government Schemes",
    summary: "Navigate Central and State Government programmes directly through verified official portals.",
    stages: [],
    schemeTypes: [
      "Loan",
      "Credit-linked subsidy",
      "Credit guarantee",
      "Integrated support",
      "Skill development",
      "Seed funding",
      "Certification",
      "State welfare",
    ],
    guideSlugs: [
      "which-loan-fits-you-decision-guide",
      "pmegp-in-6-steps-obc-subsidy",
      "getting-your-caste-bc-certificate",
      "how-to-register-on-udyam-free",
    ],
    portalNames: ["Ministry of MSME", "NBCFDC", "PM Vishwakarma", "Udyam Registration"],
    faqIndices: [9, 8, 3, 4],
    futureTrackIds: ["business"],
  },
  {
    id: "skills",
    num: "04",
    label: "Developing business skills",
    short: "Business Skills",
    summary: "Vocational skilling, traditional artisan recognition and capability-building portals.",
    stages: ["Aspiring entrepreneur", "Existing micro enterprise"],
    schemeTypes: ["Skill development", "Integrated support"],
    guideSlugs: [
      "five-documents-every-entrepreneur-should-keep-ready",
      "how-to-register-on-udyam-free",
      "getting-your-caste-bc-certificate",
    ],
    portalNames: ["Skill India Digital", "PM Vishwakarma", "Ministry of MSME", "Startup India"],
    faqIndices: [1, 0, 3, 9],
    futureTrackIds: ["business", "manufacturing"],
  },
  {
    id: "finance",
    num: "05",
    label: "Exploring finance resources",
    short: "Finance Resources",
    summary: "Orient yourself across concessional loans, credit guarantees, subsidies and venture schemes.",
    stages: [],
    schemeTypes: ["Loan", "Credit-linked subsidy", "Credit guarantee", "Seed funding", "State welfare"],
    guideSlugs: [
      "which-loan-fits-you-decision-guide",
      "pmegp-in-6-steps-obc-subsidy",
      "five-documents-every-entrepreneur-should-keep-ready",
    ],
    portalNames: ["SIDBI", "NBCFDC", "MSME Samadhaan", "Startup India Seed Fund", "Udyam Registration"],
    faqIndices: [8, 9, 4, 11],
    futureTrackIds: ["business", "startup"],
  },
  {
    id: "membership",
    num: "06",
    label: "Learning about BECCI membership",
    short: "BECCI Membership",
    summary: "Understand Individual vs. Business membership, community-list rules and Phase 01 rollout status.",
    stages: [],
    schemeTypes: ["Loan", "Integrated support", "State welfare"],
    guideSlugs: [
      "getting-your-caste-bc-certificate",
      "how-to-register-on-udyam-free",
      "five-documents-every-entrepreneur-should-keep-ready",
    ],
    portalNames: ["NCBC (Central OBC Lists)", "Udyam Registration", "Ministry of Corporate Affairs (MCA)"],
    faqIndices: [0, 1, 2, 3, 5, 6, 7, 10],
    futureTrackIds: ["networking", "exchange"],
  },
  {
    id: "industry",
    num: "07",
    label: "Discovering industry opportunities",
    short: "Industry Opportunities",
    summary: "Explore sector coverage, public procurement (GeM), quality standards and upcoming chamber exchanges.",
    stages: ["New entrepreneur", "Existing micro enterprise", "Growing enterprise"],
    schemeTypes: ["Certification", "Credit guarantee", "Seed funding", "Credit-linked subsidy"],
    guideSlugs: [
      "how-to-register-on-udyam-free",
      "which-loan-fits-you-decision-guide",
      "five-documents-every-entrepreneur-should-keep-ready",
    ],
    portalNames: ["Government e-Marketplace (GeM)", "NSIC", "Startup India", "SIDBI", "Ministry of MSME"],
    faqIndices: [0, 3, 8, 11],
    futureTrackIds: ["manufacturing", "exchange", "networking", "startup"],
  },
];

export const NAVIGATOR_STAGES = ["all", ...SCHEME_STAGES];

// Sector-specific portal affinity (derived from verified official portals)
const SECTOR_PORTALS = {
  manufacturing: ["Government e-Marketplace (GeM)", "NSIC", "Ministry of MSME", "SIDBI"],
  trading: ["GST Portal", "Government e-Marketplace (GeM)", "Udyam Registration", "MSME Samadhaan"],
  services: ["Udyam Registration", "GST Portal", "Government e-Marketplace (GeM)", "SIDBI"],
  healthcare: ["Udyam Registration", "Ministry of MSME", "SIDBI"],
  education: ["Skill India Digital", "Udyam Registration", "Startup India"],
  agriculture: ["NBCFDC", "Ministry of MSME", "SIDBI"],
  it: ["Startup India", "Startup India Seed Fund", "Ministry of Corporate Affairs (MCA)", "Government e-Marketplace (GeM)"],
  construction: ["Government e-Marketplace (GeM)", "MSME Samadhaan", "Udyam Registration", "SIDBI"],
  finance: ["Ministry of Corporate Affairs (MCA)", "GST Portal", "Udyam Registration"],
  hospitality: ["Udyam Registration", "GST Portal", "SIDBI"],
  other: ["Udyam Registration", "Ministry of MSME", "NBCFDC"],
};

// Map sector initiative labels from `becci.js` to track IDs cleanly
const SECTOR_TRACK_MAP = {
  "Manufacturing development": "manufacturing",
  "B2B Business Exchange": "exchange",
  "Business networking": "networking",
  "Business & entrepreneurship": "business",
  "Startup & innovation": "startup",
};

/**
 * Compute a transparent, deterministic Discovery Brief from BECCI's verified 335-scheme catalog.
 * Accepts optional live `schemesCatalog` from `useSchemesIndex()`, falling back to curated `SCHEMES`.
 */
export function buildDiscoveryBrief({ goalId, sectorId, stage = "all", schemesCatalog = null }) {
  const goal = EXPLORATION_GOALS.find((g) => g.id === goalId) || EXPLORATION_GOALS[0];
  const sector = SECTORS.find((s) => s.id === sectorId) || SECTORS[0];

  const pool =
    Array.isArray(schemesCatalog) && schemesCatalog.length > 0
      ? schemesCatalog.filter((s) => s.showOnBecci)
      : SCHEMES.map((s) => ({
          slug: s.slug || s.id,
          name: s.name,
          short: s.short,
          level: s.level,
          state: s.state || "All India",
          primaryCategory: s.categories?.[0] || s.type,
          categories: s.categories || [],
          ministry: s.ministry,
          agency: s.agency,
          benefitType: s.type,
          obcRelevant: Boolean(s.obcRelevant),
          entrepreneurRelevant: true,
          showOnBecci: true,
          featured: Boolean(s.featured),
          status: s.status || "",
          brief: s.desc,
          officialUrl: s.source,
          myschemeUrl: s.myschemeUrl || "",
          sourceCredit: s.sourceCredit || "Source: myScheme, Government of India",
          verifiedDate: s.lastVerified || SCHEME_DATASET_STATS.verifiedDate,
          stages: s.stages || [],
          tags: [],
        }));

  const goalCats = GOAL_CATEGORIES[goal.id] || [];
  const sectorKws = SECTOR_KEYWORDS[sector.id] || [];

  // 1. Score & match Government Schemes transparently by metadata overlap
  const scoredSchemes = pool
    .map((scheme) => {
      const reasons = [];
      let score = 0;

      // Stage compatibility (strict filter when user selects a specific stage)
      if (stage !== "all" && !(scheme.stages || []).includes(stage)) {
        return null;
      }

      // Exclude expired/closed schemes from top recommendations unless no others exist
      if (scheme.status === "Closed") {
        return null;
      }

      // Sector category match
      const catOverlap = (sector.schemeCategories || []).filter((c) =>
        (scheme.categories || []).includes(c)
      );
      if (catOverlap.length > 0) {
        score += 3 + catOverlap.length * 1.5;
        reasons.push(`Tagged under ${catOverlap.slice(0, 2).join(" & ")} for ${sector.name}`);
      }

      // Sector keyword match in name / brief / tags
      const hay = `${scheme.name} ${scheme.brief || ""} ${(scheme.tags || []).join(" ")}`.toLowerCase();
      const kwHits = sectorKws.filter((kw) => hay.includes(kw));
      if (kwHits.length > 0) {
        score += Math.min(4, kwHits.length * 1.5);
      }

      // Goal category match
      const goalOverlap = goalCats.filter((c) => (scheme.categories || []).includes(c));
      if (goalOverlap.length > 0) {
        score += 3 + Math.min(2, goalOverlap.length);
        reasons.push(`Aligns with ${goal.short.toLowerCase()} (${goalOverlap[0]})`);
      }

      // Goal preferred stage bonus
      if (goal.stages.length > 0) {
        const stageOverlap = goal.stages.filter((st) => (scheme.stages || []).includes(st));
        if (stageOverlap.length > 0) {
          score += 1.5;
        }
      }

      // Prioritize entrepreneur-relevant & OBC-relevant & flagship programmes
      if (scheme.entrepreneurRelevant) score += 1.5;
      if (scheme.obcRelevant) {
        score += 2.5;
        if (reasons.length < 2) {
          reasons.push("Priority OBC / Backward Classes government scheme");
        }
      }
      if (scheme.featured) {
        score += 3;
      }

      // Keep genuinely relevant items only
      if (score < 6) return null;

      return {
        ...scheme,
        id: scheme.slug,
        desc: scheme.brief,
        type: scheme.primaryCategory || scheme.benefitType || "Programme",
        source: scheme.officialUrl,
        lastVerified: scheme.verifiedDate,
        score,
        whyRelevant:
          (reasons.length > 0
            ? reasons.slice(0, 2).join(". ")
            : `Verified ${scheme.level} programme relevant to ${sector.name}`) + ".",
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  // 2. Match Practical Knowledge Guides (from verified 5 guides)
  const guideMap = new Map(INSIGHT_ARTICLES.map((a) => [a.slug, a]));
  const guides = goal.guideSlugs
    .map((slug) => guideMap.get(slug))
    .filter(Boolean)
    .map((article) => ({
      ...article,
      whyRelevant:
        article.slug === "how-to-register-on-udyam-free"
          ? `Foundational registration step for ${sector.name} units seeking official MSME recognition.`
          : article.slug === "getting-your-caste-bc-certificate"
            ? "Clarifies State BC vs. Central OBC-NCL documentation for Telangana, Andhra Pradesh and Central schemes."
            : article.slug === "pmegp-in-6-steps-obc-subsidy"
              ? `Step-by-step official KVIC workflow relevant when starting or expanding in ${sector.name}.`
              : article.slug === "which-loan-fits-you-decision-guide"
                ? "Compares official Central lending programmes by enterprise situation before visiting bank portals."
                : "Checklist of the five baseline identity, community, Udyam and banking records to keep ready.",
    }));

  // 3. Match Official Government Portals (deduplicated union of goal + sector portals)
  const desiredPortalNames = Array.from(
    new Set([...(goal.portalNames || []), ...(SECTOR_PORTALS[sector.id] || [])])
  );
  const portals = desiredPortalNames
    .map((name) => KNOWLEDGE_PORTALS.find((p) => p.name === name))
    .filter(Boolean)
    .slice(0, 6)
    .map((portal) => ({
      ...portal,
      whyRelevant: goal.portalNames.includes(portal.name)
        ? `Primary official portal supporting ${goal.short.toLowerCase()}.`
        : `Relevant statutory portal for ${sector.name} enterprises.`,
    }));

  // 4. Match Active Phase 01 Initiatives & Upcoming Future Tracks (honestly separated!)
  const activeInitiatives = PHASE_INITIATIVES;
  const sectorTrackIds = (sector.initiatives || [])
    .map((label) => SECTOR_TRACK_MAP[label])
    .filter(Boolean);
  const trackIdSet = Array.from(new Set([...(goal.futureTrackIds || []), ...sectorTrackIds]));
  const upcomingTracks = FUTURE_INITIATIVE_TRACKS.filter((t) => trackIdSet.includes(t.id));

  // 5. Relevant FAQs (strictly from verified 12 FAQs)
  const faqs = (goal.faqIndices || [0, 1, 8, 9])
    .map((idx) => FAQS[idx])
    .filter(Boolean);

  // 6. Curated Ecosystem Pathways (direct deep links into existing BECCI pages)
  const primarySchemeCategory = sector.schemeCategories?.[0];
  const ecosystemLinks = [
    {
      label: primarySchemeCategory
        ? `Filter ${primarySchemeCategory} Schemes`
        : "Open Full Scheme Finder",
      desc: `Use the full ${SCHEME_DATASET_STATS.totalShown}-programme Government Scheme Centre with state, OBC & category filters.`,
      to: primarySchemeCategory
        ? `/schemes?category=${encodeURIComponent(primarySchemeCategory)}`
        : "/schemes",
      status: "Available now",
    },
    {
      label: `Inspect ${sector.name} Sector`,
      desc: "View industry coverage and connected initiatives in the 11-Sector Explorer.",
      to: `/who-we-serve?sector=${sector.id}#sectors`,
      status: "Available now",
    },
    {
      label: "Membership & Eligibility Check",
      desc: "Compare Individual vs. Business membership and run the client-side eligibility check.",
      to: "/membership#eligibility",
      status: "Under development",
    },
    {
      label: "Knowledge Centre & 14 Portals",
      desc: "Read all five practical guides, official news dispatches and statutory links.",
      to: "/knowledge",
      status: "Available now",
    },
    {
      label: "BECCI Initiatives & 4-Phase Roadmap",
      desc: "Review active Phase 01 work alongside planned Phase 02–04 chamber programmes.",
      to: "/what-we-do#initiatives",
      status: "Active · Phase 01",
    },
    {
      label: "Prepare Secretariat Enquiry",
      desc: "Reach BECCI's Hyderabad office (+91 94943 03234) or format an enquiry locally.",
      to: `/contact?topic=${goal.id === "membership" ? "official" : "entrepreneur"}`,
      status: "Available now",
    },
  ];

  // 7. Honest unmatched explanation if strict stage filter returns 0 schemes
  const unmatchedSchemeNote =
    scoredSchemes.length === 0
      ? `No scheme in our verified ${SCHEME_DATASET_STATS.totalShown}-programme directory carries the exact combination of "${sector.name}", "${goal.short}" and "${stage}". Broaden the stage filter to "All enterprise stages" or inspect the full Government Scheme Centre.`
      : null;

  return {
    goal,
    sector,
    stage,
    schemes: scoredSchemes,
    unmatchedSchemeNote,
    guides,
    portals,
    membershipTypes: goal.id === "membership" || goal.id === "starting" ? MEMBERSHIP_TYPES : [],
    loanMatrix: goal.id === "finance" || goal.id === "schemes" ? LOAN_DECISION_GUIDE : [],
    activeInitiatives,
    upcomingTracks,
    faqs,
    ecosystemLinks,
  };
}
