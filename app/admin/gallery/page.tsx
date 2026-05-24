"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Pencil, Loader2, X, ImageIcon, GripVertical, Images } from "lucide-react";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import ImagePicker from "@/components/admin/ImagePicker";

interface GalleryImage {
  id: string;
  title: string;
  image: string;
  category?: string;
  order: number;
}

const EMPTY = { title: "", image: "", category: "" };
const CATS = ["Facials", "Waxing", "Brows", "Nails", "Before & After", "Studio", "General"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [pickerForId, setPickerForId] = useState<string | null>(null);
  const [reassigning, setReassigning] = useState<string | null>(null);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const fetchImages = () => {
    setLoading(true);
    fetch("/api/gallery", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setImages(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const openAdd = () => { setForm({ ...EMPTY }); setEditId(null); setModal("add"); };
  const openEdit = (img: GalleryImage) => {
    setForm({ title: img.title, image: img.image, category: img.category ?? "" });
    setEditId(img.id);
    setModal("edit");
  };

  const handleSave = async () => {
    if (!form.image) return;
    setSaving(true);
    if (modal === "edit" && editId) {
      await fetch(`/api/gallery/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: form.title || "Untitled", category: form.category, image: form.image }),
      });
    } else {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, title: form.title || "Untitled", order: images.length }),
      });
    }
    setSaving(false);
    setModal(null);
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from the gallery?")) return;
    setDeleting(id);
    await fetch(`/api/gallery/${id}`, { method: "DELETE", credentials: "include" });
    setDeleting(null);
    fetchImages();
  };

  const handleReassign = async (imageId: string, imageUrl: string) => {
    setReassigning(imageId);
    setPickerForId(null);
    await fetch(`/api/gallery/${imageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ image: imageUrl, _noDelete: true }),
    });
    setReassigning(null);
    fetchImages();
  };

  // Drag-to-reorder handlers
  const handleDragStart = (i: number) => { dragIndex.current = i; };
  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setHoverIndex(i); };
  const handleDragLeave = () => setHoverIndex(null);

  const handleDrop = async (dropIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    setHoverIndex(null);
    if (from === null || from === dropIndex) return;

    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(dropIndex, 0, moved);
    setImages(reordered);

    // Persist the new order — send only items whose order changed
    setSavingOrder(true);
    await Promise.all(
      reordered.map((img, idx) =>
        img.order !== idx
          ? fetch(`/api/gallery/${img.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ order: idx }),
            })
          : Promise.resolve()
      )
    );
    setSavingOrder(false);
    // Update local order values to match saved state
    setImages(reordered.map((img, idx) => ({ ...img, order: idx })));
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setHoverIndex(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Gallery</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {savingOrder && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
              <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Saving order…
            </div>
          )}
          <button
            onClick={() => setReorderMode(r => !r)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: reorderMode ? "rgba(201,169,110,0.12)" : "none", border: reorderMode ? "1px solid var(--gold)" : "1px solid var(--border)", borderRadius: 2, color: reorderMode ? "var(--gold)" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
            <GripVertical size={12} /> {reorderMode ? "Done Reordering" : "Reorder"}
          </button>
          <button onClick={openAdd}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={13} /> Add Image
          </button>
        </div>
      </div>

      {/* Hint banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 4, marginBottom: 20 }}>
        <Images size={13} style={{ color: "var(--gold)", flexShrink: 0 }} />
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
          Hover any image and click <strong style={{ color: "var(--text)" }}>Reassign</strong> to pick an existing image. Use <strong style={{ color: "var(--text)" }}>Reorder</strong> mode to drag images into the correct position.
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <ImageIcon size={32} style={{ color: "var(--border)", marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 8px" }}>No images yet</p>
          <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>Click <strong style={{ color: "var(--text)" }}>Add Image</strong> to upload your first photo.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {images.map((img, i) => (
            <div
              key={img.id}
              draggable={reorderMode}
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(i)}
              onDragEnd={handleDragEnd}
              style={{
                position: "relative",
                aspectRatio: "1",
                borderRadius: 6,
                overflow: "hidden",
                border: hoverIndex === i && reorderMode ? "2px solid var(--gold)" : "1px solid var(--border)",
                cursor: reorderMode ? "grab" : "default",
                opacity: dragIndex.current === i ? 0.45 : 1,
                transition: "border-color 0.15s, opacity 0.15s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

              {/* Drag handle shown in reorder mode */}
              {reorderMode && (
                <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.55)", borderRadius: 4, padding: "4px 6px", display: "flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)" }}>
                  <GripVertical size={13} style={{ color: "#fff" }} />
                  <span style={{ fontSize: 9, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>Drag</span>
                </div>
              )}

              {/* Hover overlay with actions — hidden during reorder */}
              {!reorderMode && (
                <div
                  className="gallery-overlay"
                  style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)", opacity: 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                >
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px" }}>
                    <p style={{ margin: "0 0 2px", fontSize: 11, color: "#fff", fontWeight: 500, lineHeight: 1.3 }}>{img.title}</p>
                    {img.category && <p style={{ margin: "0 0 8px", fontSize: 9, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{img.category}</p>}
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <button
                        onClick={() => setPickerForId(img.id)}
                        disabled={reassigning === img.id}
                        style={{ padding: "4px 9px", background: "rgba(201,169,110,0.85)", border: "none", borderRadius: 2, color: "#111", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {reassigning === img.id
                          ? <Loader2 size={9} style={{ animation: "spin 1s linear infinite" }} />
                          : <Images size={9} />}
                        Reassign
                      </button>
                      <button onClick={() => openEdit(img)}
                        style={{ padding: "4px 9px", background: "rgba(201,169,110,0.85)", border: "none", borderRadius: 2, color: "#111", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Pencil size={9} /> Edit
                      </button>
                      <button onClick={() => handleDelete(img.id)} disabled={deleting === img.id}
                        style={{ padding: "4px 9px", background: "rgba(220,60,60,0.85)", border: "none", borderRadius: 2, color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Trash2 size={9} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 500, position: "relative" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 28px" }}>
              {modal === "edit" ? "Edit Image" : "Add Gallery Image"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Image</label>
                <CloudinaryUpload value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} folder="ethereal-skin-haven/gallery" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Label</label>
                <input type="text" placeholder="e.g. Hydrating Facial Result" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
              </div>
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
              <button onClick={() => setModal(null)}
                style={{ padding: "10px 20px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.image}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: saving || !form.image ? "not-allowed" : "pointer", opacity: !form.image ? 0.5 : 1 }}>
                {saving ? "Saving…" : modal === "edit" ? "Save Changes" : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image picker overlay */}
      {pickerForId && (
        <ImagePicker
          onSelect={url => handleReassign(pickerForId, url)}
          onClose={() => setPickerForId(null)}
        />
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
