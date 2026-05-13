"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";

interface Policy {
  id: string;
  title: string;
  content: string;
  type: string;
}

const EMPTY = { title: "", content: "", type: "general" };
const TYPES = ["cancellation", "booking", "privacy", "refund", "late_arrival", "general"];

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rawContent, setRawContent] = useState("");

  const fetchPolicies = () => {
    setLoading(true);
    fetch("/api/policies", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPolicies(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPolicies(); }, []);

  const parseContent = (content: string): string[] => {
    try { return JSON.parse(content); }
    catch { return content.split("\n").filter(Boolean); }
  };

  const openAdd = () => {
    setForm({ ...EMPTY });
    setRawContent("");
    setEditId(null);
    setModal("add");
  };

  const openEdit = (p: Policy) => {
    setForm({ title: p.title, content: p.content, type: p.type });
    setRawContent(parseContent(p.content).join("\n"));
    setEditId(p.id);
    setModal("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    const lines = rawContent.split("\n").map(l => l.trim()).filter(Boolean);
    const body = { ...form, content: JSON.stringify(lines) };
    const url = modal === "edit" ? `/api/policies/${editId}` : "/api/policies";
    const method = modal === "edit" ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
    setSaving(false);
    setModal(null);
    fetchPolicies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this policy?")) return;
    await fetch(`/api/policies/${id}`, { method: "DELETE", credentials: "include" });
    fetchPolicies();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Policies</h1>
        </div>
        <button onClick={openAdd}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={13} /> Add Policy
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : policies.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "60px", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No policies yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {policies.map(p => (
            <div key={p.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>{p.type}</span>
                  <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, fontWeight: 400, color: "var(--text)", margin: "6px 0 0" }}>{p.title}</h3>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => openEdit(p)}
                    style={{ padding: "6px 12px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5, fontSize: 11, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                    <Pencil size={11} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    style={{ padding: "6px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 3, cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", fontSize: 11, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#e05555"; e.currentTarget.style.color = "#e05555"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {parseContent(p.content).slice(0, 3).map((item, j) => (
                  <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 8 }} />
                    <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{item}</span>
                  </li>
                ))}
                {parseContent(p.content).length > 3 && (
                  <li style={{ fontSize: 11, color: "var(--text-subtle)", marginLeft: 13 }}>+{parseContent(p.content).length - 3} more…</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 28px" }}>
              {modal === "add" ? "Add Policy" : "Edit Policy"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "type" as const, label: "Policy Type", options: TYPES },
                { key: "title" as const, label: "Title" },
              ].map(({ key, label, options }) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>{label}</label>
                  {options ? (
                    <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }}>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>
                  Content <span style={{ fontWeight: 400, fontSize: 8, color: "var(--text-subtle)" }}>(one bullet point per line)</span>
                </label>
                <textarea rows={8} value={rawContent} onChange={e => setRawContent(e.target.value)}
                  placeholder={"Each line becomes a bullet point.\nExample:\nAppointments require 50% deposit.\nCancellations must be 24hrs in advance."}
                  style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
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
