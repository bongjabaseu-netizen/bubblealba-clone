import { MOCK_CURRENT_USER } from "@/lib/mock-data";

const HISTORY = [
  { id: 1, type: "적립", title: "출석 체크", amount: 100, at: "오늘 09:12" },
  { id: 2, type: "사용", title: "프리미엄 공고 열람", amount: -500, at: "어제 22:44" },
  { id: 3, type: "적립", title: "추천인 보너스", amount: 3000, at: "3일 전" },
  { id: 4, type: "적립", title: "가입 축하", amount: 5000, at: "2주 전" },
  { id: 5, type: "사용", title: "프리미엄 채팅", amount: -200, at: "2주 전" },
];

export default function PointPage() {
  const user = MOCK_CURRENT_USER;

  return (
    <div className="px-15px py-16px space-y-20px">
      <h1 className="font-18sb text-font-black">포인트</h1>

      {/* 보유 포인트 카드 */}
      <div className="rounded-14px bg-gradient-to-br from-primary to-orange-400 text-white p-20px">
        <div className="font-13rg opacity-90 mb-4px">현재 보유 포인트</div>
        <div className="text-[28px] font-bold flex items-center gap-8px mb-16px">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>
          {user.points.toLocaleString()} P
        </div>
        <div className="flex gap-8px">
          <button className="h-32px px-14px rounded-8px bg-white text-primary font-13sb">충전</button>
          <button className="h-32px px-14px rounded-8px border border-white/60 text-white font-13sb">사용처 보기</button>
        </div>
      </div>

      {/* 이번 달 적립/사용 */}
      <div className="grid grid-cols-2 gap-10px">
        <div className="rounded-14px border border-line-gray-20 p-14px">
          <div className="font-12rg text-font-gray mb-4px flex items-center gap-4px">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M2 20l10-10 4 4 10-12" /></svg>
            이번 달 적립
          </div>
          <div className="font-18sb text-green-600">+3,100 P</div>
        </div>
        <div className="rounded-14px border border-line-gray-20 p-14px">
          <div className="font-12rg text-font-gray mb-4px flex items-center gap-4px">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 12H4" /></svg>
            이번 달 사용
          </div>
          <div className="font-18sb text-warn-red">-700 P</div>
        </div>
      </div>

      {/* 포인트 내역 */}
      <section>
        <h2 className="font-15sb text-font-black mb-12px">포인트 내역</h2>
        <div className="rounded-14px border border-line-gray-20 divide-y divide-line-gray-20">
          {HISTORY.map((h) => (
            <div key={h.id} className="flex items-center justify-between px-14px py-12px">
              <div>
                <div className="flex items-center gap-6px mb-2px">
                  <span className={`font-11rg px-6px py-1px rounded-4px ${
                    h.type === "적립" ? "bg-green-50 text-green-600" : "bg-red-50 text-warn-red"
                  }`}>
                    {h.type}
                  </span>
                  <span className="font-14rg text-font-black">{h.title}</span>
                </div>
                <span className="font-12rg text-font-disabled">{h.at}</span>
              </div>
              <span className={`font-15sb ${h.amount > 0 ? "text-green-600" : "text-warn-red"}`}>
                {h.amount > 0 ? "+" : ""}{h.amount.toLocaleString()} P
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
