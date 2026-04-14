/** 관리자 부동산 매물 관리 */
import { adminGetListings } from "@/lib/actions/realestate";
import { RealEstateAdmin } from "./RealEstateAdmin";

export default async function AdminRealEstatePage() {
  const listings = await adminGetListings();
  return <RealEstateAdmin listings={listings as any} />;
}
