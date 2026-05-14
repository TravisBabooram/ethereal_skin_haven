"use client";

import { Phone, MapPin, MessageCircle, Share2, Mail } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const MAPS_URL = "https://maps.google.com/?q=Balisier+Avenue,+Couva,+Trinidad";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.35 6.35 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
    </svg>
  );
}

const hours = [
  { day: "Monday – Sunday", time: "8:00 AM – 6:00 PM" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        <AnimatedSection style={{ position: "relative", maxWidth: 600, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>Get in Touch</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 300, color: "var(--text)", margin: "0 0 20px", lineHeight: 1.1 }}>
            We&apos;d Love to<br />
            <em style={{ fontStyle: "italic", background: "linear-gradient(120deg, var(--gold-dark), var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Hear from You</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-muted)", marginBottom: 32 }}>
            The easiest way to reach us is via WhatsApp. We respond promptly and will walk you through everything you need to book your appointment.
          </p>
          {/* Primary CTA */}
          <a href="https://wa.me/18687057023" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 40px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2, boxShadow: "0 8px 28px rgba(201,169,110,0.3)" }}
          >
            <MessageCircle size={14} /> WhatsApp Us
          </a>
        </AnimatedSection>
      </section>

      <section className="section-pad" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="contact-grid">

            {/* Contact info */}
            <AnimatedSection direction="left">
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

                {/* WhatsApp / Phone */}
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Phone size={16} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 600 }}>WhatsApp / Call</p>
                    <a href="https://wa.me/18687057023" target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 16, color: "var(--text)", textDecoration: "none", fontFamily: "var(--font-cormorant, Georgia, serif)", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
                    >
                      +1 (868) 705-7023
                    </a>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>Preferred method of contact</p>
                  </div>
                </div>

                {/* Location → Google Maps */}
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MapPin size={16} style={{ color: "var(--pink)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 600 }}>Location</p>
                    <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 15, color: "var(--text)", textDecoration: "none", transition: "color 0.2s", display: "block" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--pink)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
                    >Balisier Avenue, Couva</a>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 0" }}>Trinidad & Tobago 🇹🇹</p>
                    <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: "6px 0 0", fontStyle: "italic" }}>Exact address sent upon booking confirmation.</p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Mail size={16} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 600 }}>Email</p>
                    <a href="mailto:etherealskinhaven@gmail.com"
                      style={{ fontSize: 15, color: "var(--text)", textDecoration: "none", fontFamily: "var(--font-cormorant, Georgia, serif)", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
                    >etherealskinhaven@gmail.com</a>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>For general enquiries</p>
                  </div>
                </div>

                {/* Social — Instagram, TikTok, Facebook */}
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Share2 size={16} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 600 }}>Follow Us</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { href: "https://www.instagram.com/ethereal.skin.haven_/",              Icon: InstagramIcon, label: "@ethereal.skin.haven_", hoverColor: "var(--pink)" },
                        { href: "https://www.tiktok.com/@ethereal.skin.haven",                  Icon: TikTokIcon,    label: "@ethereal.skin.haven",  hoverColor: "var(--gold)" },
                        { href: "https://www.facebook.com/profile.php?id=61587540374992",       Icon: FacebookIcon,  label: "Ethereal Skin Haven",   hoverColor: "#1877F2" },
                      ].map(({ href, Icon, label, hoverColor }) => (
                        <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = hoverColor)}
                          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                        >
                          <Icon size={14} />
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Booking info card */}
            <AnimatedSection direction="right">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* How to book */}
                <div className="card-base" style={{ padding: "36px" }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>How to Book</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { step: "01", text: "WhatsApp or call us at +1 (868) 705-7023 with your desired service and preferred date." },
                      { step: "02", text: "We confirm availability and send you our bank transfer details for your 50% deposit." },
                      { step: "03", text: "Send your payment receipt via WhatsApp. Your appointment is secured once payment is confirmed." },
                      { step: "04", text: "Receive your appointment confirmation with the full address and arrival instructions." },
                    ].map(({ step, text }) => (
                      <div key={step} style={{ display: "flex", gap: 16 }}>
                        <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, color: "var(--gold)", opacity: 0.4, fontWeight: 300, lineHeight: 1, flexShrink: 0, minWidth: 36 }}>{step}</span>
                        <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment info */}
                <div style={{ padding: "24px 28px", border: "1px solid var(--border)", borderRadius: 6, background: "rgba(201,169,110,0.03)" }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>Payment Details</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["Bank", "First Citizens Bank"],
                      ["Account Name", "Ethereal Skin Haven"],
                      ["Account No.", "3128614"],
                      ["Type", "Savings"],
                      ["Remaining Balance", "Cash on the day"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "var(--text-subtle)", letterSpacing: "0.08em" }}>{label}</span>
                        <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "14px 0 0", fontStyle: "italic" }}>
                    Always send your receipt after transfer for verification.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
