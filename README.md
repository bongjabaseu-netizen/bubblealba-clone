# 버블알바 클론 (bubblealba Clone)

> bubblealba.com 클론 — Next.js 16 + Prisma 7 + SQLite + NextAuth v5 풀스택 앱

## 빠른 시작

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev          # http://localhost:3004
```

## 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|---------|
| 관리자 | admin@bubble.clone | admin1234 |
| 일반유저 | user@bubble.clone | user1234 |

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.2.3 (App Router, Turbopack) |
| UI | Tailwind CSS v4 + bubblealba 커스텀 토큰 |
| DB | SQLite + Prisma 7 (better-sqlite3 adapter) |
| 인증 | NextAuth v5 (Credentials + Kakao + Google) |
| 폰트 | Pretendard Variable |
| 언어 | TypeScript strict |

## 프로젝트 구조

```
src/
├── app/
│   ├── (main)/              # 모바일 메인 (600px)
│   │   ├── page.tsx         # 홈 — 공고 리스트 + 검색/필터
│   │   ├── job/             # 공고 리스트 + 상세 + 지역별
│   │   ├── community/       # 커뮤니티 + 글쓰기 + 상세
│   │   ├── notification/    # 알림
│   │   ├── mypage/          # 마이페이지 + 하위 페이지
│   │   │   ├── ad-center/   # 광고센터 (구매/주문/프로필)
│   │   │   ├── account/     # 계정설정
│   │   │   ├── point/       # 포인트
│   │   │   ├── favorite/    # 즐겨찾기
│   │   │   ├── scrap/       # 스크랩
│   │   │   └── apply/       # 신청내역
│   │   ├── info/            # 고객센터/FAQ
│   │   └── legal/           # 약관
│   ├── (auth)/              # 인증 (로그인/약관)
│   │   └── login/
│   ├── admin/               # 관리자 대시보드 (웹)
│   │   ├── users/           # 회원관리
│   │   ├── jobs/            # 광고관리
│   │   ├── ad-order/        # 광고 순서 관리
│   │   ├── posts/           # 게시물관리
│   │   ├── boards/          # 게시판관리
│   │   └── reports/         # 신고처리
│   └── api/auth/            # NextAuth API route
├── components/
│   ├── layout/              # Header, BottomTab, AdminSidebar, NotificationBadge
│   ├── providers.tsx         # 테마 + 세션 프로바이더
│   └── ui/                  # shadcn 컴포넌트
├── lib/
│   ├── actions/             # Server Actions (8개)
│   │   ├── auth.ts          # 회원가입, 로그인
│   │   ├── phone-verify.ts  # 핸드폰 본인인증
│   │   ├── jobs.ts          # 공고 CRUD + 검색/필터
│   │   ├── posts.ts         # 게시글 CRUD + 댓글
│   │   ├── users.ts         # 프로필 + 즐겨찾기 + 스크랩
│   │   ├── admin.ts         # 관리자 (회원/공고/게시/신고/게시판/광고순서)
│   │   ├── notifications.ts # 알림 읽기/전체읽기/카운트
│   │   └── ads.ts           # 광고 구매/주문/프로필
│   ├── prisma.ts            # Prisma 클라이언트 싱글톤
│   └── mock-data.ts         # (미사용) 초기 목업 데이터
├── auth.ts                  # NextAuth 설정
├── middleware.ts             # 라우트 보호 (JWT)
└── generated/prisma/        # Prisma 생성 파일
```

## DB 모델 (16개)

| 모델 | 설명 |
|------|------|
| User | 회원 (email, password, nickname, role, points, phone, isAdult) |
| Account | OAuth 연동 (kakao, google) |
| Session | JWT 세션 |
| VerificationToken | 이메일 인증 |
| PhoneVerification | 핸드폰 본인인증 (데모: 123456) |
| Job | 구인공고 (title, wage, region, category, status, displayOrder) |
| JobApplication | 공고 신청 (PENDING→VIEWED→ACCEPTED→REJECTED) |
| Board | 게시판 (자유/인기/업체/질문 + 관리자 추가) |
| CommunityPost | 커뮤니티 게시글 |
| Comment | 댓글 |
| Favorite | 공고 즐겨찾기 |
| Scrap | 게시글 스크랩 |
| Notification | 알림 (APPLY/MESSAGE/SYSTEM/LIKE) |
| Report | 신고 (JOB/POST/USER) |
| AdPackage | 광고 패키지 (1일/30일/90일) |
| AdvertiserProfile | 광고주 프로필 (사업자정보) |
| AdOrder | 광고 주문 (결제 기록) |

## 페이지 목록 (30+개)

### 모바일 (600px)
| 경로 | 기능 |
|------|------|
| `/` | 홈 — 공고 리스트, 지역/직종/검색 필터 |
| `/job` | 구인공고 — 필터 + 정렬 |
| `/job/detail/[id]` | 공고 상세 — 설명, 신청, 즐겨찾기 |
| `/community` | 커뮤니티 — 게시판 탭, 게시글 리스트 |
| `/community/write` | 글쓰기 — 카테고리 + 제목/내용 |
| `/community/detail/[id]` | 게시글 상세 — 내용 + 댓글 |
| `/notification` | 알림 — 읽음 처리, 전체 읽음 |
| `/mypage` | 마이페이지 — 프로필, 다크모드, 푸시알림, 광고관리 |
| `/mypage/account` | 계정설정 |
| `/mypage/point` | 포인트 |
| `/mypage/favorite` | 즐겨찾기 |
| `/mypage/scrap` | 스크랩 |
| `/mypage/apply` | 신청내역 |
| `/mypage/ad-center` | 광고센터 허브 |
| `/mypage/ad-center/buy` | 광고구매 — 패키지 선택 + 구매 |
| `/mypage/ad-center/orders` | 주문내역 |
| `/mypage/ad-center/profile` | 광고프로필 — 사업자정보 등록 |
| `/login` | 로그인 — 카카오/구글/이메일 |
| `/login/legal` | 약관동의 + 핸드폰 인증 |
| `/info` | 고객센터/FAQ |
| `/legal` | 약관 |

### 관리자 (데스크탑 웹 대시보드)
| 경로 | 기능 |
|------|------|
| `/admin` | 대시보드 — 스탯 4칸 + 최근 가입/공고 |
| `/admin/users` | 회원관리 — 검색 + 역할 변경 |
| `/admin/jobs` | 광고관리 — 상태 탭 + 승인/거절/마감 |
| `/admin/ad-order` | 광고순서 — ⬆⬇ 이동 + ⭐ 광고 설정 |
| `/admin/posts` | 게시물관리 — 검색 + 삭제 |
| `/admin/boards` | 게시판관리 — 추가/수정/삭제/활성토글 |
| `/admin/reports` | 신고처리 — 상태 탭 + 처리/반려 |

## 주요 기능

### 인증
- 이메일+비밀번호 (bcrypt 해싱)
- 카카오 OAuth (`.env`에 API 키 설정)
- 구글 OAuth (`.env`에 API 키 설정)
- 핸드폰 본인인증 (데모 코드: 123456)
- JWT 세션 + 미들웨어 라우트 보호

### 다크모드
- `/mypage` 토글 ON/OFF
- CSS 변수 기반 — 전체 페이지 자동 적용
- localStorage 저장, 새로고침 후 유지

### 알림 시스템
- 6개 트리거: 공고 신청, 댓글, 스크랩, 즐겨찾기, 관리자 공고처리, 신고처리
- 하단탭 빨간 배지 (30초 자동 갱신)
- 개별 읽음 + 전체 읽음

### 광고 시스템
- 3개 패키지: 1일(120만), 30일(40만), 90일(99만)
- 광고주 프로필 등록 (사업자정보)
- 주문내역 관리
- 관리자 광고순서 조정 (⬆⬇ 이동 + 숫자 직접입력 + ⭐ 광고 토글)

### 검색/필터
- 지역 2단계 드롭다운 (시도 → 시군구)
- 직종 카테고리 (9종)
- 텍스트 검색 (제목/회사/설명/지역)
- 활성 필터 태그 + X 제거 + 초기화

### 푸시 알림
- 브라우저 Notification API
- `/mypage` 토글로 권한 요청/해제

## 환경 변수 (.env)

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your-secret-key"
AUTH_TRUST_HOST=true

# 카카오 (선택 — 없으면 이메일 로그인만)
AUTH_KAKAO_ID=""
AUTH_KAKAO_SECRET=""

# 구글 (선택 — 없으면 이메일 로그인만)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

## 광고 패키지 (seed 데이터)

| 패키지 | 기간 | 가격 | 등급 |
|--------|------|------|------|
| 1일 광고 | 1일 | 1,200,000원 | premium |
| 30일 광고 | 30일 | 400,000원 | standard |
| 90일 광고 | 90일 | 990,000원 | basic |
