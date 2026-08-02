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

  // Cursor spotlight: a brighter copy of the toile, masked to a soft circle that
  // follows the pointer. We write the position to CSS vars on the layer itself
  // (via rAF) rather than React state, so tracking never re-renders the tree.
  const mainRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    const spotlight = spotlightRef.current;
    if (!main || !spotlight) return;

    const point = (clientX: number, clientY: number) => {
      const rect = main.getBoundingClientRect();
      spotlight.style.setProperty("--mx", `${clientX - rect.left}px`);
      spotlight.style.setProperty("--my", `${clientY - rect.top}px`);
    };

    // Touch: no persistent hover, so each tap sends a soft impact of light
    // outward from where it landed — the toile blooms in, swells wide, and
    // dissolves. The radius ride is what makes it read as an "impact".
    if (window.matchMedia("(hover: none)").matches) {
      const onTap = (e: TouchEvent) => {
        const t = e.touches[0] ?? e.changedTouches[0];
        if (!t) return;
        point(t.clientX, t.clientY);
        spotlight.animate(
          [
            { "--spot-r": "18px", opacity: 0 },
            { "--spot-r": "70px", opacity: 0.46, offset: 0.3 },
            { "--spot-r": "180px", opacity: 0 },
          ] as unknown as Keyframe[],
          { duration: 950, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      };
      document.addEventListener("touchstart", onTap, { passive: true });
      return () => document.removeEventListener("touchstart", onTap);
    }

    // Desktop: the glow lags behind the pointer instead of tracking it 1:1.
    // Each frame the spotlight eases a fraction of the way toward the cursor,
    // so it drifts along behind — present, but not a hard light chasing you.
    const EASE = 0.04; // lower = more lag / longer trail
    let raf = 0;
    let running = false;
    let seen = false;
    let tx = -1000; // target (pointer)
    let ty = -1000;
    let cx = -1000; // current (eased spotlight)
    let cy = -1000;

    const tick = () => {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      spotlight.style.setProperty("--mx", `${cx}px`);
      spotlight.style.setProperty("--my", `${cy}px`);
      if ((tx - cx) ** 2 + (ty - cy) ** 2 > 0.25) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false; // settled — stop looping until the next move
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = main.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (!seen) {
        // First appearance: start at the pointer so it doesn't streak in.
        seen = true;
        cx = tx;
        cy = ty;
      }
      spotlight.style.opacity = "0.42";
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => {
      spotlight.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

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
      {/* Cursor spotlight: the same toile, aligned and brighter, painted above the
          scrim and masked to a soft circle at the pointer. Where the mask is
          opaque the pattern blooms back through the veil; everywhere else it's
          fully clipped, so the reading area stays calm. Starts off-screen and
          fully transparent until the first pointer move (see the effect above). */}
      <div
        aria-hidden
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/toile-watermark.png')] bg-center bg-no-repeat bg-cover opacity-0 transition-opacity duration-500"
        style={{
          "--mx": "-1000px",
          "--my": "-1000px",
          WebkitMaskImage:
            "radial-gradient(circle var(--spot-r, 120px) at var(--mx) var(--my), rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.34) 55%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(circle var(--spot-r, 120px) at var(--mx) var(--my), rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.34) 55%, rgba(0,0,0,0) 100%)",
        } as React.CSSProperties}
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
