import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  MEMBER_SESSION_EXPIRED_EVENT,
  clearMemberSession,
  fetchMemberProfile,
  loginMember as apiLoginMember,
  readMemberSession,
  registerMember as apiRegisterMember,
  writeMemberSession,
} from "@/lib/opportunityApi";

const MemberAuthContext = createContext(null);

export function MemberAuthProvider({ children }) {
  const [session, setSession] = useState(() => readMemberSession());
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [sessionNotice, setSessionNotice] = useState("");

  const refreshProfile = useCallback(async () => {
    const active = readMemberSession();
    if (!active?.access_token) {
      setProfile(null);
      setProfileChecked(true);
      return null;
    }
    setProfileLoading(true);
    try {
      const data = await fetchMemberProfile();
      setProfile(data);
      setProfileChecked(true);
      return data;
    } catch (err) {
      if (err?.status === 404) {
        setProfile(null);
        setProfileChecked(true);
        return null;
      }
      if (err?.status === 401) {
        setSession(null);
        setProfile(null);
        setProfileChecked(true);
        return null;
      }
      setProfileChecked(true);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.access_token) {
      refreshProfile();
    } else {
      setProfile(null);
      setProfileChecked(true);
    }
  }, [session?.access_token, refreshProfile]);

  useEffect(() => {
    const onExpired = (e) => {
      clearMemberSession();
      setSession(null);
      setProfile(null);
      setProfileChecked(true);
      setSessionNotice(
        typeof e?.detail === "string" && e.detail
          ? `Your session expired (${e.detail}). Please sign in again.`
          : "Your member session has expired. Please sign in again."
      );
    };
    window.addEventListener(MEMBER_SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(MEMBER_SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await apiLoginMember({ email, password });
    writeMemberSession(res);
    setSessionNotice("");
    setSession(res);
    setProfileChecked(false);
    let loadedProfile = null;
    try {
      loadedProfile = await fetchMemberProfile();
      setProfile(loadedProfile);
    } catch (err) {
      if (err?.status === 404) {
        setProfile(null);
      }
    } finally {
      setProfileChecked(true);
    }
    return { member: res, profile: loadedProfile };
  }, []);

  const register = useCallback(async ({ email, password, display_name }) => {
    const res = await apiRegisterMember({ email, password, display_name });
    writeMemberSession(res);
    setSessionNotice("");
    setSession(res);
    setProfile(null);
    setProfileChecked(true);
    return { member: res, profile: null };
  }, []);

  const logout = useCallback(() => {
    clearMemberSession();
    setSession(null);
    setProfile(null);
    setProfileChecked(true);
    setSessionNotice("");
  }, []);

  const clearSessionNotice = useCallback(() => setSessionNotice(""), []);

  const value = useMemo(
    () => ({
      member: session
        ? {
            member_id: session.member_id,
            email: session.email,
            display_name: session.display_name,
          }
        : null,
      isAuthenticated: Boolean(session?.access_token),
      profile,
      profileLoading,
      profileChecked,
      sessionNotice,
      clearSessionNotice,
      login,
      register,
      logout,
      refreshProfile,
      setProfile,
    }),
    [
      session,
      profile,
      profileLoading,
      profileChecked,
      sessionNotice,
      clearSessionNotice,
      login,
      register,
      logout,
      refreshProfile,
    ]
  );

  return <MemberAuthContext.Provider value={value}>{children}</MemberAuthContext.Provider>;
}

export function useMemberAuth() {
  const ctx = useContext(MemberAuthContext);
  if (!ctx) {
    throw new Error("useMemberAuth must be used inside MemberAuthProvider");
  }
  return ctx;
}
