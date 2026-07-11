/** GET /api/admin/users — 관리자 회원 목록(페이지네이션·검색·role) (사용자 지시 2026-07-11)
 * 인증: ADMIN. ?page=&pageSize=&q=&role= → { items, total, page, totalPages, hasMore } */
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
  const role = sp.get("role");
  if (role && ["USER", "ADVERTISER", "ADMIN", "LAWYER"].includes(role)) where.role = role;
  const q = sp.get("q");
  if (q) where.OR = [{ nickname: { contains: q } }, { email: { contains: q } }, { region: { contains: q } }];

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true, email: true, nickname: true, role: true, region: true,
        points: true, phoneVerified: true, isAdult: true, createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json(paginate(items, total, page, pageSize));
}
