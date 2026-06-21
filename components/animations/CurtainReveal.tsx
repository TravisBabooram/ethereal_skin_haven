"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: "left" | "right";
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Reveals content by sliding a gold curtain away on scroll-into-view.
 * The content also has a subtle scale-down effect as it reveals.
 */
export default function CurtainReveal({ children, delay = 0, direction = "right", style, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden", ...style }} className={className}>
      {/* Content — slightly zoomed, normalises as curtain lifts */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={inView ? { scale: 1 } : { scale: 1.08 }}
        transition={{ duration: 0.85, delay: delay + 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        {children}
      </motion.div>

      {/* Gold curtain */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 0.72, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 60%, var(--gold-light) 100%)",
          transformOrigin: direction === "right" ? "left center" : "right center",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
