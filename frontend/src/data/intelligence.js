// BECCI INTELLIGENCE — Reconciled knowledge, opportunity & global search registry.
// Follows BECCI_MASTER_DATA.md (19 Nov 2026) & BECCI Content Pack (18 Nov 2026):
// - Zero unverified scheme rupee limits, interest slabs or subsidy percentages
// - Zero unconfirmed email addresses or raw internal editorial markers
// - Strict separation between official government sources & BECCI educational guidance

import {
  CONTACT,
  KNOWLEDGE_PORTALS,
  NAV,
  NEWS,
  SCHEMES,
  SCHEME_CARD_NOTE,
  SCHEME_DATASET_STATS,
  SCHEME_NOTE,
  SECTORS,
} from "@/data/becci";

export const INTELLIGENCE_DISCLAIMER = SCHEME_NOTE;

export const QUICK_INTENTS = [
  { label: "Register MSME (Udyam)", query: "Udyam" },
  { label: "OBC Subsidy (PMEGP)", query: "PMEGP" },
  { label: "NBCFDC BC Loans", query: "NBCFDC" },
  { label: "18 Artisan Trades", query: "Vishwakarma" },
  { label: "PM Mudra Yojana", query: "Mudra" },
  { label: "Collateral-free (CGTMSE)", query: "CGTMSE" },
];

export const OPPORTUNITY_CATEGORIES = [
  { id: "all", label: "All Opportunities" },
  { id: "government-schemes", label: "Government Schemes" },
  { id: "msme-programmes", label: "MSME Programmes" },
  { id: "funding-info", label: "Funding & Credit Info" },
  { id: "tenders-procurement", label: "Tenders & Procurement" },
  { id: "training-skilling", label: "Training & Skilling" },
  { id: "market-access", label: "Market Access" },
  { id: "business-events", label: "Business Events" },
];

const schemeCategories = {
  "nbcfdc-gls": ["government-schemes", "funding-info"],
  pmegp: ["government-schemes", "msme-programmes", "funding-info"],
  pmv: ["government-schemes", "msme-programmes", "training-skilling", "market-access"],
  pmmy: ["government-schemes", "msme-programmes", "funding-info"],
  cgtmse: ["government-schemes", "msme-programmes", "funding-info"],
  sui: ["government-schemes", "funding-info"],
  "pm-daksh": ["government-schemes", "training-skilling"],
  "sisfs-fs": ["government-schemes", "funding-info"],
  "vcf-bc": ["government-schemes", "funding-info"],
  mszcs: ["government-schemes", "msme-programmes", "market-access"],
  "rajiv-yuva-vikasam": ["government-schemes", "funding-info"],
  "ap-obmms": ["government-schemes", "funding-info"],
};

// Built directly from flagship verified SCHEMES & official portals in becci.js
export const OPPORTUNITIES = [
  ...SCHEMES.map((s) => ({
    id: `opp-${s.slug || s.id}`,
    slug: s.slug || s.id,
    name: s.name,
    authority: s.agency ? `${s.ministry} · ${s.agency}` : s.ministry,
    sourceLabel: s.status ? s.status : `${s.level} · ${s.state || "All India"} · ${s.type}`,
    categories: schemeCategories[s.slug || s.id] || ["government-schemes"],
    editorialSummary: s.desc,
    eligibilityNote: s.beneficiaries ? `${s.beneficiaries} ${SCHEME_CARD_NOTE}` : SCHEME_CARD_NOTE,
    url: s.source,
    to: `/schemes/${s.slug || s.id}`,
    myschemeUrl: s.myschemeUrl || "",
    publishedDate: `Verified · ${s.lastVerified || SCHEME_DATASET_STATS.verifiedDate}`,
  })),
  {
    id: "opp-gem",
    name: "Government e-Marketplace (GeM) Seller & Tenders",
    authority: "Ministry of Commerce & Industry, Government of India",
    sourceLabel: "Official Public Procurement Portal",
    categories: ["tenders-procurement", "market-access", "msme-programmes"],
    editorialSummary:
      "National public procurement platform enabling registered Indian sellers, MSMEs and service providers to list products and bid on government tenders directly.",
    eligibilityNote: "Seller registration, Udyam linkage and tender bidding rules are governed solely by gem.gov.in.",
    url: "https://gem.gov.in/",
    publishedDate: "Official statutory portal",
  },
  {
    id: "opp-nsic",
    name: "NSIC MSME Marketing & Procurement Support",
    authority: "National Small Industries Corporation (Ministry of MSME)",
    sourceLabel: "Official MSME Institution",
    categories: ["msme-programmes", "tenders-procurement", "market-access"],
    editorialSummary:
      "Institutional portal providing information on marketing assistance, raw material support and public-procurement facilitation for micro and small enterprises.",
    eligibilityNote: "Confirm current registration criteria and active schemes directly on nsic.co.in.",
    url: "https://www.nsic.co.in/",
    publishedDate: "Official statutory portal",
  },
  {
    id: "opp-skillindia",
    name: "Skill India Digital Hub",
    authority: "Ministry of Skill Development & Entrepreneurship",
    sourceLabel: "Official Skilling Portal",
    categories: ["training-skilling"],
    editorialSummary:
      "Official national digital platform for discovering vocational courses, skilling programmes and enterprise capability modules.",
    eligibilityNote: "Course availability and enrolment rules are managed solely by skillindiadigital.gov.in.",
    url: "https://www.skillindiadigital.gov.in/",
    publishedDate: "Official statutory portal",
  },
];

// Progressive educational pathways grounded in the 5 authoritative Knowledge Centre guides (procedural, zero unverified limits).
export const LEARNING_JOURNEYS = [
  {
    id: "udyam-registration",
    num: "01",
    topic: "Starting a Business",
    title: "How to Register Your Business on Udyam (Free)",
    readTime: "6 steps",
    audience: "Unregistered OBC small businesses & aspiring founders",
    summary:
      "Udyam is required for most MSME schemes, CGTMSE guarantees, GeM selling and priority lending. Selecting “OBC” accurately helps your unit align with applicable MSME programmes.",
    stages: [
      {
        title: "Visit udyamregistration.gov.in (the only official site — free)",
        detail:
          "Registration on the official Ministry of MSME portal is completely free. Ignore paid look-alike websites.",
        portal: { label: "udyamregistration.gov.in", url: "https://udyamregistration.gov.in/" },
      },
      {
        title: "Select New Entrepreneur & verify Aadhaar via OTP",
        detail:
          "Choose “For New Entrepreneurs who are not Registered yet as MSME”, enter the owner's Aadhaar number and verify with the OTP sent to the Aadhaar-linked mobile.",
      },
      {
        title: "Enter PAN & verify business classification",
        detail:
          "Enter your PAN; investment and turnover figures are automatically fetched from income-tax and GST records where available.",
      },
      {
        title: "Fill business details, NIC code & select Social Category: OBC",
        detail:
          "Complete business name, address, bank details, primary activity (NIC code), select Social Category: OBC accurately, and submit with OTP to receive your Udyam certificate by email.",
      },
    ],
  },
  {
    id: "bc-certificate",
    num: "02",
    topic: "Documentation",
    title: "Getting Your Caste (BC) & Central OBC-NCL Certificate",
    readTime: "3 pathways",
    audience: "Telangana, Andhra Pradesh & Central scheme applicants",
    summary:
      "Understand where to apply in Telangana (MeeSeva) and Andhra Pradesh (Village/Ward Sachivalayam), and why Central schemes require an OBC Non-Creamy Layer certificate in the central format.",
    stages: [
      {
        title: "Telangana — apply via MeeSeva",
        detail:
          "Apply at any MeeSeva centre or the official MeeSeva portal with Aadhaar, ration/family card, school record showing caste, parent's caste certificate (if available) and residence proof. The Tahsildar issues it after verification.",
      },
      {
        title: "Andhra Pradesh — apply via Village/Ward Sachivalayam",
        detail:
          "Apply at your Village or Ward Sachivalayam or an authorised MeeSeva centre with the required supporting documents. Check your state portal for the current document checklist and statutory fee.",
      },
      {
        title: "Central schemes require Central OBC (Non-Creamy Layer)",
        detail:
          "For Central Government schemes and agencies, obtain an OBC (Non-Creamy Layer) certificate in the prescribed central format — a state BC certificate alone may not be accepted. For BECCI membership, recognition in either the Central OBC list or your State BC/OBC list qualifies.",
        portal: { label: "NCBC Central OBC Lists", url: "https://ncbc.nic.in/" },
      },
    ],
  },
  {
    id: "pmegp-steps",
    num: "03",
    topic: "Subsidy & Credit",
    title: "PMEGP in 6 Steps (OBC Special Category)",
    readTime: "6 steps",
    audience: "New manufacturing or service micro-enterprise founders",
    summary:
      "OBC applicants qualify under PMEGP's Special Category for higher margin-money subsidy and reduced beneficiary contribution. Confirm current project ceilings and subsidy percentages directly on the PMEGP e-Portal.",
    stages: [
      {
        title: "Choose a viable activity & prepare a project report",
        detail:
          "Define your manufacturing or service activity, machinery/capital cost, funding mix and projected income.",
      },
      {
        title: "Apply online via the official PMEGP e-Portal",
        detail:
          "Register on kviconline.gov.in/pmegpeportal/, select KVIC, KVIB or DIC as the implementing agency, and upload Aadhaar, PAN, caste certificate, project report and education/training proof.",
        portal: { label: "PMEGP Official e-Portal", url: "https://www.kviconline.gov.in/pmegpeportal/" },
      },
      {
        title: "District Task Force interview & bank sanction",
        detail:
          "Attend the district task force interview; recommended projects are forwarded to a participating bank for appraisal and sanction.",
      },
      {
        title: "Complete mandatory EDP training",
        detail:
          "Finish mandatory Entrepreneurship Development Programme (EDP) training. Margin-money subsidy is adjusted against the loan after the stipulated lock-in period per official KVIC rules.",
        portal: { label: "myScheme PMEGP", url: "https://myscheme.gov.in/schemes/pmegp" },
      },
    ],
  },
  {
    id: "readiness-dossier",
    num: "04",
    topic: "Credit & Market Readiness",
    title: "Five Documents Every Entrepreneur Should Keep Ready",
    readTime: "5 essentials",
    audience: "Founders preparing for bank credit, schemes or GeM",
    summary:
      "Prepare five foundational documents before approaching banks, State BC Corporations or government procurement portals so applications move smoothly without middlemen.",
    stages: [
      {
        title: "Identity, Community & Udyam Records",
        detail:
          "Keep ready: (1) Aadhaar and PAN (personal and business), (2) Caste certificate (state BC and, for central schemes, OBC-NCL), and (3) your free Udyam registration certificate.",
        portal: { label: "udyamregistration.gov.in", url: "https://udyamregistration.gov.in/" },
      },
      {
        title: "Banking History & Simple Project Report",
        detail:
          "Maintain (4) recent bank statements (6–12 months) and a dedicated business current account, plus (5) a clear project report detailing activity, cost, funding structure and expected income.",
      },
      {
        title: "Access Government Buyers Directly via GeM",
        detail:
          "Once Udyam-registered with banking and compliance records in order, register directly on Government e-Marketplace (GeM) to explore transparent national procurement opportunities.",
        portal: { label: "gem.gov.in", url: "https://gem.gov.in/" },
      },
    ],
  },
];

// Decision matrix from Guide 4 ("Which loan fits you?") — strictly without unverified rupee caps or rates.
export const LOAN_DECISION_GUIDE = [
  {
    situation: "Traditional artisan in one of 18 notified trades",
    startWith: "PM Vishwakarma (recognition, training, toolkit & concessional credit)",
    url: "https://pmvishwakarma.gov.in/",
  },
  {
    situation: "OBC/BC family within income criteria starting any small business",
    startWith: "NBCFDC General Loan via State BC Corporation",
    url: "https://nbcfdc.gov.in/nbcfdc/web/node/65",
  },
  {
    situation: "OBC woman launching a small or greenfield venture",
    startWith: "NBCFDC New Swarnima or Stand-Up India (greenfield)",
    url: "https://www.standupmitra.in/",
  },
  {
    situation: "New manufacturing or service unit seeking capital subsidy",
    startWith: "PMEGP (OBC Special Category via KVIC / KVIB / DIC)",
    url: "https://www.kviconline.gov.in/pmegpeportal/",
  },
  {
    situation: "Existing non-farm micro business needing working capital",
    startWith: "PM Mudra Yojana (Shishu, Kishor, Tarun & Tarun Plus)",
    url: "https://www.mudra.org.in/",
  },
  {
    situation: "Growing MSE needing larger collateral-free credit",
    startWith: "Bank loan backed by CGTMSE credit guarantee",
    url: "https://www.cgtmse.in/",
  },
  {
    situation: "Tech or innovation startup",
    startWith: "Startup India Seed Fund (SISFS) & Venture Capital Fund for Backward Classes",
    url: "https://seedfund.startupindia.gov.in/",
  },
];

// Shareable Knowledge Centre Guides (All 5 Content Pack guides, reconciled) + Verified Official Dispatches
export const INSIGHT_ARTICLES = [
  {
    slug: "how-to-register-on-udyam-free",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 01",
    attribution: "BECCI Knowledge Centre · Official Portal Walkthrough",
    published: "Published guide",
    readTime: "3 min read",
    title: "How to register your business on Udyam (free)",
    excerpt:
      "Udyam is required for most MSME schemes, CGTMSE guarantees, GeM selling and priority lending. Registration on udyamregistration.gov.in is completely free.",
    keyPoints: [
      "udyamregistration.gov.in is the only official site — registration is free; ignore paid look-alike sites.",
      "Requires Aadhaar (OTP-verified) and PAN; investment and turnover are fetched from IT/GST records where available.",
      "Select Social Category: OBC accurately so your unit matches applicable MSME programmes.",
      "Your Udyam certificate is emailed and can be downloaded any time.",
    ],
    sections: [
      {
        heading: "Step-by-Step Free Registration",
        body:
          "1. Go to udyamregistration.gov.in — it is the only official site and registration is free. Ignore paid look-alike sites. 2. Choose “For New Entrepreneurs who are not Registered yet as MSME”. 3. Enter the owner's Aadhaar number and verify it with the OTP sent to the Aadhaar-linked mobile. 4. Enter your PAN; investment and turnover are picked up from income-tax and GST records where available. 5. Fill in business name, address, bank details, activity (NIC code) and social category: select OBC. 6. Submit with OTP — your Udyam certificate is emailed and can be downloaded any time.",
      },
      {
        heading: "Why Udyam Registration Matters",
        body:
          "Historical MSME data shows OBC entrepreneurs owned 49.72% of India's proprietary MSMEs (NSS 73rd Round, 2015–16), yet accounted for only ~30% (23.31 lakh of 80.16 lakh) of Udyam-registered units in the March 2022 snapshot. Registering on Udyam unlocks access to official MSME schemes, CGTMSE collateral-free guarantees, GeM public procurement and priority-sector lending.",
      },
    ],
    sources: [
      { label: "udyamregistration.gov.in (Official Free Portal)", url: "https://udyamregistration.gov.in/" },
      { label: "Ministry of MSME Portal", url: "https://msme.gov.in/" },
    ],
  },
  {
    slug: "getting-your-caste-bc-certificate",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 02",
    attribution: "BECCI Knowledge Centre · Documentation Guide",
    published: "Published guide",
    readTime: "3 min read",
    title: "Getting your caste (BC) certificate — Telangana, Andhra Pradesh & Central OBC-NCL",
    excerpt:
      "Where to apply in Telangana (MeeSeva) and Andhra Pradesh (Village/Ward Sachivalayam), and why Central Government schemes require an OBC Non-Creamy Layer certificate in the central format.",
    keyPoints: [
      "Telangana: Apply at any MeeSeva centre or the MeeSeva portal; issued by the Tahsildar after verification.",
      "Andhra Pradesh: Apply at your Village/Ward Sachivalayam or an authorised MeeSeva centre.",
      "Central schemes require an OBC (Non-Creamy Layer) certificate in the central format — a state BC certificate alone may not be accepted.",
      "Check your state MeeSeva or Sachivalayam portal for the latest document checklist and statutory fees, which are updated periodically.",
    ],
    sections: [
      {
        heading: "Telangana & Andhra Pradesh Process",
        body:
          "In Telangana, apply at any MeeSeva centre or the official MeeSeva portal with Aadhaar, a ration/family card, a school record showing caste, parent's caste certificate if available, and residence proof; the Tahsildar issues the certificate after verification. In Andhra Pradesh, apply at your Village/Ward Sachivalayam or an authorised MeeSeva centre with equivalent supporting documents. Always confirm the current local checklist and applicable statutory fee on your state portal before submitting.",
      },
      {
        heading: "State BC vs. Central OBC (Non-Creamy Layer)",
        body:
          "For Central Government schemes and agencies you need an OBC (Non-Creamy Layer) certificate in the central format — a state BC certificate alone may not be accepted. For BECCI membership, you qualify if your community appears on either the Central OBC list for your state or your state's official BC/OBC list.",
      },
    ],
    sources: [
      { label: "NCBC Central OBC Lists", url: "https://ncbc.nic.in/" },
      { label: "BECCI Membership Eligibility", to: "/membership" },
    ],
  },
  {
    slug: "pmegp-in-6-steps-obc-subsidy",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 03",
    attribution: "BECCI Knowledge Centre · Subsidy Process Guide",
    published: "Published guide",
    readTime: "3 min read",
    title: "PMEGP in 6 steps (OBC Special Category guide)",
    excerpt:
      "How OBC applicants navigate the Prime Minister's Employment Generation Programme — from project report and KVIC e-Portal submission to District Task Force interview and mandatory EDP training.",
    keyPoints: [
      "OBC applicants are categorised under PMEGP's Special Category (higher margin-money subsidy and lower own contribution than General Category).",
      "Applies to new micro enterprises in manufacturing and services; apply strictly through kviconline.gov.in/pmegpeportal/.",
      "Always verify current project-cost ceilings, rural/urban subsidy percentages and own-contribution rules on the official KVIC portal.",
      "Mandatory EDP training is required before margin-money subsidy adjustment.",
    ],
    sections: [
      {
        heading: "The 6 Steps to Apply",
        body:
          "1. Pick a viable manufacturing or service activity and prepare a clear project report. 2. Apply online at the official PMEGP e-Portal (kviconline.gov.in/pmegpeportal/) and choose KVIC, KVIB or DIC as the implementing agency. 3. Upload Aadhaar, PAN, your caste certificate (to qualify under Special Category), the project report, and education or training proof. 4. Attend the district task force interview, which recommends viable projects to a financing bank. 5. After bank appraisal and loan sanction, deposit the prescribed Special Category beneficiary contribution. 6. Complete the mandatory EDP training; margin-money subsidy is retained for the prescribed lock-in period and then adjusted against your loan per official KVIC rules.",
      },
      {
        heading: "Verify Live Slabs on Official Portals",
        body:
          "Project ceilings, margin-money rates and eligibility guidelines are revised periodically by the Ministry of MSME and KVIC. Always confirm active terms on kviconline.gov.in/pmegpeportal/ or myscheme.gov.in/schemes/pmegp before committing project expenditure.",
      },
    ],
    sources: [
      { label: "PMEGP Official e-Portal (KVIC)", url: "https://www.kviconline.gov.in/pmegpeportal/" },
      { label: "myScheme PMEGP Details", url: "https://myscheme.gov.in/schemes/pmegp" },
    ],
  },
  {
    slug: "which-loan-fits-you-decision-guide",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 04",
    attribution: "BECCI Knowledge Centre · Credit Decision Matrix",
    published: "Published guide",
    readTime: "3 min read",
    title: "Which loan fits you? (Decision guide)",
    excerpt:
      "Match your exact enterprise stage — from traditional artisans and women-led small ventures to growing MSEs and tech startups — to the right official government programme.",
    keyPoints: [
      "Traditional artisan (18 notified trades) → PM Vishwakarma.",
      "OBC/BC family within income limits → NBCFDC General Loan via State BC Corporation.",
      "OBC woman launching a venture → NBCFDC New Swarnima or Stand-Up India (greenfield).",
      "New unit needing subsidy → PMEGP · Working capital → Mudra · Larger collateral-free credit → CGTMSE · Tech startups → SISFS & VCF-BC.",
    ],
    sections: [
      {
        heading: "Matching Your Situation to the Right Programme",
        body:
          "Traditional artisans across 18 notified trades can begin with PM Vishwakarma. OBC/BC households within NBCFDC's notified annual income limit can explore NBCFDC General Loans through their State BC Corporation, while OBC women entrepreneurs can review both NBCFDC New Swarnima and Stand-Up India for greenfield ventures.",
      },
      {
        heading: "Subsidies, Working Capital, Collateral-Free Credit & Startups",
        body:
          "New manufacturing or service units seeking a credit-linked subsidy should review PMEGP; existing non-farm micro enterprises seeking working capital can explore PM Mudra Yojana (Shishu, Kishor, Tarun and Tarun Plus); growing MSEs requiring larger collateral-free credit can explore bank loans backed by CGTMSE guarantees; and innovative startups can review Startup India Seed Fund (SISFS) alongside the Venture Capital Fund for Backward Classes. Always confirm current limits and interest slabs on each official website.",
      },
    ],
    sources: [
      { label: `Explore All ${SCHEME_DATASET_STATS.totalShown} Verified Schemes on BECCI`, to: "/schemes" },
      { label: "NBCFDC Official Schemes", url: "https://nbcfdc.gov.in/nbcfdc/web/node/65" },
      { label: "PM Mudra Yojana", url: "https://www.mudra.org.in/" },
    ],
  },
  {
    slug: "five-documents-every-entrepreneur-should-keep-ready",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 05",
    attribution: "BECCI Knowledge Centre · Document Readiness Checklist",
    published: "Published guide",
    readTime: "2 min read",
    title: "Five documents every entrepreneur should keep ready",
    excerpt:
      "Before applying for bank credit, government subsidies or public tenders, assemble these five core identity, community, registration and financial records.",
    keyPoints: [
      "1. Aadhaar and PAN (personal and business).",
      "2. Caste certificate (state BC and, for central schemes, OBC-NCL).",
      "3. Udyam certificate (free at udyamregistration.gov.in).",
      "4. Bank statements for the last 6–12 months and a business current account.",
      "5. A simple project report or business plan: activity, cost, funding and expected income.",
    ],
    sections: [
      {
        heading: "Your Core Enterprise Dossier",
        body:
          "1. Aadhaar and PAN (personal and business). 2. Caste certificate (state BC and, for central schemes, OBC Non-Creamy Layer in central format). 3. Udyam certificate (register free at udyamregistration.gov.in with Social Category: OBC). 4. Bank statements for the last 6–12 months and an active current account. 5. A simple project report or business plan detailing your business activity, project cost, funding mix and expected income.",
      },
      {
        heading: "Safe Application Practices",
        body:
          "Apply only through verified official government portals or recognised banks. BECCI provides orientation only — it never charges for scheme information and never requests government portal passwords or OTPs.",
      },
    ],
    sources: [
      { label: "Udyam Registration Portal (Free)", url: "https://udyamregistration.gov.in/" },
      { label: "Guide 01: Free Udyam Registration", to: "/intelligence/article/how-to-register-on-udyam-free" },
      { label: "Guide 02: Getting Your BC / OBC-NCL Certificate", to: "/intelligence/article/getting-your-caste-bc-certificate" },
    ],
  },
  {
    slug: "section-8-incorporation-2026",
    category: "Official Update",
    label: "Official BECCI Dispatch · 2026",
    attribution: "BECCI Secretariat · Verified Corporate Notice",
    published: "2026",
    readTime: "2 min read",
    title: NEWS[0].title,
    excerpt: NEWS[0].body,
    keyPoints: [
      `Legal Form: ${CONTACT.incorporation}`,
      `Corporate Identity Number (CIN): ${CONTACT.cin}`,
      `Registered Office: ${CONTACT.address}`,
      `Secretariat Phone: ${CONTACT.phone} (${CONTACT.hours})`,
    ],
    sections: [
      {
        heading: "Institutional Standing",
        body:
          "The Bahujan Entrepreneurs Chamber for Commerce & Industry (BECCI) is formally incorporated as a Section 8 not-for-profit company under the Companies Act, 2013, registered with the Ministry of Corporate Affairs (CIN U94110TS2026NPL222589).",
      },
      {
        heading: "Registered Office & Official Contact",
        body:
          `BECCI's registered office operates at ${CONTACT.address}. Enquiries are welcomed ${CONTACT.hours} on ${CONTACT.phone} or through our Contact page (prior appointments recommended for in-person meetings).`,
      },
    ],
    sources: [
      { label: "Ministry of Corporate Affairs (Verify CIN)", url: "https://www.mca.gov.in/" },
      { label: "BECCI Governance & Standing Ledger", to: "/about#governance" },
    ],
  },
  {
    slug: "phase-01-district-outreach-2026",
    category: "Official Update",
    label: "Official BECCI Announcement · 2026",
    attribution: "BECCI Secretariat · Rollout Notice",
    published: "2026",
    readTime: "2 min read",
    title: NEWS[1].title,
    excerpt: NEWS[1].body,
    keyPoints: [
      "Initial Phase 01 launch states: Telangana and Andhra Pradesh, with other states following in phases.",
      "Focuses on district-level outreach, state membership desks and scam-free scheme orientation.",
      "Chapter locations and event dates will be published only once formally confirmed.",
    ],
    sections: [
      {
        heading: "Phased National Rollout",
        body:
          "BECCI is rolling out across Bharat in phases, starting with Telangana and Andhra Pradesh. Phase 01 focuses on publishing verified enterprise guides and official scheme links online alongside district outreach and state membership desks.",
      },
    ],
    sources: [
      { label: "Explore Phase 01 Initiatives", to: "/what-we-do#initiatives" },
      { label: "Wings & Regional Context", to: "/wings-chapters" },
    ],
  },
];

// Knowledge Library taxonomy — honest separation between available verified items & pending formal publications.
export const LIBRARY_TYPES = [
  { id: "all", label: "All Library Items" },
  { id: "official-documents", label: "Official Records & Portals" },
  { id: "guides", label: "Guides & Pathways" },
  { id: "verified-articles", label: "Verified Dispatches & Insights" },
  { id: "reports", label: "Reports" },
  { id: "research", label: "Research Publications" },
  { id: "presentations", label: "Presentations" },
];

export const LIBRARY_ITEMS = [
  {
    id: "lib-cin-record",
    type: "official-documents",
    format: "Public Corporate Record",
    title: "BECCI Section 8 Corporate Standing & MCA Verification",
    summary: `Section 8 not-for-profit incorporation (2026) · CIN ${CONTACT.cin} · Registered at Begumpet, Hyderabad.`,
    sourceKind: "Verified Official Record",
    to: "/about#governance",
    actionLabel: "Inspect Governance Record",
  },
  ...INSIGHT_ARTICLES.map((a) => ({
    id: `lib-art-${a.slug}`,
    type: a.category === "Official Update" ? "verified-articles" : "guides",
    format: a.category,
    title: a.title,
    summary: a.excerpt,
    sourceKind: a.attribution,
    to: `/intelligence/article/${a.slug}`,
    actionLabel: "Read Guide",
  })),
  ...LEARNING_JOURNEYS.map((j) => ({
    id: `lib-journey-${j.id}`,
    type: "guides",
    format: "Guided Learning Pathway",
    title: `${j.topic}: ${j.title}`,
    summary: j.summary,
    sourceKind: "BECCI Educational Orientation · Non-Certified",
    to: `/intelligence#journey-${j.id}`,
    actionLabel: "Open Learning Stages",
  })),
  ...KNOWLEDGE_PORTALS.map((p, idx) => ({
    id: `lib-portal-${idx}`,
    type: "official-documents",
    format: "Official Government Portal",
    title: p.name,
    summary: p.summary,
    sourceKind: p.source,
    href: p.url,
    actionLabel: "Open Official Portal",
  })),
];

// Unified site-wide deterministic search index (used by Header SearchDialog — single source of truth)
export const SITE_SEARCH_INDEX = [
  ...NAV.map((n) => ({
    id: `page-${n.to}`,
    group: "Pages",
    title: n.label,
    summary:
      n.to === "/"
        ? "Building Businesses. Building Bharat. — BECCI public home."
        : `Explore ${n.label} on the official BECCI public website.`,
    to: n.to,
    keywords: n.short || "",
  })),
  {
    id: "page-navigator",
    group: "Pages",
    title: "BECCI Opportunity Navigator",
    summary: "Guided discovery journey matching verified schemes, guides, official portals, sectors and membership pathways.",
    to: "/navigator",
    keywords: "navigator guided discovery brief explore pathway",
  },
  {
    id: "page-intelligence",
    group: "Pages",
    title: "BECCI Intelligence",
    summary: "Resource Finder, Opportunity Intelligence, Learning Journeys & Knowledge Library.",
    to: "/intelligence",
    keywords: "guides library research search",
  },
  {
    id: "page-pulse",
    group: "Pages",
    title: "BECCI PULSE",
    summary: "Interactive 3D Enterprise Universe, Opportunity Wall & Digital Observatory.",
    to: "/pulse",
    keywords: "exhibition 3d universe observatory",
  },
  {
    id: "page-governance",
    group: "Pages",
    title: "Governance & Corporate Standing",
    summary: "Section 8 registration, CIN U94110TS2026NPL222589, governance hierarchy & disclosures.",
    to: "/about#governance",
    keywords: "leadership board cin mca legal",
  },
  {
    id: "page-privacy",
    group: "Pages",
    title: "Privacy Policy (Draft)",
    summary: "Draft privacy summary under DPDP Act 2023 & IT Act 2000, awaiting legal review.",
    to: "/privacy",
    keywords: "data caste privacy dpdp legal",
  },
  {
    id: "page-terms",
    group: "Pages",
    title: "Terms of Use (Draft)",
    summary: "Draft terms governing website and upcoming member services, awaiting legal review.",
    to: "/terms",
    keywords: "legal terms hyderabad jurisdiction",
  },
  ...SCHEMES.map((s) => ({
    id: `scheme-${s.slug || s.id}`,
    group: "Schemes",
    title: s.short ? `${s.short} — ${s.name}` : s.name,
    summary: s.desc,
    to: `/schemes/${s.slug || s.id}`,
    keywords: `${s.ministry} ${s.agency || ""} ${s.level} ${s.state || ""} ${s.type} ${(s.categories || []).join(" ")}`,
  })),
  ...INSIGHT_ARTICLES.map((a) => ({
    id: `guide-${a.slug}`,
    group: a.category === "Official Update" ? "News" : "Guides",
    title: a.title,
    summary: a.excerpt,
    to: `/intelligence/article/${a.slug}`,
    keywords: a.label,
  })),
  ...SECTORS.map((sec) => ({
    id: `sector-${sec.id}`,
    group: "Sectors",
    title: sec.name,
    summary: sec.covers,
    to: `/who-we-serve?sector=${sec.id}#sectors`,
    keywords: `industry sector ${(sec.schemeCategories || []).join(" ")}`,
  })),
  ...KNOWLEDGE_PORTALS.map((p, idx) => ({
    id: `portal-${idx}`,
    group: "Official Portals",
    title: p.name,
    summary: p.summary,
    href: p.url,
    keywords: `${p.source} ${p.topic}`,
  })),
];

export function searchSite(query, limit = 18, liveSchemes = null) {
  const words = (query || "").toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  let pool = SITE_SEARCH_INDEX;
  if (Array.isArray(liveSchemes) && liveSchemes.length > 0) {
    const nonSchemes = SITE_SEARCH_INDEX.filter((item) => item.group !== "Schemes");
    const schemeItems = liveSchemes
      .filter((s) => s.showOnBecci)
      .map((s) => ({
        id: `scheme-${s.slug}`,
        group: s.obcRelevant ? "OBC / BC Scheme" : "Schemes",
        title: s.short ? `${s.short} — ${s.name}` : s.name,
        summary: s.teName ? `${s.teName} · ${s.brief}` : s.brief,
        to: `/schemes/${s.slug}`,
        keywords: `${s.teName || ""} ${s.teBrief || ""} ${s.ministry || ""} ${s.agency || ""} ${s.level || ""} ${s.state || ""} ${s.primaryCategory || ""} ${(s.categories || []).join(" ")} ${(s.tags || []).join(" ")}`,
        featured: Boolean(s.featured),
      }));
    pool = [...nonSchemes, ...schemeItems];
  }

  return pool
    .map((item) => {
      const title = item.title.toLowerCase();
      const hay = `${title} ${item.summary} ${item.keywords || ""} ${item.group}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return null;
      const score =
        words.reduce((acc, w) => acc + (title.startsWith(w) ? 4 : title.includes(w) ? 2 : 1), 0) +
        (item.featured ? 1 : 0);
      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}
