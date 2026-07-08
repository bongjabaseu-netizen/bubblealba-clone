/** 관리자 배너 관리 */
import { adminGetBanners } from "@/lib/actions/banners";
import { BannerAdmin } from "./BannerAdmin";

export default async function AdminBannersPage() {
  const banners = await adminGetBanners();
  return <BannerAdmin banners={banners as any} />;
}
