"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const verbs = ["makes", "builds", "creates", "designs", "draws", "tattoos", "ships"];

const AUTO_CYCLE_MS = 3800;

export default function CyclingVerb() {
  const [index, setIndex] = useState(0);
  // Bumped on manual interaction to restart the auto-cycle timer so a tap/hover
  // doesn't immediately get followed by an automatic tick.
  const [resetKey, setResetKey] = useState(0);
  const reduceMotion = useReducedMotion();

  const advance = () => {
    setIndex((i) => (i + 1) % verbs.length);
    setResetKey((k) => k + 1);
  };

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % verbs.length);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(id);
  }, [resetKey, reduceMotion]);

  return (
    <span
      className="inline-block cursor-default underline decoration-dotted underline-offset-8 decoration-foreground/30 md:no-underline"
      onMouseEnter={advance}
      onClick={advance}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={verbs[index]}
          initial={{ opacity: 0, filter: "blur(3px)", y: 4 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(3px)", y: -4 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="inline-block"
        >
          {verbs[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
