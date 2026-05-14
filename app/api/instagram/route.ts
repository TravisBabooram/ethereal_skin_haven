import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

interface InstagramPost {
  id: string;
  mediaType: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export async function GET() {
  const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

  // Gracefully return placeholder state when not yet configured
  if (!TOKEN) {
    return NextResponse.json({ posts: [], configured: false });
  }

  try {
    const fields = "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp";
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=6&access_token=${TOKEN}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.error) {
      console.error("[Instagram API]", data.error.message);
      return NextResponse.json({ posts: [], configured: true, error: data.error.message });
    }

    const posts: InstagramPost[] = (data.data ?? []).map((p: Record<string, string>) => ({
      id: p.id,
      mediaType: p.media_type,
      mediaUrl: p.media_type === "VIDEO" ? (p.thumbnail_url ?? p.media_url) : p.media_url,
      permalink: p.permalink,
      caption: p.caption ?? "",
      timestamp: p.timestamp,
    }));

    return NextResponse.json({ posts, configured: true });
  } catch (err) {
    console.error("[Instagram API] fetch failed:", err);
    return NextResponse.json({ posts: [], configured: true, error: "Failed to reach Instagram API" });
  }
}
