/** 관리자 출석체크 관리 페이지 */
export const dynamic = "force-dynamic";

import { adminGetAttendanceStats } from "@/lib/actions/attendance";
import { redirect } from "next/navigation";

export default async function AdminAttendancePage() {
  const stats = await adminGetAttendanceStats();
  if (!stats) redirect("/login");

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-5">
        <StatCard label="오늘 출석자" value={`${stats.todayCount}명`} icon="📌" valueColor="text-brand" />
        <StatCard label="이번 달 총 출석" value={`${stats.monthCount}회`} icon="📅" valueColor="text-white" />
        <StatCard label="이번 달 적립 포인트" value={`${stats.monthPoints.toLocaleString()}P`} icon="💰" valueColor="text-gold" />
      </div>

      {/* 최근 7일 차트 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5">
        <h2 className="text-[14px] font-bold text-white mb-4">📊 최근 7일 출석 현황</h2>
        <div className="flex items-end gap-3 h-40">
          {stats.dailyStats.map((d) => {
            const maxCount = Math.max(...stats.dailyStats.map((s) => s.count), 1);
            const height = Math.max((d.count / maxCount) * 100, 4);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-white">{d.count}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand to-brand-soft transition-all"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-mute">{d.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 오늘 출석자 목록 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">📋 오늘 출석자 목록</h2>
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="px-5 py-2.5 font-semibold">#</th>
              <th className="px-3 py-2.5 font-semibold">닉네임</th>
              <th className="px-3 py-2.5 font-semibold">이메일</th>
              <th className="px-3 py-2.5 font-semibold text-center">적립 포인트</th>
              <th className="px-5 py-2.5 font-semibold text-right">출석 시간</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {stats.todayRecords.map((r, i) => (
              <tr key={r.id} className="hover:bg-navy-800/40">
                <td className="px-5 py-3 text-mute">{i + 1}</td>
                <td className="px-3 py-3 font-semibold text-white">{r.user.nickname ?? "-"}</td>
                <td className="px-3 py-3 text-mute">{r.user.email ?? "-"}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                    r.points >= 50 ? "bg-gold/15 text-gold"
                    : r.points >= 20 ? "bg-brand/15 text-brand"
                    : "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    +{r.points}P
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-mute">
                  {new Date(r.createdAt).toLocaleTimeString("ko-KR")}
                </td>
              </tr>
            ))}
            {stats.todayRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-mute">
                  오늘 출석한 회원이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, valueColor }: { label: string; value: string; icon: string; valueColor: string }) {
  return (
    <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold text-mute">{label}</div>
        <div className="text-xl">{icon}</div>
      </div>
      <div className={`mt-2 text-[28px] font-extrabold tracking-tight ${valueColor}`}>{value}</div>
    </div>
  );
}
