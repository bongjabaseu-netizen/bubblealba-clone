/** GET /api/realestate — 공개 매물 목록(페이지네이션·카테고리·검색) (사용자 지시 2026-07-11, 확장성)
 * ?page=&pageSize=&category=&q= → { items, total, page, totalPages, hasMore } */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePage, paginate } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const { skip, take, page, pageSize } = parsePage(sp, 12, 60);

  const where: Record<string, unknown> = { status: "ACTIVE" };
  const category = sp.get("category");
  if (category) where.category = category;
  const q = sp.get("q");
  if (q) where.OR = [{ title: { contains: q } }, { region: { contains: q } }, { city: { contains: q } }];

  const [items, total] = await Promise.all([
    prisma.realEstateListing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true, title: true, price: true, priceType: true, deposit: true,
        area: true, rooms: true, floor: true, images: true,
        region: true, city: true, address: true, category: true, status: true,
      },
    }),
    prisma.realEstateListing.count({ where }),
  ]);

  return NextResponse.json(paginate(items, total, page, pageSize));
}
