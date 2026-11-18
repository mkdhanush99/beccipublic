import React from "react";
import { PageHero, SectionHeading, Eyebrow, CTA } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import { ORG, WHY_BAHUJAN, VISION_MISSION, STAKEHOLDERS } from "@/data/becci";

const APPROACH = [
  { title: "Information first", desc: "Clear, honest information about enterprise, finance and public programmes." },
  { title: "Access & connection", desc: "Linking entrepreneurs to knowledge, markets, mentorship and institutions." },
  { title: "Capacity building", desc: "Helping skills become formal, sustainable enterprises." },
  { title: "Relationships that last", desc: "Engagement that continues beyond a single transaction." },
];

const ABOUT_IMG =
  "https://images.pexels.com/photos/40719519/pexels-photo-40719519.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About BECCI"
        title="An institution for entrepreneurship and enterprise development."
        intro={ORG.type}
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="A chamber built to bring entrepreneurs and institutions together."
            />
            <p className="mt-6 font-body text-base leading-relaxed text-navy-800/75 md:text-lg">
              BECCI — the Bahujan Entrepreneurs Chamber for Commerce & Industry — exists to bring entrepreneurs,
              aspiring founders, MSMEs, manufacturers, professionals and institutions into a stronger business
              ecosystem. It is a bridge between entrepreneurs and government, financial institutions, industry and academia.
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-navy-800/75">
              BECCI is not a charity, political organisation or government department. Its focus is economic
              participation, enterprise growth and nation building.
            </p>
          </div>
          <Reveal delay={0.1}>
            <img src={ABOUT_IMG} alt="Business professionals in discussion" className="h-[360px] w-full rounded-sm object-cover lg:h-[440px]" />
          </Reveal>
        </div>
      </section>

      <section className="bg-midnight py-20 text-white md:py-28">
        <div className="becci-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow tone="gold">Why Bahujan</Eyebrow>
            <h2 className="mt-5 font-heading text-3xl font-bold leading-tight text-ivory lg:text-4xl">
              The welfare of the many.
            </h2>
          </div>
          <div>
            <p className="font-body text-lg leading-relaxed text-ivory/80">{WHY_BAHUJAN.intro}</p>
            <blockquote className="mt-8 border-l-2 border-gold pl-6 font-serif text-2xl italic leading-snug text-gold">
              “{WHY_BAHUJAN.quote.text}”
            </blockquote>
            <p className="mt-3 font-body text-base text-ivory/80">{WHY_BAHUJAN.quote.translation}</p>
            <p className="mt-2 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-gold-antique">
              {WHY_BAHUJAN.quote.attribution}
            </p>
            <p className="mt-2 font-body text-xs text-ivory/45">{WHY_BAHUJAN.quote.note}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading align="center" eyebrow="Vision & Mission" title="Direction, held steady." className="mb-14" />
          <div className="grid gap-5 md:grid-cols-2">
            {[{ label: "Vision", ...VISION_MISSION.vision }, { label: "Mission", ...VISION_MISSION.mission }].map((b) => (
              <Reveal key={b.label}>
                <div className="flex h-full flex-col rounded-sm border border-navy-800/10 p-8 md:p-10">
                  <span className="font-display text-xl uppercase tracking-wide text-navy-700">{b.label}</span>
                  <p className="mt-6 font-heading text-xl font-medium leading-snug text-navy-950 md:text-2xl">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50/50 py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Our approach" title="How BECCI works." className="mb-14" />
          <div className="grid gap-px overflow-hidden rounded-sm bg-navy-800/10 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <Reveal key={a.title} delay={(i % 4) * 0.07}>
                <div className="flex h-full flex-col bg-white p-7">
                  <span className="font-display text-3xl text-navy-300">0{i + 1}</span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-navy-950">{a.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/70">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Collaborative ecosystem"
            title="The institutions BECCI seeks to work alongside."
            intro="Shown as stakeholder categories — not existing or confirmed partners."
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAKEHOLDERS.map((s) => (
              <div key={s.name} className="rounded-sm border border-navy-800/10 p-6">
                <p className="font-heading text-base font-semibold text-navy-950">{s.name}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/70">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <CTA to="/what-we-do" variant="ghost" testid="about-to-what">See what BECCI does</CTA>
          </div>
        </div>
      </section>
    </>
  );
}
