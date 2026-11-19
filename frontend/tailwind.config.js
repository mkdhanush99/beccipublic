/** @type {import('tailwindcss').Config} */
// Colours, fonts and motion come from CSS variables in src/styles/tokens.css.
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  blocklist: ["overline"],
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        serif: ["var(--font-serif)"],
      },
      fontSize: {
        hero: ["var(--fs-hero)", { lineHeight: "0.88" }],
        display: ["var(--fs-display)", { lineHeight: "0.92" }],
        h1: ["var(--fs-h1)", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
        h2: ["var(--fs-h2)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        h3: ["var(--fs-h3)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        statement: ["var(--fs-statement)", { lineHeight: "1.18", letterSpacing: "-0.02em" }],
        lead: ["var(--fs-lead)", { lineHeight: "1.6" }],
      },
      colors: {
        navy: {
          950: rgb("--c-navy-950"),
          900: rgb("--c-navy-900"),
          800: rgb("--c-navy-800"),
          700: rgb("--c-navy-700"),
          600: rgb("--c-navy-600"),
          500: rgb("--c-navy-500"),
          400: rgb("--c-navy-400"),
          300: rgb("--c-navy-300"),
          100: rgb("--c-navy-100"),
          50: rgb("--c-navy-50"),
        },
        brand: rgb("--c-brand"),
        teal: {
          DEFAULT: rgb("--c-teal"),
          bright: rgb("--c-teal-bright"),
          deep: rgb("--c-teal-deep"),
          ink: rgb("--c-teal-ink"),
          mist: rgb("--c-teal-mist"),
        },
        ice: rgb("--c-ice"),
        frost: {
          DEFAULT: rgb("--c-frost"),
          deep: rgb("--c-frost-deep"),
        },
        uv: {
          DEFAULT: rgb("--c-uv"),
          soft: rgb("--c-uv-soft"),
          deep: rgb("--c-uv-deep"),
        },
        gold: {
          DEFAULT: rgb("--c-gold"),
          champagne: rgb("--c-gold-champagne"),
          antique: rgb("--c-gold-antique"),
        },
        ivory: rgb("--c-ivory"),
        paper: rgb("--c-paper"),
        burgundy: rgb("--c-burgundy"),
        midnight: rgb("--c-midnight"),
        // shadcn tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      spacing: {
        header: "var(--header-h)",
        section: "var(--space-section)",
        "section-sm": "var(--space-section-sm)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
        "glass-dark": "var(--shadow-glass-dark)",
        "teal-glow": "var(--shadow-teal-glow)",
      },
      maxWidth: { content: "var(--container)" },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out-soft": "var(--ease-in-out)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "scroll-cue": {
          "0%": { transform: "translateY(-100%)" },
          "60%, 100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 90s linear infinite",
        "scroll-cue": "scroll-cue 2.4s var(--ease-in-out) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
