# 배너 자동 생성기 — 프로토타입 (미통합)

업소명·이름만 입력하면 홈 배너와 공고 정사각 썸네일을 **같은 디자인 세트**로 자동 생성하는 SVG 생성기. 외부 API·비용 없이 앱 안에서 즉석 렌더(SVG data URI).

> ⚠️ **아직 관리자에 통합되지 않은 프로토타입.** 이 폴더는 2026-07-08~09 디자인 검토 과정에서 확정된 생성기 로직을 보존한 것. 실제 구현(관리자 배너관리 "이름으로 생성" 탭) 시 `banner-gen.mjs`를 `src/lib/`로 TS 이식 예정.

## 파일
- `banner-gen.mjs` — 핵심 생성기 (파라메트릭 프레임/벡터 시스템)
- `build-demo-artifact.mjs` — 인터랙티브 데모(아티팩트) 빌드 스크립트. Pretendard woff2를 base64 인라인 + 데모 UI 조립

## 기능 요약
- **입력**: 업소명(상단, 작게) / 이름(하단, 크게) 2단 — 원본 명품알바 배너 스타일("강남엘리트 / 일우")
- **디자인 축**: 색 팔레트 6 × 프레임 50 × 벡터(엠블럼) 50 × 배경 입자 8 = **약 120,000 조합**
- **자동 배정**: 업소명+이름 해시 → 업소마다 서로 다른 조합 자동 선택(같은 이름=같은 디자인, 일관성). 관리자에서 개별 override 가능
- **글씨 크기**: 가로배너·정사각 각각 상단(업소명)/하단(이름) 개별 배율(`fontScale = {shop, name}`)
- **폰트**: Pretendard(앱과 동일). 단어 경계 줄바꿈(글자 중간 안 쪼갬), 프레임 안 여백 중앙 배치
- 슬롯 크기: top 600×150 · mid 400×150 · bot 300×150 · square 140×140 (표시 높이 75px)

## API
```js
generateBannerSVG(input, size, design?, fontScale?)
// input: "이름" 또는 {shop, name}
// size: SLOT_SIZES.top | .mid | .bot | .square
// design: 미지정 → 이름해시 자동배정 | 숫자 → 계열고정 | {p,f,v,pt} → 개별지정
// fontScale: 숫자 또는 {shop, name}
```

## 미결정 (실제 구현 전 확정 필요)
- 썸네일 저장 방식: (a) 배너만 저장+썸네일 미리보기 / (b) 배너 + 특정 공고 대표 썸네일까지 교체

## 데모
빌드: `node build-demo-artifact.mjs` (Pretendard woff2 경로는 스크립트 상단 FONT_PATH 참조) → `banner-gen-demo.html` 생성.
