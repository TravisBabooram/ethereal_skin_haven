"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  availabilityStatus: string;
  image?: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=6")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section-pad" style={{ background: "var(--bg-elevated)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader eyebrow="Curated for You" title="Professional Products, Available for You" subtitle="We use and retail only the best — professionally vetted formulas chosen to extend your results beyond the treatment room." />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite" }}>
                <div style={{ height: 240, background: "var(--bg-elevated)" }} />
                <div style={{ padding: 28 }}>
                  <div style={{ height: 16, width: "60%", background: "var(--bg-elevated)", borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ height: 12, width: "100%", background: "var(--bg-elevated)", borderRadius: 4 }} />
                </div>
              </div>
            ))
            : products.map((p, i) => (
              <AnimatedSection key={p.id} delay={i * 0.1}>
                <article className="card-base" style={{ background: "var(--bg-card)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 240, background: "linear-gradient(135deg, var(--bg-elevated) 0%, rgba(201,169,110,0.08) 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShoppingBag size={24} style={{ color: "var(--gold)", opacity: 0.5 }} />
                      </div>
                    )}
                    <span style={{ position: "absolute", top: 16, right: 16, fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", background: "var(--bg-card)", padding: "5px 12px", border: "1px solid var(--gold)", fontWeight: 600 }}>
                      {p.category}
                    </span>
                  </div>
                  <div style={{ padding: "28px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 21, fontWeight: 400, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.3 }}>{p.name}</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-muted)", margin: "0 0 24px", flex: 1 }}>{p.description}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 18 }}>
                      <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 24, color: "var(--gold)", fontWeight: 500 }}>
                        ${p.price} <span style={{ fontSize: 12, color: "var(--text-subtle)", fontFamily: "var(--font-sans, system-ui)", fontWeight: 400 }}>TTD</span>
                      </span>
                      <a href={`https://wa.me/18687057023?text=${encodeURIComponent(`Hi, I'm interested in ${p.name}`)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>Enquire →</a>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 36px", border: "1px solid var(--border-hover)", color: "var(--text)", textDecoration: "none", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 500, borderRadius: 2, transition: "all 0.3s ease" }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; el.style.background = "var(--gold-glow)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--border-hover)"; el.style.color = "var(--text)"; el.style.background = "transparent"; }}
            >
              Shop All Products <ArrowRight size={11} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  );
}
