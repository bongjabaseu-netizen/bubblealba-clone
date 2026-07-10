/** 애견자랑 게시판 — 사진 갤러리 형태 + 글 작성 */
export const dynamic = "force-dynamic";
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

export default async function PetsBoardPage() {
  const banners = await getBannerAds();
  const petBanners = banners.petsShop;
  const board = await prisma.board.findUnique({ where: { slug: "pets" } });
  if (!board) return <div className="p-15px text-center font-14rg text-font-disabled">게시판이 없습니다</div>;

  // 공지(pinned)는 갤러리에서 제외 → 별도 공지사항 페이지로 (사용자 지시 2026-07-10)
  const noticeCount = await prisma.communityPost.count({ where: { boardId: board.id, pinned: true } });
  const posts = await prisma.communityPost.findMany({
    where: { boardId: board.id, pinned: false },
    include: {
      author: { select: { nickname: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 글 + 애견샵 광고를 인터리브한 SNS 피드 (2글마다 스폰서 카드 1개) — 사용자 지시 2026-07-10
  type FeedItem =
    | { kind: "post"; post: (typeof posts)[number] }
    | { kind: "ad"; ad: (typeof petBanners)[number] };
  const feedItems: FeedItem[] = [];
  let bannerIdx = 0;
  posts.forEach((post, i) => {
    feedItems.push({ kind: "post", post });
    if ((i + 1) % 2 === 0 && bannerIdx < petBanners.length) {
      feedItems.push({ kind: "ad", ad: petBanners[bannerIdx++] });
    }
  });
  while (bannerIdx < petBanners.length) feedItems.push({ kind: "ad", ad: petBanners[bannerIdx++] });

  return (
    <>
      {/* 공지사항 진입 — 카테고리 스트립 밑 한줄 버튼 (사용자 지시 2026-07-10) */}
      <div className="px-15px mt-8px">
        <Link
          href="/board/pets/notice"
          className="flex items-center gap-8px h-button px-12px rounded-10px border border-line-gray-20 bg-bg-gray-50 active-bg"
        >
          <span className="shrink-0 text-base leading-none">📢</span>
          <span className="font-13sb text-font-black">애견자랑 공지사항</span>
          {noticeCount > 0 && (
            <span className="shrink-0 rounded-full bg-link-blue px-6px py-1px font-11rg text-white">{noticeCount}</span>
          )}
          <svg className="ml-auto w-4 h-4 text-font-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        </Link>
      </div>

      {/* 애견샵 광고 배너는 아래 SNS 피드에 스폰서 카드로 인터리브됨 (사용자 지시 2026-07-10) */}

      {/* 헤더 */}
      <div className="px-15px mt-12px">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-16sb text-font-black">🐶 애견자랑</h2>
            <p className="font-13rg text-font-gray mt-2px">우리 아이 자랑해보세요!</p>
          </div>
          <Link
            href="/board/pets/write"
            className="px-12px h-button rounded-10px bg-font-black font-13rg text-white flex items-center gap-4px active-bg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            글쓰기
          </Link>
        </div>
      </div>

      <hr className="border-line-gray-20 mt-12px" />

      {/* SNS(인스타) 피드 — 글 카드 + 애견샵 스폰서 카드 인터리브 (사용자 지시 2026-07-10) */}
      {feedItems.length > 0 ? (
        <div className="divide-y divide-line-gray-20">
          {feedItems.map((item) => {
            // 스폰서(광고) 카드 — 애견샵 배너를 피드 카드 스타일로
            if (item.kind === "ad") {
              const ad = item.ad;
              const adHref = ad.linkUrl && ad.linkUrl !== "#" ? ad.linkUrl : `/banner/${ad.id}`;
              return (
                <article key={`ad-${ad.id}`} className="pb-14px">
                  <div className="flex items-center gap-8px px-15px py-10px">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400/25 to-emerald-500/10 flex items-center justify-center text-base shrink-0">🏪</div>
                    <span className="font-13sb text-font-black flex-1 truncate">{ad.title ?? "애견샵"}</span>
                    <span className="shrink-0 rounded bg-bg-gray-50 px-6px py-1px font-11rg text-font-disabled">광고</span>
                  </div>
                  <a href={adHref} className="block bg-bg-gray-50 aspect-square active-bg">
                    <img src={ad.imageUrl!} alt={ad.title ?? ""} className="w-full h-full object-cover" loading="lazy" />
                  </a>
                  <div className="flex px-15px pt-10px">
                    <a href={adHref} className="ml-auto inline-flex items-center gap-4px font-13sb text-primary">
                      자세히 보기
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
                    </a>
                  </div>
                </article>
              );
            }
            // 일반 글 카드
            const post = item.post;
            const images: string[] = (() => {
              try { return JSON.parse(post.images || "[]"); } catch { return []; }
            })();
            const hasImage = images.length > 0;
            const nickname = post.author.nickname ?? "익명";
            const detail = `/community/detail/${post.id}`;

            return (
              <article key={post.id} className="pb-14px">
                {/* 작성자 헤더 */}
                <div className="flex items-center gap-8px px-15px py-10px">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/25 to-primary/10 flex items-center justify-center font-14sb text-primary shrink-0">
                    {nickname[0]}
                  </div>
                  <span className="font-13sb text-font-black flex-1 truncate">{nickname}</span>
                  <span className="font-12rg text-font-disabled shrink-0">{relativeTime(post.createdAt)}</span>
                </div>
                {/* 이미지 */}
                <Link href={detail} className="relative block bg-bg-gray-50 aspect-square active-bg">
                  {hasImage ? (
                    <img src={images[0]} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
                  )}
                  {images.length > 1 && (
                    <div className="absolute top-8px right-8px bg-black/50 rounded-6px px-6px py-1px">
                      <span className="font-10rg text-white">📷 {images.length}</span>
                    </div>
                  )}
                </Link>
                {/* 액션 (좋아요·댓글·저장) */}
                <div className="flex items-center gap-16px px-15px pt-10px">
                  <span className="flex items-center gap-4px font-13sb text-font-black">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21s-7.55-4.63-10.1-9.2C.35 8.4 2.05 5 5.35 5c2.02 0 3.3 1.14 4.15 2.34l.5.7.5-.7C11.35 6.14 12.63 5 14.65 5c3.3 0 5 3.4 3.45 6.8C19.55 16.37 12 21 12 21z" /></svg>
                    {post.likes.toLocaleString()}
                  </span>
                  <Link href={detail} className="flex items-center gap-4px font-13rg text-font-gray">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></svg>
                    {post._count.comments}
                  </Link>
                  <svg className="ml-auto w-6 h-6 text-font-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                </div>
                {/* 캡션 */}
                <Link href={detail} className="block px-15px pt-6px">
                  <p className="font-13rg text-font-black line-clamp-2">
                    <b className="font-13sb">{nickname}</b> {post.content}
                  </p>
                  {post._count.comments > 0 && (
                    <span className="font-12rg text-font-disabled mt-3px inline-block">댓글 {post._count.comments}개 모두 보기</span>
                  )}
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="px-15px py-40px text-center">
          <div className="text-5xl mb-12px">🐕</div>
          <p className="font-14rg text-font-disabled">아직 게시글이 없습니다</p>
          <Link href="/board/pets/write" className="font-14sb text-primary mt-8px inline-block">
            우리 아이 자랑하기 →
          </Link>
        </div>
      )}
    </>
  );
}
