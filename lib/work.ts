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
  details?: WorkDetails;
}

// Mock items — swap imageUrl for real paths in /public/work/ when assets are ready
export const WORK_ITEMS: WorkItem[] = [
  {
    id: 1,
    title: "Flash No. 12",
    category: "tattoos",
    aspect: "portrait",
    bg: "#C4B89A",
    year: "2025",
    imageUrl: "https://picsum.photos/seed/flash12/600/800?grayscale",
    details: {
      overview: "A single-session flash sheet built around fine-line botanical motifs — ferns, seed pods, and skeletal leaf structures. Designed to work as individual flash pieces or as a cohesive set on one collector.",
      role: "Designed and executed the full sheet. Drew all linework by hand in ink before digitizing for stencil prep. Tattooed six of the twelve designs within the first week of release.",
      learnings: "Spending time on composition at the sheet level — not just per piece — changed how collectors approached booking. When the whole sheet reads as a family, people want more than one.",
    },
  },
  {
    id: 2,
    title: "Meridian",
    category: "software",
    aspect: "landscape",
    bg: "#8A8975",
    year: "2025",
    wide: true,
    imageUrl: "https://picsum.photos/seed/meridian/1200/675?grayscale",
    details: {
      overview: "A spatial navigation tool for teams working across distributed time zones. Meridian visualizes who's online, what they're working on, and when overlap windows occur — without the overhead of a status tool.",
      role: "Led product and design end-to-end. Built the core presence model, designed the overlap visualization, and wrote the majority of the frontend in React. Shipped a private beta to three teams.",
      learnings: "The hardest part wasn't the timezone math — it was deciding what not to show. Presence data is surveillance data if you're not careful about framing. That tension shaped every design decision.",
    },
  },
  {
    id: 3,
    title: "Untitled — Ink Study",
    category: "drawings",
    aspect: "portrait",
    bg: "#B8A88A",
    year: "2024",
    imageUrl: "https://picsum.photos/seed/ink3/600/800?grayscale",
    details: {
      overview: "A figure study series exploring negative space and the boundary between form and ground. Worked exclusively in black ink on cold-press watercolor paper, no underdrawing.",
      role: "Solo work. The constraint was to commit to every mark — no erasure, no correction. Each piece took between 20 minutes and three hours.",
      learnings: "Ink without underdrawing forces a different kind of seeing. You have to hold the whole composition in your head before the first mark, which is a discipline I've since carried into digital work.",
    },
  },
  {
    id: 4,
    title: "Compass Design System",
    category: "design",
    aspect: "landscape",
    bg: "#9C8B78",
    year: "2025",
    wide: true,
    imageUrl: "https://picsum.photos/seed/compass/1200/675?grayscale",
    details: {
      overview: "A cross-platform design system built to serve a product spanning web, iOS, and Android. Compass unified three previously divergent codebases under a single token architecture and component library.",
      role: "Designed the token structure, built the Figma library, and co-authored the React implementation with one engineer. Wrote the documentation and ran adoption workshops across four product teams.",
      learnings: "A design system lives or dies by its documentation. The tokens and components were done in three months. Getting teams to actually use them took six more.",
    },
  },
  {
    id: 5,
    title: "Flash No. 7",
    category: "tattoos",
    aspect: "portrait",
    bg: "#C9BCA3",
    year: "2024",
    imageUrl: "https://picsum.photos/seed/flash7/600/800?grayscale",
    details: {
      overview: "An exploration of traditional American flash reinterpreted through a quieter, more restrained lens. Bold shapes, reduced palette, no outlines heavier than 1.2mm.",
      role: "Full design and execution. Tested line weight and fill density on synthetic skin before committing to the final sheet. Four of the pieces have since been tattooed multiple times.",
      learnings: "Traditional flash works because it's designed for reproduction, not just admiration. Thinking about a design as something that will be tattooed ten times changes how you resolve the details.",
    },
  },
  {
    id: 6,
    title: "Vessel",
    category: "software",
    aspect: "landscape",
    bg: "#8C7A6B",
    year: "2024",
    wide: true,
    imageUrl: "https://picsum.photos/seed/vessel/1200/675?grayscale",
    details: {
      overview: "A personal knowledge tool for long-form thinkers. Vessel is built around the idea that notes should accumulate into something — a body of thought with structure that emerges rather than being imposed.",
      role: "Sole designer and primary engineer. Designed the information architecture, built the graph view and linking system, and wrote a custom markdown parser to handle bi-directional references.",
      learnings: "I built the tool I wanted and ended up with something I don't actually use the way I expected. That taught me more about the difference between designing for behavior and designing for desire than any user research I've done.",
    },
  },
  {
    id: 7,
    title: "Study in Charcoal",
    category: "drawings",
    aspect: "portrait",
    bg: "#B5A890",
    year: "2025",
    imageUrl: "https://picsum.photos/seed/charcoal/600/800?grayscale",
    details: {
      overview: "A series of tonal studies using compressed charcoal on toned paper. The work focuses on light as a subject rather than form — using the paper's mid-tone as the neutral and working both into shadow and out to highlight.",
      role: "Personal practice work. One piece per week for twelve weeks, each from direct observation.",
      learnings: "Working on toned paper removed the anxiety of the white ground. Starting in the middle forced a different relationship with value — you have to earn the lights, not assume them.",
    },
  },
  {
    id: 8,
    title: "Wayfinder Dashboard",
    category: "design",
    aspect: "landscape",
    bg: "#8C8A7A",
    year: "2024",
    wide: true,
    imageUrl: "https://picsum.photos/seed/wayfinder/1200/675?grayscale",
    details: {
      overview: "An ops dashboard for a logistics company managing last-mile delivery across twelve cities. Replaced a patchwork of spreadsheets and Slack channels with a single live view of fleet status, exceptions, and delivery windows.",
      role: "Led design from discovery through handoff. Ran stakeholder interviews with dispatchers and drivers, mapped the existing workflow, and designed a system that reduced the average time-to-decision on exceptions from 11 minutes to under 2.",
      learnings: "Ops tools are humbling. The people using them are under constant time pressure and have no patience for clever UI. Every extra click is a real cost. I've never stripped an interface down more aggressively than I did on this one.",
    },
  },
  {
    id: 9,
    title: "Flash No. 3",
    category: "tattoos",
    aspect: "portrait",
    bg: "#BDB09A",
    year: "2023",
    imageUrl: "https://picsum.photos/seed/flash3/600/800?grayscale",
    details: {
      overview: "One of the earliest flash sheets — an attempt to develop a personal visual language for tattoo work. Heavy influence from Japanese tebori aesthetics, translated into a finer Western line style.",
      role: "Design and execution. This was early enough that I was still figuring out the relationship between drawing something and tattooing it. Most of these designs have been revised in later sheets.",
      learnings: "What reads beautifully as a drawing doesn't always tattoo well. Line weight, spacing, and negative space all behave differently in skin than on paper. Flash No. 3 is a record of learning that the hard way.",
    },
  },
  {
    id: 10,
    title: "Figure Study",
    category: "drawings",
    aspect: "portrait",
    bg: "#A89880",
    year: "2025",
    imageUrl: "https://picsum.photos/seed/figure/600/800?grayscale",
    details: {
      overview: "Life drawing work from a weekly session practice. These pieces prioritize gesture and proportion over rendering — the goal is to capture the logic of a body in the minimum number of marks.",
      role: "Personal practice. Typically 5–20 minute poses, ink or graphite.",
      learnings: "Speed is clarifying. When you have five minutes you stop caring about details and start caring about what the body is doing. That instinct — get the gesture before you get the finger — has carried over into how I approach interface sketching.",
    },
  },
  {
    id: 11,
    title: "Flash No. 21",
    category: "tattoos",
    aspect: "portrait",
    bg: "#D0C4AD",
    year: "2026",
    imageUrl: "https://picsum.photos/seed/flash21/600/800?grayscale",
    details: {
      overview: "The most recent flash sheet. The design language has simplified considerably — fewer elements, more air, confidence in what can be left out. Heavily influenced by a period spent studying traditional Polynesian form.",
      role: "Full design and execution. This sheet took the longest to finish because I kept removing things. The final version has about 60% of the marks the first draft had.",
      learnings: "Restraint isn't just aesthetic — it's technical. Simpler designs heal better, age better, and hold their intention over decades. Complexity is easy. Knowing what to remove is the actual skill.",
    },
  },
  {
    id: 12,
    title: "Thread",
    category: "software",
    aspect: "landscape",
    bg: "#7A6B5A",
    year: "2026",
    wide: true,
    imageUrl: "https://picsum.photos/seed/thread/1200/675?grayscale",
    details: {
      overview: "A slow messaging tool designed to reduce the urgency pressure of modern communication. Thread uses deliberate friction — a 15-minute send delay, no read receipts, no online indicators — to shift the register back toward considered correspondence.",
      role: "Concept, design, and full-stack development. Built on Next.js with a real-time backend. Currently in use by a small closed group of about 40 people.",
      learnings: "The delay is the product. Removing it would make Thread just another chat app. The constraint is the thing — and building a product around a deliberate constraint taught me that the best design decisions are often subtractive.",
    },
  },
];
