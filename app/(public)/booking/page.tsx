"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Clock, Calendar, User, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCAPTCHA_SITE_KEY = "cda45378-45f6-463a-a83e-758e8e9c4d7e";

interface Service { id: string; name: string; price: number; duration: number; category?: string; }

const SERVICES_PLACEHOLDER: Service[] = [
  { id: "1", name: "Dermaplaning Facial", price: 420, duration: 75, category: "Facials" },
  { id: "2", name: "Deep Cleansing Facial", price: 0, duration: 60, category: "Facials" },
  { id: "3", name: "Brazilian Wax", price: 0, duration: 45, category: "Waxing" },
  { id: "4", name: "Hollywood & Full Leg Wax", price: 480, duration: 60, category: "Waxing" },
  { id: "5", name: "Underarm Wax + Ingrown Removal", price: 0, duration: 30, category: "Waxing" },
  { id: "6", name: "Full Body Wax (Men)", price: 0, duration: 90, category: "Waxing" },
  { id: "7", name: "Vajacial", price: 0, duration: 45, category: "Intimate Care" },
  { id: "8", name: "Brazilian Wax + Vajacial Combo", price: 0, duration: 75, category: "Intimate Care" },
  { id: "9", name: "Intimate Brightening Treatment", price: 0, duration: 60, category: "Intimate Care" },
  { id: "10", name: "Penacial / Manjacial (Men)", price: 0, duration: 45, category: "Intimate Care" },
  { id: "11", name: "Brow Lamination + Tint", price: 0, duration: 60, category: "Brows" },
  { id: "12", name: "Citrus Infused Jelly Pedi", price: 0, duration: 60, category: "Nails" },
  { id: "13", name: "Rose Petal Pedi", price: 200, duration: 60, category: "Nails" },
];

const STEPS = [
  { icon: CheckCircle, label: "Service" },
  { icon: Calendar, label: "Date" },
  { icon: Clock, label: "Time" },
  { icon: User, label: "Details" },
  { icon: CreditCard, label: "Payment" },
  { icon: Check, label: "Confirm" },
];

const TIME_SLOTS = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>(SERVICES_PLACEHOLDER);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [payment, setPayment] = useState<"Cash" | "Bank Transfer">("Cash");

  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HCaptcha>(null);
  const preselectedRef = useRef(false);
  const STORAGE_KEY = "ethereal_booking_progress";
  const STORAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  // Restore progress from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Date.now() - saved.ts < STORAGE_TTL) {
          if (saved.step > 0) setStep(saved.step);
          if (saved.selectedServices?.length) setSelectedServices(saved.selectedServices);
          if (saved.selectedDate) setSelectedDate(saved.selectedDate);
          if (saved.selectedTime) setSelectedTime(saved.selectedTime);
          if (saved.form) setForm(f => ({ ...f, ...saved.form }));
          if (saved.payment) setPayment(saved.payment);
          if (saved.calYear) setCalYear(saved.calYear);
          if (saved.calMonth != null) setCalMonth(saved.calMonth);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save progress on any state change
  useEffect(() => {
    if (bookingDone) { localStorage.removeItem(STORAGE_KEY); return; }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ts: Date.now(), step, selectedServices, selectedDate, selectedTime, form, payment, calYear, calMonth,
      }));
    } catch {}
  }, [step, selectedServices, selectedDate, selectedTime, form, payment, calYear, calMonth, bookingDone]);

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: f.name || user.name || "",
        email: f.email || user.email || "",
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (preselectedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("services");
    if (ids) {
      preselectedRef.current = true;
      setSelectedServices(ids.split(",").filter(Boolean));
    }
  }, []);

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setServices(data); })
      .catch(() => {})
      .finally(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDate || selectedServices.length === 0) return;
    const sel = services.filter(s => selectedServices.includes(s.id));
    const totalDuration = sel.reduce((sum, s) => sum + s.duration, 0);
    setLoadingSlots(true);
    fetch(`/api/bookings/availability?date=${selectedDate}&duration=${totalDuration}`)
      .then(r => r.json())
      .then(data => { if (data.slots) setAvailableSlots(data.slots); })
      .catch(() => setAvailableSlots(TIME_SLOTS))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedServices]);

  const selectedSvcObjs = services.filter(s => selectedServices.includes(s.id));
  const totalPrice = selectedSvcObjs.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedSvcObjs.reduce((sum, s) => sum + s.duration, 0);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setSelectedTime("");
    setAvailableSlots(TIME_SLOTS);
  };

  const canGoNext = [
    selectedServices.length > 0,
    !!selectedDate,
    !!selectedTime,
    !!form.name && !!form.email,
    true,
  ][step] ?? true;

  const handleSubmit = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/booking";
      return;
    }
    if (!captchaToken) {
      alert("Please complete the CAPTCHA before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          notes: form.notes,
          paymentMethod: payment,
          services: selectedServices.map(id => ({ serviceId: id, quantity: 1 })),
          captchaToken,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingRef(data.id?.slice(0, 8).toUpperCase() ?? "ESH-0001");
        setBookingDone(true);
        setStep(5);
      } else {
        captchaRef.current?.resetCaptcha();
        setCaptchaToken("");
        alert(data.error || "There was an issue processing your booking. Please try again.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 32 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 },
  };

  return (
    <>
      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 0, background: "var(--bg)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 32px 48px" }}>
          <p style={{ fontSize: 9, letterSpacing: "0.45em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Reserve Your Visit</p>
          <h1 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, color: "var(--text)", margin: "0 0 12px" }}>Book an Appointment</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>Complete the steps below. Takes less than 2 minutes.</p>
        </div>

        {/* Step indicator */}
        {step < 5 && (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 32px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {STEPS.slice(0, 5).map(({ label }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: i < step ? "var(--gold)" : i === step ? "transparent" : "transparent",
                      border: i === step ? "2px solid var(--gold)" : i < step ? "none" : "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s",
                    }}>
                      {i < step ? <Check size={14} style={{ color: "#080808" }} /> : <span style={{ fontSize: 11, color: i === step ? "var(--gold)" : "var(--text-subtle)", fontWeight: 600 }}>{i + 1}</span>}
                    </div>
                    <span style={{ fontSize: 9, letterSpacing: "0.2em", color: i === step ? "var(--gold)" : i < step ? "var(--text-muted)" : "var(--text-subtle)", textTransform: "uppercase" }}>{label}</span>
                  </div>
                  {i < 4 && <div className="booking-step-connector" style={{ width: 48, height: 1, background: i < step ? "var(--gold)" : "var(--border)", margin: "0 4px 20px", transition: "background 0.4s" }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Form area */}
      <section style={{ background: "var(--bg)", padding: "48px 0 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* STEP 0 — Choose services */}
              {step === 0 && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 400 }}>Select Your Treatment(s)</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 28px" }}>Choose one or more services. You may combine treatments in a single visit.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
                    {services.map(svc => {
                      const sel = selectedServices.includes(svc.id);
                      return (
                        <button key={svc.id} onClick={() => toggleService(svc.id)} style={{ padding: "20px 22px", background: sel ? "rgba(201,169,110,0.06)" : "var(--bg-card)", border: `1px solid ${sel ? "var(--gold)" : "var(--border)"}`, borderRadius: 6, cursor: "pointer", textAlign: "left", transition: "all 0.25s", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <div>
                            {svc.category && <span style={{ fontSize: 8, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>{svc.category}</span>}
                            <p style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 17, color: "var(--text)", margin: "0 0 6px" }}>{svc.name}</p>
                            <div style={{ display: "flex", gap: 14 }}>
                              <span style={{ fontSize: 12, color: "var(--gold)", fontFamily: "var(--font-cormorant, Georgia, serif)", fontWeight: 500 }}>{svc.price > 0 ? `$${svc.price} TTD` : "Enquire"}</span>
                              <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>{svc.duration} min</span>
                            </div>
                          </div>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${sel ? "var(--gold)" : "var(--border)"}`, background: sel ? "var(--gold)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s", marginTop: 2 }}>
                            {sel && <Check size={11} style={{ color: "#080808" }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedServices.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24, padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedServices.length} treatment{selectedServices.length > 1 ? "s" : ""} · {totalDuration} min total</span>
                      <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: "var(--gold)", fontWeight: 500 }}>${totalPrice}</span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 1 — Date */}
              {step === 1 && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 400 }}>Choose a Date</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 28px" }}>Select your preferred appointment date. We&apos;re open every day, 8am–6pm.</p>
                  <div className="card-base" style={{ padding: "32px", maxWidth: 420 }}>
                    {/* Calendar nav */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px 8px", fontSize: 18, transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                      >‹</button>
                      <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 20, color: "var(--text)", fontWeight: 400 }}>{MONTHS[calMonth]} {calYear}</span>
                      <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px 8px", fontSize: 18, transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                      >›</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
                      {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 9, letterSpacing: "0.15em", color: "var(--text-subtle)", padding: "4px 0" }}>{d}</div>)}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                      {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const date = new Date(calYear, calMonth, day);
                        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const isDisabled = isPast;
                        const isSel = dateStr === selectedDate;
                        return (
                          <button
                            key={day}
                            onClick={() => { if (!isDisabled) { setSelectedDate(dateStr); setSelectedTime(""); } }}
                            disabled={isDisabled}
                            style={{
                              aspectRatio: "1", borderRadius: 4, border: isSel ? "1px solid var(--gold)" : "1px solid transparent",
                              background: isSel ? "var(--gold)" : "transparent",
                              color: isDisabled ? "var(--text-subtle)" : isSel ? "#080808" : "var(--text)",
                              fontSize: 13, cursor: isDisabled ? "not-allowed" : "pointer",
                              transition: "all 0.2s", fontWeight: isSel ? 600 : 400,
                              opacity: isDisabled ? 0.3 : 1,
                            }}
                            onMouseEnter={e => { if (!isDisabled && !isSel) e.currentTarget.style.background = "var(--gold-glow)"; }}
                            onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                          >{day}</button>
                        );
                      })}
                    </div>
                    {selectedDate && (
                      <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--gold)", letterSpacing: "0.1em" }}>
                        ✓ {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2 — Time */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 400 }}>Select a Time</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 28px" }}>Available slots on {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.</p>
                  {loadingSlots ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)" }}>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      <span style={{ fontSize: 13 }}>Loading availability…</span>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
                      {availableSlots.map(slot => {
                        const [h] = slot.split(":").map(Number);
                        const label = h < 12 ? slot + " AM" : h === 12 ? slot + " PM" : `${h - 12}:${slot.split(":")[1]} PM`;
                        const isSel = slot === selectedTime;
                        return (
                          <button key={slot} onClick={() => setSelectedTime(slot)} style={{ padding: "12px 8px", textAlign: "center", border: `1px solid ${isSel ? "var(--gold)" : "var(--border)"}`, background: isSel ? "var(--gold)" : "var(--bg-card)", color: isSel ? "#080808" : "var(--text)", fontSize: 13, borderRadius: 4, cursor: "pointer", transition: "all 0.2s", fontWeight: isSel ? 600 : 400 }}>{label}</button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 — Details */}
              {step === 3 && (
                <div>
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 400 }}>Your Details</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>We use this to confirm and remind you of your appointment.</p>
                  {user && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 6, marginBottom: 24 }}>
                      <span style={{ fontSize: 13, color: "var(--gold)" }}>✓</span>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Your details have been filled in from your account. Feel free to edit them.</p>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 520 }}>
                    <div className="booking-name-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Full Name *</label>
                        <input className="input-base" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Phone</label>
                        <input className="input-base" placeholder="Your number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email Address *</label>
                      <input className="input-base" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Notes (Optional)</label>
                      <textarea className="input-base" rows={4} placeholder="Any skin concerns, allergies, or requests…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: "vertical" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 — Payment + Summary */}
              {step === 4 && (
                <div>
                {!user && (
                  <div style={{ marginBottom: 28, padding: "16px 20px", background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                      <span style={{ color: "var(--gold)", fontWeight: 500 }}>Sign in</span> to confirm your booking. Your details above will be saved automatically.
                    </p>
                    <a href="/login?redirect=/booking" style={{ flexShrink: 0, padding: "10px 20px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2, textDecoration: "none" }}>Sign In</a>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }} className="booking-summary-grid">
                  <div>
                    <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 28, color: "var(--text)", margin: "0 0 8px", fontWeight: 400 }}>Payment Info</h2>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 24px", lineHeight: 1.7 }}>
                      A <strong style={{ color: "var(--text)" }}>50% deposit</strong> is required to confirm your booking. Pay via bank transfer — remaining balance due in cash on the day.
                    </p>
                    <div style={{ padding: "20px 22px", border: "1px solid var(--gold)", background: "rgba(201,169,110,0.04)", borderRadius: 6, marginBottom: 16 }}>
                      <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 12px" }}>Bank Transfer Details</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {[["Bank", "First Citizens Bank"], ["Name", "Ethereal Skin Haven"], ["Account No.", "3128614"], ["Type", "Savings"]].map(([l, v]) => (
                          <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>{l}</span>
                            <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: "12px 0 0", fontStyle: "italic" }}>Send your receipt via WhatsApp after payment to confirm your booking.</p>
                    </div>
                    <div style={{ padding: "14px 16px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-card)" }}>
                      <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, margin: "0 0 6px" }}>Remaining Balance</p>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Cash on the day of your appointment.</p>
                    </div>
                  </div>

                  <div className="card-base" style={{ padding: "28px" }}>
                    <h3 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 22, color: "var(--text)", margin: "0 0 20px", fontWeight: 400 }}>Booking Summary</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                      {selectedSvcObjs.map(s => (
                        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>{s.name}</span>
                          <span style={{ fontSize: 13, color: "var(--gold)", flexShrink: 0 }}>${s.price}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                      {[
                        { label: "Date", value: new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                        { label: "Time", value: selectedTime },
                        { label: "Duration", value: totalDuration + " min" },
                        { label: "Name", value: form.name },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: "var(--text-subtle)", letterSpacing: "0.1em" }}>{label}</span>
                          <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>Total</span>
                      <span style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: 26, color: "var(--gold)", fontWeight: 500 }}>${totalPrice}</span>
                    </div>

                    {/* CAPTCHA */}
                    <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
                      <HCaptcha
                        sitekey={HCAPTCHA_SITE_KEY}
                        onVerify={token => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken("")}
                        ref={captchaRef}
                        theme="dark"
                      />
                    </div>
                  </div>
                </div>
                </div>
              )}

              {/* STEP 5 — Confirmed */}
              {step === 5 && (
                <div style={{ textAlign: "center", padding: "20px 0 40px" }}>
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
                      <Check size={36} style={{ color: "#080808" }} strokeWidth={3} />
                    </div>
                  </motion.div>
                  <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, color: "var(--text)", margin: "0 0 12px" }}>Booking Confirmed</h2>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 8px" }}>Reference: <span style={{ color: "var(--gold)", fontWeight: 600, letterSpacing: "0.1em" }}>#{bookingRef}</span></p>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 40px" }}>A confirmation email has been sent to <strong style={{ color: "var(--text)" }}>{form.email}</strong>.</p>
                  <div className="card-base" style={{ padding: "28px", maxWidth: 420, margin: "0 auto 40px", textAlign: "left" }}>
                    {selectedSvcObjs.map(s => (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.name}</span>
                        <span style={{ fontSize: 13, color: "var(--gold)" }}>${s.price}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        ["Date", new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
                        ["Time", selectedTime],
                        ["Payment", payment],
                        ["Total", "$" + totalPrice],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text-subtle)", textTransform: "uppercase", margin: "0 0 2px" }}>{label}</p>
                          <p style={{ fontSize: 13, color: "var(--text)", margin: 0, fontWeight: 500 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/" style={{ padding: "13px 28px", border: "1px solid var(--border)", color: "var(--text)", textDecoration: "none", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", borderRadius: 2 }}>Back to Home</Link>
                    <Link href="/dashboard" style={{ padding: "13px 28px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#080808", textDecoration: "none", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, borderRadius: 2 }}>View My Bookings</Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {step < 5 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.color = "var(--text)"; el.style.borderColor = "var(--border-hover)"; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.color = "var(--text-muted)"; el.style.borderColor = "var(--border)"; }}
                ><ChevronLeft size={14} /> Back</button>
              ) : <div />}

              {step < 4 ? (
                <button onClick={() => { if (canGoNext) setStep(s => s + 1); }} disabled={!canGoNext} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", background: canGoNext ? "linear-gradient(135deg, var(--gold-dark), var(--gold))" : "var(--bg-elevated)", border: "none", color: canGoNext ? "#080808" : "var(--text-subtle)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, cursor: canGoNext ? "pointer" : "not-allowed", borderRadius: 2, transition: "all 0.2s" }}>
                  Continue <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 40px", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", border: "none", color: "#080808", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", borderRadius: 2, opacity: submitting ? 0.8 : 1 }}>
                  {submitting ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Processing…</> : <>Confirm Booking <Check size={14} /></>}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
