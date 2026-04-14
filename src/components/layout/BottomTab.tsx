"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, PlusCircle, Bell, User } from "lucide-react";
import { NotificationBadge } from "./NotificationBadge";

const TABS = [
  { href: "/", icon: Home, label: "홈", matchPrefix: ["/", "/job"] },
  { href: "/community", icon: ClipboardList, label: "커뮤니티", matchPrefix: ["/community"] },
  { href: "/community/write", icon: PlusCircle, label: "글쓰기", matchPrefix: ["/community/write"] },
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
              className="group relative flex h-48px flex-1 items-center justify-center active-bg"
              aria-label={`go ${tab.label}`}
            >
              <div className="relative">
                <Icon
                  className={
                    active
                      ? "h-7 w-7 fill-font-black stroke-font-black"
                      : "h-7 w-7 stroke-font-black"
                  }
                  strokeWidth={1.8}
                />
                {tab.href === "/notification" && <NotificationBadge />}
              </div>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
