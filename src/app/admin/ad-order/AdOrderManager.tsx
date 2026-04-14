"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Star, StarOff } from "lucide-react";
import { swapJobOrder, toggleJobPromoted, updateJobOrder } from "@/lib/actions/admin";

type Job = {
  id: string;
  title: string;
  company: string;
  region: string;
  city: string | null;
  isPromoted: boolean;
  displayOrder: number;
  views: number;
  createdAt: Date;
};

export function AdOrderManager({ jobs }: { jobs: Job[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const current = jobs[index];
    const above = jobs[index - 1];
    startTransition(async () => {
      await swapJobOrder(current.id, above.id);
      router.refresh();
    });
  }

  function handleMoveDown(index: number) {
    if (index === jobs.length - 1) return;
    const current = jobs[index];
    const below = jobs[index + 1];
    startTransition(async () => {
      await swapJobOrder(current.id, below.id);
      router.refresh();
    });
  }

  function handleTogglePromoted(jobId: string) {
    startTransition(async () => {
      await toggleJobPromoted(jobId);
      router.refresh();
    });
  }

  function handleSetOrder(jobId: string, order: number) {
    startTransition(async () => {
      await updateJobOrder(jobId, order);
      router.refresh();
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          활성 공고 {jobs.length}건
        </span>
        <span className="text-xs text-slate-500">
          ⬆⬇ 순서 이동 · ⭐ 광고 설정
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs text-slate-500">
            <th className="px-4 py-2 text-left w-16">순서</th>
            <th className="px-4 py-2 text-left">공고</th>
            <th className="px-4 py-2 text-left w-24">지역</th>
            <th className="px-4 py-2 text-center w-20">조회</th>
            <th className="px-4 py-2 text-center w-20">광고</th>
            <th className="px-4 py-2 text-center w-28">이동</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={job.id}
              className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                job.isPromoted ? "bg-amber-50/50" : ""
              }`}
            >
              <td className="px-4 py-3">
                <input
                  type="number"
                  value={job.displayOrder}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) handleSetOrder(job.id, val);
                  }}
                  className="w-14 px-2 py-1 text-center text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  disabled={isPending}
                />
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 truncate max-w-xs">{job.title}</div>
                <div className="text-xs text-slate-500">{job.company}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {job.region} {job.city}
              </td>
              <td className="px-4 py-3 text-center text-slate-600">
                {job.views.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleTogglePromoted(job.id)}
                  disabled={isPending}
                  className={`p-1.5 rounded-lg transition-colors ${
                    job.isPromoted
                      ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  }`}
                  title={job.isPromoted ? "광고 해제" : "광고 설정"}
                >
                  {job.isPromoted ? (
                    <Star className="w-4 h-4 fill-current" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={isPending || index === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="위로"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={isPending || index === jobs.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="아래로"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                활성 공고가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
