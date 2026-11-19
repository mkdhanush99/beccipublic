// BECCI single source of truth — reconciled from BECCI_MASTER_DATA.md (19 Nov 2026),
// BECCI Website Content Pack (18 Nov 2026) and verified Government of India myScheme dataset (19 Nov 2026).
// Precedence: Explicit latest user rules > Verified myScheme dataset > Confirmed official BECCI facts > Master Data.
// Strict safeguards: zero invented leaders/stats/events/chapters; zero unconfirmed emails/social links;
// zero internal editorial notes in public UI; mandatory official portal links & myScheme attribution.

import {
  SCHEME_DATASET_STATS,
  BECCI_SCHEME_CATEGORIES,
  SCHEME_CATEGORY_ALIASES,
} from "./schemesMeta";

export { SCHEME_DATASET_STATS, BECCI_SCHEME_CATEGORIES, SCHEME_CATEGORY_ALIASES };

export const TBC = "[TO BE CONFIRMED]";

export const ORG = {
  name: "BECCI",
  full: "Bahujan Entrepreneurs Chamber for Commerce & Industry",
  tagline: "Building Businesses. Building Bharat.",
  type: "A national, not-for-profit Section 8 chamber for OBC/BC entrepreneurs, professionals and first-generation business owners — registered in Hyderabad in 2026.",
  hero: "Bringing entrepreneurs, enterprises and institutions together to connect skills with knowledge, finance, markets, networks and public schemes.",
  closing: "From skill to enterprise. From enterprise to prosperity. From prosperity to nation building.",
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "About BECCI", short: "About", to: "/about" },
  { label: "What We Do", to: "/what-we-do" },
  { label: "Who We Serve", to: "/who-we-serve" },
  { label: "Membership", to: "/membership" },
  { label: "Schemes", to: "/schemes" },
  { label: "Wings & Chapters", short: "Chapters", to: "/wings-chapters" },
  { label: "Knowledge", to: "/knowledge" },
  { label: "Contact", to: "/contact" },
];

export const ACRONYM = [
  {
    letter: "B",
    title: "The Many People",
    word: "Bahujan",
    line: "“The many people” — the larger sections of society whose inherited skills, crafts and trades built India's economy.",
    img: "craft",
    to: "/about",
    cta: "Why BECCI exists",
  },
  {
    letter: "E",
    title: "Skills Into Enterprises",
    word: "Entrepreneurs",
    line: "Founders, makers, artisans and professionals transforming capabilities into formal, sustainable enterprises.",
    img: "aspiring",
    to: "/what-we-do",
    cta: "What BECCI enables",
  },
  {
    letter: "C",
    title: "Not-for-Profit Chamber",
    word: "Chamber",
    line: "A Section 8 company registered in Hyderabad in 2026, organised across National, State, District and City tiers.",
    img: "about",
    to: "/wings-chapters",
    cta: "Explore our structure",
  },
  {
    letter: "C",
    title: "Commerce & Pathways",
    word: "Commerce",
    line: "Connecting OBC/BC entrepreneurs to knowledge, finance, markets, networks and verified government schemes.",
    img: "professionals",
    to: "/who-we-serve",
    cta: "Sectors & constituencies",
  },
  {
    letter: "I",
    title: "Enterprise to Industry",
    word: "Industry",
    line: "From first idea to established enterprise across eleven productive sectors — strengthening families and Bharat.",
    img: "manufacturers",
    to: "/membership",
    cta: "Membership guide",
  },
];

export const WHY_BAHUJAN = {
  etymology: [
    { part: "Bahu", meaning: "many" },
    { part: "jan", meaning: "people" },
  ],
  keyLine:
    "Entrepreneurship is the most sustainable pathway to economic empowerment. BECCI exists to make that pathway more accessible.",
  intro:
    "Bahujan means “the many people” — the larger sections of society. BECCI measures economic progress by how widely opportunity reaches them.",
  backboneHeading: "From “Backward Classes” to the “Backbone Classes” of India's economy",
  backboneBody:
    "For constitutional and administrative purposes these communities are recognised as Other Backward Classes or Backward Classes, and BECCI operates fully within that framework. For centuries they have been the nation's farmers, artisans, weavers, craftsmen, manufacturers, traders, transporters, food processors, service providers and skilled professionals.",
  occupations: [
    "Farmers",
    "Artisans",
    "Weavers",
    "Craftsmen",
    "Manufacturers",
    "Traders",
    "Transporters",
    "Food processors",
    "Service providers",
    "Skilled professionals",
  ],
  thought:
    "Many of these occupations changed with industrialisation. The skills did not disappear — BECCI sees them as one of India's greatest economic assets, and works to turn them into modern enterprises.",
  quote: {
    text: "Bahujana Hitāya, Bahujana Sukhāya.",
    original: "bahujanahitāya bahujanasukhāya",
    translation: "For the welfare of the many, for the happiness of the many.",
    attribution: "The Buddha",
    sourceLabel: "Vinaya Piṭaka, Mahāvagga I.11.1",
    sourceUrl: "https://buddhadust.net/dhamma-vinaya/sbe/vp/02.mv/vp.02.mv.01.rdho.sbe.htm",
    context:
      "In the Vinaya's account (Mahāvagga I.11.1), the Buddha says this when sending out his first sixty disciples to wander and teach, out of compassion for the world. In Pali, bahujana means “the many people”.",
    verified: true,
  },
};

// Personalities list intentionally kept empty until BECCI selects and approves names, photos and primary sources.
export const PERSONALITIES = [];

export const EMPOWERMENT_CHAIN = [
  { title: "Entrepreneurship transforms lives", note: "A single enterprise changes the trajectory of a founder." },
  { title: "Successful enterprises generate employment", note: "Growing businesses create livelihoods for others." },
  { title: "Employment strengthens families", note: "Stable income builds household resilience." },
  { title: "Strong families build prosperous communities", note: "Prosperous households anchor stronger local economies." },
  { title: "Prosperous communities strengthen the nation", note: "Widespread enterprise builds a stronger Bharat." },
];

export const JOURNEY = [
  { step: "Skill", line: "Inherited and learned skill — the starting capital of every enterprise." },
  { step: "Enterprise", line: "Formalise, modernise and scale with knowledge, finance, markets and mentorship." },
  { step: "Prosperity", line: "Successful enterprises generate employment and strengthen families and communities." },
  { step: "Nation Building", line: "Inclusive entrepreneurship powering local economies and Bharat's development." },
];

export const VISION_MISSION = {
  vision: {
    text: "To build a strong, connected and empowered entrepreneurial ecosystem that enables BC/OBC communities to transform their skills, ideas and enterprises into sustainable economic opportunities and contribute meaningfully to the development of Bharat.",
  },
  mission: {
    text: "To promote entrepreneurship, strengthen enterprises, facilitate access to knowledge and opportunities, encourage collaboration, and support the economic empowerment of BC/OBC communities through a professional, transparent and institution-driven chamber.",
  },
};

export const PILLARS = [
  { title: "Knowledge", desc: "Practical guides, learning and official portal orientation to make better business decisions." },
  { title: "Finance", desc: "Awareness of financial products, credit readiness and institutional lending pathways." },
  { title: "Markets", desc: "Pathways to buyers, public procurement (GeM) and enterprise collaboration." },
  { title: "Networks", desc: "Connections with peers, mentors, professionals and public institutions." },
  { title: "Government Schemes", desc: "Structured orientation to Central and State schemes linking straight to official sources." },
];

// Six formal institutional objectives (BECCI_PROFILE.md)
export const OBJECTIVES = [
  "Promote entrepreneurship as a driver of economic empowerment.",
  "Increase awareness of Government programmes, financial products and institutional initiatives.",
  "Facilitate entrepreneurship development programmes, business networking events and capacity-building initiatives.",
  "Support entrepreneurs in accessing technology, finance, markets, mentorship and institutional guidance.",
  "Encourage financial literacy, enterprise formalisation and responsible business practices.",
  "Facilitate constructive engagement between entrepreneurs and public institutions.",
];

// Nine core areas of work (BECCI_MASTER_DATA.md)
export const WORK_AREAS = [
  "Entrepreneurship promotion",
  "MSME & enterprise development",
  "Startup ecosystem support",
  "Government scheme facilitation",
  "Business networking",
  "Credit & financial inclusion",
  "Market access & business linkages",
  "Technology adoption & innovation",
  "Research, policy advocacy & knowledge support",
];

export const STAKEHOLDERS = [
  { name: "Government", brings: "Policies & programmes", desc: "Public ministries, departments and schemes BECCI looks to work alongside." },
  { name: "Financial Institutions", brings: "Finance & credit", desc: "Banks, SIDBI and state corporations relevant to enterprise credit." },
  { name: "Industry", brings: "Markets & opportunities", desc: "Established businesses, associations, buyers and value chains." },
  { name: "Academia & Research", brings: "Knowledge & innovation", desc: "Universities, testing labs and institutions supporting enterprise capability." },
];

export const AUDIENCES = [
  {
    title: "Aspiring Entrepreneurs",
    line: "First-generation founders and skilled individuals planning a first business — no Udyam or GST registration needed to join.",
    img: "aspiring",
  },
  {
    title: "Existing Businesses & MSMEs",
    line: "Proprietors, partnerships and companies in trading, services and industry — from micro units to established enterprises.",
    img: "msme",
  },
  {
    title: "Manufacturers",
    line: "Workshops, food processing, fabrication, textiles and industrial production units planning to set up or upgrade.",
    img: "manufacturers",
  },
  {
    title: "Professionals",
    line: "Chartered accountants, doctors, consultants, engineers and advisers who serve and mentor enterprises.",
    img: "professionals",
  },
  {
    title: "Students & Young Entrepreneurs",
    line: "Students, young innovators and first-generation founders supported through the Youth Wing.",
    img: "students",
  },
  {
    title: "Women Entrepreneurs",
    line: "Women founders, professionals and artisans building enterprise leadership through the Women's Wing.",
    img: "women",
  },
];

// Eleven verified industry sectors with supplied coverage descriptions and verified links (BECCI_MASTER_DATA.md)
export const SECTORS = [
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "Factory",
    covers: "Workshops, fabrication, food processing, textiles, engineering and industrial production units.",
    initiatives: ["Manufacturing development", "B2B Business Exchange"],
    schemeCategories: ["Technology, Quality & Certification", "Loans & Credit", "Subsidies & Grants"],
  },
  {
    id: "trading",
    name: "Trading & Distribution",
    icon: "Truck",
    covers: "Retail, wholesale, distribution, dealerships, agencies and logistics businesses.",
    initiatives: ["B2B Business Exchange", "Business networking"],
    schemeCategories: ["Loans & Credit", "Marketing, Export & Procurement"],
  },
  {
    id: "services",
    name: "Services",
    icon: "Handshake",
    covers: "Service providers of every kind, from repair and maintenance to business services.",
    initiatives: ["Business & entrepreneurship"],
    schemeCategories: ["Loans & Credit", "Subsidies & Grants"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "HeartPulse",
    covers: "Clinics, diagnostics, pharmacies, medical suppliers and healthcare professionals.",
    initiatives: ["Business networking"],
    schemeCategories: ["Loans & Credit", "Insurance & Social Security"],
  },
  {
    id: "education",
    name: "Education & Training",
    icon: "GraduationCap",
    covers: "Schools, coaching, skill-training providers and educators.",
    initiatives: ["Business & entrepreneurship"],
    schemeCategories: ["Skill Development & Training", "Education & Scholarships"],
  },
  {
    id: "agriculture",
    name: "Agriculture & Allied Activities",
    icon: "Sprout",
    covers: "Farming, dairy, fisheries, poultry, agri-processing and farm services.",
    initiatives: ["Startup & innovation"],
    schemeCategories: ["Agriculture, Dairy & Food Processing", "Subsidies & Grants"],
  },
  {
    id: "it",
    name: "IT & Technology",
    icon: "Cpu",
    covers: "Software, IT services, digital businesses and technology startups.",
    initiatives: ["Startup & innovation"],
    schemeCategories: ["Startup & Innovation", "Technology, Quality & Certification"],
  },
  {
    id: "construction",
    name: "Construction & Infrastructure",
    icon: "Building2",
    covers: "Contractors, builders, building materials and infrastructure services.",
    initiatives: ["Business & entrepreneurship"],
    schemeCategories: ["Loans & Credit", "Credit Guarantee"],
  },
  {
    id: "finance",
    name: "Finance & Professional Services",
    icon: "Landmark",
    covers: "Chartered accountants, consultants, lawyers, financial advisers and other professionals.",
    initiatives: ["Business networking"],
    schemeCategories: ["Startup & Innovation", "Loans & Credit"],
  },
  {
    id: "hospitality",
    name: "Hospitality & Tourism",
    icon: "Hotel",
    covers: "Hotels, restaurants, catering, travel and tourism businesses.",
    initiatives: ["Business & entrepreneurship"],
    schemeCategories: ["Loans & Credit", "Subsidies & Grants"],
  },
  {
    id: "other",
    name: "Other Industries",
    icon: "Boxes",
    covers: "Any enterprise not listed above. Additional sector groupings will be added as membership grows.",
    initiatives: ["All initiatives"],
    schemeCategories: ["OBC / Backward Classes", "Artisans & Traditional Trades"],
  },
];

export const ORG_LEVELS = [
  { level: "National", desc: "Governing leadership, policy engagement, standards and institutional partnerships." },
  { level: "State", desc: "State chapters, coordination and state membership desks." },
  { level: "District", desc: "District chapters and grassroots entrepreneurial outreach." },
  { level: "City", desc: "City chapters close to members and local enterprises." },
];

// Governance reporting hierarchy (BECCI_MASTER_DATA.md) — members published only once formally approved
export const GOVERNANCE_STRUCTURE = [
  { body: "Advisory Board", role: "Guides BECCI's long-term institutional direction." },
  { body: "Board of Directors", role: "Governing board of the Section 8 not-for-profit company." },
  { body: "Office Bearers", role: "President · Vice Presidents · General Secretary · Joint Secretaries · Treasurer." },
  { body: "State, District & City Incharges", role: "Chapter coordination and administrative operations across tiers." },
];

export const WINGS = [
  {
    name: "Women's Wing",
    desc: "Dedicated to women entrepreneurs and professionals — building enterprise, leadership and networks across the chapter structure.",
  },
  {
    name: "Youth Wing",
    desc: "For students, young professionals and first-generation founders taking their first steps in enterprise and innovation.",
  },
];

export const MEMBERSHIP_TYPES = [
  {
    id: "individual",
    title: "Individual Membership",
    audience: "Entrepreneurs, aspiring founders, salaried professionals, students and others — whether or not you run a business today.",
    provide: [
      "Personal and address details",
      "Community certificate (Central OBC list or State BC/OBC list)",
      "Current status and business interest areas (no Udyam or GST needed)",
    ],
  },
  {
    id: "business",
    title: "Business Membership",
    audience: "Enterprises applied for by the proprietor, partner, director or authorised representative.",
    provide: [
      "Enterprise name, industry sector and products or services",
      "Representative details, authorisation and community certificate",
      "Udyam, GSTIN, CIN or LLPIN where applicable",
    ],
  },
];

export const MEMBERSHIP_STEPS = [
  {
    title: "Apply online",
    desc: "Choose individual or business membership, share your details and upload your community certificate.",
  },
  {
    title: "Verify mobile (OTP)",
    desc: "An SMS OTP creates a temporary record. OTP verification alone never makes you a member.",
  },
  {
    title: "Document verification",
    desc: "Authorised BECCI staff review your certificate and may request clarifying documents.",
  },
  {
    title: "Choose category",
    desc: "Approved applicants choose the membership category suited to their profile.",
  },
  {
    title: "Become active",
    desc: "Complete membership formalities to activate your chamber membership.",
  },
];

export const MEMBERSHIP_NOTE =
  "Membership requirements and government scheme eligibility are separate matters. Meeting one does not determine the other.";

// Honest status legend definitions (BECCI_MASTER_DATA.md)
export const STATUS_LEGEND = [
  { label: "Available now", desc: "Live on this public website and ready to use today." },
  { label: "Under development", desc: "Being built for the initial launch phase. Not yet open." },
  { label: "Coming soon", desc: "Part of the member portal scheduled for Phase 02." },
  { label: "Planned", desc: "Approved direction for later phases; scope and timing to be announced." },
];

// Four-phase platform rollout (BECCI_MASTER_DATA.md)
export const PLATFORM_PHASES = [
  {
    phase: "Phase 01",
    tag: "We are here",
    title: "Core Website, Schemes & Membership Foundation",
    items: [
      { title: "Public website, verified schemes & Knowledge Centre", status: "Available now" },
      { title: "District outreach & state membership desks (TG & AP)", status: "Active · Phase 01" },
      { title: "Online membership application & document verification", status: "Under development" },
      { title: "Secure member login with SMS OTP", status: "Under development" },
    ],
  },
  {
    phase: "Phase 02",
    title: "Member Portal & Business Networking",
    items: [
      { title: "Members directory with contact privacy controls", status: "Coming soon" },
      { title: "Business networking, referrals & one-to-one meetings", status: "Coming soon" },
      { title: "B2B Business Exchange (buy, sell, RFQs & partnerships)", status: "Coming soon" },
      { title: "Personalised scheme recommendations & event registration", status: "Coming soon" },
    ],
  },
  {
    phase: "Phase 03",
    title: "Manufacturing, Startups & Innovation",
    items: [
      { title: "Incubation, mentors & investor connect", status: "Planned" },
      { title: "Manufacturing development & supplier programmes", status: "Planned" },
      { title: "Grassroots innovation & rural entrepreneurship challenges", status: "Planned" },
    ],
  },
  {
    phase: "Phase 04",
    title: "Mobile Apps & Multilingual Access",
    items: [
      { title: "Android & iOS apps on the same member account", status: "Planned" },
      { title: "Multilingual & voice-assisted access", status: "Planned" },
    ],
  },
];

// Compact flat roadmap chips (reused on Home & Pulse)
export const ROADMAP = [
  { title: "Online membership & SMS OTP login", status: "Under development" },
  { title: "Members directory & networking", status: "Coming soon" },
  { title: "B2B Business Exchange", status: "Coming soon" },
  { title: "Incubation, mentors & investor connect", status: "Planned" },
  { title: "Manufacturing development", status: "Planned" },
  { title: "Mobile apps & multilingual access", status: "Planned" },
];

// Organisational timeline milestones (verified records vs. planned roadmap — BECCI_MASTER_DATA.md)
export const MILESTONES = [
  {
    when: "2026",
    title: "Incorporated as a Section 8 company",
    detail: "Registered with the Ministry of Corporate Affairs (CIN U94110TS2026NPL222589), with its registered office in Begumpet, Hyderabad.",
    status: "Available now",
    verified: true,
  },
  {
    when: "2026",
    title: "Phase 01 begins — outreach & public information platform",
    detail: "Public website, verified Central & State scheme orientation, practical guides, district-level outreach and state membership desks beginning with Telangana and Andhra Pradesh.",
    status: "Active · Phase 01",
    verified: true,
  },
  {
    when: "Phase 01",
    title: "Online membership application & SMS OTP login",
    detail: "Online registration, encrypted document verification and member sign-in.",
    status: "Under development",
    verified: false,
  },
  {
    when: "Phase 02",
    title: "Member portal, networking & B2B Business Exchange",
    detail: "Privacy-controlled members directory, referral networking, B2B exchange and personalised scheme recommendations.",
    status: "Coming soon",
    verified: false,
  },
  {
    when: "Phase 03",
    title: "Manufacturing development, startups & incubation",
    detail: "Manufacturing setup guidance, supplier linkages, incubation, mentorship and investor connect.",
    status: "Planned",
    verified: false,
  },
  {
    when: "Phase 04",
    title: "Mobile apps & multilingual access",
    detail: "Android and iOS apps alongside multilingual and voice-assisted access.",
    status: "Planned",
    verified: false,
  },
];

// Five planned / upcoming programme tracks (BECCI_MASTER_DATA.md) — honestly separated from Phase 01 active work
export const FUTURE_INITIATIVE_TRACKS = [
  {
    id: "business",
    title: "Business & Entrepreneurship Development",
    status: "Planned",
    desc: "Business planning, MSME finance & credit readiness, registration & compliance orientation, tender/procurement guidance, export development and delayed-payment grievance awareness.",
  },
  {
    id: "manufacturing",
    title: "Manufacturing Development",
    status: "Planned",
    desc: "Setup guidance, machinery & technology selection, factory project-report orientation, quality certification (such as ZED), PLI awareness and supplier/vendor linkages.",
  },
  {
    id: "startup",
    title: "Startup & Innovation",
    status: "Planned",
    desc: "DPIIT recognition orientation, business-model validation, incubation, mentor networks, investor connect and grassroots rural innovation.",
    disclaimer: "BECCI does not guarantee investment and does not act as a regulated investment intermediary.",
  },
  {
    id: "networking",
    title: "Structured Business Networking",
    status: "Coming soon",
    desc: "Member-to-member networking, tracked business referrals, one-to-one meetings and peer mentorship for Networking category members.",
    disclaimer: "Available only to the Networking membership category once membership tiers open.",
  },
  {
    id: "exchange",
    title: "B2B Business Exchange",
    status: "Coming soon",
    desc: "A members-only exchange for buy/sell requirements, RFQs, distributor & dealer connections, joint ventures and business enquiries without exposing private phone numbers.",
    disclaimer: "Member identity verification on the exchange will not constitute a guarantee of product quality or commercial performance.",
  },
];

// Strict Government Scheme Registry — follows BECCI_MASTER_DATA.md publication rule:
// No unverified loan limits, subsidy percentages or interest slabs quoted as guaranteed terms.
// Every record links straight to official government sources and displays honest verification status.
export const SCHEME_STAGES = [
  "Aspiring entrepreneur",
  "New entrepreneur",
  "Existing micro enterprise",
  "Growing enterprise",
];

export const SCHEME_NEEDS = [
  { id: "Loan", label: "Concessional / business loan" },
  { id: "Credit-linked subsidy", label: "Subsidy on a project loan" },
  { id: "Credit guarantee", label: "Credit without collateral" },
  { id: "Integrated support", label: "Artisan training, toolkit & credit" },
  { id: "Skill development", label: "Free skills & up-skilling" },
  { id: "Seed funding", label: "Startup seed / venture support" },
  { id: "Certification", label: "Quality certification (ZED)" },
  { id: "State welfare", label: "State BC Corporation schemes" },
];

// Flagship curated schemes (synced with exact slugs in verified 335-scheme myScheme catalog — 19 Nov 2026)
export const SCHEMES = [
  {
    id: "nbcfdc-gls",
    slug: "nbcfdc-gls",
    short: "NBCFDC",
    featured: true,
    obcRelevant: true,
    level: "Central",
    state: "All India",
    name: "NBCFDC General Loan Scheme",
    ministry: "Ministry of Social Justice and Empowerment",
    agency: "National Backward Classes Finance & Development Corporation (via State BC Corporations)",
    type: "Loan",
    categories: ["OBC / Backward Classes", "Loans & Credit", "Subsidies & Grants"],
    beneficiaries: "Backward Class (OBC) entrepreneurs within notified annual family income limits for income-generating activities across agriculture, small business, artisans, transport and services.",
    stages: ["Aspiring entrepreneur", "New entrepreneur", "Existing micro enterprise"],
    desc: "Concessional loan scheme by the Ministry of Social Justice & Empowerment through NBCFDC for Indian citizens from Backward Classes — supporting loans up to ₹15 Lakh per beneficiary for income-generating activities.",
    lastVerified: "19 Nov 2026",
    source: "https://nbcfdc.gov.in/loan-scheme-description/1/en",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/nbcfdc-gls",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "pmegp",
    slug: "pmegp",
    short: "PMEGP",
    featured: true,
    level: "Central",
    state: "All India",
    name: "Prime Minister's Employment Generation Programme",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    agency: "Khadi and Village Industries Commission (KVIC), KVIB & DIC",
    type: "Credit-linked subsidy",
    categories: ["Loans & Credit", "Subsidies & Grants", "Startup & Innovation", "Skill Development & Training", "Employment & Jobs"],
    beneficiaries: "Individuals aged 18+ setting up new non-farm micro enterprises in manufacturing or services; OBC applicants qualify under the Special Category margin-money subsidy tier.",
    stages: ["Aspiring entrepreneur", "New entrepreneur"],
    desc: "Flagship credit-linked margin-money subsidy scheme administered by the Ministry of MSME and KVIC for establishing new non-farm micro enterprises in rural and urban areas.",
    lastVerified: "19 Nov 2026",
    source: "https://www.kviconline.gov.in/pmegpeportal/",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/pmegp",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "pmv",
    slug: "pmv",
    short: "PM Vishwakarma",
    featured: true,
    level: "Central",
    state: "All India",
    name: "PM Vishwakarma",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    agency: "Ministry of MSME (registration via pmvishwakarma.gov.in or CSC)",
    type: "Integrated support",
    categories: ["Loans & Credit", "Subsidies & Grants", "Artisans & Traditional Trades", "Skill Development & Training", "Technology, Quality & Certification"],
    beneficiaries: "Artisans and craftspeople aged 18+ working across 18 notified traditional trades (one member per family).",
    stages: ["Aspiring entrepreneur", "New entrepreneur", "Existing micro enterprise"],
    desc: "End-to-end holistic support covering PM Vishwakarma Certificate & ID Card, basic and advanced skill training with stipend, modern toolkit incentive, collateral-free credit support, digital-transaction incentives and marketing linkage.",
    trades: [
      "Carpenter", "Boat maker", "Armourer", "Blacksmith", "Hammer & toolkit maker", "Locksmith",
      "Goldsmith", "Potter", "Sculptor / stone carver", "Cobbler", "Mason", "Basket / mat / broom maker",
      "Doll & toy maker", "Barber", "Garland maker", "Washerman", "Tailor", "Fishing-net maker",
    ],
    lastVerified: "19 Nov 2026",
    source: "https://pmvishwakarma.gov.in/",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/pmv",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "pmmy",
    slug: "pmmy",
    short: "PMMY (MUDRA)",
    featured: true,
    level: "Central",
    state: "All India",
    name: "Pradhan Mantri Mudra Yojana",
    ministry: "Ministry of Finance (Department of Financial Services)",
    agency: "MUDRA — via Commercial Banks, RRBs, Small Finance Banks, NBFCs & MFIs",
    type: "Loan",
    categories: ["Loans & Credit", "Startup & Innovation"],
    beneficiaries: "Non-corporate, non-farm micro and small enterprises across manufacturing, trading and services.",
    stages: ["New entrepreneur", "Existing micro enterprise"],
    desc: "Collateral-free institutional micro-enterprise credit structured across progressive lending categories — Shishu, Kishor, Tarun and Tarun Plus — via participating banks and financial institutions.",
    lastVerified: "19 Nov 2026",
    source: "https://www.mudra.org.in/",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/pmmy",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "cgtmse",
    slug: "cgtmse",
    short: "CGTMSE",
    featured: true,
    level: "Central",
    state: "All India",
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    agency: "CGTMSE & SIDBI",
    type: "Credit guarantee",
    categories: ["Credit Guarantee", "Loans & Credit"],
    beneficiaries: "New and existing micro and small enterprises applying through Member Lending Institutions.",
    stages: ["New entrepreneur", "Existing micro enterprise", "Growing enterprise"],
    desc: "Credit guarantee coverage enabling participating banks and Member Lending Institutions to extend collateral-free term loans and working capital to eligible micro and small enterprises.",
    lastVerified: "19 Nov 2026",
    source: "https://www.cgtmse.in/",
    sourceCredit: "Source: CGTMSE, Ministry of MSME & SIDBI",
  },
  {
    id: "sui",
    slug: "sui",
    short: "Stand-Up India",
    featured: true,
    level: "Central",
    state: "All India",
    name: "Stand-Up India",
    ministry: "Ministry of Finance",
    agency: "SIDBI & Scheduled Commercial Banks",
    type: "Loan",
    categories: ["Women Entrepreneurs", "Loans & Credit", "Startup & Innovation"],
    beneficiaries: "Women entrepreneurs (including OBC women) and SC/ST entrepreneurs setting up greenfield enterprises.",
    stages: ["New entrepreneur"],
    desc: "Composite bank loans facilitating greenfield enterprises in manufacturing, services, agri-allied activities or trading.",
    lastVerified: "19 Nov 2026",
    source: "https://www.standupmitra.in/",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/sui",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "pm-daksh",
    slug: "pm-daksh",
    short: "PM-DAKSH",
    featured: true,
    obcRelevant: true,
    level: "Central",
    state: "All India",
    name: "Pradhan Mantri Dakshta Aur Kushalta Sampann Hitgrahi (PM-DAKSH)",
    ministry: "Ministry of Social Justice and Empowerment",
    agency: "Implemented with NBCFDC and partner corporations",
    type: "Skill development",
    categories: ["OBC / Backward Classes", "Skill Development & Training", "Employment & Jobs"],
    beneficiaries: "Eligible target groups including Backward Classes (OBCs), EBCs, DNTs and SCs seeking free vocational skill training and up-skilling.",
    stages: ["Aspiring entrepreneur"],
    desc: "Free short-term, long-term, up-skilling and entrepreneurship development training programmes with stipends to strengthen employability and self-employment.",
    lastVerified: "19 Nov 2026",
    source: "https://pmdaksh.dosje.gov.in/",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/pm-daksh",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "sisfs-fs",
    slug: "sisfs-fs",
    short: "SISFS",
    featured: true,
    level: "Central",
    state: "All India",
    name: "Startup India Seed Fund Scheme - For Startups",
    ministry: "Ministry of Commerce and Industry (DPIIT)",
    agency: "DPIIT through selected incubators",
    type: "Seed funding",
    categories: ["Startup & Innovation", "Subsidies & Grants", "Loans & Credit"],
    beneficiaries: "DPIIT-recognised startups applying through participating incubators.",
    stages: ["New entrepreneur", "Growing enterprise"],
    desc: "Early-stage seed support through incubators for proof of concept, prototype development, product trials, market entry and commercialisation.",
    lastVerified: "19 Nov 2026",
    source: "https://seedfund.startupindia.gov.in/",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/sisfs-fs",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "vcf-bc",
    slug: "vcf-bc",
    short: "VCF-BC",
    featured: true,
    obcRelevant: true,
    level: "Central",
    state: "All India",
    name: "Venture Capital Fund for Backward Classes (VCF-BC)",
    ministry: "Ministry of Social Justice and Empowerment",
    agency: "IFCI Venture Capital Funds Ltd.",
    type: "Seed funding",
    categories: ["OBC / Backward Classes", "Startup & Innovation", "Loans & Credit"],
    beneficiaries: "Scalable enterprises promoted by Backward Class entrepreneurs meeting fund eligibility rules.",
    stages: ["New entrepreneur", "Growing enterprise"],
    desc: "Dedicated venture capital financing initiative supporting growth-stage and innovative enterprises led by Backward Class promoters.",
    lastVerified: "19 Nov 2026",
    source: "https://www.ifciventure.com/",
    sourceCredit: "Source: IFCI Venture / Ministry of Social Justice & Empowerment",
  },
  {
    id: "mszcs",
    slug: "mszcs",
    short: "MSME ZED",
    featured: true,
    level: "Central",
    state: "All India",
    name: "MSME Sustainable (ZED) Certification Scheme",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    agency: "Quality Council of India / Ministry of MSME",
    type: "Certification",
    categories: ["Technology, Quality & Certification", "Subsidies & Grants"],
    beneficiaries: "Udyam-registered MSMEs strengthening quality and environmental competitiveness.",
    stages: ["Existing micro enterprise", "Growing enterprise"],
    desc: "Zero Defect Zero Effect (ZED) certification supporting Indian MSMEs to improve manufacturing quality, reduce waste and access larger domestic and global buyers.",
    lastVerified: "19 Nov 2026",
    source: "https://zed.msme.gov.in/",
    myschemeUrl: "https://www.myscheme.gov.in/schemes/mszcs",
    sourceCredit: "Source: myScheme, Government of India",
  },
  {
    id: "rajiv-yuva-vikasam",
    slug: "rajiv-yuva-vikasam",
    short: "Rajiv Yuva Vikasam",
    featured: true,
    obcRelevant: true,
    level: "State",
    state: "Telangana",
    status: "Awaiting rollout",
    name: "Telangana Rajiv Yuva Vikasam",
    ministry: "Government of Telangana",
    agency: "Telangana State Welfare & BC Corporations",
    type: "State welfare",
    categories: ["OBC / Backward Classes", "Subsidies & Grants", "Loans & Credit"],
    beneficiaries: "Eligible youth and Backward Class self-employment applicants in Telangana (pending operational rollout).",
    stages: ["Aspiring entrepreneur", "New entrepreneur"],
    desc: "Proposed Telangana state self-employment subsidy assistance programme. Monitor official Telangana Government notifications for active rollout status and final guidelines.",
    lastVerified: "19 Nov 2026",
    source: "https://telanganatoday.com/one-year-on-rajiv-yuva-vikasam-scheme-yet-to-take-off-in-telangana",
    sourceCredit: "Source: Government of Telangana / Public Reporting",
  },
  {
    id: "ap-obmms",
    slug: "ap-obmms",
    short: "AP BC OBMMS",
    featured: true,
    obcRelevant: true,
    level: "State",
    state: "Andhra Pradesh",
    name: "Andhra Pradesh BC Corporation Schemes (OBMMS)",
    ministry: "Government of Andhra Pradesh",
    agency: "AP Backward Classes Cooperative Finance Corporation",
    type: "State welfare",
    categories: ["OBC / Backward Classes", "Subsidies & Grants", "Loans & Credit"],
    beneficiaries: "Eligible Backward Class applicants in Andhra Pradesh applying via the state portal.",
    stages: ["Aspiring entrepreneur", "New entrepreneur", "Existing micro enterprise"],
    desc: "State Backward Classes welfare and self-employment support programmes administered through Andhra Pradesh's Online Beneficiary Management & Monitoring System (OBMMS).",
    lastVerified: "19 Nov 2026",
    source: "https://apfinance.gov.in/",
    sourceCredit: "Source: Government of Andhra Pradesh",
  },
];

export const SCHEME_NOTE =
  "Verified scheme data is compiled from myScheme (Government of India) and official implementing portals as of 19 Nov 2026 for guidance only and may be updated by ministries over time. BECCI is not a government agency, does not process applications, and does not guarantee eligibility, approval, subsidy or loan sanction. Always verify live guidelines on the official scheme portal before applying. BECCI never collects portal passwords, OTPs or fees for scheme information.";

export const SCHEME_CARD_NOTE =
  "Source: myScheme, Government of India / Official Implementing Portals (Verified 19 Nov 2026). BECCI provides orientation only — apply directly on the official portal.";

export const NEWS = [
  {
    id: "section-8-incorporation",
    kind: "Organisation news",
    year: "2026",
    title: "BECCI is incorporated as a Section 8 company",
    body: "The Bahujan Entrepreneurs Chamber for Commerce & Industry is registered under Section 8 of the Companies Act, 2013 with the Ministry of Corporate Affairs (CIN U94110TS2026NPL222589), with its registered office at Begumpet, Hyderabad.",
  },
  {
    id: "phase-01-rollout",
    kind: "Announcement",
    year: "2026",
    title: "Phase 01: district outreach and state membership desks",
    body: "BECCI begins its national rollout in phases, starting with Telangana and Andhra Pradesh. Phase 01 focuses on district-level outreach and state membership desks to reach artisans, small business owners and aspiring founders. Chapter locations and dates will be published as they are confirmed.",
  },
];

// Events list intentionally kept empty until BECCI confirms real dates and venues.
export const EVENTS = [];

// 14 Official Government Portals with summaries, topics and authorities (BECCI_MASTER_DATA.md)
export const KNOWLEDGE_PORTALS = [
  {
    name: "Udyam Registration",
    url: "https://udyamregistration.gov.in/",
    topic: "compliance",
    source: "Ministry of MSME",
    summary: "Free official MSME registration, required for most MSME schemes and priority lending.",
  },
  {
    name: "GST Portal",
    url: "https://www.gst.gov.in/",
    topic: "compliance",
    source: "GST Network",
    summary: "Goods and Services Tax registration, returns and statutory payments.",
  },
  {
    name: "Ministry of Corporate Affairs (MCA)",
    url: "https://www.mca.gov.in/",
    topic: "compliance",
    source: "Ministry of Corporate Affairs",
    summary: "Company and LLP incorporation, statutory filings and public corporate records.",
  },
  {
    name: "NCBC (Central OBC Lists)",
    url: "https://ncbc.nic.in/",
    topic: "compliance",
    source: "Government of India",
    summary: "Central OBC community lists by State, used to verify eligibility.",
  },
  {
    name: "Ministry of MSME",
    url: "https://msme.gov.in/",
    topic: "finance",
    source: "Ministry of MSME",
    summary: "Schemes, notifications and institutional programmes for micro, small and medium enterprises.",
  },
  {
    name: "SIDBI",
    url: "https://www.sidbi.in/",
    topic: "finance",
    source: "SIDBI",
    summary: "Small Industries Development Bank of India — MSME finance and credit support programmes.",
  },
  {
    name: "NBCFDC",
    url: "https://nbcfdc.gov.in/",
    topic: "finance",
    source: "Ministry of Social Justice & Empowerment",
    summary: "Concessional enterprise loans for Backward Classes through State BC Corporations.",
  },
  {
    name: "MSME Samadhaan",
    url: "https://samadhaan.msme.gov.in/",
    topic: "finance",
    source: "Ministry of MSME",
    summary: "Delayed-payment monitoring and dispute filing portal for micro and small enterprises.",
  },
  {
    name: "Government e-Marketplace (GeM)",
    url: "https://gem.gov.in/",
    topic: "growth",
    source: "Ministry of Commerce & Industry",
    summary: "Register as a seller to supply goods and services directly to government buyers.",
  },
  {
    name: "NSIC",
    url: "https://www.nsic.co.in/",
    topic: "growth",
    source: "Ministry of MSME",
    summary: "National Small Industries Corporation — marketing, procurement and technology support.",
  },
  {
    name: "Startup India",
    url: "https://www.startupindia.gov.in/",
    topic: "growth",
    source: "DPIIT",
    summary: "DPIIT startup recognition, regulatory awareness and national startup learning resources.",
  },
  {
    name: "Startup India Seed Fund",
    url: "https://seedfund.startupindia.gov.in/",
    topic: "growth",
    source: "DPIIT",
    summary: "Seed support for DPIIT-recognised startups through participating incubators.",
  },
  {
    name: "Skill India Digital",
    url: "https://www.skillindiadigital.gov.in/",
    topic: "growth",
    source: "Ministry of Skill Development & Entrepreneurship",
    summary: "Official national portal for vocational skilling courses, certifications and apprenticeships.",
  },
  {
    name: "PM Vishwakarma",
    url: "https://pmvishwakarma.gov.in/",
    topic: "growth",
    source: "Ministry of MSME",
    summary: "Official registration portal for artisans and craftspeople across 18 traditional trades.",
  },
];

// 12 Authoritative Membership FAQs — cleaned of internal editorial tags and unconfirmed email
export const FAQS = [
  {
    q: "Who can join BECCI?",
    a: "Entrepreneurs, aspiring entrepreneurs, professionals and students from communities recognised as OBC/BC — in either the Central OBC list for your state or your state's official BC/OBC list. You do not need to appear on both lists.",
  },
  {
    q: "I don't run a business yet. Can I still join?",
    a: "Yes. Aspiring entrepreneurs, students and professionals can join as Individual Members. You will not be asked for Udyam, GST or other business registrations.",
  },
  {
    q: "Is BECCI a political organisation?",
    a: "No. BECCI is a non-political, not-for-profit Section 8 company (CIN U94110TS2026NPL222589). It works with governments, financial institutions, industry and academia for inclusive economic empowerment.",
  },
  {
    q: "Which states are covered in Phase 01?",
    a: "BECCI is launching its initial membership desks and district outreach in Telangana and Andhra Pradesh, with other states following in phases.",
  },
  {
    q: "What documents do I need when applications open?",
    a: "Your mobile number, date of birth, address and a caste/community certificate. Business members may also provide Udyam, GSTIN, CIN or LLPIN details where applicable.",
  },
  {
    q: "How does verification work, and how long does it take?",
    a: "Once online applications open, verifying your mobile number by SMS OTP creates a temporary record only — OTP alone never grants membership. BECCI's authorised team then reviews your community certificate. Target verification turnaround timelines will be published when online onboarding opens.",
  },
  {
    q: "Is there a membership fee?",
    a: "Membership categories, fees, renewal periods and benefits are being finalised by BECCI's governing body and will be published here once approved. BECCI does not collect online fees during the current phase.",
  },
  {
    q: "Will my caste or community be shown to other members?",
    a: "No. Your community certificate is seen only by authorised verification staff and never appears in public profiles or the members directory.",
  },
  {
    q: "Will BECCI share my data with banks or lenders?",
    a: "No. BECCI does not sell member data or share it with banks or lenders. When you explore a finance or scheme option, we direct you to the official implementing website so you apply directly.",
  },
  {
    q: "Does BECCI guarantee loans or government scheme approval?",
    a: "No. Membership eligibility and government scheme eligibility are completely separate. BECCI provides orientation and guidance only; approval is always decided solely by the government department or bank.",
  },
  {
    q: "My community was in a list when I joined but later changed. Will I lose membership?",
    a: "No. Removal from a list does not automatically cancel an existing approved membership. BECCI records the basis on which you were approved and reviews any case under its membership policy.",
  },
  {
    q: "How do I contact the BECCI secretariat?",
    a: "Call +91 94943 03234 (Monday to Saturday, 9:30 am – 6:30 pm IST), prepare an enquiry on our Contact page, or visit our registered office at AltF Green Tower, Begumpet, Hyderabad (prior appointment recommended).",
  },
];

// Official confirmed contact details — unconfirmed email (becciglobal@gmail.com vs info@becci.in)
// and unconfirmed social URLs are intentionally left null / omitted per Master Data §0.1 & §3.
export const CONTACT = {
  org: ORG.full,
  phone: "+91 94943 03234",
  email: null,
  address: "H. No. 1-10-176, AltF Green Tower, Main Road, Begumpet, Hyderabad 500016, Telangana, India",
  hours: "Monday to Saturday, 9:30 am – 6:30 pm IST",
  website: "www.becci.in",
  cin: "U94110TS2026NPL222589",
  incorporation: "Section 8, not-for-profit company, incorporated 2026",
};

// Authoritative, publicly sourced historical economic & MSME figures (always cited with exact survey year & primary source).
export const HEADLINE_FACT_LINE =
  "OBC entrepreneurs own nearly half of India's small businesses, yet only about 30% of registered MSMEs. BECCI exists to close that gap.";

export const VERIFIED_STATS = [
  {
    id: "obc-share",
    figure: "49.72%",
    label: "OBC-owned proprietary MSMEs",
    detail: "Nearly 1 in 2 small businesses in India was OBC-owned (51.59% rural, 47.8% urban) in India's latest all-MSME survey.",
    year: "Historical · NSS 73rd Round, 2015–16",
    sourceLabel: "Ministry of MSME",
    sourceUrl: "https://www.dcmsme.gov.in/Pillar%204.pdf",
  },
  {
    id: "formalisation-gap",
    figure: "~30%",
    label: "OBC share of Udyam-registered MSMEs",
    detail: "23.31 lakh of 80.16 lakh Udyam-registered units were OBC-owned — far below their ~50% share of all MSMEs.",
    year: "Snapshot · Udyam data, 31 Mar 2022",
    sourceLabel: "The Hindu via inkl",
    sourceUrl: "https://inkl.com/news/other-backward-classes-own-nearly-30-of-msmes-in-the-country",
  },
  {
    id: "total-msmes",
    figure: "633.88L",
    label: "Unincorporated non-farm MSMEs",
    detail: "India recorded 633.88 lakh unincorporated non-farm MSMEs; 95.98% were proprietary concerns.",
    year: "Historical · NSS 73rd Round, 2015–16",
    sourceLabel: "NSS 73rd Round / Entrepreneur India",
    sourceUrl: "https://entrepreneur.com/en-in/news-and-trends/how-msmes-uphold-the-backbone-of-indias-economy/478709",
  },
  {
    id: "msme-jobs",
    figure: "11.10 Cr",
    label: "People employed by MSMEs",
    detail: "Unincorporated non-farm MSMEs employed roughly 11.10 crore people across rural and urban India.",
    year: "Historical · NSS 73rd Round, 2015–16",
    sourceLabel: "NSS 73rd Round / Entrepreneur India",
    sourceUrl: "https://entrepreneur.com/en-in/news-and-trends/how-msmes-uphold-the-backbone-of-indias-economy/478709",
  },
];

// Regional context for Phase 01 launch states (Telangana & Andhra Pradesh), neutrally sourced.
export const REGIONAL_CONTEXT = [
  {
    state: "Telangana",
    tag: "Phase 01 Launch State · Registered Office",
    headline: "56.33% Backward Classes population (2024–25 survey)",
    detail:
      "Backward Classes account for 56.33% of Telangana's population (1,99,85,767 people, including BC Muslims at 10.08%), per the Telangana Government's 2024–25 SEEEPC survey.",
    sources: [
      { label: "Business Standard", url: "https://www.business-standard.com/india-news/telangana-caste-survey-backward-classes-sc-st-muslim-congress-revanth-reddy-125020300372_1.html" },
      { label: "Scroll", url: "https://scroll.in/latest/1078669/backward-classes-account-for-56-33-of-population-in-telangana-caste-survey" },
    ],
  },
  {
    state: "Andhra Pradesh",
    tag: "Phase 01 Launch State",
    headline: "138 recognised BC communities · ₹51,020.56 Cr Sub-Plan (2026–27)",
    detail:
      "Andhra Pradesh recognises 138 Backward Class communities across five groups (BC-A: 51, BC-B: 27, BC-C: 1, BC-D: 45, BC-E: 14). The state's published BC Sub-Plan outlay for 2026–27 is ₹51,020.56 crore.",
    sources: [
      { label: "AP Budget 2026–27", url: "https://apfinance.gov.in/" },
      { label: "Deccan Chronicle", url: "https://www.deccanchronicle.com/southern-states/andhra-pradesh/bc-sub-plan-2026-27-5102056-crore-outlay-for-inclusive-growth-1937379" },
    ],
  },
];

// Revised 2025 Indian MSME classification thresholds (cited directly to published trade source; verify on msme.gov.in).
export const MSME_LIMITS_2025 = {
  sourceLabel: "GJEPC · Revised 2025 MSME Definition",
  sourceUrl: "https://www.gjepc.org/msme-defination.php",
  note: "Published reference for general guidance; always verify current statutory MSME thresholds on msme.gov.in or udyamregistration.gov.in.",
  tiers: [
    { tier: "Micro", investment: "Up to ₹2.5 crore", turnover: "Up to ₹10 crore" },
    { tier: "Small", investment: "Up to ₹25 crore", turnover: "Up to ₹100 crore" },
    { tier: "Medium", investment: "Up to ₹125 crore", turnover: "Up to ₹500 crore" },
  ],
};

// Structured institutional clarity answering core stakeholder questions using verified facts only.
export const INSTITUTIONAL_BRIEF = [
  {
    question: "Who is BECCI?",
    answer:
      "The Bahujan Entrepreneurs Chamber for Commerce & Industry (BECCI) is a Section 8 not-for-profit company incorporated in 2026 under the Ministry of Corporate Affairs (CIN U94110TS2026NPL222589), headquartered in Begumpet, Hyderabad.",
  },
  {
    question: "Why does it exist?",
    answer:
      "Skills, crafts and productive trades across Bahujan communities have long powered India's economy. BECCI exists to widen structured institutional access so those capabilities grow into formal, resilient enterprises.",
  },
  {
    question: "What does it aim to achieve?",
    answer:
      "To build a connected, transparent, institution-driven chamber that strengthens BC/OBC entrepreneurship, expands access to knowledge, finance and markets, and contributes to national economic development.",
  },
  {
    question: "Whom does it serve?",
    answer:
      "Aspiring entrepreneurs, existing businesses and MSMEs, manufacturers, professionals, students and young founders, and women entrepreneurs spanning eleven productive business sectors.",
  },
  {
    question: "What is BECCI not?",
    answer:
      "BECCI is not a charity, a political organisation or a government department. It does not process government scheme applications, guarantee approvals, or request portal passwords or OTPs.",
  },
  {
    question: "How does BECCI engage today?",
    answer:
      "In Phase 01, BECCI publishes verified enterprise guides and official scheme links, conducts district outreach and state membership desk preparation in Telangana and Andhra Pradesh, and welcomes enquiries at its registered office.",
  },
];

// Official corporate standing & verifiable public registry facts.
export const INSTITUTIONAL_REGISTRY = [
  { label: "Registered Name", value: ORG.full },
  { label: "Legal Standing", value: "Section 8 Not-for-Profit Company (Companies Act, 2013)" },
  { label: "Corporate Identity Number (CIN)", value: CONTACT.cin, copyable: true },
  { label: "Registrar", value: "Ministry of Corporate Affairs (MCA), Government of India", href: "https://www.mca.gov.in/" },
  { label: "Year of Incorporation", value: "2026" },
  { label: "Registered Office", value: CONTACT.address },
  { label: "Current Operational Phase", value: "Phase 01 — Public Information, District Outreach & State Membership Desks" },
];

// Transparent governance & disclosure ledger — zero fabricated leadership profiles or documents.
export const GOVERNANCE_DISCLOSURES = [
  {
    title: "Corporate Incorporation & Standing",
    status: "Available now",
    desc: "Registered as a Section 8 not-for-profit company (CIN U94110TS2026NPL222589). Independent verification is available via the Ministry of Corporate Affairs portal.",
    actionLabel: "Verify on MCA portal",
    href: "https://www.mca.gov.in/",
  },
  {
    title: "Board of Directors, Office Bearers & Advisors",
    status: "Planned",
    desc: "Verified leadership names, designations, photographs and biographies will be published here only after formal approval and individual consent. Personal phone numbers are never shown.",
  },
  {
    title: "Historical Personalities & Inspirations",
    status: "Planned",
    desc: "BECCI's featured list of historical thinkers and reformers remains intentionally empty until names, verified quotations and primary sources are formally selected and approved by BECCI.",
  },
  {
    title: "Constitutional Filings, Annual Reports & Policies",
    status: "Coming soon",
    desc: "Public governance documents, finalised Privacy & Terms policies (following legal review), annual reports and formally executed institutional partnerships will enter this public ledger as released.",
  },
];

// Structured Phase 01 active work vs. clearly separated future initiatives.
export const PHASE_INITIATIVES = [
  {
    id: "public-schemes-desk",
    status: "Available now",
    name: "Public Schemes, Practical Guides & Official Portals Desk",
    purpose: "Provide clear, scam-free orientation to Central and State Government enterprise schemes, 5 practical entrepreneur guides and 14 statutory portals without intermediaries.",
    audience: "Aspiring founders, artisans, micro-enterprises, MSMEs and professionals across Bharat.",
    scope: `Verified Government of India myScheme & official portal database covering ${SCHEME_DATASET_STATS.totalShown} Central, Telangana & Andhra Pradesh schemes (${SCHEME_DATASET_STATS.obcCount} OBC/BC priority) and 14 official Government of India portals.`,
    engagement: "Browse the Schemes and Knowledge Centre pages directly, or call the Hyderabad secretariat during working hours.",
    to: "/schemes",
    cta: `Explore ${SCHEME_DATASET_STATS.totalShown} Verified Schemes`,
  },
  {
    id: "district-outreach",
    status: "Active · Phase 01",
    name: "District Outreach & State Membership Desks",
    purpose: "Establish ground-level awareness and lay the operational foundation for BECCI's four-tier National-to-City structure, beginning with Telangana and Andhra Pradesh.",
    audience: "Artisans, small business owners, manufacturers, women entrepreneurs and youth founders across districts.",
    scope: "Phase 01 foundational outreach in Telangana and Andhra Pradesh prior to formal city and district chapter openings across other states. Chapters will be listed as they open.",
    engagement: "Prepare an enquiry on our Contact page or call BECCI's Begumpet office during working hours.",
    to: "/contact?topic=entrepreneur",
    cta: "Register outreach interest",
  },
  {
    id: "institutional-dialogue",
    status: "Active · Phase 01",
    name: "Institutional & Stakeholder Engagement",
    purpose: "Build structured communication channels between Bahujan enterprises and key economic institutions.",
    audience: "Government agencies, financial institutions, industry associations, academia and research bodies.",
    scope: "Exploratory dialogue on financial literacy, MSME formalisation, capacity building and market pathways. No formal partnerships are claimed unless officially announced.",
    engagement: "Connect directly with BECCI's registered office in Begumpet, Hyderabad for institutional correspondence.",
    to: "/contact?topic=institutional",
    cta: "Initiate institutional enquiry",
  },
];

// Audience-specific engagement pathways using verified routes and real contact channels only.
export const ENGAGEMENT_PATHWAYS = [
  {
    id: "entrepreneur",
    audience: "Entrepreneurs & MSMEs",
    title: "Formalise, learn & navigate public programmes",
    desc: `Explore ${SCHEME_DATASET_STATS.totalShown} verified Central, Telangana & Andhra Pradesh schemes, five practical entrepreneur guides, fourteen statutory portals, or reach the secretariat.`,
    primary: { label: "Explore Schemes & Portals", to: "/schemes" },
    secondary: { label: "Prepare entrepreneur enquiry", to: "/contact?topic=entrepreneur" },
  },
  {
    id: "wings",
    audience: "Women & Young Founders",
    title: "Connect with dedicated representation",
    desc: "Learn about BECCI's Women's Wing, Youth Wing and four-tier organisational model, and express interest in Phase 01 outreach.",
    primary: { label: "Wings & Chapters", to: "/wings-chapters" },
    secondary: { label: "Connect with BECCI", to: "/contact?topic=wings" },
  },
  {
    id: "institutional",
    audience: "Institutions, Banks & Industry",
    title: "Collaborate on enterprise capacity building",
    desc: "Review BECCI's Section 8 corporate standing, governance architecture and institutional objectives, or initiate a conversation.",
    primary: { label: "Governance & Standing", to: "/about#governance" },
    secondary: { label: "Institutional enquiry", to: "/contact?topic=institutional" },
  },
  {
    id: "official",
    audience: "Public Bodies & Secretariat",
    title: "Speak directly with the Hyderabad office",
    desc: "Call +91 94943 03234 (Mon–Sat, 9:30 am – 6:30 pm IST) or visit our registered office in Begumpet, Hyderabad (prior appointment recommended).",
    primary: { label: "Contact Secretariat", to: "/contact?topic=official" },
    secondary: { label: "Official Announcements", to: "/knowledge" },
  },
];

// Legal page drafts (DPDP Act, 2023 & IT Act, 2000) — clearly marked as draft awaiting legal review.
// Zero unconfirmed email addresses or raw internal tags displayed.
export const LEGAL_DRAFTS = {
  notice:
    "These drafts follow India's Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000. They are starting text awaiting formal legal review prior to member-portal launch and do not constitute legal advice.",
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    intro: "Draft summary prepared under India's Digital Personal Data Protection Act, 2023 and IT Act, 2000 — awaiting formal legal review.",
    items: [
      {
        heading: "Who we are",
        body: 'Bahujan Entrepreneurs Chamber for Commerce & Industry (BECCI), a Section 8 company, CIN U94110TS2026NPL222589, registered office H. No. 1-10-176, AltF Green Tower, Main Road, Begumpet, Hyderabad 500016 (the "Data Fiduciary").',
      },
      {
        heading: "What we collect (once member services open)",
        body: "Name, date of birth, mobile number, email, address, community/caste and certificate, business details (Udyam, GSTIN, CIN where given), communication preferences, and website usage data. During the current public-information phase, this website does not run member accounts or store submitted forms.",
      },
      {
        heading: "Why we collect it",
        body: "To verify membership eligibility, run member accounts, match members to relevant schemes, send updates consented to, and improve services. We collect only what these stated purposes require.",
      },
      {
        heading: "Consent",
        body: "Members will give explicit consent at sign-up for each purpose and may withdraw consent for optional communications at any time.",
      },
      {
        heading: "Sensitive data & caste privacy",
        body: "Community certificates will be stored encrypted and accessed only by authorised verification staff. Caste or community is never shown publicly or in any member directory.",
      },
      {
        heading: "Sharing",
        body: "BECCI does not sell personal data or share it with banks or lenders. Data is shared only with contracted infrastructure providers required to operate the platform (hosting, SMS, email, verification APIs) or where required by law.",
      },
      {
        heading: "Verification APIs",
        body: "With explicit consent, BECCI may verify Udyam, GST or corporate details through authorised providers solely to confirm submitted records.",
      },
      {
        heading: "Your rights & Grievance Officer",
        body: "You hold rights to access, correction, erasure, grievance redressal and nomination under the DPDP Act, 2023. The designated Grievance Officer's name and confirmed official email address will be published here prior to opening member registration; meanwhile, contact the Hyderabad secretariat on +91 94943 03234.",
      },
      {
        heading: "Retention",
        body: "Member data will be retained for the duration of active membership and for the statutory post-membership retention period confirmed in the finalised legal policy, unless Indian law requires longer retention.",
      },
      {
        heading: "Security",
        body: "HTTPS transport encryption, encrypted storage of verification documents, role-based access controls and audit logs.",
      },
      {
        heading: "Updates",
        body: "Any updates to this policy will be posted on this page with an effective date once finalised.",
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Use",
    intro: "Draft clauses governing the BECCI public website and upcoming member services — awaiting formal legal review.",
    clauses: [
      "The website and upcoming member services are operated by BECCI for eligible OBC/BC entrepreneurs, professionals and students under BECCI's published membership policy.",
      "Applicants and members must provide accurate, truthful information. False information may lead to rejection, suspension or cancellation following a fair review.",
      "Membership is personal and non-transferable. Categories, fees and renewal terms will be governed by the published membership schedule once approved by BECCI.",
      "Upcoming directory and marketplace spaces are intended strictly for genuine business purposes. Spam, harassment, misuse of contact details and fraudulent listings are prohibited.",
      "Member listings and content remain the responsibility of the submitting member. A BECCI verification badge confirms identity documents only — never product quality or commercial performance.",
      "BECCI may modify, update or discontinue services with reasonable notice.",
      "Governing law: Laws of India. Courts at Hyderabad, Telangana hold exclusive jurisdiction.",
    ],
  },
};
