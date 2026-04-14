/** 부동산 매물 Server Actions — 조회 + 관리자 CRUD */
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/** 관리자 인증 헬퍼 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/** 매물 목록 (지역/카테고리 필터) */
export async function getListings(filters?: {
  region?: string;
  city?: string;
  category?: string;
  q?: string;
}) {
  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (filters?.region) where.region = filters.region;
  if (filters?.city) where.city = filters.city;
  if (filters?.category) where.category = filters.category;
  if (filters?.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { address: { contains: filters.q } },
      { description: { contains: filters.q } },
    ];
  }
  return prisma.realEstateListing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nickname: true } } },
  });
}

/** 매물 상세 */
export async function getListing(id: string) {
  const listing = await prisma.realEstateListing.findUnique({
    where: { id },
    include: { author: { select: { nickname: true } } },
  });
  if (listing) {
    await prisma.realEstateListing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
  return listing;
}

/** 관리자: 매물 등록 */
export async function createListing(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "관리자 권한이 필요합니다" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const priceType = formData.get("priceType") as string;
  const deposit = (formData.get("deposit") as string) || null;
  const area = (formData.get("area") as string) || null;
  const rooms = (formData.get("rooms") as string) || null;
  const floor = (formData.get("floor") as string) || null;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const address = (formData.get("address") as string) || null;
  const category = (formData.get("category") as string) || "ONEROOM";
  const images = (formData.get("images") as string) || "[]";

  if (!title || !description || !price || !region || !city) {
    return { error: "필수 항목을 입력해주세요" };
  }

  await prisma.realEstateListing.create({
    data: {
      title, description, price, priceType, deposit, area, rooms, floor,
      images, region, city, address, category: category as any,
      authorId: admin.id,
    },
  });
  return { success: true };
}

/** 관리자: 매물 상태 변경 */
export async function updateListingStatus(id: string, status: "ACTIVE" | "RESERVED" | "CLOSED") {
  const admin = await requireAdmin();
  if (!admin) return { error: "관리자 권한이 필요합니다" };
  await prisma.realEstateListing.update({ where: { id }, data: { status } });
  return { success: true };
}

/** 관리자: 매물 삭제 */
export async function deleteListing(id: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "관리자 권한이 필요합니다" };
  await prisma.realEstateListing.delete({ where: { id } });
  return { success: true };
}

/** 관리자: 전체 매물 (상태 무관) */
export async function adminGetListings() {
  return prisma.realEstateListing.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nickname: true } } },
  });
}
