import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/actions/posts";
import { CommentForm } from "./comment-form";

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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="pb-20px">
      {/* 빵부스러기 */}
      <nav className="px-15px py-10px flex items-center gap-4px font-12rg text-font-gray">
        <Link href="/" className="text-font-gray">홈</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <Link href="/community" className="text-font-gray">커뮤니티</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-font-black truncate max-w-[200px]">{post.title}</span>
      </nav>

      <div className="px-15px">
        {/* 게시글 헤더 */}
        <div className="flex items-center gap-6px mb-10px">
          <span className={`font-11rg px-6px py-1px rounded-4px ${
            post.board?.slug === "popular" ? "bg-primary text-white" : "bg-bg-gray-50 text-font-gray"
          }`}>
            {post.board?.name ?? "자유"}
          </span>
          <span className="font-12rg text-font-disabled">{relativeTime(new Date(post.createdAt))}</span>
        </div>

        <h1 className="font-18sb text-font-black mb-12px">{post.title}</h1>

        {/* 작성자 + 통계 */}
        <div className="flex items-center justify-between pb-12px border-b border-line-gray-20">
          <div className="flex items-center gap-8px">
            <div className="w-8 h-8 rounded-full bg-bg-gray-50 flex items-center justify-center font-13sb text-font-gray">
              {(post.author?.nickname ?? "?")[0]}
            </div>
            <div>
              <div className="font-14sb text-font-black">{post.author?.nickname ?? "익명"}</div>
              <div className="font-11rg text-font-disabled">활동중</div>
            </div>
          </div>
          <div className="flex items-center gap-10px font-12rg text-font-disabled">
            <span className="flex items-center gap-2px">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              {(post.views ?? 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-2px">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              {post._count?.scraps ?? 0}
            </span>
            <span className="flex items-center gap-2px">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              {post.comments?.length ?? 0}
            </span>
          </div>
        </div>

        {/* 본문 */}
        <div className="py-16px font-14rg text-font-black leading-relaxed whitespace-pre-line min-h-[120px]">
          {post.content}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-center gap-8px py-12px border-t border-line-gray-20">
          <button className="h-36px px-12px rounded-10px border border-line-gray-20 font-13rg text-font-gray flex items-center gap-4px active-bg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            좋아요 {post._count?.scraps ?? 0}
          </button>
          <button className="h-36px px-12px rounded-10px border border-line-gray-20 font-13rg text-font-gray flex items-center gap-4px active-bg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
            스크랩
          </button>
          <button className="h-36px px-12px rounded-10px border border-line-gray-20 font-13rg text-font-gray flex items-center gap-4px active-bg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
            공유
          </button>
          <button className="h-36px px-12px rounded-10px border border-line-gray-20 font-13rg text-font-gray flex items-center gap-4px active-bg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
            신고
          </button>
        </div>
      </div>

      {/* 댓글 */}
      <div className="px-15px mt-16px">
        <h2 className="font-15sb text-font-black mb-12px">
          댓글 <span className="text-primary">{post.comments?.length ?? 0}</span>
        </h2>

        <CommentForm postId={post.id} />

        <div className="space-y-1px">
          {post.comments?.map((c) => (
            <div key={c.id} className="flex items-start gap-10px py-12px border-b border-line-gray-20 last:border-0">
              <div className="w-8 h-8 rounded-full bg-bg-gray-50 flex items-center justify-center font-13sb text-font-gray shrink-0">
                {(c.author?.nickname ?? "?")[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-6px mb-4px">
                  <span className="font-14sb text-font-black">{c.author?.nickname ?? "익명"}</span>
                  <span className="font-12rg text-font-disabled">{relativeTime(new Date(c.createdAt))}</span>
                </div>
                <p className="font-14rg text-font-black">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
