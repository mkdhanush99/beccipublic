// BECCI design tokens — typed export for React/TypeScript
export const color = {
  "navy": {
    "950": "#030E1E",
    "900": "#061B3A",
    "logo": "#0A2352",
    "800": "#0B2D5C"
  },
  "blue": {
    "700": "#124B8C",
    "600": "#1769C2",
    "500": "#3D8FE8",
    "300": "#7CB4F2",
    "200": "#B8D7FA",
    "50": "#F0F6FD"
  },
  "gold": {
    "500": "#D4AF5A",
    "200": "#F0DDA8",
    "700": "#A77B32"
  },
  "heritage": {
    "midnight": "#071426",
    "ivory": "#F7F0E2",
    "burgundy": "#702E3D"
  },
  "white": "#FFFFFF"
} as const;

export const semantic = {
  "bg.page": "#FFFFFF",
  "bg.subtle": "#F0F6FD",
  "bg.warm": "#F7F0E2",
  "bg.inverse": "#061B3A",
  "bg.inverse-deep": "#030E1E",
  "surface.card": "#FFFFFF",
  "surface.card-inverse": "#0B2D5C",
  "border.default": "#B8D7FA",
  "border.strong": "#124B8C",
  "border.inverse": "#0B2D5C",
  "text.primary": "#061B3A",
  "text.secondary": "#0B2D5C",
  "text.muted": "#124B8C",
  "text.inverse": "#FFFFFF",
  "text.inverse-muted": "#B8D7FA",
  "text.link": "#124B8C",
  "text.link-inverse": "#7CB4F2",
  "text.accent-light": "#A77B32",
  "text.accent-dark": "#D4AF5A",
  "action.primary": "#124B8C",
  "action.primary-hover": "#0B2D5C",
  "action.primary-text": "#FFFFFF",
  "action.inverse": "#D4AF5A",
  "action.inverse-hover": "#F0DDA8",
  "action.inverse-text": "#030E1E",
  "focus.ring": "#3D8FE8",
  "brand.logo": "#0A2352",
  "status.error": "#B3261E",
  "status.success": "#1B7A4B",
  "status.warning": "#A77B32"
} as const;

export const font = {
  "display": "'Bebas Neue', 'Plus Jakarta Sans', Impact, 'Arial Narrow', sans-serif",
  "heading": "'Plus Jakarta Sans', 'Inter', 'Segoe UI', Roboto, Arial, sans-serif",
  "body": "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  "editorial": "'Playfair Display', Georgia, 'Times New Roman', serif",
  "devanagari": "'Noto Sans Devanagari', 'Mukta', sans-serif",
  "mono": "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
} as const;

export const space = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 24,
  "6": 32,
  "7": 48,
  "8": 64,
  "9": 96,
  "10": 128
} as const;

export const radius = {
  "none": 0,
  "xs": 2,
  "sm": 4,
  "md": 6,
  "lg": 10,
  "pill": 999
} as const;

export const breakpoint = {
  "sm": 640,
  "md": 768,
  "lg": 1024,
  "xl": 1280,
  "2xl": 1440
} as const;

export const motion = {
  "duration-instant": "90ms",
  "duration-fast": "150ms",
  "duration-base": "220ms",
  "duration-slow": "360ms",
  "duration-reveal": "600ms",
  "ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
  "ease-enter": "cubic-bezier(0, 0, 0, 1)",
  "ease-exit": "cubic-bezier(0.3, 0, 1, 1)"
} as const;
