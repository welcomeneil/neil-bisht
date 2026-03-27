import type { Metadata } from "next";
import Link from "next/link";
import { MUSINGS } from "@/lib/musings";

export const metadata: Metadata = {
  title: "Musings — Neil",
};

const categoryLabel: Record<string, string> = {
  software: "Software",
  meditation: "Meditation",
  creativity: "Creativity",
  life: "Life",
};

export default function Musings() {
  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Mobile back link */}
        <div className="md:hidden pt-10 pb-2">
          <Link href="/" className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200">
            ← Neil
          </Link>
        </div>

        {/* Header */}
        <section className="pt-10 md:pt-28 pb-14 md:pb-16">
          <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted mb-4 block">
            Writing
          </span>
          <h1 className="font-display text-[clamp(36px,5vw,56px)] font-light italic leading-tight text-foreground">
            Musings
          </h1>
        </section>

        {/* Post list */}
        <section className="border-t border-warm-border md:pb-24">
          {MUSINGS.map((post) => (
            <Link
              key={post.slug}
              href={`/musings/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 py-8 border-b border-warm-border hover:border-foreground transition-colors duration-200"
            >
              {/* Left: date + category */}
              <div className="flex sm:flex-col gap-3 sm:gap-1 sm:w-36 shrink-0">
                <span className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted group-hover:text-foreground transition-colors duration-200">
                  {post.date}
                </span>
                <span className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted group-hover:text-accent transition-colors duration-200">
                  {categoryLabel[post.category]}
                </span>
              </div>

              {/* Right: title + excerpt */}
              <div className="flex-1">
                <h2 className="font-display text-[22px] md:text-[26px] font-light text-foreground group-hover:text-accent transition-colors duration-200 leading-tight mb-2">
                  {post.title}
                </h2>
                <p className="font-sans text-[14px] text-muted group-hover:text-foreground transition-colors duration-200 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              {/* Arrow */}
              <span className="hidden sm:block text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200">
                →
              </span>
            </Link>
          ))}
        </section>

        {/* Mobile forward nav */}
        <div className="md:hidden border-t border-warm-border pt-8 pb-16">
          <Link
            href="/work"
            className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200"
          >
            Next: Work →
          </Link>
        </div>
      </div>
    </main>
  );
}
