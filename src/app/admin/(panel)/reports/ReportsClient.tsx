"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
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
  JOB: "bg-brand/15 text-brand",
  POST: "bg-emerald-500/15 text-emerald-400",
  USER: "bg-red-500/15 text-red-400",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-brand/15 text-brand",
  RESOLVED: "bg-emerald-500/15 text-emerald-400",
  DISMISSED: "bg-navy-700 text-slate-300",
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
    <div className="space-y-5">
      {/* 상태 탭 */}
      <div className="flex items-center gap-1 rounded-xl bg-navy-850/90 border border-line shadow-card p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-brand/15 text-brand border border-brand/40"
                : "text-mute hover:text-slate-200"
            }`}
          >
            {tab.label}
            {(tabCounts[tab.key] ?? 0) > 0 && (
              <span className={`ml-1.5 text-xs ${activeTab === tab.key ? "text-brand/70" : "text-mute"}`}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">신고 목록</h2>
          {pendingCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand/15 text-brand">
              {pendingCount}건 대기
            </span>
          )}
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="text-left px-5 py-2.5 font-semibold">대상</th>
              <th className="text-left px-3 py-2.5 font-semibold">유형</th>
              <th className="text-left px-3 py-2.5 font-semibold">사유</th>
              <th className="text-left px-3 py-2.5 font-semibold">신고자</th>
              <th className="text-center px-3 py-2.5 font-semibold">상태</th>
              <th className="text-left px-3 py-2.5 font-semibold">날짜</th>
              <th className="text-center px-5 py-2.5 font-semibold w-32">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-mute">
                  신고 내역이 없습니다
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-navy-800/40">
                  <td className="px-5 py-3">
                    <span className="text-white font-semibold">
                      {r.targetTitle || r.targetId}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${TYPE_COLORS[r.type] || "bg-navy-700 text-slate-300"}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-300 max-w-xs truncate">{r.reason}</td>
                  <td className="px-3 py-3 text-slate-300">{r.reporter?.nickname || "-"}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${STATUS_COLORS[r.status] || "bg-navy-700 text-slate-300"}`}>
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-mute text-xs">
                    {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {r.status === "PENDING" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAction(r.id, "RESOLVED")}
                          disabled={isPending}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors disabled:opacity-50 gap-1 whitespace-nowrap"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          처리완료
                        </button>
                        <button
                          onClick={() => handleAction(r.id, "DISMISSED")}
                          disabled={isPending}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-850 border border-line text-slate-300 hover:border-brand/60 transition-colors disabled:opacity-50 gap-1 whitespace-nowrap"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          반려
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-mute">-</span>
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
