"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category?: string;
}

function ServiceSkeleton() {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "36px", height: 260, animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ height: 10, width: 80, background: "var(--bg-elevated)", borderRadius: 4, marginBottom: 20 }} />
      <div style={{ height: 20, width: "70%", background: "var(--bg-elevated)", borderRadius: 4, marginBottom: 12 }} />
      <div style={{ height: 12, width: "100%", background: "var(--bg-elevated)", borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 12, width: "80%", background: "var(--bg-elevated)", borderRadius: 4 }} />
    </div>
  );
}

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services?featured=true&limit=6")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServices(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-pad" style={{ background: "var(--bg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <SectionHeader eyebrow="Our Services" title="Crafted for Radiant Skin" subtitle="Every treatment is results-driven, professionally executed, and tailored to your skin — in a calm, luxurious space designed just for you." />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceSkeleton key={i} />)
            : services.map((svc, i) => (
              <AnimatedSection key={svc.id} delay={i * 0.08}>
                <article className="card-base" style={{ padding: "36px", height: "100%", display: "flex", flexDirection: "column" }}>
                  {svc.category && (
                    <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20, display: "block", fontFamily: "var(--font-sans, system-ui)" }}>
                      {svc.category}
                    </span>
                  )}
                  <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, fontWeight: 400, color: "var(--text)", margin: "0 0 14px", lineHeight: 1.25 }}>
                    {svc.name}
                  </h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-muted)", margin: "0 0 28px", flex: 1 }}>
                    {svc.description}
                  </p>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: "var(--gold)", margin: 0, fontWeight: 500 }}>
                      {svc.price > 0 ? `$${svc.price} TTD` : "Contact for pricing"}
                    </p>
                    <a href={`https://wa.me/18687057023?text=${encodeURIComponent(`Hi, I'd like to book a ${svc.name}`)}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", fontWeight: 600, transition: "gap 0.25s ease" }}
                      onMouseEnter={e => (e.currentTarget.style.gap = "12px")}
                      onMouseLeave={e => (e.currentTarget.style.gap = "8px")}
                    >
                      Book <ArrowRight size={11} />
                    </a>
                  </div>
                </article>
              </AnimatedSection>
            ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 36px", border: "1px solid var(--border-hover)", color: "var(--text)", textDecoration: "none", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 500, borderRadius: 2, transition: "all 0.3s ease" }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; el.style.background = "var(--gold-glow)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--border-hover)"; el.style.color = "var(--text)"; el.style.background = "transparent"; }}
            >
              View All Services <ArrowRight size={11} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </section>
  );
}
