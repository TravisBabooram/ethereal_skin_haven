"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, MapPin, CalendarCheck } from "lucide-react";

const info = [
  { icon: Calendar,      value: "Tue – Sat",            label: "Open five days a week" },
  { icon: Clock,         value: "9 AM – 6 PM",          label: "Business hours" },
  { icon: MapPin,        value: "Couva, Trinidad",       label: "Balisier Avenue" },
  { icon: CalendarCheck, value: "By Appointment",        label: "Book to secure your slot" },
];

export default function BusinessInfoBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {info.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: "36px 28px",
                textAlign: "center",
                borderRight: i < info.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Icon size={18} style={{ color: "var(--gold)", opacity: 0.8 }} />
              <div>
                <p style={{
                  fontFamily: "var(--font-cormorant, Georgia, serif)",
                  fontSize: "clamp(16px, 2vw, 20px)",
                  fontWeight: 400,
                  color: "var(--text)",
                  margin: "0 0 4px",
                  lineHeight: 1.2,
                }}>{value}</p>
                <p style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--text-muted)", textTransform: "uppercase", margin: 0 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
