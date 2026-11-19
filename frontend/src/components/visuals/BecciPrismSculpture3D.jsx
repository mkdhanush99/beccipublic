import React, { useEffect, useRef, useState } from "react";
import emblemUrl from "@/assets/brand/emblem/becci-infinity-emblem-dark.svg";

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
uniform float u_mode;  // 0.0 = hero, 1.0 = closing
uniform float u_intro; // 0 -> 1 entrance: the two C's converge into the continuum

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// Open torus arc in XY, symmetric about +Y, half-angle given by sc = (sin, cos)
float sdArc(vec3 p, vec2 sc, float ra, float rb) {
  p.x = abs(p.x);
  float k = (sc.y * p.x > sc.x * p.y) ? dot(p.xy, sc) : length(p.xy);
  return sqrt(dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}

// Octahedron = the keystone diamond seen face-on
float sdOcta(vec3 p, float s) { p = abs(p); return (p.x + p.y + p.z - s) * 0.57735027; }

// Geometry traced from the official emblem SVG (viewBox 360x160):
// arc centres at x = 126 / 234 (±54 from axis), radii 56 / 44 / 32, stroke 7,
// every C open towards the centre with a 34° half-aperture. Units: 56px -> 0.86.
const float S = 0.015357;
vec3 orient(vec3 p) {
  float t = u_time;
  float yaw = sin(t * 0.21) * 0.20 + (u_mouse.x - 0.5) * 0.55 + (1.0 - u_intro) * 0.75 + u_scroll * 0.6;
  float pitch = -0.10 + sin(t * 0.17) * 0.05 + (u_mouse.y - 0.5) * -0.35 + u_scroll * 0.25;
  p.xz *= rot(yaw);
  p.yz *= rot(pitch);
  p.y += sin(t * 0.33) * 0.025;
  return p / 0.70; // fit the 3.4-unit-wide emblem into frame
}

// returns (distance, material): 1 outer navy, 2 middle blue, 3 inner gold, 4 keystone
vec2 scene(vec3 q) {
  vec3 p = orient(q);
  float sep = 54.0 * S + (1.0 - u_intro) * 0.55;
  vec2 sc = vec2(sin(2.5482), cos(2.5482)); // 146° arc half-angle = 180° - 34°
  float rb = 4.1 * S;                        // tube a touch fuller than the 3.5px stroke for light
  vec3 pl = p - vec3(-sep, 0.0, 0.0); pl.xy *= rot(-1.5708);
  vec3 pr = p - vec3( sep, 0.0, 0.0); pr.xy *= rot( 1.5708);
  vec2 r = vec2(1e5, 0.0);
  float rad[3]; rad[0] = 56.0 * S; rad[1] = 44.0 * S; rad[2] = 32.0 * S;
  for (int i = 0; i < 3; i++) {
    float d = min(sdArc(pl, sc, rad[i], rb), sdArc(pr, sc, rad[i], rb));
    if (d < r.x) r = vec2(d, float(i + 1));
  }
  vec3 pk = p; // keystone stays square-on: the emblem's fixed centre
  float k = sdOcta(pk * vec3(1.0, 1.0, 1.9), 7.8 * S * u_intro) / 1.9;
  if (k < r.x) r = vec2(k, 4.0);
  return vec2(r.x * 0.70, r.y);
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0015, -0.0015);
  return normalize(e.xyy * scene(p + e.xyy).x + e.yyx * scene(p + e.yyx).x +
                   e.yxy * scene(p + e.yxy).x + e.xxx * scene(p + e.xxx).x);
}

// Studio environment: rich sapphire navy floor (#041022), royal blue (#13448A), soft azure key (#78B6F5), subtle turquoise accent rim (#00BFAF)
vec3 env(vec3 r) {
  vec3 col = mix(vec3(0.015, 0.062, 0.133), vec3(0.047, 0.165, 0.337), smoothstep(-0.6, 0.8, r.y));
  col += vec3(0.0, 0.75, 0.69) * smoothstep(0.72, 0.99, dot(r, normalize(vec3(0.8, 0.45, 0.4)))) * 0.40; // delicate turquoise rim
  col += vec3(0.72, 0.82, 0.92) * smoothstep(0.80, 0.99, dot(r, normalize(vec3(-0.25, 1.0, 0.35)))) * 1.3; // luminous ice white key
  col += vec3(0.09, 0.41, 0.73) * smoothstep(0.50, 0.95, dot(r, normalize(vec3(-0.9, -0.1, 0.4)))) * 0.90; // sapphire accent
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / max(1.0, min(u_res.x, u_res.y));
  vec3 ro = vec3(0.0, 0.0, 4.6);
  vec3 rd = normalize(vec3(uv, -1.9));

  float t = 0.0, minD = 10.0; vec2 h = vec2(0.0); bool hit = false;
  for (int i = 0; i < 72; i++) {
    h = scene(ro + rd * t);
    minD = min(minD, h.x);
    if (h.x < 0.0012) { hit = true; break; }
    t += h.x * 0.9;
    if (t > 7.0) break;
  }

  // soft sapphire & azure contour — no loud neon glow
  vec3 col = mix(vec3(0.09, 0.41, 0.73), vec3(0.0, 0.75, 0.69), 0.25) * exp(-minD * 22.0) * 0.14;
  float alpha = exp(-minD * 22.0) * 0.20;

  if (hit) {
    vec3 p = ro + rd * t;
    vec3 N = calcNormal(p);
    vec3 V = -rd;
    vec3 R = reflect(rd, N);
    float ndv = max(dot(N, V), 0.0);
    float m = h.y;

    // official emblem colours as metals; navy lifted so it reads on a navy stage
    vec3 base; float rough;
    if (m < 1.5)      { base = vec3(0.24, 0.36, 0.58); rough = 0.32; } // #0A2352 anodised navy
    else if (m < 2.5) { base = vec3(0.09, 0.41, 0.76); rough = 0.22; } // #1769C2 polished blue
    else              { base = vec3(0.83, 0.69, 0.35); rough = 0.18; } // #D4AF5A gold (inner arcs + keystone)

    vec3 F = base + (1.0 - base) * pow(1.0 - ndv, 5.0);          // Schlick, metallic
    vec3 refl = mix(env(R), env(normalize(R + N * rough)), rough);
    // metals tint what they reflect: keep only a trace of the studio's turquoise hue
    // so gold stays gold and blue stays blue
    refl = mix(vec3(dot(refl, vec3(0.3, 0.59, 0.11))) * 1.35, refl, 0.22);
    col = refl * F;
    col += base * 0.10;                                           // ambient floor
    vec3 L = normalize(vec3(0.6, 0.8, 0.9));
    col += mix(vec3(0.7, 1.0, 0.96), base, 0.5) * pow(max(dot(N, normalize(L + V)), 0.0), mix(180.0, 40.0, rough)) * 0.9;
    // cursor-led key light: the highlight follows the pointer across the metal
    vec3 Lm = normalize(vec3((u_mouse.x - 0.5) * 2.4, (u_mouse.y - 0.5) * 2.0, 1.2));
    col += vec3(0.6, 0.95, 0.9) * pow(max(dot(N, normalize(Lm + V)), 0.0), 90.0) * 0.45;
    if (m > 3.5) col += base * 0.25;                              // keystone holds the eye
    col *= u_mode > 0.5 ? 0.92 : 1.0;
    alpha = 1.0;
  }

  col = col / (1.0 + col * 0.35); // gentle tone-map, keeps highlights from clipping to neon
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
      if (process.env.NODE_ENV !== "production") console.warn(gl.getShaderInfoLog(fs));
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
    const uIntro = gl.getUniformLocation(prog, "u_intro");

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
      if (reduce && drawn) requestAnimationFrame(render);
    };
    let drawn = false;

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

    resize();
    let raf = 0;
    const t0 = performance.now();
    const modeVal = mode === "closing" ? 1.0 : 0.0;

    function render(now) {
      if (isVisible) {
        mx += (tx - mx) * 0.05;
        my += (ty - my) * 0.05;
        const elapsed = reduce ? 0 : (now - t0) * 0.001;
        const k = reduce ? 1 : Math.min(1, elapsed / 2.2);
        const intro = 1 - Math.pow(1 - k, 3);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mx, my);
        gl.uniform1f(uScroll, reduce ? 0 : scrollNorm);
        gl.uniform1f(uMode, modeVal);
        gl.uniform1f(uIntro, intro);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        drawn = true;
      }
      if (!reduce) {
        raf = requestAnimationFrame(render);
      }
    }

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
    // No WebGL: the official emblem, flat and exact
    return (
      <div aria-hidden="true" className={`pointer-events-none flex h-full w-full items-center justify-center ${className}`}>
        <img src={emblemUrl} alt="" className="w-[88%] max-w-[520px]" />
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
