/** 초이스톡 방에 같은 이름의 업체(Job) 연결 + 이미지 설정 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const rooms = await prisma.choiceTalkRoom.findMany();
  const jobs = await prisma.job.findMany({ select: { id: true, company: true, images: true } });

  for (const room of rooms) {
    // 같은 이름 또는 포함하는 업체 찾기
    const match = jobs.find(j =>
      j.company && (
        j.company.includes(room.name) ||
        room.name.includes(j.company) ||
        j.company.toLowerCase().includes(room.name.toLowerCase())
      )
    );

    if (match) {
      const images = JSON.parse(match.images || "[]");
      const logo = images[0] || null;
      await prisma.choiceTalkRoom.update({
        where: { id: room.id },
        data: { jobId: match.id, logo },
      });
      console.log(`✅ ${room.name} → ${match.company} (logo: ${logo ? 'Y' : 'N'})`);
    } else {
      console.log(`❌ ${room.name} → 매칭 업체 없음`);
    }
  }

  // 매칭 안 된 방에는 랜덤 업체 이미지 할당
  const unlinked = await prisma.choiceTalkRoom.findMany({ where: { logo: null } });
  for (let i = 0; i < unlinked.length; i++) {
    const job = jobs[i % jobs.length];
    const images = JSON.parse(job.images || "[]");
    const logo = images[0] || null;
    if (logo) {
      await prisma.choiceTalkRoom.update({
        where: { id: unlinked[i].id },
        data: { jobId: job.id, logo },
      });
      console.log(`🔄 ${unlinked[i].name} → ${job.company} (배정)`);
    }
  }

  console.log("\n완료!");
  await prisma.$disconnect();
}
main();
