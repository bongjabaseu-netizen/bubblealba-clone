import Link from "next/link";
import { ChevronRight, LogOut, Settings, Coins, BookOpen, Headphones, Heart, Bookmark, FileText } from "lucide-react";
import { getProfile } from "@/lib/actions/users";
import { signOut } from "@/auth";
import { ThemeToggle } from "./theme-toggle";
import { PushToggle } from "./push-toggle";

export default async function MyPage() {
  const user = await getProfile();

  if (!user) {
    return (
      <div className="p-15px text-center font-14rg text-font-disabled">
        로그인이 필요합니다.
      </div>
    );
  }

  return (
    <>
      {/* 프로필 영역 */}
      <div className="flex items-center justify-between px-15px mt-12px">
        <div className="flex items-center gap-10px">
          <div className="w-10 h-10 rounded-full bg-bg-gray-50 flex items-center justify-center font-14sb text-font-gray">
            {(user.nickname ?? "?")[0]}
          </div>
          <span className="font-15sb text-font-black">{user.nickname ?? "회원"}</span>
        </div>
        <div className="flex items-center gap-12px">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="font-13rg text-font-disabled">로그아웃</button>
          </form>
          <Link href="/mypage/account" className="font-13rg text-font-black">계정설정</Link>
        </div>
      </div>

      <hr className="border-line-gray-20 mt-12px" />

      {/* 포인트 */}
      <Link href="/mypage/point" className="active-bg flex items-center justify-between px-15px h-44px">
        <span className="font-15rg text-font-black">포인트</span>
        <div className="flex items-center gap-5px">
          <span className="font-15sb text-font-black">{(user.points ?? 0).toLocaleString()}원</span>
          <ChevronRight className="h-18px w-18px text-font-disabled" strokeWidth={2} />
        </div>
      </Link>

      <hr className="border-line-gray-20" />

      {/* 내 활동 */}
      <MenuLink href="/mypage/favorite" icon={Heart} label="즐겨찾기" />
      <MenuLink href="/mypage/scrap" icon={Bookmark} label="스크랩" />
      <MenuLink href="/mypage/apply" icon={FileText} label="신청내역" />

      <hr className="border-line-gray-20" />

      {/* 메뉴 리스트 */}
      <MenuLink href="/info" icon={BookOpen} label="버블위키" />
      <MenuLink href="/info" icon={Headphones} label="고객센터" />
      <ThemeToggle />
      <PushToggle />

      <hr className="border-line-gray-20 mt-4px" />

      {/* 광고관리 */}
      <div className="px-15px mt-12px">
        <div className="flex items-center justify-between">
          <span className="font-14sb text-font-black">광고관리</span>
          <span className="font-12rg text-font-disabled">진행중인 광고가 없어요.</span>
        </div>
        <div className="flex gap-8px mt-10px">
          <Link href="/mypage/ad-center/profile" className="flex-1 rounded-10px border border-line-gray-50 p-12px text-left active-bg-gray">
            <span className="font-13rg text-font-gray">광고프로필</span>
            <div className="font-12rg text-font-disabled mt-3px">미등록</div>
          </Link>
          <Link href="/mypage/ad-center/profile" className="flex-1 rounded-10px border border-line-gray-50 p-12px text-left active-bg-gray">
            <span className="font-13rg text-font-gray">사업자정보</span>
            <div className="font-12rg text-font-disabled mt-3px">미등록</div>
          </Link>
        </div>
      </div>

      <hr className="border-line-gray-20 mt-12px" />

      {/* 광고구매/주문내역 */}
      <MenuLink href="/mypage/ad-center/buy" icon={Coins} label="광고구매" />
      <MenuLink href="/mypage/ad-center/orders" icon={Coins} label="주문내역" />

      <hr className="border-line-gray-20" />
    </>
  );
}

function MenuLink({ href, icon: Icon, label }: { href: string; icon: typeof ChevronRight; label: string }) {
  return (
    <Link href={href} className="active-bg flex items-center justify-between px-15px h-44px">
      <div className="flex items-center gap-10px">
        <Icon className="h-18px w-18px text-font-gray" strokeWidth={2} />
        <span className="font-15rg text-font-black">{label}</span>
      </div>
      <ChevronRight className="h-18px w-18px text-font-disabled" strokeWidth={2} />
    </Link>
  );
}
