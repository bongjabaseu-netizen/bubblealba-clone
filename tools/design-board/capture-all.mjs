/** 전 페이지 스크린샷 + 요소지도 통합 캡처 (v2)
 * fixed 요소(하단 탭 등)가 제 위치에 찍히도록: 뷰포트 높이를 문서 전체 높이로 늘려 non-fullPage 캡처.
 * 같은 상태에서 요소지도도 추출 → 스크린샷과 좌표 완전 일치 */
import { chromium } from "file:///D:/debug/captures/bubblealba/.work/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "http://localhost:3004";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "shots");
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["일반 사이트", "홈", "/"],
  ["일반 사이트", "로그인", "/login"],
  ["일반 사이트", "성인인증 안내", "/login/legal"],
  ["일반 사이트", "채용정보 목록", "/job"],
  ["일반 사이트", "채용정보 상세", "/job/detail/cmo01l3sk000hbwu8xxmrr7lj"],
  ["일반 사이트", "커뮤니티", "/community"],
  ["일반 사이트", "부동산 게시판", "/board/realestate"],
  ["일반 사이트", "애견분양 게시판", "/board/pets"],
  ["일반 사이트", "법률상담 게시판", "/board/legal-consult"],
  ["일반 사이트", "초이스톡", "/choicetalk"],
  ["일반 사이트", "채팅", "/chat"],
  ["일반 사이트", "운세", "/fortune"],
  ["일반 사이트", "이용안내", "/info"],
  ["일반 사이트", "알림", "/notification"],
  ["일반 사이트", "마이페이지", "/mypage"],
  ["일반 사이트", "광고센터", "/mypage/ad-center"],
  ["광고주 센터", "광고주 대시보드", "/advertiser"],
  ["광고주 센터", "광고 입찰", "/advertiser/bid"],
  ["관리자", "관리자 로그인", "/admin/login"],
  ["관리자", "대시보드", "/admin"],
  ["관리자", "회원관리", "/admin/users"],
  ["관리자", "광고관리", "/admin/jobs"],
  ["관리자", "광고순서", "/admin/ad-order"],
  ["관리자", "배너관리", "/admin/banners"],
  ["관리자", "입찰승인", "/admin/bids"],
  ["관리자", "광고거래", "/admin/orders"],
  ["관리자", "광고주인증", "/admin/advertisers"],
  ["관리자", "게시물관리", "/admin/posts"],
  ["관리자", "게시판관리", "/admin/boards"],
  ["관리자", "부동산매물", "/admin/realestate"],
  ["관리자", "초이스톡 관리", "/admin/choicetalk"],
  ["관리자", "출석체크", "/admin/attendance"],
  ["관리자", "신고처리", "/admin/reports"],
];

const MAXH = 8000;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

// 관리자 로그인
await page.goto(BASE + "/admin/login", { waitUntil: "domcontentloaded" });
await page.fill('input[name="email"]', "adm");
await page.fill('input[name="password"]', "admin1234");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin", { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1500);

/** 브라우저 안: 요소지도 수집 (뷰포트=문서 전체 상태에서 실행 → rect가 곧 문서 좌표) */
const collect = () => {
  const out = [];
  const seen = new Set();
  const MAX = 450;
  const label = (el) => {
    const tag = el.tagName.toLowerCase();
    let sel = tag;
    if (el.id) sel += "#" + el.id;
    else {
      const cls = [...el.classList].filter((c) => !/^(hover|focus|group|peer)/.test(c)).slice(0, 2);
      if (cls.length) sel += "." + cls.join(".");
    }
    let txt = "";
    if (tag === "img") txt = el.alt || "";
    else txt = (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 24);
    return sel + (txt ? ' "' + txt + '"' : "");
  };
  for (const el of document.querySelectorAll("*")) {
    if (out.length >= MAX) break;
    const tag = el.tagName;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "META", "LINK", "HTML", "BODY"].includes(tag)) continue;
    const r = el.getBoundingClientRect();
    const x = r.left + window.scrollX, y = r.top + window.scrollY;
    if (r.width < 24 || r.height < 16) continue;
    if (r.width * r.height > innerWidth * innerHeight * 0.9) continue; // 문서 전체 래퍼 제외
    const st = getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || +st.opacity === 0) continue;
    const key = [Math.round(x), Math.round(y), Math.round(r.width), Math.round(r.height)].join(",");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([Math.round(x), Math.round(y), Math.round(r.width), Math.round(r.height), label(el)]);
  }
  return { w: Math.max(document.documentElement.scrollWidth, innerWidth), h: innerHeight, els: out };
};

const manifest = [];
let i = 0;
for (const [section, label, path] of PAGES) {
  i++;
  const num = String(i).padStart(2, "0");
  const file = `${num}.jpg`;
  try {
    const res = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 20000 })
      .catch(() => page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 20000 }));
    const status = res ? res.status() : 0;
    await page.waitForTimeout(500);

    // lazy 로드 유도: 끝까지 스크롤 후 복귀
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(400);

    // 뷰포트를 문서 높이로 확장 → fixed 요소(하단 탭 등)가 실제 하단에 렌더됨
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = Math.min(Math.max(docH, 800), MAXH);
    await page.setViewportSize({ width: 1280, height: vh });
    await page.waitForTimeout(350);

    await page.screenshot({ path: join(OUT, file), type: "jpeg", quality: 42 });
    const map = await page.evaluate(collect);
    writeFileSync(join(OUT, num + ".json"), JSON.stringify(map));

    await page.setViewportSize({ width: 1280, height: 800 });
    manifest.push({ num, section, label, path, status, file });
    console.log(`OK ${num} ${label} (${status}) ${vh}px, 요소 ${map.els.length}개`);
  } catch (e) {
    manifest.push({ num, section, label, path, status: -1, file: null, error: String(e).slice(0, 120) });
    console.log(`FAIL ${num} ${label} ${path}: ${String(e).slice(0, 120)}`);
    await page.setViewportSize({ width: 1280, height: 800 }).catch(() => {});
  }
}

// 병합 저장 — 기존 manifest에서 PAGES 밖 화면(recap-one으로 추가된 34+)은 보존 (덮어쓰기로 인한 유실 방지)
let merged = manifest;
try {
  const prev = JSON.parse(readFileSync(join(OUT, "manifest.json"), "utf8"));
  const nums = new Set(manifest.map((m) => m.num));
  const kept = prev.filter((m) => !nums.has(m.num)); // 이번에 안 찍은 것 보존
  merged = [...manifest, ...kept].sort((a, b) => +a.num - +b.num);
} catch { /* 기존 manifest 없으면 그대로 */ }
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(merged, null, 2));
await browser.close();
console.log("DONE", manifest.filter((m) => m.file).length + "/" + PAGES.length, "| 병합 후 총", merged.length, "화면");
