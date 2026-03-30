"use client";

import { usePathname } from "next/navigation";
import { SOCIAL_LINKS } from "@/lib/social";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <footer className="max-w-6xl mx-auto px-8 md:px-12 w-full border-t border-warm-border py-8">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {SOCIAL_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
