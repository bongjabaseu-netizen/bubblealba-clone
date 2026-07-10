# design-board — 디자인 검토 보드 + 변경 동기화

명품알바 전 화면을 한 페이지 아티팩트로 모아, 요소를 클릭해 지시문을 만들고, **디자인 변경 후 바뀐 페이지만 재캡처해 보드를 최신으로 유지**하는 도구.

- 워크플로 전체는 `design-pick` 스킬(`D:\debug\.claude\skills\design-pick\SKILL.md`) 참조.
- 아티팩트 고정 URL: `https://claude.ai/code/artifact/49b777ba-92ec-4590-9a46-e0e8327b295c` (favicon 🎨)
- 전제: 로컬 앱이 `http://localhost:3004` 에서 프로덕션 모드로 실행 중.

## 스크립트

| 파일 | 역할 |
|------|------|
| `capture-all.mjs` | 33화면 전체 캡처 (세션당 1회 부트스트랩) — `shots/*.jpg`, `shots/*.json`(요소지도), `shots/manifest.json` 생성 |
| `recap-one.mjs` | 단일 화면 재캡처 — `RC_PATH` 만 주면 `manifest.json` 에서 화면번호 자동 해석 |
| `build-gallery.mjs` | `shots/` → `design-board.html` 재조립 (jpg base64 인라인 + 요소지도 임베드) |

`shots/` 와 `design-board.html` 은 재생성물이라 `.gitignore` 처리됨. 스크립트만 버전관리.

## 디자인 변경 후 동기화 (바뀐 페이지만)

```bash
cd D:/debug/clone-app/tools/design-board
# ① 바뀐 라우트만 재캡처 (여러 곳 바뀌면 경로마다 반복)
MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*' RC_PATH='/job' node recap-one.mjs
# ② 보드 재조립
node build-gallery.mjs
# ③ Artifact 툴로 design-board.html 을 위 고정 URL 에 재발행
```

`RC_PATH` 가 `/` 로 시작하므로 Git-Bash 경로변환 방지 플래그(`MSYS_*`) 필수.

## 새 세션 부트스트랩 (shots/ 없을 때)

```bash
cd D:/debug/clone-app/tools/design-board && node capture-all.mjs && node build-gallery.mjs
```

## 의존성

Playwright 는 크롤러 워크스페이스(`D:/debug/captures/bubblealba/.work/node_modules/playwright`)를 절대경로로 참조. 별도 설치 불필요.
