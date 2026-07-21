"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  displayImage,
  formatSnapshotDate,
  getSnapshots,
  isWip,
  latestSnapshot,
  type Snapshot,
  type WorkItem,
} from "@/lib/work";
import TechStack from "@/components/tech-stack";
import TimeAgo from "@/components/time-ago";

export default function WorkModal({
  item,
  onClose,
}: {
  item: WorkItem | null;
  onClose: () => void;
}) {
  // The snapshot currently opened full-screen, like checking out a commit.
  const [zoomed, setZoomed] = useState<Snapshot | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Esc backs out of the zoomed image first, then out of the modal.
      if (zoomed) setZoomed(null);
      else onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, zoomed]);

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
                  className="relative w-full max-h-[45vh] overflow-hidden shrink-0"
                  style={{
                    background: item.revealGradient ?? item.bg,
                    aspectRatio:
                      item.aspect === "portrait"
                        ? "3/4"
                        : item.aspect === "square"
                          ? "1/1"
                          : "16/9",
                  }}
                >
                  {displayImage(item) && (
                    <Image
                      src={displayImage(item)!}
                      alt={item.title}
                      fill
                      className="object-contain"
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
                      {isWip(item) && latestSnapshot(item) && (
                        <p className="font-sans text-[11px] tracking-wide text-accent mt-2">
                          in progress ·{" "}
                          <TimeAgo date={latestSnapshot(item)!.date} />
                        </p>
                      )}
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
                        <p className="font-display text-[18px] font-light leading-[1.8] text-foreground whitespace-pre-wrap">
                          {item.details.overview}
                        </p>
                      </div>

                      {/* Role */}
                      <div className="flex flex-col gap-2 border-t border-warm-border pt-7">
                        <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                          {item.category === "drawings" || item.category === "tattoos" ? "intent" : "approach"}
                        </span>
                        <p className="font-display text-[18px] font-light leading-[1.8] text-foreground whitespace-pre-wrap">
                          {item.details.role}
                        </p>
                        {item.stack && item.stack.length > 0 && (
                          <div className="mt-4">
                            <TechStack items={item.stack} />
                          </div>
                        )}
                      </div>

                      {/* Learnings */}
                      {item.details.learnings && (
                        <div className="flex flex-col gap-2 border-t border-warm-border pt-7 pb-2">
                          <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                            What I Learned
                          </span>
                          <p className="font-display text-[18px] font-light leading-[1.8] text-foreground whitespace-pre-wrap">
                            {item.details.learnings}
                          </p>
                        </div>
                      )}

                      {/* Client endorsement */}
                      {item.details.endorsement && (
                        <div className="flex flex-col gap-2 border-t border-warm-border pt-7 pb-2">
                          <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                            From the Client
                          </span>
                          <blockquote className="font-display text-[18px] font-light italic leading-[1.8] text-foreground whitespace-pre-wrap">
                            &ldquo;{item.details.endorsement.quote}&rdquo;
                          </blockquote>
                          <p className="font-sans text-[12px] tracking-wide text-muted">
                            — {item.details.endorsement.name}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Snapshots — newest first */}
                  {getSnapshots(item).length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-warm-border pt-7 pb-2">
                      <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted">
                        Snapshots
                      </span>
                      <ol className="flex flex-col mt-1">
                        {getSnapshots(item)
                          .slice()
                          .reverse()
                          .map((snap) => (
                            <li
                              key={snap.date + snap.imageUrl}
                              className="border-b border-warm-border last:border-0"
                            >
                              <button
                                type="button"
                                onClick={() => setZoomed(snap)}
                                className="group/snap w-full text-left flex gap-4 py-4 cursor-pointer"
                              >
                                <div
                                  className="relative w-16 h-16 shrink-0 overflow-hidden rounded-sm ring-1 ring-transparent group-hover/snap:ring-foreground/25 transition-[box-shadow] duration-200"
                                  style={{ background: item.bg }}
                                >
                                  <Image
                                    src={snap.imageUrl}
                                    alt=""
                                    fill
                                    sizes="64px"
                                    className="object-cover mix-blend-multiply"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted">
                                    {formatSnapshotDate(snap.date)}
                                  </p>
                                  <p className="font-display text-[17px] font-light leading-[1.6] text-foreground mt-1 group-hover/snap:text-accent transition-colors duration-200">
                                    {snap.message}
                                  </p>
                                  {snap.note && (
                                    <p className="font-sans text-[12px] leading-[1.7] text-muted mt-2">
                                      {snap.note}
                                    </p>
                                  )}
                                </div>
                              </button>
                            </li>
                          ))}
                      </ol>
                    </div>
                  )}

                  {/* External links */}
                  {(item.link || item.repo) && (
                    <div className="border-t border-warm-border pt-7 pb-2 flex flex-col gap-3">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-[12px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
                        >
                          {item.link.includes("instagram.com")
                            ? "view on instagram →"
                            : item.link.includes("github.com")
                              ? "view on github →"
                              : "visit live site →"}
                        </a>
                      )}
                      {item.repo && (
                        <a
                          href={item.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-[12px] tracking-wide text-muted hover:text-foreground transition-colors duration-200"
                        >
                          view source on github →
                        </a>
                      )}
                    </div>
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

          {/* Snapshot lightbox — the full image at that point in time */}
          <AnimatePresence>
            {zoomed && (
              <motion.div
                key="snapshot-lightbox"
                className="absolute inset-0 z-[60] bg-foreground/85 backdrop-blur-md flex items-center justify-center p-6 md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed(null);
                }}
              >
                <button
                  type="button"
                  aria-label="close image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomed(null);
                  }}
                  className="absolute top-5 right-5 font-sans text-[11px] tracking-[0.12em] uppercase text-background/70 hover:text-background transition-colors duration-200"
                >
                  close
                </button>
                <div
                  className="relative w-full max-w-4xl h-[80vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={zoomed.imageUrl}
                    alt={zoomed.message}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
