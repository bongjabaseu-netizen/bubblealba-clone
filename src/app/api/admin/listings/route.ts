/** GET /api/admin/listings — 관리자 매물 목록(페이지네이션·검색·카테고리·상태) (사용자 지시 2026-07-11)
 * 인증: ADMIN. 공개 API와 달리 전 상태 포함(관리용). ?page=&q=&category=&status= */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parsePage, paginate } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const { skip, take, page, pageSize } = parsePage(sp, 20, 100);

  const where: Record<string, unknown> = {};
  const category = sp.get("category");
  if (category) where.category = category;
  const status = sp.get("status");
  if (status) where.status = status;
  const q = sp.get("q");
  if (q) where.OR = [{ title: { contains: q } }, { region: { contains: q } }, { city: { contains: q } }];

  const [items, total] = await Promise.all([
    prisma.realEstateListing.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    prisma.realEstateListing.count({ where }),
  ]);

  return NextResponse.json(paginate(items, total, page, pageSize));
}
