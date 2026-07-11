/** 관리자 게시물관리 — 목록은 클라이언트가 /api/admin/posts로 페이지네이션 로드
 * 게시판 필터 옵션(name+slug)만 서버에서 조회해 전달 (사용자 지시 2026-07-11, 확장성) */
import { prisma } from "@/lib/prisma";
import { PostsClient } from "./PostsClient";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const boards = await prisma.board.findMany({
    select: { name: true, slug: true },
    orderBy: { order: "asc" },
  });
  return <PostsClient boards={boards} />;
}
