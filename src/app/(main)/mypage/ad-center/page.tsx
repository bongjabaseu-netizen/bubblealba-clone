import Link from "next/link";
import { ChevronRight, ShoppingCart, ClipboardList, Building2 } from "lucide-react";
import { getAdvertiserProfile, getAdOrders } from "@/lib/actions/ads";

export default async function AdCenterPage() {
  const [profile, orders] = await Promise.all([
    getAdvertiserProfile(),
    getAdOrders(),
  ]);

  const activeOrders = orders.filter(
    (o) => o.status === "COMPLETED" && new Date(o.endDate) > new Date()
  );

  return (
    <div>
      {/* 헤더 */}
      <div className="px-15px mt-12px mb-8px">
        <h1 className="font-18sb text-font-black">광고센터</h1>
      </div>

      <hr className="border-line-gray-20" />

      {/* 프로필 상태 */}
      <div className="px-15px py-12px">
        <div className="rounded-14px border border-line-gray-20 p-12px">
          <div className="flex items-center justify-between">
            <span className="font-14sb text-font-black">광고프로필</span>
            {profile ? (
              <span className="font-12rg px-6px py-2px rounded-4px bg-green-50 text-green-700">
                {profile.verified ? "인증완료" : "등록됨"}
              </span>
            ) : (
              <span className="font-12rg px-6px py-2px rounded-4px bg-bg-gray-50 text-font-disabled">
                미등록
              </span>
            )}
          </div>
          {profile ? (
            <p className="font-13rg text-font-gray mt-4px">
              {profile.businessName} &middot; {profile.representative}
            </p>
          ) : (
            <p className="font-13rg text-font-disabled mt-4px">
              광고를 구매하려면 프로필을 먼저 등록하세요.
            </p>
          )}
        </div>
      </div>

      {/* 진행중 광고 */}
      {activeOrders.length > 0 && (
        <div className="px-15px pb-8px">
          <div className="rounded-10px bg-bg-gray-50 px-12px py-10px">
            <span className="font-13rg text-font-gray">
              진행중인 광고 <span className="font-14sb text-font-black">{activeOrders.length}건</span>
            </span>
          </div>
        </div>
      )}

      <hr className="border-line-gray-20" />

      {/* 메뉴 */}
      <QuickLink href="/mypage/ad-center/buy" icon={ShoppingCart} label="광고 구매" />
      <QuickLink href="/mypage/ad-center/orders" icon={ClipboardList} label="주문내역" />
      <QuickLink href="/mypage/ad-center/profile" icon={Building2} label="광고프로필" />

      <hr className="border-line-gray-20" />
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof ChevronRight;
  label: string;
}) {
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
