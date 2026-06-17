"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, MapPin, CalendarCheck } from "lucide-react";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayConfig = { open: boolean; start: string; end: string };
type WeekConfig = Record<string, DayConfig>;

function fmt12Short(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour} ${ampm}` : `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatOpenDays(hours: WeekConfig): string {
  const open = [0,1,2,3,4,5,6].filter(i => hours[String(i)]?.open);
  if (open.length === 0) return "Closed";
  if (open.length === 7) return "Every Day";
  if (open.length === 1) return SHORT_DAYS[open[0]];
  const consecutive = open.every((idx, i) => i === 0 || idx === open[i - 1] + 1);
  if (consecutive) return `${SHORT_DAYS[open[0]]} – ${SHORT_DAYS[open[open.length - 1]]}`;
  return open.map(i => SHORT_DAYS[i]).join(", ");
}

function formatOpenHours(hours: WeekConfig): string {
  const openDays = Object.values(hours).filter(d => d.open);
  if (openDays.length === 0) return "—";
  const first = openDays[0];
  const allSame = openDays.every(d => d.start === first.start && d.end === first.end);
  if (allSame) return `${fmt12Short(first.start)} – ${fmt12Short(first.end)}`;
  return "Hours vary";
}

function formatOpenLabel(hours: WeekConfig): string {
  const count = Object.values(hours).filter(d => d.open).length;
  if (count === 7) return "Open every day";
  if (count === 1) return "Open one day a week";
  return `Open ${count} days a week`;
}

const DEFAULT: WeekConfig = {
  "0": { open: false, start: "09:00", end: "18:00" },
  "1": { open: false, start: "09:00", end: "18:00" },
  "2": { open: true,  start: "09:00", end: "18:00" },
  "3": { open: true,  start: "09:00", end: "18:00" },
  "4": { open: true,  start: "09:00", end: "18:00" },
  "5": { open: true,  start: "09:00", end: "18:00" },
  "6": { open: true,  start: "09:00", end: "18:00" },
};

export default function BusinessInfoBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hours, setHours] = useState<WeekConfig>(DEFAULT);

  useEffect(() => {
    fetch("/api/business-hours")
      .then(r => r.json())
      .then((data: WeekConfig) => setHours({ ...DEFAULT, ...data }))
      .catch(() => {});
  }, []);

  const info = [
    { icon: Calendar,      value: formatOpenDays(hours),   label: formatOpenLabel(hours) },
    { icon: Clock,         value: formatOpenHours(hours),  label: "Business hours" },
    { icon: MapPin,        value: "Couva, Trinidad",        label: "Balisier Avenue" },
    { icon: CalendarCheck, value: "By Appointment",         label: "Book to secure your slot" },
  ];

  return (
    <section ref={ref} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {info.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: "36px 28px",
                textAlign: "center",
                borderRight: i < info.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Icon size={18} style={{ color: "var(--gold)", opacity: 0.8 }} />
              <div>
                <p style={{
                  fontFamily: "var(--font-cormorant, Georgia, serif)",
                  fontSize: "clamp(16px, 2vw, 20px)",
                  fontWeight: 400,
                  color: "var(--text)",
                  margin: "0 0 4px",
                  lineHeight: 1.2,
                }}>{value}</p>
                <p style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--text-muted)", textTransform: "uppercase", margin: 0 }}>{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
