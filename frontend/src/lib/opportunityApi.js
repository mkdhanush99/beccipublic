/**
 * BECCI Opportunity Intelligence Engine — API Client & Controlled Vocabularies
 *
 * Connects the BECCI public website (CRA / CRACO) to the separate FastAPI Opportunity Engine
 * strictly over HTTP/HTTPS API calls without duplicating backend matching or verification logic.
 *
 * Security guarantees:
 * - Never hardcodes localhost into production bundles.
 * - Never stores passwords in browser storage.
 * - Never puts bearer tokens in URLs or logs.
 * - Keeps member (`member|...`) and admin bearer sessions strictly separated.
 */

const MEMBER_SESSION_KEY = "becci_member_session_v1";
const ADMIN_SESSION_KEY = "becci_admin_session_v1";

export const MEMBER_SESSION_EXPIRED_EVENT = "becci:member-session-expired";
export const ADMIN_SESSION_EXPIRED_EVENT = "becci:admin-session-expired";

function isLocalBrowserHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

/**
 * Resolve API base URL strictly from CRA environment configuration.
 * Never falls back to localhost when deployed on a non-local origin.
 */
export function getApiBaseUrl() {
  const raw = (process.env.REACT_APP_BECCI_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!raw) return "";

  const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(raw);
  if (isLocalApi && process.env.NODE_ENV === "production" && !isLocalBrowserHost()) {
    return "";
  }
  return raw;
}

export function getAdminPortalExternalUrl() {
  const explicit = (process.env.REACT_APP_BECCI_ADMIN_URL || "").trim().replace(/\/+$/, "");
  if (explicit) return explicit;
  const base = getApiBaseUrl();
  return base ? `${base}/admin` : "";
}

export function isApiConfigured() {
  return Boolean(getApiBaseUrl());
}

export class ApiError extends Error {
  constructor(message, status = 0, code = "API_ERROR", detail = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

// --------------------------------------------------------------------------- Session Helpers (sessionStorage only, zero passwords)
export function readMemberSession() {
  try {
    const raw = window.sessionStorage.getItem(MEMBER_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.access_token || !parsed?.member_id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeMemberSession(session) {
  try {
    if (!session) {
      window.sessionStorage.removeItem(MEMBER_SESSION_KEY);
      return;
    }
    window.sessionStorage.setItem(
      MEMBER_SESSION_KEY,
      JSON.stringify({
        access_token: session.access_token,
        token_type: session.token_type || "bearer",
        member_id: session.member_id,
        email: session.email,
        display_name: session.display_name,
      })
    );
  } catch {
    // Ignore restricted storage environments
  }
}

export function clearMemberSession() {
  writeMemberSession(null);
}

export function readAdminSession() {
  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.access_token || !parsed?.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAdminSession(session) {
  try {
    if (!session) {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return;
    }
    window.sessionStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({
        access_token: session.access_token,
        token_type: session.token_type || "bearer",
        username: session.username,
        role: session.role,
      })
    );
  } catch {
    // Ignore restricted storage environments
  }
}

export function clearAdminSession() {
  writeAdminSession(null);
}

// --------------------------------------------------------------------------- Core Fetch Wrapper
function buildUrl(path, params = null) {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError(
      "Opportunity Engine API endpoint is not configured for this environment.",
      0,
      "API_NOT_CONFIGURED"
    );
  }
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        url.searchParams.set(k, String(v).trim());
      }
    });
  }
  return url.toString();
}

function extractErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload.detail === "string") return payload.detail;
  if (Array.isArray(payload.detail) && payload.detail.length > 0) {
    return payload.detail
      .map((err) => {
        const loc = Array.isArray(err.loc) ? err.loc.slice(-1)[0] : "";
        return loc ? `${loc}: ${err.msg}` : err.msg;
      })
      .join(" · ");
  }
  return fallback;
}

async function apiRequest(path, { method = "GET", params = null, body = undefined, authScope = "public", signal } = {}) {
  const url = buildUrl(path, params);
  const headers = { Accept: "application/json" };

  const apiKey = (process.env.REACT_APP_BECCI_API_KEY || "").trim();
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authScope === "member") {
    const sess = readMemberSession();
    if (!sess?.access_token) {
      throw new ApiError("Please sign in to access your BECCI member portal.", 401, "UNAUTHORIZED");
    }
    headers.Authorization = `Bearer ${sess.access_token}`;
  } else if (authScope === "admin") {
    const sess = readAdminSession();
    if (!sess?.access_token) {
      throw new ApiError("Administrator authentication is required.", 401, "ADMIN_UNAUTHORIZED");
    }
    headers.Authorization = `Bearer ${sess.access_token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError(
      "Unable to reach the BECCI Opportunity Engine right now. Please try again shortly.",
      0,
      "NETWORK_ERROR"
    );
  }

  if (response.status === 204) return null;

  let payload = null;
  const ct = response.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const msg = extractErrorMessage(payload, `Request failed (${response.status})`);
    if (response.status === 401) {
      if (authScope === "member") {
        clearMemberSession();
        window.dispatchEvent(new CustomEvent(MEMBER_SESSION_EXPIRED_EVENT, { detail: msg }));
      } else if (authScope === "admin") {
        clearAdminSession();
        window.dispatchEvent(new CustomEvent(ADMIN_SESSION_EXPIRED_EVENT, { detail: msg }));
      }
    }
    throw new ApiError(msg, response.status, response.status === 401 ? "UNAUTHORIZED" : "HTTP_ERROR", payload);
  }

  return payload;
}

// --------------------------------------------------------------------------- Controlled Vocabularies (Synced with Backend app/enums.py)
export const OPPORTUNITY_CATEGORIES = [
  { value: "job", label: "Government Jobs", short: "Jobs" },
  { value: "funding", label: "Schemes & Funding", short: "Schemes & Funding" },
  { value: "tender", label: "Government Tenders", short: "Tenders" },
  { value: "business_growth", label: "Business & Innovation", short: "Business & Innovation" },
  { value: "learning", label: "Learning & Skilling", short: "Learning" },
  { value: "event", label: "Events & Expos", short: "Events" },
];

export const CATEGORY_LABEL_MAP = OPPORTUNITY_CATEGORIES.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

export const BECCI_SECTORS = [
  "Manufacturing",
  "Trading and distribution",
  "Services",
  "Healthcare",
  "Education and training",
  "Agriculture and allied activities",
  "IT and technology",
  "Construction and infrastructure",
  "Finance and professional services",
  "Hospitality and tourism",
  "Other industries",
];

export const TENDER_STATUSES = [
  { value: "open", label: "Open" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "extended", label: "Extended" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
];

export const BUSINESS_TYPES = [
  { value: "manufacturer", label: "Manufacturer / Producer" },
  { value: "trader_distributor", label: "Trader / Distributor" },
  { value: "service_provider", label: "Service Provider" },
  { value: "contractor", label: "Contractor / Works Execution" },
  { value: "startup", label: "Startup / Innovation Venture" },
  { value: "individual_entrepreneur", label: "Individual Entrepreneur / Artisan" },
  { value: "cooperative_shg", label: "Cooperative / SHG / FPO" },
  { value: "ngo_social_enterprise", label: "NGO / Social Enterprise" },
  { value: "other", label: "Other Enterprise Type" },
];

export const BUSINESS_STAGES = [
  { value: "idea_pre_revenue", label: "Idea / Pre-Revenue" },
  { value: "early_stage", label: "Early Stage (0–2 Years)" },
  { value: "micro", label: "Micro Enterprise (MSME)" },
  { value: "small", label: "Small Enterprise (MSME)" },
  { value: "medium", label: "Medium Enterprise (MSME)" },
  { value: "established", label: "Established Enterprise" },
];

export const UDYAM_STATUSES = [
  { value: "unknown", label: "Prefer not to say / Not sure" },
  { value: "not_registered", label: "Not Registered Yet" },
  { value: "applied", label: "Applied / In Progress" },
  { value: "registered", label: "Udyam Registered (MSME)" },
  { value: "not_applicable", label: "Not Applicable" },
];

export const GST_STATUSES = [
  { value: "unknown", label: "Prefer not to say / Not sure" },
  { value: "not_registered", label: "Not Registered" },
  { value: "exempt", label: "GST Exempt / Below Threshold" },
  { value: "registered", label: "GST Registered" },
];

export const ENTITY_TYPES = [
  { value: "unregistered_individual", label: "Unregistered Individual / Freelancer" },
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "private_limited", label: "Private Limited Company" },
  { value: "public_limited", label: "Public Limited Company" },
  { value: "opc", label: "One Person Company (OPC)" },
  { value: "society_trust_cooperative", label: "Society / Trust / Cooperative" },
  { value: "other", label: "Other Legal Structure" },
];

export const ELIGIBILITY_STATUS_OPTIONS = [
  { value: "likely_match", label: "Likely Match" },
  { value: "partial_match", label: "Partial Match" },
  { value: "insufficient_information", label: "Insufficient Information" },
  { value: "requires_manual_review", label: "Requires Manual Review" },
  { value: "not_eligible", label: "Not Eligible" },
];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Ladakh",
];

// --------------------------------------------------------------------------- Public Opportunity API (/api/v1/*)
export const fetchHealth = (signal) => apiRequest("/api/v1/health", { signal });

export const fetchPublicOpportunities = (params = {}, signal) =>
  apiRequest("/api/v1/opportunities", { params, signal });

export const fetchClosingSoonOpportunities = (limit = 6, signal) =>
  apiRequest("/api/v1/opportunities/closing-soon", { params: { limit }, signal });

export const fetchFeaturedOpportunities = (limit = 6, signal) =>
  apiRequest("/api/v1/opportunities/featured", { params: { limit }, signal });

export const fetchPublicOpportunityDetail = (idOrSlug, signal) =>
  apiRequest(`/api/v1/opportunities/${encodeURIComponent(idOrSlug)}`, { signal });

export const fetchPublicCategories = (signal) => apiRequest("/api/v1/categories", { signal });

export const fetchPublicLocations = (signal) => apiRequest("/api/v1/locations", { signal });

export const fetchPublicSources = (signal) => apiRequest("/api/v1/sources", { signal });

// --------------------------------------------------------------------------- Government Schemes & Eligibility AI (/api/v1/schemes/*)
export const fetchSchemes = (params = {}, signal) =>
  apiRequest("/api/v1/schemes", { params, signal });

export const fetchSchemeDetail = (idOrSlug, signal) =>
  apiRequest(`/api/v1/schemes/${encodeURIComponent(idOrSlug)}`, { signal });

export const checkSchemeEligibility = (idOrSlug, assessmentInput, signal) =>
  apiRequest(`/api/v1/schemes/${encodeURIComponent(idOrSlug)}/check-eligibility`, {
    method: "POST",
    body: assessmentInput,
    signal,
  });

// --------------------------------------------------------------------------- Public Tenders (/api/v1/tenders/*)
export const fetchTenders = (params = {}, signal) =>
  apiRequest("/api/v1/tenders", { params, signal });

export const fetchTenderDetail = (idOrSlug, signal) =>
  apiRequest(`/api/v1/tenders/${encodeURIComponent(idOrSlug)}`, { signal });

// --------------------------------------------------------------------------- Member Auth & Profile API (/api/v1/member/*)
export const registerMember = ({ email, password, display_name }) =>
  apiRequest("/api/v1/member/auth/register", {
    method: "POST",
    body: { email, password, display_name },
  });

export const loginMember = ({ email, password }) =>
  apiRequest("/api/v1/member/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const fetchMemberProfile = (signal) =>
  apiRequest("/api/v1/member/profile", { authScope: "member", signal });

export const saveMemberProfile = (profileData, isUpdate = false) =>
  apiRequest("/api/v1/member/profile", {
    method: isUpdate ? "PUT" : "POST",
    body: profileData,
    authScope: "member",
  });

// --------------------------------------------------------------------------- Member Matching, Saved & Viewed API
export const fetchMemberRecommendations = (params = {}, signal) =>
  apiRequest("/api/v1/member/recommendations", { params, authScope: "member", signal });

export const fetchRecommendations = fetchMemberRecommendations;

export const fetchMemberOpportunityMatch = (oppId, signal) =>
  apiRequest(`/api/v1/member/opportunities/${encodeURIComponent(oppId)}/match`, {
    authScope: "member",
    signal,
  });

export const fetchSavedOpportunities = (signal) =>
  apiRequest("/api/v1/member/saved", { authScope: "member", signal });

export const saveOpportunity = (oppId, notes = null) =>
  apiRequest(`/api/v1/member/saved/${encodeURIComponent(oppId)}`, {
    method: "POST",
    body: notes !== null ? { notes } : {},
    authScope: "member",
  });

export const unsaveOpportunity = (oppId) =>
  apiRequest(`/api/v1/member/saved/${encodeURIComponent(oppId)}`, {
    method: "DELETE",
    authScope: "member",
  });

export const fetchViewedOpportunities = (limit = 50, signal) =>
  apiRequest("/api/v1/member/viewed", { params: { limit }, authScope: "member", signal });

export const recordOpportunityView = (oppId) =>
  apiRequest(`/api/v1/member/viewed/${encodeURIComponent(oppId)}`, {
    method: "POST",
    authScope: "member",
  });

// --------------------------------------------------------------------------- Protected Admin API (/api/admin/*)
export const loginAdmin = ({ username, password }) =>
  apiRequest("/api/admin/auth/login", {
    method: "POST",
    body: { username, password },
  });

export const fetchAdminQueue = (params = {}, signal) =>
  apiRequest("/api/admin/queue", { params, authScope: "admin", signal });

export const fetchAdminOpportunityDetail = (oppId, signal) =>
  apiRequest(`/api/admin/opportunities/${encodeURIComponent(oppId)}`, {
    authScope: "admin",
    signal,
  });

export const reviewAdminOpportunity = (oppId, payload) =>
  apiRequest(`/api/admin/opportunities/${encodeURIComponent(oppId)}/review`, {
    method: "POST",
    body: payload,
    authScope: "admin",
  });

export const fetchAdminIncompleteEligibility = (params = {}, signal) =>
  apiRequest("/api/admin/matching/incomplete-eligibility", {
    params,
    authScope: "admin",
    signal,
  });

export const fetchAdminSourceHealth = (signal) =>
  apiRequest("/api/admin/sources/health", { authScope: "admin", signal });

export const fetchAdminMetrics = (signal) =>
  apiRequest("/api/admin/metrics", { authScope: "admin", signal });

// --------------------------------------------------------------------------- Regional & Authority Helpers
export function isEligibleForTSAP(opp) {
  if (!opp) return false;
  const state = (opp.state || "").trim().toLowerCase();
  if (!state || state === "national" || opp.location_type === "national") {
    return true; // Pan-India / National schemes open to TS and AP
  }
  return state === "telangana" || state === "andhra pradesh";
}

export function getAuthorityType(opp) {
  if (!opp) return "government";
  const st = (opp.source_type || "").toLowerCase();
  if (st === "private" || st === "corporate" || opp.employer_type === "private") {
    return "private";
  }
  return "government";
}
