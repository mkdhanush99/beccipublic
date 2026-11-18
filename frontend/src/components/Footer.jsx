import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { NAV, ORG, CONTACT } from "@/data/becci";
import { Logo, Symbol } from "@/components/Logo";

const footerGroups = [
  { title: "Explore", links: NAV.slice(0, 5) },
  { title: "Information", links: [...NAV.slice(5), { label: "Privacy", to: "/privacy" }, { label: "Terms", to: "/terms" }] },
];

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="relative overflow-hidden bg-navy-950 text-white">
      <div className="becci-container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo variant="white" className="h-9" withLink={false} />
            <p className="mt-6 font-body text-sm leading-relaxed text-navy-300">{ORG.full}</p>
            <p className="mt-4 font-display text-xl uppercase leading-[1.05] tracking-wide text-gold">
              {ORG.tagline}
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="eyebrow text-navy-400">{group.title}</h4>
              <ul className="mt-5 space-y-3">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="link-underline font-body text-[0.92rem] text-navy-300 transition-colors hover:text-white"
                      data-testid={`footer-link-${l.label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-2">
          <div className="space-y-1 font-body text-sm text-navy-300">
            <p><span className="text-navy-400">Phone:</span> <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-white">{CONTACT.phone}</a></p>
            <p><span className="text-navy-400">Address:</span> {CONTACT.address}</p>
            <p><span className="text-navy-400">Hours:</span> {CONTACT.hours}</p>
            <p><span className="text-navy-400">Web:</span> <a href={`https://${CONTACT.website}`} target="_blank" rel="noreferrer" className="hover:text-white">{CONTACT.website}</a></p>
          </div>
          <div className="md:text-right">
            <Link
              to="/contact"
              data-testid="footer-contact-cta"
              className="group inline-flex items-center gap-2 rounded-sm border border-white/25 px-5 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              Contact BECCI
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 font-body text-xs text-navy-400 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {ORG.name}. {CONTACT.incorporation} · CIN {CONTACT.cin}</p>
          <div className="flex items-center gap-2">
            <Symbol variant="white" className="h-4 opacity-70" />
            <span>Public information website · mockup</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
