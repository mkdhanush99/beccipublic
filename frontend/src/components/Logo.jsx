import React from "react";
import { Link } from "react-router-dom";
import logoNavy from "@/assets/becci-logo-navy.svg";
import logoWhite from "@/assets/becci-logo-white.svg";
import symbolNavy from "@/assets/becci-symbol.svg";
import symbolWhite from "@/assets/becci-symbol-white.png";

// Official BECCI logo — never recolour, distort or rotate. Only swap navy/white for contrast.
export const Logo = ({ variant = "navy", className = "h-8", withLink = true, testid = "becci-logo" }) => {
  const src = variant === "white" ? logoWhite : logoNavy;
  const img = (
    <img
      src={src}
      alt="BECCI — Bahujan Entrepreneurs Chamber for Commerce & Industry"
      className={className}
      draggable={false}
    />
  );
  if (!withLink) return img;
  return (
    <Link to="/" data-testid={testid} aria-label="BECCI home" className="inline-flex items-center">
      {img}
    </Link>
  );
};

export const Symbol = ({ variant = "navy", className = "h-6" }) => (
  <img
    src={variant === "white" ? symbolWhite : symbolNavy}
    alt=""
    aria-hidden="true"
    className={className}
    draggable={false}
  />
);

export default Logo;
