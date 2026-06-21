"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import HeroCanvas from "./HeroCanvas";
import MagneticButton from "@/components/animations/MagneticButton";
import GoldShimmer from "@/components/animations/GoldShimmer";

const WORDS = ["Radiant", "Luminous", "Elevated", "Ethereal"];

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const wordRef = useRef<HTMLSpanElement>(null);

  // DOM refs for parallax — direct style mutation, zero React re-renders
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // Cycling word animation
  useEffect(() => {
    let i = 0;
    const cycle = () => {
      if (wordRef.current) {
        wordRef.current.style.opacity = "0";
        wordRef.current.style.transform = "translateY(12px)";
        setTimeout(() => {
          if (wordRef.current) {
            i = (i + 1) % WORDS.length;
            wordRef.current.textContent = WORDS[i];
            wordRef.current.style.opacity = "1";
            wordRef.current.style.transform = "translateY(0)";
          }
        }, 400);
      }
    };
    const id = setInterval(cycle, 3000);
    return () => clearInterval(id);
  }, []);

  // Parallax — mutates DOM directly, never touches React state
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || window.innerWidth < 768) return;

    const onMove = (e: MouseEvent) => {
      mouseTarget.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      const tx = mouseTarget.current.x;
      const ty = mouseTarget.current.y;
      const cx = lerp(mouseCurrent.current.x, tx, 0.055);
      const cy = lerp(mouseCurrent.current.y, ty, 0.055);
      mouseCurrent.current = { x: cx, y: cy };

      // Apply transforms directly — no setState, no re-render
      if (contentRef.current)
        contentRef.current.style.transform = `translate(${cx * -6}px, ${cy * -4}px)`;
      if (headingRef.current)
        headingRef.current.style.transform = `translate(${cx * -10}px, ${cy * -7}px)`;
      if (orb1Ref.current)
        orb1Ref.current.style.transform = `translate(${cx * -18}px, ${cy * -14}px)`;
      if (orb2Ref.current)
        orb2Ref.current.style.transform = `translate(${cx * 14}px, ${cy * 18}px)`;
      if (orb3Ref.current)
        orb3Ref.current.style.transform = `translate(${cx * -10}px, ${cy * -22}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

      {/* Layer 0 — Background gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: isDark
          ? "radial-gradient(ellipse 90% 70% at 50% -5%, rgba(212,168,44,0.08) 0%, rgba(244,40,112,0.04) 40%, transparent 70%), var(--bg)"
          : "radial-gradient(ellipse 90% 70% at 50% -5%, rgba(192,144,32,0.07) 0%, rgba(232,0,96,0.04) 40%, transparent 70%), var(--bg)",
        transition: "background 0.65s ease",
      }} />

      {/* Layer 1 — Canvas gold dust particles (immediate, zero deps) */}
      <HeroCanvas isDark={isDark} />

      {/* Layer 2 — Floating soft orbs with parallax (refs, no re-renders) */}
      <motion.div ref={orb1Ref}
        style={{
          position: "absolute", top: "14%", left: "8%",
          width: "clamp(220px, 30vw, 380px)", height: "clamp(220px, 30vw, 380px)",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(212,168,44,0.09) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(192,144,32,0.07) 0%, transparent 70%)",
          filter: "blur(48px)", pointerEvents: "none", zIndex: 1,
        }}
        animate={{ y: [0, -22, 0], x: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div ref={orb2Ref}
        style={{
          position: "absolute", bottom: "18%", right: "6%",
          width: "clamp(180px, 25vw, 320px)", height: "clamp(180px, 25vw, 320px)",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(244,40,112,0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(232,0,96,0.05) 0%, transparent 70%)",
          filter: "blur(56px)", pointerEvents: "none", zIndex: 1,
        }}
        animate={{ y: [0, 18, 0], x: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div ref={orb3Ref}
        style={{
          position: "absolute", top: "50%", left: "55%",
          width: "clamp(140px, 18vw, 240px)", height: "clamp(140px, 18vw, 240px)",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(212,168,44,0.05) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(192,144,32,0.04) 0%, transparent 70%)",
          filter: "blur(64px)", pointerEvents: "none", zIndex: 1,
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Thin vertical accent lines */}
      <div style={{ position: "absolute", left: "5%", top: "20%", bottom: "20%", width: 1, background: "linear-gradient(180deg, transparent, var(--gold), transparent)", opacity: 0.18, zIndex: 1 }} />
      <div style={{ position: "absolute", right: "5%", top: "30%", bottom: "30%", width: 1, background: "linear-gradient(180deg, transparent, var(--pink), transparent)", opacity: 0.12, zIndex: 1 }} />

      {/* Layer 4 — Hero content with parallax (ref-driven, no re-renders) */}
      <div
        ref={contentRef}
        className="hero-content"
        style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "140px 24px 80px", maxWidth: 900, width: "100%" }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 36 }}
        >
          <span style={{ height: 1, width: 50, background: "linear-gradient(90deg, transparent, var(--gold))", display: "block" }} />
          <GoldShimmer style={{ fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase", fontFamily: "var(--font-sans, system-ui)", fontWeight: 600 }}>
            Balisier Avenue, Couva · Trinidad
          </GoldShimmer>
          <span style={{ height: 1, width: 50, background: "linear-gradient(90deg, var(--gold), transparent)", display: "block" }} />
        </motion.div>

        {/* Main heading — deeper parallax depth (ref-driven) */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "clamp(42px, 9vw, 116px)",
            fontWeight: 300,
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}>
            The Art of{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ visibility: "hidden", userSelect: "none" }}>Luminous</span>
              <span
                ref={wordRef}
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
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
            <br />Skin
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
          style={{ fontSize: "clamp(14px, 1.8vw, 18px)", lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 52px", fontWeight: 300, letterSpacing: "0.02em" }}
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
          <MagneticButton>
            <Link
              href="/booking"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 40px",
                background: "linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 50%, var(--gold-dark) 100%)",
                color: "#080808", textDecoration: "none",
                fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600,
                borderRadius: 2, transition: "opacity 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0 8px 32px rgba(201,169,110,0.3)",
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.opacity = "0.88"; el.style.boxShadow = "0 16px 48px rgba(201,169,110,0.45)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.opacity = "1"; el.style.boxShadow = "0 8px 32px rgba(201,169,110,0.3)"; }}
            >
              Book Appointment <ArrowRight size={13} />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/services"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "15px 36px",
                border: "1px solid var(--border-hover)",
                color: "var(--text)", textDecoration: "none",
                fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 500,
                borderRadius: 2, transition: "border-color 0.3s ease, color 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; el.style.background = "var(--gold-glow)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--border-hover)"; el.style.color = "var(--text)"; el.style.background = "transparent"; }}
            >
              Explore Services
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 }}
      >
        <span style={{ fontSize: 8, letterSpacing: "0.4em", color: "var(--text-subtle)", textTransform: "uppercase" }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={14} style={{ color: "var(--gold)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
