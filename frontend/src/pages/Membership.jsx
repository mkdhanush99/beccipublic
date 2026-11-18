import React from "react";
import { PageHero, SectionHeading, CTA } from "@/components/primitives";
import Reveal from "@/components/Reveal";
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
        title="Join the chamber built for enterprise."
        intro="This page explains membership. There is no application form, verification or payment in the current phase."
      >
        <StatusChip label="Coming soon" />
      </PageHero>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Who it is for" title="Built for founders at every stage." className="mb-12" />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-navy-800/10 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="bg-white p-6">
                <p className="font-heading text-base font-semibold text-navy-950">{a.title}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/70">{a.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50/50 py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Eligibility" title="Who can join." className="mb-8" />
          <div className="rounded-sm border border-navy-800/10 bg-white p-8 md:p-10">
            <div className="flex items-center gap-3">
              <StatusChip label={TBC} />
              <span className="font-body text-sm text-navy-800/60">Eligibility wording is being finalised from BECCI materials.</span>
            </div>
            <p className="mt-6 font-body text-base leading-relaxed text-navy-900/85">
              BECCI is open to aspiring entrepreneurs, existing businesses and MSMEs, manufacturers, professionals,
              students and women entrepreneurs across the eleven business sectors. The precise eligibility criteria
              will be published once approved.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-sm bg-navy-50 p-5">
              <Symbol variant="navy" className="mt-0.5 h-5 shrink-0" />
              <p className="font-body text-sm leading-relaxed text-navy-800/75">{MEMBERSHIP_NOTE}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="The process" title="Five steps, explained." className="mb-12" />
          <MembershipSteps />
        </div>
      </section>

      <section className="bg-navy-50/50 py-20 md:py-28">
        <div className="becci-container">
          <SectionHeading eyebrow="Fees & categories" title="To be confirmed." className="mb-8" />
          <div className="rounded-sm border border-navy-800/10 bg-white p-8">
            <div className="flex flex-wrap items-center gap-3">
              <StatusChip label={TBC} />
              <p className="font-body text-sm text-navy-800/70">
                Membership fees and categories are not published yet. They will appear here once approved — no amounts have been invented.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions, answered honestly." className="mb-10" />
          <Accordion type="single" collapsible className="w-full" data-testid="membership-faq">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-navy-800/10">
                <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-left font-heading text-base font-semibold text-navy-950 hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm leading-relaxed text-navy-800/75">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-12">
            <CTA to="/contact" testid="membership-to-contact">Contact BECCI</CTA>
          </div>
        </div>
      </section>
    </>
  );
}
