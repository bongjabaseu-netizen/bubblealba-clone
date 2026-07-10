# Changelog

## 2026-07-10 (디자인 — 애견 게시판 상단 인기글 3x2 그리드)

- [추가] `/board/pets` 상단에 **🔥 인기글 3칸×2줄(6개)** 그리드 — 좋아요순 상위 6개(썸네일+❤ 오버레이). `board/pets/page.tsx` — `popularPosts = posts 정렬(likes desc).slice(0,6)`. 아래 SNS 피드(글+스폰서 인터리브)는 그대로 유지
- [검증] tsc 0, 빌드. puppeteer로 grid-cols 3·타일 6·좋아요 내림차순(342→63)·피드 12카드 유지 확인, 스크린샷. 보드 08 재캡처·재발행

## 2026-07-10 (디자인 — 카테고리 아이콘 라인 아이콘화)

- [수정] 카테고리 바로가기 스트립 이모지(💼🏠⚖️🐶💇🔮) → **lucide 라인 아이콘 + 카테고리별 소프트 톤 원형칩**. `CategoryIcons.tsx` — Briefcase/Home/Scale/Dog/Scissors/Sparkles, tint(orange/emerald/sky/amber/rose/violet-50). 화이트리스트/현재카테고리 제외 로직 유지. (Pixabay 아이콘은 API 키 미설정이라 lucide로 통일)
- [검증] tsc 0, 빌드. puppeteer로 6항목 lucide SVG·이모지 제거 확인, 스크린샷. 보드 07·08·09·12 재캡처·재발행

## 2026-07-10 (디자인 — 애견 게시판 상단 배너도 SNS 피드로 통합)

- [수정] 상단 애견샵 광고 배너 3×2 그리드 제거 → **글+광고를 인터리브한 단일 SNS 피드**로 통합. `board/pets/page.tsx` — `feedItems`(2글마다 스폰서 카드 1개, 남는 광고는 뒤에) + 광고는 스폰서 카드(🏪 상호 + "광고" 배지 + 풀폭 이미지 + "자세히 보기") 스타일. 광고(수익) 유지, 삭제 아님
- [검증] tsc 0, 빌드. puppeteer로 12카드(글6+광고6) 순서 POST/POST/AD… 확인, 상단 옛 그리드 제거 확인, 스크린샷. 보드 08 재캡처·재발행

## 2026-07-10 (디자인 — 애견 게시판 SNS 피드 전환 + 샘플 글)

- [수정] `/board/pets` 2열 사진 그리드 → **인스타 스타일 SNS 피드**. `board/pets/page.tsx` — 카드별 작성자 헤더(아바타+닉네임+시간) + 풀폭 이미지(aspect-square) + 액션 줄(❤ 좋아요·💬 댓글·🔖 저장) + 캡션(닉네임+내용). 배너/공지 버튼/헤더 유지
- [시드] 애견 샘플 글 6개(petseed1~6) — **dog.ceo 무료 강아지 사진**(핫링크). 좋아요 342/256/174/128/89/63, 작성자 4명 분산. ※ Pixabay는 API 키 미설정이라 dog.ceo로 대체(샘플 목적)
- [검증] tsc 0, 빌드. puppeteer로 카드 6개·이미지 로드·좋아요 값·캡션 확인, 스크린샷. 디자인 보드 08 재캡처·재발행
- [알려진 소소] 시드 시간(now()-interval)이 상대시간에서 "방금 전"으로 표시(타임존/파싱) — 기능 무관, 추후 필요 시 조정

## 2026-07-10 (기능 — 관리자 게시판별 관리 메뉴)

- [추가] 관리자 사이드바에 **"게시판별 관리"** 그룹 신설: 애견자랑/법률상담/미용/운세 관리 (`AdminSidebar.tsx` + `AdminHeader.tsx` 제목 4개)
- [추가] **제네릭 관리 페이지** `/admin/board/[slug]`(신규) — 해당 게시판 글/공지 작성(공지=상단 고정 토글) + 목록(고정 우선)에서 편집·삭제·고정토글. `board/[slug]/page.tsx` + `BoardManageClient.tsx`(admin 다크 테마, PostsClient 패턴 참고)
- [추가] 서버 액션 `getAdminBoardPosts(slug)`·`adminCreateBoardPost(slug,fd)`(pinned 플래그) — 기존 `adminTogglePinPost`/`adminUpdatePost`/`deleteAdminPost` 재사용
- [데이터] 운세는 Board 없어 `fortune`(name 운세) 보드 생성 → 동일 관리(공지 위주). 애견자랑=pets·법률상담=legal-consult·미용=beauty는 기존 Board
- [검증] tsc 0, 빌드. puppeteer 관리자 E2E: 4메뉴 노출, pets/fortune 관리 페이지 헤더·작성 폼, **운세 보드 공지 등록**→목록 반영 확인. 스크린샷. 디자인 보드: 관리자 14화면 재캡처(새 사이드바) + 55~58(관리 4페이지) 추가 → 58화면. (재캡처 시 min-h-screen 뷰포트 연쇄확대 버그 발견 → 캡처 전 뷰포트 800 리셋으로 수정)

## 2026-07-10 (기능 — 애견자랑 공지사항 페이지)

- [추가] `/board/pets/notice` **애견자랑 공지사항 페이지**(신규). 애견 게시판 pinned 글(=공지) 목록 + 관리자 등록 폼/삭제. `board/pets/notice/page.tsx`(server, auth로 관리자 판별) + `PetNoticeAdmin.tsx`(client: `PetNoticeForm`·`NoticeDeleteButton`)
- [추가] `/board/pets` 콘텐츠 최상단(카테고리 스트립 밑)에 **한줄 버튼** `📢 애견자랑 공지사항`(+공지 수 배지) → 공지 페이지. 갤러리 쿼리는 `pinned:false`로 공지 제외
- [추가] 서버 액션 `createBoardNotice(slug,fd)`·`deleteBoardNotice(id,slug)`(admin.ts, requireAdmin, boardSlug별 pinned 글 생성/삭제, revalidate `/board/{slug}/notice`+`/board/{slug}`)
- [검증] tsc 0, 빌드. puppeteer 관리자 로그인→공지 등록 E2E: 공지 카드(배지·내용·관리자·날짜·삭제) 렌더, 버튼 카운트 1, 갤러리 미노출 확인. 스크린샷. 디자인 보드 08 재캡처 + 54(공지 페이지) 추가·재발행

## 2026-07-10 (디자인 보드 — 하단탭 5탭 전 화면 동기화)

- [보드] 하단탭이 있는 **일반 사이트 33화면 전체**를 5탭(콘텐츠 복원) 반영 재캡처. 앱 코드는 이미 공유 `BottomTab`이라 무변경 — 보드 이미지만 옛 4탭→5탭. 로그인/관리자/광고주 화면은 별도 레이아웃(하단탭 없음)이라 제외
- [검증] 재캡처 시 각 화면 `footer nav a` 개수=5 프로그램 확인(32화면, 홈 01은 직전 완료). 리다이렉트 0건. 아티팩트 재발행

## 2026-07-10 (디자인 픽 — 하단탭 콘텐츠 탭 복원)

- [수정] 하단탭 4탭→**5탭**: 가운데에 **콘텐츠** 탭 복원(4탭 통합 때 빠졌던 것). `BottomTab.tsx` — `LayoutGrid` 아이콘, href `/board/pets`(애견 게시판이 메인), matchPrefix `["/board","/fortune","/choicetalk"]`(콘텐츠 계열에서 활성). 사용자 지시("가운데 컨텐츠 아이콘 없어짐 → 애견분양 게시판이 메인")
- [검증] tsc 0에러, 빌드, puppeteer로 5탭·가운데 콘텐츠·href `/board/pets`·`/board/pets`에서 콘텐츠 활성 확인, 스크린샷. 홈(01) 재캡처·재발행
- [참고] BottomTab은 모든 일반 사이트 화면 공통 → 다른 화면 보드 이미지엔 아직 4탭. 필요 시 일반 사이트 전체 재캡처

## 2026-07-10 (디자인 픽 — 주황 버튼 → 커뮤니티 검정 통일)

- [수정] 사용자 사이트(main)의 솔리드 주황 버튼(`bg-primary`) **15개**를 커뮤니티 게시판처럼 차분한 검정(`bg-font-black`)으로 통일. 게시판 글쓰기 4(미용/pets/법률/[slug]) + 등록 5(각 write) + CTA 5(마이페이지 계정저장·job상세 지원·운세·부동산상세·배너상세) + 초이스톡 전송 1
- [불변] 비버튼 주황은 유지: 채팅 말풍선(내 메시지)·안읽음 카운트 뱃지(chat), 커뮤니티 popular 뱃지(community/detail), 아바타 상태점(avatar) — 버튼 아님. `bg-primary/10` 태그칩·`text-primary`도 미접촉
- [검증] tsc 0에러, 빌드, puppeteer로 글쓰기 버튼 `rgb(17,17,17)`+흰글씨 확인, 스크린샷. 영향 12화면(05·08·09·12·36·38~41·43·44·45) 재캡처·아티팩트 재발행

## 2026-07-10 (디자인 보드 — 라우트 전수감사, 누락 18화면 일괄 추가 → 53화면)

- [감사] 앱 전체 `page.tsx` 라우트 57개 산출 후 manifest와 diff → 보드 미포함 19개 발견(route-audit 스크립트)
- [추가] 18화면 캡처·등록(36~53). 부동산 매물 상세(`/board/realestate/detail`)는 **RealEstateListing 0건**이라 제외:
  - 미용 게시판(36), 글쓰기 5종(커뮤니티/미용/법률/애견/부동산 37~41), 커뮤니티 상세(42), 초이스톡 톡방(43 worklife), 배너 상세(44 pet1), 마이페이지 5종(계정/지원/관심/포인트/스크랩 45~49), 광고센터 3종(구매/주문/프로필 50~52), 법적 고지(53)
- [방법] 로그인 그룹 배치 캡처(일회용 스크립트): admin(공개·글쓰기·상세), user `user@bubble.clone`(마이페이지 — 실제 포인트/찜/지원 데이터), advertiser `gn_public`(광고센터). 동적 상세는 DB 유효 id로 캡처. 전부 리다이렉트 0건 확인
- [보류] `/board/realestate/detail` — 부동산 매물 데이터 없어 미캡처(데이터 생기면 추가)

## 2026-07-10 (디자인 보드 — 광고주 초이스톡 화면 35번 추가)

- [추가] 디자인 보드에 **35 광고주 센터 · 초이스톡 등록/발송**(`/advertiser/choicetalk`) 누락분 추가. manifest.json에 항목 추가 → 총 35화면
- [주의/방법] 이 화면은 `session.user.id` 필요 + `rooms.length===0`이면 "배정된 톡방이 없습니다" 빈 화면. recap-one.mjs는 **admin**으로 로그인해 톡방 미소유 → 빈 화면만 찍힘. 톡방 소유 광고주 **강남퍼블릭**(`gn_public@bubble.clone` / `user1234`)으로 `/login` 로그인 후 캡처하는 일회용 스크립트로 실제 채팅 UI 캡처(워라밸 톡방·메시지 5개·빠른전송 버튼). 아티팩트 재발행

## 2026-07-10 (디자인 픽 — /job 태그·티씨 색 분리, 샘플 14번 채택)

- [수정] `/job` 공고 카드 태그 칩과 급여(티씨) 색이 둘 다 `primary`(오렌지)라 겹쳐 급여가 안 보이던 문제 해결. `job/page.tsx` — 색상 샘플 50안 중 사용자가 **14번(로즈 태그 · 머니그린 티씨)** 선택: 태그 `bg-primary/10 text-primary`→`bg-rose-100 text-rose-600`, 급여 `text-primary`→`text-green-600`
- [샘플] 색 조합 비교용 아티팩트 별도 발행(태그·티씨 50안, 티씨색 기준 A~G 그룹) — https://claude.ai/code/artifact/c7ad4ba0-55df-4372-8448-2971c4efde64
- [검증] tsc 0에러, 로컬 프로덕션 빌드, puppeteer 색상 확인(태그 rose #e11d48 / 급여 green #16a34a, distinct), 스크린샷. 아티팩트 /job(04) 재캡처·재발행

## 2026-07-10 (디자인 픽 — /job 공고 카드 3줄 정렬)

- [수정] `/job` 공고 카드 우측 텍스트 칼럼을 **5줄 → 3줄**로 통일. `job/page.tsx` — ①태그(광고 문구 유지) ②제목(`line-clamp-2`→`line-clamp-1` 1줄 고정) ③지역(좌)·급여(우) 한 줄로 병합. 기존 별도 지역줄·급여줄·통계줄(조회수/좋아요/시간) 제거. 사용자 지시("텍스트가 좋아요 … 좋아요 이런 것까지 5개인데 3개로 모두 정렬"). 미사용된 `relativeTime` 함수 제거(orphan)
- [검증] tsc 0에러, 로컬 프로덕션 빌드, puppeteer로 **10개 카드 전부 rowCount=3·높이 80px 동일**(uniqueHeights=[80]) 확인, 스크린샷. 아티팩트 /job(04) 재캡처·재발행

## 2026-07-10 (디자인 픽 — 커뮤니티 공지 섹션 분리)

- [수정] 커뮤니티 목록에서 관리자 고정 공지를 **일반 게시글과 별도 섹션**으로 분리. `community/page.tsx` — pinned/일반 게시글을 나눠 렌더: 공지 섹션 헤더("📢 공지 · 관리자 공지·이벤트") + 파란 틴트 공지글 + 회색 스페이서(`h-1.5 bg-bg-gray-50`)로 일반글과 구분. 기존 인라인 `📢 공지` 뱃지 제거 → 섹션 헤더가 대체. 게시글 행은 모듈레벨 `PostItem`(notice prop)로 공용화. 사용자 지시("공지 한칸, 관리자 게시글은 바로 밑에, 딱 붙지 않게")
- [검증] tsc 0에러, 로컬 프로덕션 빌드, puppeteer DOM 순서 확정(헤더146→공지글186→스페이서329→일반글335), 스크린샷. 아티팩트 커뮤니티(06) 재캡처·재발행
- [주의] `next start`(프로덕션)는 `.env.production`(→Neon 클라우드)을 `.env`(→로컬 bubble_clone)보다 우선 로드. 로컬 검증은 `DATABASE_URL` override로 로컬 DB에 물려 수행. **Neon(배포 DB)엔 `pinned` 컬럼·`HERO_SLIDE` enum 미반영 상태** → 배포 시 커뮤니티 500 위험, 사용자 결정 필요

## 2026-07-10 (디자인 픽 — 카테고리 스트립 화이트리스트)

- [수정] `CategoryIcons.tsx` 노출 로직을 블랙리스트 → **화이트리스트**로 전환. `SHOW_ON = [/board/realestate, /board/pets, /board/legal-consult, /fortune]` 4곳(+하위)에서만 노출, 그 외 전부 숨김. 사용자 지시("이 4개 빼고 다른 페이지엔 안 나오게"). 검증: puppeteer로 부동산/애견/법률/운세 표시(현재페이지 자기제외 고려), 홈/커뮤니티/미용/마이페이지/알림 숨김 확인. 아티팩트 마이페이지(15)·알림(14) 재캡처 동기화(스트립 제거 반영)

## 2026-07-10 (기능 — 커뮤니티 이용규칙 카드 + 관리자 고정 공지)

- [추가] 커뮤니티 탭 아래 **"커뮤니티 이용규칙 및 공지사항"** 접이식(details) 안내 카드 — 매너/광고금지/개인정보/책임/제재 6줄(자동 작성). `community/page.tsx`
- [추가] `CommunityPost.pinned` 필드(db push+generate, @@index). getPosts/getAdminPosts 정렬 `[{pinned desc},{createdAt desc}]` → **고정글 최상단**. 커뮤니티에서 고정글은 "📢 공지" 뱃지 + 블루 틴트
- [추가] 관리자 액션 `adminCreateNotice`(고정 공지/이벤트 등록)·`adminTogglePinPost`(고정/해제)·`adminUpdatePost`(제목/내용 수정). 관리자 `PostsClient` — 공지 등록 폼 + 고정 토글 컬럼 + 편집 모달 + 기존 삭제. 관리자가 이벤트/공지 올리고 수정/삭제 가능
- [시드] 샘플 고정 공지 1건(seed_notice1)
- [검증] tsc 0에러, db push/generate, 재빌드. puppeteer: 커뮤니티 규칙카드·고정공지 최상단(공지뱃지+틴트)·details 접힘, 관리자 로그인 후 등록버튼·고정컬럼·핀토글7·편집버튼 확인, 스크린샷 2장. 아티팩트 커뮤니티(06) 동기화

## 2026-07-10 (디자인 — 출석체크 페이지 리디자인 "딥 에메랄드 리워드")

- [수정] `CategoryIcons.tsx` 숨김 조건에 `/attendance` 추가 → 출석체크에서 공용 카테고리 스트립 숨김
- [수정] `AttendanceClient.tsx` 전면 리디자인(frontend-design 스킬) — **주홍/빨강 완전 제거**. 딥 에메랄드→차콜 그라데 히어로(멤버십 카드: Flame 연속출석 대형 숫자 + 글래스 스탯 + 소프트 글로우/시인), 포인트 티어 카드(기본 slate·3일 emerald·7일 violet), 에메랄드→틸 그라데 CTA, 이모지→lucide 아이콘(Flame/Sparkles/Gift/CalendarCheck/Check/Chevron), 정갈한 달력(오늘=에메랄드 링·출석일=에메랄드 채움·요일 rose/sky·tabular-nums), 적립 토스트 리스타일. 데이터/로직 불변. 사용자 지시("주홍 말고 퀄리티 좋게"). 검증: tsc 0에러, 재빌드, puppeteer로 스트립숨김·히어로/버튼 gradient·주홍클래스 0, 스크린샷. 아티팩트 출석체크(34) 동기화

## 2026-07-10 (디자인 픽 — 채용목록 지역·업종 셀렉트 필터)

- [추가] `(main)/components/JobFilterSelect.tsx` — 지역·업종 **네이티브 select 2개 한 줄**. 선택 시 `/job?region=&category=`로 router.push(URLSearchParams 인코딩)
- [수정] `/job/page.tsx` — 지역(링크 pill)·업종(정적 버튼) 필터 제거 → JobFilterSelect. searchParams(region/category) 읽어 `getJobs({region,category})` 필터 적용(기존엔 무필터 전체). 미사용 REGIONS/CATEGORIES 상수 제거. 사용자 지시("버튼 말고 셀렉트, 한 줄"). 검증: tsc 0에러, 재빌드, puppeteer로 select 2개·한 줄·옵션(지역11/업종10), 업종=room 선택→URL `/job?category=room`·공고 10→2 필터 확인, 스크린샷. 아티팩트 채용목록(04) 동기화

## 2026-07-10 (디자인 픽 — 채용목록 카테고리 스트립 숨김)

- [수정] `CategoryIcons.tsx` 숨김 조건에 `/job` 추가 → `pathname === "/" || startsWith("/community") || startsWith("/job")`. 채용목록(/job) 및 하위에서 공용 카테고리 스트립 숨김. 타 페이지(부동산 등) 유지. 사용자 지시. 검증: /job 스트립 숨김·화면정상, /board/realestate 스트립 유지 확인. 아티팩트 채용목록(04) 동기화

## 2026-07-10 (디자인 픽 — 커뮤니티 글쓰기 FAB 검정)

- [수정] 커뮤니티 플로팅 글쓰기 FAB 색 `bg-primary`(주황) → `bg-font-black`(검정). 사용자 지시. 검증: FAB 배경 rgb(17,17,17) 확인, 스크린샷, 아티팩트 동기화
- [확인] 출석체크 페이지(`/attendance`) 정상 동작 검증 — 서버 200·본문 렌더, 커뮤니티 출석체크 탭 클릭→/attendance 이동→달력/포인트/버튼 정상 표시(스크린샷). "안 뜸"은 잦은 재빌드 중 서버 재기동 순간 클릭 또는 브라우저 캐시로 추정, Ctrl+R(강력새로고침)로 해소

## 2026-07-10 (디자인 픽 — 출석체크 아이콘 세련되게)

- [수정] 커뮤니티 출석체크 탭 아이콘 — 밋밋한 초록 CalendarCheck 선 아이콘 → **에메랄드→그린 그라데이션 원형 뱃지(shadow-sm) + 흰 Check** 칩. `community/page.tsx`, import CalendarCheck→Check. 사용자 지시("세련되게"). 검증: 칩 배경 linear-gradient·rounded-full·box-shadow·check svg 확인, 스크린샷. 아티팩트 커뮤니티(06) 동기화

## 2026-07-10 (디자인 픽 — 커뮤니티 탭: 홍보 + 출석체크)

- [수정] 커뮤니티 카테고리 탭 — **"업체" → "홍보"**(라벨만, slug company 유지), **"질문" 제거** → 그 자리에 **출석체크 링크**(초록 CalendarCheck 아이콘 + "출석체크", `/attendance` 이동). `community/page.tsx`, CalendarCheck import. 사용자 지시. (지난 턴에 홈에서 숨겨졌던 출석체크 입구를 커뮤니티 탭에서 복구)
- [검증] tsc 0에러, 재빌드, puppeteer로 탭 전체/자유/인기/홍보/출석체크·질문없음·출석체크 href=/attendance+아이콘 확인, 스크린샷. 아티팩트 커뮤니티(06) 동기화

## 2026-07-09 (디자인 픽 — 커뮤니티 카테고리 숨김 + 글쓰기 FAB)

- [수정] `CategoryIcons.tsx` 숨김 조건에 커뮤니티 추가 — `pathname === "/" || pathname.startsWith("/community")` → 공용 카테고리 스트립(구인구직/부동산/법률상담…)이 커뮤니티에서 숨김. 타 페이지(부동산 등)엔 유지
- [수정] `community/page.tsx` — 인라인 글쓰기 버튼 제거, **우하단 플로팅 글쓰기 FAB** 추가(주황 원형+연필, `/community/write`). `fixed inset-x-0 mx-auto max-w-mobile` 래퍼 안 `absolute bottom-[64px] right-[16px]`로 모바일 컨테이너 우하단 고정(스크롤 무관). 사용자 지시
- [검증] tsc 0에러, 재빌드, puppeteer: 커뮤니티에서 스트립 숨김·글쓰기 링크 1개(FAB만)·FAB 원형/fixed/우하단(우16·하64), 부동산 페이지엔 스트립 유지·FAB 없음 확인, 스크린샷. 아티팩트 보드 커뮤니티(06) 동기화

## 2026-07-09 (기능 — 히어로 마퀴 관리자 연동)

- [추가] `BannerType` enum에 **HERO_SLIDE** 추가(prisma db push + generate). 홈 상단 히어로 마퀴를 **DB/관리자 기반**으로 전환
- [수정] `getBannerAds`에 `heroSlide` 그룹 추가. 홈 `page.tsx`는 `banners.heroSlide` 이미지를 HeroMarquee에 전달(없으면 샘플 폴백) → **관리자에서 HERO_SLIDE 배너 추가하면 홈 마퀴에 자동 슬라이딩, 갯수는 활성 배너 수**
- [수정] 관리자 `BannerAdmin.tsx` — `BANNER_TYPES`에 "홈 상단 슬라이딩 (마퀴)" 추가(드롭다운·필터·라벨 자동), 사이즈 안내에 마퀴 항목 추가. 기존 제네릭 등록/토글/순서/삭제 그대로 동작
- [시드] 샘플 HERO_SLIDE 6개(top-1·2 + bot 몇 개) 시드 → 관리자에 노출·홈 마퀴 표시
- [검증] tsc 0에러, db push/generate(HERO_SLIDE enum 생성 확인), 재빌드. puppeteer: 홈 마퀴 DB 6개→12복제 좌슬라이딩, 관리자 로그인 후 필터 "홈 상단 슬라이딩 (6)"·등록 폼 드롭다운 HERO_SLIDE 첫 옵션 확인, 스크린샷. (홈 시각 v25와 동일이라 보드 재발행 생략)

## 2026-07-09 (디자인 픽 — 홈 상단 히어로 배너 마퀴)

- [추가] `(main)/components/HeroMarquee.tsx` — 여러 배너가 **왼쪽으로 무한 슬라이딩**하는 가로 마퀴(갯수 가변). TextRolling 패턴 재사용(목록 2배 복제 + rAF translateX, CSS 키프레임 없음). props: images[]/height/speed
- [수정] 홈 로고 배너(단일 `/logo/logo-banner.png`) → **HeroMarquee**로 교체. 샘플 6배너(`HERO_BANNERS` 배열, top-1·2 + bot 몇 개) 좌슬라이딩. 사용자 지시("여러개 왼쪽 슬라이딩, 갯수 늘 수 있음"). 검증: tsc 0에러, 재빌드, puppeteer로 img 12개(6×2복제) 전부 로드·transform -298→-316(좌이동중) 확인, 스크린샷. 아티팩트 동기화
- ⚠️ 기존 브랜드 로고(명품알바 PREMIUM ALBA)가 마퀴로 대체됨 — 유지 원하면 마퀴 첫 슬라이드로 넣거나 마퀴 위에 별도 배치 가능. 마퀴 배너는 현재 샘플 배너 재사용(전용 히어로 이미지로 교체 가능)

## 2026-07-09 (디자인 픽 — 하단탭 아이콘 밑 라벨 + 4탭 정리)

- [수정] `BottomTab.tsx` — 아이콘 밑에 **라벨(홈/커뮤니티/알림/내정보, text-[10px])** 추가. Link를 flex-col(아이콘+라벨), 아이콘 h-7→h-6, 활성 라벨 볼드+검정·비활성 회색. 사용자 지시("버튼 밑에 어디 가는지 작은 글씨로")
- [정리] 중복이던 커뮤니티 탭 2개(클립보드+사람들) → **사람들(Users) 1개로 통합**, ClipboardList 제거 → **4탭**(홈/커뮤니티/알림/내정보). matchPrefix로 /community에서 커뮤니티 탭만 활성. 검증: tsc 0에러, 재빌드, puppeteer로 4탭·각 라벨 10px·/community에서 커뮤니티만 활성(라벨 볼드 600·아이콘 fill) 확인, 스크린샷, 아티팩트 동기화
- ⚠️ 5칸 유지하며 커뮤니티를 정중앙에 두려면 2번 자리에 다른 메뉴(예: 알바/job) 필요 — 원하면 지정 시 반영

## 2026-07-09 (디자인 픽 — 하단탭 중앙 버튼 → 커뮤니티)

- [수정] `components/layout/BottomTab.tsx` 중앙 탭 — 글쓰기(`/community/write`, PlusCircle) → **커뮤니티(`/community`, Users 아이콘)**. 사용자 지시("중앙 누르면 커뮤니티로, 아이콘 간단한 검정"). 아이콘은 기존 탭 스타일대로 stroke-font-black(검정). import PlusCircle→Users. 검증: tsc 0에러, 재빌드, puppeteer로 중앙 href=/community·lucide-users·검정, /community에서 탭바 정상·이중 활성 없음(중앙 matchPrefix=[]로 활성표시는 기존 커뮤니티 탭이 담당) 확인, 스크린샷. 아티팩트 동기화
- ⚠️ 커뮤니티 진입 탭이 2개(기존 클립보드 탭 + 중앙)가 됨. 원치 않으면 클립보드 탭을 다른 섹션으로 바꾸거나 한쪽 제거 가능. 중앙이 커뮤니티가 되며 글쓰기(+) 바로가기는 나브에서 빠짐(커뮤니티 페이지 내 글쓰기로 대체)

## 2026-07-09 (디자인 픽 — 로고 배너 상하 3px 간격 보완)

- [수정] 로고 배너(1개, 별도 블록이라 gap 미적용이던 곳)에 `mt-[3px]`, 사진광고 영역 래퍼에 `mt-[3px]` 추가 → **초이스톡→로고 3px, 로고→2개배너(imageTop) 3px**. 이제 홈 상단 모든 배너 간격 3px 일관. 사용자 지시("1개↔2개 사이 마진 없음 / 초이스톡 밑 1개 배너도 마진"). 검증: DOM으로 초이스톡-로고 3px·로고-imageTop 3px 확인, 스크린샷, 아티팩트 동기화

## 2026-07-09 (디자인 픽 — 홈 배너 사이 3px 간격 샘플)

- [수정] 홈 사진 광고 배너 3그리드(top/mid/bot)에 `gap-[3px]` + 래퍼 `flex flex-col gap-[3px]` → **배너 사이 상하좌우 3px 간격**. CSS grid gap 특성상 **맨 왼쪽/오른쪽 끝은 붙음**(바깥 가장자리 여백 없음), 그리드 블록 사이도 3px. 사용자 샘플 요청. 검증: bot 그리드 gap 3px·gridLeft==첫셀left(100)·gridRight==마지막셀right(700) 확인, 스크린샷, 아티팩트 동기화. (이전 gap-0 '딱붙게'에서 변경 — 되돌리려면 gap 클래스 제거)

## 2026-07-09 (디자인 픽 — 초이스톡 카톡 말풍선 아이콘 복귀)

- [수정] 홈 초이스톡 타일 — 노란 '초이스톡' 워드마크 → **카카오톡 말풍선 아이콘(노란 배지+갈색 말풍선) + '초이스톡' 라벨**로 복귀. 지역검색(검정 배지+흰 돋보기+라벨)과 아이콘+라벨 형태로 대칭. 사용자 지시. 검증: svg 아이콘·배지 rgb(254,229,0)·라벨 확인, 스크린샷, 아티팩트 동기화

## 2026-07-09 (디자인 픽 — 홈 퀵메뉴 상단 여백)

- [수정] 홈 초이스톡/지역검색 퀵메뉴 행이 최상단에 붙어 있던 것 → 상단 여백 `pt-[18px]` 추가. 사용자 지시("위에 공간 여유"). ⚠️ 처음 `pt-16px`로 넣었으나 이 프로젝트의 `py-14px`류는 직접 정의한 커스텀 유틸이라 미정의 `pt-16px`는 무효(computed 0) → arbitrary `pt-[18px]`로 수정(검증: paddingTop 18px). 재빌드·재기동, 스크린샷 확인, 아티팩트 동기화

## 2026-07-09 (디자인 픽 — 홈 퀵메뉴 카톡 워드마크 + 검정 검색)

- [수정] 홈 초이스톡 타일 — 말풍선 아이콘 → **카카오 워드마크 스타일**(노란 배지 `#FEE500` + 갈색 `#3C1E1E` "초이스톡" 글씨). 중복되던 하단 라벨 제거(배지가 이름 역할). 사용자 지시
- [수정] 홈 지역검색 타일 — 돋보기 아이콘을 오렌지 틴트 → **검정 배지(`bg-font-black`) + 흰 돋보기**로. 초이스톡 노랑과 카톡 팔레트(검정+노랑)로 짝맞춤. 사용자 지시("이쁘게 검정색으로")
- [검증] tsc 0에러, 재빌드, puppeteer로 초이스톡 배지 rgb(254,229,0)·"초이스톡" 갈색·라벨중복제거, 지역검색 배지 rgb(17,17,17)·돋보기 흰색 확인, 스크린샷. 아티팩트 보드 동기화. ⚠️ 카톡 상표 — 로컬 데모용

## 2026-07-09 (디자인 픽 — 홈 초이스톡 카카오톡 아이콘)

- [수정] 홈(`/`) 초이스톡 퀵메뉴 타일 아이콘을 일반 말풍선 → **카카오톡 아이콘**(노란 배지 `#FEE500` + 갈색 말풍선 `#3C1E1E` SVG)으로 교체. `page.tsx`. 사용자 지시. 검증: tsc 0에러, 재빌드, puppeteer로 배지 rgb(254,229,0)·아이콘 rgb(60,30,30) 확인, 스크린샷. 아티팩트 동기화. ⚠️ 카톡 로고는 카카오 상표 — 로컬 클론/데모용, 실제 배포 시 브랜드 가이드 준수 필요

## 2026-07-09 (디자인 픽 — 홈 배너 풀프레임+정중앙 재구성)

- [수정] `tools/banner-samples/gen.mjs` makeSvg 재구성 — 사용자 피드백("벡터 하나가 배너 크기 꽉 채우고 그 가운데 글씨"). 우측 원형 뱃지 제거 → **전부 정중앙 스택**(아이브로우 명품알바 / 큰 헤드라인 / 서브). **배너를 꽉 채우는 이중선 장식 프레임 + 코너 반짝이**(="벡터 하나") + 중앙 방사 글로우 + 풀프레임 보케. 헤드라인 크게(vh*0.42, 가용폭 fit). 8테마 유지. 앱 셀 규격(top1200×300/mid800×300/bot600×300)에 정합
- [참고] Canva MCP로 "광고주 모집" 배너 테스트 생성했으나(champagne 콜라주) 앱 배너 규격/중앙정렬을 못 맞춰 채택 안 함 — SVG 생성기 유지가 프레임 정합·중앙정렬에 적합. (Canva 계정에 테스트 디자인 2건 DAHO1yK6-Do/DAHO1yPxbTM 남음, 불필요시 계정에서 삭제 가능)
- [검증] top-1 원본(1200×300) 스크린샷으로 풀프레임+정중앙 확인, 홈 그리드 61개 정중앙·깨진것0. 아티팩트 보드 동기화

## 2026-07-09 (디자인 픽 — 홈 배너 고퀄리티 v2 재제작)

- [수정] `tools/banner-samples/gen.mjs` v2 — 단순 평면 배너를 **레퍼런스급 "광고주 모집" 배너**로 전면 재작성. SVG 필터(글로우 feGaussianBlur·그림자 feDropShadow·보케 블러)+세로 4스톱 메탈릭 글씨 그라데+비네트+글로시 하이라이트. 8 프리미엄 테마(핑크보케·블랙골드·퍼플글래스·골드기프트·크림엘레강스·로즈다크·블루스테이지·블루크롬), 모티프(왕관·선물·꽃잎·반짝이·라이트빔·버블), 우측 원형 "광고입점 문의" 뱃지(넓은 배너), 브랜드 아이브로우 "✦ 명품알바 ✦". 카피 광고주모집/상단노출 배너/프리미엄 광고 등. 큰 좌표계(top 1200×300·mid 800×300·bot 600×300, 셀 비율 정합)로 그려 축소해도 선명
- [기술] 파일명·개수·DB 동일(61장 재생성, seed.sql 재적용으로 title 동기화). 서버는 기동 시 public 스냅샷이라 next start 재기동으로 새 SVG 반영. 검증: top-1(핑크)·mid-1(스테이지네온) 원본크기 스크린샷으로 퀄 확인, 홈 그리드 스크린샷, puppeteer 61개 로드·깨진것0·top1 1200×300 확인. 아티팩트 보드 동기화

## 2026-07-09 (디자인 픽 — 홈 배너 샘플 61종 전면 교체 + bot 10줄 추가)

- [추가] 홈 배너 샘플 생성기 `tools/banner-samples/gen.mjs` — 칸 비율에 맞는 SVG 배너를 12템플릿×16팔레트×30업소명으로 전부 다른 디자인 생성. 슬롯: top 300×75(2) · mid 200×75(3) · bot 150×75. `public/banners/sample/*.svg` 61장 + `seed.sql` 발행
- [수정] 홈 배너 DB 시드 — 로고배너(logo-banner.png) 제외 **전부 새 SVG로 교체**. IMAGE_TOP 2·IMAGE_MID 3·IMAGE_BOT 기존 16 교체 + **40개 신규(seed_bbot17~56) 추가 → bot 총 56칸(14줄, +10줄)**. 기존 Cloudinary 반복 이미지(깨져 보이던 것)를 칸에 정확히 맞는 SVG로 대체. imageUrl은 루트상대경로(`/banners/sample/...`), userId 기존 재사용. 사용자 지시. ⚠️ 일반 UI(데이터) 변경 사용자 지시 예외
- [기술] 페이지 코드(`page.tsx`) 무수정 — grid-cols-4 자동 줄바꿈으로 bot 56칸이 14줄로 렌더. force-dynamic이라 재빌드 불필요(단, 서버가 기동 시 public 스냅샷 → 새 SVG 서빙 위해 next start 재기동 필요했음). 검증: puppeteer로 샘플배너 61·깨진이미지 0·bot 4열14줄·첫배너 300×75 확인, 스크린샷으로 디자인 다양성 육안 확인. 아티팩트 보드 홈(01) 동기화

## 2026-07-09 (디자인 픽 — 홈 초이스톡·지역검색 카톡식 퀵메뉴 타일)

- [수정] 홈(`/`) 초이스톡·지역검색을 가로 리스트 행 → **2열 세로 타일**로 변경 — 아이콘(24px, rounded-2xl 배지) 상단·라벨(font-12sb) 하단, 가운데 정렬(flex-col items-center). ChevronRight 제거(import에서도 제거, 이제 미사용). `page.tsx` 2개 Link를 `grid grid-cols-2` div로 묶고 가운데 구분선(border-r). 사용자 디자인 픽 지시. ⚠️ 일반 UI 변경 사용자 지시 예외. 검증: tsc 0에러, 재빌드(초기 /job 프리렌더 일시실패→재시도 성공, 내 변경 무관), puppeteer로 flex-col·items-center·아이콘 위/텍스트 아래·가로중앙·체브론 제거 확인. 아티팩트 보드 홈(01) 동기화

## 2026-07-09 (디자인 픽 — 홈 "지역검색" 행 추가)

- [추가] 홈(`/`) 초이스톡 행 바로 아래에 **지역검색** 행 추가 — 초이스톡과 동일 스타일(h-44px·동일 클래스), 돋보기 아이콘(lucide `Search`), 클릭 시 `/job`(채용정보 목록)로 이동. `page.tsx`에 Link 1개 + `Search` import. 사용자 디자인 픽 지시. ⚠️ 일반 UI 변경 사용자 지시 예외. 검증: tsc 0에러, 재빌드, puppeteer로 지역검색 존재·href=/job·돋보기 svg·초이스톡 바로 아래(top=44, 600×44 동일) 확인. 아티팩트 보드 홈(01) 동기화

## 2026-07-09 (디자인 픽 — 홈 "배너만 노출")

- [수정] 홈(`/`)에서 **텍스트롤링 광고·출석체크/광고등록 CTA·공고 리스트** 3블록 임시 숨김 → 배너 광고(로고배너+사진배너)와 초이스톡만 노출. `page.tsx`에서 해당 JSX 3블록 주석 처리 + 그로 인해 미사용된 `getJobs`/`TextRolling`/`Plus` import·jobs 조회도 함께 비활성(헬퍼 함수는 복원 편의로 존치). 사용자 디자인 픽 지시. ⚠️ clone-app CLAUDE.md "일반 UI 변경 금지"의 사용자 지시 예외. 검증: tsc 0에러, 프로덕션 재빌드, puppeteer로 초이스톡·로고배너·사진배너21 잔존 & 출석체크/광고등록/공고/롤링 전부 제거 확인. 아티팩트 보드 홈(01) 재캡처·재발행 동기화
- 참고: 초이스톡은 픽 목록에 없어 존치(직전 세션에 최상단 배치 지시). 숨김 원하면 추가 지시로 처리

## 2026-07-09 (디자인 변경 → 아티팩트 자동 동기화 파이프라인 영구화)

- [추가] 디자인 보드 캡처 스크립트 3종을 임시 scratchpad에서 앱 영구 위치 `tools/design-board/`로 이전 — `capture-all.mjs`(33화면 부트스트랩), `recap-one.mjs`(단일 화면 재캡처), `build-gallery.mjs`(보드 HTML 재조립). 다음 세션에서도 동작. 생성물(shots/·design-board.html)은 `.gitignore` 처리, 스크립트만 버전관리. README 추가
- [수정] `recap-one.mjs` — 이제 `RC_PATH`만 주면 `shots/manifest.json`에서 화면번호를 자동 해석(RC_NUM 수동 지정 불필요). 없는 경로면 명확히 에러
- [워크플로] `design-pick` 스킬에 **★아티팩트 동기화**를 필수 마지막 단계로 추가 — 디자인 변경 시 바뀐 페이지 1장만 재캡처(전면 재캡처 금지) → 보드 재조립 → 고정 URL(`…/artifact/49b777ba…`, favicon 🎨)에 재발행. 사용자 지시("디자인 변경하면 아티팩트에서도 변경되게"). 검증: 영구 위치에서 `RC_PATH='/'`로 홈이 화면 01로 자동 재캡처(요소 173개)·보드 2.01MB 재조립·기존 URL 재발행 성공

## 2026-07-09 (디자인 픽 — 홈/채용목록 수정)

- [수정] 채용정보 목록(`/job`) 공고 카드에 왼쪽 70×70 정사각 프로필 썸네일 추가 — 홈 공고와 동일 패턴(가로 flex, `job.images[0]` 배경). `job/page.tsx`에 images 파싱 + 썸네일 div. 사용자 디자인 픽 지시. 검증: 카드 10개 전부 70×70 썸네일·실이미지 로드·가로 레이아웃 확인. ⚠️ 일반 UI 변경 사용자 지시 예외
- [수정] 홈(`/`) 초이스톡 CTA를 최상단으로 이동 — 기존 "출석체크·초이스톡·광고등록" 그룹에서 초이스톡만 빼서 페이지 맨 위(로고 배너보다 위)로. `page.tsx`. 사용자 디자인 픽 지시(2026-07-09). ⚠️ clone-app CLAUDE.md "일반 UI 변경 금지"의 사용자 지시 예외. 검증: 초이스톡 링크 top=0·main 첫 링크·중복 0, 스크린샷 확인

## 2026-07-09 (디자인 픽커 — 캡처 없는 라이브 수정 도구)

- [추가] `DesignPicker` (src/components/dev/DesignPicker.tsx) — localhost 전용 요소 선택 오버레이. 좌하단 🎯 버튼/Alt+P로 켜고 고칠 부분 클릭 → 요소 정보(화면·태그·클래스·텍스트·크기·DOM경로)가 클립보드로 복사. 배포 도메인에선 location.hostname 게이트로 렌더/리스너 전부 무력화(실서비스 영향 0). 루트 `app/layout.tsx`에 장착(전 화면)
- [수정] DesignPicker 픽 목록 패널이 뒤 요소를 가려 못 집던 문제 — 픽 중(active)엔 패널 `pointer-events:none`+반투명 처리로 클릭 통과(패널 뒤 요소도 집힘), Esc로 끄면 다시 클릭 가능해 복사. 토글 버튼·패널을 하단 탭 위(bottom:72)로 이동. 진단: DOM상 초이스톡은 최상단(덮개 0개)이었고 실제 덮개는 픽커 자체 UI였음
- [목적] 디자인 검토 시 33화면 스크린샷 재캡처(토큰 낭비)를 없앰 — 픽 텍스트만으로 소스 grep→수정. 워크플로는 프로젝트 스킬 `design-pick`(D:\debug\.claude\skills)로 문서화
- 검증: tsc 0에러, 프로덕션 재빌드, Playwright 실동작(로고 배너 클릭→`<img.w-full.h-[80px].object-cover> (600×80)` 픽 생성, preventDefault로 링크이동 차단 확인)

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
