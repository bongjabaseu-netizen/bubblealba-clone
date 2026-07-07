# Changelog

## 2026-07-07

- [추가] 배너 관리(/admin/banners) 순서 ⬆⬇ 이동 버튼 — 같은 타입 그룹 내 표시 위치 스왑 + 그룹 1..n 재번호(동률 order 자동 정규화). 신규 서버 액션 `adminSwapBannerOrder` (`src/lib/actions/banners.ts`), 서버측 타입 그룹 검증·interactive transaction 포함
- [수정] 배너 정렬 결정화 — `getBannerAds`/`adminGetBanners`의 orderBy에 `createdAt` 보조 키 추가 (동률 order 시 표시 순서 비결정 문제 해소)
- [수정] 관리자 전 화면 액션 버튼 lucide 아이콘화 — 공고(편집/승인/거절/마감), 신고(처리완료/반려), 게시물·게시판·부동산·초이스톡·배너(생성/편집/저장/취소/삭제/활성토글). 기존 인라인 SVG 5개도 lucide로 통일. 텍스트 라벨 유지, `whitespace-nowrap`으로 한글 세로 줄바꿈 방지
- 검증: `npx tsc --noEmit` 0에러, Playwright 브라우저 검증 14/14 PASS (콘솔 에러 0건, 스왑 후 데이터 원상복구), 독립 코드리뷰 1회(Critical 1건 수정 반영)
- 계획서: `docs/plans/2026-07-07-admin-order-icons.md`
