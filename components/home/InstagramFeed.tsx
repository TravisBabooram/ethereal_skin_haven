"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

interface InstagramPost {
  id: string;
  mediaType: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
}

// Shown before API is configured or while loading
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(224,120,152,0.10) 100%)",
  "linear-gradient(135deg, rgba(224,120,152,0.12) 0%, rgba(201,169,110,0.08) 100%)",
  "linear-gradient(135deg, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.20) 100%)",
  "linear-gradient(135deg, rgba(224,120,152,0.08) 0%, rgba(224,120,152,0.18) 100%)",
  "linear-gradient(135deg, rgba(201,169,110,0.18) 0%, rgba(224,120,152,0.06) 100%)",
  "linear-gradient(135deg, rgba(224,120,152,0.14) 0%, rgba(201,169,110,0.12) 100%)",
];

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then(r => r.json())
      .then(d => {
        setConfigured(d.configured ?? false);
        if (Array.isArray(d.posts) && d.posts.length > 0) setPosts(d.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showLive = configured && posts.length > 0;
  const tiles = showLive ? posts : PLACEHOLDER_GRADIENTS.map((g, i) => ({ id: String(i), gradient: g }));

  return (
    <section className="section-pad" style={{ background: "var(--bg-elevated)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.03) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        {/* Header */}
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <InstagramIcon size={16} />
              <span style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>
                @ethereal.skin.haven_
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 300, color: "var(--text)", margin: "0 0 16px", lineHeight: 1.1 }}>
              Follow Our Journey
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 440, margin: "0 auto" }}>
              {showLive
                ? "Our latest treatments, transformations, and moments — updated live from Instagram."
                : "See our latest treatments, transformations, and behind-the-scenes moments on Instagram."}
            </p>
          </div>
        </AnimatedSection>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }} className="ig-grid">
          {tiles.map((tile, i) => {
            const post = tile as InstagramPost;
            const isLive = showLive && !!post.mediaUrl;

            return (
              <AnimatedSection key={tile.id} delay={i * 0.06}>
                <a
                  href={isLive ? post.permalink : "https://www.instagram.com/ethereal.skin.haven_/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-tile"
                  title={isLive && post.caption ? post.caption.slice(0, 80) : undefined}
                  style={{
                    display: "block",
                    aspectRatio: "1 / 1",
                    background: isLive ? "var(--bg-elevated)" : (tile as { gradient?: string }).gradient,
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Live image */}
                  {isLive && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.mediaUrl}
                      alt={post.caption ? post.caption.slice(0, 60) : "Ethereal Skin Haven Instagram post"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      loading="lazy"
                    />
                  )}

                  {/* Shimmer line decoration (placeholder only) */}
                  {!isLive && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", opacity: 0.3 }} />
                  )}

                  {/* Hover overlay */}
                  <div className="ig-overlay" style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.3s ease",
                  }}>
                    <InstagramIcon size={22} />
                  </div>
                </a>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Loading skeleton overlay */}
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ width: 32, height: 32, border: "2px solid var(--border)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "ig-spin 0.9s linear infinite" }} />
          </div>
        )}

        {/* CTA */}
        <AnimatedSection delay={0.3}>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a
              href="https://www.instagram.com/ethereal.skin.haven_/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "13px 32px",
                border: "1px solid var(--border-hover)",
                color: "var(--text)",
                textDecoration: "none",
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 500,
                borderRadius: 2,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--pink)"; el.style.color = "var(--pink)"; el.style.background = "var(--pink-glow)"; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--border-hover)"; el.style.color = "var(--text)"; el.style.background = "transparent"; }}
            >
              <InstagramIcon size={13} /> Follow on Instagram
            </a>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        .ig-tile:hover .ig-overlay { opacity: 1; }
        @keyframes ig-spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .ig-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 480px) { .ig-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
