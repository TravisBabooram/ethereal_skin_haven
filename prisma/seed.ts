import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database from Instagram data...");

  // ── SERVICES ──────────────────────────────────────────────────────────────

  const services = [
    {
      name: "Dermaplaning Facial",
      description:
        "A luxurious facial treatment that uses a surgical-grade scalpel to gently exfoliate dead skin cells and peach fuzz, revealing a smoother, brighter complexion. Followed by hydrating serums and a nourishing mask.",
      price: 420,
      duration: 60,
      category: "Facials",
      benefits:
        "Removes dead skin cells and vellus hair, improves product absorption, reduces fine lines, leaves skin smooth and glowing",
      aftercare:
        "Avoid direct sun exposure for 24–48 hours. Apply SPF daily. Do not use exfoliants or retinoids for 48 hours.",
      featured: true,
    },
    {
      name: "Deep Cleansing Facial",
      description:
        "A results-driven facial that includes a full cleanse, exfoliation, steam, extractions, mask, and relaxing facial massage. Uses premium Esthemax products including Hydrojelly Masks and targeted serums. Leaves skin smooth with decongested pores and a healthy glow.",
      price: 0,
      duration: 60,
      category: "Facials",
      benefits:
        "Decongests pores, removes impurities, soothes inflammation, leaves skin refreshed and radiant",
      aftercare:
        "Avoid heavy makeup for 24 hours. Keep skin hydrated. Avoid touching your face.",
      featured: true,
    },
    {
      name: "Male Deep Cleansing Facial",
      description:
        "Specially designed for men's skin. Includes a full cleanse, exfoliation, steam, extractions, mask, and relaxing facial massage. Leaves skin smooth with decongested pores and a healthy glow.",
      price: 0,
      duration: 60,
      category: "Facials",
      benefits:
        "Decongests pores, removes buildup, soothes razor irritation, improves skin texture",
      aftercare:
        "Avoid shaving for 24 hours. Apply SPF daily. Keep skin hydrated.",
      featured: false,
    },
    {
      name: "Brazilian Wax",
      description:
        "A professional Brazilian wax using the Starpil Roll-On Wax System — single-use cartridges discarded after every client, ensuring proper hygiene and preventing cross-contamination. Smooth, clean results every time.",
      price: 0,
      duration: 30,
      category: "Waxing",
      benefits:
        "Long-lasting smoothness, reduces regrowth over time, prevents ingrown hairs with proper aftercare",
      aftercare:
        "Avoid tight clothing for 24 hours. No gym, pools, or hot baths for 24 hours. Exfoliate after 48 hours to prevent ingrowns.",
      featured: true,
    },
    {
      name: "Hollywood Wax + Full Leg Wax",
      description:
        "Complete lower body waxing package — Hollywood wax (full intimate area including backside) combined with a full leg wax from hip to toe. Using the premium Starpil Roll-On Wax System for efficient, smooth results.",
      price: 480,
      duration: 75,
      category: "Waxing",
      benefits:
        "Full lower body smoothness, long-lasting results, reduces ingrown hairs",
      aftercare:
        "Avoid tight clothing for 24 hours. No gym, pools, or hot baths for 24 hours. Exfoliate after 48 hours.",
      featured: true,
    },
    {
      name: "Hollywood Wax + Half Leg + Underarm + Vajacial",
      description:
        "The ultimate waxing package. Hollywood wax, half leg wax, underarm wax, and a soothing vajacial all in one session. The vajacial calms freshly waxed skin, helps prevent ingrown hairs, and leaves the intimate area feeling soft, clear, and confident.",
      price: 0,
      duration: 90,
      category: "Waxing",
      benefits:
        "Comprehensive full-body wax coverage, ingrown prevention, skin soothed and nourished post-wax",
      aftercare:
        "Avoid tight clothing for 24 hours. No gym, pools, or hot baths for 24 hours. Exfoliate after 48 hours.",
      featured: false,
    },
    {
      name: "Underarm Wax + Ingrown Removal",
      description:
        "Professional underarm waxing with complimentary ingrown hair removal. Ingrown removal keeps pores clear, reduces irritation, and helps wax results last longer. Included at no additional cost.",
      price: 0,
      duration: 20,
      category: "Waxing",
      benefits:
        "Smooth underarms, reduced irritation, clear pores, longer-lasting results",
      aftercare:
        "Avoid deodorant for 24 hours. Wear loose breathable clothing. Exfoliate after 48 hours.",
      featured: false,
    },
    {
      name: "Male Brazilian Wax (Manzilian)",
      description:
        "Professional male intimate waxing (Manzilian) delivered with care, discretion, and expertise. Using the Starpil single-use roll-on wax system for hygiene and comfort. Clean, smooth results every time.",
      price: 0,
      duration: 45,
      category: "Waxing",
      benefits:
        "Long-lasting smoothness, improved hygiene, reduces regrowth over time",
      aftercare:
        "Avoid tight underwear for 24 hours. No gym or hot baths for 24 hours. Exfoliate after 48 hours.",
      featured: false,
    },
    {
      name: "Full Body Wax (Men)",
      description:
        "Complete male full body wax — chest, back, underarms, and a full Manzilian. Smooth skin, less maintenance, and clean results every time. Because self-care isn't just for the ladies.",
      price: 0,
      duration: 90,
      category: "Waxing",
      benefits:
        "Full body smoothness, reduced hair regrowth over time, improved hygiene and grooming",
      aftercare:
        "Avoid tight clothing for 24 hours. No gym, pools, or hot baths for 24 hours. Moisturize daily.",
      featured: false,
    },
    {
      name: "Vajacial",
      description:
        "A specialized treatment for the intimate area — just like a facial is for your face. Deeply cleanses, calms the skin, helps reduce ingrown hairs, and promotes a brighter, more even tone. Calms and soothes freshly waxed skin and leaves skin feeling soft, clear, and confident.",
      price: 0,
      duration: 30,
      category: "Intimate Treatments",
      benefits:
        "Reduces ingrown hairs, brightens skin tone, hydrates and nourishes, reduces redness and irritation, soothes post-wax skin",
      aftercare:
        "Avoid tight clothing for 24 hours. Keep the area clean and moisturized.",
      featured: false,
    },
    {
      name: "Brazilian Wax + Vajacial Combo",
      description:
        "A Brazilian wax followed by a soothing vajacial. The ultimate intimate care combo — smooth, soothed, and glowing. The vajacial deeply cleanses, calms the skin, helps reduce ingrown hairs, and promotes a brighter, more even tone.",
      price: 0,
      duration: 60,
      category: "Intimate Treatments",
      benefits:
        "Complete intimate care, ingrown prevention, brightened skin tone, long-lasting smoothness",
      aftercare:
        "Avoid tight clothing for 24 hours. No gym, pools, or hot baths for 24 hours. Keep area moisturized.",
      featured: false,
    },
    {
      name: "Penacial / Manjacial",
      description:
        "A specialized facial treatment for the male intimate area. Involves deep cleansing, gentle exfoliation, extractions (if needed), and soothing products to help reduce ingrown hairs, minimize irritation, brighten the skin, and maintain overall hygiene — especially after waxing. Professional. Discreet. Results Driven.",
      price: 0,
      duration: 45,
      category: "Intimate Treatments",
      benefits:
        "Reduces ingrown hairs, minimizes irritation, brightens skin, improves hygiene",
      aftercare:
        "Avoid tight underwear for 24 hours. Keep the area clean and moisturized.",
      featured: false,
    },
    {
      name: "Intimate Brightening Treatment",
      description:
        "Designed to help improve the appearance of dark areas, promote an even skin tone, and restore your confidence — safely and professionally. Addresses hyperpigmentation, rough texture, and scarring in intimate areas often caused by friction, shaving, or hormonal changes. Consultation required for first-time clients. Multiple sessions recommended for best results.",
      price: 0,
      duration: 60,
      category: "Intimate Treatments",
      benefits:
        "Reduces hyperpigmentation, improves skin texture, evens skin tone, restores confidence",
      aftercare:
        "Home care kit highly recommended between sessions. Avoid friction and shaving in treated area.",
      featured: false,
    },
    {
      name: "Brow Lamination + Tint",
      description:
        "A two-step brow treatment that lifts, sets, and tints your brows for a full, defined look. Lamination restructures brow hairs to keep them in place for 4–6 weeks. Tint deepens and defines color for up to 2 weeks with proper care.",
      price: 0,
      duration: 60,
      category: "Brows",
      benefits:
        "Fuller-looking brows, defined shape, low-maintenance grooming, long-lasting results",
      aftercare:
        "Keep brows dry for 24 hours. Avoid oil-based products on brows. Brush daily with a spoolie.",
      featured: true,
    },
    {
      name: "Rose Petal Pedi",
      description:
        "A luxurious pedicure experience featuring a rose petal soak, exfoliation, callus removal, massage, and nail care. A pampering treat from rough to radiant.",
      price: 200,
      duration: 45,
      category: "Nails",
      benefits:
        "Softens skin, removes calluses, relieves tired feet, leaves skin silky smooth",
      aftercare:
        "Moisturize feet daily. Wear comfortable shoes. Avoid tight footwear immediately after.",
      featured: true,
    },
    {
      name: "Citrus Infused Jelly Pedi",
      description:
        "A luxury pedicure featuring a citrus jelly soak infused with lemon and cucumber. Soothes tired feet, detoxifies, and leaves your skin silky smooth. Pure sunshine in a soak.",
      price: 0,
      duration: 45,
      category: "Nails",
      benefits:
        "Detoxifies, soothes tired feet, deeply hydrates, leaves skin silky smooth",
      aftercare:
        "Moisturize feet daily. Wear comfortable shoes.",
      featured: false,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: service,
      create: {
        id: service.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        ...service,
      },
    });
  }
  console.log(`✓ ${services.length} services seeded`);

  // ── PRODUCTS ──────────────────────────────────────────────────────────────

  const products = [
    {
      name: "Bushbalm Dark Spot Oil + Scrub Combo",
      description:
        "A powerful duo that gently exfoliates, helps reduce ingrown hairs, and fades dark spots while keeping skin soft and nourished. Perfect for use between waxing sessions.",
      price: 480,
      category: "Retail",
      usageInstructions:
        "Apply scrub 2–3 times per week to exfoliate. Follow with the dark spot oil daily on affected areas. Best used between waxing appointments.",
      skinTypeSuitability: "All skin types, especially those prone to ingrown hairs and hyperpigmentation",
      availabilityStatus: "available",
      stockQty: 10,
      featured: true,
    },
    {
      name: "After Dark Toner Pads",
      description:
        "Professional-grade toner pads that refine pores, smooth bumps, and brighten for a more even tone. Formulated to target post-wax irritation and hyperpigmentation.",
      price: 250,
      category: "Retail",
      usageInstructions:
        "Swipe one pad over clean skin in the morning and/or evening. Allow to dry before applying moisturizer. Avoid broken or irritated skin.",
      skinTypeSuitability: "All skin types, especially oily or blemish-prone skin",
      availabilityStatus: "available",
      stockQty: 10,
      featured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: product,
      create: {
        id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        ...product,
      },
    });
  }
  console.log(`✓ ${products.length} products seeded`);

  // ── FAQS ──────────────────────────────────────────────────────────────────

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "You can book directly through our website booking form, or by calling/WhatsApp us at +1 (868) 705-7023. Once you reach out, you will receive further details and your appointment will be confirmed once your deposit is received.",
      category: "Booking Process",
      order: 1,
    },
    {
      question: "Is a deposit required to secure my appointment?",
      answer:
        "Yes. A 50% downpayment (or $100 deposit) is strictly required to secure all appointments. Banking details will be sent upon confirmation. Please send your receipt of payment for verification. Deposits are non-refundable.",
      category: "Payment",
      order: 2,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept bank transfer (First Citizens Bank) for deposits, and cash on the day of your appointment for the remaining balance.",
      category: "Payment",
      order: 3,
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Cancellations or rescheduling must be made at least 72 hours before your appointment to avoid losing your deposit. Same-day cancellations will require a $100 rebooking fee to secure any future appointment. You must also confirm your appointment at least 24 hours prior — failure to do so will result in automatic cancellation.",
      category: "Cancellation",
      order: 4,
    },
    {
      question: "What happens if I arrive late?",
      answer:
        "There is a 10-minute grace period. After that: 10 minutes late = $30 fee, 20 minutes late = $60 fee, 30 minutes late = appointment is cancelled. Please plan to arrive on time to enjoy your full service.",
      category: "Booking Process",
      order: 5,
    },
    {
      question: "Can I bring guests or children to my appointment?",
      answer:
        "No. No additional guests or children are permitted during appointments. This ensures a calm, focused experience for all clients.",
      category: "Booking Process",
      order: 6,
    },
    {
      question: "How should I prepare for a waxing appointment?",
      answer:
        "Hair should be at least ¼ inch long (about 2–3 weeks of growth). Avoid shaving for at least 2–3 weeks before your appointment. Exfoliate gently 24 hours before (not on the day). Avoid sun exposure, tanning, and retinoids for 24 hours prior.",
      category: "Preparation",
      order: 7,
    },
    {
      question: "How should I care for my skin after waxing?",
      answer:
        "Avoid tight clothing for 24 hours. No gym, pools, or hot baths for 24 hours. Begin exfoliating after 48 hours to prevent ingrown hairs. Moisturize the area daily. We recommend Bushbalm Dark Spot Oil and After Dark Toner Pads for maintenance between sessions.",
      category: "Aftercare",
      order: 8,
    },
    {
      question: "How long does brow lamination last?",
      answer:
        "Brow lamination lasts 4–6 weeks. The tint lasts up to 2 weeks with proper care. Keep brows dry for 24 hours after treatment and avoid oil-based products on the brow area.",
      category: "Aftercare",
      order: 9,
    },
    {
      question: "What is a Vajacial?",
      answer:
        "A vajacial is a specialized treatment for the intimate area — just like a facial is for your face. It deeply cleanses, calms the skin, helps reduce ingrown hairs, and promotes a brighter, more even tone. It is especially beneficial after waxing to soothe and nourish the skin.",
      category: "Services",
      order: 10,
    },
    {
      question: "What is the Intimate Brightening Treatment?",
      answer:
        "Our Intimate Brightening Treatment is designed to improve the appearance of dark areas, promote an even skin tone, and restore confidence — safely and professionally. A consultation is required for first-time clients. Best results are achieved with multiple sessions combined with a recommended home care kit.",
      category: "Services",
      order: 11,
    },
    {
      question: "Do you offer services for men?",
      answer:
        "Yes! We offer Male Deep Cleansing Facials, Male Brazilian Wax (Manzilian), Full Body Wax, and the Penacial/Manjacial treatment. All services are delivered with professionalism and discretion.",
      category: "Services",
      order: 12,
    },
  ];

  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];
    await prisma.fAQ.upsert({
      where: { id: `faq-${i + 1}` },
      update: faq,
      create: { id: `faq-${i + 1}`, ...faq },
    });
  }
  console.log(`✓ ${faqs.length} FAQs seeded`);

  // ── POLICIES ──────────────────────────────────────────────────────────────

  const policies = [
    {
      id: "policy-booking",
      title: "Booking Policy",
      type: "booking",
      content: `To secure your appointment, a 50% downpayment or $100 deposit is strictly required. Banking details will be provided upon confirmation of your booking.

Please ensure you send your receipt of payment for verification purposes.

You must confirm your appointment at least 24 hours prior to your scheduled time. Failure to do so will result in automatic cancellation.

No additional guests or children are permitted during appointments.

Appointments can be booked via our website, by calling, or WhatsApp at +1 (868) 705-7023.`,
    },
    {
      id: "policy-cancellation",
      title: "Cancellation & Rescheduling Policy",
      type: "cancellation",
      content: `All deposits are non-refundable.

Cancellations or rescheduling must be made at least 72 hours before your appointment to avoid losing your deposit.

Same-day cancellations will require a $100 rebooking fee to secure any future appointment.

Clients who repeatedly fail to notify us in advance of cancellations may be refused future bookings.`,
    },
    {
      id: "policy-late-arrival",
      title: "Late Arrival Policy",
      type: "late_arrival",
      content: `We understand that delays happen. There is a 10-minute grace period for all appointments.

After the grace period, the following fees apply:

• 10 minutes late — $30 fee
• 20 minutes late — $60 fee
• 30 minutes late — Appointment cancelled

Please plan to arrive on time to enjoy your full service experience.`,
    },
    {
      id: "policy-payment",
      title: "Payment Policy",
      type: "payment",
      content: `A 50% downpayment is required to confirm all appointments.

Deposits are made via bank transfer:
• Bank: First Citizens Bank
• Account Number: 3128614
• Account Type: Savings
• Name: Ethereal Skin Haven

Please send a picture of your payment receipt via WhatsApp after making your deposit.

Remaining balances are paid in cash on the day of your appointment.`,
    },
    {
      id: "policy-privacy",
      title: "Privacy Policy",
      type: "privacy",
      content: `Ethereal Skin Haven is committed to protecting your privacy and personal information.

Personal information collected (name, phone number, email) is used solely for appointment management and communication purposes.

We do not share, sell, or distribute your personal information to third parties.

All client information and treatment history is kept strictly confidential.

By booking with us, you consent to our use of your contact information for appointment reminders and communications related to your bookings.`,
    },
    {
      id: "policy-refund",
      title: "Refund Policy",
      type: "refund",
      content: `All deposits are strictly non-refundable.

If you are unsatisfied with a service, please contact us within 48 hours of your appointment so we can address your concerns.

Refunds are not provided for completed services. However, we are committed to your satisfaction and will work with you to resolve any concerns professionally.`,
    },
  ];

  for (const policy of policies) {
    await prisma.policy.upsert({
      where: { id: policy.id },
      update: { title: policy.title, type: policy.type, content: policy.content },
      create: policy,
    });
  }
  console.log(`✓ ${policies.length} policies seeded`);

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
