import { prisma } from "../src/lib/prisma";
async function main() {
  const users = await prisma.user.findMany({
    where: { OR: [{ email: "adm" }, { email: "test" }] },
    select: { id: true, email: true, nickname: true, role: true },
  });
  for (const u of users) console.log(u);
  await prisma.$disconnect();
}
main();
