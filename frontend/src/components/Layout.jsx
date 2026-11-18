import React, { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

export const Layout = () => {
  return (
    <div className="App flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
