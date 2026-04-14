/** 별자리 운세 — 12별자리 선택 → 오늘의 운세 표시 */
"use client";

import { useState } from "react";
import { getAiFortune } from "@/lib/ai-fortune";

/* ─── 별자리 데이터 ─── */
interface ZodiacSign {
  id: string;
  name: string;
  emoji: string;
  dates: string;
  element: string;          // 원소
  personality: string;
  luckyColor: string;
  luckyNumber: number;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: "aries",       name: "양자리",     emoji: "♈", dates: "3/21 ~ 4/19",  element: "불", personality: "열정적이고 도전적인 리더형", luckyColor: "빨강", luckyNumber: 9 },
  { id: "taurus",      name: "황소자리",   emoji: "♉", dates: "4/20 ~ 5/20",  element: "땅", personality: "인내심 강하고 안정적인 실속파", luckyColor: "초록", luckyNumber: 6 },
  { id: "gemini",      name: "쌍둥이자리", emoji: "♊", dates: "5/21 ~ 6/21",  element: "바람", personality: "다재다능하고 소통에 능한 지식인", luckyColor: "노랑", luckyNumber: 5 },
  { id: "cancer",      name: "게자리",     emoji: "♋", dates: "6/22 ~ 7/22",  element: "물", personality: "감성적이고 가정적인 보호자", luckyColor: "은색", luckyNumber: 2 },
  { id: "leo",         name: "사자자리",   emoji: "♌", dates: "7/23 ~ 8/22",  element: "불", personality: "자신감 넘치고 카리스마 있는 왕", luckyColor: "금색", luckyNumber: 1 },
  { id: "virgo",       name: "처녀자리",   emoji: "♍", dates: "8/23 ~ 9/22",  element: "땅", personality: "꼼꼼하고 분석적인 완벽주의자", luckyColor: "베이지", luckyNumber: 7 },
  { id: "libra",       name: "천칭자리",   emoji: "♎", dates: "9/23 ~ 10/23", element: "바람", personality: "조화롭고 공정한 중재자", luckyColor: "분홍", luckyNumber: 4 },
  { id: "scorpio",     name: "전갈자리",   emoji: "♏", dates: "10/24 ~ 11/22",element: "물", personality: "깊이 있고 강렬한 탐구자", luckyColor: "검정", luckyNumber: 8 },
  { id: "sagittarius", name: "사수자리",   emoji: "♐", dates: "11/23 ~ 12/21",element: "불", personality: "자유롭고 낙천적인 모험가", luckyColor: "보라", luckyNumber: 3 },
  { id: "capricorn",   name: "염소자리",   emoji: "♑", dates: "12/22 ~ 1/19", element: "땅", personality: "성실하고 책임감 있는 성취자", luckyColor: "갈색", luckyNumber: 10 },
  { id: "aquarius",    name: "물병자리",   emoji: "♒", dates: "1/20 ~ 2/18",  element: "바람", personality: "독창적이고 인도주의적인 혁신가", luckyColor: "하늘색", luckyNumber: 11 },
  { id: "pisces",      name: "물고기자리", emoji: "♓", dates: "2/19 ~ 3/20",  element: "물", personality: "직관적이고 예술적인 몽상가", luckyColor: "연보라", luckyNumber: 12 },
];

/* ─── 카테고리별 운세 메시지 (별자리 × 날짜 해시로 결정) ─── */
const HOROSCOPE_LOVE: string[] = [
  "오늘은 연인과 특별한 감정을 나눌 수 있는 날입니다.",
  "새로운 만남에서 설렘을 느낄 수 있어요.",
  "사랑하는 사람에게 진심을 표현해보세요.",
  "혼자만의 시간이 오히려 인연을 끌어당길 수 있습니다.",
  "작은 다툼은 빨리 화해하는 게 좋아요.",
  "오래된 인연에서 새로운 감정이 싹틀 수 있어요.",
  "고백하기 좋은 날입니다. 용기를 내보세요.",
  "상대방의 말에 귀 기울이면 관계가 깊어져요.",
  "소개팅이나 미팅 운이 좋은 하루입니다.",
  "감정 표현을 아끼지 마세요. 상대가 기다리고 있어요.",
  "함께 취미 활동을 하면 더 가까워질 수 있어요.",
  "이별의 아픔도 새 시작의 씨앗이 됩니다.",
];

const HOROSCOPE_MONEY: string[] = [
  "재물운이 상승하는 시기입니다. 기회를 놓치지 마세요.",
  "절약이 미덕인 날. 불필요한 지출을 줄이세요.",
  "예상치 못한 수입이 생길 수 있어요.",
  "투자보다는 저축이 유리한 날입니다.",
  "부업에서 수익이 날 수 있는 기운이 있어요.",
  "금전 거래 시 꼼꼼히 확인하세요.",
  "중고거래에서 좋은 물건을 발견할 수 있어요.",
  "가격 비교를 하면 좋은 딜을 찾을 수 있습니다.",
  "재테크 공부를 시작하기 좋은 날이에요.",
  "용돈이나 보너스가 들어올 수 있는 기운입니다.",
  "큰 지출은 내일로 미루는 게 좋겠어요.",
  "협상에서 유리한 위치에 설 수 있는 날입니다.",
];

const HOROSCOPE_HEALTH: string[] = [
  "규칙적인 생활이 건강의 비결. 일찍 자보세요.",
  "스트레칭으로 하루를 시작하면 컨디션이 좋아져요.",
  "물을 충분히 마시세요. 수분 보충이 중요합니다.",
  "과로는 금물! 적당한 휴식을 취하세요.",
  "야외 활동이 활력을 줄 수 있는 날이에요.",
  "숙면이 최고의 보약입니다.",
  "가벼운 산책이 몸과 마음 모두에 좋아요.",
  "소화기 건강에 신경 쓰세요.",
  "요가나 명상으로 마음의 안정을 찾아보세요.",
  "비타민이나 영양제를 챙겨먹기 좋은 날입니다.",
  "눈의 피로에 주의하세요. 디지털 디톡스를 해보세요.",
  "웃음이 최고의 약입니다. 유머를 즐기세요.",
];

const HOROSCOPE_OVERALL: string[] = [
  "새로운 기회가 찾아올 수 있는 날. 적극적으로 움직이세요.",
  "주변 사람들에게서 좋은 에너지를 받을 수 있어요.",
  "조용히 자신을 돌아보는 시간이 필요한 날입니다.",
  "예상치 못한 좋은 소식이 전해질 수 있어요.",
  "결단력이 중요한 날. 망설이지 말고 행동하세요.",
  "창의적인 아이디어가 떠오르는 날입니다.",
  "인내심이 필요한 하루. 급하게 서두르지 마세요.",
  "건강에 신경 쓰면 좋은 날이에요.",
  "과거의 노력이 결실을 맺는 날입니다.",
  "새로운 시작을 하기에 좋은 날이에요.",
  "행운의 기운이 따르는 날. 도전해보세요.",
  "집중력이 높아지는 날. 중요한 일을 처리하세요.",
];

/* ─── 해시 함수 (날짜 기반 시드) ─── */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function getScore(seed: number): number {
  return (seed % 5) + 1;
}

/* ─── 컴포넌트 ─── */
interface HoroscopeResult {
  sign: ZodiacSign;
  overall: string;
  love: string;
  money: string;
  health: string;
  overallScore: number;
  loveScore: number;
  moneyScore: number;
  healthScore: number;
}

function generateHoroscope(sign: ZodiacSign): HoroscopeResult {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const base = `${sign.id}-${todayStr}`;

  return {
    sign,
    overall: pick(HOROSCOPE_OVERALL, simpleHash(`${base}-overall`)),
    love: pick(HOROSCOPE_LOVE, simpleHash(`${base}-love`)),
    money: pick(HOROSCOPE_MONEY, simpleHash(`${base}-money`)),
    health: pick(HOROSCOPE_HEALTH, simpleHash(`${base}-health`)),
    overallScore: getScore(simpleHash(`${base}-score-overall`)),
    loveScore: getScore(simpleHash(`${base}-score-love`)),
    moneyScore: getScore(simpleHash(`${base}-score-money`)),
    healthScore: getScore(simpleHash(`${base}-score-health`)),
  };
}

const SCORE_STARS = ["", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

export function ZodiacFortune() {
  const [result, setResult] = useState<HoroscopeResult | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  function handleSelect(sign: ZodiacSign) {
    setResult(generateHoroscope(sign));
  }

  function handleReset() {
    setResult(null);
    setAiResult(null);
    setAiLoading(false);
    setAiError(false);
  }

  async function handleAiZodiac() {
    if (!result) return;
    setAiLoading(true);
    setAiError(false);
    setAiResult(null);
    try {
      const text = await getAiFortune({
        type: "zodiac",
        zodiacSign: result.sign.name,
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

  if (result) {
    const totalScore = Math.round(
      (result.overallScore + result.loveScore + result.moneyScore + result.healthScore) / 4 * 20
    );

    return (
      <div className="px-15px mt-12px pb-20px">
        {/* 별자리 카드 */}
        <div className="rounded-14px bg-gradient-to-br from-indigo-800 to-blue-900 p-15px text-white mb-12px">
          <div className="flex items-center justify-between mb-10px">
            <span className="font-12rg opacity-70">오늘의 별자리 운세</span>
            <button onClick={handleReset} className="font-12rg opacity-70 underline">다른 별자리</button>
          </div>

          <div className="text-center mb-12px">
            <div className="text-5xl mb-6px">{result.sign.emoji}</div>
            <div className="font-16sb">{result.sign.name}</div>
            <div className="font-12rg opacity-70 mt-2px">{result.sign.dates}</div>
            <div className="font-13rg opacity-80 mt-4px">{result.sign.element} 원소 · {result.sign.personality}</div>
          </div>

          {/* 종합 점수 */}
          <div className="mt-12px text-center">
            <div className="font-12rg opacity-60">오늘의 운세 점수</div>
            <div className="font-18sb mt-2px">{totalScore}점</div>
            <div className="w-full h-2 rounded-full bg-white/20 mt-6px overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                style={{ width: `${totalScore}%` }}
              />
            </div>
          </div>

          {/* 럭키 */}
          <div className="flex justify-center gap-20px mt-12px">
            <div className="text-center">
              <div className="font-10rg opacity-60">럭키 컬러</div>
              <div className="font-13rg mt-2px">🎨 {result.sign.luckyColor}</div>
            </div>
            <div className="text-center">
              <div className="font-10rg opacity-60">럭키 넘버</div>
              <div className="font-13rg mt-2px">🔢 {result.sign.luckyNumber}</div>
            </div>
          </div>
        </div>

        {/* 카테고리별 운세 */}
        <div className="space-y-8px">
          {/* 종합 */}
          <div className="rounded-14px border border-line-gray-20 p-12px">
            <div className="flex items-center justify-between mb-6px">
              <span className="font-14sb text-font-black">🔮 종합</span>
              <span className="font-12rg">{SCORE_STARS[result.overallScore]}</span>
            </div>
            <p className="font-13rg text-font-gray leading-relaxed">{result.overall}</p>
          </div>

          {/* 사랑 */}
          <div className="rounded-14px border border-line-gray-20 p-12px">
            <div className="flex items-center justify-between mb-6px">
              <span className="font-14sb text-font-black">❤️ 사랑</span>
              <span className="font-12rg">{SCORE_STARS[result.loveScore]}</span>
            </div>
            <p className="font-13rg text-font-gray leading-relaxed">{result.love}</p>
          </div>

          {/* 금전 */}
          <div className="rounded-14px border border-line-gray-20 p-12px">
            <div className="flex items-center justify-between mb-6px">
              <span className="font-14sb text-font-black">💰 금전</span>
              <span className="font-12rg">{SCORE_STARS[result.moneyScore]}</span>
            </div>
            <p className="font-13rg text-font-gray leading-relaxed">{result.money}</p>
          </div>

          {/* 건강 */}
          <div className="rounded-14px border border-line-gray-20 p-12px">
            <div className="flex items-center justify-between mb-6px">
              <span className="font-14sb text-font-black">💪 건강</span>
              <span className="font-12rg">{SCORE_STARS[result.healthScore]}</span>
            </div>
            <p className="font-13rg text-font-gray leading-relaxed">{result.health}</p>
          </div>
        </div>

        {/* AI 별자리 운세 섹션 */}
        {!aiResult && !aiLoading && (
          <button
            onClick={handleAiZodiac}
            className="w-full h-44px rounded-14px bg-gradient-to-r from-purple-500 to-indigo-500 font-15sb text-white mt-12px active-bg"
          >
            ✨ AI 분석 보기
          </button>
        )}

        {aiLoading && (
          <div className="rounded-14px border border-indigo-200 bg-indigo-50 p-16px mt-12px text-center">
            <div className="text-2xl mb-8px animate-pulse">⭐</div>
            <p className="font-14rg text-indigo-600">AI가 별자리 운세를 분석하고 있어요...</p>
          </div>
        )}

        {aiResult && (
          <div className="mt-12px rounded-14px p-[2px] bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="rounded-[12px] bg-white p-12px">
              <div className="flex items-center gap-6px mb-8px">
                <span className="font-14sb text-purple-700">✨ AI 별자리 운세</span>
              </div>
              <p className="font-13rg text-font-gray leading-relaxed whitespace-pre-line">{aiResult}</p>
              {aiError && (
                <button
                  onClick={handleAiZodiac}
                  className="mt-8px font-13rg text-purple-500 underline"
                >
                  다시 시도
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* 별자리 선택 그리드 */
  return (
    <div className="px-15px mt-20px">
      <div className="text-center mb-20px">
        <div className="text-6xl mb-12px">⭐</div>
        <h2 className="font-18sb text-font-black">별자리 운세</h2>
        <p className="font-13rg text-font-gray mt-4px">나의 별자리를 선택하면 오늘의 운세를 알려드려요</p>
      </div>

      <div className="grid grid-cols-3 gap-8px">
        {ZODIAC_SIGNS.map(sign => (
          <button
            key={sign.id}
            onClick={() => handleSelect(sign)}
            className="flex flex-col items-center rounded-14px border border-line-gray-20 py-12px px-8px active-bg transition-colors hover:border-indigo-300"
          >
            <div className="text-3xl mb-4px">{sign.emoji}</div>
            <div className="font-14sb text-font-black">{sign.name}</div>
            <div className="font-10rg text-font-gray mt-2px">{sign.dates}</div>
          </button>
        ))}
      </div>

      <p className="font-10rg text-font-disabled text-center mt-12px">
        서양 점성술 기반 운세 · 매일 업데이트 · 무료
      </p>
    </div>
  );
}
