"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, ChevronDown, X, Phone, Mail, MessageCircle, Calendar, Plus, Clock } from "lucide-react";

interface Service { id: string; name: string; price: number; duration: number; category?: string; }
interface UserOption { id: string; name: string; email: string; phone?: string; }
interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  paymentMethod: string;
  totalPrice: number;
  notes?: string;
  user: { name: string; email: string; phone?: string };
  bookingItems: { service?: { name: string; duration: number; price: number }; price: number; quantity: number }[];
  createdAt: string;
}

const STATUSES = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
const STATUS_COLORS: Record<string, string> = {
  Pending: "#C9A96E", Confirmed: "#4caf50", Completed: "#9A8878", Cancelled: "#e05555",
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const inputStyle = { padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" as const };
const labelStyle = { fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" as const, fontWeight: 600 };

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);

  // Reschedule
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rDate, setRDate] = useState("");
  const [rTime, setRTime] = useState("");
  const [rSlots, setRSlots] = useState<string[]>([]);
  const [rLoading, setRLoading] = useState(false);
  const [rSaving, setRSaving] = useState(false);

  // New booking
  const [newOpen, setNewOpen] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [newForm, setNewForm] = useState({ userId: "", serviceId: "", date: "", time: "", paymentMethod: "Cash", notes: "" });
  const [newSlots, setNewSlots] = useState<string[]>([]);
  const [newSlotsLoading, setNewSlotsLoading] = useState(false);
  const [newSaving, setNewSaving] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];

  const fetchBookings = (status?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status && status !== "All") params.set("status", status);
    params.set("limit", "100");
    fetch(`/api/admin/bookings?${params}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => setBookings(Array.isArray(d.bookings) ? d.bookings : Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(filter); }, [filter]);

  // Fetch slots for reschedule
  useEffect(() => {
    if (!rDate || !selected) return;
    setRLoading(true);
    const dur = selected.bookingItems.reduce((s, i) => s + (i.service?.duration ?? 60) * (i.quantity ?? 1), 0) || 60;
    fetch(`/api/bookings/availability?date=${rDate}&duration=${dur}`)
      .then(r => r.json())
      .then(d => { setRSlots(d.slots ?? []); setRTime(""); })
      .catch(() => {})
      .finally(() => setRLoading(false));
  }, [rDate, selected]);

  // Fetch slots for new booking
  useEffect(() => {
    if (!newForm.date || !newForm.serviceId) return;
    setNewSlotsLoading(true);
    const svc = services.find(s => s.id === newForm.serviceId);
    fetch(`/api/bookings/availability?date=${newForm.date}&duration=${svc?.duration ?? 60}`)
      .then(r => r.json())
      .then(d => { setNewSlots(d.slots ?? []); setNewForm(p => ({ ...p, time: "" })); })
      .catch(() => {})
      .finally(() => setNewSlotsLoading(false));
  }, [newForm.date, newForm.serviceId, services]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
  };

  const handleReschedule = async () => {
    if (!selected || !rDate || !rTime) return;
    setRSaving(true);
    await fetch(`/api/admin/bookings/${selected.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ appointmentDate: rDate, appointmentTime: rTime }),
    });
    setRSaving(false);
    setRescheduleOpen(false);
    setSelected(prev => prev ? { ...prev, appointmentDate: rDate, appointmentTime: rTime } : prev);
    fetchBookings(filter);
  };

  const openNew = () => {
    Promise.all([
      fetch("/api/admin/users?limit=200", { credentials: "include" }).then(r => r.json()),
      fetch("/api/services", { credentials: "include" }).then(r => r.json()),
    ]).then(([u, s]) => {
      if (Array.isArray(u.users)) setUsers(u.users); else if (Array.isArray(u)) setUsers(u);
      if (Array.isArray(s)) setServices(s);
    });
    setNewForm({ userId: "", serviceId: "", date: "", time: "", paymentMethod: "Cash", notes: "" });
    setNewSlots([]);
    setNewOpen(true);
  };

  const handleNewBooking = async () => {
    if (!newForm.userId || !newForm.serviceId || !newForm.date || !newForm.time) return;
    setNewSaving(true);
    const svc = services.find(s => s.id === newForm.serviceId);
    await fetch("/api/admin/bookings", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({
        userId: newForm.userId,
        services: [{ serviceId: newForm.serviceId, quantity: 1 }],
        appointmentDate: newForm.date,
        appointmentTime: newForm.time,
        paymentMethod: newForm.paymentMethod,
        notes: newForm.notes,
        totalPrice: svc?.price ?? 0,
      }),
    });
    setNewSaving(false);
    setNewOpen(false);
    fetchBookings(filter);
  };

  const filtered = bookings.filter(b =>
    search === "" ||
    b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingItems?.[0]?.service?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const SlotPicker = ({ slots, value, onChange, loading: l }: { slots: string[]; value: string; onChange: (v: string) => void; loading: boolean }) => (
    l ? (
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 12 }}>
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading slots…
      </div>
    ) : slots.length === 0 ? (
      <p style={{ fontSize: 12, color: "#e05555", margin: 0 }}>No available slots on this date.</p>
    ) : (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {slots.map(slot => (
          <button key={slot} onClick={() => onChange(slot)} type="button"
            style={{ padding: "7px 14px", background: value === slot ? "var(--gold)" : "var(--bg-elevated)", border: `1px solid ${value === slot ? "var(--gold)" : "var(--border)"}`, borderRadius: 3, color: value === slot ? "#080808" : "var(--text-muted)", fontSize: 11, cursor: "pointer", fontWeight: value === slot ? 600 : 400 }}>
            {fmtTime(slot)}
          </button>
        ))}
      </div>
    )
  );

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* Main table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
              <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Bookings</h1>
            </div>
            <button onClick={openNew}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={13} /> New Booking
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: "8px 18px", background: filter === s ? "var(--gold)" : "none", border: "1px solid " + (filter === s ? "var(--gold)" : "var(--border)"), color: filter === s ? "#080808" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, fontWeight: filter === s ? 600 : 400 }}>
                {s}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", maxWidth: 340 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client or service…"
              style={{ width: "100%", padding: "10px 12px 10px 36px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading bookings…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "60px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No bookings found.</p>
          </div>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
            <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "0", padding: "12px 16px 0", letterSpacing: "0.03em" }}>Click a row to view full details</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Client", "Service", "Date & Time", "Total", "Status", "Update"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.18em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id}
                      onClick={() => setSelected(prev => prev?.id === b.id ? null : b)}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s", cursor: "pointer", background: selected?.id === b.id ? "var(--bg-elevated)" : "transparent" }}
                      onMouseEnter={e => { if (selected?.id !== b.id) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                      onMouseLeave={e => { if (selected?.id !== b.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ margin: "0 0 2px", color: "var(--text)", fontWeight: 500 }}>{b.user?.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "var(--text-subtle)" }}>{b.user?.email}</p>
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)", maxWidth: 160 }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                          {b.bookingItems?.map(i => i.service?.name).filter(Boolean).join(", ") || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <p style={{ margin: "0 0 2px", color: "var(--text)", fontSize: 12 }}>
                          {new Date(b.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: "var(--text-subtle)" }}>{fmtTime(b.appointmentTime)}</p>
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--gold)", fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 15 }}>${b.totalPrice?.toFixed(0)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: STATUS_COLORS[b.status] ?? "var(--text-muted)" }}>{b.status}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <select disabled={updating === b.id} value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                            style={{ padding: "6px 28px 6px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text-muted)", fontSize: 10, cursor: "pointer", outline: "none", appearance: "none" }}>
                            {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown size={10} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-subtle)" }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ width: 340, flexShrink: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", position: "sticky", top: 24 }}>
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 17, color: "var(--text)", margin: "0 0 4px", fontWeight: 500 }}>{selected.user?.name}</p>
              <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: STATUS_COLORS[selected.status] ?? "var(--text-muted)" }}>{selected.status}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: "16px 20px", maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={12} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.user?.email}</span>
              </div>
              {selected.user?.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Phone size={12} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.user.phone}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <a href={`mailto:${selected.user?.email}`}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "rgba(201,169,110,0.08)", border: "1px solid var(--border)", borderRadius: 2, color: "var(--gold)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
                  <Mail size={10} /> Email
                </a>
                {selected.user?.phone && (
                  <a href={`https://wa.me/${selected.user.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 2, color: "#25d366", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>
                    <MessageCircle size={10} /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Appointment */}
            <div style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "12px 14px", marginBottom: 14 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 10px" }}>Appointment</p>
              {[
                ["Date", fmt(selected.appointmentDate)],
                ["Time", fmtTime(selected.appointmentTime)],
                ["Payment", selected.paymentMethod],
                ["Total", `$${selected.totalPrice?.toFixed(0)} TTD`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>{label}</span>
                  <span style={{ fontSize: label === "Total" ? 15 : 12, color: label === "Total" ? "var(--gold)" : "var(--text)", fontWeight: label === "Date" || label === "Time" ? 500 : 400, fontFamily: label === "Total" ? "var(--font-cormorant, Georgia, serif)" : "inherit" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Services */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 8px" }}>Services</p>
              {selected.bookingItems?.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: 4, marginBottom: 6 }}>
                  <div>
                    <p style={{ margin: "0 0 1px", fontSize: 12, color: "var(--text)" }}>{item.service?.name || "Treatment"}{(item.quantity ?? 1) > 1 ? ` ×${item.quantity}` : ""}</p>
                    {item.service?.duration && <p style={{ margin: 0, fontSize: 10, color: "var(--text-subtle)" }}>{item.service.duration * (item.quantity ?? 1)} min</p>}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--gold)" }}>${(item.price * (item.quantity ?? 1)).toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div style={{ marginBottom: 14, padding: "10px 12px", background: "rgba(201,169,110,0.04)", border: "1px solid var(--border)", borderRadius: 4 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 5px" }}>Client Notes</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>"{selected.notes}"</p>
              </div>
            )}

            {/* Reschedule */}
            {selected.status !== "Cancelled" && selected.status !== "Completed" && (
              <button onClick={() => { setRDate(""); setRTime(""); setRSlots([]); setRescheduleOpen(true); }}
                style={{ width: "100%", padding: "10px", background: "rgba(201,169,110,0.08)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--gold)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontWeight: 600 }}>
                <Calendar size={12} /> Reschedule Appointment
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reschedule modal */}
      {rescheduleOpen && selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 460, position: "relative" }}>
            <button onClick={() => setRescheduleOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 4px" }}>Reschedule</h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 24px" }}>{selected.user?.name} — {selected.bookingItems?.[0]?.service?.name || "Treatment"}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>New Date</label>
                <input type="date" min={minDate} value={rDate} onChange={e => setRDate(e.target.value)} style={inputStyle} />
              </div>
              {rDate && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={labelStyle}>New Time</label>
                  <SlotPicker slots={rSlots} value={rTime} onChange={setRTime} loading={rLoading} />
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={() => setRescheduleOpen(false)}
                style={{ padding: "10px 20px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleReschedule} disabled={rSaving || !rDate || !rTime}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: !rDate || !rTime ? "not-allowed" : "pointer", opacity: !rDate || !rTime ? 0.5 : 1 }}>
                {rSaving ? "Saving…" : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking modal */}
      {newOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button onClick={() => setNewOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 4px" }}>New Booking</h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 24px" }}>Create a booking on behalf of a client</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Client</label>
                <select value={newForm.userId} onChange={e => setNewForm(p => ({ ...p, userId: e.target.value }))} style={inputStyle}>
                  <option value="">— Select Client —</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Service</label>
                <select value={newForm.serviceId} onChange={e => setNewForm(p => ({ ...p, serviceId: e.target.value, time: "" }))} style={inputStyle}>
                  <option value="">— Select Service —</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price} TTD ({s.duration} min)</option>)}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Date</label>
                <input type="date" min={minDate} value={newForm.date} onChange={e => setNewForm(p => ({ ...p, date: e.target.value, time: "" }))} style={inputStyle} />
              </div>
              {newForm.date && newForm.serviceId && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={labelStyle}>Time</label>
                  <SlotPicker slots={newSlots} value={newForm.time} onChange={v => setNewForm(p => ({ ...p, time: v }))} loading={newSlotsLoading} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Payment Method</label>
                <select value={newForm.paymentMethod} onChange={e => setNewForm(p => ({ ...p, paymentMethod: e.target.value }))} style={inputStyle}>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea rows={2} value={newForm.notes} onChange={e => setNewForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any special requests…"
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={() => setNewOpen(false)}
                style={{ padding: "10px 20px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleNewBooking} disabled={newSaving || !newForm.userId || !newForm.serviceId || !newForm.date || !newForm.time}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", opacity: !newForm.userId || !newForm.serviceId || !newForm.date || !newForm.time ? 0.5 : 1 }}>
                {newSaving ? "Creating…" : "Create Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .clock-icon{color:var(--text-subtle)}`}</style>
    </div>
  );
}
