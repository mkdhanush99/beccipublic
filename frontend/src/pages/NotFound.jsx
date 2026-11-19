import React from "react";
import { CTA } from "@/components/primitives";

export default function NotFound() {
  return (
    <section className="on-dark grain flex min-h-[75vh] items-center bg-navy-950 pt-header text-white">
      <div className="becci-container py-20 text-center">
        <p className="font-display text-7xl text-gold sm:text-8xl">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">This page isn’t here yet.</h1>
        <p className="mx-auto mt-3 max-w-md font-body text-sm text-navy-300">
          The page you requested may be planned for a later phase of the BECCI website.
        </p>
        <div className="mt-8">
          <CTA to="/" variant="gold">
            Back to home
          </CTA>
        </div>
      </div>
    </section>
  );
}
