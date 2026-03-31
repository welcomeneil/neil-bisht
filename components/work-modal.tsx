"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { WorkItem } from "@/lib/work";

export default function WorkModal({
  item,
  onClose,
}: {
  item: WorkItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (item) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Centered panel */}
          <div className="relative h-full flex items-center justify-center p-4 md:p-12 pointer-events-none">
            <motion.div
              className="pointer-events-auto bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto overscroll-contain flex flex-col flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Image */}
                <div
                  className="relative w-full aspect-[16/9] overflow-hidden shrink-0"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="px-7 md:px-10 py-8 flex flex-col gap-7">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-warm-border pb-7">
                    <div>
                      <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-accent block mb-2">
                        {item.category}
                      </span>
                      <h2 className="font-display text-[28px] md:text-[32px] italic font-light leading-tight text-foreground">
                        {item.title}
                      </h2>
                    </div>
                    <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-muted shrink-0 mt-1">
                      {item.year}
                    </span>
                  </div>

                  {item.details && (
                    <>
                      {/* Overview */}
                      <div className="flex flex-col gap-2">
                        <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                          Overview
                        </span>
                        <p className="font-display text-[18px] font-light leading-[1.8] text-foreground">
                          {item.details.overview}
                        </p>
                      </div>

                      {/* Role */}
                      <div className="flex flex-col gap-2 border-t border-warm-border pt-7">
                        <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                          My Role
                        </span>
                        <p className="font-display text-[18px] font-light leading-[1.8] text-foreground">
                          {item.details.role}
                        </p>
                      </div>

                      {/* Learnings */}
                      {item.details.learnings && (
                        <div className="flex flex-col gap-2 border-t border-warm-border pt-7 pb-2">
                          <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                            What I Learned
                          </span>
                          <p className="font-display text-[18px] font-light leading-[1.8] text-foreground">
                            {item.details.learnings}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Mobile close button — sticky at bottom of scroll area */}
                <div className="md:hidden sticky bottom-0 flex justify-end px-7 pb-6 pt-10 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none">
                  <button
                    onClick={onClose}
                    className="pointer-events-auto font-sans text-[11px] tracking-[0.12em] uppercase text-muted hover:text-foreground transition-colors duration-200 bg-background border border-warm-border rounded-full px-4 py-2"
                  >
                    Return
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
