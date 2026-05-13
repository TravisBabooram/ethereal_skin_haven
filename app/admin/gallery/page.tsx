"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, X, ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  image: string;
  category?: string;
  order: number;
}

const EMPTY = { title: "", image: "", category: "", order: 0 };
const CATS = ["Facials", "Waxing", "Brows", "Nails", "Before & After", "Studio", "General"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchImages = () => {
    setLoading(true);
    fetch("/api/gallery", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setImages(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.image) return;
    setSaving(true);
    await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ ...form, order: Number(form.order) }) });
    setSaving(false);
    setModal(false);
    setForm({ ...EMPTY });
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from the gallery?")) return;
    setDeleting(id);
    await fetch(`/api/gallery/${id}`, { method: "DELETE", credentials: "include" });
    setDeleting(null);
    fetchImages();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Gallery</h1>
        </div>
        <button onClick={() => setModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={13} /> Add Image
        </button>
      </div>

      <div style={{ background: "rgba(201,169,110,0.05)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 6, padding: "14px 18px", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <ImageIcon size={14} style={{ color: "var(--gold)", flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
          Images are stored via <strong style={{ color: "var(--text)" }}>Cloudinary</strong>. Upload your images to Cloudinary and paste the URL here. Photos coming soon.
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : images.length === 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "1", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <ImageIcon size={24} style={{ color: "var(--border)" }} />
              <span style={{ fontSize: 10, color: "var(--text-subtle)", letterSpacing: "0.1em" }}>Photo</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {images.map(img => (
            <div key={img.id} style={{ position: "relative", aspectRatio: "1", borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, color: "#fff", fontWeight: 500 }}>{img.title}</p>
                  <button onClick={() => handleDelete(img.id)} disabled={deleting === img.id}
                    style={{ padding: "4px 10px", background: "rgba(220,60,60,0.8)", border: "none", borderRadius: 2, color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <Trash2 size={10} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 500, position: "relative" }}>
            <button onClick={() => setModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 28px" }}>Add Gallery Image</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "title" as const, label: "Title" },
                { key: "image" as const, label: "Cloudinary Image URL" },
                { key: "order" as const, label: "Display Order", type: "number" },
              ].map(({ key, label, type }) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>{label}</label>
                  <input type={type ?? "text"} value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }}>
                  <option value="">— Select —</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)}
                style={{ padding: "10px 20px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
                {saving ? "Saving…" : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
