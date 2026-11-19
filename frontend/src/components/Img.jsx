import React from "react";

// Locally optimised photography (public/images/<name>-<width>.webp).
// Widths available per image; keep in sync with the files in public/images.
const WIDTHS = {
  hero: [720, 1200, 2000],
  craft: [800, 1400],
  artisan: [800, 1400],
  farmer: [600, 1000],
  about: [900, 1600],
  aspiring: [600, 1000],
  msme: [600, 1000],
  manufacturers: [600, 1000],
  professionals: [600, 1000],
  students: [600, 1000],
  women: [600, 1000],
};

// Intrinsic aspect ratios (w/h) used to reserve space and prevent layout shift.
const RATIO = {
  hero: 1.5, craft: 1.5, artisan: 1.78, farmer: 0.667, about: 1.5,
  aspiring: 1.5, msme: 0.667, manufacturers: 1.5, professionals: 0.667, students: 1.5, women: 1.5,
};

export const imgSrc = (name, w) => `/images/${name}-${w ?? WIDTHS[name][WIDTHS[name].length - 1]}.webp`;

export const Img = ({ name, alt, sizes = "100vw", className = "", priority = false, ...rest }) => {
  const widths = WIDTHS[name];
  if (!widths) return null;
  const largest = widths[widths.length - 1];
  return (
    <img
      src={imgSrc(name, largest)}
      srcSet={widths.map((w) => `${imgSrc(name, w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={largest}
      height={Math.round(largest / RATIO[name])}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      draggable={false}
      {...rest}
    />
  );
};

export default Img;
