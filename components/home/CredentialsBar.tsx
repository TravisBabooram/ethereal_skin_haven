"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award } from "lucide-react";

const credentials = [
  "Licensed Esthetician",
  "Barbicide Certified",
  "Circadia Trained",
  "M.A.D Skincare Workshop",
  "Starpil Certified",
  "Esthemax Certified",
];

export default function CredentialsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 16 }}>
            <Award size={13} style={{ color: "var(--gold)" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Credentials</span>
          </div>

          {credentials.map((cred, i) => (
            <motion.span
              key={cred}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                border: "1px solid var(--border)",
                borderRadius: 2,
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
              {cred}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
