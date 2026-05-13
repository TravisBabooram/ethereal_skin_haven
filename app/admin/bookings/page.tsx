"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, ChevronDown } from "lucide-react";

interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  paymentMethod: string;
  totalPrice: number;
  notes?: string;
  user: { name: string; email: string; phone?: string };
  bookingItems: { service?: { name: string }; price: number }[];
  createdAt: string;
}

const STATUSES = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
const STATUS_COLORS: Record<string, string> = {
  Pending: "#C9A96E",
  Confirmed: "#4caf50",
  Completed: "#9A8878",
  Cancelled: "#e05555",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

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

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    fetchBookings(filter);
  };

  const filtered = bookings.filter(b =>
    search === "" ||
    b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingItems?.[0]?.service?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: "0 0 24px" }}>Bookings</h1>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
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
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13 }}>Loading bookings…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "60px", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No bookings found.</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Client", "Service", "Date & Time", "Payment", "Total", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.18em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ margin: "0 0 2px", color: "var(--text)", fontWeight: 500 }}>{b.user?.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--text-subtle)" }}>{b.user?.email}</p>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-muted)", maxWidth: 180 }}>
                      {b.bookingItems?.map(i => i.service?.name).filter(Boolean).join(", ") || "—"}
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <p style={{ margin: "0 0 2px", color: "var(--text)" }}>
                        {new Date(b.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--text-subtle)" }}>{b.appointmentTime}</p>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{b.paymentMethod}</td>
                    <td style={{ padding: "14px 16px", color: "var(--gold)", fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 15 }}>${b.totalPrice?.toFixed(0)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: STATUS_COLORS[b.status] ?? "var(--text-muted)" }}>{b.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <select
                          disabled={updating === b.id}
                          value={b.status}
                          onChange={e => updateStatus(b.id, e.target.value)}
                          style={{ padding: "6px 28px 6px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text-muted)", fontSize: 10, letterSpacing: "0.1em", cursor: "pointer", outline: "none", appearance: "none" }}
                        >
                          {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
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
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
