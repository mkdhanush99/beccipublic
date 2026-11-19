import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { NAV, ORG, CONTACT } from "@/data/becci";
import { Logo, InstitutionalSeal } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
const PRIMARY = NAV.filter((n) => n.to !== "/");

const MEGA_ITEMS = [
  { label: "About BECCI", to: "/about", desc: "Institutional charter, Vision & Mission, and Section 8 standing." },
  { label: "What We Do", to: "/what-we-do", desc: "Five support pillars and six areas of enterprise work." },
  { label: "Who We Serve", to: "/who-we-serve", desc: "Six entrepreneur constituencies across eleven business sectors." },
  { label: "Wings & Chapters", to: "/wings-chapters", desc: "National-to-city structure, Women's Wing and Youth Wing." },
  { label: "Government Schemes", to: "/schemes", desc: "Eight Central Government programmes with direct official links." },
  { label: "News & Knowledge", to: "/knowledge", desc: "Official announcements and eleven public enterprise portals." },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef(null);
  const exploreBtnRef = useRef(null);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!megaOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        exploreBtnRef.current?.focus();
      }
    };
    const onClickOutside = (e) => {
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onClickOutside);
    };
  }, [megaOpen]);

  const solid = scrolled || megaOpen || pathname === "/contact";

  return (
    <header
      ref={megaRef}
      data-testid="site-header"
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      {/* Floating Translucent Glass Capsule */}
      <div
        className={`mx-auto max-w-[1280px] overflow-hidden rounded-2xl transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
          solid ? "glass-header-light" : "on-dark glass-dark"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-5 px-4 sm:px-6">
          <Logo variant={solid ? "navy" : "white"} className="h-7 w-auto shrink-0" testid="header-logo" />

          <nav aria-label="Primary" className="hidden items-center gap-5 xl:flex">
            <button
              ref={exploreBtnRef}
              type="button"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((v) => !v)}
              data-testid="nav-explore-mega"
              className={`inline-flex items-center gap-1 whitespace-nowrap font-body text-[0.875rem] font-medium transition-colors duration-150 ${
                solid
                  ? megaOpen
                    ? "text-teal-deep"
                    : "text-navy-900/80 hover:text-teal-deep"
                  : megaOpen
                    ? "text-teal-bright"
                    : "text-frost/85 hover:text-white"
              }`}
            >
              <span>Explore</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {PRIMARY.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  data-testid={`nav-${slug(item.label)}`}
                  className={`link-underline whitespace-nowrap font-body text-[0.875rem] font-medium transition-colors duration-150 ${
                    solid
                      ? active
                        ? "text-teal-deep"
                        : "text-navy-900/75 hover:text-teal-deep"
                      : active
                        ? "text-teal-bright"
                        : "text-frost/80 hover:text-white"
                  }`}
                >
                  {item.short || item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/membership"
              data-testid="join-becci-cta"
              className={`group hidden items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] sm:inline-flex ${
                solid
                  ? "bg-navy-950 text-white hover:bg-teal-deep"
                  : "bg-teal text-navy-950 shadow-teal-glow hover:bg-teal-bright"
              }`}
            >
              <span>Join BECCI</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  data-testid="mobile-menu-trigger"
                  aria-label="Open navigation menu"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors xl:hidden ${
                    solid ? "border-navy-800/15 text-navy-900" : "border-white/20 text-white"
                  }`}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[88%] max-w-sm flex-col border-navy-800/10 bg-white/95 p-0 backdrop-blur-2xl overscroll-contain [&>button]:hidden"
              >
                <SheetTitle className="sr-only">Site navigation menu</SheetTitle>
                <SheetDescription className="sr-only">Navigate pages across the BECCI public website</SheetDescription>
                <div className="flex h-16 items-center justify-between border-b border-navy-800/10 px-6">
                  <Logo variant="navy" className="h-7 w-auto" withLink={false} />
                  <SheetClose asChild>
                    <button
                      type="button"
                      aria-label="Close navigation menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-navy-900 hover:bg-navy-50"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </SheetClose>
                </div>
                <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
                  {NAV.map((item) => {
                    const active = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        aria-current={active ? "page" : undefined}
                        data-testid={`mobile-nav-${slug(item.label)}`}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-3 font-heading text-base font-semibold tracking-tight transition-colors ${
                          active ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                        }`}
                      >
                        <span>{item.label}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-navy-800/10 p-6">
                  <Link
                    to="/membership"
                    data-testid="mobile-join-cta"
                    className="flex items-center justify-center gap-2 rounded-full bg-navy-950 px-5 py-3.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-teal-deep active:scale-[0.98]"
                  >
                    <span>Join BECCI</span>
                    <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                  </Link>
                  <p className="mt-4 text-center font-display text-base uppercase tracking-wide text-teal-deep">
                    {ORG.tagline}
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Continuous spectrum scroll progress hairline (Electric Teal → Ice Blue → Ultraviolet) */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="bg-spectrum h-[2px] w-full origin-left"
          />
        )}
      </div>

      {/* Floating Glass Explore Mega-Menu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ type: "spring", bounce: 0, duration: 0.28 }}
            className="glass-light mx-auto mt-2.5 hidden max-w-[1280px] rounded-2xl p-6 xl:block"
          >
            <div className="grid grid-cols-[1.35fr_0.65fr] gap-6">
              <div className="grid grid-cols-3 gap-3">
                {MEGA_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group rounded-xl p-4 transition-colors hover:bg-teal-mist/55"
                  >
                    <p className="flex items-center justify-between font-heading text-sm font-bold text-navy-950 group-hover:text-teal-ink">
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-navy-400 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-deep" aria-hidden="true" />
                    </p>
                    <p className="mt-1.5 font-body text-xs leading-relaxed text-navy-800/75">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="on-dark flex flex-col justify-between rounded-xl bg-navy-950 p-6 text-white">
                <div className="flex items-start gap-4">
                  <InstitutionalSeal className="h-14 w-14 shrink-0" />
                  <div>
                    <p className="font-display text-xl uppercase tracking-wide text-gold">{ORG.tagline}</p>
                    <p className="mt-1 font-body text-xs leading-relaxed text-ice/80">
                      {CONTACT.incorporation} · CIN {CONTACT.cin}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-body text-xs text-ice/75">Begumpet, Hyderabad</span>
                  <Link
                    to="/contact"
                    className="link-underline inline-flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-wider text-teal-bright"
                  >
                    <span>Contact office</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
