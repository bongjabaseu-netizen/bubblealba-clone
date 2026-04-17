import { prisma } from "../src/lib/prisma";
async function main() {
  const jobs = await prisma.job.findMany({ take: 5, select: { id: true, title: true, images: true } });
  for (const j of jobs) console.log(j.title, "|", j.images);
  await prisma.$disconnect();
}
main();
