"use client";

import { useEffect, useState } from "react";
import { Loader2, X, CalendarOff, Plus } from "lucide-react";

function formatDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function BlockedDatesPage() {
  const [blocked, setBlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [saved, setSaved] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/admin/settings", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        try { setBlocked(JSON.parse(d.blocked_dates ?? "[]")); } catch { setBlocked([]); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async (dates: string[]) => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ blocked_dates: JSON.stringify(dates.sort()) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addDate = () => {
    if (!newDate || blocked.includes(newDate)) return;
    const updated = [...blocked, newDate].sort();
    setBlocked(updated);
    setNewDate("");
    save(updated);
  };

  const removeDate = (date: string) => {
    const updated = blocked.filter(d => d !== date);
    setBlocked(updated);
    save(updated);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: "0 0 8px" }}>Blocked Dates</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Dates blocked here will show as unavailable in the booking calendar. Clients cannot book on these days.</p>
      </div>

      {/* Add date */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "24px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 40, right: 40, height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 16px" }}>Block a Date</p>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600 }}>Select Date</label>
            <input type="date" min={minDate} value={newDate} onChange={e => setNewDate(e.target.value)}
              style={{ padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none" }} />
          </div>
          <button onClick={addDate} disabled={!newDate || blocked.includes(newDate) || saving}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: !newDate ? "not-allowed" : "pointer", opacity: !newDate ? 0.5 : 1, whiteSpace: "nowrap" }}>
            {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Plus size={12} />}
            Block Date
          </button>
        </div>
        {newDate && blocked.includes(newDate) && (
          <p style={{ fontSize: 11, color: "#f59e0b", margin: "8px 0 0" }}>This date is already blocked.</p>
        )}
        {saved && <p style={{ fontSize: 11, color: "#4caf50", margin: "8px 0 0" }}>✓ Saved</p>}
      </div>

      {/* Blocked dates list */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, margin: 0 }}>Blocked Dates</p>
          <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{blocked.length} date{blocked.length !== 1 ? "s" : ""} blocked</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 24px", color: "var(--text-muted)" }}>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
          </div>
        ) : blocked.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <CalendarOff size={28} style={{ color: "var(--border)", marginBottom: 12 }} />
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No dates blocked</p>
            <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: "4px 0 0" }}>Clients can book any available day</p>
          </div>
        ) : (
          blocked.map((date, i) => {
            const isPast = date < new Date().toISOString().split("T")[0];
            return (
              <div key={date} style={{ padding: "14px 24px", borderBottom: i < blocked.length - 1 ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: isPast ? 0.5 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CalendarOff size={14} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, color: "var(--text)", margin: 0, fontWeight: 500 }}>{formatDisplay(date)}</p>
                    {isPast && <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: "2px 0 0" }}>Past date</p>}
                  </div>
                </div>
                <button onClick={() => removeDate(date)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", padding: 6, display: "flex", alignItems: "center", borderRadius: 4, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#e05555"; e.currentTarget.style.background = "rgba(224,85,85,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-subtle)"; e.currentTarget.style.background = "transparent"; }}>
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
