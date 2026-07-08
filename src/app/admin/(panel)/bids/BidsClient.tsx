"use client";

/**
 * 입찰승인 테이블 — 상태 필터 칩 + PENDING 건 승인/거절 버튼
 * from: ad-order/AdOrderManager.tsx 패턴 (useTransition + router.refresh)
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { adminApproveBid, adminRejectBid } from "@/lib/actions/advertiser";

type Bid = {
  id: string;
  bidAmount: number;
  totalAmount: number;
  payMethod: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  user: { nickname: string | null; email: string | null };
  job: { title: string };
  package: { name: string } | null;
};

const BADGE = "px-2 py-0.5 rounded-md text-[11px] font-bold";

function statusBadge(status: string) {
  if (status === "PENDING") return <span className={`${BADGE} bg-brand/15 text-brand`}>승인 대기</span>;
  if (status === "APPROVED") return <span className={`${BADGE} bg-emerald-400/15 text-emerald-400`}>승인</span>;
  if (status === "REJECTED") return <span className={`${BADGE} bg-red-400/15 text-red-400`}>거절</span>;
  return <span className={`${BADGE} bg-navy-700 text-slate-300`}>만료</span>;
}

const FILTERS = [
  { key: "ALL", label: "전체" },
  { key: "PENDING", label: "승인 대기" },
  { key: "APPROVED", label: "승인" },
  { key: "REJECTED", label: "거절" },
] as const;

export function BidsClient({ bids }: { bids: Bid[] }) {
  const [filter, setFilter] = useState<string>("PENDING");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = filter === "ALL" ? bids : bids.filter((b) => b.status === filter);
  const pendingCount = bids.filter((b) => b.status === "PENDING").length;

  function handle(action: (id: string) => Promise<{ error?: string } | { success: boolean }>, bidId: string) {
    startTransition(async () => {
      const result = await action(bidId);
      if ("error" in result && result.error) alert(result.error);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
      {/* 카드 헤더바: 대기 건수 + 상태 필터 칩 */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
        <span className="text-[14px] font-bold text-white">
          입찰 {bids.length}건
          {pendingCount > 0 && <span className="ml-2 text-brand">· 승인 대기 {pendingCount}건</span>}
        </span>
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                filter === f.key
                  ? "bg-brand/15 text-brand"
                  : "text-mute hover:bg-navy-800 hover:text-slate-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
            <th className="px-5 py-2.5 font-semibold">입찰자</th>
            <th className="px-3 py-2.5 font-semibold">공고</th>
            <th className="px-3 py-2.5 font-semibold">패키지</th>
            <th className="px-3 py-2.5 font-semibold text-right">입찰액</th>
            <th className="px-3 py-2.5 font-semibold text-right">합계</th>
            <th className="px-3 py-2.5 font-semibold text-center">상태</th>
            <th className="px-3 py-2.5 font-semibold text-right">신청일</th>
            <th className="px-5 py-2.5 font-semibold text-center w-28">처리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/50 text-slate-300">
          {filtered.map((bid) => (
            <tr key={bid.id} className="hover:bg-navy-800/40 transition-colors">
              <td className="px-5 py-3">
                <div className="font-semibold text-white">{bid.user.nickname ?? "-"}</div>
                <div className="text-[11px] text-mute truncate max-w-[140px]">{bid.user.email ?? "-"}</div>
              </td>
              <td className="px-3 py-3 text-white font-semibold max-w-[200px] truncate">{bid.job.title}</td>
              <td className="px-3 py-3 text-mute">{bid.package?.name ?? "없음"}</td>
              <td className="px-3 py-3 text-right">{bid.bidAmount.toLocaleString()}원</td>
              <td className="px-3 py-3 text-right text-white font-semibold">
                {bid.totalAmount.toLocaleString()}원
              </td>
              <td className="px-3 py-3 text-center">{statusBadge(bid.status)}</td>
              <td className="px-3 py-3 text-right text-mute">
                {new Date(bid.createdAt).toLocaleDateString("ko-KR")}
              </td>
              <td className="px-5 py-3">
                {bid.status === "PENDING" ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handle(adminApproveBid, bid.id)}
                      disabled={isPending}
                      className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-emerald-400/15 text-emerald-400 text-[11.5px] font-bold hover:bg-emerald-400/25 disabled:opacity-40 transition-colors"
                      title="승인 — 30일 게재"
                    >
                      <Check className="w-3.5 h-3.5" /> 승인
                    </button>
                    <button
                      onClick={() => handle(adminRejectBid, bid.id)}
                      disabled={isPending}
                      className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-red-400/15 text-red-400 text-[11.5px] font-bold hover:bg-red-400/25 disabled:opacity-40 transition-colors"
                      title="거절"
                    >
                      <X className="w-3.5 h-3.5" /> 거절
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-mute text-[11px]">
                    {bid.endDate ? `~${new Date(bid.endDate).toLocaleDateString("ko-KR")}` : "-"}
                  </div>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-mute">
                해당 상태의 입찰이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
