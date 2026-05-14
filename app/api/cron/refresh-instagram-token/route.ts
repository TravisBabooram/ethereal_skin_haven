import { NextResponse } from "next/server";

// Refreshes a long-lived Instagram access token before it expires (60-day TTL).
// Called by Vercel cron monthly — see vercel.json.
// Requires INSTAGRAM_ACCESS_TOKEN in .env.local.
export async function GET() {
  const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!TOKEN) {
    return NextResponse.json({ ok: false, error: "INSTAGRAM_ACCESS_TOKEN not set" }, { status: 400 });
  }

  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("[Instagram token refresh]", data.error.message);
      return NextResponse.json({ ok: false, error: data.error.message }, { status: 500 });
    }

    console.log("[Instagram token refresh] Success. Expires in:", data.expires_in, "seconds");
    return NextResponse.json({ ok: true, expiresIn: data.expires_in });
  } catch (err) {
    console.error("[Instagram token refresh] failed:", err);
    return NextResponse.json({ ok: false, error: "Refresh request failed" }, { status: 500 });
  }
}
