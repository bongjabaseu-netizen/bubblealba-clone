/** 광고주 대시보드 — 내 공고/입찰/초이스톡 현황 */
import Link from "next/link";
import { getAdvertiserDashboard } from "@/lib/actions/advertiser";
import { redirect } from "next/navigation";

export default async function AdvertiserDashboardPage() {
  const data = await getAdvertiserDashboard();
  if (!data) redirect("/login");

  const { user, jobs, bids, rooms, recentMessages } = data;
  const activeBids = bids.filter((b) => b.status === "APPROVED").length;
  const pendingBids = bids.filter((b) => b.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">광고주 대시보드</h1>

      {/* 스탯 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="보유 포인트" value={`${user.points.toLocaleString()}P`} color="text-orange-600" />
        <StatCard label="내 공고" value={`${jobs.length}개`} />
        <StatCard label="진행중 입찰" value={`${activeBids}개`} color="text-green-600" />
        <StatCard label="승인 대기" value={`${pendingBids}개`} color="text-blue-600" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 내 공고 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">내 공고</h2>
          </div>
          {jobs.length === 0 ? (
            <p className="text-sm text-slate-400">등록된 공고가 없습니다</p>
          ) : (
            <ul className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <li key={job.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 truncate">{job.title}</span>
                  <span className="text-slate-400 shrink-0 ml-2">❤ {job._count.favorites} · 📋 {job._count.applications}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 초이스톡 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">내 초이스톡</h2>
            <Link href="/advertiser/choicetalk" className="text-xs text-orange-500 hover:text-orange-600">관리 →</Link>
          </div>
          {rooms.length === 0 ? (
            <p className="text-sm text-slate-400">초이스톡 톡방이 없습니다</p>
          ) : (
            <ul className="space-y-3">
              {rooms.map((room) => (
                <li key={room.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{room.name}</span>
                  <span className="text-slate-400">메시지 {room._count.messages}개</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 최근 입찰 내역 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">입찰 내역</h2>
          <Link href="/advertiser/bid" className="text-xs text-orange-500 hover:text-orange-600">새 입찰 →</Link>
        </div>
        {bids.length === 0 ? (
          <p className="text-sm text-slate-400">입찰 내역이 없습니다</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 font-medium text-slate-500">공고</th>
                <th className="text-left py-2 font-medium text-slate-500">패키지</th>
                <th className="text-right py-2 font-medium text-slate-500">입찰액</th>
                <th className="text-right py-2 font-medium text-slate-500">총액</th>
                <th className="text-center py-2 font-medium text-slate-500">상태</th>
              </tr>
            </thead>
            <tbody>
              {bids.slice(0, 10).map((bid) => (
                <tr key={bid.id} className="border-b border-slate-50">
                  <td className="py-2 text-slate-700">{bid.job?.title ?? "-"}</td>
                  <td className="py-2 text-slate-500">{bid.package?.name ?? "입찰만"}</td>
                  <td className="py-2 text-right text-slate-700">{bid.bidAmount.toLocaleString()}원</td>
                  <td className="py-2 text-right font-medium text-slate-900">{bid.totalAmount.toLocaleString()}원</td>
                  <td className="py-2 text-center">
                    <BidStatusBadge status={bid.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color ?? "text-slate-900"}`}>{value}</div>
    </div>
  );
}

function BidStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "대기" },
    APPROVED: { bg: "bg-green-100", text: "text-green-700", label: "승인" },
    REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "거절" },
    EXPIRED: { bg: "bg-slate-100", text: "text-slate-500", label: "만료" },
  };
  const s = map[status] ?? map.PENDING;
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
}
