import React from "react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import MembershipSteps from "@/components/infographics/MembershipSteps";
import { Symbol } from "@/components/Logo";
import { AUDIENCES, MEMBERSHIP_NOTE, FAQS, TBC } from "@/data/becci";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export default function Membership() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        meta="Informational Guide"
        title="Join the chamber built for enterprise."
        intro="This page explains membership. There is no application form, verification or payment in the current phase."
      >
        <StatusChip label="Coming soon" tone="dark" />
      </PageHero>

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Who it is for"
            title="Built for founders at every stage."
            className="mb-12"
          />
          <div className="grid gap-8 border-t border-navy-800/12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.title}>
                <p className="font-heading text-base font-bold text-navy-950">{a.title}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">{a.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="becci-container grid gap-8 lg:grid-cols-2">
          <div className="glass-light rounded-3xl p-8 md:p-10">
            <SectionHeading eyebrow="Eligibility" title="Who can join." className="mb-6" />
            <div className="flex flex-wrap items-center gap-3">
              <StatusChip label={TBC} />
              <span className="font-body text-xs text-navy-800/65">
                Eligibility wording is being finalised from BECCI materials.
              </span>
            </div>
            <p className="mt-6 font-body text-base leading-relaxed text-navy-900/85">
              BECCI is open to aspiring entrepreneurs, existing businesses and MSMEs, manufacturers, professionals,
              students and women entrepreneurs across the eleven business sectors. The precise eligibility criteria
              will be published once approved.
            </p>
            <div className="mt-6 flex items-start gap-3.5 rounded-2xl bg-navy-50/80 p-5">
              <Symbol variant="navy" className="mt-0.5 h-5 w-auto shrink-0" />
              <p className="font-body text-sm leading-relaxed text-navy-900/80">{MEMBERSHIP_NOTE}</p>
            </div>
          </div>

          <div className="glass-light flex flex-col justify-between rounded-3xl p-8 md:p-10">
            <div>
              <SectionHeading eyebrow="Fees & categories" title="To be confirmed." className="mb-6" />
              <div className="flex flex-wrap items-center gap-3">
                <StatusChip label={TBC} />
                <span className="font-body text-xs text-navy-800/65">No amounts have been invented</span>
              </div>
              <p className="mt-6 font-body text-base leading-relaxed text-navy-900/85">
                Membership fees and categories are not published yet. They will appear here once approved by the chamber’s governing body.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-gold/35 bg-white/80 p-5">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-gold-antique">
                Important notice
              </p>
              <p className="mt-1.5 font-body text-xs leading-relaxed text-navy-800/75">
                BECCI is not collecting online payments or membership fees on this website during the current phase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="The process"
            title="Five steps, explained."
            intro="How member onboarding is structured once online applications open."
            className="mb-12"
          />
          <MembershipSteps />
        </div>
      </section>

      <section className="section bg-paper">
        <div className="becci-container max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered honestly."
            className="mb-10"
          />
          <div className="glass-light rounded-3xl px-6 py-2 sm:px-8">
            <Accordion type="single" collapsible className="w-full" data-testid="membership-faq">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-navy-800/10 last:border-b-0">
                  <AccordionTrigger
                    data-testid={`faq-trigger-${i}`}
                    className="py-5 text-left font-heading text-base font-bold text-navy-950 hover:no-underline"
                  >
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 font-body text-sm leading-relaxed text-navy-800/80">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow="Have a question?"
        title="Speak with the BECCI office."
        desc="Reach our registered office in Begumpet, Hyderabad during working hours."
        to="/contact"
        ctaLabel="Contact BECCI"
        testid="membership-to-contact"
      />
    </>
  );
}
