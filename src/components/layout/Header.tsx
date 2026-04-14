"use client";

import { usePathname } from "next/navigation";
import { useUi } from "@/components/providers";

const TITLES: Record<string, string> = {
  "/": "채용정보",
  "/job": "채용정보",
  "/community": "커뮤니티",
  "/community/write": "글쓰기",
  "/chat": "채팅",
  "/notification": "알림",
  "/mypage": "내정보",
  "/mypage/account": "계정",
  "/mypage/point": "포인트",
  "/mypage/favorite": "즐겨찾기",
  "/mypage/scrap": "스크랩",
  "/mypage/apply": "신청 내역",
  "/info": "고객센터",
  "/legal": "약관",
  "/choicetalk": "초이스톡",
};

function getTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/job/detail")) return "공고 상세";
  if (pathname.startsWith("/community/detail")) return "게시글";
  if (pathname.startsWith("/fortune")) return "오늘의 운세";
  if (pathname.startsWith("/banner/")) return "상세보기";
  if (pathname.startsWith("/board/")) {
    const slug = pathname.split("/")[2];
    const names: Record<string, string> = {
      realestate: "부동산",
      "legal-consult": "법률상담",
      pets: "애견자랑",
      beauty: "미용",
    };
    return names[slug] ?? "게시판";
  }
  if (pathname.startsWith("/choicetalk/")) return "초이스톡";
  if (pathname.startsWith("/job/")) return "채용정보";
  return "버블알바";
}

export function Header() {
  const pathname = usePathname();
  const { isEmbed } = useUi();
  void isEmbed;
  const title = getTitle(pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mx-auto flex h-header max-w-mobile items-center justify-center border-b border-line-gray-20 bg-bg-white font-14sb text-font-black">
      {title}
    </header>
  );
}
