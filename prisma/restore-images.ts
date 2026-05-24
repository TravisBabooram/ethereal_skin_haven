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

// Service images — sorted oldest to newest upload (order matches original creation order)
const serviceImages = [
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779083620/ethereal-skin-haven/services/xr6zr7xd1l99we4ldnm6.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779083781/ethereal-skin-haven/services/hzwo35hzp8jrisai2tjo.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779083895/ethereal-skin-haven/services/euwjq8ijqek7pqt2od87.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779084243/ethereal-skin-haven/services/wz0vytlwd3fpykhgn0s5.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779084527/ethereal-skin-haven/services/y5i0tkrij1wrohdgkmu3.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779084608/ethereal-skin-haven/services/ymcucoefufqrfnjhxddu.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779084847/ethereal-skin-haven/services/f6li9aueixbimd2zzyvs.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779084952/ethereal-skin-haven/services/qhcoqbrc6vcfcoakfmrx.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779087663/ethereal-skin-haven/services/ifs4yge5u8xjegiz1vhb.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779153807/ethereal-skin-haven/services/f4yals1erpizicfxbbnj.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779154004/ethereal-skin-haven/services/cfxqionnkxhjkxjfzovl.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779154057/ethereal-skin-haven/services/fypumldpsfdsim60xb8g.png",
];

// Product images — sorted oldest to newest
const productImages = [
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779151736/ethereal-skin-haven/products/tqlgaofc1zkbeixj3mt3.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779151793/ethereal-skin-haven/products/gjqt1blpw54plp6r6gkg.jpg",
];

// 3rd product image goes to gallery (no 3rd product in DB)
const extraProductImage =
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779151833/ethereal-skin-haven/products/vdk8mvsq3je1snupxa3q.jpg";

// Gallery images — sorted oldest to newest
const galleryImages = [
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779076286/ethereal-skin-haven/gallery/fqycrepzsic8wwcr148z.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779076326/ethereal-skin-haven/gallery/ocx4gs76cchuxatwunuv.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779151953/ethereal-skin-haven/gallery/juat9uj5lnf9loxo0b9q.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779152138/ethereal-skin-haven/gallery/pq1jrpjhb3echfwwveyy.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779152225/ethereal-skin-haven/gallery/gumbv7rmrtnsdik7i1my.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779152347/ethereal-skin-haven/gallery/xyamghxwj8qpascdp8es.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779152383/ethereal-skin-haven/gallery/dwi1qwdllgglqpskyeos.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779152515/ethereal-skin-haven/gallery/ifzvql8m19fjuwie5fmp.jpg",
  "https://res.cloudinary.com/dp5zkgtje/image/upload/v1779152560/ethereal-skin-haven/gallery/u7e7qfa0pv7trmmtjhbj.jpg",
];

async function main() {
  // ── SERVICES ──────────────────���──────────────────��────────────────────────
  const services = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
  let servicesUpdated = 0;
  for (let i = 0; i < Math.min(services.length, serviceImages.length); i++) {
    await prisma.service.update({
      where: { id: services[i].id },
      data: { image: serviceImages[i] },
    });
    servicesUpdated++;
  }
  console.log(`✓ ${servicesUpdated} service images restored`);

  // ── PRODUCTS ──────────────────────────────────────────────────────────────
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  let productsUpdated = 0;
  for (let i = 0; i < Math.min(products.length, productImages.length); i++) {
    await prisma.product.update({
      where: { id: products[i].id },
      data: { image: productImages[i] },
    });
    productsUpdated++;
  }
  console.log(`✓ ${productsUpdated} product images restored`);

  // ── GALLERY ──────────────────────────────────���────────────────────────────
  const allGallery = [...galleryImages, extraProductImage];
  let galleryAdded = 0;
  for (let i = 0; i < allGallery.length; i++) {
    const existing = await prisma.galleryImage.findFirst({ where: { image: allGallery[i] } });
    if (!existing) {
      await prisma.galleryImage.create({
        data: {
          title: `Gallery Image ${i + 1}`,
          image: allGallery[i],
          category: "General",
          order: i + 1,
        },
      });
      galleryAdded++;
    }
  }
  console.log(`✓ ${galleryAdded} gallery images restored`);

  console.log("\n✅ Image restore complete!");
  console.log("   Note: Service images were assigned in upload order.");
  console.log("   If any are mismatched, reassign them in the admin panel → Services.");
}

main()
  .catch((e) => { console.error("Restore failed:", e); process.exit(1); })
  .finally(async () => { await pool.end(); });
