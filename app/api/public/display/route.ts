import { NextResponse } from "next/server";
import { getSetting } from "@/lib/services/settings";

export async function GET() {
  const value = await getSetting("hide_images");
  return NextResponse.json({ hideImages: value === "true" });
}
