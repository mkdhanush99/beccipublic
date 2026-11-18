import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import WhatWeDo from "@/pages/WhatWeDo";
import WhoWeServe from "@/pages/WhoWeServe";
import Membership from "@/pages/Membership";
import Schemes from "@/pages/Schemes";
import WingsChapters from "@/pages/WingsChapters";
import Knowledge from "@/pages/Knowledge";
import Contact from "@/pages/Contact";
import LegalPage from "@/pages/LegalPage";
import NotFound from "@/pages/NotFound";

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
