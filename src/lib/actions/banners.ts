/** 배너 광고 Server Actions */
"use server";

import { prisma } from "@/lib/prisma";

/** 홈페이지 배너 조회 — 타입별 정렬 */
export async function getBannerAds() {
  const banners = await prisma.bannerAd.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
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
  };
}

// ========== 관리자 ==========

/** 관리자: 전체 배너 목록 */
export async function adminGetBanners() {
  return prisma.bannerAd.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }],
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
