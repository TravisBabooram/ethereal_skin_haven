"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const KEY = "esh_cookies_accepted";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 260, delay: 1.2 }}
          style={{
            position: "fixed",
            bottom: 24,
            left: 16,
            right: 16,
            zIndex: 200,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{
            width: "100%",
            maxWidth: 700,
            pointerEvents: "auto",
            background: "var(--bg-glass)",
            backdropFilter: "blur(32px) saturate(160%)",
            WebkitBackdropFilter: "blur(32px) saturate(160%)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "clamp(14px, 3vw, 20px) clamp(16px, 4vw, 28px)",
            boxShadow:
              "0 20px 64px rgba(0,0,0,0.45)," +
              "0 0 0 1px rgba(201,169,110,0.12)," +
              "inset 0 1px 0 rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 3vw, 22px)",
            flexWrap: "wrap",
          }}>

            {/* Icon */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "rgba(201,169,110,0.08)",
              border: "1px solid rgba(201,169,110,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Cookie size={15} style={{ color: "var(--gold)" }} />
            </div>

            {/* Text */}
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, margin: 0, flex: 1, minWidth: 200 }}>
              We use an authentication cookie to keep you signed in and personalise your experience. No tracking or advertising cookies are used.{" "}
              <Link
                href="/policies#cookie-policy"
                style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid rgba(201,169,110,0.35)", paddingBottom: 1 }}
              >
                Cookie Policy
              </Link>
            </p>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
              <Link
                href="/policies"
                style={{
                  padding: "9px 16px", fontSize: 9, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                  textDecoration: "none", border: "1px solid var(--border)",
                  borderRadius: 3, whiteSpace: "nowrap",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                Learn More
              </Link>
              <button
                onClick={accept}
                style={{
                  padding: "9px 22px", fontSize: 9, letterSpacing: "0.2em",
                  textTransform: "uppercase", fontWeight: 700,
                  color: "#080808",
                  background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                  border: "none", borderRadius: 3, cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 16px rgba(201,169,110,0.28)",
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
