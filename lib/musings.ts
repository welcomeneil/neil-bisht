export interface Musing {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: "software" | "meditation" | "creativity" | "life";
}

export const MUSINGS: Musing[] = [];

export function getMusingBySlug(slug: string): Musing | undefined {
  return MUSINGS.find((m) => m.slug === slug);
}
