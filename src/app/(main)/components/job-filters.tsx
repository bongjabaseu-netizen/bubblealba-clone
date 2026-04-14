"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";

const REGIONS = [
  "전체", "서울", "경기", "인천", "부산", "대구", "광주", "대전",
  "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

const CITIES: Record<string, string[]> = {
  서울: ["전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  경기: ["전체", "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시", "광명시", "김포시"],
  부산: ["전체", "해운대구", "부산진구", "동래구", "남구", "북구", "사하구", "금정구", "연제구", "수영구", "사상구"],
  대전: ["전체", "서구", "유성구", "중구", "동구", "대덕구"],
  인천: ["전체", "남동구", "부평구", "서구", "미추홀구", "연수구", "계양구"],
};

const CATEGORIES = [
  { id: "전체", name: "전체" },
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

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRegion = searchParams.get("region") ?? "전체";
  const currentCity = searchParams.get("city") ?? "전체";
  const currentCategory = searchParams.get("category") ?? "전체";
  const currentQuery = searchParams.get("q") ?? "";

  const [regionOpen, setRegionOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchText, setSearchText] = useState(currentQuery);

  const regionRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
        setCityOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function applyFilter(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === "전체" || v === "") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilter({ q: searchText });
  }

  const regionLabel = currentRegion === "전체" ? "전체" : `${currentRegion} ${currentCity === "전체" ? "" : currentCity}`.trim();
  const categoryLabel = CATEGORIES.find((c) => c.id === currentCategory)?.name ?? "전체";

  return (
    <>
      {/* 지역/직종 드롭다운 */}
      <div className="mt-20px flex gap-8px px-15px">
        {/* 지역 */}
        <div className="relative flex-1" ref={regionRef}>
          <button
            type="button"
            onClick={() => { setRegionOpen(!regionOpen); setCategoryOpen(false); }}
            className="active-bg flex h-button w-full items-center justify-between gap-6px rounded-14px border border-line-gray-50 px-12px font-15rg text-font-black"
          >
            <div className="flex items-center gap-6px">
              <span className="font-13rg text-font-gray">지역</span>
              <span className="truncate">{regionLabel}</span>
            </div>
            <ChevronDown className={`h-18px w-18px text-font-black transition-transform ${regionOpen ? "rotate-180" : ""}`} strokeWidth={2} />
          </button>

          {regionOpen && !cityOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-4px max-h-300px overflow-y-auto rounded-10px border border-line-gray-50 bg-bg-white shadow-lg">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    if (r === "전체") {
                      applyFilter({ region: "전체", city: "전체" });
                      setRegionOpen(false);
                    } else if (CITIES[r]) {
                      setCityOpen(true);
                      applyFilter({ region: r, city: "전체" });
                    } else {
                      applyFilter({ region: r, city: "전체" });
                      setRegionOpen(false);
                    }
                  }}
                  className={`active-bg flex w-full items-center justify-between px-15px h-44px font-14rg ${
                    currentRegion === r ? "text-warn-red font-14sb" : "text-font-black"
                  }`}
                >
                  {r}
                  {CITIES[r] && <ChevronDown className="h-12px w-12px text-font-disabled -rotate-90" />}
                </button>
              ))}
            </div>
          )}

          {regionOpen && cityOpen && CITIES[currentRegion] && (
            <div className="absolute top-full left-0 right-0 z-50 mt-4px max-h-300px overflow-y-auto rounded-10px border border-line-gray-50 bg-bg-white shadow-lg">
              <button
                type="button"
                onClick={() => setCityOpen(false)}
                className="active-bg flex w-full items-center gap-5px px-15px h-44px font-14sb text-font-gray border-b border-line-gray-20"
              >
                ← {currentRegion}
              </button>
              {CITIES[currentRegion].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    applyFilter({ region: currentRegion, city: c });
                    setRegionOpen(false);
                    setCityOpen(false);
                  }}
                  className={`active-bg flex w-full items-center px-15px h-44px font-14rg ${
                    currentCity === c ? "text-warn-red font-14sb" : "text-font-black"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 직종 */}
        <div className="relative flex-1" ref={categoryRef}>
          <button
            type="button"
            onClick={() => { setCategoryOpen(!categoryOpen); setRegionOpen(false); }}
            className="active-bg flex h-button w-full items-center justify-between gap-6px rounded-14px border border-line-gray-50 px-12px font-15rg text-font-black"
          >
            <div className="flex items-center gap-6px">
              <span className="font-13rg text-font-gray">직종</span>
              <span className="truncate">{categoryLabel}</span>
            </div>
            <ChevronDown className={`h-18px w-18px text-font-black transition-transform ${categoryOpen ? "rotate-180" : ""}`} strokeWidth={2} />
          </button>

          {categoryOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-4px max-h-300px overflow-y-auto rounded-10px border border-line-gray-50 bg-bg-white shadow-lg">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    applyFilter({ category: c.id });
                    setCategoryOpen(false);
                  }}
                  className={`active-bg flex w-full items-center px-15px h-44px font-14rg ${
                    currentCategory === c.id ? "text-warn-red font-14sb" : "text-font-black"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 검색바 */}
      <form onSubmit={handleSearch} className="mt-12px px-15px">
        <div className="flex h-button w-full items-center gap-5px rounded-14px border border-line-gray-50 bg-bg-white px-12px font-15rg">
          <Search className="h-18px w-18px text-font-disabled" strokeWidth={2} />
          <input
            type="search"
            placeholder="채용정보 검색"
            maxLength={24}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-transparent outline-none font-15rg text-font-black placeholder:text-font-disabled"
          />
          {searchText && (
            <button type="button" onClick={() => { setSearchText(""); applyFilter({ q: "" }); }}>
              <X className="h-18px w-18px text-font-disabled" />
            </button>
          )}
        </div>
      </form>

      {/* 활성 필터 표시 */}
      {(currentRegion !== "전체" || currentCategory !== "전체" || currentQuery) && (
        <div className="flex flex-wrap gap-5px px-15px mt-8px">
          {currentRegion !== "전체" && (
            <span className="flex items-center gap-3px rounded-6px bg-bg-gray-50 px-8px py-3px font-12rg text-font-gray">
              {regionLabel}
              <button onClick={() => applyFilter({ region: "전체", city: "전체" })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {currentCategory !== "전체" && (
            <span className="flex items-center gap-3px rounded-6px bg-bg-gray-50 px-8px py-3px font-12rg text-font-gray">
              {categoryLabel}
              <button onClick={() => applyFilter({ category: "전체" })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {currentQuery && (
            <span className="flex items-center gap-3px rounded-6px bg-bg-gray-50 px-8px py-3px font-12rg text-font-gray">
              &quot;{currentQuery}&quot;
              <button onClick={() => { setSearchText(""); applyFilter({ q: "" }); }}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={() => { setSearchText(""); router.push("/"); }}
            className="font-12rg text-warn-red"
          >
            초기화
          </button>
        </div>
      )}
    </>
  );
}
