/**
 * BECCI Signature Cursor — Pure target, surface & capability utilities.
 * Zero React dependencies, zero DOM mutations.
 *
 * Supported data attributes (reusable site-wide):
 *   data-cursor="view" | "explore" | "discover" | "open" | "scroll" | "drag" | "button" | "link" | "none"
 *   data-cursor-label="CUSTOM"    — optional short uppercase label override
 *   data-cursor-surface="dark" | "light" | "heritage"
 *   data-cursor-magnet="true"     — subtly biases the outer ring toward element center
 *   data-cursor-hero="true"       — slightly enhanced ring visibility over hero compositions
 */

export const LABEL_PRESETS = {
  view: "VIEW",
  explore: "EXPLORE",
  discover: "DISCOVER",
  open: "OPEN",
  scroll: "SCROLL",
  drag: "DRAG",
};

const NATIVE_SELECTOR = [
  "input",
  "textarea",
  "select",
  "option",
  "iframe",
  "video",
  "audio",
  "[contenteditable='true']",
  "[contenteditable='']",
  "[role='textbox']",
  "[role='searchbox']",
  "[role='combobox']",
  "[role='slider']",
  "[role='spinbutton']",
  "[role='dialog']",
  "[data-cursor='none']",
].join(", ");

const DISABLED_SELECTOR = [
  ":disabled",
  "[disabled]",
  "[aria-disabled='true']",
].join(", ");

const PROSE_SELECTOR = "p, li, td, th, dt, dd, blockquote, pre, figcaption, h1, h2, h3, h4, span";

/**
 * Custom cursor is strictly enabled only for desktop fine-pointer devices
 * without reduced-motion preference.
 */
export function isCustomCursorEligible() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return finePointer && !reducedMotion;
}

/**
 * Determine whether the hovered element sits on a dark, light or heritage surface.
 * Walks from the deepest hovered node upward so a light glass card inside a dark
 * page or a dark button inside a light section resolves accurately.
 */
export function resolveCursorSurface(el) {
  if (!el || typeof el.closest !== "function") return "light";

  // Check explicit surface hint first (including heritage quotation sections)
  const explicit = el.closest("[data-cursor-surface]");
  if (explicit) {
    const val = explicit.getAttribute("data-cursor-surface");
    if (val === "heritage" || val === "dark" || val === "light") return val;
  }

  // Walk DOM ancestors to pick the nearest visual container polarity
  let node = el;
  while (node && node.nodeType === 1) {
    const cls = typeof node.className === "string" ? node.className : "";
    if (cls) {
      // Explicit light surfaces (glass cards, floating light header, white/frost bands)
      if (
        cls.includes("glass-header-light") ||
        cls.includes("glass-light") ||
        /\bbg-white\b/.test(cls) ||
        /\bbg-frost\b/.test(cls) ||
        /\bbg-paper\b/.test(cls)
      ) {
        return "light";
      }
      // Explicit dark surfaces (Obsidian/Midnight sections, dark glass, dark CTAs, footer)
      if (
        /\bon-dark\b/.test(cls) ||
        cls.includes("glass-dark") ||
        cls.includes("glass-iridescent") ||
        /\bbg-navy-950\b/.test(cls) ||
        /\bbg-navy-900\b/.test(cls)
      ) {
        return "dark";
      }
    }
    if (node.tagName === "FOOTER") return "dark";
    node = node.parentElement;
  }

  return "light";
}

/**
 * Resolve the interaction state, optional contextual label, and optional magnetic target
 * for the DOM element currently under the pointer.
 */
export function resolveCursorContext(target, { isDraggingText = false } = {}) {
  const fallback = {
    state: "default",
    label: "",
    surface: "light",
    magnetEl: null,
    heroBoost: false,
  };

  if (!target || target.nodeType !== 1) return fallback;

  const surface = resolveCursorSurface(target);
  const heroBoost = Boolean(target.closest("[data-cursor-hero='true'], [data-testid='home-hero']"));

  // 1. Active text selection or native excluded controls always yield to OS cursor
  if (isDraggingText) {
    return { state: "native", label: "", surface, magnetEl: null, heroBoost: false };
  }

  const nativeEl = target.closest(NATIVE_SELECTOR);
  if (nativeEl) {
    return { state: "native", label: "", surface, magnetEl: null, heroBoost: false };
  }

  // 2. Disabled or unavailable controls must never look interactive
  const disabledEl = target.closest(DISABLED_SELECTOR);
  if (disabledEl) {
    return { state: "disabled", label: "", surface, magnetEl: null, heroBoost };
  }

  // 3. Explicit contextual data-cursor attribute
  // If an interactive button/link sits deeper inside a container bearing data-cursor,
  // let the inner control resolve naturally unless the control itself sets data-cursor.
  const customEl = target.closest("[data-cursor]");
  const innerInteractive = target.closest("a[href], button, [role='button'], [role='tab'], summary");
  const customApplies =
    Boolean(customEl) &&
    (!innerInteractive || innerInteractive === customEl || innerInteractive.contains(customEl));

  if (customApplies && customEl) {
    const mode = (customEl.getAttribute("data-cursor") || "").toLowerCase();
    if (mode === "none") {
      return { state: "native", label: "", surface, magnetEl: null, heroBoost: false };
    }
    const customLabel = customEl.getAttribute("data-cursor-label");
    if (LABEL_PRESETS[mode] || customLabel) {
      return {
        state: "label",
        label: (customLabel || LABEL_PRESETS[mode] || "").toUpperCase(),
        surface,
        magnetEl: customEl.closest("[data-cursor-magnet='true']"),
        heroBoost,
      };
    }
    if (mode === "button" || mode === "link" || mode === "nav") {
      return {
        state: mode,
        label: "",
        surface,
        magnetEl: customEl.closest("[data-cursor-magnet='true']"),
        heroBoost,
      };
    }
  }

  // 4. Magnetic container detection (e.g. primary CTAs wrapped in <Magnetic>)
  const magnetEl = target.closest("[data-cursor-magnet='true']");

  // 5. Navigation controls (Header & Nav links/buttons — crisp precision without obscuring menus)
  const navControl = target.closest("header a, header button, nav a, nav button");
  if (navControl) {
    return { state: "nav", label: "", surface, magnetEl, heroBoost };
  }

  // 6. Primary buttons, tabs & interactive pills
  const buttonEl = target.closest(
    "button, [role='button'], [role='tab'], summary, a.rounded-full"
  );
  if (buttonEl) {
    return { state: "button", label: "", surface, magnetEl, heroBoost };
  }

  // 7. Standard hyperlinks
  const linkEl = target.closest("a[href]");
  if (linkEl) {
    return { state: "link", label: "", surface, magnetEl, heroBoost };
  }

  // 8. Hero composition ambient visibility
  if (heroBoost) {
    return { state: "hero", label: "", surface, magnetEl: null, heroBoost: true };
  }

  return { state: "default", label: "", surface, magnetEl: null, heroBoost: false };
}

/**
 * Helper to detect if a mousedown starts on selectable prose (not inside a button/link).
 */
export function isSelectableProseTarget(target) {
  if (!target || target.nodeType !== 1) return false;
  if (target.closest("a, button, [role='button'], [role='tab'], [data-cursor]")) return false;
  return Boolean(target.closest(PROSE_SELECTOR));
}
