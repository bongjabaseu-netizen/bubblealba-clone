/** 관리자 광고 테이블 — 상태 변경 + 편집(이미지 포함) */
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X, Archive, Save } from "lucide-react";
import { updateJobStatus, searchJobs, updateJob } from "@/lib/actions/admin";
import { ImageUploader } from "@/components/ImageUploader";

type Job = {
  id: string;
  title: string;
  company: string | null;
  region: string | null;
  city: string | null;
  category: string | null;
  wage: string | null;
  description: string;
  images: string;
  tags: string;
  status: string;
  views: number;
  createdAt: Date;
  author: { nickname: string | null };
};

// 상태 배지 색 — 대기(brand)/활성(긍정)/거절(위험)/마감(중립)
const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-brand/15 text-brand",
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-400",
  CLOSED: "bg-navy-700 text-slate-300",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "대기",
  ACTIVE: "활성",
  REJECTED: "거절",
  CLOSED: "마감",
};

const STATUS_TABS = [
  { label: "전체", value: "ALL" },
  { label: "대기중", value: "PENDING" },
  { label: "승인", value: "ACTIVE" },
  { label: "거절", value: "REJECTED" },
  { label: "마감", value: "CLOSED" },
] as const;

const CATEGORIES = [
  { value: "room", label: "룸싸롱" },
  { value: "karaoke", label: "가라오케" },
  { value: "hyperblick", label: "하이퍼블릭" },
  { value: "massage", label: "마사지" },
  { value: "bar", label: "바" },
  { value: "ten", label: "텐카페" },
  { value: "song", label: "노래주점" },
  { value: "office", label: "오피스텔" },
  { value: "etc", label: "기타" },
];

function safeJsonParse<T>(val: unknown, fallback: T): T {
  if (Array.isArray(val)) return val as T;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

type SortKey = "title" | "company" | "region" | "status" | "views" | "createdAt";
type SortDir = "asc" | "desc";

export function AdminJobTable({ jobs: initialJobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [changingId, setChangingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jobs, setJobs] = useState(initialJobs);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // router.refresh() 후 새 데이터 반영
  useEffect(() => { setJobs(initialJobs); }, [initialJobs]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const statusFiltered = statusFilter === "ALL"
    ? jobs
    : jobs.filter((j) => j.status === statusFilter);

  const filtered = [...statusFiltered].sort((a, b) => {
    let valA: string | number = "";
    let valB: string | number = "";
    switch (sortKey) {
      case "title": valA = a.title; valB = b.title; break;
      case "company": valA = a.company ?? ""; valB = b.company ?? ""; break;
      case "region": valA = `${a.region ?? ""} ${a.city ?? ""}`; valB = `${b.region ?? ""} ${b.city ?? ""}`; break;
      case "status": valA = a.status; valB = b.status; break;
      case "views": valA = a.views; valB = b.views; break;
      case "createdAt": valA = new Date(a.createdAt).getTime(); valB = new Date(b.createdAt).getTime(); break;
    }
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDir === "asc" ? valA - valB : valB - valA;
    }
    return sortDir === "asc"
      ? String(valA).localeCompare(String(valB), "ko")
      : String(valB).localeCompare(String(valA), "ko");
  });

  function handleSearch(value: string) {
    setQuery(value);
    startTransition(async () => {
      if (value.trim()) {
        const results = await searchJobs(value.trim(), statusFilter === "ALL" ? undefined : statusFilter);
        setJobs(results as Job[]);
      } else {
        setJobs(initialJobs);
      }
    });
  }

  function handleTabChange(value: string) {
    setStatusFilter(value);
    if (query.trim()) {
      startTransition(async () => {
        const results = await searchJobs(query.trim(), value === "ALL" ? undefined : value);
        setJobs(results as Job[]);
      });
    }
  }

  function handleStatus(jobId: string, status: "ACTIVE" | "REJECTED" | "CLOSED") {
    setChangingId(jobId);
    startTransition(async () => {
      await updateJobStatus(jobId, status);
      setChangingId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {/* 상태 탭 + 검색 */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === t.value
                  ? "bg-brand/15 text-brand border border-brand/40"
                  : "bg-navy-850 text-mute border border-line hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="제목 또는 회사명 검색..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 max-w-sm px-4 py-2 text-sm rounded-lg bg-navy-850 border border-line text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
        />
      </div>

      {/* 테이블 카드 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">광고 목록</h2>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand/15 text-brand">
            {filtered.length}개
          </span>
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="px-5 py-2.5 font-semibold">이미지</th>
              <SortTh label="제목" sortKey="title" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
              <SortTh label="회사" sortKey="company" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
              <SortTh label="지역" sortKey="region" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
              <SortTh label="상태" sortKey="status" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
              <SortTh label="조회수" sortKey="views" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
              <SortTh label="등록일" sortKey="createdAt" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
              <th className="px-5 py-2.5 font-semibold">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-mute">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((j) => {
                const imgs: string[] = safeJsonParse(j.images, []);
                return (
                  <tr key={j.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="px-5 py-3">
                      {imgs[0] ? (
                        <div className="w-12 h-12 rounded-lg bg-navy-800 overflow-hidden">
                          <img src={imgs[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-navy-800 flex items-center justify-center text-mute text-xs">없음</div>
                      )}
                    </td>
                    <td className="px-3 py-3 font-semibold text-white max-w-[200px] truncate">{j.title}</td>
                    <td className="px-3 py-3">{j.company || "-"}</td>
                    <td className="px-3 py-3">{j.region || "-"}{j.city ? ` ${j.city}` : ""}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${STATUS_BADGE[j.status] || "bg-navy-700 text-slate-300"}`}>
                        {STATUS_LABEL[j.status] || j.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-200">{(j.views ?? 0).toLocaleString()}</td>
                    <td className="px-3 py-3 text-mute">
                      {new Date(j.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditJob(j)}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-brand/10 text-brand border border-brand/30 hover:bg-brand/20 transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          편집
                        </button>
                        <button
                          disabled={isPending && changingId === j.id}
                          onClick={() => handleStatus(j.id, "ACTIVE")}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <Check className="w-3.5 h-3.5" />
                          승인
                        </button>
                        <button
                          disabled={isPending && changingId === j.id}
                          onClick={() => handleStatus(j.id, "REJECTED")}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors disabled:opacity-50 inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <X className="w-3.5 h-3.5" />
                          거절
                        </button>
                        <button
                          disabled={isPending && changingId === j.id}
                          onClick={() => handleStatus(j.id, "CLOSED")}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-navy-800 text-slate-300 border border-line hover:bg-navy-700 transition-colors disabled:opacity-50 inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          마감
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 편집 모달 */}
      {editJob && (
        <EditJobModal job={editJob} onClose={() => setEditJob(null)} onSaved={() => { setEditJob(null); router.refresh(); }} />
      )}
    </div>
  );
}

/** 광고 편집 모달 — 이미지 업로드 포함 */
function EditJobModal({ job, onClose, onSaved }: { job: Job; onClose: () => void; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const existingImages: string[] = safeJsonParse(job.images, []);
  const existingTags: string[] = safeJsonParse(job.tags, []);
  const [images, setImages] = useState<string[]>(existingImages);
  const [tagInput, setTagInput] = useState(existingTags.join(", "));

  function addImage(url: string) {
    // 이미지가 1개면 교체, 여러 개면 추가
    if (images.length === 1) {
      setImages([url]);
    } else {
      setImages((prev) => [...prev, url]);
    }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function replaceImage(idx: number, url: string) {
    setImages((prev) => prev.map((v, i) => i === idx ? url : v));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("images", JSON.stringify(images));
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    formData.set("tags", JSON.stringify(tags));

    startTransition(async () => {
      const result = await updateJob(job.id, formData);
      if (result.success) onSaved();
      else setError("저장 실패");
    });
  }

  // 모달 내 인풋 공통 스타일
  const fieldClass = "mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-navy-900 border border-line rounded-2xl shadow-card w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-lg font-bold text-white">광고 편집</h2>
          <button onClick={onClose} className="text-mute hover:text-slate-200 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">제목 *</label>
              <input name="title" defaultValue={job.title} required className={fieldClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">업체명</label>
              <input name="company" defaultValue={job.company ?? ""} className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">급여</label>
              <input name="wage" defaultValue={job.wage ?? ""} className={fieldClass} placeholder="시급 15만" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">지역</label>
              <input name="region" defaultValue={job.region ?? ""} className={fieldClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">시/구</label>
              <input name="city" defaultValue={job.city ?? ""} className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">직종</label>
              <select name="category" defaultValue={job.category ?? ""} className={fieldClass}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">태그 (쉼표 구분)</label>
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className={fieldClass} placeholder="신규, 급구, 보장" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">상세 설명</label>
            <textarea name="description" defaultValue={job.description} rows={4} className={fieldClass} />
          </div>

          {/* 이미지 관리 */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">광고 이미지</label>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {images.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg border border-line" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-md hover:bg-red-600"
                    >
                      ×
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-brand text-navy-950 text-[10px] font-bold px-1.5 py-0.5 rounded">대표</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-mute mb-2">
              {images.length === 0 ? "이미지를 업로드하세요" : images.length === 1 ? "새 이미지 업로드 시 기존 이미지가 교체됩니다" : "× 버튼으로 삭제 후 새 이미지를 추가하세요"}
            </p>
            <ImageUploader
              value=""
              onChange={addImage}
              folder="jobs"
              label=""
              placeholder="클릭하거나 드래그해서 이미지 업로드"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 bg-navy-850 border border-line rounded-lg hover:border-brand/60 inline-flex items-center gap-1">
              <X className="w-4 h-4" />
              취소
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-navy-950 bg-brand rounded-lg hover:bg-brand-soft shadow-glow disabled:opacity-50 inline-flex items-center gap-1">
              <Save className="w-4 h-4" />
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** 정렬 가능한 테이블 헤더 */
function SortTh({ label, sortKey, currentKey, dir, onClick }: {
  label: string; sortKey: SortKey; currentKey: SortKey; dir: SortDir; onClick: (key: SortKey) => void;
}) {
  const isActive = currentKey === sortKey;
  return (
    <th
      className="text-left px-3 py-2.5 font-semibold cursor-pointer select-none hover:text-slate-200 transition-colors"
      onClick={() => onClick(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`text-[10px] ${isActive ? "text-brand" : "text-mute/50"}`}>
          {isActive ? (dir === "asc" ? "▲" : "▼") : "⇅"}
        </span>
      </span>
    </th>
  );
}
