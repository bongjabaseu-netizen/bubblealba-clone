/** Pollinations AI 운세 유틸리티 — API 키 불필요, 무료
 *  from: Pollinations.ai text API (OpenAI-compatible endpoint)
 */
"use server";

interface AiFortuneRequest {
  type: "saju" | "face" | "zodiac" | "palm";
  // saju
  name?: string;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  birthHour?: string;
  // face
  faceFeatures?: Record<string, string>;
  // zodiac
  zodiacSign?: string;
  // palm
  palmFeatures?: Record<string, string>;
}

/** 타입별 시스템 프롬프트 */
const SYSTEM_PROMPTS: Record<AiFortuneRequest["type"], string> = {
  saju: "너는 전문 사주 운세 상담사야. 반드시 한글로 답변하고, 종합운/사랑운/금전운/건강운/직장운 카테고리별로 이모지와 함께 2~3줄로 알려줘. 마지막에 럭키컬러와 럭키넘버도.",
  face: "너는 전문 관상학 전문가야. 동양 관상학 기반으로 성격/재물운/연애운/직업운을 각 2~3줄로 분석해줘. 한글로, 이모지와 함께. 럭키컬러와 럭키넘버도.",
  zodiac: "너는 별자리 운세 전문가야. 한글로, 이모지와 함께, 종합운/사랑운/금전운/건강운 각 2줄로 간결하게. 럭키컬러와 럭키넘버도.",
  palm: "너는 전문 수상학(손금) 전문가야. 한글로, 이모지와 함께 건강/성격/재물운/연애운을 각 2~3줄로 분석해줘.",
};

/** 타입별 유저 프롬프트 빌더 */
function buildUserPrompt(req: AiFortuneRequest): string {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  switch (req.type) {
    case "saju":
      return `이름: ${req.name || "익명"}, 생년월일: ${req.birthYear}년 ${req.birthMonth}월 ${req.birthDay}일, 태어난 시간: ${req.birthHour || "모름"}. 오늘 날짜: ${today}. 사주 기반으로 오늘의 운세를 알려줘.`;

    case "face": {
      const features = req.faceFeatures
        ? Object.entries(req.faceFeatures)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : "정보 없음";
      return `내 얼굴 특징: ${features}. 이 특징들로 관상을 봐줘.`;
    }

    case "zodiac":
      return `${req.zodiacSign}의 ${today} 오늘 운세를 알려줘.`;

    case "palm": {
      const palmDesc = req.palmFeatures
        ? Object.entries(req.palmFeatures)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")
        : "정보 없음";
      return `내 손금 특징: ${palmDesc}. 이 손금으로 분석해줘.`;
    }
  }
}

/** Pollinations AI API 호출 — 15초 타임아웃 */
export async function getAiFortune(req: AiFortuneRequest): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        model: "openai",
        max_tokens: 1500,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[req.type] },
          { role: "user", content: buildUserPrompt(req) },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`API 응답 오류: ${res.status}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new Error("AI 응답 형식 오류");
    }

    return content;
  } catch {
    return "AI 운세를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  } finally {
    clearTimeout(timeout);
  }
}
