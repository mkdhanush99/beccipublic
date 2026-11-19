import React from "react";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Landmark,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { CATEGORY_LABEL_MAP } from "@/lib/opportunityApi";

export function formatDate(dateStr) {
  if (!dateStr) return null;
  const parsed = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dtStr) {
  if (!dtStr) return null;
  const parsed = new Date(dtStr);
  if (Number.isNaN(parsed.getTime())) return dtStr;
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDaysUntilDeadline(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T23:59:59`);
  if (Number.isNaN(target.getTime())) return null;
  const diffMs = target.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatOpportunityLocation(opp) {
  if (!opp) return "Not published";
  const parts = [];
  if (opp.city) parts.push(opp.city);
  if (opp.state) parts.push(opp.state);
  if (parts.length > 0) return parts.join(", ");
  if (opp.location_type === "national" || (!opp.state && opp.country === "India")) {
    return "All India (National)";
  }
  return opp.country || "Not published";
}

export function CategoryBadge({ category }) {
  const label = CATEGORY_LABEL_MAP[category] || category || "Opportunity";
  const styles = {
    tender: "border-navy-600/20 bg-navy-50 text-navy-800",
    funding: "border-teal-deep/25 bg-teal-mist/80 text-teal-ink",
    job: "border-navy-500/25 bg-ice/35 text-navy-900",
    business_growth: "border-navy-700/20 bg-frost-deep text-navy-900",
    learning: "border-navy-400/30 bg-frost text-navy-800",
    event: "border-navy-500/25 bg-frost text-navy-900",
  };
  const Icon =
    category === "tender"
      ? FileText
      : category === "funding"
        ? Landmark
        : category === "job"
          ? Briefcase
          : Sparkles;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${
        styles[category] || "border-navy-800/15 bg-frost text-navy-900"
      }`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function OpportunityStatusBadge({ opp }) {
  if (!opp) return null;
  const tenderStatus = opp.tender_detail?.tender_status;
  const expiry = opp.expiry_status;
  const lifecycle = opp.lifecycle_status;

  // Never mark expired, cancelled, closed, or withdrawn records as active
  if (
    expiry === "expired" ||
    lifecycle === "expired" ||
    tenderStatus === "expired" ||
    tenderStatus === "closed"
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-navy-800/15 bg-navy-100/80 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-navy-800/80">
        <XCircle className="h-3 w-3" aria-hidden="true" />
        <span>Expired / Closed</span>
      </span>
    );
  }

  if (lifecycle === "withdrawn" || tenderStatus === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-700/25 bg-rose-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-rose-800">
        <XCircle className="h-3 w-3" aria-hidden="true" />
        <span>Cancelled</span>
      </span>
    );
  }

  if (expiry === "closing_soon" || lifecycle === "closing_soon" || tenderStatus === "closing_soon") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-600/30 bg-amber-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-amber-900">
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>Closing Soon</span>
      </span>
    );
  }

  if (tenderStatus === "extended") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-navy-600/25 bg-navy-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-navy-700">
        <Clock className="h-3 w-3" aria-hidden="true" />
        <span>Deadline Extended</span>
      </span>
    );
  }

  if (expiry === "date_unavailable") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-navy-800/15 bg-frost px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-navy-800/75">
        <span>Active · Confirm Date</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-teal-deep/25 bg-teal-mist/70 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-teal-ink">
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      <span>Published · Open</span>
    </span>
  );
}

export function VerificationBadge({ lastVerifiedAt }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-navy-600/20 bg-white px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold text-navy-800">
      <ShieldCheck className="h-3 w-3 text-teal-deep" aria-hidden="true" />
      <span>{lastVerifiedAt ? `Verified ${formatDate(lastVerifiedAt)}` : "Official Source Verified"}</span>
    </span>
  );
}

export function EligibilityStatusBadge({ status }) {
  const map = {
    likely_match: {
      label: "Likely Match",
      cls: "border-teal-deep/30 bg-teal-mist text-teal-ink",
      Icon: CheckCircle2,
    },
    partial_match: {
      label: "Partial Match",
      cls: "border-navy-600/30 bg-navy-50 text-navy-800",
      Icon: AlertTriangle,
    },
    not_eligible: {
      label: "Not Eligible",
      cls: "border-rose-700/25 bg-rose-50 text-rose-800",
      Icon: XCircle,
    },
    insufficient_information: {
      label: "Insufficient Information",
      cls: "border-amber-600/30 bg-amber-50 text-amber-900",
      Icon: HelpCircle,
    },
    requires_manual_review: {
      label: "Requires Manual Review",
      cls: "border-navy-800/20 bg-frost-deep text-navy-900",
      Icon: Building2,
    },
  };

  const entry = map[status] || map.requires_manual_review;
  const Icon = entry.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-heading text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${entry.cls}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{entry.label}</span>
    </span>
  );
}

export function AuthorityTypeBadge({ opp }) {
  if (!opp) return null;
  const isPrivate =
    (opp.source_type || "").toLowerCase() === "private" ||
    (opp.employer_type || "").toLowerCase() === "private";

  if (isPrivate) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-purple-900">
        <Briefcase className="h-3 w-3 text-purple-700" aria-hidden="true" />
        <span>Private Sector Opening</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-navy-700/25 bg-navy-50/80 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-navy-900">
      <Building2 className="h-3 w-3 text-navy-700" aria-hidden="true" />
      <span>Official Government</span>
    </span>
  );
}

export function ChannelBadge({ opp }) {
  if (!opp) return null;
  const ref = (opp.reference_number || "").toUpperCase();
  const src = (opp.source_name || "").toLowerCase();
  const url = (opp.original_url || "").toLowerCase();
  const org = (opp.issuing_organisation || "").toLowerCase();
  const title = (opp.title || "").toLowerCase();

  if (ref.startsWith("GEM") || src.includes("gem") || url.includes("gem.gov.in") || title.includes("gem bid")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-600/35 bg-amber-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-amber-900">
        <span>GeM Procurement</span>
      </span>
    );
  }
  if (src.includes("cppp") || url.includes("eprocure.gov.in") || org.includes("central public procurement")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-600/30 bg-blue-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-blue-900">
        <span>CPPP Central Tender</span>
      </span>
    );
  }
  if (org.includes("backward classes") || org.includes("nbcfdc") || title.includes("backward classes") || title.includes("bc ") || title.includes("obc")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-teal-deep/30 bg-teal-mist px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-teal-ink">
        <span>OBC / BC Welfare Scheme</span>
      </span>
    );
  }
  if (org.includes("sidbi") || org.includes("small industries development")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-600/30 bg-indigo-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-indigo-900">
        <span>SIDBI MSME Finance</span>
      </span>
    );
  }
  if (opp.category === "job" && (org.includes("psc") || org.includes("public service commission"))) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-navy-600/30 bg-navy-50 px-2.5 py-0.5 font-heading text-[0.64rem] font-semibold uppercase tracking-wider text-navy-800">
        <span>PSC Recruitment</span>
      </span>
    );
  }
  return null;
}

export function TSAPBadge({ opp }) {
  if (!opp) return null;
  const isNational = !opp.state || opp.state.toLowerCase() === "national" || opp.location_type === "national";
  const isTS = (opp.state || "").toLowerCase() === "telangana";
  const isAP = (opp.state || "").toLowerCase() === "andhra pradesh";

  if (isNational || isTS || isAP) {
    return (
      <span
        title={isNational ? "Open to eligible applicants from Telangana, Andhra Pradesh and Pan-India" : `State programme for ${opp.state}`}
        className="inline-flex items-center gap-1 rounded-full border border-teal-deep/25 bg-white px-2 py-0.5 font-heading text-[0.62rem] font-semibold text-teal-deep"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-teal-deep" />
        <span>{isTS ? "Telangana (TS)" : isAP ? "Andhra Pradesh (AP)" : "Pan-India · TS & AP Eligible"}</span>
      </span>
    );
  }
  return null;
}
