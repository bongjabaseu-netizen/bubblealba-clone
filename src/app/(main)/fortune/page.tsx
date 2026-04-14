/** 운세 페이지 — 4개 탭 (사주/관상/별자리/손금)
 *  URL: /fortune?tab=saju|face|zodiac|palm
 */
"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SajuFortune } from "./SajuFortune";
import { FaceReading } from "./FaceReading";
import { ZodiacFortune } from "./ZodiacFortune";
import { PalmReading } from "./PalmReading";
import { FortuneShops } from "./FortuneShops";

/* ─── 탭 정의 ─── */
type TabId = "saju" | "face" | "zodiac" | "palm" | "shops";

interface Tab {
  id: TabId;
  emoji: string;
  label: string;
}

const TABS: Tab[] = [
  { id: "saju",   emoji: "🔮", label: "사주운세" },
  { id: "face",   emoji: "👤", label: "관상" },
  { id: "zodiac", emoji: "⭐", label: "별자리" },
  { id: "palm",   emoji: "🤚", label: "손금" },
  { id: "shops",  emoji: "🏠", label: "점집" },
];

function isValidTab(v: string | null): v is TabId {
  return v === "saju" || v === "face" || v === "zodiac" || v === "palm" || v === "shops";
}

/* ─── 탭 내부 (useSearchParams 사용) ─── */
function FortuneTabContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramTab = searchParams.get("tab");
  const activeTab: TabId = isValidTab(paramTab) ? paramTab : "saju";

  const handleTabChange = useCallback((tabId: TabId) => {
    router.replace(`/fortune?tab=${tabId}`, { scroll: false });
  }, [router]);

  return (
    <>
      {/* 탭 바 */}
      <div className="sticky top-0 z-10 bg-bg-white border-b border-line-gray-20">
        <div className="flex">
          {TABS.map(tab => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center py-10px transition-colors ${
                  isActive
                    ? "text-font-black border-b-2 border-purple-500"
                    : "text-font-gray"
                }`}
              >
                <span className="text-lg leading-none">{tab.emoji}</span>
                <span className={`mt-2px ${isActive ? "font-13sb" : "font-12rg"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "saju" && <SajuFortune />}
      {activeTab === "face" && <FaceReading />}
      {activeTab === "zodiac" && <ZodiacFortune />}
      {activeTab === "palm" && <PalmReading />}
      {activeTab === "shops" && <FortuneShops />}
    </>
  );
}

/* ─── 페이지 (Suspense 래핑) ─── */
export default function FortunePage() {
  return (
    <Suspense>
      <FortuneTabContent />
    </Suspense>
  );
}
