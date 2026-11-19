import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import { NAV, ORG, CONTACT, SCHEME_NOTE } from "@/data/becci";
import { Logo, Symbol, InstitutionalSeal } from "@/components/Logo";

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

const footerGroups = [
  { title: "Explore", links: [...NAV.slice(0, 5), { label: "BECCI Pulse", to: "/pulse" }] },
  {
    title: "Information",
    links: [
      ...NAV.slice(5),
      { label: "BECCI Intelligence", to: "/intelligence" },
      { label: "Governance", to: "/about#governance" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="on-dark relative overflow-hidden bg-navy-950 text-white">
      <div className="bg-spectrum h-[2px] w-full opacity-55" />

      <div className="becci-container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_0.9fr_0.9fr_1.15fr] lg:gap-10">
          {/* Brand column — official white lockup & restrained gold Institutional Seal */}
          <div className="max-w-sm">
            <Logo variant="white" lockup className="h-9 w-auto sm:h-10" withLink={false} />
            <p className="mt-5 font-body text-xs leading-relaxed text-ice/80">{ORG.type}</p>
            <div className="mt-5 flex items-center gap-4">
              <InstitutionalSeal className="h-14 w-14 shrink-0" />
              <div>
                <p className="font-display text-xl uppercase leading-[1.05] tracking-wide text-gold">
                  {ORG.tagline}
                </p>
                <p className="mt-1 font-body text-[0.7rem] text-ice/60">
                  Est. 2026 · CIN {CONTACT.cin}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation columns — compact 2-column grid on mobile, seamless columns on desktop */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="eyebrow text-teal">{group.title}</h2>
                <ul className="mt-4 space-y-0.5 lg:mt-5 lg:space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="link-underline inline-flex min-h-[40px] items-center font-body text-[0.9rem] text-ice/85 transition-colors hover:text-teal-bright lg:min-h-0"
                        data-testid={`footer-link-${slug(l.label)}`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Institutional office column */}
          <div>
            <h2 className="eyebrow text-teal">Registered Office</h2>
            <div className="mt-5 space-y-3.5 font-body text-sm text-ice/85">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <span>{CONTACT.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="link-underline inline-flex min-h-[40px] items-center hover:text-teal-bright lg:min-h-0"
                >
                  {CONTACT.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="link-underline inline-flex min-h-[40px] items-center break-all hover:text-teal-bright lg:min-h-0"
                >
                  {CONTACT.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-xs text-ice/65">
                <Clock className="h-4 w-4 shrink-0 text-ice/65" aria-hidden="true" />
                <span>{CONTACT.hours}</span>
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/contact"
                data-testid="footer-contact-cta"
                className="group inline-flex items-center gap-2 rounded-full border border-ice/25 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-[transform,border-color,color] duration-150 ease-out hover:border-teal hover:text-teal-bright active:scale-[0.98]"
              >
                <span>Contact BECCI</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Official Scheme & Guidance Disclaimer */}
        <div className="mt-14 rounded-2xl border border-ice/12 bg-white/[0.03] px-5 py-4">
          <p className="font-body text-xs leading-relaxed text-ice/75">
            <span className="font-heading font-semibold uppercase tracking-[0.14em] text-teal-bright">
              Disclaimer ·{" "}
            </span>
            {SCHEME_NOTE}
          </p>
        </div>

        {/* Institutional registry bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 font-body text-xs text-navy-400 md:flex-row md:items-center">
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
