import { NextResponse } from "next/server";

// Refreshes a long-lived Instagram User Access Token before it expires (60-day TTL).
// Called by Vercel cron every 45 days — see vercel.json.
// Requires INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET in .env.local.
export async function GET() {
  const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  const APP_ID = process.env.INSTAGRAM_APP_ID;
  const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

  if (!TOKEN || !APP_ID || !APP_SECRET) {
    return NextResponse.json({ ok: false, error: "Instagram credentials not configured" }, { status: 400 });
  }

  try {
    const url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("[Instagram token refresh]", data.error.message);
      return NextResponse.json({ ok: false, error: data.error.message }, { status: 500 });
    }

    // Log new token so it can be manually updated in Vercel env vars if needed
    // In production, consider storing in your database or Vercel env via Vercel API
    console.log("[Instagram token refresh] New token received. Update INSTAGRAM_ACCESS_TOKEN if changed.");
    console.log("New token expires in:", data.expires_in, "seconds");

    return NextResponse.json({ ok: true, expiresIn: data.expires_in });
  } catch (err) {
    console.error("[Instagram token refresh] failed:", err);
    return NextResponse.json({ ok: false, error: "Refresh request failed" }, { status: 500 });
  }
}
