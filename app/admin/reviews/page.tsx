"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, Trash2, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { name: string; email: string };
  service?: { name: string } | null;
  product?: { name: string } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    fetch("/api/admin/reviews", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setReviews(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE", credentials: "include" });
    setDeleting(null);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Reviews</h1>
        </div>
        {!loading && reviews.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 36, color: "var(--gold)", margin: 0, fontWeight: 300 }}>{avg}</p>
            <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: 0, letterSpacing: "0.1em" }}>avg rating · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <MessageSquare size={32} style={{ color: "var(--border)", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No reviews yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              {/* Stars */}
              <div style={{ display: "flex", gap: 2, flexShrink: 0, paddingTop: 2 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} size={14} fill={n <= r.rating ? "var(--gold)" : "none"} color={n <= r.rating ? "var(--gold)" : "var(--border)"} />
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 2px", fontWeight: 500 }}>{r.user.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>
                      {r.service?.name || r.product?.name || "General"} · {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", padding: 6, display: "flex", alignItems: "center", borderRadius: 4, flexShrink: 0, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e05555"; e.currentTarget.style.background = "rgba(224,85,85,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-subtle)"; e.currentTarget.style.background = "transparent"; }}>
                    {deleting === r.id ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={14} />}
                  </button>
                </div>
                {r.comment && (
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>"{r.comment}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
