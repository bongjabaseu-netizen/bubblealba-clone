/** picsum 더미 법률 배너 삭제 */
import { prisma } from "../src/lib/prisma";
async function main() {
  const result = await prisma.bannerAd.deleteMany({
    where: { type: "LEGAL_AD", imageUrl: { contains: "picsum.photos" } },
  });
  console.log(`더미 배너 ${result.count}개 삭제 완료`);
  await prisma.$disconnect();
}
main();
