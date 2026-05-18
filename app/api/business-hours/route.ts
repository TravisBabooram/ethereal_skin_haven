import { NextResponse } from "next/server";
import { getSetting } from "@/lib/services/settings";

const DEFAULT = {
  "0": { open: false, start: "09:00", end: "18:00" },
  "1": { open: false, start: "09:00", end: "18:00" },
  "2": { open: true,  start: "09:00", end: "18:00" },
  "3": { open: true,  start: "09:00", end: "18:00" },
  "4": { open: true,  start: "09:00", end: "18:00" },
  "5": { open: true,  start: "09:00", end: "18:00" },
  "6": { open: true,  start: "09:00", end: "18:00" },
};

export async function GET() {
  try {
    const raw = await getSetting("business_hours").catch(() => null);
    const hours = raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    return NextResponse.json(hours);
  } catch {
    return NextResponse.json(DEFAULT);
  }
}
