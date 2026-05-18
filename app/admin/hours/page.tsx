"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Clock } from "lucide-react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DayConfig {
  open: boolean;
  start: string;
  end: string;
}

type WeekConfig = Record<string, DayConfig>;

const DEFAULT: WeekConfig = {
  "0": { open: false, start: "09:00", end: "18:00" },
  "1": { open: false, start: "09:00", end: "18:00" },
  "2": { open: true,  start: "09:00", end: "18:00" },
  "3": { open: true,  start: "09:00", end: "18:00" },
  "4": { open: true,  start: "09:00", end: "18:00" },
  "5": { open: true,  start: "09:00", end: "18:00" },
  "6": { open: true,  start: "09:00", end: "18:00" },
};

function fmt12(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function BusinessHoursPage() {
  const [hours, setHours] = useState<WeekConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        try {
          const parsed = JSON.parse(d.business_hours ?? "null");
          if (parsed) setHours({ ...DEFAULT, ...parsed });
        } catch { /* use default */ }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (day: string, field: keyof DayConfig, value: string | boolean) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ business_hours: JSON.stringify(hours) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const openDays = Object.values(hours).filter(d => d.open).length;

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: "0 0 8px" }}>Business Hours</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Set which days you're open and your operating hours. Clients cannot book on closed days.</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "60px 0", color: "var(--text-muted)" }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
        </div>
      ) : (
        <>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

            {DAY_NAMES.map((name, i) => {
              const day = String(i);
              const cfg = hours[day];
              return (
                <div key={day} style={{ padding: "18px 28px", borderBottom: i < 6 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                  {/* Open toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 160 }}>
                    <button
                      onClick={() => update(day, "open", !cfg.open)}
                      style={{
                        width: 44, height: 24, borderRadius: 12,
                        background: cfg.open ? "var(--gold)" : "var(--bg-elevated)",
                        border: `1px solid ${cfg.open ? "var(--gold)" : "var(--border)"}`,
                        cursor: "pointer", position: "relative", transition: "background 0.25s, border-color 0.25s", flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: "absolute", top: 2,
                        left: cfg.open ? 22 : 2,
                        width: 18, height: 18, borderRadius: "50%",
                        background: cfg.open ? "#080808" : "var(--text-subtle)",
                        transition: "left 0.25s cubic-bezier(0.22,1,0.36,1)",
                      }} />
                    </button>
                    <span style={{ fontSize: 13, color: "var(--text)", fontWeight: cfg.open ? 500 : 400, minWidth: 90 }}>{name}</span>
                    {!cfg.open && <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-subtle)", textTransform: "uppercase" }}>Closed</span>}
                  </div>

                  {/* Time pickers */}
                  {cfg.open && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 8, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Opens</label>
                        <input type="time" value={cfg.start} onChange={e => update(day, "start", e.target.value)}
                          style={{ padding: "7px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
                      </div>
                      <span style={{ color: "var(--text-subtle)", marginTop: 16 }}>—</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 8, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Closes</label>
                        <input type="time" value={cfg.end} onChange={e => update(day, "end", e.target.value)}
                          style={{ padding: "7px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
                      </div>
                      <div style={{ marginTop: 16, padding: "7px 12px", background: "rgba(201,169,110,0.06)", border: "1px solid var(--border)", borderRadius: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={11} style={{ color: "var(--gold)" }} />
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{fmt12(cfg.start)} – {fmt12(cfg.end)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Open <strong style={{ color: "var(--text)" }}>{openDays} day{openDays !== 1 ? "s" : ""}</strong> per week ·{" "}
              {DAY_NAMES.filter((_, i) => hours[String(i)]?.open).join(", ")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.8 : 1 }}>
              {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={12} />}
              {saving ? "Saving…" : "Save Hours"}
            </button>
            {saved && <span style={{ fontSize: 12, color: "#4caf50" }}>✓ Saved — takes effect immediately</span>}
          </div>
        </>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
