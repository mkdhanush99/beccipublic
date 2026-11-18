import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV } from "@/data/becci";
import { Logo } from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur border-navy-800/10 shadow-[0_1px_20px_-12px_rgba(6,27,58,0.5)]"
          : "bg-white border-transparent"
      }`}
    >
      <div className="becci-container flex h-16 items-center justify-between gap-6 md:h-[76px]">
        <Logo variant="navy" className="h-7 shrink-0 md:h-8" testid="header-logo" />

        <nav aria-label="Primary" className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
                className={`link-underline whitespace-nowrap font-body text-[0.9rem] font-medium transition-colors ${
                  active ? "text-navy-700" : "text-navy-900/80 hover:text-navy-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/membership"
            data-testid="join-becci-cta"
            className="group hidden items-center gap-2 rounded-sm bg-navy-900 px-5 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-navy-700 sm:inline-flex"
          >
            Join BECCI
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                data-testid="mobile-menu-trigger"
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-navy-800/15 text-navy-900 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] max-w-sm border-navy-800/10 bg-white p-0">
              <div className="flex h-16 items-center justify-between border-b border-navy-800/10 px-6">
                <Logo variant="navy" className="h-7" withLink={false} />
                <SheetClose asChild>
                  <button aria-label="Close menu" className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-navy-900">
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>
              <nav aria-label="Mobile" className="flex flex-col px-3 py-4">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
                    className={`rounded-sm px-3 py-3 font-heading text-base font-medium ${
                      location.pathname === item.to ? "bg-navy-50 text-navy-700" : "text-navy-900/85"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/membership"
                  data-testid="mobile-join-cta"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-navy-900 px-5 py-3 font-heading text-sm font-semibold text-white"
                >
                  Join BECCI <ArrowUpRight className="h-4 w-4" />
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
