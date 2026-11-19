import React from "react";
import { PageHero } from "@/components/primitives";
import StatusChip from "@/components/StatusChip";

const CONTENT = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    intro: "A placeholder for BECCI's privacy policy.",
    body: [
      "This is a public information website. A full privacy policy will be published here before any personal information is collected through member services.",
      "In the current phase, the site does not run member login, application forms, payments or any member dashboard feature.",
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Use",
    intro: "A placeholder for BECCI's terms of use.",
    body: [
      "Full terms of use will be published here as the website develops.",
      "Information about membership, schemes and future services is provided for general understanding and is subject to confirmation.",
    ],
  },
};

export default function LegalPage({ kind = "privacy" }) {
  const c = CONTENT[kind];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
      <section className="section bg-paper">
        <div className="becci-container max-w-3xl">
          <div className="glass-light rounded-3xl p-8 md:p-12">
            <StatusChip label="[TO BE CONFIRMED]" />
            <div className="mt-6 space-y-5">
              {c.body.map((p, i) => (
                <p key={i} className="font-body text-base leading-relaxed text-navy-800/80">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
