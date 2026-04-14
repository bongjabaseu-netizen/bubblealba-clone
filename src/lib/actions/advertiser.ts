/** 광고주 전용 Server Actions — 대시보드/입찰/결제/초이스톡 */
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** 광고주 인증 헬퍼 */
async function requireAdvertiser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, points: true, nickname: true },
  });
  if (!user || (user.role !== "ADVERTISER" && user.role !== "ADMIN")) return null;
  return user;
}

/** 광고주 대시보드 데이터 */
export async function getAdvertiserDashboard() {
  const user = await requireAdvertiser();
  if (!user) return null;

  const [jobs, bids, rooms, recentMessages] = await Promise.all([
    prisma.job.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { favorites: true, applications: true } } },
    }),
    prisma.adBid.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } }, package: { select: { name: true } } },
    }),
    prisma.choiceTalkRoom.findMany({
      where: { ownerId: user.id },
      include: { _count: { select: { messages: true } } },
    }),
    prisma.choiceTalkMessage.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { room: { select: { name: true, slug: true } } },
    }),
  ]);

  return { user, jobs, bids, rooms, recentMessages };
}

/** 광고 패키지 목록 */
export async function getAdPackages() {
  return prisma.adPackage.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
}

/** 내 공고 목록 (입찰용) */
export async function getMyJobs() {
  const user = await requireAdvertiser();
  if (!user) return [];
  return prisma.job.findMany({
    where: { authorId: user.id, status: "ACTIVE" },
    select: { id: true, title: true, company: true },
  });
}

/** 입찰 생성 — 포인트 즉시 차감 or 관리자 승인 대기 */
export async function createBid(formData: FormData) {
  const user = await requireAdvertiser();
  if (!user) return { error: "광고주 권한이 필요합니다" };

  const jobId = formData.get("jobId") as string;
  const packageId = (formData.get("packageId") as string) || null;
  const bidAmount = parseInt(formData.get("bidAmount") as string) || 0;

  if (!jobId) return { error: "공고를 선택해주세요" };
  if (bidAmount < 0) return { error: "입찰 금액은 0 이상이어야 합니다" };
  if (!packageId && bidAmount === 0) return { error: "패키지를 선택하거나 입찰 금액을 입력해주세요" };

  // 패키지 가격 조회
  let packagePrice = 0;
  if (packageId) {
    const pkg = await prisma.adPackage.findUnique({ where: { id: packageId } });
    if (!pkg) return { error: "패키지를 찾을 수 없습니다" };
    packagePrice = pkg.price;
  }

  const totalAmount = packagePrice + bidAmount;
  const POINT_LIMIT = 500000; // 50만원 이하 포인트 즉시 결제

  if (totalAmount <= POINT_LIMIT) {
    // 포인트 즉시 결제
    if (user.points < totalAmount) return { error: `포인트가 부족합니다 (필요: ${totalAmount.toLocaleString()}P, 보유: ${user.points.toLocaleString()}P)` };

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { points: { decrement: totalAmount } },
      }),
      prisma.adBid.create({
        data: {
          userId: user.id,
          jobId,
          packageId,
          bidAmount,
          totalAmount,
          payMethod: "POINT",
          status: "APPROVED",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 86400000),
        },
      }),
    ]);
    return { success: true, method: "POINT" };
  } else {
    // 관리자 승인 필요
    await prisma.adBid.create({
      data: {
        userId: user.id,
        jobId,
        packageId,
        bidAmount,
        totalAmount,
        payMethod: "ADMIN_APPROVE",
        status: "PENDING",
      },
    });
    return { success: true, method: "ADMIN_APPROVE" };
  }
}

/** 관리자: 입찰 승인 */
export async function adminApproveBid(bidId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  const bid = await prisma.adBid.findUnique({ where: { id: bidId } });
  if (!bid || bid.status !== "PENDING") return { error: "처리할 수 없는 입찰입니다" };

  await prisma.adBid.update({
    where: { id: bidId },
    data: {
      status: "APPROVED",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 86400000),
    },
  });
  return { success: true };
}

/** 관리자: 입찰 거절 */
export async function adminRejectBid(bidId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  await prisma.adBid.update({
    where: { id: bidId },
    data: { status: "REJECTED" },
  });
  return { success: true };
}
