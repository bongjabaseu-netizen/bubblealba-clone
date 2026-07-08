/** 이름 → SVG 배너/썸네일 자동 생성기 v4
 * 색(PALETTES 6) × 프레임(FRAMES 50) × 벡터(VECTORS 50) × 입자(PARTICLES 8) 를 자유 조합
 * 업소명·이름 해시로 업소마다 자동 배정(서로 다른 디자인), 관리자에서 개별 override 가능
 * 슬롯: top 600x150 · mid 400x150 · bot 300x150 · square 140x140 */

const FONT = "'Pretendard','Pretendard Variable','Malgun Gothic','Apple SD Gothic Neo',sans-serif";

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function textUnits(str) {
  let u = 0;
  for (const ch of str) { if (/\s/.test(ch)) u += 0.35; else if (ch.charCodeAt(0) < 256) u += 0.58; else u += 1.0; }
  return u;
}
function optimalPartition(words, L) {
  const W = words.length;
  if (L <= 1) return [words.join(" ")];
  if (L >= W) return words.slice();
  const u = words.map(textUnits);
  let bestCuts = null, bestCost = Infinity;
  const choose = (start, picked) => {
    if (picked.length === L - 1) {
      const cuts = [0, ...picked, W]; let mx = 0;
      for (let g = 0; g < L; g++) { let s = 0; for (let k = cuts[g]; k < cuts[g + 1]; k++) s += u[k] + (k > cuts[g] ? 0.35 : 0); mx = Math.max(mx, s); }
      if (mx < bestCost) { bestCost = mx; bestCuts = cuts; } return;
    }
    for (let i = start; i <= W - 1 - (L - 2 - picked.length); i++) choose(i + 1, [...picked, i]);
  };
  choose(1, []);
  const out = []; for (let g = 0; g < L; g++) out.push(words.slice(bestCuts[g], bestCuts[g + 1]).join(" ")); return out;
}
function balanceLines(name, L) {
  const n = name.trim();
  if (L <= 1) return [n];
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length >= L) return optimalPartition(words, L);
  const per = Math.ceil(n.length / L), out = []; for (let i = 0; i < n.length; i += per) out.push(n.slice(i, i + per)); return out;
}

/** 색 팔레트 6종 */
const PALETTES = [
  { key: "gold", label: "골드 럭셔리",
    bg: (id) => `<radialGradient id="bg${id}" cx="50%" cy="18%" r="110%"><stop offset="0%" stop-color="#3a2a0c"/><stop offset="45%" stop-color="#1a1206"/><stop offset="100%" stop-color="#000"/></radialGradient>`,
    textGrad: (id) => `<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff6d0"/><stop offset="38%" stop-color="#ffdf7a"/><stop offset="62%" stop-color="#f5b528"/><stop offset="100%" stop-color="#9c6a0c"/></linearGradient>`,
    accent: "#e8c552", glow: null, stroke: (fs) => ({ color: "#4a2f05", w: fs * 0.03 }) },
  { key: "neon", label: "네온 핑크",
    bg: (id) => `<radialGradient id="bg${id}" cx="50%" cy="55%" r="90%"><stop offset="0%" stop-color="#6a0f52"/><stop offset="55%" stop-color="#38063a"/><stop offset="100%" stop-color="#1a0320"/></radialGradient>`,
    textGrad: (id) => `<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#ffd3ec"/><stop offset="100%" stop-color="#ff7ac2"/></linearGradient>`,
    accent: "#ff7ac2", glow: (id) => `<filter id="gl${id}" x="-25%" y="-50%" width="150%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff2e93" flood-opacity="0.95"/></filter>`, stroke: null },
  { key: "galaxy", label: "갤럭시 퍼플",
    bg: (id) => `<radialGradient id="bg${id}" cx="34%" cy="30%" r="120%"><stop offset="0%" stop-color="#9333ea"/><stop offset="40%" stop-color="#4a1b8a"/><stop offset="100%" stop-color="#0f0629"/></radialGradient>`,
    textGrad: (id) => `<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#e7d6ff"/><stop offset="100%" stop-color="#b388ff"/></linearGradient>`,
    accent: "#b388ff", glow: (id) => `<filter id="gl${id}" x="-25%" y="-50%" width="150%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#a06bff" flood-opacity="0.85"/></filter>`, stroke: null },
  { key: "spot", label: "스포트라이트",
    bg: (id) => `<linearGradient id="bg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a3566"/><stop offset="60%" stop-color="#0b1d40"/><stop offset="100%" stop-color="#05101f"/></linearGradient>`,
    textGrad: (id) => `<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff8dc"/><stop offset="50%" stop-color="#ffe08a"/><stop offset="100%" stop-color="#d99a2b"/></linearGradient>`,
    accent: "#ffe08a", glow: null, stroke: (fs) => ({ color: "#20120a", w: fs * 0.028 }) },
  { key: "blossom", label: "블러썸 핑크",
    bg: (id) => `<linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffb0cd"/><stop offset="50%" stop-color="#ff7aa8"/><stop offset="100%" stop-color="#e84c86"/></linearGradient>`,
    textGrad: (id) => `<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="60%" stop-color="#fff0f6"/><stop offset="100%" stop-color="#ffd0e2"/></linearGradient>`,
    accent: "#ffd9e7", glow: (id) => `<filter id="gl${id}" x="-15%" y="-35%" width="130%" height="170%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.6" flood-color="#a8285e" flood-opacity="0.55"/></filter>`, stroke: null },
  { key: "blue", label: "블루 나이트",
    bg: (id) => `<linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#052a4a"/><stop offset="55%" stop-color="#0a68b0"/><stop offset="100%" stop-color="#12a3dd"/></linearGradient>`,
    textGrad: (id) => `<linearGradient id="tg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#e0f7ff"/><stop offset="100%" stop-color="#8fe0ff"/></linearGradient>`,
    accent: "#5cd0ff", glow: (id) => `<filter id="gl${id}" x="-25%" y="-50%" width="150%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="#37c9ff" flood-opacity="0.9"/></filter>`, stroke: null },
];

/** 다각별 path */
function starP(cx, cy, n, r, innerRatio) {
  let p = ""; const ir = r * innerRatio;
  for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? ir : r; const ang = -Math.PI / 2 + i * Math.PI / n; p += (i ? "L" : "M") + (cx + rr * Math.cos(ang)).toFixed(1) + " " + (cy + rr * Math.sin(ang)).toFixed(1) + " "; }
  return p + "Z";
}
function polyP(cx, cy, n, r, rot = 0) {
  let p = ""; for (let i = 0; i < n; i++) { const ang = rot + i * 2 * Math.PI / n; p += (i ? "L" : "M") + (cx + r * Math.cos(ang)).toFixed(1) + " " + (cy + r * Math.sin(ang)).toFixed(1) + " "; } return p + "Z";
}

/** ── 프레임 50종 (파라메트릭 패밀리 조합) ── fn(w,h,id,a) */
const FRAMES = [];
const pushF = (label, fn) => FRAMES.push({ label, fn });
pushF("없음", () => "");
[[3,1.4],[2,1.0],[4,1.8],[5,2.2]].forEach(([ins,sw],i)=>pushF(`단선${i+1}`,(w,h,id,a)=>`<rect x="${ins}" y="${ins}" width="${w-2*ins}" height="${h-2*ins}" fill="none" stroke="${a}" stroke-width="${sw}" opacity="0.55"/>`));
[0.05,0.08,0.11].forEach((g,i)=>pushF(`이중선${i+1}`,(w,h,id,a)=>`<rect x="2" y="2" width="${w-4}" height="${h-4}" fill="none" stroke="${a}" stroke-width="1.1" opacity="0.5"/><rect x="${w*g}" y="${(h*g+2).toFixed(1)}" width="${w*(1-2*g)}" height="${(h-2*(h*g+2)).toFixed(1)}" fill="none" stroke="${a}" stroke-width="0.7" opacity="0.4"/>`));
[0.07,0.1].forEach((g,i)=>pushF(`삼중선${i+1}`,(w,h,id,a)=>`<rect x="1.5" y="1.5" width="${w-3}" height="${h-3}" fill="none" stroke="${a}" stroke-width="0.7" opacity="0.4"/><rect x="${w*g}" y="${(h*g+1).toFixed(1)}" width="${w*(1-2*g)}" height="${(h-2*(h*g+1)).toFixed(1)}" fill="none" stroke="${a}" stroke-width="1.3" opacity="0.55"/><rect x="${w*(g+0.03)}" y="${(h*(g+0.03)+1).toFixed(1)}" width="${w*(1-2*(g+0.03))}" height="${(h-2*(h*(g+0.03)+1)).toFixed(1)}" fill="none" stroke="${a}" stroke-width="0.5" opacity="0.35"/>`));
[0.1,0.14,0.18,0.22,0.12].forEach((s,i)=>pushF(`코너 브래킷${i+1}`,(w,h,id,a)=>{const L=Math.min(w,h)*s,m=h*0.1,c=(x,y,sx,sy)=>`<path d="M${x} ${y+sy*L} L${x} ${y} L${x+sx*L} ${y}" fill="none" stroke="${a}" stroke-width="1.6" opacity="0.8"/>`;return c(w*0.04,m,1,1)+c(w*0.96,m,-1,1)+c(w*0.04,h-m,1,-1)+c(w*0.96,h-m,-1,-1);}));
[["6 4",1.4],["3 3",1.2],["8 5",1.6],["2 5",1.5]].forEach(([d,sw],i)=>pushF(`대시선${i+1}`,(w,h,id,a)=>`<rect x="3" y="3" width="${w-6}" height="${h-6}" fill="none" stroke="${a}" stroke-width="${sw}" opacity="0.6" stroke-dasharray="${d}"/>`));
[["1 5"],["1 8"],["2 6"]].forEach(([d],i)=>pushF(`점선${i+1}`,(w,h,id,a)=>`<rect x="3" y="3" width="${w-6}" height="${h-6}" fill="none" stroke="${a}" stroke-width="1.8" stroke-linecap="round" opacity="0.6" stroke-dasharray="${d}"/>`));
[16,22,28].forEach((sp,i)=>pushF(`비딩 상하${i+1}`,(w,h,id,a)=>{let d="";const n=Math.max(3,Math.round(w/sp));for(let k=0;k<=n;k++){const x=(w*0.06+(w*0.88)*k/n).toFixed(1);d+=`<circle cx="${x}" cy="${h*0.11}" r="1.3" fill="${a}" opacity="0.75"/><circle cx="${x}" cy="${h*0.89}" r="1.3" fill="${a}" opacity="0.75"/>`;}return d+`<rect x="3" y="3" width="${w-6}" height="${h-6}" fill="none" stroke="${a}" stroke-width="0.7" opacity="0.35"/>`;}));
[20,28].forEach((sp,i)=>pushF(`비딩 전체${i+1}`,(w,h,id,a)=>{let d="";const nx=Math.round(w/sp),ny=Math.max(2,Math.round(h/sp));const dot=(x,y)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.1" fill="${a}" opacity="0.7"/>`;for(let k=0;k<=nx;k++){d+=dot(w*0.05+w*0.9*k/nx,h*0.1)+dot(w*0.05+w*0.9*k/nx,h*0.9);}for(let k=1;k<ny;k++){d+=dot(w*0.05,h*0.1+h*0.8*k/ny)+dot(w*0.95,h*0.1+h*0.8*k/ny);}return d;}));
[3.2,4.2,2.6].forEach((ds,i)=>pushF(`코너 다이아${i+1}`,(w,h,id,a)=>{const cs=[[w*0.05,h*0.16],[w*0.95,h*0.16],[w*0.05,h*0.84],[w*0.95,h*0.84]].map(([x,y])=>`<path d="M${x} ${y-ds} l${ds*0.75} ${ds} -${ds*0.75} ${ds} -${ds*0.75} -${ds} z" fill="${a}" opacity="0.85"/>`).join("");return `<rect x="${w*0.03}" y="${h*0.1}" width="${w*0.94}" height="${h*0.8}" fill="none" stroke="${a}" stroke-width="1" opacity="0.5"/>${cs}`;}));
[0.1,0.14,0.08].forEach((bh,i)=>pushF(`리본 바${i+1}`,(w,h,id,a)=>`<rect x="0" y="${h*0.03}" width="${w}" height="${h*bh}" fill="${a}" opacity="0.18"/><rect x="0" y="${h*(0.97-bh)}" width="${w}" height="${h*bh}" fill="${a}" opacity="0.18"/><rect x="2.5" y="2.5" width="${w-5}" height="${h-5}" fill="none" stroke="${a}" stroke-width="0.8" opacity="0.4"/>`));
[0.08,0.12,0.06].forEach((s,i)=>pushF(`노치 코너${i+1}`,(w,h,id,a)=>{const n=Math.min(w,h)*s,m=h*0.09;return `<path d="M${w*0.04+n} ${m} L${w*0.96-n} ${m} L${w*0.96} ${m+n} L${w*0.96} ${h-m-n} L${w*0.96-n} ${h-m} L${w*0.04+n} ${h-m} L${w*0.04} ${h-m-n} L${w*0.04} ${m+n} Z" fill="none" stroke="${a}" stroke-width="1.4" opacity="0.6"/>`;}));
[0.14,0.2,0.28,0.1].forEach((rr,i)=>pushF(`라운드 네온${i+1}`,(w,h,id,a)=>`<defs><filter id="nf${id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="2.2" flood-color="${a}" flood-opacity="0.85"/></filter></defs><rect x="${w*0.03}" y="${h*0.12}" width="${w*0.94}" height="${h*0.76}" rx="${h*rr}" fill="none" stroke="${a}" stroke-width="1.6" opacity="0.85" filter="url(#nf${id})"/>`));
[0.1,0.14].forEach((g,i)=>pushF(`인셋 보더${i+1}`,(w,h,id,a)=>`<rect x="${w*g}" y="${h*(g*0.7+0.06)}" width="${w*(1-2*g)}" height="${(h-2*h*(g*0.7+0.06)).toFixed(1)}" fill="none" stroke="${a}" stroke-width="1.4" opacity="0.6"/>`));
[6,10].forEach((t,i)=>pushF(`센터 틱${i+1}`,(w,h,id,a)=>`<rect x="3" y="3" width="${w-6}" height="${h-6}" fill="none" stroke="${a}" stroke-width="1" opacity="0.45"/><line x1="${w/2-t}" y1="3" x2="${w/2+t}" y2="3" stroke="${a}" stroke-width="2.4" opacity="0.8"/><line x1="${w/2-t}" y1="${h-3}" x2="${w/2+t}" y2="${h-3}" stroke="${a}" stroke-width="2.4" opacity="0.8"/>`));
[3,4.5,2.4].forEach((dr,i)=>pushF(`이중+코너점${i+1}`,(w,h,id,a)=>{const cs=[[w*0.04,h*0.14],[w*0.96,h*0.14],[w*0.04,h*0.86],[w*0.96,h*0.86]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${dr}" fill="${a}" opacity="0.8"/>`).join("");return `<rect x="2" y="2" width="${w-4}" height="${h-4}" fill="none" stroke="${a}" stroke-width="1" opacity="0.5"/>${cs}`;}));
[0.14,0.2].forEach((rr,i)=>pushF(`이중 라운드${i+1}`,(w,h,id,a)=>`<rect x="${w*0.03}" y="${h*0.12}" width="${w*0.94}" height="${h*0.76}" rx="${h*rr}" fill="none" stroke="${a}" stroke-width="1.3" opacity="0.6"/><rect x="${w*0.06}" y="${h*0.2}" width="${w*0.88}" height="${h*0.6}" rx="${(h*rr*0.7).toFixed(1)}" fill="none" stroke="${a}" stroke-width="0.6" opacity="0.35"/>`));
pushF("해치 코너",(w,h,id,a)=>{const m=h*0.12,hatch=(x,y,sx,sy)=>{let d="";for(let k=0;k<3;k++)d+=`<line x1="${x+sx*(3+k*3)}" y1="${y}" x2="${x}" y2="${y+sy*(3+k*3)}" stroke="${a}" stroke-width="0.8" opacity="0.6"/>`;return d;};return hatch(w*0.05,m,1,1)+hatch(w*0.95,m,-1,1)+hatch(w*0.05,h-m,1,-1)+hatch(w*0.95,h-m,-1,-1)+`<rect x="3" y="3" width="${w-6}" height="${h-6}" fill="none" stroke="${a}" stroke-width="0.6" opacity="0.3"/>`;});
FRAMES.length = 50; // 정확히 50

/** ── 벡터(엠블럼) 50종 ── 상단 중앙 모티프. fn(w,h,id,a) */
const VECTORS = [];
const pushV = (label, fn) => VECTORS.push({ label, fn });
const EY = (h) => h * 0.13; // 엠블럼 기본 y
pushV("없음", () => "");
[16,20,13].forEach((s0,i)=>pushV(`크라운${i+1}`,(w,h,id,a)=>{const cx=w/2,s=Math.min(h*0.2,s0),y=EY(h);return `<g transform="translate(${cx},${y})"><path d="M${-s*0.7} ${s*0.34} L${-s*0.55} ${-s*0.16} L${-s*0.22} ${s*0.1} L0 ${-s*0.34} L${s*0.22} ${s*0.1} L${s*0.55} ${-s*0.16} L${s*0.7} ${s*0.34} Z" fill="url(#tg${id})" stroke="${a}" stroke-width="0.5"/><circle cy="${-s*0.34}" r="1.4" fill="#fff"/></g>`;}));
[11,9,13,7].forEach((r,i)=>pushV(`별5각${i+1}`,(w,h,id,a)=>`<path d="${starP(w/2,EY(h),5,Math.min(h*0.14,r),0.42)}" fill="url(#tg${id})" opacity="0.95"/>`));
[10,12].forEach((r,i)=>pushV(`별6각${i+1}`,(w,h,id,a)=>`<path d="${starP(w/2,EY(h),6,Math.min(h*0.13,r),0.5)}" fill="url(#tg${id})" opacity="0.95"/>`));
[12,9,14,7].forEach((s,i)=>pushV(`스파클${i+1}`,(w,h,id,a)=>{const cx=w/2,y=EY(h),z=Math.min(h*0.14,s);return `<path d="M${cx} ${y-z} L${cx+z*0.22} ${y-z*0.22} L${cx+z} ${y} L${cx+z*0.22} ${y+z*0.22} L${cx} ${y+z} L${cx-z*0.22} ${y+z*0.22} L${cx-z} ${y} L${cx-z*0.22} ${y-z*0.22} Z" fill="url(#tg${id})" opacity="0.95"/>`;}));
[10,8,12].forEach((s,i)=>pushV(`다이아${i+1}`,(w,h,id,a)=>{const cx=w/2,y=EY(h),z=Math.min(h*0.12,s);return `<path d="M${cx} ${y-z} L${cx+z*0.7} ${y} L${cx} ${y+z} L${cx-z*0.7} ${y} Z" fill="url(#tg${id})" stroke="${a}" stroke-width="0.5" opacity="0.95"/>`;}));
[10,8,12].forEach((r,i)=>pushV(`젬 육각${i+1}`,(w,h,id,a)=>`<path d="${polyP(w/2,EY(h),6,Math.min(h*0.12,r),Math.PI/6)}" fill="url(#tg${id})" stroke="${a}" stroke-width="0.5" opacity="0.9"/>`));
[10,8].forEach((r,i)=>pushV(`젬 팔각${i+1}`,(w,h,id,a)=>`<path d="${polyP(w/2,EY(h),8,Math.min(h*0.12,r),Math.PI/8)}" fill="url(#tg${id})" stroke="${a}" stroke-width="0.5" opacity="0.9"/>`));
[1,0.85,1.15].forEach((sc,i)=>pushV(`월계관${i+1}`,(w,h,id,a)=>{const cx=w/2,y=h*0.5,r=Math.min(h*0.34,w*0.12)*sc,leaf=(dir)=>{let d=`<path d="M${cx+dir*r*0.2} ${y+r*0.7} Q${cx+dir*r} ${y} ${cx+dir*r*0.3} ${y-r*0.7}" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.6"/>`;for(let k=-2;k<=2;k++){const t=0.5+k*0.18,px=cx+dir*r*(0.2+0.8*Math.abs(t-0.5)*1.4),py=y+r*(t-0.5)*1.4;d+=`<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="2.4" ry="1.1" fill="${a}" opacity="0.5" transform="rotate(${dir*40} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;}return d;};return leaf(-1)+leaf(1);}));
[7,5,9].forEach((g,i)=>pushV(`별 무리${i+1}`,(w,h,id,a)=>{const cx=w/2,y=EY(h);return `<path d="${starP(cx,y,5,Math.min(h*0.1,g),0.42)}" fill="url(#tg${id})" opacity="0.95"/><path d="${starP(cx-g*1.6,y+2,5,g*0.5,0.42)}" fill="#fff" opacity="0.85"/><path d="${starP(cx+g*1.6,y+2,5,g*0.5,0.42)}" fill="#fff" opacity="0.85"/>`;}));
[6,8].forEach((d,i)=>pushV(`점 삼형제${i+1}`,(w,h,id,a)=>{const cx=w/2,y=h*0.12;return `<circle cx="${cx-d}" cy="${y}" r="1.7" fill="${a}"/><circle cx="${cx}" cy="${y}" r="2.4" fill="url(#tg${id})"/><circle cx="${cx+d}" cy="${y}" r="1.7" fill="${a}"/>`;}));
[5,7].forEach((d,i)=>pushV(`점 오형제${i+1}`,(w,h,id,a)=>{const cx=w/2,y=h*0.12;let s="";for(let k=-2;k<=2;k++)s+=`<circle cx="${cx+k*d}" cy="${y}" r="${k===0?2.3:1.5}" fill="${k===0?`url(#tg${id})`:a}" opacity="0.9"/>`;return s;}));
[0.2,0.26,0.16].forEach((rw,i)=>pushV(`플로리시${i+1}`,(w,h,id,a)=>{const cx=w/2,y=h*0.11,r=w*rw;return `<path d="M${cx-r} ${y} Q${cx-r*0.4} ${y-4} ${cx-6} ${y}" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.7"/><path d="M${cx+r} ${y} Q${cx+r*0.4} ${y-4} ${cx+6} ${y}" fill="none" stroke="${a}" stroke-width="1.2" opacity="0.7"/><circle cx="${cx}" cy="${y}" r="2" fill="url(#tg${id})"/>`;}));
[1,0.8,1.2].forEach((sc,i)=>pushV(`꽃 클러스터${i+1}`,(w,h,id,a)=>{const cx=w/2,y=EY(h),pl=(ang)=>`<path d="M0 -5 C3 -3.4 3 1.6 0 5 C-3 1.6 -3 -3.4 0 -5 Z" fill="url(#tg${id})" opacity="0.9" transform="rotate(${ang})"/>`;return `<g transform="translate(${cx},${y}) scale(${sc})">${pl(0)+pl(72)+pl(144)+pl(216)+pl(288)}<circle r="1.6" fill="#fff"/></g>`;}));
[9,7,11].forEach((r,i)=>pushV(`선버스트${i+1}`,(w,h,id,a)=>{const cx=w/2,y=EY(h),R=Math.min(h*0.13,r);let s="";for(let k=0;k<12;k++){const ang=k*Math.PI/6;s+=`<line x1="${(cx+R*0.5*Math.cos(ang)).toFixed(1)}" y1="${(y+R*0.5*Math.sin(ang)).toFixed(1)}" x2="${(cx+R*Math.cos(ang)).toFixed(1)}" y2="${(y+R*Math.sin(ang)).toFixed(1)}" stroke="${a}" stroke-width="0.9" opacity="0.7"/>`;}return s+`<circle cx="${cx}" cy="${y}" r="${R*0.4}" fill="url(#tg${id})"/>`;}));
[8,10].forEach((s,i)=>pushV(`쉐브론${i+1}`,(w,h,id,a)=>{const cx=w/2,y=EY(h),z=Math.min(h*0.12,s);return `<path d="M${cx-z} ${y+z*0.5} L${cx} ${y-z*0.5} L${cx+z} ${y+z*0.5}" fill="none" stroke="url(#tg${id})" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;}));
[0.16,0.22].forEach((bw,i)=>pushV(`리본 배너${i+1}`,(w,h,id,a)=>{const cx=w/2,y=h*0.1,b=w*bw;return `<path d="M${cx-b} ${y-3} L${cx+b} ${y-3} L${cx+b} ${y+3} L${cx+b-4} ${y} L${cx+b} ${y+3} L${cx-b} ${y+3} L${cx-b+4} ${y} Z" fill="${a}" opacity="0.55"/>`;}));
[9,7].forEach((r,i)=>pushV(`링${i+1}`,(w,h,id,a)=>{const R=Math.min(h*0.12,r);return `<circle cx="${w/2}" cy="${EY(h)}" r="${R}" fill="none" stroke="url(#tg${id})" stroke-width="1.8" opacity="0.9"/><circle cx="${w/2}" cy="${EY(h)}" r="${R*0.4}" fill="${a}" opacity="0.7"/>`;}));
[10,8,12].forEach((d,i)=>pushV(`쌍별${i+1}`,(w,h,id,a)=>{const cx=w/2,y=EY(h);return `<path d="${starP(cx-d,y,5,Math.min(h*0.09,d*0.7),0.42)}" fill="url(#tg${id})" opacity="0.92"/><path d="${starP(cx+d,y,5,Math.min(h*0.09,d*0.7),0.42)}" fill="url(#tg${id})" opacity="0.92"/>`;}));
VECTORS.length = 50;

/** ── 입자 8종 ── fn(w,h,id,a) */
const PARTICLES = [];
const pushP = (label, fn) => PARTICLES.push({ label, fn });
pushP("없음", () => "");
pushP("별 흩뿌림", (w, h, id, a) => { let d = ""; for (const [x, y] of [[0.1,0.28],[0.9,0.32],[0.85,0.78],[0.14,0.76],[0.5,0.82],[0.72,0.2],[0.3,0.24]]) d += `<path d="${starP(x*w,y*h,5,1.6+((x*7)%1)*1.2,0.42)}" fill="#fff" opacity="0.8"/>`; return d; });
pushP("보케", (w, h, id, a) => `<circle cx="${w*0.1}" cy="${h*0.3}" r="${h*0.2}" fill="#fff" opacity="0.16"/><circle cx="${w*0.92}" cy="${h*0.7}" r="${h*0.24}" fill="#fff" opacity="0.13"/><circle cx="${w*0.8}" cy="${h*0.82}" r="${h*0.1}" fill="#fff" opacity="0.18"/>`);
pushP("조명 레이", (w, h, id, a) => { const cx = w / 2; return `<polygon points="${cx},0 ${w*0.26},${h} ${w*0.38},${h}" fill="#fff" opacity="0.08"/><polygon points="${cx},0 ${w*0.74},${h} ${w*0.62},${h}" fill="#fff" opacity="0.08"/><ellipse cx="${cx}" cy="${h*1.02}" rx="${w*0.3}" ry="${h*0.14}" fill="${a}" opacity="0.16"/>`; });
pushP("대각 스트릭", (w, h, id, a) => `<line x1="0" y1="${h*0.9}" x2="${w}" y2="${h*0.1}" stroke="#fff" stroke-width="1" opacity="0.16"/><line x1="0" y1="${h*1.05}" x2="${w}" y2="${h*0.3}" stroke="#fff" stroke-width="0.7" opacity="0.1"/>`);
pushP("꽃잎", (w, h, id, a) => { const petal = (x, y, sc, rot) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" opacity="0.8"><path d="M0 -6 C4 -4 4 2 0 6 C-4 2 -4 -4 0 -6 Z" fill="#fff"/></g>`; return petal(w*0.08, h*0.75, 0.9, 20) + petal(w*0.93, h*0.3, 0.8, -30) + petal(w*0.55, h*0.85, 0.6, 10); });
pushP("떠다니는 점", (w, h, id, a) => { let d = ""; for (const [x, y, r] of [[0.15,0.3,2],[0.85,0.4,2.4],[0.7,0.75,1.6],[0.3,0.7,1.8]]) d += `<circle cx="${x*w}" cy="${y*h}" r="${r}" fill="${a}" opacity="0.5"/>`; return d; });
pushP("그리드 글로우", (w, h, id, a) => `<ellipse cx="${w*0.5}" cy="${h*0.5}" rx="${w*0.42}" ry="${h*0.3}" fill="#fff" opacity="0.05"/>`);
PARTICLES.length = 8;

const mod = (n, m) => ((n % m) + m) % m;

/**
 * @param input 문자열 또는 {shop, name}
 * @param size {w,h}
 * @param design 미지정/문자열 → 이름해시로 자동배정 | 숫자 → 계열 고정 | {p,f,v,pt} → 개별 지정
 * @param fontScale 숫자 또는 {shop, name}
 */
export function generateBannerSVG(input, size, design, fontScale = 1) {
  const { w, h } = size;
  const keyStr = input && typeof input === "object" ? ((input.shop || "") + "·" + (input.name || "")) : (input || "");
  const hs = hash(keyStr || "seed");

  let pIdx, fIdx, vIdx, ptIdx;
  if (design && typeof design === "object") {
    pIdx = design.p ?? mod(hs, PALETTES.length);
    fIdx = design.f ?? mod(hs >>> 3, FRAMES.length);
    vIdx = design.v ?? mod(hs >>> 7, VECTORS.length);
    ptIdx = design.pt ?? mod(hs >>> 11, PARTICLES.length);
  } else if (typeof design === "number") {
    pIdx = mod(design, PALETTES.length); fIdx = mod(design, FRAMES.length); vIdx = mod(design, VECTORS.length); ptIdx = mod(design, PARTICLES.length);
  } else {
    // 이름 해시 자동배정 — 업소마다 서로 다른 조합
    pIdx = mod(hs, PALETTES.length); fIdx = mod(hs >>> 3, FRAMES.length); vIdx = mod(hs >>> 7, VECTORS.length); ptIdx = mod(hs >>> 11, PARTICLES.length);
  }
  const pal = PALETTES[mod(pIdx, PALETTES.length)];
  const frame = FRAMES[mod(fIdx, FRAMES.length)];
  const vec = VECTORS[mod(vIdx, VECTORS.length)];
  const part = PARTICLES[mod(ptIdx, PARTICLES.length)];
  const id = `${mod(hs, 9999)}p${mod(pIdx, PALETTES.length)}f${mod(fIdx, FRAMES.length)}v${mod(vIdx, VECTORS.length)}t${mod(ptIdx, PARTICLES.length)}`;

  // 입력 파싱
  let shop = "", main = "";
  if (input && typeof input === "object") { shop = (input.shop || "").trim(); main = (input.name || "").trim(); }
  else { main = (input || "").trim(); }
  if (!main && shop) { main = shop; shop = ""; }
  if (!main) main = "샘플";

  const aspect = w / h;
  const wide = aspect >= 2.4;
  const padXf = wide ? 0.30 : 0.16;
  const usableW = w - w * padXf, usableH = h - h * 0.30;
  const capF = wide ? 0.42 : 0.54;
  const lineFactor = 1.12;
  const scShop = fontScale && typeof fontScale === "object" ? (fontScale.shop ?? 1) : (fontScale || 1);
  const scName = fontScale && typeof fontScale === "object" ? (fontScale.name ?? 1) : (fontScale || 1);

  let renderLines;
  if (shop) {
    const ratio = 0.66;
    const mainU = Math.max(0.5, textUnits(main)), shopU = Math.max(0.5, textUnits(shop));
    let fsMain = Math.min(usableW / mainU, h * capF);
    fsMain = Math.min(fsMain, usableH / (lineFactor * (1 + ratio)));
    let fsShop = Math.min(fsMain * ratio, usableW / shopU);
    fsMain = Math.min(fsMain * scName, (w - w * 0.06) / mainU, h * 0.62);
    fsShop = Math.min(fsShop * scShop, (w - w * 0.06) / shopU, h * 0.52);
    const need = (fsShop + fsMain) * lineFactor, hCap = h * 0.94;
    if (need > hCap) { const k = hCap / need; fsMain *= k; fsShop *= k; }
    renderLines = [{ text: shop, size: Math.max(8, fsShop) }, { text: main, size: Math.max(9, fsMain) }];
  } else {
    const wordCount = main.split(/\s+/).filter(Boolean).length;
    const hardMax = aspect >= 2.4 ? 2 : aspect <= 1.5 ? 3 : 2;
    const maxLines = wordCount > 1 ? Math.min(hardMax, wordCount) : hardMax;
    let best = null;
    for (let L = 1; L <= maxLines; L++) {
      const ls = balanceLines(main, L).filter((l) => l.length);
      if (!ls.length) continue;
      const longest = Math.max(...ls.map((l) => Math.max(0.5, textUnits(l))));
      const fs = Math.min(usableW / longest, usableH / (ls.length * lineFactor));
      if (!best || fs > best.fs + 0.5) best = { fs, lines: ls, longest };
    }
    let baseFs = Math.min(best.fs, h * capF);
    const wLimit = (w - w * 0.06) / best.longest, hLimit = (h - h * 0.10) / (best.lines.length * lineFactor);
    const fontSize = Math.max(9, Math.min(baseFs * scName, wLimit, hLimit, h * 0.72));
    renderLines = best.lines.map((l) => ({ text: l, size: fontSize }));
  }

  const glowDef = pal.glow ? pal.glow(id) : "";
  const glowRef = pal.glow ? ` filter="url(#gl${id})"` : "";

  const blockH = renderLines.reduce((acc, l) => acc + l.size * lineFactor, 0);
  const emblemPad = vec.label !== "없음" ? h * 0.08 : 0;
  let cursor = Math.max(2, Math.min(h / 2 - blockH / 2 + emblemPad, h - blockH - 3));
  const texts = renderLines.map((l) => {
    const baseline = cursor + l.size * 0.80; cursor += l.size * lineFactor;
    const st = pal.stroke ? pal.stroke(l.size) : null;
    const strokeAttr = st ? ` stroke="${st.color}" stroke-width="${st.w.toFixed(2)}" paint-order="stroke"` : "";
    return `<text x="${w / 2}" y="${baseline.toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${l.size.toFixed(1)}" fill="url(#tg${id})"${strokeAttr}>${escapeXml(l.text)}</text>`;
  }).join("");

  const rx = aspect <= 1.5 ? Math.round(h * 0.11) : 0;
  const rxAttr = rx ? ` rx="${rx}"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>${pal.bg(id)}${pal.textGrad(id)}${glowDef}</defs>
<rect width="${w}" height="${h}"${rxAttr} fill="url(#bg${id})"/>
${part.fn(w, h, id, pal.accent)}
${frame.fn(w, h, id, pal.accent)}
${vec.fn(w, h, id, pal.accent)}
<g${glowRef}>${texts}</g>
</svg>`;
}

function escapeXml(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
export function svgToDataUri(svg) { return "data:image/svg+xml;utf8," + encodeURIComponent(svg); }

export const SLOT_SIZES = {
  top: { w: 600, h: 150, label: "최상단 (한 줄 2개)" },
  mid: { w: 400, h: 150, label: "둘째줄 (한 줄 3개)" },
  bot: { w: 300, h: 150, label: "셋째줄 (한 줄 4개)" },
  square: { w: 140, h: 140, label: "공고 썸네일 (정사각)" },
};
export const PALETTE_COUNT = PALETTES.length;
export const FRAME_COUNT = FRAMES.length;
export const VECTOR_COUNT = VECTORS.length;
export const PARTICLE_COUNT = PARTICLES.length;
export const PALETTE_LABELS = PALETTES.map((x) => x.label);
export const FRAME_LABELS = FRAMES.map((x) => x.label);
export const VECTOR_LABELS = VECTORS.map((x) => x.label);
export const PARTICLE_LABELS = PARTICLES.map((x) => x.label);
/** 총 조합 수 */
export const COMBO_COUNT = PALETTES.length * FRAMES.length * VECTORS.length * PARTICLES.length;
