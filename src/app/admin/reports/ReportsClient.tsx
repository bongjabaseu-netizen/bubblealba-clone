"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { handleReport } from "@/lib/actions/admin";

type Report = {
  id: string;
  type: string;
  targetId: string;
  targetTitle?: string;
  reason: string;
  status: string;
  createdAt: Date;
  reporter: { nickname: string | null };
};

const STATUS_TABS = [
  { key: "ALL", label: "전체" },
  { key: "PENDING", label: "대기" },
  { key: "RESOLVED", label: "처리완료" },
  { key: "DISMISSED", label: "반려" },
] as const;

const TYPE_COLORS: Record<string, string> = {
  JOB: "bg-blue-50 text-blue-700",
  POST: "bg-green-50 text-green-700",
  USER: "bg-red-50 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  RESOLVED: "bg-green-50 text-green-700",
  DISMISSED: "bg-slate-100 text-slate-500",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "대기",
  RESOLVED: "처리완료",
  DISMISSED: "반려",
};

export function ReportsClient({ reports }: { reports: Report[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const pendingCount = useMemo(
    () => reports.filter((r) => r.status === "PENDING").length,
    [reports]
  );

  const filtered = useMemo(() => {
    if (activeTab === "ALL") return reports;
    return reports.filter((r) => r.status === activeTab);
  }, [reports, activeTab]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: reports.length };
    reports.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, [reports]);

  function handleAction(reportId: string, status: "RESOLVED" | "DISMISSED") {
    startTransition(async () => {
      await handleReport(reportId, status);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900">신고 처리</h1>
        {pendingCount > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            {pendingCount}건 대기
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border border-slate-200 p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
            {(tabCounts[tab.key] ?? 0) > 0 && (
              <span className={`ml-1.5 text-xs ${activeTab === tab.key ? "text-slate-300" : "text-slate-400"}`}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-4 py-3 font-medium text-slate-600">대상</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">유형</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">사유</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">신고자</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">상태</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">날짜</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-32">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  신고 내역이 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-slate-900 font-medium">
                      {r.targetTitle || r.targetId}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${TYPE_COLORS[r.type] || "bg-slate-100 text-slate-600"}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{r.reason}</td>
                  <td className="px-4 py-3 text-slate-600">{r.reporter?.nickname || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || "bg-slate-100 text-slate-500"}`}>
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.status === "PENDING" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAction(r.id, "RESOLVED")}
                          disabled={isPending}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          처리완료
                        </button>
                        <button
                          onClick={() => handleAction(r.id, "DISMISSED")}
                          disabled={isPending}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                          반려
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
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
