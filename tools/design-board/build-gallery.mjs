/** 디자인 리뷰 갤러리 HTML 조립 — shots/*.jpg + manifest.json + NN.json(요소지도) → design-board.html
 * v3: 클릭 지점의 실제 DOM 요소 자동 인식 (호버 하이라이트 + 요소명 포함 지시문) */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(DIR, "shots");
const manifest = JSON.parse(readFileSync(join(SHOTS, "manifest.json"), "utf8"));

const sections = [];
const maps = {};
for (const m of manifest) {
  if (!m.file) continue;
  let sec = sections.find((s) => s.name === m.section);
  if (!sec) sections.push((sec = { name: m.section, items: [] }));
  const b64 = readFileSync(join(SHOTS, m.file)).toString("base64");
  sec.items.push({ ...m, src: `data:image/jpeg;base64,${b64}` });
  const mapFile = join(SHOTS, m.num + ".json");
  if (existsSync(mapFile)) maps[m.num] = JSON.parse(readFileSync(mapFile, "utf8"));
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const cards = sections
  .map(
    (sec) => `
  <section id="sec-${esc(sec.name)}">
    <h2 class="sec-title">${esc(sec.name)} <span class="sec-count">${sec.items.length}개 화면</span></h2>
    <div class="grid">
      ${sec.items
        .map(
          (it) => `
      <figure class="card" data-num="${it.num}" data-label="${esc(it.label)}" data-path="${esc(it.path)}" tabindex="0">
        <figcaption class="card-head">
          <span class="num">${it.num}</span>
          <span class="label">${esc(it.label)}</span>
          <code class="path">${esc(it.path)}</code>
        </figcaption>
        <div class="thumb"><img src="${it.src}" alt="${it.num} ${esc(it.label)}" loading="lazy"></div>
      </figure>`
        )
        .join("")}
    </div>
  </section>`
  )
  .join("");

const nav = sections
  .map((sec) => `<a href="#sec-${esc(sec.name)}">${esc(sec.name)} <b>${sec.items.length}</b></a>`)
  .join("");

const html = `<title>명품알바 전 화면 디자인 보드</title>
<style>
  :root{
    --bg:#f5f6f9; --panel:#ffffff; --ink:#1a2236; --sub:#5c6b8a; --line:#dde2ec;
    --accent:#e05f00; --accent-soft:#ffe9d6; --num-bg:#1a2236; --num-ink:#ffffff;
    --overlay:rgba(10,15,28,.72); --ok:#0f8a4d;
  }
  @media (prefers-color-scheme: dark){ :root{
    --bg:#0d1526; --panel:#16233f; --ink:#eef2fa; --sub:#7d8db1; --line:#20304f;
    --accent:#ff7a1a; --accent-soft:rgba(255,122,26,.14); --num-bg:#ff7a1a; --num-ink:#0d1526;
    --overlay:rgba(4,9,20,.82); --ok:#34d399;
  }}
  :root[data-theme="dark"]{
    --bg:#0d1526; --panel:#16233f; --ink:#eef2fa; --sub:#7d8db1; --line:#20304f;
    --accent:#ff7a1a; --accent-soft:rgba(255,122,26,.14); --num-bg:#ff7a1a; --num-ink:#0d1526;
    --overlay:rgba(4,9,20,.82); --ok:#34d399;
  }
  :root[data-theme="light"]{
    --bg:#f5f6f9; --panel:#ffffff; --ink:#1a2236; --sub:#5c6b8a; --line:#dde2ec;
    --accent:#e05f00; --accent-soft:#ffe9d6; --num-bg:#1a2236; --num-ink:#ffffff;
    --overlay:rgba(10,15,28,.72); --ok:#0f8a4d;
  }
  *{box-sizing:border-box}
  body{background:var(--bg);color:var(--ink);font-family:"Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif;margin:0;padding:0 28px 120px}
  header.top{padding:34px 4px 10px;max-width:1400px;margin:0 auto}
  h1{font-size:22px;margin:0;letter-spacing:-.02em}
  .hint{color:var(--sub);font-size:13.5px;margin-top:8px;line-height:1.7;max-width:75ch}
  .hint b{color:var(--accent)}
  nav.jump{position:sticky;top:0;z-index:20;background:var(--bg);display:flex;gap:8px;padding:12px 4px;max-width:1400px;margin:0 auto;border-bottom:1px solid var(--line)}
  nav.jump a{color:var(--ink);text-decoration:none;font-size:13px;font-weight:600;padding:7px 14px;border:1px solid var(--line);border-radius:99px;background:var(--panel)}
  nav.jump a b{color:var(--accent);font-weight:800;margin-left:2px}
  nav.jump a:hover{border-color:var(--accent)}
  main{max-width:1400px;margin:0 auto}
  .sec-title{font-size:16px;margin:36px 4px 14px;display:flex;align-items:baseline;gap:10px}
  .sec-count{color:var(--sub);font-size:12.5px;font-weight:500}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}
  .card{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;cursor:zoom-in;transition:border-color .15s}
  .card:hover,.card:focus-visible{border-color:var(--accent);outline:none}
  .card-head{display:flex;align-items:center;gap:9px;padding:10px 12px;border-bottom:1px solid var(--line)}
  .num{background:var(--num-bg);color:var(--num-ink);font-weight:800;font-size:12px;min-width:26px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums}
  .label{font-weight:700;font-size:13.5px}
  .path{margin-left:auto;color:var(--sub);font-size:11px;font-family:Consolas,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:45%}
  .thumb{height:300px;overflow:hidden;background:#0a0f1c}
  .thumb img{width:100%;display:block;object-fit:cover;object-position:top}

  /* 라이트박스 (요소 인식 모드) */
  #lb{position:fixed;inset:0;background:var(--overlay);z-index:50;display:none;overflow:auto;padding:56px 24px 24px}
  #lb.on{display:block}
  #lb .bar{position:fixed;top:0;left:0;right:0;height:46px;background:var(--panel);border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px;padding:0 16px;font-size:13px;z-index:51}
  #lb .bar .mode{color:var(--accent);font-weight:700;font-size:12px;background:var(--accent-soft);padding:3px 9px;border-radius:99px}
  #lb .bar .esc{margin-left:auto;color:var(--sub);font-size:11.5px;border:1px solid var(--line);border-radius:5px;padding:2px 7px;cursor:pointer;white-space:nowrap}
  #lb .stage{position:relative;max-width:1280px;margin:0 auto;cursor:crosshair}
  #lb img{display:block;width:100%;border-radius:8px}
  /* 호버 하이라이트 */
  #hl{position:absolute;border:2px solid var(--accent);background:rgba(255,122,26,.12);border-radius:3px;pointer-events:none;display:none;z-index:4}
  #hl-tag{position:absolute;pointer-events:none;display:none;z-index:7;background:var(--accent);color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px;max-width:420px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:Consolas,monospace}
  .pin{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:var(--accent);color:#fff;font-weight:800;font-size:12.5px;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.45);cursor:pointer;z-index:5}
  /* 핀 메모 팝업 */
  #memo{position:absolute;z-index:8;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px;width:320px;box-shadow:0 8px 28px rgba(0,0,0,.35);display:none}
  #memo.on{display:block}
  #memo .sel-el{font-size:11.5px;color:var(--accent);font-weight:700;margin-bottom:7px;font-family:Consolas,monospace;word-break:break-all;line-height:1.5}
  #memo .sel-el b{color:var(--sub);font-family:inherit;font-weight:500}
  #memo input{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:7px;color:var(--ink);font-size:13px;padding:8px 10px;font-family:inherit}
  #memo input:focus{outline:none;border-color:var(--accent)}
  #memo .row{display:flex;gap:6px;margin-top:8px;justify-content:flex-end}
  #memo button{font-size:12px;font-weight:700;border-radius:7px;padding:6px 12px;border:1px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer;font-family:inherit}
  #memo button.pri{background:var(--accent);border-color:var(--accent);color:#fff}

  /* 하단 선택 트레이 */
  #tray{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:60;background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:0 10px 34px rgba(0,0,0,.4);width:min(720px,92vw);display:none}
  #tray.on{display:block}
  #tray .t-head{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--line);font-size:13px;font-weight:700}
  #tray .t-head .cnt{color:var(--accent)}
  #tray .t-head .sp{margin-left:auto;display:flex;gap:6px;align-items:center}
  #tray .t-head button{font-size:12px;font-weight:700;border-radius:7px;padding:6px 12px;border:1px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer;font-family:inherit}
  #tray .t-head button.pri{background:var(--accent);border-color:var(--accent);color:#fff}
  #tray ul{list-style:none;margin:0;padding:6px 8px;max-height:180px;overflow-y:auto}
  #tray li{display:flex;align-items:center;gap:8px;font-size:12.5px;padding:6px 8px;border-radius:7px}
  #tray li:hover{background:var(--bg)}
  #tray li .pnum{background:var(--accent);color:#fff;font-weight:800;font-size:11px;min-width:20px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  #tray li .el{color:var(--accent);font-family:Consolas,monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px}
  #tray li .del{margin-left:auto;color:var(--sub);cursor:pointer;border:none;background:none;font-size:14px;padding:0 4px;flex-shrink:0}
  #tray li .del:hover{color:#e5484d}
  #tray .copybox{display:none;border-top:1px solid var(--line);padding:10px 14px}
  #tray .copybox.on{display:block}
  #tray textarea{width:100%;height:110px;background:var(--bg);border:1px solid var(--line);border-radius:8px;color:var(--ink);font-size:12px;font-family:Consolas,monospace;padding:8px;resize:vertical}
  #tray .copied{color:var(--ok);font-size:12px;font-weight:700;display:none}
  @media (prefers-reduced-motion: no-preference){ .card{transition:border-color .15s, transform .15s} .card:hover{transform:translateY(-2px)} }
</style>
<header class="top">
  <h1>명품알바 — 전 화면 디자인 보드 <span style="color:var(--sub);font-weight:500;font-size:13px">2026-07-08 기준 · 33화면 · 요소 인식</span></h1>
  <p class="hint">① 카드를 클릭해 화면을 크게 연다 → ② 마우스를 올리면 <b>실제 요소(배너·버튼·표 등)에 테두리와 이름</b>이 표시된다 → ③ 클릭하면 그 요소가 핀으로 선택됨 (메모는 선택) → ④ 하단 <b>"지시문 복사"</b> → 채팅창에 붙여넣기. 어떤 요소를 골랐는지 자동으로 담기므로 제가 코드에서 정확히 그 부분을 찾습니다.</p>
</header>
<nav class="jump">${nav}</nav>
<main>${cards}</main>

<div id="lb">
  <div class="bar"><span class="num" id="lb-num"></span><span class="label" id="lb-label"></span><code class="path" id="lb-path"></code><span class="mode">📌 요소에 마우스 올리고 클릭</span><span class="esc" id="lb-close">닫기 ESC</span></div>
  <div class="stage" id="stage">
    <img id="lb-img" alt="">
    <div id="hl"></div><div id="hl-tag"></div>
    <div id="memo"><div class="sel-el" id="memo-el"></div><input id="memo-in" placeholder="어떻게 바꿀까요? (예: 위치를 상단으로) — 비워도 됨" maxlength="120"><div class="row"><button id="memo-cancel">취소</button><button class="pri" id="memo-ok">이 요소 선택</button></div></div>
  </div>
</div>

<div id="tray">
  <div class="t-head">📌 선택한 요소 <span class="cnt" id="t-cnt">0</span>개
    <span class="sp">
      <span class="copied" id="t-copied">복사됨! 채팅창에 붙여넣으세요</span>
      <button id="t-clear">전체 지우기</button>
      <button class="pri" id="t-copy">지시문 복사</button>
    </span>
  </div>
  <ul id="t-list"></ul>
  <div class="copybox" id="t-box"><textarea id="t-text" readonly></textarea></div>
</div>

<script id="elmaps" type="application/json">${JSON.stringify(maps)}</script>
<script>
(() => {
  const MAPS=JSON.parse(document.getElementById('elmaps').textContent);
  const lb=document.getElementById('lb'),lbImg=document.getElementById('lb-img'),stage=document.getElementById('stage');
  const hl=document.getElementById('hl'),hlTag=document.getElementById('hl-tag');
  const memo=document.getElementById('memo'),memoIn=document.getElementById('memo-in'),memoEl=document.getElementById('memo-el');
  const tray=document.getElementById('tray'),tList=document.getElementById('t-list'),tCnt=document.getElementById('t-cnt');
  const tText=document.getElementById('t-text'),tBox=document.getElementById('t-box'),tCopied=document.getElementById('t-copied');
  let cur=null, curMap=null, pending=null;
  const pins=[]; // {num,label,path,x,y,el:{name,bx,by,bw,bh}|null,note}

  // ---- 카드 → 라이트박스 ----
  document.querySelectorAll('.card').forEach(c=>{
    const open=()=>{
      cur={num:c.dataset.num,label:c.dataset.label,path:c.dataset.path};
      curMap=MAPS[cur.num]||null;
      lbImg.src=c.querySelector('img').src;
      document.getElementById('lb-num').textContent=cur.num;
      document.getElementById('lb-label').textContent=cur.label;
      document.getElementById('lb-path').textContent=cur.path;
      lb.classList.add('on');document.body.style.overflow='hidden';
      hideMemo();hideHl();renderPins();
    };
    c.addEventListener('click',open);
    c.addEventListener('keydown',e=>{if(e.key==='Enter')open();});
  });
  const close=()=>{lb.classList.remove('on');document.body.style.overflow='';hideMemo();hideHl();};
  document.getElementById('lb-close').addEventListener('click',close);
  lb.addEventListener('click',e=>{if(e.target===lb)close();});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(memo.classList.contains('on'))hideMemo();else close();}});

  // ---- 요소 히트테스트: 지점을 포함하는 가장 작은 박스 ----
  function hitEl(fx,fy){ // fx,fy: 0~1 (이미지 기준 비율)
    if(!curMap)return null;
    const px=fx*curMap.w, py=fy*curMap.h;
    let best=null,bestArea=Infinity;
    for(const [x,y,w,h,name] of curMap.els){
      if(px>=x&&px<=x+w&&py>=y&&py<=y+h){
        const a=w*h;
        if(a<bestArea){bestArea=a;best={name,bx:x,by:y,bw:w,bh:h};}
      }
    }
    return best;
  }
  const pct=(v,total)=>(v/total*100).toFixed(2)+'%';
  function showHl(el){
    if(!el||!curMap){hideHl();return;}
    hl.style.left=pct(el.bx,curMap.w);hl.style.top=pct(el.by,curMap.h);
    hl.style.width=pct(el.bw,curMap.w);hl.style.height=pct(el.bh,curMap.h);
    hl.style.display='block';
    hlTag.textContent=el.name;
    hlTag.style.left=pct(el.bx,curMap.w);
    const topP=el.by/curMap.h*100;
    hlTag.style.top='calc('+topP+'% - 22px)';
    if(el.by<40)hlTag.style.top=pct(el.by+el.bh+4,curMap.h);
    hlTag.style.display='block';
  }
  function hideHl(){hl.style.display='none';hlTag.style.display='none';}

  // ---- 호버 → 하이라이트 ----
  lbImg.addEventListener('mousemove',e=>{
    if(memo.classList.contains('on'))return;
    const r=lbImg.getBoundingClientRect();
    showHl(hitEl((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height));
  });
  lbImg.addEventListener('mouseleave',()=>{if(!memo.classList.contains('on'))hideHl();});

  // ---- 클릭 → 요소 선택 + 메모 팝업 ----
  lbImg.addEventListener('click',e=>{
    const r=lbImg.getBoundingClientRect();
    const fx=(e.clientX-r.left)/r.width, fy=(e.clientY-r.top)/r.height;
    const el=hitEl(fx,fy);
    pending={x:+(fx*100).toFixed(1),y:+(fy*100).toFixed(1),el};
    showHl(el);
    memoEl.innerHTML=el?('<b>선택된 요소:</b> '+el.name.replace(/</g,'&lt;')):'<b>선택 지점:</b> 좌표만 기록됩니다';
    memo.style.left=Math.min(Math.max(e.clientX-r.left,10),r.width-330)+'px';
    memo.style.top=(e.clientY-r.top+14)+'px';
    memoIn.value='';
    memo.classList.add('on');
    setTimeout(()=>memoIn.focus(),0);
  });
  function hideMemo(){memo.classList.remove('on');pending=null;}
  document.getElementById('memo-cancel').addEventListener('click',()=>{hideMemo();hideHl();});
  function addPin(){
    if(!pending||!cur)return;
    pins.push({...cur,...pending,note:memoIn.value.trim()});
    hideMemo();hideHl();renderPins();renderTray();
  }
  document.getElementById('memo-ok').addEventListener('click',addPin);
  memoIn.addEventListener('keydown',e=>{if(e.key==='Enter')addPin();});

  // ---- 핀 렌더 ----
  function renderPins(){
    stage.querySelectorAll('.pin').forEach(p=>p.remove());
    if(!cur)return;
    pins.forEach((p,idx)=>{
      if(p.num!==cur.num)return;
      const el=document.createElement('div');
      el.className='pin';el.textContent=idx+1;
      el.style.left=p.x+'%';el.style.top=p.y+'%';
      el.title=(p.el?p.el.name+' — ':'')+'클릭하면 삭제';
      el.addEventListener('click',ev=>{ev.stopPropagation();pins.splice(idx,1);renderPins();renderTray();});
      stage.appendChild(el);
    });
  }

  // ---- 트레이 ----
  function renderTray(){
    tCnt.textContent=pins.length;
    tray.classList.toggle('on',pins.length>0);
    tBox.classList.remove('on');tCopied.style.display='none';
    tList.innerHTML='';
    pins.forEach((p,idx)=>{
      const li=document.createElement('li');
      const elName=p.el?p.el.name:'(좌표만)';
      li.innerHTML='<span class="pnum">'+(idx+1)+'</span><b>'+p.num+' '+p.label+'</b><span class="el">'+elName.replace(/</g,'&lt;')+'</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--sub)">'+(p.note?'— '+p.note.replace(/</g,'&lt;'):'')+'</span>';
      const del=document.createElement('button');del.className='del';del.textContent='✕';del.title='삭제';
      del.addEventListener('click',()=>{pins.splice(idx,1);renderPins();renderTray();});
      li.appendChild(del);tList.appendChild(li);
    });
  }
  document.getElementById('t-clear').addEventListener('click',()=>{pins.length=0;renderPins();renderTray();});

  // ---- 지시문 생성 + 복사 ----
  function buildText(){
    const lines=['[디자인 지시 — 화면/경로/선택 요소/좌표]'];
    pins.forEach((p,idx)=>{
      const el=p.el?(' 요소<'+p.el.name+'> 박스('+p.el.bx+','+p.el.by+','+p.el.bw+'x'+p.el.bh+')'):'';
      lines.push((idx+1)+'. 화면 '+p.num+' '+p.label+' ('+p.path+')'+el+' @ ('+p.x+'%, '+p.y+'%)'+(p.note?' → '+p.note:' → (요청: 이 요소 개선)'));
    });
    return lines.join('\\n');
  }
  document.getElementById('t-copy').addEventListener('click',async()=>{
    const txt=buildText();
    tText.value=txt;tBox.classList.add('on');
    try{
      await navigator.clipboard.writeText(txt);
      tCopied.style.display='inline';
    }catch(e){
      tText.focus();tText.select(); // 클립보드 차단 시 수동 복사 (자동 선택됨 → Ctrl+C)
    }
  });
})();
</script>
`;

writeFileSync(join(DIR, "design-board.html"), html);
console.log("생성 완료:", (html.length / 1024 / 1024).toFixed(2) + "MB, 요소지도 " + Object.keys(maps).length + "화면");
