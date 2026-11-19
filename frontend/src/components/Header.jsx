import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, ChevronDown, Search, Volume2, VolumeX, Languages, UserCheck } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { NAV, ORG, CONTACT, SCHEME_DATASET_STATS } from "@/data/becci";
import { NAV_TE, HEADER_TE } from "@/data/teluguUi";
import { useSchemeLanguage } from "@/lib/schemesStore";
import { useMemberAuth } from "@/context/MemberAuthContext";
import { Logo, InstitutionalSeal } from "@/components/Logo";
import SearchDialog from "@/components/SearchDialog";
import { Magnetic } from "@/components/visuals/MotionPrimitives";
import { useCursor } from "@/components/cursor/CursorContext";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
const PRIMARY = NAV.filter((n) => n.to !== "/");

const MEGA_ITEMS = [
  { label: "Live Opportunities", to: "/opportunities", desc: "Verified government jobs, schemes, funding & tenders from official portals." },
  { label: "Member Portal", to: "/member/dashboard", desc: "Private business profile, personalised matches, eligibility & saved deadlines." },
  { label: "Opportunity Navigator", to: "/navigator", desc: "Guided discovery brief matching schemes, guides, portals & sectors." },
  { label: "BECCI Intelligence", to: "/intelligence", desc: "Resource Finder, Opportunity Intelligence, Learning Journeys & Insights." },
  { label: "Government Schemes", to: "/schemes", desc: `${SCHEME_DATASET_STATS.totalShown} verified Central, Telangana & AP schemes sourced from myScheme (GoI).` },
  { label: "BECCI PULSE", to: "/pulse", desc: "Interactive 3D Enterprise Universe, Opportunity Wall & Digital Observatory." },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lang, setLang] = useSchemeLanguage();
  const isTelugu = lang === "te";
  const { isAuthenticated, member } = useMemberAuth();
  const { soundEnabled, toggleSound } = useCursor();
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

          <nav aria-label="Primary" className="hidden items-center gap-4 xl:flex">
            <button
              ref={exploreBtnRef}
              type="button"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((v) => !v)}
              data-testid="nav-explore-mega"
              className={`inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors duration-150 ${
                isTelugu ? "font-telugu" : "font-body"
              } ${
                solid
                  ? megaOpen
                    ? "text-teal-deep"
                    : "text-navy-900/80 hover:text-teal-deep"
                  : megaOpen
                    ? "text-teal-bright"
                    : "text-frost/85 hover:text-white"
              }`}
            >
              <span>{isTelugu ? HEADER_TE.explore : "Explore"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {PRIMARY.map((item) => {
              const active = pathname === item.to;
              const label = isTelugu && NAV_TE[item.to] ? NAV_TE[item.to] : item.short || item.label;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  data-testid={`nav-${slug(item.label)}`}
                  className={`link-underline whitespace-nowrap text-sm font-medium transition-colors duration-150 ${
                    isTelugu ? "font-telugu" : "font-body"
                  } ${
                    solid
                      ? active
                        ? "text-teal-deep"
                        : "text-navy-900/75 hover:text-teal-deep"
                      : active
                        ? "text-teal-bright"
                        : "text-frost/80 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <Link
              to="/pulse"
              aria-current={pathname === "/pulse" ? "page" : undefined}
              data-testid="nav-pulse"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                isTelugu ? "font-telugu" : "font-heading"
              } ${
                pathname === "/pulse"
                  ? solid
                    ? "border-teal-deep bg-teal-mist text-teal-ink"
                    : "border-teal bg-teal/20 text-teal-bright"
                  : solid
                    ? "border-navy-800/15 text-navy-900 hover:border-teal-deep hover:text-teal-deep"
                    : "border-ice/25 text-ice hover:border-teal hover:text-teal-bright"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
              <span>{isTelugu ? NAV_TE["/pulse"] : "Pulse"}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Bilingual Switcher — EN | తెలుగు (Desktop & Tablet Segmented Pill) */}
            <div
              role="group"
              aria-label="Language switcher — English or Telugu"
              data-testid="header-lang-toggle"
              className={`hidden items-center rounded-full border p-0.5 sm:inline-flex ${
                solid
                  ? "border-navy-800/15 bg-frost/90"
                  : "border-white/20 bg-white/[0.06]"
              }`}
            >
              <button
                type="button"
                aria-pressed={!isTelugu}
                onClick={() => setLang("en")}
                data-testid="header-lang-en"
                className={`min-h-[32px] rounded-full px-2.5 py-1 font-heading text-xs font-semibold transition-colors ${
                  !isTelugu
                    ? solid
                      ? "bg-navy-950 text-white"
                      : "bg-teal text-navy-950"
                    : solid
                      ? "text-navy-800/75 hover:text-navy-950"
                      : "text-frost/80 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                aria-pressed={isTelugu}
                onClick={() => setLang("te")}
                data-testid="header-lang-te"
                className={`font-telugu inline-flex min-h-[32px] items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  isTelugu
                    ? solid
                      ? "bg-teal-deep text-white"
                      : "bg-teal text-navy-950 shadow-teal-glow"
                    : solid
                      ? "text-navy-900 hover:text-teal-deep"
                      : "text-teal-bright hover:text-white"
                }`}
              >
                <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                <span>తెలుగు</span>
              </button>
            </div>

            {/* Compact Mobile Header Telugu Toggle Button (<640px) */}
            <button
              type="button"
              aria-pressed={isTelugu}
              onClick={() => setLang(isTelugu ? "en" : "te")}
              data-testid="header-lang-mobile"
              aria-label={isTelugu ? "Switch to English" : "తెలుగులోకి మార్చండి (Switch to Telugu)"}
              className={`font-telugu inline-flex h-10 shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border px-2.5 text-xs font-semibold transition-colors sm:hidden ${
                isTelugu
                  ? solid
                    ? "border-teal-deep bg-teal-deep text-white"
                    : "border-teal bg-teal text-navy-950"
                  : solid
                    ? "border-navy-800/20 bg-frost text-navy-950"
                    : "border-teal/45 bg-teal/15 text-teal-bright"
              }`}
            >
              <Languages className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{isTelugu ? "తెలుగు · EN" : "తెలుగు"}</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Click sound on — turn off" : "Click sound off — turn on"}
              title={soundEnabled ? "Click sound: ON" : "Click sound: OFF"}
              data-testid="sound-toggle"
              className={`hidden h-10 w-10 items-center justify-center rounded-xl border transition-colors sm:inline-flex ${
                soundEnabled
                  ? solid
                    ? "border-teal-deep/45 bg-teal-mist/70 text-teal-ink"
                    : "border-teal/55 bg-teal/20 text-teal-bright"
                  : solid
                    ? "border-navy-800/15 text-navy-900/75 hover:border-teal-deep hover:text-teal-deep"
                    : "border-white/20 text-frost/80 hover:border-teal hover:text-teal-bright"
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              data-testid="header-search-trigger"
              aria-label="Search BECCI website"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                solid
                  ? "border-navy-800/15 text-navy-900 hover:border-teal-deep hover:text-teal-deep"
                  : "border-white/20 text-frost hover:border-teal hover:text-teal-bright"
              }`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <Magnetic strength={0.14} maxOffset={5} className="hidden md:inline-block">
              {isAuthenticated ? (
                <Link
                  to="/member/dashboard"
                  data-testid="header-member-portal-cta"
                  className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] ${
                    solid
                      ? "bg-navy-950 text-white hover:bg-teal-deep"
                      : "bg-teal text-navy-950 shadow-teal-glow hover:bg-teal-bright"
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{member?.display_name?.split(" ")[0] || "Portal"}</span>
                </Link>
              ) : (
                <Link
                  to="/membership"
                  data-testid="join-becci-cta"
                  className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] ${
                    isTelugu ? "font-telugu" : "font-heading"
                  } ${
                    solid
                      ? "bg-navy-950 text-white hover:bg-teal-deep"
                      : "bg-teal text-navy-950 shadow-teal-glow hover:bg-teal-bright"
                  }`}
                >
                  <span>{isTelugu ? HEADER_TE.joinBecci : "Join BECCI"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              )}
            </Magnetic>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  data-testid="mobile-menu-trigger"
                  aria-label="Open navigation menu"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors xl:hidden ${
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
                  {/* Mobile Drawer Language Switcher */}
                  <div
                    role="group"
                    aria-label="Language switcher — English or Telugu"
                    data-testid="mobile-lang-toggle"
                    className="mb-3 grid grid-cols-2 gap-1 rounded-2xl border border-navy-800/12 bg-frost p-1"
                  >
                    <button
                      type="button"
                      aria-pressed={!isTelugu}
                      onClick={() => setLang("en")}
                      data-testid="mobile-lang-en"
                      className={`min-h-[38px] rounded-xl font-heading text-xs font-semibold transition-colors ${
                        !isTelugu
                          ? "bg-navy-950 text-white shadow-xs"
                          : "text-navy-800/75 hover:text-navy-950"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      aria-pressed={isTelugu}
                      onClick={() => setLang("te")}
                      data-testid="mobile-lang-te"
                      className={`font-telugu inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        isTelugu
                          ? "bg-teal-deep text-white shadow-xs"
                          : "text-navy-900 hover:text-teal-deep"
                      }`}
                    >
                      <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>తెలుగు</span>
                    </button>
                  </div>

                  {NAV.map((item) => {
                    const active = pathname === item.to;
                    const label = isTelugu && NAV_TE[item.to] ? `${NAV_TE[item.to]} · ${item.label}` : item.label;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        aria-current={active ? "page" : undefined}
                        data-testid={`mobile-nav-${slug(item.label)}`}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-base font-semibold tracking-tight transition-colors ${
                          isTelugu ? "font-telugu" : "font-heading"
                        } ${
                          active ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                        }`}
                      >
                        <span>{label}</span>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />}
                      </Link>
                    );
                  })}
                  <Link
                    to="/opportunities"
                    aria-current={pathname.startsWith("/opportunities") ? "page" : undefined}
                    data-testid="mobile-nav-opportunities"
                    className={`mt-2 flex items-center justify-between rounded-xl border px-3.5 py-3 font-heading text-base font-semibold tracking-tight transition-colors ${
                      pathname.startsWith("/opportunities")
                        ? "border-teal/40 bg-teal-mist/70 text-teal-ink"
                        : "border-navy-800/12 bg-frost text-navy-950 hover:border-teal-deep"
                    }`}
                  >
                    <span>Live Opportunities</span>
                    <ArrowUpRight className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                  </Link>
                  <Link
                    to={isAuthenticated ? "/member/dashboard" : "/member/login"}
                    aria-current={pathname.startsWith("/member") ? "page" : undefined}
                    data-testid="mobile-nav-member-portal"
                    className={`mt-2 flex items-center justify-between rounded-xl border px-3.5 py-3 font-heading text-base font-semibold tracking-tight transition-colors ${
                      pathname.startsWith("/member")
                        ? "border-teal/40 bg-teal-mist/70 text-teal-ink"
                        : "border-navy-600/20 bg-navy-950 text-white hover:bg-navy-800"
                    }`}
                  >
                    <span>{isAuthenticated ? "Member Dashboard" : "Member Portal Sign In"}</span>
                    <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/navigator"
                    aria-current={pathname === "/navigator" ? "page" : undefined}
                    data-testid="mobile-nav-navigator"
                    className={`mt-2 flex items-center justify-between rounded-xl border px-3.5 py-3 text-base font-semibold tracking-tight transition-colors ${
                      isTelugu ? "font-telugu" : "font-heading"
                    } ${
                      pathname === "/navigator"
                        ? "border-teal/40 bg-teal-mist/70 text-teal-ink"
                        : "border-navy-800/12 bg-frost text-navy-950 hover:border-teal-deep"
                    }`}
                  >
                    <span>{isTelugu ? `${NAV_TE["/navigator"]} · Navigator` : "Opportunity Navigator"}</span>
                    <ArrowUpRight className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/intelligence"
                    aria-current={pathname.startsWith("/intelligence") ? "page" : undefined}
                    data-testid="mobile-nav-intelligence"
                    className={`mt-2 flex items-center justify-between rounded-xl border px-3.5 py-3 text-base font-semibold tracking-tight transition-colors ${
                      isTelugu ? "font-telugu" : "font-heading"
                    } ${
                      pathname.startsWith("/intelligence")
                        ? "border-teal/40 bg-teal-mist/70 text-teal-ink"
                        : "border-navy-800/12 bg-frost text-navy-950 hover:border-teal-deep"
                    }`}
                  >
                    <span>{isTelugu ? `${NAV_TE["/intelligence"]} · Intelligence` : "BECCI Intelligence"}</span>
                    <ArrowUpRight className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/pulse"
                    aria-current={pathname === "/pulse" ? "page" : undefined}
                    data-testid="mobile-nav-pulse"
                    className={`mt-2 flex items-center justify-between rounded-xl border px-3.5 py-3 text-base font-semibold tracking-tight transition-colors ${
                      isTelugu ? "font-telugu" : "font-heading"
                    } ${
                      pathname === "/pulse"
                        ? "border-teal/40 bg-teal-mist/70 text-teal-ink"
                        : "border-navy-800/12 bg-frost text-navy-950 hover:border-teal-deep"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
                      <span>{isTelugu ? `${NAV_TE["/pulse"]} · BECCI PULSE` : "BECCI PULSE"}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                  </Link>
                </nav>
                <div className="border-t border-navy-800/10 p-6">
                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-pressed={soundEnabled}
                    data-testid="mobile-sound-toggle"
                    className="mb-3 flex min-h-[44px] w-full items-center justify-between rounded-xl border border-navy-800/12 bg-frost px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 transition-colors hover:border-teal-deep"
                  >
                    <span className="inline-flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-navy-800/60" aria-hidden="true" />
                      )}
                      <span>Click Sound</span>
                    </span>
                    <span className={soundEnabled ? "text-teal-deep" : "text-navy-800/60"}>
                      {soundEnabled ? "On" : "Off"}
                    </span>
                  </button>
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
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <Link
                    to="/about#governance"
                    className="link-underline font-body text-xs text-ice/80 hover:text-teal-bright"
                  >
                    Governance &amp; Standing
                  </Link>
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
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
