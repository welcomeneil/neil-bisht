import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MUSINGS, getMusingBySlug } from "@/lib/musings";

// Placeholder prose for the design phase — swapped for real MDX content later
const PLACEHOLDER_PROSE = `
There's a specific feeling when something clicks into place. A line that finally finds its weight. A component that stops fighting you and starts working with you. A sentence that doesn't need editing.

I've spent a lot of time trying to name that feeling, because I think understanding it is the key to being able to produce it on purpose rather than by accident.

The closest I've come: it's the feeling of something becoming *itself*. Like whatever you were making was always going to exist in this exact form, and you were just the one who happened to find it.

That sounds mystical, but I don't think it is. I think it's what happens when you've understood the constraints so deeply that you're no longer working against them — you're working through them, and the resistance disappears.

---

In tattooing, this shows up as line weight. A beginner fights the needle, the skin, the movement. Someone who's been doing it long enough stops thinking about any of those things and just draws. The machine becomes an extension of the hand. The hand becomes an extension of the eye. The eye becomes an extension of whatever it is you're trying to say.

In software, it's the moment a component's API becomes obvious — not just to the person who built it, but to anyone who picks it up later. That's the difference between something *that works* and something *that's right*.

In design, it's when a layout stops being a collection of elements and becomes a single thing. When the negative space is as intentional as what's in it.

---

I think about this a lot because I'm always working across these domains simultaneously, and what I've found is that the underlying challenge is always the same. The domain is just context. The actual work — the work of making something become itself — is identical whether you're holding a machine, a pencil, or a keyboard.

And maybe that's the thing worth getting better at: not the specific skills, but the specific kind of attention that makes those skills useful. The kind that's quiet enough to hear what something wants to be.
`;

export async function generateStaticParams() {
  return MUSINGS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getMusingBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — Neil` };
}

export default async function MusingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getMusingBySlug(slug);
  if (!post) notFound();

  const paragraphs = PLACEHOLDER_PROSE.trim()
    .split("\n\n")
    .map((p) => p.trim());

  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Back */}
        <div className="pt-12 md:pt-16 pb-10">
          <Link
            href="/musings"
            className="font-sans text-[12px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200"
          >
            ← Musings
          </Link>
        </div>

        {/* Post header */}
        <header className="pb-12 border-b border-warm-border max-w-2xl">
          <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-accent mb-4 block">
            {post.category}
          </span>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-light leading-tight text-foreground mb-4">
            {post.title}
          </h1>
          <p className="font-sans text-[12px] tracking-[0.1em] uppercase text-muted">
            {post.date}
          </p>
        </header>

        {/* Post body */}
        <article className="py-12 md:py-16 max-w-2xl">
          <div className="flex flex-col gap-6">
            {paragraphs.map((para, i) =>
              para === "---" ? (
                <hr key={i} className="border-warm-border my-2" />
              ) : (
                <p
                  key={i}
                  className="font-display text-[19px] md:text-[20px] font-light leading-[1.85] text-foreground"
                  dangerouslySetInnerHTML={{
                    __html: para.replace(/\*(.*?)\*/g, "<em>$1</em>"),
                  }}
                />
              )
            )}
          </div>
        </article>

      </div>
    </main>
  );
}
