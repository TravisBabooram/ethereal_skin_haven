"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, Loader2, X } from "lucide-react";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  duration: number;
  category?: string;
  benefits?: string;
  aftercare?: string;
  featured: boolean;
}

const EMPTY: Omit<Service, "id" | "featured"> = { name: "", description: "", price: 0, duration: 60, category: "", benefits: "", aftercare: "", image: "" };
const CATS = ["Facials", "Waxing", "Intimate Care", "Brows", "Nails"];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchServices = () => {
    setLoading(true);
    fetch("/api/services", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setServices(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => { setForm({ ...EMPTY }); setEditId(null); setModal("add"); };
  const openEdit = (s: Service) => {
    setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category ?? "", benefits: s.benefits ?? "", aftercare: s.aftercare ?? "", image: s.image ?? "" });
    setEditId(s.id);
    setModal("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, price: Number(form.price), duration: Number(form.duration) };
    const url = modal === "edit" ? `/api/services/${editId}` : "/api/services";
    const method = modal === "edit" ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
    setSaving(false);
    setModal(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    setDeleting(id);
    await fetch(`/api/services/${id}`, { method: "DELETE", credentials: "include" });
    setDeleting(null);
    fetchServices();
  };

  const toggleFeatured = async (s: Service) => {
    await fetch(`/api/services/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ featured: !s.featured }) });
    fetchServices();
  };

  const field = (key: keyof typeof form, label: string, opts?: { type?: string; textarea?: boolean; options?: string[] }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>{label}</label>
      {opts?.options ? (
        <select value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }}>
          <option value="">— Select —</option>
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Services</h1>
        </div>
        <button onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={13} /> Add Service
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Name", "Category", "Price", "Duration", "Featured", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.18em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < services.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 2px", color: "var(--text)", fontWeight: 500 }}>{s.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--text-subtle)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description}</p>
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{s.category || "—"}</td>
                  <td style={{ padding: "14px 16px", color: "var(--gold)", fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 16 }}>{s.price > 0 ? `$${s.price}` : "TBD"}</td>
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{s.duration}min</td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => toggleFeatured(s)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      <Star size={16} fill={s.featured ? "var(--gold)" : "none"} color={s.featured ? "var(--gold)" : "var(--text-subtle)"} />
                    </button>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(s)}
                        style={{ padding: "6px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                        style={{ padding: "6px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", fontSize: 11, display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#e05555"; e.currentTarget.style.color = "#e05555"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 28px" }}>
              {modal === "add" ? "Add Service" : "Edit Service"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {field("name", "Service Name")}
              {field("description", "Description", { textarea: true })}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {field("price", "Price (TTD)", { type: "number" })}
                {field("duration", "Duration (minutes)", { type: "number" })}
              </div>
              {field("category", "Category", { options: CATS })}
              {field("benefits", "Benefits (separate with ·)")}
              {field("aftercare", "Aftercare Instructions", { textarea: true })}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Service Image</label>
                <CloudinaryUpload value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} folder="ethereal-skin-haven/services" />
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
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
