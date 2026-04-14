"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdPackages, getMyJobs, purchaseAd } from "@/lib/actions/ads";
import Link from "next/link";

type Package = Awaited<ReturnType<typeof getAdPackages>>[number];
type Job = Awaited<ReturnType<typeof getMyJobs>>[number];

const TIER_BADGE: Record<string, { label: string; color: string }> = {
  basic: { label: "베이직", color: "bg-bg-gray-50 text-font-gray" },
  standard: { label: "스탠다드", color: "bg-blue-50 text-blue-700" },
  premium: { label: "프리미엄", color: "bg-yellow-50 text-yellow-700" },
};

export default function BuyPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([getAdPackages(), getMyJobs()]).then(([pkgs, myJobs]) => {
      setPackages(pkgs);
      setJobs(myJobs);
    });
  }, []);

  function handlePurchase() {
    if (!selectedPkg) return;
    setMessage(null);
    startTransition(async () => {
      const result = await purchaseAd(selectedPkg, selectedJob || undefined);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "광고가 구매되었습니다!" });
        setSelectedPkg(null);
        setSelectedJob("");
      }
    });
  }

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">광고 구매</h1>
        <p className="font-13rg text-font-disabled">
          데모 환경 &mdash; 실제 결제 없이 바로 구매됩니다
        </p>
      </div>

      {/* 패키지 목록 */}
      <div className="space-y-10px">
        {packages.map((pkg) => {
          const badge = TIER_BADGE[pkg.tier] ?? TIER_BADGE.basic;
          const isSelected = selectedPkg === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg.id)}
              className={`w-full rounded-14px border p-12px text-left transition-colors ${
                isSelected
                  ? "border-warn-red bg-red-50/30"
                  : "border-line-gray-20 active-bg-gray"
              }`}
            >
              <div className="flex items-center justify-between mb-4px">
                <span className="font-15sb text-font-black">{pkg.name}</span>
                <span className={`font-11rg px-6px py-2px rounded-4px ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <div className="flex items-center gap-8px mb-4px">
                <span className="font-14sb text-font-black">
                  {pkg.price.toLocaleString()}원
                </span>
                <span className="font-12rg text-font-disabled">
                  {pkg.durationDays}일
                </span>
              </div>
              {pkg.description && (
                <p className="font-13rg text-font-gray">{pkg.description}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* 공고 선택 */}
      {jobs.length > 0 && (
        <div>
          <label className="font-14sb text-font-black mb-6px block">
            어떤 공고를 광고할까요?
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full h-44px rounded-10px border border-line-gray-50 px-12px font-14rg text-font-black bg-bg-white"
          >
            <option value="">선택 안함 (일반 광고)</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} {job.isPromoted ? "(광고중)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 메시지 */}
      {message && (
        <div
          className={`rounded-10px px-12px py-10px font-13rg ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 구매 버튼 */}
      <button
        onClick={handlePurchase}
        disabled={!selectedPkg || isPending}
        className="w-full h-button rounded-10px bg-warn-red text-bg-white font-15sb disabled:opacity-40 transition-opacity"
      >
        {isPending ? "처리중..." : "구매하기"}
      </button>

      <Link
        href="/mypage/ad-center"
        className="block text-center font-13rg text-font-disabled"
      >
        광고센터로 돌아가기
      </Link>
    </div>
  );
}
