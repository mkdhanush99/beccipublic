import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import Reveal from "@/components/Reveal";
import Img from "@/components/Img";
import { SectorSvgIcon } from "@/components/illustrations/BecciArtwork";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { AUDIENCES, SECTORS } from "@/data/becci";

export default function WhoWeServe() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramSector = searchParams.get("sector");
  const initialId = SECTORS.some((s) => s.id === paramSector) ? paramSector : SECTORS[0].id;
  const [selectedId, setSelectedId] = useState(initialId);

  useEffect(() => {
    if (paramSector && SECTORS.some((s) => s.id === paramSector)) {
      setSelectedId(paramSector);
    }
  }, [paramSector]);

  const activeSector = SECTORS.find((s) => s.id === selectedId) || SECTORS[0];

  const selectSector = (id) => {
    setSelectedId(id);
    setSearchParams({ sector: id }, { replace: true });
  };

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
        </div>
      </section>

      {/* Interactive Eleven-Sector Explorer (Supplied Coverage Descriptions + Direct Scheme Links) */}
      <section id="sectors" className="section bg-frost" data-testid="sector-explorer">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Eleven business sectors"
            title="Find your sector."
            intro="Select any sector below to see who it covers, relevant BECCI initiatives and matching government scheme categories."
            className="mb-10"
          />

          <div
            role="tablist"
            aria-label="BECCI eleven industry sectors"
            className="flex flex-wrap gap-2.5"
          >
            {SECTORS.map((s) => {
              const active = s.id === activeSector.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectSector(s.id)}
                  data-testid={`sector-pill-${s.id}`}
                  className={`inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-5 py-2.5 font-heading text-sm font-semibold transition-colors ${
                    active
                      ? "border-navy-950 bg-navy-950 text-white shadow-soft"
                      : "glass-light border-navy-800/12 text-navy-950 hover:border-teal-deep hover:text-teal-ink"
                  }`}
                >
                  <SectorSvgIcon
                    name={s.icon}
                    className={`h-4 w-4 shrink-0 ${active ? "brightness-0 invert" : ""}`}
                  />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>

          <GlassSpotlight
            tone="light"
            data-testid="sector-detail-panel"
            className="glass-light mt-8 grid gap-8 rounded-3xl p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
          >
            <div className="relative z-10 min-w-0">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-mist text-teal-deep">
                  <SectorSvgIcon name={activeSector.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    Industry Sector Coverage
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-navy-950">{activeSector.name}</h3>
                </div>
              </div>

              <p className="mt-5 font-body text-base leading-relaxed text-navy-900/85">
                {activeSector.covers}
              </p>

              <p className="mt-4 font-body text-xs leading-relaxed text-navy-800/65">
                Sector-specific peer groups, events and member exchanges will expand as BECCI chapters and Phase 02 services roll out.
              </p>
            </div>

            <div className="relative z-10 space-y-5 border-t border-navy-800/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-800/65">
                  Relevant BECCI Initiatives
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {activeSector.initiatives.map((init) => (
                    <Link
                      key={init}
                      to="/what-we-do#initiatives"
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-ice bg-frost px-3.5 py-1.5 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                    >
                      <span>{init}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-800/65">
                  Related Government Schemes
                </p>
                {activeSector.schemeCategories.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {activeSector.schemeCategories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/schemes?category=${encodeURIComponent(cat)}`}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 font-heading text-xs font-semibold text-white transition-colors hover:bg-teal-deep"
                      >
                        <span>{cat} schemes</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to="/schemes"
                    className="link-underline mt-2 inline-flex min-h-[40px] items-center gap-1.5 font-heading text-xs font-semibold text-teal-ink"
                  >
                    <span>Browse all 12 government schemes</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </GlassSpotlight>
        </div>
      </section>

      <NextPageBand
        eyebrow="Next chapter"
        title="Learn how BECCI membership works."
        desc="Compare Individual and Business membership, try our quick eligibility check and read the twelve FAQs."
        to="/membership"
        ctaLabel="How to become a member"
        testid="who-to-membership"
      />
    </>
  );
}
