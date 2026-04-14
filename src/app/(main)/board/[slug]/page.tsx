/** 범용 게시판 페이지 — slug로 게시판 구분 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function relativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const board = await prisma.board.findUnique({
    where: { slug },
  });
  if (!board) notFound();

  const posts = await prisma.communityPost.findMany({
    where: { boardId: board.id },
    include: {
      author: { select: { nickname: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* 게시판 헤더 */}
      <div className="px-15px mt-12px">
        <div className="flex items-center justify-between">
          <h2 className="font-16sb text-font-black">{board.name}</h2>
          <Link
            href={`/board/${slug}/write`}
            className="px-12px h-button rounded-10px bg-primary font-13rg text-white flex items-center gap-4px active-bg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            글쓰기
          </Link>
        </div>
        {board.description && (
          <p className="font-13rg text-font-gray mt-4px">{board.description}</p>
        )}
      </div>

      <hr className="border-line-gray-20 mt-12px" />

      {/* 게시글 목록 */}
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border-b border-line-gray-20">
            <Link
              href={`/community/detail/${post.id}`}
              className="block px-15px py-12px active-bg"
            >
              <h3 className="font-15sb text-font-black line-clamp-1">{post.title}</h3>
              <p className="font-13rg text-font-gray mt-3px line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-8px mt-6px font-12rg text-font-disabled">
                <span>{post.author.nickname ?? "익명"}</span>
                <span>·</span>
                <span>{relativeTime(post.createdAt)}</span>
                <span>·</span>
                <span>조회 {post.views}</span>
                {post._count.comments > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-primary">댓글 {post._count.comments}</span>
                  </>
                )}
              </div>
            </Link>
          </li>
        ))}

        {posts.length === 0 && (
          <li className="px-15px py-40px text-center">
            <p className="font-14rg text-font-disabled">아직 게시글이 없습니다</p>
            <Link href={`/board/${slug}/write`} className="font-14sb text-primary mt-8px inline-block">
              첫 글을 작성해보세요 →
            </Link>
          </li>
        )}
      </ul>
    </>
  );
}
