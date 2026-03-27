import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Experience — Neil",
};

const experience = [
  {
    company: "Lattice",
    role: "Senior Product Designer",
    period: "2024 — Present",
    location: "San Francisco, CA",
    bullets: [
      "Led end-to-end design for the performance management suite, reducing time-to-review by 34%.",
      "Established the Lattice Design System's foundational token architecture across 3 platforms.",
      "Partnered with engineering to ship a redesigned onboarding flow that lifted activation by 22%.",
    ],
  },
  {
    company: "Figma",
    role: "Design Engineer",
    period: "2022 — 2024",
    location: "San Francisco, CA",
    bullets: [
      "Built interactive prototyping primitives used by millions of designers daily.",
      "Drove technical design decisions on the Variables feature from concept to GA.",
      "Collaborated across design and infrastructure to improve canvas render performance.",
    ],
  },
  {
    company: "Linear",
    role: "Product Manager",
    period: "2020 — 2022",
    location: "Remote",
    bullets: [
      "Owned the roadmap for Linear's integrations ecosystem — GitHub, Figma, Slack, and custom webhooks.",
      "Defined and shipped Cycles, a sprint planning feature adopted by 60% of teams within 90 days.",
      "Worked directly with founders to establish Linear's design philosophy and product principles.",
    ],
  },
  {
    company: "Palantir Technologies",
    role: "Solutions Engineer",
    period: "2017 — 2020",
    location: "New York, NY",
    bullets: [
      "Deployed and customized Foundry data platforms for Fortune 500 clients in healthcare and logistics.",
      "Bridged technical requirements with product teams to accelerate enterprise integration timelines.",
      "Mentored junior engineers and led internal design-thinking workshops across the solutions org.",
    ],
  },
];

const skills = [
  "Product Design",
  "Design Engineering",
  "Design Systems",
  "Figma",
  "React",
  "TypeScript",
  "Product Strategy",
  "User Research",
  "Prototyping",
  "Motion Design",
  "Illustration",
];

export default function Experience() {
  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Mobile back link */}
        <div className="md:hidden pt-10 pb-2">
          <Link href="/" className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200">
            ← Neil
          </Link>
        </div>

        {/* Header */}
        <section className="pt-10 md:pt-28 pb-14 md:pb-16">
          <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted mb-4 block">
            Background
          </span>
          <h1 className="font-display text-[clamp(36px,5vw,56px)] font-light italic leading-tight text-foreground">
            Experience
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
                  <span className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted">
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
          <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted mb-6 block">
            Skills
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {skills.map((skill) => (
              <span key={skill} className="font-sans text-[14px] text-foreground">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Mobile forward nav */}
        <div className="md:hidden mt-12 border-t border-warm-border pt-12 pb-16">
          <Link
            href="/musings"
            className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200"
          >
            Next: Musings →
          </Link>
        </div>
      </div>
    </main>
  );
}
