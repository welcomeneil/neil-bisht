"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/social";

const links = [
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/musings", label: "Musings" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on route change + instant reset (no fade-out)
  useEffect(() => {
    setSkipTransition(true);
    setConnectOpen(false);
    setScrolled(false);
    requestAnimationFrame(() => setSkipTransition(false));
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    if (!connectOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const outsideDesktop = !dropdownRef.current?.contains(e.target as Node);
      const outsideMobile = !mobileRef.current?.contains(e.target as Node);
      if (outsideDesktop && outsideMobile) {
        setConnectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [connectOpen]);

  // Close on Escape
  useEffect(() => {
    if (!connectOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConnectOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [connectOpen]);

  if (pathname === "/") return null;

  const connectButton = (
    <button
      onClick={() => setConnectOpen((prev) => !prev)}
      className={`font-sans tracking-[0.12em] uppercase transition-colors duration-200 ${
        connectOpen ? "text-foreground" : "text-muted hover:text-foreground"
      }`}
    >
      Connect
    </button>
  );

  const connectDropdown = (
    <AnimatePresence>
      {connectOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-4 flex flex-col gap-3 py-4 px-5 border border-warm-border bg-background min-w-[160px]"
        >
          {SOCIAL_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{
                duration: 0.25,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              className="font-sans text-[12px] tracking-wider uppercase text-muted hover:text-foreground transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop nav */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-warm-border bg-background/90 backdrop-blur-sm"
            : "border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 md:px-12 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-[17px] italic tracking-wide text-foreground hover:text-accent transition-colors duration-200"
          >
            Neil
          </Link>

          <nav className="flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-sans text-[13px] tracking-wider uppercase transition-colors duration-200 ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="relative text-[13px]" ref={dropdownRef}>
              {connectButton}
              {connectDropdown}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Connect — fixed top bar, scroll-aware */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-50 ${
          skipTransition ? "" : "transition-all duration-500"
        } ${
          scrolled
            ? "border-b border-warm-border bg-background/90 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center px-8 h-14">
          <Link
            href="/"
            className="font-display text-[17px] italic tracking-wide text-foreground hover:text-accent transition-colors duration-200 pointer-events-auto"
          >
            Neil
          </Link>
          <div className="relative text-[11px] pointer-events-auto" ref={mobileRef}>
            {connectButton}
            {connectDropdown}
          </div>
        </div>
      </div>
    </>
  );
}
