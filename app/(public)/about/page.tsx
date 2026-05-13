"use client";

import Link from "next/link";
import { ArrowRight, Award, Heart, Star, Leaf, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeader from "@/components/ui/SectionHeader";

const values = [
  { icon: Award, title: "Results-Driven", desc: "Every treatment is selected and customised to deliver real, visible results — not just a relaxing hour. Your skin's health is always the priority." },
  { icon: Heart, title: "Personalised Care", desc: "We take the time to understand your skin, explain every product and process, and ensure you leave with knowledge and results." },
  { icon: ShieldCheck, title: "Uncompromising Hygiene", desc: "All tools and implements are sanitised with Barbicide between every client. Single-use wax cartridges — no double-dipping. Ever." },
  { icon: Leaf, title: "Professional Products Only", desc: "We use Esthemax, Starpil, Bushbalm, Nova Wax, and other professional-grade formulas chosen for efficacy and skin safety." },
];

const brands = [
  { name: "Esthemax", desc: "High-quality, results-driven facials and Hydrojelly Masks" },
  { name: "Starpil Wax", desc: "Roll-On wax system with single-use cartridges for hygiene and precision" },
  { name: "Bushbalm", desc: "Dark spot treatments and post-wax care for intimate areas" },
  { name: "Nova Wax", desc: "Premium wax formulas via Waxmate" },
  { name: "Circadia", desc: "Advanced formulations — attended their Mix & Matcha Workshop" },
  { name: "M.A.D Skincare", desc: "Carbonetix Skin Rejuvenating System — non-invasive oxygen-boosting treatment" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 160, paddingBottom: 80, background: "var(--bg)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">
            <AnimatedSection direction="left">
              <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20, fontFamily: "var(--font-sans, system-ui)" }}>
                Our Story
              </p>
              <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 300, color: "var(--text)", margin: "0 0 24px", lineHeight: 1.1 }}>
                Ethereal Glow.<br />
                <em style={{ fontStyle: "italic", background: "linear-gradient(120deg, var(--gold-dark), var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Radiant You.</em>
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-muted)", marginBottom: 16 }}>
                Ethereal Skin Haven is a luxury esthetic studio located in Couva, Trinidad — offering high-quality waxing, facials, intimate care, brow services, and more. We are a results-driven, client-focused space where every detail of your experience is intentionally designed.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-muted)", marginBottom: 36 }}>
                We believe in continuous education, professional-grade products, and an unwavering commitment to hygiene. From the products we select to the tools we sterilise, every decision is made with your skin's health and safety in mind.
              </p>
              <Link href="/booking"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2 }}
              >
                Book an Appointment <ArrowRight size={12} />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "48px", position: "relative" }}>
                <div style={{ position: "absolute", top: -1, left: 40, right: 40, height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  {/* Set ESTHETICIAN_PHOTO to a Cloudinary URL when the photo is ready */}
                  <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--bg-elevated), rgba(201,169,110,0.12))", border: "1px solid var(--border)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <Star size={36} style={{ color: "var(--gold)", opacity: 0.6 }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 24, fontWeight: 400, color: "var(--text)", margin: "0 0 6px" }}>The Esthetician</h3>
                  <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 4px" }}>Founder & Solo Practitioner</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Balisier Avenue, Couva · Trinidad 🇹🇹</p>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 16, fontFamily: "var(--font-sans, system-ui)" }}>
                    Education & Training
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "Licensed Esthetician",
                      "Barbicide Certified",
                      "Circadia Mix & Matcha Workshop",
                      "M.A.D Skincare Workshop — Hyatt Regency Trinidad",
                      "Starpil Professional Wax Training",
                      "Esthemax Product Certification",
                    ].map(c => (
                      <div key={c} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background: "var(--bg-elevated)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <SectionHeader eyebrow="Our Promise" title="Why Clients Choose Us" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, alignItems: "stretch" }}>
            {values.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.08} style={{ height: "100%" }}>
                <div className="card-base" style={{ padding: "36px", background: "var(--bg-card)", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, flexShrink: 0 }}>
                    <Icon size={18} style={{ color: "var(--gold)" }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, fontWeight: 400, color: "var(--text)", margin: "0 0 12px", flexShrink: 0 }}>{title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-muted)", margin: 0, flex: 1 }}>{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <SectionHeader eyebrow="What We Use" title="Professional Brands We Trust" subtitle="Every product is chosen for its professional-grade quality, proven results, and commitment to skin safety." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, alignItems: "stretch" }}>
            {brands.map((b, i) => (
              <AnimatedSection key={b.name} delay={i * 0.06} style={{ height: "100%" }}>
                <div style={{ padding: "20px 24px", border: "1px solid var(--border)", borderRadius: 6, transition: "border-color 0.3s", height: "100%", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", margin: "0 0 6px", letterSpacing: "0.05em", flexShrink: 0 }}>{b.name}</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.6, flex: 1 }}>{b.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
