import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  ORG, WHY_BAHUJAN, VISION_MISSION, WORK_AREAS, STAKEHOLDERS,
  AUDIENCES, SECTORS, WINGS, ROADMAP, MEMBERSHIP_NOTE, CONTACT,
} from "@/data/becci";
import Reveal from "@/components/Reveal";
import { SectionHeading, Eyebrow, CTA } from "@/components/primitives";
import { Symbol, InstitutionalSeal } from "@/components/Logo";
import StatusChip from "@/components/StatusChip";
import Img from "@/components/Img";
import { SectorSvgIcon, WingBadgeIcon } from "@/components/illustrations/BecciArtwork";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import EnterpriseField3D from "@/components/visuals/EnterpriseField3D";
import { Magnetic, GlassSpotlight, ParallaxFrame } from "@/components/visuals/MotionPrimitives";
import SplitHeadline from "@/components/visuals/SplitText";
import TransformationScroll from "@/components/visuals/TransformationScroll";
import AcronymStory from "@/components/infographics/AcronymStory";
import EmpowermentChain from "@/components/infographics/EmpowermentChain";
import PillarEcosystem from "@/components/infographics/PillarEcosystem";
import OrgHierarchy from "@/components/infographics/OrgHierarchy";
import MembershipSteps from "@/components/infographics/MembershipSteps";
import { EASE_OUT } from "@/lib/motion";

const HERO_REEL = [
  {
    img: "hero",
    tag: "Industry & Scale",
    caption: "Modern manufacturing and productive capacity across eleven sectors.",
    alt: "Workers on the floor of an Indian manufacturing enterprise",
  },
  {
    img: "craft",
    tag: "Inherited Capability",
    caption: "Transforming long-standing community crafts and trades into formal enterprises.",
    alt: "Artisan handloom weaving craft in India",
  },
  {
    img: "about",
    tag: "Commerce & Leadership",
    caption: "Connecting founders, MSMEs and professionals with institutions and markets.",
    alt: "Business professionals collaborating in a boardroom",
  },
];

/* ------------------------------ Chapter 1: Full-Bleed Immersive 3D Cinema Hero ------------------------------ */
const Hero = () => {
  const [reelIndex, setReelIndex] = useState(0);
  const heroRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.12]);

  useEffect(() => {
    if (reduce) return undefined;
    const id = window.setInterval(() => {
      setReelIndex((prev) => (prev + 1) % HERO_REEL.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section
      ref={heroRef}
      className="on-dark relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-navy-950 pt-28 text-white sm:pt-32"
      data-testid="home-hero"
    >
      {/* Layer 1: Live GPU WebGL Fluid Light Shader */}
      <LiquidAuroraCanvas />

      {/* Layer 2: True 3D WebGL Volumetric Infinity-Current Field (scroll + pointer reactive) */}
      <EnterpriseField3D density="hero" className="opacity-85" />

      {/* Layer 3: Full-bleed crossfading atmospheric enterprise photography */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {HERO_REEL.map((item, i) => {
          const active = reelIndex === i;
          return (
            <motion.div
              key={item.tag}
              initial={false}
              animate={{
                opacity: active ? 0.34 : 0,
                scale: reduce ? 1 : active ? 1.02 : 1.09,
              }}
              transition={{ duration: 1.1, ease: EASE_OUT }}
              className="absolute inset-0"
            >
              <Img
                name={item.img}
                priority={i === 0}
                sizes="100vw"
                alt={item.alt}
                className="h-full w-full object-cover mix-blend-luminosity"
              />
            </motion.div>
          );
        })}
        {/* Deep cinematic lighting vignette for high typographic contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/40 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/35 to-transparent" />
      </div>

      {/* Main Editorial Opening Stage with scroll-linked lift */}
      <motion.div
        style={reduce ? undefined : { y: stageY, opacity: stageOpacity }}
        className="becci-container relative z-10 my-auto py-12 md:py-16"
      >
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 rounded-full glass-pill px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
            <span className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-navy-100">
              {ORG.full}
            </span>
          </div>

          <SplitHeadline
            lines={["Building Businesses.", "Building Bharat."]}
            highlightWord="Bharat"
            className="mt-7 display-head text-[4rem] leading-[0.88] text-white sm:text-[5.8rem] lg:text-[7.6rem]"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE_OUT }}
            className="mt-7 max-w-2xl font-body text-lg leading-relaxed text-navy-100/90 sm:text-xl"
          >
            {ORG.hero}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <CTA to="/about" variant="gold" testid="hero-explore-cta">
                Explore BECCI
              </CTA>
            </Magnetic>
            <Magnetic strength={0.16}>
              <CTA to="/membership" variant="outlineWhite" testid="hero-membership-cta">
                Membership information
              </CTA>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Glass Control & Orientation Capsule with specular spotlight */}
      <div className="becci-container relative z-10 pb-8 sm:pb-10">
        <GlassSpotlight
          tone="dark"
          className="glass-dark flex flex-col justify-between gap-6 rounded-2xl p-5 sm:p-6 lg:flex-row lg:items-center"
        >
          <div className="relative z-10 flex items-center gap-4">
            <InstitutionalSeal className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                {HERO_REEL[reelIndex].tag}
              </p>
              <p className="mt-1 max-w-md font-body text-xs leading-relaxed text-navy-100/85 sm:text-sm">
                {HERO_REEL[reelIndex].caption}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {/* Interactive backdrop film switcher with spring highlight */}
            <div className="flex items-center gap-1.5 rounded-full bg-white/[0.06] p-1">
              {HERO_REEL.map((item, i) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => setReelIndex(i)}
                  className={`relative rounded-full px-3.5 py-1.5 font-heading text-[0.68rem] font-semibold uppercase tracking-wider transition-colors ${
                    reelIndex === i
                      ? "text-navy-950"
                      : "text-navy-100/75 hover:text-white"
                  }`}
                >
                  {reelIndex === i && (
                    <motion.span
                      layoutId={reduce ? undefined : "hero-reel-pill"}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{item.tag.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            <div className="hidden text-right sm:block">
              <p className="font-heading text-xs font-semibold text-white">Section 8 Not-for-Profit</p>
              <p className="tabular font-body text-[0.7rem] text-navy-300">CIN {CONTACT.cin}</p>
            </div>
          </div>
        </GlassSpotlight>
      </div>
    </section>
  );
};

/* ------------------------------ Chapter 2: The BECCI Infinity Philosophy ------------------------------ */
const AcronymChapter = () => (
  <section className="section bg-white" data-testid="chapter-acronym">
    <div className="becci-container">
      <AcronymStory />
    </div>
  </section>
);

/* ------------------------------ Chapter 3: The People & Capability ------------------------------ */
const WhyBahujan = () => (
  <section
    className="on-dark section relative overflow-hidden bg-[#041022] text-white"
    data-testid="chapter-bahujan"
  >
    {/* Subtle ambient radial lighting (no geometric dot grid) */}
    <div
      className="pointer-events-none absolute -right-40 top-0 h-[620px] w-[620px] rounded-full opacity-25 blur-3xl"
      style={{ background: "radial-gradient(circle, #1769C2 0%, transparent 70%)" }}
      aria-hidden="true"
    />

    <div className="becci-container relative z-10">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
        <div>
          <Eyebrow tone="gold">The People &amp; Capability</Eyebrow>
          <h2 className="mt-4 font-heading text-h1 font-bold leading-[1.03] text-white">
            The skills of the many have always built this economy.
          </h2>
        </div>
        <div>
          <p className="font-body text-lead text-navy-100/85">{WHY_BAHUJAN.intro}</p>
          <p className="mt-4 font-body text-sm italic leading-relaxed text-gold-champagne/90">
            {WHY_BAHUJAN.thought}
          </p>
        </div>
      </div>

      {/* Wide Cinematic Photography Gallery with Scroll-Linked Layered Parallax */}
      <div className="mt-14 grid gap-5 md:grid-cols-12">
        {[
          { img: "craft", span: "md:col-span-5", offset: 18, label: "Weaving & Looms", sub: "Generational textile & craft mastery" },
          { img: "artisan", span: "md:col-span-4", offset: -12, label: "Traditional Crafts", sub: "Independent makers & regional trades" },
          { img: "farmer", span: "md:col-span-3", offset: 22, label: "Agrarian Enterprise", sub: "Food processing & rural value chains" },
        ].map((card) => (
          <ParallaxFrame key={card.label} offset={card.offset} className={card.span}>
            <div className="group relative overflow-hidden rounded-2xl bg-navy-900 shadow-lift">
              <Img
                name={card.img}
                sizes="(min-width: 768px) 440px, 100vw"
                alt={card.label}
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/15 to-transparent" />
              <div className="glass-dark absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3">
                <p className="font-heading text-sm font-bold text-white">{card.label}</p>
                <p className="mt-0.5 font-body text-xs text-navy-100/80">{card.sub}</p>
              </div>
            </div>
          </ParallaxFrame>
        ))}
      </div>

      {/* Floating Glass Quotation Lens with Optical Specular Spotlight */}
      <GlassSpotlight
        tone="dark"
        className="glass-dark mt-14 grid gap-8 rounded-3xl p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
      >
        <figure className="relative z-10">
          <Symbol variant="white" className="mb-5 h-6 w-auto opacity-75" />
          <blockquote className="font-serif text-3xl italic leading-snug text-gold sm:text-4xl">
            “{WHY_BAHUJAN.quote.text}”
          </blockquote>
          <figcaption className="mt-4">
            <p className="font-body text-base text-white/90">{WHY_BAHUJAN.quote.translation}</p>
            <p className="mt-2 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy-300">
              {WHY_BAHUJAN.quote.attribution} · {WHY_BAHUJAN.quote.note}
            </p>
          </figcaption>
        </figure>

        <div className="relative z-10">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
            Productive traditions across Bharat
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {WHY_BAHUJAN.occupations.map((o) => (
              <span
                key={o}
                className="glass-pill rounded-full px-4 py-2 font-body text-xs font-medium text-white"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      </GlassSpotlight>
    </div>
  </section>
);

/* ------------------------------ Chapter 5: Full-Bleed Vision/Mission + Economic Multiplier ------------------------------ */
const VisionAndBelief = () => (
  <section className="bg-white" data-testid="chapter-vision-mission">
    {/* Seamless Full-Bleed Vision & Mission Split (zero card boxes) */}
    <div className="grid md:grid-cols-2">
      <div className="on-dark relative overflow-hidden bg-navy-950 px-8 py-20 text-white sm:px-14 lg:px-20 lg:py-28">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #3D8FE8 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-xl lg:ml-auto">
          <Eyebrow tone="gold">Vision</Eyebrow>
          <p className="mt-6 font-heading text-2xl font-semibold leading-snug text-white sm:text-3xl">
            {VISION_MISSION.vision.text}
          </p>
        </div>
      </div>

      <div className="bg-paper px-8 py-20 text-navy-950 sm:px-14 lg:px-20 lg:py-28">
        <div className="max-w-xl">
          <Eyebrow tone="antique">Mission</Eyebrow>
          <p className="mt-6 font-heading text-2xl font-semibold leading-snug text-navy-950 sm:text-3xl">
            {VISION_MISSION.mission.text}
          </p>
        </div>
      </div>
    </div>

    {/* Unboxed Economic Multiplier */}
    <div className="section bg-white" data-testid="chapter-belief">
      <div className="becci-container grid gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow="The Economic Multiplier"
            title="One enterprise sets off a chain that reaches the whole nation."
            intro="Economic empowerment is not a single moment. It is a compounding sequence — each stage strengthening the next."
          />
        </div>
        <EmpowermentChain />
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 6: Immersive Glass Business Ecosystem ------------------------------ */
const WhatWeDo = () => (
  <section className="section bg-navy-50/50" data-testid="chapter-what-we-do">
    <div className="becci-container">
      <SectionHeading
        eyebrow="The Business Ecosystem"
        title="Connecting entrepreneurs with knowledge, finance, markets, networks and institutional opportunities."
        intro="Explore how BECCI surrounds founders with practical pathways across five core pillars."
        className="mb-12"
      />
      <PillarEcosystem />

      {/* Unboxed Editorial 6 Areas of Work & 4 Stakeholder Categories */}
      <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <Eyebrow>Core focus</Eyebrow>
          <h3 className="mt-3 font-heading text-2xl font-bold text-navy-950">Six areas of work</h3>
          <ul className="mt-6 divide-y divide-navy-800/10 border-y border-navy-800/10">
            {WORK_AREAS.map((w, i) => (
              <li key={i} className="flex items-baseline gap-5 py-4">
                <span className="tabular font-display text-xl text-gold-antique">0{i + 1}</span>
                <span className="font-body text-base font-medium text-navy-950">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <Eyebrow tone="antique">Collaboration</Eyebrow>
            <h3 className="mt-3 font-heading text-2xl font-bold text-navy-950">
              The ecosystem we seek to work alongside
            </h3>
            <p className="mt-2 font-body text-xs text-navy-800/65">
              Shown as stakeholder categories — not existing or confirmed partners.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {STAKEHOLDERS.map((s) => (
                <div key={s.name} className="border-t border-navy-800/15 pt-4">
                  <p className="font-heading text-base font-bold text-navy-950">{s.name}</p>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-navy-800/75">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <CTA to="/what-we-do" variant="ghost" testid="home-what-we-do-link">
              Explore what BECCI does in full
            </CTA>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 7: Cinematic Audiences Bento & Fluid 11-Sector Strip ------------------------------ */
const WhoWeServe = () => (
  <section className="section bg-white" data-testid="chapter-who-we-serve">
    <div className="becci-container">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Who BECCI serves"
          title="You should be able to recognise your own journey here."
          intro="From first-generation founders and artisans to established MSMEs, manufacturers and professionals."
        />
        <CTA to="/who-we-serve" variant="outline" testid="home-who-we-serve-cta">
          All audiences &amp; sectors
        </CTA>
      </div>

      {/* Asymmetric Magazine Bento with Rounded-2xl Edge-to-Edge Photography */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {AUDIENCES.map((a, i) => {
          const isFeatured = i < 2;
          return (
            <Reveal
              key={a.title}
              delay={(i % 3) * 0.05}
              className={isFeatured ? "lg:col-span-6" : "lg:col-span-3"}
            >
              <article className="hover-lift group relative h-full overflow-hidden rounded-2xl bg-navy-950 shadow-soft transition-[transform,box-shadow] duration-300 hover:shadow-lift">
                <div className={`relative w-full overflow-hidden ${isFeatured ? "h-72 sm:h-80" : "h-64"}`}>
                  <Img
                    name={a.img}
                    sizes={isFeatured ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 300px, 50vw"}
                    alt={a.title}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className={`font-heading font-bold text-white ${isFeatured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}>
                      {a.title}
                    </h3>
                    <p className="mt-1.5 font-body text-xs leading-relaxed text-navy-100/90 sm:text-sm">
                      {a.line}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Fluid 11-Sector Pill Cloud (no rigid spreadsheet grid) */}
      <div className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-heading text-xl font-bold text-navy-950">Eleven business sectors</h3>
          <span className="font-body text-xs text-navy-800/65">
            Spanning productive industry, trade, technology and services across Bharat
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {SECTORS.map((s) => (
            <div
              key={s.name}
              className="glass-light inline-flex items-center gap-3 rounded-full px-5 py-3 transition-colors hover:bg-navy-50"
            >
              <SectorSvgIcon name={s.icon} className="h-5 w-5 shrink-0" />
              <span className="font-heading text-sm font-semibold text-navy-950">{s.name}</span>
            </div>
          ))}
          <Link
            to="/who-we-serve"
            className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-5 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            <span>Explore all sectors</span>
            <ArrowUpRight className="h-4 w-4 text-gold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 8: National-to-City Reach & Dedicated Wings ------------------------------ */
const Ecosystem = () => (
  <section className="section bg-paper" data-testid="chapter-ecosystem">
    <div className="becci-container grid gap-16 lg:grid-cols-[1fr_1fr]">
      <div>
        <SectionHeading
          eyebrow="The BECCI ecosystem"
          title="One structure, from the nation to the city."
          intro="BECCI is organised across four levels so that entrepreneurs can connect close to home."
          className="mb-10"
        />
        <OrgHierarchy />
        <div className="mt-8 flex items-start gap-3.5">
          <StatusChip label="Planned" />
          <p className="font-body text-sm leading-relaxed text-navy-800/75">
            Chapter locations, offices and leadership are not published here. Chapter information will appear as locations become operational.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between lg:pt-12">
        <div>
          <Eyebrow tone="antique">Representation</Eyebrow>
          <h3 className="mt-3 font-heading text-2xl font-bold text-navy-950">Dedicated wings</h3>
          <p className="mt-2 font-body text-sm text-navy-800/75">
            Focused forums ensuring women founders and young entrepreneurs shape the chamber from the start.
          </p>
          <div className="mt-6 space-y-4">
            {WINGS.map((w, idx) => (
              <Reveal key={w.name} delay={idx * 0.08}>
                <div className="glass-light flex items-start gap-4 rounded-2xl p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-soft">
                    <WingBadgeIcon name={w.name} className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold text-navy-950">{w.name}</p>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-navy-800/75">{w.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="on-dark mt-8 rounded-2xl bg-navy-950 p-7 text-white shadow-lift">
          <p className="eyebrow text-gold">National rollout</p>
          <p className="mt-2 font-body text-sm leading-relaxed text-navy-100/85">
            Phase 01 focuses on district-level outreach and state membership desks to reach artisans, MSME owners and aspiring founders.
          </p>
          <div className="mt-4">
            <Link
              to="/wings-chapters"
              className="link-underline inline-flex items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-gold"
            >
              <span>Wings &amp; Chapters structure</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 9: Membership & Road Ahead ------------------------------ */
const MembershipRoad = () => (
  <section className="section bg-white" data-testid="chapter-membership">
    <div className="becci-container">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Membership & the road ahead"
          title="How membership works."
          intro="Membership is explained here at an informational level. There is no application form, verification or payment in this phase."
        />
        <CTA to="/membership" variant="primary" testid="home-membership-details-cta">
          Full membership guide &amp; FAQ
        </CTA>
      </div>

      <MembershipSteps />

      <div className="mt-8 flex items-start gap-3.5 rounded-2xl bg-navy-50/80 p-5">
        <Symbol variant="navy" className="mt-0.5 h-5 w-auto shrink-0" />
        <p className="font-body text-sm leading-relaxed text-navy-900/80">{MEMBERSHIP_NOTE}</p>
      </div>

      <div className="mt-16 border-t border-navy-800/10 pt-14">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow tone="antique">Transparency</Eyebrow>
            <h3 className="mt-2 font-heading text-2xl font-bold text-navy-950">The road ahead</h3>
            <p className="mt-1.5 max-w-2xl font-body text-sm text-navy-800/75">
              The public website and scheme information are the present phase. Future services are shown honestly — none are operational yet.
            </p>
          </div>
          <CTA to="/schemes" variant="outline" testid="home-schemes-cta">
            View 8 government schemes
          </CTA>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {ROADMAP.map((r) => (
            <div
              key={r.title}
              className="glass-light inline-flex items-center gap-3 rounded-full px-5 py-3"
            >
              <span className="font-heading text-sm font-semibold text-navy-950">{r.title}</span>
              <StatusChip label={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 10: Living 3D WebGL Closing Invitation ------------------------------ */
const Closing = () => (
  <section
    className="on-dark relative overflow-hidden bg-navy-950 py-28 text-white md:py-36"
    data-testid="chapter-closing"
  >
    <LiquidAuroraCanvas />
    <EnterpriseField3D density="closing" className="opacity-70" />
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-navy-950/80"
      aria-hidden="true"
    />
    <div className="becci-container relative z-10 text-center">
      <Reveal>
        <Symbol variant="white" className="mx-auto mb-7 h-8 w-auto opacity-90" />
        <h2 className="mx-auto max-w-5xl display-head text-[2.8rem] leading-[0.96] text-white sm:text-6xl lg:text-[5.2rem]">
          From skill to enterprise.
          <br />
          From enterprise to prosperity.
          <br />
          From prosperity to <span className="text-gold">nation building.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <CTA to="/membership" variant="gold" testid="closing-membership">
              Explore Membership
            </CTA>
          </Magnetic>
          <Magnetic strength={0.16}>
            <CTA to="/schemes" variant="outlineWhite" testid="closing-schemes">
              Explore Schemes
            </CTA>
          </Magnetic>
          <Magnetic strength={0.16}>
            <CTA to="/contact" variant="outlineWhite" testid="closing-contact">
              Contact BECCI
            </CTA>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  </section>
);

export default function Home() {
  return (
    <>
      <Hero />
      <AcronymChapter />
      <WhyBahujan />
      <TransformationScroll />
      <VisionAndBelief />
      <WhatWeDo />
      <WhoWeServe />
      <Ecosystem />
      <MembershipRoad />
      <Closing />
    </>
  );
}
