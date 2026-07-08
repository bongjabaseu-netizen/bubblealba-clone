"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Power, Trash2, X } from "lucide-react";
import { createBoard, updateBoard, deleteBoard } from "@/lib/actions/admin";

type Board = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  order: number;
  _count: { posts: number };
};

export function BoardsClient({ boards }: { boards: Board[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const result = await createBoard(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        form.reset();
        router.refresh();
      }
    });
  }

  function startEdit(board: Board) {
    setEditingId(board.id);
    setEditName(board.name);
    setEditDesc(board.description || "");
  }

  function handleSaveEdit(boardId: string, isActive: boolean) {
    const formData = new FormData();
    formData.set("name", editName);
    formData.set("description", editDesc);
    formData.set("isActive", String(isActive));
    startTransition(async () => {
      await updateBoard(boardId, formData);
      setEditingId(null);
      router.refresh();
    });
  }

  function handleToggleActive(board: Board) {
    const formData = new FormData();
    formData.set("name", board.name);
    formData.set("description", board.description || "");
    formData.set("isActive", String(!board.isActive));
    startTransition(async () => {
      await updateBoard(board.id, formData);
      router.refresh();
    });
  }

  function handleDelete(boardId: string, postCount: number) {
    if (postCount > 0) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteBoard(boardId);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* 새 게시판 추가 폼 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card p-5">
        <h2 className="text-[14px] font-bold text-white mb-4">새 게시판 추가</h2>
        <form onSubmit={handleCreate} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-mute mb-1.5">이름</label>
            <input
              name="name"
              required
              placeholder="게시판 이름"
              className="w-full h-9 px-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-mute mb-1.5">슬러그</label>
            <input
              name="slug"
              required
              placeholder="board-slug"
              className="w-full h-9 px-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none font-mono"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-mute mb-1.5">설명</label>
            <input
              name="description"
              placeholder="설명 (선택)"
              className="w-full h-9 px-3 rounded-lg bg-navy-850 border border-line text-[13px] text-slate-200 placeholder:text-mute focus:border-brand/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-4 rounded-lg bg-brand hover:bg-brand-soft text-navy-950 text-[13px] font-bold shadow-glow transition-colors disabled:opacity-50 shrink-0 inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            추가
          </button>
        </form>
        {error && (
          <p className="text-[13px] text-red-400 mt-3">{error}</p>
        )}
      </div>

      {/* 테이블 */}
      <div className="rounded-2xl bg-navy-850/90 border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
          <h2 className="text-[14px] font-bold text-white">게시판 목록</h2>
          <span className="text-[12px] text-mute">총 {boards.length}개</span>
        </div>
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="text-left text-mute text-[11px] tracking-wider border-b border-line/70">
              <th className="text-left px-5 py-2.5 font-semibold w-16">순서</th>
              <th className="text-left px-3 py-2.5 font-semibold">이름</th>
              <th className="text-left px-3 py-2.5 font-semibold">슬러그</th>
              <th className="text-left px-3 py-2.5 font-semibold">설명</th>
              <th className="text-right px-3 py-2.5 font-semibold">게시글수</th>
              <th className="text-center px-3 py-2.5 font-semibold">상태</th>
              <th className="text-center px-5 py-2.5 font-semibold w-28">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50 text-slate-300">
            {boards.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-mute">
                  게시판이 없습니다
                </td>
              </tr>
            ) : (
              boards.map((b) => (
                <tr key={b.id} className="hover:bg-navy-800/40">
                  <td className="px-5 py-3 text-mute">{b.order}</td>
                  <td className="px-3 py-3">
                    {editingId === b.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 px-2 rounded-md bg-navy-850 border border-line text-[13px] text-slate-200 w-full focus:border-brand/60 focus:outline-none"
                      />
                    ) : (
                      <span className="font-semibold text-white">{b.name}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-mute font-mono text-xs">{b.slug}</td>
                  <td className="px-3 py-3">
                    {editingId === b.id ? (
                      <input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="h-8 px-2 rounded-md bg-navy-850 border border-line text-[13px] text-slate-200 w-full focus:border-brand/60 focus:outline-none"
                      />
                    ) : (
                      <span className="text-mute">{b.description || "-"}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-300 tabular-nums">
                    {b._count.posts}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(b)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                        b.isActive
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-navy-700 text-slate-300 hover:bg-navy-800"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {b.isActive ? "활성" : "비활성"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {editingId === b.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(b.id, b.isActive)}
                            disabled={isPending}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-emerald-400 hover:bg-emerald-500/15 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-mute hover:bg-navy-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(b)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-300 hover:bg-navy-800 hover:text-brand transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id, b._count.posts)}
                            disabled={isPending || b._count.posts > 0}
                            title={b._count.posts > 0 ? `게시글 ${b._count.posts}개가 있어 삭제 불가` : "삭제"}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
