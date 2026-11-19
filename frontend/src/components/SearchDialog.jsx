import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ExternalLink, Search, X } from "lucide-react";
import { SCHEME_DATASET_STATS } from "@/data/becci";
import { searchSite } from "@/data/intelligence";
import { getCachedSchemesSync, loadSchemesIndex } from "@/lib/schemesStore";

const SUGGESTED = ["PMEGP", "Udyam", "NBCFDC", "Telangana", "Vishwakarma", "Andhra Pradesh"];

export const SearchDialog = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [liveSchemes, setLiveSchemes] = useState(() => getCachedSchemesSync());
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open || liveSchemes) return;
    let active = true;
    loadSchemesIndex()
      .then((data) => {
        if (active) setLiveSchemes(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [open, liveSchemes]);

  const results = useMemo(() => searchSite(query, 18, liveSchemes), [query, liveSchemes]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIdx(0);
    }
  }, [open]);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const activateItem = (item) => {
    if (!item) return;
    onOpenChange(false);
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else if (item.to) {
      navigate(item.to);
    }
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      activateItem(results[activeIdx]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-navy-950/65 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          data-testid="search-dialog"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className="fixed left-1/2 top-[10vh] z-[75] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-3xl border border-ice/45 bg-white/95 shadow-lift backdrop-blur-2xl focus:outline-none"
        >
          <Dialog.Title className="sr-only">Search BECCI</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search pages, government schemes, practical guides, industry sectors and official government portals.
          </Dialog.Description>

          {/* Search Input Header */}
          <div className="flex items-center gap-3 border-b border-navy-800/10 px-5 py-4">
            <Search className="h-5 w-5 shrink-0 text-teal-deep" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              data-testid="global-search-input"
              placeholder="Search schemes, guides, sectors, portals or pages…"
              aria-label="Search BECCI website"
              className="min-h-[40px] w-full bg-transparent font-body text-base text-navy-950 placeholder:text-navy-800/45 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search query"
                className="shrink-0 rounded-full bg-frost px-3 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75 hover:bg-ice/60 hover:text-navy-950"
              >
                Clear
              </button>
            )}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close search"
                data-testid="search-dialog-close"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-navy-800/12 text-navy-900 hover:bg-frost"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Search Body */}
          <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
            {!query.trim() ? (
              <div>
                <p className="font-heading text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-teal-deep">
                  Suggested searches
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTED.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="min-h-[40px] rounded-full border border-navy-800/12 bg-frost px-4 py-1.5 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-teal-deep hover:text-teal-ink"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="mt-5 font-body text-xs leading-relaxed text-navy-800/65">
                  Searches verified BECCI pages, {SCHEME_DATASET_STATS.totalShown} verified Central, Telangana &amp; Andhra Pradesh schemes (English &amp; తెలుగు · {SCHEME_DATASET_STATS.totalFaqs.toLocaleString("en-IN")} official FAQs), 5 practical entrepreneur guides, 11 industry sectors and 14 official Government of India portals.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-heading text-base font-bold text-navy-950">No matches for “{query}”.</p>
                <p className="mt-1.5 font-body text-xs text-navy-800/70">
                  Try a scheme name (PMEGP, NBCFDC, Vishwakarma), a sector (Manufacturing, IT), or “membership”.
                </p>
              </div>
            ) : (
              <ul role="listbox" aria-label="Search results" className="space-y-1.5">
                {results.map((item, idx) => {
                  const active = idx === activeIdx;
                  return (
                    <li key={item.id} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => activateItem(item)}
                        onMouseEnter={() => setActiveIdx(idx)}
                        data-testid={`search-result-${idx}`}
                        className={`flex w-full items-start justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                          active ? "bg-teal-mist/70 text-navy-950" : "hover:bg-frost"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-heading text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-teal-deep">
                              {item.group}
                            </span>
                            {item.href && (
                              <span className="font-body text-[0.65rem] text-navy-800/55">
                                Opens official site
                              </span>
                            )}
                          </div>
                          <p
                            className={`mt-0.5 truncate text-sm font-bold text-navy-950 ${
                              /[\u0C00-\u0C7F]/.test(item.title) ? "font-telugu" : "font-heading"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p
                            className={`mt-0.5 line-clamp-1 text-xs text-navy-800/75 ${
                              /[\u0C00-\u0C7F]/.test(item.summary) ? "font-telugu" : "font-body"
                            }`}
                          >
                            {item.summary}
                          </p>
                        </div>
                        <span className="mt-1 shrink-0 text-teal-deep">
                          {item.href ? (
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer keyboard hint */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-navy-800/10 bg-frost/75 px-5 py-3 font-body text-[0.7rem] text-navy-800/65">
            <span>↑ ↓ to navigate · Enter to open · Esc to close</span>
            <span>Official external links open in a new tab</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SearchDialog;
