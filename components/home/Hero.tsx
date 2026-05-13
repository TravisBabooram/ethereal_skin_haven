"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const floatAnim = (delay: number, x: number, y: number) => ({
  y: [0, y, 0] as number[],
  x: [0, x, 0] as number[],
  transition: { duration: 8 + delay, repeat: Infinity, repeatType: "mirror" as const, delay },
});

export default function Hero() {
  const words = ["Radiant", "Luminous", "Elevated", "Ethereal"];
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let i = 0;
    const cycle = () => {
      if (wordRef.current) {
        wordRef.current.style.opacity = "0";
        wordRef.current.style.transform = "translateY(12px)";
        setTimeout(() => {
          if (wordRef.current) {
            i = (i + 1) % words.length;
            wordRef.current.textContent = words[i];
            wordRef.current.style.opacity = "1";
            wordRef.current.style.transform = "translateY(0)";
          }
        }, 400);
      }
    };
    const id = setInterval(cycle, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Background — set HERO_BG_IMAGE to a Cloudinary URL when a hero photo is ready */}
      {(() => {
        const HERO_BG_IMAGE = "";
        return HERO_BG_IMAGE ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_BG_IMAGE} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.18 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--bg) 0%, transparent 30%, transparent 70%, var(--bg) 100%)" }} />
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% -10%, rgba(201,169,110,0.06) 0%, transparent 70%), var(--bg)" }} />
        );
      })()}

      {/* Floating orbs */}
      <motion.div animate={floatAnim(0, 12, -18)} style={{ position: "absolute", top: "18%", left: "10%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <motion.div animate={floatAnim(2, -10, 20)} style={{ position: "absolute", bottom: "20%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
      <motion.div animate={floatAnim(1.5, 8, -12)} style={{ position: "absolute", top: "55%", left: "50%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", translateX: "-50%" }} />

      {/* Thin gold vertical line — left */}
      <div style={{ position: "absolute", left: "5%", top: "20%", bottom: "20%", width: 1, background: "linear-gradient(180deg, transparent, var(--gold), transparent)", opacity: 0.2 }} />

      {/* Content */}
      <div className="hero-content" style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "140px 24px 80px", maxWidth: 900, width: "100%" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 36 }}
        >
          <span style={{ height: 1, width: 50, background: "linear-gradient(90deg, transparent, var(--gold))", display: "block" }} />
          <span style={{ fontSize: 9, letterSpacing: "0.5em", color: "var(--gold)", textTransform: "uppercase", fontFamily: "var(--font-sans, system-ui)", fontWeight: 600 }}>
            Balisier Avenue, Couva · Trinidad
          </span>
          <span style={{ height: 1, width: 50, background: "linear-gradient(90deg, var(--gold), transparent)", display: "block" }} />
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "clamp(42px, 9vw, 110px)",
            fontWeight: 300,
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}>
            The Art of{" "}
            {/*
              Ghost + overlay pattern: the invisible ghost span always holds
              "Luminous" (the longest word) to lock the line width, while the
              visible cycling span sits on top of it absolutely positioned.
              This prevents any layout shift when words change.
            */}
            <span style={{ position: "relative", display: "inline-block" }}>
              {/* Ghost — defines width, never visible */}
              <span style={{ visibility: "hidden", userSelect: "none" }}>Luminous</span>
              {/* Cycling word — absolutely overlaid, centred in the ghost */}
              <span
                ref={wordRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(120deg, var(--gold-dark), var(--gold-light), var(--gold-dark))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  opacity: 1,
                }}
              >
                Radiant
              </span>
            </span>
            <br />
            Skin
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", margin: "40px auto", width: "60%", transformOrigin: "center" }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 52px", fontWeight: 300, letterSpacing: "0.02em" }}
        >
          High quality esthetic services — waxing, facials, vajacials, brow work & more. Where healthy, radiant skin is always the priority.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}
        >
          <Link
            href="/booking"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px",
              background: "linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 50%, var(--gold-dark) 100%)",
              color: "#080808",
              textDecoration: "none",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 600,
              borderRadius: 2,
              transition: "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 8px 32px rgba(201,169,110,0.3)",
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.opacity = "0.88"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 48px rgba(201,169,110,0.4)"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.opacity = "1"; el.style.transform = "none"; el.style.boxShadow = "0 8px 32px rgba(201,169,110,0.3)"; }}
          >
            Book Appointment
            <ArrowRight size={13} />
          </Link>
          <Link
            href="/services"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "15px 36px",
              border: "1px solid var(--border-hover)",
              color: "var(--text)",
              textDecoration: "none",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 500,
              borderRadius: 2,
              transition: "border-color 0.3s ease, color 0.3s ease, background 0.3s ease",
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; el.style.background = "var(--gold-glow)"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--border-hover)"; el.style.color = "var(--text)"; el.style.background = "transparent"; }}
          >
            Explore Services
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <span style={{ fontSize: 8, letterSpacing: "0.4em", color: "var(--text-subtle)", textTransform: "uppercase" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={14} style={{ color: "var(--gold)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
