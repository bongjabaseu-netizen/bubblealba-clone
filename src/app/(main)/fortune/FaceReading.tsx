/** 관상 분석 — 셀카 업로드 + 8개 카테고리 특징 선택 → 관상 결과
 *  from: @/lib/face-reading (미구현 시 로컬 데이터 사용)
 */
"use client";

import { useState, useRef } from "react";
import { getAiFortune } from "@/lib/ai-fortune";

/* ─── 8개 관상 카테고리 데이터 ─── */
interface FaceOption {
  id: string;
  emoji: string;
  label: string;
}

interface FaceCategory {
  id: string;
  title: string;
  emoji: string;
  description: string;
  options: FaceOption[];
}

const FACE_CATEGORIES: FaceCategory[] = [
  {
    id: "face_shape",
    title: "얼굴형",
    emoji: "😊",
    description: "본인의 얼굴형에 가장 가까운 것을 선택하세요",
    options: [
      { id: "round",    emoji: "🌕", label: "둥근형" },
      { id: "oval",     emoji: "🥚", label: "계란형" },
      { id: "square",   emoji: "🟫", label: "사각형" },
      { id: "heart",    emoji: "💛", label: "하트형" },
      { id: "long",     emoji: "📏", label: "긴형" },
    ],
  },
  {
    id: "forehead",
    title: "이마",
    emoji: "🧠",
    description: "이마의 크기와 형태를 선택하세요",
    options: [
      { id: "wide",     emoji: "📐", label: "넓은 이마" },
      { id: "narrow",   emoji: "📎", label: "좁은 이마" },
      { id: "high",     emoji: "⬆️", label: "높은 이마" },
      { id: "flat",     emoji: "➖", label: "평평한 이마" },
    ],
  },
  {
    id: "eyebrows",
    title: "눈썹",
    emoji: "🤨",
    description: "눈썹 모양을 선택하세요",
    options: [
      { id: "thick",    emoji: "〰️", label: "진한 눈썹" },
      { id: "thin",     emoji: "➰", label: "얇은 눈썹" },
      { id: "arched",   emoji: "🌈", label: "아치형" },
      { id: "straight", emoji: "➡️", label: "일자 눈썹" },
      { id: "short",    emoji: "✂️", label: "짧은 눈썹" },
    ],
  },
  {
    id: "eyes",
    title: "눈",
    emoji: "👁️",
    description: "눈의 크기와 형태를 선택하세요",
    options: [
      { id: "big",      emoji: "👀", label: "큰 눈" },
      { id: "small",    emoji: "🔍", label: "작은 눈" },
      { id: "long",     emoji: "🐱", label: "길쭉한 눈" },
      { id: "round",    emoji: "⭕", label: "동그란 눈" },
      { id: "single",   emoji: "➖", label: "외꺼풀" },
      { id: "double",   emoji: "〽️", label: "쌍꺼풀" },
    ],
  },
  {
    id: "nose",
    title: "코",
    emoji: "👃",
    description: "코의 모양을 선택하세요",
    options: [
      { id: "high",     emoji: "⛰️", label: "오뚝한 코" },
      { id: "flat",     emoji: "🌊", label: "낮은 코" },
      { id: "wide",     emoji: "🔲", label: "넓은 코" },
      { id: "narrow",   emoji: "🔳", label: "좁은 코" },
      { id: "round",    emoji: "🔴", label: "둥근 코끝" },
    ],
  },
  {
    id: "mouth",
    title: "입",
    emoji: "👄",
    description: "입의 크기와 형태를 선택하세요",
    options: [
      { id: "big",      emoji: "😃", label: "큰 입" },
      { id: "small",    emoji: "🤏", label: "작은 입" },
      { id: "thick",    emoji: "💋", label: "두꺼운 입술" },
      { id: "thin",     emoji: "📄", label: "얇은 입술" },
      { id: "upward",   emoji: "😊", label: "올라간 입꼬리" },
    ],
  },
  {
    id: "ears",
    title: "귀",
    emoji: "👂",
    description: "귀의 크기와 형태를 선택하세요",
    options: [
      { id: "big",      emoji: "🐘", label: "큰 귀" },
      { id: "small",    emoji: "🐭", label: "작은 귀" },
      { id: "thick",    emoji: "🧱", label: "두꺼운 귓불" },
      { id: "thin",     emoji: "🍃", label: "얇은 귓불" },
      { id: "attached", emoji: "📌", label: "붙은 귀" },
    ],
  },
  {
    id: "chin",
    title: "턱",
    emoji: "🗿",
    description: "턱의 형태를 선택하세요",
    options: [
      { id: "round",    emoji: "🌕", label: "둥근 턱" },
      { id: "pointed",  emoji: "🔻", label: "뾰족한 턱" },
      { id: "square",   emoji: "⬜", label: "각진 턱" },
      { id: "double",   emoji: "🍑", label: "이중턱" },
    ],
  },
];

/* ─── 관상 해석 데이터 ─── */
interface Interpretation {
  personality: string;
  wealth: string;
  love: string;
  career: string;
}

// 선택된 옵션 ID 기반으로 해석 생성
const INTERPRETATIONS: Record<string, Record<string, Interpretation>> = {
  face_shape: {
    round:  { personality: "밝고 사교적인 성격", wealth: "꾸준한 재물운", love: "다정다감한 연애 스타일", career: "서비스·영업직 적성" },
    oval:   { personality: "균형 잡힌 성격", wealth: "안정적인 재물운", love: "이상적인 파트너", career: "만능형, 어떤 직업이든 적응" },
    square: { personality: "의지가 강하고 결단력", wealth: "자수성가 타입", love: "신뢰를 중시하는 연애", career: "관리직·경영자 적성" },
    heart:  { personality: "감성적이고 창의적", wealth: "재물 복이 있음", love: "로맨틱한 연애 스타일", career: "예술·디자인 적성" },
    long:   { personality: "사려깊고 지적", wealth: "지식이 재산", love: "깊은 관계를 선호", career: "학자·연구직 적성" },
  },
  forehead: {
    wide:   { personality: "넓은 시야를 가진 리더형", wealth: "사업운 양호", love: "포용력 있는 파트너", career: "기획·전략 분야" },
    narrow: { personality: "집중력이 뛰어남", wealth: "전문 분야에서 수익", love: "한 사람에게 집중", career: "전문직 적성" },
    high:   { personality: "지적이고 분석적", wealth: "투자에 유리", love: "지적 대화를 즐기는 연애", career: "IT·금융 분야" },
    flat:   { personality: "현실적이고 실용적", wealth: "안정 추구형 재테크", love: "편안한 관계 추구", career: "공무원·안정직" },
  },
  eyebrows: {
    thick:    { personality: "정열적이고 활동적", wealth: "적극적 재물 추구", love: "열정적 연애", career: "영업·마케팅" },
    thin:     { personality: "섬세하고 예민", wealth: "신중한 재테크", love: "감성적 연애", career: "예술·상담" },
    arched:   { personality: "우아하고 세련됨", wealth: "고급 취향의 소비", love: "높은 이상형", career: "패션·뷰티" },
    straight: { personality: "곧고 정직한 성격", wealth: "꾸준한 저축형", love: "솔직한 연애", career: "엔지니어·기술직" },
    short:    { personality: "결단력이 있음", wealth: "단기 수익에 강함", love: "즉흥적 연애", career: "스타트업·벤처" },
  },
  eyes: {
    big:    { personality: "호기심 많고 개방적", wealth: "기회를 잘 포착", love: "매력적인 눈빛", career: "방송·엔터테인먼트" },
    small:  { personality: "관찰력이 뛰어남", wealth: "절약 능력 탁월", love: "속마음을 잘 안 보여줌", career: "분석·감사" },
    long:   { personality: "날카롭고 통찰력", wealth: "투자에 유리한 눈", love: "신비로운 매력", career: "법조·컨설팅" },
    round:  { personality: "친근하고 순수", wealth: "사람 복이 재물복", love: "순수한 연애", career: "교육·복지" },
    single: { personality: "차분하고 이성적", wealth: "계획적 재테크", love: "신중한 연애 스타일", career: "공학·연구" },
    double: { personality: "표현력이 풍부", wealth: "다양한 수입원", love: "감정 표현이 풍부", career: "커뮤니케이션·PR" },
  },
  nose: {
    high:   { personality: "자존심이 강하고 당당", wealth: "높은 재물운", love: "이상형이 높음", career: "경영·리더십" },
    flat:   { personality: "겸손하고 협조적", wealth: "협업으로 재물 축적", love: "편안한 관계", career: "팀워크 중심 직업" },
    wide:   { personality: "포용력이 넓음", wealth: "넉넉한 재물복", love: "너그러운 연애", career: "정치·사회활동" },
    narrow: { personality: "섬세하고 미적 감각", wealth: "정밀한 재테크", love: "디테일을 중시", career: "디자인·아트" },
    round:  { personality: "낙천적이고 긍정적", wealth: "복이 따르는 타입", love: "즐거운 연애", career: "서비스·호스피탈리티" },
  },
  mouth: {
    big:    { personality: "대범하고 적극적", wealth: "큰 돈을 벌 수 있는 상", love: "표현력 좋은 연애", career: "세일즈·사업" },
    small:  { personality: "조심스럽고 신중", wealth: "꼼꼼한 재테크", love: "수줍은 연애", career: "사무·행정" },
    thick:  { personality: "감정이 풍부하고 정열적", wealth: "풍요로운 삶", love: "열정적 사랑", career: "요리·식품" },
    thin:   { personality: "논리적이고 말을 아낌", wealth: "지식 기반 수익", love: "지적 대화 선호", career: "작가·학자" },
    upward: { personality: "긍정적이고 밝은 성격", wealth: "사람 복이 재물복", love: "웃음 많은 연애", career: "엔터·방송" },
  },
  ears: {
    big:    { personality: "관대하고 복이 있는 상", wealth: "큰 재물복", love: "잘 들어주는 파트너", career: "경영·투자" },
    small:  { personality: "예민하고 심미적", wealth: "전문직 수익", love: "까다로운 취향", career: "예술·공예" },
    thick:  { personality: "복이 많은 관상", wealth: "재물이 쌓이는 상", love: "안정적 관계 추구", career: "금융·부동산" },
    thin:   { personality: "지적이고 학구적", wealth: "지식이 재산", love: "정신적 교류 중시", career: "학계·연구" },
    attached: { personality: "현실적이고 실속파", wealth: "저축에 강함", love: "실용적 연애", career: "공무원·안정직" },
  },
  chin: {
    round:   { personality: "원만하고 평화로운", wealth: "안정적 재물", love: "따뜻한 가정 구성", career: "중재·조정" },
    pointed: { personality: "날카롭고 직관적", wealth: "변동성 있는 재물", love: "드라마틱한 연애", career: "크리에이티브" },
    square:  { personality: "의지가 단단한 실행력", wealth: "자수성가 타입", love: "한 번 정하면 끝까지", career: "건설·제조" },
    double:  { personality: "넉넉하고 여유로운", wealth: "풍족한 노후", love: "가정적인 파트너", career: "F&B·유통" },
  },
};

// 선택된 옵션에서 종합 점수와 럭키 요소 계산
function computeResult(selections: Record<string, string>) {
  const allInterps: Interpretation[] = [];
  for (const [catId, optId] of Object.entries(selections)) {
    const catData = INTERPRETATIONS[catId];
    if (catData && catData[optId]) {
      allInterps.push(catData[optId]);
    }
  }

  // 해시 기반 점수 (60~95 범위)
  const selStr = Object.values(selections).join("-");
  let hash = 0;
  for (let i = 0; i < selStr.length; i++) {
    hash = ((hash << 5) - hash) + selStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);
  const overallScore = 60 + (hash % 36); // 60~95

  const LUCKY_COLORS = ["빨강", "주황", "노랑", "초록", "파랑", "보라", "분홍", "금색", "은색", "하늘색"];
  const luckyColor = LUCKY_COLORS[hash % LUCKY_COLORS.length];
  const luckyNumber = (hash % 45) + 1;

  return { allInterps, overallScore, luckyColor, luckyNumber };
}

/* ─── 컴포넌트 ─── */
export function FaceReading() {
  const [step, setStep] = useState<"upload" | "select" | "result">("upload");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentCatIdx, setCurrentCatIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  /* Step 1: 사진 업로드 */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleStartAnalysis() {
    setStep("select");
    setCurrentCatIdx(0);
  }

  /* Step 2: 카테고리 선택 */
  function handleOptionSelect(catId: string, optId: string) {
    setSelections(prev => ({ ...prev, [catId]: optId }));
  }

  function handleNext() {
    if (currentCatIdx < FACE_CATEGORIES.length - 1) {
      setCurrentCatIdx(prev => prev + 1);
    } else {
      setStep("result");
    }
  }

  function handlePrev() {
    if (currentCatIdx > 0) {
      setCurrentCatIdx(prev => prev - 1);
    }
  }

  /* Step 3: 결과 */
  function handleReset() {
    setStep("upload");
    setPhotoPreview(null);
    setCurrentCatIdx(0);
    setSelections({});
    setAiResult(null);
    setAiLoading(false);
    setAiError(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  /** 선택된 특징을 한글 라벨로 변환 */
  function buildFaceFeatures(): Record<string, string> {
    const features: Record<string, string> = {};
    for (const cat of FACE_CATEGORIES) {
      const optId = selections[cat.id];
      const opt = cat.options.find(o => o.id === optId);
      if (opt) features[cat.title] = opt.label;
    }
    return features;
  }

  async function handleAiFace() {
    setAiLoading(true);
    setAiError(false);
    setAiResult(null);
    try {
      const text = await getAiFortune({
        type: "face",
        faceFeatures: buildFaceFeatures(),
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

  /* ─── 렌더링 ─── */

  // Step 1: 사진 업로드
  if (step === "upload") {
    return (
      <div className="px-15px mt-20px">
        <div className="text-center mb-20px">
          <div className="text-6xl mb-12px">👤</div>
          <h2 className="font-18sb text-font-black">관상 분석</h2>
          <p className="font-13rg text-font-gray mt-4px">사진을 올리고 얼굴 특징을 선택하면 관상을 분석해드려요</p>
        </div>

        {/* 사진 업로드 영역 */}
        <div className="mb-16px">
          <label className="block rounded-14px border-2 border-dashed border-line-gray-20 p-20px text-center cursor-pointer hover:border-indigo-300 transition-colors">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {photoPreview ? (
              <div className="flex flex-col items-center">
                <img
                  src={photoPreview}
                  alt="미리보기"
                  className="w-[120px] h-[120px] rounded-full object-cover mb-12px border-2 border-line-gray-20"
                />
                <span className="font-13rg text-font-gray">탭하여 사진 변경</span>
              </div>
            ) : (
              <div className="flex flex-col items-center py-20px">
                <span className="text-4xl mb-8px">📷</span>
                <span className="font-14rg text-font-gray">셀카 사진을 업로드하세요</span>
                <span className="font-12rg text-font-disabled mt-4px">선택 사항 · 분석은 직접 선택 기반</span>
              </div>
            )}
          </label>
        </div>

        {/* 분석 시작 */}
        <button
          onClick={handleStartAnalysis}
          className="w-full h-44px rounded-14px bg-gradient-to-r from-purple-500 to-pink-500 font-15sb text-white active-bg"
        >
          👤 관상 분석 시작
        </button>

        <p className="font-10rg text-font-disabled text-center mt-12px">
          사진은 서버에 저장되지 않습니다 · 8개 카테고리 · 무료
        </p>
      </div>
    );
  }

  // Step 2: 카테고리별 특징 선택 (위저드)
  if (step === "select") {
    const cat = FACE_CATEGORIES[currentCatIdx];
    const selectedOpt = selections[cat.id];
    const progress = ((currentCatIdx + 1) / FACE_CATEGORIES.length) * 100;
    const isLast = currentCatIdx === FACE_CATEGORIES.length - 1;

    return (
      <div className="px-15px mt-12px pb-20px">
        {/* 진행 바 */}
        <div className="mb-16px">
          <div className="flex items-center justify-between mb-6px">
            <span className="font-12rg text-font-gray">{currentCatIdx + 1} / {FACE_CATEGORIES.length}</span>
            <span className="font-12rg text-font-gray">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 카테고리 헤더 */}
        <div className="text-center mb-20px">
          <div className="text-5xl mb-8px">{cat.emoji}</div>
          <h3 className="font-16sb text-font-black">{cat.title}</h3>
          <p className="font-13rg text-font-gray mt-4px">{cat.description}</p>
        </div>

        {/* 옵션 그리드 */}
        <div className="grid grid-cols-2 gap-8px mb-20px">
          {cat.options.map(opt => {
            const isSelected = selectedOpt === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(cat.id, opt.id)}
                className={`flex flex-col items-center rounded-14px border p-12px transition-colors ${
                  isSelected
                    ? "border-purple-500 bg-purple-50"
                    : "border-line-gray-20 bg-bg-white hover:border-purple-300"
                }`}
              >
                <span className="text-2xl mb-4px">{opt.emoji}</span>
                <span className={`font-14rg ${isSelected ? "text-purple-700 font-semibold" : "text-font-black"}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex gap-8px">
          <button
            onClick={handlePrev}
            disabled={currentCatIdx === 0}
            className={`flex-1 h-44px rounded-14px font-15sb border transition-colors ${
              currentCatIdx === 0
                ? "border-line-gray-20 text-font-disabled cursor-not-allowed"
                : "border-line-gray-50 text-font-black active-bg"
            }`}
          >
            이전
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedOpt}
            className={`flex-1 h-44px rounded-14px font-15sb text-white transition-colors ${
              selectedOpt
                ? "bg-gradient-to-r from-purple-500 to-pink-500 active-bg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLast ? "결과 보기" : "다음"}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: 결과
  const { allInterps, overallScore, luckyColor, luckyNumber } = computeResult(selections);

  return (
    <div className="px-15px mt-12px pb-20px">
      {/* 결과 카드 */}
      <div className="rounded-14px bg-gradient-to-br from-purple-900 to-pink-900 p-15px text-white mb-12px">
        <div className="flex items-center justify-between mb-10px">
          <span className="font-12rg opacity-70">관상 분석 결과</span>
          <button onClick={handleReset} className="font-12rg opacity-70 underline">다시 보기</button>
        </div>

        {/* 프로필 */}
        <div className="text-center mb-12px">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="프로필"
              className="w-[80px] h-[80px] rounded-full object-cover mx-auto mb-8px border-2 border-white/30"
            />
          ) : (
            <div className="text-5xl mb-8px">👤</div>
          )}
          <div className="font-16sb">나의 관상 분석</div>
        </div>

        {/* 종합 점수 */}
        <div className="text-center mb-12px">
          <div className="font-12rg opacity-60">종합 관상 점수</div>
          <div className="font-18sb mt-2px">{overallScore}점</div>
          <div className="w-full h-2 rounded-full bg-white/20 mt-6px overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-yellow-400"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        {/* 럭키 */}
        <div className="flex justify-center gap-20px mt-12px">
          <div className="text-center">
            <div className="font-10rg opacity-60">럭키 컬러</div>
            <div className="font-13rg mt-2px">🎨 {luckyColor}</div>
          </div>
          <div className="text-center">
            <div className="font-10rg opacity-60">럭키 넘버</div>
            <div className="font-13rg mt-2px">🔢 {luckyNumber}</div>
          </div>
        </div>
      </div>

      {/* 선택된 특징 요약 */}
      <div className="rounded-14px border border-line-gray-20 p-12px mb-12px">
        <div className="font-14sb text-font-black mb-8px">📋 선택한 특징</div>
        <div className="flex flex-wrap gap-6px">
          {FACE_CATEGORIES.map(cat => {
            const optId = selections[cat.id];
            const opt = cat.options.find(o => o.id === optId);
            if (!opt) return null;
            return (
              <span
                key={cat.id}
                className="inline-flex items-center gap-2px rounded-full bg-purple-50 px-8px py-4px font-12rg text-purple-700"
              >
                {cat.emoji} {opt.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* 카테고리별 해석 */}
      <div className="space-y-8px">
        {/* 성격 */}
        <div className="rounded-14px border border-line-gray-20 p-12px">
          <div className="flex items-center gap-6px mb-6px">
            <span className="font-14sb text-font-black">😊 성격</span>
          </div>
          <div className="space-y-4px">
            {allInterps.map((interp, i) => (
              <p key={i} className="font-13rg text-font-gray leading-relaxed">• {interp.personality}</p>
            ))}
          </div>
        </div>

        {/* 재물운 */}
        <div className="rounded-14px border border-line-gray-20 p-12px">
          <div className="flex items-center gap-6px mb-6px">
            <span className="font-14sb text-font-black">💰 재물운</span>
          </div>
          <div className="space-y-4px">
            {allInterps.map((interp, i) => (
              <p key={i} className="font-13rg text-font-gray leading-relaxed">• {interp.wealth}</p>
            ))}
          </div>
        </div>

        {/* 연애운 */}
        <div className="rounded-14px border border-line-gray-20 p-12px">
          <div className="flex items-center gap-6px mb-6px">
            <span className="font-14sb text-font-black">❤️ 연애운</span>
          </div>
          <div className="space-y-4px">
            {allInterps.map((interp, i) => (
              <p key={i} className="font-13rg text-font-gray leading-relaxed">• {interp.love}</p>
            ))}
          </div>
        </div>

        {/* 직업운 */}
        <div className="rounded-14px border border-line-gray-20 p-12px">
          <div className="flex items-center gap-6px mb-6px">
            <span className="font-14sb text-font-black">💼 직업운</span>
          </div>
          <div className="space-y-4px">
            {allInterps.map((interp, i) => (
              <p key={i} className="font-13rg text-font-gray leading-relaxed">• {interp.career}</p>
            ))}
          </div>
        </div>
      </div>

      {/* AI 관상 분석 섹션 */}
      {!aiResult && !aiLoading && (
        <button
          onClick={handleAiFace}
          className="w-full h-44px rounded-14px bg-gradient-to-r from-purple-500 to-pink-500 font-15sb text-white mt-12px active-bg"
        >
          ✨ AI 분석 보기
        </button>
      )}

      {aiLoading && (
        <div className="rounded-14px border border-purple-200 bg-purple-50 p-16px mt-12px text-center">
          <div className="text-2xl mb-8px animate-pulse">👤</div>
          <p className="font-14rg text-purple-600">AI가 관상을 분석하고 있어요...</p>
        </div>
      )}

      {aiResult && (
        <div className="mt-12px rounded-14px p-[2px] bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="rounded-[12px] bg-white p-12px">
            <div className="flex items-center gap-6px mb-8px">
              <span className="font-14sb text-purple-700">✨ AI 관상 분석</span>
            </div>
            <p className="font-13rg text-font-gray leading-relaxed whitespace-pre-line">{aiResult}</p>
            {aiError && (
              <button
                onClick={handleAiFace}
                className="mt-8px font-13rg text-purple-500 underline"
              >
                다시 시도
              </button>
            )}
          </div>
        </div>
      )}

      {/* 다시 보기 */}
      <button
        onClick={handleReset}
        className="w-full h-44px rounded-14px border border-line-gray-50 font-15sb text-font-black mt-12px active-bg"
      >
        다시 분석하기
      </button>
    </div>
  );
}
