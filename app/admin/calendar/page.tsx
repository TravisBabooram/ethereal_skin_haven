"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2, Calendar, Clock, User } from "lucide-react";

interface BookingItem { service?: { name: string; duration: number } | null }
interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  totalPrice: number;
  user: { name: string; email: string; phone: string | null };
  bookingItems: BookingItem[];
}

type View = "month" | "week" | "day";

const STATUS_COLOR: Record<string, string> = {
  Pending: "#C9A96E",
  Confirmed: "#4caf50",
  Completed: "#9A8878",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
function startOfWeek(d: Date) {
  const r = new Date(d); r.setDate(r.getDate() - r.getDay()); return r;
}

export default function AdminCalendarPage() {
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetchBookings = useCallback((from: string, to: string) => {
    setLoading(true);
    fetch(`/api/admin/bookings/calendar?from=${from}&to=${to}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setBookings(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (view === "month") {
      const y = cursor.getFullYear(), m = cursor.getMonth();
      fetchBookings(`${y}-${String(m+1).padStart(2,"0")}-01`, toDateStr(new Date(y, m+1, 0)));
    } else if (view === "week") {
      const s = startOfWeek(cursor);
      fetchBookings(toDateStr(s), toDateStr(addDays(s, 6)));
    } else {
      fetchBookings(toDateStr(cursor), toDateStr(cursor));
    }
  }, [cursor, view, fetchBookings]);

  const navigate = (dir: number) => {
    const next = new Date(cursor);
    if (view === "month") next.setMonth(next.getMonth() + dir);
    else if (view === "week") next.setDate(next.getDate() + dir * 7);
    else next.setDate(next.getDate() + dir);
    setCursor(next);
  };

  const bookingsFor = (dateStr: string) => bookings.filter(b => b.appointmentDate.slice(0, 10) === dateStr);

  const titleLabel = () => {
    if (view === "month") return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
    if (view === "week") {
      const s = startOfWeek(cursor), e = addDays(s, 6);
      return `${s.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${e.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;
    }
    return cursor.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  };

  // Month grid
  const renderMonth = () => {
    const y = cursor.getFullYear(), m = cursor.getMonth();
    const daysInMonth = new Date(y, m+1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const cells = Array.from({length: firstDay}, (_, i) => ({ key: `e${i}`, empty: true, dateStr: "" }))
      .concat(Array.from({length: daysInMonth}, (_, i) => {
        const d = i + 1;
        const dateStr = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        return { key: dateStr, empty: false, d, dateStr };
      }));

    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
          {DAYS.map(d => (
            <div key={d} style={{ background: "var(--bg-card)", padding: "10px 0", textAlign: "center", fontSize: 9, letterSpacing: "0.2em", color: "var(--text-subtle)", textTransform: "uppercase" }}>{d}</div>
          ))}
          {cells.map(cell => {
            if (cell.empty) return <div key={cell.key} style={{ background: "var(--bg-card)", minHeight: 90 }} />;
            const dayBookings = bookingsFor(cell.dateStr);
            const isToday = cell.dateStr === toDateStr(new Date());
            return (
              <div key={cell.key} style={{ background: "var(--bg-card)", minHeight: 90, padding: "8px", cursor: dayBookings.length ? "pointer" : "default", transition: "background 0.15s" }}
                onMouseEnter={e => { if (dayBookings.length) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; }}
                onClick={() => { if (dayBookings.length) { setCursor(new Date(cell.dateStr + "T12:00:00")); setView("day"); } }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", fontSize: 12, fontWeight: 500, background: isToday ? "var(--gold)" : "transparent", color: isToday ? "#080808" : "var(--text-muted)" }}>{cell.d}</span>
                <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                  {dayBookings.slice(0, 3).map(b => (
                    <div key={b.id} style={{ padding: "2px 6px", borderRadius: 2, background: `${STATUS_COLOR[b.status] ?? "#888"}22`, borderLeft: `2px solid ${STATUS_COLOR[b.status] ?? "#888"}`, fontSize: 10, color: STATUS_COLOR[b.status] ?? "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {b.appointmentTime} {b.user.name.split(" ")[0]}
                    </div>
                  ))}
                  {dayBookings.length > 3 && <span style={{ fontSize: 9, color: "var(--text-subtle)" }}>+{dayBookings.length - 3} more</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Week grid
  const renderWeek = () => {
    const s = startOfWeek(cursor);
    const days = Array.from({length: 7}, (_, i) => addDays(s, i));
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
        {days.map(d => {
          const dateStr = toDateStr(d);
          const dayBookings = bookingsFor(dateStr);
          const isToday = dateStr === toDateStr(new Date());
          return (
            <div key={dateStr} style={{ background: "var(--bg-card)", border: `1px solid ${isToday ? "var(--gold)" : "var(--border)"}`, borderRadius: 6, padding: "12px 10px", minHeight: 200 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 0 2px" }}>{DAYS[d.getDay()]}</p>
              <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: isToday ? "var(--gold)" : "var(--text)", margin: "0 0 12px", fontWeight: isToday ? 500 : 300 }}>{d.getDate()}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {dayBookings.map(b => (
                  <div key={b.id} onClick={() => setSelected(b)} style={{ padding: "6px 8px", borderRadius: 3, background: `${STATUS_COLOR[b.status] ?? "#888"}18`, borderLeft: `3px solid ${STATUS_COLOR[b.status] ?? "#888"}`, cursor: "pointer" }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>{b.appointmentTime}</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.user.name}</p>
                  </div>
                ))}
                {dayBookings.length === 0 && <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>—</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Day list
  const renderDay = () => {
    const dateStr = toDateStr(cursor);
    const dayBookings = bookingsFor(dateStr);
    const hours = Array.from({length: 10}, (_, i) => i + 9);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
        {hours.map(h => {
          const timeStr = `${String(h).padStart(2,"0")}:00`;
          const halfStr = `${String(h).padStart(2,"0")}:30`;
          const atHour = dayBookings.filter(b => b.appointmentTime.startsWith(String(h).padStart(2,"0")+":"));
          return (
            <div key={h} style={{ display: "grid", gridTemplateColumns: "80px 1fr", borderBottom: "1px solid var(--border)" }}>
              <div style={{ padding: "14px 16px", borderRight: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>{h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h-12} PM`}</p>
              </div>
              <div style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 4, minHeight: 52 }}>
                {atHour.map(b => (
                  <div key={b.id} onClick={() => setSelected(b)} style={{ padding: "8px 12px", borderRadius: 4, background: `${STATUS_COLOR[b.status] ?? "#888"}18`, borderLeft: `3px solid ${STATUS_COLOR[b.status] ?? "#888"}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>{b.appointmentTime} — {b.user.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{b.bookingItems.map(i => i.service?.name).filter(Boolean).join(", ")}</p>
                    </div>
                    <span style={{ fontSize: 10, color: STATUS_COLOR[b.status], letterSpacing: "0.1em", textTransform: "uppercase" }}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Admin Panel</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Booking Calendar</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(["month","week","day"] as View[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "8px 16px", background: view === v ? "linear-gradient(135deg, var(--gold-dark), var(--gold))" : "var(--bg-elevated)", border: `1px solid ${view === v ? "var(--gold)" : "var(--border)"}`, borderRadius: 2, color: view === v ? "#080808" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: view === v ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--text-muted)", padding: "6px 10px", display: "flex", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
          <ChevronLeft size={16} />
        </button>
        <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, fontWeight: 400, color: "var(--text)", margin: 0, minWidth: 260, textAlign: "center" }}>{titleLabel()}</h2>
        <button onClick={() => navigate(1)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--text-muted)", padding: "6px 10px", display: "flex", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
          <ChevronRight size={16} />
        </button>
        <button onClick={() => { setCursor(new Date()); }} style={{ marginLeft: 8, padding: "6px 14px", background: "none", border: "1px solid var(--border)", borderRadius: 2, cursor: "pointer", color: "var(--text-muted)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
          Today
        </button>
        {loading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />}
      </div>

      {view === "month" && renderMonth()}
      {view === "week" && renderWeek()}
      {view === "day" && renderDay()}

      {/* Booking detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "32px", width: "100%", maxWidth: 460, position: "relative" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", marginBottom: 24 }} />
            <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", margin: "0 0 4px" }}>Booking Detail</p>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 11, color: "var(--text-subtle)", margin: "0 0 20px" }}>#{selected.id.slice(0,8).toUpperCase()}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <User size={14} style={{ color: "var(--gold)" }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", margin: 0 }}>{selected.user.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{selected.user.email}{selected.user.phone ? ` · ${selected.user.phone}` : ""}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Calendar size={14} style={{ color: "var(--gold)" }} />
                <p style={{ fontSize: 13, color: "var(--text)", margin: 0 }}>
                  {new Date(selected.appointmentDate + "T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Clock size={14} style={{ color: "var(--gold)" }} />
                <p style={{ fontSize: 13, color: "var(--text)", margin: 0 }}>{selected.appointmentTime}</p>
              </div>
              <div style={{ padding: "14px 16px", background: "var(--bg-elevated)", borderRadius: 4, display: "flex", flexDirection: "column", gap: 6 }}>
                {selected.bookingItems.map((item, i) => (
                  <p key={i} style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                    {item.service?.name ?? "Service"}{item.service?.duration ? ` — ${item.service.duration} min` : ""}
                  </p>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: `${STATUS_COLOR[selected.status] ?? "#888"}22`, color: STATUS_COLOR[selected.status] ?? "var(--text-muted)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>{selected.status}</span>
                <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--gold)" }}>${selected.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ marginTop: 24, width: "100%", padding: "11px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
