# BECCI Phase 4 — Production Readiness & Deployment Checklist

**Date:** 2026-11-19  
**Frontend Status:** Ready for Staging / Production Build (`npx craco build` clean, 0 hardcoded local URLs)  
**Backend Status:** Phase 1–3 verified (`37/37` tests passing), ready for separate VPS/Cloud deployment

---

## 1. Security & Data Integrity Checklist

| Control | Status | Verification |
| :--- | :--- | :--- |
| Separate website & backend repositories preserved | **VERIFIED** | Zero merged backend files; API-only integration via `src/lib/opportunityApi.js`. |
| No hardcoded `localhost` / `127.0.0.1` in production JS | **VERIFIED** | Confirmed 0 matches in `frontend/build/static/js/` + runtime non-local hostname guard. |
| Passwords never stored in browser storage | **VERIFIED** | Only bearer session metadata persisted in `sessionStorage`; cleared on logout or `401`. |
| Tokens never exposed in URLs or logs | **VERIFIED** | Sent exclusively via `Authorization: Bearer ...` header. |
| Member vs. Admin role isolation enforced by backend | **VERIFIED** | Member tokens rejected on `/api/admin/*` (`401`); separate session keys in browser. |
| Unpublished opportunities hidden from public & members | **VERIFIED** | Confirmed `404` on `/api/v1/opportunities/{unpublished_id}` and absent from listings. |
| Member-to-member data isolation | **VERIFIED** | Member B sees zero Member A profile, saved, or viewed records. |
| No sensitive IDs collected in Business Profile | **VERIFIED** | Explicit data-minimisation guidance; no PAN/Aadhaar/GSTIN/Udyam/bank fields exist. |
| Expired opportunities never marked active | **VERIFIED** | `OpportunityStatusBadge` and deadline alerts strictly exclude expired/cancelled statuses. |

---

## 2. Pre-Production Deployment Requirements (Before Enabling Live Portal on `becci.in`)

### A. Backend (Separate `becci-opportunity-engine` Repository — VPS / Cloud Deployment)
1. **Deploy FastAPI behind HTTPS (e.g. `https://api.becci.in`):**
   - Terminate TLS via Nginx/Caddy/Cloudflare with valid SSL certificate.
   - Set strong production `BECCI_SECRET_KEY` (at least 32 random bytes; never use the dev default).
   - Rotate initial seeded admin password immediately (`admin` user).
2. **Tighten Production CORS (`app/main.py` / `BECCI_CORS_ORIGINS`):**
   - **Important:** Currently `app/main.py` appends `["*"]` to `allow_origins` with `allow_credentials=True` for local convenience. Before production go-live, restrict `allow_origins` strictly to explicit HTTPS website origins (`https://becci.in`, `https://www.becci.in`, `https://preview.becci.in`).
3. **Database & Scheduled Discovery:**
   - Configure regular SQLite WAL backups (or PostgreSQL migration when scaling multi-worker).
   - Run scheduled discovery via cron / systemd timer invoking `POST /api/admin/scheduler/run-due` or `cli.py`.
4. **Rate Limiting & Reverse Proxy Headers:**
   - Enforce reverse-proxy rate limits on `/api/v1/member/auth/*` and `/api/admin/auth/login`.

### B. Frontend (`beccipublic/frontend` — Static Hostinger / CDN Build)
1. **Build with Production API URL:**
   ```bash
   cd frontend
   REACT_APP_ENV=production \
   REACT_APP_BECCI_API_BASE_URL=https://api.becci.in \
   REACT_APP_BECCI_ADMIN_URL=https://api.becci.in/admin \
   npx craco build
   ```
2. **Verify Production Bundle Before Upload:**
   - Confirm `frontend/build/.htaccess` is included so React Router paths (`/opportunities`, `/opportunities/:id`, `/member/dashboard`, `/member/profile`, `/member/login`, `/admin/opportunities`) resolve cleanly on direct reload.
   - Confirm zero references to `127.0.0.1` or `localhost` inside `frontend/build/static/js/`.
3. **Staging Smoke Test Prior to Production Cutover:**
   - Test `GET https://staging-api.becci.in/api/v1/health` and verify CORS `Access-Control-Allow-Origin` header matches the staging frontend origin.
   - Complete one staging member login, profile save, recommendation load, and logout before switching `becci.in` production build.

---

## 3. Recommended Post-Phase 4 Backend Enhancements (Future Iteration)
- Add password-reset token email flow (`POST /api/v1/member/auth/forgot-password` & `reset-password`).
- Add server-side logout token-version bump (`POST /api/v1/member/auth/logout`).
- Add optional `district` query parameter on `GET /api/v1/opportunities` if district-level public filtering is needed alongside `state`.
