"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateJobStatus, searchJobs } from "@/lib/actions/admin";

type Job = {
  id: string;
  title: string;
  company: string | null;
  region: string | null;
  city: string | null;
  category: string | null;
  wage: string | null;
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

export function AdminJobTable({ jobs: initialJobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [changingId, setChangingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jobs, setJobs] = useState(initialJobs);

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
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  검색 결과가 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((j) => (
                <tr key={j.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{j.title}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
