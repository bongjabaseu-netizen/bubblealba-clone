import { Users, Briefcase, MessageSquare, Flag } from "lucide-react";
import {
  getAdminStats,
  getRecentUsers,
  getRecentJobs,
  getTodayStats,
} from "@/lib/actions/admin";
import Link from "next/link";

export default async function AdminDashboard() {
  const [stats, recentUsers, recentJobs, today] = await Promise.all([
    getAdminStats(),
    getRecentUsers(5),
    getRecentJobs(5),
    getTodayStats(),
  ]);

  const cards = [
    {
      label: "회원",
      value: stats.totalUsers.toLocaleString(),
      today: today.todayUsers,
      icon: Users,
      color: "bg-blue-500",
      lightBg: "bg-blue-50",
      href: "/admin/users",
    },
    {
      label: "공고",
      value: stats.totalJobs.toLocaleString(),
      today: today.todayJobs,
      icon: Briefcase,
      color: "bg-orange-500",
      lightBg: "bg-orange-50",
      href: "/admin/jobs",
    },
    {
      label: "게시물",
      value: stats.totalPosts.toLocaleString(),
      today: today.todayPosts,
      icon: MessageSquare,
      color: "bg-green-500",
      lightBg: "bg-green-50",
      href: "/admin/posts",
    },
    {
      label: "대기 신고",
      value: stats.pendingReports.toString(),
      today: null,
      icon: Flag,
      color: "bg-red-500",
      lightBg: "bg-red-50",
      href: "/admin/reports",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">대시보드</h1>
        <p className="text-sm text-slate-500">사이트 전체 현황을 한눈에</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${c.lightBg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${c.color.replace("bg-", "text-")}`} />
                </div>
                {c.today !== null && c.today > 0 && (
                  <span className="text-[11px] font-medium bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                    오늘 +{c.today}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-slate-900">{c.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent users */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              최근 가입 회원
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              전체 보기 →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left pb-2 font-medium">닉네임</th>
                <th className="text-left pb-2 font-medium">이메일</th>
                <th className="text-left pb-2 font-medium">권한</th>
                <th className="text-right pb-2 font-medium">가입일</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-2.5 text-slate-700 font-medium">
                    {u.nickname ?? "-"}
                  </td>
                  <td className="py-2.5 text-slate-500">{u.email ?? "-"}</td>
                  <td className="py-2.5">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        u.role === "ADMIN"
                          ? "bg-red-50 text-red-600"
                          : u.role === "ADVERTISER"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400 text-right text-xs">
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-500" />
              최근 등록 공고
            </h2>
            <Link
              href="/admin/jobs"
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              전체 보기 →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left pb-2 font-medium">공고명</th>
                <th className="text-left pb-2 font-medium">업체</th>
                <th className="text-left pb-2 font-medium">상태</th>
                <th className="text-right pb-2 font-medium">등록일</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((j) => (
                <tr
                  key={j.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-2.5 text-slate-700 font-medium max-w-[200px] truncate">
                    {j.title}
                  </td>
                  <td className="py-2.5 text-slate-500">
                    {j.company ?? "-"}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        j.status === "ACTIVE"
                          ? "bg-green-50 text-green-600"
                          : j.status === "REJECTED"
                            ? "bg-red-50 text-red-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {j.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400 text-right text-xs">
                    {new Date(j.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending reports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-500" />
            처리 대기 신고
          </h2>
          <Link
            href="/admin/reports"
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            전체 보기 →
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          {stats.pendingReports > 0
            ? `${stats.pendingReports}건의 신고가 처리를 기다리고 있습니다.`
            : "처리 대기중인 신고가 없습니다."}
        </p>
      </div>
    </div>
  );
}
