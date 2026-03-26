export interface Musing {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: "software" | "meditation" | "creativity" | "life";
}

// Mock data — replace with real MDX file reads when content is ready
export const MUSINGS: Musing[] = [
  {
    slug: "on-making",
    title: "On Making Things",
    date: "March 2026",
    excerpt:
      "There's a specific feeling when something clicks into place — a line that finds its weight, a layout that finally breathes. I've been trying to understand what that feeling actually is.",
    category: "creativity",
  },
  {
    slug: "attention",
    title: "Where Your Attention Goes",
    date: "February 2026",
    excerpt:
      "I've been thinking about the relationship between noticing and doing. The way attention is the first act of making something. How you can't build what you haven't truly seen.",
    category: "meditation",
  },
  {
    slug: "everything-is-simple",
    title: "Everything Is the Same",
    date: "January 2026",
    excerpt:
      "The more I work across different domains — software, tattooing, product design — the more convinced I become that the underlying problems are identical. The domain is just context.",
    category: "software",
  },
];

export function getMusingBySlug(slug: string): Musing | undefined {
  return MUSINGS.find((m) => m.slug === slug);
}
