import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Neil",
};

const lists: { heading: string; items: string[] }[] = [
  {
    heading: "i make",
    items: [
      "interfaces, sometimes for screens, sometimes for skin",
      "small software things on weekends and at odd hours",
      "drawings, in pen, mostly faces and hands",
      "tattoos for friends, by appointment",
    ],
  },
  {
    heading: "i believe",
    items: [
      "craft is a moral commitment, not an aesthetic",
      "the best tools feel made by someone, not a team",
      "a portfolio should earn attention, not grab for it",
      "software and tattooing are the same impulse on different surfaces",
    ],
  },
  {
    heading: "i'm reading",
    items: [
      "the creative act, rick rubin",
      "a pattern language, christopher alexander",
      "stay true, hua hsu",
    ],
  },
];

export default function About() {
  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Header */}
        <section className="pt-10 md:pt-28 pb-10 md:pb-14">
          <h1 className="font-display text-[clamp(36px,5vw,56px)] font-light italic leading-tight text-foreground">
            about
          </h1>
          <p className="font-sans text-[11px] tracking-wide text-muted mt-3">
            neil bisht — brooklyn, ny
          </p>
        </section>

        {/* Things lists */}
        <section className="md:pb-24">
          {lists.map((list) => (
            <div
              key={list.heading}
              className="border-t border-warm-border py-12 grid md:grid-cols-[200px_1fr] gap-4 md:gap-12"
            >
              <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                {list.heading}
              </span>

              <ul className="flex flex-col gap-2 max-w-2xl">
                {list.items.map((item, i) => (
                  <li
                    key={i}
                    className="font-sans text-[14px] text-foreground leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-muted before:text-[12px]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Mobile forward/back nav */}
        <div className="md:hidden mt-4 border-t border-warm-border pt-12 pb-16 flex justify-between">
          <Link
            href="/musings"
            className="font-sans text-[11px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
          >
            ← musings
          </Link>
          <Link
            href="/work"
            className="font-sans text-[11px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
          >
            work →
          </Link>
        </div>
      </div>
    </main>
  );
}
