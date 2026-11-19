import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { PageHero, SectionHeading, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import MembershipSteps from "@/components/infographics/MembershipSteps";
import { Symbol } from "@/components/Logo";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import {
  AUDIENCES,
  FAQS,
  MEMBERSHIP_NOTE,
  MEMBERSHIP_TYPES,
  MSME_LIMITS_2025,
} from "@/data/becci";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Membership() {
  // Client-only Quick Eligibility Check (zero data stored or transmitted)
  const [centralAnswer, setCentralAnswer] = useState(null);
  const [stateAnswer, setStateAnswer] = useState(null);

  const eligibilityOutcome =
    centralAnswer === "yes" || stateAnswer === "yes"
      ? "eligible"
      : centralAnswer === "unsure" || stateAnswer === "unsure"
        ? "check-lists"
        : centralAnswer === "no" && stateAnswer === "no"
          ? "not-listed"
          : null;

  const resetCheck = () => {
    setCentralAnswer(null);
    setStateAnswer(null);
  };

  return (
    <>
      <PageHero
        eyebrow="Membership"
        meta="Phase 01: Telangana & Andhra Pradesh · Online Portal Under Development"
        title="Join the chamber built for OBC/BC enterprise."
        intro="Open to existing and aspiring entrepreneurs, professionals, students and first-generation business owners from eligible OBC/BC communities. Online application and SMS OTP login are currently under development."
      >
        <StatusChip label="Under development" tone="dark" />
      </PageHero>

      {/* Individual vs. Business Membership */}
      <section className="section bg-white">
        <div className="becci-container">
          <SectionHeading
            eyebrow="Membership types"
            title="Two ways to join."
            intro="No Udyam, GST or business registration is required to join as an Individual Member."
            className="mb-12"
          />
          <div className="grid gap-6 lg:grid-cols-2" data-testid="membership-types">
            {MEMBERSHIP_TYPES.map((t) => (
              <GlassSpotlight
                key={t.id}
                tone="light"
                className="glass-light flex h-full min-w-0 flex-col justify-between rounded-3xl p-7 sm:p-9"
              >
                <div className="relative z-10">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    {t.id === "individual" ? "Option 01 · Individuals" : "Option 02 · Enterprises"}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-navy-950">{t.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-navy-800/80">{t.audience}</p>

                  <p className="mt-6 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-navy-800/65">
                    What you’ll provide when applications open
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {t.provide.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 font-body text-sm text-navy-900">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassSpotlight>
            ))}
          </div>

          <div className="mt-14 border-t border-navy-800/12 pt-12">
            <SectionHeading
              eyebrow="Who it is for"
              title="Built for founders at every stage."
              className="mb-10"
            />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCES.map((a) => (
                <div key={a.title}>
                  <p className="font-heading text-base font-bold text-navy-950">{a.title}</p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">{a.line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Rules, Interactive Quick Check, Fees & Revised 2025 MSME Thresholds */}
      <section id="eligibility" className="section bg-paper">
        <div className="becci-container space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Eligibility & Quick Interactive Check */}
            <div className="glass-light min-w-0 rounded-3xl p-7 sm:p-9" data-testid="eligibility-checker">
              <SectionHeading eyebrow="Eligibility" title="Recognised in either list is enough." className="mb-5" />
              <p className="font-body text-sm leading-relaxed text-navy-900/85 sm:text-base">
                Your caste or community must appear in either the Government of India’s <strong>Central OBC List</strong> for
                your State or your State Government’s official <strong>BC/OBC list</strong>. Being listed in either one
                qualifies you to apply.
              </p>

              {/* Quick Eligibility Check (Guidance Only — Zero Storage) */}
              <div className="mt-6 rounded-2xl border border-ice/80 bg-white/95 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    Quick Eligibility Check (Guidance Only)
                  </p>
                  {(centralAnswer || stateAnswer) && (
                    <button
                      type="button"
                      onClick={resetCheck}
                      data-testid="eligibility-reset"
                      className="inline-flex min-h-[36px] items-center gap-1 font-heading text-xs font-semibold text-navy-800/70 hover:text-teal-ink"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Start again</span>
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="font-heading text-sm font-bold text-navy-950">
                      1. Is your community in the Central OBC List for your State?
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {[
                        { id: "yes", label: "Yes" },
                        { id: "no", label: "No" },
                        { id: "unsure", label: "Not sure" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          aria-pressed={centralAnswer === opt.id}
                          onClick={() => setCentralAnswer(opt.id)}
                          data-testid={`elig-central-${opt.id}`}
                          className={`min-h-[40px] rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                            centralAnswer === opt.id
                              ? "border-navy-950 bg-navy-950 text-white"
                              : "border-navy-800/15 bg-frost text-navy-900 hover:border-teal-deep"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {centralAnswer && centralAnswer !== "yes" && (
                    <div>
                      <p className="font-heading text-sm font-bold text-navy-950">
                        2. Is it in your State Government’s official BC/OBC list?
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {[
                          { id: "yes", label: "Yes" },
                          { id: "no", label: "No" },
                          { id: "unsure", label: "Not sure" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            aria-pressed={stateAnswer === opt.id}
                            onClick={() => setStateAnswer(opt.id)}
                            data-testid={`elig-state-${opt.id}`}
                            className={`min-h-[40px] rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                              stateAnswer === opt.id
                                ? "border-navy-950 bg-navy-950 text-white"
                                : "border-navy-800/15 bg-frost text-navy-900 hover:border-teal-deep"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {eligibilityOutcome && (
                    <div
                      role="status"
                      aria-live="polite"
                      data-testid="eligibility-result"
                      className="rounded-xl border border-teal/35 bg-teal-mist/55 p-4"
                    >
                      {eligibilityOutcome === "eligible" ? (
                        <>
                          <p className="font-heading text-sm font-bold text-navy-950">
                            You meet the community-list eligibility criterion to apply.
                          </p>
                          <p className="mt-1 font-body text-xs leading-relaxed text-navy-900/80">
                            Recognition in either list is enough. Membership is confirmed after BECCI’s team verifies your community certificate once online applications open (Phase 01: Telangana &amp; Andhra Pradesh first).
                          </p>
                        </>
                      ) : eligibilityOutcome === "check-lists" ? (
                        <>
                          <p className="font-heading text-sm font-bold text-navy-950">
                            Check the official Central and State lists first.
                          </p>
                          <p className="mt-1 font-body text-xs leading-relaxed text-navy-900/80">
                            Look up your community on the National Commission for Backward Classes (NCBC) portal or your State BC list, or call our Hyderabad secretariat on +91 94943 03234 for orientation.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-heading text-sm font-bold text-navy-950">
                            BECCI membership requires recognition in either list.
                          </p>
                          <p className="mt-1 font-body text-xs leading-relaxed text-navy-900/80">
                            You can still freely use BECCI’s public Government Scheme Centre and Knowledge Centre guides.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-navy-800/10 pt-3">
                  <a
                    href="https://ncbc.nic.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline inline-flex items-center gap-1 font-heading text-xs font-semibold text-teal-ink"
                  >
                    <span>Central OBC Lists (ncbc.nic.in)</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <span className="font-body text-[0.7rem] text-navy-800/55">
                    Does not store your answers
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3.5 rounded-2xl bg-navy-50/80 p-5">
                <Symbol variant="navy" className="mt-0.5 h-5 w-auto shrink-0" />
                <p className="font-body text-sm leading-relaxed text-navy-900/80">{MEMBERSHIP_NOTE}</p>
              </div>
            </div>

            {/* Fees, Categories & Portal Status */}
            <div className="glass-light flex min-w-0 flex-col justify-between rounded-3xl p-7 sm:p-9">
              <div>
                <SectionHeading eyebrow="Fees, categories & portal" title="To be announced by BECCI." className="mb-5" />
                <div className="flex flex-wrap items-center gap-3">
                  <StatusChip label="Under development" />
                  <span className="font-body text-xs text-navy-800/70">
                    Online application &amp; SMS OTP login not open yet
                  </span>
                </div>
                <p className="mt-5 font-body text-base leading-relaxed text-navy-900/85">
                  Membership categories, fees, renewal periods and category-specific benefits (including the Networking
                  category) are being finalised by BECCI’s governing body and will be published here once formally approved.
                </p>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy-800/80">
                  Initial Phase 01 membership desks focus on <strong>Telangana</strong> and <strong>Andhra Pradesh</strong>,
                  with other states following in phases.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="rounded-2xl border border-teal/30 bg-teal-mist/55 p-5">
                  <p className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-ink">
                    <ShieldCheck className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                    <span>Privacy &amp; zero-payment safeguard</span>
                  </p>
                  <p className="mt-1.5 font-body text-xs leading-relaxed text-navy-800/85">
                    BECCI is not collecting online payments or membership fees on this website during the current phase.
                    Community certificates are seen solely by authorised verification staff and never appear in public
                    profiles or the members directory.
                  </p>
                </div>
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
                  MSME classification thresholds (revised 2025).
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
            <p className="mt-3 font-body text-xs text-navy-800/65">{MSME_LIMITS_2025.note}</p>
          </div>
        </div>
      </section>

      <section id="onboarding" className="section bg-white">
        <div className="becci-container">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="The onboarding process"
              title="Five steps from application to active member."
              intro="How online membership registration and document verification work once the portal opens."
            />
            <StatusChip label="Under development" />
          </div>
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
        title="Speak with the BECCI secretariat."
        desc="Call +91 94943 03234 (Mon–Sat, 9:30 am – 6:30 pm IST) or prepare an enquiry for our registered office in Begumpet, Hyderabad."
        to="/contact"
        ctaLabel="Contact BECCI"
        testid="membership-to-contact"
      />
    </>
  );
}
