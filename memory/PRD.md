# BECCI — Public Website Mockup · PRD

## Original problem statement
Premium, editorial, institutional public website mockup for **BECCI — Bahujan Entrepreneurs Chamber for Commerce & Industry** (tagline: "Building Businesses. Building Bharat."). Apple-meets-NMSDC quality, distinct BECCI brand, Bahujan philosophy. Public information site only — NO app features (no login/OTP, dashboards, marketplace, payments, live directory). Honest status labels for future items; never invent facts.

## Architecture
- Stack: React (CRA + craco) + Tailwind + shadcn/ui + framer-motion. FastAPI/Mongo template left as-is (no backend needed — informational CTAs only).
- Design tokens: `tailwind.config.js` (navy 950→50, brand #0A2352, heritage gold/ivory/burgundy/midnight) + fonts (Bebas Neue display, Plus Jakarta Sans headings, Inter body, Playfair Display quotation) loaded in `index.css`.
- Official BECCI logo assets installed from user's R2 kit: `src/assets/becci-logo-navy.svg`, `becci-logo-white.svg`, `becci-symbol.svg`, `becci-symbol-white.png`; favicons + og-image in `public/`.
- Content source of truth: `src/data/becci.js` (all copy; unconfirmed items marked `[TO BE CONFIRMED]`).
- Shared: `Layout` (ScrollToTop+Header+Footer), `Header` (sticky nav + mobile Sheet + Join BECCI), `Footer`, `Reveal` (reduced-motion aware), `StatusChip`, `primitives.jsx` (Eyebrow/SectionHeading/CTA/PageHero).
- Custom infographics (HTML/SVG, text equivalents, mobile-friendly): `AcronymStory`, `EmpowermentChain`, `JourneyPath`, `PillarEcosystem`, `OrgHierarchy`, `MembershipSteps`.

## Pages / routes
`/` long-form home (10 chapters: Hero, Acronym, Why Bahujan, Belief chain, Journey, Vision & Mission, What We Do, Who We Serve, Ecosystem, Membership+roadmap+closing), `/about`, `/what-we-do`, `/who-we-serve`, `/membership` (FAQ accordion), `/schemes` (disclaimer), `/wings-chapters`, `/knowledge` (labelled samples + toast), `/contact`, `/privacy`, `/terms`, 404.

## What's been implemented (2026-11-18)
- Full public website mockup, all pages, all 10 home chapters, all 6 custom infographics.
- BECCI brand system + official logo + favicons/OG meta applied. Reduced-motion support, visible focus, data-testids.
- Content accuracy guardrails: no invented counts/figures/chapters/leaders/partners/events/testimonials/scheme benefits; future services labelled Planned/Coming soon/Under development; Vision/Mission & eligibility/fees marked [TO BE CONFIRMED]; Buddha quote attribution flagged for verification.
- Verified: compiles clean, no console errors, desktop sections + routing confirmed via screenshots.

## Still needed from client (placeholders kept editable in src/data/becci.js)
- Verified contact details (phone/email/address), approved Vision/Mission wording, eligibility text, membership fees/categories, real scheme details + official source links, real news/knowledge articles, confirmed chapter locations.

## Backlog / next
- P1: wire real contact details + verified scheme source links when supplied.
- P2: add real News/Knowledge articles; optional Lenis smooth-scroll; sector detail pages.
