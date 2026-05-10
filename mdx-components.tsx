import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-[clamp(28px,4vw,40px)] font-normal leading-tight text-foreground mt-12 mb-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-[24px] md:text-[28px] font-normal leading-tight text-foreground mt-14 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans text-[12px] tracking-[0.15em] uppercase text-accent mt-10 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="font-display text-[19px] md:text-[20px] font-light leading-[1.85] text-foreground mb-6">
        {children}
      </p>
    ),
    em: ({ children }) => <em className="italic text-foreground">{children}</em>,
    strong: ({ children }) => (
      <strong className="font-medium text-foreground">{children}</strong>
    ),
    hr: () => <hr className="border-warm-border my-10" />,
    ul: ({ children }) => (
      <ul className="font-display text-[19px] md:text-[20px] font-light leading-[1.85] text-foreground mb-6 list-disc pl-6 flex flex-col gap-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="font-display text-[19px] md:text-[20px] font-light leading-[1.85] text-foreground mb-6 list-decimal pl-6 flex flex-col gap-2">
        {children}
      </ol>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground underline underline-offset-4 decoration-warm-border hover:decoration-foreground transition-colors"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-warm-border pl-6 my-8 font-display italic text-muted text-[18px] md:text-[19px] leading-[1.8]">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[15px] bg-warm-border/40 px-1.5 py-0.5 rounded text-foreground">
        {children}
      </code>
    ),
    ...components,
  };
}
