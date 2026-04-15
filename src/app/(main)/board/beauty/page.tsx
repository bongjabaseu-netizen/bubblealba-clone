/** 미용 게시판 — 탭(미용실/네일아트/성형) + 탭별 배너 + 글 목록 */
export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getBannerAds } from "@/lib/actions/banners";
import { BeautyTabs } from "./BeautyTabs";

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

const TAB_INFO: Record<string, { emoji: string; title: string; desc: string }> = {
  salon: { emoji: "💇", title: "미용실", desc: "헤어스타일 후기와 추천 미용실" },
  nail: { emoji: "💅", title: "네일아트", desc: "네일 디자인 후기와 추천 샵" },
  surgery: { emoji: "🏥", title: "성형", desc: "성형 후기와 병원 정보 공유" },
};

export default async function BeautyBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const currentTab = tab ?? "salon";
  const info = TAB_INFO[currentTab] ?? TAB_INFO.salon;

  const banners = await getBannerAds();
  // 탭별 배너
  const tabBanners = currentTab === "nail" ? banners.beautyNail
    : currentTab === "surgery" ? banners.beautySurgery
    : banners.beautySalon;

  const board = await prisma.board.findUnique({ where: { slug: "beauty" } });

  const allPosts = board ? await prisma.communityPost.findMany({
    where: { boardId: board.id },
    include: { author: { select: { nickname: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  }) : [];

  const posts = currentTab === "salon"
    ? allPosts.filter(p => !p.title.startsWith("[네일]") && !p.title.startsWith("[성형]"))
    : currentTab === "nail"
      ? allPosts.filter(p => p.title.startsWith("[네일]"))
      : allPosts.filter(p => p.title.startsWith("[성형]"));

  return (
    <>
      {/* 탭 (배너 위) */}
      <BeautyTabs currentTab={currentTab} />

      {/* 탭별 배너 */}
      {tabBanners.length > 0 && (
        <div className="px-15px mt-8px space-y-6px">
          <div className="grid grid-cols-3 gap-6px">
            {tabBanners.slice(0, 3).map((b) => (
              <a key={b.id} href={b.linkUrl && b.linkUrl !== "#" ? b.linkUrl : `/banner/${b.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-square">
                <img src={b.imageUrl!} alt={b.title ?? ""} className="w-full h-full object-cover" loading="lazy" />
              </a>
            ))}
          </div>
          {tabBanners.length > 3 && (
            <div className="grid grid-cols-3 gap-6px">
              {tabBanners.slice(3, 6).map((b) => (
                <a key={b.id} href={b.linkUrl && b.linkUrl !== "#" ? b.linkUrl : `/banner/${b.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-square">
                  <img src={b.imageUrl!} alt={b.title ?? ""} className="w-full h-full object-cover" loading="lazy" />
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
            <h2 className="font-16sb text-font-black">{info.emoji} {info.title}</h2>
            <p className="font-13rg text-font-gray mt-2px">{info.desc}</p>
          </div>
          <Link
            href={`/board/beauty/write?category=${currentTab}`}
            className="px-12px h-button rounded-10px bg-primary font-13rg text-white flex items-center gap-4px active-bg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            글쓰기
          </Link>
        </div>
      </div>

      <hr className="border-line-gray-20 mt-8px" />

      {/* 게시글 */}
      <ul>
        {posts.map((post) => {
          const images: string[] = (() => { try { return JSON.parse(post.images || "[]"); } catch { return []; } })();
          const displayTitle = post.title.replace(/^\[(네일|성형)\]\s*/, "");
          return (
            <li key={post.id} className="border-b border-line-gray-20">
              <Link href={`/community/detail/${post.id}`} className="flex gap-12px px-15px py-12px active-bg">
                <div className="flex-1 min-w-0">
                  <h3 className="font-15sb text-font-black line-clamp-1">{displayTitle}</h3>
                  <p className="font-13rg text-font-gray mt-3px line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-8px mt-6px font-12rg text-font-disabled">
                    <span>{post.author.nickname ?? "익명"}</span>
                    <span>·</span>
                    <span>{relativeTime(post.createdAt)}</span>
                    <span>·</span>
                    <span>조회 {post.views}</span>
                    {post._count.comments > 0 && <><span>·</span><span className="text-primary">댓글 {post._count.comments}</span></>}
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
            <div className="text-5xl mb-12px">{info.emoji}</div>
            <p className="font-14rg text-font-disabled">아직 게시글이 없습니다</p>
            <Link href={`/board/beauty/write?category=${currentTab}`} className="font-14sb text-primary mt-8px inline-block">
              첫 후기 작성하기 →
            </Link>
          </li>
        )}
      </ul>
    </>
  );
}
