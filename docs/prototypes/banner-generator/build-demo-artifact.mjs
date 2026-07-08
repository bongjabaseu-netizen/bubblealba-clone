/** 배너+썸네일 자동생성 인터랙티브 데모 — 한 가게 = 배너 + 정사각 썸네일(같은 테마) */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
let gen = readFileSync(join(DIR, "banner-gen.mjs"), "utf8");
gen = gen.replace(/^export\s+/gm, "");

// Pretendard ExtraBold woff2 → base64 @font-face (아티팩트는 외부 폰트 차단이라 내장 필수)
const FONT_PATH = "D:/debug/clone-app/node_modules/pretendard/dist/web/static/woff2/Pretendard-ExtraBold.woff2";
const fontB64 = readFileSync(FONT_PATH).toString("base64");
const fontFace = `@font-face{font-family:'Pretendard';font-weight:800;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,${fontB64}) format('woff2');}`;

const html = `<title>이름으로 배너+썸네일 자동 생성 — 데모</title>
<style>
  ${fontFace}
  :root{
    --bg:#f4f6fa; --panel:#ffffff; --ink:#141d33; --sub:#5a6b8c; --line:#dde3ee;
    --brand:#e0620a; --field:#eef1f7; --chip:#eef1f7;
  }
  @media (prefers-color-scheme: dark){:root{
    --bg:#0d1526; --panel:#16233f; --ink:#eef2fa; --sub:#7d8db1; --line:#20304f;
    --brand:#ff7a1a; --field:#0f1a30; --chip:#0f1a30;
  }}
  :root[data-theme="dark"]{--bg:#0d1526;--panel:#16233f;--ink:#eef2fa;--sub:#7d8db1;--line:#20304f;--brand:#ff7a1a;--field:#0f1a30;--chip:#0f1a30;}
  :root[data-theme="light"]{--bg:#f4f6fa;--panel:#ffffff;--ink:#141d33;--sub:#5a6b8c;--line:#dde3ee;--brand:#e0620a;--field:#eef1f7;--chip:#eef1f7;}
  *{box-sizing:border-box}
  body{background:var(--bg);color:var(--ink);font-family:'Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;margin:0;padding:26px 22px 70px;line-height:1.5}
  .wrap{max-width:960px;margin:0 auto}
  h1{font-size:21px;margin:0 0 4px;letter-spacing:-.02em}
  .lead{color:var(--sub);font-size:13.5px;margin:0 0 20px;max-width:72ch}
  .lead b{color:var(--brand)}
  .bar{display:flex;gap:10px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px 14px;position:sticky;top:10px;z-index:5;box-shadow:0 4px 16px rgba(0,0,0,.08)}
  .bar label{font-size:12.5px;font-weight:700;color:var(--sub);white-space:nowrap}
  .bar input{flex:1;background:var(--field);border:1px solid var(--line);border-radius:9px;color:var(--ink);font-size:15px;font-weight:600;padding:10px 13px;font-family:inherit}
  .bar input:focus{outline:none;border-color:var(--brand)}
  .bar button{background:var(--brand);color:#fff;border:none;border-radius:9px;font-weight:800;font-size:13px;padding:10px 15px;cursor:pointer;white-space:nowrap;font-family:inherit}
  .bar button:hover{filter:brightness(1.08)}
  .bar button.alt{background:var(--field);color:var(--brand);border:1px solid var(--brand)}
  .bar button.ghost2{background:var(--field);color:var(--ink);border:1px solid var(--line)}
  .bar button .mini{opacity:.7;font-weight:700;font-size:11px}
  .combohint{max-width:960px;margin:6px auto 0;font-size:11.5px;color:var(--sub);text-align:center}
  .combohint b{color:var(--brand)}
  .fsgroup{margin-top:8px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px 14px}
  .fstitle{font-size:12px;font-weight:800;color:var(--brand);margin-bottom:6px}
  .fsrow{display:flex;align-items:center;gap:10px;padding:2px 0}
  .fsrow .fslab{font-size:12px;font-weight:700;color:var(--sub);min-width:90px}
  .fsrow input[type=range]{flex:1;accent-color:var(--brand)}
  .fsrow .fsv{font-size:12px;font-weight:800;color:var(--brand);min-width:42px;text-align:right}
  .set{margin-top:22px;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px 20px}
  .set .cap{font-size:12px;font-weight:800;color:var(--brand);letter-spacing:.02em;margin-bottom:14px}
  .set .cap b{color:var(--sub);font-weight:600}
  .grp{margin-bottom:16px}
  .grp .gl{font-size:11.5px;color:var(--sub);font-weight:700;margin-bottom:6px}
  .row{display:grid;gap:0;border:1px solid var(--line);border-radius:4px;overflow:hidden;width:max-content;max-width:100%}
  .row.c2{grid-template-columns:repeat(2,300px)}
  .row.c3{grid-template-columns:repeat(3,200px)}
  .row.c4{grid-template-columns:repeat(4,150px)}
  .cell{height:75px;overflow:hidden}
  .cell svg{width:100%;height:100%;display:block}
  /* 공고 리스트 미리보기 (정사각 썸네일 통일감 확인) */
  .joblist{border:1px solid var(--line);border-radius:10px;overflow:hidden;max-width:440px}
  .job{display:flex;gap:12px;align-items:center;padding:9px 12px;border-bottom:1px solid var(--line)}
  .job:last-child{border-bottom:none}
  .thumb{width:70px;height:70px;border-radius:14px;overflow:hidden;flex:0 0 auto}
  .thumb svg{width:100%;height:100%;display:block}
  .job .meta{min-width:0}
  .job .co{font-size:11px;color:var(--brand);font-weight:700}
  .job .ti{font-size:13.5px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .job .wg{font-size:11.5px;color:var(--sub)}
  .examples{margin-top:30px}
  .examples h3{font-size:13px;margin:0 0 10px;color:var(--sub)}
  .exgrid{display:flex;flex-wrap:wrap;gap:14px}
  .ex{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px;display:flex;gap:10px;align-items:center}
  .ex .exsq{width:64px;height:64px;border-radius:12px;overflow:hidden;flex:0 0 auto}
  .ex .exsq svg{width:100%;height:100%;display:block}
  .ex .exban{width:200px;height:50px;overflow:hidden;border-radius:3px}
  .ex .exban svg{width:100%;height:100%;display:block}
  .how{margin-top:30px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 20px}
  .how h3{font-size:14px;margin:0 0 10px}
  .how ol{margin:0;padding-left:20px;font-size:13px}
  .how li{margin:5px 0}
  .how .note{margin-top:12px;font-size:12px;color:var(--sub);border-top:1px solid var(--line);padding-top:10px}
  .pill{display:inline-block;background:var(--chip);border:1px solid var(--line);border-radius:99px;padding:2px 9px;font-size:11px;color:var(--sub);margin:2px 3px 0 0}
</style>
<div class="wrap">
  <h1>업소명·이름으로 배너 + 썸네일 세트 자동 생성 <span style="color:var(--sub);font-weight:500;font-size:13px">— 제안 데모</span></h1>
  <p class="lead"><b>업소명</b>과 <b>이름</b>을 넣으면 <b>같은 테마</b>로 두 가지가 함께 만들어집니다 — ① 상단 <b>가로 배너</b>(슬롯 크기별) ② 공고 리스트의 <b>정사각 썸네일</b>. 업소명은 위(작게)·이름은 아래(크게)로 알아서 배치되고("강남엘리트 / 일우" 스타일), 배너·썸네일이 <b>통일감</b> 있게 짝을 이룹니다. 🎲=테마 교체, 슬라이더=글씨 크기.</p>

  <div class="bar">
    <label>업소명</label>
    <input id="shop" value="강남엘리트" maxlength="20" placeholder="예: 해운대 더그랜드룸" />
    <label style="margin-left:6px">이름</label>
    <input id="nm" value="일우" maxlength="16" placeholder="예: 관우실장" />
  </div>
  <div class="bar" style="margin-top:8px;gap:7px;flex-wrap:wrap">
    <button id="shufColor">🎨 색 <span class="mini" id="lblColor"></span></button>
    <button id="shufFrame" class="alt">▢ 프레임 <span class="mini" id="lblFrame"></span></button>
    <button id="shufVec" class="alt">✦ 벡터 <span class="mini" id="lblVec"></span></button>
    <button id="shufPart" class="alt">✧ 입자 <span class="mini" id="lblPart"></span></button>
    <button id="shufAll" class="ghost2">🎲 전체 랜덤</button>
    <button id="autoName" class="ghost2" title="업소명·이름 해시로 자동 배정">🔤 이름 자동</button>
  </div>
  <div class="combohint" id="combohint"></div>
  <div class="fsgroup">
    <div class="fstitle">가로배너 글씨</div>
    <div class="fsrow"><span class="fslab">업소명(상단)</span><input id="fsB_shop" type="range" min="0.5" max="1.5" step="0.05" value="1"><span class="fsv" id="fsB_shop_v">100%</span></div>
    <div class="fsrow"><span class="fslab">이름(하단)</span><input id="fsB_name" type="range" min="0.5" max="1.5" step="0.05" value="1"><span class="fsv" id="fsB_name_v">100%</span></div>
  </div>
  <div class="fsgroup">
    <div class="fstitle">정사각 썸네일 글씨</div>
    <div class="fsrow"><span class="fslab">업소명(상단)</span><input id="fsS_shop" type="range" min="0.5" max="1.5" step="0.05" value="1"><span class="fsv" id="fsS_shop_v">100%</span></div>
    <div class="fsrow"><span class="fslab">이름(하단)</span><input id="fsS_name" type="range" min="0.5" max="1.5" step="0.05" value="1"><span class="fsv" id="fsS_name_v">100%</span></div>
    <button id="fsReset" style="margin-top:6px;background:transparent;color:var(--sub);border:1px solid var(--line)">글씨 크기 전체 기본값</button>
  </div>

  <div class="set">
    <div class="cap">이 가게의 세트 <b id="themeName"></b></div>

    <div class="grp">
      <div class="gl">① 정사각 썸네일 + 공고 리스트에서 보이는 모습</div>
      <div class="joblist" id="joblist"></div>
    </div>

    <div class="grp">
      <div class="gl">② 가로 배너 — 최상단(600×150)</div>
      <div class="row c2" id="row-top"></div>
    </div>
    <div class="grp">
      <div class="gl">둘째줄(400×150)</div>
      <div class="row c3" id="row-mid"></div>
    </div>
    <div class="grp">
      <div class="gl">셋째줄(300×150)</div>
      <div class="row c4" id="row-bot"></div>
    </div>
  </div>

  <div class="examples">
    <h3>여러 가게 예시 — 이름만으로 <b style="color:var(--brand)">자동 배정</b>돼 가게마다 다른 조합, 각 가게 안에서는 배너·썸네일 통일</h3>
    <div class="exgrid" id="exgrid"></div>
  </div>

  <div class="how">
    <h3>관리자에 이렇게 붙습니다</h3>
    <ol>
      <li>배너관리 → <b>"이름으로 생성"</b> 에서 가게 이름 입력</li>
      <li>미리보기에 <b>배너 + 정사각 썸네일이 같은 테마</b>로 함께 뜸 (🎲로 테마 교체)</li>
      <li><b>"이 세트로 등록"</b> → 배너는 홈 배너 슬롯에, 썸네일은 그 가게 공고 대표이미지로 함께 저장</li>
    </ol>
    <div class="note">
      <span class="pill">6가지 테마</span><span class="pill">가게=1테마(통일)</span><span class="pill">배너+썸네일 동시</span><span class="pill">SVG 초경량·항상 선명</span><br>
      두 자산이 같은 배경·색·글자 스타일을 공유해 브랜드 통일감이 생깁니다. 나중에 실제 사진으로 교체도 가능.
    </div>
  </div>
</div>

<script>
${gen}

const W = window;
W.__pal = 0; W.__f = 0; W.__v = 1; W.__pt = 0;   // 색 / 프레임 / 벡터 / 입자 인덱스 (전부 분리)
W.__auto = false;                                 // true면 업소명·이름 해시로 자동배정
W.__b = { shop: 1, name: 1 };                     // 가로배너 상단/하단 글씨배율
W.__s = { shop: 1, name: 1 };                     // 정사각 상단/하단 글씨배율

function render() {
  const shop = (document.getElementById('shop').value || '').trim();
  const nameV = (document.getElementById('nm').value || '').trim();
  const input = { shop, name: nameV };
  const label = [shop, nameV].filter(Boolean).join(' ') || '샘플 가게';
  const design = W.__auto ? undefined : { p: W.__pal, f: W.__f, v: W.__v, pt: W.__pt };
  document.getElementById('themeName').textContent = W.__auto
    ? '· 이름으로 자동 배정됨'
    : '· 색 ' + PALETTE_LABELS[W.__pal] + ' · 프레임 ' + (W.__f+1) + ' · 벡터 ' + (W.__v+1);
  document.getElementById('lblColor').textContent = PALETTE_LABELS[W.__pal];
  document.getElementById('lblFrame').textContent = (W.__f+1) + '/' + FRAME_COUNT;
  document.getElementById('lblVec').textContent = (W.__v+1) + '/' + VECTOR_COUNT;
  document.getElementById('lblPart').textContent = (W.__pt+1) + '/' + PARTICLE_COUNT;
  document.getElementById('combohint').innerHTML = '색 ' + PALETTE_COUNT + ' × 프레임 ' + FRAME_COUNT + ' × 벡터 ' + VECTOR_COUNT + ' × 입자 ' + PARTICLE_COUNT + ' = <b>' + COMBO_COUNT.toLocaleString() + '가지</b> 조합 · 업소마다 이름으로 자동 배정(관리자에서 변경 가능)';

  // 가로 배너 — 배너 상단/하단 글씨배율
  const rows = [['row-top',SLOT_SIZES.top],['row-mid',SLOT_SIZES.mid],['row-bot',SLOT_SIZES.bot]];
  const counts = {'row-top':2,'row-mid':3,'row-bot':4};
  for (const [el,size] of rows) {
    let h=''; for(let i=0;i<counts[el];i++) h+='<div class="cell">'+generateBannerSVG(input,size,design,W.__b)+'</div>';
    document.getElementById(el).innerHTML=h;
  }

  // 정사각 썸네일 — 정사각 상단/하단 글씨배율(별도)
  const sq = generateBannerSVG(input, SLOT_SIZES.square, design, W.__s);
  document.getElementById('joblist').innerHTML =
    '<div class="job"><div class="thumb">'+sq+'</div><div class="meta"><div class="co">'+esc(shop||label)+'</div><div class="ti">'+esc(label)+' 신규 모집</div><div class="wg">티씨 20만원 · 서울 강남구</div></div></div>' +
    '<div class="job"><div class="thumb">'+sq+'</div><div class="meta"><div class="co">'+esc(shop||label)+'</div><div class="ti">'+esc(label)+' 주말 알바</div><div class="wg">시급 3만원 · 서울 강남구</div></div></div>';
}
function esc(s){return s.replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// 여러 가게 예시 — design 미지정 → 업소명/이름 해시로 자동배정(각기 다른 조합)
const EX = [["강남엘리트","일우"],["BAR11","관우실장"],["해운대룸","S팀 종대"],["송파잠실","1등두팔"],["달토","A팀 대희"],["수원스타","가라오케"],["명동에이스","블랙"],["역삼로얄","강훈"]];
function renderExamples(){
  let h='';
  EX.forEach(([shop,name])=>{
    const inp = {shop, name};   // design 없음 → 자동
    h += '<div class="ex"><div class="exsq">'+generateBannerSVG(inp,SLOT_SIZES.square)+'</div><div class="exban">'+generateBannerSVG(inp,SLOT_SIZES.mid)+'</div></div>';
  });
  document.getElementById('exgrid').innerHTML=h;
}

document.getElementById('nm').addEventListener('input', render);
document.getElementById('shop').addEventListener('input', render);
// 색 / 프레임 / 벡터 / 입자 개별 셔플 (셔플하면 자동모드 해제)
const off = ()=>{ W.__auto=false; };
document.getElementById('shufColor').addEventListener('click', ()=>{ off(); W.__pal=(W.__pal+1)%PALETTE_COUNT; render(); });
document.getElementById('shufFrame').addEventListener('click', ()=>{ off(); W.__f=(W.__f+1)%FRAME_COUNT; render(); });
document.getElementById('shufVec').addEventListener('click', ()=>{ off(); W.__v=(W.__v+1)%VECTOR_COUNT; render(); });
document.getElementById('shufPart').addEventListener('click', ()=>{ off(); W.__pt=(W.__pt+1)%PARTICLE_COUNT; render(); });
document.getElementById('shufAll').addEventListener('click', ()=>{ off(); W.__pal=(W.__pal+2)%PALETTE_COUNT; W.__f=(W.__f+7)%FRAME_COUNT; W.__v=(W.__v+5)%VECTOR_COUNT; W.__pt=(W.__pt+3)%PARTICLE_COUNT; render(); });
document.getElementById('autoName').addEventListener('click', ()=>{ W.__auto=true; render(); });
// 글씨 슬라이더 4개 — 가로배너(업소명/이름) · 정사각(업소명/이름)
function bindFs(id, store, key){
  const el=document.getElementById(id), lab=document.getElementById(id+'_v');
  el.addEventListener('input', ()=>{ store[key]=parseFloat(el.value); lab.textContent=Math.round(store[key]*100)+'%'; render(); });
  return el;
}
const fsEls=[
  [bindFs('fsB_shop', W.__b, 'shop'), 'fsB_shop_v'],
  [bindFs('fsB_name', W.__b, 'name'), 'fsB_name_v'],
  [bindFs('fsS_shop', W.__s, 'shop'), 'fsS_shop_v'],
  [bindFs('fsS_name', W.__s, 'name'), 'fsS_name_v'],
];
document.getElementById('fsReset').addEventListener('click', ()=>{
  W.__b={shop:1,name:1}; W.__s={shop:1,name:1};
  fsEls.forEach(([el,vid])=>{ el.value=1; document.getElementById(vid).textContent='100%'; });
  render();
});
render(); renderExamples();
</script>
`;

writeFileSync(join(DIR, "banner-gen-demo.html"), html);
console.log("데모 생성:", (html.length / 1024).toFixed(0) + "KB");
