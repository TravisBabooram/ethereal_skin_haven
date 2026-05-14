"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const SITE_KEY = "cda45378-45f6-463a-a83e-758e8e9c4d7e";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HCaptcha>(null);

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 8 ? 1 : form.password.length < 12 ? 2 : 3;
  const pwLabels = ["", "Weak", "Good", "Strong"];
  const pwColors = ["", "#e05555", "var(--gold)", "#4caf50"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) { setError("Please complete the CAPTCHA."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        captchaRef.current?.resetCaptcha();
        setCaptchaToken("");
        return;
      }
      await refreshUser();
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: 460 }}
    >
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "48px 44px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, var(--gold) 40%, var(--gold-light) 60%, transparent 100%)" }} />

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.4em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>New Client</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 34, fontWeight: 300, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.2 }}>Create Account</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Join us and manage your appointments with ease.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 4, padding: "12px 16px", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#e05555", margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Full Name</label>
            <input className="input-base" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
            <input className="input-base" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Phone Number</label>
            <input className="input-base" type="tel" placeholder="+1 (868) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input className="input-base" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} style={{ paddingRight: 46 }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-subtle)", display: "flex" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
                {[1, 2, 3].map(lvl => (
                  <div key={lvl} style={{ height: 3, flex: 1, borderRadius: 2, background: pwStrength >= lvl ? pwColors[pwStrength] : "var(--border)", transition: "background 0.3s" }} />
                ))}
                <span style={{ fontSize: 10, color: pwColors[pwStrength], letterSpacing: "0.1em", minWidth: 42 }}>{pwLabels[pwStrength]}</span>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div style={{ padding: "14px 16px", background: "rgba(201,169,110,0.04)", border: "1px solid var(--border)", borderRadius: 4, display: "flex", flexDirection: "column", gap: 8 }}>
            {["Track all your appointments", "Manage your skincare profile", "Exclusive member offers"].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Check size={12} style={{ color: "var(--gold)", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <HCaptcha
              sitekey={SITE_KEY}
              onVerify={token => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken("")}
              ref={captchaRef}
              theme="dark"
            />
          </div>

          <button type="submit" disabled={loading || !captchaToken} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", color: "#080808", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2, cursor: loading || !captchaToken ? "not-allowed" : "pointer", opacity: loading || !captchaToken ? 0.7 : 1 }}>
            {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Creating account…</> : <>Create Account <ArrowRight size={13} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", margin: "24px 0 0" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
