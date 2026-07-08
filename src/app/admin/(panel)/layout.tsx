/**
 * 관리자 패널 레이아웃 — sample-01 다크 네이비 씬 + 사이드바 + 헤더
 * from: sample-01.html (admin-samples)
 * 라우트 그룹 (panel): /admin/login 은 이 그룹 밖이라 레이아웃이 적용되지 않음.
 * (기존 referer 추측 방식은 로그인 직후 사이드바가 사라지는 버그가 있어 제거)
 */
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 신고 대기 배지 카운트 — 원격 DB 왕복(~1.3초)을 매 페이지 이동마다 하지 않도록 30초 메모리 캐시
let badgeCache: { value: number; ts: number } | null = null;
async function getPendingReportsCached(): Promise<number | undefined> {
  if (badgeCache && Date.now() - badgeCache.ts < 30_000) return badgeCache.value;
  try {
    const value = await prisma.report.count({ where: { status: "PENDING" } });
    badgeCache = { value, ts: Date.now() };
    return value;
  } catch {
    return badgeCache?.value; // 조회 실패 시 이전 값 유지 (없으면 배지 숨김)
  }
}

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 미로그인 → 로그인 페이지로 (로그인 페이지는 그룹 밖 독립 화면)
  if (!session) {
    redirect("/admin/login");
  }

  const nickname =
    (session.user as any)?.nickname ?? session.user?.name ?? "관리자";
  const email = session.user?.email ?? undefined;

  // 신고 대기 건수 — 관리자 세션일 때만 조회 (30초 캐시, undefined 면 배지 숨김)
  const isAdmin = (session.user as { role?: string } | undefined)?.role === "ADMIN";
  const pendingReports = isAdmin ? await getPendingReportsCached() : undefined;

  return (
    <div className="flex min-h-screen admin-scene text-slate-200">
      <AdminSidebar nickname={nickname} email={email} pendingReports={pendingReports} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader pendingReports={pendingReports} />
        {/* 본문 */}
        <main className="flex-1 px-8 py-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
