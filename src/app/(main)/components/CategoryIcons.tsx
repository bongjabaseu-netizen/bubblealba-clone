/** 카테고리 바로가기 — 현재 페이지에 따라 동적 구성.
 * lucide 라인 아이콘 + 검정 원형칩 + 흰색 아이콘 통일 (사용자 지시 2026-07-11, 모노톤 통일) */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, Scale, Dog, Scissors, Sparkles, type LucideIcon } from "lucide-react";

type Category = { href: string; Icon: LucideIcon; label: string };

const ALL_CATEGORIES: Category[] = [
  { href: "/", Icon: Briefcase, label: "구인구직" },
  { href: "/board/realestate", Icon: Home, label: "부동산" },
  { href: "/board/legal-consult", Icon: Scale, label: "법률상담" },
  { href: "/board/pets", Icon: Dog, label: "애견자랑" },
  { href: "/board/beauty", Icon: Scissors, label: "미용" },
  { href: "/fortune", Icon: Sparkles, label: "운세" },
];

export function CategoryIcons() {
  const pathname = usePathname();

  // 검정 카테고리 스트립을 메인 카테고리 페이지 전체에 통일 노출 (사용자 지시 2026-07-11 "다 바꿔줘")
  // 구인구직/모든 게시판/운세/커뮤니티/초이스톡. 상세·작성 등 하위 페이지는 제외
  const SHOW_ON = ["/job", "/board", "/fortune", "/community", "/choicetalk"];
  if (pathname.includes("/detail") || pathname.includes("/write")) return null;
  if (!SHOW_ON.some((p) => pathname.startsWith(p))) return null;

  // 현재 페이지와 같은 카테고리는 제외
  const filtered = ALL_CATEGORIES.filter((c) => {
    if (c.href === "/") return pathname !== "/";
    return !pathname.startsWith(c.href);
  });

  return (
    <div className="flex items-center justify-around px-15px py-12px border-b border-line-gray-20">
      {filtered.map(({ href, Icon, label }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-6px active-bg px-8px py-4px rounded-12px"
        >
          {/* 검정 원형 + 흰색 아이콘 통일 */}
          <div className="w-12 h-12 rounded-full bg-font-black flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
          </div>
          <span className="font-12rg text-font-black">{label}</span>
        </Link>
      ))}
    </div>
  );
}
