"use client";

/**
 * 관리자 사이드바 — 섹션 그룹핑 + 대기건수 배지 + 프로필 칩
 * from: admin-samples/sample-01.html (다크 네이비 + 오렌지 brand)
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  MessageCircle,
  Building2,
  Image,
  Flag,
  Layers,
  ArrowUpDown,
  CalendarCheck,
  ExternalLink,
  LogOut,
  Gavel,
  CreditCard,
  ShieldCheck,
  Dog,
  Scale,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

/** 네비 항목 1개 */
type NavItem = { href: string; label: string; icon: LucideIcon };
/** 라벨로 묶은 섹션 */
type NavGroup = { label: string; items: NavItem[] };

// 대시보드는 단독(맨 위), 나머지는 섹션 그룹핑 — 기존 11개 메뉴 전부 유지
const DASHBOARD: NavItem = { href: "/admin", label: "대시보드", icon: LayoutDashboard };
const NAV_GROUPS: NavGroup[] = [
  {
    label: "광고 · 수익",
    items: [
      { href: "/admin/jobs", label: "광고관리", icon: Briefcase },
      { href: "/admin/ad-order", label: "광고순서", icon: ArrowUpDown },
      { href: "/admin/banners", label: "배너관리", icon: Image },
      { href: "/admin/bids", label: "입찰승인", icon: Gavel },
      { href: "/admin/orders", label: "광고거래", icon: CreditCard },
      { href: "/admin/advertisers", label: "광고주인증", icon: ShieldCheck },
    ],
  },
  {
    label: "회원",
    items: [{ href: "/admin/users", label: "회원관리", icon: Users }],
  },
  {
    label: "콘텐츠",
    items: [
      { href: "/admin/posts", label: "게시물관리", icon: MessageSquare },
      { href: "/admin/boards", label: "게시판관리", icon: Layers },
      { href: "/admin/realestate", label: "부동산매물", icon: Building2 },
      { href: "/admin/choicetalk", label: "초이스톡", icon: MessageCircle },
    ],
  },
  {
    label: "게시판별 관리",
    items: [
      { href: "/admin/board/pets", label: "애견자랑 관리", icon: Dog },
      { href: "/admin/board/legal-consult", label: "법률상담 관리", icon: Scale },
      { href: "/admin/legal-consult", label: "법률상담 답변", icon: Gavel },
      { href: "/admin/board/beauty", label: "미용 관리", icon: Scissors },
      { href: "/admin/board/fortune", label: "운세 관리", icon: Sparkles },
    ],
  },
  {
    label: "운영",
    items: [
      { href: "/admin/attendance", label: "출석체크", icon: CalendarCheck },
      { href: "/admin/reports", label: "신고처리", icon: Flag },
    ],
  },
];

type AdminSidebarProps = {
  nickname?: string;
  email?: string;
  /** 신고 대기 건수 — 0/undefined 면 배지 숨김 */
  pendingReports?: number;
  /** 역할 — LAWYER 면 법률상담 답변 메뉴만 노출 */
  role?: string;
};

export function AdminSidebar({
  nickname = "관리자",
  email,
  pendingReports,
  role,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // 활성 여부: /admin 은 정확 매칭, 나머지는 prefix 매칭
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // 항목 1개 렌더 (단독/그룹 공용)
  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    // 신고처리에만 대기건수 배지
    const badge =
      item.href === "/admin/reports" && pendingReports && pendingReports > 0
        ? pendingReports
        : null;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`relative flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
          active
            ? "bg-gradient-to-r from-brand/15 to-brand/5 text-white font-semibold"
            : "text-slate-300 hover:bg-navy-800/60"
        }`}
      >
        {/* active 좌측 3px 바 */}
        {active && (
          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-[3px] bg-brand" />
        )}
        <span className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${active ? "text-brand" : "text-mute"}`} />
          {item.label}
        </span>
        {badge !== null && (
          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-extrabold flex items-center justify-center">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // 아바타 이니셜 (닉네임 첫 글자)
  const initial = (nickname ?? "관").trim().charAt(0) || "관";

  return (
    <aside className="w-[248px] shrink-0 bg-navy-900/90 border-r border-line min-h-screen flex flex-col">
      {/* 로고 — 크라운 (gold→brand) */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-line">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-brand flex items-center justify-center shadow-glow">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-navy-950" fill="currentColor">
            <path d="M2.6 18 4.3 7.6l4.5 4.4L12 5l3.2 7 4.5-4.4L21.4 18Z" />
            <rect x="3.6" y="19.2" width="16.8" height="2" rx="1" />
          </svg>
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-white leading-none">
            명품알바
          </div>
          <div className="text-[10px] tracking-[.22em] text-gold mt-1">PREMIUM ALBA</div>
        </div>
      </div>

      {/* 메뉴 — LAWYER(법률상담 전용 관리자)는 답변 메뉴만, 그 외 관리자는 전체 */}
      <nav className="flex-1 px-3 py-4 space-y-4 text-[13.5px] overflow-y-auto">
        {role === "LAWYER" ? (
          renderItem({ href: "/admin/legal-consult", label: "법률상담 답변", icon: Gavel })
        ) : (
          <>
            {/* 대시보드 (단독) */}
            {renderItem(DASHBOARD)}

            {/* 섹션 그룹 */}
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-3 mb-1.5 text-[10.5px] font-bold tracking-[.18em] text-mute/80">
                  {group.label}
                </div>
                <div className="space-y-0.5">{group.items.map(renderItem)}</div>
              </div>
            ))}
          </>
        )}
      </nav>

      {/* 하단: 사이트 보기 링크 + 관리자 프로필 칩 */}
      <div className="p-3 border-t border-line space-y-2">
        <a
          href="/"
          className="flex items-center gap-2 px-3 text-[12px] text-mute hover:text-slate-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          사이트 보기
        </a>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-navy-850 border border-line">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-gold text-navy-950 font-extrabold text-[12px] flex items-center justify-center shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">{nickname}</div>
            {email && <div className="text-[11px] text-mute truncate">{email}</div>}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-mute hover:text-brand transition-colors shrink-0"
            aria-label="로그아웃"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
