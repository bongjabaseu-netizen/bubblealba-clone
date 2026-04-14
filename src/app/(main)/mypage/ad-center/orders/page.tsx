import Link from "next/link";
import { getAdOrders } from "@/lib/actions/ads";
import { CancelButton } from "./cancel-button";

const STATUS_META: Record<string, { label: string; color: string }> = {
  COMPLETED: { label: "완료", color: "bg-green-50 text-green-700" },
  PENDING: { label: "대기중", color: "bg-yellow-50 text-yellow-700" },
  EXPIRED: { label: "만료", color: "bg-bg-gray-50 text-font-disabled" },
  CANCELLED: { label: "취소됨", color: "bg-red-50 text-red-700" },
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function OrdersPage() {
  const orders = await getAdOrders();

  return (
    <div className="px-15px py-16px space-y-16px">
      <div>
        <h1 className="font-18sb text-font-black mb-4px">주문내역</h1>
        <p className="font-13rg text-font-gray">광고 구매 내역</p>
      </div>

      {orders.length === 0 ? (
        <p className="font-13rg text-font-disabled">주문 내역이 없습니다.</p>
      ) : (
        <div className="space-y-10px">
          {orders.map((order) => {
            const status = STATUS_META[order.status] ?? STATUS_META.PENDING;
            return (
              <div
                key={order.id}
                className="rounded-14px border border-line-gray-20 p-12px space-y-6px"
              >
                <div className="flex items-center justify-between">
                  <span className="font-15sb text-font-black">
                    {order.package.name}
                  </span>
                  <span
                    className={`font-11rg px-6px py-2px rounded-4px ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-8px font-13rg text-font-gray">
                  <span>{order.package.durationDays}일</span>
                  <span>&middot;</span>
                  <span>{order.amount.toLocaleString()}원</span>
                </div>

                <div className="font-12rg text-font-disabled">
                  {formatDate(order.startDate)} ~ {formatDate(order.endDate)}
                </div>

                {order.job && (
                  <div className="font-12rg text-font-gray">
                    공고: {order.job.title}
                  </div>
                )}

                {order.status === "PENDING" && (
                  <CancelButton orderId={order.id} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/mypage/ad-center"
        className="block text-center font-13rg text-font-disabled"
      >
        광고센터로 돌아가기
      </Link>
    </div>
  );
}
