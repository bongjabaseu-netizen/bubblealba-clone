/** 부동산 매물 상세 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getListing } from "@/lib/actions/realestate";

const CATEGORY_LABEL: Record<string, string> = {
  ONEROOM: "원룸", TWOROOM: "투룸", THREEROOM: "쓰리룸",
  OFFICETEL: "오피스텔", APT: "아파트", VILLA: "빌라/다세대",
  STORE: "상가/사무실", ETC: "기타",
};

export default async function RealEstateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const images: string[] = JSON.parse((listing.images as string) || "[]");

  return (
    <div className="pb-20px">
      {/* 뒤로가기 */}
      <nav className="px-15px py-10px flex items-center gap-4px font-12rg text-font-gray">
        <Link href="/board/realestate" className="text-font-gray">부동산</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-font-black truncate max-w-[200px]">{listing.title}</span>
      </nav>

      {/* 사진 갤러리 */}
      {images.length > 0 && (
        <div className="flex gap-4px overflow-x-auto px-15px pb-8px snap-x snap-mandatory" style={{ WebkitOverflowScrolling: "touch" }}>
          {images.map((img, i) => (
            <div key={i} className="w-[260px] h-[180px] rounded-10px overflow-hidden bg-bg-gray-50 shrink-0 snap-start">
              <img src={img} alt={`사진 ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="px-15px">
        {/* 상태 + 카테고리 */}
        <div className="flex items-center gap-6px mt-8px">
          <span className={`px-6px py-2px rounded-6px font-10rg ${listing.status === "ACTIVE" ? "bg-green-100 text-green-700" : listing.status === "RESERVED" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>
            {listing.status === "ACTIVE" ? "등록중" : listing.status === "RESERVED" ? "예약중" : "거래완료"}
          </span>
          <span className="font-12rg text-font-disabled">{CATEGORY_LABEL[listing.category] ?? listing.category}</span>
        </div>

        {/* 제목 */}
        <h1 className="font-18sb text-font-black mt-8px leading-tight">{listing.title}</h1>

        {/* 가격 */}
        <div className="font-16sb text-primary mt-8px">{listing.priceType} {listing.price}</div>

        <hr className="border-line-gray-20 my-12px" />

        {/* 상세 정보 */}
        <section>
          <h2 className="font-15sb text-font-black mb-10px">매물 정보</h2>
          <dl className="grid grid-cols-2 gap-y-10px gap-x-16px">
            <div>
              <dt className="font-12rg text-font-gray mb-2px">지역</dt>
              <dd className="font-14sb text-font-black">{listing.region} {listing.city}</dd>
            </div>
            {listing.address && (
              <div>
                <dt className="font-12rg text-font-gray mb-2px">주소</dt>
                <dd className="font-14sb text-font-black">{listing.address}</dd>
              </div>
            )}
            {listing.deposit && (
              <div>
                <dt className="font-12rg text-font-gray mb-2px">보증금</dt>
                <dd className="font-14sb text-font-black">{listing.deposit}</dd>
              </div>
            )}
            {listing.area && (
              <div>
                <dt className="font-12rg text-font-gray mb-2px">면적</dt>
                <dd className="font-14sb text-font-black">{listing.area}</dd>
              </div>
            )}
            {listing.rooms && (
              <div>
                <dt className="font-12rg text-font-gray mb-2px">방/욕실</dt>
                <dd className="font-14sb text-font-black">{listing.rooms}</dd>
              </div>
            )}
            {listing.floor && (
              <div>
                <dt className="font-12rg text-font-gray mb-2px">층수</dt>
                <dd className="font-14sb text-font-black">{listing.floor}</dd>
              </div>
            )}
            <div>
              <dt className="font-12rg text-font-gray mb-2px">조회수</dt>
              <dd className="font-14sb text-font-black">{listing.views}</dd>
            </div>
          </dl>
        </section>

        <hr className="border-line-gray-20 my-12px" />

        {/* 설명 */}
        <section>
          <h2 className="font-15sb text-font-black mb-10px">상세 설명</h2>
          <p className="font-14rg text-font-black leading-relaxed whitespace-pre-line">{listing.description}</p>
        </section>

        <hr className="border-line-gray-20 my-12px" />

        {/* 문의 버튼 */}
        <button className="w-full h-44px rounded-10px bg-primary text-white font-15sb flex items-center justify-center gap-6px">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          문의하기
        </button>
      </div>
    </div>
  );
}
