/** 전문 변호사 쇼케이스 — 다크 네이비 법원 배경 히어로 + 1명씩 슬라이딩 + 5명 썸네일 화살표 (사용자 지시 2026-07-11, 레퍼런스 스타일)
 * 사진: public/lawyers/lawyer-1~5.png (AI 생성, 대법원 배경·팔짱·정장). 이 파일들만 덮어쓰면 즉시 교체됨. */
"use client";

import { useState, useEffect } from "react";

type Lawyer = { name: string; field: string; quote: string; photo: string; exp: string; career: string };

const FIRM = "명품법률";
// 프로필은 샘플 데이터(사용자 지시 2026-07-11) — 실제 변호사 정보로 교체 가능
const LAWYERS: Lawyer[] = [
  { name: "강태호", field: "회사·계약", quote: "기업의 든든한 법률 파트너", photo: "/lawyers/lawyer-1.png", exp: "경력 19년", career: "고려대 법학 · 前 대형로펌 기업자문팀" },
  { name: "최상현", field: "형사·고소", quote: "위기의 순간, 곁을 지킵니다", photo: "/lawyers/lawyer-2.png", exp: "경력 24년", career: "사법연수원 28기 · 前 서울중앙지검 검사" },
  { name: "이수진", field: "가족·상속", quote: "따뜻하게, 끝까지 함께합니다", photo: "/lawyers/lawyer-3.png", exp: "경력 15년", career: "이화여대 법전원 · 가사·상속 전문등록" },
  { name: "박현우", field: "민사·채권", quote: "받아야 할 돈, 끝까지 받아냅니다", photo: "/lawyers/lawyer-4.png", exp: "경력 12년", career: "성균관대 법전원 · 채권추심·강제집행 전문" },
  { name: "김정훈", field: "부동산·등기", quote: "믿음과 신뢰를 주는 변호사", photo: "/lawyers/lawyer-5.png", exp: "경력 20년", career: "서울대 법대 · 부동산 분쟁 전문등록" },
];

export function LegalExperts() {
  const [active, setActive] = useState(0);
  const n = LAWYERS.length;

  // 자동 슬라이딩 (5초)
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  const go = (d: number) => setActive((a) => (a + d + n) % n);

  return (
    <div className="mt-8px">
      {/* ===== 히어로 (좌측 슬라이딩 캐러셀 — 인물 우측 고정으로 프로필 안 가림, 사용자 지시 2026-07-11) ===== */}
      <div className="relative overflow-hidden h-[380px] bg-[#0b0e14]">
        {/* 슬라이딩 트랙 — active 위치로 좌측 이동 */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {LAWYERS.map((l, i) => (
            <div key={l.name} className="relative w-full h-full shrink-0 overflow-hidden bg-gradient-to-br from-[#0e2148] via-[#0b1a3a] to-[#081327]">
              {/* 좌측 장식 도형 — 저울(정의) 엠블럼 워터마크 */}
              <svg viewBox="0 0 24 24" className="absolute left-[6%] top-1/2 -translate-y-1/2 w-[180px] h-[180px] text-white/[0.05]" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden>
                <path d="M12 3v18M7 21h10M12 6l-7 2 3 6a3 3 0 0 1-6 0l3-6M12 6l7 2-3 6a3 3 0 0 0 6 0l-3-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* 우측 인물 존 (우측 58%) — 인물을 확실히 오른쪽으로, 좌측은 색상 패널 */}
              <div className="absolute right-0 top-0 h-full w-[58%]">
                <img
                  src={l.photo}
                  alt={`${l.name} 변호사`}
                  className="w-full h-full object-cover object-[center_top]"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {/* 좌측 페이드 — 인물 좌측을 색상 패널로 자연스럽게 연결 */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1a3a] via-[#0b1a3a]/30 to-transparent" />
              </div>

              {/* 텍스트 (좌측) */}
              <div className="relative z-10 h-full flex flex-col justify-center px-18px">
                {/* 액센트 바 도형 */}
                <div className="w-[24px] h-[3px] rounded-full bg-[#5b8cff] mb-12px" />
                <div className="flex items-center gap-6px mb-12px">
                  <span className="font-11rg tracking-wide text-white/65">당당하게 보여드리는 {FIRM}의 자신감</span>
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded bg-white/15 font-10rg text-white tabular-nums">{i + 1}</span>
                </div>

                <h2 className="text-[23px] font-extrabold leading-[1.25] text-white tracking-tight">
                  20년 경력 법무법인의
                  <br />
                  <span className="text-[#5b8cff]">탄탄한 변호사 구성</span>
                </h2>

                <div className="mt-16px max-w-[210px]">
                  <div className="text-[#5b8cff] text-[26px] leading-none font-bold">&ldquo;</div>
                  <p className="font-14rg text-white/85 mt-1px">{l.quote}</p>
                  <div className="text-[#5b8cff] text-[26px] leading-none font-bold text-right -mt-1px">&rdquo;</div>
                  <p className="mt-8px">
                    <span className="text-[18px] font-bold text-white">{l.name}</span>
                    <span className="font-13rg text-white/70 ml-4px">변호사</span>
                  </p>
                  {/* 프로필 (샘플) — 전문분야 배지 + 경력 + 학력/이력 */}
                  <div className="mt-6px flex items-center gap-5px">
                    <span className="inline-flex items-center h-[19px] px-6px rounded-full bg-[#5b8cff]/15 text-[#8fb4ff] font-11rg font-semibold">{l.field}</span>
                    <span className="font-11rg text-white/60">{l.exp}</span>
                  </div>
                  <p className="mt-4px font-11rg text-white/55 leading-[1.4]">{l.career}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 썸네일 슬라이더 (다크 + 좌우 화살표) ===== */}
      <div className="flex items-center gap-4px bg-[#081124] px-6px py-14px">
        <button type="button" onClick={() => go(-1)} aria-label="이전 변호사" className="shrink-0 w-8 h-8 flex items-center justify-center text-white/55 active:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        <div className="flex items-center gap-8px overflow-x-auto flex-1 justify-center">
          {LAWYERS.map((x, i) => (
            <button key={x.name} type="button" onClick={() => setActive(i)} aria-label={`${x.name} 변호사`} className="shrink-0">
              <img
                src={x.photo}
                alt={x.name}
                className={`w-[62px] h-[62px] object-cover rounded transition-all ${i === active ? "ring-2 ring-[#5b8cff] ring-offset-2 ring-offset-[#081124]" : "opacity-45"}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <button type="button" onClick={() => go(1)} aria-label="다음 변호사" className="shrink-0 w-8 h-8 flex items-center justify-center text-white/55 active:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
