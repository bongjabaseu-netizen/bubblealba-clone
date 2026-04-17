import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hash = await bcrypt.hash("1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "test" },
    update: {},
    create: {
      email: "test",
      nickname: "테스트유저",
      password: hash,
      role: "USER",
      points: 0,
    },
  });
  console.log("생성 완료:", user.nickname, user.email);
  await prisma.$disconnect();
}
main();
