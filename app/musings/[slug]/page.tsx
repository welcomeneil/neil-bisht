import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MUSINGS, getMusingBySlug } from "@/lib/musings";

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

  let Post: React.ComponentType;
  try {
    const mod = await import(`@/content/musings/${slug}.mdx`);
    Post = mod.default;
  } catch {
    notFound();
  }

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
        <article className="py-12 md:py-16 max-w-2xl pb-24">
          <Post />
        </article>
      </div>
    </main>
  );
}
