"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function HomeCTA() {
  return (
    <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
      {/* Decorative elements */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "120px 32px", textAlign: "center", position: "relative" }}>
        <AnimatedSection>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 28 }}>
            <span style={{ height: 1, width: 40, background: "linear-gradient(90deg, transparent, var(--gold))", display: "block" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Begin Your Journey</span>
            <span style={{ height: 1, width: 40, background: "linear-gradient(90deg, var(--gold), transparent)", display: "block" }} />
          </div>

          <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.1 }}>
            Your Skin Deserves<br />
            <span style={{ fontStyle: "italic", background: "linear-gradient(120deg, var(--gold-dark), var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              The Extraordinary
            </span>
          </h2>

          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto 52px" }}>
            Reserve your appointment today and take the first step toward skin that radiates confidence, health, and undeniable luminosity.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            <Link
              href="/booking"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 44px",
                background: "linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-dark))",
                color: "#080808", textDecoration: "none",
                fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600,
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(201,169,110,0.3)",
                transition: "opacity 0.3s, transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.opacity = "0.88"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 48px rgba(201,169,110,0.4)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.opacity = "1"; el.style.transform = "none"; el.style.boxShadow = "0 8px 32px rgba(201,169,110,0.3)"; }}
            >
              Book Your Session <ArrowRight size={13} />
            </Link>
            <Link
              href="/contact"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              Get in Touch
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
