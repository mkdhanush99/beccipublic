// BECCI INTELLIGENCE — Maintainable, integrity-first knowledge & discovery registry.
// Populated from the authoritative BECCI Website Content Pack (Nov 18, 2026).
// Strictly separates verified official sources from BECCI educational guidance.

import { CONTACT, KNOWLEDGE_PORTALS, NEWS, SCHEMES, SCHEME_NOTE } from "@/data/becci";

export const INTELLIGENCE_DISCLAIMER = SCHEME_NOTE;

export const QUICK_INTENTS = [
  { label: "Register MSME (Udyam)", query: "Udyam" },
  { label: "OBC 35% Subsidy (PMEGP)", query: "PMEGP" },
  { label: "NBCFDC BC Loans", query: "NBCFDC" },
  { label: "18 Artisan Trades", query: "Vishwakarma" },
  { label: "Mudra up to ₹20L", query: "Mudra" },
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
  nbcfdc: ["government-schemes", "funding-info"],
  pmegp: ["government-schemes", "msme-programmes", "funding-info"],
  "pm-vishwakarma": ["government-schemes", "msme-programmes", "training-skilling", "market-access"],
  mudra: ["government-schemes", "msme-programmes", "funding-info"],
  cgtmse: ["government-schemes", "msme-programmes", "funding-info"],
  "stand-up-india": ["government-schemes", "funding-info"],
  "pm-daksh": ["government-schemes", "training-skilling"],
  sisfs: ["government-schemes", "funding-info"],
  "vcf-bc": ["government-schemes", "funding-info"],
  zed: ["government-schemes", "msme-programmes", "market-access"],
  "rajiv-yuva-vikasam": ["government-schemes", "funding-info"],
  "ap-obmms": ["government-schemes", "funding-info"],
};

// Built directly from verified SCHEMES & official portals in becci.js
export const OPPORTUNITIES = [
  ...SCHEMES.map((s) => ({
    id: `opp-${s.id}`,
    name: s.name,
    authority: s.ministry,
    sourceLabel: s.status ? s.status : s.featured ? "Featured OBC Scheme" : "Official Scheme",
    categories: schemeCategories[s.id] || ["government-schemes"],
    editorialSummary: s.desc,
    eligibilityNote:
      s.eligibility ||
      "BECCI provides guidance only. Eligibility and approval are decided by the implementing agency. Check the official website before applying.",
    url: s.source,
    publishedDate: `Last verified: ${s.lastVerified || "18 Nov 2026"}`,
  })),
  {
    id: "opp-gem",
    name: "Government e-Marketplace (GeM) Seller & Tenders",
    authority: "Government of India",
    sourceLabel: "Official Public Procurement Portal",
    categories: ["tenders-procurement", "market-access", "msme-programmes"],
    editorialSummary:
      "National public procurement platform enabling registered Indian sellers, MSMEs and service providers to list products and bid on government tenders directly.",
    eligibilityNote: "Seller registration, Udyam linkage and tender bidding rules are governed solely by gem.gov.in.",
    url: "https://gem.gov.in/",
    publishedDate: "Last verified: 18 Nov 2026",
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
    publishedDate: "Last verified: 18 Nov 2026",
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
    publishedDate: "Last verified: 18 Nov 2026",
  },
];

// Progressive educational pathways grounded in the 5 authoritative Content Pack guides.
export const LEARNING_JOURNEYS = [
  {
    id: "udyam-registration",
    num: "01",
    topic: "Starting a Business",
    title: "How to Register Your Business on Udyam (Free)",
    readTime: "6 verified steps",
    audience: "Unregistered OBC small businesses & aspiring founders",
    summary:
      "Udyam is required for most MSME schemes, CGTMSE guarantees, GeM selling and priority lending. Selecting 'OBC' correctly helps you get matched to the right schemes.",
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
          "Choose 'For New Entrepreneurs who are not Registered yet as MSME', enter the owner's Aadhaar number and verify with the OTP sent to the Aadhaar-linked mobile.",
      },
      {
        title: "Enter PAN & business details — select Social Category: OBC",
        detail:
          "Enter your PAN (investment and turnover are fetched from income-tax and GST records where available). Fill in business name, address, bank details, activity (NIC code) and select OBC as your social category.",
      },
      {
        title: "Submit with OTP & download your Udyam certificate",
        detail:
          "Once submitted with OTP, your official Udyam Registration Certificate is emailed and can be downloaded any time.",
      },
    ],
  },
  {
    id: "pmegp-subsidy",
    num: "02",
    topic: "Subsidy & Manufacturing",
    title: "PMEGP in 6 Steps (Up to 35% Subsidy for OBC Applicants)",
    readTime: "6 progressive steps",
    audience: "New micro enterprises in manufacturing (up to ₹50L) & services (up to ₹20L)",
    summary:
      "OBC applicants qualify as 'Special Category' under PMEGP: 25% subsidy in urban areas and 35% in rural areas with only 5% own contribution.",
    stages: [
      {
        title: "Pick a viable activity & prepare a project report",
        detail:
          "Plan costs realistically (max project cost ₹50 lakh for manufacturing, ₹20 lakh for services). BECCI can help you prepare the project report.",
      },
      {
        title: "Apply online at the PMEGP e-Portal & upload documents",
        detail:
          "Choose KVIC, KVIB or DIC as the implementing agency. Upload Aadhaar, PAN, your caste certificate (for special-category subsidy), project report, and education or training proof.",
        portal: { label: "kviconline.gov.in/pmegpeportal", url: "https://www.kviconline.gov.in/pmegpeportal/" },
      },
      {
        title: "District Task Force interview & bank sanction (5% contribution)",
        detail:
          "The district task force interviews you and recommends the project to a bank. Once sanctioned, you contribute only 5% of project cost (e.g. ₹50,000 on a ₹10 lakh rural project).",
      },
      {
        title: "Complete mandatory EDP training & 3-year subsidy lock-in",
        detail:
          "Finish the mandatory Entrepreneurship Development Programme (EDP) training. Your subsidy (25% urban, 35% rural) is held for 3 years and then adjusted against your loan.",
        portal: { label: "myScheme PMEGP Guide", url: "https://myscheme.gov.in/schemes/pmegp" },
      },
    ],
  },
  {
    id: "caste-certificate-docs",
    num: "03",
    topic: "Documentation & Eligibility",
    title: "BC Certificate & Five Essential Entrepreneur Documents",
    readTime: "4 practical checkpoints",
    audience: "Telangana, Andhra Pradesh & pan-India OBC/BC entrepreneurs",
    summary:
      "Prepare your state BC certificate, Central OBC-NCL certificate, Udyam, banking trail and simple project report before approaching any bank or scheme portal.",
    stages: [
      {
        title: "Telangana BC Certificate via MeeSeva",
        detail:
          "Apply at any MeeSeva centre or the MeeSeva portal with Aadhaar, ration/family card, a school record showing caste, parent's caste certificate if available, and residence proof. The Tahsildar issues it after verification.",
      },
      {
        title: "Andhra Pradesh BC Certificate via Village/Ward Sachivalayam",
        detail:
          "Apply at your Village/Ward Sachivalayam or a MeeSeva centre with the same core documents. [CONFIRM exact current document checklist and fees for TG/AP, which change from time to time.]",
      },
      {
        title: "Obtain Central OBC (Non-Creamy Layer) for central schemes",
        detail:
          "For central schemes and central agencies you need an OBC (Non-Creamy Layer) certificate in the central format — a state BC certificate alone may not be accepted.",
        portal: { label: "NCBC Central OBC Lists", url: "https://ncbc.nic.in/" },
      },
      {
        title: "Keep all 5 essential entrepreneur documents ready",
        detail:
          "Maintain: (1) Aadhaar & PAN (personal and business), (2) State BC & Central OBC-NCL certificate, (3) Udyam certificate, (4) Current account + 6–12 months bank statements, and (5) A simple project report showing activity, cost, funding and expected income.",
      },
    ],
  },
  {
    id: "loan-decision-markets",
    num: "04",
    topic: "Credit & Markets",
    title: "Matching Your Enterprise to the Right Loan & Market Portal",
    readTime: "4 strategic tracks",
    audience: "Artisans, women founders, micro units, growing MSEs & startups",
    summary:
      "Match your exact stage to PM Vishwakarma, NBCFDC, PMEGP, Mudra, CGTMSE, Stand-Up India or GeM without relying on intermediaries.",
    stages: [
      {
        title: "Artisans (18 trades) & Low-Income OBC Ventures",
        detail:
          "Traditional artisans in 18 trades can start with PM Vishwakarma (₹1L + ₹2L at 5% + ₹15,000 toolkit). OBC families with income under ₹3 lakh can explore NBCFDC General Loan (up to ₹15L) or New Swarnima for women (₹2L at 5%).",
        portal: { label: "pmvishwakarma.gov.in", url: "https://pmvishwakarma.gov.in/" },
      },
      {
        title: "Working Capital & Collateral-Free Scale",
        detail:
          "Existing micro units needing working capital can explore Mudra (Shishu up to ₹50K, Kishor ₹50K–5L, Tarun ₹5–10L, Tarun Plus ₹10–20L). Growing MSEs can pair bank loans with CGTMSE guarantee cover (up to ₹10 crore).",
        portal: { label: "mudra.org.in", url: "https://www.mudra.org.in/" },
      },
      {
        title: "Women Founders & Innovation Startups",
        detail:
          "OBC women qualify for both NBCFDC New Swarnima and Stand-Up India (₹10L–₹1Cr greenfield). Tech/innovation founders can explore Startup India Seed Fund and the Venture Capital Fund for Backward Classes (IFCI Venture).",
        portal: { label: "standupmitra.in", url: "https://www.standupmitra.in/" },
      },
      {
        title: "Sell Directly to Government Buyers via GeM",
        detail:
          "Once Udyam-registered with GST/banking records in place, register on Government e-Marketplace (GeM) to access transparent national public procurement.",
        portal: { label: "gem.gov.in", url: "https://gem.gov.in/" },
      },
    ],
  },
];

// Decision matrix from Guide 4 ("Which loan fits you?") — rendered cleanly in Knowledge & Intelligence.
export const LOAN_DECISION_GUIDE = [
  { situation: "Traditional artisan in one of 18 trades", startWith: "PM Vishwakarma (₹1 lakh + ₹2 lakh at 5%)", url: "https://pmvishwakarma.gov.in/" },
  { situation: "OBC family income under ₹3 lakh, any small business", startWith: "NBCFDC General Loan via state BC Corporation", url: "https://nbcfdc.gov.in/nbcfdc/web/node/65" },
  { situation: "OBC woman, small venture", startWith: "NBCFDC New Swarnima (₹2 lakh at 5%) or Stand-Up India (₹10 lakh–₹1 crore, greenfield)", url: "https://www.standupmitra.in/" },
  { situation: "New manufacturing or service unit, need subsidy", startWith: "PMEGP (25% urban / 35% rural OBC special-category subsidy)", url: "https://www.kviconline.gov.in/pmegpeportal/" },
  { situation: "Existing micro business needing working capital", startWith: "Mudra (Shishu, Kishor, Tarun & Tarun Plus up to ₹20 lakh)", url: "https://www.mudra.org.in/" },
  { situation: "Growing MSE needing larger collateral-free credit", startWith: "Bank loan with CGTMSE guarantee (up to ₹10 crore)", url: "https://www.cgtmse.in/" },
  { situation: "Tech or innovation startup", startWith: "Startup India recognition + Seed Fund; Venture Capital Fund for Backward Classes", url: "https://seedfund.startupindia.gov.in/" },
];

// Shareable Knowledge Centre Guides (All 5 Content Pack guides) + Verified Official Dispatches
export const INSIGHT_ARTICLES = [
  {
    slug: "how-to-register-on-udyam-free",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 01",
    attribution: "BECCI Knowledge Centre · Official Portal Walkthrough",
    published: "Nov 18, 2026",
    readTime: "3 min read",
    title: "How to register your business on Udyam (free)",
    excerpt:
      "Udyam is required for most MSME schemes, CGTMSE guarantees, GeM selling and priority lending. Registration on udyamregistration.gov.in is completely free.",
    keyPoints: [
      "udyamregistration.gov.in is the only official site — registration is free; ignore paid look-alike sites.",
      "Requires Aadhaar (OTP-verified) and PAN; investment and turnover are fetched from IT/GST records where available.",
      "Select Social Category: OBC accurately so your unit matches OBC-eligible schemes.",
      "Your Udyam certificate is emailed and can be downloaded any time.",
    ],
    sections: [
      {
        heading: "Step-by-Step Free Registration",
        body:
          "1. Go to udyamregistration.gov.in — it is the only official site and registration is free. Ignore paid look-alike sites. 2. Choose 'For New Entrepreneurs who are not Registered yet as MSME'. 3. Enter the owner's Aadhaar number and verify it with the OTP sent to the Aadhaar-linked mobile. 4. Enter your PAN; investment and turnover are picked up from income-tax and GST records where available. 5. Fill in business name, address, bank details, activity (NIC code) and social category: select OBC. 6. Submit with OTP — your Udyam certificate is emailed and can be downloaded any time.",
      },
      {
        heading: "Why Udyam Registration Matters",
        body:
          "OBC entrepreneurs own 49.72% of India's proprietary MSMEs (NSS 73rd Round, 2015–16), yet accounted for only ~30% (23.31 lakh of 80.16 lakh) of Udyam-registered units as of 31 March 2022. Registering on Udyam is required for most MSME schemes, CGTMSE collateral-free guarantees, GeM selling and priority-sector lending.",
      },
    ],
    sources: [
      { label: "udyamregistration.gov.in (Official Free Portal)", url: "https://udyamregistration.gov.in/" },
      { label: "Revised 2025 MSME Limits (GJEPC)", url: "https://www.gjepc.org/msme-defination.php" },
    ],
  },
  {
    slug: "getting-your-caste-bc-certificate",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 02",
    attribution: "BECCI Knowledge Centre · Documentation Guide",
    published: "Nov 18, 2026",
    readTime: "3 min read",
    title: "Getting your caste (BC) certificate — Telangana, Andhra Pradesh & Central OBC-NCL",
    excerpt:
      "Where to apply in Telangana (MeeSeva) and Andhra Pradesh (Village/Ward Sachivalayam), and why Central Government schemes require an OBC Non-Creamy Layer certificate in the central format.",
    keyPoints: [
      "Telangana: Apply at any MeeSeva centre or the MeeSeva portal; issued by the Tahsildar after verification.",
      "Andhra Pradesh: Apply at your Village/Ward Sachivalayam or a MeeSeva centre.",
      "Central schemes require an OBC (Non-Creamy Layer) certificate in the central format — a state BC certificate alone may not be accepted.",
      "[CONFIRM with BECCI: exact current document checklist and statutory fees for TG/AP, which change periodically.]",
    ],
    sections: [
      {
        heading: "Telangana & Andhra Pradesh Process",
        body:
          "In Telangana, apply at any MeeSeva centre or the MeeSeva portal with Aadhaar, a ration/family card, a school record showing caste, parent's caste certificate if available, and a residence proof; the Tahsildar issues the certificate after verification. In Andhra Pradesh, apply at your Village/Ward Sachivalayam or a MeeSeva centre with the same core documents.",
      },
      {
        heading: "State BC vs. Central OBC (Non-Creamy Layer)",
        body:
          "For central schemes and central agencies you need an OBC (Non-Creamy Layer) certificate in the central format — a state BC certificate alone may not be accepted. For BECCI membership, you qualify if your community appears on either the Central OBC list for your state or your state's BC/OBC list.",
      },
    ],
    sources: [
      { label: "NCBC Central OBC Lists", url: "https://ncbc.nic.in/" },
      { label: "BECCI Membership FAQs", to: "/membership" },
    ],
  },
  {
    slug: "pmegp-in-6-steps-obc-subsidy",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 03",
    attribution: "BECCI Knowledge Centre · Subsidy Guide",
    published: "Nov 18, 2026",
    readTime: "3 min read",
    title: "PMEGP in 6 steps (subsidy of up to 35% for OBC applicants)",
    excerpt:
      "OBC applicants qualify as Special Category under PMEGP — receiving 25% (urban) or 35% (rural) project-cost subsidy with only 5% own contribution.",
    keyPoints: [
      "Max project cost: ₹50 lakh (manufacturing) and ₹20 lakh (service/business).",
      "OBC Special Category: 25% urban / 35% rural subsidy with 5% own contribution.",
      "Worked example: On a ₹10 lakh rural project, OBC applicant receives ₹3.5L subsidy, contributes ₹50,000, and the bank lends ~₹6L.",
      "Mandatory EDP training required; subsidy is held for 3 years then adjusted against the loan.",
    ],
    sections: [
      {
        heading: "The 6 Steps to Apply",
        body:
          "1. Pick a viable activity and prepare a project report (BECCI can help). 2. Apply online at the PMEGP e-Portal (kviconline.gov.in/pmegpeportal/) and choose KVIC, KVIB or DIC as your agency. 3. Upload Aadhaar, PAN, your caste certificate (for special-category subsidy), the project report, and education or training proof. 4. The district task force interviews you and recommends the project to a bank. 5. The bank sanctions the loan; you put in 5% of the project cost (OBC = special category). 6. Finish the mandatory EDP training; the subsidy (25% urban, 35% rural) is held for 3 years and then adjusted against your loan.",
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
    published: "Nov 18, 2026",
    readTime: "3 min read",
    title: "Which loan fits you? (Decision guide)",
    excerpt:
      "Match your exact enterprise stage — from traditional artisans and women-led small ventures to growing MSEs and tech startups — to the right verified scheme.",
    keyPoints: [
      "Traditional artisan (18 trades) → PM Vishwakarma (₹1 lakh + ₹2 lakh at 5%).",
      "OBC family income under ₹3 lakh → NBCFDC General Loan via state BC Corporation.",
      "OBC woman, small venture → NBCFDC New Swarnima (₹2 lakh at 5%) or Stand-Up India (₹10 lakh–₹1 crore, greenfield).",
      "New unit needing subsidy → PMEGP; Existing micro unit → Mudra; Larger collateral-free credit → CGTMSE; Tech startup → SISFS & VCF-BC.",
    ],
    sections: [
      {
        heading: "Matching Your Situation to the Right Programme",
        body:
          "Traditional artisans in 18 covered trades can start with PM Vishwakarma (₹1 lakh + ₹2 lakh at 5%). OBC families with annual income under ₹3 lakh seeking any small business loan can explore the NBCFDC General Loan through their state BC Corporation. OBC women launching small or greenfield ventures qualify for NBCFDC New Swarnima (₹2 lakh at 5%) as well as Stand-Up India (₹10 lakh to ₹1 crore).",
      },
      {
        heading: "Subsidies, Working Capital, Collateral-Free Credit & Startups",
        body:
          "New manufacturing or service units seeking a capital subsidy should review PMEGP (25% urban / 35% rural for OBC Special Category). Existing micro businesses needing working capital can apply under PM Mudra Yojana (Shishu, Kishor, Tarun & Tarun Plus up to ₹20 lakh). Growing MSEs requiring larger collateral-free loans can explore bank loans backed by CGTMSE guarantees (up to ₹10 crore). Tech or innovation startups can explore Startup India recognition + Seed Fund (SISFS) alongside the Venture Capital Fund for Backward Classes.",
      },
    ],
    sources: [
      { label: "Compare All 12 Verified Schemes on BECCI", to: "/schemes" },
      { label: "NBCFDC Official Schemes", url: "https://nbcfdc.gov.in/nbcfdc/web/node/65" },
      { label: "PM Mudra Yojana", url: "https://www.mudra.org.in/" },
    ],
  },
  {
    slug: "five-documents-every-entrepreneur-should-keep-ready",
    category: "Knowledge Guide",
    label: "BECCI Knowledge Centre · Guide 05",
    attribution: "BECCI Knowledge Centre · Document Readiness Checklist",
    published: "Nov 18, 2026",
    readTime: "2 min read",
    title: "Five documents every entrepreneur should keep ready",
    excerpt:
      "Before applying for bank credit, government subsidies or public tenders, assemble these five core identity, community, registration and financial records.",
    keyPoints: [
      "1. Aadhaar and PAN (personal and business).",
      "2. Caste certificate (state BC and, for central schemes, OBC-NCL).",
      "3. Udyam certificate (free at udyamregistration.gov.in).",
      "4. Bank statements for the last 6–12 months and a current account.",
      "5. A simple project report or business plan: activity, cost, funding and expected income.",
    ],
    sections: [
      {
        heading: "Your Core Enterprise Dossier",
        body:
          "1. Aadhaar and PAN (personal and business). 2. Caste certificate (state BC and, for central schemes, OBC Non-Creamy Layer in central format). 3. Udyam certificate (register free at udyamregistration.gov.in with Social Category: OBC). 4. Bank statements for the last 6–12 months and an active current account. 5. A simple project report or business plan detailing your business activity, project cost, funding mix and expected income.",
      },
      {
        heading: "How BECCI Supports Document Preparation",
        body:
          "BECCI guides entrepreneurs on assembling project reports and verifying official portal checklists — never charging for scheme information and never requesting government portal passwords or OTPs.",
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
    attribution: "BECCI Chamber Desk · Verified Corporate Notice",
    published: "2026",
    readTime: "2 min read",
    title: NEWS[0].title,
    excerpt: NEWS[0].body,
    keyPoints: [
      `Legal Form: ${CONTACT.incorporation}`,
      `Corporate Identity Number (CIN): ${CONTACT.cin}`,
      `Registered Office: ${CONTACT.address}`,
      `Contact: ${CONTACT.phone} · ${CONTACT.email}`,
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
          `BECCI’s registered office operates at ${CONTACT.address}. Enquiries are welcomed Monday to Saturday, 9:30 am – 6:30 pm IST on ${CONTACT.phone}, by email at ${CONTACT.email}, or through the official Contact page.`,
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
    attribution: "BECCI Chamber Desk · Rollout Notice",
    published: "2026",
    readTime: "2 min read",
    title: NEWS[1].title,
    excerpt: NEWS[1].body,
    keyPoints: [
      "Initial Phase 01 launch states: Telangana and Andhra Pradesh, with other states following in phases.",
      "Focuses on district-level outreach, state membership desks and scam-free scheme orientation.",
      "Chapter locations and launch dates will be published only once confirmed.",
    ],
    sections: [
      {
        heading: "Phased National Rollout",
        body:
          "BECCI is rolling out across Bharat in phases, starting with Telangana and Andhra Pradesh. Phase 01 focuses on publishing verified enterprise and scheme guides online alongside district outreach and state membership desks.",
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
    summary: `Direct statutory portal hosted at ${p.url.replace("https://", "")}.`,
    sourceKind: "External Government Authority",
    href: p.url,
    actionLabel: "Open Official Portal",
  })),
];
