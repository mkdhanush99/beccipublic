import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";

// Inner pages are code-split so the homepage ships less JavaScript.
const About = lazy(() => import("@/pages/About"));
const WhatWeDo = lazy(() => import("@/pages/WhatWeDo"));
const WhoWeServe = lazy(() => import("@/pages/WhoWeServe"));
const Membership = lazy(() => import("@/pages/Membership"));
const Schemes = lazy(() => import("@/pages/Schemes"));
const WingsChapters = lazy(() => import("@/pages/WingsChapters"));
const Knowledge = lazy(() => import("@/pages/Knowledge"));
const Pulse = lazy(() => import("@/pages/Pulse"));
const Intelligence = lazy(() => import("@/pages/Intelligence"));
const IntelligenceArticle = lazy(() => import("@/pages/IntelligenceArticle"));
const Contact = lazy(() => import("@/pages/Contact"));
const LegalPage = lazy(() => import("@/pages/LegalPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/who-we-serve" element={<WhoWeServe />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/wings-chapters" element={<WingsChapters />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/pulse" element={<Pulse />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/intelligence/article/:slug" element={<IntelligenceArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
