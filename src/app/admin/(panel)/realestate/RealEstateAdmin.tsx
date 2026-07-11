/** 관리자 부동산 — /api/admin/listings 서버 페이지네이션+검색+필터 (사용자 지시 2026-07-11, 확장성)
 * 매물이 많아져도 전량 로드 안 함. 등록/상태변경/삭제 뮤테이션은 서버액션 유지 후 현재 페이지 새로고침 */
"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { createListing, updateListingStatus, deleteListing } from "@/lib/actions/realestate";

const REGIONS = ["서울", "경기", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const CATEGORIES = [
  { value: "ONEROOM", label: "원룸" },
  { value: "TWOROOM", label: "투룸" },
  { value: "THREEROOM", label: "쓰리룸" },
  { value: "OFFICETEL", label: "오피스텔" },
  { value: "APT", label: "아파트" },
  { value: "VILLA", label: "빌라/다세대" },
  { value: "STORE", label: "상가/사무실" },
  { value: "ETC", label: "기타" },
];
const PRICE_TYPES = ["월세", "전세", "매매"];
const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  ACTIVE: { label: "등록중", bg: "bg-emerald-500/15", text: "text-emerald-400" },
  RESERVED: { label: "예약중", bg: "bg-gold/15", text: "text-gold" },
  CLOSED: { label: "거래완료", bg: "bg-navy-700", text: "text-slate-300" },
};
const STATUS_FILTERS = [
  { label: "전체", value: "ALL" },
  { label: "등록중", value: "ACTIVE" },
  { label: "예약중", value: "RESERVED" },
  { label: "거래완료", value: "CLOSED" },
];
const PAGE_SIZE = 20;

interface Listing {
  id: string; title: string; price: string; priceType: string; region: string; city: string;
  category: string; status: string; views: number; images: string; createdAt: string;
}

const FIELD = "mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none";

export function RealEstateAdmin() {
  const [isPending, startTransition] = useTransition();
  const [listings, setListings] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const fetchListings = useCallback(
    async (p: number) => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(p), pageSize: String(PAGE_SIZE) });
      if (search.trim()) params.set("q", search.trim());
      if (catFilter !== "ALL") params.set("category", catFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      try {
        const res = await fetch(`/api/admin/listings?${params}`);
        const data = await res.json();
        setListings(data.items ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setPage(data.page ?? p);
      } finally {
        setLoading(false);
      }
    },
    [search, catFilter, statusFilter]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchListings(1), 300);
    return () => clearTimeout(t);
  }, [fetchListings]);

  const reload = () => fetchListings(page);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    const urls = imageUrls.filter((u) => u.trim());
    formData.set("images", JSON.stringify(urls));
    startTransition(async () => {
      const result = await createListing(formData);
      if (result?.error) setError(result.error);
      else { form.reset(); setShowForm(false); setImageUrls([""]); fetchListings(1); }
    });
  }

  function handleStatus(id: string, status: "ACTIVE" | "RESERVED" | "CLOSED") {
    startTransition(async () => { await updateListingStatus(id, status); reload(); });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 매물을 삭제하시겠습니까?`)) return;
    startTransition(async () => { await deleteListing(id); reload(); });
  }

  return (
    <div className="space-y-5">
      {/* 요약 + 등록 버튼 */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-mute">총 <b className="text-slate-300">{total.toLocaleString()}</b>개 매물</p>
        <button onClick={() => setShowForm(!showForm)} className="h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow inline-flex items-center gap-1">
          {showForm ? "취소" : <><Plus className="w-3.5 h-3.5" />매물 등록</>}
        </button>
      </div>

      {/* 등록 폼 */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5 space-y-4">
          <h2 className="text-[14px] font-bold text-white">새 매물 등록</h2>
          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[12px] text-mute">제목 *</label>
              <input name="title" required className={FIELD} placeholder="예: 강남역 5분 신축 원룸" />
            </div>
            <div>
              <label className="text-[12px] text-mute">유형</label>
              <select name="category" className={FIELD}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-mute">거래유형</label>
              <select name="priceType" className={FIELD}>
                {PRICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-mute">가격 *</label>
              <input name="price" required className={FIELD} placeholder="예: 50/500" />
            </div>
            <div>
              <label className="text-[12px] text-mute">보증금</label>
              <input name="deposit" className={FIELD} placeholder="예: 1000만" />
            </div>
            <div>
              <label className="text-[12px] text-mute">지역 *</label>
              <select name="region" required className={FIELD}>
                <option value="">선택</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-mute">시/군/구 *</label>
              <input name="city" required className={FIELD} placeholder="예: 강남구" />
            </div>
            <div>
              <label className="text-[12px] text-mute">상세주소</label>
              <input name="address" className={FIELD} placeholder="예: 역삼동 123-4" />
            </div>
            <div>
              <label className="text-[12px] text-mute">면적</label>
              <input name="area" className={FIELD} placeholder="예: 8평 / 26㎡" />
            </div>
            <div>
              <label className="text-[12px] text-mute">방/욕실</label>
              <input name="rooms" className={FIELD} placeholder="예: 1룸 1욕실" />
            </div>
            <div>
              <label className="text-[12px] text-mute">층수</label>
              <input name="floor" className={FIELD} placeholder="예: 3층/10층" />
            </div>
          </div>

          {/* 사진 URL */}
          <div>
            <label className="text-[12px] text-mute">사진 URL</label>
            {imageUrls.map((url, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <input value={url} onChange={(e) => { const n = [...imageUrls]; n[i] = e.target.value; setImageUrls(n); }}
                  className="flex-1 bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" placeholder="https://..." />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))} className="text-red-400 text-sm">삭제</button>
                )}
              </div>
            ))}
            {imageUrls.length < 8 && (
              <button type="button" onClick={() => setImageUrls([...imageUrls, ""])} className="text-sm text-brand mt-2">+ 사진 추가 ({imageUrls.length}/8)</button>
            )}
            {imageUrls.length >= 8 && <p className="text-xs text-mute mt-2">최대 8장까지 등록 가능합니다</p>}
          </div>

          {/* 설명 */}
          <div>
            <label className="text-[12px] text-mute">설명 *</label>
            <textarea name="description" required rows={4} className={FIELD} placeholder="매물 상세 설명" />
          </div>

          <button type="submit" disabled={isPending} className="h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow disabled:opacity-50 inline-flex items-center gap-1">
            {isPending ? "등록 중..." : <><Plus className="w-3.5 h-3.5" />매물 등록</>}
          </button>
        </form>
      )}

      {/* 필터 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          <input type="text" placeholder="제목·지역 검색..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none w-56" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="h-9 px-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 focus:border-brand/60 focus:outline-none">
          <option value="ALL">전체 유형</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <div className="flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${statusFilter === f.value ? "bg-brand/15 text-brand border border-brand/40" : "bg-navy-850 text-mute border border-line hover:text-slate-200"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 매물 리스트 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="px-5 py-2.5 font-semibold">매물</th>
              <th className="px-3 py-2.5 font-semibold">지역</th>
              <th className="px-3 py-2.5 font-semibold">가격</th>
              <th className="px-3 py-2.5 font-semibold text-center">조회</th>
              <th className="px-3 py-2.5 font-semibold text-center">상태</th>
              <th className="px-5 py-2.5 font-semibold text-center">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {listings.map((l) => {
              const st = STATUS_MAP[l.status] ?? STATUS_MAP.ACTIVE;
              let imgs: string[] = [];
              try { imgs = JSON.parse(l.images || "[]"); } catch { imgs = []; }
              return (
                <tr key={l.id} className="hover:bg-navy-800/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-navy-800 overflow-hidden shrink-0">
                        {imgs[0] ? <img src={imgs[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-mute text-xs">📷</div>}
                      </div>
                      <div>
                        <div className="font-semibold text-white line-clamp-1">{l.title}</div>
                        <div className="text-xs text-mute">{CATEGORIES.find((c) => c.value === l.category)?.label}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{l.region} {l.city}</td>
                  <td className="px-3 py-3 text-white font-semibold">{l.priceType} {l.price}</td>
                  <td className="px-3 py-3 text-center text-mute">{l.views}</td>
                  <td className="px-3 py-3 text-center">
                    <select
                      value={l.status}
                      onChange={(e) => handleStatus(l.id, e.target.value as "ACTIVE" | "RESERVED" | "CLOSED")}
                      disabled={isPending}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold border-0 ${st.bg} ${st.text}`}
                    >
                      <option value="ACTIVE">등록중</option>
                      <option value="RESERVED">예약중</option>
                      <option value="CLOSED">거래완료</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button onClick={() => handleDelete(l.id, l.title)} disabled={isPending} className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 inline-flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />삭제</button>
                  </td>
                </tr>
              );
            })}
            {listings.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-mute">{loading ? "불러오는 중…" : "등록된 매물이 없습니다"}</td></tr>
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-line text-[12px] text-mute">
          <span>{total > 0 ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} / ${total.toLocaleString()}` : "0"}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchListings(page - 1)} disabled={page <= 1 || loading} className="px-3 py-1.5 rounded-lg bg-navy-850 border border-line text-slate-200 disabled:opacity-40 hover:border-brand/50">이전</button>
            <span className="text-slate-300">{page} / {totalPages}</span>
            <button onClick={() => fetchListings(page + 1)} disabled={page >= totalPages || loading} className="px-3 py-1.5 rounded-lg bg-navy-850 border border-line text-slate-200 disabled:opacity-40 hover:border-brand/50">다음</button>
          </div>
        </div>
      </div>
    </div>
  );
}
