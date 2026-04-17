/** 관리자 출석체크 관리 페이지 */
export const dynamic = "force-dynamic";

import { adminGetAttendanceStats } from "@/lib/actions/attendance";
import { redirect } from "next/navigation";

export default async function AdminAttendancePage() {
  const stats = await adminGetAttendanceStats();
  if (!stats) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">출석체크 관리</h1>
        <p className="text-sm text-slate-500">회원 출석 현황을 확인합니다</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="오늘 출석자" value={`${stats.todayCount}명`} icon="📌" color="bg-orange-50 border-orange-200" />
        <StatCard label="이번 달 총 출석" value={`${stats.monthCount}회`} icon="📅" color="bg-blue-50 border-blue-200" />
        <StatCard label="이번 달 적립 포인트" value={`${stats.monthPoints.toLocaleString()}P`} icon="💰" color="bg-green-50 border-green-200" />
      </div>

      {/* 최근 7일 차트 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="font-semibold text-slate-900 mb-4">📊 최근 7일 출석 현황</h2>
        <div className="flex items-end gap-3 h-40">
          {stats.dailyStats.map((d) => {
            const maxCount = Math.max(...stats.dailyStats.map((s) => s.count), 1);
            const height = Math.max((d.count / maxCount) * 100, 4);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-700">{d.count}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-orange-500 to-orange-300 transition-all"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-slate-500">{d.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 오늘 출석자 목록 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">📋 오늘 출석자 목록</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">#</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">닉네임</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">이메일</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">적립 포인트</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">출석 시간</th>
            </tr>
          </thead>
          <tbody>
            {stats.todayRecords.map((r, i) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-700">{r.user.nickname ?? "-"}</td>
                <td className="px-4 py-3 text-slate-500">{r.user.email ?? "-"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    r.points >= 50 ? "bg-purple-100 text-purple-700"
                    : r.points >= 20 ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                  }`}>
                    +{r.points}P
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleTimeString("ko-KR")}
                </td>
              </tr>
            ))}
            {stats.todayRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
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

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}
