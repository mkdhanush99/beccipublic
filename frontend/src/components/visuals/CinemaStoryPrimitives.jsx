import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * CinemaAperture — Scroll-controlled photographic film-frame reveal.
 * Smoothly opens the frame inset & settles zoom from 1.09 -> 1.0 as it enters the viewport.
 * Degrades immediately to a crisp static frame under `prefers-reduced-motion: reduce`.
 */
export const CinemaAperture = ({ children, className = "" }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 42%"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(8% 3% 8% 3% round 24px)", "inset(0% 0% 0% 0% round 24px)"]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.07, 1]);

  if (reduce) {
    return <div className={`overflow-hidden rounded-3xl ${className}`}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ clipPath }} className="overflow-hidden rounded-3xl will-change-[clip-path]">
        <motion.div style={{ scale }} className="h-full w-full will-change-transform">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * WordToken — Individual word whose opacity scrubs smoothly with scroll progress.
 */
const WordToken = ({ word, progress, range, highlight }) => {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`mr-[0.26em] inline-block ${highlight ? "text-teal-bright" : ""}`}
    >
      {word}
    </motion.span>
  );
};

/**
 * ScrollIlluminateStatement — Editorial statement whose words progressively illuminate
 * as the visitor scrolls through the narrative transition.
 */
export const ScrollIlluminateStatement = ({
  text,
  highlightWords = [],
  className = "",
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 52%"],
  });

  const words = text.split(" ");
  const highlights = new Set(highlightWords.map((w) => w.toLowerCase()));

  if (reduce) {
    return (
      <p className={className}>
        {words.map((w, i) => {
          const clean = w.toLowerCase().replace(/[^a-z]/g, "");
          return (
            <span key={i} className={highlights.has(clean) ? "text-teal-bright" : ""}>
              {w}{" "}
            </span>
          );
        })}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.35 / words.length);
        const clean = word.toLowerCase().replace(/[^a-z]/g, "");
        return (
          <WordToken
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            highlight={highlights.has(clean)}
          />
        );
      })}
    </p>
  );
};

/**
 * ChapterCompass — Whisper-quiet floating chapter orientation rail on wide desktop screens.
 * Provides narrative continuity across the Homepage chapters without cluttering mobile/tablet.
 */
export const ChapterCompass = ({ chapters = [] }) => {
  const [activeId, setActiveId] = useState(chapters[0]?.id || "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const els = chapters
      .map((c) => document.querySelector(`[data-testid="${c.id}"]`))
      .filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (inView) {
          const id = inView.target.getAttribute("data-testid");
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.05, 0.25, 0.5] }
    );

    els.forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [chapters]);

  const jump = (id) => {
    const target = document.querySelector(`[data-testid="${id}"]`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!chapters.length) return null;

  return (
    <nav
      aria-label="Homepage chapters"
      data-testid="chapter-compass"
      className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 transition-opacity duration-500 2xl:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {chapters.map((c, idx) => {
        const on = activeId === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => jump(c.id)}
            aria-current={on ? "location" : undefined}
            className="group flex items-center gap-2.5 rounded-full py-1 pl-3 pr-1.5 transition-colors"
          >
            <span
              className={`rounded-full px-2.5 py-0.5 font-heading text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-all duration-200 ${
                on
                  ? "glass-dark text-teal-bright opacity-100"
                  : "glass-dark text-ice/80 opacity-0 group-hover:opacity-100"
              }`}
            >
              0{idx + 1} · {c.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                on
                  ? "h-2.5 w-2.5 bg-teal shadow-[0_0_12px_rgba(0,184,169,0.8)]"
                  : "h-1.5 w-1.5 bg-navy-600/50 ring-1 ring-ice/40 group-hover:bg-teal"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
