/** 애견자랑 공지사항 — 애견 게시판 pinned 글(=공지) 목록 + 관리자 등록/삭제 (사용자 지시 2026-07-10) */
export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PetNoticeForm, NoticeDeleteButton } from "./PetNoticeAdmin";

function fmtDate(d: Date): string {
  return new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default async function PetsNoticePage() {
  const board = await prisma.board.findUnique({ where: { slug: "pets" } });
  if (!board) notFound();

  const notices = await prisma.communityPost.findMany({
    where: { boardId: board.id, pinned: true }, // pinned = 공지
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nickname: true } } },
  });

  const session = await auth();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";

  return (
    <div className="pb-20px">
      {/* 빵부스러기 */}
      <nav className="px-15px py-10px flex items-center gap-4px font-12rg text-font-gray">
        <Link href="/board/pets" className="text-font-gray">애견자랑</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-font-black">공지사항</span>
      </nav>

      {/* 헤더 */}
      <div className="px-15px">
        <h1 className="font-18sb text-font-black flex items-center gap-6px">📢 애견자랑 공지사항</h1>
        <p className="font-13rg text-font-gray mt-4px">애견자랑 게시판 운영 공지·이벤트 안내</p>
      </div>

      {/* 관리자 공지 등록 폼 */}
      {isAdmin && <PetNoticeForm boardSlug="pets" />}

      {/* 공지 목록 */}
      <ul className="mt-12px">
        {notices.length === 0 ? (
          <li className="px-15px py-40px text-center font-14rg text-font-disabled">등록된 공지사항이 없습니다</li>
        ) : (
          notices.map((n) => (
            <li key={n.id} className="border-b border-line-gray-20 px-15px py-14px">
              <div className="flex items-center gap-6px mb-4px">
                <span className="shrink-0 rounded bg-link-blue px-6px py-1px font-11rg text-white">공지</span>
                <h3 className="font-15sb text-font-black flex-1 truncate">{n.title}</h3>
              </div>
              <p className="font-13rg text-font-gray whitespace-pre-line">{n.content}</p>
              <div className="flex items-center justify-between mt-8px">
                <span className="font-12rg text-font-disabled">{n.author?.nickname ?? "관리자"} · {fmtDate(n.createdAt)}</span>
                {isAdmin && <NoticeDeleteButton id={n.id} boardSlug="pets" />}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
