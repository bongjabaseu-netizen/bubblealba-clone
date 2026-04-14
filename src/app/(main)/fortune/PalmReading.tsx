/** 손금 분석 — 준비 중 플레이스홀더 */
"use client";

export function PalmReading() {
  return (
    <div className="px-15px mt-20px pb-20px">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {/* 카메라 아이콘 */}
        <div className="w-[100px] h-[100px] rounded-full bg-bg-white border-2 border-line-gray-20 flex items-center justify-center mb-20px">
          <span className="text-5xl">🤚</span>
        </div>

        <h2 className="font-18sb text-font-black mb-8px">손금 분석</h2>
        <p className="font-14rg text-font-gray text-center mb-4px">
          준비 중입니다.
        </p>
        <p className="font-14rg text-font-gray text-center mb-20px">
          곧 손금 분석 기능이 추가됩니다.
        </p>

        {/* 카메라 아이콘 + 안내 */}
        <div className="rounded-14px border border-line-gray-20 bg-bg-white p-15px w-full">
          <div className="flex items-center gap-12px mb-12px">
            <div className="w-[44px] h-[44px] rounded-10px bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-2xl">📷</span>
            </div>
            <div>
              <div className="font-15sb text-font-black">AI 손금 분석</div>
              <div className="font-12rg text-font-gray mt-2px">손바닥 사진으로 운세를 분석해요</div>
            </div>
          </div>

          <div className="space-y-8px">
            <div className="flex items-center gap-8px">
              <span className="w-[20px] h-[20px] rounded-full bg-indigo-100 flex items-center justify-center font-10rg text-indigo-600 shrink-0">1</span>
              <span className="font-13rg text-font-gray">손바닥 사진 촬영</span>
            </div>
            <div className="flex items-center gap-8px">
              <span className="w-[20px] h-[20px] rounded-full bg-indigo-100 flex items-center justify-center font-10rg text-indigo-600 shrink-0">2</span>
              <span className="font-13rg text-font-gray">AI가 손금 라인 분석</span>
            </div>
            <div className="flex items-center gap-8px">
              <span className="w-[20px] h-[20px] rounded-full bg-indigo-100 flex items-center justify-center font-10rg text-indigo-600 shrink-0">3</span>
              <span className="font-13rg text-font-gray">생명선 · 두뇌선 · 감정선 해석</span>
            </div>
          </div>
        </div>

        <p className="font-10rg text-font-disabled text-center mt-12px">
          업데이트 알림을 받으시려면 알림 설정을 켜주세요
        </p>
      </div>
    </div>
  );
}
