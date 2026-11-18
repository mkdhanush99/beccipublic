import React from "react";
import { ArrowUpRight } from "lucide-react";
import {
  ORG, WHY_BAHUJAN, VISION_MISSION, WORK_AREAS, STAKEHOLDERS,
  AUDIENCES, SECTORS, WINGS, ROADMAP, MEMBERSHIP_NOTE,
} from "@/data/becci";
import Reveal from "@/components/Reveal";
import { SectionHeading, Eyebrow, CTA } from "@/components/primitives";
import { Symbol } from "@/components/Logo";
import StatusChip from "@/components/StatusChip";
import AcronymStory from "@/components/infographics/AcronymStory";
import EmpowermentChain from "@/components/infographics/EmpowermentChain";
import JourneyPath from "@/components/infographics/JourneyPath";
import PillarEcosystem from "@/components/infographics/PillarEcosystem";
import OrgHierarchy from "@/components/infographics/OrgHierarchy";
import MembershipSteps from "@/components/infographics/MembershipSteps";
import * as Icons from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1741591646737-e634ae96e83d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";
const CRAFT_IMG =
  "https://images.pexels.com/photos/32673642/pexels-photo-32673642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1100&w=900";

/* ------------------------------ Chapter 1 ------------------------------ */
const Hero = () => (
  <section className="relative overflow-hidden bg-navy-950 text-white" data-testid="home-hero">
    {/* meaningful connected network motif (not random particles) */}
    <svg className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-[0.16]" viewBox="0 0 600 600" aria-hidden="true">
      {[[90, 120], [250, 60], [430, 150], [520, 330], [360, 430], [160, 360], [300, 250]].map((p, i, a) => (
        <g key={i}>
          {a.slice(i + 1).map((q, j) => (
            <line key={j} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#7CB4F2" strokeWidth="0.6" />
          ))}
          <circle cx={p[0]} cy={p[1]} r={i === 6 ? 6 : 3.5} fill={i === 6 ? "#D4AF5A" : "#7CB4F2"} />
        </g>
      ))}
    </svg>

    <div className="becci-container relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-32">
      <div>
        <Reveal>
          <Eyebrow tone="white">{ORG.full}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 display-head text-[3.3rem] text-white sm:text-[4.6rem] lg:text-[5.6rem]">
            Building Businesses.
            <br />
            Building <span className="text-gold">Bharat.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-xl font-body text-lg leading-relaxed text-navy-300">{ORG.hero}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-navy-400">
            BECCI is the Bahujan Entrepreneurs Chamber for Commerce & Industry — an institution for entrepreneurship and enterprise development.
          </p>
        </Reveal>
        <Reveal delay={0.32}>
          <div className="mt-9 flex flex-wrap gap-3">
            <CTA to="/about" variant="gold" testid="hero-explore-cta">Explore BECCI</CTA>
            <CTA to="/membership" variant="outlineWhite" testid="hero-membership-cta">Membership information</CTA>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="relative">
        <div className="relative overflow-hidden rounded-sm border border-white/10">
          <img
            src={HERO_IMG}
            alt="Workers on the floor of an Indian manufacturing enterprise"
            className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 border-t border-white/10 bg-navy-950/70 px-5 py-4 backdrop-blur-sm">
            <Symbol variant="white" className="h-5" />
            <p className="font-body text-xs text-navy-300">
              People, skills, enterprises and industry — connected into one ecosystem of opportunity.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ------------------------------ Chapter 2 ------------------------------ */
const AcronymChapter = () => (
  <section className="bg-white py-20 md:py-28" data-testid="chapter-acronym">
    <div className="becci-container">
      <SectionHeading
        align="center"
        eyebrow="What does BECCI stand for?"
        title="Five letters. One intent."
        intro="Each letter carries a part of the story — from the communities we serve to the industry we help build."
        className="mb-14"
      />
      <AcronymStory />
    </div>
  </section>
);

/* ------------------------------ Chapter 3 ------------------------------ */
const WhyBahujan = () => (
  <section className="relative overflow-hidden bg-midnight py-20 text-white md:py-28" data-testid="chapter-bahujan">
    {/* restrained ornamental geometry */}
    <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden="true"
      style={{ backgroundImage: "radial-gradient(circle, #D4AF5A 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
    <div className="becci-container relative">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Eyebrow tone="gold">Why Bahujan?</Eyebrow>
          <h2 className="mt-5 font-heading text-[1.9rem] font-bold leading-[1.1] tracking-tight text-ivory sm:text-4xl lg:text-[2.6rem]">
            The skills of the many have always built this economy.
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-ivory/75 md:text-lg">{WHY_BAHUJAN.intro}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {WHY_BAHUJAN.occupations.map((o) => (
              <span key={o} className="rounded-sm border border-gold/30 px-3 py-1.5 font-body text-sm text-gold-champagne">
                {o}
              </span>
            ))}
          </div>
          <p className="mt-7 border-l-2 border-gold pl-5 font-body text-base italic leading-relaxed text-ivory/90">
            {WHY_BAHUJAN.thought}
          </p>
        </div>

        {/* heritage quotation composition */}
        <Reveal delay={0.1}>
          <figure className="relative rounded-sm border border-gold/30 bg-gradient-to-br from-[#0d1f3f] to-midnight p-9 md:p-12">
            <Symbol variant="white" className="mb-6 h-7 opacity-50" />
            <blockquote className="font-serif text-[1.8rem] italic leading-[1.25] text-gold sm:text-[2.3rem]">
              “{WHY_BAHUJAN.quote.text}”
            </blockquote>
            <figcaption className="mt-6">
              <p className="font-body text-base text-ivory/85">{WHY_BAHUJAN.quote.translation}</p>
              <p className="mt-3 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-gold-antique">
                {WHY_BAHUJAN.quote.attribution}
              </p>
              <p className="mt-3 font-body text-xs leading-relaxed text-ivory/45">{WHY_BAHUJAN.quote.note}</p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 4 ------------------------------ */
const Belief = () => (
  <section className="bg-navy-50/50 py-20 md:py-28" data-testid="chapter-belief">
    <div className="becci-container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <SectionHeading
        eyebrow="The belief"
        title="One enterprise sets off a chain that reaches the whole nation."
        intro="Economic empowerment is not a single moment. It is a sequence — each stage strengthening the next."
      />
      <EmpowermentChain />
    </div>
  </section>
);

/* ------------------------------ Chapter 5 ------------------------------ */
const Journey = () => (
  <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-28" data-testid="chapter-journey">
    <div className="becci-container">
      <SectionHeading
        tone="white"
        eyebrow="The journey"
        title="Skill becomes enterprise. Enterprise becomes prosperity."
        intro="BECCI's work follows a clear progression — helping a capability in hand grow into something that contributes to Bharat."
        className="mb-14"
      />
      <JourneyPath />
    </div>
  </section>
);

/* ------------------------------ Chapter 6 ------------------------------ */
const VisionMission = () => (
  <section className="bg-white py-20 md:py-28" data-testid="chapter-vision-mission">
    <div className="becci-container">
      <SectionHeading align="center" eyebrow="Vision & Mission" title="Direction, held steady." className="mb-14" />
      <div className="grid gap-5 md:grid-cols-2">
        {[
          { label: "Vision", ...VISION_MISSION.vision },
          { label: "Mission", ...VISION_MISSION.mission },
        ].map((b) => (
          <Reveal key={b.label}>
            <div className="flex h-full flex-col rounded-sm border border-navy-800/10 p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl uppercase tracking-wide text-navy-700">{b.label}</span>
                <StatusChip label={b.status} />
              </div>
              <p className="mt-6 font-heading text-xl font-medium leading-snug text-navy-950 md:text-2xl">{b.text}</p>
              <p className="mt-6 font-body text-xs text-navy-800/50">
                Wording is being finalised from BECCI source materials and is shown for review.
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 7 ------------------------------ */
const WhatWeDo = () => (
  <section className="bg-navy-50/50 py-20 md:py-28" data-testid="chapter-what-we-do">
    <div className="becci-container">
      <SectionHeading
        align="center"
        eyebrow="What BECCI does"
        title="Connecting entrepreneurs with knowledge, finance, markets, networks and institutional opportunities."
        className="mb-14"
      />
      <PillarEcosystem />

      <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h3 className="font-heading text-xl font-semibold text-navy-950">Six areas of work</h3>
          <ul className="mt-6 divide-y divide-navy-800/10 border-y border-navy-800/10">
            {WORK_AREAS.map((w, i) => (
              <li key={i} className="flex items-baseline gap-4 py-4">
                <span className="font-display text-lg text-navy-300">0{i + 1}</span>
                <span className="font-body text-base text-navy-900/85">{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-heading text-xl font-semibold text-navy-950">The ecosystem we seek to work alongside</h3>
          <p className="mt-3 font-body text-sm text-navy-800/60">
            Shown as stakeholder categories — not existing or confirmed partners.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {STAKEHOLDERS.map((s) => (
              <div key={s.name} className="rounded-sm border border-navy-800/10 bg-white p-5">
                <p className="font-heading text-base font-semibold text-navy-950">{s.name}</p>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-navy-800/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 8 ------------------------------ */
const WhoWeServe = () => (
  <section className="bg-white py-20 md:py-28" data-testid="chapter-who-we-serve">
    <div className="becci-container">
      <SectionHeading
        eyebrow="Who BECCI serves"
        title="You should be able to recognise your own journey here."
        className="mb-14"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.title} delay={(i % 3) * 0.08}>
            <article className="group h-full overflow-hidden rounded-sm border border-navy-800/10">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={a.img}
                  alt={a.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                <h3 className="absolute bottom-4 left-5 right-5 font-heading text-lg font-semibold text-white">{a.title}</h3>
              </div>
              <p className="p-5 font-body text-sm leading-relaxed text-navy-800/75">{a.line}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="font-heading text-xl font-semibold text-navy-950">Eleven business sectors</h3>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-navy-800/10 sm:grid-cols-3 lg:grid-cols-4">
          {SECTORS.map((s) => {
            const Icon = Icons[s.icon] || Icons.Boxes;
            return (
              <div key={s.name} className="flex items-center gap-3 bg-white p-5 transition-colors hover:bg-navy-50">
                <Icon className="h-5 w-5 shrink-0 text-navy-700" />
                <span className="font-body text-sm font-medium text-navy-900/85">{s.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 9 ------------------------------ */
const Ecosystem = () => (
  <section className="bg-navy-50/50 py-20 md:py-28" data-testid="chapter-ecosystem">
    <div className="becci-container grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <div>
        <SectionHeading
          eyebrow="The BECCI ecosystem"
          title="One structure, from the nation to the city."
          intro="BECCI is organised across four levels so that entrepreneurs can connect close to home."
          className="mb-10"
        />
        <OrgHierarchy />
        <div className="mt-8 flex items-start gap-3 rounded-sm border border-navy-800/10 bg-white p-5">
          <StatusChip label="Planned" />
          <p className="font-body text-sm leading-relaxed text-navy-800/70">
            Chapter locations, offices and leadership are not published here. Chapter information will appear as locations become operational.
          </p>
        </div>
      </div>
      <div className="lg:pt-24">
        <h3 className="font-heading text-xl font-semibold text-navy-950">Dedicated wings</h3>
        <div className="mt-6 space-y-4">
          {WINGS.map((w) => (
            <Reveal key={w.name}>
              <div className="rounded-sm border-l-2 border-gold bg-white p-6">
                <p className="font-heading text-lg font-semibold text-navy-950">{w.name}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/70">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------ Chapter 10 ------------------------------ */
const MembershipRoad = () => (
  <section className="bg-white py-20 md:py-28" data-testid="chapter-membership">
    <div className="becci-container">
      <SectionHeading
        eyebrow="Membership & the road ahead"
        title="How membership works."
        intro="Membership is explained here at an informational level. There is no application form, verification or payment in this phase."
        className="mb-12"
      />
      <MembershipSteps />
      <div className="mt-6 flex items-start gap-3 rounded-sm bg-navy-50 p-5">
        <Symbol variant="navy" className="mt-0.5 h-5 shrink-0" />
        <p className="font-body text-sm leading-relaxed text-navy-800/75">{MEMBERSHIP_NOTE}</p>
      </div>

      <div className="mt-16">
        <h3 className="font-heading text-xl font-semibold text-navy-950">The road ahead</h3>
        <p className="mt-3 max-w-2xl font-body text-sm text-navy-800/60">
          The public website and scheme information are the present phase. Future services are shown honestly — none are operational yet.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map((r) => (
            <div key={r.title} className="flex items-center justify-between gap-3 rounded-sm border border-navy-800/10 p-5">
              <span className="font-heading text-base font-medium text-navy-950">{r.title}</span>
              <StatusChip label={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Closing = () => (
  <section className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32" data-testid="chapter-closing">
    <div className="pointer-events-none absolute inset-0 opacity-[0.1]" aria-hidden="true"
      style={{ backgroundImage: "linear-gradient(90deg, #7CB4F2 1px, transparent 1px)", backgroundSize: "70px 100%" }} />
    <div className="becci-container relative text-center">
      <Reveal>
        <h2 className="mx-auto max-w-5xl display-head text-[2.4rem] leading-[1.02] text-white sm:text-5xl lg:text-[4.2rem]">
          From skill to enterprise.<br />
          From enterprise to prosperity.<br />
          From prosperity to <span className="text-gold">nation building.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mt-11 flex flex-wrap justify-center gap-3">
          <CTA to="/membership" variant="gold" testid="closing-membership">Explore Membership</CTA>
          <CTA to="/schemes" variant="outlineWhite" testid="closing-schemes">Explore Schemes</CTA>
          <CTA to="/contact" variant="outlineWhite" testid="closing-contact">Contact BECCI</CTA>
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
      <Belief />
      <Journey />
      <VisionMission />
      <WhatWeDo />
      <WhoWeServe />
      <Ecosystem />
      <MembershipRoad />
      <Closing />
    </>
  );
}

