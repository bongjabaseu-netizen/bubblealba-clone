# 관리자 광고순서 완성 + 아이콘 UI 개선 — 구현 계획

> **For agentic workers:** 태스크 단위로 구현. 파일 겹침 금지(태스크별 담당 파일 분리됨). 완료 조건: `npx tsc --noEmit` 0에러 + 브라우저 확인.

**Goal:** ① 배너 광고에 위/아래 순서 이동 버튼 추가(현재는 편집 모달의 숫자 입력만 가능), ② 관리자 전 화면의 액션 버튼·통계 카드를 lucide 아이콘 기반으로 통일해 가독성 개선.

**Architecture:** 기존 패턴 복제 — 순서 스왑은 `src/lib/actions/admin.ts`의 `swapJobOrder`(262-273행) 패턴을 `banners.ts`에 이식. 아이콘은 이미 프로젝트 표준인 lucide-react named import(`AdminSidebar.tsx:5-19` 참조). **기존 레이아웃/색상/간격/클래스 유지, 버튼 내부에 아이콘만 추가** (프로젝트 규칙: UI 구조 변경 금지 — 이번 아이콘 추가는 사용자 직접 지시).

**Tech Stack:** Next.js 16 App Router(서버 액션 "use server"), Prisma 7(PostgreSQL, PrismaPg), lucide-react ^1.8.0, Tailwind 4.

**공통 규칙 (전 태스크):**
- 파일 500줄 초과 금지. 한글 주석. 기존 코드 스타일·클래스 유지.
- 아이콘 표준: `import { X } from "lucide-react"`, 크기 `className="w-4 h-4"` (테이블 안은 `w-3.5 h-3.5`), 버튼은 `inline-flex items-center gap-1` + 기존 클래스 유지, 아이콘 앞·텍스트 뒤(텍스트 라벨 제거 금지).
- 아이콘 매핑: 편집=Pencil, 삭제=Trash2, 승인=Check, 거절=X, 마감=Archive, 활성/비활성 토글=Power, 저장=Save, 취소=X, 처리완료=CheckCircle2, 반려=XCircle, 생성/등록=Plus, 위=ArrowUp, 아래=ArrowDown, 검색=Search.
- Next.js 16 주의: 기존 파일의 import/컨벤션을 그대로 따를 것 (훈련 데이터 속 구버전 관례 금지).
- 서버 액션 추가 시 기존 `revalidatePath` 패턴 복제 (배너는 홈에도 노출되므로 기존 액션들이 재검증하는 경로 그대로).

---

### Task 1: 배너 순서 위/아래 이동 (담당 파일: banners.ts, BannerAdmin.tsx)

**Files:**
- Modify: `src/lib/actions/banners.ts` — `adminSwapBannerOrder` 서버 액션 추가
- Modify: `src/app/admin/banners/BannerAdmin.tsx` — 순서 컬럼에 ⬆⬇ 버튼 + 이 화면 액션 버튼 아이콘화

**Step 1: 서버 액션 추가** — `banners.ts` 끝에, 기존 `adminUpdateBanner`(84-103행)의 권한 체크·revalidate 패턴과 `admin.ts`의 `swapJobOrder`(262-273행) 스왑 로직을 결합:

```ts
/** 두 배너의 order 값을 맞교환 (같은 타입 그룹 내 위/아래 이동용) */
export async function adminSwapBannerOrder(idA: string, idB: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("권한이 없습니다.");
  const [a, b] = await Promise.all([
    prisma.bannerAd.findUniqueOrThrow({ where: { id: idA } }),
    prisma.bannerAd.findUniqueOrThrow({ where: { id: idB } }),
  ]);
  // order가 같으면 스왑해도 순서가 안 바뀌므로 한쪽을 ±1 보정
  const orderA = a.order === b.order ? b.order + 1 : b.order;
  await prisma.$transaction([
    prisma.bannerAd.update({ where: { id: idA }, data: { order: orderA } }),
    prisma.bannerAd.update({ where: { id: idB }, data: { order: a.order } }),
  ]);
  // 기존 액션들이 재검증하는 경로 그대로 복제할 것 (파일 안 기존 코드 확인)
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
```
※ 실제 권한 체크 방식(auth() vs 헬퍼)과 revalidatePath 경로는 **같은 파일의 기존 액션 코드를 열어 똑같이** 맞출 것.

**Step 2: BannerAdmin.tsx 순서 컬럼에 버튼** — 순서 `<td>`(142행 부근)에 숫자 옆 ⬆⬇ 버튼. 리스트는 [type, order] 정렬이므로 **같은 type끼리만** 스왑:

```tsx
// 렌더 전에 타입별 인접 항목 계산 (컴포넌트 함수 안, 기존 상태 건드리지 않음)
const sameType = banners.filter((x) => x.type === b.type);
const idx = sameType.findIndex((x) => x.id === b.id);
const prev = idx > 0 ? sameType[idx - 1] : null;
const next = idx < sameType.length - 1 ? sameType[idx + 1] : null;
```
버튼은 `ad-order/AdOrderManager.tsx:130-145`의 ArrowUp/ArrowDown 버튼 마크업·클래스를 그대로 복제하고, onClick에서 `adminSwapBannerOrder(b.id, prev.id)` 호출 후 기존 새로고침 방식(router.refresh() 또는 기존 패턴) 재사용. prev/next 없으면 disabled.

**Step 3: 이 화면 버튼 아이콘화** — 편집(Pencil)/삭제(Trash2)/활성토글(Power)/등록(Plus)/모달 저장(Save)·취소(X)에 공통 규칙대로 아이콘 추가.

**Step 4: 검증** — `npx tsc --noEmit` 0에러.

---

### Task 2: 아이콘화 A — 대시보드·공고·회원·신고 (담당 파일: admin/page.tsx, JobTable.tsx, UserTable.tsx, ReportsClient.tsx)

**Files:**
- Modify: `src/app/admin/page.tsx` — 통계 4카드에 아이콘 (회원=Users, 공고=Briefcase, 게시물=MessageSquare, 대기신고=Flag — 사이드바와 동일 아이콘으로 통일). 카드 기존 레이아웃 유지, 라벨 왼쪽에 아이콘만.
- Modify: `src/app/admin/jobs/JobTable.tsx` — 행 액션 편집=Pencil, 승인=Check, 거절=X, 마감=Archive. 모달 저장=Save/취소=X.
- Modify: `src/app/admin/users/UserTable.tsx` — 검색 버튼=Search, 역할 select는 그대로 둠(구조 변경 금지).
- Modify: `src/app/admin/reports/ReportsClient.tsx` — 처리완료=CheckCircle2, 반려=XCircle.

각 파일: 기존 버튼 클래스·색상·텍스트 유지, 아이콘만 prepend. `npx tsc --noEmit` 통과 확인.

---

### Task 3: 아이콘화 B — 게시물·게시판·부동산·초이스톡 (담당 파일: PostsClient.tsx, BoardsClient.tsx, RealEstateAdmin.tsx, ChoiceTalkAdmin.tsx)

**Files:**
- Modify: `src/app/admin/posts/PostsClient.tsx` — 삭제=Trash2, 검색=Search. **기존 인라인 SVG는 동일 의미의 lucide로 교체** (크기·클래스 동일 유지).
- Modify: `src/app/admin/boards/BoardsClient.tsx` — 생성=Plus, 인라인 편집 저장=Save/취소=X, 활성토글=Power, 삭제=Trash2. 인라인 SVG → lucide 교체.
- Modify: `src/app/admin/realestate/RealEstateAdmin.tsx` — 등록=Plus, 삭제=Trash2, 상태변경 select는 그대로.
- Modify: `src/app/admin/choicetalk/ChoiceTalkAdmin.tsx` — 생성=Plus, 활성토글=Power, 삭제=Trash2.

각 파일: 기존 버튼 클래스·색상·텍스트 유지, 아이콘만 prepend. `npx tsc --noEmit` 통과 확인.

---

### Task 4: 통합 검증 (verifier)

1. `npx tsc --noEmit` — 0에러
2. dev 서버(이미 3104에서 실행 중, HMR)로 관리자 로그인(계정은 `prisma/seed.ts` 참조 — 값 출력 금지) 후 Playwright 스크린샷: `/admin`(대시보드 카드), `/admin/banners`(⬆⬇ 버튼), `/admin/jobs`, `/admin/boards`
3. `/admin/banners`에서 ⬆ 클릭 → 같은 타입 안에서 행 순서가 실제로 바뀌는지 + 홈(`/`)의 해당 배너 그리드 순서도 바뀌는지 스크린샷 전후 비교
4. 콘솔/터미널에 런타임 에러 없는지 dev 로그 확인
