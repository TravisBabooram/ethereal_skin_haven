"use client";

import AnimatedSection from "./AnimatedSection";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeader({ eyebrow, title, subtitle, align = "center" }: Props) {
  const isCenter = align === "center";
  return (
    <div style={{ textAlign: isCenter ? "center" : "left", marginBottom: "clamp(36px, 6vw, 64px)" }}>
      {eyebrow && (
        <AnimatedSection delay={0}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: isCenter ? "center" : "flex-start", marginBottom: 16 }}>
            <span style={{ display: "block", height: 1, width: 36, background: "linear-gradient(90deg, transparent, var(--gold))" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.4em", color: "var(--gold)", textTransform: "uppercase", fontFamily: "var(--font-sans, system-ui)", fontWeight: 600 }}>{eyebrow}</span>
            <span style={{ display: "block", height: 1, width: 36, background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          </div>
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.1}>
        <h2 style={{
          fontFamily: "var(--font-cormorant, Georgia, serif)",
          fontSize: "clamp(36px, 5vw, 58px)",
          fontWeight: 300,
          lineHeight: 1.1,
          color: "var(--text)",
          margin: 0,
          letterSpacing: "-0.01em",
        }}>
          {title}
        </h2>
      </AnimatedSection>
      {subtitle && (
        <AnimatedSection delay={0.2}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", maxWidth: 560, margin: isCenter ? "20px auto 0" : "20px 0 0" }}>
            {subtitle}
          </p>
        </AnimatedSection>
      )}
    </div>
  );
}
