"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface Props {
  page: "Products" | "Gallery";
}

const TAPE_GOLD =
  "repeating-linear-gradient(90deg," +
  "#C89260 0px,#C89260 38px," +
  "rgba(0,0,0,0.45) 38px,rgba(0,0,0,0.45) 42px," +
  "#EAC84A 42px,#EAC84A 80px," +
  "rgba(0,0,0,0.45) 80px,rgba(0,0,0,0.45) 84px)";

const TAPE_PINK =
  "repeating-linear-gradient(90deg," +
  "#F42870 0px,#F42870 38px," +
  "rgba(0,0,0,0.45) 38px,rgba(0,0,0,0.45) 42px," +
  "#FF5C90 42px,#FF5C90 80px," +
  "rgba(0,0,0,0.45) 80px,rgba(0,0,0,0.45) 84px)";

const TAPE_W = "220vmax";
const TAPE_H = 68;

const MSG: Record<Props["page"], string> = {
  Products: "We're carefully curating our collection. Our products will be ready for you very soon.",
  Gallery:  "We're building something beautiful. Our gallery will showcase our work shortly.",
};

export default function ComingSoon({ page }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse 65% 45% at 20% 25%, rgba(212,168,44,0.07) 0%, transparent 60%)," +
          "radial-gradient(ellipse 55% 40% at 80% 75%, rgba(244,40,112,0.07) 0%, transparent 60%)",
      }} />

      {/* ── Gold tape ─ slides in from left ─────────────────── */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -(TAPE_H / 2),
        marginLeft: `calc(-${TAPE_W} / 2)`,
        width: TAPE_W,
        height: TAPE_H,
        transform: "rotate(-34deg)",
        transformOrigin: "center",
        overflow: "hidden",
        pointerEvents: "none",
        boxShadow: "0 6px 40px rgba(0,0,0,0.55), 0 0 24px rgba(212,168,44,0.25)",
        zIndex: 1,
      }}>
        <motion.div
          initial={{ x: `-${TAPE_W}` }}
          animate={{ x: "0%" }}
          transition={{ type: "spring", stiffness: 52, damping: 17, delay: 0.05 }}
          className="tape-scroll-fwd"
          style={{ width: "100%", height: "100%", background: TAPE_GOLD, backgroundSize: "84px 100%" }}
        />
      </div>

      {/* ── Pink tape ─ slides in from right ────────────────── */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -(TAPE_H / 2),
        marginLeft: `calc(-${TAPE_W} / 2)`,
        width: TAPE_W,
        height: TAPE_H,
        transform: "rotate(34deg)",
        transformOrigin: "center",
        overflow: "hidden",
        pointerEvents: "none",
        boxShadow: "0 6px 40px rgba(0,0,0,0.55), 0 0 24px rgba(244,40,112,0.25)",
        zIndex: 1,
      }}>
        <motion.div
          initial={{ x: TAPE_W }}
          animate={{ x: "0%" }}
          transition={{ type: "spring", stiffness: 52, damping: 17, delay: 0.2 }}
          className="tape-scroll-rev"
          style={{ width: "100%", height: "100%", background: TAPE_PINK, backgroundSize: "84px 100%" }}
        />
      </div>

      {/* ── Center card ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1], delay: 0.55 }}
        style={{
          position: "relative",
          zIndex: 10,
          background: "var(--bg-glass)",
          backdropFilter: "blur(36px) saturate(160%)",
          WebkitBackdropFilter: "blur(36px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "clamp(36px, 6vw, 56px) clamp(28px, 6vw, 56px)",
          textAlign: "center",
          maxWidth: 420,
          width: "calc(100% - 40px)",
          boxShadow:
            "0 0 0 1px rgba(212,168,44,0.14)," +
            "0 32px 80px rgba(0,0,0,0.60)," +
            "0 0 64px rgba(244,40,112,0.07)," +
            "0 0 32px rgba(212,168,44,0.07)," +
            "inset 0 1px 0 rgba(255,255,255,0.09)",
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-flex", marginBottom: 20 }}
        >
          <Sparkles size={22} style={{ color: "var(--gold)" }} />
        </motion.div>

        {/* Label */}
        <p style={{
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "var(--pink)",
          marginBottom: 14,
          fontWeight: 600,
        }}>
          Coming Soon
        </p>

        {/* Page name */}
        <h1 style={{
          fontFamily: "var(--font-cormorant, Georgia, serif)",
          fontSize: "clamp(30px, 5vw, 42px)",
          fontWeight: 300,
          color: "var(--text)",
          margin: "0 0 20px",
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
        }}>
          {page}
        </h1>

        {/* Divider */}
        <div style={{
          width: 48,
          height: 1,
          margin: "0 auto 24px",
          background: "linear-gradient(90deg, transparent, var(--pink) 35%, var(--gold) 65%, transparent)",
        }} />

        {/* Message */}
        <p style={{
          fontSize: 14,
          color: "var(--text-muted)",
          lineHeight: 1.75,
          marginBottom: 36,
        }}>
          {MSG[page]}
        </p>

        {/* CTA */}
        <Link
          href="/"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 30px",
            border: "1px solid var(--gold)",
            borderRadius: 4,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 500,
            background: hover ? "var(--gold)" : "transparent",
            color: hover ? "var(--bg)" : "var(--gold)",
            transition: "background 0.3s cubic-bezier(0.23,1,0.32,1), color 0.3s cubic-bezier(0.23,1,0.32,1)",
            boxShadow: hover ? "0 0 24px rgba(212,168,44,0.35)" : "none",
          }}
        >
          <ArrowLeft size={12} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
