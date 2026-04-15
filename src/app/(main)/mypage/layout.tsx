export const dynamic = "force-dynamic";
/** mypage 레이아웃 — 모바일 패스스루 (자식 페이지가 직접 UI 구성) */
export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
