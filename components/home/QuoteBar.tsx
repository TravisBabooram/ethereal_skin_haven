"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function QuoteBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px clamp(24px, 5vw, 64px)", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative rule */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ height: 1, width: 48, background: "linear-gradient(to right, transparent, var(--gold))" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", opacity: 0.7 }} />
            <div style={{ height: 1, width: 48, background: "linear-gradient(to left, transparent, var(--gold))" }} />
          </div>

          <p style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "clamp(20px, 3.5vw, 32px)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--text)",
            lineHeight: 1.6,
            margin: "0 0 24px",
          }}>
            "Every treatment is results-driven and professionally executed —<br />
            in a calm, luxurious space designed just for you."
          </p>

          <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>
            Ethereal Skin Haven · Couva, Trinidad
          </p>
        </motion.div>
      </div>
    </section>
  );
}
