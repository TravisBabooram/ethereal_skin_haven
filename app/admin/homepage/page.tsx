"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Star, Layout } from "lucide-react";

interface Service { id: string; name: string; category?: string; featured: boolean }
interface Product { id: string; name: string; category: string; featured: boolean }
interface Settings { hero_title?: string; hero_subtitle?: string; hero_tagline?: string }

export default function AdminHomepagePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/services", { credentials: "include" }).then(r => r.json()),
      fetch("/api/products", { credentials: "include" }).then(r => r.json()),
      fetch("/api/admin/settings", { credentials: "include" }).then(r => r.json()),
    ]).then(([svc, prd, cfg]) => {
      if (Array.isArray(svc)) setServices(svc);
      if (Array.isArray(prd)) setProducts(prd);
      setSettings({ hero_title: cfg.hero_title ?? "", hero_subtitle: cfg.hero_subtitle ?? "", hero_tagline: cfg.hero_tagline ?? "" });
    }).finally(() => setLoading(false));
  }, []);

  const toggleService = async (s: Service) => {
    const featured = !s.featured;
    const count = services.filter(x => x.featured).length;
    if (featured && count >= 6) { alert("Maximum 6 featured services allowed."); return; }
    await fetch(`/api/services/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ featured }) });
    setServices(prev => prev.map(x => x.id === s.id ? { ...x, featured } : x));
  };

  const toggleProduct = async (p: Product) => {
    const featured = !p.featured;
    const count = products.filter(x => x.featured).length;
    if (featured && count >= 6) { alert("Maximum 6 featured products allowed."); return; }
    await fetch(`/api/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ featured }) });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, featured } : x));
  };

  const saveHero = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
    </div>
  );

  const featuredSvcCount = services.filter(s => s.featured).length;
  const featuredPrdCount = products.filter(p => p.featured).length;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Layout size={14} style={{ color: "var(--gold)" }} />
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>Admin Panel</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Homepage Manager</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Control hero text and which services/products appear on the homepage.</p>
      </div>

      {/* Hero text */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <div style={{ padding: "28px 32px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 20px" }}>Hero Section Text</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {([
              ["hero_tagline", "Tagline (small text above heading)"],
              ["hero_title", "Main Heading"],
              ["hero_subtitle", "Subheading / Description"],
            ] as [keyof Settings, string][]).map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
                <input className="input-base" value={settings[key] ?? ""} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <button onClick={saveHero} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1 }}>
              {saving ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={12} /> Save Hero Text</>}
            </button>
            {saved && <span style={{ fontSize: 12, color: "#4caf50" }}>✓ Saved</span>}
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <div style={{ padding: "22px 32px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>Featured Services</p>
            <span style={{ fontSize: 11, color: featuredSvcCount >= 6 ? "#e05555" : "var(--gold)" }}>{featuredSvcCount}/6 selected</span>
          </div>
        </div>
        <div style={{ padding: "0 32px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
          {services.map(s => (
            <div key={s.id} onClick={() => toggleService(s)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: `1px solid ${s.featured ? "var(--gold)" : "var(--border)"}`, borderRadius: 4, cursor: "pointer", background: s.featured ? "rgba(201,169,110,0.05)" : "transparent", transition: "all 0.2s" }}>
              <div>
                {s.category && <span style={{ fontSize: 8, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>{s.category} · </span>}
                <span style={{ fontSize: 13, color: "var(--text)" }}>{s.name}</span>
              </div>
              <Star size={14} fill={s.featured ? "var(--gold)" : "none"} color={s.featured ? "var(--gold)" : "var(--text-subtle)"} />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <div style={{ padding: "22px 32px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>Featured Products</p>
            <span style={{ fontSize: 11, color: featuredPrdCount >= 6 ? "#e05555" : "var(--gold)" }}>{featuredPrdCount}/6 selected</span>
          </div>
        </div>
        <div style={{ padding: "0 32px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
          {products.map(p => (
            <div key={p.id} onClick={() => toggleProduct(p)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: `1px solid ${p.featured ? "var(--gold)" : "var(--border)"}`, borderRadius: 4, cursor: "pointer", background: p.featured ? "rgba(201,169,110,0.05)" : "transparent", transition: "all 0.2s" }}>
              <div>
                <span style={{ fontSize: 8, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>{p.category} · </span>
                <span style={{ fontSize: 13, color: "var(--text)" }}>{p.name}</span>
              </div>
              <Star size={14} fill={p.featured ? "var(--gold)" : "none"} color={p.featured ? "var(--gold)" : "var(--text-subtle)"} />
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
