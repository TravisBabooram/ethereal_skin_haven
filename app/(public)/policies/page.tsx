"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Policy {
  id: string;
  title: string;
  content: string;
  type: string;
}

const LATE_FEE_TYPES = ["late_arrival"];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/policies")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPolicies(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const parseContent = (content: string): string[] => {
    try { return JSON.parse(content); }
    catch { return content.split("\n").filter(Boolean); }
  };

  return (
    <>
      <section className="page-hero" style={{ background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
        <AnimatedSection style={{ position: "relative", maxWidth: 600, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Transparency First</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.1 }}>
            Studio Policies
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)" }}>
            Please read our policies carefully before booking. These guidelines ensure a respectful and professional experience for everyone.
          </p>
        </AnimatedSection>
      </section>

      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "80px 0", color: "var(--text-muted)" }}>
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13 }}>Loading policies…</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              {policies.map((policy, i) => (
                <AnimatedSection key={policy.id} delay={i * 0.05}>
                  <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 32, position: "relative" }}>
                    <div style={{ position: "absolute", top: 6, left: -5, width: 9, height: 9, borderRadius: "50%", background: "var(--gold)", border: "2px solid var(--bg)" }} />
                    <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, fontWeight: 400, color: "var(--text)", margin: "0 0 20px" }}>{policy.title}</h2>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {parseContent(policy.content).map((item, j) => (
                        <li key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 9 }} />
                          <span style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-muted)" }}>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Late fee summary for late arrival policy */}
                    {LATE_FEE_TYPES.includes(policy.type) && (
                      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[
                          { time: "10 min late", fee: "$30 TTD" },
                          { time: "20 min late", fee: "$60 TTD" },
                          { time: "30 min late", fee: "Cancelled" },
                        ].map(({ time, fee }) => (
                          <div key={time} style={{ padding: "14px", border: "1px solid var(--border)", borderRadius: 4, background: "var(--bg-card)", textAlign: "center" }}>
                            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 6px" }}>{time}</p>
                            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: fee === "Cancelled" ? "#e05555" : "var(--gold)", margin: 0, fontWeight: 500 }}>{fee}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 64, padding: "44px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
              <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 24, color: "var(--text)", margin: "0 0 10px", fontWeight: 400 }}>Questions about our policies?</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 24px" }}>We&apos;re happy to clarify anything before you book.</p>
              <a href="https://wa.me/18687057023" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2 }}>
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
