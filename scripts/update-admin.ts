import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

(async () => {
  const newPassword = await hash('qwer1234', 10);

  // 기존 admin 계정의 이메일을 'adm'으로, 비밀번호를 qwer1234로 변경
  const admin = await p.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('admin not found');

  // 'adm' 아이디가 이미 있는지 체크
  const existing = await p.user.findUnique({ where: { email: 'adm' } });
  if (existing && existing.id !== admin.id) {
    // 기존 adm 유저 삭제 (충돌 방지)
    await p.user.delete({ where: { id: existing.id } });
  }

  const updated = await p.user.update({
    where: { id: admin.id },
    data: {
      email: 'adm',
      password: newPassword,
    },
  });

  console.log('✅ 관리자 계정 업데이트 완료');
  console.log('  아이디:', updated.email);
  console.log('  비밀번호: qwer1234');
  console.log('  역할:', updated.role);

  process.exit(0);
})();
