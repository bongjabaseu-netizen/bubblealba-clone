/** 단일 화면 재캡처 — 스크린샷+요소지도 갱신
 * from: design-pick 스킬 (디자인 변경 후 바뀐 페이지만 재캡처 → 아티팩트 보드 동기화)
 * 사용: RC_PATH='/job' node recap-one.mjs   (화면번호는 manifest에서 자동 해석)
 *       RC_NUM='04' RC_PATH='/job' node recap-one.mjs  (번호 직접 지정도 가능)
 */
import { chromium } from "file:///D:/debug/captures/bubblealba/.work/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const path = process.env.RC_PATH;
const BASE = "http://localhost:3004";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "shots");
const MAXH = 8000;

if (!path) { console.error("RC_PATH 가 필요합니다 (예: RC_PATH='/job')"); process.exit(1); }

// 화면번호(num) 해석: RC_NUM 우선, 없으면 manifest.json 에서 path 로 자동 조회
let num = process.env.RC_NUM;
if (!num) {
  const manifest = JSON.parse(readFileSync(join(OUT, "manifest.json"), "utf8"));
  const hit = manifest.find((m) => m.path === path);
  if (!hit) { console.error(`manifest 에 없는 경로: ${path} — RC_NUM 을 직접 지정하세요`); process.exit(1); }
  num = hit.num;
}

const collect = () => {
  const out = [], seen = new Set(), MAX = 450;
  const label = (el) => {
    const tag = el.tagName.toLowerCase();
    let sel = tag;
    if (el.id) sel += "#" + el.id;
    else { const cls = [...el.classList].filter((c) => !/^(hover|focus|group|peer)/.test(c)).slice(0, 2); if (cls.length) sel += "." + cls.join("."); }
    let txt = tag === "img" ? (el.alt || "") : (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 24);
    return sel + (txt ? ' "' + txt + '"' : "");
  };
  for (const el of document.querySelectorAll("*")) {
    if (out.length >= MAX) break;
    if (["SCRIPT","STYLE","NOSCRIPT","META","LINK","HTML","BODY"].includes(el.tagName)) continue;
    const r = el.getBoundingClientRect();
    const x = r.left + scrollX, y = r.top + scrollY;
    if (r.width < 24 || r.height < 16) continue;
    if (r.width * r.height > innerWidth * innerHeight * 0.9) continue;
    const st = getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || +st.opacity === 0) continue;
    const key = [Math.round(x),Math.round(y),Math.round(r.width),Math.round(r.height)].join(",");
    if (seen.has(key)) continue; seen.add(key);
    out.push([Math.round(x),Math.round(y),Math.round(r.width),Math.round(r.height),label(el)]);
  }
  return { w: Math.max(document.documentElement.scrollWidth, innerWidth), h: innerHeight, els: out };
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await page.goto(BASE + "/admin/login", { waitUntil: "domcontentloaded" });
await page.fill('input[name="email"]', "adm");
await page.fill('input[name="password"]', "admin1234");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin", { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1200);

await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 20000 }).catch(() => page.goto(BASE + path, { waitUntil: "domcontentloaded" }));
await page.waitForTimeout(500);
await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700){ scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); } scrollTo(0,0); });
await page.waitForTimeout(400);
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
const vh = Math.min(Math.max(docH, 800), MAXH);
await page.setViewportSize({ width: 1280, height: vh });
await page.waitForTimeout(350);
await page.screenshot({ path: join(OUT, num + ".jpg"), type: "jpeg", quality: 42 });
const map = await page.evaluate(collect);
writeFileSync(join(OUT, num + ".json"), JSON.stringify(map));
await browser.close();
console.log(`RECAP ${num} ${path} — ${vh}px, 요소 ${map.els.length}개`);
