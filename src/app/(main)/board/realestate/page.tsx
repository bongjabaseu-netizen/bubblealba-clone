/** 부동산 매물 — 다방 스타일 심플 리스트(지도X, 가운데 카드) → 클릭 시 상세. 매물 등록은 관리자 전용
 * from: 사용자 지시 2026-07-11 (dabangapp 참조, 지도 제거·간단 표시·클릭 상세) */
export const dynamic = "force-dynamic";
import Link from "next/link";
import { getListings } from "@/lib/actions/realestate";

const CATEGORY_LABEL: Record<string, string> = {
  ONEROOM: "원룸", TWOROOM: "투룸", THREEROOM: "쓰리룸",
  OFFICETEL: "오피스텔", APT: "아파트", VILLA: "빌라",
  STORE: "상가", ETC: "기타",
};

// 카테고리 필터 칩 (전체 + 주요 8종)
const CATS: [string, string][] = [
  ["", "전체"], ["ONEROOM", "원룸"], ["TWOROOM", "투룸"], ["THREEROOM", "쓰리룸"],
  ["OFFICETEL", "오피스텔"], ["APT", "아파트"], ["VILLA", "빌라"], ["STORE", "상가"],
];

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  ACTIVE: { text: "등록중", color: "bg-green-100 text-green-700" },
  RESERVED: { text: "예약중", color: "bg-yellow-100 text-yellow-700" },
  CLOSED: { text: "거래완료", color: "bg-slate-100 text-slate-500" },
};

export default async function RealEstateBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const listings = await getListings({ category });
  const cur = category ?? "";

  return (
    <div className="pb-16px">
      {/* 헤더 */}
      <div className="px-15px pt-14px pb-6px">
        <h1 className="font-18sb text-font-black">부동산 매물</h1>
        <p className="font-12rg text-font-gray mt-2px">등록된 매물 {listings.length}건 · 눌러서 상세보기</p>
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

      {/* 매물 카드 리스트 — 사진 좌측 + 가격 강조, 클릭 시 상세 */}
      <ul className="px-15px space-y-10px">
        {listings.map((l) => {
          const imgs: string[] = (() => { try { return JSON.parse((l.images as string) || "[]"); } catch { return []; } })();
          const st = STATUS_LABEL[l.status] ?? STATUS_LABEL.ACTIVE;
          const specs = [l.area, l.rooms, l.floor].filter(Boolean).join(" · ");
          return (
            <li key={l.id}>
              <Link
                href={`/board/realestate/detail/${l.id}`}
                className="flex gap-12px rounded-14px border border-line-gray-20 p-10px active-bg"
              >
                <div className="w-[108px] h-[108px] rounded-10px bg-bg-gray-50 overflow-hidden shrink-0">
                  {imgs[0] ? (
                    <img src={imgs[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-2px">
                  <div className="flex items-center gap-4px">
                    <span className={`shrink-0 px-5px py-1px rounded font-10rg ${st.color}`}>{st.text}</span>
                    <span className="font-11rg text-font-disabled">{CATEGORY_LABEL[l.category] ?? l.category}</span>
                  </div>
                  <div className="font-16sb text-font-black mt-4px truncate">
                    {l.priceType} <span className="text-primary">{l.price}</span>
                  </div>
                  {l.deposit && <div className="font-12rg text-font-gray mt-1px">보증금 {l.deposit}</div>}
                  {specs && <div className="font-12rg text-font-gray mt-3px line-clamp-1">{specs}</div>}
                  <div className="font-12rg text-font-disabled mt-1px line-clamp-1">
                    {l.region} {l.city}{l.address ? ` · ${l.address}` : ""}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}

        {listings.length === 0 && (
          <li className="px-15px py-44px text-center">
            <div className="text-4xl mb-10px">🏠</div>
            <p className="font-14rg text-font-disabled">
              {cur ? "해당 조건의 매물이 없습니다" : "등록된 매물이 없습니다"}
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}
