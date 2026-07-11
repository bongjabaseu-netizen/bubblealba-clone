/** 관리자 부동산 매물 관리 — 목록은 클라이언트가 /api/admin/listings로 페이지네이션 로드 */
import { RealEstateAdmin } from "./RealEstateAdmin";

export const dynamic = "force-dynamic";

export default function AdminRealEstatePage() {
  return <RealEstateAdmin />;
}
