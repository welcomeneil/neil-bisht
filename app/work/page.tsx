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
        style={{ backgroundColor: item.bg }}
      />

      {/* Image — revealed on hover */}
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className={`object-cover opacity-0 group-hover:opacity-90 transition-opacity duration-500 max-md:duration-1000 ease-in-out mix-blend-multiply ${
            isFocused ? "max-md:opacity-90" : ""
          }`}
        />
      )}

    </div>
  );
}

function useScrollFocus(filtered: WorkItem[], gridRef: React.RefObject<HTMLDivElement | null>) {
  const tileRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [readingOrder, setReadingOrder] = useState<number[]>([]);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setTileRef = useCallback(
    (id: number, el: HTMLDivElement | null) => {
      if (el) tileRefs.current.set(id, el);
      else tileRefs.current.delete(id);
    },
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");

    const update = () => {
      // Desktop — no opacity changes
      if (!mq.matches) {
        setFocusedIndex(null);
        setReadingOrder([]);
        return;
      }

      // Mobile — only activate once user starts scrolling
      if (window.scrollY < 8) {
        setFocusedIndex(null);
        setReadingOrder([]);
        return;
      }

      // Sort tiles in reading order (top to bottom, left to right)
      const tiles: { id: number; rect: DOMRect }[] = [];
      tileRefs.current.forEach((el, id) => {
        tiles.push({ id, rect: el.getBoundingClientRect() });
      });
      tiles.sort((a, b) => {
        const rowDiff = Math.round(a.rect.top) - Math.round(b.rect.top);
        if (Math.abs(rowDiff) > 10) return rowDiff;
        return a.rect.left - b.rect.left;
      });

      if (tiles.length === 0) return;

      // Group into rows, assign unique thresholds
      const ROW_TOLERANCE = 10;
      const rows: { id: number; rect: DOMRect }[][] = [];
      for (const tile of tiles) {
        const lastRow = rows[rows.length - 1];
        if (lastRow && Math.abs(lastRow[0].rect.top - tile.rect.top) < ROW_TOLERANCE) {
          lastRow.push(tile);
        } else {
          rows.push([tile]);
        }
      }

      const ordered: { id: number; threshold: number }[] = [];
      for (const row of rows) {
        const rowTop = row[0].rect.top;
        const rowHeight = row[0].rect.height;
        for (let col = 0; col < row.length; col++) {
          ordered.push({
            id: row[col].id,
            threshold: rowTop + (col / row.length) * rowHeight,
          });
        }
      }

      const viewportCenter = window.innerHeight / 2;
      let newFocusIdx = 0;

      for (let i = 0; i < ordered.length; i++) {
        if (ordered[i].threshold > viewportCenter) break;
        newFocusIdx = i;
      }

      const order = ordered.map((t) => t.id);
      setReadingOrder(order);

      if (delayTimer.current) clearTimeout(delayTimer.current);
      delayTimer.current = setTimeout(() => {
        setFocusedIndex(newFocusIdx);
      }, 100);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (delayTimer.current) clearTimeout(delayTimer.current);
    };
  }, []);

  // Calculate opacity for each tile based on distance from focused tile
  const getOpacity = useCallback(
    (itemId: number) => {
      if (focusedIndex === null || readingOrder.length === 0) return 1;
      const idx = readingOrder.indexOf(itemId);
      if (idx === -1) return 1;
      const dist = Math.abs(idx - focusedIndex);
      return dist === 0 ? 1 : 0.4;
    },
    [focusedIndex, readingOrder],
  );

  const isFocused = useCallback(
    (itemId: number) => {
      if (focusedIndex === null || readingOrder.length === 0) return false;
      return readingOrder.indexOf(itemId) === focusedIndex;
    },
    [focusedIndex, readingOrder],
  );

  return { getOpacity, isFocused, setTileRef };
}

export default function Work() {
  const [active, setActive] = useState<Filter>("all");
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  const filtered =
    active === "all"
      ? WORK_ITEMS
      : WORK_ITEMS.filter((item) => item.category === active);

  const gridRef = useRef<HTMLDivElement>(null);
  const { getOpacity, isFocused, setTileRef } = useScrollFocus(filtered, gridRef);

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
          ref={gridRef}
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 md:pb-24"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              ref={(el) => setTileRef(item.id, el)}
              layout
              initial={{ opacity: 0 }}
              animate={{
                opacity: getOpacity(item.id),
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`group cursor-pointer ${
                item.wide && filtered.length > 3
                  ? "col-span-2"
                  : ""
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="overflow-hidden">
                <WorkCard item={item} isFocused={isFocused(item.id)} />
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
          ))}
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
