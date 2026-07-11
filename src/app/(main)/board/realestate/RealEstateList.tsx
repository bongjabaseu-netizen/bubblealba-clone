/** 부동산 매물 리스트 — REST API(/api/realestate) 페이지네이션 + 더보기 (사용자 지시 2026-07-11, 확장성)
 * 매물이 많아져도 전량 로드하지 않고 12개씩 불러온다. 카테고리 변경 시 초기화 */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const CATEGORY_LABEL: Record<string, string> = {
  ONEROOM: "원룸", TWOROOM: "투룸", THREEROOM: "쓰리룸",
  OFFICETEL: "오피스텔", APT: "아파트", VILLA: "빌라",
  STORE: "상가", ETC: "기타",
};
const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  ACTIVE: { text: "등록중", color: "bg-green-100 text-green-700" },
  RESERVED: { text: "예약중", color: "bg-yellow-100 text-yellow-700" },
  CLOSED: { text: "거래완료", color: "bg-slate-100 text-slate-500" },
};

type Listing = {
  id: string; title: string; price: string; priceType: string; deposit: string | null;
  area: string | null; rooms: string | null; floor: string | null; images: string;
  region: string; city: string; address: string | null; category: string; status: string;
};

const PAGE_SIZE = 12;

export function RealEstateList({ category }: { category: string }) {
  const [items, setItems] = useState<Listing[]>([]);
  const [page, setPage] = useState(0); // 0 = 아직 로드 안 함
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (nextPage: number, reset: boolean) => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(nextPage), pageSize: String(PAGE_SIZE) });
      if (category) params.set("category", category);
      try {
        const res = await fetch(`/api/realestate?${params}`);
        const data = await res.json();
        setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(nextPage);
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  // 카테고리 변경 시 1페이지부터 다시
  useEffect(() => {
    load(1, true);
  }, [load]);

  return (
    <>
      <p className="px-15px pb-6px font-12rg text-font-gray">
        {page === 0 ? "불러오는 중…" : `등록된 매물 ${total}건 · 눌러서 상세보기`}
      </p>

      <ul className="px-15px space-y-10px">
        {items.map((l) => {
          const imgs: string[] = (() => { try { return JSON.parse(l.images || "[]"); } catch { return []; } })();
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

        {page > 0 && items.length === 0 && (
          <li className="px-15px py-44px text-center">
            <div className="text-4xl mb-10px">🏠</div>
            <p className="font-14rg text-font-disabled">
              {category ? "해당 조건의 매물이 없습니다" : "등록된 매물이 없습니다"}
            </p>
          </li>
        )}
      </ul>

      {hasMore && (
        <div className="px-15px mt-12px">
          <button
            type="button"
            onClick={() => load(page + 1, false)}
            disabled={loading}
            className="w-full h-button rounded-12px border border-line-gray-50 font-14sb text-font-black active-bg disabled:opacity-50"
          >
            {loading ? "불러오는 중…" : `더보기 (${items.length}/${total})`}
          </button>
        </div>
      )}
    </>
  );
}
