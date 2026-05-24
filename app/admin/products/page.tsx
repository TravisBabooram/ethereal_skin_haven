"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, Loader2, X, Eye, EyeOff, Package, Images } from "lucide-react";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import ImagePicker from "@/components/admin/ImagePicker";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  usageInstructions?: string;
  skinTypeSuitability?: string;
  availabilityStatus: string;
  stockQty: number;
  featured: boolean;
  image?: string;
}

const EMPTY = {
  name: "",
  description: "",
  price: 0,
  category: "",
  usageInstructions: "",
  skinTypeSuitability: "",
  availabilityStatus: "available",
  stockQty: 0,
  image: "",
};

const LOW_STOCK_THRESHOLD = 5;

function statusColor(status: string) {
  if (status === "available") return "#4caf50";
  if (status === "low_stock") return "#f59e0b";
  return "#e05555";
}

function statusLabel(status: string) {
  if (status === "available") return "Available";
  if (status === "low_stock") return "Low Stock";
  return "Out of Stock";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [pickerForId, setPickerForId] = useState<string | null>(null);
  const [reassigning, setReassigning] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setProducts(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm({ ...EMPTY }); setEditId(null); setModal("add"); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      usageInstructions: p.usageInstructions ?? "",
      skinTypeSuitability: p.skinTypeSuitability ?? "",
      availabilityStatus: p.availabilityStatus,
      stockQty: p.stockQty,
      image: p.image ?? "",
    });
    setEditId(p.id);
    setModal("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, price: Number(form.price), stockQty: Number(form.stockQty) };
    const url = modal === "edit" ? `/api/products/${editId}` : "/api/products";
    const method = modal === "edit" ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
    setSaving(false);
    setModal(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
    setDeleting(null);
    fetchProducts();
  };

  const toggleFeatured = async (p: Product) => {
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ featured: !p.featured }),
    });
    fetchProducts();
  };

  const toggleDisplay = async (p: Product) => {
    const next = p.availabilityStatus === "out_of_stock" ? (p.stockQty > 0 ? (p.stockQty <= LOW_STOCK_THRESHOLD ? "low_stock" : "available") : "out_of_stock") : "out_of_stock";
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ availabilityStatus: next }),
    });
    fetchProducts();
  };

  const adjustStock = async (p: Product, delta: number) => {
    const next = Math.max(0, p.stockQty + delta);
    setAdjusting(p.id);
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ stockQty: next }),
    });
    setAdjusting(null);
    fetchProducts();
  };

  const handleReassign = async (productId: string, imageUrl: string) => {
    setReassigning(productId);
    setPickerForId(null);
    await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ image: imageUrl, _noDelete: true }),
    });
    setReassigning(null);
    fetchProducts();
  };

  const field = (key: keyof typeof form, label: string, opts?: { type?: string; textarea?: boolean; options?: string[] }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>{label}</label>
      {opts?.options ? (
        <select value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }}>
          {opts.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : opts?.textarea ? (
        <textarea rows={3} value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
      ) : (
        <input type={opts?.type ?? "text"} value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
      )}
    </div>
  );

  const outOfStock = products.filter(p => p.stockQty === 0).length;
  const lowStock = products.filter(p => p.stockQty > 0 && p.stockQty <= LOW_STOCK_THRESHOLD).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Products</h1>
        </div>
        <button onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={13} /> Add Product
        </button>
      </div>

      {/* Reassign hint */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 4, marginBottom: 20 }}>
        <Images size={13} style={{ color: "var(--gold)", flexShrink: 0 }} />
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
          To fix misplaced images — click the <strong style={{ color: "var(--text)" }}>photo icon</strong> on any row to pick an existing image without re-uploading.
        </p>
      </div>

      {/* Stock summary pills */}
      {!loading && (outOfStock > 0 || lowStock > 0) && (
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          {outOfStock > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", background: "rgba(224,85,85,0.08)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: 4 }}>
              <Package size={12} style={{ color: "#e05555" }} />
              <span style={{ fontSize: 11, color: "#e05555", letterSpacing: "0.05em" }}>{outOfStock} out of stock</span>
            </div>
          )}
          {lowStock > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 4 }}>
              <Package size={12} style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: 11, color: "#f59e0b", letterSpacing: "0.05em" }}>{lowStock} low stock</span>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Image", "Name", "Category", "Price", "Stock", "Status", "Display", "Featured", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.18em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id}
                  style={{ borderBottom: i < products.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

                  {/* Thumbnail */}
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg-elevated)", flexShrink: 0 }}>
                      {p.image
                        ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Images size={16} style={{ color: "var(--border)" }} />
                          </div>
                      }
                    </div>
                  </td>

                  {/* Name */}
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 2px", color: "var(--text)", fontWeight: 500 }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--text-subtle)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</p>
                  </td>

                  {/* Category */}
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{p.category}</td>

                  {/* Price */}
                  <td style={{ padding: "14px 16px", color: "var(--gold)", fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 16 }}>${p.price}</td>

                  {/* Stock inline +/- */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => adjustStock(p, -1)} disabled={adjusting === p.id || p.stockQty === 0}
                        style={{ width: 22, height: 22, borderRadius: 3, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", cursor: p.stockQty === 0 ? "not-allowed" : "pointer", fontSize: 14, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: p.stockQty === 0 ? 0.4 : 1 }}>
                        −
                      </button>
                      <span style={{ minWidth: 28, textAlign: "center", fontWeight: 600, fontSize: 13, color: p.stockQty === 0 ? "#e05555" : p.stockQty <= LOW_STOCK_THRESHOLD ? "#f59e0b" : "var(--text)" }}>
                        {adjusting === p.id ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : p.stockQty}
                      </span>
                      <button onClick={() => adjustStock(p, 1)} disabled={adjusting === p.id}
                        style={{ width: 22, height: 22, borderRadius: 3, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        +
                      </button>
                    </div>
                  </td>

                  {/* Status badge */}
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: statusColor(p.availabilityStatus) }}>
                      {statusLabel(p.availabilityStatus)}
                    </span>
                  </td>

                  {/* Display toggle */}
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => toggleDisplay(p)}
                      title={p.availabilityStatus === "out_of_stock" ? "Hidden — click to show" : "Visible — click to hide"}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
                      {p.availabilityStatus === "out_of_stock"
                        ? <EyeOff size={15} color="#e05555" />
                        : <Eye size={15} color="#4caf50" />}
                    </button>
                  </td>

                  {/* Featured */}
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => toggleFeatured(p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Star size={16} fill={p.featured ? "var(--gold)" : "none"} color={p.featured ? "var(--gold)" : "var(--text-subtle)"} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {/* Change image button */}
                      <button
                        onClick={() => setPickerForId(p.id)}
                        disabled={reassigning === p.id}
                        title="Pick existing image"
                        style={{ padding: "6px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                        {reassigning === p.id
                          ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />
                          : <Images size={11} />}
                      </button>
                      <button onClick={() => openEdit(p)}
                        style={{ padding: "6px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                        style={{ padding: "6px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#e05555"; e.currentTarget.style.color = "#e05555"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: "48px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No products yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 28px" }}>
              {modal === "add" ? "Add Product" : "Edit Product"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {field("name", "Product Name")}
              {field("description", "Description", { textarea: true })}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {field("price", "Price (TTD)", { type: "number" })}
                {field("category", "Category")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {field("stockQty", "Stock Quantity", { type: "number" })}
                {field("availabilityStatus", "Display Status", { options: ["available", "low_stock", "out_of_stock"] })}
              </div>
              <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "-8px 0 0", lineHeight: 1.5 }}>
                Stock quantity auto-sets the display status. Override manually if needed.
              </p>
              {field("usageInstructions", "Usage Instructions", { textarea: true })}
              {field("skinTypeSuitability", "Skin Type Suitability")}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Product Image</label>
                <CloudinaryUpload value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} folder="ethereal-skin-haven/products" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(null)}
                style={{ padding: "10px 20px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
                {saving ? "Saving…" : "Save"}
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
