/** 미용 탭 — 미용실/네일아트/성형 */
"use client";

import { useRouter } from "next/navigation";

const TABS = [
  { value: "salon", emoji: "💇", label: "미용실" },
  { value: "nail", emoji: "💅", label: "네일아트" },
  { value: "surgery", emoji: "🏥", label: "성형" },
];

export function BeautyTabs({ currentTab }: { currentTab: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-6px px-15px mt-12px overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => router.push(`/board/beauty?tab=${tab.value}`)}
          className={`shrink-0 rounded-14px px-12px h-button font-13rg flex items-center gap-4px ${
            currentTab === tab.value
              ? "bg-font-black text-bg-white"
              : "border border-line-gray-50 text-font-black"
          }`}
        >
          {tab.emoji} {tab.label}
        </button>
      ))}
    </div>
  );
}
