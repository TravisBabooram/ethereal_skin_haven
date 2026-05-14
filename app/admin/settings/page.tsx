"use client";

import { useEffect, useState } from "react";
import { Loader2, Power } from "lucide-react";

export default function AdminSettingsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/maintenance", { credentials: "include" })
      .then(r => r.json())
      .then(d => setMaintenance(d.maintenance ?? false))
      .finally(() => setLoading(false));
  }, []);

  const save = async (next: boolean) => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/maintenance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ maintenance: next }),
    });
    setMaintenance(next);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>Site Settings</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, fontWeight: 400, color: "var(--text)", margin: 0 }}>Settings</h1>
      </div>

      {/* Maintenance card */}
      <div style={{
        background: "var(--bg-card)",
        border: maintenance ? "1px solid rgba(224,85,85,0.35)" : "1px solid var(--border)",
        borderRadius: 6,
        padding: "28px 32px",
        transition: "border-color 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Power size={16} style={{ color: maintenance ? "#e05555" : "var(--text-muted)" }} />
              <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 18, fontWeight: 500, color: "var(--text)", margin: 0 }}>
                Maintenance Mode
              </h2>
              <span style={{
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: 2,
                background: maintenance ? "rgba(224,85,85,0.12)" : "rgba(201,169,110,0.1)",
                color: maintenance ? "#e05555" : "var(--gold)",
                border: `1px solid ${maintenance ? "rgba(224,85,85,0.25)" : "rgba(201,169,110,0.2)"}`,
              }}>
                {maintenance ? "ON" : "OFF"}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              When enabled, visitors will see a &ldquo;Coming Soon&rdquo; page instead of your website.
              Admins can still log in and access this panel normally.
            </p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => save(!maintenance)}
            disabled={saving}
            aria-label="Toggle maintenance mode"
            style={{
              flexShrink: 0,
              width: 52,
              height: 28,
              borderRadius: 14,
              border: "none",
              cursor: saving ? "wait" : "pointer",
              background: maintenance ? "rgba(224,85,85,0.8)" : "rgba(201,169,110,0.25)",
              position: "relative",
              transition: "background 0.3s",
              padding: 0,
            }}
          >
            <div style={{
              position: "absolute",
              top: 4,
              left: maintenance ? 26 : 4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: maintenance ? "#e05555" : "var(--gold)",
              transition: "left 0.3s cubic-bezier(0.22,1,0.36,1)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {saving && <Loader2 size={10} style={{ color: "#fff", animation: "spin 1s linear infinite" }} />}
            </div>
          </button>
        </div>

        {/* Warning banner when ON */}
        {maintenance && (
          <div style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "rgba(224,85,85,0.07)",
            border: "1px solid rgba(224,85,85,0.2)",
            borderRadius: 4,
            fontSize: 12,
            color: "#e05555",
            lineHeight: 1.55,
          }}>
            <strong>Maintenance mode is active.</strong> Your website is currently hidden from visitors.
            Toggle off above when you&apos;re ready to go live.
          </div>
        )}

        {/* Saved confirmation */}
        {saved && (
          <p style={{ marginTop: 14, fontSize: 12, color: "var(--gold)", letterSpacing: "0.05em" }}>
            ✓ Saved
          </p>
        )}
      </div>
    </div>
  );
}
