export const dynamic = "force-dynamic";
import Link from "next/link";
import { Eye, Heart, MessageSquare, Edit3 } from "lucide-react";
import { getPosts } from "@/lib/actions/posts";

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const { board } = await searchParams;
  const posts = await getPosts(board);

  const categories = [
    { label: "전체", slug: undefined },
    { label: "자유", slug: "free" },
    { label: "인기", slug: "popular" },
    { label: "업체", slug: "company" },
    { label: "질문", slug: "question" },
  ];

  return (
    <>
      {/* 카테고리 탭 */}
      <div className="flex gap-8px px-15px mt-12px overflow-x-auto">
        {categories.map((c) => {
          const active = (board ?? undefined) === c.slug;
          return (
            <Link
              key={c.label}
              href={c.slug ? `/community?board=${c.slug}` : "/community"}
              className={`shrink-0 rounded-14px px-12px h-button flex items-center font-13rg ${
                active
                  ? "bg-font-black text-bg-white"
                  : "border border-line-gray-50 text-font-black"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* 글쓰기 버튼 */}
      <div className="mt-12px px-15px">
        <Link
          href="/community/write"
          className="active-bg-gray flex h-44px items-center gap-6px px-15px font-15sb text-font-black"
        >
          <Edit3 className="h-18px w-18px text-link-blue" strokeWidth={2} />
          <span className="mr-auto">글쓰기</span>
        </Link>
      </div>

      {/* 게시글 리스트 */}
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="active-bg-opacity border-b border-line-gray-20">
            <Link href={`/community/detail/${post.id}`} className="block p-15px">
              <div className="flex items-center gap-5px mb-5px">
                <span className="font-12sb text-link-blue">{post.board?.name ?? "자유"}</span>
                <span className="font-12rg text-font-disabled">{relativeTime(new Date(post.createdAt))}</span>
              </div>
              <h3 className="font-15sb text-font-black truncate">{post.title}</h3>
              <p className="font-13rg text-font-gray mt-3px line-clamp-2">{post.content}</p>
              <div className="flex items-center justify-between mt-8px">
                <div className="flex items-center gap-5px">
                  <div className="w-5 h-5 rounded-full bg-bg-gray-50 flex items-center justify-center font-10rg text-font-gray">
                    {(post.author?.nickname ?? "?")[0]}
                  </div>
                  <span className="font-12rg text-font-disabled">{post.author?.nickname ?? "익명"}</span>
                </div>
                <div className="flex items-center gap-10px font-12rg text-font-disabled">
                  <span className="flex items-center gap-3px">
                    <Eye className="w-3 h-3" /> {(post.views ?? 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-3px">
                    <Heart className="w-3 h-3" /> {post._count?.scraps ?? 0}
                  </span>
                  <span className="flex items-center gap-3px">
                    <MessageSquare className="w-3 h-3" /> {post._count?.comments ?? 0}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="p-15px text-center font-14rg text-font-disabled">게시글이 없습니다</li>
        )}
      </ul>
    </>
  );
}
