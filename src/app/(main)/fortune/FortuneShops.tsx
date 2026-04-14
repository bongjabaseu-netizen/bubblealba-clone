/** 점집 — 광고 배너 + 점집 리스트 + 리뷰 */
"use client";

import { useState } from "react";

interface Shop {
  id: string;
  name: string;
  emoji: string;
  category: string;
  region: string;
  rating: number;
  reviewCount: number;
  description: string;
  phone: string;
  address: string;
  tags: string[];
  reviews: Review[];
}

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const SHOPS: Shop[] = [
  {
    id: "1", name: "신점 용한보살", emoji: "🔮", category: "신점", region: "서울 강남구",
    rating: 4.8, reviewCount: 234, description: "30년 경력 신점 전문. 사업운, 궁합, 택일 상담. 정확한 신점으로 유명합니다.",
    phone: "02-1234-5678", address: "서울 강남구 역삼동 123", tags: ["신점", "사업운", "궁합"],
    reviews: [
      { id: "r1", author: "김**", rating: 5, text: "정말 잘 맞아요. 사업 관련해서 정확하게 짚어주셨어요.", date: "2026.04.10" },
      { id: "r2", author: "이**", rating: 5, text: "친구 소개로 갔는데 소름 끼칠 정도로 잘 맞았습니다.", date: "2026.04.08" },
      { id: "r3", author: "박**", rating: 4, text: "친절하시고 상담이 꼼꼼해요. 재방문 의사 있습니다.", date: "2026.04.05" },
    ],
  },
  {
    id: "2", name: "사주카페 운명", emoji: "☕", category: "사주", region: "서울 홍대입구",
    rating: 4.5, reviewCount: 189, description: "카페에서 편하게 사주 상담. 연애운, 취업운 전문. MZ세대 인기 1위.",
    phone: "02-9876-5432", address: "서울 마포구 서교동 456", tags: ["사주", "연애운", "카페"],
    reviews: [
      { id: "r4", author: "최**", rating: 5, text: "분위기 좋고 커피도 맛있어요. 사주도 잘 봐주십니다.", date: "2026.04.12" },
      { id: "r5", author: "정**", rating: 4, text: "친구랑 재미로 갔는데 생각보다 잘 맞아서 놀랐어요.", date: "2026.04.09" },
    ],
  },
  {
    id: "3", name: "타로 미스틱", emoji: "🃏", category: "타로", region: "서울 이태원",
    rating: 4.7, reviewCount: 156, description: "타로 전문점. 연애, 진로, 재물 상담. 영어 상담 가능.",
    phone: "02-5555-1234", address: "서울 용산구 이태원동 789", tags: ["타로", "연애", "영어가능"],
    reviews: [
      { id: "r6", author: "한**", rating: 5, text: "타로 정확도가 놀라워요. 3개월 후 정확히 맞았습니다.", date: "2026.04.11" },
      { id: "r7", author: "윤**", rating: 4, text: "외국인 친구와 같이 갔는데 영어로도 잘 상담해주셔요.", date: "2026.04.07" },
    ],
  },
  {
    id: "4", name: "관상연구소", emoji: "👤", category: "관상", region: "서울 종로",
    rating: 4.6, reviewCount: 98, description: "관상, 수상 전문. 40년 경력 관상학 박사. TV 출연 다수.",
    phone: "02-3333-4444", address: "서울 종로구 인사동 234", tags: ["관상", "수상", "TV출연"],
    reviews: [
      { id: "r8", author: "강**", rating: 5, text: "TV에서 보고 갔는데 실제로도 정말 잘 보세요.", date: "2026.04.13" },
    ],
  },
  {
    id: "5", name: "무당집 천지신명", emoji: "🪬", category: "굿/무속", region: "경기 파주",
    rating: 4.3, reviewCount: 67, description: "대한민국 3대 무당. 굿, 부적, 액막이 전문. 예약 필수.",
    phone: "031-7777-8888", address: "경기 파주시 문산읍 567", tags: ["굿", "부적", "액막이"],
    reviews: [
      { id: "r9", author: "서**", rating: 5, text: "어머니 모시고 갔는데 정말 신기했어요. 가족 관련 정확했습니다.", date: "2026.04.06" },
      { id: "r10", author: "조**", rating: 4, text: "멀리서 갈 만한 가치가 있습니다.", date: "2026.04.01" },
    ],
  },
  {
    id: "6", name: "풍수인테리어 복래", emoji: "🧭", category: "풍수", region: "서울 강남구",
    rating: 4.4, reviewCount: 45, description: "풍수지리 인테리어 전문. 사무실, 주거 공간 풍수 컨설팅.",
    phone: "02-8888-9999", address: "서울 강남구 삼성동 890", tags: ["풍수", "인테리어", "사무실"],
    reviews: [
      { id: "r11", author: "임**", rating: 5, text: "사무실 풍수 컨설팅 받고 사업이 잘 풀렸어요!", date: "2026.04.04" },
    ],
  },
];

const CATEGORIES = ["전체", "신점", "사주", "타로", "관상", "굿/무속", "풍수"];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="font-12rg text-yellow-500">
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span className="text-font-gray ml-2px">{rating.toFixed(1)}</span>
    </span>
  );
}

export function FortuneShops() {
  const [filter, setFilter] = useState("전체");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  const filtered = filter === "전체" ? SHOPS : SHOPS.filter(s => s.category === filter);

  if (selectedShop) {
    return (
      <div className="pb-20px">
        {/* 뒤로가기 */}
        <button onClick={() => { setSelectedShop(null); setShowReviews(false); }}
          className="flex items-center gap-4px px-15px py-10px font-13rg text-font-gray active-bg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 19l-7-7 7-7" /></svg>
          점집 목록
        </button>

        {/* 점집 상세 */}
        <div className="px-15px">
          <div className="text-center py-16px">
            <div className="text-5xl mb-8px">{selectedShop.emoji}</div>
            <h2 className="font-18sb text-font-black">{selectedShop.name}</h2>
            <div className="mt-4px"><StarRating rating={selectedShop.rating} /></div>
            <span className="font-12rg text-font-disabled ml-4px">리뷰 {selectedShop.reviewCount}개</span>
          </div>

          <div className="flex gap-6px flex-wrap mb-12px justify-center">
            {selectedShop.tags.map(tag => (
              <span key={tag} className="px-8px py-3px rounded-6px bg-purple-100 text-purple-700 font-10rg">{tag}</span>
            ))}
          </div>

          <hr className="border-line-gray-20 mb-12px" />

          <p className="font-14rg text-font-black leading-relaxed mb-12px">{selectedShop.description}</p>

          <dl className="space-y-8px mb-16px">
            <div className="flex gap-10px">
              <dt className="font-13rg text-font-gray shrink-0">📍 주소</dt>
              <dd className="font-14rg text-font-black">{selectedShop.address}</dd>
            </div>
            <div className="flex gap-10px">
              <dt className="font-13rg text-font-gray shrink-0">📞 전화</dt>
              <dd className="font-14sb text-primary">{selectedShop.phone}</dd>
            </div>
          </dl>

          <a href={`tel:${selectedShop.phone}`}
            className="flex w-full h-44px rounded-10px bg-primary text-white font-15sb items-center justify-center gap-4px mb-12px">
            📞 전화 문의
          </a>

          {/* 탭: 정보/리뷰 */}
          <div className="flex border-b border-line-gray-20 mb-12px">
            <button onClick={() => setShowReviews(false)}
              className={`flex-1 py-10px font-13rg text-center ${!showReviews ? "font-14sb text-font-black border-b-2 border-purple-500" : "text-font-gray"}`}>
              정보
            </button>
            <button onClick={() => setShowReviews(true)}
              className={`flex-1 py-10px font-13rg text-center ${showReviews ? "font-14sb text-font-black border-b-2 border-purple-500" : "text-font-gray"}`}>
              리뷰 ({selectedShop.reviews.length})
            </button>
          </div>

          {showReviews ? (
            /* 리뷰 목록 */
            <ul className="space-y-10px">
              {selectedShop.reviews.map(review => (
                <li key={review.id} className="rounded-14px border border-line-gray-20 p-12px">
                  <div className="flex items-center justify-between mb-4px">
                    <span className="font-14sb text-font-black">{review.author}</span>
                    <span className="font-12rg text-font-disabled">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="font-13rg text-font-gray mt-6px">{review.text}</p>
                </li>
              ))}
              {selectedShop.reviews.length === 0 && (
                <li className="text-center py-20px font-14rg text-font-disabled">아직 리뷰가 없습니다</li>
              )}
            </ul>
          ) : (
            /* 상세 정보 */
            <div className="rounded-14px bg-bg-gray-20 p-12px">
              <h3 className="font-14sb text-font-black mb-8px">상담 안내</h3>
              <ul className="space-y-4px font-13rg text-font-gray">
                <li>• 카테고리: {selectedShop.category}</li>
                <li>• 지역: {selectedShop.region}</li>
                <li>• 평점: {selectedShop.rating}점 ({selectedShop.reviewCount}개 리뷰)</li>
                <li>• 예약 상담 가능</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 광고 배너 */}
      <div className="px-15px mt-8px space-y-6px">
        <div className="rounded-14px bg-gradient-to-r from-purple-600 to-indigo-700 p-15px">
          <div className="text-white">
            <div className="font-12rg opacity-80">점집 광고</div>
            <div className="font-16sb mt-2px">나의 운명을 알고 싶다면?</div>
            <div className="font-13rg opacity-70 mt-4px">전국 유명 점집 · 리뷰 확인 후 방문하세요</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6px">
          <div className="rounded-10px bg-gradient-to-br from-pink-400 to-rose-500 p-10px">
            <div className="text-white text-center">
              <div className="text-xl">🔮</div>
              <div className="font-12sb mt-2px">신점 상담</div>
              <div className="font-10rg opacity-80">정확한 신점</div>
            </div>
          </div>
          <div className="rounded-10px bg-gradient-to-br from-indigo-400 to-blue-500 p-10px">
            <div className="text-white text-center">
              <div className="text-xl">🃏</div>
              <div className="font-12sb mt-2px">타로 상담</div>
              <div className="font-10rg opacity-80">연애·진로</div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-6px px-15px mt-12px overflow-x-auto pb-4px">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`shrink-0 rounded-14px px-12px h-button font-13rg ${
              filter === cat ? "bg-font-black text-bg-white" : "border border-line-gray-50 text-font-black"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="px-15px mt-8px">
        <span className="font-13rg text-font-disabled">{filtered.length}개 점집</span>
      </div>

      {/* 점집 리스트 */}
      <ul className="mt-4px">
        {filtered.map(shop => (
          <li key={shop.id} className="border-b border-line-gray-20">
            <button onClick={() => setSelectedShop(shop)}
              className="w-full flex gap-12px px-15px py-12px active-bg text-left">
              <div className="w-[56px] h-[56px] rounded-14px bg-purple-100 flex items-center justify-center text-2xl shrink-0">
                {shop.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-6px">
                  <span className="font-15sb text-font-black">{shop.name}</span>
                  <span className="px-4px py-1px rounded bg-purple-50 text-purple-600 font-10rg">{shop.category}</span>
                </div>
                <div className="mt-2px"><StarRating rating={shop.rating} />
                  <span className="font-12rg text-font-disabled ml-4px">({shop.reviewCount})</span>
                </div>
                <div className="font-12rg text-font-disabled mt-2px">{shop.region}</div>
              </div>
              <svg className="w-4 h-4 text-font-disabled self-center shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
