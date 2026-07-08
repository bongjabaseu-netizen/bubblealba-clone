# Changelog

## 2026-07-08 (3차 — 디자인 리뷰 시작)

- [수정] 관리자 배너 등록 사이즈 안내를 현재 홈 배너 크기에 맞게 갱신 — `BannerAdmin.tsx` BANNER_TYPES 라벨/desc + 상단 안내박스: 홈 최상단 600×150(4:1, 한 줄 2개), 둘째줄 400×150(약 8:3, 3개), 셋째줄~ 300×150(2:1, 4개·계속 추가), "높이 75px 통일·권장 비율이면 잘림 없음" 명시. (기존은 600×300/300×300/200×200 정사각 기준이라 75px 슬롯과 불일치→업로드 시 크롭 유발). 애견/법률/미용(300×300)은 홈 무관이라 유지
- [추가] 로컬 DB에 IMAGE_BOT 샘플 배너 12개 추가(`seed_bbot5~16`, order 5~16, 기존 이미지 4종 순환) — 홈 하단 4칸 배너 줄이 4개→16개(4줄)로. 코드 무변경(홈 force-dynamic이라 즉시 반영). 로컬 전용, 배포 Neon 무영향. 실측: IMAGE_BOT 16개·전부 75px
- [수정] 홈(`/`) 사진광고 배너 3줄 높이 75px로 통일 — 2번째 줄(3칸)만 100px였던 것을 맨 윗줄 기준 75px로. aspect 비율 대신 `h-[75px]` 고정 높이로 전환(칸 수가 달라도 높이 동일, 너비는 300/200/150). 검증: 9개 배너 전부 75px 실측
- [수정] 홈(`/`) 상단 배너(로고+사진광고 8개) 높이 절반·간격 제거(딱붙게)·모서리 각지게 — `page.tsx` 배너 블록: 로고 `h-[80px] object-cover`, imageTop aspect-[2/1]→[4/1], imageMid/Bot aspect-square→[2/1], 전 그리드 `gap-6px`/`space-y-6px`/`mt-*` 제거, `rounded-10px` 제거, 좌우 `px-15px`도 제거해 화면 꽉 채움. object-cover라 정사각 원본은 상하 크롭됨(사용자 지시대로 높이 우선). 텍스트 롤링 상단 여백도 제거

- [수정] 홈(`/`)에서 상단 헤더 바("채용정보") 숨김 — `Header.tsx`에 `pathname === "/"` 시 `return null`. 스페이서 div를 layout에서 Header 내부로 이동해 헤더와 함께 숨김(빈 40px 갭 방지). 다른 페이지는 헤더 유지(검증: /community 헤더 fixed·"커뮤니티" 표시)
- [수정] 홈(`/`)에서 지역·직종 필터 + 검색바(`JobFilters`) 숨김 — `page.tsx`에서 `<JobFilters/>` 주석 처리(홈 전용 컴포넌트라 타 페이지 무관), import도 주석. 임시 숨김이라 복원 용이
- [수정] 홈(`/`)에서 카테고리 바로가기 줄(부동산·법률상담·애견자랑·미용·운세) 숨김 — `CategoryIcons.tsx`에 `pathname === "/"` 시 `return null`. 다른 게시판 페이지에서는 그대로 표시(검증: /board/pets 이모지 링크 5개 유지). 사용자 디자인 지시(디자인 보드 클릭). ⚠️ 위 3건 모두 CLAUDE.md "일반 UI 변경 금지"의 사용자 지시 예외 — 홈 상단을 위에서부터 순차 정리 중
- 참고: 전 33화면 디자인 리뷰 보드(아티팩트) 운영 중 — 요소 클릭→요소 자동 인식→지시문 복사 방식. 스크린샷/요소지도는 스크래치패드 capture-all.mjs·recap-one.mjs로 생성(clone-app 소스 비수정)

## 2026-07-08 (2차 — 관리자 신규 기능 5종)

- [추가] 입찰승인 페이지(`/admin/bids`) — AdBid 목록(상태 필터 칩, 기본 "승인 대기") + PENDING 건 승인/거절 버튼. 신규 서버 액션 `getAdminBids`(admin.ts). 기존 `adminApproveBid/adminRejectBid`(advertiser.ts) 보강: 권한체크를 admin.ts와 동일 정책(JWT role 우선+DB fallback)으로 통일(`as any` 캐스팅 제거), 거절도 PENDING만 처리 가능, 입찰자 SYSTEM 알림 발송, revalidatePath 추가
- [추가] 광고거래 페이지(`/admin/orders`) — AdOrder 거래 내역 조회 전용(상태 필터 + 완료 매출 합계). 기존 `getAdminAdOrders`(ads.ts) 재사용. ⚠️ 라우트명을 `ad-orders`로 하면 기존 `/admin/ad-order`(광고순서)와 prefix 매칭 충돌(제목/사이드바 active 오판정)이라 `orders`로 결정
- [추가] 광고주인증 페이지(`/admin/advertisers`) — AdvertiserProfile 목록(미인증 우선 정렬) + 인증 버튼. 신규 `getAdvertiserProfiles`(admin.ts), 기존 `verifyAdvertiserProfile`(ads.ts)에 revalidatePath("/admin/advertisers") 추가. 거절은 스키마에 거절 상태/사유 필드가 없어 미지원(스키마 변경은 사용자 승인 사항)
- [추가] 관리자 통합검색 ⌘K 실기능 — `AdminSearch.tsx` 신규(외부 의존성 없이 자체 오버레이). Ctrl/⌘+K 열기·Esc 닫기·300ms 디바운스, 신규 `adminSearchAll`(admin.ts)로 회원(이메일·닉네임)/공고(제목·업체)/광고주(상호·사업자번호·대표자) 각 5건. AdminHeader의 장식용 검색바(→/admin/jobs 링크) 대체
- [추가] 대시보드 결제 KPI — "결제 현황" 4스탯(총 결제액/건수/평균/오늘, cgimall §10 대응) + "처리 대기"에 입찰 승인 대기·광고주 인증 대기 카드 2개 추가. 신규 `getPaymentStats`(admin.ts): 전용 결제 테이블이 없어 AdOrder(COMPLETED)+AdBid(APPROVED) 합산
- [수정] AdminSidebar "광고 · 수익" 그룹에 입찰승인/광고거래/광고주인증 메뉴 3개 + AdminHeader PAGE_TITLES 동기 추가
- [추가] 로컬 DB 데모 시드(id `seed_*`) — 입찰 4(대기2/승인1/거절1), 거래 5(완료3/대기1/취소1), 광고주 프로필 2(미인증1/인증1, busan 유저 ADVERTISER 승격). 로컬 전용, 배포 Neon 무영향
- 검증: tsc 0에러, 프로덕션 재빌드 성공, Playwright 실브라우저 — 로그인→대시보드 KPI(3,090,000원=완료주문2,590,000+승인입찰500,000 계산 일치)/입찰 승인 클릭→DB APPROVED+30일 기간+알림 생성 확인/⌘K 검색 "강남" 3그룹 결과/Ctrl+K·Esc 키보드 동작/신규 3페이지 미로그인 307 가드
- [수정] 독립 2차 리뷰(code-reviewer, Codex는 계정 플랜 문제로 실패) 지적 반영 — ① adminApproveBid/RejectBid PENDING 가드를 조건부 `updateMany`로 원자화(관리자 2명 동시 처리 시 이중 알림·상태 충돌 방지, count 0 = "이미 처리된 입찰입니다") ② AdminSearch 요청 시퀀스 도입(느린 이전 검색 응답이 최신 결과 덮어쓰는 역전 차단) + 언마운트 시 디바운스 타이머 정리 ③ verifyAdvertiserProfile updateMany 전환(삭제된 프로필 클릭 시 P2025 throw → error 반환) ④ 오늘 결제액의 AdBid 기준을 createdAt→updatedAt(승인 시각 근사)으로. 재검증: tsc 0에러·재빌드·거절 실클릭→REJECTED+알림 1건(중복 0)·KPI 재계산 일치(총 3,790,000원)·검색 정상

## 2026-07-08

- [수정] middleware.ts 세션 쿠키 판별 버그 — "production=https(Vercel)" 가정으로 `__Secure-` 쿠키명을 강제해 로컬 http 프로덕션 빌드에서 로그인이 튕김 → 실제 요청 프로토콜(`req.nextUrl.protocol`) 기준으로 변경. Vercel(https)은 기존과 동일 동작
- [수정] 로컬 실행을 프로덕션 빌드로 전환 — dev 모드 페이지별 첫 컴파일(2~5.5초) 제거. 실측: 관리자 전 11페이지 이동 57~234ms. 실행: `next start --port 3004` + env 오버라이드(DATABASE_URL 로컬/AUTH_URL=http://localhost:3004). 코드 수정 시엔 재빌드 필요
- [수정] DB를 원격 Neon(미국 AWS) → 로컬 PostgreSQL 17.5 포터블(D:\pgsql, 무설치)로 이전 — pg_dump/pg_restore로 24테이블 전부 복사, 행 수 원격=로컬 전수 일치 확인. `.env` DATABASE_URL 교체(원본은 `.env.neon.bak` 백업, `.env.production`은 Neon 유지 → 실서비스 무영향). 로그인 시 자동기동(HKCU Run "PostgresPortable"). 실측: /admin/users 726ms→167ms, /admin/login 72ms
- [수정] 관리자 페이지 이동 속도 개선 — 레이아웃 배지 조회를 getAdminStats(count 4개, 매 이동)에서 pendingReports 단일 count + 30초 메모리 캐시로 축소. 실측: /admin 3~4초 → 0.4~0.7초 (원격 Neon DB 왕복 ~1.3초/회가 병목, 잔여 지연은 각 페이지 자체 조회분)
- [수정] 로그인 직후 사이드바/다크배경 소실 버그 근본 수정 — 관리자 페이지를 `src/app/admin/(panel)/` 라우트 그룹으로 이동(URL 불변), 로그인만 그룹 밖 유지. 기존 `admin/layout.tsx`의 referer 추측 판별(로그인 후 client-side 이동 시 referer=/admin/login이라 레이아웃 전체 미적용) 삭제, 미로그인 시 `redirect("/admin/login")`로 개선. 실제 폼 제출 흐름 Playwright 재검증(사이드바 11메뉴·admin-scene·콘솔에러 0)
- [수정] `AdminHeader`에 sample-01 헤더 우측 요소 재현 — 검색 바(→광고관리), 알림벨(신고 대기 실데이터 배지→신고처리), + 공고 등록 버튼(→광고관리)
- [수정] 관리자 전체 UI를 sample-01 디자인(다크 네이비+오렌지)으로 리스타일 — 에이전트 팀 5명 병렬 작업. 대상: 대시보드/회원/광고/광고순서/게시물/게시판/신고/배너/출석/부동산/초이스톡/로그인 12화면 + 레이아웃/사이드바 (18파일 수정, `AdminHeader.tsx` 신규)
- [추가] `globals.css`에 관리자 다크 테마 토큰(Tailwind v4 `@theme`) — navy-950~700, line, brand(#ff7a1a), gold, mute, shadow-card/glow, `.admin-scene` 배경 (shadcn `--color-accent` 충돌 회피로 accent→brand 개명)
- [수정] `AdminSidebar` 그룹핑(광고·수익/회원/콘텐츠/운영) + 신고 대기 배지(실데이터) + 하단 프로필 칩(닉네임/이메일/로그아웃), `AdminHeader` pathname 기반 페이지 제목+날짜 부제 (본문 중복 h1 제거)
- 검증: `npx tsc --noEmit` 0에러, Playwright 13페이지 전체 PASS(콘솔 에러 0, 일반 사용자 UI 오염 0), 디프 검사 로직 변경 0·기능 삭제 0. 로직·서버액션·데이터 흐름 불변(스타일 전용)
- 참고: 실제 관리자 계정은 `adm`/`admin1234` (seed의 admin@bubble.clone는 연결된 Neon DB에 없음)

## 2026-07-07

- [추가] 배너 관리(/admin/banners) 순서 ⬆⬇ 이동 버튼 — 같은 타입 그룹 내 표시 위치 스왑 + 그룹 1..n 재번호(동률 order 자동 정규화). 신규 서버 액션 `adminSwapBannerOrder` (`src/lib/actions/banners.ts`), 서버측 타입 그룹 검증·interactive transaction 포함
- [수정] 배너 정렬 결정화 — `getBannerAds`/`adminGetBanners`의 orderBy에 `createdAt` 보조 키 추가 (동률 order 시 표시 순서 비결정 문제 해소)
- [수정] 관리자 전 화면 액션 버튼 lucide 아이콘화 — 공고(편집/승인/거절/마감), 신고(처리완료/반려), 게시물·게시판·부동산·초이스톡·배너(생성/편집/저장/취소/삭제/활성토글). 기존 인라인 SVG 5개도 lucide로 통일. 텍스트 라벨 유지, `whitespace-nowrap`으로 한글 세로 줄바꿈 방지
- 검증: `npx tsc --noEmit` 0에러, Playwright 브라우저 검증 14/14 PASS (콘솔 에러 0건, 스왑 후 데이터 원상복구), 독립 코드리뷰 1회(Critical 1건 수정 반영)
- 계획서: `docs/plans/2026-07-07-admin-order-icons.md`
