"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";

const services = [
  "Dermaplaning Facial",
  "Brazilian Wax",
  "Vajacial",
  "Intimate Brightening",
  "Brow Lamination + Tint",
  "Luxury Pedicure",
];

const links = [
  { label: "About Us",  href: "/about" },
  { label: "Gallery",   href: "/gallery" },
  { label: "FAQ",       href: "/faq" },
  { label: "Policies",  href: "/policies" },
  { label: "Contact",   href: "/contact" },
];

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.35 6.35 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
    </svg>
  );
}

const MAPS_URL = "https://maps.google.com/?q=Balisier+Avenue,+Couva,+Trinidad";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ethereal.skin.haven_/",
    Icon: InstagramIcon,
    hoverColor: "var(--pink)",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@ethereal.skin.haven",
    Icon: TikTokIcon,
    hoverColor: "var(--gold)",
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, var(--pink) 30%, var(--gold) 55%, var(--pink-light) 70%, transparent 100%)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px 64px", marginBottom: 72 }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }}>
                <div className="logo-wrap-lg" style={{ width: 80, height: 80 }}>
                  <Image src="/logo.png" alt="Ethereal Skin Haven" width={80} height={80} style={{ display: "block" }} />
                </div>
              </Link>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-muted)", maxWidth: 260, margin: "0 0 6px" }}>
              Ethereal Glow. Radiant You.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-muted)", maxWidth: 260, margin: "0 0 28px" }}>
              High quality esthetic services in Couva, Trinidad — where your skin&apos;s health and results always come first.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {socials.map(({ label, href, Icon, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  style={{ width: 38, height: 38, border: "1px solid var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", transition: "border-color 0.25s, color 0.25s, transform 0.25s, background 0.25s" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = hoverColor;
                    el.style.color = hoverColor;
                    el.style.transform = "translateY(-3px)";
                    el.style.background = `${hoverColor}14`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = "var(--border)";
                    el.style.color = "var(--text-muted)";
                    el.style.transform = "none";
                    el.style.background = "transparent";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontFamily: "var(--font-sans, system-ui)", fontWeight: 600, marginBottom: 20 }}>Services</h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {services.map(s => (
                <li key={s}>
                  <Link href="/services" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontFamily: "var(--font-sans, system-ui)", fontWeight: 600, marginBottom: 20 }}>Explore</h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontFamily: "var(--font-sans, system-ui)", fontWeight: 600, marginBottom: 20 }}>Connect</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Phone → WhatsApp */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <Phone size={13} style={{ color: "var(--gold)", marginTop: 2, flexShrink: 0 }} />
                <a href="https://wa.me/18687057023" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                >+1 (868) 705-7023</a>
              </div>

              {/* Location → Google Maps */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <MapPin size={13} style={{ color: "var(--pink)", marginTop: 2, flexShrink: 0 }} />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--pink)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                >Balisier Avenue, Couva, Trinidad</a>
              </div>
            </div>

            {/* Booking note */}
            <div style={{ marginTop: 24, padding: "14px 16px", border: "1px solid var(--border)", borderRadius: 4, background: "rgba(201,169,110,0.03)" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 600 }}>Book via WhatsApp</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 10px", lineHeight: 1.6 }}>50% deposit required to secure your spot.</p>
              <a href="https://wa.me/18687057023" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--gold)", textDecoration: "none", textTransform: "uppercase", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--pink)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--gold)")}
              >WhatsApp Us →</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>
            © {new Date().getFullYear()} Ethereal Skin Haven. All rights reserved. · Trinidad & Tobago
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { label: "Policies",  href: "/policies" },
              { label: "FAQ",       href: "/faq" },
              { label: "Dashboard", href: "/dashboard" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--text-subtle)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
