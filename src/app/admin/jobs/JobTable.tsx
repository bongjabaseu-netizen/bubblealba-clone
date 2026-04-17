/** 관리자 광고 테이블 — 상태 변경 + 편집(이미지 포함) */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACTIVE: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CLOSED: "bg-slate-100 text-slate-500",
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

export function AdminJobTable({ jobs: initialJobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [changingId, setChangingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jobs, setJobs] = useState(initialJobs);
  const [editJob, setEditJob] = useState<Job | null>(null);

  const filtered = statusFilter === "ALL"
    ? jobs
    : jobs.filter((j) => j.status === statusFilter);

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
      {/* Status Tabs + Search */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === t.value
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
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
          className="flex-1 max-w-sm px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">이미지</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">제목</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">회사</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">지역</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">상태</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">조회수</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">등록일</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((j) => {
                const imgs: string[] = safeJsonParse(j.images, []);
                return (
                  <tr key={j.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      {imgs[0] ? (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                          <img src={imgs[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">없음</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px] truncate">{j.title}</td>
                    <td className="px-4 py-3 text-slate-600">{j.company || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{j.region || "-"}{j.city ? ` ${j.city}` : ""}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_BADGE[j.status] || "bg-slate-100 text-slate-600"}`}>
                        {STATUS_LABEL[j.status] || j.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{(j.views ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(j.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditJob(j)}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          편집
                        </button>
                        <button
                          disabled={isPending && changingId === j.id}
                          onClick={() => handleStatus(j.id, "ACTIVE")}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          승인
                        </button>
                        <button
                          disabled={isPending && changingId === j.id}
                          onClick={() => handleStatus(j.id, "REJECTED")}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          거절
                        </button>
                        <button
                          disabled={isPending && changingId === j.id}
                          onClick={() => handleStatus(j.id, "CLOSED")}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
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
    setImages((prev) => [...prev, url]);
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">광고 편집</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">제목 *</label>
              <input name="title" defaultValue={job.title} required className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">업체명</label>
              <input name="company" defaultValue={job.company ?? ""} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">급여</label>
              <input name="wage" defaultValue={job.wage ?? ""} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="시급 15만" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">지역</label>
              <input name="region" defaultValue={job.region ?? ""} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">시/구</label>
              <input name="city" defaultValue={job.city ?? ""} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">직종</label>
              <select name="category" defaultValue={job.category ?? ""} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">태그 (쉼표 구분)</label>
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="신규, 급구, 보장" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">상세 설명</label>
            <textarea name="description" defaultValue={job.description} rows={4} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>

          {/* 이미지 관리 */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">광고 이미지</label>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <ImageUploader
              value=""
              onChange={addImage}
              folder="jobs"
              label=""
              placeholder="클릭하거나 드래그해서 이미지 추가"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">
              취소
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
