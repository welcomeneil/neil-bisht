import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WORK_ITEMS, displayImage, isCaseStudy } from "@/lib/work";
import { TECH } from "@/lib/tech";

function findPiece(slug: string) {
  return WORK_ITEMS.find((i) => i.slug === slug && isCaseStudy(i));
}

// Client-work slugs are known at build; new ones ship with a redeploy anyway.
export function generateStaticParams() {
  return WORK_ITEMS.filter(isCaseStudy).map((i) => ({ slug: i.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findPiece(slug);
  if (!item) return {};
  return {
    title: `${item.title} — Neil`,
    description: item.details?.overview,
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findPiece(slug);
  if (!item) notFound();

  const hero = displayImage(item);
  const images = [hero, ...(item.gallery ?? [])].filter(Boolean) as string[];
  const stack = (item.stack ?? []).map((id) => TECH[id]?.label).filter(Boolean);

  return (
    <main className="min-h-screen pt-0 md:pt-16 pb-24 md:pb-32">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Back */}
        <div className="pt-8 md:pt-14">
          <Link
            href="/work?filter=client+work"
            className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200"
          >
            ← work
          </Link>
        </div>

        {/* Title block */}
        <header className="pt-10 md:pt-16 pb-12 md:pb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-accent">
              {item.category}
            </span>
            <h1 className="font-display text-[clamp(40px,6vw,72px)] font-light italic leading-[1.05] tracking-tight text-foreground">
              {item.title}
            </h1>
          </div>
          <div className="flex flex-col gap-1.5 md:items-end shrink-0">
            <span className="font-sans text-[13px] text-muted">{item.year}</span>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] tracking-[0.12em] uppercase text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors duration-200"
              >
                visit site ↗
              </a>
            )}
          </div>
        </header>
      </div>

      {/* Gallery — the images carry the page */}
      <div className="max-w-6xl mx-auto px-8 md:px-12 flex flex-col gap-3 md:gap-5">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`${item.title} — ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-auto"
          />
        ))}
      </div>

      {/* Secondary copy — kept quiet, below the work */}
      <div className="max-w-2xl mx-auto px-8 md:px-12 pt-16 md:pt-24 flex flex-col gap-10">
        {item.details?.overview && (
          <p className="font-display text-[clamp(20px,2.4vw,26px)] font-light italic leading-[1.6] text-foreground">
            {item.details.overview}
          </p>
        )}

        {item.details?.role && (
          <p className="font-sans text-[14px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {item.details.role}
          </p>
        )}

        {stack.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
              stack
            </span>
            <p className="font-sans text-[13px] text-foreground">
              {stack.join(" · ")}
            </p>
          </div>
        )}

        {item.details?.endorsement && (
          <div className="flex flex-col gap-2 border-t border-warm-border pt-8">
            <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
              From the Client
            </span>
            <blockquote className="font-display text-[18px] font-light italic leading-[1.8] text-foreground whitespace-pre-wrap">
              &ldquo;{item.details.endorsement.quote}&rdquo;
            </blockquote>
            <p className="font-sans text-[12px] tracking-wide text-muted">
              — {item.details.endorsement.name}
            </p>
          </div>
        )}

        <Link
          href="/work?filter=client+work"
          className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200"
        >
          ← all client work
        </Link>
      </div>
    </main>
  );
}
