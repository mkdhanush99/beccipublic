import React from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import MembershipSteps from "@/components/infographics/MembershipSteps";
import { Symbol } from "@/components/Logo";
import { AUDIENCES, MEMBERSHIP_NOTE, FAQS, MSME_LIMITS_2025, TBC } from "@/data/becci";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export default function Membership() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        meta="Phase 01: Telangana & Andhra Pradesh"
        title="Join the chamber built for enterprise."
        intro="Open to entrepreneurs, aspiring founders, professionals and students from OBC/BC communities. Online applications open first in Telangana and Andhra Pradesh, with other states following in phases."
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
        <div className="becci-container space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="glass-light min-w-0 rounded-3xl p-8 md:p-10">
              <SectionHeading eyebrow="Eligibility" title="Who can join." className="mb-6" />
              <div className="flex flex-wrap items-center gap-3">
                <StatusChip label="Active · Phase 01" />
                <span className="font-body text-xs text-navy-800/65">
                  Initial states: Telangana &amp; Andhra Pradesh (other states in phases)
                </span>
              </div>
              <p className="mt-6 font-body text-base leading-relaxed text-navy-900/85">
                Entrepreneurs, aspiring entrepreneurs, professionals and students from communities recognised as OBC/BC —
                in either the Central OBC list for your state or your state’s BC/OBC list. You do not need to be on both
                lists, and aspiring founders or students do not need Udyam or GST registrations to apply.
              </p>
              <div className="mt-6 flex items-start gap-3.5 rounded-2xl bg-navy-50/80 p-5">
                <Symbol variant="navy" className="mt-0.5 h-5 w-auto shrink-0" />
                <p className="font-body text-sm leading-relaxed text-navy-900/80">{MEMBERSHIP_NOTE}</p>
              </div>
            </div>

            <div className="glass-light flex min-w-0 flex-col justify-between rounded-3xl p-8 md:p-10">
              <div>
                <SectionHeading eyebrow="Fees & categories" title="To be confirmed." className="mb-6" />
                <div className="flex flex-wrap items-center gap-3">
                  <StatusChip label={TBC} />
                  <span className="font-body text-xs text-navy-800/65">Categories and fees will be announced [CONFIRM]</span>
                </div>
                <p className="mt-6 font-body text-base leading-relaxed text-navy-900/85">
                  Membership fees, tiers and renewal schedules are not published yet. They will appear here once approved
                  by the chamber’s governing body.
                </p>
              </div>
              <div className="mt-8 rounded-2xl border border-teal/30 bg-teal-mist/55 p-5">
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-ink">
                  Privacy &amp; zero-payment guarantee
                </p>
                <p className="mt-1.5 font-body text-xs leading-relaxed text-navy-800/80">
                  BECCI is not collecting online payments on this website during the current phase. Caste certificates are
                  seen only by the verification team and never appear in the member directory.
                </p>
              </div>
            </div>
          </div>

          {/* Revised 2025 MSME Classification Limits */}
          <div className="glass-light rounded-3xl p-7 sm:p-9" data-testid="msme-limits-2025">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  Reference for Business Members
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-navy-950">
                  MSME classification limits (revised 2025).
                </h2>
              </div>
              <a
                href={MSME_LIMITS_2025.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-wider text-teal-ink"
              >
                <span>{MSME_LIMITS_2025.sourceLabel}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-ice/80 bg-white/90">
              <table className="w-full min-w-[460px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-navy-800/10 bg-frost/90">
                    <th className="px-5 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                      Enterprise Tier
                    </th>
                    <th className="px-5 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                      Investment in Plant &amp; Machinery / Equipment
                    </th>
                    <th className="px-5 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                      Annual Turnover
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/10 font-body text-sm text-navy-900">
                  {MSME_LIMITS_2025.tiers.map((row) => (
                    <tr key={row.tier} className="hover:bg-frost/40">
                      <td className="px-5 py-3.5 font-heading font-bold text-navy-950">{row.tier}</td>
                      <td className="tabular px-5 py-3.5 font-medium text-teal-ink">{row.investment}</td>
                      <td className="tabular px-5 py-3.5">{row.turnover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            title="Twelve questions, answered honestly."
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
        desc="Call +91 94943 03234, email becciglobal@gmail.com, or reach our registered office in Begumpet, Hyderabad."
        to="/contact"
        ctaLabel="Contact BECCI"
        testid="membership-to-contact"
      />
    </>
  );
}
