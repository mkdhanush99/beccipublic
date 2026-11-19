import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  ChevronDown, 
  Search, 
  Volume2, 
  VolumeX, 
  Languages, 
  UserCheck,
  Briefcase,
  Users,
  Network,
  Sparkles,
  Compass
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { ORG, CONTACT } from "@/data/becci";
import { NAV_TE, HEADER_TE } from "@/data/teluguUi";
import { useSchemeLanguage } from "@/lib/schemesStore";
import { useMemberAuth } from "@/context/MemberAuthContext";
import { Logo, InstitutionalSeal } from "@/components/Logo";
import SearchDialog from "@/components/SearchDialog";
import { Magnetic } from "@/components/visuals/MotionPrimitives";
import { useCursor } from "@/components/cursor/CursorContext";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

// Scope consolidated items (combining What We Do, Who We Serve, Wings & Chapters)
const SCOPE_DROPDOWN_ITEMS = [
  {
    title: "What We Do",
    teTitle: "కార్యకలాపాలు",
    desc: "5 Core Pillars, market access, institutional credit & economic multiplier.",
    to: "/what-we-do",
    icon: Briefcase,
    badge: "Pillars",
  },
  {
    title: "Who We Serve",
    teTitle: "ఎవరి కోసం",
    desc: "Bahujan entrepreneurs, artisans, 11 key industry sectors & women founders.",
    to: "/who-we-serve",
    icon: Users,
    badge: "11 Sectors",
  },
  {
    title: "Wings & Chapters",
    teTitle: "విభాగాలు",
    desc: "National council, state bodies, district coordinators & trade wings.",
    to: "/wings-chapters",
    icon: Network,
    badge: "Network",
  },
];

// Clean, streamlined top-level navigation
const PRIMARY_NAV = [
  { label: "About", to: "/about", te: "మా గురించి" },
  { isDropdown: true, label: "Scope", te: "పరిధి" },
  { label: "Opportunities", to: "/opportunities", te: "అవకాశాలు" },
  { label: "Schemes", to: "/schemes", te: "పథకాలు" },
  { label: "Membership", to: "/membership", te: "సభ్యత్వం" },
  { label: "Knowledge", to: "/knowledge", te: "జ్ఞాన కేంద్రం" },
  { label: "Contact", to: "/contact", te: "సంప్రదించండి" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lang, setLang] = useSchemeLanguage();
  const isTelugu = lang === "te";
  const { isAuthenticated, member } = useMemberAuth();
  const { soundEnabled, toggleSound } = useCursor();
  
  const scopeDropdownRef = useRef(null);
  const scopeTimeoutRef = useRef(null);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setScopeOpen(false);
  }, [pathname]);

  // Smooth hover handlers for the Scope dropdown with hover-intent debounce
  const handleScopeMouseEnter = () => {
    if (scopeTimeoutRef.current) clearTimeout(scopeTimeoutRef.current);
    setScopeOpen(true);
  };

  const handleScopeMouseLeave = () => {
    scopeTimeoutRef.current = setTimeout(() => {
      setScopeOpen(false);
    }, 160); // 160ms grace window for natural mouse movement
  };

  const isScopeActive = 
    pathname.startsWith("/what-we-do") || 
    pathname.startsWith("/who-we-serve") || 
    pathname.startsWith("/wings-chapters");

  const solid = scrolled || pathname === "/contact";

  return (
    <header
      data-testid="site-header"
      className="fixed inset-x-0 top-0 z-50 px-3 pt-2.5 sm:px-6 sm:pt-3.5 transition-all duration-300"
    >
      {/* Floating Translucent Glass Capsule - Compact, organized single bar */}
      <div
        className={`mx-auto max-w-[1240px] rounded-2xl transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
          solid ? "glass-header-light shadow-md" : "on-dark glass-dark"
        }`}
      >
        <div className="flex h-14 sm:h-15 items-center justify-between gap-3 px-3.5 sm:px-5">
          {/* Official BECCI Logo Lockup */}
          <Logo 
            variant={solid ? "navy" : "white"} 
            className="h-6 sm:h-7 w-auto shrink-0 transition-opacity hover:opacity-90" 
            testid="header-logo" 
          />

          {/* Desktop Streamlined Navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-1.5 lg:gap-2.5 xl:gap-3.5 lg:flex">
            {PRIMARY_NAV.map((item) => {
              if (item.isDropdown) {
                return (
                  <div
                    key="scope-dropdown"
                    ref={scopeDropdownRef}
                    onMouseEnter={handleScopeMouseEnter}
                    onMouseLeave={handleScopeMouseLeave}
                    className="relative"
                  >
                    <button
                      type="button"
                      aria-expanded={scopeOpen}
                      onClick={() => setScopeOpen((v) => !v)}
                      data-testid="nav-scope-dropdown"
                      className={`group inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-all duration-200 ${
                        isTelugu ? "font-telugu" : "font-body"
                      } ${
                        isScopeActive
                          ? solid
                            ? "bg-teal-mist/80 text-teal-deep font-semibold"
                            : "bg-teal/20 text-teal-bright font-semibold"
                          : solid
                            ? scopeOpen
                              ? "bg-navy-800/5 text-teal-deep"
                              : "text-navy-900/80 hover:bg-navy-800/5 hover:text-teal-deep"
                            : scopeOpen
                              ? "bg-white/10 text-white"
                              : "text-frost/85 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <span>{isTelugu ? item.te : item.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-250 ease-out ${
                          scopeOpen ? "rotate-180 text-teal-deep dark:text-teal-bright" : "opacity-70 group-hover:opacity-100"
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Rich Hover Floating Scope Card */}
                    <AnimatePresence>
                      {scopeOpen && (
                        <motion.div
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={reduce ? { opacity: 0, y: 4, scale: 0.98 } : { opacity: 0, y: 4, scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                          className="absolute left-1/2 top-full z-50 mt-2 w-[340px] -translate-x-1/2 rounded-2xl border border-white/20 bg-navy-950/95 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/40 text-white"
                        >
                          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-teal-bright">
                            <span className="flex items-center gap-1.5">
                              <Compass className="h-3.5 w-3.5" />
                              <span>{isTelugu ? "ఛాంబర్ పరిధి · Chamber Scope" : "Chamber Scope & Network"}</span>
                            </span>
                            <span className="text-[10px] text-ice/60">3 Pillars</span>
                          </div>

                          <div className="mt-1 space-y-1">
                            {SCOPE_DROPDOWN_ITEMS.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive = pathname === sub.to;
                              return (
                                <Link
                                  key={sub.to}
                                  to={sub.to}
                                  data-testid={`scope-sublink-${slug(sub.title)}`}
                                  className={`group flex items-start gap-3 rounded-xl p-2.5 transition-all duration-150 ${
                                    isSubActive
                                      ? "bg-teal/20 text-white"
                                      : "hover:bg-white/[0.08] text-white/90"
                                  }`}
                                >
                                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                    isSubActive
                                      ? "border-teal/50 bg-teal/25 text-teal-bright"
                                      : "border-white/15 bg-white/5 text-ice group-hover:border-teal/40 group-hover:bg-teal/15 group-hover:text-teal-bright"
                                  }`}>
                                    <SubIcon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-heading text-xs font-semibold text-white group-hover:text-teal-bright transition-colors">
                                        {isTelugu ? sub.teTitle : sub.title}
                                      </span>
                                      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-ice/80">
                                        {sub.badge}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-ice/70">
                                      {sub.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          {/* Quick Bottom Anchor to Pulse */}
                          <div className="mt-1 border-t border-white/10 pt-1.5 px-2">
                            <Link
                              to="/pulse"
                              className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-[11px] font-medium text-ice/80 hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                                <span>BECCI 3D Observatory (Pulse)</span>
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-teal-bright transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const active = pathname === item.to;
              const label = isTelugu && item.te ? item.te : item.label;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  data-testid={`nav-${slug(item.label)}`}
                  className={`rounded-lg px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-all duration-200 ${
                    isTelugu ? "font-telugu" : "font-body"
                  } ${
                    active
                      ? solid
                        ? "bg-teal-mist/80 text-teal-deep font-semibold"
                        : "bg-teal/20 text-teal-bright font-semibold"
                      : solid
                        ? "text-navy-900/80 hover:bg-navy-800/5 hover:text-teal-deep"
                        : "text-frost/85 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language, Sound, Search & CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Global Bilingual Switcher — EN | తెలుగు */}
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
                className={`min-h-[28px] rounded-full px-2 py-0.5 font-heading text-[11px] font-semibold transition-colors ${
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
                className={`font-telugu inline-flex min-h-[28px] items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                  isTelugu
                    ? solid
                      ? "bg-teal-deep text-white"
                      : "bg-teal text-navy-950 shadow-teal-glow"
                    : solid
                      ? "text-navy-900 hover:text-teal-deep"
                      : "text-teal-bright hover:text-white"
                }`}
              >
                <Languages className="h-3 w-3" aria-hidden="true" />
                <span>తెలుగు</span>
              </button>
            </div>

            {/* Compact Mobile Header Telugu Toggle (<640px) */}
            <button
              type="button"
              aria-pressed={isTelugu}
              onClick={() => setLang(isTelugu ? "en" : "te")}
              data-testid="header-lang-mobile"
              aria-label={isTelugu ? "Switch to English" : "తెలుగులోకి మార్చండి"}
              className={`font-telugu inline-flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border px-2 text-xs font-semibold transition-colors sm:hidden ${
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
              <span>{isTelugu ? "తెలుగు" : "TE"}</span>
            </button>

            {/* Sound Toggle (Tablet & Desktop) */}
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Sound on — click to mute" : "Sound off — click to enable"}
              title={soundEnabled ? "Sound: ON" : "Sound: OFF"}
              data-testid="sound-toggle"
              className={`hidden h-9 w-9 items-center justify-center rounded-xl border transition-colors sm:inline-flex ${
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
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>

            {/* Quick Search Dialog Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              data-testid="header-search-trigger"
              aria-label="Search BECCI website"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                solid
                  ? "border-navy-800/15 text-navy-900 hover:border-teal-deep hover:text-teal-deep"
                  : "border-white/20 text-frost hover:border-teal hover:text-teal-bright"
              }`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Primary Action CTA — Always perfectly visible and never clipped */}
            <Magnetic strength={0.14} maxOffset={5} className="inline-block">
              {isAuthenticated ? (
                <Link
                  to="/member/dashboard"
                  data-testid="header-member-portal-cta"
                  className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 font-heading text-xs font-semibold uppercase tracking-wider transition-all duration-150 ease-out active:scale-[0.97] ${
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
                  className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ease-out active:scale-[0.97] ${
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

            {/* Mobile Sheet Menu Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  data-testid="mobile-menu-trigger"
                  aria-label="Open navigation menu"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors lg:hidden ${
                    solid ? "border-navy-800/15 text-navy-900" : "border-white/20 text-white"
                  }`}
                >
                  <Menu className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[88%] max-w-sm flex-col border-navy-800/10 bg-white/95 p-0 backdrop-blur-2xl overscroll-contain [&>button]:hidden"
              >
                <SheetTitle className="sr-only">Site navigation menu</SheetTitle>
                <SheetDescription className="sr-only">Navigate pages across the BECCI public website</SheetDescription>
                <div className="flex h-14 items-center justify-between border-b border-navy-800/10 px-5">
                  <Logo variant="navy" className="h-6 w-auto" withLink={false} />
                  <SheetClose asChild>
                    <button
                      type="button"
                      aria-label="Close navigation menu"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-navy-900 hover:bg-navy-50"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </SheetClose>
                </div>
                
                <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
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
                      className={`min-h-[36px] rounded-xl font-heading text-xs font-semibold transition-colors ${
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
                      className={`font-telugu inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        isTelugu
                          ? "bg-teal-deep text-white shadow-xs"
                          : "text-navy-900 hover:text-teal-deep"
                      }`}
                    >
                      <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>తెలుగు</span>
                    </button>
                  </div>

                  {/* Primary Mobile Links */}
                  <Link
                    to="/"
                    aria-current={pathname === "/" ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors ${
                      pathname === "/" ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                    }`}
                  >
                    <span>{isTelugu ? "హోమ్ · Home" : "Home"}</span>
                  </Link>

                  <Link
                    to="/about"
                    aria-current={pathname === "/about" ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors ${
                      pathname === "/about" ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                    }`}
                  >
                    <span>{isTelugu ? "మా గురించి · About BECCI" : "About BECCI"}</span>
                  </Link>

                  {/* Scope Group in Mobile Drawer */}
                  <div className="my-2 rounded-xl border border-navy-800/10 bg-frost/50 p-2.5">
                    <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-teal-deep flex items-center gap-1.5 mb-1.5">
                      <Compass className="h-3 w-3" />
                      <span>{isTelugu ? "ఛాంబర్ పరిధి · Scope" : "Chamber Scope"}</span>
                    </p>
                    <div className="space-y-1">
                      {SCOPE_DROPDOWN_ITEMS.map((sub) => {
                        const isSubActive = pathname === sub.to;
                        return (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                              isSubActive
                                ? "bg-teal-deep text-white"
                                : "text-navy-900 hover:bg-white"
                            }`}
                          >
                            <span>{isTelugu ? sub.teTitle : sub.title}</span>
                            <span className="text-[10px] opacity-70">{sub.badge}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <Link
                    to="/opportunities"
                    aria-current={pathname.startsWith("/opportunities") ? "page" : undefined}
                    data-testid="mobile-nav-opportunities"
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors ${
                      pathname.startsWith("/opportunities") ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>Opportunities &amp; Tenders</span>
                      <span className="rounded bg-teal/20 px-1.5 py-0.2 text-[10px] font-bold text-teal-deep">LIVE</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                  </Link>

                  <Link
                    to="/schemes"
                    aria-current={pathname === "/schemes" ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors ${
                      pathname === "/schemes" ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                    }`}
                  >
                    <span>{isTelugu ? "పథకాలు · Government Schemes" : "Government Schemes"}</span>
                  </Link>

                  <Link
                    to="/membership"
                    aria-current={pathname === "/membership" ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors ${
                      pathname === "/membership" ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                    }`}
                  >
                    <span>{isTelugu ? "సభ్యత్వం · Membership" : "Membership"}</span>
                  </Link>

                  <Link
                    to="/knowledge"
                    aria-current={pathname === "/knowledge" ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors ${
                      pathname === "/knowledge" ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                    }`}
                  >
                    <span>{isTelugu ? "జ్ఞాన కేంద్రం · Knowledge" : "Knowledge"}</span>
                  </Link>

                  <Link
                    to="/contact"
                    aria-current={pathname === "/contact" ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-tight transition-colors ${
                      pathname === "/contact" ? "bg-teal-mist/70 text-teal-ink" : "text-navy-950 hover:bg-frost"
                    }`}
                  >
                    <span>{isTelugu ? "సంప్రదించండి · Contact" : "Contact"}</span>
                  </Link>

                  <Link
                    to={isAuthenticated ? "/member/dashboard" : "/member/login"}
                    className="mt-3 flex items-center justify-between rounded-xl border border-navy-600/20 bg-navy-950 px-3.5 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                  >
                    <span>{isAuthenticated ? "Member Dashboard" : "Member Portal Sign In"}</span>
                    <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                  </Link>

                  <Link
                    to="/pulse"
                    className="mt-2 flex items-center justify-between rounded-xl border border-navy-800/12 bg-frost px-3.5 py-2.5 text-sm font-semibold text-navy-950 hover:border-teal-deep"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
                      <span>BECCI PULSE 3D</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-teal-deep" aria-hidden="true" />
                  </Link>
                </nav>

                <div className="border-t border-navy-800/10 p-5">
                  <Link
                    to="/membership"
                    data-testid="mobile-join-cta"
                    className="flex items-center justify-center gap-2 rounded-full bg-navy-950 px-5 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-teal-deep active:scale-[0.98]"
                  >
                    <span>Join BECCI</span>
                    <ArrowUpRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                  </Link>
                  <p className="mt-3 text-center font-display text-xs uppercase tracking-wide text-teal-deep">
                    {ORG.tagline}
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Continuous scroll progress hairline */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="bg-spectrum h-[2px] w-full origin-left"
          />
        )}
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
