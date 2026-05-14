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

export const LOCAL_BUSINESS_SCHEMA = {
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
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "08:00", "closes": "18:00" },
  ],
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
