"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, User, X, Mail, Phone, Calendar, ShoppingBag, DollarSign, Clock, Trash2, Plus, UserPlus } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isManualEntry?: boolean;
  createdAt: string;
  _count?: { bookings: number };
}

interface BookingItem { service?: { name: string; duration: number } | null; customServiceName?: string | null; quantity: number; price: number; }
interface Booking {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  notes?: string;
  bookingItems: BookingItem[];
}
interface CartItem { id: string; quantity: number; service?: { name: string; price: number }; product?: { name: string; price: number }; }

interface UserDetail extends UserRecord {
  bookings: Booking[];
  cartItems: CartItem[];
  totalSpent: number;
}

const STATUS_COLOR: Record<string, string> = {
  Pending: "#C9A96E", Confirmed: "#4caf50", Completed: "#9A8878", Cancelled: "#e05555",
};

const inputStyle = { padding: "10px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" as const };
const labelStyle = { fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" as const, fontWeight: 600 };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Add client modal
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", phone: "" });
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users?limit=200", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.users)) setUsers(d.users); else if (Array.isArray(d)) setUsers(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setSelected(null);
    const res = await fetch(`/api/admin/users/${id}`, { credentials: "include" });
    const d = await res.json();
    setSelected(d);
    setDetailLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}'s account and all their data?`)) return;
    setDeleting(true);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    setSelected(null);
    setDeleting(false);
    fetchUsers();
  };

  const handleAddClient = async () => {
    if (!addForm.name.trim()) { setAddError("Name is required"); return; }
    setAddSaving(true);
    setAddError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: addForm.name.trim(), phone: addForm.phone.trim() || undefined }),
    });
    setAddSaving(false);
    if (res.ok) {
      setAddOpen(false);
      setAddForm({ name: "", phone: "" });
      fetchUsers();
    } else {
      const d = await res.json().catch(() => ({}));
      setAddError(d.error ?? "Something went wrong");
    }
  };

  const filtered = users.filter(u =>
    search === "" ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    (!u.isManualEntry && u.email?.toLowerCase().includes(search.toLowerCase())) ||
    u.phone?.includes(search)
  );

  function serviceLabel(item: BookingItem) {
    return item.customServiceName ?? item.service?.name ?? "Treatment";
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* Main table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 9, letterSpacing: "0.35em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Manage</p>
              <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 38, fontWeight: 300, color: "var(--text)", margin: 0 }}>Clients</h1>
            </div>
            <button onClick={() => { setAddForm({ name: "", phone: "" }); setAddError(""); setAddOpen(true); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", border: "none", borderRadius: 2, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>
              <UserPlus size={13} /> Add Client
            </button>
          </div>
          <div style={{ position: "relative", maxWidth: 340 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone…"
              style={{ width: "100%", padding: "10px 12px 10px 36px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "60px 0" }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /><span style={{ fontSize: 13 }}>Loading…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "60px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No clients found.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 16 }}>{filtered.length} client{filtered.length !== 1 ? "s" : ""} — click a row to view details</p>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Client", "Email / Type", "Phone", "Bookings", "Joined"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.18em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id}
                      onClick={() => openDetail(u.id)}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s", cursor: "pointer", background: selected?.id === u.id ? "var(--bg-elevated)" : "transparent" }}
                      onMouseEnter={e => { if (selected?.id !== u.id) e.currentTarget.style.background = "var(--bg-elevated)"; }}
                      onMouseLeave={e => { if (selected?.id !== u.id) e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: selected?.id === u.id ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.1)", border: `1px solid ${selected?.id === u.id ? "var(--gold)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                            <User size={14} style={{ color: "var(--gold)" }} />
                          </div>
                          <span style={{ color: "var(--text)", fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>
                        {u.isManualEntry ? (
                          <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-subtle)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 2, padding: "2px 6px" }}>Manual Entry</span>
                        ) : u.email}
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{u.phone || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{u._count?.bookings ?? 0}</td>
                      <td style={{ padding: "14px 16px", color: "var(--text-subtle)", fontSize: 12 }}>
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Detail panel */}
      {(detailLoading || selected) && (
        <div style={{ width: 380, flexShrink: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", position: "sticky", top: 24 }}>
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

          {detailLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
              <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
            </div>
          ) : selected && (
            <>
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(201,169,110,0.12)", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={18} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 18, color: "var(--text)", margin: "0 0 2px", fontWeight: 500 }}>{selected.name}</p>
                      {selected.isManualEntry && (
                        <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-subtle)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 2, padding: "2px 5px" }}>Manual</span>
                      )}
                    </div>
                    <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: 0, letterSpacing: "0.05em" }}>
                      {selected.isManualEntry ? "Manually added" : "Client since"} {new Date(selected.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "20px 24px", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                {/* Contact info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {!selected.isManualEntry && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Mail size={13} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{selected.email}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Phone size={13} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{selected.phone || "No phone on file"}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
                  {[
                    { icon: Calendar, label: "Bookings", value: selected.bookings.length },
                    { icon: DollarSign, label: "Total Spent", value: `$${selected.totalSpent.toFixed(0)}` },
                    { icon: ShoppingBag, label: "Cart Items", value: selected.cartItems.length },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "12px", textAlign: "center" }}>
                      <Icon size={13} style={{ color: "var(--gold)", marginBottom: 4 }} />
                      <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: "var(--text)", margin: "0 0 2px", fontWeight: 300 }}>{value}</p>
                      <p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text-subtle)", textTransform: "uppercase", margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Booking history */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Booking History</p>
                  {selected.bookings.length === 0 ? (
                    <p style={{ fontSize: 12, color: "var(--text-subtle)", margin: 0 }}>No bookings yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {selected.bookings.map(b => (
                        <div key={b.id} style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "12px 14px", border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                            <div>
                              <p style={{ fontSize: 12, color: "var(--text)", margin: "0 0 2px", fontWeight: 500 }}>
                                {b.bookingItems.map(i => serviceLabel(i)).filter(Boolean).join(", ") || "Treatment"}
                              </p>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <Calendar size={10} style={{ color: "var(--text-subtle)" }} />
                                <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>
                                  {new Date(b.appointmentDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                                <Clock size={10} style={{ color: "var(--text-subtle)" }} />
                                <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{b.appointmentTime}</span>
                              </div>
                            </div>
                            <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: STATUS_COLOR[b.status] ?? "var(--text-muted)" }}>{b.status}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, color: "var(--text-subtle)" }}>{b.paymentMethod}</span>
                            <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 15, color: "var(--gold)" }}>${b.totalPrice.toFixed(0)}</span>
                          </div>
                          {b.notes && <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "6px 0 0", fontStyle: "italic" }}>"{b.notes}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart items */}
                {selected.cartItems.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Current Cart</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {selected.cartItems.map(c => (
                        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--bg-elevated)", borderRadius: 4 }}>
                          <span style={{ fontSize: 12, color: "var(--text)" }}>{c.service?.name || c.product?.name || "Item"} × {c.quantity}</span>
                          <span style={{ fontSize: 12, color: "var(--gold)" }}>${((c.service?.price || c.product?.price || 0) * c.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delete client */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  <button onClick={() => handleDelete(selected.id, selected.name)} disabled={deleting}
                    style={{ width: "100%", padding: "10px", background: "rgba(224,85,85,0.07)", border: "1px solid rgba(224,85,85,0.25)", borderRadius: 4, color: "#e05555", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontWeight: 600 }}>
                    {deleting ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={12} />}
                    {deleting ? "Deleting…" : "Delete Client"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add Client modal */}
      {addOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "36px", width: "100%", maxWidth: 420, position: "relative" }}>
            <button onClick={() => setAddOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
              <X size={18} />
            </button>
            <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, fontWeight: 400, color: "var(--text)", margin: "0 0 4px" }}>Add Client</h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 24px" }}>Manually add a client to your records</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Name *</label>
                <input
                  placeholder="Full name"
                  value={addForm.name}
                  onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                  style={inputStyle}
                  autoFocus
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={labelStyle}>Phone Number</label>
                <input
                  placeholder="+1 (868) 000-0000"
                  value={addForm.phone}
                  onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))}
                  style={inputStyle}
                />
              </div>
              {addError && (
                <p style={{ fontSize: 12, color: "#e05555", margin: 0 }}>{addError}</p>
              )}
              <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: 0, lineHeight: 1.6 }}>
                This client will be added to your records and can be selected when creating bookings. They will not receive a login account.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button onClick={() => setAddOpen(false)}
                style={{ padding: "10px 20px", background: "none", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleAddClient} disabled={addSaving || !addForm.name.trim()}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", borderRadius: 2, color: "#080808", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: !addForm.name.trim() ? "not-allowed" : "pointer", opacity: !addForm.name.trim() ? 0.5 : 1 }}>
                {addSaving ? "Saving…" : "Add Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
