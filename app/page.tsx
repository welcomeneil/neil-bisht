import Link from "next/link";

const sections = [
  {
    href: "/work",
    label: "Work",
    description: "Tattoos, drawings, software, design",
  },
  {
    href: "/experience",
    label: "Experience",
    description: "What I've built and where I've been",
  },
  {
    href: "/musings",
    label: "Musings",
    description: "Thoughts worth writing down",
  },
];

export default function Home() {
  return (
    <main className="h-screen overflow-hidden pt-0 md:pt-16 flex flex-col">
      <div className="max-w-6xl mx-auto px-8 md:px-12 w-full flex flex-col flex-1 justify-center md:justify-between md:pt-0 md:pb-28">
        {/* Hero — anchored to upper portion */}
        <section className="pt-0 md:pt-28">
          <div className="max-w-3xl">
            <h1 className="font-display text-[clamp(48px,7vw,80px)] font-light leading-[1.05] tracking-tight text-foreground mb-6">
              Neil crafts
              <br />
              cool things.
            </h1>
            <p className="font-sans text-[15px] md:text-[16px] text-muted leading-relaxed max-w-md">
              Drawing, tattooing, and building experiences{" "}
              <br className="hidden md:block" />
              people actually want to use.
            </p>
          </div>
        </section>

        {/* Divider + section links — anchored to bottom on mobile, close below hero on desktop */}
        <div className="mt-10 md:mt-16">
          <div className="border-t border-warm-border" />
          <nav className="flex flex-col">
            {sections.map(({ href, label, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-5 py-4 border-b border-warm-border hover:border-foreground transition-colors duration-200"
              >
                <span className="font-display text-[20px] md:text-[24px] italic font-light text-foreground w-28 md:w-40 shrink-0 group-hover:text-accent transition-colors duration-200">
                  {label}
                </span>
                <span className="font-sans text-[12px] text-muted group-hover:text-foreground transition-colors duration-200 hidden sm:block">
                  {description}
                </span>
                <span className="ml-auto text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200">
                  →
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
