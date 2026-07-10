"use client";

/**
 * 디자인 픽커 — localhost 전용 요소 선택 오버레이 (실서비스엔 절대 안 뜸)
 * from: 디자인 검토 워크플로 (스크린샷 재캡처 없이 라이브 앱에서 마우스로 요소 지목)
 * 사용: 로컬(localhost)에서 Alt+P 로 켜기 → 고칠 부분에 마우스 올려 클릭 → 정보가 클립보드로 복사 → 채팅에 붙여넣기
 * 게이트: location.hostname 이 localhost/127.0.0.1 일 때만 활성. 배포(도메인)에선 렌더/리스너 모두 없음.
 */
import { useCallback, useEffect, useRef, useState } from "react";

type Pick = { line: string };

/** 요소 → 사람이 읽고 소스에서 찾을 수 있는 한 줄 서술 */
function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const cls = (el.getAttribute("class") || "")
    .split(/\s+/)
    .filter((c) => c && !/^(hover:|focus:|active:|group|peer|data-)/.test(c))
    .slice(0, 8)
    .join(".");
  const rawText = (el as HTMLElement).innerText || el.textContent || "";
  const text = rawText.trim().replace(/\s+/g, " ").slice(0, 30);
  const r = el.getBoundingClientRect();
  // 조상 경로 (nth-of-type 포함, 5단계)
  const crumbs: string[] = [];
  let cur: Element | null = el;
  for (let i = 0; i < 5 && cur && cur.tagName !== "BODY"; i++) {
    const t = cur.tagName.toLowerCase();
    const parent: Element | null = cur.parentElement;
    let nth = "";
    if (parent) {
      const same = Array.from(parent.children).filter((c) => c.tagName === cur!.tagName);
      if (same.length > 1) nth = `:${same.indexOf(cur) + 1}`;
    }
    crumbs.unshift(t + nth);
    cur = parent;
  }
  const sel = tag + (cls ? "." + cls : "");
  const t = text ? ` "${text}"` : "";
  return `<${sel}>${t} (${Math.round(r.width)}×${Math.round(r.height)}) 경로 ${crumbs.join(">")}`;
}

export function DesignPicker() {
  const [isLocal, setIsLocal] = useState(false);
  const [active, setActive] = useState(false);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [copied, setCopied] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // localhost 판정 (배포 도메인에선 이 아래 로직 전부 비활성)
  useEffect(() => {
    const h = window.location.hostname;
    setIsLocal(h === "localhost" || h === "127.0.0.1" || h === "");
  }, []);

  // Alt+P 토글 / Esc 끄기 (localhost 에서만 리스너 등록)
  useEffect(() => {
    if (!isLocal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "p" || e.key === "P" || e.key === "ㅔ")) { e.preventDefault(); setActive((v) => !v); }
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLocal]);

  const inPanel = (t: EventTarget | null) =>
    t instanceof Node && !!panelRef.current?.contains(t);

  // 호버 하이라이트 + 클릭 선택 (active 일 때만)
  useEffect(() => {
    if (!isLocal || !active) return;
    const onMove = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el || inPanel(el)) { if (boxRef.current) boxRef.current.style.display = "none"; return; }
      const r = el.getBoundingClientRect();
      const b = boxRef.current, lab = labelRef.current;
      if (b) { b.style.display = "block"; b.style.left = r.left + "px"; b.style.top = r.top + "px"; b.style.width = r.width + "px"; b.style.height = r.height + "px"; }
      if (lab) {
        lab.style.display = "block";
        lab.textContent = describe(el).split(" 경로 ")[0];
        lab.style.left = r.left + "px";
        lab.style.top = Math.max(0, r.top - 20) + "px";
      }
    };
    const onClick = (e: MouseEvent) => {
      if (inPanel(e.target)) return; // 패널 버튼 클릭은 통과
      e.preventDefault(); e.stopPropagation();
      const el = e.target as Element;
      const line = `화면 ${window.location.pathname} 요소 ${describe(el)}`;
      setPicks((p) => [...p, { line }]);
      setCopied(false);
    };
    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("click", onClick, true);
      if (boxRef.current) boxRef.current.style.display = "none";
      if (labelRef.current) labelRef.current.style.display = "none";
    };
  }, [isLocal, active]);

  const payloadText = "[디자인 픽 · " + picks.length + "건]\n" + picks.map((p, i) => `${i + 1}. ${p.line}`).join("\n");
  const copyAll = useCallback(async () => {
    try { await navigator.clipboard.writeText(payloadText); setCopied(true); }
    catch { setCopied(false); }
  }, [payloadText]);

  if (!isLocal) return null;

  return (
    <>
      {/* 토글 버튼 (항상 표시, localhost 한정) — 하단 탭 위로 올려 겹침 방지 */}
      <button
        onClick={() => setActive((v) => !v)}
        style={{ position: "fixed", left: 12, bottom: 72, zIndex: 2147483647, padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, fontFamily: "system-ui,sans-serif", color: "#fff", background: active ? "#e0620a" : "#1a2236", boxShadow: "0 4px 14px rgba(0,0,0,.35)" }}
        title="디자인 픽커 (Alt+P)"
      >
        🎯 {active ? "픽 중… (Esc 끄기)" : "디자인 픽"}
      </button>

      {/* 호버 하이라이트 (active 시) */}
      {active && (
        <>
          <div ref={boxRef} style={{ position: "fixed", zIndex: 2147483646, pointerEvents: "none", border: "2px solid #e0620a", background: "rgba(224,98,10,.12)", display: "none", borderRadius: 2 }} />
          <div ref={labelRef} style={{ position: "fixed", zIndex: 2147483647, pointerEvents: "none", display: "none", background: "#e0620a", color: "#fff", font: "700 11px/1.4 Consolas,monospace", padding: "1px 6px", borderRadius: 4, maxWidth: 420, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
        </>
      )}

      {/* 픽 목록 패널 — 픽 중(active)엔 클릭 통과시켜 뒤 요소도 집히게, Esc 후 복사 클릭 */}
      {picks.length > 0 && (
        <div ref={panelRef} style={{ position: "fixed", right: 12, bottom: 72, zIndex: 2147483647, width: 380, maxWidth: "92vw", background: "#16233f", color: "#eef2fa", border: "1px solid #24365e", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,0,0,.45)", fontFamily: "system-ui,sans-serif", overflow: "hidden", pointerEvents: active ? "none" : "auto", opacity: active ? 0.75 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderBottom: "1px solid #24365e", fontSize: 13, fontWeight: 800 }}>
            📌 픽 {picks.length}건
            {active && <span style={{ fontSize: 10, fontWeight: 600, color: "#7d8db1" }}>(픽 중 통과 · Esc 후 복사)</span>}
            <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {copied && <span style={{ color: "#34d399", fontSize: 12, fontWeight: 700 }}>복사됨!</span>}
              <button onClick={() => { setPicks([]); setCopied(false); }} style={{ fontSize: 12, fontWeight: 700, borderRadius: 7, padding: "5px 10px", border: "1px solid #24365e", background: "#0f1a30", color: "#eef2fa", cursor: "pointer" }}>지우기</button>
              <button onClick={copyAll} style={{ fontSize: 12, fontWeight: 800, borderRadius: 7, padding: "5px 12px", border: "none", background: "#e0620a", color: "#fff", cursor: "pointer" }}>지시문 복사</button>
            </span>
          </div>
          <div style={{ maxHeight: 150, overflowY: "auto", padding: "6px 10px" }}>
            {picks.map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: "#c7d2e8", padding: "3px 0", borderBottom: "1px solid rgba(36,54,94,.5)", wordBreak: "break-all" }}>
                <b style={{ color: "#e0620a" }}>{i + 1}.</b> {p.line}
              </div>
            ))}
          </div>
          {/* 클립보드 차단 대비 수동 복사 영역 */}
          <textarea readOnly value={payloadText} onFocus={(e) => e.currentTarget.select()} style={{ width: "100%", height: 54, background: "#0f1a30", color: "#7d8db1", border: "none", borderTop: "1px solid #24365e", fontSize: 10, fontFamily: "Consolas,monospace", padding: 8, resize: "none" }} />
        </div>
      )}
    </>
  );
}
