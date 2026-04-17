import { prisma } from "../src/lib/prisma";
async function main() {
  const banners = await prisma.bannerAd.findMany({ where: { type: "LEGAL_AD" }, orderBy: { order: "asc" } });
  for (const b of banners) {
    console.log(`${b.order} | ${b.isActive ? "ON" : "OFF"} | ${b.title ?? "(no title)"} | ${b.imageUrl?.substring(0, 80) ?? "no image"}`);
  }
  console.log(`\n총 ${banners.length}개`);
  await prisma.$disconnect();
}
main();
