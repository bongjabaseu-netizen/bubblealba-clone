/** 애견자랑 게시판 — 사진 갤러리 형태 + 글 작성 */
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
      {/* 애견샵 이미지 배너 3x2 (관리자만 등록 가능) */}
      {petBanners.length > 0 && (
        <div className="px-15px mt-8px space-y-6px">
          {/* 첫째줄 3개 */}
          <div className="grid grid-cols-3 gap-6px">
            {petBanners.slice(0, 3).map((b) => (
              <a key={b.id} href={b.linkUrl && b.linkUrl !== "#" ? b.linkUrl : `/banner/${b.id}`} className="block rounded-10px overflow-hidden bg-bg-gray-50 aspect-square">
                <img src={b.imageUrl!} alt={b.title ?? ""} className="w-full h-full object-cover" loading="lazy" />
              </a>
            ))}
          </div>
          {/* 둘째줄 3개 */}
          {petBanners.length > 3 && (
            <div className="grid grid-cols-3 gap-6px">
              {petBanners.slice(3, 6).map((b) => (
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
            <h2 className="font-16sb text-font-black">🐶 애견자랑</h2>
            <p className="font-13rg text-font-gray mt-2px">우리 아이 자랑해보세요!</p>
          </div>
          <Link
            href="/board/pets/write"
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

      {/* 사진 갤러리 그리드 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4px p-4px">
          {posts.map((post) => {
            const images: string[] = (() => {
              try { return JSON.parse(post.images || "[]"); } catch { return []; }
            })();
            const hasImage = images.length > 0;

            return (
              <Link
                key={post.id}
                href={`/community/detail/${post.id}`}
                className="relative block overflow-hidden bg-bg-gray-50 aspect-square active-bg"
              >
                {hasImage ? (
                  <img src={images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
                )}
                {/* 오버레이 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8px">
                  <h3 className="font-13rg text-white line-clamp-1">{post.title}</h3>
                  <div className="flex items-center gap-6px mt-2px font-10rg text-white/70">
                    <span>{post.author.nickname ?? "익명"}</span>
                    <span>·</span>
                    <span>❤ {post.likes}</span>
                    {post._count.comments > 0 && <span>· 💬 {post._count.comments}</span>}
                  </div>
                </div>
                {/* 사진 여러장 표시 */}
                {images.length > 1 && (
                  <div className="absolute top-6px right-6px bg-black/50 rounded-6px px-4px py-1px">
                    <span className="font-10rg text-white">📷 {images.length}</span>
                  </div>
                )}
              </Link>
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
