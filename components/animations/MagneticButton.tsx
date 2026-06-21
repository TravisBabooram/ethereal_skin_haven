"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

interface Props {
  children: React.ReactNode;
  strength?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function MagneticButton({ children, strength = 0.35, style, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 16, mass: 0.6 });
  const y = useSpring(0, { stiffness: 180, damping: 16, mass: 0.6 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-flex", ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
