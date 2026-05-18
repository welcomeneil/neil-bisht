"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { WORK_ITEMS, type WorkCategory, type WorkItem } from "@/lib/work";
import WorkModal from "@/components/work-modal";

type Filter = WorkCategory | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "all" },
  { value: "software", label: "software" },
  { value: "drawings", label: "drawings" },
  { value: "tattoos", label: "tattoos" },
  { value: "design", label: "design" },
];

function WorkCard({
  item,
  isFocused,
}: {
  item: (typeof WORK_ITEMS)[number];
  isFocused: boolean;
}) {
  const aspectClass =
    item.aspect === "portrait"
      ? "aspect-[3/4]"
      : item.aspect === "landscape"
        ? "aspect-[16/9]"
        : "aspect-square";

  return (
    <div className={`w-full ${aspectClass} relative overflow-hidden group`}>
      {/* Color block — always visible base */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: item.bg }}
      />

      {/* Image — revealed on hover */}
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className={`${item.imageContain ? "object-contain p-[18%]" : "object-cover"} opacity-0 group-hover:opacity-90 transition-opacity duration-500 ease-in-out mix-blend-multiply ${
            isFocused ? "max-md:opacity-90" : ""
          }`}
        />
      )}

      {/* Gradient reveal — same hover pattern as imageUrl */}
      {item.revealGradient && (
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out ${
            isFocused ? "max-md:opacity-100" : ""
          }`}
          style={{ background: item.revealGradient }}
        />
      )}

    </div>
  );
}

function useScrollFocus() {
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const tileRefs = useRef(new Map<number, HTMLElement>());

  const registerTile = useCallback(
    (id: number) => (el: HTMLElement | null) => {
      if (el) tileRefs.current.set(id, el);
      else tileRefs.current.delete(id);
    },
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    let rafId: number | null = null;

    const compute = () => {
      rafId = null;

      if (!mq.matches || window.scrollY < 8 || tileRefs.current.size === 0) {
        setFocusedId(null);
        return;
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setFocusedId(null);
        return;
      }

      // Sort tiles by on-screen visual position (top → bottom, left → right
      // within row) so left/right tiles in a 2-col row both get their turn,
      // and `grid-flow-row-dense` reorderings are reflected.
      const sorted: { id: number; top: number; left: number }[] = [];
      for (const [id, el] of tileRefs.current) {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) continue;
        sorted.push({ id, top: rect.top, left: rect.left });
      }
      if (sorted.length === 0) {
        setFocusedId(null);
        return;
      }
      // Bucket tops to absorb sub-pixel row variance from mixed aspect ratios.
      const ROW_TOLERANCE = 16;
      sorted.sort((a, b) => {
        const rowDelta = a.top - b.top;
        if (Math.abs(rowDelta) > ROW_TOLERANCE) return rowDelta;
        return a.left - b.left;
      });

      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      const idx = Math.min(
        Math.floor(progress * sorted.length),
        sorted.length - 1,
      );
      setFocusedId(sorted[idx].id);
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(compute);
    };

    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    mq.addEventListener("change", schedule);

    // Catches scrollHeight changes from layout animation, image load, font swap.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.documentElement);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
      ro.disconnect();
    };
  }, []);

  return { focusedId, registerTile };
}

export default function Work() {
  const [active, setActive] = useState<Filter>("all");
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered =
    active === "all"
      ? WORK_ITEMS
      : WORK_ITEMS.filter((item) => item.category === active);

  const { focusedId, registerTile } = useScrollFocus();

  return (
    <main className="min-h-screen pt-0 md:pt-16">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        {/* Header */}
        <section className="pt-10 md:pt-28 pb-10 md:pb-12">
<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h1 className="font-display text-[clamp(36px,5vw,56px)] font-light italic leading-tight text-foreground">
              work
            </h1>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-1 pb-1">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setActive(value)}
                  className={`font-sans text-[11px] tracking-wide px-3 py-1.5 border transition-all duration-200 ${
                    active === value
                      ? "border-foreground text-foreground"
                      : "border-warm-border text-muted hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-warm-border mb-10 md:mb-14" />

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 grid-flow-row-dense gap-4 md:gap-5 md:pb-24"
        >
          {filtered.map((item, i) => {
            const isFocused = focusedId === item.id;
            const opacity = focusedId === null || isFocused ? 1 : 0.4;
            return (
            <motion.div
              key={item.id}
              ref={registerTile(item.id)}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              transition={{ duration: mounted ? (opacity === 1 ? 0.35 : 0.7) : 0.3, delay: mounted ? 0 : i * 0.04 }}
              className={`group cursor-pointer ${
                item.wide && filtered.length > 3
                  ? "col-span-2"
                  : ""
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="overflow-hidden">
                <WorkCard item={item} isFocused={isFocused} />
              </div>
              <div className="mt-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-sans text-[13px] text-foreground leading-snug">
                    {item.title}
                  </p>
                  <p className="font-sans text-[11px] tracking-wide text-muted mt-0.5">
                    {item.category}
                  </p>
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile forward/back nav */}
        <div className="md:hidden mt-10 border-t border-warm-border pt-10 pb-16 flex justify-between">
          <Link
            href="/musings"
            className="font-sans text-[11px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
          >
            ← musings
          </Link>
          <Link
            href="/experience"
            className="font-sans text-[11px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
          >
            experience →
          </Link>
        </div>
      </div>

      <WorkModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </main>
  );
}
