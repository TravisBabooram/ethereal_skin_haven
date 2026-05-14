"use client";

import { useEffect, useState } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFaqs(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cats = ["All", ...Array.from(new Set(faqs.map(f => f.category)))];
  const filtered = cat === "All" ? faqs : faqs.filter(f => f.category === cat);

  return (
    <>
      <section className="page-hero" style={{ background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
        <AnimatedSection style={{ position: "relative", maxWidth: 600, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Knowledge Base</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.1 }}>
            Frequently Asked<br />
            <em style={{ fontStyle: "italic", background: "linear-gradient(120deg, var(--gold-dark), var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Questions</em>
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
            Everything you need to know about our services, booking process, and policies.
          </p>
        </AnimatedSection>
      </section>

      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "80px 0", color: "var(--text-muted)" }}>
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13 }}>Loading…</span>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
                {cats.map(c => (
                  <button key={c} onClick={() => { setCat(c); setOpen(null); }}
                    style={{ padding: "8px 20px", background: cat === c ? "var(--gold)" : "none", border: "1px solid " + (cat === c ? "var(--gold)" : "var(--border)"), color: cat === c ? "#080808" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "all 0.2s", fontWeight: cat === c ? 600 : 400 }}>
                    {c}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filtered.map((faq, i) => (
                  <AnimatedSection key={faq.id} delay={i * 0.03}>
                    <div style={{ borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
                      <button onClick={() => setOpen(open === faq.id ? null : faq.id)}
                        style={{ width: "100%", padding: "22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                        <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, flexShrink: 0, minWidth: 90 }}>{faq.category}</span>
                        <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 19, color: "var(--text)", flex: 1, textAlign: "left", lineHeight: 1.3 }}>{faq.question}</span>
                        <div style={{ width: 28, height: 28, border: "1px solid " + (open === faq.id ? "var(--gold)" : "var(--border)"), borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.2s" }}>
                          {open === faq.id ? <Minus size={12} style={{ color: "var(--gold)" }} /> : <Plus size={12} style={{ color: "var(--text-muted)" }} />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {open === faq.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                            <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-muted)", paddingBottom: 24, paddingLeft: 106, margin: 0 }}>{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </>
          )}

          <AnimatedSection delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 64, padding: "44px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
              <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, color: "var(--text)", margin: "0 0 10px", fontWeight: 400 }}>Still have questions?</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 24px" }}>WhatsApp us directly — we&apos;re happy to help.</p>
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
