"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "12+", label: "Years of Excellence" },
  { value: "30+", label: "Signature Treatments" },
  { value: "100%", label: "Premium Products" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: "44px 32px",
                textAlign: "center",
                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <p style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 300,
                background: "linear-gradient(120deg, var(--gold-dark), var(--gold-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: "0 0 8px",
                lineHeight: 1,
              }}>{value}</p>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", margin: 0, fontWeight: 500 }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

        </section>
  );
}
