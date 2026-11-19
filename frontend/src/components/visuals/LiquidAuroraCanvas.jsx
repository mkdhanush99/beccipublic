import React, { useEffect, useRef, useState } from "react";

/**
 * Custom WebGL GLSL Fluid Light Shader Canvas — Scene-Responsive Chromatic Edition
 *
 * Variants (`variant` prop) ensure every chapter has its own calibrated optical mood
 * rather than repeating one identical gradient:
 * - "hero"    : Obsidian & Midnight Navy + Electric Teal silk current + Ice Blue caustics + restrained Ultraviolet refraction
 * - "page"    : Calm Midnight Navy + Ice Blue horizon mist + controlled Electric Teal luminance
 * - "closing" : Deep Obsidian + Electric Teal + subtle Ultraviolet prism + restrained Champagne Gold heritage filament
 *
 * Performance & Accessibility:
 * - Zero external dependencies, GPU-accelerated 60fps.
 * - Mobile DPR capped at 0.7; pauses via IntersectionObserver when scrolled off-screen.
 * - Renders a single static frame under `prefers-reduced-motion: reduce`.
 * - Graceful scene-matched CSS radial fallback when WebGL is unavailable.
 */

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mode; // 0.0 = hero, 1.0 = page, 2.0 = closing

float wave(vec2 p, float t) {
  float v = 0.0;
  v += sin(p.x * 1.35 + t * 0.42 + cos(p.y * 1.15 - t * 0.28));
  v += cos(p.y * 1.65 - t * 0.35 + sin(p.x * 1.45 + t * 0.22));
  v += sin((p.x + p.y) * 1.05 + t * 0.26);
  return v / 3.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (uv - 0.5) * vec2(u_res.x / max(1.0, u_res.y), 1.0);

  // Subtle pointer-reactive light refraction
  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / max(1.0, u_res.y), 1.0);
  float distM = length(p - m);
  p += normalize(p - m + 0.0001) * exp(-distM * 2.2) * 0.13;

  float t = u_time;
  float w1 = wave(p * 1.22, t);
  float w2 = wave(p * 1.75 + vec2(w1 * 0.58, -w1 * 0.42), t * 0.82);
  float ribbon = smoothstep(-0.32, 0.78, w2);
  float caustic = pow(max(0.0, 1.0 - abs(w1 - w2) * 1.5), 3.4);
  float prismMask = smoothstep(-0.2, 0.85, sin(p.x * 1.4 - p.y * 1.1 + t * 0.18));

  // BECCI Vibrant Institutional Palette (Deep Navy + Sapphire & Royal Blue + subtle Turquoise accent)
  vec3 deepNavy      = vec3(0.015, 0.062, 0.133); // #041022
  vec3 primaryNavy   = vec3(0.027, 0.110, 0.227); // #071C3A
  vec3 sapphireDepth = vec3(0.047, 0.165, 0.337); // #0C2A56
  vec3 royalBlue     = vec3(0.075, 0.267, 0.541); // #13448A
  vec3 sapphireVivid = vec3(0.094, 0.412, 0.729); // #1869BA
  vec3 iceBlue       = vec3(0.725, 0.816, 0.918); // #B9D0EA
  vec3 turqAccent    = vec3(0.000, 0.749, 0.686); // #00BFAF
  vec3 champGold     = vec3(0.831, 0.686, 0.353); // #D4AF5A

  // Layered, luminous navy-to-sapphire horizon (vibrant yet disciplined)
  vec3 col = mix(deepNavy, primaryNavy, smoothstep(0.0, 1.0, uv.y * 0.85 + ribbon * 0.20));
  col = mix(col, sapphireDepth, ribbon * 0.40);
  col += royalBlue * ribbon * 0.26;

  if (u_mode < 0.5) {
    // HERO: Luminous sapphire atmosphere + soft azure light + very restrained turquoise highlight
    col += sapphireVivid * (caustic * 0.24 + exp(-distM * 2.8) * 0.14);
    col += iceBlue * caustic * 0.10;
    col += turqAccent * caustic * 0.06; // delicate, small interaction highlight only
  } else if (u_mode < 1.5) {
    // INNER PAGE HERO: Calm Sapphire-Navy
    col += sapphireVivid * ribbon * 0.18;
    col += iceBlue * caustic * 0.08;
  } else {
    // CLOSING: Deep Navy & Sapphire with Gold
    col += sapphireVivid * ribbon * 0.20;
    float goldFilament = pow(max(0.0, w1 * w2), 2.8) * 0.30;
    col += champGold * goldFilament * 0.25;
  }

  // Natural architectural vignette so typography stays effortlessly legible
  float vig = smoothstep(1.38, 0.22, length(p));
  col = mix(obsidian, col, 0.42 + 0.58 * vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

const FALLBACKS = {
  hero: "radial-gradient(ellipse 68% 60% at 76% 32%, rgba(24,105,186,0.28), transparent 64%), radial-gradient(ellipse 52% 48% at 20% 78%, rgba(19,68,138,0.30), transparent 60%), radial-gradient(ellipse 80% 75% at 50% 45%, #071C3A 0%, #041022 85%)",
  page: "radial-gradient(ellipse 75% 65% at 74% 30%, rgba(24,105,186,0.22), transparent 62%), radial-gradient(ellipse 60% 55% at 28% 72%, rgba(19,68,138,0.25), transparent 62%), linear-gradient(160deg, #071C3A 0%, #041022 85%)",
  closing: "radial-gradient(ellipse 65% 58% at 72% 35%, rgba(24,105,186,0.24), transparent 64%), radial-gradient(ellipse 52% 48% at 24% 68%, rgba(19,68,138,0.25), transparent 60%), radial-gradient(ellipse 40% 35% at 52% 45%, rgba(212,175,90,0.08), transparent 65%), #041022",
};

const MODE_NUM = { hero: 0.0, page: 1.0, closing: 2.0 };

export const LiquidAuroraCanvas = ({ className = "", variant = "hero", defer = false }) => {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(!defer);

  useEffect(() => {
    if (!defer || mounted) return undefined;
    const node = hostRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "450px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [defer, mounted]);

  useEffect(() => {
    if (!mounted) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return undefined;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMode = gl.getUniformLocation(prog, "u_mode");
    const modeVal = MODE_NUM[variant] ?? 0.0;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mx = 0.65;
    let my = 0.45;
    let tx = 0.65;
    let ty = 0.45;

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = isMobile ? 0.7 : Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
      canvas.width = Math.max(1, Math.floor((rect.width || window.innerWidth) * scale));
      canvas.height = Math.max(1, Math.floor((rect.height || window.innerHeight) * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onMove = (e) => {
      if (reduce) return;
      tx = e.clientX / window.innerWidth;
      ty = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    let raf = 0;
    const t0 = performance.now();

    const render = (now) => {
      if (isVisible) {
        mx += (tx - mx) * 0.04;
        my += (ty - my) * 0.04;
        const elapsed = reduce ? 2.4 : (now - t0) * 0.001;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mx, my);
        gl.uniform1f(uMode, modeVal);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (!reduce) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [variant, mounted]);

  if (!mounted) {
    return (
      <div
        ref={hostRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
        style={{ background: FALLBACKS[variant] || FALLBACKS.hero }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ background: FALLBACKS[variant] || FALLBACKS.hero }}
    />
  );
};

export default LiquidAuroraCanvas;
