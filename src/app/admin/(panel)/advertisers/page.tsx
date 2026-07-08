/** 관리자 광고주인증 — 사업자 프로필 인증 처리 (거절은 스키마에 상태 없어 미지원) */
import { getAdvertiserProfiles } from "@/lib/actions/admin";
import { AdvertisersClient } from "./AdvertisersClient";

export default async function AdminAdvertisersPage() {
  const profiles = await getAdvertiserProfiles();
  return <AdvertisersClient profiles={profiles} />;
}
