import { TECH, type TechId } from "@/lib/tech";

export default function TechStack({ items }: { items: TechId[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((id) => {
        const t = TECH[id];
        if (!t) return null;
        const Icon = t.icon;
        return (
          <span
            key={id}
            className="inline-flex items-center gap-2 font-sans text-[11px] tracking-wide px-3 py-1.5 border border-warm-border text-muted"
          >
            <Icon className="w-[12px] h-[12px] shrink-0" aria-hidden />
            {t.label}
          </span>
        );
      })}
    </div>
  );
}
