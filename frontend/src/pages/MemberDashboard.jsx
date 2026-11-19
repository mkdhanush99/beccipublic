import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  Building2,
  Calendar,
  Clock,
  Compass,
  Edit3,
  Eye,
  Filter,
  Loader2,
  LogOut,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import OpportunityCard from "@/components/portal/OpportunityCard";
import { formatDate, formatDateTime, getDaysUntilDeadline } from "@/components/portal/OpportunityBadges";
import { useMemberAuth } from "@/context/MemberAuthContext";
import {
  BECCI_SECTORS,
  ELIGIBILITY_STATUS_OPTIONS,
  INDIAN_STATES,
  OPPORTUNITY_CATEGORIES,
  fetchMemberRecommendations,
  fetchSavedOpportunities,
  fetchViewedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
} from "@/lib/opportunityApi";

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { member, profile, profileLoading, profileChecked, logout } = useMemberAuth();

  const [activeTab, setActiveTab] = useState("recommended");

  // Backend recommendation filters
  const [category, setCategory] = useState("");
  const [sector, setSector] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [eligibilityStatus, setEligibilityStatus] = useState("");
  // Client-side refinement on loaded recommendations (organisation/title/deadline)
  const [keyword, setKeyword] = useState("");
  const [deadlineBefore, setDeadlineBefore] = useState("");

  // Live API states
  const [recommendations, setRecommendations] = useState([]);
  const [recTotal, setRecTotal] = useState(0);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState("");

  const [savedItems, setSavedItems] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  const [viewedItems, setViewedItems] = useState([]);
  const [viewedLoading, setViewedLoading] = useState(false);

  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    document.title = profile?.business_name
      ? `${profile.business_name} · Member Dashboard · BECCI`
      : "Member Dashboard · BECCI";
  }, [profile?.business_name]);

  const loadSavedAndViewed = useCallback(async (signal) => {
    setSavedLoading(true);
    setViewedLoading(true);
    const [savedRes, viewedRes] = await Promise.allSettled([
      fetchSavedOpportunities(signal),
      fetchViewedOpportunities(30, signal),
    ]);
    if (savedRes.status === "fulfilled" && Array.isArray(savedRes.value)) {
      setSavedItems(savedRes.value);
    }
    if (viewedRes.status === "fulfilled" && Array.isArray(viewedRes.value)) {
      setViewedItems(viewedRes.value);
    }
    setSavedLoading(false);
    setViewedLoading(false);
  }, []);

  const loadRecommendations = useCallback(
    async (signal) => {
      if (!profile) {
        setRecommendations([]);
        setRecTotal(0);
        return;
      }
      setRecLoading(true);
      setRecError("");
      try {
        const res = await fetchMemberRecommendations(
          {
            category: category || undefined,
            sector: sector || undefined,
            state: stateFilter || undefined,
            eligibility_status: eligibilityStatus || undefined,
            page: 1,
            limit: 50,
          },
          signal
        );
        setRecommendations(res?.items || []);
        setRecTotal(res?.total || 0);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setRecommendations([]);
        setRecTotal(0);
        setRecError(err?.message || "Unable to load personalised recommendations right now.");
      } finally {
        setRecLoading(false);
      }
    },
    [profile, category, sector, stateFilter, eligibilityStatus]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    loadSavedAndViewed(ctrl.signal);
    return () => ctrl.abort();
  }, [loadSavedAndViewed]);

  useEffect(() => {
    if (!profile) return undefined;
    const ctrl = new AbortController();
    loadRecommendations(ctrl.signal);
    return () => ctrl.abort();
  }, [profile, loadRecommendations]);

  const savedIdSet = useMemo(() => new Set(savedItems.map((s) => s.opportunity_id)), [savedItems]);

  const handleToggleSave = async (oppId, currentlySaved) => {
    setSavingId(oppId);
    try {
      if (currentlySaved) {
        await unsaveOpportunity(oppId);
        setSavedItems((prev) => prev.filter((item) => item.opportunity_id !== oppId));
        toast.success("Removed from saved opportunities.");
      } else {
        const created = await saveOpportunity(oppId);
        setSavedItems((prev) => [
          created,
          ...prev.filter((item) => item.opportunity_id !== oppId),
        ]);
        toast.success("Saved to your dashboard.");
      }
    } catch (err) {
      toast.error(err?.message || "Could not update saved opportunity.");
    } finally {
      setSavingId(null);
    }
  };

  // Client-side narrowing for keyword/organisation/deadline without changing backend ranking or eligibility
  const visibleRecommendations = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return recommendations.filter((m) => {
      const opp = m.opportunity;
      if (!opp) return false;
      if (kw) {
        const hay = `${opp.title || ""} ${opp.issuing_organisation || ""} ${opp.industry || ""} ${
          opp.tender_detail?.department || ""
        } ${opp.reference_number || ""}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      if (deadlineBefore && opp.deadline && opp.deadline > deadlineBefore) {
        return false;
      }
      if (deadlineBefore && !opp.deadline) {
        return false;
      }
      return true;
    });
  }, [recommendations, keyword, deadlineBefore]);

  // Approaching deadlines across active recommendations & saved items (strictly excluding expired)
  const urgentDeadlines = useMemo(() => {
    const seen = new Set();
    const list = [];
    const checkAndPush = (opp, source) => {
      if (!opp || seen.has(opp.id)) return;
      const isExpired =
        opp.expiry_status === "expired" ||
        opp.lifecycle_status === "expired" ||
        opp.tender_detail?.tender_status === "expired";
      if (isExpired) return;
      const days = getDaysUntilDeadline(opp.deadline);
      if (opp.expiry_status === "closing_soon" || (days !== null && days >= 0 && days <= 7)) {
        seen.add(opp.id);
        list.push({ opp, days, source });
      }
    };
    savedItems.forEach((s) => checkAndPush(s.opportunity, "Saved"));
    recommendations.forEach((m) => checkAndPush(m.opportunity, "Matched"));
    return list.sort((a, b) => (a.days ?? 99) - (b.days ?? 99)).slice(0, 4);
  }, [savedItems, recommendations]);

  const handleLogout = () => {
    navigate("/member/login", { replace: true });
    logout();
    toast.success("Signed out of your BECCI member session.");
  };

  const resetRecFilters = () => {
    setCategory("");
    setSector("");
    setStateFilter("");
    setEligibilityStatus("");
    setKeyword("");
    setDeadlineBefore("");
  };

  const hasActiveRecFilters = Boolean(
    category || sector || stateFilter || eligibilityStatus || keyword.trim() || deadlineBefore
  );

  return (
    <>
      {/* Dark Member Workspace Header */}
      <section className="on-dark bg-navy-950 pb-12 pt-28 text-white sm:pt-32" data-testid="member-dashboard-header">
        <div className="becci-container">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-bright">
                BECCI Member Opportunity Portal
              </p>
              <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {profile ? profile.business_name : `Welcome, ${member?.display_name || "Member"}`}
              </h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-body text-xs text-ice/80 sm:text-sm">
                <span>{member?.email}</span>
                {profile?.becci_sector && (
                  <span className="inline-flex items-center gap-1.5 text-white">
                    <Building2 className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                    <span>{profile.becci_sector}</span>
                  </span>
                )}
                {profile?.state && (
                  <span className="inline-flex items-center gap-1.5 text-ice">
                    <MapPin className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                    <span>
                      {profile.district ? `${profile.district}, ${profile.state}` : profile.state}
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/member/profile"
                data-testid="dashboard-edit-profile"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ice/25 bg-white/[0.06] px-4 py-2 font-heading text-xs font-semibold text-white transition-colors hover:border-teal hover:text-teal-bright"
              >
                <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{profile ? "Edit Business Profile" : "Complete Business Profile"}</span>
              </Link>
              <Link
                to="/opportunities"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ice/25 bg-white/[0.06] px-4 py-2 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal hover:text-white"
              >
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Explore All Public Opportunities</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                data-testid="dashboard-logout-btn"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ice/20 bg-white/[0.04] px-4 py-2 font-heading text-xs font-semibold text-ice/90 transition-colors hover:border-rose-400 hover:text-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
              <p className="font-heading text-2xl font-bold tabular-nums text-white" data-testid="kpi-matched-count">
                {profile ? recTotal : "—"}
              </p>
              <p className="mt-0.5 font-body text-xs text-ice/75">Matched Opportunities</p>
            </div>
            <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
              <p className="font-heading text-2xl font-bold tabular-nums text-teal-bright" data-testid="kpi-saved-count">
                {savedItems.length}
              </p>
              <p className="mt-0.5 font-body text-xs text-ice/75">Saved Opportunities</p>
            </div>
            <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
              <p className="font-heading text-2xl font-bold tabular-nums text-white" data-testid="kpi-viewed-count">
                {viewedItems.length}
              </p>
              <p className="mt-0.5 font-body text-xs text-ice/75">Recently Viewed</p>
            </div>
            <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
              <p className="font-heading text-2xl font-bold tabular-nums text-amber-300">
                {urgentDeadlines.length}
              </p>
              <p className="mt-0.5 font-body text-xs text-ice/75">Closing Within 7 Days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Body */}
      <section className="section bg-frost">
        <div className="becci-container">
          {/* Deadline Awareness Strip */}
          {urgentDeadlines.length > 0 && (
            <div
              data-testid="dashboard-deadline-alerts"
              className="mb-8 rounded-2xl border border-amber-600/25 bg-white p-5 shadow-soft"
            >
              <p className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.14em] text-amber-900">
                <Clock className="h-4 w-4 text-amber-700" aria-hidden="true" />
                <span>Approaching Deadlines — Action Recommended</span>
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {urgentDeadlines.map(({ opp, days, source }) => (
                  <Link
                    key={opp.id}
                    to={`/opportunities/${encodeURIComponent(opp.id)}`}
                    className="rounded-xl border border-amber-600/20 bg-amber-50/45 p-3.5 transition-colors hover:border-amber-700/40 hover:bg-amber-50"
                  >
                    <p className="font-heading text-[0.66rem] font-bold uppercase tracking-wider text-amber-900">
                      {source} · Due {formatDate(opp.deadline)}
                      {days !== null ? ` (${days === 0 ? "Today" : `${days}d left`})` : ""}
                    </p>
                    <p className="mt-1 line-clamp-2 font-heading text-xs font-bold text-navy-950">
                      {opp.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Onboarding Required Banner (when member has not created BusinessProfile yet) */}
          {profileChecked && !profileLoading && !profile && (
            <div
              data-testid="dashboard-profile-onboarding-prompt"
              className="mb-8 rounded-3xl border border-navy-600/25 bg-white p-8 shadow-soft"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-mist px-3 py-1 font-heading text-[0.68rem] font-bold uppercase tracking-wider text-teal-ink">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>One Step Remaining</span>
                  </span>
                  <h2 className="mt-3 font-heading text-2xl font-bold text-navy-950">
                    Create your Business Profile to unlock personalised opportunity matching.
                  </h2>
                  <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/80">
                    Share your BECCI sector, state, enterprise type, and registration status (without any
                    sensitive ID numbers). Our matching engine will rank live government tenders, schemes, and
                    jobs specifically for your business with transparent eligibility explanations.
                  </p>
                </div>
                <Link
                  to="/member/profile"
                  data-testid="dashboard-create-profile-cta"
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-navy-950 px-6 py-3 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-700"
                >
                  <span>Start 4-Step Business Profile</span>
                  <ArrowRight className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {/* Dashboard View Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Member dashboard sections"
            className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-navy-800/10 bg-white p-2 shadow-soft"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "recommended"}
              data-testid="dashboard-tab-recommended"
              onClick={() => setActiveTab("recommended")}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 font-heading text-xs font-semibold transition-colors ${
                activeTab === "recommended"
                  ? "bg-navy-950 text-white"
                  : "text-navy-800/80 hover:bg-frost hover:text-navy-950"
              }`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Recommended for Your Business ({recTotal})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "saved"}
              data-testid="dashboard-tab-saved"
              onClick={() => setActiveTab("saved")}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 font-heading text-xs font-semibold transition-colors ${
                activeTab === "saved"
                  ? "bg-navy-950 text-white"
                  : "text-navy-800/80 hover:bg-frost hover:text-navy-950"
              }`}
            >
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              <span>Saved Opportunities ({savedItems.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "viewed"}
              data-testid="dashboard-tab-viewed"
              onClick={() => setActiveTab("viewed")}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 font-heading text-xs font-semibold transition-colors ${
                activeTab === "viewed"
                  ? "bg-navy-950 text-white"
                  : "text-navy-800/80 hover:bg-frost hover:text-navy-950"
              }`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>Recently Viewed ({viewedItems.length})</span>
            </button>
          </div>

          {/* TAB 1: RECOMMENDED OPPORTUNITIES */}
          {activeTab === "recommended" && (
            <div data-testid="dashboard-recommended-panel">
              {profile && (
                <div className="mb-6 rounded-2xl border border-navy-800/12 bg-white p-5 shadow-soft">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Keyword / Organisation */}
                    <div className="relative sm:col-span-2 lg:col-span-1">
                      <Search
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600"
                        aria-hidden="true"
                      />
                      <label htmlFor="member-rec-search" className="sr-only">
                        Filter matches by title or issuing organisation
                      </label>
                      <input
                        id="member-rec-search"
                        type="search"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        data-testid="member-filter-keyword"
                        placeholder="Filter by title or organisation…"
                        className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/60 pl-10 pr-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Opportunity Category */}
                    <select
                      aria-label="Filter by opportunity type"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      data-testid="member-filter-category"
                      className="min-h-[42px] rounded-xl border border-navy-800/15 bg-frost/60 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                    >
                      <option value="">All Opportunity Types</option>
                      {OPPORTUNITY_CATEGORIES.slice(0, 4).map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    {/* Eligibility Status */}
                    <select
                      aria-label="Filter by eligibility status"
                      value={eligibilityStatus}
                      onChange={(e) => setEligibilityStatus(e.target.value)}
                      data-testid="member-filter-eligibility"
                      className="min-h-[42px] rounded-xl border border-navy-800/15 bg-frost/60 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                    >
                      <option value="">All Eligibility Statuses</option>
                      {ELIGIBILITY_STATUS_OPTIONS.map((el) => (
                        <option key={el.value} value={el.value}>
                          {el.label}
                        </option>
                      ))}
                    </select>

                    {/* Sector */}
                    <select
                      aria-label="Filter by BECCI sector"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      data-testid="member-filter-sector"
                      className="min-h-[42px] rounded-xl border border-navy-800/15 bg-frost/60 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                    >
                      <option value="">All Sectors</option>
                      {BECCI_SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    {/* State */}
                    <select
                      aria-label="Filter by location or state"
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                      data-testid="member-filter-state"
                      className="min-h-[42px] rounded-xl border border-navy-800/15 bg-frost/60 px-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                    >
                      <option value="">All Locations</option>
                      <option value="National">All India (National)</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    {/* Deadline Before */}
                    <div className="relative">
                      <Calendar
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600"
                        aria-hidden="true"
                      />
                      <input
                        aria-label="Deadline on or before"
                        type="date"
                        value={deadlineBefore}
                        onChange={(e) => setDeadlineBefore(e.target.value)}
                        data-testid="member-filter-deadline"
                        className="min-h-[42px] w-full rounded-xl border border-navy-800/15 bg-frost/60 pl-9 pr-3 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-navy-800/8 pt-3 text-xs text-navy-800/70">
                    <span className="inline-flex items-center gap-1.5 font-body">
                      <Filter className="h-3.5 w-3.5 text-navy-600" aria-hidden="true" />
                      <span>
                        Showing <strong>{visibleRecommendations.length}</strong> ranked opportunities computed
                        by BECCI’s backend matching engine.
                      </span>
                    </span>
                    {hasActiveRecFilters && (
                      <button
                        type="button"
                        onClick={resetRecFilters}
                        className="inline-flex items-center gap-1 font-heading font-semibold text-navy-700 hover:text-navy-950"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {recError && (
                <div className="rounded-2xl border border-amber-600/30 bg-white p-6 text-center">
                  <AlertCircle className="mx-auto h-7 w-7 text-amber-700" aria-hidden="true" />
                  <p className="mt-2 font-body text-sm text-navy-900">{recError}</p>
                  <button
                    type="button"
                    onClick={() => loadRecommendations()}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 font-heading text-xs font-semibold text-white"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {recLoading && (
                <div className="grid gap-5 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-72 animate-pulse rounded-2xl bg-white p-6" />
                  ))}
                </div>
              )}

              {!recLoading && !recError && profile && visibleRecommendations.length === 0 && (
                <div
                  data-testid="dashboard-empty-recommendations"
                  className="rounded-2xl border border-navy-800/12 bg-white p-10 text-center shadow-soft"
                >
                  <Compass className="mx-auto h-8 w-8 text-navy-600" aria-hidden="true" />
                  <h2 className="mt-3 font-heading text-lg font-bold text-navy-950">
                    No active matched opportunities for these filters.
                  </h2>
                  <p className="mx-auto mt-1.5 max-w-md font-body text-sm text-navy-800/75">
                    We never display fabricated recommendations. Try clearing filters or browsing all
                    published listings in the public Opportunity Explorer.
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    {hasActiveRecFilters && (
                      <button
                        type="button"
                        onClick={resetRecFilters}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold text-white"
                      >
                        <span>Clear Filters</span>
                      </button>
                    )}
                    <Link
                      to="/opportunities"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-navy-800/20 bg-frost px-5 py-2 font-heading text-xs font-semibold text-navy-950"
                    >
                      <span>Browse All Opportunities</span>
                    </Link>
                  </div>
                </div>
              )}

              {!recLoading && !recError && visibleRecommendations.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2" data-testid="dashboard-recommendations-grid">
                  {visibleRecommendations.map((match) => (
                    <OpportunityCard
                      key={match.opportunity.id}
                      opportunity={match.opportunity}
                      match={match}
                      showSaveButton
                      isSaved={savedIdSet.has(match.opportunity.id)}
                      saving={savingId === match.opportunity.id}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED OPPORTUNITIES */}
          {activeTab === "saved" && (
            <div data-testid="dashboard-saved-panel">
              {savedLoading ? (
                <div className="flex items-center gap-2 rounded-2xl bg-white p-8 font-body text-sm text-navy-800/75">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading saved opportunities…</span>
                </div>
              ) : savedItems.length === 0 ? (
                <div className="rounded-2xl border border-navy-800/12 bg-white p-10 text-center shadow-soft">
                  <Bookmark className="mx-auto h-8 w-8 text-navy-600" aria-hidden="true" />
                  <h2 className="mt-3 font-heading text-lg font-bold text-navy-950">
                    No saved opportunities yet.
                  </h2>
                  <p className="mx-auto mt-1.5 max-w-md font-body text-sm text-navy-800/75">
                    Click the bookmark button on any opportunity card or detail page to track deadlines here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2" data-testid="dashboard-saved-grid">
                  {savedItems.map((row) => (
                    <div key={row.opportunity_id} className="flex flex-col gap-1.5">
                      <OpportunityCard
                        opportunity={row.opportunity}
                        showSaveButton
                        isSaved
                        saving={savingId === row.opportunity_id}
                        onToggleSave={handleToggleSave}
                      />
                      <p className="px-2 font-body text-[0.7rem] text-navy-800/60">
                        Saved on {formatDateTime(row.saved_at)}
                        {row.notes ? ` · Note: ${row.notes}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENTLY VIEWED */}
          {activeTab === "viewed" && (
            <div data-testid="dashboard-viewed-panel">
              {viewedLoading ? (
                <div className="flex items-center gap-2 rounded-2xl bg-white p-8 font-body text-sm text-navy-800/75">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading viewing history…</span>
                </div>
              ) : viewedItems.length === 0 ? (
                <div className="rounded-2xl border border-navy-800/12 bg-white p-10 text-center shadow-soft">
                  <Eye className="mx-auto h-8 w-8 text-navy-600" aria-hidden="true" />
                  <h2 className="mt-3 font-heading text-lg font-bold text-navy-950">
                    No recently viewed opportunities yet.
                  </h2>
                  <p className="mx-auto mt-1.5 max-w-md font-body text-sm text-navy-800/75">
                    Opportunities you open while signed in will appear here so you can return to them easily.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2" data-testid="dashboard-viewed-grid">
                  {viewedItems.map((row) => (
                    <div key={row.opportunity_id} className="flex flex-col gap-1.5">
                      <OpportunityCard
                        opportunity={row.opportunity}
                        compact
                        showSaveButton
                        isSaved={savedIdSet.has(row.opportunity_id)}
                        saving={savingId === row.opportunity_id}
                        onToggleSave={handleToggleSave}
                      />
                      <p className="px-2 font-body text-[0.7rem] text-navy-800/60">
                        Last viewed {formatDateTime(row.last_viewed_at)} · Viewed {row.view_count} time
                        {row.view_count === 1 ? "" : "s"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
