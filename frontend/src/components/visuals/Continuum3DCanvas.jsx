import React, { useEffect, useRef } from "react";

/**
 * Living 3D Continuum Network Canvas
 * Renders a real-time 3D perspective projection of two facing open orbital ribbons
 * (BECCI's Continuum C-Ɔ geometry) and interconnected enterprise nodes in deep navy space.
 * - Zero heavy 3D bundle bloat (~3 KB, runs at 60fps on desktop & mobile).
 * - Responds subtly to pointer movement with damped 3D camera parallax.
 * - Honors `prefers-reduced-motion`: renders a single static high-resolution frame and stops.
 */
export const Continuum3DCanvas = ({ className = "", density = "hero" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isHero = density === "hero";
    const NODE_COUNT = isHero ? 84 : 44;

    // Generate 3D points distributed along two facing open C-ribbons (Continuum geometry)
    // Left C centered at x = -1.15, Right C centered at x = +1.15
    const points = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const ring = i % 3; // 3 concentric ribbon bands (outer blue, mid electric, inner gold)
      const radius = 0.72 + ring * 0.24;
      // Open C-arc: leave an intentional 64-degree opening facing the center
      const t = ((i / NODE_COUNT) * Math.PI * 1.62) + (side === -1 ? Math.PI * 0.19 : -Math.PI * 0.81);
      const cx = side * 1.12;
      const x = cx + Math.cos(t) * radius;
      const y = Math.sin(t) * radius * 0.92;
      const z = Math.sin(t * 2 + ring) * 0.48 + (ring - 1) * 0.16;

      points.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: (i * 0.6180339887) % (Math.PI * 2),
        speed: 0.25 + (i % 5) * 0.08,
        gold: ring === 0 && i % 4 === 0,
        size: ring === 0 ? 2.4 : 1.7,
        side,
        ring,
      });
    }

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let targetRotX = 0.18;
    let targetRotY = -0.22;
    let rotX = targetRotX;
    let rotY = targetRotY;

    const onPointerMove = (e) => {
      if (reduceMotion) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = -0.22 + nx * 0.32;
      targetRotX = 0.18 + ny * 0.22;
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId = 0;
    let startTime = performance.now();

    const draw = (now) => {
      const elapsed = (now - startTime) * 0.001;
      // Smooth spring-like damping toward pointer angle + gentle orbital drift
      const driftY = reduceMotion ? 0 : Math.sin(elapsed * 0.22) * 0.18;
      const driftX = reduceMotion ? 0 : Math.cos(elapsed * 0.18) * 0.08;
      rotY += (targetRotY + driftY - rotY) * 0.04;
      rotX += (targetRotX + driftX - rotX) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Atmospheric deep radial glow behind the 3D continuum
      const centerX = isHero ? width * 0.64 : width * 0.5;
      const centerY = isHero ? height * 0.48 : height * 0.5;
      const scale = Math.min(width, height) * (isHero ? 0.34 : 0.28);

      const bgGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, scale * 2.1);
      bgGlow.addColorStop(0, "rgba(23, 105, 194, 0.22)");
      bgGlow.addColorStop(0.45, "rgba(18, 75, 140, 0.09)");
      bgGlow.addColorStop(1, "rgba(3, 14, 30, 0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Subtle central metallic-gold keystone glow
      const goldGlow = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, scale * 0.72);
      goldGlow.addColorStop(0, "rgba(212, 175, 90, 0.18)");
      goldGlow.addColorStop(1, "rgba(212, 175, 90, 0)");
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, width, height);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const fov = 4.6;

      // Project 3D coordinates into 2D screen space
      const projected = points.map((p) => {
        const wave = reduceMotion ? 0 : Math.sin(elapsed * p.speed + p.phase) * 0.05;
        const px = p.baseX;
        const py = p.baseY + wave;
        const pz = p.baseZ + wave * 0.8;

        // Rotate Y
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        // Rotate X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const perspective = fov / (fov + z2 + 1.8);
        return {
          sx: centerX + x1 * scale * perspective,
          sy: centerY + y2 * scale * perspective,
          z: z2,
          scale: perspective,
          gold: p.gold,
          size: p.size * perspective,
          side: p.side,
          ring: p.ring,
        };
      });

      // Draw luminous connection threads between neighbouring 3D nodes
      ctx.lineWidth = 0.85;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const dist = Math.hypot(dx, dy);
          const maxDist = scale * 0.52;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.34 * Math.min(a.scale, b.scale);
            const isGoldLink = a.gold || b.gold;
            ctx.strokeStyle = isGoldLink
              ? `rgba(212, 175, 90, ${alpha.toFixed(3)})`
              : `rgba(124, 180, 242, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // Depth-sort and draw nodes
      projected.sort((a, b) => b.z - a.z);
      for (let i = 0; i < projected.length; i++) {
        const n = projected[i];
        const alpha = Math.max(0.25, Math.min(0.95, 0.35 + n.scale * 0.65));
        ctx.fillStyle = n.gold
          ? `rgba(212, 175, 90, ${alpha.toFixed(3)})`
          : `rgba(124, 180, 242, ${(alpha * 0.85).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, Math.max(1.1, n.size), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
};

export default Continuum3DCanvas;
