/** BECCI — Tailwind CSS theme extension (v3 config; for v4 import tokens.css and map with @theme). */
/** @type {import('tailwindcss').Config} */
module.exports = {
  "theme": {
    "screens": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1440px"
    },
    "extend": {
      "colors": {
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
        "midnight": "#071426",
        "ivory": "#F7F0E2",
        "burgundy": "#702E3D",
        "white": "#FFFFFF"
      },
      "fontFamily": {
        "display": [
          "Bebas Neue",
          "Plus Jakarta Sans",
          "Impact",
          "Arial Narrow",
          "sans-serif"
        ],
        "heading": [
          "Plus Jakarta Sans",
          "Inter",
          "Segoe UI",
          "Roboto",
          "Arial",
          "sans-serif"
        ],
        "body": [
          "Inter",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        "editorial": [
          "Playfair Display",
          "Georgia",
          "Times New Roman",
          "serif"
        ],
        "devanagari": [
          "Noto Sans Devanagari",
          "Mukta",
          "sans-serif"
        ],
        "mono": [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace"
        ]
      },
      "fontSize": {
        "display": [
          "96px",
          {
            "lineHeight": "0.92",
            "letterSpacing": "0.01em",
            "fontWeight": "400"
          }
        ],
        "h1": [
          "48px",
          {
            "lineHeight": "1.12",
            "letterSpacing": "-0.02em",
            "fontWeight": "800"
          }
        ],
        "h2": [
          "36px",
          {
            "lineHeight": "1.18",
            "letterSpacing": "-0.015em",
            "fontWeight": "700"
          }
        ],
        "h3": [
          "24px",
          {
            "lineHeight": "1.3",
            "letterSpacing": "-0.01em",
            "fontWeight": "700"
          }
        ],
        "h4": [
          "18px",
          {
            "lineHeight": "1.4",
            "letterSpacing": "0em",
            "fontWeight": "600"
          }
        ],
        "overline": [
          "12px",
          {
            "lineHeight": "1.4",
            "letterSpacing": "0.14em",
            "fontWeight": "700"
          }
        ],
        "lead": [
          "20px",
          {
            "lineHeight": "1.6",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "body": [
          "16px",
          {
            "lineHeight": "1.65",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "small": [
          "14px",
          {
            "lineHeight": "1.55",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "caption": [
          "12px",
          {
            "lineHeight": "1.5",
            "letterSpacing": "0.01em",
            "fontWeight": "500"
          }
        ],
        "nav": [
          "15px",
          {
            "lineHeight": "1.2",
            "letterSpacing": "0em",
            "fontWeight": "600"
          }
        ],
        "button": [
          "15px",
          {
            "lineHeight": "1",
            "letterSpacing": "0.01em",
            "fontWeight": "700"
          }
        ],
        "quote": [
          "32px",
          {
            "lineHeight": "1.32",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "data-xl": [
          "72px",
          {
            "lineHeight": "0.95",
            "letterSpacing": "0.01em",
            "fontWeight": "400"
          }
        ],
        "data-label": [
          "13px",
          {
            "lineHeight": "1.3",
            "letterSpacing": "0.04em",
            "fontWeight": "600"
          }
        ],
        "display-mobile": [
          "56px",
          {
            "lineHeight": "0.92",
            "letterSpacing": "0.01em",
            "fontWeight": "400"
          }
        ],
        "h1-mobile": [
          "34px",
          {
            "lineHeight": "1.12",
            "letterSpacing": "-0.02em",
            "fontWeight": "800"
          }
        ],
        "h2-mobile": [
          "28px",
          {
            "lineHeight": "1.18",
            "letterSpacing": "-0.015em",
            "fontWeight": "700"
          }
        ],
        "h3-mobile": [
          "21px",
          {
            "lineHeight": "1.3",
            "letterSpacing": "-0.01em",
            "fontWeight": "700"
          }
        ],
        "h4-mobile": [
          "17px",
          {
            "lineHeight": "1.4",
            "letterSpacing": "0em",
            "fontWeight": "600"
          }
        ],
        "lead-mobile": [
          "18px",
          {
            "lineHeight": "1.6",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "nav-mobile": [
          "16px",
          {
            "lineHeight": "1.2",
            "letterSpacing": "0em",
            "fontWeight": "600"
          }
        ],
        "quote-mobile": [
          "24px",
          {
            "lineHeight": "1.32",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "data-xl-mobile": [
          "48px",
          {
            "lineHeight": "0.95",
            "letterSpacing": "0.01em",
            "fontWeight": "400"
          }
        ]
      },
      "spacing": {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "24px",
        "6": "32px",
        "7": "48px",
        "8": "64px",
        "9": "96px",
        "10": "128px"
      },
      "borderRadius": {
        "none": "0px",
        "xs": "2px",
        "sm": "4px",
        "md": "6px",
        "lg": "10px",
        "pill": "999px"
      },
      "maxWidth": {
        "container": "1200px",
        "container-wide": "1320px",
        "reading": "720px"
      },
      "boxShadow": {
        "becci-1": "0 1px 2px rgba(3,14,30,0.06), 0 1px 1px rgba(3,14,30,0.04)",
        "becci-2": "0 4px 12px rgba(3,14,30,0.08), 0 1px 3px rgba(3,14,30,0.06)",
        "becci-3": "0 16px 40px rgba(3,14,30,0.14), 0 4px 12px rgba(3,14,30,0.08)"
      },
      "transitionDuration": {
        "fast": "150ms",
        "base": "220ms",
        "slow": "360ms"
      },
      "transitionTimingFunction": {
        "becci": "cubic-bezier(0.2, 0, 0, 1)",
        "enter": "cubic-bezier(0, 0, 0, 1)",
        "exit": "cubic-bezier(0.3, 0, 1, 1)"
      }
    }
  }
};
