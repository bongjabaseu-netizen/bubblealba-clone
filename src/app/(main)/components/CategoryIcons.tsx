/** 카테고리 바로가기 아이콘 — 현재 페이지에 따라 동적 구성 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ALL_CATEGORIES = [
  { href: "/", icon: "💼", label: "구인구직" },
  { href: "/board/realestate", icon: "🏠", label: "부동산" },
  { href: "/board/legal-consult", icon: "⚖️", label: "법률상담" },
  { href: "/board/pets", icon: "🐶", label: "애견자랑" },
  { href: "/board/beauty", icon: "💇", label: "미용" },
  { href: "/fortune", icon: "🔮", label: "운세" },
];

export function CategoryIcons() {
  const pathname = usePathname();

  // 현재 페이지와 같은 카테고리는 제외
  const filtered = ALL_CATEGORIES.filter((c) => {
    if (c.href === "/") return pathname !== "/";
    return !pathname.startsWith(c.href);
  });

  return (
    <div className="flex items-center justify-around px-15px py-12px border-b border-line-gray-20">
      {filtered.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="flex flex-col items-center gap-4px active-bg px-8px py-4px rounded-10px"
        >
          <div className="w-12 h-12 rounded-full bg-bg-gray-50 flex items-center justify-center text-2xl">
            {c.icon}
          </div>
          <span className="font-12rg text-font-black">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
