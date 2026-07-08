import { Users, Briefcase, MessageSquare, Flag, Gavel, CreditCard } from "lucide-react";
import {
  getAdminStats,
  getRecentUsers,
  getRecentJobs,
  getTodayStats,
  getPaymentStats,
} from "@/lib/actions/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

/** 권한/상태 배지 공통 클래스 */
const BADGE = "px-2 py-0.5 rounded-md text-[11px] font-bold";

function roleBadgeClass(role: string) {
  if (role === "ADMIN") return `${BADGE} bg-red-400/15 text-red-400`;
  if (role === "ADVERTISER") return `${BADGE} bg-brand/15 text-brand`;
  return `${BADGE} bg-navy-700 text-slate-300`;
}

function statusBadgeClass(status: string) {
  if (status === "ACTIVE") return `${BADGE} bg-emerald-400/15 text-emerald-400`;
  if (status === "REJECTED") return `${BADGE} bg-red-400/15 text-red-400`;
  return `${BADGE} bg-navy-700 text-slate-300`;
}

export default async function AdminDashboard() {
  let stats, recentUsers, recentJobs, today, payment;
  try {
    [stats, recentUsers, recentJobs, today, payment] = await Promise.all([
      getAdminStats(),
      getRecentUsers(5),
      getRecentJobs(5),
      getTodayStats(),
      getPaymentStats(),
    ]);
  } catch {
    redirect("/admin/login");
  }

  const cards = [
    {
      label: "회원",
      value: stats.totalUsers.toLocaleString(),
      today: today.todayUsers,
      icon: Users,
      href: "/admin/users",
      emphasized: false,
    },
    {
      label: "공고",
      value: stats.totalJobs.toLocaleString(),
      today: today.todayJobs,
      icon: Briefcase,
      href: "/admin/jobs",
      emphasized: false,
    },
    {
      label: "게시물",
      value: stats.totalPosts.toLocaleString(),
      today: today.todayPosts,
      icon: MessageSquare,
      href: "/admin/posts",
      emphasized: false,
    },
    {
      label: "대기 신고",
      value: stats.pendingReports.toString(),
      today: null,
      icon: Flag,
      href: "/admin/reports",
      emphasized: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* KPI 4카드 */}
      <section className="grid grid-cols-4 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className={`rounded-2xl border p-5 shadow-card transition-colors ${
                c.emphasized
                  ? "border-brand/40 bg-gradient-to-br from-navy-850 via-navy-850 to-brand/10"
                  : "bg-navy-850/90 border-line hover:border-brand/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-mute text-[12px] font-semibold">{c.label}</span>
                <Icon className={`w-4 h-4 ${c.emphasized ? "text-brand" : "text-mute"}`} />
              </div>
              <div
                className={`mt-2 text-[30px] font-extrabold tracking-tight ${
                  c.emphasized ? "text-brand" : "text-white"
                }`}
              >
                {c.value}
              </div>
              <div className="mt-1 text-[11.5px]">
                {c.today !== null && c.today > 0 ? (
                  <>
                    <span className="text-emerald-400 font-bold">▲ {c.today}</span>{" "}
                    <span className="text-mute">오늘</span>
                  </>
                ) : c.today !== null ? (
                  <span className="text-mute">오늘 신규 없음</span>
                ) : (
                  <span className="text-mute">처리 대기 현황</span>
                )}
              </div>
            </Link>
          );
        })}
      </section>

      {/* 결제 현황 (cgimall §10 대시보드 결제통계 대응) — AdOrder+AdBid 승인분 합산 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gold" />
            <h2 className="text-[14px] font-bold text-white">결제 현황</h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-[12px] text-brand font-semibold hover:underline"
          >
            거래 내역 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {[
            { label: "총 결제액", value: `${payment.totalRevenue.toLocaleString()}원`, gold: true },
            { label: "결제 건수", value: `${payment.totalCount.toLocaleString()}건`, gold: false },
            { label: "평균 결제금액", value: `${payment.avgAmount.toLocaleString()}원`, gold: false },
            { label: "오늘 결제액", value: `${payment.todayRevenue.toLocaleString()}원`, gold: false },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-navy-850/90 border border-line p-5 shadow-card"
            >
              <div className="text-mute text-[12px] font-semibold">{s.label}</div>
              <div
                className={`mt-2 text-[24px] font-extrabold tracking-tight ${
                  s.gold ? "text-gold" : "text-white"
                }`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 처리 대기 액션 카드 */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <h2 className="text-[14px] font-bold text-white">처리 대기</h2>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <Link
            href="/admin/reports"
            className="group flex items-center gap-4 rounded-2xl bg-navy-850/90 border border-line hover:border-red-400/70 p-4 transition shadow-card"
          >
            <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-bold text-white">
                신고 처리 대기{" "}
                <span className="text-red-400">{stats.pendingReports}건</span>
              </div>
              <div className="text-[11.5px] text-mute mt-0.5">
                {stats.pendingReports > 0
                  ? "처리 대기중인 신고가 있습니다"
                  : "처리 대기중인 신고가 없습니다"}
              </div>
            </div>
            <span className="text-mute group-hover:text-red-400 transition">→</span>
          </Link>

          {/* 입찰 승인 대기 */}
          <Link
            href="/admin/bids"
            className="group flex items-center gap-4 rounded-2xl bg-navy-850/90 border border-line hover:border-brand/70 p-4 transition shadow-card"
          >
            <div className="w-11 h-11 rounded-xl bg-brand/15 text-brand flex items-center justify-center shrink-0">
              <Gavel className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-bold text-white">
                입찰 승인 대기{" "}
                <span className="text-brand">{payment.pendingBids}건</span>
              </div>
              <div className="text-[11.5px] text-mute mt-0.5">
                {payment.pendingBids > 0
                  ? "승인 대기중인 입찰이 있습니다"
                  : "승인 대기중인 입찰이 없습니다"}
              </div>
            </div>
            <span className="text-mute group-hover:text-brand transition">→</span>
          </Link>

          {/* 광고주 인증 대기 */}
          <Link
            href="/admin/advertisers"
            className="group flex items-center gap-4 rounded-2xl bg-navy-850/90 border border-line hover:border-emerald-400/70 p-4 transition shadow-card"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-bold text-white">
                광고주 인증 대기{" "}
                <span className="text-emerald-400">{payment.unverifiedAdvertisers}명</span>
              </div>
              <div className="text-[11.5px] text-mute mt-0.5">
                {payment.unverifiedAdvertisers > 0
                  ? "인증 대기중인 광고주가 있습니다"
                  : "인증 대기중인 광고주가 없습니다"}
              </div>
            </div>
            <span className="text-mute group-hover:text-emerald-400 transition">→</span>
          </Link>
        </div>
      </section>

      {/* 최근 가입 회원 / 최근 등록 공고 */}
      <section className="grid grid-cols-2 gap-5">
        {/* 최근 가입 회원 */}
        <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
            <h2 className="text-[14px] font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand" />
              최근 가입 회원
            </h2>
            <Link
              href="/admin/users"
              className="text-[12px] text-brand font-semibold hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
                <th className="px-5 py-2.5 font-semibold">닉네임</th>
                <th className="px-3 py-2.5 font-semibold">이메일</th>
                <th className="px-3 py-2.5 font-semibold">권한</th>
                <th className="px-5 py-2.5 font-semibold text-right">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50 text-slate-300">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-navy-800/40">
                  <td className="px-5 py-3 text-white font-semibold">
                    {u.nickname ?? "-"}
                  </td>
                  <td className="px-3 py-3 truncate max-w-[160px]">{u.email ?? "-"}</td>
                  <td className="px-3 py-3">
                    <span className={roleBadgeClass(u.role)}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-mute">
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 최근 등록 공고 */}
        <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
            <h2 className="text-[14px] font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand" />
              최근 등록 공고
            </h2>
            <Link
              href="/admin/jobs"
              className="text-[12px] text-brand font-semibold hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
                <th className="px-5 py-2.5 font-semibold">공고명</th>
                <th className="px-3 py-2.5 font-semibold">업체</th>
                <th className="px-3 py-2.5 font-semibold">상태</th>
                <th className="px-5 py-2.5 font-semibold text-right">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50 text-slate-300">
              {recentJobs.map((j) => (
                <tr key={j.id} className="hover:bg-navy-800/40">
                  <td className="px-5 py-3 text-white font-semibold max-w-[200px] truncate">
                    {j.title}
                  </td>
                  <td className="px-3 py-3">{j.company ?? "-"}</td>
                  <td className="px-3 py-3">
                    <span className={statusBadgeClass(j.status)}>{j.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-mute">
                    {new Date(j.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
