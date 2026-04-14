/** 사주운세 컴포넌트 — 생년월일 입력 → 사주 기반 운세 결과
 *  from: page.tsx 에서 분리
 */
"use client";

import { useState } from "react";
import { generateFortune, type FortuneResult } from "@/lib/fortune";
import { getAiFortune } from "@/lib/ai-fortune";

const SCORE_EMOJI = ["", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
const CATEGORY_EMOJI: Record<string, string> = {
  "종합": "🔮", "사랑": "❤️", "금전": "💰", "건강": "💪", "직장": "💼",
};

const BIRTH_HOURS = [
  { value: "", label: "모름" },
  { value: "자시", label: "자시 (23~01시)" },
  { value: "축시", label: "축시 (01~03시)" },
  { value: "인시", label: "인시 (03~05시)" },
  { value: "묘시", label: "묘시 (05~07시)" },
  { value: "진시", label: "진시 (07~09시)" },
  { value: "사시", label: "사시 (09~11시)" },
  { value: "오시", label: "오시 (11~13시)" },
  { value: "미시", label: "미시 (13~15시)" },
  { value: "신시", label: "신시 (15~17시)" },
  { value: "유시", label: "유시 (17~19시)" },
  { value: "술시", label: "술시 (19~21시)" },
  { value: "해시", label: "해시 (21~23시)" },
];

export function SajuFortune() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const y = parseInt(year), m = parseInt(month), d = parseInt(day);
    if (!y || !m || !d || y < 1940 || y > 2010 || m < 1 || m > 12 || d < 1 || d > 31) return;
    setResult(generateFortune(y, m, d, name || undefined, birthHour || undefined));
  }

  function handleReset() {
    setResult(null);
    setAiResult(null);
    setAiLoading(false);
    setAiError(false);
    setName(""); setYear(""); setMonth(""); setDay(""); setBirthHour("");
  }

  async function handleAiFortune() {
    setAiLoading(true);
    setAiError(false);
    setAiResult(null);
    try {
      const text = await getAiFortune({
        type: "saju",
        name: name || undefined,
        birthYear: parseInt(year),
        birthMonth: parseInt(month),
        birthDay: parseInt(day),
        birthHour: birthHour || undefined,
      });
      if (text.includes("오류가 발생했습니다")) {
        setAiError(true);
      }
      setAiResult(text);
    } catch {
      setAiError(true);
      setAiResult("AI 운세를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <>
      {!result ? (
        /* 입력 폼 */
        <div className="px-15px mt-20px">
          <div className="text-center mb-20px">
            <div className="text-6xl mb-12px">🔮</div>
            <h2 className="font-18sb text-font-black">오늘의 운세</h2>
            <p className="font-13rg text-font-gray mt-4px">이름과 생년월일시를 입력하면 사주 기반 오늘의 운세를 알려드려요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12px">
            {/* 이름 */}
            <div>
              <label className="font-12rg text-font-gray">이름</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="홍길동" maxLength={10}
                className="mt-4px w-full h-button rounded-10px border border-line-gray-50 px-10px font-14rg text-font-black text-center outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-8px">
              <div>
                <label className="font-12rg text-font-gray">출생년도</label>
                <input type="number" value={year} onChange={e => setYear(e.target.value)}
                  placeholder="1990" min={1940} max={2010} required
                  className="mt-4px w-full h-button rounded-10px border border-line-gray-50 px-10px font-14rg text-font-black text-center outline-none" />
              </div>
              <div>
                <label className="font-12rg text-font-gray">월</label>
                <input type="number" value={month} onChange={e => setMonth(e.target.value)}
                  placeholder="3" min={1} max={12} required
                  className="mt-4px w-full h-button rounded-10px border border-line-gray-50 px-10px font-14rg text-font-black text-center outline-none" />
              </div>
              <div>
                <label className="font-12rg text-font-gray">일</label>
                <input type="number" value={day} onChange={e => setDay(e.target.value)}
                  placeholder="15" min={1} max={31} required
                  className="mt-4px w-full h-button rounded-10px border border-line-gray-50 px-10px font-14rg text-font-black text-center outline-none" />
              </div>
            </div>

            {/* 태어난 시간 */}
            <div>
              <label className="font-12rg text-font-gray">태어난 시간 (선택)</label>
              <select value={birthHour} onChange={e => setBirthHour(e.target.value)}
                className="mt-4px w-full h-button rounded-10px border border-line-gray-50 px-10px font-14rg text-font-black outline-none">
                {BIRTH_HOURS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>

            <button type="submit"
              className="w-full h-44px rounded-14px bg-gradient-to-r from-purple-500 to-indigo-500 font-15sb text-white active-bg">
              🔮 운세 보기
            </button>
          </form>

          <p className="font-10rg text-font-disabled text-center mt-12px">
            사주팔자 기반 운세 · 매일 업데이트 · 무료
          </p>
        </div>
      ) : (
        /* 결과 */
        <div className="px-15px mt-12px pb-20px">
          {/* 사주 카드 */}
          <div className="rounded-14px bg-gradient-to-br from-indigo-900 to-purple-900 p-15px text-white mb-12px">
            <div className="flex items-center justify-between mb-10px">
              <span className="font-12rg opacity-70">{result.date} 운세</span>
              <button onClick={handleReset} className="font-12rg opacity-70 underline">다시 보기</button>
            </div>

            <div className="text-center mb-12px">
              <div className="text-4xl mb-6px">🔮</div>
              {result.name && <div className="font-18sb mb-4px">{result.name}님</div>}
              <div className="font-16sb">{result.birthYear}년 {result.birthMonth}월 {result.birthDay}일{result.birthHour ? ` ${result.birthHour}` : ""}생</div>
              <div className="font-13rg opacity-80 mt-4px">{result.ddi}띠 · {result.zodiac}</div>
            </div>

            {/* 사주 정보 */}
            {/* 연주 (년) */}
            <div className="font-10rg opacity-60 mt-8px mb-4px">연주(年柱)</div>
            <div className="grid grid-cols-3 gap-6px text-center">
              <div className="rounded-10px bg-white/10 py-6px">
                <div className="font-10rg opacity-60">천간</div>
                <div className="font-14sb mt-2px">{result.cheongan}</div>
              </div>
              <div className="rounded-10px bg-white/10 py-6px">
                <div className="font-10rg opacity-60">지지</div>
                <div className="font-14sb mt-2px">{result.jiji}</div>
              </div>
              <div className="rounded-10px bg-white/10 py-6px">
                <div className="font-10rg opacity-60">오행</div>
                <div className="font-14sb mt-2px">{result.ohang}</div>
              </div>
            </div>

            {/* 시주 (태어난 시간) */}
            {result.siCheongan && result.siJiji && (
              <>
                <div className="font-10rg opacity-60 mt-8px mb-4px">시주(時柱)</div>
                <div className="grid grid-cols-2 gap-6px text-center">
                  <div className="rounded-10px bg-white/10 py-6px">
                    <div className="font-10rg opacity-60">시 천간</div>
                    <div className="font-14sb mt-2px">{result.siCheongan}</div>
                  </div>
                  <div className="rounded-10px bg-white/10 py-6px">
                    <div className="font-10rg opacity-60">시 지지</div>
                    <div className="font-14sb mt-2px">{result.siJiji}</div>
                  </div>
                </div>
              </>
            )}

            {/* 종합 점수 */}
            <div className="mt-12px text-center">
              <div className="font-12rg opacity-60">오늘의 운세 점수</div>
              <div className="font-18sb mt-2px">{result.overallScore}점</div>
              <div className="w-full h-2 rounded-full bg-white/20 mt-6px overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                  style={{ width: `${result.overallScore}%` }} />
              </div>
            </div>

            {/* 럭키 */}
            <div className="flex justify-center gap-20px mt-12px">
              <div className="text-center">
                <div className="font-10rg opacity-60">럭키 컬러</div>
                <div className="font-13rg mt-2px">🎨 {result.luckyColor}</div>
              </div>
              <div className="text-center">
                <div className="font-10rg opacity-60">럭키 넘버</div>
                <div className="font-13rg mt-2px">🔢 {result.luckyNumber}</div>
              </div>
            </div>
          </div>

          {/* 이름 분석 */}
          {result.nameAnalysis && (
            <div className="rounded-14px border border-purple-200 bg-purple-50 p-12px mb-8px">
              <span className="font-14sb text-purple-700">📛 이름 분석</span>
              <p className="font-13rg text-purple-600 mt-4px leading-relaxed">{result.nameAnalysis}</p>
            </div>
          )}

          {/* 카테고리별 운세 */}
          <div className="space-y-8px">
            {result.categories.map(cat => (
              <div key={cat.name} className="rounded-14px border border-line-gray-20 p-12px">
                <div className="flex items-center justify-between mb-6px">
                  <span className="font-14sb text-font-black">
                    {CATEGORY_EMOJI[cat.name] ?? "✨"} {cat.name}
                  </span>
                  <span className="font-12rg">{SCORE_EMOJI[cat.score]}</span>
                </div>
                <p className="font-13rg text-font-gray leading-relaxed">{cat.text}</p>
              </div>
            ))}
          </div>

          {/* AI 운세 섹션 */}
          {!aiResult && !aiLoading && (
            <button
              onClick={handleAiFortune}
              className="w-full h-44px rounded-14px bg-gradient-to-r from-purple-500 to-indigo-500 font-15sb text-white mt-12px active-bg"
            >
              ✨ AI 분석 보기
            </button>
          )}

          {aiLoading && (
            <div className="rounded-14px border border-purple-200 bg-purple-50 p-16px mt-12px text-center">
              <div className="text-2xl mb-8px animate-pulse">🔮</div>
              <p className="font-14rg text-purple-600">AI가 운세를 분석하고 있어요...</p>
            </div>
          )}

          {aiResult && (
            <div className="mt-12px rounded-14px p-[2px] bg-gradient-to-r from-purple-500 to-indigo-500">
              <div className="rounded-[12px] bg-white p-12px">
                <div className="flex items-center gap-6px mb-8px">
                  <span className="font-14sb text-purple-700">✨ AI 운세 분석</span>
                </div>
                <p className="font-13rg text-font-gray leading-relaxed whitespace-pre-line">{aiResult}</p>
                {aiError && (
                  <button
                    onClick={handleAiFortune}
                    className="mt-8px font-13rg text-purple-500 underline"
                  >
                    다시 시도
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
