import type { TechId } from "./tech";
import snapshotLogs from "@/content/snapshots.json";
import workData from "@/content/work.json";

export type WorkCategory = "tattoos" | "drawings" | "software" | "design" | "client work";

export interface WorkDetails {
  overview: string;
  role: string;
  learnings?: string;
  /** Client quote for freelance pieces — rendered as a pull-quote in the modal. */
  endorsement?: { quote: string; name: string };
}

/** One upload: the piece as it stood on a given day. Append, never edit. */
export interface Snapshot {
  date: string; // YYYY-MM-DD
  /**
   * Optional so a hand-curated entry can stand on the image alone. Uploads
   * through /api/snapshots still require one — the form is the stricter path.
   */
  message?: string;
  imageUrl: string;
  note?: string;
}

/** Oldest first. The last snapshot is the current state of the piece. */
export interface PieceLog {
  status?: "wip" | "done";
  snapshots: Snapshot[];
}

export interface WorkItem {
  id: number;
  title: string;
  category: WorkCategory;
  aspect: "portrait" | "landscape" | "square";
  bg: string;
  year: string;
  wide?: boolean;
  imageUrl?: string;
  imageContain?: boolean;
  revealGradient?: string;
  link?: string;
  repo?: string;
  stack?: TechId[];
  details?: WorkDetails;
  /** Required to accept snapshots. Keys into content/snapshots.json. */
  slug?: string;
  /**
   * Extra full-bleed images for the client-work case-study page (/work/[slug]),
   * shown after the hero. Curated in work.json; order is top-to-bottom.
   */
  gallery?: string[];
}

/** Client-work pieces open a full-screen case study instead of the modal. */
export function isCaseStudy(item: WorkItem): boolean {
  return item.category === "client work" && !!item.slug;
}

/**
 * Logs live in JSON rather than this file so /api/snapshots can append to them
 * with a plain read-modify-write commit.
 */
const LOGS = snapshotLogs as Record<string, PieceLog>;

export function getLog(item: WorkItem): PieceLog | undefined {
  return item.slug ? LOGS[item.slug] : undefined;
}

export function getSnapshots(item: WorkItem): Snapshot[] {
  return getLog(item)?.snapshots ?? [];
}

export function isWip(item: WorkItem): boolean {
  return getLog(item)?.status === "wip";
}

export function latestSnapshot(item: WorkItem): Snapshot | undefined {
  return getSnapshots(item).at(-1);
}

/** What the grid and modal show: the newest snapshot, else the static image. */
export function displayImage(item: WorkItem): string | undefined {
  return latestSnapshot(item)?.imageUrl ?? item.imageUrl;
}

/** Pieces the admin form can post a snapshot to. */
export function snapshottablePieces(): { slug: string; title: string }[] {
  return WORK_ITEMS.filter((i) => i.slug).map((i) => ({
    slug: i.slug!,
    title: i.title,
  }));
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Parsed as plain integers so server and client can't disagree on timezone. */
export function formatSnapshotDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export const WORK_CATEGORIES: WorkCategory[] = ["drawings", "tattoos", "software", "design", "client work"];

/** Warm color blocks new tiles pick from, matching the curated ones. */
export const TILE_PALETTE = [
  "#A09078", "#B4A48C", "#C0B49C", "#907868",
  "#9A8A76", "#C4B89A", "#9C8B78", "#A89880", "#8A8070",
];

/** title -> url-safe slug. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Curated tiles plus anything created through /admin live in work.json so the
 * API can append with a read-modify-write commit — same reason as the logs.
 */
export const WORK_ITEMS: WorkItem[] = workData as WorkItem[];
