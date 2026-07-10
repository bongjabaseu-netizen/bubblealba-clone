/** /job 지역·업종 필터 — 네이티브 select 2개를 한 줄로 (사용자 지시 2026-07-10)
 * 선택 시 /job?region=&category= 로 이동 → 서버에서 getJobs 필터 적용 */
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원"];
const CATEGORIES = [
  { id: "room", name: "룸싸롱" },
  { id: "karaoke", name: "가라오케" },
  { id: "hyperblick", name: "하이퍼블릭" },
  { id: "massage", name: "마사지" },
  { id: "bar", name: "바" },
  { id: "ten", name: "텐카페" },
  { id: "song", name: "노래주점" },
  { id: "office", name: "오피스텔" },
  { id: "etc", name: "기타" },
];

export function JobFilterSelect() {
  const router = useRouter();
  const sp = useSearchParams();
  const region = sp.get("region") ?? "";
  const category = sp.get("category") ?? "";

  function apply(key: "region" | "category", val: string) {
    const params = new URLSearchParams(sp.toString());
    if (val) params.set(key, val);
    else params.delete(key);
    const qs = params.toString();
    router.push(qs ? `/job?${qs}` : "/job");
  }

  const cls =
    "h-button flex-1 min-w-0 rounded-14px border border-line-gray-20 bg-bg-white px-12px font-14rg text-font-black";

  return (
    <div className="flex gap-8px">
      <select value={region} onChange={(e) => apply("region", e.target.value)} className={cls} aria-label="지역">
        <option value="">지역 전체</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <select value={category} onChange={(e) => apply("category", e.target.value)} className={cls} aria-label="업종">
        <option value="">업종 전체</option>
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
