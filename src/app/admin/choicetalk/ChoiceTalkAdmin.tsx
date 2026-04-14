/** 관리자 초이스톡 — 톡방 CRUD 클라이언트 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">초이스톡 관리</h1>
          <p className="text-sm text-slate-500">{rooms.length}개 톡방</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
        >
          {showForm ? "취소" : "+ 톡방 추가"}
        </button>
      </div>

      {/* 생성 폼 */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">새 톡방 만들기</h2>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">톡방 이름 *</label>
              <input name="name" required className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="예: 갤럭시" />
            </div>
            <div>
              <label className="text-sm text-slate-600">슬러그 *</label>
              <input name="slug" required className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="예: galaxy (URL용 영문)" />
            </div>
            <div>
              <label className="text-sm text-slate-600">운영자 (광고주) *</label>
              <select name="ownerId" required className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="">선택</option>
                {advertisers.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nickname ?? a.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">로고 URL</label>
              <input name="logo" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="https://..." />
            </div>
          </div>
          <button type="submit" disabled={isPending} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {isPending ? "생성 중..." : "톡방 생성"}
          </button>
        </form>
      )}

      {/* 톡방 리스트 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">톡방</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">운영자</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">메시지</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">상태</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">작업</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500 shrink-0">
                      {room.logo ? <img src={room.logo} alt="" className="w-full h-full object-cover rounded-lg" /> : room.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{room.name}</div>
                      <div className="text-xs text-slate-400">/{room.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{room.owner?.nickname ?? room.owner?.email}</td>
                <td className="px-4 py-3 text-center text-slate-600">{room._count.messages}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(room.id)}
                    disabled={isPending}
                    className={`px-2 py-1 rounded text-xs font-medium ${room.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {room.isActive ? "활성" : "비활성"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(room.id, room.name)}
                    disabled={isPending}
                    className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">등록된 톡방이 없습니다</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
