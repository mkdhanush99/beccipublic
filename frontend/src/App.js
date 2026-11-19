import React, { lazy } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import { MemberAuthProvider } from "@/context/MemberAuthContext";
import ProtectedMemberRoute from "@/components/portal/ProtectedMemberRoute";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";

// Inner pages are code-split so the homepage ships less JavaScript.
const About = lazy(() => import("@/pages/About"));
const WhatWeDo = lazy(() => import("@/pages/WhatWeDo"));
const WhoWeServe = lazy(() => import("@/pages/WhoWeServe"));
const Membership = lazy(() => import("@/pages/Membership"));
const Schemes = lazy(() => import("@/pages/Schemes"));
const SchemeDetail = lazy(() => import("@/pages/SchemeDetail"));
const WingsChapters = lazy(() => import("@/pages/WingsChapters"));
const Knowledge = lazy(() => import("@/pages/Knowledge"));
const Pulse = lazy(() => import("@/pages/Pulse"));
const Intelligence = lazy(() => import("@/pages/Intelligence"));
const IntelligenceArticle = lazy(() => import("@/pages/IntelligenceArticle"));
const Navigator = lazy(() => import("@/pages/Navigator"));
const Opportunities = lazy(() => import("@/pages/Opportunities"));
const OpportunityDetail = lazy(() => import("@/pages/OpportunityDetail"));
const MemberAuth = lazy(() => import("@/pages/MemberAuth"));
const MemberProfile = lazy(() => import("@/pages/MemberProfile"));
const MemberDashboard = lazy(() => import("@/pages/MemberDashboard"));
const AdminOpportunities = lazy(() => import("@/pages/AdminOpportunities"));
const Contact = lazy(() => import("@/pages/Contact"));
const LegalPage = lazy(() => import("@/pages/LegalPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <MemberAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/who-we-serve" element={<WhoWeServe />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/:slug" element={<SchemeDetail />} />
            <Route path="/wings-chapters" element={<WingsChapters />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/intelligence/article/:slug" element={<IntelligenceArticle />} />
            <Route path="/navigator" element={<Navigator />} />
            <Route path="/opportunity-navigator" element={<Navigate to="/navigator" replace />} />

            {/* Phase 4: Public Opportunity Discovery & Member Opportunity Portal */}
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/member/login" element={<MemberAuth defaultMode="login" />} />
            <Route path="/member/register" element={<MemberAuth defaultMode="register" />} />
            <Route
              path="/member/profile"
              element={
                <ProtectedMemberRoute>
                  <MemberProfile />
                </ProtectedMemberRoute>
              }
            />
            <Route
              path="/member/dashboard"
              element={
                <ProtectedMemberRoute>
                  <MemberDashboard />
                </ProtectedMemberRoute>
              }
            />
            {/* Protected Admin Workflow (strictly separate backend admin auth) */}
            <Route path="/admin/opportunities" element={<AdminOpportunities />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<LegalPage kind="privacy" />} />
            <Route path="/terms" element={<LegalPage kind="terms" />} />
            {/* Graceful aliases for documented BECCI route names */}
            <Route path="/leadership" element={<Navigate to="/about#governance" replace />} />
            <Route path="/organisation" element={<Navigate to="/wings-chapters" replace />} />
            <Route path="/initiatives" element={<Navigate to="/what-we-do#initiatives" replace />} />
            <Route path="/news" element={<Navigate to="/knowledge" replace />} />
            <Route path="/events" element={<Navigate to="/knowledge#events" replace />} />
            <Route path="/apply" element={<Navigate to="/membership#onboarding" replace />} />
            <Route path="/login" element={<Navigate to="/member/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </MemberAuthProvider>
  );
}

export default App;
