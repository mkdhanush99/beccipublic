import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { isCustomCursorEligible } from "@/components/cursor/cursorUtils";
import {
  playInterfaceClick,
  readSavedSoundPreference,
  resolveInteractiveClickVariant,
  saveSoundPreference,
} from "@/components/cursor/clickSound";

const CursorContext = createContext({
  enabled: false,
  soundEnabled: false,
  toggleSound: () => {},
  overrideRef: { current: null },
  setOverride: () => {},
  clearOverride: () => {},
});

// Singleton module-level guard so only one CustomCursor instance can ever mount.
let activeCursorOwners = 0;

export const CursorProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(() => isCustomCursorEligible());
  // Strictly OFF by default unless the visitor explicitly enabled it previously
  const [soundEnabled, setSoundEnabled] = useState(() => readSavedSoundPreference());
  const soundEnabledRef = useRef(soundEnabled);
  const overrideRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mqPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setEnabled(mqPointer.matches && !mqMotion.matches);
    };

    const onTouchStart = (e) => {
      if (e.pointerType === "touch") {
        setEnabled(false);
      }
    };

    sync();
    mqPointer.addEventListener?.("change", sync);
    mqMotion.addEventListener?.("change", sync);
    window.addEventListener("pointerdown", onTouchStart, { passive: true });

    return () => {
      mqPointer.removeEventListener?.("change", sync);
      mqMotion.removeEventListener?.("change", sync);
      window.removeEventListener("pointerdown", onTouchStart);
    };
  }, []);

  // Single delegated click sound listener — zero duplicate bubbling sounds, zero background clicks
  useEffect(() => {
    const onDocumentClick = (e) => {
      if (!soundEnabledRef.current) return;
      // Skip synthetic toggle clicks (toggleSound handles its own confirmation tap)
      if (e.target?.closest?.("[data-testid='sound-toggle'], [data-testid='mobile-sound-toggle']")) {
        return;
      }
      const variant = resolveInteractiveClickVariant(e.target);
      if (variant) {
        playInterfaceClick(variant);
      }
    };

    document.addEventListener("click", onDocumentClick, { passive: true });
    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  // Reset transient overrides whenever the route changes
  useEffect(() => {
    overrideRef.current = null;
  }, [pathname]);

  const toggleSound = useCallback(() => {
    const next = !soundEnabledRef.current;
    soundEnabledRef.current = next;
    setSoundEnabled(next);
    saveSoundPreference(next);
    // Play one subtle confirmation tap when turning sound ON (outside state updater for StrictMode purity)
    if (next) {
      playInterfaceClick("primary");
    }
  }, []);

  const setOverride = useCallback((next) => {
    overrideRef.current = next;
  }, []);

  const clearOverride = useCallback(() => {
    overrideRef.current = null;
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      soundEnabled,
      toggleSound,
      overrideRef,
      setOverride,
      clearOverride,
    }),
    [enabled, soundEnabled, toggleSound, setOverride, clearOverride]
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
};

export const useCursor = () => useContext(CursorContext);

export function claimCursorSingleton() {
  if (activeCursorOwners > 0) return false;
  activeCursorOwners += 1;
  return true;
}

export function releaseCursorSingleton() {
  activeCursorOwners = Math.max(0, activeCursorOwners - 1);
}

export default CursorContext;
