import React from "react";
import { Link } from "react-router-dom";
import logoPrimaryNavy from "@/assets/brand/logo/becci-logo-primary-navy.svg";
import logoPrimaryWhite from "@/assets/brand/logo/becci-logo-primary-white.svg";
import lockupHorizNavy from "@/assets/brand/logo/becci-lockup-horizontal-navy.svg";
import lockupHorizWhite from "@/assets/brand/logo/becci-lockup-horizontal-white.svg";
import symbolNavy from "@/assets/brand/logo/becci-symbol-navy.svg";
import symbolWhite from "@/assets/brand/logo/becci-symbol-white.svg";
import sealNavy from "@/assets/brand/seal/becci-institutional-seal.svg";
import sealLine from "@/assets/brand/seal/becci-institutional-seal-line.svg";

// Official BECCI Brand Kit v1.0 (Option A — one colour).
// Never redraw, distort, rotate or recolour the C's. Only swap approved navy/white variants for contrast.

export const Logo = ({
  variant = "navy",
  lockup = false,
  className = "h-8 w-auto",
  withLink = true,
  testid = "becci-logo",
}) => {
  const src = lockup
    ? variant === "white"
      ? lockupHorizWhite
      : lockupHorizNavy
    : variant === "white"
      ? logoPrimaryWhite
      : logoPrimaryNavy;

  const img = (
    <img
      src={src}
      alt="BECCI — Bahujan Entrepreneurs Chamber for Commerce & Industry"
      width={lockup ? "760" : "427"}
      height={lockup ? "110" : "105"}
      className={`max-w-none ${className}`}
      draggable={false}
    />
  );
  if (!withLink) return img;
  return (
    <Link to="/" data-testid={testid} aria-label="BECCI home" className="inline-flex min-h-[40px] shrink-0 items-center">
      {img}
    </Link>
  );
};

export const Symbol = ({ variant = "navy", className = "h-6 w-auto" }) => (
  <img
    src={variant === "white" ? symbolWhite : symbolNavy}
    alt=""
    aria-hidden="true"
    width="207"
    height="105"
    className={`max-w-none ${className}`}
    draggable={false}
  />
);

export const InstitutionalSeal = ({ variant = "navy", className = "h-24 w-24" }) => (
  <img
    src={variant === "line" ? sealLine : sealNavy}
    alt="BECCI Institutional Seal — Est. 2026"
    width="240"
    height="240"
    className={`max-w-none ${className}`}
    draggable={false}
  />
);

export default Logo;
