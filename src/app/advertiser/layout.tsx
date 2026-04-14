/** 광고주 전용 레이아웃 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdvertiserSidebar } from "./AdvertiserSidebar";

export default async function AdvertiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as any)?.role;
  if (role !== "ADVERTISER" && role !== "ADMIN") redirect("/");

  const nickname = (session.user as any)?.nickname ?? session.user?.name ?? "광고주";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdvertiserSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{nickname}</span>님
            </span>
            <a href="/" className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-md px-3 py-1.5">
              사이트 보기
            </a>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
