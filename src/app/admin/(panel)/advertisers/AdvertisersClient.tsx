"use client";

/**
 * 광고주인증 테이블 — 미인증 프로필 인증 버튼 (스키마상 거절 상태 없음 → 승인만)
 * from: bids/BidsClient.tsx 패턴
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { verifyAdvertiserProfile } from "@/lib/actions/ads";

type Profile = {
  id: string;
  businessName: string;
  businessNumber: string;
  representative: string;
  phone: string;
  address: string | null;
  verified: boolean;
  createdAt: Date;
  user: { nickname: string | null; email: string | null; role: string };
};

const BADGE = "px-2 py-0.5 rounded-md text-[11px] font-bold";

const FILTERS = [
  { key: "ALL", label: "전체" },
  { key: "UNVERIFIED", label: "미인증" },
  { key: "VERIFIED", label: "인증 완료" },
] as const;

export function AdvertisersClient({ profiles }: { profiles: Profile[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered =
    filter === "ALL"
      ? profiles
      : profiles.filter((p) => (filter === "VERIFIED" ? p.verified : !p.verified));
  const unverifiedCount = profiles.filter((p) => !p.verified).length;

  function handleVerify(profileId: string) {
    startTransition(async () => {
      const result = await verifyAdvertiserProfile(profileId);
      if ("error" in result && result.error) alert(result.error);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
      {/* 카드 헤더바: 미인증 건수 + 필터 칩 */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
        <span className="text-[14px] font-bold text-white">
          광고주 {profiles.length}명
          {unverifiedCount > 0 && (
            <span className="ml-2 text-brand">· 미인증 {unverifiedCount}명</span>
          )}
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
            <th className="px-5 py-2.5 font-semibold">상호명</th>
            <th className="px-3 py-2.5 font-semibold">사업자번호</th>
            <th className="px-3 py-2.5 font-semibold">대표자</th>
            <th className="px-3 py-2.5 font-semibold">연락처</th>
            <th className="px-3 py-2.5 font-semibold">회원</th>
            <th className="px-3 py-2.5 font-semibold text-center">인증</th>
            <th className="px-3 py-2.5 font-semibold text-right">등록일</th>
            <th className="px-5 py-2.5 font-semibold text-center w-24">처리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/50 text-slate-300">
          {filtered.map((p) => (
            <tr key={p.id} className="hover:bg-navy-800/40 transition-colors">
              <td className="px-5 py-3">
                <div className="font-semibold text-white">{p.businessName}</div>
                {p.address && (
                  <div className="text-[11px] text-mute truncate max-w-[180px]">{p.address}</div>
                )}
              </td>
              <td className="px-3 py-3 text-mute">{p.businessNumber}</td>
              <td className="px-3 py-3">{p.representative}</td>
              <td className="px-3 py-3 text-mute">{p.phone}</td>
              <td className="px-3 py-3">
                <div className="font-semibold text-white">{p.user.nickname ?? "-"}</div>
                <div className="text-[11px] text-mute truncate max-w-[140px]">{p.user.email ?? "-"}</div>
              </td>
              <td className="px-3 py-3 text-center">
                {p.verified ? (
                  <span className={`${BADGE} bg-emerald-400/15 text-emerald-400`}>인증 완료</span>
                ) : (
                  <span className={`${BADGE} bg-brand/15 text-brand`}>미인증</span>
                )}
              </td>
              <td className="px-3 py-3 text-right text-mute">
                {new Date(p.createdAt).toLocaleDateString("ko-KR")}
              </td>
              <td className="px-5 py-3 text-center">
                {!p.verified ? (
                  <button
                    onClick={() => handleVerify(p.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-emerald-400/15 text-emerald-400 text-[11.5px] font-bold hover:bg-emerald-400/25 disabled:opacity-40 transition-colors"
                    title="사업자 인증 승인"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> 인증
                  </button>
                ) : (
                  <span className="text-mute text-[11px]">-</span>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-mute">
                해당 상태의 광고주가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
