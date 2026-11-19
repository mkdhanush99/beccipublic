import React, { useEffect, useRef, useState } from "react";

/**
 * PulseUniverseCanvas — Real-Time WebGL GLSL 3D Raymarched Spatial Glass Exhibition
 *
 * Renders layered translucent architectural crystal terraces, sculpted continuum rings,
 * and refracted light shafts in true 3D perspective.
 * Smoothly interpolates camera angle, depth perspective, and optical colour refraction
 * as the visitor moves across BECCI's 5 verified territories (0..4):
 *   0: Knowledge & Clarity     (Ice Blue + Electric Teal)
 *   1: Finance & Capital       (Deep Electric Teal + Luminous Cyan)
 *   2: Markets & 11 Sectors    (Teal Horizon + Bright Ice Blue)
 *   3: National Reach & Wings  (Ice Blue + Controlled Ultraviolet Prism)
 *   4: Public Programmes       (Electric Teal + Restrained Champagne Gold Crest)
 *
 * Performance & Accessibility:
 * - Zero external 3D library payload (~6KB raw GLSL, lazy-loaded with /pulse route).
 * - Mobile DPR capped for smooth 30–60fps; IntersectionObserver pauses GPU loop off-screen.
 * - Pointer-responsive spatial parallax on fine pointers only; never blocks scrolling.
 * - Renders a single crisp architectural frame under `prefers-reduced-motion: reduce`.
 * - Graceful layered CSS glass horizon fallback when WebGL is unavailable.
 */

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_territory; // smoothly interpolated 0.0 -> 4.0

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// 3D Architectural Glass Pavilion SDF:
// Stratified translucent glass terraces + twin sculpted orbital rings + central crystal column
float map(vec3 p) {
  float t = u_time * 0.28;
  float ang = u_territory * 0.52 + t * 0.35 + (u_mouse.x - 0.5) * 0.55;

  // Gentle camera-space world orbit
  p.xz *= rot(ang);
  p.yz *= rot(0.24 + (u_mouse.y - 0.5) * 0.25);

  // 1. Stratified translucent architectural terraces (3 floating stepped glass plates)
  vec3 p1 = p - vec3(0.0, -0.78 + sin(t + 0.0) * 0.05, 0.0);
  float plate1 = sdBox(p1, vec3(1.65, 0.045, 1.05), 0.05);

  vec3 p2 = p - vec3(0.18, -0.18 + sin(t + 1.4) * 0.06, -0.12);
  p2.xz *= rot(0.35);
  float plate2 = sdBox(p2, vec3(1.22, 0.04, 0.86), 0.045);

  vec3 p3 = p - vec3(-0.16, 0.44 + sin(t + 2.8) * 0.06, 0.14);
  p3.xz *= rot(-0.32);
  float plate3 = sdBox(p3, vec3(0.92, 0.038, 0.68), 0.04);

  // 2. Sculpted outer optical continuum ring tilted across the pavilion
  vec3 pr1 = p - vec3(0.0, 0.05, 0.0);
  pr1.xy *= rot(0.58 + sin(t * 0.5) * 0.08);
  pr1.yz *= rot(0.42);
  float ring1 = sdTorus(pr1, vec2(1.48, 0.055));

  // 3. Counter-tilted inner precision ring (echoing interconnected enterprise flows)
  vec3 pr2 = p - vec3(0.0, 0.05, 0.0);
  pr2.xy *= rot(-0.62 - cos(t * 0.45) * 0.08);
  pr2.xz *= rot(0.75 + u_territory * 0.25);
  float ring2 = sdTorus(pr2, vec2(1.06, 0.045));

  // 4. Central vertical luminous glass core spire linking all layers
  vec3 pc = p;
  float core = length(pc.xz) - (0.14 + 0.03 * sin(pc.y * 4.0 - t * 2.2));
  core = max(core, abs(pc.y) - 0.92);

  float plates = smin(plate1, smin(plate2, plate3, 0.12), 0.12);
  float rings = smin(ring1, ring2, 0.10);
  float d = smin(plates, rings, 0.09);
  d = smin(d, core, 0.14);

  return d;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0025, -0.0025);
  return normalize(
    e.xyy * map(p + e.xyy) +
    e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) +
    e.xxx * map(p + e.xxx)
  );
}

// Calibrated BECCI territory refraction palette (Navy grounded, controlled accents)
vec3 territoryAccent(float idx) {
  vec3 c0 = vec3(0.09, 0.41, 0.67); // 0: Knowledge (Blue Accent #1769AA)
  vec3 c1 = vec3(0.00, 0.75, 0.69); // 1: Finance (Turquoise Accent #00BFAF)
  vec3 c2 = vec3(0.09, 0.45, 0.70); // 2: Markets (Corporate Blue)
  vec3 c3 = vec3(0.00, 0.75, 0.69); // 3: Reach & Wings (Turquoise Accent)
  vec3 c4 = vec3(0.83, 0.69, 0.35); // 4: Schemes (Champagne Gold)

  vec3 a = mix(c0, c1, clamp(idx, 0.0, 1.0));
  a = mix(a, c2, clamp(idx - 1.0, 0.0, 1.0));
  a = mix(a, c3, clamp(idx - 2.0, 0.0, 1.0));
  a = mix(a, c4, clamp(idx - 3.0, 0.0, 1.0));
  return a;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / max(1.0, u_res.y);

  // Offset framing slightly right on wide viewports so left editorial copy has serene space
  float wideShift = smoothstep(1.1, 1.6, u_res.x / max(1.0, u_res.y)) * 0.34;
  vec2 puv = uv - vec2(wideShift, 0.02);

  vec3 ro = vec3(0.0, 0.18, 4.85);
  vec3 rd = normalize(vec3(puv, -1.78));

  // BECCI 75-80% Navy ground palette
  vec3 deepNavy     = vec3(0.012, 0.055, 0.118); // #030E1E deep background
  vec3 primaryNavy  = vec3(0.024, 0.102, 0.208); // #061A35 primary navy
  vec3 secondaryNavy= vec3(0.043, 0.145, 0.278); // #0B2547 secondary navy
  vec3 blueAccent   = vec3(0.090, 0.412, 0.667); // #1769AA blue accent
  vec3 turqAccent   = vec3(0.000, 0.749, 0.686); // #00BFAF turquoise accent
  vec3 mutedText    = vec3(0.663, 0.737, 0.824); // #A9BCD2
  vec3 accent       = territoryAccent(u_territory);

  // Atmospheric studio background with dominant navy depth and subtle blue accent
  float gradY = smoothstep(-0.6, 0.7, uv.y);
  vec3 bg = mix(deepNavy, primaryNavy, gradY * 0.82);
  float horizonGlow = exp(-length(puv) * 2.3);
  bg += blueAccent * horizonGlow * 0.18;
  bg += turqAccent * horizonGlow * 0.05; // very restrained accent

  // Raymarch the 3D crystal pavilion
  float t = 0.0;
  float minD = 10.0;
  bool hit = false;

  for (int i = 0; i < 48; i++) {
    vec3 pos = ro + rd * t;
    float d = map(pos);
    minD = min(minD, d);
    if (d < 0.003) {
      hit = true;
      break;
    }
    t += d * 0.88;
    if (t > 9.0) break;
  }

  vec3 col = bg;
  // Soft volumetric navy & blue aura
  float aura = exp(-minD * 5.6);
  col += mix(blueAccent, accent, 0.35) * aura * 0.14;

  if (hit) {
    vec3 pos = ro + rd * t;
    vec3 N = calcNormal(pos);
    vec3 V = -rd;

    vec3 L1 = normalize(vec3(0.7, 0.9, 0.85));
    vec3 L2 = normalize(vec3(-0.8, -0.3, 0.6));

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float diff1 = max(dot(N, L1), 0.0);
    float diff2 = max(dot(N, L2), 0.0);

    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    float spec1 = pow(max(dot(N, H1), 0.0), 46.0);
    float spec2 = pow(max(dot(N, H2), 0.0), 24.0);

    // Deep architectural navy glass shading with crisp blue edges
    vec3 glassBase = mix(primaryNavy * 1.05, secondaryNavy, 0.40 + 0.50 * diff1);
    vec3 rimCol = mix(blueAccent, mutedText, smoothstep(-0.3, 0.7, N.y));
    rimCol = mix(rimCol, accent, 0.28);

    vec3 surface = glassBase;
    surface += rimCol * fresnel * 0.85;
    surface += iceBlue * spec1 * 0.88;
    surface += accent * diff2 * 0.26 + accent * spec2 * 0.40;
    surface += ultraviolet * pow(max(0.0, -N.x), 2.0) * fresnel * 0.28;

    // Subtle spatial depth fog blending distant edges cleanly into Obsidian
    float fog = smoothstep(8.2, 3.4, t);
    col = mix(bg, surface, 0.28 + 0.72 * fog);
  }

  // Edge vignette preserving crisp typographic legibility on left & base
  float vig = smoothstep(1.35, 0.22, length(uv));
  col = mix(obsidian, col, 0.48 + 0.52 * vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const PulseUniverseCanvas = ({ activeIndex = 0, className = "" }) => {
  const canvasRef = useRef(null);
  const targetIndexRef = useRef(activeIndex);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    targetIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setSupported(false);
      return undefined;
    }
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
    const uTerritory = gl.getUniformLocation(prog, "u_territory");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = isMobile ? 0.65 : Math.min(window.devicePixelRatio || 1, 1.5) * 0.78;
      canvas.width = Math.max(1, Math.floor((rect.width || window.innerWidth) * scale));
      canvas.height = Math.max(1, Math.floor((rect.height || window.innerHeight) * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    let mx = 0.56, my = 0.48, tx = 0.56, ty = 0.48;
    let currentTerr = targetIndexRef.current;

    const onMove = (e) => {
      if (reduce || !finePointer) return;
      tx = e.clientX / window.innerWidth;
      ty = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("resize", resize, { passive: true });
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });

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

    const drawFrame = (now) => {
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      const targetT = targetIndexRef.current;
      currentTerr = reduce ? targetT : currentTerr + (targetT - currentTerr) * 0.075;
      const elapsed = reduce ? 2.1 : (now - t0) * 0.001;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uTerritory, currentTerr);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const render = (now) => {
      if (isVisible) drawFrame(now);
      if (!reduce) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);

    // If reduced-motion is enabled, re-render a single crisp static frame whenever territory switches
    let poll = 0;
    if (reduce) {
      poll = window.setInterval(() => {
        if (Math.abs(currentTerr - targetIndexRef.current) > 0.001) {
          drawFrame(performance.now());
        }
      }, 150);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (poll) window.clearInterval(poll);
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (finePointer) window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (!supported) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(ellipse 65% 58% at 72% 40%, rgba(0,184,169,0.22), transparent 60%), radial-gradient(ellipse 52% 45% at 25% 75%, rgba(121,91,255,0.14), transparent 60%), #030E1E",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="pulse-universe-canvas"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
};

export default PulseUniverseCanvas;
