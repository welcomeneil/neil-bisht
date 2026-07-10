import type { TechId } from "./tech";
import snapshotLogs from "@/content/snapshots.json";

export type WorkCategory = "tattoos" | "drawings" | "software" | "design";

export interface WorkDetails {
  overview: string;
  role: string;
  learnings?: string;
}

/** One upload: the piece as it stood on a given day. Append, never edit. */
export interface Snapshot {
  date: string; // YYYY-MM-DD
  message: string;
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

export const WORK_ITEMS: WorkItem[] = [
  {
    id: 9,
    title: "this site",
    category: "software",
    aspect: "square",
    bg: "#A09078",
    year: "2026",
    imageUrl: "/work/signature.png",
    imageContain: true,
    repo: "https://github.com/welcomeneil/neil-bisht",
    stack: ["nextjs", "typescript", "tailwind", "react", "framer", "vercel"],
    details: {
      overview: "designed, written, and built end-to-end",
      role: "typography-first warm minimalism.\n\nthe work grid intentionally hides images behind warm color blocks to move away from the 'instagram feed' pattern where competing images dilute attention.\n\ninspired by editorials.",
    },
  },
  {
    id: 8,
    title: "tone zone",
    category: "software",
    aspect: "square",
    bg: "#A89880",
    revealGradient:
      "linear-gradient(to right, #2a2520 0% 14.28%, #4a423a 14.28% 28.57%, #6e6358 28.57% 42.85%, #8d8276 42.85% 57.14%, #aca194 57.14% 71.42%, #c8bfb1 71.42% 85.71%, #e3dccd 85.71% 100%)",
    year: "2026",
    link: "https://frontend-chi-pink-19.vercel.app/",
    repo: "https://github.com/welcomeneil/tones",
    stack: ["nextjs", "typescript", "tailwind", "vercel"],
    details: {
      overview: "an image analysis & value-reference tool that extracts 'n'-values from a reference image, renders a palette, and maps them across the original image.",
      role: "a project for artists first; not an algorithm demo.\n\nthe value palette is constrained to drawing conventions (values: 3, 5, 7, 9 — up to 15), rather than chasing a pixel-perfect granularity palette that no artist would actually use.\n\ntested histogram, k-means, and otsu segmentation — eye-test wins over quantitative metrics since this is a visual aid for artists.",
    },
  },
  {
    id: 3,
    title: "github",
    category: "software",
    aspect: "square",
    bg: "#8A8070",
    year: "2026",
    imageUrl: "https://github.com/welcomeneil.png",
    link: "https://github.com/welcomeneil",
    details: {
      overview: "building - see what i'm doing here",
      role: "personal projects and more",
    },
  },
  {
    id: 4,
    title: "tonal study I",
    slug: "tonal-study-i",
    category: "drawings",
    aspect: "landscape",
    bg: "#B4A48C",
    year: "2024",
    wide: true,
    details: {
      overview: "smoking ship",
      role: "tonal / value study.\n\ngraphgear 500, 0.3 lead. paper. \n\nno smudging. building values and textures through stroke variation, pressure, speed, placement, and navigating the paper's ridges.",
    },
  },
  {
    id: 5,
    title: "tonal study II",
    slug: "tonal-study-ii",
    category: "drawings",
    aspect: "portrait",
    bg: "#C0B49C",
    year: "2026",
    imageUrl: "/work/tonal_1.jpeg",
  },
  {
    id: 6,
    title: "gojo?",
    slug: "gojo",
    category: "drawings",
    aspect: "portrait",
    bg: "#907868",
    year: "2024",
    imageUrl: "/work/creature-sketch.jpeg",
  },
  {
    id: 7,
    title: "shinji",
    slug: "shinji",
    category: "drawings",
    aspect: "portrait",
    bg: "#9A8A76",
    year: "2024",
    imageUrl: "/work/headphones-figure.jpeg",
  },
  {
    id: 1,
    title: "tattoos",
    category: "tattoos",
    aspect: "portrait",
    bg: "#C4B89A",
    year: "2026",
    link: "https://www.instagram.com/pocketchbook/",
    details: {
      overview: "coming soon.\nrefer to my instagram (pocketchbook) for posted tattoo pieces.",
      role: "flash and custom work.",
    },
  },
  {
    id: 2,
    title: "design",
    category: "design",
    aspect: "landscape",
    bg: "#9C8B78",
    year: "2026",
    wide: true,
    details: {
      overview: "coming soon.",
      role: "WIP Portfolio.",
    },
  },
];
