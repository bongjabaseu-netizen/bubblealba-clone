/** 배너 상세 페이지 — 큰 사진 + 상세 내용 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBannerDetail } from "@/lib/actions/banners";

const TYPE_LABEL: Record<string, string> = {
  PETS_SHOP: "애견샵",
  LEGAL_AD: "법률상담",
  BEAUTY_SALON: "미용실",
  BEAUTY_NAIL: "네일아트",
  BEAUTY_SURGERY: "성형",
  IMAGE_TOP: "광고",
  IMAGE_MID: "광고",
  IMAGE_BOT: "광고",
};

const TYPE_BACK: Record<string, string> = {
  PETS_SHOP: "/board/pets",
  LEGAL_AD: "/board/legal-consult",
  BEAUTY_SALON: "/board/beauty?tab=salon",
  BEAUTY_NAIL: "/board/beauty?tab=nail",
  BEAUTY_SURGERY: "/board/beauty?tab=surgery",
  IMAGE_TOP: "/",
  IMAGE_MID: "/",
  IMAGE_BOT: "/",
};

export default async function BannerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getBannerDetail(id);
  if (!banner) notFound();

  const backUrl = TYPE_BACK[banner.type] ?? "/";
  const typeLabel = TYPE_LABEL[banner.type] ?? "광고";

  return (
    <div className="pb-20px">
      {/* 뒤로가기 */}
      <nav className="px-15px py-10px flex items-center gap-4px font-12rg text-font-gray">
        <Link href={backUrl} className="text-font-gray">{typeLabel}</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-font-black truncate max-w-[200px]">{banner.title ?? "상세"}</span>
      </nav>

      {/* 큰 사진 */}
      {banner.imageUrl && (
        <div className="w-full aspect-[4/3] bg-bg-gray-50">
          <img src={banner.imageUrl} alt={banner.title ?? ""} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-15px mt-16px">
        {/* 카테고리 뱃지 */}
        <span className="px-8px py-3px rounded-6px bg-primary/10 text-primary font-12rg">{typeLabel}</span>

        {/* 제목 */}
        <h1 className="font-18sb text-font-black mt-8px leading-tight">{banner.title ?? "광고"}</h1>

        <hr className="border-line-gray-20 my-16px" />

        {/* 상세 설명 */}
        {banner.description && (
          <section className="mb-16px">
            <h2 className="font-15sb text-font-black mb-8px">상세 내용</h2>
            <p className="font-14rg text-font-black leading-relaxed whitespace-pre-line">{banner.description}</p>
          </section>
        )}

        {/* 정보 */}
        {(banner.address || banner.phone) && (
          <>
            <hr className="border-line-gray-20 mb-16px" />
            <section className="mb-16px">
              <h2 className="font-15sb text-font-black mb-8px">정보</h2>
              <dl className="space-y-8px">
                {banner.address && (
                  <div className="flex gap-12px">
                    <dt className="font-13rg text-font-gray shrink-0 w-[50px]">📍 주소</dt>
                    <dd className="font-14rg text-font-black">{banner.address}</dd>
                  </div>
                )}
                {banner.phone && (
                  <div className="flex gap-12px">
                    <dt className="font-13rg text-font-gray shrink-0 w-[50px]">📞 전화</dt>
                    <dd className="font-14sb text-primary">{banner.phone}</dd>
                  </div>
                )}
              </dl>
            </section>
          </>
        )}

        <hr className="border-line-gray-20 mb-16px" />

        {/* 문의 버튼 */}
        {banner.phone && (
          <a href={`tel:${banner.phone}`} className="w-full h-44px rounded-10px bg-primary text-white font-15sb flex items-center justify-center gap-6px">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            전화 문의
          </a>
        )}

        {/* 목록으로 */}
        <Link href={backUrl} className="block w-full h-44px rounded-10px border border-line-gray-50 font-14sb text-font-gray text-center leading-[44px] mt-8px active-bg">
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
