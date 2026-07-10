/** 홈 샘플 배너 생성기 v2 — 고퀄리티 "광고주 모집" 스타일 (레퍼런스: 메탈릭 3D글씨+보케+글로우+모티프+원형뱃지)
 * from: 사용자 지시(2026-07-09) "고퀄리티 배너 원함, 지금은 너무 단순". 레퍼런스=꽃길알바 상단배너 → 브랜드는 이 사이트=명품알바로.
 * 출력: public/banners/sample/{top-1..2, mid-1..3, bot-01..56}.svg  +  seed.sql
 * 슬롯 비율: top 1200×300(4:1) · mid 800×300(8:3) · bot 600×300(2:1) — 큰 좌표계로 그려 셀(h-75px)에서 축소, 벡터라 선명.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const OUT = join(DIR, "../../public/banners/sample");
mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FONT = "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif";
const rng = (seed) => { let s = (seed * 2654435761) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
const units = (t) => { let u = 0; for (const c of t) u += /\s/.test(c) ? 0.4 : /[\x00-\x7f]/.test(c) ? 0.56 : 1; return u; };
const fitFont = (base, t, availW) => Math.min(base, availW / Math.max(units(t), 0.5));

// ── 8 프리미엄 테마 ── (bg=배경 그라데 스톱, txt=메탈릭 글씨 스톱, acc=액센트, glow=글씨 글로우색, light=밝은 테마 여부, motif)
const THEMES = [
  { key: "pink", bgType: "radial", bg: ["#ffe1ef", "#f4a9cf", "#d968a3"], txt: ["#ffffff", "#ffd6e8", "#ff7bb2", "#ffe6f1"], acc: "#ff4f9e", glow: "#ff8fc4", ink: "#a03063", motif: "sparkle", light: true },
  { key: "blackgold", bgType: "radial", bg: ["#232019", "#12100b", "#08070500"], base: "#0b0a07", txt: ["#fff6d5", "#ffe08a", "#b8860b", "#ffedb0"], acc: "#e8c26a", glow: "#f0c34d", ink: "#e8c26a", motif: "crown" },
  { key: "purple", bgType: "radial", bg: ["#4a2596", "#241056", "#120830"], txt: ["#ffffff", "#ecdcff", "#c9a4ff", "#ffffff"], acc: "#c08bff", glow: "#a765ff", ink: "#e9d6ff", motif: "bubble" },
  { key: "goldgift", bgType: "radial", bg: ["#4a3512", "#2c2008", "#171003"], txt: ["#fff8dc", "#ffdf87", "#c8912a", "#ffeeb0"], acc: "#ffce5c", glow: "#ffcf5c", ink: "#ffdf87", motif: "gift" },
  { key: "cream", bgType: "linear", bg: ["#f7f0e4", "#eaddc7", "#dcc9a8"], txt: ["#8a6a2f", "#b8933f", "#6f5222", "#d8b25a"], acc: "#b8933f", glow: "#e3c98f", ink: "#6f5426", motif: "crownline", light: true },
  { key: "rose", bgType: "radial", bg: ["#3a1020", "#1e0812", "#0d0407"], txt: ["#ffe9f1", "#ffb0d0", "#c76b93", "#ffd9e8"], acc: "#ff6fa3", glow: "#ff86b6", ink: "#ffb0d0", motif: "petal" },
  { key: "stage", bgType: "radial", bg: ["#2a1466", "#150a3a", "#0a0522"], txt: ["#ff6ee6", "#ff8fea", "#7fe6ff", "#c7a0ff"], acc: "#ff5ce0", glow: "#ff5ce0", ink: "#ffd6f7", motif: "rays", neon: true },
  { key: "chrome", bgType: "radial", bg: ["#0e2a66", "#081b45", "#040f28"], txt: ["#f2fbff", "#a9e2ff", "#2f7fd8", "#d6f0ff"], acc: "#4db2ff", glow: "#4db2ff", ink: "#cbe9ff", motif: "chrome", neon: true },
];

const HEADLINES = ["광고주 모집", "상단노출 배너", "상단 배너 광고", "프리미엄 광고", "VIP 상단광고", "광고 입점문의", "최상단 노출", "골드 배너 광고"];
const SUBS = ["상단 고정 · 상단 배너 · 프리미엄 광고", "프리미엄 광고 · 상단 노출 · 입점", "지금 광고 입점 문의", "상단 고정 · 프리미엄 · 상단노출", "빠른 노출 · 최고 대우 · 입점환영"];
const BADGES = [["광고입점", "문의"], ["입점", "환영"], ["광고", "문의"], ["AD", "문의"]];
const BRAND = "명품알바";

// ── 모티프 ──
function sparkle(cx, cy, s, fill, op = 1) {
  return `<path d="M${cx} ${cy - s} C ${cx + s * 0.16} ${cy - s * 0.16}, ${cx + s * 0.16} ${cy - s * 0.16}, ${cx + s} ${cy} C ${cx + s * 0.16} ${cy + s * 0.16}, ${cx + s * 0.16} ${cy + s * 0.16}, ${cx} ${cy + s} C ${cx - s * 0.16} ${cy + s * 0.16}, ${cx - s * 0.16} ${cy + s * 0.16}, ${cx - s} ${cy} C ${cx - s * 0.16} ${cy - s * 0.16}, ${cx - s * 0.16} ${cy - s * 0.16}, ${cx} ${cy - s} Z" fill="${fill}" opacity="${op}"/>`;
}
function crown(cx, cy, s, fill) {
  const w = s, h = s * 0.72;
  return `<path d="M${cx - w} ${cy + h} L${cx - w} ${cy - h * 0.3} L${cx - w * 0.5} ${cy + h * 0.25} L${cx} ${cy - h} L${cx + w * 0.5} ${cy + h * 0.25} L${cx + w} ${cy - h * 0.3} L${cx + w} ${cy + h} Z" fill="${fill}"/><circle cx="${cx}" cy="${cy - h}" r="${s * 0.11}" fill="${fill}"/><circle cx="${cx - w}" cy="${cy - h * 0.3}" r="${s * 0.1}" fill="${fill}"/><circle cx="${cx + w}" cy="${cy - h * 0.3}" r="${s * 0.1}" fill="${fill}"/>`;
}
function gift(x, y, s, box, ribbon) {
  return `<rect x="${x - s}" y="${y - s * 0.55}" width="${s * 2}" height="${s * 1.5}" rx="${s * 0.1}" fill="${box}"/><rect x="${x - s}" y="${y - s * 0.55}" width="${s * 2}" height="${s * 0.4}" fill="${ribbon}" opacity="0.9"/><rect x="${x - s * 0.16}" y="${y - s * 0.55}" width="${s * 0.32}" height="${s * 1.5}" fill="${ribbon}"/><path d="M${x} ${y - s * 0.55} C ${x - s * 0.9} ${y - s * 1.3}, ${x - s * 0.5} ${y - s * 0.2}, ${x} ${y - s * 0.55} C ${x + s * 0.5} ${y - s * 0.2}, ${x + s * 0.9} ${y - s * 1.3}, ${x} ${y - s * 0.55} Z" fill="${ribbon}"/>`;
}
function petal(cx, cy, s, fill, op = 0.9) {
  let p = "";
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; p += `<ellipse cx="${cx + Math.cos(a) * s * 0.5}" cy="${cy + Math.sin(a) * s * 0.5}" rx="${s * 0.5}" ry="${s * 0.24}" transform="rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * s * 0.5} ${cy + Math.sin(a) * s * 0.5})" fill="${fill}" opacity="${op}"/>`; }
  return p + `<circle cx="${cx}" cy="${cy}" r="${s * 0.28}" fill="${fill}"/>`;
}
function rays(vw, cx, topY, fill, u) {
  let r = "";
  for (let i = -4; i <= 4; i++) { const x2 = cx + i * vw * 0.14; r += `<path d="M${cx} ${topY} L${x2 - 26} ${topY + 320} L${x2 + 26} ${topY + 320} Z" fill="${fill}" opacity="0.07"/>`; }
  return `<g filter="url(#soft${u})">${r}</g>`;
}
function bokeh(vw, vh, rand, colors, u) {
  let c = "";
  const n = 14;
  for (let i = 0; i < n; i++) { const r = 8 + rand() * 46; c += `<circle cx="${rand() * vw}" cy="${rand() * vh}" r="${r}" fill="${colors[i % colors.length]}" opacity="${0.05 + rand() * 0.16}"/>`; }
  return `<g filter="url(#blur${u})">${c}</g>`;
}

/** 배너 1장 */
function makeSvg(vw, vh, idx, kind) {
  const th = THEMES[(idx * 3) % THEMES.length];
  const headline = HEADLINES[(idx * 5) % HEADLINES.length];
  const sub = SUBS[idx % SUBS.length];
  const badge = BADGES[idx % BADGES.length];
  const u = `${kind}${idx}`;
  const rand = rng(idx * 97 + vw);
  const dark = !th.light;
  const wide = kind !== "bot";

  // 레이아웃 — 전부 정중앙 (뱃지 없음)
  const cx = vw / 2;
  const m = vh * 0.09;                    // 배너를 꽉 채우는 프레임 여백
  const innerW = vw - 2 * m - vw * 0.06;  // 헤드라인 가용 폭

  // 배경
  const bgId = `bg${u}`;
  let bgDef, bgRect;
  if (th.bgType === "radial") {
    const stops = th.bg.map((c, i) => `<stop offset="${(i / (th.bg.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join("");
    bgDef = `<radialGradient id="${bgId}" cx="0.5" cy="0.42" r="0.9">${stops}</radialGradient>`;
    bgRect = `${th.base ? `<rect width="${vw}" height="${vh}" fill="${th.base}"/>` : ""}<rect width="${vw}" height="${vh}" fill="url(#${bgId})"/>`;
  } else {
    const stops = th.bg.map((c, i) => `<stop offset="${(i / (th.bg.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join("");
    bgDef = `<linearGradient id="${bgId}" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient>`;
    bgRect = `<rect width="${vw}" height="${vh}" fill="url(#${bgId})"/>`;
  }

  // 메탈릭 글씨 그라데(세로 4스톱)
  const txId = `tx${u}`;
  const txStops = th.txt.map((c, i) => `<stop offset="${(i / (th.txt.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join("");
  const txDef = `<linearGradient id="${txId}" x1="0" y1="0" x2="0" y2="1">${txStops}</linearGradient>`;

  // 필터: 소프트 글로우 / 배경블러 / 글씨 그림자
  const filters =
    `<filter id="glow${u}" x="-40%" y="-60%" width="180%" height="220%"><feGaussianBlur stdDeviation="${th.neon ? 9 : 5}"/></filter>` +
    `<filter id="blur${u}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>` +
    `<filter id="soft${u}"><feGaussianBlur stdDeviation="10"/></filter>` +
    `<filter id="ds${u}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${vh * 0.012}" stdDeviation="${vh * 0.012}" flood-color="#000" flood-opacity="${dark ? 0.6 : 0.32}"/></filter>`;

  // 상단 글로시 + 비네트 + 중앙 글로우
  const gloss = `<rect width="${vw}" height="${vh * 0.38}" fill="#ffffff" opacity="${th.light ? 0.14 : 0.05}"/>`;
  const vignDef = `<radialGradient id="vg${u}" cx="0.5" cy="0.5" r="0.78"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${dark ? 0.45 : 0.12}"/></radialGradient>`;
  const vign = `<rect width="${vw}" height="${vh}" fill="url(#vg${u})"/>`;
  const glowDef = `<radialGradient id="cg${u}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${th.glow}" stop-opacity="${dark ? 0.5 : 0.3}"/><stop offset="1" stop-color="${th.glow}" stop-opacity="0"/></radialGradient>`;

  // 풀프레임 배경 장식(보케 + 네온레이 + 중앙 글로우)
  const bkColors = dark ? [th.acc, th.glow, "#ffffff"] : ["#ffffff", th.acc, th.glow];
  let deco = bokeh(vw, vh, rand, bkColors, u);
  if (th.neon) deco += rays(vw, cx, -40, th.glow, u);
  deco += `<ellipse cx="${cx}" cy="${vh * 0.5}" rx="${vw * 0.42}" ry="${vh * 0.44}" fill="url(#cg${u})"/>`;

  // 배너를 꽉 채우는 장식 프레임(이중선) + 코너 반짝이 = "벡터 하나"
  const fw = th.light ? 2.4 : 2;
  const im = m + vh * 0.05;
  const frame =
    `<rect x="${m}" y="${m}" width="${vw - 2 * m}" height="${vh - 2 * m}" rx="${vh * 0.03}" fill="none" stroke="${th.acc}" stroke-width="${fw}" opacity="${th.light ? 0.8 : 0.55}"/>` +
    `<rect x="${im}" y="${im}" width="${vw - 2 * im}" height="${vh - 2 * im}" rx="${vh * 0.02}" fill="none" stroke="${th.acc}" stroke-width="1" opacity="0.32"/>`;
  let corners = "";
  for (const X of [im, vw - im]) for (const Y of [im, vh - im]) corners += sparkle(X, Y, vh * 0.05, th.acc, 0.9);

  // 정중앙 텍스트 스택 (아이브로우 / 큰 헤드라인 / 서브)
  const eyeF = vh * 0.1;
  const eyebrow = `<text x="${cx}" y="${vh * 0.235}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-weight="700" font-size="${eyeF}" fill="${th.acc}" letter-spacing="${eyeF * 0.18}">✦ ${esc(BRAND)} ✦</text>`;
  const hlF = fitFont(vh * 0.42, headline, innerW);
  const hlY = vh * 0.52;
  const strokeC = th.light ? "#ffffff" : "rgba(0,0,0,0.5)";
  const headEls =
    `<text x="${cx}" y="${hlY}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-weight="900" font-size="${hlF}" fill="${th.glow}" filter="url(#glow${u})" opacity="${th.neon ? 0.95 : 0.7}" letter-spacing="-1">${esc(headline)}</text>` +
    `<text x="${cx}" y="${hlY}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-weight="900" font-size="${hlF}" fill="url(#${txId})" stroke="${strokeC}" stroke-width="${hlF * 0.016}" filter="url(#ds${u})" letter-spacing="-1">${esc(headline)}</text>`;
  const subF = vh * 0.084;
  const subEl = `<text x="${cx}" y="${vh * 0.79}" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-weight="600" font-size="${subF}" fill="${th.ink}" opacity="0.92" letter-spacing="0.4">${esc(sub)}</text>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}" viewBox="0 0 ${vw} ${vh}">` +
    `<defs>${bgDef}${txDef}${glowDef}${vignDef}${filters}</defs>` +
    bgRect + deco + gloss + vign + frame + corners + eyebrow + headEls + subEl +
    `</svg>`;
  return { title: headline, svg };
}

// ── 슬롯 ──
const botIds = ["bbot1", "bbot2", "bbot3", "bbot4"];
for (let n = 5; n <= 56; n++) botIds.push("seed_bbot" + n);
const SLOTS = [
  { type: "IMAGE_TOP", vw: 1200, vh: 300, prefix: "top", ids: ["btop1", "btop2"] },
  { type: "IMAGE_MID", vw: 800, vh: 300, prefix: "mid", ids: ["bmid1", "bmid2", "bmid3"] },
  { type: "IMAGE_BOT", vw: 600, vh: 300, prefix: "bot", ids: botIds },
];

const USER_ID = "cmo01kz4x0000bwu8npkicyvm";
const sql = ["-- 홈 샘플 배너 v2 시드 (tools/banner-samples/gen.mjs) — 고퀄 광고주모집 배너", "BEGIN;"];
let gi = 0, count = 0;
for (const slot of SLOTS) {
  slot.ids.forEach((id, i) => {
    const file = `${slot.prefix}-${slot.type === "IMAGE_BOT" ? String(i + 1).padStart(2, "0") : i + 1}.svg`;
    const kind = slot.prefix;
    const { title, svg } = makeSvg(slot.vw, slot.vh, gi++, kind);
    writeFileSync(join(OUT, file), svg);
    count++;
    const url = `/banners/sample/${file}`;
    const order = i + 1;
    const isNew = id.startsWith("seed_bbot") && +id.replace("seed_bbot", "") >= 17;
    if (isNew) {
      sql.push(`INSERT INTO "BannerAd" (id,type,title,"imageUrl","linkUrl","order","isActive","userId","createdAt","updatedAt") VALUES ('${id}','${slot.type}','${title}','${url}',NULL,${order},true,'${USER_ID}',now(),now()) ON CONFLICT (id) DO UPDATE SET "imageUrl"=EXCLUDED."imageUrl", title=EXCLUDED.title, "order"=EXCLUDED."order", type=EXCLUDED.type, "isActive"=true, "updatedAt"=now();`);
    } else {
      sql.push(`UPDATE "BannerAd" SET "imageUrl"='${url}', title='${title}', "isActive"=true, "updatedAt"=now() WHERE id='${id}';`);
    }
  });
}
sql.push("COMMIT;");
writeFileSync(join(DIR, "seed.sql"), sql.join("\n") + "\n");
console.log(`v2 생성 완료: SVG ${count}장 (top2/mid3/bot56)`);
