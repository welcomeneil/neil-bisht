"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/musings", label: "Musings" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      </div>
    </header>
  );
}
