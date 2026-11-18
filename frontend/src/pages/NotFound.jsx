import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-navy-950 text-white">
      <div className="becci-container text-center">
        <p className="font-display text-7xl text-gold">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold">This page isn’t here yet.</h1>
        <p className="mt-3 font-body text-navy-300">The page may be planned for a later phase.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-6 py-3 font-heading text-sm font-semibold text-navy-950"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
