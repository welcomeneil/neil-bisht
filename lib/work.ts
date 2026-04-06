export type WorkCategory = "tattoos" | "drawings" | "software" | "design";

export interface WorkDetails {
  overview: string;
  role: string;
  learnings?: string;
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
  link?: string;
  details?: WorkDetails;
}

export const WORK_ITEMS: WorkItem[] = [
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
      overview: "building - see what i'm doing here.",
      role: "personal projects and more",
    },
  },
  {
    id: 4,
    title: "tonal study I (WIP)",
    category: "drawings",
    aspect: "landscape",
    bg: "#B4A48C",
    year: "2024",
    wide: true,
    imageUrl: "/work/cloud-study-01.jpeg",
    details: {
      overview: "smoking ship",
      role: "tonal / value study.\n\ngraphgear 500, 0.3 lead. paper. \n\nno smudging. building values and textures through stroke variation, pressure, speed, placement, and navigating the paper's ridges.",
    },
  },
  {
    id: 5,
    title: "tonal study II",
    category: "drawings",
    aspect: "portrait",
    bg: "#C0B49C",
    year: "2026",
    imageUrl: "/work/tonal_1.jpeg",
  },
  {
    id: 6,
    title: "gojo?",
    category: "drawings",
    aspect: "portrait",
    bg: "#907868",
    year: "2024",
    imageUrl: "/work/creature-sketch.jpeg",
  },
  {
    id: 7,
    title: "shinji",
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
