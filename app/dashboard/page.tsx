"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  bookingItems: { service?: { name: string }; quantity: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#C9A96E",
  Confirmed: "#4caf50",
  Completed: "#9A8878",
  Cancelled: "#e05555",
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Client");

  useEffect(() => {
    fetch("/api/users/profile", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.name) setUserName(d.name.split(" ")[0]); })
      .catch(() => {});

    fetch("/api/bookings", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setBookings(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(b => new Date(b.appointmentDate) >= new Date() && b.status !== "Cancelled");
  const past = bookings.filter(b => new Date(b.appointmentDate) < new Date() || b.status === "Cancelled");

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="card-base" style={{ padding: "24px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 18, color: "var(--text)", margin: "0 0 4px" }}>
            {booking.bookingItems.map(i => i.service?.name).filter(Boolean).join(", ") || "Treatment"}
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Calendar size={12} style={{ color: "var(--text-subtle)" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {new Date(booking.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Clock size={12} style={{ color: "var(--text-subtle)" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{booking.appointmentTime}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: STATUS_COLORS[booking.status] ?? "var(--text-muted)" }}>{booking.status}</span>
          <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 18, color: "var(--gold)" }}>${booking.totalPrice}</span>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>Payment: {booking.paymentMethod}</span>
        <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--text-subtle)", textTransform: "uppercase" }}>#{booking.id.slice(0, 8).toUpperCase()}</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Dashboard</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 300, color: "var(--text)", margin: 0 }}>
          Welcome back, <em style={{ fontStyle: "italic" }}>{userName}</em>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 48 }}>
        {[
          { label: "Total Bookings", value: bookings.length },
          { label: "Upcoming", value: upcoming.length },
          { label: "Completed", value: bookings.filter(b => b.status === "Completed").length },
          { label: "Total Spent", value: `$${bookings.filter(b => b.status !== "Cancelled").reduce((sum, b) => sum + b.totalPrice, 0)}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "20px 22px" }}>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 32, color: "var(--gold)", margin: "0 0 4px", fontWeight: 300 }}>{value}</p>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-muted)", textTransform: "uppercase", margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, color: "var(--text)", margin: 0, fontWeight: 400 }}>Upcoming Appointments</h2>
          <Link href="/booking" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none" }}>
            Book New <ArrowRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "24px 0" }}>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: 13 }}>Loading your bookings…</span>
          </div>
        ) : upcoming.length === 0 ? (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "40px", textAlign: "center" }}>
            <Calendar size={32} style={{ color: "var(--text-subtle)", margin: "0 auto 16px", display: "block" }} />
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: "var(--text)", margin: "0 0 8px" }}>No upcoming appointments</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>Ready to book your next visit?</p>
            <Link href="/booking" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2 }}>
              Book Now
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, color: "var(--text)", margin: "0 0 20px", fontWeight: 400 }}>Past Visits</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {past.slice(0, 5).map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}
