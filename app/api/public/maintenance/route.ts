import { NextResponse } from "next/server";
import { getSetting } from "@/lib/services/settings";

export async function GET() {
  const value = await getSetting("maintenance_mode");
  return NextResponse.json({ maintenance: value === "true" });
}
