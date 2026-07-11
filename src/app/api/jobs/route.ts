/** GET /api/jobs — 공개 공고 목록(페이지네이션·지역·직종·검색) (사용자 지시 2026-07-11, 확장성)
 * ?page=&pageSize=&region=&city=&category=&q= → { items, total, page, totalPages, hasMore }
 * 정렬: 프로모션 → displayOrder → 최신 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePage, paginate } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const { skip, take, page, pageSize } = parsePage(sp, 20, 100);

  const where: Record<string, unknown> = { status: "ACTIVE" };
  const region = sp.get("region");
  if (region) where.region = region;
  const city = sp.get("city");
  if (city) where.city = city;
  const category = sp.get("category");
  if (category) where.category = category;
  const q = sp.get("q");
  if (q) where.OR = [{ title: { contains: q } }, { company: { contains: q } }, { city: { contains: q } }];

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ isPromoted: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take,
      select: {
        id: true, title: true, wage: true, region: true, city: true, category: true,
        company: true, images: true, tags: true, isPromoted: true, views: true, createdAt: true,
      },
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json(paginate(items, total, page, pageSize));
}
