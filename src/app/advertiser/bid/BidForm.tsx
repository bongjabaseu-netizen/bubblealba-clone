/** 입찰 폼 — 공고 선택 + 패키지 선택 + 추가 입찰 금액 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBid } from "@/lib/actions/advertiser";

interface Package { id: string; name: string; price: number; tier: string; }
interface Job { id: string; title: string; company: string; }

export function BidForm({ packages, jobs }: { packages: Package[]; jobs: Job[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPkg, setSelectedPkg] = useState("");
  const [bidAmount, setBidAmount] = useState(0);

  const pkgPrice = packages.find(p => p.id === selectedPkg)?.price ?? 0;
  const total = pkgPrice + bidAmount;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    formData.set("bidAmount", String(bidAmount));

    startTransition(async () => {
      const result = await createBid(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.method === "POINT") {
        setSuccess("포인트로 결제 완료! 광고가 즉시 적용됩니다.");
        router.refresh();
      } else {
        setSuccess("입찰 신청 완료! 관리자 승인 후 광고가 적용됩니다.");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
      {success && <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">{success}</div>}

      {/* 공고 선택 */}
      <div>
        <label className="text-sm font-medium text-slate-700">공고 선택 *</label>
        <select name="jobId" required className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
          <option value="">공고를 선택하세요</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title} ({j.company})</option>)}
        </select>
        {jobs.length === 0 && <p className="text-xs text-red-400 mt-1">등록된 공고가 없습니다. 먼저 공고를 등록해주세요.</p>}
      </div>

      {/* 패키지 선택 */}
      <div>
        <label className="text-sm font-medium text-slate-700">광고 패키지 (선택)</label>
        <select name="packageId" value={selectedPkg} onChange={e => setSelectedPkg(e.target.value)} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
          <option value="">패키지 없이 입찰만</option>
          {packages.map(p => <option key={p.id} value={p.id}>{p.name} — {p.price.toLocaleString()}원</option>)}
        </select>
      </div>

      {/* 추가 입찰 금액 */}
      <div>
        <label className="text-sm font-medium text-slate-700">추가 입찰 금액</label>
        <p className="text-xs text-slate-400 mb-1">높은 입찰 금액일수록 상위 노출됩니다</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step={10000}
            value={bidAmount}
            onChange={e => setBidAmount(parseInt(e.target.value) || 0)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
            placeholder="0"
          />
          <span className="text-sm text-slate-500">원</span>
        </div>
        <div className="flex gap-2 mt-2">
          {[50000, 100000, 200000, 500000].map(amt => (
            <button key={amt} type="button" onClick={() => setBidAmount(prev => prev + amt)}
              className="px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
              +{(amt/10000)}만
            </button>
          ))}
        </div>
      </div>

      {/* 합계 */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">패키지</span>
          <span className="text-slate-700">{pkgPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-slate-500">추가 입찰</span>
          <span className="text-slate-700">{bidAmount.toLocaleString()}원</span>
        </div>
        <hr className="my-2 border-slate-200" />
        <div className="flex justify-between font-bold">
          <span className="text-slate-900">총 결제 금액</span>
          <span className="text-orange-500">{total.toLocaleString()}원</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {total <= 500000 ? "💰 포인트 즉시 결제" : "📋 관리자 승인 후 결제"}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || jobs.length === 0}
        className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
      >
        {isPending ? "처리 중..." : `입찰 신청 (${total.toLocaleString()}원)`}
      </button>
    </form>
  );
}
