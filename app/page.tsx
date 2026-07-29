"use client";

import Link from "next/link";
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
    <main className="h-screen overflow-hidden pt-0 md:pt-16 flex flex-col">
      <motion.div
        variants={group}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-8 md:px-12 w-full flex flex-col flex-1 justify-center"
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
