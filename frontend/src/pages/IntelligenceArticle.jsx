import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Eyebrow, NextPageBand } from "@/components/primitives";
import { INSIGHT_ARTICLES, INTELLIGENCE_DISCLAIMER, LOAN_DECISION_GUIDE } from "@/data/intelligence";

export default function IntelligenceArticle() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);

  const article = INSIGHT_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <section className="bg-frost pb-24 pt-36">
        <div className="becci-container max-w-2xl text-center">
          <Eyebrow tone="teal" className="justify-center">BECCI Insights</Eyebrow>
          <h1 className="mt-4 font-heading text-h2 font-bold text-navy-950">
            This editorial entry could not be found.
          </h1>
          <p className="mt-3 font-body text-base text-navy-800/75">
            Return to BECCI Intelligence to browse all verified dispatches, guides and official resources.
          </p>
          <div className="mt-8">
            <Link
              to="/intelligence"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy-950 px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-teal-deep"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to BECCI Intelligence</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const related = INSIGHT_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  const shareArticle = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.excerpt, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied", { description: article.title });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast(url);
    }
  };

  return (
    <>
      {/* Editorial Article Header */}
      <section className="on-dark relative overflow-hidden bg-navy-950 pb-16 pt-28 text-white sm:pt-32 lg:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 78% 20%, rgba(0,184,169,0.16), transparent 62%), #030E1E",
          }}
        />
        <div className="becci-container relative z-10 max-w-4xl pt-4">
          <Link
            to="/intelligence#insights"
            data-testid="article-back-link"
            className="inline-flex min-h-[40px] items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-ice/85 transition-colors hover:text-teal-bright"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>BECCI Intelligence · Insights</span>
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="glass-pill rounded-full px-3.5 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-bright">
              {article.category}
            </span>
            <span className="font-body text-xs text-ice/75">
              {article.published} · {article.readTime}
            </span>
          </div>

          <h1 className="mt-5 font-heading text-h1 font-bold leading-[1.05] text-white">
            {article.title}
          </h1>

          <p className="mt-5 max-w-3xl font-body text-lead text-ice/88">
            {article.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ice/15 pt-5">
            <div>
              <p className="font-heading text-xs font-semibold text-white">{article.attribution}</p>
              <p className="mt-0.5 font-body text-xs text-ice/65">{article.label}</p>
            </div>
            <button
              type="button"
              onClick={shareArticle}
              data-testid="article-share-btn"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-ice/25 px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-ice transition-colors hover:border-teal hover:text-teal-bright"
            >
              {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Share2 className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{copied ? "Link copied" : "Share article"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Long-Form Editorial Body */}
      <article className="section bg-white">
        <div className="becci-container grid max-w-5xl gap-12 lg:grid-cols-[1fr_0.46fr] lg:items-start">
          {/* Primary Reading Column (optimal 65ch typographic measure) */}
          <div className="min-w-0 max-w-[66ch] space-y-10">
            <div className="rounded-3xl border border-ice/75 bg-frost p-6 sm:p-7">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                Key Verified Takeaways
              </p>
              <ul className="mt-4 space-y-2.5">
                {article.keyPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 font-body text-sm leading-relaxed text-navy-950">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-deep" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {article.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="font-heading text-2xl font-bold text-navy-950">{sec.heading}</h2>
                <p className="mt-3.5 font-body text-base leading-[1.8] text-navy-900/85">
                  {sec.body}
                </p>
              </section>
            ))}

            {article.slug === "which-loan-fits-you-decision-guide" && (
              <div className="overflow-x-auto rounded-2xl border border-ice/80 bg-white">
                <table className="w-full min-w-[460px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-navy-800/10 bg-frost/90">
                      <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                        Your Situation
                      </th>
                      <th className="px-4 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-navy-800/70">
                        Start With
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/10 font-body text-sm text-navy-900">
                    {LOAN_DECISION_GUIDE.map((row) => (
                      <tr key={row.situation} className="hover:bg-frost/40">
                        <td className="px-4 py-3 font-heading font-semibold text-navy-950">{row.situation}</td>
                        <td className="px-4 py-3">
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noreferrer"
                            className="link-underline inline-flex items-center gap-1 font-medium text-teal-ink"
                          >
                            <span>{row.startWith}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-2xl border border-ice/70 bg-frost p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
              <p className="font-body text-xs leading-relaxed text-navy-800/80">
                {INTELLIGENCE_DISCLAIMER}
              </p>
            </div>
          </div>

          {/* Right Sidebar: Primary Verified Sources */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="glass-light rounded-3xl p-6">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal-deep">
                Primary Sources &amp; Links
              </p>
              <ul className="mt-4 space-y-2.5">
                {article.sources.map((src) => (
                  <li key={src.label}>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-[42px] items-center justify-between gap-2 rounded-xl border border-navy-800/10 bg-white/90 px-4 py-2.5 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                      >
                        <span>{src.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        to={src.to}
                        className="flex min-h-[42px] items-center justify-between gap-2 rounded-xl border border-navy-800/10 bg-white/90 px-4 py-2.5 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                      >
                        <span>{src.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Insights */}
            <div className="glass-light rounded-3xl p-6">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-navy-700">
                Further Reading
              </p>
              <div className="mt-4 space-y-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/intelligence/article/${r.slug}`}
                    className="group block border-t border-navy-800/10 pt-3.5 first:border-t-0 first:pt-0"
                  >
                    <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-teal-deep">
                      {r.category}
                    </p>
                    <p className="mt-1 font-heading text-sm font-bold leading-snug text-navy-950 transition-colors group-hover:text-teal-ink">
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>

      <NextPageBand
        eyebrow="Back to Discovery"
        title="Return to BECCI Intelligence."
        desc="Search verified schemes, browse progressive learning journeys or inspect the Knowledge Library."
        to="/intelligence"
        ctaLabel="Open BECCI Intelligence"
        testid="article-to-intelligence"
      />
    </>
  );
}
