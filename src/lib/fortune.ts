/** 운세 엔진 — manseryeok 사주 + 사전 생성 운세 데이터 */

/** 간단한 해시 함수 (seed용) */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** 천간 */
const CHEONGAN = ["갑(甲)", "을(乙)", "병(丙)", "정(丁)", "무(戊)", "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"];
/** 지지 */
const JIJI = ["자(子)", "축(丑)", "인(寅)", "묘(卯)", "진(辰)", "사(巳)", "오(午)", "미(未)", "신(申)", "유(酉)", "술(戌)", "해(亥)"];
/** 오행 */
const OHANG = ["목(木)", "화(火)", "토(土)", "금(金)", "수(水)"];
/** 띠 */
const DDI = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
/** 별자리 */
const ZODIAC = [
  { name: "물병자리", start: [1, 20], end: [2, 18] },
  { name: "물고기자리", start: [2, 19], end: [3, 20] },
  { name: "양자리", start: [3, 21], end: [4, 19] },
  { name: "황소자리", start: [4, 20], end: [5, 20] },
  { name: "쌍둥이자리", start: [5, 21], end: [6, 21] },
  { name: "게자리", start: [6, 22], end: [7, 22] },
  { name: "사자자리", start: [7, 23], end: [8, 22] },
  { name: "처녀자리", start: [8, 23], end: [9, 22] },
  { name: "천칭자리", start: [9, 23], end: [10, 23] },
  { name: "전갈자리", start: [10, 24], end: [11, 22] },
  { name: "사수자리", start: [11, 23], end: [12, 21] },
  { name: "염소자리", start: [12, 22], end: [1, 19] },
];

function getZodiac(month: number, day: number): string {
  for (const z of ZODIAC) {
    if (z.start[0] === z.end[0]) {
      if (month === z.start[0] && day >= z.start[1] && day <= z.end[1]) return z.name;
    } else if (
      (month === z.start[0] && day >= z.start[1]) ||
      (month === z.end[0] && day <= z.end[1])
    ) return z.name;
  }
  return "염소자리";
}

/** 카테고리별 운세 텍스트 (각 30개) */
const FORTUNES: Record<string, string[]> = {
  "종합": [
    "오늘은 새로운 기회가 찾아올 수 있는 날입니다. 적극적으로 움직여보세요.",
    "주변 사람들과의 관계에서 좋은 에너지를 받을 수 있는 하루입니다.",
    "조용히 자신을 돌아보는 시간이 필요한 날입니다. 명상이나 산책을 추천합니다.",
    "예상치 못한 좋은 소식이 전해질 수 있습니다. 연락을 잘 확인하세요.",
    "오늘은 결단력이 중요한 날입니다. 망설이지 말고 행동하세요.",
    "창의적인 아이디어가 떠오르는 날입니다. 메모해두세요.",
    "인내심이 필요한 하루입니다. 급하게 서두르지 마세요.",
    "오늘 만나는 사람이 중요한 인연이 될 수 있습니다.",
    "건강에 신경 쓰면 좋은 날입니다. 가벼운 운동을 해보세요.",
    "재물운이 상승하는 시기입니다. 투자에 관심을 가져보세요.",
    "과거의 노력이 결실을 맺는 날입니다. 자신감을 가지세요.",
    "새로운 시작을 하기에 좋은 날입니다. 계획을 세워보세요.",
    "주변의 조언에 귀를 기울이면 좋은 결과가 있을 것입니다.",
    "오늘은 감정 조절이 중요합니다. 차분하게 대처하세요.",
    "행운의 기운이 따르는 날입니다. 도전해보세요.",
    "소통의 날입니다. 오해가 있다면 풀어보세요.",
    "집중력이 높아지는 날입니다. 중요한 일을 처리하세요.",
    "여행이나 외출이 길한 날입니다. 새로운 곳을 방문해보세요.",
    "금전적으로 절약이 필요한 날입니다. 충동구매를 조심하세요.",
    "리더십을 발휘할 수 있는 날입니다. 앞장서서 이끌어보세요.",
    "예술적 감각이 빛나는 날입니다. 창작 활동을 해보세요.",
    "가족과 함께하는 시간이 행복을 가져다줄 날입니다.",
    "학습운이 좋은 날입니다. 새로운 것을 배워보세요.",
    "직감을 믿으세요. 오늘은 감이 잘 맞는 날입니다.",
    "작은 것에 감사하는 마음이 큰 행운을 불러올 날입니다.",
    "변화를 두려워하지 마세요. 좋은 방향으로 흘러갈 것입니다.",
    "오늘은 약속을 지키는 것이 중요합니다. 신뢰를 쌓으세요.",
    "에너지가 넘치는 날입니다. 하고 싶은 일을 실행에 옮기세요.",
    "조화와 균형이 중요한 날입니다. 무리하지 마세요.",
    "귀인이 나타날 수 있는 날입니다. 새로운 만남에 열린 자세를 가지세요.",
  ],
  "사랑": [
    "연인과의 깊은 대화가 관계를 더욱 단단하게 만들 날입니다.",
    "새로운 만남이 기대되는 날입니다. 외출 시 인연을 만날 수 있어요.",
    "작은 배려가 큰 감동을 줄 수 있는 날입니다.",
    "솔직한 마음을 전하면 좋은 결과가 있을 거예요.",
    "연애보다 자기 자신에게 집중하면 더 좋은 인연이 찾아옵니다.",
    "오래된 친구가 연인이 될 수 있는 기운이 있습니다.",
    "질투나 의심은 금물입니다. 믿음이 중요한 날이에요.",
    "로맨틱한 이벤트를 준비하면 좋은 반응을 얻을 수 있어요.",
    "이별의 아픔이 있더라도 새로운 시작이 기다리고 있습니다.",
    "함께 취미 활동을 하면 관계가 더 좋아질 거예요.",
    "감정 표현을 아끼지 마세요. 상대방이 기다리고 있어요.",
    "가벼운 만남이 진지한 관계로 발전할 수 있는 날입니다.",
    "상대방의 입장에서 생각해보면 해결책이 보일 거예요.",
    "오늘은 고백하기 좋은 날입니다. 용기를 내보세요.",
    "연인과의 여행 계획을 세우면 설렘이 가득할 거예요.",
    "혼자만의 시간도 중요합니다. 자신을 사랑하는 날이에요.",
    "과거의 인연에 연연하지 마세요. 앞을 보세요.",
    "친절한 말 한마디가 사랑을 키우는 날입니다.",
    "소개팅이나 미팅에 좋은 운이 따르는 날이에요.",
    "사소한 다툼은 빨리 화해하세요. 오래 끌면 좋지 않아요.",
    "눈빛으로 마음을 전할 수 있는 날입니다.",
    "연애운이 상승하는 시기입니다. 적극적으로 나서보세요.",
    "상대방의 장점을 칭찬하면 관계가 좋아질 거예요.",
    "첫 만남의 설렘을 느낄 수 있는 날입니다.",
    "서로 존중하는 마음이 사랑을 지키는 비결입니다.",
    "감사 편지를 쓰면 관계가 더 깊어질 거예요.",
    "인연은 때가 되면 찾아옵니다. 조급해하지 마세요.",
    "데이트 코스를 바꿔보면 새로운 즐거움을 발견할 거예요.",
    "마음을 열면 좋은 사람이 다가올 날입니다.",
    "사랑에 진심인 당신에게 행운이 따를 거예요.",
  ],
  "금전": [
    "재물운이 상승하는 시기입니다. 좋은 기회를 놓치지 마세요.",
    "절약이 미덕인 날입니다. 불필요한 지출을 줄이세요.",
    "투자보다는 저축이 유리한 날입니다.",
    "예상치 못한 수입이 생길 수 있는 날이에요.",
    "큰 지출은 내일로 미루는 것이 좋겠습니다.",
    "부업이나 사이드 프로젝트에서 수익이 날 수 있어요.",
    "금전 거래 시 꼼꼼하게 확인하세요. 실수가 있을 수 있어요.",
    "적금이나 보험 상품을 알아보기 좋은 날입니다.",
    "빌려준 돈이 돌아올 수 있는 날이에요.",
    "로또보다는 실력으로 돈을 벌 수 있는 날입니다.",
    "가격 비교를 하면 좋은 딜을 찾을 수 있어요.",
    "후배나 지인에게 밥을 사면 인복이 따릅니다.",
    "중고거래에서 좋은 물건을 발견할 수 있는 날이에요.",
    "자격증이나 교육 투자가 미래에 큰 수익이 될 거예요.",
    "공과금 정리를 하면 마음이 편해질 날입니다.",
    "과소비 주의보! 카드 사용을 줄여보세요.",
    "재테크 공부를 시작하기 좋은 날입니다.",
    "협상에서 유리한 위치에 설 수 있는 날이에요.",
    "용돈이나 보너스가 들어올 수 있는 기운이 있습니다.",
    "장기 투자 관점에서 판단하면 좋은 결과가 있을 거예요.",
    "무리한 대출은 피하세요. 안정적인 재정 관리가 중요합니다.",
    "사업 아이디어가 떠오를 수 있는 날입니다.",
    "지인의 투자 권유는 신중하게 판단하세요.",
    "절세 방법을 알아보면 도움이 될 거예요.",
    "금전적 스트레스가 해소되는 기운이 있습니다.",
    "현금 흐름을 정리하면 미래가 밝아질 거예요.",
    "물건을 살 때 할인 쿠폰을 꼭 확인하세요.",
    "동업 제안은 신중하게 검토하세요.",
    "소소한 행운이 금전으로 이어질 수 있는 날이에요.",
    "경제 뉴스를 체크하면 좋은 정보를 얻을 수 있어요.",
  ],
  "건강": [
    "규칙적인 생활 습관이 건강의 비결입니다. 일찍 자보세요.",
    "스트레칭으로 하루를 시작하면 컨디션이 좋아질 거예요.",
    "물을 충분히 마시세요. 수분 보충이 중요한 날입니다.",
    "과로는 금물입니다. 적당한 휴식을 취하세요.",
    "건강검진을 받아보면 좋은 시기입니다.",
    "야외 활동이 활력을 줄 수 있는 날이에요.",
    "소화기 건강에 신경 쓰세요. 자극적인 음식은 피하세요.",
    "숙면이 최고의 보약입니다. 수면 환경을 개선해보세요.",
    "비타민이나 영양제를 챙겨 먹기 좋은 날입니다.",
    "걷기 운동이 몸과 마음 모두에 좋은 날이에요.",
    "눈의 피로에 주의하세요. 디지털 디톡스를 해보세요.",
    "요가나 명상으로 마음의 안정을 찾아보세요.",
    "균형 잡힌 식단이 건강의 기본입니다.",
    "체온 관리에 신경 쓰세요. 감기 조심!",
    "웃음이 최고의 약입니다. 유머를 즐기세요.",
    "척추 건강에 주의하세요. 바른 자세를 유지하세요.",
    "스트레스 관리가 중요한 날입니다. 취미 활동을 해보세요.",
    "피부 관리에 신경 쓰면 좋은 결과가 있을 거예요.",
    "알레르기에 주의하세요. 환경 변화가 있을 수 있어요.",
    "건강한 간식으로 에너지를 보충하세요.",
    "반신욕이나 족욕으로 피로를 풀어보세요.",
    "운동 파트너를 찾으면 동기부여가 될 거예요.",
    "음주와 흡연을 줄이면 건강이 빠르게 좋아질 거예요.",
    "정기적인 치과 검진을 받아보세요.",
    "자연 속에서 시간을 보내면 힐링이 될 거예요.",
    "충분한 단백질 섭취가 필요한 날입니다.",
    "관절 건강에 주의하세요. 무리한 운동은 피하세요.",
    "아침 식사를 꼭 챙기세요. 하루의 활력원입니다.",
    "심호흡으로 긴장을 풀어보세요. 마음이 편해질 거예요.",
    "건강이 최고의 재산입니다. 오늘 자신을 돌봐주세요.",
  ],
  "직장": [
    "업무에서 인정받을 수 있는 날입니다. 최선을 다하세요.",
    "동료와의 협업이 좋은 성과를 만들 날이에요.",
    "새로운 프로젝트 제안이 긍정적으로 받아들여질 수 있어요.",
    "상사와의 관계에서 신뢰를 쌓을 수 있는 날입니다.",
    "이직이나 전직을 고려 중이라면 정보를 모아보세요.",
    "프레젠테이션이나 발표에서 좋은 평가를 받을 수 있어요.",
    "업무 우선순위를 정리하면 효율이 올라갈 거예요.",
    "직장 내 갈등이 해소될 수 있는 기운이 있습니다.",
    "네트워킹 활동이 미래에 도움이 될 날이에요.",
    "자기계발에 투자하면 승진에 가까워질 거예요.",
    "회의에서 적극적으로 의견을 내면 좋은 반응이 있을 거예요.",
    "마감일을 잘 지키면 신뢰도가 올라갈 날입니다.",
    "점심시간을 활용해 동료와 친해지세요.",
    "업무 메일은 꼼꼼하게 확인하세요. 중요한 내용이 있을 수 있어요.",
    "야근보다는 집중해서 빨리 끝내는 것이 좋은 날이에요.",
    "직장 내 멘토를 찾으면 성장에 도움이 될 거예요.",
    "실수를 두려워하지 마세요. 배움의 기회입니다.",
    "팀워크가 빛나는 날입니다. 함께 힘을 합치세요.",
    "스킬업을 위한 온라인 강의를 시작하기 좋은 날이에요.",
    "직장 생활의 균형을 찾으면 행복해질 거예요.",
    "보고서 작성에 집중하면 좋은 결과가 있을 거예요.",
    "출장이나 외근에서 좋은 성과를 낼 수 있어요.",
    "직장 동료의 부탁을 들어주면 좋은 인연이 될 거예요.",
    "업무 환경을 정리하면 집중력이 올라갈 거예요.",
    "긍정적인 마인드로 일하면 좋은 기운이 따를 거예요.",
    "새로운 아이디어를 제안하면 인정받을 수 있는 날이에요.",
    "연봉 협상에 유리한 기운이 있습니다.",
    "업무 자동화를 고민해보면 효율이 높아질 거예요.",
    "퇴근 후 자기만의 시간을 가지면 활력이 생길 거예요.",
    "직장에서의 작은 성공이 큰 자신감이 될 날입니다.",
  ],
};

/** 점수 (1~5) */
function getScore(seed: number): number {
  return (seed % 5) + 1;
}

/** 럭키 컬러 */
const LUCKY_COLORS = ["빨강", "주황", "노랑", "초록", "파랑", "남색", "보라", "분홍", "흰색", "검정", "금색", "은색"];
/** 럭키 넘버 */
function getLuckyNumber(seed: number): number {
  return (seed % 45) + 1;
}

/** 시주 (태어난 시간 → 천간/지지) */
const SIJU: Record<string, { cheongan: string; jiji: string }> = {
  "자시": { cheongan: "갑(甲)", jiji: "자(子)" },
  "축시": { cheongan: "을(乙)", jiji: "축(丑)" },
  "인시": { cheongan: "병(丙)", jiji: "인(寅)" },
  "묘시": { cheongan: "정(丁)", jiji: "묘(卯)" },
  "진시": { cheongan: "무(戊)", jiji: "진(辰)" },
  "사시": { cheongan: "기(己)", jiji: "사(巳)" },
  "오시": { cheongan: "경(庚)", jiji: "오(午)" },
  "미시": { cheongan: "신(辛)", jiji: "미(未)" },
  "신시": { cheongan: "임(壬)", jiji: "신(申)" },
  "유시": { cheongan: "계(癸)", jiji: "유(酉)" },
  "술시": { cheongan: "갑(甲)", jiji: "술(戌)" },
  "해시": { cheongan: "을(乙)", jiji: "해(亥)" },
};

/** 이름 획수 → 성격 보정 */
function nameStroke(name: string): number {
  let total = 0;
  for (let i = 0; i < name.length; i++) {
    total += name.charCodeAt(i);
  }
  return total;
}

export interface FortuneResult {
  // 사주 정보
  name?: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: string;    // 태어난 시간
  ddi: string;           // 띠
  zodiac: string;        // 별자리
  cheongan: string;      // 연주 천간
  jiji: string;          // 연주 지지
  ohang: string;         // 오행
  siCheongan?: string;   // 시주 천간
  siJiji?: string;       // 시주 지지
  nameAnalysis?: string; // 이름 분석
  // 오늘의 운세
  date: string;
  categories: { name: string; text: string; score: number }[];
  luckyColor: string;
  luckyNumber: number;
  overallScore: number;
}

/** 운세 생성 — 이름+생년월일시 기반, 매일 다른 결과 */
export function generateFortune(year: number, month: number, day: number, name?: string, birthHour?: string): FortuneResult {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const birthStr = `${year}-${month}-${day}`;
  const seedBase = `${name ?? ""}-${birthStr}-${birthHour ?? ""}`;

  // 사주 계산 (간단 버전)
  const yearIdx = (year - 4) % 10;  // 천간
  const yearJiji = (year - 4) % 12; // 지지
  const monthIdx = ((year * 12 + month) % 10);
  const dayIdx = hashCode(`${birthStr}`) % 5;

  const cheongan = CHEONGAN[yearIdx >= 0 ? yearIdx : yearIdx + 10];
  const jiji = JIJI[yearJiji >= 0 ? yearJiji : yearJiji + 12];
  const ohang = OHANG[dayIdx];
  const ddi = DDI[yearJiji >= 0 ? yearJiji : yearJiji + 12];
  const zodiac = getZodiac(month, day);

  // 시주 (태어난 시간)
  const si = birthHour ? SIJU[birthHour] : undefined;

  // 이름 분석
  let nameAnalysis: string | undefined;
  if (name) {
    const stroke = nameStroke(name);
    const nameTraits = ["인복이 많은", "재물운이 강한", "리더십이 있는", "예술적 감각이 뛰어난", "학문에 뛰어난"];
    nameAnalysis = `${name}님은 ${nameTraits[stroke % nameTraits.length]} 이름입니다. 획수 기운이 ${stroke % 2 === 0 ? "음(陰)" : "양(陽)"}으로 ${stroke % 2 === 0 ? "차분하고 신중한" : "활발하고 적극적인"} 성향을 더해줍니다.`;
  }

  // 카테고리별 운세 (이름+시간도 seed에 반영)
  const categoryNames = Object.keys(FORTUNES);
  const categories = categoryNames.map(catName => {
    const seed = hashCode(`${seedBase}-${todayStr}-${catName}`);
    const texts = FORTUNES[catName];
    return {
      name: catName,
      text: texts[seed % texts.length],
      score: getScore(hashCode(`${seedBase}-${todayStr}-${catName}-score`)),
    };
  });

  const overallSeed = hashCode(`${seedBase}-${todayStr}-overall`);
  const luckyColor = LUCKY_COLORS[overallSeed % LUCKY_COLORS.length];
  const luckyNumber = getLuckyNumber(hashCode(`${seedBase}-${todayStr}-lucky`));
  const overallScore = Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length * 20);

  return {
    name, birthYear: year, birthMonth: month, birthDay: day, birthHour,
    ddi, zodiac, cheongan, jiji, ohang,
    siCheongan: si?.cheongan, siJiji: si?.jiji, nameAnalysis,
    date: todayStr,
    categories, luckyColor, luckyNumber, overallScore,
  };
}
