# Implementation Plan: 관리자 페이지 웹 대시보드 리디자인

## Context
현재 모바일 하단탭 방식 관리자 → 깔끔한 데스크탑 웹 대시보드로 전면 재설계. 사이드바+콘텐츠 카드 레이아웃.

## Current State
- 레이아웃: `src/app/admin/layout.tsx` — 사이드바(md+) + 모바일 하단탭
- 사이드바: `src/components/layout/AdminSidebar.tsx` — 6개 nav + 설정/로그아웃
- 페이지 6개: dashboard, users, jobs, posts, reports, boards
- 클라이언트 테이블: UserTable, JobTable, PostTable, ReportTable, BoardManager
- Server actions: `src/lib/actions/admin.ts` — 15개 함수 (전부 재사용)
- DB 모델: User, Job, CommunityPost, Board, Report + 관계 (전부 재사용)

## Changes

### 1. 레이아웃 리디자인 (`src/app/admin/layout.tsx`)
- 좌측 사이드바 240px (항상 표시, 모바일 하단탭 제거)
- 상단 헤더바 64px — 관리자명 + 로그아웃 + 사이트 이동
- 콘텐츠 영역: 패딩 24px, max-width 없음 (풀와이드)
- 색상: bg-slate-50 배경, 흰 카드, 사이드바 bg-slate-900 다크

### 2. 사이드바 리디자인 (`src/components/layout/AdminSidebar.tsx`)
- 다크 테마 (bg-slate-900 text-white)
- 로고 + "관리자 콘솔" 상단
- 메뉴: 대시보드, 회원관리, 광고관리, 게시물관리, 게시판관리, 신고처리
- 하단: 설정, 사이트 보기, 로그아웃

### 3. 대시보드 (`src/app/admin/page.tsx`)
- 4개 스탯 카드 (그리드 4열)
- 최근 가입 회원 테이블 (5명)
- 최근 공고 테이블 (5건)
- 처리 대기 신고 카드
- 추가 stats: 오늘 가입, 오늘 공고, 오늘 게시글

### 4. 회원관리 (`src/app/admin/users/`)
- 검색 + 역할 필터
- 테이블: 닉네임, 이메일, 역할, 가입일, 본인인증, 포인트
- 행 클릭 → 역할 변경 드롭다운
- 페이지네이션

### 5. 광고관리 (`src/app/admin/jobs/`)
- 상태 탭 (전체/대기/활성/거절/마감)
- 테이블: 제목, 회사, 지역, 상태, 등록일, 조회수
- 상태 변경 버튼 (승인/거절/마감)
- 검색

### 6. 게시물관리 (`src/app/admin/posts/`)
- 게시판 필터 + 검색
- 테이블: 제목, 게시판, 작성자, 작성일, 조회수, 댓글수
- 삭제 버튼

### 7. 게시판관리 (`src/app/admin/boards/`)
- 게시판 목록 카드 (이름, 슬러그, 게시글수, 활성 상태)
- 추가 폼
- 수정/삭제/활성토글

### 8. 신고처리 (`src/app/admin/reports/`)
- 상태 탭 (전체/대기/처리/반려)
- 테이블: 대상, 유형, 사유, 신고자, 상태, 날짜
- 처리완료/반려 버튼

### 9. 추가 server actions (`src/lib/actions/admin.ts`)
- `getRecentUsers(limit)` — 최근 가입 5명
- `getRecentJobs(limit)` — 최근 공고 5건
- `getTodayStats()` — 오늘 가입/공고/게시 수
- `searchUsers(query)` — 회원 검색
- `searchJobs(query, status?)` — 공고 검색

## Implementation Sequence
1. admin.ts에 추가 server actions 5개
2. AdminSidebar 다크 테마 리디자인
3. admin/layout.tsx 사이드바+헤더+콘텐츠 구조
4. admin/page.tsx 대시보드 리디자인
5. admin/users/ 회원관리 (검색+필터+테이블)
6. admin/jobs/ 광고관리 (상태탭+검색+테이블)
7. admin/posts/ 게시물관리 (게시판필터+검색)
8. admin/boards/ 게시판관리 (카드형)
9. admin/reports/ 신고처리 (상태탭)

## Verification
```
npx tsc --noEmit && 브라우저에서 /admin 전체 확인
```
