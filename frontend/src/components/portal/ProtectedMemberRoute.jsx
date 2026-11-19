import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useMemberAuth } from "@/context/MemberAuthContext";

/**
 * Route guard for authenticated BECCI member routes (/member/dashboard, /member/profile).
 * Never treats UI hiding as access control — the FastAPI backend independently enforces
 * Bearer token authentication on every /api/v1/member/* endpoint.
 */
export default function ProtectedMemberRoute({ children }) {
  const { isAuthenticated } = useMemberAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/member/login?next=${next}`} replace />;
  }

  return children;
}
