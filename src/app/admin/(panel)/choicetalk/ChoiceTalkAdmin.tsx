/** 관리자 초이스톡 — 톡방 CRUD 클라이언트 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Power, Trash2, X } from "lucide-react";
import { adminCreateRoom, adminToggleRoom, adminDeleteRoom } from "@/lib/actions/choicetalk";

interface Room {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isActive: boolean;
  roomCount: number;
  memberCount: number;
  lastMessageAt: Date | null;
  createdAt: Date;
  owner: { nickname: string | null; email: string | null };
  _count: { messages: number };
}

interface Advertiser {
  id: string;
  nickname: string | null;
  email: string | null;
}

export function ChoiceTalkAdmin({ rooms, advertisers }: { rooms: Room[]; advertisers: Advertiser[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const result = await adminCreateRoom(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        form.reset();
        setShowForm(false);
        router.refresh();
      }
    });
  }

  function handleToggle(roomId: string) {
    startTransition(async () => {
      await adminToggleRoom(roomId);
      router.refresh();
    });
  }

  function handleDelete(roomId: string, name: string) {
    if (!confirm(`"${name}" 톡방을 삭제하시겠습니까? 모든 메시지가 삭제됩니다.`)) return;
    startTransition(async () => {
      await adminDeleteRoom(roomId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* 헤더 — 제목(h1)은 공통 헤더가 pathname 기반으로 표시, 톡방 수 요약과 추가 버튼만 유지 */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-mute">{rooms.length}개 톡방</p>
        {/* 생성/취소 토글 버튼 — 열림 상태는 X, 닫힘 상태는 Plus 아이콘 */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow inline-flex items-center gap-1"
        >
          {showForm ? <><X className="w-3.5 h-3.5" />취소</> : <><Plus className="w-3.5 h-3.5" />톡방 추가</>}
        </button>
      </div>

      {/* 생성 폼 */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5 space-y-4">
          <h2 className="text-[14px] font-bold text-white">새 톡방 만들기</h2>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] text-mute">톡방 이름 *</label>
              <input name="name" required className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" placeholder="예: 갤럭시" />
            </div>
            <div>
              <label className="text-[12px] text-mute">슬러그 *</label>
              <input name="slug" required className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" placeholder="예: galaxy (URL용 영문)" />
            </div>
            <div>
              <label className="text-[12px] text-mute">운영자 (광고주) *</label>
              <select name="ownerId" required className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none">
                <option value="">선택</option>
                {advertisers.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nickname ?? a.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-mute">로고 URL</label>
              <input name="logo" className="mt-1 w-full bg-navy-850 border border-line rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none" placeholder="https://..." />
            </div>
          </div>
          <button type="submit" disabled={isPending} className="h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow disabled:opacity-50 inline-flex items-center gap-1">
            {isPending ? "생성 중..." : <><Plus className="w-3.5 h-3.5" />톡방 생성</>}
          </button>
        </form>
      )}

      {/* 톡방 리스트 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="px-5 py-2.5 font-semibold">톡방</th>
              <th className="px-3 py-2.5 font-semibold">운영자</th>
              <th className="px-3 py-2.5 font-semibold text-center">메시지</th>
              <th className="px-3 py-2.5 font-semibold text-center">상태</th>
              <th className="px-5 py-2.5 font-semibold text-center">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-navy-800/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center text-sm font-medium text-slate-300 shrink-0">
                      {room.logo ? <img src={room.logo} alt="" className="w-full h-full object-cover rounded-lg" /> : room.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{room.name}</div>
                      <div className="text-xs text-mute">/{room.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-300">{room.owner?.nickname ?? room.owner?.email}</td>
                <td className="px-3 py-3 text-center text-slate-300">{room._count.messages}</td>
                <td className="px-3 py-3 text-center">
                  <button
                    onClick={() => handleToggle(room.id)}
                    disabled={isPending}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${room.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-navy-700 text-slate-300"}`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {room.isActive ? "활성" : "비활성"}
                  </button>
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    onClick={() => handleDelete(room.id, room.name)}
                    disabled={isPending}
                    className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-mute">등록된 톡방이 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
