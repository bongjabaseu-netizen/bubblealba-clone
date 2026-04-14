"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// 데모용 고정 인증코드 (프로덕션: 다날/NICE SMS API 연동)
const DEMO_CODE = "123456";

export async function sendVerificationCode(phone: string) {
  if (!phone || phone.length < 10) return { error: "올바른 전화번호를 입력해주세요" };

  // 기존 인증 삭제
  await prisma.phoneVerification.deleteMany({ where: { phone } });

  // 새 인증 생성 (5분 유효)
  await prisma.phoneVerification.create({
    data: {
      phone,
      code: DEMO_CODE,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // 데모: 콘솔에 코드 출력 (실제로는 SMS 발송)
  console.log(`[DEMO] 인증코드 발송: ${phone} → ${DEMO_CODE}`);
  return { success: true, message: "인증코드가 발송되었습니다 (데모: 123456)" };
}

export async function verifyCode(phone: string, code: string) {
  const verification = await prisma.phoneVerification.findFirst({
    where: { phone, code, verified: false, expiresAt: { gte: new Date() } },
  });

  if (!verification) return { error: "인증코드가 올바르지 않거나 만료되었습니다" };

  await prisma.phoneVerification.update({
    where: { id: verification.id },
    data: { verified: true },
  });

  // 현재 로그인 사용자의 인증 상태 업데이트
  const session = await auth();
  if (session?.user?.id) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone, phoneVerified: true, isAdult: true },
    });
  }

  return { success: true, message: "본인인증이 완료되었습니다" };
}
