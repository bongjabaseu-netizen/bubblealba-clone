/** 부동산 게시판 — 배너 + 매물 리스트 + 지역검색 + 게시판 */
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getListings } from "@/lib/actions/realestate";
import { RealEstateTabs } from "./RealEstateTabs";
import { ListingSearch } from "./ListingSearch";

const CATEGORY_LABEL: Record<string, string> = {
  ONEROOM: "원룸", TWOROOM: "투룸", THREEROOM: "쓰리룸",
  OFFICETEL: "오피스텔", APT: "아파트", VILLA: "빌라",
  STORE: "상가", ETC: "기타",
};
const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  ACTIVE: { text: "등록중", color: "bg-green-100 text-green-700" },
  RESERVED: { text: "예약중", color: "bg-yellow-100 text-yellow-700" },
  CLOSED: { text: "거래완료", color: "bg-slate-100 text-slate-500" },
};

export default async function RealEstateBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; region?: string; city?: string; category?: string; q?: string }>;
}) {
  const { tab, region, city, category, q } = await searchParams;
  const currentTab = tab ?? "listing";

  // 매물 조회
  const listings = await getListings({ region, city, category, q });

  // 게시판 글 조회
  const board = await prisma.board.findUnique({ where: { slug: "realestate" } });
  const posts = board ? await prisma.communityPost.findMany({
    where: { boardId: board.id },
    include: { author: { select: { nickname: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  }) : [];

  const secretPosts = posts.filter(p => p.title.startsWith("[비밀]"));
  const consultPosts = posts.filter(p => p.title.startsWith("[상담]"));
  const generalPosts = posts.filter(p => !p.title.startsWith("[비밀]") && !p.title.startsWith("[상담]"));

  return (
    <>
      {/* ===== 상단 배너 ===== */}
      <div className="px-15px mt-8px space-y-6px">
        <a href="#" className="block rounded-10px overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 p-15px">
          <div className="text-white">
            <div className="font-12rg opacity-80">부동산 광고</div>
            <div className="font-16sb mt-2px">매물 등록하고 노출하세요</div>
            <div className="font-13rg opacity-70 mt-4px">월 5만원부터 시작</div>
          </div>
        </a>
        <div className="grid grid-cols-2 gap-6px">
          <a href="#" className="block rounded-10px overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 p-12px">
            <div className="text-white">
              <div className="font-12sb">🏡 매물 등록</div>
              <div className="font-10rg opacity-80 mt-2px">관리자 문의</div>
            </div>
          </a>
          <a href="#" className="block rounded-10px overflow-hidden bg-gradient-to-br from-amber-500 to-amber-700 p-12px">
            <div className="text-white">
              <div className="font-12sb">📞 전문 상담</div>
              <div className="font-10rg opacity-80 mt-2px">공인중개사 연결</div>
            </div>
          </a>
        </div>
      </div>

      {/* ===== 탭 ===== */}
      <RealEstateTabs currentTab={currentTab} />

      {currentTab === "listing" && (
        <>
          {/* 지역검색 */}
          <ListingSearch />

          {/* 매물 리스트 */}
          <ul className="mt-4px">
            {listings.map((l) => {
              const imgs: string[] = JSON.parse((l.images as string) || "[]");
              const st = STATUS_LABEL[l.status] ?? STATUS_LABEL.ACTIVE;
              return (
                <li key={l.id} className="border-b border-line-gray-20">
                  <Link href={`/board/realestate/detail/${l.id}`} className="flex gap-12px px-15px py-12px active-bg">
                    <div className="w-[80px] h-[80px] rounded-10px bg-bg-gray-50 overflow-hidden shrink-0">
                      {imgs[0] ? <img src={imgs[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4px">
                        <span className={`shrink-0 px-4px py-1px rounded font-10rg ${st.color}`}>{st.text}</span>
                        <span className="font-10rg text-font-disabled">{CATEGORY_LABEL[l.category] ?? l.category}</span>
                      </div>
                      <h3 className="font-15sb text-font-black line-clamp-1 mt-2px">{l.title}</h3>
                      <div className="font-14sb text-primary mt-2px">{l.priceType} {l.price}</div>
                      <div className="font-12rg text-font-disabled mt-2px">
                        {l.region} {l.city} {l.area && `· ${l.area}`} {l.rooms && `· ${l.rooms}`}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
            {listings.length === 0 && (
              <li className="px-15px py-40px text-center">
                <p className="font-14rg text-font-disabled">{q || region ? "검색 결과가 없습니다" : "등록된 매물이 없습니다"}</p>
              </li>
            )}
          </ul>
        </>
      )}

      {currentTab === "board" && (
        <>
          <hr className="border-line-gray-20" />
          <ul>
            {generalPosts.map((post) => <PostItem key={post.id} post={post} />)}
            {generalPosts.length === 0 && <EmptyPost />}
          </ul>
        </>
      )}

      {currentTab === "consult" && (
        <>
          <hr className="border-line-gray-20" />
          <ul>
            {consultPosts.map((post) => <PostItem key={post.id} post={post} />)}
            {consultPosts.length === 0 && <EmptyPost />}
          </ul>
        </>
      )}

      {currentTab === "secret" && (
        <>
          <hr className="border-line-gray-20" />
          <ul>
            {secretPosts.map((post) => <PostItem key={post.id} post={post} isSecret />)}
            {secretPosts.length === 0 && <EmptyPost />}
          </ul>
        </>
      )}
    </>
  );
}

function PostItem({ post, isSecret }: { post: any; isSecret?: boolean }) {
  return (
    <li className="border-b border-line-gray-20">
      <Link href={`/community/detail/${post.id}`} className="block px-15px py-12px active-bg">
        <div className="flex items-center gap-6px">
          {isSecret && <span className="shrink-0 px-6px py-1px rounded-6px bg-red-100 text-red-600 font-10rg">🔒비밀</span>}
          {post.title.startsWith("[상담]") && <span className="shrink-0 px-6px py-1px rounded-6px bg-blue-100 text-blue-600 font-10rg">💬상담</span>}
          <h3 className="font-15sb text-font-black line-clamp-1 flex-1">{post.title.replace(/^\[(비밀|상담)\]\s*/, "")}</h3>
        </div>
        <p className="font-13rg text-font-gray mt-3px line-clamp-2">{isSecret ? "비밀글입니다." : post.content}</p>
        <div className="flex items-center gap-8px mt-6px font-12rg text-font-disabled">
          <span>{post.author.nickname ?? "익명"}</span>
          <span>·</span>
          <span>조회 {post.views}</span>
          {post._count.comments > 0 && <><span>·</span><span className="text-primary">댓글 {post._count.comments}</span></>}
        </div>
      </Link>
    </li>
  );
}

function EmptyPost() {
  return (
    <li className="px-15px py-40px text-center">
      <p className="font-14rg text-font-disabled">게시글이 없습니다</p>
    </li>
  );
}
