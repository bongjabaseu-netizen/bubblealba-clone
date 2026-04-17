import { prisma } from "../src/lib/prisma";
async function main() {
  const rooms = await prisma.choiceTalkRoom.findMany({
    include: { job: { select: { id: true, title: true, company: true, images: true } } },
  });
  for (const r of rooms) {
    console.log(`${r.name} | logo: ${r.logo ? 'Y' : 'N'} | jobId: ${r.jobId ?? 'none'} | job: ${r.job?.company ?? 'none'} | img: ${r.job?.images?.substring(0, 60) ?? 'none'}`);
  }
  console.log(`\n총 ${rooms.length}개`);
  await prisma.$disconnect();
}
main();
