import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Experience — Neil",
};

const experience = [
  {
    company: "Conductor",
    role: "Sales Development Representative",
    period: "2025 — Present",
    location: "New York, NY",
    bullets: [
      "Generate 30+ qualified meetings with enterprise leaders per quarter through targeted outbound and strategic account research.",
      "Leverage a technical background to articulate Conductor's AI-driven search intelligence platform to both technical and non-technical stakeholders & customers — translating API capabilities into immediate business value.",
      "Collaborate with Solutions Architects on tailored product demos and pre-sales consultations, bridging customer needs and technical solutions.",
    ],
  },
  {
    company: "Pacific Life",
    role: "Software Engineer",
    period: "2024",
    location: "Newport Beach, CA",
    bullets: [
      "Optimized APIs to improve response time by 15% through minimizing database roundtrips and reducing aggregate function overhead.",
      "Consolidated AWS Lambda functions, reducing infrastructure footprint and simplifying deployment complexity.",
      "Wrote robust unit tests and led in-house QA to ensure code stability before production.",
    ],
  },
  {
    company: "UC Irvine — Texera Project",
    role: "Undergraduate Researcher",
    period: "2023",
    location: "Irvine, CA",
    bullets: [
      "Collaborated with Professor Chen Li on Texera — a cloud-based no-code platform universalizing data analytics and machine learning.",
      "Built new operator types in Scala, expanding the platform's visualization capabilities and broadening its value for non-technical end users.",
    ],
  },
  {
    company: "Tech4Good Laboratory",
    role: "Web Developer",
    period: "2021 — 2022",
    location: "Santa Cruz, CA",
    bullets: [
      "Led a 4-person team to design and build responsive web pages, lifting measured user experience metrics by 11%.",
      "Translated Figma designs into pixel-perfect, production-ready components using CSS flexbox, establishing responsive layout patterns across the site.",
    ],
  },
];

const skills = [
  "Python",
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Supabase",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Figma",
  "REST APIs",
  "CI/CD",
  "Illustration",
  "Design",
  "Prototyping",
];

export default function Experience() {
  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Header */}
        <section className="pt-10 md:pt-28 pb-14 md:pb-16">
<h1 className="font-display text-[clamp(36px,5vw,56px)] font-light italic leading-tight text-foreground">
            experience
          </h1>
        </section>

        {/* Timeline */}
        <section>
          <div className="flex flex-col">
            {experience.map((job) => (
              <div
                key={job.company}
                className="border-t border-warm-border py-12 grid md:grid-cols-[200px_1fr] gap-4 md:gap-12"
              >
                {/* Left: meta */}
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[11px] tracking-wide text-muted">
                    {job.period}
                  </span>
                  <span className="font-sans text-[11px] text-muted opacity-70">
                    {job.location}
                  </span>
                </div>

                {/* Right: content */}
                <div>
                  <div className="mb-4">
                    <h2 className="font-sans text-[15px] font-medium text-foreground">
                      {job.company}
                    </h2>
                    <p className="font-display text-[18px] italic font-light text-muted mt-0.5">
                      {job.role}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {job.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="font-sans text-[14px] text-foreground leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-muted before:text-[12px]"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="border-t border-warm-border pt-12 md:pb-24">
          <span className="font-sans text-[11px] tracking-wide text-muted mb-6 block">
            skills
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {skills.map((skill) => (
              <span key={skill} className="font-sans text-[14px] text-foreground">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Mobile forward/back nav */}
        <div className="md:hidden mt-12 border-t border-warm-border pt-12 pb-16 flex justify-between">
          <Link
            href="/work"
            className="font-sans text-[11px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
          >
            ← work
          </Link>
          <Link
            href="/musings"
            className="font-sans text-[11px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
          >
            musings →
          </Link>
        </div>
      </div>
    </main>
  );
}
