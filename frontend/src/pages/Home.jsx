import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Languages } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  ORG, WHY_BAHUJAN, VISION_MISSION, OBJECTIVES, STAKEHOLDERS,
  AUDIENCES, SECTORS, WINGS, ROADMAP, MEMBERSHIP_NOTE, CONTACT,
  ENGAGEMENT_PATHWAYS, HEADLINE_FACT_LINE, VERIFIED_STATS, SCHEME_DATASET_STATS,
} from "@/data/becci";
import { HOME_TE } from "@/data/teluguUi";
import { useSchemeLanguage } from "@/lib/schemesStore";
import Reveal from "@/components/Reveal";
import { SectionHeading, Eyebrow, CTA } from "@/components/primitives";
import { Symbol, InstitutionalSeal } from "@/components/Logo";
import StatusChip from "@/components/StatusChip";
import Img from "@/components/Img";
import { SectorSvgIcon, WingBadgeIcon } from "@/components/illustrations/BecciArtwork";
import LiquidAuroraCanvas from "@/components/visuals/LiquidAuroraCanvas";
import BecciPrismSculpture3D from "@/components/visuals/BecciPrismSculpture3D";
import { Magnetic, GlassSpotlight, ParallaxFrame } from "@/components/visuals/MotionPrimitives";
import { CinemaAperture, ScrollIlluminateStatement, ChapterCompass } from "@/components/visuals/CinemaStoryPrimitives";
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

const HOME_CHAPTERS = [
  { id: "home-hero", label: "Opening" },
  { id: "chapter-acronym", label: "Philosophy" },
  { id: "chapter-bahujan", label: "The People" },
  { id: "chapter-journey", label: "Transformation" },
  { id: "chapter-vision-mission", label: "Vision & Mission" },
  { id: "chapter-what-we-do", label: "Ecosystem" },
  { id: "chapter-who-we-serve", label: "Who We Serve" },
  { id: "chapter-closing", label: "Invitation" },
];

/* ------------------------------ Experience A & C: Cinematic Opening + Raymarched 3D Continuum Sculpture ------------------------------ */
const Hero = () => {
  const [reelIndex, setReelIndex] = useState(0);
  const [lang, setLang] = useSchemeLanguage();
  const isTelugu = lang === "te";
  const heroRef = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -68]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.14]);

  useEffect(() => {
    if (reduce) return undefined;
    const id = window.setInterval(() => {
      setReelIndex((prev) => (prev + 1) % HERO_REEL.length);
    }, 5600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section
      ref={heroRef}
      className="on-dark relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-navy-950 pt-24 text-white sm:pt-28"
      data-testid="home-hero"
    >
      {/* Layer 1: Live GPU WebGL Fluid Light Shader — Hero Chromatic Mode */}
      <LiquidAuroraCanvas variant="hero" />

      {/* Layer 2: Restrained atmospheric enterprise film backdrop (low opacity so typography & 3D sculpture lead cleanly) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {HERO_REEL.map((item, i) => {
          const active = reelIndex === i;
          return (
            <motion.div
              key={item.tag}
              initial={false}
              animate={{
                opacity: active ? 0.16 : 0,
                scale: reduce ? 1 : active ? 1.02 : 1.08,
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
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-900/40 to-navy-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/60 to-navy-950/30" />
        {/* Luminous Sapphire Radial Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(24,105,186,0.18),transparent_55%)] pointer-events-none" />
      </div>

      {/* Main Editorial Opening Stage: Asymmetric Typographic Left + Raymarched 3D Optical Glass Sculpture Right */}
      <motion.div
        style={reduce ? undefined : { y: stageY, opacity: stageOpacity }}
        className="becci-container relative z-10 my-auto py-6 sm:py-10 md:py-12"
      >
        <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-3 rounded-full glass-pill px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.16em] text-ice ${
                    isTelugu ? "font-telugu" : "font-heading"
                  }`}
                >
                  {isTelugu ? HOME_TE.orgFull : ORG.full}
                </span>
              </div>

              {/* Hero Bilingual Toggle (English | తెలుగు) */}
              <div
                role="group"
                aria-label="Home language toggle"
                data-testid="home-hero-lang-toggle"
                className="inline-flex items-center rounded-full border border-ice/20 bg-white/[0.06] p-1"
              >
                <button
                  type="button"
                  aria-pressed={!isTelugu}
                  onClick={() => setLang("en")}
                  data-testid="home-hero-lang-en"
                  className={`min-h-[28px] rounded-full px-3 py-0.5 font-heading text-xs font-semibold transition-colors ${
                    !isTelugu
                      ? "bg-teal text-navy-950"
                      : "text-ice/80 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  aria-pressed={isTelugu}
                  onClick={() => setLang("te")}
                  data-testid="home-hero-lang-te"
                  className={`font-telugu inline-flex min-h-[28px] items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold transition-colors ${
                    isTelugu
                      ? "bg-teal text-navy-950 shadow-teal-glow"
                      : "text-teal-bright hover:text-white"
                  }`}
                >
                  <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>తెలుగు</span>
                </button>
              </div>
            </div>

            {isTelugu ? (
              <div className="mt-5 sm:mt-6">
                <h1 className="font-telugu text-[2.2rem] font-bold leading-[1.32] text-white sm:text-[3rem] lg:text-[3.5rem]">
                  <span className="block">{HOME_TE.headlineLine1}</span>
                  <span className="text-teal-bright block">{HOME_TE.headlineLine2}</span>
                </h1>
                <p className="mt-2 font-heading text-sm uppercase tracking-wider text-ice/85 sm:text-base font-semibold">
                  Building Businesses. Building Bharat.
                </p>
              </div>
            ) : (
              <div className="mt-5 max-w-[660px] sm:mt-6">
                <div className="inline-block rounded-full border border-blue-400/20 bg-blue-900/30 px-3.5 py-1 mb-3 backdrop-blur-md">
                  <p className="font-heading text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-teal-bright">
                    Building Businesses. Building Bharat.
                  </p>
                </div>
                <h1 className="font-heading text-3xl leading-[1.12] text-white sm:text-5xl lg:text-[3.65rem] font-bold tracking-tight">
                  Connecting Bahujan founders with{" "}
                  <span className="text-ice">
                    tenders, capital &amp; verified schemes.
                  </span>
                </h1>
              </div>
            )}

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: EASE_OUT }}
              className={`mt-4 max-w-[680px] text-base leading-relaxed text-frost/90 sm:mt-5 sm:text-lg ${
                isTelugu ? "font-telugu" : "font-body"
              }`}
            >
              {isTelugu
                ? HOME_TE.heroBody
                : "India's institutional Section 8 chamber connecting OBC and BC enterprises, artisans and manufacturers with GeM/CPPP tenders, SIDBI funding and 335 eligible public welfare programmes."}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: EASE_OUT }}
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <Magnetic className="w-full sm:w-auto">
                <CTA
                  to="/opportunities"
                  variant="teal"
                  testid="hero-explore-cta"
                  className={`w-full sm:w-auto ${isTelugu ? "font-telugu" : ""}`}
                >
                  <span>Discover Opportunities &amp; Tenders</span>
                </CTA>
              </Magnetic>
              <Magnetic strength={0.12} className="w-full sm:w-auto">
                <CTA
                  to="/schemes"
                  variant="outlineWhite"
                  testid="hero-schemes-te-cta"
                  className="w-full sm:w-auto"
                >
                  <span>Browse 335 BC/OBC Schemes</span>
                </CTA>
              </Magnetic>
              <Magnetic strength={0.12} className="w-full sm:w-auto">
                <CTA
                  to="/member/register"
                  variant="outlineWhite"
                  testid="hero-membership-cta"
                  className={`w-full sm:w-auto ${isTelugu ? "font-telugu" : ""}`}
                >
                  <span>Join Member Portal</span>
                </CTA>
              </Magnetic>
            </motion.div>
          </div>

          {/* Signature 3D Visual: Raymarched Optical Glass Continuum Sculpture */}
          <div
            data-cursor="explore"
            data-cursor-hero="true"
            className="relative mx-auto flex h-[220px] w-full max-w-[340px] items-center justify-center sm:h-[300px] sm:max-w-[420px] lg:h-[440px] lg:max-w-none"
          >
            {/* Subtle Sapphire Glass Depth Aura behind Emblem */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(24,105,186,0.14),transparent_68%)] pointer-events-none" />
            <BecciPrismSculpture3D mode="hero" />
            <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-navy-900/80 px-3.5 py-1 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-ice/90 backdrop-blur-md sm:bottom-2 shadow-lg">
              Chamber <span className="text-teal-bright">∞</span> Commerce · Open Continuum
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Iridescent Glass Control & Visual Film Capsule */}
      <div className="becci-container relative z-10 pb-6 sm:pb-9">
        <GlassSpotlight
          tone="dark"
          className="glass-iridescent flex flex-col justify-between gap-4 rounded-2xl p-4 sm:gap-5 sm:p-5 lg:flex-row lg:items-center"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-ice/25">
              <Img
                name={HERO_REEL[reelIndex].img}
                sizes="120px"
                alt={HERO_REEL[reelIndex].alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-bright">
                {HERO_REEL[reelIndex].tag}
              </p>
              <p className="mt-1 max-w-md font-body text-xs leading-relaxed text-ice/90 sm:text-sm">
                {HERO_REEL[reelIndex].caption}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-ice/15 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex w-full items-center gap-1 rounded-full bg-white/[0.06] p-1 sm:w-auto sm:gap-1.5">
              {HERO_REEL.map((item, i) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => setReelIndex(i)}
                  className={`relative min-h-[38px] flex-1 rounded-full px-3.5 py-2 font-heading text-xs font-semibold uppercase tracking-wider transition-colors sm:flex-none ${
                    reelIndex === i
                      ? "text-navy-950"
                      : "text-ice/80 hover:text-white"
                  }`}
                >
                  {reelIndex === i && (
                    <motion.span
                      layoutId={reduce ? undefined : "hero-reel-pill"}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-teal"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{item.tag.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <InstitutionalSeal className="h-10 w-10 shrink-0" />
              <div className="text-right">
                <p className="font-heading text-xs font-semibold text-white">Section 8 Not-for-Profit</p>
                <p className="tabular font-body text-xs text-ice/75">CIN {CONTACT.cin}</p>
              </div>
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
    className="on-dark section relative overflow-hidden bg-navy-900 text-white"
    data-testid="chapter-bahujan"
  >
    {/* Calm Ice-Blue + subtle Teal directional light (distinct mood from Hero) */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 65% 55% at 88% 8%, rgba(184,215,250,0.14), transparent 62%), radial-gradient(ellipse 55% 45% at 12% 92%, rgba(0,184,169,0.12), transparent 62%)",
      }}
      aria-hidden="true"
    />

    <div className="becci-container relative z-10">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
        <div>
          <Eyebrow tone="tealDark">The People &amp; Capability</Eyebrow>
          <h2 className="mt-4 font-heading text-h1 font-bold leading-[1.03] text-white">
            The skills of the many have always built this economy.
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {WHY_BAHUJAN.etymology.map((e) => (
              <span
                key={e.part}
                className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-heading text-xs font-semibold text-white"
              >
                <span className="text-teal-bright">{e.part}</span>
                <span className="text-ice/70">=</span>
                <span className="text-frost">{e.meaning}</span>
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-teal-bright">
            {WHY_BAHUJAN.backboneHeading}
          </p>
          <p className="mt-2.5 font-body text-lead text-frost/88">{WHY_BAHUJAN.backboneBody}</p>
          <p className="mt-4 font-body text-sm leading-relaxed text-ice/90">
            {WHY_BAHUJAN.thought}
          </p>
        </div>
      </div>

      {/* Verified MSME Formalisation Gap — Sourced Headline Evidence */}
      <GlassSpotlight
        tone="dark"
        data-testid="home-msme-evidence"
        className="glass-iridescent mt-12 grid gap-8 rounded-3xl p-7 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
      >
        <div className="relative z-10 min-w-0">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-teal-bright">
            The Formalisation Gap · Official MSME Data
          </p>
          <p className="mt-3 font-heading text-xl font-bold leading-snug text-white sm:text-2xl">
            {HEADLINE_FACT_LINE}
          </p>
          <p className="mt-3 font-body text-xs leading-relaxed text-ice/80">
            OBC entrepreneurs already own about half of India’s small enterprises — yet many remain unregistered, missing formal credit and scheme benefits.
          </p>
        </div>

        <div className="relative z-10 grid gap-4 sm:grid-cols-2">
          {VERIFIED_STATS.slice(0, 2).map((stat) => (
            <div key={stat.id} className="min-w-0 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-ice/15">
              <p className="tabular font-display text-4xl leading-none text-teal-bright">{stat.figure}</p>
              <p className="mt-2 font-heading text-xs font-bold text-white">{stat.label}</p>
              <p className="mt-1 font-body text-xs leading-relaxed text-ice/80">{stat.year}</p>
              <a
                href={stat.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-2.5 inline-flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-wider text-ice hover:text-teal-bright"
              >
                <span>{stat.sourceLabel}</span>
                <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </GlassSpotlight>

      {/* Wide Cinematic Photography Gallery with Scroll-Controlled Aperture Reveal & Layered Parallax */}
      <div className="mt-14 grid gap-5 md:grid-cols-12">
        {[
          { img: "craft", span: "md:col-span-5", offset: 18, label: "Weaving & Looms", sub: "Generational textile & craft mastery" },
          { img: "artisan", span: "md:col-span-4", offset: -12, label: "Traditional Crafts", sub: "Independent makers & regional trades" },
          { img: "farmer", span: "md:col-span-3", offset: 22, label: "Agrarian Enterprise", sub: "Food processing & rural value chains" },
        ].map((card) => (
          <ParallaxFrame key={card.label} offset={card.offset} className={card.span}>
            <CinemaAperture>
              <div
                data-cursor="view"
                className="group relative overflow-hidden rounded-2xl bg-navy-950 shadow-lift ring-1 ring-ice/12"
              >
                <Img
                  name={card.img}
                  sizes="(min-width: 768px) 440px, 100vw"
                  alt={card.label}
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/92 via-navy-950/18 to-transparent" />
                <div className="glass-dark absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3">
                  <p className="font-heading text-sm font-bold text-white">{card.label}</p>
                  <p className="mt-0.5 font-body text-xs text-ice/85">{card.sub}</p>
                </div>
              </div>
            </CinemaAperture>
          </ParallaxFrame>
        ))}
      </div>

      {/* Floating Glass Heritage Quotation Lens (Champagne Gold reserved for the timeless motto) */}
      <GlassSpotlight
        tone="dark"
        data-cursor-surface="heritage"
        className="glass-iridescent mt-14 grid gap-8 rounded-3xl p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
      >
        <figure className="relative z-10">
          <Symbol variant="white" className="mb-5 h-6 w-auto opacity-80" />
          <blockquote className="font-serif text-3xl leading-snug text-gold sm:text-4xl">
            “{WHY_BAHUJAN.quote.text}”
          </blockquote>
          <figcaption className="mt-4">
            <p className="font-body text-base text-white/90">{WHY_BAHUJAN.quote.translation}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-ice/80">
              <span>{WHY_BAHUJAN.quote.attribution}</span>
              <span aria-hidden="true">·</span>
              <a
                href={WHY_BAHUJAN.quote.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex items-center gap-1 text-gold hover:text-white"
              >
                <span>{WHY_BAHUJAN.quote.sourceLabel}</span>
                <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            </div>
            <details className="mt-3 text-xs text-ice/75">
              <summary className="cursor-pointer font-heading font-semibold uppercase tracking-[0.14em] text-teal-bright hover:text-white">
                Historical context
              </summary>
              <p className="mt-2 font-body leading-relaxed text-ice/80">
                {WHY_BAHUJAN.quote.context}
              </p>
            </details>
          </figcaption>
        </figure>

        <div className="relative z-10">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-teal-bright">
            Productive traditions across Bharat
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {WHY_BAHUJAN.occupations.map((o) => (
              <span
                key={o}
                className="glass-pill rounded-full px-4 py-2 font-body text-xs font-medium text-frost"
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
    {/* Seamless Full-Bleed Midnight Navy / Frost White Split */}
    <div className="grid md:grid-cols-2">
      <div className="on-dark relative overflow-hidden bg-navy-900 px-8 py-20 text-white sm:px-14 lg:px-20 lg:py-28">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #00B8A9 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-xl lg:ml-auto">
          <Eyebrow tone="tealDark">Vision</Eyebrow>
          <p className="mt-6 font-heading text-2xl font-semibold leading-snug text-white sm:text-3xl">
            {VISION_MISSION.vision.text}
          </p>
        </div>
      </div>

      <div className="bg-frost px-8 py-20 text-navy-950 sm:px-14 lg:px-20 lg:py-28">
        <div className="max-w-xl">
          <Eyebrow tone="teal">Mission</Eyebrow>
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
  <section className="section bg-frost" data-testid="chapter-what-we-do">
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
          <Eyebrow tone="teal">Institutional objectives</Eyebrow>
          <h3 className="mt-3 font-heading text-2xl font-bold text-navy-950">Six core objectives</h3>
          <ul className="mt-6 divide-y divide-navy-800/10 border-y border-navy-800/10">
            {OBJECTIVES.map((w, i) => (
              <li key={i} className="flex items-baseline gap-5 py-4">
                <span className="tabular font-display text-xl text-teal-deep">0{i + 1}</span>
                <span className="font-body text-base font-medium text-navy-950">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <Eyebrow tone="teal">Collaboration</Eyebrow>
            <h3 className="mt-3 font-heading text-2xl font-bold text-navy-950">
              The ecosystem BECCI looks to work alongside
            </h3>
            <p className="mt-2 font-body text-xs text-navy-800/65">
              Shown as stakeholder categories — no partner logos or formal partnerships are claimed until signed.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {STAKEHOLDERS.map((s) => (
                <div key={s.name} className="border-t border-ice pt-4">
                  <p className="font-heading text-base font-bold text-navy-950">{s.name}</p>
                  <p className="mt-0.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">
                    {s.brings}
                  </p>
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
              <article
                data-cursor="view"
                className="hover-lift group relative h-full overflow-hidden rounded-2xl bg-navy-950 shadow-soft transition-[transform,box-shadow] duration-300 hover:shadow-lift"
              >
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
            <Link
              key={s.id}
              to={`/who-we-serve?sector=${s.id}#sectors`}
              className="glass-light inline-flex min-h-[44px] items-center gap-3 rounded-full px-5 py-2.5 transition-colors hover:border-teal/40 hover:bg-navy-50"
            >
              <SectorSvgIcon name={s.icon} className="h-5 w-5 shrink-0" />
              <span className="font-heading text-sm font-semibold text-navy-950">{s.name}</span>
            </Link>
          ))}
          <Link
            to="/who-we-serve#sectors"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-teal-deep"
          >
            <span>Explore all sectors</span>
            <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 8: National-to-City Reach & Dedicated Wings ------------------------------ */
const Ecosystem = () => (
  <section className="section bg-frost" data-testid="chapter-ecosystem">
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
          <Eyebrow tone="teal">Representation</Eyebrow>
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

        <div className="on-dark mt-8 rounded-2xl bg-navy-950 p-7 text-white shadow-lift ring-1 ring-ice/15">
          <p className="eyebrow text-teal-bright">National rollout</p>
          <p className="mt-2 font-body text-sm leading-relaxed text-ice/90">
            Phase 01 focuses on district-level outreach and state membership desks to reach artisans, MSME owners and aspiring founders.
          </p>
          <div className="mt-4">
            <Link
              to="/wings-chapters"
              className="link-underline inline-flex min-h-[40px] items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-teal-bright lg:min-h-0"
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

      <div className="mt-8 flex items-start gap-3.5 rounded-2xl border border-ice/60 bg-frost p-5">
        <Symbol variant="navy" className="mt-0.5 h-5 w-auto shrink-0" />
        <p className="font-body text-sm leading-relaxed text-navy-900/80">{MEMBERSHIP_NOTE}</p>
      </div>

      <div className="mt-16 border-t border-navy-800/10 pt-14">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow tone="teal">Transparency</Eyebrow>
            <h3 className="mt-2 font-heading text-2xl font-bold text-navy-950">The road ahead</h3>
            <p className="mt-1.5 max-w-2xl font-body text-sm text-navy-800/75">
              The public website and scheme information are the present phase. Future services are shown honestly — none are operational yet.
            </p>
          </div>
          <CTA to="/schemes" variant="outline" testid="home-schemes-cta">
            View {SCHEME_DATASET_STATS.totalShown} verified schemes
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

      {/* Tailored Engagement Pathways by Stakeholder Group */}
      <div className="mt-16 border-t border-navy-800/10 pt-14" data-testid="engagement-pathways">
        <Eyebrow tone="teal">Engage with BECCI</Eyebrow>
        <h3 className="mt-2 font-heading text-2xl font-bold text-navy-950">
          Choose your pathway into the chamber.
        </h3>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENT_PATHWAYS.map((p) => (
            <GlassSpotlight key={p.id} tone="light" className="glass-light flex h-full flex-col justify-between rounded-2xl p-6">
              <div className="relative z-10">
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  {p.audience}
                </p>
                <h4 className="mt-2 font-heading text-base font-bold leading-snug text-navy-950">
                  {p.title}
                </h4>
                <p className="mt-2 font-body text-xs leading-relaxed text-navy-800/75">
                  {p.desc}
                </p>
              </div>
              <div className="relative z-10 mt-6 flex flex-col gap-2 border-t border-navy-800/10 pt-4">
                <Link
                  to={p.primary.to}
                  className="inline-flex min-h-[38px] items-center justify-between font-heading text-xs font-semibold text-navy-950 transition-colors hover:text-teal-deep"
                >
                  <span>{p.primary.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                </Link>
                <Link
                  to={p.secondary.to}
                  className="inline-flex min-h-[36px] items-center justify-between font-body text-xs text-navy-800/70 transition-colors hover:text-teal-ink"
                >
                  <span>{p.secondary.label}</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </GlassSpotlight>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Experience B Bridge: Scroll-Illuminated Institutional Manifesto ------------------------------ */
const InstitutionalBridge = () => (
  <section className="on-dark relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,184,169,0.12), transparent 68%)",
      }}
    />
    <div className="becci-container relative z-10 max-w-5xl text-center">
      <Eyebrow tone="tealDark" className="justify-center">
        Institutional Standing
      </Eyebrow>
      <ScrollIlluminateStatement
        text="BECCI is not a charity, a political organisation or a government department — it is an institutional bridge built for economic participation, enterprise growth and nation building."
        highlightWords={["bridge", "economic", "enterprise", "nation", "building"]}
        className="mt-8 font-heading text-statement font-semibold leading-[1.22] text-frost"
      />
      {/* Interactive BECCI PULSE Digital Exhibition Portal */}
      <div className="mt-14 text-left">
        <GlassSpotlight
          tone="dark"
          data-cursor="discover"
          className="on-dark glass-iridescent flex flex-col justify-between gap-6 rounded-3xl bg-navy-950 p-7 text-white sm:p-9 lg:flex-row lg:items-center"
        >
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow text-teal-bright">Interactive Digital Exhibition · BECCI PULSE</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
              Step inside the BECCI Enterprise Universe.
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-ice/88">
              Explore our 3D spatial territories, search every verified scheme and statutory portal on the Opportunity Wall, and inspect BECCI’s transparent institutional record in the Digital Observatory.
            </p>
          </div>
          <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-3">
            <Magnetic>
              <CTA to="/navigator" variant="teal" testid="home-enter-navigator-cta">
                Opportunity Navigator
              </CTA>
            </Magnetic>
            <Magnetic strength={0.12}>
              <CTA to="/pulse" variant="outlineWhite" testid="home-enter-pulse-cta">
                Enter BECCI PULSE
              </CTA>
            </Magnetic>
          </div>
        </GlassSpotlight>
      </div>
    </div>
  </section>
);
const Closing = () => (
  <section
    className="on-dark relative overflow-hidden bg-navy-950 py-28 text-white md:py-36"
    data-testid="chapter-closing"
  >
    <LiquidAuroraCanvas variant="closing" defer />
    {/* Ambient centered 3D Raymarched Optical Glass Sculpture — lazily initialized near viewport */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-50 sm:h-[540px] sm:w-[540px]"
    >
      <BecciPrismSculpture3D mode="closing" defer />
    </div>
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/85"
      aria-hidden="true"
    />
    <div className="becci-container relative z-10 text-center">
      <Reveal>
        <div className="inline-flex items-center gap-3 rounded-full glass-pill px-4 py-1.5">
          <Symbol variant="white" className="h-4 w-auto" />
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-ice">
            Section 8 Not-for-Profit · Begumpet, Hyderabad · Pan-India Mission
          </span>
        </div>
        <h2 className="mx-auto mt-8 max-w-5xl display-head text-4xl leading-[0.96] text-white sm:text-6xl lg:text-7xl">
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
            <CTA to="/membership" variant="teal" testid="closing-membership">
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
      <ChapterCompass chapters={HOME_CHAPTERS} />
      <Hero />
      <AcronymChapter />
      <WhyBahujan />
      <TransformationScroll />
      <InstitutionalBridge />
      <VisionAndBelief />
      <WhatWeDo />
      <WhoWeServe />
      <Ecosystem />
      <MembershipRoad />
      <Closing />
    </>
  );
}
