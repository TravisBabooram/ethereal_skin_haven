"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const EMPTY = { question: "", answer: "", category: "Booking", order: 0 };
const CATS = ["Booking", "Cancellation", "Payment", "Preparation", "Aftercare", "Products", "General"];

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchFAQs = () => {
    setLoading(true);
    fetch("/api/faq", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setFaqs(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFAQs(); }, []);

  const openAdd = () => { setForm({ ...EMPTY }); setEditId(null); setModal("add"); };
  const openEdit = (f: FAQ) => {
    setForm({ question: f.question, answer: f.answer, category: f.category, order: f.order });
    setEditId(f.id);
    setModal("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    const url = modal === "edit" ? `/api/faq/${editId}` : "/api/faq";
    const method = modal === "edit" ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ ...form, order: Number(form.order) }) });
    setSaving(false);
    setModal(null);
    fetchFAQs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/faq/${id}`, { method: "DELETE", credentials: "include" });
    fetchFAQs();
  };

  const grouped = CATS.reduce<Record<string, FAQ[]>>((acc, cat) => {
    acc[cat] = faqs.filter(f => f.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>FAQ</h1>
        </div>
        <button onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={13} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {CATS.map(cat => grouped[cat]?.length > 0 ? (
            <div key={cat}>
              <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>{cat}</p>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
                {grouped[cat].map((f, i) => (
                  <div key={f.id} style={{ padding: "16px 20px", borderBottom: i < grouped[cat].length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 16, alignItems: "flex-start", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 5px", color: "var(--text)", fontWeight: 500, fontSize: 14 }}>{f.question}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--text-subtle)", lineHeight: 1.6 }}>{f.answer}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => openEdit(f)}
                        style={{ padding: "5px 9px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                        <Pencil size={10} /> Edit
                      </button>
                      <button onClick={() => handleDelete(f.id)}
                        style={{ padding: "5px 9px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#e05555"; e.currentTarget.style.color = "#e05555"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null)}
          {faqs.length === 0 && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "60px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No FAQs yet. Add one to get started.</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 28px" }}>
              {modal === "add" ? "Add FAQ" : "Edit FAQ"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "category" as const, label: "Category", options: CATS },
                { key: "question" as const, label: "Question" },
                { key: "answer" as const, label: "Answer", textarea: true },
                { key: "order" as const, label: "Display Order", type: "number" },
              ].map(({ key, label, options, textarea, type }) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>{label}</label>
                  {options ? (
                    <select value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }}>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : textarea ? (
                    <textarea rows={4} value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                  ) : (
                    <input type={type ?? "text"} value={String(form[key])} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
                  )}
                </div>
              ))}
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
