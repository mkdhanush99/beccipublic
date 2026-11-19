# BECCI Phase 4 — Integration Architecture
## Website Integration & Member Opportunity Portal

**Date:** 2026-11-19  
**Website Workspace:** `/Users/dhanushmakam/Downloads/beccipublic` (React 19, CRA/CRACO 7, React Router 7, Tailwind CSS 3)  
**Backend Workspace (Separate, Unmodified):** `/Users/dhanushmakam/.gemini/antigravity/scratch/becci-opportunity-engine` (FastAPI `3.0.0`)

---

## 1. Architectural Separation & Non-Duplication

The BECCI public website and the BECCI Opportunity Intelligence Engine remain **strictly separate repositories and runtime services** communicating solely over versioned HTTP/HTTPS JSON APIs:

```text
BECCI Public Website (CRA / CRACO SPA)
   │
   │  HTTPS JSON Requests (REACT_APP_BECCI_API_BASE_URL)
   │  • Public Discovery:  GET  /api/v1/opportunities*, /categories, /locations, /sources
   │  • Member Portal:     POST /api/v1/member/auth/{register,login}
   │                       GET/POST/PUT /api/v1/member/profile
   │                       GET  /api/v1/member/recommendations, /opportunities/{id}/match
   │                       GET/POST/DELETE /api/v1/member/saved*, GET/POST /api/v1/member/viewed*
   │  • Admin Review:      POST /api/admin/auth/login
   │                       GET  /api/admin/queue, /opportunities/{id}, /metrics, /sources/health
   │                       POST /api/admin/opportunities/{id}/review
   ▼
BECCI Opportunity Intelligence Engine (FastAPI 3.0.0)
   │
   ├── Phase 1: Job Scout & Funding Scout
   ├── Phase 2: Tender Scout & Agent 07 Verification
   ├── Phase 3: Business Profiles & Deterministic Matching Engine
   └── SQLite / Production RDBMS (Migrations 001–003)
```

### Core Boundaries Enforced
- **Zero repository merging:** Backend Python source, migrations, and SQLite database remain isolated in the separate backend workspace.
- **Zero duplicated matching or verification logic:** Relevance scores, eligibility statuses (`likely_match`, `partial_match`, `not_eligible`, `insufficient_information`, `requires_manual_review`), missing requirements, and publication filtering are computed exclusively by the backend.
- **Zero mock data:** Empty or unreachable API states render honest empty/error banners rather than placeholder opportunities.

---

## 2. Environment Configuration Convention

Because the website runs **Create React App (`react-scripts 5.0.1`) + `@craco/craco 7.1.0`**, environment variables follow the `REACT_APP_*` convention (not `VITE_*`):

| Environment | Config File | `REACT_APP_BECCI_API_BASE_URL` | Behaviour |
| :--- | :--- | :--- | :--- |
| **Development** | `frontend/.env.development` | `http://127.0.0.1:8000` | Loaded only during `craco start` (`NODE_ENV=development`); automatically excluded by CRA during `craco build`. |
| **Staging** | `frontend/.env.staging.example` | `https://staging-api.becci.in` | Provided to staging build pipeline (HTTPS). |
| **Production** | `frontend/.env.production.example` | `https://api.becci.in` | Provided to production CI/CD build environment (HTTPS required). |
| **Template** | `frontend/.env.example` | *(empty)* | Documents all variables (`REACT_APP_BECCI_API_BASE_URL`, `REACT_APP_ENV`, `REACT_APP_BECCI_ADMIN_URL`). |

**Runtime Localhost Guard (`frontend/src/lib/opportunityApi.js`):** Even if misconfigured, `getApiBaseUrl()` refuses to return `localhost` or `127.0.0.1` when `NODE_ENV === "production"` on a non-local browser hostname.

---

## 3. Authentication & Role Separation Flow

1. **Member Authentication (`/api/v1/member/auth/register`, `/api/v1/member/auth/login`):**
   - Backend issues HMAC-SHA256 bearer tokens scoped with the `member|` namespace (8-hour TTL).
   - Frontend stores `{ access_token, member_id, email, display_name }` exclusively in `sessionStorage` (`becci_member_session_v1`).
   - Passwords are never stored in browser storage, and tokens are never placed in URLs or console logs.
   - Any `401 Unauthorized` response on a `/api/v1/member/*` call clears the session and dispatches `becci:member-session-expired`, prompting re-authentication cleanly.
2. **Admin Authentication (`/api/admin/auth/login`):**
   - Strictly separated into its own `sessionStorage` key (`becci_admin_session_v1`) and dedicated route (`/admin/opportunities`).
   - Not linked anywhere in the public or member Header/Footer.
   - Backend enforces `401`/`403` role isolation so member tokens are rejected on `/api/admin/*` and admin tokens are rejected on `/api/v1/member/*`.

---

## 4. API Endpoint Mapping

| Frontend Route / Module | Backend Endpoint(s) | Auth Scope |
| :--- | :--- | :--- |
| `/opportunities` (`Opportunities.jsx`) | `GET /api/v1/opportunities`, `/categories`, `/locations`, `/opportunities/closing-soon`, `/sources`; optional `GET/POST/DELETE /api/v1/member/saved*` | Public (+ optional Member) |
| `/opportunities/:id` (`OpportunityDetail.jsx`) | `GET /api/v1/opportunities/{id_or_slug}`; when signed in: `POST /api/v1/member/viewed/{id}`, `GET /api/v1/member/opportunities/{id}/match`, `POST/DELETE /api/v1/member/saved/{id}` | Public (+ optional Member) |
| `/member/login`, `/member/register` (`MemberAuth.jsx`) | `POST /api/v1/member/auth/login`, `POST /api/v1/member/auth/register` | Public |
| `/member/profile` (`MemberProfile.jsx`) | `GET /api/v1/member/profile`, `POST /api/v1/member/profile`, `PUT /api/v1/member/profile` | Member Bearer |
| `/member/dashboard` (`MemberDashboard.jsx`) | `GET /api/v1/member/profile`, `GET /api/v1/member/recommendations`, `GET/POST/DELETE /api/v1/member/saved*`, `GET /api/v1/member/viewed` | Member Bearer |
| `/admin/opportunities` (`AdminOpportunities.jsx`) | `POST /api/admin/auth/login`, `GET /api/admin/metrics`, `GET /api/admin/queue`, `GET /api/admin/opportunities/{id}`, `POST /api/admin/opportunities/{id}/review`, `GET /api/admin/matching/incomplete-eligibility`, `GET /api/admin/sources/health` | Admin Bearer |
