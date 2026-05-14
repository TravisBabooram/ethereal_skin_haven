"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";

interface GalleryImage { id: string; title: string; image: string; category?: string; }

const CATS = ["All", "Facials", "Results", "Studio", "Products"];

const placeholders: GalleryImage[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  title: ["Hydrating Facial", "Chemical Peel Result", "Studio Suite", "Product Flatlay", "LED Therapy", "Dermaplaning", "Before & After", "Brow Lamination", "Treatment Room", "Skincare Ritual", "Glow Result", "The Edit"][i],
  image: "",
  category: CATS[1 + (i % 4)],
}));

const HEIGHTS = [260, 340, 300, 280, 360, 250, 320, 290, 270, 350, 310, 260];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(placeholders);
  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setImages(data); })
      .catch(() => {});
  }, []);

  const filtered = cat === "All" ? images : images.filter(img => img.category === cat);

  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
        <AnimatedSection style={{ position: "relative", maxWidth: 600, margin: "0 auto", padding: "0 32px" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Visual Diary</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.1 }}>
            The Gallery
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)" }}>
            A curated window into transformations, rituals, and the art of exceptional skincare.
          </p>
        </AnimatedSection>
      </section>

      {/* Filter */}
      <div style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "sticky", top: 72, zIndex: 30 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", gap: 4, justifyContent: "center" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "14px 20px", background: "none", border: "none", borderBottom: cat === c ? "2px solid var(--gold)" : "2px solid transparent", color: cat === c ? "var(--gold)" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s, border-color 0.2s", fontWeight: cat === c ? 600 : 400 }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <section style={{ background: "var(--bg)", padding: "60px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div className="gallery-masonry" style={{ columns: "3 300px", columnGap: 20 }}>
            {filtered.map((img, i) => (
              <AnimatedSection key={img.id} delay={i * 0.04} style={{ breakInside: "avoid", marginBottom: 20, display: "block" }}>
                <div
                  className="card-base gallery-card"
                  onClick={() => setLightbox(img)}
                  style={{ height: HEIGHTS[i % HEIGHTS.length], background: "linear-gradient(135deg, var(--bg-elevated) 0%, rgba(201,169,110,0.08) 100%)", borderRadius: 6, overflow: "hidden", cursor: "zoom-in", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.35s ease, box-shadow 0.35s ease" }}
                >
                  <ZoomIn size={20} style={{ color: "var(--gold)", opacity: 0.4 }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px", background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))", opacity: 0, transition: "opacity 0.3s" }} className="gallery-label">
                    <p style={{ margin: 0, fontSize: 12, color: "#fff", letterSpacing: "0.05em" }}>{img.title}</p>
                    {img.category && <p style={{ margin: "2px 0 0", fontSize: 9, color: "var(--gold)", letterSpacing: "0.25em", textTransform: "uppercase" }}>{img.category}</p>}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", maxWidth: 700, width: "100%", position: "relative" }}
            >
              <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", zIndex: 10 }}><X size={16} /></button>
              <div style={{ height: 400, background: "linear-gradient(135deg, var(--bg-elevated), rgba(201,169,110,0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomIn size={36} style={{ color: "var(--gold)", opacity: 0.3 }} />
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: "var(--text)", margin: "0 0 4px" }}>{lightbox.title}</p>
                {lightbox.category && <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase", margin: 0 }}>{lightbox.category}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
