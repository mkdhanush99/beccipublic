import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";
import { CONTACT, TBC } from "@/data/becci";

const ROWS = [
  { icon: Mail, label: "Email", value: CONTACT.email },
  { icon: Phone, label: "Phone", value: CONTACT.phone },
  { icon: MapPin, label: "Address", value: CONTACT.address },
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach the chamber."
        intro="Verified BECCI contact details will be published here once confirmed."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="becci-container grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Contact details" title={CONTACT.org} className="mb-10" />
            <div className="divide-y divide-navy-800/10 border-y border-navy-800/10">
              {ROWS.map((r) => (
                <div key={r.label} className="flex items-center gap-5 py-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-navy-50 text-navy-700">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-navy-800/50">{r.label}</p>
                    <p className="mt-1 font-body text-base text-navy-950">
                      {r.value === TBC ? <StatusChip label={TBC} /> : r.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-navy-800/10 bg-navy-50/40 p-8 md:p-10">
            <h3 className="font-heading text-lg font-semibold text-navy-950">A note on this page</h3>
            <p className="mt-4 font-body text-base leading-relaxed text-navy-800/75">{CONTACT.note}</p>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-800/60">
              No contact form submits information in this phase, and no social profiles or email addresses have been
              invented. Details appear here only once verified.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
