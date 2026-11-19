// Motion tokens shared by framer-motion components. Mirrors src/styles/tokens.css.
export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

export const DUR = {
  fast: 0.18,
  base: 0.32,
  slow: 0.7,
  cinematic: 1.1,
};

// Standard in-view config: animate once, slightly before the element is fully visible.
export const VIEWPORT = { once: true, margin: "-80px" };
