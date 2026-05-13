"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Loader2, User, Package } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  createdAt: string;
  service?: { id: string; name: string; price: number } | null;
  product?: { id: string; name: string; price: number } | null;
}

interface UserCart {
  user: { id: string; name: string; email: string; phone: string | null };
  items: CartItem[];
  total: number;
}

export default function AdminCartPage() {
  const [carts, setCarts] = useState<UserCart[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cart", { credentials: "include" })
      .then(r => r.json())
      .then(d => { setCarts(d?.carts ?? []); setTotalItems(d?.totalItems ?? 0); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 6px" }}>Admin Panel</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 32, fontWeight: 300, color: "var(--text)", margin: 0 }}>Customer Carts</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Overview of all active customer cart activity.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Active Carts", value: carts.length },
          { label: "Total Items", value: totalItems },
          { label: "Est. Cart Value", value: `$${carts.reduce((s, c) => s + c.total, 0).toFixed(2)}` },
        ].map(stat => (
          <div key={stat.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "20px 24px" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 0 8px" }}>{stat.label}</p>
            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, fontWeight: 300, color: "var(--gold)", margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
        </div>
      ) : carts.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "60px 40px", textAlign: "center" }}>
          <ShoppingBag size={32} style={{ color: "var(--text-subtle)", marginBottom: 12 }} />
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>No active customer carts at the moment.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {carts.map(({ user, items, total }) => (
            <div key={user.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              {/* User header */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,169,110,0.1)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={14} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", margin: 0 }}>{user.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>{user.email}{user.phone ? ` · ${user.phone}` : ""}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "0 0 2px" }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--gold)", margin: 0 }}>${total.toFixed(2)}</p>
                </div>
              </div>

              {/* Items */}
              <div style={{ padding: "12px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map(item => {
                  const name = item.service?.name ?? item.product?.name ?? "Unknown";
                  const price = item.service?.price ?? item.product?.price ?? 0;
                  const isService = !!item.service;
                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Package size={13} style={{ color: isService ? "var(--gold)" : "var(--text-subtle)", flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 13, color: "var(--text)", margin: 0 }}>{name}</p>
                          <p style={{ fontSize: 10, color: "var(--text-subtle)", margin: "2px 0 0", letterSpacing: "0.1em" }}>{isService ? "Service" : "Product"}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Qty {item.quantity} × ${price.toFixed(2)}</p>
                        <p style={{ fontSize: 13, color: "var(--text)", margin: "2px 0 0" }}>${(price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
