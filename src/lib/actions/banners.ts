/** 배너 광고 Server Actions */
"use server";

import { prisma } from "@/lib/prisma";

/** 홈페이지 배너 조회 — 타입별 정렬 (order 동률 시 createdAt으로 순서 결정화) */
export async function getBannerAds() {
  const banners = await prisma.bannerAd.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return {
    imageTop: banners.filter((b) => b.type === "IMAGE_TOP"),
    imageMid: banners.filter((b) => b.type === "IMAGE_MID"),
    imageBot: banners.filter((b) => b.type === "IMAGE_BOT"),
    textRolling: banners.filter((b) => b.type === "TEXT_ROLLING"),
    petsShop: banners.filter((b) => b.type === "PETS_SHOP"),
    legalAd: banners.filter((b) => b.type === "LEGAL_AD"),
    beautySalon: banners.filter((b) => b.type === "BEAUTY_SALON"),
    beautyNail: banners.filter((b) => b.type === "BEAUTY_NAIL"),
    beautySurgery: banners.filter((b) => b.type === "BEAUTY_SURGERY"),
    heroSlide: banners.filter((b) => b.type === "HERO_SLIDE"), // 홈 상단 히어로 마퀴
  };
}

// ========== 관리자 ==========

/** 관리자: 전체 배너 목록 (order 동률 시 createdAt으로 순서 결정화 — 스왑 트랜잭션 내 읽기 순서와 일치) */
export async function adminGetBanners() {
  return prisma.bannerAd.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    include: { user: { select: { nickname: true } } },
  });
}

/** 관리자: 배너 생성 */
export async function adminCreateBanner(formData: FormData) {
  const session = await (await import("@/auth")).auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  const type = formData.get("type") as string;
  const title = (formData.get("title") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const linkUrl = (formData.get("linkUrl") as string) || null;
  const text = (formData.get("text") as string) || null;
  const description = (formData.get("description") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const address = (formData.get("address") as string) || null;
  const order = parseInt(formData.get("order") as string) || 0;

  if (!type) return { error: "배너 타입을 선택해주세요" };
  if (type !== "TEXT_ROLLING" && !imageUrl) return { error: "이미지를 업로드해주세요" };
  if (type === "TEXT_ROLLING" && !text) return { error: "텍스트를 입력해주세요" };

  await prisma.bannerAd.create({
    data: {
      type: type as any,
      title, imageUrl, linkUrl, text, description, phone, address, order,
      userId: session!.user!.id!,
    },
  });
  return { success: true };
}

/** 관리자: 배너 활성/비활성 토글 */
export async function adminToggleBanner(id: string) {
  const session = await (await import("@/auth")).auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };
  const banner = await prisma.bannerAd.findUnique({ where: { id } });
  if (!banner) return { error: "배너 없음" };
  await prisma.bannerAd.update({ where: { id }, data: { isActive: !banner.isActive } });
  return { success: true };
}

/** 관리자: 배너 삭제 */
export async function adminDeleteBanner(id: string) {
  const session = await (await import("@/auth")).auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };
  await prisma.bannerAd.delete({ where: { id } });
  return { success: true };
}

/** 관리자: 배너 수정 */
export async function adminUpdateBanner(id: string, formData: FormData) {
  const session = await (await import("@/auth")).auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  const title = (formData.get("title") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const linkUrl = (formData.get("linkUrl") as string) || null;
  const text = (formData.get("text") as string) || null;
  const description = (formData.get("description") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const address = (formData.get("address") as string) || null;
  const order = parseInt(formData.get("order") as string) || 0;
  const type = formData.get("type") as string;

  await prisma.bannerAd.update({
    where: { id },
    data: { title, imageUrl, linkUrl, text, description, phone, address, order, ...(type && { type: type as any }) },
  });
  return { success: true };
}

/** 배너 상세 조회 */
export async function getBannerDetail(id: string) {
  return prisma.bannerAd.findUnique({
    where: { id },
    include: { user: { select: { nickname: true } } },
  });
}

/** 관리자: 같은 타입 그룹 내 두 배너의 표시 위치 맞바꿈 — order 값 교환이 아닌 "위치" 스왑 후 그룹 전체 1..n 재부여 (동률 order 정규화 겸용) */
export async function adminSwapBannerOrder(idA: string, idB: string) {
  const session = await (await import("@/auth")).auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "권한 없음" };

  // 그룹 읽기 → 재번호 부여를 원자적으로 실행 (interactive transaction)
  return await prisma.$transaction(async (tx) => {
    const [a, b] = await Promise.all([
      tx.bannerAd.findUnique({ where: { id: idA }, select: { type: true } }),
      tx.bannerAd.findUnique({ where: { id: idB }, select: { type: true } }),
    ]);
    if (!a || !b) return { error: "배너를 찾을 수 없습니다." };
    if (a.type !== b.type) return { error: "같은 타입 배너끼리만 이동할 수 있습니다." }; // 서버측 그룹 검증
    // 그룹 전체를 표시 순서로 읽어 두 배너의 위치를 맞바꾸고 1..n 재부여
    const group = await tx.bannerAd.findMany({
      where: { type: a.type },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true },
    });
    const ia = group.findIndex((x) => x.id === idA);
    const ib = group.findIndex((x) => x.id === idB);
    [group[ia], group[ib]] = [group[ib], group[ia]];
    await Promise.all(group.map((x, i) => tx.bannerAd.update({ where: { id: x.id }, data: { order: i + 1 } })));
    return { success: true };
  });
}
