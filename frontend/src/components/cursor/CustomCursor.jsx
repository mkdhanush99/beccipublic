import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  claimCursorSingleton,
  releaseCursorSingleton,
  useCursor,
} from "@/components/cursor/CursorContext";
import {
  isSelectableProseTarget,
  resolveCursorContext,
} from "@/components/cursor/cursorUtils";

/**
 * CustomCursor — BECCI Signature Architectural Arrow Pointer.
 *
 * Replaces any circular cursor design with a crisp, recognizable custom arrow pointer:
 * - Precision arrow silhouette anchored cleanly at the (0, 0) pointer tip
 * - BECCI Navy (#030E1E / #061B3A / #124B8C) & Electric Blue (#1769C2 / #3D8FE8) facet detailing
 * - Automatic contrast adaptation across Light, Dark & Heritage sections
 * - Subtle adjacent contextual micro-tag (VIEW / EXPLORE / DISCOVER / OPEN) without replacing the arrow
 * - Crisp tactile compression on click — zero circular rings, trails or explosions
 * - Zero React re-renders on pointermove; automatic rAF idle sleep
 * - Strictly desktop fine-pointer only; disabled on touch devices & prefers-reduced-motion
 */
export const CustomCursor = () => {
  const { enabled, overrideRef } = useCursor();
  const { pathname } = useLocation();

  const rootRef = useRef(null);
  const pointerRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("becci-cursor-active", "becci-cursor-native");
      return undefined;
    }

    if (!claimCursorSingleton()) {
      return undefined;
    }

    const html = document.documentElement;
    const root = rootRef.current;
    const pointer = pointerRef.current;
    const labelEl = labelRef.current;

    if (!root || !pointer || !labelEl) {
      releaseCursorSingleton();
      return undefined;
    }

    const state = {
      visible: false,
      pressed: false,
      pressDownX: 0,
      pressDownY: 0,
      prosePressCandidate: false,
      selectingText: false,
      keyboardMode: false,
      mx: -120,
      my: -120,
      px: -120,
      py: -120,
      mode: "default",
      surface: "light",
      label: "",
      heroBoost: false,
      rafId: 0,
      running: false,
    };

    const syncDomAttributes = () => {
      const effectiveMode = state.keyboardMode || state.selectingText ? "native" : state.mode;
      const showCustom = state.visible && effectiveMode !== "native";

      root.dataset.visible = showCustom ? "true" : "false";
      root.dataset.state = effectiveMode;
      root.dataset.surface = state.surface;
      root.dataset.pressed = state.pressed ? "true" : "false";
      root.dataset.hero = state.heroBoost ? "true" : "false";
      root.dataset.hasLabel = effectiveMode === "label" && state.label ? "true" : "false";

      if (labelEl.textContent !== state.label) {
        labelEl.textContent = state.label;
      }

      if (showCustom) {
        html.classList.add("becci-cursor-active");
        html.classList.remove("becci-cursor-native");
      } else {
        html.classList.add("becci-cursor-native");
      }
    };

    const evaluateTarget = (el) => {
      const override = overrideRef.current;
      const resolved = resolveCursorContext(el, { isDraggingText: state.selectingText });

      if (override && resolved.state !== "native") {
        state.mode = override.state || resolved.state;
        state.label = override.label ?? resolved.label;
        state.surface = override.surface || resolved.surface;
        state.heroBoost = resolved.heroBoost;
      } else {
        state.mode = resolved.state;
        state.label = resolved.label;
        state.surface = resolved.surface;
        state.heroBoost = resolved.heroBoost;
      }

      syncDomAttributes();
    };

    // High-responsiveness positioning (near-instantaneous tip accuracy with micro-smoothing)
    const tick = () => {
      state.rafId = 0;

      const dx = state.mx - state.px;
      const dy = state.my - state.py;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.35) {
        // Ultra-responsive easing keeps pointer crisp & accurate with zero sluggishness
        state.px += dx * 0.72;
        state.py += dy * 0.72;
        pointer.style.transform = `translate3d(${state.px.toFixed(2)}px, ${state.py.toFixed(2)}px, 0)`;
        state.rafId = window.requestAnimationFrame(tick);
      } else {
        state.px = state.mx;
        state.py = state.my;
        pointer.style.transform = `translate3d(${state.px.toFixed(2)}px, ${state.py.toFixed(2)}px, 0)`;
        state.running = false;
      }
    };

    const wake = () => {
      if (!state.running) {
        state.running = true;
        state.rafId = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;

      const firstAppear = !state.visible || state.keyboardMode;
      state.mx = e.clientX;
      state.my = e.clientY;
      state.keyboardMode = false;

      if (firstAppear) {
        state.px = e.clientX;
        state.py = e.clientY;
        pointer.style.transform = `translate3d(${state.px.toFixed(2)}px, ${state.py.toFixed(2)}px, 0)`;
        state.visible = true;
      }

      // Promote prose press to native text selection only once pointer actually drags >= 4px
      if (state.pressed && state.prosePressCandidate && !state.selectingText) {
        if (Math.hypot(e.clientX - state.pressDownX, e.clientY - state.pressDownY) >= 4) {
          state.selectingText = true;
        }
      }

      if (state.pressed && state.selectingText) {
        syncDomAttributes();
        wake();
        return;
      }

      evaluateTarget(e.target);
      wake();
    };

    const onPointerDown = (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      state.pressed = true;
      state.pressDownX = e.clientX;
      state.pressDownY = e.clientY;
      state.prosePressCandidate = isSelectableProseTarget(e.target);
      evaluateTarget(e.target);
      wake();
    };

    const onPointerUp = (e) => {
      state.pressed = false;
      state.prosePressCandidate = false;
      const sel = window.getSelection?.();
      state.selectingText = Boolean(sel && !sel.isCollapsed && sel.toString().trim().length > 0);
      evaluateTarget(e.target);
      wake();
    };

    const onSelectionChange = () => {
      const sel = window.getSelection?.();
      const hasSel = Boolean(sel && !sel.isCollapsed && sel.toString().trim().length > 0);
      if (hasSel !== state.selectingText) {
        state.selectingText = hasSel;
        syncDomAttributes();
      }
    };

    const onMouseLeaveDocument = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        state.visible = false;
        state.pressed = false;
        state.prosePressCandidate = false;
        syncDomAttributes();
      }
    };

    const onWindowBlur = () => {
      state.visible = false;
      state.pressed = false;
      state.prosePressCandidate = false;
      syncDomAttributes();
    };

    const onKeyDown = (e) => {
      if (e.key === "Tab") {
        state.keyboardMode = true;
        syncDomAttributes();
      }
    };

    let scrollTicking = false;
    const onScroll = () => {
      if (!state.visible || scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        scrollTicking = false;
        const elUnder = document.elementFromPoint(state.mx, state.my);
        if (elUnder) {
          evaluateTarget(elUnder);
        }
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseout", onMouseLeaveDocument, { passive: true });
    document.addEventListener("selectionchange", onSelectionChange, { passive: true });
    window.addEventListener("blur", onWindowBlur, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (state.rafId) window.cancelAnimationFrame(state.rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseout", onMouseLeaveDocument);
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      html.classList.remove("becci-cursor-active", "becci-cursor-native");
      releaseCursorSingleton();
    };
  }, [enabled, overrideRef]);

  // Reset transient hover/label states cleanly on route navigation
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.state = "default";
    root.dataset.pressed = "false";
    root.dataset.hasLabel = "false";
    if (labelRef.current) labelRef.current.textContent = "";
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      data-testid="becci-custom-cursor"
      data-visible="false"
      data-state="default"
      data-surface="light"
      data-pressed="false"
      data-hero="false"
      data-has-label="false"
      aria-hidden="true"
      className="becci-pointer-layer"
    >
      <div ref={pointerRef} className="becci-pointer-anchor">
        {/* BECCI 3D Extruded Sculpted Pointer (Icons8 WIEV1ogIsiGT style adapted to BECCI Navy, Electric Blue & Teal palette) */}
        <svg
          width="28"
          height="38"
          viewBox="0 0 26 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="becci-pointer-svg"
        >
          <defs>
            {/* 3D Front Face Sculpted Diagonal Gradient */}
            <linearGradient id="becci-ptr-face-grad" x1="3.5" y1="1.5" x2="19.5" y2="33.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--ptr-face-1)" />
              <stop offset="52%" stopColor="var(--ptr-face-2)" />
              <stop offset="100%" stopColor="var(--ptr-face-3)" />
            </linearGradient>

            {/* 3D Left Light-Catching Extruded Bevel Wall Gradient */}
            <linearGradient id="becci-ptr-bevel-grad" x1="1.6" y1="1.5" x2="4.2" y2="27.5" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--ptr-bevel-1)" />
              <stop offset="100%" stopColor="var(--ptr-bevel-2)" />
            </linearGradient>

            {/* 3D Underside Shadow Extrusion Wall Gradient */}
            <linearGradient id="becci-ptr-depth-grad" x1="2.0" y1="18.5" x2="19.5" y2="35.2" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--ptr-depth-1)" />
              <stop offset="100%" stopColor="var(--ptr-depth-2)" />
            </linearGradient>
          </defs>

          {/* LAYER 1: 3D Deep Underside Extrusion Body (Shadowed thickness under wings, notch & stem) */}
          <path
            className="becci-pointer-depth"
            d="M3.4 1.8 C2.4 2.2 1.7 3.1 1.7 4.3 L1.7 26.6 C1.7 27.9 2.9 28.6 4.0 27.9 L9.4 24.2 L13.6 34.4 C14.0 35.3 15.0 35.6 15.9 35.2 L18.7 33.9 C19.6 33.5 20.0 32.5 19.6 31.6 L15.7 21.8 L21.0 21.1 C22.3 20.9 22.8 19.4 21.9 18.4 L5.2 2.0 C4.6 1.5 3.9 1.5 3.4 1.8 Z"
            fill="url(#becci-ptr-depth-grad)"
            stroke="var(--ptr-outline)"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />

          {/* LAYER 2A: 3D Left Light-Catching Extruded Side Wall (Arrowhead Left Bevel) */}
          <path
            className="becci-pointer-bevel"
            d="M4.3 1.6 C3.0 1.7 1.8 2.8 1.8 4.2 L1.8 26.3 C1.8 27.2 2.5 27.7 3.3 27.2 L4.2 26.2 C3.8 25.8 3.6 25.2 3.6 24.5 L3.9 3.0 C3.9 2.3 4.1 1.9 4.3 1.6 Z"
            fill="url(#becci-ptr-bevel-grad)"
          />

          {/* LAYER 2B: 3D Left Light-Catching Extruded Side Wall (Angled Stem Left Bevel) */}
          <path
            className="becci-pointer-bevel"
            d="M9.3 23.0 L13.5 34.1 C13.8 34.8 14.5 35.0 15.1 34.7 L14.3 33.3 L10.3 22.3 L9.3 23.0 Z"
            fill="url(#becci-ptr-bevel-grad)"
          />

          {/* LAYER 3: Sculpted Rounded 3D Front Face (Arrowhead + Angled Stem) */}
          <path
            className="becci-pointer-body"
            d="M3.7 3.0 C3.7 1.7 5.1 1.1 6.0 2.0 L21.4 17.5 C22.3 18.4 21.8 19.8 20.5 20.0 L15.1 20.6 L19.3 31.3 C19.6 32.1 19.2 33.0 18.4 33.4 L15.7 34.5 C14.9 34.8 14.0 34.4 13.7 33.6 L9.9 22.5 L4.9 25.9 C3.9 26.6 2.8 25.9 2.9 24.7 L3.7 3.0 Z"
            fill="url(#becci-ptr-face-grad)"
          />

          {/* LAYER 4: Specular 3D Bevel Ridge Catch-Light */}
          <path
            className="becci-pointer-ridge"
            d="M3.8 2.6 L3.1 24.8 M5.4 2.1 L21.1 17.9 M10.2 22.6 L14.1 33.6"
            stroke="var(--ptr-ridge)"
            strokeWidth="0.65"
            strokeLinecap="round"
            opacity="0.78"
          />

          {/* LAYER 5: Signature Mineral / Starlight Micro-Specks (Exact Icons8 WIEV1ogIsiGT texture pattern) */}
          <g className="becci-pointer-specks">
            <circle cx="4.1" cy="2.1" r="0.34" fill="var(--ptr-speck-1)" />
            <circle cx="5.9" cy="4.4" r="0.28" fill="var(--ptr-speck-2)" />
            <circle cx="4.2" cy="9.8" r="0.32" fill="var(--ptr-speck-1)" />
            <circle cx="8.6" cy="9.4" r="0.26" fill="var(--ptr-speck-2)" />
            <circle cx="14.2" cy="11.2" r="0.34" fill="var(--ptr-speck-1)" />
            <circle cx="10.4" cy="13.6" r="0.38" fill="var(--ptr-speck-1)" />
            <circle cx="4.1" cy="14.1" r="0.35" fill="var(--ptr-speck-2)" />
            <circle cx="12.1" cy="14.8" r="0.34" fill="var(--ptr-speck-1)" />
            <circle cx="7.6" cy="17.2" r="0.28" fill="var(--ptr-speck-2)" />
            <circle cx="17.7" cy="18.7" r="0.38" fill="var(--ptr-speck-1)" />
            <circle cx="18.2" cy="19.2" r="0.28" fill="var(--ptr-speck-2)" />
            <circle cx="7.7" cy="20.6" r="0.36" fill="var(--ptr-speck-1)" />
            <circle cx="11.1" cy="21.4" r="0.34" fill="var(--ptr-speck-2)" />
            <circle cx="3.1" cy="24.5" r="0.48" fill="var(--ptr-speck-1)" />
            <circle cx="15.1" cy="23.3" r="0.34" fill="var(--ptr-speck-1)" />
            <circle cx="14.7" cy="26.8" r="0.34" fill="var(--ptr-speck-2)" />
            <circle cx="16.2" cy="27.6" r="0.38" fill="var(--ptr-speck-1)" />
            <circle cx="13.6" cy="31.2" r="0.34" fill="var(--ptr-speck-1)" />
            <circle cx="17.4" cy="31.8" r="0.3" fill="var(--ptr-speck-2)" />
          </g>
        </svg>

        {/* Discreet rectangular contextual micro-tag beside the arrow tail (never replaces the arrow) */}
        <span ref={labelRef} className="becci-pointer-tag" />
      </div>
    </div>
  );
};

export default CustomCursor;
