"use client";

import { useEffect, useState } from "react";
import { Loader2, Power, ShoppingBag, ImageIcon } from "lucide-react";

type Toggle = { value: boolean; saving: boolean; saved: boolean };
const off: Toggle = { value: false, saving: false, saved: false };

export default function AdminSettingsPage() {
  const [maintenance, setMaintenance] = useState<Toggle>(off);
  const [products,    setProducts]    = useState<Toggle>(off);
  const [gallery,     setGallery]     = useState<Toggle>(off);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/maintenance",   { credentials: "include" }).then(r => r.json()),
      fetch("/api/admin/coming-soon",   { credentials: "include" }).then(r => r.json()),
    ]).then(([m, cs]) => {
      setMaintenance(t => ({ ...t, value: m.maintenance ?? false }));
      setProducts(t    => ({ ...t, value: cs.products ?? false }));
      setGallery(t     => ({ ...t, value: cs.gallery  ?? false }));
    }).finally(() => setLoading(false));
  }, []);

  const toggleMaintenance = async (next: boolean) => {
    setMaintenance(t => ({ ...t, saving: true, saved: false }));
    await fetch("/api/admin/maintenance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ maintenance: next }),
    });
    setMaintenance({ value: next, saving: false, saved: true });
    setTimeout(() => setMaintenance(t => ({ ...t, saved: false })), 2500);
  };

  const toggleComingSoon = async (field: "products" | "gallery", next: boolean) => {
    const set = field === "products" ? setProducts : setGallery;
    set(t => ({ ...t, saving: true, saved: false }));
    await fetch("/api/admin/coming-soon", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [field]: next }),
    });
    set({ value: next, saving: false, saved: true });
    setTimeout(() => set(t => ({ ...t, saved: false })), 2500);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 660 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>Site Settings</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, fontWeight: 400, color: "var(--text)", margin: 0 }}>Settings</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Maintenance Mode ─────────────────────────────── */}
        <ToggleCard
          icon={<Power size={16} style={{ color: maintenance.value ? "#e05555" : "var(--text-muted)" }} />}
          title="Maintenance Mode"
          description="When enabled, visitors will see a Coming Soon page instead of your website. Admins can still log in and access this panel normally."
          state={maintenance}
          activeColor="#e05555"
          activeBg="rgba(224,85,85,0.12)"
          activeBorder="rgba(224,85,85,0.25)"
          activeCardBorder="rgba(224,85,85,0.35)"
          onToggle={toggleMaintenance}
          warningText="Maintenance mode is active. Your website is currently hidden from visitors."
        />

        {/* ── Products Coming Soon ─────────────────────────── */}
        <ToggleCard
          icon={<ShoppingBag size={16} style={{ color: products.value ? "var(--pink)" : "var(--text-muted)" }} />}
          title="Products — Coming Soon"
          description="Replaces the Products page with an animated Coming Soon overlay. Visitors cannot browse products until this is turned off."
          state={products}
          activeColor="var(--pink)"
          activeBg="var(--pink-glow)"
          activeBorder="rgba(244,40,112,0.28)"
          activeCardBorder="rgba(244,40,112,0.30)"
          onToggle={next => toggleComingSoon("products", next)}
          warningText="Products page is currently showing the Coming Soon screen."
        />

        {/* ── Gallery Coming Soon ──────────────────────────── */}
        <ToggleCard
          icon={<ImageIcon size={16} style={{ color: gallery.value ? "var(--pink)" : "var(--text-muted)" }} />}
          title="Gallery — Coming Soon"
          description="Replaces the Gallery page with an animated Coming Soon overlay. Visitors cannot view the gallery until this is turned off."
          state={gallery}
          activeColor="var(--pink)"
          activeBg="var(--pink-glow)"
          activeBorder="rgba(244,40,112,0.28)"
          activeCardBorder="rgba(244,40,112,0.30)"
          onToggle={next => toggleComingSoon("gallery", next)}
          warningText="Gallery page is currently showing the Coming Soon screen."
        />

      </div>
    </div>
  );
}

/* ── Reusable toggle card ──────────────────────────────────── */
function ToggleCard({
  icon, title, description, state, activeColor, activeBg, activeBorder, activeCardBorder, onToggle, warningText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  state: Toggle;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  activeCardBorder: string;
  onToggle: (next: boolean) => void;
  warningText: string;
}) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: state.value ? `1px solid ${activeCardBorder}` : "1px solid var(--border)",
      borderRadius: 8,
      padding: "28px 32px",
      transition: "border-color 0.35s",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            {icon}
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 18, fontWeight: 500, color: "var(--text)", margin: 0 }}>
              {title}
            </h2>
            <span style={{
              fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "3px 8px", borderRadius: 2,
              background: state.value ? activeBg : "rgba(201,169,110,0.10)",
              color: state.value ? activeColor : "var(--gold)",
              border: `1px solid ${state.value ? activeBorder : "rgba(201,169,110,0.20)"}`,
              transition: "all 0.3s",
            }}>
              {state.value ? "ON" : "OFF"}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
            {description}
          </p>
        </div>

        {/* Toggle switch */}
        <button
          onClick={() => onToggle(!state.value)}
          disabled={state.saving}
          aria-label={`Toggle ${title}`}
          style={{
            flexShrink: 0,
            width: 52, height: 28, borderRadius: 14, border: "none",
            cursor: state.saving ? "wait" : "pointer",
            background: state.value ? activeBg : "rgba(201,169,110,0.20)",
            position: "relative",
            transition: "background 0.3s",
            padding: 0,
            outline: "none",
          }}
        >
          <div style={{
            position: "absolute",
            top: 4,
            left: state.value ? 26 : 4,
            width: 20, height: 20,
            borderRadius: "50%",
            background: state.value ? activeColor : "var(--gold)",
            transition: "left 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {state.saving && <Loader2 size={10} style={{ color: "#fff", animation: "spin 1s linear infinite" }} />}
          </div>
        </button>
      </div>

      {/* Warning banner */}
      {state.value && (
        <div style={{
          marginTop: 20, padding: "12px 16px",
          background: activeBg,
          border: `1px solid ${activeBorder}`,
          borderRadius: 4, fontSize: 12,
          color: activeColor, lineHeight: 1.55,
          transition: "opacity 0.3s",
        }}>
          <strong>{warningText}</strong> Toggle off above when you&apos;re ready.
        </div>
      )}

      {state.saved && (
        <p style={{ marginTop: 14, fontSize: 12, color: "var(--gold)", letterSpacing: "0.05em" }}>✓ Saved</p>
      )}
    </div>
  );
}
