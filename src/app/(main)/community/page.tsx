export const dynamic = "force-dynamic";
import Link from "next/link";
import { Eye, Heart, MessageSquare, Edit3, Check, Info, ChevronDown } from "lucide-react";
import { getPosts } from "@/lib/actions/posts";

type CommunityPostItem = Awaited<ReturnType<typeof getPosts>>[number];

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
  const pinnedPosts = posts.filter((p) => p.pinned); // 관리자 고정 공지
  const normalPosts = posts.filter((p) => !p.pinned);

  const categories = [
    { label: "전체", slug: undefined },
    { label: "자유", slug: "free" },
    { label: "인기", slug: "popular" },
    { label: "홍보", slug: "company" }, // 업체 → 홍보 (라벨만, 사용자 지시 2026-07-09)
    // 질문 제거 → 아래 출석체크 링크로 대체
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
        {/* 출석체크 — 질문 자리 대체, /attendance 이동 (사용자 지시 2026-07-09) */}
        <Link
          href="/attendance"
          className="shrink-0 rounded-14px px-12px h-button flex items-center gap-1.5 font-13rg border border-line-gray-50 text-font-black"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-sm">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          출석체크
        </Link>
      </div>

      {/* 커뮤니티 이용규칙 및 공지사항 — 탭 아래 접이식 안내 (사용자 지시 2026-07-10, 문구 자동생성) */}
      <details className="group mx-[15px] mt-2 rounded-xl border border-line-gray-20 bg-bg-gray-50">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-2.5 font-14sb text-font-black [&::-webkit-details-marker]:hidden">
          <Info className="h-4 w-4 text-link-blue" strokeWidth={2} />
          커뮤니티 이용규칙 및 공지사항
          <ChevronDown className="ml-auto h-4 w-4 text-font-disabled transition-transform group-open:rotate-180" strokeWidth={2} />
        </summary>
        <ul className="space-y-1 px-3 pb-3 font-12rg leading-relaxed text-font-gray">
          <li>· 서로 존중하는 매너를 지켜주세요. 욕설·비방·차별·혐오 표현은 삭제 및 이용 제한 대상입니다.</li>
          <li>· 광고·홍보·도배, 불법 정보(성매매 알선 등) 게시물은 예고 없이 삭제됩니다.</li>
          <li>· 연락처·계좌 등 개인정보를 공개적으로 게시하지 마세요.</li>
          <li>· 허위·과장 정보로 인한 거래·피해의 책임은 작성자 본인에게 있습니다.</li>
          <li>· 신고가 누적되면 글쓰기·이용이 제한될 수 있습니다.</li>
          <li className="pt-1 font-12sb text-font-black">📢 이벤트·공지는 상단 고정글을 확인해 주세요.</li>
        </ul>
      </details>

      {/* 인라인 글쓰기 버튼 숨김 → 우하단 플로팅 버튼(FAB)으로 대체 (사용자 지시 2026-07-09) */}

      {/* ===== 공지 섹션 (관리자 고정글) — 일반 게시글과 별도 (사용자 지시 2026-07-10) ===== */}
      {pinnedPosts.length > 0 && (
        <>
          <div className="flex items-center gap-1.5 px-15px pt-3 pb-1.5">
            <span className="rounded bg-link-blue px-1.5 py-0.5 font-12sb text-white">📢 공지</span>
            <span className="font-12rg text-font-disabled">관리자 공지 · 이벤트</span>
          </div>
          <ul>
            {pinnedPosts.map((post) => <PostItem key={post.id} post={post} notice />)}
          </ul>
          {/* 공지 / 일반 구분 여백 */}
          <div className="h-1.5 bg-bg-gray-50" />
        </>
      )}

      {/* ===== 일반 게시글 ===== */}
      <ul>
        {normalPosts.map((post) => <PostItem key={post.id} post={post} />)}
        {posts.length === 0 && (
          <li className="p-15px text-center font-14rg text-font-disabled">게시글이 없습니다</li>
        )}
      </ul>

      {/* 플로팅 글쓰기 버튼(FAB) — 스크롤해도 우하단 고정, 모바일 컨테이너 폭 기준 (사용자 지시 2026-07-09) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-mobile">
        <Link
          href="/community/write"
          aria-label="글쓰기"
          className="pointer-events-auto absolute bottom-[64px] right-[16px] flex h-14 w-14 items-center justify-center rounded-full bg-font-black text-white shadow-lg active:scale-95"
        >
          <Edit3 className="h-6 w-6" strokeWidth={2.2} />
        </Link>
      </div>
    </>
  );
}

/** 커뮤니티 게시글 한 줄 — notice면 파란 틴트 (공지/일반 공통) */
function PostItem({ post, notice }: { post: CommunityPostItem; notice?: boolean }) {
  return (
    <li className={`active-bg-opacity border-b border-line-gray-20 ${notice ? "bg-link-blue/5" : ""}`}>
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
            <span className="flex items-center gap-3px"><Eye className="w-3 h-3" /> {(post.views ?? 0).toLocaleString()}</span>
            <span className="flex items-center gap-3px"><Heart className="w-3 h-3" /> {post._count?.scraps ?? 0}</span>
            <span className="flex items-center gap-3px"><MessageSquare className="w-3 h-3" /> {post._count?.comments ?? 0}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
