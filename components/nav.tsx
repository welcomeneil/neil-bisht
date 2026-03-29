"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
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
  const connectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    if (!connectOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        connectRef.current &&
        !connectRef.current.contains(e.target as Node)
      ) {
        setConnectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [connectOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!connectOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConnectOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [connectOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setConnectOpen(false);
  }, [pathname]);

  const toggleConnect = useCallback(() => {
    setConnectOpen((prev) => !prev);
  }, []);

  if (pathname === "/") return null;

  return (
    <header
      className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-warm-border bg-background/90 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-12 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-[17px] italic tracking-wide text-foreground hover:text-accent transition-colors duration-200"
        >
          Neil
        </Link>

        {/* Desktop nav */}
        <div className="flex items-center gap-8">
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
          </nav>

          {/* Connect dropdown */}
          <div ref={connectRef} className="relative">
            <button
              onClick={toggleConnect}
              className={`font-sans text-[13px] tracking-wider uppercase transition-colors duration-200 ${
                connectOpen
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Connect
            </button>

            <AnimatePresence>
              {connectOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-3 bg-background border border-warm-border rounded-xl shadow-lg shadow-black/5 py-3 px-1 min-w-[180px]"
                >
                  {SOCIAL_LINKS.map(({ label, href }, i) => (
                    <motion.a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={
                        href.startsWith("mailto:")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="font-sans text-[13px] text-muted hover:text-foreground transition-colors duration-200 block px-3 py-1.5"
                    >
                      {label}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
