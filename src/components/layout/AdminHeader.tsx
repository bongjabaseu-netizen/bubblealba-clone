"use client";

/**
 * 관리자 상단 헤더 — 현재 페이지 제목 + 날짜 부제 + 검색/알림/등록 (sample-01 헤더 재현)
 * from: admin-samples/sample-01.html (다크 네이비 헤더)
 * pathname 기반 제목 매핑이 필요해 클라이언트 컴포넌트로 분리
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { AdminSearch } from "./AdminSearch";

// 사이드바 라벨과 동일한 제목 맵 (구체 경로 우선, /admin 은 맨 뒤)
const PAGE_TITLES: { href: string; title: string }[] = [
  { href: "/admin/users", title: "회원관리" },
  { href: "/admin/jobs", title: "광고관리" },
  { href: "/admin/ad-order", title: "광고순서" },
  { href: "/admin/posts", title: "게시물관리" },
  { href: "/admin/boards", title: "게시판관리" },
  { href: "/admin/banners", title: "배너관리" },
  { href: "/admin/realestate", title: "부동산매물" },
  { href: "/admin/choicetalk", title: "초이스톡" },
  { href: "/admin/attendance", title: "출석체크" },
  { href: "/admin/reports", title: "신고처리" },
  { href: "/admin/bids", title: "입찰승인" },
  { href: "/admin/orders", title: "광고거래" },
  { href: "/admin/advertisers", title: "광고주인증" },
  { href: "/admin", title: "대시보드" },
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function AdminHeader({ pendingReports }: { pendingReports?: number }) {
  const pathname = usePathname();
  // 날짜는 클라이언트 로컬 기준으로 마운트 후 계산 (하이드레이션 불일치 방지)
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    const now = new Date();
    setDateStr(
      `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${WEEKDAYS[now.getDay()]})`
    );
  }, []);

  const currentTitle =
    PAGE_TITLES.find((p) =>
      p.href === "/admin" ? pathname === "/admin" : pathname.startsWith(p.href)
    )?.title ?? "관리자";

  return (
    <header className="h-[72px] shrink-0 flex items-center justify-between px-8 border-b border-line/70">
      <div>
        <h1 className="text-[19px] font-bold text-white tracking-tight">{currentTitle}</h1>
        <p className="text-[12px] text-mute mt-0.5">
          {dateStr && `${dateStr} · `}오늘도 명품알바를 관리해 보세요
        </p>
      </div>

      {/* 우측: 검색 · 알림 · 공고 등록 (sample-01 헤더 우측 재현) */}
      <div className="flex items-center gap-3">
        {/* 통합검색 (⌘K) — 회원·공고·광고주 실시간 검색 */}
        <AdminSearch />

        {/* 알림벨 — 신고 대기 건수 실데이터 배지, 클릭 시 신고처리로 */}
        <Link
          href="/admin/reports"
          className="relative w-9 h-9 rounded-lg bg-navy-850 border border-line flex items-center justify-center hover:border-brand/60 transition-colors"
        >
          <Bell className="w-4 h-4 text-slate-300" />
          {pendingReports !== undefined && pendingReports > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand text-navy-950 text-[10px] font-extrabold flex items-center justify-center">
              {pendingReports}
            </span>
          )}
        </Link>

        {/* 공고 등록 — 광고관리로 이동 */}
        <Link
          href="/admin/jobs"
          className="h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow flex items-center"
        >
          + 공고 등록
        </Link>
      </div>
    </header>
  );
}
