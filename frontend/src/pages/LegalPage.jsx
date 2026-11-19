import React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { PageHero, NextPageBand } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import { LEGAL_DRAFTS, SCHEME_NOTE } from "@/data/becci";

export default function LegalPage({ kind = "privacy" }) {
  const isPrivacy = kind === "privacy";
  const doc = isPrivacy ? LEGAL_DRAFTS.privacy : LEGAL_DRAFTS.terms;

  return (
    <>
      <PageHero
        eyebrow={doc.eyebrow}
        meta="DPDP Act, 2023 · IT Act, 2000 · Draft"
        title={doc.title}
        intro={doc.intro}
      >
        <StatusChip label="Draft · Pending legal review" tone="dark" />
      </PageHero>

      <section className="section bg-paper">
        <div className="becci-container max-w-4xl space-y-6">
          {/* Mandatory Legal-Review Draft Notice */}
          <div className="glass-light flex items-start gap-3.5 rounded-2xl border border-uv/25 p-5 sm:p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-uv-deep" aria-hidden="true" />
            <p className="font-body text-sm leading-relaxed text-navy-950">{LEGAL_DRAFTS.notice}</p>
          </div>

          <div className="glass-light rounded-3xl p-7 sm:p-10 md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800/10 pb-6">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  {isPrivacy ? "Summary Version" : "Key Clauses"}
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-navy-950">{doc.title}</h2>
              </div>
              <StatusChip label="Draft · Pending legal review" />
            </div>

            {isPrivacy ? (
              <dl className="divide-y divide-navy-800/10 pt-2">
                {doc.items.map((item, idx) => (
                  <div key={item.heading} className="grid gap-2 py-5 sm:grid-cols-[0.34fr_0.66fr] sm:gap-8">
                    <dt className="flex items-baseline gap-2.5 font-heading text-sm font-bold text-navy-950">
                      <span className="tabular font-display text-base text-teal-deep">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{item.heading}</span>
                    </dt>
                    <dd className="font-body text-sm leading-relaxed text-navy-800/85 sm:text-[0.95rem]">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <ol className="divide-y divide-navy-800/10 pt-2">
                {doc.clauses.map((clause, idx) => (
                  <li key={idx} className="flex items-baseline gap-4 py-5">
                    <span className="tabular shrink-0 font-display text-xl leading-none text-teal-deep">
                      0{idx + 1}
                    </span>
                    <p className="font-body text-sm leading-relaxed text-navy-800/85 sm:text-base">{clause}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Official Scheme & Guidance Disclaimer */}
          <div className="glass-light rounded-3xl p-7 sm:p-9">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-teal-deep" aria-hidden="true" />
              <h2 className="font-heading text-lg font-bold text-navy-950">
                Official Scheme &amp; Information Disclaimer
              </h2>
            </div>
            <p className="mt-3 font-body text-sm leading-relaxed text-navy-800/85">{SCHEME_NOTE}</p>
          </div>
        </div>
      </section>

      <NextPageBand
        eyebrow={isPrivacy ? "Terms of Use" : "Privacy Policy"}
        title={isPrivacy ? "Review BECCI’s Terms of Use draft." : "Review BECCI’s Privacy Policy draft."}
        desc="Questions on data handling or legal governance? Call +91 94943 03234 or reach our Begumpet, Hyderabad secretariat."
        to={isPrivacy ? "/terms" : "/privacy"}
        ctaLabel={isPrivacy ? "Read Terms of Use" : "Read Privacy Policy"}
        testid="legal-cross-link"
      />
    </>
  );
}
