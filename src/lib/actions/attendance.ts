/** 출석체크 Server Actions */
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** 오늘 날짜 (KST) "YYYY-MM-DD" 형태 */
function todayKST(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

/** 출석체크 실행 — 하루에 한 번만, 포인트 10P 적립 */
export async function checkAttendance() {
  const session = await auth();
  if (!session?.user?.id) return { error: "로그인이 필요합니다" };

  const date = todayKST();

  // 이미 오늘 출석했는지 확인
  const existing = await prisma.attendance.findUnique({
    where: { userId_date: { userId: session.user.id, date } },
  });
  if (existing) return { error: "이미 오늘 출석체크를 했습니다", alreadyChecked: true };

  // 연속 출석일 계산 (보너스 포인트용)
  const streak = await getStreak(session.user.id, date);
  const bonusPoints = streak >= 6 ? 50 : streak >= 2 ? 20 : 10;

  // 출석 기록 + 포인트 적립 (트랜잭션)
  await prisma.$transaction([
    prisma.attendance.create({
      data: { userId: session.user.id, date, points: bonusPoints },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { points: { increment: bonusPoints } },
    }),
  ]);

  return { success: true, points: bonusPoints, streak: streak + 1 };
}

/** 연속 출석일 계산 */
async function getStreak(userId: string, todayDate: string): Promise<number> {
  let streak = 0;
  const d = new Date(todayDate + "T00:00:00+09:00");

  for (let i = 1; i <= 30; i++) {
    d.setDate(d.getDate() - 1);
    const dateStr = d.toISOString().slice(0, 10);
    const found = await prisma.attendance.findUnique({
      where: { userId_date: { userId, date: dateStr } },
    });
    if (!found) break;
    streak++;
  }
  return streak;
}

/** 이번 달 출석 현황 조회 */
export async function getMonthlyAttendance(year?: number, month?: number) {
  const session = await auth();
  if (!session?.user?.id) return { days: [], streak: 0, totalPoints: 0, todayChecked: false };

  const today = todayKST();
  const y = year ?? parseInt(today.slice(0, 4));
  const m = month ?? parseInt(today.slice(5, 7));

  const prefix = `${y}-${String(m).padStart(2, "0")}`;

  const records = await prisma.attendance.findMany({
    where: { userId: session.user.id, date: { startsWith: prefix } },
    orderBy: { date: "asc" },
  });

  // 이번 달 총 포인트
  const totalPoints = records.reduce((sum, r) => sum + r.points, 0);

  // 오늘 출석 여부
  const todayChecked = records.some((r) => r.date === today);

  // 연속 출석일
  const streak = await getStreak(session.user.id, todayChecked ? today : new Date(new Date().getTime() + 9*60*60*1000 + 86400000).toISOString().slice(0,10));
  const actualStreak = todayChecked ? streak + 1 : 0;

  return {
    days: records.map((r) => ({ date: r.date, points: r.points })),
    streak: actualStreak,
    totalPoints,
    todayChecked,
  };
}

/** 관리자: 전체 출석 통계 */
export async function adminGetAttendanceStats() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return null;

  const today = todayKST();
  const thisMonth = today.slice(0, 7);

  // 오늘 출석자 수
  const todayCount = await prisma.attendance.count({ where: { date: today } });

  // 이번 달 총 출석
  const monthCount = await prisma.attendance.count({
    where: { date: { startsWith: thisMonth } },
  });

  // 이번 달 총 적립 포인트
  const monthPoints = await prisma.attendance.aggregate({
    where: { date: { startsWith: thisMonth } },
    _sum: { points: true },
  });

  // 최근 출석자 목록 (오늘)
  const todayRecords = await prisma.attendance.findMany({
    where: { date: today },
    include: { user: { select: { nickname: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // 최근 7일 일별 출석자 수
  const dailyStats: { date: string; count: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today + "T00:00:00+09:00");
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = await prisma.attendance.count({ where: { date: dateStr } });
    dailyStats.push({ date: dateStr, count });
  }

  return {
    todayCount,
    monthCount,
    monthPoints: monthPoints._sum.points ?? 0,
    todayRecords,
    dailyStats: dailyStats.reverse(),
  };
}
