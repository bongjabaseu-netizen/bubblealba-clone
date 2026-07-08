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
        {/* 헤더 + 공간 확보 스페이서는 Header 내부에서 렌더 (홈에서는 함께 숨김) */}
        <Header />
        <CategoryIcons />
        <div className="flex flex-col pb-bottom-padding">{children}</div>
        <BottomTab />
      </main>
    </div>
  );
}
