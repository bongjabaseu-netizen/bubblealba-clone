/** 광고주 초이스톡 — 카카오톡 스타일 채팅 UI */
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendChoiceTalkMessage } from "@/lib/actions/choicetalk";
import { ChoiceTalkForm } from "./ChoiceTalkForm";

interface Room {
  id: string;
  name: string;
  slug: string;
  _count: { messages: number };
  messages: { id: string; content: string; createdAt: Date; author: { nickname: string | null } }[];
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}

/** 메시지를 날짜별로 그룹핑 */
function groupByDate(messages: Room["messages"]) {
  const groups: { date: string; items: Room["messages"] }[] = [];
  let currentDate = "";
  // 역순(최신→오래된)을 시간순으로 뒤집기
  const sorted = [...messages].reverse();
  for (const msg of sorted) {
    const d = new Date(msg.createdAt).toDateString();
    if (d !== currentDate) {
      currentDate = d;
      groups.push({ date: formatDate(msg.createdAt), items: [] });
    }
    groups[groups.length - 1].items.push(msg);
  }
  return groups;
}

export function AdvertiserChoiceTalk({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id ?? "");
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentRoom = rooms.find(r => r.id === selectedRoom);
  const groups = currentRoom ? groupByDate(currentRoom.messages) : [];

  // 메시지 전송 후 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentRoom?.messages.length]);

  function handleSend(overrideText?: string) {
    const msg = overrideText ?? text;
    if (!msg.trim() || !selectedRoom) return;
    startTransition(async () => {
      const result = await sendChoiceTalkMessage(selectedRoom, msg);
      if (result.success) {
        setText("");
        router.refresh();
      }
    });
  }

  function handleFormSubmit(message: string) {
    setShowForm(false);
    handleSend(message);
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-130px)]">
        <p className="text-slate-400">배정된 톡방이 없습니다. 관리자에게 문의하세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* ===== 톡방 헤더 ===== */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center text-lg shrink-0">💬</div>
        <div className="flex-1 min-w-0">
          <select
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
            className="font-semibold text-slate-900 bg-transparent border-none outline-none cursor-pointer text-sm w-full"
          >
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name} 초이스톡 ({r._count.messages})</option>
            ))}
          </select>
        </div>
        <a href={`/choicetalk/${currentRoom?.slug}`} className="text-xs text-slate-400 hover:text-slate-600">미리보기 →</a>
      </div>

      {/* ===== 채팅 영역 (카톡 스타일) ===== */}
      <div className="flex-1 overflow-y-auto bg-[#B2C7D9] px-4 py-3">
        {groups.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm text-white/80">첫 메시지를 보내보세요!</p>
            </div>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.date}>
              {/* 날짜 구분선 */}
              <div className="flex items-center justify-center my-4">
                <span className="bg-black/20 text-white text-xs px-3 py-1 rounded-full">{group.date}</span>
              </div>

              {/* 메시지들 — 내가 보낸 건 오른쪽 */}
              {group.items.map((msg) => (
                <div key={msg.id} className="flex justify-end mb-2">
                  {/* 시간 (왼쪽) */}
                  <span className="text-[10px] text-slate-500 self-end mr-1 mb-0.5">
                    {formatTime(msg.createdAt)}
                  </span>
                  {/* 말풍선 */}
                  <div className="max-w-[300px] rounded-xl rounded-tr-sm bg-[#FEE500] px-3 py-2 shadow-sm">
                    <p className="text-sm text-slate-900 whitespace-pre-line break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ===== 빠른 전송 버튼 + 양식 버튼 ===== */}
      <div className="flex gap-1.5 px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto shrink-0">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="shrink-0 px-3 py-1 rounded-full bg-[#FEE500] text-xs text-slate-800 font-semibold hover:bg-[#FDD835] whitespace-nowrap"
        >
          📋 양식
        </button>
        {["🔥 지금 맞출 가능", "💎 S급 출근 완료", "✨ 신규 입성!", "💫 대기 많아요", "🎉 이벤트 진행중", "📍 오픈했습니다"].map(msg => (
          <button
            key={msg}
            type="button"
            onClick={() => { setText(msg); }}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 hover:bg-slate-200 whitespace-nowrap"
          >
            {msg}
          </button>
        ))}
      </div>

      {/* 양식 모달 */}
      {showForm && currentRoom && (
        <ChoiceTalkForm
          roomName={currentRoom.name}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* ===== 입력창 (카톡 스타일) ===== */}
      <div className="flex items-end gap-2 px-3 py-2 bg-white border-t border-slate-200 shrink-0">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            maxLength={200}
            rows={1}
            placeholder="메시지를 입력하세요..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none max-h-[80px]"
            style={{ minHeight: "20px" }}
          />
        </div>
        <button
          onClick={() => handleSend()}
          disabled={isPending || !text.trim()}
          className="w-9 h-9 rounded-full bg-[#FEE500] flex items-center justify-center shrink-0 disabled:opacity-30 hover:bg-[#FDD835] transition-colors"
        >
          <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
