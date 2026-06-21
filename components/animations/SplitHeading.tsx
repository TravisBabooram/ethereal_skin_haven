"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4";
  style?: React.CSSProperties;
  className?: string;
  delay?: number;
}

export default function SplitHeading({ text, as: Tag = "h2", style, className, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" });

  // Split into words — each word's chars stagger, but words keep natural spacing
  const words = text.split(" ");
  let charIndex = 0;

  return (
    // @ts-expect-error — dynamic tag
    <Tag ref={ref} style={{ ...style, display: "block" }} className={className} aria-label={text}>
      {words.map((word, wi) => {
        const chars = word.split("");
        const wordStart = charIndex;
        charIndex += chars.length + 1; // +1 for the space

        return (
          <span key={wi} style={{ display: "inline-block", overflow: "hidden", marginRight: wi < words.length - 1 ? "0.3em" : 0 }}>
            {chars.map((char, ci) => (
              <motion.span
                key={ci}
                initial={{ y: "110%", opacity: 0 }}
                animate={inView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  duration: 0.55,
                  delay: delay + (wordStart + ci) * 0.022,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
