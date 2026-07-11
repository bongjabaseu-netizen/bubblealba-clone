/** GET /api/admin/posts — 관리자 게시물 목록(페이지네이션·검색·게시판) (사용자 지시 2026-07-11)
 * 인증: ADMIN. ?page=&q=&board=(slug) → { items, total, page, totalPages, hasMore } */
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
  const boardSlug = sp.get("board");
  if (boardSlug) {
    const board = await prisma.board.findUnique({ where: { slug: boardSlug }, select: { id: true } });
    where.boardId = board?.id ?? "__none__";
  }
  const q = sp.get("q");
  if (q) where.OR = [{ title: { contains: q } }, { content: { contains: q } }];

  const [items, total] = await Promise.all([
    prisma.communityPost.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      skip,
      take,
      include: {
        author: { select: { nickname: true } },
        board: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.communityPost.count({ where }),
  ]);

  return NextResponse.json(paginate(items, total, page, pageSize));
}
