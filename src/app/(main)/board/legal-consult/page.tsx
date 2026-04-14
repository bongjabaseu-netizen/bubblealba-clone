/** 법률상담 게시판 — 이미지 배너 + 글 목록 + 사진 첨부 */
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getBannerAds } from "@/lib/actions/banners";

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

export default async function LegalConsultPage() {
  const banners = await getBannerAds();
  const legalBanners = banners.legalAd;

  const board = await prisma.board.findUnique({ where: { slug: "legal-consult" } });
  if (!board) return <div className="p-15px text-center font-14rg text-font-disabled">게시판이 없습니다</div>;

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
      {/* 법률사무소 이미지 배너 3x2 */}
      {legalBanners.length > 0 && (
        <div className="px-15px mt-8px space-y-6px">
          <div className="grid grid-cols-3 gap-6px">
            {legalBanners.slice(0, 3).map((b) => (
              <a key={b.id} href={b.linkUrl && b.linkUrl !== "#" ? b.linkUrl : `/banner/${b.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-square">
                <img src={b.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
              </a>
            ))}
          </div>
          {legalBanners.length > 3 && (
            <div className="grid grid-cols-3 gap-6px">
              {legalBanners.slice(3, 6).map((b) => (
                <a key={b.id} href={b.linkUrl && b.linkUrl !== "#" ? b.linkUrl : `/banner/${b.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-square">
                  <img src={b.imageUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 헤더 */}
      <div className="px-15px mt-12px">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-16sb text-font-black">⚖️ 법률상담</h2>
            <p className="font-13rg text-font-gray mt-2px">법률 관련 궁금한 점을 상담하세요</p>
          </div>
          <Link
            href="/board/legal-consult/write"
            className="px-12px h-button rounded-10px bg-primary font-13rg text-white flex items-center gap-4px active-bg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            글쓰기
          </Link>
        </div>
      </div>

      <hr className="border-line-gray-20 mt-12px" />

      {/* 게시글 목록 */}
      <ul>
        {posts.map((post) => {
          const images: string[] = (() => { try { return JSON.parse(post.images || "[]"); } catch { return []; } })();
          return (
            <li key={post.id} className="border-b border-line-gray-20">
              <Link href={`/community/detail/${post.id}`} className="flex gap-12px px-15px py-12px active-bg">
                <div className="flex-1 min-w-0">
                  <h3 className="font-15sb text-font-black line-clamp-1">{post.title}</h3>
                  <p className="font-13rg text-font-gray mt-3px line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-8px mt-6px font-12rg text-font-disabled">
                    <span>{post.author.nickname ?? "익명"}</span>
                    <span>·</span>
                    <span>{relativeTime(post.createdAt)}</span>
                    <span>·</span>
                    <span>조회 {post.views}</span>
                    {post._count.comments > 0 && <><span>·</span><span className="text-primary">답변 {post._count.comments}</span></>}
                  </div>
                </div>
                {images[0] && (
                  <div className="w-[60px] h-[60px] rounded-10px bg-bg-gray-50 overflow-hidden shrink-0">
                    <img src={images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </Link>
            </li>
          );
        })}

        {posts.length === 0 && (
          <li className="px-15px py-40px text-center">
            <div className="text-5xl mb-12px">⚖️</div>
            <p className="font-14rg text-font-disabled">아직 상담글이 없습니다</p>
            <Link href="/board/legal-consult/write" className="font-14sb text-primary mt-8px inline-block">
              첫 상담글 작성하기 →
            </Link>
          </li>
        )}
      </ul>
    </>
  );
}
