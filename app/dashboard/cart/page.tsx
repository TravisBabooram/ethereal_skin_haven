"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Loader2, Trash2, Plus, Minus, Package } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  service?: { id: string; name: string; price: number; duration?: number; category?: string } | null;
  product?: { id: string; name: string; price: number; image?: string } | null;
}

export default function CustomerCartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { loadCart(); }, []);

  const loadCart = () => {
    setLoading(true);
    fetch("/api/cart", { credentials: "include" })
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  const updateQty = async (id: string, quantity: number) => {
    setUpdating(id);
    await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
      credentials: "include",
    });
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
    setUpdating(null);
  };

  const removeItem = async (id: string) => {
    setUpdating(id);
    await fetch(`/api/cart/${id}`, { method: "DELETE", credentials: "include" });
    setItems(prev => prev.filter(i => i.id !== id));
    setUpdating(null);
  };

  const subtotal = items.reduce((sum, item) => {
    const price = item.service?.price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 6px" }}>My Account</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 32, fontWeight: 300, color: "var(--text)", margin: 0 }}>My Cart</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>Review your selected services and products.</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
        </div>
      ) : items.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "80px 40px", textAlign: "center" }}>
          <ShoppingBag size={36} style={{ color: "var(--text-subtle)", marginBottom: 16 }} />
          <p style={{ fontSize: 16, color: "var(--text-muted)", margin: "0 0 8px" }}>Your cart is empty</p>
          <p style={{ fontSize: 13, color: "var(--text-subtle)", margin: 0 }}>Browse our services and products to add items.</p>
        </div>
      ) : (
        <div className="cart-layout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
          {/* Items */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
            {items.map((item, idx) => {
              const name = item.service?.name ?? item.product?.name ?? "Unknown";
              const price = item.service?.price ?? item.product?.price ?? 0;
              const isService = !!item.service;
              const busy = updating === item.id;
              return (
                <div key={item.id} style={{ padding: "20px 24px", borderBottom: idx < items.length - 1 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", gap: 16, opacity: busy ? 0.6 : 1, transition: "opacity 0.2s" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 4, background: "rgba(201,169,110,0.08)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Package size={16} style={{ color: isService ? "var(--gold)" : "var(--text-subtle)" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", margin: 0 }}>{name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "3px 0 0", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {isService ? "Service" : "Product"}{item.service?.duration ? ` · ${item.service.duration} min` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={busy} style={{ width: 36, height: 36, borderRadius: 4, background: "var(--bg-elevated)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                      <Minus size={11} />
                    </button>
                    <span style={{ fontSize: 13, color: "var(--text)", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} disabled={busy} style={{ width: 36, height: 36, borderRadius: 4, background: "var(--bg-elevated)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                      <Plus size={11} />
                    </button>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", minWidth: 64, textAlign: "right" }}>${(price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} disabled={busy} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", display: "flex", padding: 4 }}
                    onMouseEnter={e => e.currentTarget.style.color = "#e05555"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-subtle)"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
            <div style={{ padding: "24px" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 20px" }}>Order Summary</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Items ({items.length})</span>
                <span style={{ fontSize: 13, color: "var(--text)" }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>Subtotal</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "var(--gold)" }}>${subtotal.toFixed(2)}</span>
              </div>
              <a href={`/booking?services=${items.filter(i => i.service).map(i => i.service!.id).join(",")}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", color: "#080808", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2, textDecoration: "none", cursor: "pointer" }}>
                Proceed to Booking
              </a>
              <p style={{ fontSize: 11, color: "var(--text-subtle)", textAlign: "center", margin: "12px 0 0" }}>Payment collected at appointment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
