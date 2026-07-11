/** GET /api/community — 공개 커뮤니티 글 목록(페이지네이션·게시판·검색) (사용자 지시 2026-07-11, 확장성)
 * ?page=&pageSize=&board=(slug)&q= → { items, total, page, totalPages, hasMore }
 * 작성자는 anonNo 포함(명품 익명 표시는 클라이언트 luxuryAlias로) */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePage, paginate } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const { skip, take, page, pageSize } = parsePage(sp, 20, 100);

  const where: Record<string, unknown> = { isSecret: false };
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
        author: { select: { nickname: true, anonNo: true } },
        board: { select: { name: true, slug: true } },
        _count: { select: { comments: true, scraps: true } },
      },
    }),
    prisma.communityPost.count({ where }),
  ]);

  return NextResponse.json(paginate(items, total, page, pageSize));
}
