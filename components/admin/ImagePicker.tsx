"use client";

import { useEffect, useState } from "react";
import { X, Search, Loader2 } from "lucide-react";

interface PickerImage {
  url: string;
  label: string;
  source: "Service" | "Product" | "Gallery";
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
}

const SOURCE_COLOR: Record<string, string> = {
  Service: "var(--gold)",
  Product: "#4caf50",
  Gallery: "#8b87c0",
};

export default function ImagePicker({ onSelect, onClose }: Props) {
  const [images, setImages] = useState<PickerImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Service" | "Product" | "Gallery">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/services", { credentials: "include" }).then(r => r.json()),
      fetch("/api/products", { credentials: "include" }).then(r => r.json()),
      fetch("/api/gallery", { credentials: "include" }).then(r => r.json()),
    ]).then(([services, products, gallery]) => {
      const all: PickerImage[] = [];
      if (Array.isArray(services))
        services.forEach((s: any) => s.image && all.push({ url: s.image, label: s.name, source: "Service" }));
      if (Array.isArray(products))
        products.forEach((p: any) => p.image && all.push({ url: p.image, label: p.name, source: "Product" }));
      if (Array.isArray(gallery))
        gallery.forEach((g: any) => g.image && all.push({ url: g.image, label: g.title || "Gallery", source: "Gallery" }));
      setImages(all);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = images.filter(img => {
    if (filter !== "All" && img.source !== filter) return false;
    if (search && !img.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, width: "100%", maxWidth: 820, maxHeight: "88vh", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Header */}
        <div style={{ padding: "22px 28px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 3px" }}>Reassign</p>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, fontWeight: 400, color: "var(--text)", margin: 0 }}>Pick Existing Image</h2>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0, maxWidth: 260, textAlign: "right", lineHeight: 1.5 }}>
            Images already uploaded — no re-upload needed. Click any to assign.
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div style={{ padding: "12px 28px", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
            <Search size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
            <input
              placeholder="Search by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 10px 8px 30px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 12, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {(["All", "Service", "Product", "Gallery"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "6px 14px", background: filter === f ? "linear-gradient(135deg, var(--gold-dark), var(--gold))" : "none", border: filter === f ? "none" : "1px solid var(--border)", borderRadius: 2, color: filter === f ? "#080808" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
              {f}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "40px 0" }}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13 }}>Loading all images…</span>
            </div>
          ) : filtered.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>No images found</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
              {filtered.map((img, i) => (
                <button key={i} onClick={() => onSelect(img.url)}
                  style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: 0, cursor: "pointer", overflow: "hidden", textAlign: "left", transition: "border-color 0.2s, transform 0.15s", display: "block" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <div style={{ aspectRatio: "1", overflow: "hidden", background: "var(--bg-elevated)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "6px 8px 8px" }}>
                    <p style={{ margin: "0 0 3px", fontSize: 10, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.label}</p>
                    <span style={{ fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: SOURCE_COLOR[img.source], fontWeight: 600 }}>{img.source}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{ padding: "12px 28px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: 0, letterSpacing: "0.03em" }}>
            Reassigning uses the existing Cloudinary URL — the original image is not deleted from storage.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
