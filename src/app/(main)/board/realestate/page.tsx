/** 부동산 매물 — 다방 스타일 심플 리스트 → 클릭 시 상세. 매물 등록은 관리자 전용
 * 목록은 REST API(/api/realestate) 페이지네이션+더보기로 로드 (사용자 지시 2026-07-11, 확장성) */
export const dynamic = "force-dynamic";
import Link from "next/link";
import { RealEstateList } from "./RealEstateList";

// 카테고리 필터 칩 (전체 + 주요 8종)
const CATS: [string, string][] = [
  ["", "전체"], ["ONEROOM", "원룸"], ["TWOROOM", "투룸"], ["THREEROOM", "쓰리룸"],
  ["OFFICETEL", "오피스텔"], ["APT", "아파트"], ["VILLA", "빌라"], ["STORE", "상가"],
];

export default async function RealEstateBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const cur = category ?? "";

  return (
    <div className="pb-16px">
      {/* 헤더 */}
      <div className="px-15px pt-14px pb-6px">
        <h1 className="font-18sb text-font-black">부동산 매물</h1>
      </div>

      {/* 카테고리 필터 칩 */}
      <div className="flex gap-6px overflow-x-auto px-15px pb-12px">
        {CATS.map(([val, label]) => (
          <Link
            key={val || "all"}
            href={val ? `/board/realestate?category=${val}` : "/board/realestate"}
            className={`shrink-0 px-12px h-[32px] inline-flex items-center rounded-full font-12sb transition-colors ${
              cur === val ? "bg-font-black text-white" : "bg-bg-gray-50 text-font-gray"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* 매물 리스트 — API 페이지네이션 + 더보기 */}
      <RealEstateList category={cur} />
    </div>
  );
}
