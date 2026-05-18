import { prisma } from "@/lib/prisma";

export async function getGalleryImageById(id: string) {
  return prisma.galleryImage.findUnique({ where: { id } });
}

export async function getAllGalleryImages() {
  return prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
}

export async function getGalleryByCategory(category: string) {
  return prisma.galleryImage.findMany({ where: { category }, orderBy: { order: "asc" } });
}

export async function createGalleryImage(data: any) {
  return prisma.galleryImage.create({ data });
}

export async function updateGalleryImage(id: string, data: any) {
  return prisma.galleryImage.update({ where: { id }, data });
}

export async function deleteGalleryImage(id: string) {
  return prisma.galleryImage.delete({ where: { id } });
}
