import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NowPlaying from "@/components/now-playing";

export const metadata: Metadata = {
  title: "About — Neil",
};

const lists: { heading: string; items: string[] }[] = [
  {
    heading: "i make",
    items: [
      "a lot!!",
      "custom websites & storefronts. i'm always looking for new clients, and am just a message away!",
      "software things always",
      "pencil drawings that take painstakingly long",
      "tattoos! by appointment!",
    ],
  },
  {
    heading: "i think that",
    items: [
      "things don't happen to you, they happen for you",
      "gentle reframing is generative!",
    ],
  },
  {
    heading: "i'm reading",
    items: [
      "The Picture of Dorian Gray, Oscar Wilde",
      "East of Eden, John Steinbeck",
    ],
  },
];

export default function About() {
  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Header */}
        <section className="pt-10 md:pt-28 pb-10 md:pb-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-[clamp(36px,5vw,56px)] font-light italic leading-tight text-foreground">
              about
            </h1>
            <p className="font-sans text-[11px] tracking-wide text-muted mt-3">
              neil bisht; east village, ny
            </p>
          </div>
          <div className="w-32 md:w-44 shrink-0">
            <Image
              src="/neil-portrait.jpg"
              alt="Portrait of Neil Bisht"
              width={960}
              height={1200}
              priority
              sizes="(max-width: 768px) 128px, 176px"
              className="w-full h-auto rounded-[2px] grayscale"
            />
          </div>
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

          {/* Live Spotify feed */}
          <div className="border-t border-warm-border py-12 grid md:grid-cols-[200px_1fr] gap-4 md:gap-12">
            <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
              i&apos;m listening to
            </span>
            <NowPlaying />
          </div>
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
