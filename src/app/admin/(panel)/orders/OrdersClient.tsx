"use client";

/**
 * 광고거래 내역 테이블 — 상태 필터 칩 + 완료 매출 합계 (조회 전용)
 * from: bids/BidsClient.tsx 패턴
 */
import { useState } from "react";

type Order = {
  id: string;
  amount: number;
  status: string;
  startDate: Date;
  endDate: Date;
  paymentMethod: string | null;
  createdAt: Date;
  user: { nickname: string | null; email: string | null };
  job: { title: string } | null;
  package: { name: string; durationDays: number };
};

const BADGE = "px-2 py-0.5 rounded-md text-[11px] font-bold";

function statusBadge(status: string) {
  if (status === "COMPLETED") return <span className={`${BADGE} bg-emerald-400/15 text-emerald-400`}>완료</span>;
  if (status === "PENDING") return <span className={`${BADGE} bg-brand/15 text-brand`}>대기</span>;
  if (status === "CANCELLED") return <span className={`${BADGE} bg-red-400/15 text-red-400`}>취소</span>;
  return <span className={`${BADGE} bg-navy-700 text-slate-300`}>만료</span>;
}

/** 결제수단 표시 라벨 (demo = 데모 결제) */
function payLabel(method: string | null) {
  if (!method) return "-";
  if (method === "demo") return "데모";
  return method;
}

const FILTERS = [
  { key: "ALL", label: "전체" },
  { key: "COMPLETED", label: "완료" },
  { key: "PENDING", label: "대기" },
  { key: "CANCELLED", label: "취소" },
  { key: "EXPIRED", label: "만료" },
] as const;

export function OrdersClient({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const completedTotal = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
      {/* 카드 헤더바: 거래 건수 + 완료 매출 합계 + 상태 필터 칩 */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
        <span className="text-[14px] font-bold text-white">
          거래 {orders.length}건
          <span className="ml-2 text-gold">· 완료 매출 {completedTotal.toLocaleString()}원</span>
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
            <th className="px-5 py-2.5 font-semibold">주문자</th>
            <th className="px-3 py-2.5 font-semibold">패키지</th>
            <th className="px-3 py-2.5 font-semibold">공고</th>
            <th className="px-3 py-2.5 font-semibold text-right">금액</th>
            <th className="px-3 py-2.5 font-semibold text-center">결제수단</th>
            <th className="px-3 py-2.5 font-semibold text-center">상태</th>
            <th className="px-3 py-2.5 font-semibold text-center">게재 기간</th>
            <th className="px-5 py-2.5 font-semibold text-right">주문일</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/50 text-slate-300">
          {filtered.map((order) => (
            <tr key={order.id} className="hover:bg-navy-800/40 transition-colors">
              <td className="px-5 py-3">
                <div className="font-semibold text-white">{order.user.nickname ?? "-"}</div>
                <div className="text-[11px] text-mute truncate max-w-[140px]">{order.user.email ?? "-"}</div>
              </td>
              <td className="px-3 py-3">
                <div className="text-white font-semibold">{order.package.name}</div>
                <div className="text-[11px] text-mute">{order.package.durationDays}일</div>
              </td>
              <td className="px-3 py-3 max-w-[180px] truncate text-mute">{order.job?.title ?? "-"}</td>
              <td className="px-3 py-3 text-right text-white font-semibold">
                {order.amount.toLocaleString()}원
              </td>
              <td className="px-3 py-3 text-center text-mute">{payLabel(order.paymentMethod)}</td>
              <td className="px-3 py-3 text-center">{statusBadge(order.status)}</td>
              <td className="px-3 py-3 text-center text-mute text-[11.5px]">
                {new Date(order.startDate).toLocaleDateString("ko-KR")} ~{" "}
                {new Date(order.endDate).toLocaleDateString("ko-KR")}
              </td>
              <td className="px-5 py-3 text-right text-mute">
                {new Date(order.createdAt).toLocaleDateString("ko-KR")}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-mute">
                해당 상태의 거래가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
