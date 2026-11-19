import React, { Suspense, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TITLES = {
  "/": "BECCI — Building Businesses. Building Bharat.",
  "/about": "About BECCI",
  "/what-we-do": "What We Do · BECCI",
  "/who-we-serve": "Who We Serve · BECCI",
  "/membership": "Membership · BECCI",
  "/schemes": "Government Schemes · BECCI",
  "/wings-chapters": "Wings & Chapters · BECCI",
  "/knowledge": "News & Knowledge · BECCI",
  "/pulse": "BECCI PULSE — Living Digital Universe",
  "/intelligence": "BECCI Intelligence — Knowledge & Discovery",
  "/contact": "Contact · BECCI",
  "/privacy": "Privacy Policy · BECCI",
  "/terms": "Terms of Use · BECCI",
};

const RouteEffects = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title = pathname.startsWith("/intelligence/article/")
      ? "BECCI Insights · BECCI Intelligence"
      : TITLES[pathname] || "Page not found · BECCI";
    if (hash) {
      const targetId = hash.slice(1);
      const tryScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };
      if (!tryScroll()) {
        const timer = window.setTimeout(tryScroll, 180);
        return () => window.clearTimeout(timer);
      }
      return undefined;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return undefined;
  }, [pathname, hash]);
  return null;
};

// Dark placeholder matching every page's opening hero so lazy routes never flash white.
const RouteFallback = () => <div className="min-h-[70vh] bg-navy-950" aria-hidden="true" />;

export const Layout = () => {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <a href="#main" className="skip-link">Skip to content</a>
      <RouteEffects />
      <Header />
      <main id="main" tabIndex={-1} className="relative flex-1 outline-none">
        <Suspense fallback={<RouteFallback />}>
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0.92, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="relative"
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
