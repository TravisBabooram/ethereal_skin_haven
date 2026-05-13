"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Search } from "lucide-react";

const PAGES = [
  { key: "home",     label: "Home",      path: "/" },
  { key: "services", label: "Services",  path: "/services" },
  { key: "products", label: "Products",  path: "/products" },
  { key: "about",    label: "About",     path: "/about" },
  { key: "contact",  label: "Contact",   path: "/contact" },
  { key: "booking",  label: "Booking",   path: "/booking" },
  { key: "gallery",  label: "Gallery",   path: "/gallery" },
  { key: "faq",      label: "FAQ",       path: "/faq" },
  { key: "policies", label: "Policies",  path: "/policies" },
];

type Settings = Record<string, string>;

export default function AdminSEOPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { credentials: "include" })
      .then(r => r.json())
      .then(d => setSettings(d ?? {}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const titleLen = (key: string) => (settings[`seo_${key}_title`] ?? "").length;
  const descLen  = (key: string) => (settings[`seo_${key}_desc`]  ?? "").length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Search size={14} style={{ color: "var(--gold)" }} />
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>Admin Panel</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>SEO Controls</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Set custom meta titles and descriptions for each page. Leave blank to use the default.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PAGES.map(page => (
          <div key={page.key} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", margin: 0 }}>{page.label}</p>
              <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{page.path}</span>
            </div>
            <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Meta Title</label>
                  <span style={{ fontSize: 10, color: titleLen(page.key) > 60 ? "#e05555" : "var(--text-subtle)" }}>{titleLen(page.key)}/60</span>
                </div>
                <input className="input-base" style={{ fontSize: 13, padding: "10px 12px" }}
                  placeholder={`${page.label} | Ethereal Skin Haven`}
                  value={settings[`seo_${page.key}_title`] ?? ""}
                  onChange={e => setSettings(p => ({ ...p, [`seo_${page.key}_title`]: e.target.value }))} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Meta Description</label>
                  <span style={{ fontSize: 10, color: descLen(page.key) > 160 ? "#e05555" : "var(--text-subtle)" }}>{descLen(page.key)}/160</span>
                </div>
                <input className="input-base" style={{ fontSize: 13, padding: "10px 12px" }}
                  placeholder="Brief description for search engines…"
                  value={settings[`seo_${page.key}_desc`] ?? ""}
                  onChange={e => setSettings(p => ({ ...p, [`seo_${page.key}_desc`]: e.target.value }))} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
        <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1 }}>
          {saving ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={12} /> Save All SEO Settings</>}
        </button>
        {saved && <span style={{ fontSize: 12, color: "#4caf50" }}>✓ All settings saved</span>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
