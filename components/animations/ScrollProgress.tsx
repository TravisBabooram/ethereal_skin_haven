"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Only show on public-facing pages
  const hide = pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/register");
  if (hide) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light))",
        transformOrigin: "0%",
        scaleX,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
