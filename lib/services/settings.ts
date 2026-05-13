import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await db.siteSettings.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const rows = await db.siteSettings.findMany({ where: { key: { in: keys } } });
    return Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export async function setSetting(key: string, value: string) {
  return db.siteSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function setSettings(data: Record<string, string>) {
  return Promise.all(Object.entries(data).map(([key, value]) => setSetting(key, value)));
}
