import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  Compass,
  Filter,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/primitives";
import OpportunityCard from "@/components/portal/OpportunityCard";
import { formatDate } from "@/components/portal/OpportunityBadges";
import { useMemberAuth } from "@/context/MemberAuthContext";
import {
  BECCI_SECTORS,
  OPPORTUNITY_CATEGORIES,
  TENDER_STATUSES,
  fetchClosingSoonOpportunities,
  fetchPublicCategories,
  fetchPublicLocations,
  fetchPublicOpportunities,
  fetchPublicSources,
  fetchSavedOpportunities,
  fetchSchemes,
  fetchTenders,
  isApiConfigured,
  saveOpportunity,
  unsaveOpportunity,
} from "@/lib/opportunityApi";

const PAGE_LIMIT = 12;

export default function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, member, profile } = useMemberAuth();

  // Filter state synced with URL search params
  const [qInput, setQInput] = useState(() => searchParams.get("q") || "");
  const [q, setQ] = useState(() => searchParams.get("q") || "");
  const [category, setCategory] = useState(() => searchParams.get("category") || "");
  const [sector, setSector] = useState(() => searchParams.get("sector") || "");
  const [stateFilter, setStateFilter] = useState(() => searchParams.get("state") || "");
  const [tenderStatus, setTenderStatus] = useState(() => searchParams.get("tender_status") || "");
  const [deadlineBefore, setDeadlineBefore] = useState(() => searchParams.get("deadline_before") || "");
  const [deadlineAfter, setDeadlineAfter] = useState(() => searchParams.get("deadline_after") || "");
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page") || 1)));

  // Live API data
  const [opportunities, setOpportunities] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryCounts, setCategoryCounts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [closingSoon, setClosingSoon] = useState([]);
  const [sources, setSources] = useState([]);

  // Authenticated member saved IDs
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [savingId, setSavingId] = useState(null);

  const apiReady = isApiConfigured();

  useEffect(() => {
    document.title = "Verified Opportunities · BECCI Opportunity Portal";
  }, []);

  // Debounce keyword input -> API query
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (qInput !== q) {
        setQ(qInput);
        setPage(1);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [qInput, q]);

  // Sync URL params when filters change
  useEffect(() => {
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (category) next.set("category", category);
    if (sector) next.set("sector", sector);
    if (stateFilter) next.set("state", stateFilter);
    if (tenderStatus) next.set("tender_status", tenderStatus);
    if (deadlineBefore) next.set("deadline_before", deadlineBefore);
    if (deadlineAfter) next.set("deadline_after", deadlineAfter);
    if (page > 1) next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [q, category, sector, stateFilter, tenderStatus, deadlineBefore, deadlineAfter, page, setSearchParams]);

  // Load metadata (categories, locations, closing soon, sources)
  useEffect(() => {
    if (!apiReady) return undefined;
    const ctrl = new AbortController();
    Promise.allSettled([
      fetchPublicCategories(ctrl.signal),
      fetchPublicLocations(ctrl.signal),
      fetchClosingSoonOpportunities(4, ctrl.signal),
      fetchPublicSources(ctrl.signal),
    ]).then(([catRes, locRes, soonRes, srcRes]) => {
      if (catRes.status === "fulfilled" && Array.isArray(catRes.value)) setCategoryCounts(catRes.value);
      if (locRes.status === "fulfilled" && Array.isArray(locRes.value)) setLocations(locRes.value);
      if (soonRes.status === "fulfilled" && Array.isArray(soonRes.value)) setClosingSoon(soonRes.value);
      if (srcRes.status === "fulfilled" && Array.isArray(srcRes.value)) setSources(srcRes.value);
    });
    return () => ctrl.abort();
  }, [apiReady]);

  // Load saved IDs if member is signed in
  useEffect(() => {
    if (!apiReady || !isAuthenticated) {
      setSavedIds(new Set());
      return undefined;
    }
    const ctrl = new AbortController();
    fetchSavedOpportunities(ctrl.signal)
      .then((rows) => {
        setSavedIds(new Set((rows || []).map((r) => r.opportunity_id)));
      })
      .catch(() => {
        // Non-blocking
      });
    return () => ctrl.abort();
  }, [apiReady, isAuthenticated]);

  // Fetch filtered published opportunities
  const loadOpportunities = useCallback(
    async (signal) => {
      if (!apiReady) {
        setLoading(false);
        setError({
          code: "API_NOT_CONFIGURED",
          message:
            "The BECCI Opportunity Engine API URL (REACT_APP_BECCI_API_BASE_URL) is not configured for this environment yet.",
        });
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetchPublicOpportunities(
          {
            q: q.trim() || undefined,
            category: category || undefined,
            sector: sector || undefined,
            state: stateFilter || undefined,
            tender_status: tenderStatus || undefined,
            deadline_before: deadlineBefore || undefined,
            deadline_after: deadlineAfter || undefined,
            page,
            limit: PAGE_LIMIT,
          },
          signal
        );
        setOpportunities(res?.items || []);
        setTotal(res?.total || 0);
        setHasMore(Boolean(res?.has_more));
      } catch (err) {
        if (err?.name === "AbortError") return;
        setOpportunities([]);
        setTotal(0);
        setHasMore(false);
        setError({
          code: err?.code || "API_ERROR",
          message: err?.message || "Unable to load verified opportunities right now.",
        });
      } finally {
        setLoading(false);
      }
    },
    [apiReady, q, category, sector, stateFilter, tenderStatus, deadlineBefore, deadlineAfter, page]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    loadOpportunities(ctrl.signal);
    return () => ctrl.abort();
  }, [loadOpportunities]);

  const handleToggleSave = async (oppId, currentlySaved) => {
    if (!isAuthenticated) {
      toast.info("Sign in to your BECCI member account to save opportunities.");
      return;
    }
    setSavingId(oppId);
    try {
      if (currentlySaved) {
        await unsaveOpportunity(oppId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(oppId);
          return next;
        });
        toast.success("Removed from your saved opportunities.");
      } else {
        await saveOpportunity(oppId);
        setSavedIds((prev) => new Set(prev).add(oppId));
        toast.success("Saved to your BECCI member dashboard.");
      }
    } catch (err) {
      toast.error(err?.message || "Could not update saved opportunity.");
    } finally {
      setSavingId(null);
    }
  };

  const countByCat = useMemo(() => {
    const map = {};
    categoryCounts.forEach((c) => {
      map[c.category] = c.count;
    });
    return map;
  }, [categoryCounts]);

  const totalPublishedCount = useMemo(
    () => categoryCounts.reduce((acc, c) => acc + (c.count || 0), 0),
    [categoryCounts]
  );

  // Only show primary 4 categories plus any extra category returned by backend
  const visibleCategoryTabs = useMemo(() => {
    const core = ["job", "funding", "tender", "business_growth"];
    const backendCats = new Set(categoryCounts.map((c) => c.category));
    return OPPORTUNITY_CATEGORIES.filter(
      (c) => core.includes(c.value) || backendCats.has(c.value)
    );
  }, [categoryCounts]);

  const activeFilterCount = [
    q.trim(),
    category,
    sector,
    stateFilter,
    tenderStatus,
    deadlineBefore,
    deadlineAfter,
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setQInput("");
    setQ("");
    setCategory("");
    setSector("");
    setStateFilter("");
    setTenderStatus("");
    setDeadlineBefore("");
    setDeadlineAfter("");
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <>
      <PageHero
        eyebrow="BECCI Opportunity Intelligence Engine · Live Verified Feed"
        meta={
          totalPublishedCount > 0
            ? `${totalPublishedCount} Verified Opportunities · ${sources.length || "Official"} Sources`
            : "Official Government & Institutional Sources"
        }
        title="Verified Government Jobs, Schemes & Tenders."
        intro="Every listing below is discovered from official government and institutional portals, checked by BECCI's verification workflow, and linked directly to its issuing authority."
      >
        {isAuthenticated ? (
          <Link
            to="/member/dashboard"
            data-testid="opportunities-to-member-dashboard"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-colors hover:bg-teal-bright"
          >
            <UserCheck className="h-4 w-4" aria-hidden="true" />
            <span>
              {profile ? `${profile.business_name} · Matched Dashboard` : `${member?.display_name} · Member Dashboard`}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            to="/member/register"
            data-testid="opportunities-member-cta"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-colors hover:bg-teal-bright"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Get Personalised Business Matches</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}

        <Link
          to="/schemes"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ice/25 bg-white/[0.05] px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-teal hover:text-teal-bright"
        >
          <span>Browse 335 myScheme Directory</span>
        </Link>
      </PageHero>

      {/* Official Source Attribution & Transparency Banner */}
      <section className="border-b border-navy-800/10 bg-frost py-5">
        <div className="becci-container flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy-700" aria-hidden="true" />
            <p className="font-body text-xs leading-relaxed text-navy-900/85 sm:text-sm">
              <strong>Official Source Transparency:</strong> BECCI does not issue these government jobs,
              schemes, or tenders. Every opportunity links directly to its original issuing portal so you can
              verify live eligibility, corrigenda, and dates before applying.
            </p>
          </div>
          {!isAuthenticated && (
            <Link
              to="/member/login"
              data-testid="opportunities-signin-link"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy-800/15 bg-white px-4 py-2 font-heading text-xs font-semibold text-navy-950 transition-colors hover:border-navy-600 hover:text-navy-700"
            >
              <span>Member Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>

      {/* Approaching Deadlines Strip (Live from /api/v1/opportunities/closing-soon) */}
      {closingSoon.length > 0 && (
        <section className="border-b border-navy-800/10 bg-white py-6" data-testid="closing-soon-strip">
          <div className="becci-container">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-amber-900">
                <Clock className="h-4 w-4 text-amber-700" aria-hidden="true" />
                <span>Closing Within 7 Days ({closingSoon.length})</span>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {closingSoon.map((item) => (
                <Link
                  key={item.id}
                  to={`/opportunities/${encodeURIComponent(item.id)}`}
                  className="group rounded-xl border border-amber-600/20 bg-amber-50/45 p-3.5 transition-colors hover:border-amber-700/40 hover:bg-amber-50"
                >
                  <p className="font-heading text-[0.66rem] font-semibold uppercase tracking-wider text-amber-900">
                    Due {formatDate(item.deadline)} · {item.category}
                  </p>
                  <p className="mt-1 line-clamp-2 font-heading text-sm font-bold text-navy-950 group-hover:text-navy-700">
                    {item.title}
                  </p>
                  <p className="mt-1 truncate font-body text-xs text-navy-800/70">
                    {item.issuing_organisation}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Opportunity Explorer */}
      <section className="section bg-frost/60">
        <div className="becci-container">
          {/* Category Pills */}
          <div
            role="tablist"
            aria-label="Filter opportunities by category"
            data-testid="opportunity-category-tabs"
            className="mb-6 flex flex-wrap gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={category === ""}
              onClick={() => {
                setCategory("");
                setPage(1);
              }}
              data-testid="opp-cat-all"
              className={`min-h-[40px] rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                category === ""
                  ? "border-navy-950 bg-navy-950 text-white"
                  : "border-navy-800/15 bg-white text-navy-900 hover:border-navy-600"
              }`}
            >
              All Opportunities{totalPublishedCount > 0 ? ` (${totalPublishedCount})` : ""}
            </button>

            {visibleCategoryTabs.map((cat) => {
              const active = category === cat.value;
              const cnt = countByCat[cat.value];
              return (
                <button
                  key={cat.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setCategory(cat.value);
                    if (cat.value !== "tender") setTenderStatus("");
                    setPage(1);
                  }}
                  data-testid={`opp-cat-${cat.value}`}
                  className={`min-h-[40px] rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                    active
                      ? "border-navy-950 bg-navy-950 text-white"
                      : "border-navy-800/15 bg-white text-navy-900 hover:border-navy-600"
                  }`}
                >
                  {cat.label}
                  {typeof cnt === "number" ? ` (${cnt})` : ""}
                </button>
              );
            })}
          </div>

          {/* Search & Structured Filter Panel */}
          <div
            data-testid="opportunity-filter-panel"
            className="mb-8 rounded-2xl border border-navy-800/12 bg-white p-5 shadow-soft sm:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600"
                  aria-hidden="true"
                />
                <label htmlFor="opp-search" className="sr-only">
                  Search opportunities by keyword, issuing organisation, department, or reference number
                </label>
                <input
                  id="opp-search"
                  type="search"
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                  data-testid="opportunities-search-input"
                  placeholder="Search title, issuing organisation (e.g. SIDBI, GeM, CPPP), department, or reference no…"
                  className="min-h-[46px] w-full rounded-xl border border-navy-800/15 bg-frost/60 pl-11 pr-4 font-body text-sm text-navy-950 placeholder:text-navy-800/45 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  data-testid="opportunities-reset-filters"
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl border border-navy-800/15 bg-frost px-4 py-2 font-heading text-xs font-semibold text-navy-900 transition-colors hover:border-navy-600 hover:bg-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset Filters ({activeFilterCount})</span>
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* BECCI Sector */}
              <div>
                <label
                  htmlFor="opp-sector-filter"
                  className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75"
                >
                  BECCI Sector
                </label>
                <select
                  id="opp-sector-filter"
                  value={sector}
                  onChange={(e) => {
                    setSector(e.target.value);
                    setPage(1);
                  }}
                  data-testid="opportunities-sector-select"
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                >
                  <option value="">All 11 BECCI Sectors</option>
                  {BECCI_SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* State / National (Live from /api/v1/locations) */}
              <div>
                <label
                  htmlFor="opp-state-filter"
                  className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75"
                >
                  Location / State
                </label>
                <select
                  id="opp-state-filter"
                  value={stateFilter}
                  onChange={(e) => {
                    setStateFilter(e.target.value);
                    setPage(1);
                  }}
                  data-testid="opportunities-state-select"
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc.state || "National"} value={loc.state || "National"}>
                      {loc.state || "National"} ({loc.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tender Status (supported by backend TenderDetail filter) */}
              <div>
                <label
                  htmlFor="opp-status-filter"
                  className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75"
                >
                  Tender Status
                </label>
                <select
                  id="opp-status-filter"
                  value={tenderStatus}
                  disabled={Boolean(category && category !== "tender")}
                  onChange={(e) => {
                    setTenderStatus(e.target.value);
                    setPage(1);
                  }}
                  data-testid="opportunities-status-select"
                  className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 px-3 font-body text-sm text-navy-950 disabled:cursor-not-allowed disabled:opacity-50 focus:border-navy-600 focus:bg-white"
                >
                  <option value="">All Statuses</option>
                  {TENDER_STATUSES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submission Deadline Filter */}
              <div>
                <label
                  htmlFor="opp-deadline-filter"
                  className="mb-1 block font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-navy-800/75"
                >
                  Deadline On / Before
                </label>
                <div className="relative">
                  <Calendar
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600"
                    aria-hidden="true"
                  />
                  <input
                    id="opp-deadline-filter"
                    type="date"
                    value={deadlineBefore}
                    onChange={(e) => {
                      setDeadlineBefore(e.target.value);
                      setPage(1);
                    }}
                    data-testid="opportunities-deadline-input"
                    className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/50 pl-9 pr-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-navy-800/8 pt-3 font-body text-xs text-navy-800/70">
              <span className="inline-flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-navy-600" aria-hidden="true" />
                {loading ? (
                  <span>Querying verified opportunities…</span>
                ) : (
                  <span data-testid="opportunities-result-count">
                    Showing <strong>{opportunities.length}</strong> of <strong>{total}</strong> published
                    opportunities
                  </span>
                )}
              </span>
              <span>Only verified, published records are shown — unpublished items are never exposed.</span>
            </div>
          </div>

          {/* Error / API Unreachable State */}
          {error && !loading && (
            <div
              role="alert"
              data-testid="opportunities-error-banner"
              className="rounded-2xl border border-amber-600/30 bg-white p-8 text-center shadow-soft"
            >
              <AlertCircle className="mx-auto h-8 w-8 text-amber-700" aria-hidden="true" />
              <h2 className="mt-3 font-heading text-lg font-bold text-navy-950">
                {error.code === "API_NOT_CONFIGURED"
                  ? "Opportunity Engine API Not Yet Configured"
                  : "Unable to Reach Opportunity Engine"}
              </h2>
              <p className="mx-auto mt-2 max-w-xl font-body text-sm leading-relaxed text-navy-800/80">
                {error.message}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {error.code !== "API_NOT_CONFIGURED" && (
                  <button
                    type="button"
                    onClick={() => loadOpportunities()}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Retry</span>
                  </button>
                )}
                <Link
                  to="/schemes"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-navy-800/20 bg-frost px-5 py-2 font-heading text-xs font-semibold text-navy-950 hover:border-navy-600"
                >
                  <span>Browse Offline-Ready 335 Scheme Directory</span>
                </Link>
              </div>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid gap-5 md:grid-cols-2" aria-busy="true" aria-label="Loading opportunities">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 animate-pulse rounded-2xl border border-navy-800/10 bg-white p-6"
                >
                  <div className="flex gap-2">
                    <div className="h-6 w-28 rounded-full bg-frost-deep" />
                    <div className="h-6 w-24 rounded-full bg-frost" />
                  </div>
                  <div className="mt-4 h-6 w-4/5 rounded bg-frost-deep" />
                  <div className="mt-2 h-4 w-3/5 rounded bg-frost" />
                  <div className="mt-6 h-12 w-full rounded bg-frost" />
                  <div className="mt-6 h-9 w-36 rounded-full bg-frost-deep" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State (zero fabricated records) */}
          {!loading && !error && opportunities.length === 0 && (
            <div
              data-testid="opportunities-empty-state"
              className="rounded-2xl border border-navy-800/12 bg-white p-10 text-center shadow-soft"
            >
              <Compass className="mx-auto h-9 w-9 text-navy-600" aria-hidden="true" />
              <h2 className="mt-3 font-heading text-xl font-bold text-navy-950">
                No published opportunities match these filters.
              </h2>
              <p className="mx-auto mt-2 max-w-lg font-body text-sm leading-relaxed text-navy-800/75">
                BECCI only displays verified, currently published listings from official sources. Try
                broadening your sector, state, deadline, or keyword filters.
              </p>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-5 inline-flex min-h-[42px] items-center gap-2 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Show All Verified Opportunities</span>
                </button>
              )}
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && opportunities.length > 0 && (
            <>
              <div className="grid gap-5 md:grid-cols-2" data-testid="opportunities-grid">
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    showSaveButton={isAuthenticated}
                    isSaved={savedIds.has(opp.id)}
                    saving={savingId === opp.id}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Opportunity pagination"
                  className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-800/10 bg-white px-5 py-4"
                >
                  <p className="font-body text-xs text-navy-800/75">
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} verified listings)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1 || loading}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="min-h-[38px] rounded-full border border-navy-800/15 px-4 py-1.5 font-heading text-xs font-semibold text-navy-950 disabled:opacity-40 hover:border-navy-600"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!hasMore || loading}
                      onClick={() => {
                        setPage((p) => p + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="min-h-[38px] rounded-full bg-navy-950 px-4 py-1.5 font-heading text-xs font-semibold text-white disabled:opacity-40 hover:bg-navy-700"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Next Page"}
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}

          {/* Registered Official Discovery Sources Footer Strip */}
          {sources.length > 0 && (
            <div className="mt-12 rounded-2xl border border-navy-800/10 bg-white p-6">
              <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-navy-700">
                Active Official Discovery Sources ({sources.length})
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sources.map((src) => (
                  <span
                    key={src.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-navy-800/12 bg-frost px-3 py-1 font-body text-xs text-navy-900"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                    <span className="font-semibold">{src.name}</span>
                    <span className="text-navy-800/60">({src.domain})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
