"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, LayoutGrid, Bell, User } from "lucide-react";
import { NotificationBadge } from "./NotificationBadge";

// 5탭: 홈/커뮤니티/콘텐츠(가운데)/알림/내정보 — 콘텐츠는 애견분양 게시판이 메인 (사용자 지시 2026-07-10, 통합 때 빠진 콘텐츠 탭 복원)
const TABS = [
  { href: "/", icon: Home, label: "홈", matchPrefix: ["/", "/job"] },
  { href: "/community", icon: Users, label: "커뮤니티", matchPrefix: ["/community"] },
  { href: "/board/pets", icon: LayoutGrid, label: "콘텐츠", matchPrefix: ["/board", "/fortune", "/choicetalk"] },
  { href: "/notification", icon: Bell, label: "알림", matchPrefix: ["/notification"] },
  { href: "/mypage", icon: User, label: "내정보", matchPrefix: ["/mypage"] },
];

function isActive(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => {
    if (p === "/") return pathname === "/" || pathname.startsWith("/job");
    return pathname === p || pathname.startsWith(p + "/");
  });
}

export function BottomTab() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex min-h-footer max-w-mobile items-center justify-center border-t border-line-gray-20 bg-bg-white pb-[env(safe-area-inset-bottom)]">
      <nav className="flex w-full items-center" aria-label="하단 탭 내비게이션">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(pathname, tab.matchPrefix);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="group relative flex h-[52px] flex-1 flex-col items-center justify-center gap-[2px] active-bg"
              aria-label={`go ${tab.label}`}
            >
              <div className="relative">
                <Icon
                  className={
                    active
                      ? "h-6 w-6 fill-font-black stroke-font-black"
                      : "h-6 w-6 stroke-font-black"
                  }
                  strokeWidth={1.8}
                />
                {tab.href === "/notification" && <NotificationBadge />}
              </div>
              {/* 아이콘 밑 라벨 — 어디로 가는지 표기 (사용자 지시 2026-07-09) */}
              <span className={active ? "text-[10px] leading-none font-semibold text-font-black" : "text-[10px] leading-none text-font-gray"}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
