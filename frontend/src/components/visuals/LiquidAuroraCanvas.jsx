import React, { useEffect, useRef } from "react";

/**
 * Custom WebGL GLSL Fluid Light Shader Canvas
 * Renders organic, liquid silk-light caustics in BECCI's Deep Navy (#030E1E),
 * Corporate Blue (#124B8C), Electric Blue (#3D8FE8) and subtle Metallic Gold (#D4AF5A).
 * - Zero external dependencies, GPU-accelerated 60fps.
 * - Pointer-reactive light refraction with smooth damping.
 * - Automatically renders a single static frame under `prefers-reduced-motion: reduce`,
 *   with a graceful CSS radial-light fallback if WebGL is unavailable.
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

// Smooth organic wave field (domain-warped fluid light, no geometric noise)
float wave(vec2 p, float t) {
  float v = 0.0;
  v += sin(p.x * 1.4 + t * 0.45 + cos(p.y * 1.2 - t * 0.3));
  v += cos(p.y * 1.7 - t * 0.38 + sin(p.x * 1.5 + t * 0.25));
  v += sin((p.x + p.y) * 1.1 + t * 0.28);
  return v / 3.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);

  // Subtle pointer-reactive light warp
  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  float distM = length(p - m);
  p += normalize(p - m + 0.0001) * exp(-distM * 2.2) * 0.14;

  float t = u_time;
  float w1 = wave(p * 1.25, t);
  float w2 = wave(p * 1.8 + vec2(w1 * 0.6, -w1 * 0.4), t * 0.85);
  float ribbon = smoothstep(-0.35, 0.78, w2);
  float caustic = pow(max(0.0, 1.0 - abs(w1 - w2) * 1.45), 3.2);

  // BECCI colour palette in linear-ish sRGB
  vec3 deepNavy   = vec3(0.012, 0.055, 0.118); // #030E1E
  vec3 primNavy   = vec3(0.024, 0.106, 0.227); // #061B3A
  vec3 corpBlue   = vec3(0.071, 0.294, 0.549); // #124B8C
  vec3 elecBlue   = vec3(0.239, 0.561, 0.910); // #3D8FE8
  vec3 metalGold  = vec3(0.831, 0.686, 0.353); // #D4AF5A

  vec3 col = mix(deepNavy, primNavy, smoothstep(0.0, 1.0, uv.y));
  col = mix(col, corpBlue, ribbon * 0.55);
  col += elecBlue * caustic * 0.26;

  // Restrained metallic-gold specular sheen along the fluid ridge & pointer focus
  float goldSheen = pow(max(0.0, w1 * w2), 2.5) * 0.42 + exp(-distM * 2.8) * 0.16;
  col += metalGold * goldSheen * 0.48;

  // Soft vignette to keep editorial typography effortlessly legible
  float vig = smoothstep(1.35, 0.25, length(p));
  col = mix(deepNavy, col, 0.45 + 0.55 * vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const LiquidAuroraCanvas = ({ className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
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

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mx = 0.65;
    let my = 0.45;
    let tx = 0.65;
    let ty = 0.45;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Render shader at 0.75x DPR for silky 60fps even on high-DPI mobile screens
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
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

    let raf = 0;
    const t0 = performance.now();

    const render = (now) => {
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      const elapsed = reduce ? 2.4 : (now - t0) * 0.001;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reduce) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 65% 40%, rgba(23,105,194,0.35), rgba(6,27,58,0.92) 55%, #030E1E 100%)",
      }}
    />
  );
};

export default LiquidAuroraCanvas;
