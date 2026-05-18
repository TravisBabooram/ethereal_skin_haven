import crypto from "crypto";

function extractPublicId(url: string): string | null {
  // Matches: https://res.cloudinary.com/{cloud}/image/upload/v{digits}/{public_id}.{ext}
  // Also handles no-version URLs: .../upload/{public_id}.{ext}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export async function deleteCloudinaryImage(imageUrl: string): Promise<void> {
  if (!imageUrl || !imageUrl.startsWith("http")) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return;

  const publicId = extractPublicId(imageUrl);
  if (!publicId) return;

  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash("sha256")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId, api_key: apiKey, timestamp, signature }),
  });
}
