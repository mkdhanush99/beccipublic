import React from "react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import Img from "@/components/Img";
import { SectorSvgIcon } from "@/components/illustrations/BecciArtwork";
import { AUDIENCES, SECTORS } from "@/data/becci";

export default function WhoWeServe() {
  return (
    <>
      <PageHero
        eyebrow="Who we serve"
        meta="Six Constituencies · Eleven Business Sectors"
        title="From a first idea to an established enterprise — there is a place for you here."
        intro="BECCI is built for the full range of people who make and grow businesses across Bharat."
      />

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="The people BECCI serves"
            title="Recognise your own journey."
            intro="Six core constituencies across urban and rural commerce, manufacturing and professional services."
            className="mb-14"
          />
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
        </div>
      </section>

      <section className="section bg-frost">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Eleven business sectors"
            title="The breadth of enterprise BECCI represents."
            intro="Every productive industry where Bahujan founders, makers and professionals build."
            className="mb-12"
          />
          <div className="flex flex-wrap gap-3.5">
            {SECTORS.map((s) => (
              <div
                key={s.name}
                className="glass-light inline-flex items-center gap-3 rounded-full px-6 py-3.5"
              >
                <SectorSvgIcon name={s.icon} className="h-5 w-5 shrink-0" />
                <span className="font-heading text-sm font-semibold text-navy-950">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Next chapter"
        title="Learn how BECCI membership works."
        desc="Review the five-step onboarding process, eligibility status and frequently asked questions."
        to="/membership"
        ctaLabel="How to become a member"
        testid="who-to-membership"
      />
    </>
  );
}
