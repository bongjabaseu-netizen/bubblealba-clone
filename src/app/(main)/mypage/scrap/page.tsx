import Link from "next/link";
import { getScraps } from "@/lib/actions/users";

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

export default async function ScrapPage() {
  const scraps = await getScraps();

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">스크랩</h1>
        <p className="font-13rg text-font-gray">저장해둔 게시물이에요</p>
      </div>

      {scraps.length === 0 && (
        <p className="font-13rg text-font-disabled">스크랩한 게시물이 없습니다.</p>
      )}

      <div className="space-y-1px bg-line-gray-20">
        {scraps.map((scrap) => {
          const post = scrap.post;
          return (
            <Link key={scrap.id} href={`/community/detail/${post.id}`} className="block active-bg bg-bg-white px-15px py-14px">
              <div className="flex items-center gap-6px mb-6px">
                <span className="font-11rg px-6px py-1px rounded-4px bg-bg-gray-50 text-font-gray">
                  {post.board?.name ?? "자유"}
                </span>
                <span className="font-12rg text-font-disabled">{relativeTime(new Date(post.createdAt))}</span>
              </div>
              <h3 className="font-15sb text-font-black line-clamp-1 mb-4px">{post.title}</h3>
              <p className="font-13rg text-font-gray line-clamp-2 mb-8px">{post.content}</p>
              <div className="flex items-center gap-10px font-12rg text-font-disabled">
                <span className="flex items-center gap-2px">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  {post.views ?? 0}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
