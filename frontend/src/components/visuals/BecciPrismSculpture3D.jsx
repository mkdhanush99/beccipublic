import React, { useEffect, useRef, useState } from "react";

/**
 * BecciPrismSculpture3D — Real-Time Raymarched 3D Optical Glass Continuum Sculpture
 *
 * A custom zero-dependency WebGL GLSL signed-distance-field (SDF) sculpture representing
 * BECCI's open continuum: sculpted interlocking translucent crystal arcs & an infinity
 * ribbon suspended in space, refracting Electric Teal (#00B8A9), Ice Blue (#B8D7FA),
 * controlled Ultraviolet (#795BFF) edge dispersion, and a restrained Champagne Gold (#D4AF5A)
 * key specular glint.
 *
 * Performance & Accessibility:
 * - Zero Three.js bundle bloat (~5KB raw GLSL).
 * - Transparent alpha canvas: composites seamlessly into the dark stage with no box edge.
 * - Pointer-reactive specular orbit (fine pointers only) + scroll-linked 3D rotation.
 * - Mobile DPR capped at 1; IntersectionObserver halts GPU frames when scrolled off-screen.
 * - Renders a crisp static optical frame under `prefers-reduced-motion: reduce`.
 * - Graceful layered CSS glass sculpture fallback when WebGL is unavailable.
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
uniform float u_scroll;
uniform float u_mode; // 0.0 = hero focal sculpture, 1.0 = closing serene sculpture

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

// Smooth minimum for organic blown-glass fusion
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Sculpted C-arc (open torus segment) in XY plane
float sdCappedTorus(vec3 p, vec2 sc, float ra, float rb) {
  p.x = abs(p.x);
  float k = (sc.y * p.x > sc.x * p.y) ? dot(p.xy, sc) : length(p.xy);
  return sqrt(dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}

// BECCI Continuum Glass Sculpture SDF:
// Two sculpted interlocking translucent crystal arcs (facing C continuum) + floating orbital glass ring
float map(vec3 p) {
  // Gentle floating breath + scroll/pointer driven 3D orbit
  float t = u_time * 0.42;
  p.xz *= rot(t * 0.55 + (u_mouse.x - 0.5) * 0.85 + u_scroll * 1.1);
  p.yz *= rot(sin(t * 0.7) * 0.16 + (u_mouse.y - 0.5) * 0.55 - 0.22);

  // Arc aperture ~ 135 degrees (clear iconic C geometry)
  float an = 2.32;
  vec2 sc = vec2(sin(an), cos(an));

  // Left sculpted crystal C-arc (open towards centre)
  vec3 pL = p - vec3(-0.56, 0.0, 0.0);
  pL.xy *= rot(-1.5708); // orient opening towards +X
  pL.xz *= rot(0.24);
  float dLeft = sdCappedTorus(pL, sc, 0.68, 0.155);

  // Right sculpted crystal C-arc (mirrored, facing left arc across an illuminated bridge)
  vec3 pR = p - vec3(0.56, 0.0, 0.0);
  pR.xy *= rot(1.5708); // orient opening towards -X
  pR.xz *= rot(-0.24);
  float dRight = sdCappedTorus(pR, sc, 0.68, 0.155);

  // Sculpted saddle-warped outer continuum glass halo linking both arcs in 3D depth
  vec3 pHalo = p;
  pHalo.yz *= rot(0.68 + sin(t * 0.45) * 0.08);
  pHalo.z += sin(atan(pHalo.y, pHalo.x) * 2.0 + t * 0.6) * 0.16;
  vec2 q = vec2(length(pHalo.xy) - 1.28, pHalo.z);
  float dHalo = length(q) - 0.055;

  // Inner crystalline keystone bridge where the two facing arcs meet
  float dArcs = smin(dLeft, dRight, 0.14);
  float d = smin(dArcs, dHalo, 0.09);

  return d;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0022, -0.0022);
  return normalize(
    e.xyy * map(p + e.xyy) +
    e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) +
    e.xxx * map(p + e.xxx)
  );
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / max(1.0, min(u_res.x, u_res.y));

  vec3 ro = vec3(0.0, 0.0, 4.45);
  vec3 rd = normalize(vec3(uv, -1.72));

  // Subtle ambient refractive halo behind the glass object (strictly bounded, zero hard edge)
  float radial = length(uv);
  vec3 elecTeal    = vec3(0.000, 0.722, 0.663); // #00B8A9
  vec3 tealBright  = vec3(0.150, 0.855, 0.790); // #26D6C7
  vec3 iceBlue     = vec3(0.722, 0.843, 0.980); // #B8D7FA
  vec3 ultraviolet = vec3(0.475, 0.357, 1.000); // #795BFF
  vec3 champGold   = vec3(0.831, 0.686, 0.353); // #D4AF5A
  vec3 deepNavy    = vec3(0.024, 0.106, 0.227); // #061B3A

  float t = 0.0;
  float minD = 10.0;
  bool hit = false;

  for (int i = 0; i < 52; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    minD = min(minD, d);
    if (d < 0.0025) {
      hit = true;
      break;
    }
    t += d * 0.85;
    if (t > 7.5) break;
  }

  // Soft controlled luminous glass aura near the sculpture silhouette
  float aura = exp(-minD * 5.8) * smoothstep(0.68, 0.08, radial);
  vec3 auraCol = mix(elecTeal, ultraviolet, smoothstep(-0.35, 0.45, uv.x - uv.y) * 0.55);
  vec3 col = auraCol * aura * (u_mode > 0.5 ? 0.24 : 0.34);
  float alpha = aura * (u_mode > 0.5 ? 0.32 : 0.44);

  if (hit) {
    vec3 pos = ro + rd * t;
    vec3 N = calcNormal(pos);
    vec3 V = -rd;

    // Three-point optical studio lighting
    vec3 L1 = normalize(vec3(0.75, 0.85, 0.95));   // Teal-Ice key light
    vec3 L2 = normalize(vec3(-0.85, -0.45, 0.65)); // Subtle Ultraviolet rim light
    vec3 L3 = normalize(vec3(0.15, 0.95, 0.25));   // Top Champagne Gold specular highlight

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);
    float diff1 = max(dot(N, L1), 0.0);
    float diff2 = max(dot(N, L2), 0.0);

    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    vec3 H3 = normalize(L3 + V);

    float spec1 = pow(max(dot(N, H1), 0.0), 48.0);
    float spec2 = pow(max(dot(N, H2), 0.0), 26.0);
    float spec3 = pow(max(dot(N, H3), 0.0), 82.0);

    // Simulated chromatic optical glass body + internal thickness sheen
    float thickness = smoothstep(-0.5, 0.85, dot(N, V));
    vec3 glassBody = mix(deepNavy * 1.15, elecTeal * 0.55, 0.35 + 0.45 * diff1);

    // Chromatic Fresnel edge refraction (Teal -> Ice Blue -> restrained Ultraviolet dispersion)
    float dispersion = clamp(N.x * 0.5 + 0.5, 0.0, 1.0);
    vec3 rimCol = mix(tealBright, iceBlue, smoothstep(0.15, 0.65, dispersion));
    rimCol = mix(rimCol, ultraviolet, smoothstep(0.62, 1.0, dispersion) * 0.72);

    vec3 surface = glassBody * (0.55 + 0.45 * thickness);
    surface += rimCol * fresnel * 1.18;
    surface += iceBlue * spec1 * 0.95;
    surface += ultraviolet * diff2 * 0.24 + ultraviolet * spec2 * 0.35;

    // Restrained Champagne Gold heritage reflection on the uppermost crystal crest
    float goldWeight = u_mode > 0.5 ? 0.78 : 0.42;
    surface += champGold * spec3 * goldWeight;

    // Subtle internal glowing vein along the crystal axis
    float coreGlow = pow(1.0 - abs(dot(N, V)), 1.6) * 0.28;
    surface += elecTeal * coreGlow;

    col = surface;
    alpha = clamp(0.76 + fresnel * 0.24, 0.0, 1.0);
  }

  // Smooth circular edge falloff right at the outer margin so the entire sculpture stays razor-sharp
  float edgeFade = smoothstep(0.50, 0.45, radial);
  col *= edgeFade;
  alpha *= edgeFade;

  gl_FragColor = vec4(col, alpha);
}
`;

export const BecciPrismSculpture3D = ({ className = "", mode = "hero", defer = false }) => {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(!defer);
  const [supported, setSupported] = useState(true);

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

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
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
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    const uMode = gl.getUniformLocation(prog, "u_mode");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Keep raymarch ultra-smooth on mobile (DPR <= 0.85) & crisp on desktop (<= 1.25)
      const scale = isMobile ? 0.75 : Math.min(window.devicePixelRatio || 1, 1.5) * 0.85;
      canvas.width = Math.max(1, Math.floor((rect.width || 420) * scale));
      canvas.height = Math.max(1, Math.floor((rect.height || 420) * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    let mx = 0.56, my = 0.46, tx = 0.56, ty = 0.46;
    let scrollNorm = 0;

    const onMove = (e) => {
      if (reduce || !finePointer) return;
      tx = e.clientX / window.innerWidth;
      ty = 1.0 - e.clientY / window.innerHeight;
    };

    const onScroll = () => {
      scrollNorm = Math.min(1.8, window.scrollY / Math.max(1, window.innerHeight));
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
    const modeVal = mode === "closing" ? 1.0 : 0.0;

    const render = (now) => {
      if (isVisible) {
        mx += (tx - mx) * 0.05;
        my += (ty - my) * 0.05;
        const elapsed = reduce ? 1.65 : (now - t0) * 0.001;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mx, my);
        gl.uniform1f(uScroll, reduce ? 0 : scrollNorm);
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
      if (finePointer) window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mode, mounted]);

  if (!mounted) {
    return <div ref={hostRef} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
  }

  if (!supported) {
    // Graceful architectural CSS optical fallback if WebGL is unavailable
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none relative flex items-center justify-center ${className}`}
      >
        <div
          className="h-64 w-64 rounded-full border border-teal/40 shadow-teal-glow sm:h-80 sm:w-80"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(0,184,169,0.28), rgba(184,215,250,0.14) 45%, rgba(121,91,255,0.12) 72%, transparent 80%)",
          }}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid={`prism-sculpture-${mode}`}
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
};

export default BecciPrismSculpture3D;
