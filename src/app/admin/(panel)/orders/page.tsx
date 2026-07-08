/** 관리자 광고거래 — AdOrder 거래 내역 조회 (cgimall §14 결제내역 대응) */
import { getAdminAdOrders } from "@/lib/actions/ads";
import { OrdersClient } from "./OrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getAdminAdOrders();
  return <OrdersClient orders={orders} />;
}
