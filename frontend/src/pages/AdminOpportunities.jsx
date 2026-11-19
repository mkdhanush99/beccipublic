import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Eye,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  CategoryBadge,
  OpportunityStatusBadge,
  formatDate,
  formatDateTime,
} from "@/components/portal/OpportunityBadges";
import {
  ADMIN_SESSION_EXPIRED_EVENT,
  clearAdminSession,
  fetchAdminIncompleteEligibility,
  fetchAdminMetrics,
  fetchAdminOpportunityDetail,
  fetchAdminQueue,
  fetchAdminSourceHealth,
  getAdminPortalExternalUrl,
  isApiConfigured,
  loginAdmin,
  readAdminSession,
  reviewAdminOpportunity,
  writeAdminSession,
} from "@/lib/opportunityApi";

export default function AdminOpportunities() {
  const [adminSession, setAdminSession] = useState(() => readAdminSession());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState("queue");
  const [metrics, setMetrics] = useState(null);
  const [queue, setQueue] = useState([]);
  const [incompleteList, setIncompleteList] = useState([]);
  const [sourceHealth, setSourceHealth] = useState({ sources: [], alerts: [] });
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  const [selectedOppId, setSelectedOppId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reviewReason, setReviewReason] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const apiReady = isApiConfigured();
  const externalAdminUrl = getAdminPortalExternalUrl();

  useEffect(() => {
    document.title = "Admin Review Console · BECCI Opportunity Engine";
  }, []);

  useEffect(() => {
    const onExpired = () => {
      clearAdminSession();
      setAdminSession(null);
      setLoginError("Your administrator session expired. Please sign in again.");
    };
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const loadAdminWorkspace = useCallback(async () => {
    if (!adminSession?.access_token) return;
    setLoadingData(true);
    setDataError("");
    try {
      const [m, q, inc, health] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminQueue({ limit: 50 }),
        fetchAdminIncompleteEligibility({ limit: 50 }),
        fetchAdminSourceHealth(),
      ]);
      setMetrics(m);
      setQueue(Array.isArray(q) ? q : []);
      setIncompleteList(Array.isArray(inc) ? inc : []);
      setSourceHealth(health || { sources: [], alerts: [] });
    } catch (err) {
      setDataError(err?.message || "Unable to load admin review workspace.");
    } finally {
      setLoadingData(false);
    }
  }, [adminSession?.access_token]);

  useEffect(() => {
    if (adminSession?.access_token) {
      loadAdminWorkspace();
    }
  }, [adminSession?.access_token, loadAdminWorkspace]);

  const inspectOpportunity = async (oppId) => {
    setSelectedOppId(oppId);
    setDetailLoading(true);
    setSelectedDetail(null);
    setReviewReason("");
    try {
      const detail = await fetchAdminOpportunityDetail(oppId);
      setSelectedDetail(detail);
    } catch (err) {
      toast.error(err?.message || "Unable to load verification evidence.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleReviewAction = async (action) => {
    if (!selectedDetail?.id) return;
    setReviewing(true);
    try {
      await reviewAdminOpportunity(selectedDetail.id, {
        action,
        reason: reviewReason.trim() || `Reviewed via BECCI Phase 4 admin console (${action})`,
      });
      toast.success(`Opportunity marked as ${action}.`);
      setSelectedOppId(null);
      setSelectedDetail(null);
      setReviewReason("");
      await loadAdminWorkspace();
    } catch (err) {
      toast.error(err?.message || `Failed to ${action} opportunity.`);
    } finally {
      setReviewing(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!username.trim() || !password) {
      setLoginError("Enter both administrator username and password.");
      return;
    }
    setLoginLoading(true);
    try {
      const res = await loginAdmin({ username: username.trim(), password });
      writeAdminSession(res);
      setAdminSession(res);
      setPassword("");
      toast.success(`Signed in as ${res.username} (${res.role}).`);
    } catch (err) {
      setLoginError(err?.message || "Invalid administrator credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminSession(null);
    setSelectedDetail(null);
    setSelectedOppId(null);
    toast.success("Administrator session closed.");
  };

  // Unauthenticated Admin Login Gate
  if (!adminSession?.access_token) {
    return (
      <section className="min-h-[85vh] bg-navy-950 pb-20 pt-32 text-white">
        <div className="becci-container max-w-md">
          <div className="rounded-3xl border border-ice/15 bg-white p-6 text-navy-950 shadow-lift sm:p-8">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-navy-950 text-teal-bright">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading text-[0.65rem] font-bold uppercase tracking-[0.16em] text-navy-600">
                  Restricted Area
                </p>
                <h1 className="font-heading text-xl font-bold text-navy-950">
                  BECCI Admin Review Login
                </h1>
              </div>
            </div>

            <p className="mt-3 font-body text-xs leading-relaxed text-navy-800/75">
              Protected by backend role-based admin authentication (`/api/admin/auth/login`). Ordinary
              member accounts cannot access review queues, verification evidence, or publication controls.
            </p>

            {loginError && (
              <div
                role="alert"
                data-testid="admin-login-error"
                className="mt-4 flex items-start gap-2 rounded-2xl border border-rose-700/25 bg-rose-50 p-3.5 text-xs text-rose-900"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden="true" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="mt-5 space-y-4">
              <div>
                <label htmlFor="admin-username" className="mb-1 block font-heading text-xs font-semibold text-navy-900">
                  Admin Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="admin-username-input"
                  className="min-h-[44px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-1 block font-heading text-xs font-semibold text-navy-900">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600" />
                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="admin-password-input"
                    className="min-h-[44px] w-full rounded-xl border border-navy-800/15 bg-frost/60 pl-10 pr-3.5 font-body text-sm text-navy-950 focus:border-navy-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loginLoading || !apiReady}
                data-testid="admin-login-submit"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-700 disabled:opacity-50"
              >
                {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate Admin Session"}
              </button>
            </form>

            {externalAdminUrl && (
              <div className="mt-5 border-t border-navy-800/10 pt-4 text-center">
                <a
                  href={externalAdminUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-navy-700 hover:text-navy-950"
                >
                  <span>Open Native Backend Admin Console</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="on-dark bg-navy-950 pb-10 pt-28 text-white sm:pt-32" data-testid="admin-console-header">
        <div className="becci-container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal-bright">
                BECCI Opportunity Governance · Role: {adminSession.role}
              </p>
              <h1 className="mt-1 font-heading text-2xl font-bold text-white sm:text-3xl">
                Verification &amp; Publication Control
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {externalAdminUrl && (
                <a
                  href={externalAdminUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-ice/25 bg-white/[0.06] px-4 py-1.5 font-heading text-xs font-semibold text-ice hover:border-teal hover:text-white"
                >
                  <span>Backend Admin Console</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              <button
                type="button"
                onClick={loadAdminWorkspace}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-ice/25 bg-white/[0.06] px-4 py-1.5 font-heading text-xs font-semibold text-white hover:border-teal"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                data-testid="admin-logout-btn"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-ice/20 px-4 py-1.5 font-heading text-xs font-semibold text-ice hover:border-rose-400 hover:text-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign Out ({adminSession.username})</span>
              </button>
            </div>
          </div>

          {metrics && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
                <p className="font-heading text-2xl font-bold text-white">{metrics.published_opportunities}</p>
                <p className="font-body text-xs text-ice/75">Published</p>
              </div>
              <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
                <p className="font-heading text-2xl font-bold text-amber-300">
                  {metrics.pending_review_opportunities}
                </p>
                <p className="font-body text-xs text-ice/75">Pending Review</p>
              </div>
              <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
                <p className="font-heading text-2xl font-bold text-white">{metrics.expired_opportunities}</p>
                <p className="font-body text-xs text-ice/75">Expired</p>
              </div>
              <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
                <p className="font-heading text-2xl font-bold text-teal-bright">
                  {metrics.supported_sources}/{metrics.total_sources}
                </p>
                <p className="font-body text-xs text-ice/75">Supported Sources</p>
              </div>
              <div className="rounded-2xl border border-ice/15 bg-white/[0.05] p-4">
                <p className="font-heading text-2xl font-bold text-white">{incompleteList.length}</p>
                <p className="font-body text-xs text-ice/75">Incomplete Eligibility</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section bg-frost">
        <div className="becci-container">
          {dataError && (
            <div className="mb-6 rounded-2xl border border-amber-600/30 bg-white p-4 text-sm text-amber-950">
              {dataError}
            </div>
          )}

          {/* Admin Section Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-navy-800/10 bg-white p-2 shadow-soft">
            <button
              type="button"
              onClick={() => setTab("queue")}
              data-testid="admin-tab-queue"
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 font-heading text-xs font-semibold ${
                tab === "queue" ? "bg-navy-950 text-white" : "text-navy-800 hover:bg-frost"
              }`}
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Pending Review Queue ({queue.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("incomplete")}
              data-testid="admin-tab-incomplete"
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 font-heading text-xs font-semibold ${
                tab === "incomplete" ? "bg-navy-950 text-white" : "text-navy-800 hover:bg-frost"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Incomplete Eligibility ({incompleteList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("sources")}
              data-testid="admin-tab-sources"
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 font-heading text-xs font-semibold ${
                tab === "sources" ? "bg-navy-950 text-white" : "text-navy-800 hover:bg-frost"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Source Health ({sourceHealth.sources?.length || 0})</span>
            </button>
          </div>

          {/* QUEUE TAB */}
          {tab === "queue" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-3" data-testid="admin-queue-list">
                {queue.length === 0 ? (
                  <div className="rounded-2xl border border-navy-800/10 bg-white p-8 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-teal-deep" />
                    <p className="mt-2 font-heading text-base font-bold text-navy-950">
                      Review queue is clear.
                    </p>
                    <p className="mt-1 font-body text-xs text-navy-800/70">
                      No opportunities are currently awaiting human review.
                    </p>
                  </div>
                ) : (
                  queue.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => inspectOpportunity(item.id)}
                      data-testid={`admin-queue-item-${item.id}`}
                      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                        selectedOppId === item.id
                          ? "border-navy-950 bg-white ring-2 ring-navy-950/15"
                          : "border-navy-800/10 bg-white hover:border-navy-600/40"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <CategoryBadge category={item.category} />
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-heading text-[0.62rem] font-semibold uppercase text-amber-900">
                          {item.lifecycle_status}
                        </span>
                      </div>
                      <p className="mt-2 font-heading text-sm font-bold text-navy-950">{item.title}</p>
                      <p className="mt-1 font-body text-xs text-navy-800/70">
                        {item.issuing_organisation} · Deadline: {formatDate(item.deadline) || "Not published"}
                      </p>
                    </button>
                  ))
                )}
              </div>

              {/* Verification Evidence & Review Inspector */}
              <div className="rounded-3xl border border-navy-800/12 bg-white p-6 shadow-soft">
                {!selectedOppId ? (
                  <div className="py-12 text-center">
                    <Eye className="mx-auto h-8 w-8 text-navy-600" />
                    <p className="mt-2 font-heading text-sm font-bold text-navy-950">
                      Select an opportunity to inspect verification evidence
                    </p>
                    <p className="mt-1 font-body text-xs text-navy-800/70">
                      Review Agent 07 checks, extracted field evidence snippets, and publish or reject safely.
                    </p>
                  </div>
                ) : detailLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-navy-700" />
                  </div>
                ) : (
                  selectedDetail && (
                    <div className="space-y-4" data-testid="admin-evidence-inspector">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-frost px-3 py-1 font-heading text-xs font-bold text-navy-900">
                          Verification: {selectedDetail.verification_status}
                        </span>
                        <span className="font-heading text-xs font-semibold text-navy-700">
                          Confidence: {selectedDetail.confidence}
                        </span>
                      </div>

                      <h2 className="font-heading text-lg font-bold text-navy-950">{selectedDetail.title}</h2>
                      <p className="font-body text-xs text-navy-800/75">
                        Source: {selectedDetail.issuing_organisation} ·{" "}
                        <a
                          href={selectedDetail.original_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-navy-700 underline"
                        >
                          Open Original URL
                        </a>
                      </p>

                      {selectedDetail.verification_records?.length > 0 && (
                        <div className="rounded-2xl bg-frost p-4">
                          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                            Agent 07 Verification Checks
                          </h3>
                          <ul className="mt-2 space-y-1.5">
                            {(selectedDetail.verification_records[0].checks || []).map((chk, i) => (
                              <li key={i} className="flex items-start gap-2 font-body text-xs text-navy-900">
                                {chk.passed ? (
                                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep" />
                                ) : (
                                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-700" />
                                )}
                                <span>
                                  <strong>{chk.name}:</strong> {chk.detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedDetail.evidence?.length > 0 && (
                        <div className="max-h-52 overflow-y-auto rounded-2xl border border-navy-800/10 p-4">
                          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                            Extracted Evidence Snippets ({selectedDetail.evidence.length})
                          </h3>
                          <ul className="mt-2 space-y-2">
                            {selectedDetail.evidence.map((ev, i) => (
                              <li key={i} className="border-b border-navy-800/8 pb-2 text-xs">
                                <p className="font-heading font-bold text-navy-950">
                                  {ev.field}: <span className="font-normal">{ev.value}</span>
                                </p>
                                {ev.snippet && (
                                  <p className="mt-0.5 font-body text-[0.72rem] text-navy-800/70">
                                    “{ev.snippet}”
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="border-t border-navy-800/10 pt-4">
                        <label
                          htmlFor="admin-review-reason"
                          className="mb-1 block font-heading text-xs font-semibold text-navy-900"
                        >
                          Audit Review Note / Reason
                        </label>
                        <input
                          id="admin-review-reason"
                          type="text"
                          value={reviewReason}
                          onChange={(e) => setReviewReason(e.target.value)}
                          placeholder="Optional audit note recorded in backend AuditLog…"
                          className="min-h-[40px] w-full rounded-xl border border-navy-800/15 bg-frost/60 px-3.5 font-body text-xs text-navy-950"
                        />

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={reviewing}
                            onClick={() => handleReviewAction("publish")}
                            data-testid="admin-action-publish"
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-teal-deep px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-950 disabled:opacity-50"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            <span>Publish</span>
                          </button>
                          <button
                            type="button"
                            disabled={reviewing}
                            onClick={() => handleReviewAction("reject")}
                            data-testid="admin-action-reject"
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-rose-700/30 bg-rose-50 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* INCOMPLETE ELIGIBILITY TAB */}
          {tab === "incomplete" && (
            <div className="grid gap-4 md:grid-cols-2" data-testid="admin-incomplete-list">
              {incompleteList.map((row) => (
                <div
                  key={row.opportunity.id}
                  className="rounded-2xl border border-navy-800/10 bg-white p-5 shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CategoryBadge category={row.opportunity.category} />
                    <OpportunityStatusBadge opp={row.opportunity} />
                  </div>
                  <h3 className="mt-2.5 font-heading text-sm font-bold text-navy-950">
                    {row.opportunity.title}
                  </h3>
                  <p className="mt-1 font-body text-xs text-navy-800/70">
                    {row.opportunity.issuing_organisation}
                  </p>
                  <ul className="mt-3 space-y-1 border-t border-navy-800/8 pt-3">
                    {(row.incomplete_reasons || []).map((reason, i) => (
                      <li key={i} className="flex items-start gap-1.5 font-body text-xs text-amber-900">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* SOURCE HEALTH TAB */}
          {tab === "sources" && (
            <div className="space-y-4" data-testid="admin-sources-list">
              {(sourceHealth.alerts || []).length > 0 && (
                <div className="rounded-2xl border border-amber-600/30 bg-amber-50 p-4">
                  <p className="font-heading text-xs font-bold uppercase tracking-wider text-amber-900">
                    Source Health Alerts ({sourceHealth.alerts.length})
                  </p>
                  <ul className="mt-2 space-y-1 font-body text-xs text-amber-950">
                    {sourceHealth.alerts.map((al, i) => (
                      <li key={i}>• {typeof al === "string" ? al : JSON.stringify(al)}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {(sourceHealth.sources || []).map((src) => (
                  <div
                    key={src.id}
                    className="rounded-2xl border border-navy-800/10 bg-white p-5 shadow-soft"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading text-sm font-bold text-navy-950">{src.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase ${
                          src.support_status === "supported"
                            ? "bg-teal-mist text-teal-ink"
                            : "bg-amber-50 text-amber-900"
                        }`}
                      >
                        {src.support_status}
                      </span>
                    </div>
                    <p className="mt-1 font-body text-xs text-navy-800/70">
                      {src.domain} · Agent: {src.agent_id} · Method: {src.collection_method}
                    </p>
                    <p className="mt-2 font-body text-xs text-navy-800/75">
                      Last Scan: {formatDateTime(src.last_scan_at) || "Never"} · Failures:{" "}
                      {src.consecutive_failures}
                    </p>
                    {src.access_notes && (
                      <p className="mt-1.5 font-body text-[0.72rem] text-navy-800/65">{src.access_notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
