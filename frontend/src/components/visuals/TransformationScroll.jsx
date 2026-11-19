import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { JOURNEY } from "@/data/becci";
import Img from "@/components/Img";
import { Eyebrow } from "@/components/primitives";
import { GlassSpotlight } from "@/components/visuals/MotionPrimitives";
import { EASE_OUT } from "@/lib/motion";

const SCENES = [
  {
    ...JOURNEY[0],
    kicker: "01 · Foundation in hand",
    headline: "Skills have always built Bharat.",
    detail:
      "Weaving, craftsmanship, farming, manufacturing, trading and services already exist across communities. The capability is real — the institutional pathway is what turns it into scale.",
    img: "craft",
    alt: "Artisan handloom weaving craft in India",
    caption: "Inherited & learned capability across trades and crafts",
  },
  {
    ...JOURNEY[1],
    kicker: "02 · Formalisation & structure",
    headline: "From individual skill to resilient enterprise.",
    detail:
      "Registration, financial literacy, technology awareness and mentorship transform informal work into a bankable, formal business built to endure.",
    img: "aspiring",
    alt: "Entrepreneur planning and building a formal enterprise",
    caption: "Structure, formalisation and enterprise readiness",
  },
  {
    ...JOURNEY[2],
    kicker: "03 · Employment & stability",
    headline: "Growing businesses strengthen families.",
    detail:
      "Every expanding MSME and manufacturing floor generates dignified employment, stable household income and durable local wealth.",
    img: "manufacturers",
    alt: "Modern Indian textile and manufacturing enterprise",
    caption: "Productive capacity generating jobs and family stability",
  },
  {
    ...JOURNEY[3],
    kicker: "04 · National scale",
    headline: "Widespread enterprise builds a stronger Bharat.",
    detail:
      "When entrepreneurs across eleven industries connect with capital, markets and institutions, local progress becomes national economic strength.",
    img: "about",
    alt: "Business leaders and professionals collaborating in an institutional setting",
    caption: "Connected industry strengthening India's productive base",
  },
];

export const TransformationScroll = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(SCENES.length - 1, Math.floor(latest * SCENES.length));
    if (idx !== activeIndex) setActiveIndex(idx);
  });

  const rawRx = useMotionValue(0);
  const rawRy = useMotionValue(0);
  const rotateX = useSpring(rawRx, { stiffness: 160, damping: 26 });
  const rotateY = useSpring(rawRy, { stiffness: 160, damping: 26 });

  const onStageMove = (e) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRx.set(-py * 5);
    rawRy.set(px * 6);
  };

  const onStageLeave = () => {
    rawRx.set(0);
    rawRy.set(0);
  };

  return (
    <section
      ref={containerRef}
      data-testid="chapter-journey"
      className="on-dark relative bg-[#030E1E] text-white"
    >
      <div className="becci-container py-24 lg:py-32">
        <div className="max-w-3xl">
          <Eyebrow tone="gold">The Transformation</Eyebrow>
          <h2 className="mt-4 font-heading text-h1 font-bold text-white">
            Skill becomes enterprise.
            <br />
            <span className="text-navy-300">Enterprise becomes nation building.</span>
          </h2>
        </div>

        {/* Desktop Sticky Cinema Stage */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          {/* Left: Continuous scroll-linked vertical track + editorial narrative */}
          <div className="relative pl-8">
            <div
              className="absolute bottom-8 left-0 top-4 w-[2px] rounded-full bg-white/10"
              aria-hidden="true"
            >
              {!reduce && (
                <motion.div
                  style={{ scaleY: smoothProgress }}
                  className="h-full w-full origin-top rounded-full bg-gradient-to-b from-navy-400 via-gold to-gold"
                />
              )}
            </div>

            <div className="space-y-16 pb-20 pt-2">
              {SCENES.map((scene, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    key={scene.step}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    className={`group flex min-h-[34vh] w-full flex-col justify-center py-4 text-left transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-35 hover:opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="tabular font-display text-2xl leading-none text-gold">
                        0{i + 1}
                      </span>
                      <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
                        {scene.step}
                      </span>
                    </div>
                    <h3 className="mt-3 font-heading text-2xl font-bold leading-snug text-white xl:text-3xl">
                      {scene.headline}
                    </h3>
                    <p className="mt-3 max-w-lg font-body text-base leading-relaxed text-navy-100/75">
                      {scene.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Sticky 3D-Tilt Cinema Frame with Floating Frosted Glass Overlay */}
          <div className="sticky top-28" style={{ perspective: 1200 }}>
            <motion.div
              onPointerMove={onStageMove}
              onPointerLeave={onStageLeave}
              style={reduce ? undefined : { rotateX, rotateY }}
              className="relative overflow-hidden rounded-3xl bg-navy-900 shadow-lift"
            >
              <div className="relative h-[580px] w-full overflow-hidden">
                {SCENES.map((scene, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <motion.div
                      key={scene.step}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scale: reduce ? 1 : isActive ? 1 : 1.07,
                      }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                      className="absolute inset-0"
                      style={{ pointerEvents: isActive ? "auto" : "none" }}
                    >
                      <Img
                        name={scene.img}
                        sizes="680px"
                        alt={scene.alt}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-navy-950/20" />
                    </motion.div>
                  );
                })}

                {/* Top stage indicators */}
                <div className="absolute left-6 right-6 top-6 z-10 flex items-center gap-2">
                  {SCENES.map((s, i) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Jump to stage ${i + 1}: ${s.step}`}
                      className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                    >
                      <span
                        className={`block h-full transition-colors duration-300 ${
                          i <= activeIndex ? "bg-gold" : "bg-transparent"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Floating Glass Caption Capsule with smooth choreographed swap */}
                <GlassSpotlight tone="dark" className="glass-dark absolute bottom-5 left-5 right-5 z-10 rounded-2xl p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.26, ease: EASE_OUT }}
                      className="relative z-10 flex items-end justify-between gap-4"
                    >
                      <div>
                        <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                          {SCENES[activeIndex].kicker}
                        </p>
                        <p className="mt-1.5 font-display text-3xl uppercase leading-none tracking-wide text-white">
                          {SCENES[activeIndex].step}
                        </p>
                        <p className="mt-2 font-body text-sm text-navy-100/85">
                          {SCENES[activeIndex].caption}
                        </p>
                      </div>
                      <span className="tabular font-display text-4xl leading-none text-white/30">
                        0{activeIndex + 1}/04
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </GlassSpotlight>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile / Tablet Editorial Stack */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
          {SCENES.map((scene, i) => (
            <article
              key={scene.step}
              className="overflow-hidden rounded-2xl bg-navy-900 shadow-lift"
            >
              <div className="relative h-56 overflow-hidden">
                <Img
                  name={scene.img}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  alt={scene.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                <span className="glass-pill tabular absolute left-4 top-4 rounded-full px-3 py-1 font-display text-base text-gold">
                  0{i + 1} · {scene.step}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-white">{scene.headline}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-100/80">{scene.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformationScroll;
