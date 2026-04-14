/** 부동산 탭 — 매물/게시판/상담문의/비밀 */
"use client";

import { useRouter } from "next/navigation";

const TABS = [
  { value: "listing", label: "🏠 매물" },
  { value: "board", label: "📋 게시판" },
  { value: "consult", label: "💬 상담문의" },
  { value: "secret", label: "🔒 비밀" },
];

export function RealEstateTabs({ currentTab }: { currentTab: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-6px px-15px mt-12px mb-8px overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => router.push(`/board/realestate?tab=${tab.value}`)}
          className={`shrink-0 rounded-14px px-12px h-button font-13rg ${
            currentTab === tab.value
              ? "bg-font-black text-bg-white"
              : "border border-line-gray-50 text-font-black"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
