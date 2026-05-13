"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Loader2, CheckCircle, XCircle, AlertCircle, Package, Ban } from "lucide-react";

interface BookingItem {
  id: string;
  service?: { name: string; price: number; duration: number } | null;
  quantity: number;
  price: number;
}

interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  paymentMethod: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  bookingItems: BookingItem[];
}

const STATUS_STYLES: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Pending:   { color: "#C9A96E", bg: "rgba(201,169,110,0.08)", icon: <AlertCircle size={13} /> },
  Confirmed: { color: "#4caf50", bg: "rgba(76,175,80,0.08)",   icon: <CheckCircle size={13} /> },
  Completed: { color: "var(--text-muted)", bg: "var(--bg-elevated)", icon: <CheckCircle size={13} /> },
  Cancelled: { color: "#e05555", bg: "rgba(220,60,60,0.08)",   icon: <XCircle size={13} /> },
};

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [cancelling, setCancelling] = useState<string | null>(null);

  const handleCancel = async (bookingId: string, appointmentDate: string, appointmentTime: string) => {
    const apptDate = new Date(`${appointmentDate}T${appointmentTime}`);
    const hoursUntil = (apptDate.getTime() - Date.now()) / 3600000;
    if (hoursUntil < 24) {
      alert("Cancellations must be made at least 24 hours before your appointment. Please contact us via WhatsApp.");
      return;
    }
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(bookingId);
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "Cancelled" }),
      });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "Cancelled" } : b));
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    fetch("/api/bookings", { credentials: "include" })
      .then(r => r.json())
      .then(d => setBookings(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const statuses = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const upcoming = bookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
  const completed = bookings.filter(b => b.status === "Completed").length;
  const totalSpent = bookings.filter(b => b.status === "Completed").reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 6px" }}>My Account</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 32, fontWeight: 300, color: "var(--text)", margin: 0 }}>My Bookings</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Your full appointment history.</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Bookings", value: bookings.length },
          { label: "Upcoming", value: upcoming },
          { label: "Total Spent", value: `$${totalSpent.toFixed(2)}` },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "20px 24px" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 0 8px" }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, fontWeight: 300, color: "var(--gold)", margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "10px 16px", background: "none", border: "none", borderBottom: filter === s ? "2px solid var(--gold)" : "2px solid transparent", color: filter === s ? "var(--gold)" : "var(--text-muted)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", fontWeight: filter === s ? 600 : 400, marginBottom: -1 }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "60px 40px", textAlign: "center" }}>
          <Calendar size={32} style={{ color: "var(--text-subtle)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 4px" }}>No bookings found</p>
          <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: 0 }}>
            {filter === "All" ? <>Ready to book? <a href="/booking" style={{ color: "var(--gold)", textDecoration: "none" }}>Schedule your first appointment</a>.</> : `No ${filter.toLowerCase()} appointments.`}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(booking => {
            const style = STATUS_STYLES[booking.status] ?? STATUS_STYLES.Pending;
            const date = new Date(booking.appointmentDate + "T12:00:00");
            const isPast = date < new Date();
            return (
              <div key={booking.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                {/* Header row */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={13} style={{ color: "var(--text-subtle)" }} />
                      <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                        {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={13} style={{ color: "var(--text-subtle)" }} />
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{booking.appointmentTime}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, color: "var(--text-subtle)", letterSpacing: "0.1em" }}>#{booking.id.slice(0, 8).toUpperCase()}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: style.bg, color: style.color, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                      {style.icon} {booking.status}
                    </span>
                    {(booking.status === "Pending" || booking.status === "Confirmed") && (
                      <button
                        onClick={() => handleCancel(booking.id, booking.appointmentDate, booking.appointmentTime)}
                        disabled={cancelling === booking.id}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(220,60,60,0.06)", border: "1px solid rgba(220,60,60,0.2)", color: "#e05555", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", cursor: cancelling === booking.id ? "not-allowed" : "pointer", fontWeight: 500, transition: "background 0.2s, border-color 0.2s", opacity: cancelling === booking.id ? 0.5 : 1 }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,60,60,0.12)"; e.currentTarget.style.borderColor = "rgba(220,60,60,0.4)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,60,60,0.06)"; e.currentTarget.style.borderColor = "rgba(220,60,60,0.2)"; }}
                      >
                        {cancelling === booking.id ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : <Ban size={11} />}
                        {cancelling === booking.id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div style={{ padding: "14px 24px" }}>
                  {booking.bookingItems.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Package size={13} style={{ color: "var(--gold)", flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{item.service?.name ?? "Service"}</span>
                        {item.service?.duration && <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>· {item.service.duration} min</span>}
                      </div>
                      <span style={{ fontSize: 13, color: "var(--gold)" }}>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 20 }}>
                      <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>Payment: <span style={{ color: "var(--text-muted)" }}>{booking.paymentMethod}</span></span>
                      {booking.notes && <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>Note: <span style={{ color: "var(--text-muted)" }}>{booking.notes}</span></span>}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isPast ? "var(--text-muted)" : "var(--gold)" }}>${booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
