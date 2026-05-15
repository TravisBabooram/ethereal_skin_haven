"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ArrowRight, Loader2, Filter, Check } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ComingSoon from "@/components/ui/ComingSoon";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  usageInstructions?: string;
  skinTypeSuitability?: string;
  availabilityStatus: string;
  image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [comingSoon, setComingSoon] = useState(false);

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.status === 401) { window.location.href = "/login?redirect=/products"; return; }
      if (res.ok) { setAddedToCart(productId); setTimeout(() => setAddedToCart(null), 2000); }
    } finally { setAddingToCart(null); }
  };

  useEffect(() => {
    fetch("/api/coming-soon")
      .then(r => r.json())
      .then(d => { if (d.products) { setComingSoon(true); setLoading(false); return; } })
      .catch(() => {});

    fetch("/api/products")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (comingSoon) return <ComingSoon page="Products" />;

  const cats = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = cat === "All" ? products : products.filter(p => p.category === cat);

  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          <AnimatedSection>
            <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Our Collection</p>
            <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(38px, 7vw, 80px)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.05 }}>
              Professional Products
            </h1>
            <p style={{ fontSize: "clamp(13px, 1.8vw, 15px)", lineHeight: 1.75, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto" }}>
              We use and retail only the best — professionally vetted formulas chosen to extend your results beyond the treatment room.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sticky filter */}
      {!loading && cats.length > 2 && (
        <div style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "sticky", top: 72, zIndex: 30 }}>
          <div className="filter-scroll" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)", display: "flex", gap: 4 }}>
            <Filter size={12} style={{ color: "var(--text-subtle)", flexShrink: 0, marginRight: 8, alignSelf: "center" }} />
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding: "14px 16px", background: "none", border: "none", borderBottom: cat === c ? "2px solid var(--gold)" : "2px solid transparent", color: cat === c ? "var(--gold)" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "color 0.2s, border-color 0.2s", fontWeight: cat === c ? 600 : 400, whiteSpace: "nowrap" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "80px 0", color: "var(--text-muted)" }}>
              <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13 }}>Loading products…</span>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: "clamp(16px, 3vw, 28px)" }}>
              {filtered.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08}>
                  <article className="card-base" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {/* Image area */}
                    <div style={{ height: "clamp(200px, 30vw, 260px)", background: "linear-gradient(135deg, var(--bg-elevated) 0%, rgba(201,169,110,0.1) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                      ) : (
                        <div style={{ width: 80, height: 80, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ShoppingBag size={28} style={{ color: "var(--gold)", opacity: 0.5 }} />
                        </div>
                      )}
                      <span style={{ position: "absolute", top: 12, right: 12, fontSize: 9, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase", background: "var(--bg-card)", padding: "4px 10px", border: "1px solid var(--border)" }}>{p.category}</span>
                      {p.availabilityStatus !== "available" && (
                        <span style={{ position: "absolute", bottom: 12, left: 12, fontSize: 9, color: "#e05555", background: "var(--bg-card)", padding: "4px 10px", border: "1px solid rgba(220,60,60,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Low Stock</span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: "clamp(18px, 4vw, 28px) clamp(18px, 4vw, 32px) clamp(20px, 4vw, 32px)", flex: 1, display: "flex", flexDirection: "column" }}>
                      <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(19px, 3vw, 22px)", fontWeight: 400, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.3 }}>{p.name}</h3>
                      <p style={{ fontSize: "clamp(13px, 1.5vw, 14px)", lineHeight: 1.75, color: "var(--text-muted)", margin: "0 0 20px", flex: 1 }}>{p.description}</p>

                      {expanded === p.id && (
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 18 }}>
                          {p.usageInstructions && (
                            <div style={{ marginBottom: 12 }}>
                              <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 5px", fontWeight: 600 }}>How to Use</p>
                              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>{p.usageInstructions}</p>
                            </div>
                          )}
                          {p.skinTypeSuitability && (
                            <div>
                              <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 5px", fontWeight: 600 }}>Best For</p>
                              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{p.skinTypeSuitability}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card footer */}
                      <div className="product-card-footer" style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flexShrink: 0 }}>
                          <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(20px, 4vw, 26px)", color: "var(--gold)", fontWeight: 500 }}>${p.price}</span>
                          <span style={{ fontSize: 11, color: "var(--text-subtle)", marginLeft: 4 }}>TTD</span>
                        </div>
                        <div className="product-card-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                            style={{ background: "none", border: "none", fontSize: 10, letterSpacing: "0.15em", color: "var(--text-subtle)", cursor: "pointer", textTransform: "uppercase", transition: "color 0.2s", padding: "8px 0" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}
                          >{expanded === p.id ? "Less" : "Details"}</button>
                          {p.availabilityStatus === "available" && (
                            <button
                              onClick={() => handleAddToCart(p.id)}
                              disabled={addingToCart === p.id}
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px", background: addedToCart === p.id ? "rgba(76,175,80,0.1)" : "rgba(201,169,110,0.08)", border: `1px solid ${addedToCart === p.id ? "rgba(76,175,80,0.4)" : "var(--border)"}`, borderRadius: 2, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: addedToCart === p.id ? "#4caf50" : "var(--gold)", cursor: addingToCart === p.id ? "not-allowed" : "pointer", transition: "all 0.2s", fontWeight: 500 }}
                            >
                              {addedToCart === p.id ? <><Check size={11} /> Added</> : addingToCart === p.id ? <><Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> Adding…</> : <><ShoppingBag size={11} /> Add</>}
                            </button>
                          )}
                          <a href={`https://wa.me/18687057023?text=${encodeURIComponent(`Hi, I'm interested in ${p.name}`)}`} target="_blank" rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", fontWeight: 600, background: "rgba(201,169,110,0.08)", border: "1px solid var(--border)", borderRadius: 2 }}
                          >
                            Enquire <ArrowRight size={11} />
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
            <div style={{ marginTop: "clamp(40px, 6vw, 64px)", padding: "clamp(20px, 4vw, 32px) clamp(18px, 4vw, 36px)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Brands We Trust</p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 14px)", color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.7 }}>
                We use only professional-grade formulas — including <strong style={{ color: "var(--text)" }}>Esthemax</strong>, <strong style={{ color: "var(--text)" }}>Starpil</strong>, <strong style={{ color: "var(--text)" }}>Bushbalm</strong>, and <strong style={{ color: "var(--text)" }}>Nova Wax</strong>. All tools are sanitised with <strong style={{ color: "var(--text)" }}>Barbicide</strong> between every client.
              </p>
              <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0, fontStyle: "italic" }}>Your skin deserves the finest care — and that&apos;s exactly what we deliver.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
