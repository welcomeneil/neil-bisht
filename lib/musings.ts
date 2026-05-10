export interface Musing {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: "software" | "meditation" | "creativity" | "life";
}

export const MUSINGS: Musing[] = [
  {
    slug: "tone-zone",
    title: "tone zone: a value-reference tool",
    date: "2026-05-03",
    excerpt:
      "math, art, and how we represent our understanding/experiences of the world around us",
    category: "software",
  },
];

export function getMusingBySlug(slug: string): Musing | undefined {
  return MUSINGS.find((m) => m.slug === slug);
}
