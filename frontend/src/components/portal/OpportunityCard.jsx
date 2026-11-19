import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Coins,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  AuthorityTypeBadge,
  CategoryBadge,
  ChannelBadge,
  EligibilityStatusBadge,
  OpportunityStatusBadge,
  TSAPBadge,
  VerificationBadge,
  formatDate,
  formatOpportunityLocation,
  getDaysUntilDeadline,
} from "@/components/portal/OpportunityBadges";
import SchemeEligibilityModal from "@/components/portal/SchemeEligibilityModal";

/**
 * Unified BECCI Opportunity Card for Public Discovery & Member Dashboard.
 * Strictly renders verified fields from the FastAPI backend — never invents missing values.
 */
export default function OpportunityCard({
  opportunity,
  match = null,
  isSaved = false,
  saving = false,
  onToggleSave = null,
  showSaveButton = false,
  compact = false,
}) {
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  if (!opportunity) return null;

  const sector = opportunity.tender_detail?.sector || opportunity.industry || null;
  const locationLabel = formatOpportunityLocation(opportunity);
  const deadlineFormatted = formatDate(opportunity.deadline);
  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  const isExpired =
    opportunity.expiry_status === "expired" ||
    opportunity.lifecycle_status === "expired" ||
    opportunity.tender_detail?.tender_status === "expired";

  const isScheme =
    Boolean(opportunity.scheme_detail) ||
    opportunity.category === "funding" ||
    opportunity.category === "business_growth" ||
    opportunity.subcategory === "government_subsidy";

  const isTender = opportunity.category === "tender" || Boolean(opportunity.tender_detail);
  const isJob = opportunity.category === "job";

  const detailHref = `/opportunities/${encodeURIComponent(opportunity.id)}`;

  return (
    <>
      <article
        data-testid={`opportunity-card-${opportunity.id}`}
        className="flex h-full flex-col justify-between rounded-2xl border border-navy-800/12 bg-white p-5 shadow-soft transition-[border-color,box-shadow] duration-200 hover:border-navy-600/35 hover:shadow-lift sm:p-6"
      >
        <div>
          {/* Top Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={opportunity.category} />
              <AuthorityTypeBadge opp={opportunity} />
              <ChannelBadge opp={opportunity} />
              <OpportunityStatusBadge opp={opportunity} />
              <TSAPBadge opp={opportunity} />
            </div>

            <div className="flex items-center gap-2">
              {match && typeof match.relevance_score === "number" && (
                <span
                  data-testid={`match-score-${opportunity.id}`}
                  className="inline-flex items-center rounded-full bg-navy-950 px-3 py-1 font-heading text-xs font-bold tabular-nums text-white"
                  title="Deterministic match score computed by BECCI Opportunity Engine"
                >
                  {Math.round(match.relevance_score)}% Match
                </span>
              )}
              {showSaveButton && onToggleSave && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onToggleSave(opportunity.id, isSaved)}
                  data-testid={`save-opp-${opportunity.id}`}
                  aria-label={isSaved ? "Remove from saved opportunities" : "Save opportunity"}
                  aria-pressed={isSaved}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                    isSaved
                      ? "border-navy-600 bg-navy-950 text-white hover:bg-navy-800"
                      : "border-navy-800/15 bg-frost text-navy-800 hover:border-navy-600 hover:text-navy-950"
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="h-4 w-4 text-teal-bright" aria-hidden="true" />
                  ) : (
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Title & Issuing Organisation */}
          <h3 className="mt-3.5 font-heading text-lg font-bold leading-snug text-navy-950 sm:text-[1.15rem]">
            <Link to={detailHref} className="transition-colors hover:text-navy-600">
              {opportunity.title}
            </Link>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-body text-xs text-navy-800/75">
            <span className="inline-flex items-center gap-1.5 font-medium text-navy-900">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden="true" />
              <span>{opportunity.issuing_organisation}</span>
            </span>
            {sector && (
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 shrink-0 text-navy-500" aria-hidden="true" />
                <span>{sector}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-navy-500" aria-hidden="true" />
              <span>{locationLabel}</span>
            </span>
          </div>

          {/* AI-Extracted Tender Intelligence Highlights */}
          {isTender && opportunity.tender_detail && (
            <div className="mt-3.5 grid gap-2 rounded-xl border border-navy-800/10 bg-frost/50 p-3 sm:grid-cols-2">
              {opportunity.tender_detail.estimated_value &&
                opportunity.tender_detail.estimated_value !== "Not published" && (
                  <div className="flex items-center gap-1.5 font-body text-xs text-navy-900">
                    <Coins className="h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                    <span className="text-navy-800/70">Est. Value:</span>
                    <strong className="font-semibold">{opportunity.tender_detail.estimated_value}</strong>
                  </div>
                )}
              {opportunity.tender_detail.emd_amount &&
                opportunity.tender_detail.emd_amount !== "Not published" && (
                  <div className="flex items-center gap-1.5 font-body text-xs text-navy-900">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden="true" />
                    <span className="text-navy-800/70">EMD:</span>
                    <strong className="font-semibold">{opportunity.tender_detail.emd_amount}</strong>
                  </div>
                )}
              {opportunity.tender_detail.turnover_requirement &&
                opportunity.tender_detail.turnover_requirement !== "Not specified" && (
                  <div className="flex items-center gap-1.5 font-body text-xs text-navy-900">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden="true" />
                    <span className="text-navy-800/70">Turnover Req:</span>
                    <strong className="font-semibold truncate">{opportunity.tender_detail.turnover_requirement}</strong>
                  </div>
                )}
              {opportunity.tender_detail.msme_preference &&
                opportunity.tender_detail.msme_preference !== "No explicit exemption" && (
                  <div className="flex items-center gap-1.5 font-body text-xs text-teal-deep">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                    <span className="font-semibold">{opportunity.tender_detail.msme_preference}</span>
                  </div>
                )}
              {Array.isArray(opportunity.tender_detail.corrigendum_history) &&
                opportunity.tender_detail.corrigendum_history.length > 0 && (
                  <div className="col-span-full font-body text-[0.72rem] text-amber-900">
                    <span>Corrigenda: {opportunity.tender_detail.corrigendum_history.length} update(s) published</span>
                  </div>
                )}
            </div>
          )}

          {/* AI-Extracted Job Intelligence Highlights */}
          {isJob && (
            <div className="mt-3.5 grid gap-2 rounded-xl border border-navy-800/10 bg-frost/50 p-3 sm:grid-cols-2">
              {opportunity.financial_details && (
                <div className="flex items-center gap-1.5 font-body text-xs text-navy-900">
                  <Coins className="h-3.5 w-3.5 shrink-0 text-teal-deep" aria-hidden="true" />
                  <span className="text-navy-800/70">Salary / Pay:</span>
                  <strong className="font-semibold">{opportunity.financial_details}</strong>
                </div>
              )}
              {opportunity.experience && (
                <div className="flex items-center gap-1.5 font-body text-xs text-navy-900">
                  <Briefcase className="h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden="true" />
                  <span className="text-navy-800/70">Experience:</span>
                  <strong className="font-semibold">{opportunity.experience}</strong>
                </div>
              )}
              {opportunity.qualification && (
                <div className="flex items-center gap-1.5 font-body text-xs text-navy-900">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden="true" />
                  <span className="text-navy-800/70">Qualification:</span>
                  <strong className="font-semibold truncate">{opportunity.qualification}</strong>
                </div>
              )}
              {opportunity.positions && (
                <div className="flex items-center gap-1.5 font-body text-xs text-navy-900">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-navy-600" aria-hidden="true" />
                  <span className="text-navy-800/70">Positions:</span>
                  <strong className="font-semibold">{opportunity.positions}</strong>
                </div>
              )}
            </div>
          )}

          {/* Short Description */}
          {!compact && opportunity.description && (
            <p className="mt-3 line-clamp-2 font-body text-sm leading-relaxed text-navy-900/80">
              {opportunity.description}
            </p>
          )}

          {/* Deadline & Verification Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-800/8 pt-3.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-heading text-xs font-semibold ${
                isExpired
                  ? "bg-navy-100 text-navy-700"
                  : daysLeft !== null && daysLeft >= 0 && daysLeft <= 7
                    ? "bg-amber-50 text-amber-900 ring-1 ring-amber-600/25"
                    : "bg-frost text-navy-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                {deadlineFormatted
                  ? isExpired
                    ? `Closed ${deadlineFormatted}`
                    : daysLeft !== null && daysLeft >= 0 && daysLeft <= 7
                      ? `Due ${deadlineFormatted} (${daysLeft === 0 ? "Today" : `${daysLeft}d left`})`
                      : `Deadline: ${deadlineFormatted}`
                  : "Deadline: Not published"}
              </span>
            </span>

            <VerificationBadge lastVerifiedAt={opportunity.last_verified_at} />

            {opportunity.published_date && (
              <span className="inline-flex items-center rounded-full bg-frost px-2.5 py-0.5 font-heading text-xs font-semibold text-navy-800/75">
                <span>Published: {formatDate(opportunity.published_date)}</span>
              </span>
            )}
          </div>

          {/* Member Matching & Eligibility Explanation Block (strictly from backend Phase 3 engine) */}
          {match && match.eligibility && (
            <div className="mt-4 rounded-xl border border-navy-600/15 bg-frost/85 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading text-[0.68rem] font-bold uppercase tracking-[0.14em] text-navy-700">
                  Eligibility &amp; Match Assessment
                </span>
                <EligibilityStatusBadge status={match.eligibility.eligibility_status} />
              </div>

              {Array.isArray(match.eligibility.why_it_matches) &&
                match.eligibility.why_it_matches.length > 0 && (
                  <ul className="mt-2.5 space-y-1">
                    {match.eligibility.why_it_matches.slice(0, 3).map((reason, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 font-body text-xs leading-relaxed text-navy-900/90"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-deep"
                          aria-hidden="true"
                        />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                )}

              {Array.isArray(match.eligibility.missing_requirements) &&
                match.eligibility.missing_requirements.length > 0 && (
                  <div className="mt-2.5 border-t border-navy-800/10 pt-2.5">
                    <p className="font-heading text-[0.64rem] font-bold uppercase tracking-[0.12em] text-amber-900">
                      Missing / Actionable Requirements
                    </p>
                    <ul className="mt-1 space-y-1">
                      {match.eligibility.missing_requirements.slice(0, 3).map((req, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 font-body text-xs leading-relaxed text-amber-950"
                        >
                          <AlertCircle
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700"
                            aria-hidden="true"
                          />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy-800/10 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={detailHref}
              data-testid={`view-opp-${opportunity.id}`}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-navy-950 px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-700"
            >
              <span>View Full Details</span>
              <ArrowRight className="h-3.5 w-3.5 text-teal-bright" aria-hidden="true" />
            </Link>

            {isScheme && (
              <button
                type="button"
                onClick={() => setShowEligibilityModal(true)}
                data-testid={`check-eligibility-${opportunity.id}`}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-3.5 py-2 font-heading text-xs font-semibold text-navy-950 transition-colors hover:bg-teal hover:text-navy-950"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-deep" aria-hidden="true" />
                <span>Check AI Eligibility</span>
              </button>
            )}
          </div>

          {opportunity.original_url && (
            <a
              href={opportunity.application_url || opportunity.original_url}
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              className="inline-flex min-h-[38px] items-center gap-1.5 font-heading text-xs font-semibold text-navy-700 transition-colors hover:text-navy-950"
            >
              <span>Official Source</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </article>

      {/* AI Eligibility Advisor Modal */}
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
