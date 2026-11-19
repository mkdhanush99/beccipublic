import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  AuthorityTypeBadge,
  CategoryBadge,
  ChannelBadge,
  EligibilityStatusBadge,
  OpportunityStatusBadge,
  TSAPBadge,
  VerificationBadge,
  formatDate,
  formatDateTime,
  formatOpportunityLocation,
} from "@/components/portal/OpportunityBadges";
import { useMemberAuth } from "@/context/MemberAuthContext";
import {
  fetchMemberOpportunityMatch,
  fetchPublicOpportunityDetail,
  fetchSavedOpportunities,
  recordOpportunityView,
  saveOpportunity,
  unsaveOpportunity,
} from "@/lib/opportunityApi";
import SchemeEligibilityModal from "@/components/portal/SchemeEligibilityModal";

function InfoRow({ label, value }) {
  if (!value || value === "Not published" || value === "Not stated") {
    return (
      <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row sm:items-center">
        <dt className="font-heading text-xs font-semibold text-navy-800/70">{label}</dt>
        <dd className="font-body text-xs italic text-navy-800/50">Not published</dd>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between gap-1 py-2.5 sm:flex-row sm:items-center">
      <dt className="font-heading text-xs font-semibold text-navy-800/70">{label}</dt>
      <dd className="font-heading text-xs font-bold text-navy-950 sm:text-right">{value}</dd>
    </div>
  );
}

export default function OpportunityDetail() {
  const { id } = useParams();
  const { isAuthenticated, profile } = useMemberAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [matchData, setMatchData] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const recordedViewRef = useRef(null);

  // 1. Load verified public opportunity record
  useEffect(() => {
    if (!id) return undefined;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    setOpportunity(null);
    setMatchData(null);

    fetchPublicOpportunityDetail(id, ctrl.signal)
      .then((data) => {
        setOpportunity(data);
        if (data?.title) {
          document.title = `${data.title} · BECCI Opportunities`;
        }
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError({
          status: err?.status || 0,
          message: err?.message || "Opportunity not found or not published.",
        });
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [id]);

  // 2. When authenticated and opportunity loads: track view + fetch saved state + fetch backend match explanation
  useEffect(() => {
    if (!isAuthenticated || !opportunity?.id) {
      setIsSaved(false);
      setMatchData(null);
      return undefined;
    }

    const oppId = opportunity.id;
    const ctrl = new AbortController();

    // Record view once per opportunity ID
    if (recordedViewRef.current !== oppId) {
      recordedViewRef.current = oppId;
      recordOpportunityView(oppId).catch(() => {
        // Non-blocking tracking
      });
    }

    // Load saved status
    fetchSavedOpportunities(ctrl.signal)
      .then((saved) => {
        setIsSaved(Boolean((saved || []).find((s) => s.opportunity_id === oppId)));
      })
      .catch(() => {});

    // Load backend match explanation if member has a business profile
    if (profile) {
      setMatchLoading(true);
      fetchMemberOpportunityMatch(oppId, ctrl.signal)
        .then((res) => {
          setMatchData(res);
          if (typeof res?.is_saved === "boolean") setIsSaved(res.is_saved);
        })
        .catch(() => {
          setMatchData(null);
        })
        .finally(() => setMatchLoading(false));
    }

    return () => ctrl.abort();
  }, [isAuthenticated, profile, opportunity?.id]);

  const handleToggleSave = async () => {
    if (!opportunity?.id) return;
    if (!isAuthenticated) {
      toast.info("Sign in to your BECCI member account to save opportunities.");
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveOpportunity(opportunity.id);
        setIsSaved(false);
        toast.success("Removed from saved opportunities.");
      } else {
        await saveOpportunity(opportunity.id);
        setIsSaved(true);
        toast.success("Saved to your member dashboard.");
      }
    } catch (err) {
      toast.error(err?.message || "Could not update saved status.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-frost pb-20 pt-32">
        <div className="becci-container">
          <div className="h-10 w-44 animate-pulse rounded-full bg-white" />
          <div className="mt-6 h-48 animate-pulse rounded-3xl bg-white p-8" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
            <div className="h-80 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !opportunity) {
    return (
      <section className="min-h-[70vh] bg-frost pb-20 pt-36">
        <div className="becci-container max-w-2xl">
          <div
            data-testid="opportunity-not-found"
            className="rounded-3xl border border-navy-800/12 bg-white p-8 text-center shadow-soft sm:p-10"
          >
            <AlertCircle className="mx-auto h-10 w-10 text-amber-700" aria-hidden="true" />
            <h1 className="mt-4 font-heading text-2xl font-bold text-navy-950">
              {error?.status === 404
                ? "Opportunity Not Found or Unpublished"
                : "Unable to Load Opportunity"}
            </h1>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-800/75">
              {error?.message ||
                "This record may not be published yet, may have been withdrawn, or the identifier is invalid."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/opportunities"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-navy-950 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-700"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back to All Opportunities</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const td = opportunity.tender_detail;
  const sector = td?.sector || opportunity.industry || null;
  const locationLabel = formatOpportunityLocation(opportunity);
  const isScheme =
    Boolean(opportunity?.scheme_detail) ||
    opportunity?.category === "funding" ||
    opportunity?.category === "business_growth" ||
    opportunity?.subcategory === "government_subsidy";

  return (
    <>
      {/* Dark Hero Opening */}
      <section
        data-testid="opportunity-detail-hero"
        className="on-dark relative overflow-hidden bg-navy-950 pb-14 pt-28 text-white sm:pt-32 lg:pb-16"
      >
        <div className="becci-container relative z-10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/opportunities"
              data-testid="opp-detail-back"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-ice/20 bg-white/[0.05] px-4 py-1.5 font-heading text-xs font-semibold text-ice transition-colors hover:border-teal hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
              <span>All Verified Opportunities</span>
            </Link>

            {isAuthenticated && (
              <button
                type="button"
                disabled={saving}
                onClick={handleToggleSave}
                data-testid="opp-detail-save-btn"
                aria-pressed={isSaved}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-1.5 font-heading text-xs font-semibold transition-colors ${
                  isSaved
                    ? "border-teal bg-teal text-navy-950"
                    : "border-ice/25 bg-white/[0.06] text-white hover:border-teal hover:text-teal-bright"
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
                    <span>Saved in Dashboard</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                    <span>Save Opportunity</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <CategoryBadge category={opportunity.category} />
            <AuthorityTypeBadge opp={opportunity} />
            <ChannelBadge opp={opportunity} />
            <OpportunityStatusBadge opp={opportunity} />
            <TSAPBadge opp={opportunity} />
            <VerificationBadge lastVerifiedAt={opportunity.last_verified_at} />
          </div>

          <h1
            data-testid="opp-detail-title"
            className="mt-4 max-w-4xl font-heading text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
          >
            {opportunity.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-sm text-ice/85">
            <span className="inline-flex items-center gap-1.5 font-medium text-white">
              <Building2 className="h-4 w-4 text-teal-bright" aria-hidden="true" />
              <span>{opportunity.issuing_organisation}</span>
            </span>
            {sector && (
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-ice/75" aria-hidden="true" />
                <span>{sector}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-ice/75" aria-hidden="true" />
              <span>{locationLabel}</span>
            </span>
            {opportunity.deadline && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-teal-bright">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>Deadline: {formatDate(opportunity.deadline)}</span>
              </span>
            )}
          </div>

          {/* Primary Official Source CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {isScheme && (
              <button
                type="button"
                onClick={() => setShowEligibilityModal(true)}
                data-testid="opp-detail-check-eligibility-btn"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-teal bg-teal/20 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-teal-bright shadow-teal-glow transition-colors hover:bg-teal hover:text-navy-950"
              >
                <Sparkles className="h-4 w-4 text-teal" aria-hidden="true" />
                <span>Check AI Eligibility</span>
              </button>
            )}
            {opportunity.application_url && (
              <a
                href={opportunity.application_url}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                data-testid="opp-detail-apply-link"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-teal px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-navy-950 shadow-teal-glow transition-colors hover:bg-teal-bright"
              >
                <span>Open Official Application Portal</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {opportunity.original_url && (
              <a
                href={opportunity.original_url}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                data-testid="opp-detail-source-link"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-ice/25 bg-white/[0.06] px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-teal hover:text-teal-bright"
              >
                <span>View Original Notification</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="section bg-frost">
        <div className="becci-container">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
            {/* LEFT COLUMN */}
            <div className="min-w-0 space-y-6">
              {/* Member Personalised Match Explanation (Phase 3 Engine) */}
              {isAuthenticated && profile && (matchData || matchLoading) && (
                <section
                  data-testid="opp-detail-member-match"
                  className="rounded-3xl border border-navy-600/25 bg-white p-6 shadow-soft sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="inline-flex items-center gap-1.5 font-heading text-[0.68rem] font-bold uppercase tracking-[0.14em] text-navy-600">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Personalised Match for {profile.business_name}</span>
                      </p>
                      <h2 className="mt-1 font-heading text-xl font-bold text-navy-950">
                        Eligibility &amp; Matching Breakdown
                      </h2>
                    </div>
                    {matchData && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-navy-950 px-3.5 py-1 font-heading text-xs font-bold text-white">
                          {Math.round(matchData.relevance_score)}% Relevance
                        </span>
                        <EligibilityStatusBadge status={matchData.eligibility?.eligibility_status} />
                      </div>
                    )}
                  </div>

                  {matchLoading ? (
                    <div className="mt-4 h-24 animate-pulse rounded-2xl bg-frost" />
                  ) : (
                    matchData?.eligibility && (
                      <div className="mt-5 space-y-4">
                        {matchData.eligibility.why_it_matches?.length > 0 && (
                          <div className="rounded-2xl bg-frost p-4">
                            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                              Why This Matches Your Business
                            </h3>
                            <ul className="mt-2 space-y-1.5">
                              {matchData.eligibility.why_it_matches.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 font-body text-sm text-navy-900"
                                >
                                  <CheckCircle2
                                    className="mt-0.5 h-4 w-4 shrink-0 text-teal-deep"
                                    aria-hidden="true"
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                          {matchData.eligibility.missing_requirements?.length > 0 && (
                            <div className="rounded-2xl border border-amber-600/25 bg-amber-50/50 p-4">
                              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-amber-900">
                                Missing Requirements
                              </h3>
                              <ul className="mt-2 space-y-1.5">
                                {matchData.eligibility.missing_requirements.map((req, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 font-body text-xs leading-relaxed text-amber-950"
                                  >
                                    <AlertTriangle
                                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700"
                                      aria-hidden="true"
                                    />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {matchData.eligibility.details_to_confirm?.length > 0 && (
                            <div className="rounded-2xl border border-navy-800/12 bg-frost/70 p-4">
                              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                                Details to Confirm Before Applying
                              </h3>
                              <ul className="mt-2 space-y-1.5">
                                {matchData.eligibility.details_to_confirm.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 font-body text-xs leading-relaxed text-navy-900/85"
                                  >
                                    <HelpCircle
                                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-600"
                                      aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {matchData.eligibility.required_documents?.length > 0 && (
                          <div>
                            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                              Required Registrations / Documents Mentioned
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {matchData.eligibility.required_documents.map((doc, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-full border border-navy-800/15 bg-frost px-3 py-1 font-heading text-xs font-semibold text-navy-900"
                                >
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {matchData.eligibility.disclaimer && (
                          <p className="border-t border-navy-800/10 pt-3 font-body text-xs leading-relaxed text-navy-800/70">
                            {matchData.eligibility.disclaimer}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </section>
              )}

              {/* Prompt for Signed-in Member Without Profile or Visitor */}
              {!isAuthenticated && (
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-navy-600/20 bg-white p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-heading text-sm font-bold text-navy-950">
                      Check if your business fits this opportunity
                    </p>
                    <p className="mt-0.5 font-body text-xs text-navy-800/75">
                      Sign in and complete your BECCI business profile to receive deterministic eligibility
                      explanations and missing-requirement checklists.
                    </p>
                  </div>
                  <Link
                    to="/member/login"
                    className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full bg-navy-950 px-5 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-700"
                  >
                    <span>Member Sign In</span>
                  </Link>
                </div>
              )}

              {/* Opportunity Overview */}
              <section className="rounded-3xl border border-navy-800/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-navy-700" aria-hidden="true" />
                  <h2 className="font-heading text-xl font-bold text-navy-950">Opportunity Overview</h2>
                </div>
                <p className="mt-4 whitespace-pre-line font-body text-sm leading-relaxed text-navy-900/85">
                  {opportunity.description || "Detailed description not published in source summary. Please open the official notification link."}
                </p>

                {opportunity.benefits && (
                  <div className="mt-5 rounded-2xl bg-frost p-4">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                      Benefits &amp; Support
                    </h3>
                    <p className="mt-1.5 whitespace-pre-line font-body text-sm leading-relaxed text-navy-900/85">
                      {opportunity.benefits}
                    </p>
                  </div>
                )}

                {opportunity.financial_details && (
                  <div className="mt-4 rounded-2xl bg-frost p-4">
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                      Financial Details
                    </h3>
                    <p className="mt-1.5 whitespace-pre-line font-body text-sm leading-relaxed text-navy-900/85">
                      {opportunity.financial_details}
                    </p>
                  </div>
                )}
              </section>

              {/* Eligibility, Qualification & Registrations */}
              <section className="rounded-3xl border border-navy-800/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2.5">
                  <ClipboardList className="h-5 w-5 text-navy-700" aria-hidden="true" />
                  <h2 className="font-heading text-xl font-bold text-navy-950">
                    Eligibility &amp; Required Registrations
                  </h2>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800/75">
                      Eligibility Criteria
                    </h3>
                    <p className="mt-1 whitespace-pre-line font-body text-sm leading-relaxed text-navy-900/85">
                      {opportunity.eligibility || "Not published — confirm eligibility directly on the official issuing portal."}
                    </p>
                  </div>

                  {opportunity.qualification && (
                    <div>
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800/75">
                        Qualification
                      </h3>
                      <p className="mt-1 font-body text-sm text-navy-900/85">{opportunity.qualification}</p>
                    </div>
                  )}

                  {opportunity.experience && (
                    <div>
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800/75">
                        Experience
                      </h3>
                      <p className="mt-1 font-body text-sm text-navy-900/85">{opportunity.experience}</p>
                    </div>
                  )}

                  {td?.required_registrations?.length > 0 && (
                    <div>
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800/75">
                        Required Registrations
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {td.required_registrations.map((reg, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-navy-600/20 bg-frost px-3 py-1 font-heading text-xs font-semibold text-navy-900"
                          >
                            {reg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {td?.msme_preference && td.msme_preference !== "Not stated" && (
                    <div className="rounded-2xl border border-teal-deep/20 bg-teal-mist/50 p-4">
                      <p className="font-heading text-xs font-bold uppercase tracking-wider text-teal-ink">
                        MSME / MSE Relaxation &amp; Preference
                      </p>
                      <p className="mt-1 font-body text-sm text-navy-950">{td.msme_preference}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Tender Commercials & Corrigendum History (when tender_detail exists) */}
              {td && (
                <section className="rounded-3xl border border-navy-800/10 bg-white p-6 shadow-soft sm:p-8">
                  <h2 className="font-heading text-xl font-bold text-navy-950">
                    Procurement &amp; Tender Specifications
                  </h2>
                  <dl className="mt-4 divide-y divide-navy-800/10">
                    <InfoRow label="Tender ID" value={td.tender_id} />
                    <InfoRow label="Reference Number" value={td.reference_number} />
                    <InfoRow label="Department" value={td.department} />
                    <InfoRow label="Tender Category" value={td.tender_category} />
                    <InfoRow label="Product Category" value={td.product_category} />
                    <InfoRow label="Estimated Value" value={td.estimated_value} />
                    <InfoRow label="EMD Amount" value={td.emd_amount} />
                    <InfoRow label="Tender Fee" value={td.tender_fee} />
                    <InfoRow label="Turnover Requirement" value={td.turnover_requirement} />
                    <InfoRow label="Experience Requirement" value={td.experience_requirement} />
                    <InfoRow label="Pre-Bid Details" value={td.pre_bid_details} />
                  </dl>

                  {td.cancellation_reason && (
                    <div className="mt-4 rounded-2xl border border-rose-700/25 bg-rose-50 p-4">
                      <p className="font-heading text-xs font-bold uppercase tracking-wider text-rose-800">
                        Cancellation Notice
                      </p>
                      <p className="mt-1 font-body text-sm text-rose-950">{td.cancellation_reason}</p>
                    </div>
                  )}

                  {Array.isArray(td.corrigendum_history) && td.corrigendum_history.length > 0 && (
                    <div className="mt-5 border-t border-navy-800/10 pt-4">
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                        Corrigendum History ({td.corrigendum_history.length})
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {td.corrigendum_history.map((c, idx) => (
                          <li key={idx} className="rounded-xl bg-frost p-3 font-body text-xs text-navy-900">
                            {typeof c === "string" ? c : c.note || c.summary || JSON.stringify(c)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* Application Instructions & Supporting Documents */}
              <section className="rounded-3xl border border-navy-800/10 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="font-heading text-xl font-bold text-navy-950">
                  How to Apply &amp; Official Documents
                </h2>
                <p className="mt-3 whitespace-pre-line font-body text-sm leading-relaxed text-navy-900/85">
                  {opportunity.application_method ||
                    "Applications must be submitted directly through the issuing organisation's official portal linked on this page."}
                </p>

                {Array.isArray(opportunity.supporting_documents) &&
                  opportunity.supporting_documents.length > 0 && (
                    <div className="mt-5 border-t border-navy-800/10 pt-4">
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-navy-800">
                        Supporting Official Documents
                      </h3>
                      <ul className="mt-2.5 space-y-2">
                        {opportunity.supporting_documents.map((doc, idx) => {
                          const docUrl = typeof doc === "string" ? doc : doc.url || doc.href;
                          const docLabel =
                            typeof doc === "string" ? doc : doc.title || doc.name || doc.label || docUrl;
                          if (!docUrl) return null;
                          return (
                            <li key={idx}>
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noreferrer"
                                data-cursor="open"
                                className="inline-flex items-center gap-2 font-heading text-xs font-semibold text-navy-700 underline-offset-4 hover:text-navy-950 hover:underline"
                              >
                                <FileText className="h-4 w-4 shrink-0 text-teal-deep" aria-hidden="true" />
                                <span className="break-all">{docLabel}</span>
                                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </section>
            </div>

            {/* RIGHT SIDEBAR — IMPORTANT DATES, VERIFICATION & DISCLAIMER */}
            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-navy-800/10 bg-white p-6 shadow-soft">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-navy-950">
                  Important Dates
                </h2>
                <dl className="mt-3 divide-y divide-navy-800/10">
                  <InfoRow label="Submission Deadline" value={formatDate(opportunity.deadline)} />
                  <InfoRow label="Published Date" value={formatDate(opportunity.published_date)} />
                  <InfoRow label="Opening Date" value={formatDate(opportunity.opening_date)} />
                  {td?.document_download_date && (
                    <InfoRow label="Document Download" value={formatDate(td.document_download_date)} />
                  )}
                  {td?.pre_bid_date && <InfoRow label="Pre-Bid Date" value={formatDate(td.pre_bid_date)} />}
                  {td?.bid_opening_date && (
                    <InfoRow label="Bid Opening Date" value={formatDate(td.bid_opening_date)} />
                  )}
                  {opportunity.event_date && (
                    <InfoRow label="Event Date" value={formatDate(opportunity.event_date)} />
                  )}
                </dl>
              </div>

              <div className="rounded-3xl border border-navy-800/10 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-deep" aria-hidden="true" />
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-navy-950">
                    Verification &amp; Source
                  </h2>
                </div>
                <dl className="mt-3 divide-y divide-navy-800/10">
                  <InfoRow label="Issuing Organisation" value={opportunity.issuing_organisation} />
                  <InfoRow label="Publisher" value={opportunity.publisher} />
                  <InfoRow label="Reference No." value={opportunity.reference_number} />
                  {opportunity.positions && <InfoRow label="Positions" value={opportunity.positions} />}
                  <InfoRow
                    label="Last Verified"
                    value={formatDateTime(opportunity.last_verified_at)}
                  />
                </dl>

                <div className="mt-4 flex flex-col gap-2">
                  {opportunity.original_url && (
                    <a
                      href={opportunity.original_url}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="open"
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-700"
                    >
                      <span>Verify on Official Website</span>
                      <ExternalLink className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>

              {/* Mandatory Non-Affiliation Disclaimer */}
              <div className="rounded-3xl border border-navy-800/10 bg-white p-5">
                <div className="flex items-start gap-2.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" aria-hidden="true" />
                  <p className="font-body text-xs leading-relaxed text-navy-800/80">
                    {opportunity.disclaimer}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {isScheme && (
        <SchemeEligibilityModal
          scheme={opportunity}
          isOpen={showEligibilityModal}
          onClose={() => setShowEligibilityModal(false)}
        />
      )}
    </>
  );
}
