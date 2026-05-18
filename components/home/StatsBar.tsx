"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, ShieldCheck, Package, Heart } from "lucide-react";

const pillars = [
  { icon: Target,      value: "Results-Driven",      label: "Visible skin change, every visit" },
  { icon: ShieldCheck, value: "Hygiene First",        label: "Barbicide certified · single-use wax" },
  { icon: Package,     value: "Pro-Grade Products",   label: "Esthemax · Starpil · Bushbalm" },
  { icon: Heart,       value: "Personalised Care",    label: "Tailored to your skin, every time" },
];

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {pillars.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: "40px 28px",
                textAlign: "center",
                borderRight: i < pillars.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,169,110,0.06)" }}>
                <Icon size={16} style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p style={{
                  fontFamily: "var(--font-cormorant, Georgia, serif)",
                  fontSize: "clamp(17px, 2.2vw, 22px)",
                  fontWeight: 400,
                  background: "linear-gradient(120deg, var(--gold-dark), var(--gold-light))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: "0 0 5px",
                  lineHeight: 1.2,
                }}>{value}</p>
                <p style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
