import { Header } from "@/components/layout/Header";
import { BottomTab } from "@/components/layout/BottomTab";
import { CategoryIcons } from "./components/CategoryIcons";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-bg-white">
      <main className="relative box-content w-full max-w-mobile border-x border-line-gray-20">
        {/* 헤더 공간 확보 */}
        <div className="h-header" aria-hidden="true" />
        <Header />
        <CategoryIcons />
        <div className="flex flex-col pb-bottom-padding">{children}</div>
        <BottomTab />
      </main>
    </div>
  );
}
