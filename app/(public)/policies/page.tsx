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

          {/* ── Static legal sections ──────────────────────── */}
          {!loading && (
            <>
              <AnimatedSection delay={0.1}>
                <div id="cookie-policy" style={{ borderLeft: "1px solid var(--border)", paddingLeft: 32, position: "relative" }}>
                  <div style={{ position: "absolute", top: 6, left: -5, width: 9, height: 9, borderRadius: "50%", background: "var(--gold)", border: "2px solid var(--bg)" }} />
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, fontWeight: 400, color: "var(--text)", margin: "0 0 20px" }}>Cookie Policy</h2>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      "We use a single authentication cookie named token to keep you securely signed in across visits.",
                      "This cookie is httpOnly — it cannot be read or accessed by scripts running on the page, which protects your session from cross-site scripting attacks.",
                      "The cookie expires automatically after 7 days. Signing out removes it immediately.",
                      "We do not use any advertising, analytics, or third-party tracking cookies. No data is shared with advertisers.",
                      "We also use your browser's localStorage to remember your theme preference (light or dark) and to save booking progress so you don't lose your place mid-booking.",
                      "By clicking Accept on the cookie notice or by continuing to use this site, you consent to this use of cookies.",
                      "You can clear cookies at any time via your browser settings or by signing out of your account.",
                    ].map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 9 }} />
                        <span style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-muted)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <div id="terms-of-use" style={{ borderLeft: "1px solid var(--border)", paddingLeft: 32, position: "relative" }}>
                  <div style={{ position: "absolute", top: 6, left: -5, width: 9, height: 9, borderRadius: "50%", background: "var(--gold)", border: "2px solid var(--bg)" }} />
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, fontWeight: 400, color: "var(--text)", margin: "0 0 20px" }}>Terms of Use</h2>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      "By accessing or using this website, you agree to be bound by these Terms of Use and all policies listed on this page.",
                      "This site is operated by Ethereal Skin Haven. Services include professional esthetic treatments, product retail, and online appointment booking.",
                      "All bookings are subject to availability and require confirmation by our team before they are finalised. A booking request does not guarantee an appointment.",
                      "Our Cancellation, Refund, and Late Arrival policies apply to all appointments. By booking, you acknowledge and accept these terms.",
                      "We collect your name, email address, and phone number solely for the purpose of managing your bookings and communicating with you. This information is never sold or shared with third parties.",
                      "All prices are displayed in Trinidad and Tobago Dollars (TTD) and are subject to change without prior notice.",
                      "All content on this website — including photography, branding, copy, and design — is the property of Ethereal Skin Haven and may not be reproduced or used without written permission.",
                      "We are not liable for any adverse reactions arising from undisclosed medical conditions, allergies, or failure to follow post-treatment aftercare instructions provided by our esthetician.",
                      "We reserve the right to refuse service to any person at our discretion.",
                      "These terms may be updated at any time. Continued use of this website constitutes acceptance of any changes.",
                    ].map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 9 }} />
                        <span style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-muted)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </>
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
