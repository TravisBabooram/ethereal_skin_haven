import { getSetting } from "@/lib/services/settings";

interface SchemaMarkupProps {
  schema: Record<string, unknown>;
}

export default function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const SCHEMA_DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const DEFAULT_HOURS: Record<string, { open: boolean; start: string; end: string }> = {
  "0": { open: false, start: "09:00", end: "18:00" },
  "1": { open: false, start: "09:00", end: "18:00" },
  "2": { open: true,  start: "09:00", end: "18:00" },
  "3": { open: true,  start: "09:00", end: "18:00" },
  "4": { open: true,  start: "09:00", end: "18:00" },
  "5": { open: true,  start: "09:00", end: "18:00" },
  "6": { open: true,  start: "09:00", end: "18:00" },
};

function buildOpeningHoursSpec(hours: typeof DEFAULT_HOURS) {
  const groups: Record<string, string[]> = {};
  for (let i = 0; i <= 6; i++) {
    const cfg = hours[String(i)];
    if (!cfg?.open) continue;
    const key = `${cfg.start}|${cfg.end}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(SCHEMA_DAY_NAMES[i]);
  }
  return Object.entries(groups).map(([key, days]) => {
    const [opens, closes] = key.split("|");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}

const BASE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "name": "Ethereal Skin Haven",
  "description": "Luxury spa & esthetics studio in Couva, Trinidad. Offering waxing, facials, vajacials, brow services, and premium skincare products.",
  "url": "https://etherealskinhaven.com",
  "telephone": "+18687057023",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Balisier Avenue",
    "addressLocality": "Couva",
    "addressCountry": "TT",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 10.4278,
    "longitude": -61.4699,
  },
  "priceRange": "$$",
  "email": "etherealskinhaven@gmail.com",
  "sameAs": [
    "https://www.instagram.com/ethereal.skin.haven_/",
    "https://www.tiktok.com/@ethereal.skin.haven",
    "https://www.facebook.com/profile.php?id=61587540374992",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+18687057023",
    "contactType": "reservations",
    "availableLanguage": "English",
  },
};

export async function getLocalBusinessSchema() {
  try {
    const raw = await getSetting("business_hours").catch(() => null);
    const hours = raw ? { ...DEFAULT_HOURS, ...JSON.parse(raw) } : DEFAULT_HOURS;
    return { ...BASE_SCHEMA, openingHoursSpecification: buildOpeningHoursSpec(hours) };
  } catch {
    return { ...BASE_SCHEMA, openingHoursSpecification: buildOpeningHoursSpec(DEFAULT_HOURS) };
  }
}

export const LOCAL_BUSINESS_SCHEMA = {
  ...BASE_SCHEMA,
  openingHoursSpecification: buildOpeningHoursSpec(DEFAULT_HOURS),
};
