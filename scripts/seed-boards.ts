import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

(async () => {
  const admin = await p.user.findUnique({ where: { email: 'admin@bubble.clone' } });
  if (!admin) throw new Error('admin not found');

  const boards = [
    { name: '부동산', slug: 'realestate', description: '부동산 정보 게시판', order: 10 },
    { name: '법률상담', slug: 'legal-consult', description: '법률 상담 게시판', order: 11 },
    { name: '애견자랑', slug: 'pets', description: '반려동물 자랑 게시판', order: 12 },
    { name: '미용실', slug: 'beauty', description: '미용실 정보 게시판', order: 13 },
  ];

  for (const b of boards) {
    await p.board.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ...b, createdById: admin.id },
    });
    console.log('✅', b.slug);
  }

  const all = await p.board.findMany({ select: { slug: true, name: true, order: true } });
  console.log('Total boards:', all.length);
  console.log(JSON.stringify(all, null, 2));

  process.exit(0);
})();
