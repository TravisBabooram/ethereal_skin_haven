import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);
const db = prisma as any;

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const SERVICES = [
  // Facials
  {
    name: "Dermaplaning Facial",
    description: "A precision treatment that removes dead skin cells and peach fuzz using a surgical-grade blade, followed by a customised facial. Leaves your complexion impossibly smooth, radiant, and ready to absorb skincare products.",
    price: 420,
    duration: 75,
    category: "Facials",
    benefits: "Surgical-grade exfoliation · Removes peach fuzz · Deep product absorption · Instant radiance",
    aftercare: "Avoid direct sun exposure and heavy makeup for 24 hours. Apply SPF daily.",
    featured: true,
  },
  {
    name: "Deep Cleansing Facial",
    description: "Full cleanse, exfoliation, steam, extractions, mask, and a relaxing facial massage — leaves skin smooth with decongested pores and a healthy glow. Available for all clients including men.",
    price: 0,
    duration: 60,
    category: "Facials",
    benefits: "Decongested pores · Smooth texture · Relaxing massage · Healthy glow",
    aftercare: "Avoid touching your face and stay out of the sun for 24 hours. Hydrate well.",
    featured: false,
  },
  // Waxing
  {
    name: "Hollywood & Full Leg Wax",
    description: "Full Hollywood wax combined with a complete leg wax — smooth, long-lasting results using the Starpil Roll-On Wax System with single-use cartridges for every client.",
    price: 480,
    duration: 60,
    category: "Waxing",
    benefits: "Single-use cartridges · No double-dipping · Starpil professional wax · Ingrown removal included",
    aftercare: "Avoid hot showers, saunas, and tight clothing for 24 hours. No sun exposure on waxed areas.",
    featured: true,
  },
  {
    name: "Brazilian Wax",
    description: "Professional Brazilian wax using the Starpil Roll-On system. Clean, precise, and hygienic — single-use cartridges discarded after every client. Ingrown removal included at no extra cost.",
    price: 0,
    duration: 45,
    category: "Waxing",
    benefits: "Single-use Starpil cartridges · Ingrown removal included · Pre + post wax care · Long-lasting smooth results",
    aftercare: "Avoid tight clothing and exercise for 24 hours. No exfoliation for 48 hours.",
    featured: false,
  },
  {
    name: "Underarm Wax + Ingrown Removal",
    description: "Professional underarm wax with complimentary ingrown removal. Keeps pores clear, reduces irritation, and helps your wax results last longer. Included at no additional cost.",
    price: 0,
    duration: 30,
    category: "Waxing",
    benefits: "Ingrown removal included · Reduces irritation · Cleaner results · No extra cost",
    aftercare: "Avoid deodorant and tight clothing for 24 hours.",
    featured: false,
  },
  {
    name: "Full Body Wax (Men)",
    description: "Chest, back, underarms, and a full Manzilian — smooth skin, less maintenance, and clean results every time. Because self-care isn't just for the ladies.",
    price: 0,
    duration: 90,
    category: "Waxing",
    benefits: "Chest + back · Underarms · Full Manzilian · Professional and discreet",
    aftercare: "Avoid tight clothing and strenuous activity for 24 hours.",
    featured: false,
  },
  {
    name: "Hollywood + Half Leg + Underarm + Vajacial",
    description: "The full combo — Hollywood wax, half leg wax, underarm wax, and a soothing vajacial. A complete treatment in one visit for smooth, confident skin from head to toe.",
    price: 0,
    duration: 90,
    category: "Waxing",
    benefits: "Hollywood wax · Half leg wax · Underarm wax · Vajacial included",
    aftercare: "Avoid tight clothing, hot showers, and exercise for 24 hours.",
    featured: false,
  },
  // Intimate Care
  {
    name: "Vajacial",
    description: "A treatment designed for your intimate area — just like a facial is for your face. Deeply cleanses, calms the skin, helps reduce ingrown hairs, and promotes a brighter, more even tone. Perfect after any waxing service.",
    price: 0,
    duration: 45,
    category: "Intimate Care",
    benefits: "Deep cleanse · Reduces ingrowns · Hydrates & nourishes · Reduces redness · Soft, clear, confident skin",
    aftercare: "Avoid tight clothing and fragrant products on the treated area for 24 hours.",
    featured: false,
  },
  {
    name: "Brazilian Wax + Vajacial Combo",
    description: "The ultimate intimate care package — a Brazilian wax followed by a soothing vajacial. Smooth, nourished, and glowing. Our most popular combo service.",
    price: 0,
    duration: 75,
    category: "Intimate Care",
    benefits: "Full Brazilian wax · Vajacial treatment · Starpil peel-off jelly mask finish · Calms freshly waxed skin",
    aftercare: "Avoid tight clothing and exercise for 24 hours. Keep area clean and dry.",
    featured: true,
  },
  {
    name: "Intimate Brightening Treatment",
    description: "Designed to improve the appearance of dark areas, promote an even skin tone, and restore your confidence — safely and professionally. Addresses hyperpigmentation, rough texture, and scarring caused by friction, shaving, or hormonal changes.",
    price: 0,
    duration: 60,
    category: "Intimate Care",
    benefits: "Targets hyperpigmentation · Smooths texture · Multiple sessions for best results · Home care kit recommended",
    aftercare: "Follow home care kit instructions provided. Consultation required before first session.",
    featured: true,
  },
  {
    name: "Penacial / Manjacial",
    description: "A specialised facial treatment for the male intimate area. Deep cleansing, gentle exfoliation, extractions if needed, and soothing products to reduce ingrown hairs, minimise irritation, brighten the skin, and maintain hygiene — especially after waxing. Professional. Discreet. Results-driven.",
    price: 0,
    duration: 45,
    category: "Intimate Care",
    benefits: "Deep cleanse · Gentle exfoliation · Extractions if needed · Soothing post-treatment care",
    aftercare: "Avoid tight clothing and fragrant products for 24 hours.",
    featured: false,
  },
  // Brows
  {
    name: "Brow Lamination + Tint",
    description: "A gentle process that restructures brow hairs into a defined, fluffy, perfectly shaped arch. Lamination lasts 4–6 weeks. Tint lasts up to 2 weeks with proper care.",
    price: 0,
    duration: 60,
    category: "Brows",
    benefits: "Fuller-looking brows · Defined shape · Lamination 4–6 weeks · Tint up to 2 weeks",
    aftercare: "Keep brows dry and avoid steam, saunas, and oil-based products for 24 hours.",
    featured: true,
  },
  // Nails
  {
    name: "Citrus Infused Jelly Pedi",
    description: "A zesty blend of lemon and cucumber that soothes tired feet, detoxifies, and leaves your skin silky smooth. Pure sunshine in a soak — refresh and revive your soles.",
    price: 0,
    duration: 60,
    category: "Nails",
    benefits: "Lemon + cucumber soak · Detoxifying · Full pedicure service · Silky smooth results",
    aftercare: "Moisturise daily to maintain results.",
    featured: false,
  },
  {
    name: "Rose Petal Pedi",
    description: "A luxurious pedicure ritual — petal soft, milky smooth. The ultimate pamper for your feet that leaves you walking on clouds.",
    price: 200,
    duration: 60,
    category: "Nails",
    benefits: "Luxurious soak · Full pedicure · Deeply moisturising · Petal soft finish",
    aftercare: "Moisturise feet daily to maintain softness.",
    featured: false,
  },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: "Bushbalm Dark Spot Oil + Scrub Combo",
    description: "Gently exfoliates, helps reduce ingrown hairs, and fades dark spots while keeping skin soft and deeply nourished. Formulated specifically for use on the body's most sensitive areas. Perfect for post-wax care.",
    price: 480,
    category: "Retail",
    usageInstructions: "Apply scrub 2–3 times per week. Follow with the dark spot oil daily, massaging gently into targeted areas.",
    skinTypeSuitability: "All skin types. Especially effective post-wax and on intimate areas.",
    availabilityStatus: "available",
    featured: true,
  },
  {
    name: "After Dark Toner Pads",
    description: "Refines pores, smooths bumps, and brightens for a more even skin tone. A convenient, mess-free way to maintain smooth skin between waxing appointments.",
    price: 250,
    category: "Retail",
    usageInstructions: "Use a pad to gently wipe over targeted areas. Allow to dry. Use daily or as needed.",
    skinTypeSuitability: "All skin types. Ideal for maintaining waxing results between appointments.",
    availabilityStatus: "available",
    featured: true,
  },
];

// ─── FAQs ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { question: "How do I book an appointment?", answer: "WhatsApp or call us at +1 (868) 705-7023 with your desired service and preferred date. We'll confirm availability and walk you through the next steps. You can also submit a request via our website booking form.", category: "Booking", order: 1 },
  { question: "Is a deposit required to secure my appointment?", answer: "Yes. A 50% deposit (or pay-first system) is strictly enforced to secure all appointments. Banking details are sent via WhatsApp once your booking is confirmed. Please send your receipt of payment for verification.", category: "Booking", order: 2 },
  { question: "What payment methods do you accept?", answer: "We accept bank transfer via First Citizens Bank (Account: 3128614, Savings — Ethereal Skin Haven) for the deposit. Remaining balances are paid in cash on the day of your appointment.", category: "Booking", order: 3 },
  { question: "Are additional guests or children permitted?", answer: "No. For the comfort of all clients and to maintain a calm, professional environment, no additional guests or children are permitted during appointments.", category: "Booking", order: 4 },
  { question: "What is your cancellation policy?", answer: "Cancellations or rescheduling must be made at least 72 hours before your appointment to avoid losing your deposit. Same-day cancellations will require a $100 TTD rebooking fee to secure any future appointment.", category: "Cancellation", order: 1 },
  { question: "What if I don't confirm my appointment?", answer: "Failure to confirm your appointment at least 24 hours prior will result in automatic cancellation. Please ensure you respond to confirmation messages to keep your spot.", category: "Cancellation", order: 2 },
  { question: "Are deposits refundable?", answer: "No. All deposits are non-refundable. In the event of a cancellation, your deposit will be forfeited. Please ensure you are fully committed before booking.", category: "Cancellation", order: 3 },
  { question: "What happens if I arrive late?", answer: "We offer a 10-minute grace period. After that: 10 minutes late = $30 TTD fee; 20 minutes late = $60 TTD fee; 30 minutes late = appointment is cancelled. These policies ensure fairness to all clients.", category: "Late Arrival", order: 1 },
  { question: "Do you offer services for men?", answer: "Absolutely! We offer male deep cleansing facials, full body waxing (chest, back, underarms, Manzilian), and specialised intimate treatments including the Penacial/Manjacial. Self-care is for everyone.", category: "Services", order: 1 },
  { question: "What is a Vajacial?", answer: "A vajacial is a treatment designed for your intimate area — just like a facial is for your face. It deeply cleanses, calms the skin, helps reduce ingrown hairs, and promotes a brighter, more even tone. It's especially soothing after a Brazilian wax.", category: "Services", order: 2 },
  { question: "What is the Intimate Brightening Treatment?", answer: "A professional treatment to improve the appearance of dark areas in intimate zones — addressing hyperpigmentation, rough texture, and scarring caused by friction, shaving, or hormonal changes. A consultation is required for first-time clients. Best results come from multiple sessions.", category: "Services", order: 3 },
  { question: "How long does Brow Lamination last?", answer: "Lamination lasts 4–6 weeks. Tint lasts up to 2 weeks with proper care. We'll give you aftercare instructions after your appointment.", category: "Services", order: 4 },
  { question: "How do you ensure hygiene and safety?", answer: "All tools and implements are cleaned and disinfected in Barbicide between every client. We use the Starpil Roll-On Wax System with single-use cartridges discarded after each client. There is absolutely no double-dipping at Ethereal Skin Haven.", category: "Hygiene", order: 1 },
  { question: "What products do you use?", answer: "We use professional-grade products including Esthemax (Hydrojelly Masks, Vitamin C Serum), Starpil Wax, Bushbalm (dark spot and ingrown treatments), Nova Wax, and products from Circadia and M.A.D Skincare.", category: "Hygiene", order: 2 },
  { question: "What amenities are available?", answer: "We provide a comfortable, welcoming environment with snacks, air-conditioning, drinks, and washroom facilities — everything you need to relax and enjoy your experience.", category: "Amenities", order: 1 },
];

// ─── POLICIES ─────────────────────────────────────────────────────────────────
const POLICIES = [
  {
    title: "Appointment Confirmation",
    type: "booking",
    content: JSON.stringify([
      "All appointments must be confirmed at least 24 hours prior to your scheduled time.",
      "Failure to confirm will result in automatic cancellation of your appointment.",
      "You will receive a confirmation message — please ensure you respond promptly.",
      "Appointment confirmation is separate from your booking — both are required.",
    ]),
  },
  {
    title: "Deposit & Payment Policy",
    type: "payment",
    content: JSON.stringify([
      "A 50% deposit or pay-first system is strictly enforced to secure all appointments.",
      "A minimum $100 TTD non-refundable deposit is required at the time of booking.",
      "Banking details are provided via WhatsApp upon booking confirmation.",
      "Please send your payment receipt for verification before your appointment is confirmed.",
      "Remaining balances are paid in cash on the day of your appointment.",
      "All deposits are non-refundable under any circumstances.",
    ]),
  },
  {
    title: "Cancellation & Rescheduling",
    type: "cancellation",
    content: JSON.stringify([
      "Cancellations or rescheduling requests must be made at least 72 hours before your appointment.",
      "Cancellations made less than 72 hours before your appointment will result in loss of your deposit.",
      "Same-day cancellations will require a $100 TTD rebooking fee to secure any future appointment.",
      "In the event of a cancellation, your deposit will be forfeited regardless of the reason.",
      "Clients who fail to notify us of their inability to attend may be refused future bookings.",
    ]),
  },
  {
    title: "Late Arrival Policy",
    type: "late_arrival",
    content: JSON.stringify([
      "Please arrive on time for your appointment. A 10-minute grace period is offered.",
      "Arriving 10 minutes late will incur a $30 TTD fee.",
      "Arriving 20 minutes late will incur a $60 TTD fee.",
      "Arriving 30 minutes late will result in automatic cancellation of your appointment.",
      "Late arrival charges are in addition to your service cost and are due on the day.",
    ]),
  },
  {
    title: "Studio Etiquette",
    type: "etiquette",
    content: JSON.stringify([
      "No additional guests or children are permitted during appointments.",
      "This policy exists to maintain a calm, professional, and comfortable environment for all clients.",
      "Please silence your mobile device during your treatment.",
      "Arrive prepared for your service where applicable (e.g. clean skin for waxing, no heavy moisturiser).",
    ]),
  },
  {
    title: "Hygiene & Safety",
    type: "hygiene",
    content: JSON.stringify([
      "All tools and implements are thoroughly cleaned and disinfected in Barbicide between every client.",
      "We use the Starpil Roll-On Wax System with single-use cartridges — discarded after each client.",
      "There is absolutely no double-dipping at Ethereal Skin Haven.",
      "A consultation may be required prior to certain treatments to properly assess your skin.",
    ]),
  },
  {
    title: "Refund Policy",
    type: "refund",
    content: JSON.stringify([
      "Services rendered are non-refundable. We encourage open communication during your appointment.",
      "If you have concerns following a treatment, please contact us within 48 hours.",
      "All deposits are non-refundable. This is enforced without exceptions.",
      "Retail products may be exchanged within 7 days if unopened and in original condition.",
    ]),
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding database...\n");

  // Clear existing data
  await db.policy.deleteMany({});
  await db.fAQ.deleteMany({});
  await db.product.deleteMany({});
  await db.service.deleteMany({});
  console.log("✓ Cleared existing data");

  // Seed services
  for (const svc of SERVICES) {
    await db.service.create({ data: svc });
  }
  console.log(`✓ Seeded ${SERVICES.length} services`);

  // Seed products
  for (const prod of PRODUCTS) {
    await db.product.create({ data: prod });
  }
  console.log(`✓ Seeded ${PRODUCTS.length} products`);

  // Seed FAQs
  for (const faq of FAQS) {
    await db.fAQ.create({ data: faq });
  }
  console.log(`✓ Seeded ${FAQS.length} FAQs`);

  // Seed policies
  for (const policy of POLICIES) {
    await db.policy.create({ data: policy });
  }
  console.log(`✓ Seeded ${POLICIES.length} policies`);

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch(e => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
