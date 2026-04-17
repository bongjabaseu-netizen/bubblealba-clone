"use client";

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
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/users", label: "회원관리", icon: Users },
  { href: "/admin/jobs", label: "광고관리", icon: Briefcase },
  { href: "/admin/ad-order", label: "광고순서", icon: ArrowUpDown },
  { href: "/admin/posts", label: "게시물관리", icon: MessageSquare },
  { href: "/admin/boards", label: "게시판관리", icon: Layers },
  { href: "/admin/banners", label: "배너관리", icon: Image },
  { href: "/admin/realestate", label: "부동산매물", icon: Building2 },
  { href: "/admin/choicetalk", label: "초이스톡", icon: MessageCircle },
  { href: "/admin/attendance", label: "출석체크", icon: CalendarCheck },
  { href: "/admin/reports", label: "신고처리", icon: Flag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-slate-300 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
          B
        </div>
        <div>
          <div className="text-sm font-bold text-white">버블알바</div>
          <div className="text-[10px] text-slate-400 leading-none">관리자 콘솔</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-800 text-white border-l-[3px] border-orange-500 pl-[9px]"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-800 flex flex-col gap-1">
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-800/60 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          사이트 보기
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-800/60 hover:text-white transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
