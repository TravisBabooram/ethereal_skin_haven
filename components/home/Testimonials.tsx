"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, X, CheckCircle } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const reviews = [
  {
    name: "Verified Client",
    role: "March 2026 · ⭐⭐⭐⭐⭐",
    text: "I personally experienced some of the services rendered from this amazing young and talented woman today. I felt very safe and comfortable — the amenities were perfect. Snacks, air-conditioning, drinks and washroom facilities. Anything imaginable!",
    rating: 5,
  },
  {
    name: "Verified Client",
    role: "December 2025 · ⭐⭐⭐⭐⭐",
    text: "Absolutely exceptional service! Your expertise, guidance, and patience truly made a difference, and I appreciated every bit of advice you shared. The facial was amazing — so relaxing, refreshing, and done with real care. Overall, your service was a solid 10/10. I'm genuinely impressed and will definitely be recommending you to others.",
    rating: 5,
  },
  {
    name: "Verified Client",
    role: "January 2026 · ⭐⭐⭐⭐⭐",
    text: "Ethereal Skin Haven provides truly exceptional professional services. The environment is calm, clean, and welcoming, and the level of care and attention to detail is outstanding. Every step of the service felt thoughtful and personalised, with a clear focus on both comfort and results. I would highly recommend to anyone looking for high-quality, professional skincare services.",
    rating: 5,
  },
  {
    name: "Verified Client",
    role: "March 2026 · ⭐⭐⭐⭐⭐",
    text: "Service is so amazing, the quality of products and the time spent on just explaining everything — making sure I understood — is unmatched anywhere. The results were seen instantly for my facial. Amazing Amazing Amazing!",
    rating: 5,
  },
  {
    name: "Verified Client",
    role: "September 2025 · ⭐⭐⭐⭐⭐",
    text: "Your service was excellent! Your hand was so gentle. First time I didn't get much pain doing a Brazilian! Thank you sooo much — definitely will be booking again!",
    rating: 5,
  },
  {
    name: "Verified Client",
    role: "February 2026 · ⭐⭐⭐⭐⭐",
    text: "Wonderful service, was my first time at this establishment and I received a pedicure. I felt loved while getting my feet massaged. Absolutely no complaints, will definitely be spending my money here again.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", text: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const restart = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 5500);
  };

  useEffect(() => {
    restart();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const submitReview = async () => {
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: reviewForm.name, comment: reviewForm.text, rating: reviewForm.rating }),
      });
      setSubmitted(true);
      setShowForm(false);
      setReviewForm({ name: "", text: "", rating: 5 });
    } catch {
      // fail silently — the review is not critical
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-pad" style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(201,169,110,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        <SectionHeader eyebrow="Client Reviews" title="Real Words from Real Clients" />

        <div style={{ position: "relative", minHeight: 300 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center" }}
            >
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 28 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} style={{ fill: "var(--gold)", color: "var(--gold)" }} />
                ))}
              </div>

              <blockquote style={{ margin: 0 }}>
                <p style={{
                  fontFamily: "var(--font-cormorant, Georgia, serif)",
                  fontSize: "clamp(19px, 2.5vw, 27px)",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "var(--text)",
                  fontStyle: "italic",
                  marginBottom: 36,
                }}>
                  &ldquo;{reviews[current].text}&rdquo;
                </p>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ height: 1, width: 30, background: "var(--gold)", display: "block", marginBottom: 12 }} />
                  <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", margin: 0, letterSpacing: "0.05em" }}>{reviews[current].name}</p>
                  <p style={{ fontSize: 11, color: "var(--gold)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>{reviews[current].role}</p>
                </div>
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); restart(); }}
              style={{ width: i === current ? 28 : 6, height: 6, borderRadius: 3, background: i === current ? "var(--gold)" : "var(--border-hover)", border: "none", cursor: "pointer", padding: 0, transition: "width 0.4s ease, background 0.3s ease" }}
            />
          ))}
        </div>

        {/* Review count + CTA */}
        <div style={{ textAlign: "center", marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <p style={{ fontSize: 11, color: "var(--text-subtle)", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            {reviews.length} verified 5-star reviews
          </p>
          {submitted ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "#4caf50" }}>
              <CheckCircle size={14} /> Thank you for your review!
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              style={{ background: "none", border: "1px solid var(--border-hover)", borderRadius: 2, padding: "10px 24px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", transition: "all 0.25s ease", fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              Share Your Experience
            </button>
          )}
        </div>
      </div>

      {/* Review submission modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "40px", maxWidth: 480, width: "100%", position: "relative" }}
            >
              <div style={{ position: "absolute", top: 0, left: 40, right: 40, height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
              <button onClick={() => setShowForm(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", display: "flex" }}>
                <X size={16} />
              </button>
              <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 10px" }}>Leave a Review</p>
              <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 300, color: "var(--text)", margin: "0 0 24px" }}>Share Your Experience</h3>

              {/* Star rating */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 0 10px" }}>Your Rating</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <Star size={20} style={{ fill: n <= reviewForm.rating ? "var(--gold)" : "transparent", color: "var(--gold)", transition: "fill 0.15s ease" }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-subtle)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Your Name</label>
                <input
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Sarah M."
                  style={{ width: "100%", padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--gold)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>

              {/* Review text */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-subtle)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Your Review</label>
                <textarea
                  value={reviewForm.text}
                  onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Tell us about your experience…"
                  rows={4}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--gold)"}
                  onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                />
              </div>

              <button
                onClick={submitReview}
                disabled={submitting || !reviewForm.name.trim() || !reviewForm.text.trim()}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", opacity: (submitting || !reviewForm.name.trim() || !reviewForm.text.trim()) ? 0.6 : 1, transition: "opacity 0.2s" }}
              >
                <Send size={12} /> {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
