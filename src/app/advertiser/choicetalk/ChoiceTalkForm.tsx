/** 초이스톡 구조화 입력 폼 — 원본 버블알바 양식 + 구분선/한줄 추가 */
"use client";

import { useState } from "react";

interface StaffEntry { id: string; name: string; count: string; }
interface TextEntry { id: string; text: string; }
interface ExtraLine { id: string; type: "text" | "divider" | "divider-label"; value: string; }

interface FormData {
  location: string;
  staffList: StaffEntry[];
  matchList: TextEntry[];
  wingList: TextEntry[];
  extraLines: ExtraLine[];
  roomCount: string;
  memberCount: string;
}

/** 폼 데이터 → 원본 양식 텍스트 변환 */
function buildMessage(form: FormData, roomName: string): string {
  const lines: string[] = [];
  lines.push(`🏢 ${roomName} : ${form.location}`);
  lines.push("─ ─ ─ ─ ─ ─ ─ ─");

  form.staffList.forEach(s => { if (s.name.trim()) lines.push(`${s.name} ${s.count}`); });

  if (form.matchList.some(m => m.text.trim())) {
    lines.push("─ ─ ─ ─지명─ ─ ─ ─");
    form.matchList.forEach(m => { if (m.text.trim()) lines.push(m.text); });
  }

  if (form.wingList.some(w => w.text.trim())) {
    lines.push("─ ─ ─ ─날개─ ─ ─ ─");
    form.wingList.forEach(w => { if (w.text.trim()) lines.push(w.text); });
  }

  form.extraLines.forEach(line => {
    if (line.type === "divider") lines.push("─ ─ ─ ─ ─ ─ ─ ─");
    else if (line.type === "divider-label") lines.push(`─ ─ ─ ─${line.value}─ ─ ─ ─`);
    else if (line.value.trim()) lines.push(line.value);
  });

  lines.push("─ ─ ─ ─ ─ ─ ─ ─");
  lines.push(`맞출방 ${form.roomCount} · 맞출인원 ${form.memberCount}`);
  return lines.join("\n");
}

export function ChoiceTalkForm({ roomName, onSubmit, onCancel }: {
  roomName: string; onSubmit: (message: string) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    location: "", staffList: [{ id: "1", name: "", count: "" }],
    matchList: [{ id: "1", text: "" }], wingList: [{ id: "1", text: "" }],
    extraLines: [], roomCount: "", memberCount: "",
  });
  const [preview, setPreview] = useState(false);

  // 스탭
  function addStaff() { setForm(p => ({ ...p, staffList: [...p.staffList, { id: Date.now().toString(), name: "", count: "" }] })); }
  function removeStaff(id: string) { setForm(p => ({ ...p, staffList: p.staffList.filter(s => s.id !== id) })); }
  function updateStaff(id: string, field: "name" | "count", value: string) { setForm(p => ({ ...p, staffList: p.staffList.map(s => s.id === id ? { ...s, [field]: value } : s) })); }

  // 지명
  function addMatch() { setForm(p => ({ ...p, matchList: [...p.matchList, { id: Date.now().toString(), text: "" }] })); }
  function removeMatch(id: string) { setForm(p => ({ ...p, matchList: p.matchList.filter(m => m.id !== id) })); }
  function updateMatch(id: string, text: string) { setForm(p => ({ ...p, matchList: p.matchList.map(m => m.id === id ? { ...m, text } : m) })); }

  // 날개
  function addWing() { setForm(p => ({ ...p, wingList: [...p.wingList, { id: Date.now().toString(), text: "" }] })); }
  function removeWing(id: string) { setForm(p => ({ ...p, wingList: p.wingList.filter(w => w.id !== id) })); }
  function updateWing(id: string, text: string) { setForm(p => ({ ...p, wingList: p.wingList.map(w => w.id === id ? { ...w, text } : w) })); }

  // 추가 줄
  function addExtraText() { setForm(p => ({ ...p, extraLines: [...p.extraLines, { id: Date.now().toString(), type: "text", value: "" }] })); }
  function addExtraDivider() { setForm(p => ({ ...p, extraLines: [...p.extraLines, { id: Date.now().toString(), type: "divider", value: "" }] })); }
  function addExtraDividerLabel(label: string) { setForm(p => ({ ...p, extraLines: [...p.extraLines, { id: Date.now().toString(), type: "divider-label", value: label }] })); }
  function updateExtra(id: string, value: string) { setForm(p => ({ ...p, extraLines: p.extraLines.map(l => l.id === id ? { ...l, value } : l) })); }
  function removeExtra(id: string) { setForm(p => ({ ...p, extraLines: p.extraLines.filter(l => l.id !== id) })); }

  const message = buildMessage(form, roomName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-[480px] max-h-[90vh] overflow-y-auto shadow-xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-semibold text-slate-900">📋 초이스톡 양식</h3>
          <div className="flex gap-2">
            <button onClick={() => setPreview(!preview)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200">
              {preview ? "수정" : "미리보기"}
            </button>
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
          </div>
        </div>

        {preview ? (
          <div className="p-5">
            <div className="bg-[#B2C7D9] rounded-xl p-4">
              <div className="flex justify-end">
                <div className="max-w-[320px] rounded-xl rounded-tr-sm bg-[#FEE500] px-4 py-3 shadow-sm">
                  <p className="text-sm text-slate-900 whitespace-pre-line">{message}</p>
                </div>
              </div>
            </div>
            <button onClick={() => onSubmit(message)}
              className="w-full mt-4 py-3 bg-[#FEE500] text-slate-900 rounded-xl font-semibold text-sm hover:bg-[#FDD835]">
              이대로 전송하기
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* 위치 */}
            <div>
              <label className="text-xs font-medium text-slate-500">위치</label>
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                placeholder="석촌동 158" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>

            {/* 스탭 목록 */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-500">스탭 목록</label>
                <button onClick={addStaff} className="text-xs text-blue-500">+ 추가</button>
              </div>
              {form.staffList.map(s => (
                <div key={s.id} className="flex gap-2 mt-1.5">
                  <input value={s.name} onChange={e => updateStaff(s.id, "name", e.target.value)}
                    placeholder="201세종 3삐" className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                  {form.staffList.length > 1 && <button onClick={() => removeStaff(s.id)} className="text-red-300 text-xs">✕</button>}
                </div>
              ))}
            </div>

            {/* 지명 */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-500">지명</label>
                <button onClick={addMatch} className="text-xs text-blue-500">+ 추가</button>
              </div>
              {form.matchList.map(m => (
                <div key={m.id} className="flex gap-2 mt-1.5">
                  <input value={m.text} onChange={e => updateMatch(m.id, e.target.value)}
                    placeholder="2.07 무.열 — 야.지(2)" className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                  {form.matchList.length > 1 && <button onClick={() => removeMatch(m.id)} className="text-red-300 text-xs">✕</button>}
                </div>
              ))}
            </div>

            {/* 날개 */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-500">날개</label>
                <button onClick={addWing} className="text-xs text-blue-500">+ 추가</button>
              </div>
              {form.wingList.map(w => (
                <div key={w.id} className="flex gap-2 mt-1.5">
                  <input value={w.text} onChange={e => updateWing(w.id, e.target.value)}
                    placeholder="2.14 한.수" className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                  {form.wingList.length > 1 && <button onClick={() => removeWing(w.id)} className="text-red-300 text-xs">✕</button>}
                </div>
              ))}
            </div>

            {/* 추가 줄 */}
            {form.extraLines.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-500">추가 항목</label>
                <div className="mt-1 space-y-1.5">
                  {form.extraLines.map(line => (
                    <div key={line.id} className="flex gap-1.5 items-center">
                      {line.type === "divider" ? (
                        <div className="flex-1 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg py-1.5">── 구분선 ──</div>
                      ) : line.type === "divider-label" ? (
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-xs text-slate-400">──</span>
                          <input value={line.value} onChange={e => updateExtra(line.id, e.target.value)}
                            className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center" />
                          <span className="text-xs text-slate-400">──</span>
                        </div>
                      ) : (
                        <input value={line.value} onChange={e => updateExtra(line.id, e.target.value)}
                          placeholder="추가 내용" className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                      )}
                      <button onClick={() => removeExtra(line.id)} className="text-red-300 hover:text-red-500 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추가 버튼들 */}
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={addExtraText} className="px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 hover:bg-slate-200">+ 한줄 추가</button>
              <button onClick={addExtraDivider} className="px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 hover:bg-slate-200">── 구분선</button>
              <button onClick={() => addExtraDividerLabel("")} className="px-2.5 py-1 rounded-full bg-blue-50 text-xs text-blue-600 hover:bg-blue-100">── 라벨 구분선</button>
            </div>

            {/* 맞출방 / 맞출인원 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500">맞출방</label>
                <input value={form.roomCount} onChange={e => setForm(p => ({ ...p, roomCount: e.target.value }))}
                  placeholder="6" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">맞출인원</label>
                <input value={form.memberCount} onChange={e => setForm(p => ({ ...p, memberCount: e.target.value }))}
                  placeholder="13" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <button onClick={() => setPreview(true)} disabled={!form.location.trim()}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium disabled:opacity-30">
              미리보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
