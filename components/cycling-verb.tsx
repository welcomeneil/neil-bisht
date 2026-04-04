"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const verbs = ["makes", "builds", "creates", "designs", "draws", "tattoos", "ships"];

export default function CyclingVerb() {
  const [index, setIndex] = useState(0);

  return (
    <span
      className="inline-block cursor-default underline decoration-dotted underline-offset-8 decoration-foreground/30 md:no-underline"
      onMouseEnter={() => setIndex((i) => (i + 1) % verbs.length)}
      onClick={() => setIndex((i) => (i + 1) % verbs.length)}
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
