import React, { useEffect, useRef, useState } from "react";

/**
 * EnterpriseField3D — Custom WebGL 3D Volumetric Infinity-Current Field
 *
 * Renders a living 3D spatial field of luminous filaments and rising sparks
 * flowing along a three-dimensional lemniscate (infinity) current — visually
 * echoing BECCI's facing-C continuum where individual skills coalesce into
 * connected enterprise.
 *
 * Performance & Accessibility:
 * - Zero external 3D library bloat (~4KB raw WebGL).
 * - Mobile DPR capped at 1; desktop capped at 1.5.
 * - IntersectionObserver pauses the GPU render loop whenever off-screen.
 * - Pointer-reactive camera parallax on fine pointers only; never blocks scroll.
 * - Scroll-linked camera depth glide via passive scroll listener.
 * - Static single frame under `prefers-reduced-motion: reduce`.
 * - Graceful no-op fallback if WebGL is unavailable (sits over LiquidAuroraCanvas).
 */

const VERT = `
attribute vec3 a_seed;
attribute float a_size;
attribute float a_hue;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;
uniform float u_dpr;
uniform vec2 u_res;

varying float v_alpha;
varying float v_hue;

void main() {
  // Parametric 3D lemniscate (infinity loop) current + organic drift
  float phase = a_seed.x * 6.2831853 + u_time * (0.14 + a_seed.y * 0.12);
  float denom = 1.0 + sin(phase) * sin(phase);

  // Horizontal figure-eight current in 3D space
  float lx = (2.15 * cos(phase)) / denom;
  float ly = (0.95 * sin(phase) * cos(phase)) / denom;
  float lz = sin(phase * 2.0 + a_seed.z * 6.2831) * 0.65;

  // Organic radial spread around the current filament
  float spread = (0.16 + a_seed.z * 0.42);
  float angle = a_seed.y * 6.2831853 + u_time * 0.25;
  vec3 pos = vec3(
    lx + cos(angle) * spread + 0.38,
    ly + sin(angle) * spread * 0.72 + sin(u_time * 0.35 + a_seed.x * 12.0) * 0.08,
    lz + sin(angle * 0.7) * spread
  );

  // Subtle 3D camera orbit from pointer + scroll depth
  float rotY = (u_mouse.x - 0.5) * 0.42 + u_scroll * 0.35;
  float rotX = (u_mouse.y - 0.5) * 0.24 - u_scroll * 0.18;

  float cy = cos(rotY), sy = sin(rotY);
  float cx = cos(rotX), sx = sin(rotX);

  // Rotate around Y
  vec3 p1 = vec3(pos.x * cy - pos.z * sy, pos.y, pos.x * sy + pos.z * cy);
  // Rotate around X
  vec3 p2 = vec3(p1.x, p1.y * cx - p1.z * sx, p1.y * sx + p1.z * cx);

  // Perspective projection
  float zCam = 3.65 - u_scroll * 0.65;
  float depth = max(0.6, zCam - p2.z);
  float aspect = u_res.x / max(1.0, u_res.y);

  vec2 projected = vec2(p2.x / (depth * aspect * 0.58), p2.y / (depth * 0.58));
  gl_Position = vec4(projected, 0.0, 1.0);

  // Depth-attenuated point size and luminosity
  float sizeScale = clamp(2.8 / depth, 0.45, 2.4);
  gl_PointSize = a_size * sizeScale * u_dpr;

  float twinkle = 0.65 + 0.35 * sin(u_time * (1.2 + a_seed.y * 1.6) + a_seed.x * 24.0);
  v_alpha = clamp((1.0 - (depth - 2.2) * 0.28) * twinkle * 0.72, 0.08, 0.85);
  v_hue = a_hue;
}
`;

const FRAG = `
precision mediump float;
varying float v_alpha;
varying float v_hue;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;

  // Soft volumetric bokeh glow
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.2);

  // BECCI Optical Particle Palette: Electric Teal + Ice Blue + controlled Ultraviolet prism + sparse Gold glints
  vec3 elecTeal    = vec3(0.000, 0.780, 0.720); // #00C7B8
  vec3 iceBlue     = vec3(0.722, 0.843, 0.980); // #B8D7FA
  vec3 ultraviolet = vec3(0.560, 0.440, 1.000); // #8F70FF
  vec3 champGold   = vec3(0.860, 0.720, 0.400); // #DBB866

  vec3 col = mix(elecTeal, iceBlue, smoothstep(0.32, 0.76, v_hue));
  col = mix(col, ultraviolet, smoothstep(0.76, 0.90, v_hue));
  col = mix(col, champGold, smoothstep(0.92, 0.99, v_hue));

  gl_FragColor = vec4(col, glow * v_alpha);
}
`;

export const EnterpriseField3D = ({ className = "", density = "hero" }) => {
  const canvasRef = useRef(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });

    if (!gl) {
      setSupported(false);
      return undefined;
    }

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

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    const count = isMobile
      ? density === "hero" ? 140 : 90
      : density === "hero" ? 360 : 210;

    // Deterministic pseudo-random particle field along the 3D lemniscate
    const seeds = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const hues = new Float32Array(count);
    let s = 4219;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      seeds[i * 3] = i / count + (rand() - 0.5) * 0.04;
      seeds[i * 3 + 1] = rand();
      seeds[i * 3 + 2] = rand();
      sizes[i] = 2.6 + Math.pow(rand(), 2.2) * 8.5;
      hues[i] = rand();
    }

    const bindAttr = (data, name, size) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return buf;
    };

    bindAttr(seeds, "a_seed", 3);
    bindAttr(sizes, "a_size", 1);
    bindAttr(hues, "a_hue", 1);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    const uDpr = gl.getUniformLocation(prog, "u_dpr");
    const uRes = gl.getUniformLocation(prog, "u_res");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor((rect.width || window.innerWidth) * dpr));
      canvas.height = Math.max(1, Math.floor((rect.height || window.innerHeight) * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
    let scrollNorm = 0;

    const onMove = (e) => {
      if (reduce || !finePointer) return;
      tx = e.clientX / window.innerWidth;
      ty = 1.0 - e.clientY / window.innerHeight;
    };

    const onScroll = () => {
      const h = Math.max(1, window.innerHeight);
      scrollNorm = Math.min(1.2, window.scrollY / h);
    };

    window.addEventListener("resize", resize, { passive: true });
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

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
        mx += (tx - mx) * 0.045;
        my += (ty - my) * 0.045;
        const elapsed = reduce ? 3.2 : (now - t0) * 0.001;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mx, my);
        gl.uniform1f(uScroll, reduce ? 0 : scrollNorm);
        gl.uniform1f(uDpr, dpr);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.drawArrays(gl.POINTS, 0, count);
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
      if (finePointer) window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [density]);

  if (!supported) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
};

export default EnterpriseField3D;
