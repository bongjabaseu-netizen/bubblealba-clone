/** 광고주 사이드바 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gavel, MessageCircle, ExternalLink, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/advertiser", label: "대시보드", icon: LayoutDashboard },
  { href: "/advertiser/bid", label: "광고 입찰", icon: Gavel },
  { href: "/advertiser/choicetalk", label: "초이스톡", icon: MessageCircle },
];

export function AdvertiserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-slate-300 min-h-screen flex flex-col">
      <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-full overflow-hidden"><img src="/logo/logo-main.png" alt="명품알바" className="w-full h-full object-cover" /></div>
        <div>
          <div className="text-sm font-bold text-white">명품알바</div>
          <div className="text-[10px] text-slate-400 leading-none">광고주 센터</div>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/advertiser" ? pathname === "/advertiser" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-slate-800 text-white border-l-[3px] border-orange-500 pl-[9px]" : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 flex flex-col gap-1">
        <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-800/60 hover:text-white transition-colors">
          <ExternalLink className="w-4 h-4" />사이트 보기
        </a>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-800/60 hover:text-white transition-colors w-full text-left">
          <LogOut className="w-4 h-4" />로그아웃
        </button>
      </div>
    </aside>
  );
}
