import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Phone, MapPin, Clock } from "lucide-react";
import { NAV, ORG, CONTACT } from "@/data/becci";
import { Logo, Symbol, InstitutionalSeal } from "@/components/Logo";

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

const footerGroups = [
  { title: "Explore", links: NAV.slice(0, 5) },
  {
    title: "Information",
    links: [...NAV.slice(5), { label: "Privacy", to: "/privacy" }, { label: "Terms", to: "/terms" }],
  },
];

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="on-dark relative overflow-hidden bg-navy-950 text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/35 to-transparent" />

      <div className="becci-container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_0.9fr_0.9fr_1.15fr] lg:gap-10">
          {/* Brand column */}
          <div className="max-w-sm">
            <Logo variant="white" lockup className="h-9 w-auto sm:h-10" withLink={false} />
            <p className="mt-5 font-body text-xs leading-relaxed text-navy-300">{ORG.type}</p>
            <div className="mt-5 flex items-center gap-4">
              <InstitutionalSeal className="h-14 w-14 shrink-0" />
              <div>
                <p className="font-display text-xl uppercase leading-[1.05] tracking-wide text-gold">
                  {ORG.tagline}
                </p>
                <p className="mt-1 font-body text-[0.7rem] text-navy-400">
                  Est. 2026 · CIN {CONTACT.cin}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation columns */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="eyebrow text-navy-400">{group.title}</h4>
              <ul className="mt-5 space-y-3">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="link-underline font-body text-[0.9rem] text-navy-300 transition-colors hover:text-white"
                      data-testid={`footer-link-${slug(l.label)}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Institutional office column */}
          <div>
            <h4 className="eyebrow text-navy-400">Registered Office</h4>
            <div className="mt-5 space-y-3.5 font-body text-sm text-navy-300">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{CONTACT.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="link-underline hover:text-white">
                  {CONTACT.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-xs text-navy-400">
                <Clock className="h-4 w-4 shrink-0 text-navy-400" aria-hidden="true" />
                <span>{CONTACT.hours}</span>
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/contact"
                data-testid="footer-contact-cta"
                className="group inline-flex items-center gap-2 rounded-sm border border-white/25 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-[transform,border-color,color] duration-150 ease-out hover:border-gold hover:text-gold active:scale-[0.98]"
              >
                <span>Contact BECCI</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Institutional registry bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 font-body text-xs text-navy-400 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {ORG.name} ({ORG.full}). {CONTACT.incorporation} · CIN{" "}
            <span className="tabular text-navy-300">{CONTACT.cin}</span>
          </p>
          <div className="flex items-center gap-2.5">
            <Symbol variant="white" className="h-4 w-auto opacity-75" />
            <span>{CONTACT.website} · Public institutional website</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
