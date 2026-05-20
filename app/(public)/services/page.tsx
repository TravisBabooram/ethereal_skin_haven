"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Filter, Loader2, ShoppingBag, Check } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category?: string;
  benefits?: string;
  aftercare?: string;
  image?: string | null;
}

const CATS = ["All", "Facials", "Waxing", "Intimate Care", "Brows", "Nails"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [hideImages, setHideImages] = useState(false);

  const handleAddToCart = async (serviceId: string) => {
    setAddingToCart(serviceId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ serviceId, quantity: 1 }),
      });
      if (res.status === 401) { window.location.href = "/login?redirect=/services"; return; }
      if (res.ok) { setAddedToCart(serviceId); setTimeout(() => setAddedToCart(null), 2000); }
    } finally { setAddingToCart(null); }
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then(r => r.json()),
      fetch("/api/public/display").then(r => r.json()),
    ])
      .then(([data, display]) => {
        if (Array.isArray(data)) setServices(data);
        setHideImages(display.hideImages === true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = cat === "All" ? services : services.filter(s => s.category === cat);

  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          <AnimatedSection>
            <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>What We Offer</p>
            <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(38px, 7vw, 80px)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.05 }}>Our Services</h1>
            <p style={{ fontSize: "clamp(13px, 1.8vw, 15px)", lineHeight: 1.75, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 24px" }}>
              Every treatment is results-driven and professionally executed in a calm, luxurious space designed just for you.
            </p>
            <a href="https://wa.me/18687057023" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2 }}
            >
              Book via WhatsApp <ArrowRight size={12} />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Sticky filter */}
      <div style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "sticky", top: 72, zIndex: 30 }}>
        <div className="filter-scroll" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)", display: "flex", gap: 4, alignItems: "center" }}>
          <Filter size={12} style={{ color: "var(--text-subtle)", flexShrink: 0, marginRight: 8 }} />
          {CATS.map(c => (
            <button key={c} onClick={() => { setCat(c); setExpanded(null); }}
              style={{ padding: "14px 16px", background: "none", border: "none", borderBottom: cat === c ? "2px solid var(--gold)" : "2px solid transparent", color: cat === c ? "var(--gold)" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "color 0.2s, border-color 0.2s", fontWeight: cat === c ? 600 : 400, whiteSpace: "nowrap" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "80px 0", color: "var(--text-muted)" }}>
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13, letterSpacing: "0.1em" }}>Loading services…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 15, color: "var(--text-muted)" }}>No services found in this category.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
              {filtered.map((svc, i) => (
                <AnimatedSection key={svc.id} delay={i * 0.05}>
                  <article className="card-base" style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {!hideImages && svc.image && svc.image.startsWith("http") && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={svc.image} alt={svc.name} style={{ width: "100%", height: 200, objectFit: "cover", display: "block", flexShrink: 0 }}
                        onError={e => { e.currentTarget.style.display = "none"; }} />
                    )}
                    <div style={{ padding: "clamp(20px, 4vw, 36px)", flex: 1, display: "flex", flexDirection: "column" }}>
                    {svc.category && (
                      <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 16 }}>{svc.category}</span>
                    )}
                    <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(19px, 3vw, 22px)", fontWeight: 400, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.25 }}>{svc.name}</h2>
                    <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-muted)", margin: "0 0 20px", flex: 1 }}>{svc.description}</p>

                    {expanded === svc.id && (
                      <div style={{ marginBottom: 20, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                        {svc.benefits && (
                          <div style={{ marginBottom: svc.aftercare ? 14 : 0 }}>
                            <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>Includes</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {svc.benefits.split(" · ").map(b => (
                                <div key={b} style={{ display: "flex", gap: 10 }}>
                                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 8 }} />
                                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {svc.aftercare && (
                          <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(201,169,110,0.04)", border: "1px solid var(--border)", borderRadius: 4 }}>
                            <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 5px", fontWeight: 600 }}>Aftercare</p>
                            <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>{svc.aftercare}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card footer — stacks on mobile via CSS */}
                    <div className="service-card-footer" style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flexShrink: 0 }}>
                        <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(16px, 3vw, 20px)", color: "var(--gold)", margin: "0 0 4px", fontWeight: 500 }}>
                          {svc.price > 0 ? `$${svc.price} TTD` : "Contact for pricing"}
                        </p>
                        {svc.duration > 0 && (
                          <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0, letterSpacing: "0.1em" }}>{svc.duration} min</p>
                        )}
                      </div>
                      <div className="service-card-actions" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {(svc.benefits || svc.aftercare) && (
                          <button onClick={() => setExpanded(expanded === svc.id ? null : svc.id)}
                            style={{ background: "none", border: "none", fontSize: 10, letterSpacing: "0.15em", color: "var(--text-subtle)", cursor: "pointer", textTransform: "uppercase", transition: "color 0.2s", padding: "8px 0" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}
                          >{expanded === svc.id ? "Less" : "Details"}</button>
                        )}
                        <button
                          onClick={() => handleAddToCart(svc.id)}
                          disabled={addingToCart === svc.id}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px", background: addedToCart === svc.id ? "rgba(76,175,80,0.1)" : "rgba(201,169,110,0.08)", border: `1px solid ${addedToCart === svc.id ? "rgba(76,175,80,0.4)" : "var(--border)"}`, borderRadius: 2, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: addedToCart === svc.id ? "#4caf50" : "var(--gold)", cursor: addingToCart === svc.id ? "not-allowed" : "pointer", transition: "all 0.2s", fontWeight: 500 }}
                        >
                          {addedToCart === svc.id ? <><Check size={11} /> Added</> : addingToCart === svc.id ? <><Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> Adding…</> : <><ShoppingBag size={11} /> Add to Cart</>}
                        </button>
                        <a href={`/booking?services=${svc.id}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 14px", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", fontWeight: 600, background: "rgba(201,169,110,0.08)", border: "1px solid var(--border)", borderRadius: 2 }}
                        >
                          Book <ArrowRight size={11} />
                        </a>
                      </div>
                    </div>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.3}>
            <div style={{ maxWidth: 700, margin: "clamp(32px, 5vw, 56px) auto 0", padding: "clamp(18px, 4vw, 24px) clamp(16px, 4vw, 28px)", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", textAlign: "center" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Booking Policy</p>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "0 0 4px", lineHeight: 1.7 }}>
                A <strong style={{ color: "var(--text)" }}>50% deposit</strong> is required to secure all appointments. Book via WhatsApp — confirmed after payment receipt.
              </p>
              <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>Prices in TTD. Remaining balance paid in cash on the day.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
