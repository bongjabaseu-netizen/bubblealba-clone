/** 광고 입찰 페이지 — 패키지 선택 + 추가 입찰 금액 */
import { getAdPackages, getMyJobs } from "@/lib/actions/advertiser";
import { BidForm } from "./BidForm";

export default async function BidPage() {
  const [packages, jobs] = await Promise.all([getAdPackages(), getMyJobs()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">광고 입찰</h1>
        <p className="text-sm text-slate-500 mt-1">패키지를 선택하고 추가 입찰 금액을 입력하면 노출 순위가 올라갑니다</p>
      </div>

      {/* 패키지 안내 */}
      <div className="grid grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-slate-200 rounded-xl p-5 text-center">
            <div className="text-xs text-slate-400 mb-1">{pkg.tier.toUpperCase()}</div>
            <div className="font-bold text-lg text-slate-900">{pkg.name}</div>
            <div className="text-2xl font-bold text-orange-500 my-2">{pkg.price.toLocaleString()}원</div>
            <div className="text-xs text-slate-500">{pkg.durationDays}일간 노출</div>
            <div className="text-xs text-slate-400 mt-1">{pkg.description}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-semibold text-slate-900 mb-1">입찰 신청</h2>
        <p className="text-xs text-slate-400 mb-4">50만원 이하: 포인트 즉시 결제 | 50만원 초과: 관리자 승인 필요</p>
        <BidForm packages={packages} jobs={jobs} />
      </div>
    </div>
  );
}
