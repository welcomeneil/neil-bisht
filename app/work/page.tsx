"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { WORK_ITEMS, type WorkCategory, type WorkItem } from "@/lib/work";
import WorkModal from "@/components/work-modal";

type Filter = WorkCategory | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "all" },
  { value: "tattoos", label: "tattoos" },
  { value: "drawings", label: "drawings" },
  { value: "software", label: "software" },
  { value: "design", label: "design" },
];

function WorkCard({
  item,
}: {
  item: (typeof WORK_ITEMS)[number];
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
          className="object-cover opacity-0 group-hover:opacity-90 transition-opacity duration-500 ease-in-out mix-blend-multiply"
        />
      )}
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState<Filter>("all");
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  const filtered =
    active === "all"
      ? WORK_ITEMS
      : WORK_ITEMS.filter((item) => item.category === active);

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
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 md:pb-24"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                <WorkCard item={item} />
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
