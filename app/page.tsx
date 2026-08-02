"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import CyclingVerb from "@/components/cycling-verb";

const sections = [
  {
    href: "/work",
    label: "work",
    description: "client work, software, tattoos, drawings... what else?",
  },
  {
    href: "/experience",
    label: "experience",
    description: "where i've been, what i've done",
  },
  {
    href: "/musings",
    label: "musings",
    description: "thoughts maybe worth jotting down",
  },
];

// Soft, organic decelerate for the fuzzy → focused reveal.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Home() {
  const reduceMotion = useReducedMotion();

  // Line illumination: the toile lines themselves light up warm where the
  // pointer passes, as if a lamp behind the cloth were following your hand.
  // The glow is keyed to the ink — we colour only the actual lines, never the
  // paper between them — so there's no lit disc and no spotlight. Nothing
  // accumulates and nothing is carved away; the lines simply brighten near the
  // cursor and settle back as it leaves.
  //
  // Three masks multiply to decide what's lit: the ink itself, a wide cluster
  // of offset lobes (so the reach is broad and its perimeter ragged rather
  // than circular), and a page-anchored noise field that lets some patches
  // come up bright while neighbours stay dim. Because the noise belongs to the
  // page and not the cursor, moving across it uncovers different texture each
  // time instead of dragging one stencil around.
  const mainRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduceMotion) return; // leave the calm static watermark untouched
    const main = mainRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!main || !canvas || !ctx) return;

    // Offscreen buffer where we build the lit lines each frame.
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d");
    // Reach mask (lobes, rebuilt per frame) and the static noise field.
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    const noise = document.createElement("canvas");
    const nctx = noise.getContext("2d");
    if (!bctx || !mctx || !nctx) return;

    const img = new Image();
    let imgReady = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    // cover-fit draw rect so the lit lines register exactly over the watermark
    // (matches Tailwind's bg-center bg-cover on the layers below).
    let dw = 0;
    let dh = 0;
    let dx = 0;
    let dy = 0;

    const computeCover = () => {
      if (!img.naturalWidth) return;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      dw = img.naturalWidth * scale;
      dh = img.naturalHeight * scale;
      dx = (w - dw) / 2;
      dy = (h - dh) / 2;
    };

    // Smooth interpolant — keeps the value-noise blobs rounded instead of
    // showing the seams of the lattice they're sampled from.
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const smoothstep = (a: number, b: number, x: number) =>
      smooth(Math.min(1, Math.max(0, (x - a) / (b - a))));

    type Lattice = { g: Float32Array; cols: number; rows: number };
    const lattice = (cell: number): Lattice => {
      const cols = Math.ceil(w / cell) + 2;
      const rows = Math.ceil(h / cell) + 2;
      const g = new Float32Array(cols * rows);
      for (let i = 0; i < g.length; i++) g[i] = Math.random();
      return { g, cols, rows };
    };
    const sample = ({ g, cols, rows }: Lattice, u: number, v: number) => {
      const x = u * (cols - 1);
      const y = v * (rows - 1);
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const x1 = Math.min(x0 + 1, cols - 1);
      const y1 = Math.min(y0 + 1, rows - 1);
      const fx = smooth(x - x0);
      const fy = smooth(y - y0);
      const top = g[y0 * cols + x0] * (1 - fx) + g[y0 * cols + x1] * fx;
      const bot = g[y1 * cols + x0] * (1 - fx) + g[y1 * cols + x1] * fx;
      return top * (1 - fy) + bot * fy;
    };

    // Patchiness of the reveal: a few octaves of value noise pushed through a
    // contrast curve so it reads as clumps of cloth catching the light, not as
    // even grain. Built small and upscaled — the browser's bilinear filtering
    // does the softening for free.
    const buildNoise = () => {
      const sw = Math.max(8, Math.round(w / 6));
      const sh = Math.max(8, Math.round(h / 6));
      const coarse = lattice(140);
      const mid = lattice(55);
      const fine = lattice(22);

      const small = document.createElement("canvas");
      small.width = sw;
      small.height = sh;
      const sctx = small.getContext("2d");
      if (!sctx) return;
      const id = sctx.createImageData(sw, sh);
      for (let y = 0; y < sh; y++) {
        const v = y / (sh - 1);
        for (let x = 0; x < sw; x++) {
          const u = x / (sw - 1);
          const n =
            0.5 * sample(coarse, u, v) +
            0.32 * sample(mid, u, v) +
            0.18 * sample(fine, u, v);
          // Never fully dark: dim patches still hint at the lines under them.
          const a = 0.14 + 0.86 * smoothstep(0.28, 0.68, n);
          const i = (y * sw + x) * 4;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = 255;
          id.data[i + 3] = Math.round(a * 255);
        }
      }
      sctx.putImageData(id, 0, 0);

      noise.width = Math.round(w * dpr);
      noise.height = Math.round(h * dpr);
      nctx.setTransform(1, 0, 0, 1, 0, 0);
      nctx.clearRect(0, 0, noise.width, noise.height);
      nctx.imageSmoothingEnabled = true;
      nctx.drawImage(small, 0, 0, noise.width, noise.height);
    };

    const resize = () => {
      const rect = main.getBoundingClientRect();
      if (rect.width === w && rect.height === h) return; // don't reroll texture
      w = rect.width;
      h = rect.height;
      canvas.width = buf.width = mask.width = Math.round(w * dpr);
      canvas.height = buf.height = mask.height = Math.round(h * dpr);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNoise();
      computeCover();
    };

    img.onload = () => {
      imgReady = true;
      computeCover();
    };
    img.src = "/toile-watermark.png";
    resize();
    window.addEventListener("resize", resize);

    // Bloom via canvas filter isn't in every browser; fall back to a crisp
    // glow if it's missing rather than shipping a blur that no-ops.
    const canBlur = (() => {
      bctx.filter = "blur(2px)";
      const ok = bctx.filter === "blur(2px)";
      bctx.filter = "none";
      return ok;
    })();

    const R = 320; // how far the warmth reaches along the lines
    const GLOW = "255, 202, 138"; // warm lamp amber, brighter than the ink
    const EASE_POS = 0.24; // pointer smoothing — quick enough to feel live
    const EASE_INT = 0.12; // fade of the glow in/out

    // The reach isn't one circle but a cluster of overlapping lobes, each
    // offset from the pointer, so the boundary is lopsided and organic. Their
    // angles and offsets are driven by the pointer's own position, which lets
    // the shape keep changing as you move without any idle animation.
    const LOBES = [
      { phase: 0.0, off: 0.0, radius: 0.98, weight: 0.5 },
      { phase: 1.1, off: 0.32, radius: 0.82, weight: 0.34 },
      { phase: 2.6, off: 0.44, radius: 0.72, weight: 0.3 },
      { phase: 4.0, off: 0.54, radius: 0.63, weight: 0.26 },
      { phase: 5.3, off: 0.62, radius: 0.54, weight: 0.22 },
    ];
    // Gaussian-ish falloff: no plateau, no shoulder, and the last quarter is
    // near enough to nothing that the perimeter dissolves rather than ending.
    const FALLOFF: [number, number][] = [
      [0, 1],
      [0.12, 0.955],
      [0.25, 0.83],
      [0.38, 0.66],
      [0.5, 0.49],
      [0.62, 0.33],
      [0.74, 0.19],
      [0.86, 0.08],
      [0.94, 0.025],
      [1, 0],
    ];

    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    let seen = false;
    let intensity = 0; // current glow strength
    let intensityTarget = 0; // 1 while the pointer is present, 0 once it leaves

    let raf = 0;
    let running = false;

    // The lopsided reach around the pointer, accumulated from the lobes.
    const buildMask = () => {
      mctx.save();
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.clearRect(0, 0, mask.width, mask.height);
      mctx.restore();

      const drift = (px + py) * 0.0035;
      mctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < LOBES.length; i++) {
        const { phase, off, radius, weight } = LOBES[i];
        const angle = phase + drift * (i % 2 ? 1 : -1);
        const d = R * off * (0.75 + 0.25 * Math.sin(drift * 2.1 + i * 1.7));
        const cx = px + Math.cos(angle) * d;
        const cy = py + Math.sin(angle) * d;
        const peak = intensity * weight;
        const g = mctx.createRadialGradient(cx, cy, 0, cx, cy, R * radius);
        for (const [stop, f] of FALLOFF) {
          g.addColorStop(stop, `rgba(0,0,0,${peak * f})`);
        }
        mctx.fillStyle = g;
        mctx.fillRect(0, 0, w, h);
      }
      mctx.globalCompositeOperation = "source-over";
    };

    const draw = () => {
      // Build the lit lines in the buffer: paint amber everywhere, then cut it
      // back with each mask in turn — the ink, the reach, and the patchiness.
      bctx.save();
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, buf.width, buf.height);
      bctx.restore();

      if (imgReady && intensity > 0.002) {
        buildMask();
        bctx.globalCompositeOperation = "source-over";
        bctx.fillStyle = `rgb(${GLOW})`;
        bctx.fillRect(0, 0, w, h);
        // Keep the amber only on the ink…
        bctx.globalCompositeOperation = "destination-in";
        bctx.drawImage(img, dx, dy, dw, dh);
        // …only within reach of the pointer…
        bctx.drawImage(mask, 0, 0, w, h);
        // …and only on the patches the cloth happens to be catching.
        bctx.drawImage(noise, 0, 0, w, h);
        bctx.globalCompositeOperation = "source-over";
      }

      // Composite the lit lines: a generous additive haze that knits the
      // patches together and carries the light past its own edges, then the
      // lines themselves at low strength so the ink reads as lit, not painted.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canBlur) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.42;
        ctx.filter = `blur(${Math.round(12 * dpr)}px)`;
        ctx.drawImage(buf, 0, 0);
        ctx.filter = "none";
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.7;
      ctx.drawImage(buf, 0, 0);
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      px += (tx - px) * EASE_POS;
      py += (ty - py) * EASE_POS;
      intensity += (intensityTarget - intensity) * EASE_INT;

      const settled =
        Math.hypot(tx - px, ty - py) < 0.5 &&
        Math.abs(intensityTarget - intensity) < 0.004;
      if (settled) {
        intensity = intensityTarget;
        draw();
        running = false; // hold the frame; a move or a leave restarts us
        return;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const at = (clientX: number, clientY: number) => {
      const rect = main.getBoundingClientRect();
      tx = clientX - rect.left;
      ty = clientY - rect.top;
      if (!seen) {
        // First appearance: light up in place instead of sliding in from 0,0.
        seen = true;
        px = tx;
        py = ty;
      }
      intensityTarget = 1;
      kick();
    };

    const onMove = (e: MouseEvent) => at(e.clientX, e.clientY);
    const onLeave = () => {
      intensityTarget = 0; // let the lines settle back, then the loop stops
      kick();
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0] ?? e.changedTouches[0];
      if (t) at(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchend", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  // Orchestrators only stagger their children; the visible blur lives on items.
  const group: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };

  const item: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, filter: "blur(12px)", y: 8 },
        show: {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          transition: { duration: 0.6, ease: EASE },
        },
      };

  return (
    <main
      ref={mainRef}
      className="relative h-screen overflow-hidden pt-0 md:pt-16 flex flex-col"
    >
      {/* Withered-parchment toile watermark — desaturated to warm sepia, its
          fabric background removed, edges dissolving into the page. Purely
          decorative, so it sits behind everything and ignores pointer events. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/toile-watermark.png')] bg-center bg-no-repeat bg-cover opacity-[0.16]"
      />
      {/* Parchment scrim: near-solid where the text lives, fading out toward the
          edges so the watermark reads as a frame around the content instead of
          clashing with the type. Held strong across the central band so the busy
          toile pattern doesn't fight the type, then dissolved at the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_82%_72%_at_50%_50%,rgba(245,240,232,0.94)_0%,rgba(245,240,232,0.86)_38%,rgba(245,240,232,0.48)_62%,rgba(245,240,232,0)_84%)]"
      />
      {/* Illumination canvas: registered over the watermark, it lights the
          actual toile lines warm where the pointer passes (see the effect
          above). Only the ink glows — never the paper between — and only in
          patches, with a ragged perimeter that dissolves, so nothing reads as
          a disc. Empty, and so invisible, until the first pointer move. */}
      <canvas
        aria-hidden
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        style={{ opacity: 0.8 }}
      />
      <motion.div
        variants={group}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl mx-auto px-8 md:px-12 w-full flex flex-col flex-1 justify-center"
      >
        {/* Hero */}
        <motion.section variants={group} className="max-w-3xl">
          <motion.h1
            variants={item}
            className="font-display text-[clamp(48px,7vw,80px)] font-light leading-[1.05] tracking-tight text-foreground mb-4"
          >
            neil <CyclingVerb />
            <br />
            cool things
          </motion.h1>
          <motion.p
            variants={item}
            className="font-sans text-[13px] md:text-[14px] text-muted leading-relaxed"
          >
            east village, nyc
            {" · "}
            <Link
              href="/about"
              className="hover:text-foreground transition-colors duration-200"
            >
              about ↗
            </Link>
          </motion.p>
        </motion.section>

        {/* Divider + section links — sits a fixed gap below the hero; the whole
            hero+nav block is centered as one unit for balanced whitespace. */}
        <motion.div variants={group} className="mt-10 md:mt-14">
          <motion.div variants={item} className="border-t border-warm-border" />
          <motion.nav variants={group} className="flex flex-col">
            {sections.map(({ href, label, description }) => (
              <motion.div variants={item} key={href}>
                <Link
                  href={href}
                  className="group flex items-center gap-5 py-4 border-b border-warm-border hover:border-foreground transition-colors duration-200"
                >
                  <span className="font-display text-[20px] md:text-[24px] italic font-light text-foreground w-28 md:w-40 shrink-0 group-hover:text-accent transition-colors duration-200">
                    {label}
                  </span>
                  <span className="font-sans text-[12px] text-muted group-hover:text-foreground transition-colors duration-200 hidden sm:block">
                    {description}
                  </span>
                  <span className="ml-auto text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200">
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      </motion.div>
    </main>
  );
}
