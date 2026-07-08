/** 관리자 입찰승인 — PENDING 입찰 승인/거절 처리 (50만원 초과 ADMIN_APPROVE 건) */
import { getAdminBids } from "@/lib/actions/admin";
import { BidsClient } from "./BidsClient";

export default async function AdminBidsPage() {
  const bids = await getAdminBids();
  return <BidsClient bids={bids} />;
}
