/** 부동산 매물 검색 — 지역 + 카테고리 + 텍스트 */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const REGIONS = ["전체", "서울", "경기", "부산", "대구", "인천", "광주", "대전", "울산", "제주"];
const CATEGORIES = [
  { value: "", label: "전체" },
  { value: "ONEROOM", label: "원룸" },
  { value: "TWOROOM", label: "투룸" },
  { value: "THREEROOM", label: "쓰리룸" },
  { value: "OFFICETEL", label: "오피스텔" },
  { value: "APT", label: "아파트" },
  { value: "VILLA", label: "빌라" },
  { value: "STORE", label: "상가" },
];

export function ListingSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function applyFilter(key: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    sp.set("tab", "listing");
    if (value && value !== "전체") sp.set(key, value);
    else sp.delete(key);
    router.push(`/board/realestate?${sp.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilter("q", q);
  }

  return (
    <div className="px-15px space-y-6px">
      {/* 지역 + 카테고리 */}
      <div className="flex gap-6px">
        <select
          defaultValue={params.get("region") ?? "전체"}
          onChange={e => applyFilter("region", e.target.value)}
          className="flex-1 h-button rounded-10px border border-line-gray-50 px-10px font-13rg text-font-black bg-transparent"
        >
          {REGIONS.map(r => <option key={r} value={r}>{r === "전체" ? "지역 전체" : r}</option>)}
        </select>
        <select
          defaultValue={params.get("category") ?? ""}
          onChange={e => applyFilter("category", e.target.value)}
          className="flex-1 h-button rounded-10px border border-line-gray-50 px-10px font-13rg text-font-black bg-transparent"
        >
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      {/* 텍스트 검색 */}
      <form onSubmit={handleSearch} className="flex items-center gap-6px rounded-10px border border-line-gray-50 px-10px h-button">
        <svg className="w-4 h-4 text-font-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="주소, 제목 검색"
          className="flex-1 bg-transparent font-13rg text-font-black placeholder:text-font-disabled outline-none"
        />
      </form>
    </div>
  );
}
